import gc
import os
import json
from marshmallow import ValidationError
from flask import jsonify, request
import torch

from resources.image import Image, ImageList
from resources.sd_model import SdModelList
from resources.sd_sampler import SdSamplerList
from resources.sd_inpaint import SdInpaint
from resources.sd_pix2pix import SdPix2Pix
from resources.sd_txt2img import SdTxt2Img
from resources.sd_img2img import SdImg2Img
from resources.sam_model import SamModelList
from resources.sam_embedding import SamEmbedding
from resources.plugin import PluginList

from infra.database.ma import ma
from infra.database.db import db
from infra.server.instance import server
from infra.server.plugins import load_plugins, plugins

STATIC_FOLDER = os.path.join(os.getcwd(), 'api', 'static')
IMAGE_FOLDER = os.path.join(STATIC_FOLDER, 'images')
EMBEDDING_FOLDER = os.path.join(STATIC_FOLDER, 'embeddings')

api = server.api
app = server.app

@app.before_request
def create_tables():
    db.create_all()

@app.errorhandler(ValidationError)
def handle_marshmallow_validation(err):
    return jsonify(err.messages), 400

# catch all other exceptions
@app.errorhandler(Exception)
def handle_exception(err):
    torch.cuda.empty_cache()
    gc.collect()
    print(err)
    return jsonify({'message': str(err)}), 500

server.register_static('/embeddings/<path:path>', 'embeddings', EMBEDDING_FOLDER)
server.register_static('/images/<path:path>', 'images', IMAGE_FOLDER)

api.add_resource(Image, '/images/<int:id>')
api.add_resource(ImageList, '/images')
api.add_resource(SdModelList, '/sd/models')
api.add_resource(SdInpaint, '/sd/inpaint')
api.add_resource(SdTxt2Img, '/sd/txt2img')
api.add_resource(SdPix2Pix, '/sd/pix2pix')
api.add_resource(SdImg2Img, '/sd/img2img')
api.add_resource(SdSamplerList, '/sd/samplers')
api.add_resource(SamEmbedding, '/sam/embedding')
api.add_resource(SamModelList, '/sam/models')
api.add_resource(PluginList, '/plugins')

@app.before_request
def run_plugins_before_and_override():
    method = request.method

    if(method != 'POST'):
        return

    body = request.get_json()
    plugins_data = body.get('plugins', [])

    if plugins_data.count == 0:
        return
    
    before_plugins = [x for x in plugins_data if x.get('type') == 'before']
    override_plugins = [x for x in plugins_data if x.get('type') == 'override']

    for plugin in before_plugins:
        plugin_name = plugin.get('name')
        plugin_properties = plugin.get('properties')
        plugin = next((x for x in plugins if x['name'] == plugin_name), None)

        print(f'Running plugin {plugin_name}')

        body = plugin['handler'](body, plugin_properties)

    request.data = json.dumps(body)
    
    for plugin in override_plugins:
        plugin_name = plugin.get('name')
        plugin_properties = plugin.get('properties')
        plugin = next((x for x in plugins if x['name'] == plugin_name), None)

        print(f'Running plugin {plugin_name}')

        return plugin['handler'](body, plugin_properties)

@app.after_request
def run_plugins_after(response):
    method = request.method

    if(method != 'POST'):
        return response
    
    body = request.get_json()
    plugins_data = body.get('plugins', [])
    response_data = response.get_json()

    if plugins_data.count == 0:
        return

    for plugin in plugins_data:
        plugin_type = plugin.get('type')

        if plugin_type != 'after':
            continue

        plugin_name = plugin.get('name')
        plugin_properties = plugin.get('properties')
        plugin = next((x for x in plugins if x['name'] == plugin_name), None)

        print(f'Running plugin {plugin_name}')

        response_data = plugin['handler'](response_data, plugin_properties)

    response.data = json.dumps(response_data)

    return response

if __name__ == '__main__':
    ma.init_app(app)
    db.init_app(app)
    load_plugins()
    server.run()