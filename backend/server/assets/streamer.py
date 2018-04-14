import settings.global_settings as global_settings
import settings.streamer_settings as local_settings
from assets.config import Config
from assets.twitchapi import TwitchAPI
from assets.tokens import Tokens
from assets.display import Display
import logging


class Streamer:
    logger = None

    # String
    streamer_id = None
    # String
    display_name = None
    # String
    curr_text_id = None
    # String
    curr_animation_id = None
    # String
    curr_bubble_id = None
    # String
    curr_buyer_id = None
    # Config object
    config = None
    # String token to access view page
    token = None

    # In memory vars
    room_name = None

    def __init__(self, streamer_id, display_name="", display=None,
                 config=None, token=""):
        self._log_setup()

        # initialize all fields
        self.streamer_id = streamer_id

        if (display_name == "" or display_name is None):
            self.display_name = Streamer.get_display_name(self.streamer_id)
        else:
            self.display_name = display_name

        if (config is None):
            self.config = Config.default()
        else:
            self.config = Config(config)

        if (display is None):
            self.display = Display.default(self.config)
        else:
            self.display = Display(display, self.config)

        if (token == ""):
            self.token = Tokens.generate_token()
            self.logger.info(local_settings.LOG_TOKEN_GENERATED.format(
                self.token, self.streamer_id))
        else:
            self.token = token

        # socketio room name
        self.room_name = streamer_id

        self.logger.info(
            local_settings.LOG_STREAMER_CREATED.format(streamer_id))

    def _log_setup(self):
        self.logger = logging.getLogger('main.streamer')

    # Gets streamer's display name
    @classmethod
    def get_display_name(cls, channel_id):
        result = TwitchAPI.get_streamer_info(channel_id)

        if (result is None or result.get("display_name") is None):
            return ""

        return result["display_name"]

    # Update curr display from display
    def update_display(self, display):
        self.display.update(display)

    # Update choices from config
    def update_config(self, config):
        self.config.update(config)

    # Get current display data
    def get_curr_display(self):
        return self.display.to_json()

    def get_config(self):
        return self.config.to_json()

    def to_json(self):
        return {
            "streamer_id": self.streamer_id,
            "display_name": self.display_name,
            "display": self.display.to_json(),
            "config": self.config.to_json(),
            "token": self.token,
        }
