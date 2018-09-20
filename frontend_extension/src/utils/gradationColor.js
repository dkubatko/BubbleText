import Remap from './remap';

// const best = { r: 92, g: 225, b: 149 };
// const worst = { r: 219, g: 64, b: 0 };

const findColorBetween = (left, right, percentage) => {
  let newColor = {};
  newColor.r = Math.round(left.r + (right.r - left.r) * percentage / 100);
  newColor.g = Math.round(left.g + (right.g - left.g) * percentage / 100);
  newColor.b = Math.round(left.b + (right.b - left.b) * percentage / 100);
  return newColor;
}

const getGradationColor = (value, min = 0, max = 100, worst = { r: 219, g: 64, b: 0 }, best = { r: 92, g: 225, b: 149 }) => {
  let color = findColorBetween(worst, best, Remap(value, min, max, 0, 100));
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export default getGradationColor;