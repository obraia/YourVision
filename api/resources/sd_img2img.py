import os
from flask import request
from flask_restx import Resource, fields
import torch

from utils.stable_diffusion import StableDiffusion
from utils.pillow import PillowUtils
from utils.time import TimeUtils

from models.image import ImageModel
from schemas.image import ImageSchema
from schemas.image_properties import ImagePropertiesSchema

from infra.server.instance import server

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

WEIGHTS_FOLDER = os.path.join(os.getcwd(), 'api', 'weights')
SD_WEIGHTS_FOLDER = os.path.join(WEIGHTS_FOLDER, 'sd', 'diffusers')

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class SdImg2Img(Resource):
    
    @image_ns.expect(item, validate=True)
    @image_ns.doc('Change an image')
    def post(self):
        data = request.get_json()
        image = PillowUtils.from_base64(data.get("image"))
        properties = image_properties_schema.load(data.get("properties"))
        stable_diffusion = StableDiffusion(SD_WEIGHTS_FOLDER, DEVICE)
        outputs = stable_diffusion.img2img(image, properties, lambda data: socketio.emit('progress', data))

        timestamp = TimeUtils.timestamp()
        properties_id = properties.save()
        images = []

        for i, output in enumerate(outputs):
            image_name = f'{timestamp}_{i + 1}.png'

            image_json = {
                'image': image_name,
                'embedding': 'empty',
                'properties_id': properties_id,
                'created_at': timestamp,
            }

            output.save(os.path.join(IMAGE_FOLDER, image_name))
            image_data = image_schema.load(image_json)
            images.append(image_data)

        ImageModel.bulk_insert(images)

        images = [image.to_json() for image in images]

        return image_list_schema.dump(images), 201