export interface TwitchAuth {
  channelId: string;
  clientId: string;
  token: string;
  userId: string;
}

/**
 * Context interface
 * @param mode - Valid values:
 * * viewer — The helper was loaded in a viewer context, such as the Twitch channel page.
 * * dashboard — The helper was loaded into a broadcaster control context, like the live dashboard. Use this mode to present controls that allow the broadcaster to update the extension’s behavior during broadcast.
 * * config — The helper was loaded into the extension dashboard for configuration, including initial configuration. All setup needed to run the extension should be in this mode.
 * @param bitrate -	Bitrate of the broadcast.
 * bufferSize	number	Buffer size of the broadcast.
 * @param displayResolution -	Display size of the player.
 * @param game - Game being broadcast.
 * @param hlsLatencyBroadcaster - Number of seconds of latency between the broadcaster and viewer.
 * @param isFullScreen - If true, the viewer is watching in fullscreen mode.
 * @param isPaused - If true, the viewer has paused the stream.
 * @param isTheatreMode - If true, the viewer is watching in theater mode.
 * @param language - Language of the broadcast (e.g., "en").
 * @param playbackMode - Indicates how the stream is being played. Valid values:
 * * video — Normal video playback.
 * * audio — Audio-only mode. Applies only to mobile apps.
 * * remote — Using a remote display device (e.g., Chromecast). Video statistics may be incorrect or unavailable.
 * * chat-only — No video or audio, chat only. Applies only to mobile apps. Video statistics may be incorrect or unavailable.
 * @param theme - The user's theme setting on the Twitch website. Valid values: "light" or "dark".
 * @param videoResolution - Resolution of the broadcast.
 */
export interface TwitchContext {
  mode: "viewer" | "dashboard" | "config";
  bitrate: number;
  bufferSize: number;
  displayResolution: string;
  game: string;
  hlsLatencyBroadcaster: number;
  isFullScreen: boolean;
  isPaused: boolean;
  isTheatreMode: boolean;
  language: string;
  playbackMode: "video" | "audio" | "remote" | "chat-only";
  theme: "ligth" | "dark";
  videoResolution: string;
}

// export enum Filter {
//   ALL = "ALL",
//   EXPERIENCE = "EXPERIENCE",
//   PROJECTS = "PROJECTS",
//   EDUCATION = "EDUCATION",
//   HACKATHONS = "HACKATHONS"
// }

// export enum Language {
//   en = "en",
//   ru = "ru"
// }

// export interface SocialMedia {
//   name: string;
//   link: string;
// }

export interface Text {
  id: string;
  text: string;
}

export interface Anim {
  id: string;
  animation: string;
}

export interface Bubble {
  id: string;
  bubble: string;
}

export interface Config {
  texts: Text[];
  animations: Anim[];
  bubbles: Bubble[];
  link: string;
  registered: boolean;
  price_sku: string;
}

export enum RESPONSE_STATES {
  UNDEFINED = "UNDEFINED",
  PENDING = "PENDING",
  DONE = "DONE",
  ERROR = "ERROR"
}

// export enum RESPONSE_STATES {
//   UNDEFINED = "UNDEFINED",
//   PENDING = "PENDING",
//   DONE = "DONE",
//   ERROR = "ERROR"
// }
