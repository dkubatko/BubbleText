import { observable, action } from "mobx";
import streamerConfigStore from "./streamerConfigStore";
import axios from "axios";
import RESPONSE_STATES from "../constants/RESPONSE_STATES";
import EXT_CONFIG from "../constants/EXT_CONFIG";
import getRandomInt from "../utils/getRandomInt";

class ConfigStore {
  @observable streamerConfigStore = streamerConfigStore;
  @observable addTextInput = "";
  @observable copiedToClipboard = false;

  @observable isNotificationShows = false;
  @observable notificationText = "";
  @observable notificationType = null;

  notificationTimeout = null;

  @action
  showNotification(type, text) {
    this.notificationType = type;
    this.notificationText = text;
    this.isNotificationShows = true;

    // clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => {
      this.hideNotification();
    }, EXT_CONFIG.NOTIFICATION_SHOW_TIME);
  }

  @action
  hideNotification() {
    this.notificationTimeout = null;
    this.isNotificationShows = false;
  }

  @action
  setCopiedToClippboard(value) {
    this.copiedToClipboard = value;
  }

  @action
  updateAddTextInput(value) {
    this.addTextInput = value;
  }

  @action
  addText() {
    this.streamerConfigStore.addText(this.addTextInput);
    this.addTextInput = "";
  }

  @action
  async purchaseTextFree() {
    const {
      channelId,
      clientId,
      token,
      userId
    } = this.streamerConfigStore.auth;
    const { texts, animations, bubbles } = this.streamerConfigStore;

    // console.log("USER ID: " + userId.replace("U", ""));
    try {
      let config = await axios.post(
        `${
          EXT_CONFIG.BUBBLE_TEXT_ENDPOINT
        }/api/streamer/${channelId}/purchase/free`,
        {
          data: {
            text_id: texts.slice()[getRandomInt(0, texts.length)].id.toString(),
            animation_id: animations
              .slice()
              [getRandomInt(0, animations.length)].id.toString(),
            bubble_id: bubbles
              .slice()
              [getRandomInt(0, bubbles.length)].id.toString(),
            // buyer_id: userId.replace("U", "")
            buyer_id: channelId
          }
        },
        {
          headers: { Authorization: "Bearer " + token }
          // headers: {
          //   Authorization:
          //     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MjMzODMyMjIsIm9wYXF1ZV91c2VyX2lkIjoiVTQ2MzY1MDczIiwidXNlcl9pZCI6IjQ2MzY1MDczIiwiY2hhbm5lbF9pZCI6IjQ2MzY1MDczIiwicm9sZSI6InZpZXdlciIsInB1YnN1Yl9wZXJtcyI6eyJsaXN0ZW4iOlsidmlld2VyIiwid2hpc3Blci1VNDYzNjUwNzMiXSwic2VuZCI6WyIqIl19fQ.lMJflHXM7HzZepPIPcBlvYMnVhzoY11jfDMUe8LwElQ"
          // }
        }
      );

      if (config.status >= 400) {
        throw new Error("Bad response from server");
      }
      // const { texts, animations, bubbles, link, registered } = config.data;

      // if (registered) {
      //   this.texts = texts;
      //   this.animations = animations;
      //   this.bubbles = bubbles;
      //   this.link = link;
      //   this.registered = registered;
      // }
      // console.log("Free purchase sucсess");

      // this.isConfigFetched = ResponseStates.DONE;
    } catch (error) {
      // console.log("error", error);
      // this.isConfigFetched = ResponseStates.ERROR;
    }
  }
}

const configStore = new ConfigStore();

export default configStore;
export { ConfigStore };
