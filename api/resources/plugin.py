from flask import request
from flask_restx import Resource
from infra.server.plugins import load_plugins, plugins

class PluginList(Resource):
    
    def get(self):
        reload = request.args.get('reload', False, type=bool)

        if reload:
            load_plugins()

        plugins_data = []

        for plugin in plugins:
            plugins_data.append(plugin['settings'])
        
        plugins_data.sort(key=lambda plugin: plugin['name'])

        return { 'plugins': plugins_data }, 200