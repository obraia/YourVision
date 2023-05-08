import base64
import cv2
import numpy as np

class Cv2Utils:
  def from_base64(image: str):
      if image.startswith('data:image'):
          image = image.split(',')[1]
      nparr = np.fromstring(base64.b64decode(image), np.uint8)
      return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
  
  def from_pil(image):
      return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)