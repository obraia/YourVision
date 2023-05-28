import base64
from io import BytesIO
from PIL import Image, ImageOps

class PillowUtils:
    def from_base64(image: str):
        if image.startswith('data:image'):
            image = image.split(',')[1]
        return Image.open(BytesIO(base64.b64decode(image))).convert("RGB")

    def crop(image: Image, width: int, height: int):
        w, h = image.size
        x = int((w - width) / 2)
        y = int((h - height) / 2)
        a = x + width
        b = y + height
        return image.crop((x, y, a, b))

    def resize(image, width, height):
        image.thumbnail((width, height), Image.ANTIALIAS)
        new_image = Image.new('RGB', (width, height), (0, 0, 0))
        new_image.paste(image, (int((width - image.size[0]) / 2), int((height - image.size[1]) / 2)))
        return new_image

    def resize_start(image, width, height):
        image.thumbnail((width, height), Image.ANTIALIAS)
        new_image = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        new_image.paste(image, (0, 0))
        return new_image
    
    def resize_end(image, width, height):
        image.thumbnail((width, height), Image.ANTIALIAS)
        new_image = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        new_image.paste(image, (width - image.size[0], height - image.size[1]))
        return new_image

    def resize_cover(image, width, height):
        w, h = image.size
        background = Image.new('RGBA', (width, height), (0, 0, 0, 0))

        if w > h:
            proportion = w / h
            height = int(height * proportion)
        else:
            proportion = h / w
            width = int(width * proportion)

        image = image.resize((width, height), Image.ANTIALIAS)
        left = int((background.size[0] - image.size[0]) / 2)
        top = int((background.size[1] - image.size[1]) / 2)
        background.paste(image, (left, top))
        return background
    
    def resize_fill(image, width, height):
        w, h = image.size

        if w > h:
            proportion = h / w
            height = int(height * proportion)
        else:
            proportion = w / h
            width = int(width * proportion)

        return image.resize((width, height), Image.ANTIALIAS)

    def mask(image1, image2, mask):
        mask = ImageOps.invert(mask.convert('L'))
        output = Image.composite(image1, image2, mask)
        return output

    def proportion(image, width, height):
        w, h = image.size
        proportion = min(width / w, height / h)
        width = int(w * proportion)
        height = int(h * proportion)
        return (width, height)