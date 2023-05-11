from sqlalchemy import desc
from infra.database.db import db
from models.image_properties import ImagePropertiesModel

class ImageModel(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(45), nullable=False)
    embedding = db.Column(db.String(45), nullable=False)
    properties_id = db.Column(db.Integer, db.ForeignKey('images_properties.id'), nullable=False)
    created_at = db.Column(db.Integer, nullable=False)
    properties = db.relationship(ImagePropertiesModel, lazy='subquery')

    def __init__(self, image, embedding, properties_id, created_at):
        self.image = image
        self.embedding = embedding
        self.properties_id = properties_id
        self.created_at = created_at

    def __repr__(self):
        return f'<Image {self.id}>'
    
    def to_json(self):
        return {
            'id': self.id,
            'image': self.image,
            'embedding': self.embedding,
            'properties_id': self.properties_id,
            'created_at': self.created_at,
            'properties': self.properties.to_json() if self.properties else None
        }
    
    @classmethod
    def find_by_id(cls, id):
        image = cls.query.filter_by(id=id).first()
        if image:
            return image
        return None
    
    @classmethod
    def find_by_properties_id(cls, properties_id):
        image = cls.query.filter_by(properties_id=properties_id).first()
        if image:
            return image
        return None
    
    @classmethod
    def find_all(cls):
        images = cls.query.order_by(desc(ImageModel.created_at)).all()
        if images:
            return images
        return None
    
    @classmethod
    def find_with_pagination(cls, page, per_page):
        result = (
            cls.query.order_by(ImageModel.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
        )
        
        if result:
            return result
        return None
    
    @classmethod
    def bulk_insert(cls, images):
        db.session.add_all(images)
        db.session.commit()

    def save(self):
        db.session.add(self)
        db.session.commit()
        db.session.refresh(self)
        return self.id

    def update(self, image, embedding, properties_id):
        self.image = image
        self.embedding = embedding
        self.properties_id = properties_id
        self.save()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    