// Core libs
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";

// import commonCSS from "./../styles.css";
// import videoOverlayStore from "../stores/videoOverlayStore";
// import twitchExtHelperStore from "../stores/twitchExtHelperStore";
import { stores } from "../stores";
import { VideoOverlay } from "./VideoOverlay";

const mainElement = document.getElementById("extension-root");

ReactDOM.render(
  <Provider {...stores}>
    <VideoOverlay />
  </Provider>,
  document.getElementById("extension-root")
);
