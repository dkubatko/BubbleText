import BUBBLE_TYPES from "../constants/BUBBLE_TYPES";
import images from "../images";

const getBubbleImageById = id => {
  let bubbleImage;
  switch (id) {
    case "0":
      bubbleImage = images.default;
      break;
    case "1":
      bubbleImage = images.pixelPipka;
      break;
    case "2":
      bubbleImage = images.hsBubble;
      break;
    case "3":
      bubbleImage = images.dota2;
      break;
    case "4":
      bubbleImage = images.fortnayt;
      break;
    case "5":
      bubbleImage = images.cs;
      break;
    case "6":
      bubbleImage = images.pubg1;
      break;
    case "7":
      bubbleImage = images.over3;
      break;
    // case "8":
    //   bubbleImage = images.chat9;
    //   break;
    // case "9":
    //   bubbleImage = images.chat10;
    //   break;
    default:
      break;
  }
  return bubbleImage;
};

export default getBubbleImageById;
