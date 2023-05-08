import os
from flask import request
from flask_restx import Resource, fields
import numpy as np
from utils.cv2 import Cv2Utils
from utils.time import TimeUtils

from schemas.image import ImageSchema
from schemas.image_properties import ImagePropertiesModelSchema

from infra.server.instance import server

from services.sam import SamService

STATIC_FOLDER = os.path.join(os.getcwd(), 'api', 'static')
EMBEDDING_FOLDER = os.path.join(STATIC_FOLDER, 'embeddings')

socketio = server.socketio
sam_embedding_ns = server.sam_embedding_ns

image_schema = ImageSchema()
image_list_schema = ImageSchema(many=True)
image_properties_schema = ImagePropertiesModelSchema()

item = sam_embedding_ns.model('sam_embedding', {
  'image': fields.String(required=True, description='Image base64'),
})

class SamEmbedding(Resource):
    
    @sam_embedding_ns.expect(item, validate=True)
    @sam_embedding_ns.doc('Generate an embedding')
    def post(self):
        data = request.get_json()
        image = Cv2Utils.from_base64(data.get("image"))
        embedding = SamService.generate_embedding(image)
        filename = f'{TimeUtils.timestamp()}.npy'
        np.save(os.path.join(EMBEDDING_FOLDER, filename), embedding)
        return { 'embedding': filename }, 201