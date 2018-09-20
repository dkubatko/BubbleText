import * as React from "react";
import { observer, inject } from "mobx-react";
import WidgetDonation from "../components/WidgetDonation";
import { injectGlobal } from "styled-components";
import { WidgetStore } from "../stores/widgetStore";
import { StreamerConfigStore } from "../stores/streamerConfigStore";
import soundManager from "soundManager";
import { Text } from "../models";

import { UNSELECTED, THEME_COLOR } from "../styles/common";
import io from "socket.io-client";
import EXT_CONFIG from "../constants/EXT_CONFIG";
const socket = io(EXT_CONFIG.BUBBLE_TEXT_ENDPOINT);
import blobSound from "../audio/bubbleAppearSound.mp3";
import BurbankBigCondensedBlackWoff from "../fonts/Burbank/BurbankBigCondensed-Black.woff";

export interface Props {
  widgetStore?: WidgetStore;
  streamerConfigStore?: StreamerConfigStore;
  // editing?: boolean;
  // onSave: (text: string) => any;
}

export interface State {
  // text: string;
}

let appearSound;

soundManager.setup({
  onready: () => {
    appearSound = soundManager.createSound({
      url: blobSound
    });
    // SM2 has loaded, API ready to use e.g., createSound() etc.
  }
});

@inject("widgetStore", "streamerConfigStore")
@observer
export class Widget extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    // this.onPlayDonationEnd = this.onPlayDonationEnd.bind(this);
  }

  componentDidMount() {
    const { widgetStore, streamerConfigStore } = this.props;

    widgetStore.updateScale(window.innerWidth, window.innerHeight);
    window.onresize = value => {
      widgetStore.updateScale(window.innerWidth, window.innerHeight);
      // console.log("REsize");
      // console.log(window.innerWidth);
      // console.log(window.innerHeight);
    };

    socket.once("connect", () => {
      // socket.emit("sync", { "id": {{ streamer_id }} });
      socket.emit("sync", { id: streamerId }, streamerConfig => {
        // console.log("config");
        // console.log(streamerConfig);
        streamerConfigStore.setConfigData(streamerConfig);
      });

      socket.on("update", data => {
        // alert("Recieved data");
        // console.log("donation recieved");
        // console.log(data);
        widgetStore.addNewBubble(data.data);
      });
    });
  }

  render() {
    const { widgetStore, streamerConfigStore } = this.props;
    const { playingDonation, currentDonation, scale } = widgetStore;
    const { texts } = streamerConfigStore;

    let text: Text = { id: "1", text: "Test text" };
    if (texts.length !== 0 && currentDonation) {
      text = texts.find(text => text.id === currentDonation.text_id);
    }
    // console.log(texts.slice());
    // console.log(currentDonation);
    // console.log(playingDonation);

    if (playingDonation) {
      // blobAudio.play();
      appearSound.play();

      return (
        <WidgetDonation
          // loop={false}
          preview={false}
          scale={scale}
          nickname={currentDonation.buyer_display_name}
          text={text.text}
          bubbleId={currentDonation.bubble_id}
          animId={currentDonation.animation_id}
        />
      );
    }

    return null;
  }
}

/* tslint:disable */
injectGlobal`
  * {
    overflow: hidden;
  }
  
  html {
    width: 100%;
    height: 100%;
  }

  body {
    width: 100%;
    height: 100%;
  }

  @font-face {
    font-family: BurbankBigCondensed-Black;
    src: url('${BurbankBigCondensedBlackWoff}') format("woff");
    font-weight: normal;
    font-style: normal;
    font-stretch: normal; 
  }
  
  * {
    font-family: BurbankBigCondensed-Black, sans-serif;
    /* font-weight: bold; */
    font-style: normal;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 1px;
    /* -webkit-backface-visibility: hidden; */
    /* -webkit-transform: translateZ(0); */
    /* transform: perspective(1px); */
    text-transform: uppercase;
    /* outline: 1px solid transparent; */
    font-smoothing: antialiased;
  }

  *:focus {
    outline: none;
  }

  *::selection {
    background-color: ${EXT_CONFIG.MAIN_COLOR};
  }

 body {
    /* font-family: Poppins, Arial, sans-serif; */
    /* background-color: #00ff00; */
    font-size: 14px;
    font-weight: normal;
    color: black;
    text-align: left;
    padding: 0;
    margin: 0;
    /* backface-visibility: hidden; */
  }

  #extension-root {
    width: 100%;
    height: 100%;
  }
`;
