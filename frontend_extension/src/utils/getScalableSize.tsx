"use strict";

export interface Props {
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
}

export interface Return {
  width: number;
  height: number;
  ratio: number;
}

export const getScalableSize = ({
  width,
  height,
  maxWidth,
  maxHeight
}: Props): Return => {
  let ratio = 1;

  // if (width && height) {
  ratio = Math.min(maxWidth / width, maxHeight / height);
  // console.log("width/max " + maxWidth / width);
  // console.log("height/max " + maxHeight / height);
  // }
  // else if (width) {
  //   ratio = width / maxWidth;
  // } else if (height) {
  //   ratio = height / maxHeight;
  // }

  // consider max width
  if (width * ratio > maxWidth) {
    ratio = maxWidth * ratio / (width * ratio);
  }
  // consider max height
  if (height * ratio > maxHeight) {
    ratio = maxHeight * ratio / (height * ratio);
  }

  return {
    width: width * ratio,
    height: height * ratio,
    ratio
  };
};
