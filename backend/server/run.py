from flask import Flask, jsonify, request, render_template
from flask.ext.cors import CORS, cross_origin
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from bubble import Bubble
import settings.flask_settings as local_settings
import settings.global_settings as global_settings
import logging

app = Flask(__name__, template_folder='frontend')
# app.config['SECRET_KEY']
socketio = SocketIO(app)
logger = logging.getLogger('flask_app')
bubble = Bubble(True)


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


@app.route("/")
def hello():
    return "Hello world"


@app.route("/streamer/<streamer_id>/register")
def register_streamer(streamer_id):
    pass


@app.route("/streamer/<streamer_id>/purchase/<product_id>")
def product_purchase(streamer_id, product_id):
    pass


@app.route("/streamer/<streamer_id>/texts", methods=['GET'])
@cross_origin(origin='localhost')
def get_text_list(streamer_id):
    return jsonify({"buttons": bubble.get_streamer_texts(streamer_id)})


@app.route("/streamer/<streamer_id>/add", methods=['POST'])
@cross_origin(origin='localhost')
def add_text_to_streamer(streamer_id):
    text = request.json["text"]
    if (text is None):
        return jsonify(local_settings.RESPONSE_FAILURE)

    ok = bubble.add_text_choice(streamer_id, text)
    if (ok):
        return jsonify(local_settings.RESPONSE_SUCCESS)
    else:
        return jsonify(local_settings.RESPONSE_FAILURE)

@app.route("/streamer/<streamer_id>/delete", methods=['POST'])
@cross_origin(origin='localhost')
def remove_text_from_streamer(streamer_id):
    text_id = int(request.json["text_id"])

    if (text_id is None):
        return jsonify(local_settings.RESPONSE_FAILURE)

    ok = bubble.remove_text_choice(streamer_id, text_id)
    if (ok):
        return jsonify(local_settings.RESPONSE_SUCCESS)
    else:
        return jsonify(local_settings.RESPONSE_FAILURE)

@app.route("/streamer/getId")
def get_id():
    return

@app.route("/display/<streamer_id>")
def display_bubble(streamer_id):
    return render_template("bubble.html", streamer_id=streamer_id)

@socketio.on("sync")
def sync(data):
    print("Sync request!")
    print(data)
    text = bubble.get_curr_text(data['id'])

    if (text is not None):
        emit('update', {'text':text})
    else:
        emit('update', {'text':'notext'})

if __name__ == '__main__':
    log_setup(app, logger)
    socketio.run(app)
