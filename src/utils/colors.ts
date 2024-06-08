const componentToHex = (color: number) => {
  var hex = color.toString(16);

  return hex.length == 1 ? "0" + hex : hex;
};

export const rgbaToHex = (red: number, green: number, blue: number) => {
  const result =
    "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue);
  // componentToHex(alpha);

  return result;
};

export const getRandomColorValue = (): number => {
  return Math.round(Math.random() * 255);
};

export const getRandomColor = () => {
  const red = getRandomColorValue();
  const green = getRandomColorValue();
  const blue = getRandomColorValue();

  return rgbaToHex(red, green, blue);
};

const colorsList = ["#FF204E", "#A0153E", "#5D0E41", "#00224D"];

export const getRandomColorsFromList = () => {
  return colorsList[Math.floor(Math.random() * colorsList.length)];
};
