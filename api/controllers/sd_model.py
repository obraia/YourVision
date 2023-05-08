from flask_restx import Resource

from infra.server.instance import server
from services.sd import SdService

model_ns = server.model_ns

class SdModelList(Resource):
    
    def get(self):
        models = SdService.get_models()
        return models, 200