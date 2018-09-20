import { observable, action } from "mobx";
import EXT_CONFIG from "../constants/EXT_CONFIG";
import { getScalableSize } from "../utils/getScalableSize";

export class WidgetStore {
  // @observable streamerConfigStore = streamerConfigStore;

  @observable donationQueue = []; // donation queue if anything exist -> show
  @observable playingDonation = false;
  @observable currentDonation = null;
  @observable preview = false;
  @observable scale = 0;

  bubbleEndTimout = null;
  nextBubbleTimout = null;

  @action
  updateScale(winWidth, winHeight) {
    const size = getScalableSize({
      width: 800,
      height: 450,
      maxWidth: winWidth,
      maxHeight: winHeight
    });

    this.scale = size.ratio * 3.4;
    // console.log(this.scale);
  }

  @action
  addNewBubble(donationData, onBubbleEndCallback = () => {}) {
    // console.log("Add new bubble");
    this.donationQueue.push(donationData);
    // console.log("donation queue");
    // console.log(this.donationQueue.slice());

    this.showNextBubble(onBubbleEndCallback);
  }

  @action
  showNextBubble(onBubbleEndCallback = () => {}) {
    // console.log("Show next bubble");
    if (!this.playingDonation && this.donationQueue.length !== 0) {
      // console.log("donation queue");
      // console.log(this.donationQueue.slice());

      this.playingDonation = true;
      this.currentDonation = this.donationQueue[0];
      this.donationQueue.splice(0, 1);
      // console.log("donation queue");
      // console.log(this.donationQueue.slice());
      this.bubbleEndTimout = setTimeout(() => {
        this.onBubbleEnd(onBubbleEndCallback);
      }, this.preview ? EXT_CONFIG.PREVIEW_WIDGET_DURATION : EXT_CONFIG.WIDGET_DURATION);
    } else {
      if (this.playingDonation) {
        // console.log("Bubble already playing");
      }
      if (this.donationQueue.length === 0) {
        // console.log("No bubbles in queue");
      }
    }
  }

  @action
  onBubbleEnd(onBubbleEndCallback = () => {}) {
    this.playingDonation = false;
    this.currentDonation = null;
    if (this.donationQueue.length !== 0) {
      this.nextBubbleTimout = setTimeout(() => {
        this.showNextBubble();
      }, this.preview ? EXT_CONFIG.PREVIEW_WIDGET_DELAY_BEFORE_NEXT_BUBBLE : EXT_CONFIG.WIDGET_DELAY_BEFORE_NEXT_BUBBLE);
    }

    onBubbleEndCallback();
  }

  @action
  setPreview(value) {
    this.preview = value;
  }

  @action
  removeCurrentBubble() {
    this.playingDonation = false;
    clearTimeout(this.currentDonation);
    clearTimeout(this.bubbleEndTimout);
    this.donationQueue = [];
  }
}

const widgetStore = new WidgetStore();

export { widgetStore };
