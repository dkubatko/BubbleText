// Core libs
import { observable, computed, action, runInAction } from "mobx";
import axios from "axios";
// import RESPONSE_STATES from "../constants/RESPONSE_STATES";
import BUBBLE_TYPES from "../constants/BUBBLE_TYPES";
import ANIM_TYPES from "../constants/ANIM_TYPES";
import EXT_CONFIG from "../constants/EXT_CONFIG";
import SKU_TYPES from "../constants/SKU_TYPES";
import {
  Text as IText,
  Anim as IAnim,
  Bubble as IBubble,
  TwitchAuth as ITwitchAuth,
  Config as IConfig,
  RESPONSE_STATES
} from "../models";

// export interface StreamerConfigStore {
//   texts: Text[];
// }

// Images
// export class StreamerConfigStore implements StreamerConfigStore {
export class StreamerConfigStore {
  auth: ITwitchAuth = null;
  @observable theme = EXT_CONFIG.DARK_THEME;

  @observable link = "save config to recieve link";
  @observable priceSKU: string = SKU_TYPES.price_sku_1;
  @observable registered = false;
  @observable
  texts: IText[] = [{ id: "0", text: "CS LUL" }, { id: "1", text: "TryHard" }];
  @observable animations: IAnim[] = [{ id: "0", animation: "Anim" }];
  @observable bubbles: IBubble[] = [{ id: "0", bubble: "test" }];
  @observable live = false;
  @observable isConfigFetched: RESPONSE_STATES = RESPONSE_STATES.UNDEFINED;
  @observable isConfigSaved: RESPONSE_STATES = RESPONSE_STATES.UNDEFINED;

  // @action
  // setAuth(auth) {
  //   this.auth = auth;
  // }

  @action
  addText(value) {
    if (this.texts.length < EXT_CONFIG.MAX_TEXTS_COUNT) {
      const newText: IText = {
        id: new Date().valueOf().toString(),
        text: value
      };
      this.texts.push(newText);
    }
  }

  @action
  removeText(id) {
    this.texts.splice(this.texts.findIndex(text => text.id === id), 1);
  }

  @action
  addBubble(id) {
    // console.log(this.bubbles.length);
    if (this.bubbles.length < EXT_CONFIG.MAX_BUBBLES_COUNT) {
      this.bubbles.push(BUBBLE_TYPES.find(bubble => bubble.id === id));
    }
  }

  @action
  removeBubble(id) {
    this.bubbles.splice(this.bubbles.findIndex(bubble => bubble.id === id), 1);
  }

  @action
  addAnim(id) {
    if (this.animations.length < EXT_CONFIG.MAX_ANIMATIONS_COUNT) {
      this.animations.push(ANIM_TYPES.find(anim => anim.id === id));
    }
  }

  @action
  removeAnim(id) {
    this.animations.splice(
      this.animations.findIndex(anim => anim.id === id),
      1
    );
  }

  @action
  setSKU(sku) {
    this.priceSKU = sku;
  }

  @action
  async getConfig(
    auth: ITwitchAuth,
    onError: Function = () => {},
    onSuccess: Function = () => {},
    onStreamerLive: Function = () => {}
  ) {
    this.auth = auth;
    this.isConfigFetched = RESPONSE_STATES.PENDING;
    // this.isConfigFetched = RESPONSE_STATES.DONE;

    // console.log("get config auth: ");
    // console.log(this.auth);
    const { channelId, clientId, token, userId } = this.auth;

    try {
      const config = await axios.get(
        `${
          EXT_CONFIG.BUBBLE_TEXT_ENDPOINT
        }/api/streamer/${channelId}/get_config`,
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      if (config.status >= 400) {
        throw new Error(config.error);
      }

      const configData = config.data.data;

      // console.log(config.data);
      if (config.data.success !== true) {
        throw new Error(config.error);
      }

      // console.log(config);
      if (configData.registered) this.setConfigData(configData);
      this.live = config.data.live;
      if (this.live) onStreamerLive();

      this.isConfigFetched = RESPONSE_STATES.DONE;

      onSuccess("Config fetched");
    } catch (error) {
      // console.log(error);
      this.isConfigFetched = RESPONSE_STATES.ERROR;
      onError(error);
    }
  }

  @action
  async saveConfig(
    onError: Function = () => {},
    onSuccess: Function = () => {}
  ) {
    this.isConfigSaved = RESPONSE_STATES.PENDING;

    const { channelId, clientId, token, userId } = this.auth;

    try {
      const config = await axios.post(
        `${
          EXT_CONFIG.BUBBLE_TEXT_ENDPOINT
        }/api/streamer/${channelId}/save_config`,
        {
          data: {
            texts: this.texts,
            animations: this.animations,
            bubbles: this.bubbles,
            price_sku: this.priceSKU
          }
        },
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      if (config.status >= 400) {
        throw new Error(config.error);
      }

      if (config.data.success === false) {
        throw config.data.error;
      }

      this.setConfigData(config.data.data);

      this.isConfigSaved = RESPONSE_STATES.DONE;
      onSuccess("Config saved");
    } catch (error) {
      this.isConfigSaved = RESPONSE_STATES.ERROR;
      onError(error);
    }
  }

  @action
  setConfigData(data: IConfig) {
    const { texts, animations, bubbles, link, registered, price_sku } = data;

    this.texts = texts;
    this.animations = animations;
    this.bubbles = bubbles;
    this.link = link;
    this.registered = registered;
    this.priceSKU = price_sku;
  }
}

const streamerConfigStore = new StreamerConfigStore();

export { streamerConfigStore };
