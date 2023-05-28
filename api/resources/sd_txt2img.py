import os
from flask import request
from flask_restx import Resource, fields
import numpy as np
import torch

from utils.cv2 import Cv2Utils
from utils.pillow import PillowUtils
from utils.time import TimeUtils
from utils.stable_diffusion import StableDiffusion

from models.image import ImageModel
from schemas.image import ImageSchema
from schemas.image_properties import ImagePropertiesSchema

from infra.server.instance import server

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

item = image_ns.model('text_to_image', {
  'properties': fields.Nested(properties, required=True, description='Properties')
})

STATIC_FOLDER = os.path.join(os.getcwd(), 'api', 'static')
IMAGE_FOLDER = os.path.join(STATIC_FOLDER, 'images')
EMBEDDING_FOLDER = os.path.join(STATIC_FOLDER, 'embeddings')

WEIGHTS_FOLDER = os.path.join(os.getcwd(), 'api', 'weights')
SD_WEIGHTS_FOLDER = os.path.join(WEIGHTS_FOLDER, 'sd', 'diffusers')

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class SdTxt2Img(Resource):
    
    @image_ns.expect(item, validate=True)
    @image_ns.doc('Generate an image from text')
    def post(self):
        data = request.get_json()
        properties = image_properties_schema.load(data.get("properties"))
        stable_diffusion = StableDiffusion(SD_WEIGHTS_FOLDER, DEVICE)
        outputs = stable_diffusion.txt2img(properties, lambda data: socketio.emit('progress', data))

        generate_embedding = data.get("generate_embedding")
        timestamp = TimeUtils.timestamp()
        properties_id = properties.save()
        images = []

        for i, output in enumerate(outputs):
            if generate_embedding:
              embedding = SamService.generate_embedding(Cv2Utils.from_pil(output))
              embedding_name = f'{timestamp}_{i + 1}.npy'
              np.save(os.path.join(EMBEDDING_FOLDER, embedding_name), embedding)
            else:
              embedding_name = 'empty'

            image_name = f'{timestamp}_{i + 1}.png'

            image_json = {
                'image': image_name,
                'embedding': embedding_name,
                'properties_id': properties_id,
                'created_at': timestamp,
            }

            output.save(os.path.join(IMAGE_FOLDER, image_name))
            image_data = image_schema.load(image_json)
            images.append(image_data)

        ImageModel.bulk_insert(images)

        images = [image.to_json() for image in images]

        return image_list_schema.dump(images), 201