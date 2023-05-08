from infra.database.db import db

class ImageModel(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(45), nullable=False)
    embedding = db.Column(db.String(45), nullable=False)
    properties_id = db.Column(db.Integer, db.ForeignKey('images_properties.id'), nullable=False)

    def __init__(self, image, embedding, properties_id):
        self.image = image
        self.embedding = embedding
        self.properties_id = properties_id

    def __repr__(self):
        return f'<Image {self.id}>'
    
    def json(self):
        return {
            'id': self.id,
            'image': self.image,
            'embedding': self.embedding,
            'properties_id': self.properties_id
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
        images = cls.query.all()
        if images:
            return images
        return None
    
    @classmethod
    def find_with_pagination(cls, page, per_page):
        images = cls.query.paginate(page, per_page, False)
        if images:
            return images
        return None
    
    @classmethod
    def bulk_insert(cls, images):
        db.session.bulk_save_objects(images, return_defaults=True)
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

    