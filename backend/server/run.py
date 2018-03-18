from flask import Flask, jsonify, request, render_template, abort, url_for
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from bubble import Bubble
import settings.flask_settings as local_settings
import settings.global_settings as global_settings
import logging
from assets.twitchapi import TwitchAPI
from assets.jwtworker import JWTworker

app = Flask(__name__, template_folder='frontend')
# app.config['SECRET_KEY']
socketio = SocketIO(app)
logger = logging.getLogger('flask_app')
bubble = Bubble(True)
TwitchAPI.generate_oauth()

# PRETTIFY CONFIG PAGE -- DONE
# GENERATE TOKEN FOR VIEW PAGE -- DONE
# LIMIT NUMBER OF TEXT CHOICES -- DONE
# ? TEXT CHOICE
# JWT TOKEN -- DONE
# ANIMATION FOR BUBBLE
# REVEAL LINK ON CONFIG -- DONE


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

# API part


@app.route("/")
def hello():
    return "Hello friend! Ask me something. I will never respond."


@app.route("/streamer/<streamer_id>/add", methods=['POST'])
@cross_origin(origin='localhost')
def add_text_to_streamer(streamer_id):
    auth_token = request.headers.get("Authorization")
    if (not JWTworker.verify_token(auth_token)):
        abort(401)

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
    auth_token = request.headers.get("Authorization")
    if (not JWTworker.verify_token(auth_token)):
        abort(401)

    text_id = int(request.json["text_id"])

    if (text_id is None):
        return jsonify(local_settings.RESPONSE_FAILURE)

    ok = bubble.remove_text_choice(streamer_id, text_id)
    if (ok):
        return jsonify(local_settings.RESPONSE_SUCCESS)
    else:
        return jsonify(local_settings.RESPONSE_FAILURE)


@app.route("/streamer/<streamer_id>/registered")
@cross_origin(origin='localhost')
def is_registered(streamer_id):
    auth_token = request.headers.get("Authorization")
    if (not JWTworker.verify_token(auth_token)):
        abort(401)

    streamer = bubble.find_streamer_by_id(streamer_id)

    if (streamer is not None):
        return jsonify(local_settings.RESPONSE_SUCCESS)
    else:
        return jsonify(local_settings.RESPONSE_FAILURE)


@app.route("/streamer/<streamer_id>/texts", methods=['GET'])
@cross_origin(origin='localhost')
def get_text_list(streamer_id):
    auth_token = request.headers.get("Authorization")
    if (not JWTworker.verify_token(auth_token, roles=["broadcaster", "viewer"])):
        abort(401)

    return jsonify({"buttons": bubble.get_streamer_texts(streamer_id)})


def verify_transaction():
    return True


@app.route("/streamer/<streamer_id>/register")
@cross_origin(origin='localhost')
def register(streamer_id):
    auth_token = request.headers.get("Authorization")
    if (not JWTworker.verify_token(auth_token)):
        abort(401)

    ok = bubble.add_streamer(streamer_id)

    if (ok):
        return jsonify(local_settings.RESPONSE_SUCCESS)
    else:
        return jsonify(local_settings.RESPONSE_FAILURE)


@app.route("/streamer/<streamer_id>/purchase", methods=['POST'])
@cross_origin(origin='localhost')
def transaction_complete(streamer_id):
    auth_token = request.headers.get("Authorization")
    if (not JWTworker.verify_token(auth_token, roles=["viewer"])):
        abort(401)

    if (not verify_transaction()):
        abort(403)

    text_id = request.json['text_id']

    ok = bubble.set_curr_text(streamer_id, text_id)
    if (ok):
        text = bubble.get_curr_text(streamer_id)
        socketio.emit("update", {'text': text}, room=streamer_id)
        return jsonify(local_settings.RESPONSE_SUCCESS)
    else:
        return jsonify(local_settings.RESPONSE_FAILURE)


@app.route("/streamer/<streamer_id>/url", methods=['GET'])
@cross_origin(origin='localhost')
def get_streamer_url(streamer_id):
    auth_token = request.headers.get("Authorization")
    if (not JWTworker.verify_token(auth_token, roles=["broadcaster"])):
        abort(401)

    token = bubble.get_token(streamer_id)
    if (token is None):
        return jsonify(local_settings.RESPONSE_FAILURE)

    url = url_for("display_bubble", streamer_id=streamer_id) + "?token=" + token
    return jsonify({"success": "true", "url": url})


# Display part


@app.route("/display/<streamer_id>")
def display_bubble(streamer_id):
    token = request.args.get('token')

    if (not bubble.verify_token(streamer_id, token)):
        abort(403)

    return render_template("bubble.html", streamer_id=streamer_id)


@socketio.on("sync")
def sync(data):
    if ('id' not in data.keys()):
        return

    streamer_id = str(data['id'])
    text = bubble.get_curr_text(streamer_id)

    print("Joined room" + streamer_id)
    join_room(str(streamer_id))

    if (text is not None):
        emit('update', {'text': text})
    else:
        emit('update', {'text': 'No text'})


if __name__ == '__main__':
    log_setup(app, logger)
    socketio.run(app)
