import React from "react";
import { observer, inject } from "mobx-react";
import Lottie from "./Lottie";

import * as checkAnimation from "../animations/checked_done_.json";
import EXT_CONFIG from "../constants/EXT_CONFIG";
import getBubbleImageById from "../utils/getBubbleImageById";
import styled, { css } from "styled-components";
import { BubblePin } from "../styles";

@observer
class BubbleType extends React.Component {
  constructor(props) {
    super(props);

    this.onClickBubbleType = this.onClickBubbleType.bind(this);
  }

  onClickBubbleType() {
    const { id, onClickBubbleType } = this.props;

    onClickBubbleType(id);
  }

  renderSelected(selected) {
    const { scale } = this.props;

    const AnimContainer = styled.div`
      position: absolute;
      top: ${-15 * scale}px;
      right: ${-10 * scale}px;
    `;

    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: checkAnimation,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    if (selected)
      return (
        <AnimContainer>
          <Lottie
            options={defaultOptions}
            height={60 * scale}
            width={60 * scale}
          />
        </AnimContainer>
      );
    return null;
  }

  render() {
    const { id, selected, scale } = this.props;

    const BubbleImage = styled.img`
      height: ${60 * scale}px;
      width: auto;
    `;

    const bubbleImage = getBubbleImageById(id);

    return (
      <BubblePin
        selected={selected}
        scale={scale}
        onClick={this.onClickBubbleType}
      >
        <BubbleImage src={bubbleImage} alt={id} />
        {this.renderSelected(selected)}
      </BubblePin>
    );
  }
}

export default BubbleType;
