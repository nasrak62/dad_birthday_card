import CircleManager from "../circle_manager";
import Point from "../point";
import { getRandomColor } from "../utils/colors";
import { TAddDrawing, TDrawing } from "./types";

const circleManager = new CircleManager();

export default class Drawing {
  keySequence: string[] | string;
  displayTime: number;
  isText: boolean;
  gap: number;

  constructor({
    keySequence,
    displayTime = 10,
    isText = false,
    isImage = false,
    gap = 20,
  }: TDrawing) {
    this.isText = isText;
    this.displayTime = displayTime;
    this.gap = gap;

    if (!isImage) {
      this.keySequence = Drawing.initSequence(isText, keySequence);
    } else {
      this.keySequence = keySequence;
    }
  }

  static extractNumberFromString(str: string) {
    // Regular expression to find groups of digits in the string
    const regex = /\d+/g;

    // Find all matches of the regex in the string
    const matches = str.match(regex);

    // If there are matches, return them as an array of numbers
    let stringCopy = str;

    if (matches) {
      matches.forEach((value: string) => {
        const reverseString = value.split("").reverse().join("");
        stringCopy = stringCopy.replace(value, reverseString);
      });
    }

    // If no matches, return an empty array
    return stringCopy;
  }

  static initSequence(isText: boolean, keySequence: string | string[]) {
    let effectiveSequence = keySequence;

    if (isText) {
      const mappedSequence = [];

      const numberString = Drawing.extractNumberFromString(
        keySequence as string
      );

      for (const char of numberString) {
        const mappedValue = char;
        // DRAWING_MAPPER?.[char as keyof typeof DRAWING_MAPPER];

        if (mappedValue) {
          mappedSequence.push(mappedValue);
        }
      }

      effectiveSequence = mappedSequence;
    }

    if (typeof effectiveSequence === "string") {
      effectiveSequence = [effectiveSequence];
    }

    return effectiveSequence;
  }

  calculateNewSized(
    height: number | null,
    maxHeight: number,
    totalHeight: number,
    totalWidth: number,
    width: number | null
  ) {
    const effectiveHeight = height !== null ? height : 0;
    const effectiveWidth = width !== null ? width : 0;

    const newTotalHeight = totalHeight + effectiveHeight;
    const newMaxHeight = Math.max(maxHeight, effectiveHeight);

    const newTotalWidth = totalWidth + effectiveWidth;

    return {
      newTotalHeight,
      newMaxHeight,
      newTotalWidth,
    };
  }

  drawImage({
    x,
    y,
    scale,
    imgName,
    color,
  }: {
    x?: number;
    y?: number;
    scale?: number;
    imgName: string;
    color?: string;
  }) {
    const currentX = x !== undefined ? x : window.innerWidth / 2;
    const currentY = y !== undefined ? y : window.innerHeight / 2;
    const getColorFunction = () => getRandomColor();

    circleManager.loadDrawing({
      name: this.keySequence as string,
      newCenterPoint: new Point(currentX, currentY),
      colorOverride: color || getColorFunction,
      radiusOverride: () => (Math.random() + 0.5) * 2,
      scale: scale,
      objectName: imgName,
    });
  }

  addDrawing({
    isFirstWord = false,
    startingPosition,
    drawingName,
  }: TAddDrawing) {
    let currentX = startingPosition.x;
    let currentY = startingPosition.y;
    let maxHeight = 0;
    let totalWidth = 0;
    let totalHeight = 0;

    console.log({ keySequence: (this.keySequence as string[]).join(" ") });
    for (let index = 0; index < this.keySequence.length; index++) {
      const key = this.keySequence[index];

      const { width, height } = CircleManager.getPositionsObjectInnerData(key);

      const results = this.calculateNewSized(
        height,
        maxHeight,
        totalHeight,
        totalWidth,
        width
      );

      totalHeight = results.newTotalHeight;
      totalWidth = results.newTotalWidth;
      maxHeight = results.newMaxHeight;

      if (!width) {
        console.log({ badWidth: width });

        continue;
      }

      let diff = 0;
      const shouldSkipGap = isFirstWord && index === 0;

      if (!shouldSkipGap) {
        diff = width + this.gap;
      }

      currentX -= diff;

      circleManager.loadDrawing({
        name: key,
        newCenterPoint: new Point(currentX, currentY),
        // colorOverride: () => getRandomColorsFromList(),
        radiusOverride: () => (Math.random() + 0.5) * 2,
        objectName: `${drawingName}-${key}-${index} `,
      });
    }

    currentX -= 2 * this.gap;

    return {
      startingPosition: new Point(currentX, currentY),
      maxHeight,
      totalHeight,
      totalWidth,
    };
  }
}
