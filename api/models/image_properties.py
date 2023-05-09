from infra.database.db import db

class ImagePropertiesModel(db.Model):
    __tablename__ = 'images_properties'

    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String(125), nullable=False)
    positive = db.Column(db.String(255), nullable=False)
    negative = db.Column(db.String(255), nullable=False)
    images = db.Column(db.Integer, nullable=False)
    steps = db.Column(db.Integer, nullable=False)
    cfg = db.Column(db.Float, nullable=False)
    width = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False)
    sampler = db.Column(db.String(45), nullable=False)
    seed = db.Column(db.Integer, nullable=False)

    def __init__(self, model, positive, negative, images, steps, cfg, width, height, sampler, seed):
        self.model = model
        self.positive = positive
        self.negative = negative
        self.images = images
        self.steps = steps
        self.cfg = cfg
        self.width = width
        self.height = height
        self.sampler = sampler
        self.seed = seed
    
    def __repr__(self):
        return f'<ImagePropertiesModel {self.id}>'
    
    def to_json(self):
        return {
            'id': self.id,
            'model': self.model,
            'positive': self.positive,
            'negative': self.negative,
            'images': self.images,
            'steps': self.steps,
            'cfg': self.cfg,
            'width': self.width,
            'height': self.height,
            'sampler': self.sampler,
            'seed': self.seed
        }
    
    @classmethod
    def find_by_id(cls, id):
        properties = cls.query.filter_by(id=id).first()
        if properties:
            return properties
        return None
    
    @classmethod
    def find_all(cls):
        properties = cls.query.all()
        if properties:
            return properties
        return None
    
    @classmethod
    def find_with_pagination(cls, page, per_page):
        properties = cls.query.paginate(page, per_page, False)
        if properties:
            return properties
        return None
    
    def save(self):
        db.session.add(self)
        db.session.commit()
        db.session.refresh(self)
        return self.id

    def update(self, model, positive, negative, images, steps, cfg, width, height, sampler, seed):
        self.model = model
        self.positive = positive
        self.negative = negative
        self.images = images
        self.steps = steps
        self.cfg = cfg
        self.width = width
        self.height = height
        self.sampler = sampler
        self.seed = seed

        self.save()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
