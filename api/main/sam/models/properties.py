class PropertiesModel:
    
    def __init__(self, form):
        self.model = form['model']
        self.positive = form['positive']
        self.negative = form['negative']
        self.images = int(form['images'])
        self.steps = int(form['steps'])
        self.cfg = float(form['cfg'])
        self.width = int(form['width'])
        self.height = int(form['height'])
        self.sampler = form['sampler']
        self.seed = int(form['seed'])

    def __str__(self):
        return f'InpaintModel({self.positive}, {self.negative}, {self.model}, {self.images}, {self.steps}, {self.cfg}, {self.width}, {self.height}, {self.sampler}, {self.seed})'
    