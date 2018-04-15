from assets.streamer import Streamer
from database.mongo import MongoWorker
import settings.global_settings as global_settings
import settings.bubble_settings as local_settings
from assets.profanity_filter import ProfanityFilter
from assets.config import Config
from assets.display import Display
import pprint
import logging


class Bubble():
    streamers = None
    logger = None
    dbworker = None

    def __init__(self, read_data=False):
        self._log_setup()
        self.streamers = []
        if (read_data):
            self.dbworker = MongoWorker()
            self.load_from_db()

    def _log_setup(self):
        self.logger = logging.getLogger('main')
        log_f = logging.FileHandler(local_settings.MAIN_LOG_FILE)
        log_s = logging.StreamHandler()

        if (global_settings.DEBUG):
            self.logger.setLevel(logging.DEBUG)
            log_f.setLevel(logging.DEBUG)
            log_s.setLevel(logging.DEBUG)
        else:
            self.logger.setLevel(logging.INFO)

        formatter = logging.Formatter(local_settings.LOG_FORMATTER)
        log_f.setFormatter(formatter)
        log_s.setFormatter(formatter)

        self.logger.addHandler(log_f)
        self.logger.addHandler(log_s)

    def load_from_db(self):
        coll = self.dbworker.get_streamers_collection()
        count = 0
        for streamer in coll.find():
            curr = Streamer(
                streamer["streamer_id"],
                display_name=streamer.get("display_name"),
                display=streamer.get("display"),
                config=streamer.get("config"),
                token=streamer.get("token")
            )
            # pprint.pprint(curr.to_json())
            # # Replace with clean data
            # coll.replace_one({"streamer_id": curr.streamer_id}, curr.to_json())
            # print("Replaced " + curr.streamer_id)
            self.streamers.append(curr)
            count += 1

        self.logger.info(local_settings.LOG_DB_LOAD_SUCCESS.format(count))

    # Update existing streamer object in db
    def db_update_streamer(self, streamer_obj):
        coll = self.dbworker.get_streamers_collection()
        # Updates all the streamers that have specific id (should be 1)
        result = coll.update_many(
            {"streamer_id": streamer_obj.streamer_id},
            {
                "$set": streamer_obj.to_json()
            }
        )
        self.dbworker.logger.info(local_settings.LOG_DB_UPDATE
                                  .format(result.modified_count,
                                          streamer_obj.streamer_id))

    # Inserts new streamer object into db
    def db_insert_new_streamer(self, streamer):
        s = streamer.to_json()
        coll = self.dbworker.get_streamers_collection()
        coll.insert_one(s)

    # Create new streamer and insert to db
    def add_streamer_with_config(self, streamer_id, config):
        s = Streamer(streamer_id, config=config)
        self.streamers.append(s)
        self.db_insert_new_streamer(s)
        return True, None

    # Find streamer object by id
    def find_streamer_by_id(self, streamer_id):
        for streamer in self.streamers:
            if str(streamer.streamer_id) == str(streamer_id):
                return streamer
        return None

    # Updates streamer with new config or create a new streamer
    def update_streamer_config(self, streamer_id, config):
        streamer = self.find_streamer_by_id(streamer_id)

        ok, error = Config.verify(config)

        if (not ok):
            self.logger.error(
                local_settings.LOG_CONFIG_NOT_VALID.format(streamer_id, error))
            return False, error

        # if streamer doesn't exist, create
        if (streamer is None):
            ok, error = self.add_streamer_with_config(streamer_id, config)
            return ok, error

        streamer.update_config(config)
        self.db_update_streamer(streamer)
        return True, None

    # Get streamer's config
    def get_streamer_config(self, streamer_id):
        streamer = self.find_streamer_by_id(streamer_id)

        if (streamer is None):
            self.logger.error(local_settings.
                              LOG_STREAMER_NOT_FOUND.format(streamer_id))
            return {"registered": False}

        conf = streamer.get_config()
        conf["registered"] = True
        return conf

    # Sets streamer's curr display values
    def update_streamer_display(self, streamer_id, display):
        streamer = self.find_streamer_by_id(streamer_id)

        if (streamer is None):
            self.logger.error(local_settings.
                              LOG_STREAMER_NOT_FOUND.format(streamer_id))
            return False, "Streamer with id " + streamer_id + " is not registered"

        ok, error = Display.verify(display, streamer.config)

        if (not ok):
            self.logger.error(
                local_settings.LOG_DISPLAY_NOT_VALID.format(streamer_id, error))
            return False, error

        streamer.update_display(display)
        self.db_update_streamer(streamer)
        return True, None

    # Gets streamer's current display values
    def get_streamer_display(self, streamer_id):
        streamer = self.find_streamer_by_id(streamer_id)

        if (streamer is None):
            self.logger.error(local_settings.
                              LOG_STREAMER_NOT_FOUND.format(streamer_id))

        return streamer.get_curr_display()

    # returns token for a streamer
    def get_streamer_token(self, streamer_id):
        streamer = self.find_streamer_by_id(streamer_id)

        if (streamer is None):
            self.logger.error(local_settings.
                              LOG_STREAMER_NOT_FOUND.format(streamer_id))
            return None

        return streamer.token

    # Verifies token for the streamer
    def verify_token(self, streamer_id, token):
        streamer = self.find_streamer_by_id(streamer_id)

        if (streamer is None):
            self.logger.error(local_settings.
                              LOG_STREAMER_NOT_FOUND.format(streamer_id))
            return False

        return streamer.token == token
