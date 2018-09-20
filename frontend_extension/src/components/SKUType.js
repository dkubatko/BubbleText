import React from "react";
import { observer, inject } from "mobx-react";
import Lottie from "./Lottie";
import styled, { css } from "styled-components";

import * as checkAnimation from "../animations/checked_done_.json";
import EXT_CONFIG from "../constants/EXT_CONFIG";
import getAnimDataById from "../utils/getAnimDataById";
import { UNSELECTED } from "../styles";
import Images from "../images";

@observer
class SKUType extends React.Component {
  constructor(props) {
    super(props);

    this.state = { hovered: false };
    this.onClickSKU = this.onClickSKU.bind(this);
  }

  onClickSKU() {
    const { sku, onClick } = this.props;

    onClick(sku);
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
    const { sku, cost, scale, selected } = this.props;

    // const animation = getAnimDataById(id);

    // const defaultOptions = {
    //   loop: true,
    //   autoplay: true,
    //   animationData: animation,
    //   rendererSettings: {
    //     preserveAspectRatio: "xMidYMid slice"
    //   }
    // };

    return (
      <SKUPin selected={selected} scale={scale} onClick={this.onClickSKU}>
        <BitsImage src={Images.bits} scale={scale} />
        {cost}
        {/* <Lottie
          options={defaultOptions}
          height={100 * scale}
          width={100 * scale}
        /> */}
        {this.renderSelected(selected)}
      </SKUPin>
    );
  }
}

export const SKUPin = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  text-align: center;
  width: ${props => props.scale * 140}px;
  height: ${props => props.scale * 60}px;
  margin: ${props => props.scale * 2}px ${props => props.scale * 10}px 0 0;
  padding: ${props => props.scale * 6}px ${props => props.scale * 24}px;
  border: ${props => props.scale * 4}px solid ${UNSELECTED};
  border-radius: ${props => props.scale * 10}px;
  cursor: pointer;
  font-size: ${props => props.scale * 36}px;

  &:hover {
    border-color: ${EXT_CONFIG.SELECTED_COLOR};
  }

  ${props =>
    props.selected &&
    css`
      border-color: ${EXT_CONFIG.SELECTED_COLOR};
    `};
`;

export const BitsImage = styled.img`
  position: relative;
  display: inline-block;
  width: ${props => props.scale * 30}px;
  height: ${props => props.scale * 40}px;
  ${"" /* margin-left: 10px; */}
  margin-right: ${props => props.scale * 12}px;
  top: ${props => props.scale * 0}px;
`;

export default SKUType;
