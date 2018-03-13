import logging
import os
from flask import request
DEBUG = True

# Formatter for events
class RequestFormatter(logging.Formatter):
    def format(self, record):
        record.url = request.url
        record.remote_addr = request.remote_addr
        return super().format(record)

# Logging settings
REQUEST_FORMAT = '%(asctime)s / %(name)s / %(levelname)s\n'\
        '| FROM: %(remote_addr)s REQUEST URL: %(url)s |\n'\
        '| FILE: %(filename)s FUNCTION: %(funcName)s LINE: %(lineno)d |\nMESSAGE: %(message)s'

FLASK_APP_LOG_FORMAT = '%(asctime)s / %(name)s / %(levelname)s\n'\
        '| FILE: %(filename)s FUNCTION: %(funcName)s LINE: %(lineno)d |\nMESSAGE: %(message)s'
FLASK_LOG_FILE = 'logs/flask_app.log'


# Responses
RESPONSE_SUCCESS = {"success": True}
RESPONSE_FAILURE = {"success": False}
