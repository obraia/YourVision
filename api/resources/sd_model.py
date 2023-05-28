import os
from flask_restx import Resource
import torch

from infra.server.instance import server
from utils.stable_diffusion import StableDiffusion

model_ns = server.model_ns

SD_WEIGHTS_FOLDER = os.path.join(os.getcwd(), 'api', 'weights', 'sd', 'diffusers')
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class SdModelList(Resource):
    
    def get(self):
        stable_diffusion = StableDiffusion(SD_WEIGHTS_FOLDER, DEVICE)
        models = stable_diffusion.get_models()
        return models, 200