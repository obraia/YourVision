from flask_restx import Resource

from services.sam import SamService

class SamModelList(Resource):
    
    def get(self):
        models = SamService.get_models()
        return models, 200
