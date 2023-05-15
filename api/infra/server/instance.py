import os
import json
import importlib
from flask import Flask, Blueprint, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_restx import Api

class Server:
    def __init__(self):
        self.app = Flask(__name__)
        self.blueprint = Blueprint('api', __name__, url_prefix='/api')
        self.api = Api(self.blueprint, doc='/docs', title='YourVision API')
        self.app.register_blueprint(self.blueprint)
        self.socketio = SocketIO(self.app, cors_allowed_origins='*')

        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.getcwd(), 'api', 'infra', 'database', 'data.db')
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.app.config['PROPAGATE_EXCEPTIONS'] = True

        self.image_ns = self.image_ns()
        self.model_ns = self.model_ns()
        self.sam_embedding_ns = self.sam_embedding_ns()

        self.plugins = self.load_plugins()

    def image_ns(self):
        return self.api.namespace('image', description='Image operations', path='/')

    def model_ns(self):
        return self.api.namespace('model', description='Model operations', path='/')

    def sam_embedding_ns(self):
        return self.api.namespace('sam_embedding', description='SAM embedding operations', path='/')

    def register(self, routes):
        for route in routes:
            self.app.add_url_rule(
                route.path, 
                route.name, 
                route.handler, 
                methods=route.methods
            )
        
        self.socketio.on_event('connect', lambda: print('Client connected'))

    def register_static(self, path, rule, directory):
        path = '/api/static' + path
        self.app.add_url_rule(path, rule, lambda path: send_from_directory(directory, path))

    def register_socket(self, event, handler):
        self.socketio.on_event(event, handler)

    def load_plugins(self):
        plugins_dir = os.path.join(os.getcwd(), 'api', 'plugins')

        if not os.path.exists(plugins_dir):
            os.mkdir(plugins_dir)

        plugins = []

        for plugin_path in os.listdir(plugins_dir):
            plugin_dir = os.path.join(plugins_dir, plugin_path)

            if not os.path.isdir(plugin_dir):
                continue

            setup_file = os.path.join(plugin_dir, 'setup.py')

            if not os.path.exists(setup_file):
                continue
            
            settings = json.load(open(os.path.join(plugin_dir, 'settings.json')))
            plugin_name = settings['name']
            plugin_type = settings['type']

            print(f'Loading plugin {plugin_name}')

            os.system(f'python {setup_file}')

            plugin_setup = importlib.import_module(f'plugins.{plugin_path}.setup')
            plugin_setup.setup()

            plugin_module = importlib.import_module(f'plugins.{plugin_path}.main')
            
            plugins.append({
                'name': plugin_name,
                'type': plugin_type,
                'handler': plugin_module.handler
            })

            print(f'Plugin {plugin_name} loaded')

        return plugins

    def run(self):
        CORS(self.app, resources={r"/*":{"origins":"*"}})
        self.socketio.run(self.app, debug=True, host='0.0.0.0')

server = Server()