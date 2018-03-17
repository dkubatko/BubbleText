import settings.jwt_settings as local_settings
import time
import jwt
import logging

class JWTworker:
    secret = local_settings.JWT_SECRET

    @classmethod
    def decodePayload(cls, payload):
        try:
            result = jwt.decode(payload, self.secret, algorithms=['HS256'])
        except jwt.DecodeError:
            result = []

        return result

    @classmethod
    def encodePayload(cls, payload):
        try:
            result = jwt.encode(payload. self.secret, algorithm='HS256')
        except Exception as e:
            logger = logging.getLogger("main.jwt")
            logger.error("Error encoding payload: {0}".format(str(e)))

            result = ""
        return result

    @classmethod
    def createToken(cls, incoming_token):
        exptime = time.time() + local_settings.EXP_TIME
        payload = {
            "exp": exptime,
            "user_id": local_settings.JWT_USER_ID,
            "role": "external"
        }
        return cls.encodePayload(payload)

