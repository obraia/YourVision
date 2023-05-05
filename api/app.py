import os
import cv2
import numpy as np
from PIL import Image
from urllib.parse import urlparse
from flask import Flask, request, send_from_directory, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from dotenv import load_dotenv
from utils.time import TimeUtils
from utils.filesystem import FilesystemUtils
from main.sam.services.sam import SamService
from main.sd.services.sd import SdService
from main.sd.models.properties import PropertiesModel

STATIC_FOLDER = os.path.join(os.getcwd(), 'api', 'static')
IMAGE_FOLDER = os.path.join(STATIC_FOLDER, 'images')
EMBEDDING_FOLDER = os.path.join(STATIC_FOLDER, 'embeddings')
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

FilesystemUtils.mkdir(IMAGE_FOLDER)
FilesystemUtils.mkdir(EMBEDDING_FOLDER)

load_dotenv('.env')

app = Flask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})

socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/static/embeddings/<path:path>')
def send_embeddings(path):
    return send_from_directory(EMBEDDING_FOLDER, path, as_attachment=True)

@app.route('/static/images/<path:path>')
def send_images(path):
    return send_from_directory(IMAGE_FOLDER, path)

@app.post('/sam/generate-embedding')
def generate_embedding():
    imageStr = request.files.get("image").read()
    image = cv2.imdecode(np.frombuffer(imageStr, np.uint8), cv2.IMREAD_COLOR)
    embedding = SamService.generate_embedding(image)
    filename = f'{TimeUtils.timestamp()}.npy'
    np.save(os.path.join(EMBEDDING_FOLDER, filename), embedding)

    url = urlparse(request.base_url)
    base_url = f'{url.scheme}://{url.netloc}/static/embeddings'
    
    return {
        'embedding': f'{base_url}/{filename}'
    }

@app.post('/sd/inpaint')
def inpaint_image():
    properties = PropertiesModel(request.form)
    image = Image.open(request.files.get("image"))
    mask = Image.open(request.files.get("mask"))
    outputs = SdService.inpaint(properties, image, mask, lambda data: socketio.emit('progress', data))

    timestamp = TimeUtils.timestamp()
    image_in = f'{timestamp}_in.png'
    image_mask = f'{timestamp}_mask.png'

    image.save(os.path.join(IMAGE_FOLDER, image_in))
    mask.save(os.path.join(IMAGE_FOLDER, image_mask))

    url = urlparse(request.base_url)
    base_url = f'{url.scheme}://{url.netloc}/static/images'
    outputs_urls = []

    for i, output in enumerate(outputs):
        filename = '{}_out_{}.png'.format(timestamp, i + 1)
        output.save(os.path.join(IMAGE_FOLDER, filename))
        outputs_urls.append(f'{base_url}/{filename}')

    return {
        'image': f'{base_url}/{image_in}',
        'mask': f'{base_url}/{image_mask}',
        'outputs': outputs_urls,
    }

@app.get('/sd/models')
def get_sd_models():
    return jsonify(SdService.get_models())
    
@app.get('/sd/samplers')
def get_sd_samplers():
    return jsonify(SdService.get_samplers())
    
socketio.run(app, host='0.0.0.0', port=5000, debug=True)