import gc
import os
import torch
from segment_anything import SamPredictor, sam_model_registry

class SamService:
  device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
  checkpoint_dir = "api/weights/sam"

  def load_model(model, model_type):
      checkpoint = os.path.join(SamService.checkpoint_dir, model)
      model = sam_model_registry[model_type](checkpoint=checkpoint)
      model.to(SamService.device)
      predictor = SamPredictor(model)
      return predictor

  def generate_embedding(image):
      predictor = SamService.load_model("sam_vit_l_0b3195.pth", "vit_l")
      predictor.set_image(image)
      embedding = predictor.get_image_embedding().cpu().numpy()

      # optimizer after inference
      del predictor
      gc.collect()
      
      if torch.cuda.is_available():
          torch.cuda.empty_cache()
          torch.cuda.ipc_collect()

      return embedding