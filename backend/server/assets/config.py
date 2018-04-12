import settings.global_settings as global_settings
import settings.config_settings as local_settings
import logging
from assets.profanity_filter import ProfanityFilter

class Config:
    texts = []
    animations = []
    bubbles = []
    price_sku = ""

    def __init__(self, config):
        self._log_setup()

        ok, error = Config.verify(config)

        if (not ok):
            self.logger.error("Instance of a config fired with unverified dict, "
                              + "error: {0}".format(error))
            return

        self.texts = config["texts"]
        self.animations = config["animations"]
        self.bubbles = config["bubbles"]
        self.price_sku = config["price_sku"]

    def update(self, config):
        ok, error = Config.verify(config)

        if (not ok):
            self.logger.error("Update of a config fired with unverified dict")
            return

        self.texts = config["texts"]
        self.animations = config["animations"]
        self.bubbles = config["bubbles"]
        self.price_sku = config["price_sku"]

    def _log_setup(self):
        self.logger = logging.getLogger('main.config')

    def to_json(self):
        return {
            "texts": self.texts,
            "animations": self.animations,
            "bubbles": self.bubbles,
            "price_sku": self.price_sku
        }

    @classmethod
    def default(cls):
        return Config(local_settings.DEFAULT_CONFIG)

    # verifies config dict
    @classmethod
    def verify(cls, config):
        if (not isinstance(config, dict)):
            return False, "Invalid type of config"

        if any(key not in config.keys() for key in ["texts", "animations",
                                                    "bubbles", "price_sku"]):
            return False, "Not all items are in the config"

        for key in ["texts", "animations", "bubbles"]:
            ok, error = cls.verify_entry(config[key], key)

            if (not ok):
                return False, error

            if (key == "texts"):
                ok, error = cls.verify_texts(config[key])

                if (not ok):
                    return False, error

        try:
            config["price_sku"] = str(config["price_sku"])
        except:
            return False, "Price sku cannot be converted to string"

        return True, None


    # verifies one field and stringifies inputs
    @classmethod
    def verify_entry(cls, items, key):
        if (len(items) > local_settings.MAX_PROP_COUNT[key]):
            return False, "Too many choices for " + key

        val = key[:-1]

        for item in items:
            if ("id" not in item.keys()):
                return False, "Missing <id> for " + key
            else:
                item["id"] = str(item["id"])

            if (val not in item.keys()):
                return False, "Missing value for " + key
            else:
                item[val] = str(item[val])

        item_ids = [item["id"] for item in items]
        # check for uniquness
        if (len(item_ids) > len(set(item_ids))):
            return False, "Ids are not unique for " + key

        return True, None


    # Checks uniquness of the texts and filters profanity
    @classmethod
    def verify_texts(cls, texts):
        text_captions = [text["text"] for text in texts]
        # check for uniquness
        if (len(text_captions) > len(set(text_captions))):
            return False, "Texts are not unique"

        # Filter bad words and length
        for text in texts:
            text["text"] = ProfanityFilter.filter(text["text"])

            # Text too long
            if (len(text["text"]) > local_settings.MAX_TEXT_LENGTH):
                return False, "Text is too long"

        return True, None
