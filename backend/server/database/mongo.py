import settings.global_settings as global_settings
import settings.mongo_settings as local_settings
from assets.streamer import Streamer
from pymongo import MongoClient
import logging


class MongoWorker():
    db = None
    logger = None

    def __init__(self):
        self._log_setup()

        try:
            client = MongoClient(local_settings.MONGO_URI)
            self.db = client.Bubble

            self.logger.info(local_settings.LOG_CONNECTION_SUCCESS.format(
                local_settings.MONGO_HOST,
                local_settings.MONGO_PORT))
        except Exception as e:
            self.logger.critical(local_settings.LOG_CONNECTION_FAILURE.format(
                local_settings.MONGO_HOST,
                local_settings.MONGO_PORT))
            raise e

    def _log_setup(self):
        self.logger = logging.getLogger('main.mongo')
        log_f = logging.FileHandler(local_settings.MONGO_LOG_FILE)

        if (global_settings.DEBUG):
            self.logger.setLevel(logging.DEBUG)
            log_f.setLevel(logging.DEBUG)
        else:
            self.logger.setLevel(logging.INFO)

        formatter = logging.Formatter(local_settings.LOG_FORMATTER)
        log_f.setFormatter(formatter)

        self.logger.addHandler(log_f)

        self.logger.info("Successfully set up logging")

    # Get the iteratable collection of streamers
    def get_streamers_collection(self):
        return self.db.streamers
