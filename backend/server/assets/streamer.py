import settings.global_settings as global_settings
import settings.streamer_settings as local_settings
from assets.twitchapi import TwitchAPI
import logging

class Streamer:
    logger = None

    # String
    streamer_id = None
    # String
    display_name = None
    # String
    curr_text = None
    # Integer
    curr_text_id = None
    # List of dict
    text_choices = None

    # In memory vars
    room_name = None

    def __init__(self, streamer_id, display_name="", curr_text="",
                 curr_text_id=-1, text_choices=[]):
        self._log_setup()

        # initialize all fields
        self.streamer_id = streamer_id

        if (display_name == ""):
            self.display_name = self.get_streamer_display_name()

        self.curr_text = curr_text
        self.curr_text_id = curr_text_id
        self.text_choices = text_choices

        # socketio room name
        self.room_name = streamer_id

        self.logger.info(local_settings.LOG_STREAMER_CREATED.format(streamer_id))

    def _log_setup(self):
        self.logger = logging.getLogger('main.streamer')

    # TODO
    def get_streamer_display_name(self):
        result = TwitchAPI.get_streamer_info(self.streamer_id)

        if (result is None):
            print("FAILURE")
            return ""

        print("SUCCESS " + result["display_name"])

        return result["display_name"]

    # Adds multiple text choices for the streamer
    def add_text_choices(self, texts):
        for text in texts:
            self.add_text_choice(text)

    # Adds one text choice for the streamer
    def add_text_choice(self, text):
        choice = {
            "text_id": len(self.text_choices),
            "text": text
        }
        self.text_choices.append(choice)

    # Removes one text choice by id for the streamer
    # returns False if not found True if found and updated
    def remove_text_choice(self, text_id):
        found = False
        to_delete = None
        for choice in self.text_choices:
            if (choice["text_id"] == text_id):
                found = True
                to_delete = choice
                continue

            # If found, decrease all the upcoming ids by 1
            if (found):
                choice["text_id"] -= 1

        if (found):
            self.text_choices.remove(to_delete)
            return True
        else:
            return False

    # Updates current text displayed
    def set_curr_text(self, text_id):
        choice = [choice for choice in self.text_choices
                  if str(choice["text_id"]) == str(text_id)]

        if (len(choice) == 0):
            return False

        choice = choice[0]

        self.curr_text_id = choice["text_id"]
        self.curr_text = choice["text"]
        return True

    def to_json(self):
        return {
            "streamer_id": self.streamer_id,
            "display_name": self.display_name,
            "curr_text": self.curr_text,
            "curr_text_id": self.curr_text_id,
            "text_choices": self.text_choices
        }
