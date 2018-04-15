from assets.streamer import Streamer
from database.mongo import MongoWorker
import settings.global_settings as global_settings
import settings.stats_manager_settings as local_settings
from assets.profanity_filter import ProfanityFilter
from assets.config import Config
from assets.display import Display
import pprint
import logging

class StatsManager():
    dbworker = None

    def __init__(self):
        self._log_setup()
        self.dbworker = MongoWorker()

    def _log_setup(self):
        self.logger = logging.getLogger('stats')
        log_f = logging.FileHandler(local_settings.STATS_LOG_FILE)
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

    def record_event(self, event, data):
        coll = self.dbworker.get_stats_collection()


