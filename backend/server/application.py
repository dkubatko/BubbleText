from flask import Flask, jsonify, request, render_template, abort, url_for, send_from_directory
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from bubble import Bubble
from functools import wraps
import settings.flask_settings as local_settings
import settings.global_settings as global_settings
import logging
from assets.streamer import Streamer
from assets.twitchapi import TwitchAPI
from assets.jwtworker import JWTworker
from assets.profanity_filter import ProfanityFilter

application = Flask(__name__, template_folder='frontend', static_url_path="")
# application.config['SECRET_KEY']
socketio = SocketIO(application)
logger = logging.getLogger('flask_app')
TwitchAPI.generate_oauth()
bubble = Bubble(True)

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

    application.logger.addHandler(log_f)
    application.logger.addHandler(log_s)

    # Set formatter for info
    log_f_app = logging.FileHandler(local_settings.FLASK_LOG_FILE)
    log_s_app = logging.StreamHandler()

    formatter = logging.Formatter(local_settings.FLASK_APP_LOG_FORMAT)

    log_f_app.setFormatter(formatter)
    log_s_app.setFormatter(formatter)

    logger.addHandler(log_f_app)
    logger.addHandler(log_s_app)

    logger.info("Successfully set up logging")

# Decorator for checking JWT tokens in request
def jwt(roles = ["broadcaster", "viewer"]):
    def jwt_decorator(func):
        @wraps(func)
        def decorated_route(*args, **kwargs):
            auth_token = request.headers.get("Authorization")
            if (not JWTworker.verify_token(auth_token, roles = roles)):
                abort(401)
            return func(*args, **kwargs)
        return decorated_route
    return jwt_decorator



# API part


@application.route("/")
def hello():
    return "Hello friend! Ask me something. I will never respond."


@application.route("/api/streamer/<streamer_id>/save_config", methods=['POST'])
@cross_origin(origin='localhost')
@jwt(roles = ["broadcaster"])
def save_config(streamer_id):
    if (not request.data):
        return jsonify(local_settings.RESPONSE_FAILURE)

    config = request.json.get("data")

    if (config is None):
        return jsonify(local_settings.RESPONSE_FAILURE)

    ok, error = bubble.update_streamer_config(streamer_id, config)

    if (ok):
        config = bubble.get_streamer_config(streamer_id)

        if (config["registered"]):
            token = bubble.get_streamer_token(streamer_id)

            if (token is not None):
                url = url_for("display_bubble", streamer_id=streamer_id) + \
                    "?token=" + token
                config["link"] = url
            else:
                config["link"] = ""

        return jsonify({"success": True, "data": config})
    else:
        resp = local_settings.RESPONSE_FAILURE
        resp["error"] = error
        return jsonify(resp)


@application.route("/api/streamer/<streamer_id>/get_config", methods=['GET'])
@cross_origin(origin='localhost')
@jwt(roles = ["broadcaster", "viewer"])
def get_config(streamer_id):
    config = bubble.get_streamer_config(streamer_id)

    if (config["registered"]):
        token = bubble.get_streamer_token(streamer_id)

        if (token is not None):
            url = url_for("display_bubble", streamer_id=streamer_id) + \
                "?token=" + token
            config["link"] = url
        else:
            config["link"] = ""

    return jsonify(config)


def verify_transaction():
    return True


@application.route("/api/streamer/<streamer_id>/purchase", methods=['POST'])
@cross_origin(origin='localhost')
@jwt(roles = ["viewer"])
def transaction_complete(streamer_id):
    if (not verify_transaction()):
        abort(403)

    if (not request.data):
        return jsonify(local_settings.RESPONSE_FAILURE)

    data = request.json.get('data')

    ok, error = bubble.update_streamer_display(streamer_id, data)

    if (ok):
        data["buyer_display_name"] = Streamer.get_display_name(
            data["buyer_id"])
        socketio.emit("update", {'data': data}, room=streamer_id)
        return jsonify(local_settings.RESPONSE_SUCCESS)
    else:
        resp = local_settings.RESPONSE_FAILURE
        resp["error"] = error
        return jsonify(resp)


# Display part


@application.route("/display/<streamer_id>")
def display_bubble(streamer_id):
    token = request.args.get('token')

    if (not bubble.verify_token(streamer_id, token)):
        abort(403)

    return render_template("widget.html", streamerId=streamer_id)


@application.route("/static/<path:path>")
def send_styles(path):
    return send_from_directory('static', path)


@socketio.on("sync")
def sync(data):
    if ('id' not in data.keys()):
        return

    streamer_id = str(data['id'])
    data = bubble.get_streamer_display(streamer_id)

    data["buyer_display_name"] = Streamer.get_display_name(data["buyer_id"])

    # join socketio room to recieve updates
    join_room(str(streamer_id))

    # emit first update
    emit('update', {'data': data})

    # return config datar
    return bubble.get_streamer_config(streamer_id)


if __name__ == '__main__':
    log_setup(application, logger)
    socketio.run(application)
