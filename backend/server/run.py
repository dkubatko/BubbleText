from flask import Flask
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from bubble import Bubble
import settings.flask_settings as local_settings
import settings.global_settings as global_settings
import logging

app = Flask(__name__)
# app.config['SECRET_KEY']
socketio = SocketIO(app)
logger = logging.getLogger('flask_app')


def log_setup(app, logger):
    log_f = logging.FileHandler(local_settings.FLASK_LOG_FILE)
    log_s = logging.StreamHandler()

    if (global_settings.DEBUG):
        logger.setLevel(logging.DEBUG)
        log_f.setLevel(logging.DEBUG)
        log_s.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)

    # Set formatter for requests
    formatter = local_settings.RequestFormatter(local_settings.REQUEST_FORMAT)

    log_f.setFormatter(formatter)
    log_s.setFormatter(formatter)

    app.logger.addHandler(log_f)
    app.logger.addHandler(log_s)

    # Set formatter for info
    log_f_app = logging.FileHandler(local_settings.FLASK_LOG_FILE)
    log_s_app = logging.StreamHandler()

    formatter = logging.Formatter(local_settings.FLASK_APP_LOG_FORMAT)

    log_f_app.setFormatter(formatter)
    log_s_app.setFormatter(formatter)

    logger.addHandler(log_f_app)
    logger.addHandler(log_s_app)

    logger.info("Successfully set up logging")

# Set up main bubble object


def bubble_setup():
    return Bubble(True)


@app.route("/")
def hello():
    return "Hello world"


@app.route("/streamer/<id>/register")
def register_streamer(streamer_id):
    pass


@app.route("/streamer/<id>/product/<product_id>")
def product_purchase(streamer_id, product_id):
    pass


@app.route("/streamer/getId")
def get_id():
    return


@socketio.on("sync")
def sync(data):
    if (verify(data['key'])):
        join_room(data['streamer_id'])


if __name__ == '__main__':
    log_setup(app, logger)
    bubble_setup()
    socketio.run(app)
