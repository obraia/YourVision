from infra.database.ma import ma
from models.image_properties import ImagePropertiesModel

class ImagePropertiesModelSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ImagePropertiesModel
        load_instance = True
        fields = ('id', 'model', 'positive', 'negative', 'images', 'steps', 'cfg', 'width', 'height', 'sampler', 'seed')