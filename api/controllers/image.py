import os
from flask_restx import Resource

from models.image import ImageModel
from schemas.image import ImageSchema

from infra.server.instance import server

socketio = server.socketio
image_ns = server.image_ns

image_schema = ImageSchema()
image_list_schema = ImageSchema(many=True)

STATIC_FOLDER = os.path.join(os.getcwd(), 'api', 'static')
IMAGE_FOLDER = os.path.join(STATIC_FOLDER, 'images')
EMBEDDING_FOLDER = os.path.join(STATIC_FOLDER, 'embeddings')

class Image(Resource):
    
    def get(self, id):
        image = ImageModel.find_by_id(id)
        if image:
            return image_schema.dump(image), 200
        return {'message': 'Image not found'}, 404
    
    def delete(self, id):
        image = ImageModel.find_by_id(id)
        
        if image:
            image.delete()
            return {'message': 'Image deleted'}, 200
        
        return {'message': 'Image not found'}, 404

class ImageList(Resource):
    
    def get(self):
        return image_list_schema.dump(ImageModel.find_all()), 200
