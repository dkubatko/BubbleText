import React from "react";
import { observer, inject } from "mobx-react";
// import Lottie from "./Lottie";
import Lottie from "../components/Lottie";
import styled, { css } from "styled-components";

import * as checkAnimation from "../animations/checked_done_.json";
import EXT_CONFIG from "../constants/EXT_CONFIG";
import getAnimDataById from "../utils/getAnimDataById";
import { AnimPin } from "../styles";

@observer
class AnimType extends React.Component {
  constructor(props) {
    super(props);

    this.state = { hovered: false };
    this.onClickAnimType = this.onClickAnimType.bind(this);
  }

  onClickAnimType() {
    const { id, onClickAnimType } = this.props;

    onClickAnimType(id);
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
    const { id, scale, selected } = this.props;

    const animation = getAnimDataById(id);

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animation,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    return (
      <AnimPin selected={selected} scale={scale} onClick={this.onClickAnimType}>
        <Lottie
          options={defaultOptions}
          height={100 * scale}
          width={100 * scale}
        />
        {this.renderSelected(selected)}
      </AnimPin>
    );
  }
}

export default AnimType;
