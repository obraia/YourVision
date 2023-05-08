from infra.database.ma import ma
from models.image import ImageModel

class ImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ImageModel
        load_instance = True
        fields = ('id', 'image', 'embedding', 'properties_id')