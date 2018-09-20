import React from "react";
import { observer, inject } from "mobx-react";
import styled, { css } from "styled-components";

import Lottie from "./Lottie";
import EXT_CONFIG from "../constants/EXT_CONFIG";
import * as checkAnimation from "../animations/checked_done_.json";

// @inject("configStore")
@observer
class Text extends React.Component {
  constructor(props) {
    super(props);

    this.state = { removeButtonHover: false };
    this.onClickRemoveButton = this.onClickRemoveButton.bind(this);
    this.renderRemoveButton = this.renderRemoveButton.bind(this);
    this.renderSelected = this.renderSelected.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClickRemoveButton() {
    const { id, onClickRemoveButton } = this.props;
    // const { streamerConfigStore } = this.props.configStore;

    onClickRemoveButton(id);
    // streamerConfigStore.removeText(id);
  }

  onClick() {
    const { id, removable, onClick } = this.props;

    if (!removable) onClick(id);
  }

  renderSelected(selected) {
    const { scale } = this.props;

    const AnimContainer = styled.div`
      position: absolute;
      top: ${-28 * scale}px;
      right: ${-28 * scale}px;
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

  renderRemoveButton() {
    const { removable, scale } = this.props;

    if (removable)
      return (
        <RemoveButtonWrapper onClick={this.onClickRemoveButton}>
          <RemoveButton className={"fas fa-times-circle"} />
        </RemoveButtonWrapper>
      );

    return null;
  }

  render() {
    const { id, selected, value, scale } = this.props;

    return (
      <TextPin onClick={this.onClick} selected={selected} scale={scale}>
        {value}
        {this.renderRemoveButton()}
        {this.renderSelected(selected)}
      </TextPin>
    );
  }
}

export const TextPin = styled.div`
  position: relative;
  background: linear-gradient(
    -45deg,
    ${EXT_CONFIG.ADDITIONAL_COLOR},
    ${EXT_CONFIG.MAIN_COLOR}
  );
  color: white;
  margin: ${props => 0 * props.scale}px ${props => props.scale * 16}px
    ${props => props.scale * 4}px 0px;
  padding: ${props => props.scale * 6}px ${props => props.scale * 10}px;
  border-radius: ${props => props.scale * 10}px;
  font-size: ${props => props.scale * 20}px;

  &:hover {
    cursor: pointer;
  }

  ${props =>
    props.selected &&
    css`
      border-color: ${EXT_CONFIG.MAIN_COLOR};
    `};
`;

TextPin.defaultProps = {
  scale: 1
};

export const RemoveButtonWrapper = styled.div``;

export const RemoveButton = styled.i`
  position: absolute;
  color: white;
  top: ${props => props.scale * -10}px;
  right: ${props => props.scale * -12}px;
  background-color: black;
  border: ${props => props.scale * 2}px solid black;
  border-radius: ${props => props.scale * 15}px;
  font-size: ${props => props.scale * 24}px;

  &:hover {
    color: ${EXT_CONFIG.MAIN_COLOR};
    cursor: pointer;
  }
`;

RemoveButton.defaultProps = {
  scale: 1
};

export default Text;
