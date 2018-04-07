# mongo specific
MONGO_HOST = "localhost"
MONGO_PORT = 27017
MONGO_URI = "mongodb+srv://dkubatko:danjusha@bubbletext-bucdb.mongodb.net/Bubble"
# logging constants
MONGO_LOG_FILE = "logs/mongo.log"
LOG_FORMATTER = '%(asctime)s / %(name)s / %(levelname)s\n'\
        '| FILE: %(filename)s FUNCTION: %(funcName)s LINE: %(lineno)d |\nMESSAGE: %(message)s'

LOG_CONNECTION_SUCCESS = "Connected to DB (HOST: {0} | PORT: {1})"
LOG_CONNECTION_FAILURE = "Failed to connect to DB (HOST: {0} | PORT: {1}"
