import logging
import requests
import settings.twitchapi_settings as local_settings
import settings.global_settings as global_settings


class TwitchAPI:
    oauth_token = None
    client_id = local_settings.TWITCH_API_CLIENT_ID
    client_secret = local_settings.TWITCH_API_CLIENT_SECRET

    @classmethod
    def generate_oauth(cls):
        l = logging.getLogger("main.twitchapi")
        data = {
            "client_id": cls.client_id,
            "client_secret": cls.client_secret,
            "grant_type": "client_credentials"
        }

        result = requests.post(local_settings.TWITCH_OAUTH_LINK, data=data)

        if (result.status_code == 200):
            cls.oauth_token = result.json()["access_token"]
            l.info("Successfully generated OAUTH")
            return

        l.error("Error generating OAUTH")

    @classmethod
    def get_streamer_info(cls, streamer_id):
        if (cls.oauth_token is None):
            l = logging.getLogger("main.twitchapi")
            l.error("OAUTH token not specified")
            return None

        headers = {
            'Client-ID': cls.client_id,
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Authorization': 'OAuth ' + cls.oauth_token,
        }

        result = requests.get(
            local_settings.TWITCH_CHANNEL_INFO_LINK.format(streamer_id), headers=headers)

        if (result.status_code != 200):
            return None

        return result.json()

    @classmethod
    def get_streamer_live_info(cls, streamer_id):
        if (cls.oauth_token is None):
            l = logging.getLogger("main.twitchapi")
            l.error("OAUTH token not specified")
            return None

        headers = {
            'Client-ID': cls.client_id,
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Authorization': 'OAuth ' + cls.oauth_token,
        }

        result = requests.get(
            local_settings.TWITCH_STREAMS_INFO_LINK.format(streamer_id), headers=headers)



        if (result.status_code != 200):
            return None

        return result.json()["data"]
