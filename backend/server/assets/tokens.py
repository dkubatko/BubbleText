import secrets
import settings.token_settings as local_settings

class Tokens:
    @classmethod
    def generate_token(cls):
        return secrets.token_hex(local_settings.TOKEN_BITS_USED)
