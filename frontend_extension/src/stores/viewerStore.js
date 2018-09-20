import { observable, action } from "mobx";
import streamerConfigStore from "./streamerConfigStore";
import axios from "axios";
import RESPONSE_STATES from "../constants/RESPONSE_STATES";

class ViewerStore {
  @observable streamerConfigStore = streamerConfigStore;
  // @observable addTextInput = "";

  // @action
  // updateAddTextInput(value) {
  //   this.addTextInput = value;
  // }

  // @action
  // addText() {
  //   this.streamerConfigStore.addText(this.addTextInput);
  //   this.addTextInput = "";
  // }
}

const viewerStore = new ViewerStore();

export default viewerStore;
export { ViewerStore };
