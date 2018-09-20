// Libs
import * as React from "react";
import { observer, inject } from "mobx-react";
import styled from "styled-components";

// Components
import { Container as CommonContainer } from "../styles";
import Text from "../components/Text";
import Switch from "../components/Switch";
import MenuButton from "../components/MenuButton";
import BubbleType from "../components/BubbleType";
import AnimType from "../components/AnimType";
import { DonationMenu } from "../components/DonationMenu";

// Consts
import { VideoOverlayStore } from "../stores/videoOverlayStore";
import { StreamerConfigStore } from "../stores/streamerConfigStore";
import { TwitchExtHelperStore } from "../stores/twitchExtHelperStore";
import EXT_CONFIG from "../constants/EXT_CONFIG";
import BUBBLE_TYPES from "../constants/BUBBLE_TYPES";
import ANIM_TYPES from "../constants/ANIM_TYPES";
import SKU_TYPES from "../constants/SKU_TYPES";
import RESPONSE_STATES from "../constants/RESPONSE_STATES";
import VIDEO_OVERLAY_STATE from "../constants/VIDEO_OVERLAY_STATE";

export interface Props {
  videoOverlayStore?: VideoOverlayStore;
  streamerConfigStore?: StreamerConfigStore;
  twitchExtHelperStore?: TwitchExtHelperStore;
  // onSave: (text: string) => any;
}

export interface State {
  // text: string;
}

@inject("videoOverlayStore", "streamerConfigStore", "twitchExtHelperStore")
@observer
export class VideoOverlay extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
  }

  componentDidMount() {
    const {
      videoOverlayStore,
      streamerConfigStore,
      twitchExtHelperStore
    } = this.props;
    // const { streamerConfigStore } = videoOverlayStore;
    // const { twitchExtHelperStore } = this.props;

    if (window.Twitch.ext) {
      window.Twitch.ext.onAuthorized(auth => {
        // console.log("auth", auth);
        // console.log("channel id: ", auth.channelId);

        // test auth
        // auth = {
        //   channelId: "43665292",
        //   clientId: "5pogkiewjnqz3f2lydhxwqqxncbpx8",
        //   token:
        //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTQ3OTA5NTYsIm9wYXF1ZV91c2VyX2lkIjoiVVJJR2RyYXp6emVyIiwiY2hhbm5lbF9pZCI6ImRyYXp6emVyIiwicm9sZSI6ImJyb2FkY2FzdGVyIiwicHVic3ViX3Blcm1zIjp7Imxpc3RlbiI6WyJicm9hZGNhc3QiXSwic2VuZCI6WyIqIl19LCJ1c2VyX2lkIjoiUklHZHJhenp6ZXIiLCJpYXQiOjE1MjMyNTQ5NTZ9.XUnPgBDxoHo9N9i1SToBIXsUv39AftPtAp653NVKltM",
        //   userId: "URIGdrazzzer"
        // };

        streamerConfigStore.getConfig(auth);
      });

      window.Twitch.ext.onContext((context, contextFields) => {
        // console.log(context);
        // console.log("contextFields", contextFields);

        twitchExtHelperStore.setContextFields(context);
      });

      window.Twitch.ext.bits.onTransactionComplete(transaction => {
        // console.log("transaction complete");
        // console.log("Transaction: ");
        // console.log(transaction);
        // console.log(transaction.transactionReceipt);

        videoOverlayStore.setBuyButtonDisabled(true);

        if (transaction.initiator.toLowerCase() === "current_user") {
          videoOverlayStore.purchaseText(
            streamerConfigStore.auth,
            transaction.displayName,
            transaction.transactionReceipt
          );
        }
      });

      window.Twitch.ext.onError(err => {
        // console.error("error", err);
      });
    }
  }

  onMenuButtonClick = () => {
    const { videoOverlayStore, streamerConfigStore } = this.props;
    const { videoOverlayState } = videoOverlayStore;
    const { texts, bubbles, animations } = streamerConfigStore;

    switch (videoOverlayState) {
      case VIDEO_OVERLAY_STATE.IDLE:
        videoOverlayStore.setState(VIDEO_OVERLAY_STATE.DONATION_CONFIG_OPENED);
        videoOverlayStore.resetSelected(texts, bubbles, animations);
        break;
      case VIDEO_OVERLAY_STATE.DONATION_CONFIG_OPENED:
        videoOverlayStore.setState(VIDEO_OVERLAY_STATE.IDLE);
        break;

      default:
        videoOverlayStore.setState(VIDEO_OVERLAY_STATE.IDLE);
        break;
    }
  };

  onClickUseBits = () => {
    const { videoOverlayStore, streamerConfigStore } = this.props;
    // const { streamerConfigStore } = videoOverlayStore;
    const { priceSKU, auth } = streamerConfigStore;
    const { userId, channelId } = auth;

    if (
      (userId && channelId && channelId === userId.replace("U", "")) ||
      priceSKU === SKU_TYPES.price_sku_free
    ) {
      videoOverlayStore.purchaseTextFree(auth);
      videoOverlayStore.setBuyButtonDisabled(true);
    } else {
      if (window.Twitch.ext) {
        // console.log("SKU: " + priceSKU);
        // window.Twitch.ext.bits.setUseLoopback(true);
        window.Twitch.ext.bits.useBits(priceSKU);
      }
    }
  };

  render() {
    const {
      streamerConfigStore,
      videoOverlayStore,
      twitchExtHelperStore
    } = this.props;
    const { videoOverlayState } = videoOverlayStore;
    const { scale } = twitchExtHelperStore;
    const { isConfigFetched } = streamerConfigStore;
    // console.log("SCALE " + scale);

    return (
      <Container
      // scale={scale}
      >
        <Switch state={videoOverlayState}>
          <MenuButton
            scale={scale}
            caseState={"any"}
            configFetched={streamerConfigStore.isConfigFetched}
            onClick={this.onMenuButtonClick}
          />
          <DonationMenu
            scale={scale}
            caseState={VIDEO_OVERLAY_STATE.DONATION_CONFIG_OPENED}
            onClickUseBits={this.onClickUseBits}
          />
        </Switch>
      </Container>
    );
  }
}

export const Container = styled(CommonContainer)`
  display: flex;
  flex-direction: row;
  padding: 100px 0 0 20px;
  width: 100%;
  height: 100%;
  ${"" /* transform: perspective(1px) scale(${props => props.scale * 1.2}); */} transform-origin: left top;
`;

export const InnerContainer = styled.div`
  ${"" /* transform: scale(${props => props.scale}); */};
`;
