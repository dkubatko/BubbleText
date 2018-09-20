// import BUBBLE_TYPES from "../constants/BUBBLE_TYPES";
// import images from "../images";
import ANIM_TYPES from "../constants/ANIM_TYPES";
import * as basicShape09 from "../animations/basicShape09.json";
import * as smokeExplosion01 from "../animations/smokeExplosion01.json";
import * as smokeExplosion02 from "../animations/smokeExplosion02.json";
import * as smokeExplosion12 from "../animations/smokeExplosion12.json";
import * as smokeExplosion13 from "../animations/smokeExplosion13.json";
import * as smokeExplosion18 from "../animations/smokeExplosion18.json";

const getAnimDataById = id => {
  let animation;
  switch (id) {
    case "0":
      animation = basicShape09;
      break;
    case "1":
      animation = smokeExplosion02;
      break;
    case "2":
      animation = smokeExplosion12;
      break;
    case "3":
      animation = smokeExplosion18;
      break;
    case "4":
      animation = smokeExplosion13;
      break;
    // case "5":
    //   animation = smokeExplosion13;
    //   break;

    default:
      break;
  }
  return animation;
};

export default getAnimDataById;
