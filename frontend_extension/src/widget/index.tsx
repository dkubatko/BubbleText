// Core libs
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
// import { useStrict } from "mobx";

// import widgetStore from "../stores/widgetStore";
import { stores } from "../stores";
import { Widget } from "./Widget";

// enable MobX strict mode
// useStrict(true);

// const auth = {
//   channelId: "drazzzer",
//   clientId: "5pogkiewjnqz3f2lydhxwqqxncbpx8",
//   token:
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTUxNzY4MDAsIm9wYXF1ZV91c2VyX2lkIjoiVVJJR2RyYXp6emVyIiwiY2hhbm5lbF9pZCI6ImRyYXp6emVyIiwicm9sZSI6ImJyb2FkY2FzdGVyIiwicHVic3ViX3Blcm1zIjp7Imxpc3RlbiI6WyJicm9hZGNhc3QiXSwic2VuZCI6WyIqIl19LCJ1c2VyX2lkIjoiUklHZHJhenp6ZXIiLCJpYXQiOjE1MjM2NDA4MDB9.8fm-S3o1G5J2iSMkYfo-XMMIr1PYblfRUoVEOxlIFqc",
//   userId: "URIGdrazzzer"
// };

// widgetStore.streamerConfigStore.getConfig(auth);

ReactDOM.render(
  // <Provider widgetStore={widgetStore}>
  <Provider {...stores}>
    <Widget />
  </Provider>,
  document.getElementById("extension-root")
);
