import settings.jwt_settings as local_settings
import time
import jwt
import logging
import base64


class JWTworker:
    # Add padding and decode from base64
    secret = base64.b64decode(
        local_settings.JWT_SECRET + '=' * (-len(local_settings.JWT_SECRET) % 4))

    @classmethod
    def decode_payload(cls, token):
        try:
            payload = jwt.decode(token, cls.secret, algorithms=['HS256'])
        except jwt.DecodeError as e:
            payload = {}

        return payload

    @classmethod
    def encode_payload(cls, payload):
        try:
            result = jwt.encode(payload. cls.secret, algorithm='HS256')
        except Exception as e:
            logger = logging.getLogger("main.jwt")
            logger.error("Error encoding payload: {0}".format(str(e)))

            result = ""
        return result

    @classmethod
    def create_token(cls, incoming_token):
        exptime = time.time() + local_settings.EXP_TIME
        payload = {
            "exp": exptime,
            "user_id": local_settings.JWT_USER_ID,
            "role": "external"
        }
        return cls.encode_payload(payload)

    @classmethod
    def verify_token(cls, incoming_token, roles=["broadcaster"]):
        if not isinstance(incoming_token, str):
            return False

        if ("Bearer" in incoming_token):
            incoming_token = incoming_token.split(" ")[1]

        payload = cls.decode_payload(incoming_token)
        if ('role' not in payload.keys()):
            return False

        role = payload['role']
        if (role in roles):
            return True
        else:
            return False
