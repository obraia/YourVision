import os
from flask import request
from flask_restx import Resource, fields
from utils.image import ImageUtils
from utils.time import TimeUtils

from models.image import ImageModel
from schemas.image import ImageSchema
from schemas.image_properties import ImagePropertiesSchema

from infra.server.instance import server

from services.sd import SdService
from services.sam import SamService

socketio = server.socketio
image_ns = server.image_ns

image_schema = ImageSchema()
image_list_schema = ImageSchema(many=True)
image_properties_schema = ImagePropertiesSchema()

properties = image_ns.model('properties', {
    'model': fields.String(required=True, description='Model name'),
    'positive': fields.String(required=True, description='Positive prompt'),
    'negative': fields.String(required=False, description='Negative prompt'),
    'images': fields.Integer(required=True, description='Number of images'),
    'steps': fields.Integer(required=True, description='Number of steps'),
    'cfg': fields.Float(required=True, description='Configuration'),
    'width': fields.Integer(required=True, description='Image width'),
    'height': fields.Integer(required=True, description='Image height'),
    'sampler': fields.String(required=True, description='Sampler'),
    'seed': fields.Integer(required=True, description='Seed')
})

item = image_ns.model('image_to_image', {
  'image': fields.String(required=True, description='Image base64'),
  'properties': fields.Nested(properties, required=True, description='Properties')
})

STATIC_FOLDER = os.path.join(os.getcwd(), 'api', 'static')
IMAGE_FOLDER = os.path.join(STATIC_FOLDER, 'images')
EMBEDDING_FOLDER = os.path.join(STATIC_FOLDER, 'embeddings')

class SdImageToImage(Resource):
    
    @image_ns.expect(item, validate=True)
    @image_ns.doc('Inpaint an image')
    def post(self):
        data = request.get_json()
        image = ImageUtils.from_base64(data.get("image"))
        mask = ImageUtils.from_base64(data.get("mask"))
        properties = image_properties_schema.load(data.get("properties"))
        outputs = SdService.inpaint(image, mask, properties, lambda data: socketio.emit('progress', data))

        timestamp = TimeUtils.timestamp()
        properties_id = properties.save()
        images = []

        for i, output in enumerate(outputs):
            image_name = f'{timestamp}_{i + 1}.png'

            image_json = {
                'image': image_name,
                'embedding': None,
                'properties_id': properties_id,
                'created_at': timestamp,
            }

            output.save(os.path.join(IMAGE_FOLDER, image_name))
            image_data = image_schema.load(image_json)
            images.append(image_data)

        ImageModel.bulk_insert(images)

        images = [image.to_json() for image in images]

        return image_list_schema.dump(images), 201