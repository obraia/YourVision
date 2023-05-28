import os
from flask import Flask, Blueprint, send_from_directory
from flask_socketio import SocketIO
from flask_restx import Api
from flask_cors import CORS

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

    def set_plugins(self, plugins):
        self.plugins = plugins

    def run(self):
        CORS(self.app, resources={r"/*":{"origins":"*"}})
        self.socketio.run(self.app, debug=True, host='0.0.0.0')

server = Server()