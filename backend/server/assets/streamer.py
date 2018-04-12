import settings.global_settings as global_settings
import settings.streamer_settings as local_settings
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
    # List of dict
    texts = None
    # List of dict
    animations = None
    # List of dict
    bubbles = None
    # String
    price_sku = None
    # String token to access view page
    token = None

    # In memory vars
    room_name = None

    def __init__(self, streamer_id, display_name="", curr_text_id="-1",
                 curr_animation_id="-1", curr_bubble_id="-1", curr_buyer_id="-1", config={}, token=""):
        self._log_setup()

        # initialize all fields
        self.streamer_id = streamer_id

        if (display_name == ""):
            self.display_name = Streamer.get_display_name(self.streamer_id)

        self.curr_text_id = curr_text_id
        self.curr_animation_id = curr_animation_id
        self.curr_bubble_id = curr_bubble_id
        self.curr_buyer_id = curr_buyer_id

        if ("texts" in config.keys()):
            self.texts = config["texts"]
        else:
            self.texts = []

        if ("animations" in config.keys()):
            self.animations = config["animations"]
        else:
            self.animations = []

        if ("bubbles" in config.keys()):
            self.bubbles = config["bubbles"]
        else:
            self.bubbles = []

        if ("price_sku" in config.keys()):
            self.price_sku = config["price_sku"]
        else:
            self.price_sku = ""

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

        if (result is None):
            return ""

        return result["display_name"]

    # Find text by id and set it to curr
    def set_curr_text_id(self, text_id):
        for text in self.texts:
            if (text["id"] == text_id):
                self.curr_text_id = text_id
                return True
        return False

    # Find animation by id and set it to curr
    def set_curr_animation_id(self, animation_id):
        for animation in self.animations:
            if (animation["id"] == animation_id):
                self.curr_animation_id = animation_id
                return True
        return False

    # Find bubble by id and set it to curr
    def set_curr_bubble_id(self, bubble_id):
        for bubble in self.bubbles:
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
        self.texts = config["texts"]
        self.animations = config["animations"]
        self.bubbles = config["bubbles"]
        self.price_sku = config["price_sku"]

    # Get current display data
    def get_curr_display(self):
        return {
            "text_id": self.curr_text_id,
            "animation_id": self.curr_text_id,
            "bubble_id": self.curr_bubble_id,
            "buyer_id": self.curr_buyer_id
        }

    def get_config(self):
        return {
            "texts": self.texts,
            "animations": self.animations,
            "bubbles": self.bubbles,
            "price_sku": self.price_sku,
            "registered": True,
        }

    def to_json(self):
        return {
            "streamer_id": self.streamer_id,
            "display_name": self.display_name,
            "curr_text_id": self.curr_text_id,
            "curr_animation_id": self.curr_animation_id,
            "curr_bubble_id": self.curr_bubble_id,
            "curr_buyer_id": self.curr_buyer_id,
            "texts": self.texts,
            "animations": self.animations,
            "bubbles": self.bubbles,
            "price_sku": self.price_sku,
            "token": self.token,
        }
