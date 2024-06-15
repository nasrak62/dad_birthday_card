import CircleManager from "./circle_manager";
import Drawing from "./drawing";
import { getRandomColor } from "./utils/colors";

const circleManager = new CircleManager();

export default class Kayak {
  kayakDrawings!: Drawing[];
  kayakY!: number;
  kayakX!: number;
  numberOfItems!: number;
  constructor(canDrawEnv: boolean) {
    if (!canDrawEnv) {
      return;
    }

    this.numberOfItems = 3;
    this.kayakDrawings = [];

    for (let index = 0; index < this.numberOfItems; index++) {
      const kayakY = window.innerHeight * 0.25 - Math.random() * 3;
      const kayakX = Math.random() * window.innerWidth * 0.25 + index *  window.innerWidth * 0.1;
      const kayakDrawing = new Drawing({
        keySequence: `kayak`,
      });

      this.kayakDrawings.push(kayakDrawing);

      kayakDrawing.drawImage({
        scale: 4,
        x: kayakX,
        y: kayakY,
        imgName: `kayak${index}`,
        color: getRandomColor(),
      });

      circleManager.moveOnPath({
        name: `kayak${index}`,
        pathName: "animation-path-2",
      });
    }
  }

  draw() {
    let inAnimations = false;

    for (let index = 0; index < this.numberOfItems; index++) {
      const inAnimation = circleManager.moveDrawing({
        name: `kayak${index}`,
      });

      inAnimations = inAnimations || inAnimation;
    }

    return inAnimations;
  }
}
