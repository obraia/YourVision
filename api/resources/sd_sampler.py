from flask_restx import Resource

from utils.stable_diffusion import StableDiffusion

class SdSamplerList(Resource):
    
    def get(self):
        samplers = StableDiffusion.get_samplers()
        return samplers, 200