// import React from "react";
import * as React from "react";
// import ReactDOM from "react-dom";
import { observer, inject } from "mobx-react";
import styled from "styled-components";
import Lottie from "./Lottie";

import Text from "./Text";
import WidgetDonation from "./WidgetDonation";
import BubbleType from "./BubbleType";
import AnimType from "./AnimType";
import EXT_CONFIG from "../constants/EXT_CONFIG";
import {
  // DonationButton,
  // DonateAnimContainer,
  Button,
  FlexRow,
  SectionHeader,
  Container,
  THEME_COLOR
  // DonationManuContainer,
  // DonationBitsImage
} from "../styles";
import * as birthdayAnim from "../animations/happyBirthday.json";
import images from "../images";
import SKU_TYPES from "../constants/SKU_TYPES";
import VIDEO_OVERLAY_STATE from "../constants/VIDEO_OVERLAY_STATE";

import { VideoOverlayStore } from "../stores/videoOverlayStore";
import { StreamerConfigStore } from "../stores/streamerConfigStore";
import { TwitchExtHelperStore } from "../stores/twitchExtHelperStore";
import { WidgetStore } from "../stores/widgetStore";

const testBubbleData = {
  animation_id: "1",
  bubble_id: "0",
  buyer_display_name: "Ciberus",
  text_id: "0"
};

let addNewBubbleTimeout = null;

export interface Props {
  videoOverlayStore?: VideoOverlayStore;
  streamerConfigStore?: StreamerConfigStore;
  twitchExtHelperStore?: TwitchExtHelperStore;
  widgetStore?: WidgetStore;
  onClickUseBits: Function;
  scale: number;
  hidden?: boolean;
  caseState: VIDEO_OVERLAY_STATE;
}

export interface State {}

@inject(
  "videoOverlayStore",
  "streamerConfigStore",
  "twitchExtHelperStore",
  "widgetStore"
)
@observer
export class DonationMenu extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = { mainColorOpened: false, additionalColorOpened: false };

    this.onClickDonateBubbleText = this.onClickDonateBubbleText.bind(this);
    this.onClickBubbleType = this.onClickBubbleType.bind(this);
    this.onClickAnimType = this.onClickAnimType.bind(this);
    this.onClickText = this.onClickText.bind(this);
    this.onBubbleEnd = this.onBubbleEnd.bind(this);
  }

  componentDidMount() {
    const { videoOverlayStore, widgetStore } = this.props;
    const { buyButtonDisabled } = videoOverlayStore;

    widgetStore.setPreview(true);
    this.onBubbleEnd();

    videoOverlayStore.getProducts();
  }

  onBubbleEnd = () => {
    const { videoOverlayStore, widgetStore } = this.props;

    clearTimeout(addNewBubbleTimeout);
    addNewBubbleTimeout = setTimeout(() => {
      widgetStore.addNewBubble(testBubbleData, this.onBubbleEnd);
    }, EXT_CONFIG.PREVIEW_WIDGET_DELAY_BEFORE_NEXT_BUBBLE);
  };

  onClickBubbleType = id => {
    const { videoOverlayStore, widgetStore } = this.props;

    videoOverlayStore.selectBubble(id);
    widgetStore.removeCurrentBubble();

    this.onBubbleEnd();
  };

  onClickAnimType = id => {
    const { videoOverlayStore, widgetStore } = this.props;

    videoOverlayStore.selectAnim(id);
    widgetStore.removeCurrentBubble();

    this.onBubbleEnd();
  };

  onClickText = id => {
    const { videoOverlayStore, streamerConfigStore, widgetStore } = this.props;

    videoOverlayStore.selectText(
      streamerConfigStore.texts.find(text => text.id === id)
    );
    widgetStore.removeCurrentBubble();

    this.onBubbleEnd();
  };

  onClickDonateBubbleText() {
    const {
      videoOverlayStore,
      streamerConfigStore,
      onClickUseBits
    } = this.props;
    const { priceSKU } = streamerConfigStore;

    onClickUseBits();
  }

  renderWidgetPreview(playingDonation, text, bubbleId, animId, scale) {
    if (playingDonation) {
      return (
        <WidgetDonation
          // loop={true}
          preview={true}
          scale={1 * scale}
          // nickname={auth.channelId}
          nickname={"Your username"}
          text={text}
          bubbleId={bubbleId}
          animId={animId}
        />
      );
    }

    return null;
  }

  renderBoostAmount(bitsPrice) {
    // const { scale } = this.props;
    const { streamerConfigStore, twitchExtHelperStore } = this.props;
    const { scale, auth } = twitchExtHelperStore;
    const { priceSKU } = streamerConfigStore;
    // const { channelId, userId } = auth;

    // console.log(
    //   "TEST: " + (userId && channelId && channelId == userId.replace("U", ""))
    // );

    // if (userId && channelId && channelId == userId.replace("U", ""))
    //   return <BoostAmountContainer>Test</BoostAmountContainer>;

    if (priceSKU === SKU_TYPES.price_sku_free) {
      return <BoostAmountContainer>Boost streamer</BoostAmountContainer>;
    }

    return (
      <BoostAmountContainer>
        Boost streamer
        <DonationBitsImage scale={scale} src={images.bits} />
        {bitsPrice}
      </BoostAmountContainer>
    );
  }

  render() {
    const {
      hidden,
      videoOverlayStore,
      streamerConfigStore,
      widgetStore,
      scale
    } = this.props;
    const {
      selectedText,
      selectedBubble,
      selectedAnim,
      products,
      bitsPrice,
      buyButtonDisabled
    } = videoOverlayStore;
    const { auth, priceSKU } = streamerConfigStore;
    const { playingDonation } = widgetStore;

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: birthdayAnim,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    // if (priceSKU == SKU_TYPES.price_sku_free) {
    //   console.log(
    //     "SET BITS PRICE FREE " + (priceSKU == SKU_TYPES.price_sku_free)
    //   );
    //   this.setBitsPrice("FREE");
    // } else {
    //   if (this.products.length != 0) {
    //     console.log(this.products.slice());
    //     console.log(priceSKU);

    //     const cost = this.products.find(product => product.sku == priceSKU)
    //       .cost.amount;
    //     this.setBitsPrice(cost);
    //   }
    // }

    if (priceSKU === SKU_TYPES.price_sku_free) {
      videoOverlayStore.setBitsPrice("Boost streamer");
    } else {
      if (products.length !== 0 && priceSKU) {
        // console.log(products.slice());
        // console.log(priceSKU);

        const cost = products.slice().find(product => product.sku === priceSKU)
          .cost.amount;
        videoOverlayStore.setBitsPrice(cost);
      }
    }

    return (
      <DonationManuContainer scale={scale} hidden={hidden}>
        <WidgetPreviewContainer scale={scale}>
          {this.renderWidgetPreview(
            playingDonation,
            selectedText.text,
            selectedBubble.id,
            selectedAnim.id,
            scale
          )}
        </WidgetPreviewContainer>

        <SectionHeader scale={0.7 * scale}>Choose text:</SectionHeader>
        <FlexRowCentered scale={0.4 * scale}>
          {streamerConfigStore.texts.map(text => {
            return (
              <Text
                key={text.id}
                scale={0.85 * scale}
                id={text.id}
                value={text.text}
                selected={text.id === selectedText.id}
                removable={false}
                //  selected={bubble.id == selectedBubble.id}
                onClick={this.onClickText}
              />
            );
          })}
        </FlexRowCentered>

        <SectionHeader scale={0.7 * scale}>Choose bubble:</SectionHeader>
        <FlexRowCentered scale={0.4 * scale}>
          {streamerConfigStore.bubbles.map(bubble => {
            return (
              <BubbleType
                key={bubble.id}
                scale={0.4 * scale}
                id={bubble.id}
                selected={bubble.id === selectedBubble.id}
                onClickBubbleType={this.onClickBubbleType}
              />
            );
          })}
        </FlexRowCentered>

        <SectionHeader scale={0.7 * scale}>Choose animation:</SectionHeader>
        <FlexRowCentered scale={0.4 * scale}>
          {streamerConfigStore.animations.map(anim => {
            return (
              <AnimType
                key={anim.id}
                id={anim.id}
                scale={0.4 * scale}
                selected={anim.id === selectedAnim.id}
                onClickAnimType={this.onClickAnimType}
              />
            );
          })}
        </FlexRowCentered>

        <DonationButton
          scale={scale}
          disabled={buyButtonDisabled}
          onClick={this.onClickDonateBubbleText}
        >
          {/* <DonateAnimContainer> */}
          {this.renderBoostAmount(bitsPrice)}
          {/* <Lottie options={defaultOptions} width={50} height={24} /> */}
          {/* </DonateAnimContainer> */}
        </DonationButton>
      </DonationManuContainer>
    );
  }
}

export const BoostAmountContainer = styled.div`
  display: inline-block;
`;

export const FlexRowCentered = styled(FlexRow)`
  justify-content: center;
`;

export const WidgetPreviewContainer = styled.div`
  width: ${props => props.scale * 200}px;
  height: ${props => props.scale * 150}px;
  min-height: ${props => props.scale * 150}px;
  backface-visibility: hidden;
`;

export const DonationManuContainer = styled(Container)`
  position: relative;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: middle;
  padding: 0px ${props => props.scale * 10}px;
  ${"" /* background-color: ${props => props.theme.BACKGROUND}; */}
  background-color: ${THEME_COLOR};
  margin: 0px ${props => props.scale * 20}px;
  height: ${props => props.scale * 450}px;
  width: ${props => props.scale * 400}px;
  border: ${props => props.scale * 2}px solid ${EXT_CONFIG.MAIN_COLOR};
  border-radius: ${props => props.scale * 16}px;
  display: ${props => (props.hidden ? "none" : "flex")};
`;

export const DonationBitsImage = styled.img`
  position: relative;
  display: inline-block;
  width: ${props => props.scale * 18}px;
  height: ${props => props.scale * 24}px;
  margin-left: ${props => props.scale * 10}px;
  margin-right: ${props => props.scale * 4}px;
  top: ${props => props.scale * 2}px;
`;

export const DonateAnimContainer = styled.div`
  display: inline-block;
`;

export const DonationButton = styled(Button)`
  width: 90%;
  height: ${props => props.scale * 46}px;
  margin-bottom: ${props => props.scale * 6}px;
  margin-top: ${props => props.scale * 6}px;
  font-size: ${props => props.scale * 24}px;

  background: ${props =>
    props.disabled
      ? "grey"
      : `linear-gradient(
    -45deg,
    ${EXT_CONFIG.ADDITIONAL_COLOR},
    ${EXT_CONFIG.MAIN_COLOR}
  );`};
`;
