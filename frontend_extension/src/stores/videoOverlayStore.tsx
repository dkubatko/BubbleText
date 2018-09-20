import { observable, action } from "mobx";
// import streamerConfigStore from "./streamerConfigStore";
// import { widgetStore } from "./widgetStore";
import axios from "axios";
import RESPONSE_STATES from "../constants/RESPONSE_STATES";
import VIDEO_OVERLAY_STATE from "../constants/VIDEO_OVERLAY_STATE";
import BUBBLE_TYPES from "../constants/BUBBLE_TYPES";
import EXT_CONFIG from "../constants/EXT_CONFIG";
import ANIM_TYPES from "../constants/ANIM_TYPES";
import SKU_TYPES from "../constants/SKU_TYPES";
import {
  Text as IText,
  Anim as IAnim,
  Bubble as IBubble,
  TwitchAuth as ITwitchAuth
  // Config as IConfig
  // RESPONSE_STATES
} from "../models";

export class VideoOverlayStore {
  @observable videoOverlayState = VIDEO_OVERLAY_STATE.IDLE;
  // @observable streamerConfigStore = streamerConfigStore;

  // @observable addTextInput = "";
  @observable selectedText: IText = { id: "1", text: "CS LUL" };
  @observable selectedBubble: IBubble = { id: "7", bubble: "TYPE_1" };
  @observable selectedAnim: IAnim = { id: "1", animation: "TYPE_1" };
  // @observable selectedAnim = { id: "1", animation: "TYPE_1" };
  @observable products = [];
  @observable bitsPrice = "";
  @observable buyButtonDisabled = false;

  // @observable widgetStore = widgetStore;
  // @action
  // updateAddTextInput(value) {
  //   this.addTextInput = value;
  // }

  // @action
  // addText() {
  //   this.streamerConfigStore.addText(this.addTextInput);
  //   this.addTextInput = "";
  // }

  @action
  setBitsPrice(value) {
    // console.log("KDJPFOISDFPJOFDISJF " + value);
    this.bitsPrice = value;
  }

  @action
  setBuyButtonDisabled(value) {
    this.buyButtonDisabled = value;
    if (value) {
      setTimeout(() => {
        this.setBuyButtonDisabled(false);
        // this.bitsPrice = false;
      }, EXT_CONFIG.WIDGET_DURATION);
    }
  }

  @action
  setState(newState) {
    this.videoOverlayState = newState;
  }

  @action
  selectText(text: IText) {
    this.selectedText = text;
    // this.selectedText = streamerConfigStore.texts.find(text => text.id === id);
    // BUBBLE_TYPES.find(bubble => bubble.id == id);
  }

  @action
  selectBubble(id) {
    this.selectedBubble = BUBBLE_TYPES.find(bubble => bubble.id === id);
    // this.selectedBubble = BUBBLE_TYPES.find(bubble => bubble.id === id);
  }

  @action
  selectAnim(id) {
    this.selectedAnim = ANIM_TYPES.find(anim => anim.id === id);
    // this.selectedAnim = ANIM_TYPES.find(anim => anim.id === id);
  }

  @action
  resetSelected(texts, bubbles, animations) {
    // const { texts, bubbles, animations } = streamerConfigStore;
    // if (texts && bubbles && animations) {
    this.selectText(texts[0].id);
    this.selectBubble(bubbles[0].id);
    this.selectAnim(animations[0].id);
    // }
  }

  @action
  async purchaseText(
    auth: ITwitchAuth,
    displayName: string,
    transactionReceipt
  ) {
    const { channelId, clientId, token, userId } = auth;
    // console.log("purchase");

    if (!transactionReceipt) transactionReceipt = "";
    // console.log("transactionReceipt", transactionReceipt);

    try {
      const config = await axios.post(
        // `${EXT_CONFIG.BUBBLE_TEXT_ENDPOINT}/streamer/${userId}/purchase`,
        `${EXT_CONFIG.BUBBLE_TEXT_ENDPOINT}/api/streamer/${channelId}/purchase`,
        {
          data: {
            text_id: this.selectedText.id.toString(),
            animation_id: this.selectedAnim.id.toString(),
            bubble_id: this.selectedBubble.id.toString(),
            buyer_display_name: displayName, //46365073 //this.streamerConfigStore.auth.userId
            transaction_reciept: transactionReceipt
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
      // console.log("purchase sucсess");

      // this.isConfigFetched = ResponseStates.DONE;
    } catch (error) {
      // this.isConfigFetched = ResponseStates.ERROR;
    }
  }

  @action
  async purchaseTextFree(auth: ITwitchAuth) {
    const { channelId, clientId, token, userId } = auth;
    // console.log("USER ID: " + userId.replace("U", ""));
    try {
      const config = await axios.post(
        `${
          EXT_CONFIG.BUBBLE_TEXT_ENDPOINT
        }/api/streamer/${channelId}/purchase/free`,
        {
          data: {
            text_id: this.selectedText.id.toString(),
            animation_id: this.selectedAnim.id.toString(),
            bubble_id: this.selectedBubble.id.toString(),
            buyer_id: userId.replace("U", "")
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
      // this.isConfigFetched = ResponseStates.ERROR;
    }
  }

  @action
  async getProducts() {
    // const { priceSKU } = streamerConfigStore;

    // console.log("Get products");

    try {
      if (window.Twitch.ext) {
        const products = await window.Twitch.ext.bits.getProducts();

        if (products.status >= 400) {
          throw new Error("Bad response from server");
        }

        // console.log("Products: ");
        // console.log(products);

        // products = [
        //   {
        //     cost: { amount: 50, type: "bits" },
        //     displayName: "Regular text",
        //     sku: "text1"
        //   },
        //   {
        //     cost: { amount: 100, type: "bits" },
        //     displayName: "Regular text",
        //     sku: "text100"
        //   },
        //   {
        //     cost: { amount: 150, type: "bits" },
        //     displayName: "Regular text",
        //     sku: "text150"
        //   }
        // ];

        this.products = products;
      } else {
        throw new Error("Failed to get products");
      }

      // console.log("purchase sucсess");

      // this.isConfigFetched = ResponseStates.DONE;
    } catch (error) {
      // console.log(error);
      // this.isConfigFetched = ResponseStates.ERROR;
    }
  }
}

const videoOverlayStore = new VideoOverlayStore();

export { videoOverlayStore };
