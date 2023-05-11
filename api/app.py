import os
from flask import jsonify
from marshmallow import ValidationError

from controllers.image import Image, ImageList
from controllers.sd_model import SdModelList
from controllers.sd_sampler import SdSamplerList
from controllers.sd_inpaint import SdInpaint
from controllers.sd_text_to_image import SdTextToImage
from controllers.sam_model import SamModelList
from controllers.sam_embedding import SamEmbedding

from infra.database.ma import ma
from infra.database.db import db
from infra.server.instance import server

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

server.register_static('/embeddings/<path:path>', 'embeddings', EMBEDDING_FOLDER)
server.register_static('/images/<path:path>', 'images', IMAGE_FOLDER)

api.add_resource(Image, '/images/<int:id>')
api.add_resource(ImageList, '/images')
api.add_resource(SdModelList, '/sd/models')
api.add_resource(SdInpaint, '/sd/inpaint')
api.add_resource(SdTextToImage, '/sd/text-to-image')
api.add_resource(SdSamplerList, '/sd/samplers')
api.add_resource(SamEmbedding, '/sam/embedding')
api.add_resource(SamModelList, '/sam/models')

if __name__ == '__main__':
    ma.init_app(app)
    db.init_app(app)
    server.run()