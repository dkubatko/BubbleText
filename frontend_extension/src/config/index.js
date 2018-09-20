// Core libs
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";

// import commonCSS from "./../styles.css";
import configStore from "../stores/configStore";
import Config from "./Config";

const mainElement = document.getElementById("extension-root");

ReactDOM.render(
  <Provider configStore={configStore}>
    <Config />
  </Provider>,
  mainElement
);
