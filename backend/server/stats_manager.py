from assets.streamer import Streamer
from database.mongo import MongoWorker
import settings.global_settings as global_settings
import settings.stats_manager_settings as local_settings
from assets.profanity_filter import ProfanityFilter
from assets.config import Config
from assets.display import Display
from functools import wraps
from flask import request
import pprint
import time
import logging
import json

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

    class Event:
        streamer_id = None
        event = None
        data = None
        timestamp = None

        def __init__(self, streamer_id, event, data):
            self.streamer_id = streamer_id
            self.event = event
            self.data = data
            self.timestamp = time.time()

        def to_json(self):
            return {
                "streamer_id": self.streamer_id,
                "event": self.event,
                "data": self.data,
                "timestamp": self.timestamp
            }

    # Decorator to record route event
    def record_event(self, event):
        def event_decorator(func):
            @wraps(func)
            def decorated_route(*args, **kwargs):
                # self.logger.info("Recording event: " + event)

                if (kwargs.get("streamer_id") is None):
                    self.logger.error("Failure recording event " + event + "." +
                                      " Streamer_id is not defined")
                    return func(*args, **kwargs)

                # get streamer_id from func
                streamer_id = kwargs.get("streamer_id")

                data = request.json.get('data')

                return_val = func(*args, **kwargs)

                # If not json dict, return
                try:
                    return_dict = json.loads(return_val.response[0])
                except Exception as e:
                    self.logger.error("Error converting response to dict. Error: " + str(e))
                    return return_val

                # If unsuccessful don't track
                if (return_dict.get("success") is None or return_dict.get("success") == False):
                    return return_val

                # In "try" in case of failed db insert
                try:
                    # Create event and store it in db
                    coll = self.dbworker.get_stats_collection()
                    ev = StatsManager.Event(streamer_id, event, data)
                    coll.insert_one(ev.to_json())

                    self.logger.info("Recorded event " + event + " in the database")
                except Exception as e:
                    self.logger.error("Error recording event " + event + " to the database" +
                                      " due to " + str(e))

                return return_val

            return decorated_route
        return event_decorator


