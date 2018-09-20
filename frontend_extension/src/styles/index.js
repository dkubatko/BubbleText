import styled, { css, injectGlobal } from "styled-components";
import EXT_CONFIG from "../constants/EXT_CONFIG";
// import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import BurbankBigCondensedBlackWoff from "../fonts/Burbank/BurbankBigCondensed-Black.woff";

export const UNSELECTED = EXT_CONFIG.MAIN_COLOR;
export const THEME_COLOR = EXT_CONFIG.THEME ? "#19171c" : "white";

/* tslint:disable */
injectGlobal`
  /* @font-face {
    font-family: "Burbank";
    src: local("Burbank"), local("Burbank"),
      url("../fonts/BurbankBigCondensed-Bold.otf") format("opentype");
    font-weight: bold;
    font-style: normal;
  } */

  @font-face {
    font-family: BurbankBigCondensed-Black;
    src: url('${BurbankBigCondensedBlackWoff}') format("woff");
    font-weight: normal;
    font-style: normal;
    font-stretch: normal; 
  }

  /* @font-face {
    font-family: BurbankSmall-Black;
    src: url('../fonts/Burbank/BurbankSmall-Black.eot');
    src: url('../fonts/Burbank/BurbankSmall-Black.eot#iefix') format('embedded-opentype'), url('../fonts/Burbank/BurbankSmall-Black.woff') format('woff'), url('../fonts/Burbank/BurbankSmall-Black.svg') format('svg');
    font-weight: normal;
    font-style: normal;
    font-stretch: normal; } */
  
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
/* tslint:enable */

export const Container = styled.div`
  display: "flex";
`;

export const Button = styled.button`
  background: linear-gradient(
    -45deg,
    ${EXT_CONFIG.ADDITIONAL_COLOR},
    ${EXT_CONFIG.MAIN_COLOR}
  );
  color: white;
  padding: 0 16px;
  ${"" /* max-width: 300px; */} height: 60px;
  border: 1px solid ${EXT_CONFIG.ADDITIONAL_COLOR};
  border-radius: 10px;
  font-size: 24px;
  //font-weight: bold;
  margin: 0 10px;
  cursor: pointer;

  &:hover {
    border-color: ${EXT_CONFIG.SELECTED_COLOR};
  }
`;

export const InputText = styled.input.attrs({ type: "text" })`
  height: 56px;
  border: 2px solid ${EXT_CONFIG.ADDITIONAL_COLOR};
  padding: 0 10px;
  font-size: 20px;

  &:hover {
    border-color: ${EXT_CONFIG.MAIN_COLOR};
  }
`;

export const TextInput = styled(InputText)`
  height: 56px;
  border: 2px solid ${EXT_CONFIG.ADDITIONAL_COLOR};
  margin: 0 10px 10px 0;
  padding: 0 10px;
  border-radius: 10px;
  font-size: 20px;
  max-width: 400px;
  flex: 5;

  &:hover {
    border-color: ${EXT_CONFIG.MAIN_COLOR};
  }
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  ${"" /* justify-content: center; */}
  margin: 0 0 ${props => props.scale * 6}px 0;
`;

FlexRow.defaultProps = {
  scale: 1
};

export const AnimPin = styled.div`
  position: relative;
  background-color: white;
  text-align: center;
  width: ${props => props.scale * 100}px;
  height: ${props => props.scale * 100}px;
  margin: ${props => props.scale * 2}px ${props => props.scale * 10}px 0 0;
  padding: ${props => props.scale * 6}px ${props => props.scale * 24}px;
  border: ${props => props.scale * 4}px solid ${UNSELECTED};
  border-radius: ${props => props.scale * 10}px;
  cursor: pointer;
  &:hover {
    border-color: ${EXT_CONFIG.SELECTED_COLOR};
  }

  ${props =>
    props.selected &&
    css`
      border-color: ${EXT_CONFIG.SELECTED_COLOR};
    `};
`;

AnimPin.defaultProps = {
  scale: 1
};

export const BubblePin = styled.div`
  position: relative;
  background-color: white;
  text-align: center;
  width: ${props => props.scale * 100}px;
  height: ${props => props.scale * 60}px;
  margin: ${props => props.scale * 2}px ${props => props.scale * 10}px 0 0;
  padding: ${props => props.scale * 6}px ${props => props.scale * 24}px;
  border: ${props => props.scale * 4}px solid ${UNSELECTED};
  border-radius: ${props => props.scale * 10}px;

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

BubblePin.defaultProps = {
  scale: 1
};

export const SectionHeader = styled.div`
  font-size: ${props => props.scale * 28}px;
  margin-top: ${props => props.scale * 6}px;
`;

SectionHeader.defaultProps = {
  scale: 1
};
