import base64
from io import BytesIO
from PIL import Image, ImageOps

class ImageUtils:
  def from_base64(image: str):
      if image.startswith('data:image'):
          image = image.split(',')[1]
      return Image.open(BytesIO(base64.b64decode(image)))

  def crop(image: Image, width: int, height: int):
      w, h = image.size
      x = int((w - width) / 2)
      y = int((h - height) / 2)
      a = x + width
      b = y + height
      return image.crop((x, y, a, b))

  def resize(image, width, height):
      image.thumbnail((width, height), Image.ANTIALIAS)
      new_image = Image.new('RGBA', (width, height), (0, 0, 0, 0))
      new_image.paste(image, (int((width - image.size[0]) / 2), int((height - image.size[1]) / 2)))
      return new_image

  def mask(image1, image2, mask):
      mask = ImageOps.invert(mask.convert('L'))
      output = Image.composite(image1, image2, mask)
      return output

  def proportion(image, width, height):
      w, h = image.size
      if w > h:
          proportion = h / w
          height = int(height * proportion)
      else:
          proportion = w / h
          width = int(width * proportion)
      return (width, height)