from assets.streamer import Streamer
from database.mongo import MongoWorker
import settings.global_settings as global_settings
import settings.bubble_settings as local_settings
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
                display_name=streamer["display_name"],
                curr_text=streamer["curr_text"],
                curr_text_id=streamer["curr_text_id"],
                text_choices=streamer["text_choices"]
            )
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

    def add_streamer(self, streamer_id):
        s = Streamer(streamer_id)
        s.add_text_choice(local_settings.DEFAULT_TEXT)
        s.set_curr_text(0)

        self.streamers.append(s)
        # self.db_insert_new_streamer(s)
        return True

    # Returns list of streamer's preset texts
    def get_streamer_texts(self, streamer_id):
        for streamer in self.streamers:
            if streamer.streamer_id == streamer_id:
                return streamer.text_choices
        return []

    # Find streamer object by id
    def find_streamer_by_id(self, streamer_id):
        for streamer in self.streamers:
            if str(streamer.streamer_id) == str(streamer_id):
                return streamer
        return None

    # Adds text choice to specific streamer
    def add_text_choice(self, streamer_id, text):
        streamer = self.find_streamer_by_id(streamer_id)

        if (streamer is None):
            self.logger.error(local_settings.
                              LOG_STREAMER_NOT_FOUND.format(streamer_id))
            return False

        streamer.add_text_choice(text)
        self.db_update_streamer(streamer)
        return True

    # Removes text choice from the specified streamer
    def remove_text_choice(self, streamer_id, text_id):
        streamer = self.find_streamer_by_id(streamer_id)

        if (streamer is None):
            self.logger.error(local_settings.
                              LOG_STREAMER_NOT_FOUND.format(streamer_id))
            return False

        ok = streamer.remove_text_choice(text_id)

        if (ok):
            self.db_update_streamer(streamer)
            return True
        else:
            return False

    # Get current text displayed
    def get_curr_text(self, streamer_id):
        streamer = self.find_streamer_by_id(streamer_id)

        if (streamer is None):
            self.logger.error(local_settings.
                              LOG_STREAMER_NOT_FOUND.format(streamer_id))
            return None

        return streamer.curr_text

    # Set current text displayed
    def set_curr_text(self, streamer_id, text_id):
        streamer = self.find_streamer_by_id(streamer_id)

        if (streamer is None):
            self.logger.error(local_settings.
                              LOG_STREAMER_NOT_FOUND.format(streamer_id))
            return False

        ok = streamer.set_curr_text(text_id)

        if (ok):
            self.db_update_streamer(streamer)
            return True
        else:
            return False
