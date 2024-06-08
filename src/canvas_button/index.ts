import { getContext } from "../context_helper";
import Point from "../point";
import { TCanvasButton } from "./types";

export default class CanvasButton {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  currentPoint: Point;
  onClick: () => void;
  isDrawn: boolean;

  constructor({ x, y, width, height, text, onClick }: TCanvasButton) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.onClick = onClick;
    this.currentPoint = new Point(0, 0);
    this.isDrawn = true;

    window.addEventListener("click", this.handleClick.bind(this));
  }

  isPointInsideButton(point: Point): boolean {
    const hasRightX = point.x >= this.x && point.x <= this.x + this.width;
    const hasRightY = point.y >= this.y && point.y <= this.y + this.height;
    const inRange = hasRightX && hasRightY;

    return inRange;
  }

  handleClick(event: MouseEvent) {
    this.currentPoint.x = event.clientX;
    this.currentPoint.y = event.clientY;

    if (this.isPointInsideButton(this.currentPoint)) {
      this.onClick();
    }
  }

  draw() {
    const context = getContext();

    if (!context) {
      return;
    }

    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.lineWidth = 2;
    context.strokeStyle = "#000000";
    context.stroke();
    context.closePath();
    context.fillText(
      this.text,
      this.x + this.width / 2 - this.text.length * 2.1,
      this.y + this.height / 2 + 4
    );
  }
}
