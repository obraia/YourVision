import os
import json
from flask_restx import Resource
from infra.server.instance import server

PLUGINS_FOLDER = os.path.join(os.getcwd(), 'api', 'plugins')

class PluginList(Resource):
    
    def get(self):
        plugins = []

        # Read all settings.json files from plugins folder
        for plugin in os.listdir(PLUGINS_FOLDER):
            plugin_path = os.path.join(PLUGINS_FOLDER, plugin)

            if os.path.isdir(plugin_path):
                settings = json.load(open(os.path.join(plugin_path, 'settings.json')))
                settings['icon'] = open(os.path.join(plugin_path, settings['icon']), 'rb').read().decode('utf-8')
                plugins.append(settings)

        return { 'plugins': plugins }, 200