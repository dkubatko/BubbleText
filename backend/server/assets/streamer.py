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
    # List of dict
    texts = None
    # List of dict
    animations = None
    # List of dict
    bubbles = None
    # String token to access view page
    token = None

    # In memory vars
    room_name = None

    def __init__(self, streamer_id, display_name="", curr_text_id="-1",
                 curr_animation_id="-1", curr_bubble_id="-1", config={}, token=""):
        self._log_setup()

        # initialize all fields
        self.streamer_id = streamer_id

        if (display_name == ""):
            self.display_name = get_display_name(self.streamer_id)

        self.curr_text_id = curr_text_id
        self.curr_animation_id = curr_animation_id
        self.curr_bubble_id = curr_bubble_id

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
            if (text["text_id"] == text_id):
                self.curr_text_id = text_id
                return True
        return False

    # Find animation by id and set it to curr
    def set_curr_animation_id(self, animation_id):
        for animation in self.animations:
            if (animation["animation_id"] == animation_id):
                self.curr_animation_id = animation_id
                return True
        return False

    # Find bubble by id and set it to curr
    def set_curr_bubble_id(self, bubble_id):
        for bubble in self.bubbles:
            if (bubble["bubble_id"] == bubble_id):
                self.curr_bubble_id = bubble_id
                return True
        return False

    # Update choices from config
    def update_config(self, config):
        self.texts = config["texts"]
        self.animations = config["animations"]
        self.bubbles = config["bubbles"]

    # Get current display data
    def get_curr_display(self):
        return {
            "text_id": self.curr_text_id,
            "animation_id": self.curr_text_id,
            "bubble_id": self.curr_bubble_id
        }

    # # Adds multiple text choices for the streamer
    # def add_text_choices(self, texts):
    #     for text in texts:
    #         self.add_text_choice(text)

    # # Adds one text choice for the streamer
    # def add_text_choice(self, text):
    #     if (len(self.text_choices) >= local_settings.STREAMER_CHOICE_LIMIT):
    #         self.logger.info(
    #             local_settings.LOG_CHOICE_LIMIT_REACHED.format(self.streamer_id))
    #         return False

    #     choice = {
    #         "text_id": len(self.text_choices),
    #         "text": text
    #     }
    #     self.text_choices.append(choice)
    #     return True

    # # Removes one text choice by id for the streamer
    # # returns False if not found True if found and updated
    # def remove_text_choice(self, text_id):
    #     found = False
    #     to_delete = None
    #     for choice in self.text_choices:
    #         if (choice["text_id"] == text_id):
    #             found = True
    #             to_delete = choice
    #             continue

    #         # If found, decrease all the upcoming ids by 1
    #         if (found):
    #             choice["text_id"] -= 1

    #     if (found):
    #         self.text_choices.remove(to_delete)
    #         return True
    #     else:
    #         return False

    # # Updates current text displayed
    # def set_curr_text(self, text_id):
    #     choice = [choice for choice in self.text_choices
    #               if str(choice["text_id"]) == str(text_id)]

    #     if (len(choice) == 0):
    #         return False

    #     choice = choice[0]

    #     self.curr_text_id = choice["text_id"]
    #     self.curr_text = choice["text"]
    #     return True

    def get_config(self):
        return {
            "texts": self.texts,
            "animations": self.animations,
            "bubbles": self.bubbles,
            "registered": True,
        }

    def to_json(self):
        return {
            "streamer_id": self.streamer_id,
            "display_name": self.display_name,
            "curr_text_id": self.curr_text_id,
            "curr_animation_id": self.curr_animation_id,
            "curr_bubble_id": self.curr_bubble_id,
            "texts": self.texts,
            "animations": self.animations,
            "bubbles": self.bubbles,
            "token": self.token,
        }
