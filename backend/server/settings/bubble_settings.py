# Logging constants
MAIN_LOG_FILE = "logs/bubble.log"
LOG_FORMATTER = '%(asctime)s / %(name)s / %(levelname)s\n'\
        '| FILE: %(filename)s FUNCTION: %(funcName)s LINE: %(lineno)d |\nMESSAGE: %(message)s'

LOG_DB_LOAD_SUCCESS = "Loaded {0} elements from the database"
LOG_DB_UPDATE = "Updated {0} streamer(s) with id {1}"
LOG_STREAMER_NOT_FOUND = "Streamer (id: {0}) not found"
LOG_CONFIG_NOT_VALID = "Config for Streamer (id: {0}) not valid due error: {1}"
LOG_DISPLAY_NOT_VALID = "Display for Streamer (id: {0}) not valid due error: {1}"

