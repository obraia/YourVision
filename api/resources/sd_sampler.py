from flask_restx import Resource

from services.sd import SdService

class SdSamplerList(Resource):
    
    def get(self):
        samplers = SdService.get_samplers()
        return samplers, 200