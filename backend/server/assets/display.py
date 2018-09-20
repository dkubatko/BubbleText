import settings.display_settings as local_settings
import settings.global_settings as global_settings
import logging


class Display:
    text_id = None
    animation_id = None
    bubble_id = None
    buyer_display_name = None
    config = None

    def __init__(self, display, config):
        self._log_setup()

        # Assume config is already verified
        self.config = config

        ok, error = Display.verify(display, self.config)

        if (not ok):
            self.logger.error("Instance of a display fired with unverified dict, "
                              + "error: {0}".format(error))
            self.text_id = self.config.texts[0]["id"]
            self.bubble_id = self.config.bubbles[0]["id"]
            self.animations_id = self.config.animations[0]["id"]
            self.buyer_display_name = "Default"
            return

        self.text_id = display["text_id"]
        self.bubble_id = display["bubble_id"]
        self.animation_id = display["animation_id"]
        self.buyer_display_name = display["buyer_display_name"]

    # no need for config since its wired to the one
    # in the streamer object
    def update(self, display):
        ok, error = Display.verify(display, self.config)

        if (not ok):
            self.logger.error("Update of a display fired with unverified dict, "
                              + "error: {0}".format(error))
            return

        self.text_id = display["text_id"]
        self.bubble_id = display["bubble_id"]
        self.animation_id = display["animation_id"]
        self.buyer_display_name = display["buyer_display_name"]


    def _log_setup(self):
        self.logger = logging.getLogger('main.display')

    @classmethod
    def verify(cls, display, config):
        if (not isinstance(display, dict)):
            return False, "Invalid type of display"

        if (any(key not in display.keys() for key in ["text_id", "bubble_id",
                                                      "animation_id", "buyer_display_name"])):
            return False, "Not all items are in the display"

        # check if items in config
        found = False
        for text in config.texts:
            if (text["id"] == display["text_id"]):
                found = True
                continue
        if (not found):
            return False, "Error setting text_id"

        found = False
        for bubble in config.bubbles:
            if (bubble["id"] == display["bubble_id"]):
                found = True
                continue
        if (not found):
            return False, "Error setting bubble_id"

        found = False
        for animation in config.animations:
            if (animation["id"] == display["animation_id"]):
                found = True
                continue
        if (not found):
            return False, "Error setting animation_id"

        return True, None

    @classmethod
    def default(cls, config):
        display = {
            "text_id": config.texts[0]["id"],
            "bubble_id": config.bubbles[0]["id"],
            "animation_id": config.animations[0]["id"],
            "buyer_display_name": "0"
        }
        return Display(display, config)


    def to_json(self):
        return {
            "text_id": self.text_id,
            "bubble_id": self.bubble_id,
            "animation_id": self.animation_id,
            "buyer_display_name": self.buyer_display_name
        }
