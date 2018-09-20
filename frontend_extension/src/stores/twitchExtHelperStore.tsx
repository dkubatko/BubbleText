import { observable, action } from "mobx";
import {
  TwitchAuth as ITwitchAuth,
  TwitchContext as ITwitchContext,
  RESPONSE_STATES
} from "../models";

let lastScale = 0;
// let extRootouterWidth = extensionRoot.outerWidth();
// let extRootOuterHeight = extensionRoot.outerHeight();

export class TwitchExtHelperStore {
  @observable auth: ITwitchAuth = null;
  @observable context: ITwitchContext;
  @observable changedContextFields: string[];
  @observable products;
  @observable scale: number = 1;

  @observable isAuthFetched: RESPONSE_STATES = RESPONSE_STATES.UNDEFINED;
  @observable isProductsFetched: RESPONSE_STATES = RESPONSE_STATES.UNDEFINED;

  constructor() {
    if (window.Twitch && window.Twitch.ext) {
      window.Twitch.ext.onAuthorized(this.onAuthorized);
      window.Twitch.ext.onContext(this.onContext);
      window.Twitch.ext.bits.onTransactionComplete(transaction => {
        // console.log("transaction complete");
        // console.log("Transaction: ");
        // console.log(transaction);
        // console.log(transaction.transactionReceipt);
        // videoOverlayStore.setBuyButtonDisabled(true);
        // if (transaction.initiator.toLowerCase() === "current_user") {
        //   videoOverlayStore.purchaseText(
        //     streamerConfigStore.auth,
        //     transaction.displayName,
        //     transaction.transactionReceipt
        //   );
        // }
      });

      window.Twitch.ext.onError(err => {
        // console.error("error", err);
      });
    }
  }

  @action
  onAuthorized(auth: ITwitchAuth) {
    // console.log("Twitch Ext Helper Store auth: ", auth);

    this.auth = auth;
    this.isAuthFetched = RESPONSE_STATES.DONE;
  }

  @action
  onContext(context: ITwitchContext, changedContextFields: string[]) {
    // console.log(context);
    // console.log(changedContextFields);

    this.context = context;
    this.changedContextFields = changedContextFields;
  }

  @action
  setContextFields(context) {
    this.context = context;
    const displayResolution = this.context.displayResolution
      .split("x")
      .map(Number);
    // console.log(displayResolution);
    // .outerHeight();
    // document.getElementById("extension-root").outerWidth();
    // console.log("Outer width: " + extRootouterWidth);
    // console.log(extensionRoot.outerWidth());
    const newScale: number = Number(
      Math.min(
        displayResolution[0] / 1920,
        displayResolution[1] / 1080
      ).toFixed(2)
    );

    // console.log("New scale " + newScale);

    if (newScale !== lastScale) {
      this.scale = newScale * 1.3;
      lastScale = this.scale;
    }
  }
}

const twitchExtHelperStore = new TwitchExtHelperStore();

export { twitchExtHelperStore };
