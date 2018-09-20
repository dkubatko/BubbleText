// Core libs
import React from "react";
import styled from "styled-components";
import Lottie from "./Lottie";
import VIDEO_OVERLAY_STATE from "../constants/VIDEO_OVERLAY_STATE";
import EXT_CONFIG from "../constants/EXT_CONFIG";
import * as loaderRingAnimation from "../animations/snap_loader_white.json";
import Images from "../images";
// import { MenuButtonWrapper, MenuButtonImage } from "../styles";
import { THEME_COLOR } from "../styles";

const MenuButton = ({ configFetched, state, scale, onClick }) => {
  const renderContent = () => {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: loaderRingAnimation,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    switch (state) {
      case VIDEO_OVERLAY_STATE.IDLE:
        if (configFetched)
          return <MenuButtonImage scale={scale} src={Images.smallLogo} />;
        return (
          <Lottie
            options={defaultOptions}
            height={50 * scale}
            width={50 * scale}
          />
        );
        break;
      case VIDEO_OVERLAY_STATE.DONATION_CONFIG_OPENED:
        return <MenuButtonImage scale={scale} src={Images.smallLogo} />;
        break;

      default:
        return <MenuButtonImage scale={scale} src={Images.smallLogo} />;
        break;
    }

    return <div />;
  };

  return (
    <MenuButtonWrapper scale={scale} onClick={onClick}>
      {renderContent()}
    </MenuButtonWrapper>
  );
};

export const MenuButtonWrapper = styled.div`
  height: ${props => props.scale * 70}px;
  width: ${props => props.scale * 70}px;
  border: ${props => props.scale * 2}px solid ${EXT_CONFIG.MAIN_COLOR};
  border-radius: ${props => props.scale * 10}px;
  cursor: pointer;
  background-color: ${THEME_COLOR};
  display: flex;
  justify-content: center;

  &:hover {
    border-color: ${EXT_CONFIG.SELECTED_COLOR};
    cursor: pointer;
  }

  ${props =>
    props.selected &&
    css`
      border-color: ${EXT_CONFIG.SELECTED_COLOR};
    `};
`;

export const MenuButtonImage = styled.img`
  width: ${props => props.scale * 45}px;
  height: ${props => props.scale * 50}px;
  display: block;
  align-self: center;
`;

export default MenuButton;
