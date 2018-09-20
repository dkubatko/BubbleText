import os

TWITCH_API_CLIENT_ID = os.getenv("TWITCH_API_CLIENT_ID")
TWITCH_API_CLIENT_SECRET = os.getenv("TWITCH_API_CLIENT_SECRET")
TWITCH_EXTENSION_CLIENT_ID = os.getenv("TWITCH_EXTENSION_SECRET")

TWITCH_OAUTH_LINK = "https://id.twitch.tv/oauth2/token"
TWITCH_CHANNEL_INFO_LINK = "https://api.twitch.tv/kraken/channels/{0}"
TWITCH_STREAMS_INFO_LINK = "https://api.twitch.tv/kraken/streams/?channel={0}"
TWITCH_REQUIRED_CONFIG_LINK = "https://api.twitch.tv/extensions/5pogkiewjnqz3f2lydhxwqqxncbpx8/0.0.1/required_configuration?channel_id={0}"
