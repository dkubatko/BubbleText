import React from "react";
import ReactDOM from "react-dom";
import { observer, inject } from "mobx-react";
// import Lottie from "./Lottie";
import Lottie from "../components/Lottie";
import styled, { keyframes } from "styled-components";

import EXT_CONFIG from "../constants/EXT_CONFIG";
import getBubbleImageById from "../utils/getBubbleImageById";
import getAnimDataById from "../utils/getAnimDataById";

let popOutTimeout = null;
let lottiedDurationTimout = null;

@observer
class WidgetDonation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inAnimHalfPlayed: false,
      inAnimPlayed: false,
      popOutAnim: false
    };
    // this.onPlayDonationEnd = this.onPlayDonationEnd.bind(this);
    this.onLottieDurationRecieved = this.onLottieDurationRecieved.bind(this);
  }

  componentDidMount() {
    const { preview } = this.props;
    // console.log("compoenent did mount");

    let popOutAnimTimeout =
      EXT_CONFIG.WIDGET_DURATION - EXT_CONFIG.BUBBLE_POPIN_ANIM_DURATION * 2000;
    if (preview)
      popOutAnimTimeout =
        EXT_CONFIG.PREVIEW_WIDGET_DURATION -
        EXT_CONFIG.BUBBLE_POPIN_ANIM_DURATION * 2000;

    // console.log("popOutAnimTimeout: " + popOutAnimTimeout);

    popOutTimeout = setTimeout(() => {
      // this.onBubbleEnd();
      this.setState({ popOutAnim: true });
    }, popOutAnimTimeout);

    // setTimeout(() => {
    //   // this.onBubbleEnd(onBubbleEnd);
    //   this.setState({ popOutAnim: true });
    // }, preview ? EXT_CONFIG.PREVIEW_WIDGET_DURATION : EXT_CONFIG.WIDGET_DURATION);

    // console.log(
    //   EXT_CONFIG.WIDGET_DURATION - EXT_CONFIG.BUBBLE_POPIN_ANIM_DURATION * 1000
    // );
  }

  componentWillUnmount() {
    clearTimeout(popOutTimeout);
    clearTimeout(lottiedDurationTimout);
  }

  onLottieDurationRecieved = duration => {
    // console.log("DURATION: " + duration);
    // console.log(duration * 1000 / 2);

    lottiedDurationTimout = setTimeout(() => {
      this.setState({ inAnimHalfPlayed: true });
    }, duration * 1000 / 2);
  };

  renderInAnim(animOptions, scale) {
    const { inAnimPlayed } = this.state;

    if (!inAnimPlayed) {
      return (
        <Lottie
          options={animOptions}
          width={200 * scale}
          height={150 * scale}
          onAnimationLoadedGetDuration={this.onLottieDurationRecieved}
          eventListeners={[
            {
              eventName: "complete",
              callback: () => {
                this.setState({ inAnimPlayed: true });
              }
            }
          ]}
        />
      );
    } else {
      return null;
    }
  }

  renderBubbleAnimContainer(scale, bubbleImage, nickname, text) {
    const { inAnimHalfPlayed, inAnimPlayed, popOutAnim } = this.state;
    // console.log("nickname", nickname);

    if (nickname == "" || nickname == undefined || nickname == null)
      nickname = "Someone";

    if (!popOutAnim) {
      return (
        <BubbleContainer playPopInAnim={inAnimHalfPlayed} scale={scale}>
          <BubbleImage scale={scale} src={bubbleImage} />
          <BubbleTextContainer scale={scale}>
            <BubbleNickname scale={scale}>{nickname}:</BubbleNickname>
            <BubbleText scale={scale}>{text}</BubbleText>
          </BubbleTextContainer>
        </BubbleContainer>
      );
    } else {
      // this.bubbleContainerOutRef.
      return (
        <BubbleContainerOut
          // ref={this.bubbleContainerOutRef}
          scale={scale}
        >
          <BubbleImage scale={scale} src={bubbleImage} />
          <BubbleTextContainer scale={scale}>
            <BubbleNickname scale={scale}>{nickname}:</BubbleNickname>
            <BubbleText scale={scale}>{text}</BubbleText>
          </BubbleTextContainer>
        </BubbleContainerOut>
      );
    }
  }

  render() {
    const {
      scale,
      bubbleId,
      animId,
      nickname,
      text // loop,
    } = this.props;
    const { inAnimPlayed, popOutAnim } = this.state;

    const bubbleImage = getBubbleImageById(bubbleId);
    const animation = getAnimDataById(animId);
    // console.log("something");

    // const previewOptions = {
    //   loop: false,
    //   autoplay: true,
    //   animationData: animation,
    //   rendererSettings: {
    //     preserveAspectRatio: "xMidYMid slice"
    //   }
    // };

    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: animation,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    // console.log("inAnimPlayed: " + inAnimPlayed + " popOutAnim: " + popOutAnim);

    return (
      <WidgetDonationContainer scale={scale}>
        {this.renderBubbleAnimContainer(scale, bubbleImage, nickname, text)}

        <BubbleAppearAnimContainer scale={scale}>
          {this.renderInAnim(defaultOptions, scale)}
          {/* loop ? previewOptions : defaultOptions,  */}
        </BubbleAppearAnimContainer>
      </WidgetDonationContainer>
    );
  }
}

// WidgetDonation
export const popInAnim = keyframes`
  0% {
    transform: perspective(1px) scale(0);
  }
  75% {
    transform: perspective(1px) scale(1.2);
  }
  100% {
    transform: perspective(1px) scale(1);
  }
`;

export const popOutAnim = keyframes`
  0% {
    transform: perspective(1px) scale(1);
  }
  25% {
    transform: perspective(1px) scale(1.2);
  }
  100% {
    transform: perspective(1px) scale(0);
  }
`;

export const BubbleAppearAnimContainer = styled.div`
  position: absolute;
  ${"" /* width: ${props => props.scale * 200}px; */} ${"" /* height: ${props => props.scale * 150}px; */}
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  top: 0;
  animation-fill-mode: forwards;
`;

export const WidgetDonationContainer = styled.div`
  position: relative;
  justify-items: center;
  align-items: center;
  align-self: center;
  ${"" /* width: ${props => props.scale * 200}px; */} ${"" /* height: ${props => props.scale * 150}px; */}
  width: 100%;
  height: 100%;
  backgroundcolor: #19171c;
  text-align: center;
`;

export const BubbleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  ${"" /* width: ${props => props.scale * 200}px; */}
  ${"" /* height: ${props => props.scale * 150}px; */}
  animation: ${popInAnim} ${EXT_CONFIG.BUBBLE_POPIN_ANIM_DURATION}s ease-in 1;
  animation-play-state: ${props =>
    props.playPopInAnim ? "running" : "paused"};
`;

export const BubbleContainerOut = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${"" /* width: ${props => props.scale * 200}px; */} ${"" /* height: ${props => props.scale * 150}px; */}
  width: 100%;
  height: 100%;
  animation: ${popOutAnim} ${EXT_CONFIG.BUBBLE_POPIN_ANIM_DURATION}s ease-in 1;
  animation-fill-mode: forwards;
  ${"" /* ${props => } */} ${"" /* animation-play-state: ${props =>
    props.playPopInAnim ? "running" : "paused"}; */};
`;

export const BubbleImage = styled.img`
  width: ${props => props.scale * 150 * 0.5}px;
  height: ${props => props.scale * 150 * 0.5}px;
`;

export const BubbleTextContainer = styled.div`
   position: absolute; 
  ${"" /* top: ${props => props.scale * 44}px; */}
  ${"" /* left: ${props => props.scale * 40}px; */}
  ${"" /* font-size: ${props => props.scale * 10}px; */}
  width: ${props => props.scale * 66}px;
  height: ${props => props.scale * 46}px;
  ${"" /* padding: 0 ${props => props.scale * 4}px; */}
  ${"" /* color: black;  */}
  color: white;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  text-stroke: 1px black;
  margin-top: ${props => props.scale * -4}px;
  text-shadow: -${props => props.scale * 0.5}px -${props =>
  props.scale * 0.5}px 0 #000, ${props => props.scale * 0.5}px -${props =>
  props.scale * 0.5}px 0 #000, -${props => props.scale * 0.5}px ${props =>
  props.scale * 0.5}px 0 #000, ${props => props.scale * 0.5}px ${props =>
  props.scale * 0.5}px 0 #000;
  ${"" /* outline: 1px solid black; */}
`;

export const BubbleNickname = styled.div`
  font-size: ${props => props.scale * 8}px;
  ${"" /* font-family: Radiance, Arial, sans-serif; */};
`;

export const BubbleText = styled.div`
  font-size: ${props => props.scale * 10}px;
  ${"" /* font-family: Radiance, Arial, sans-serif; */};
`;

export default WidgetDonation;
