import settings.global_settings as global_settings
import settings.streamer_settings as local_settings
from assets.config import Config
from assets.twitchapi import TwitchAPI
from assets.tokens import Tokens
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

    def __init__(self, streamer_id, display_name="", curr_text_id="-1",
                 curr_animation_id="-1", curr_bubble_id="-1", curr_buyer_id="-1",
                 config=None, token=""):
        self._log_setup()

        # initialize all fields
        self.streamer_id = streamer_id

        if (display_name == "" or display_name is None):
            self.display_name = Streamer.get_display_name(self.streamer_id)

        self.curr_text_id = curr_text_id
        self.curr_animation_id = curr_animation_id
        self.curr_bubble_id = curr_bubble_id
        self.curr_buyer_id = curr_buyer_id

        if (config is None):
            self.config = Config.default()
        else:
            self.config = Config(config)

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

    # Find text by id and set it to curr
    def set_curr_text_id(self, text_id):
        for text in self.config.texts:
            if (text["id"] == text_id):
                self.curr_text_id = text_id
                return True
        return False

    # Find animation by id and set it to curr
    def set_curr_animation_id(self, animation_id):
        for animation in self.config.animations:
            if (animation["id"] == animation_id):
                self.curr_animation_id = animation_id
                return True
        return False

    # Find bubble by id and set it to curr
    def set_curr_bubble_id(self, bubble_id):
        for bubble in self.config.bubbles:
            if (bubble["id"] == bubble_id):
                self.curr_bubble_id = bubble_id
                return True
        return False

    # Find bubble by id and set it to curr
    def set_curr_buyer_id(self, curr_buyer_id):
        self.curr_buyer_id = curr_buyer_id
        return True

    # Update choices from config
    def update_config(self, config):
        self.config.update(config)

    # Get current display data
    def get_curr_display(self):
        return {
            "text_id": self.curr_text_id,
            "animation_id": self.curr_text_id,
            "bubble_id": self.curr_bubble_id,
            "buyer_id": self.curr_buyer_id
        }

    def get_config(self):
        return self.config.to_json()

    def to_json(self):
        return {
            "streamer_id": self.streamer_id,
            "display_name": self.display_name,
            "curr_text_id": self.curr_text_id,
            "curr_animation_id": self.curr_animation_id,
            "curr_bubble_id": self.curr_bubble_id,
            "curr_buyer_id": self.curr_buyer_id,
            "config": self.config.to_json(),
            "token": self.token,
        }
