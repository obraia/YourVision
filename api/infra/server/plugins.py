import importlib
import json
import os

plugins = []

def load_plugins():
    plugins.clear()
    plugins_dir = os.path.join(os.getcwd(), 'api', 'plugins')

    if not os.path.exists(plugins_dir):
        os.mkdir(plugins_dir)

    for plugin_path in os.listdir(plugins_dir):
        plugin_dir = os.path.join(plugins_dir, plugin_path)

        if not os.path.isdir(plugin_dir):
            continue

        setup_file = os.path.join(plugin_dir, 'setup.py')

        if not os.path.exists(setup_file):
            continue
        
        settings = json.load(open(os.path.join(plugin_dir, 'settings.json')))
        settings['icon'] = open(os.path.join(plugin_dir, settings['icon']), 'rb').read().decode('utf-8')
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
            'settings': settings,
            'handler': plugin_module.handler
        })

        print(f'Plugin {plugin_name} loaded')