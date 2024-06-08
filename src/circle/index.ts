import { getContext } from "../context_helper";
import EditorManager from "../editor_manager";
import Point from "../point";
import { v4 } from "uuid";

const editorManager = new EditorManager();

export default class Circle {
  radius: number;
  centerPoint: Point;
  startAngle: number;
  endAngle: number;
  currentPoint: Point;
  speed: number;
  color: string;
  isPath?: boolean;
  currentPath?: Point[];
  currentPathIndex!: number;
  originalCenterPoint: Point;
  name: string;
  isManifested: boolean;

  constructor({
    centerPoint = new Point(0, 0),
    radius = 1,
    startAngle = 0,
    endAngle = 2 * Math.PI,
    color = "#000000",
  }) {
    this.radius = radius;
    this.centerPoint = centerPoint;
    this.originalCenterPoint = centerPoint;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.currentPoint = editorManager.isInEditorMode
      ? centerPoint
      : Point.getRandomSidePoint();

    this.speed = (Math.random() + 4) * 2;
    this.color = color;
    this.name = v4();
    this.isManifested = false;
  }

  update() {
    if (this.isPath) {
      this.pathUpdate();

      return;
    }

    const isFoundX =
      Math.abs(this.centerPoint.x - this.currentPoint.x) < this.speed;
    const isFoundY =
      Math.abs(this.centerPoint.y - this.currentPoint.y) < this.speed;

    if (isFoundX && isFoundY) {
      this.isManifested = true;
    }

    if (isFoundX) {
      this.currentPoint.x = this.centerPoint.x;
    }

    if (this.currentPoint.x < this.centerPoint.x) {
      this.currentPoint.x += this.speed;
    }

    if (this.currentPoint.x > this.centerPoint.x) {
      this.currentPoint.x -= this.speed;
    }

    if (isFoundY) {
      this.currentPoint.y = this.centerPoint.y;
    }

    if (this.currentPoint.y < this.centerPoint.y) {
      this.currentPoint.y += this.speed;
    }

    if (this.currentPoint.y > this.centerPoint.y) {
      this.currentPoint.y -= this.speed;
    }
  }

  draw() {
    const context = getContext();

    if (!context) {
      return;
    }

    context.beginPath();

    context.arc(
      this.currentPoint.x,
      this.currentPoint.y,
      this.radius,
      this.startAngle,
      this.endAngle
    );

    context.strokeStyle = this.color;

    context.stroke();
    context.fillStyle = this.color;
    context.fill();

    this.update();
  }

  // Function to check if two circles overlap
  static isOverlap(circle1: Circle, circle2: Circle) {
    const dx = circle1.centerPoint.x - circle2.centerPoint.x;
    const dy = circle1.centerPoint.y - circle2.centerPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < circle1.radius + circle2.radius;
  }

  // Function to remove overlapping circles
  static removeOverlaps(circles: Circle[]) {
    let overlaps = false;
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        if (Circle.isOverlap(circles[i], circles[j])) {
          circles.splice(j, 1); // Remove the overlapping circle
          overlaps = true;
          break;
        }
      }
      if (overlaps) {
        break; // Break if any overlap is found
      }
    }
    return overlaps;
  }

  static removeOverlappingCircles(circles: Circle[]) {
    // Sort circles by radius in descending order

    const circlesCopy = [...circles];
    circlesCopy.sort((a, b) => b.radius - a.radius);

    // Remove overlaps until no more are found
    while (Circle.removeOverlaps(circlesCopy)) {}

    // Return the circles with removed overlaps
    return circlesCopy;
  }

  pathUpdate() {
    const foundTargetX =
      Math.abs(this.centerPoint.x - this.currentPoint.x) < this.speed;
    const foundTargetY =
      Math.abs(this.centerPoint.y - this.currentPoint.y) < this.speed;

    if (foundTargetX && foundTargetY && this.currentPath) {
      this.currentPathIndex = (this.currentPathIndex || 0) + 1;

      const isEnd = this.currentPathIndex === this.currentPath.length;

      if (isEnd) {
        console.log("end");
        this.isPath = false;
        this.currentPath = [];
        this.currentPathIndex = 0;
        this.currentPoint.x = this.centerPoint.x;
        this.currentPoint.y = this.centerPoint.y;
        this.centerPoint = this.originalCenterPoint;

        return;
      }

      this.centerPoint = this.currentPath?.[this.currentPathIndex];
    }

    if (foundTargetX) {
      this.currentPoint.x = this.centerPoint.x;
    }

    if (this.currentPoint.x < this.centerPoint.x) {
      this.currentPoint.x += this.speed;
    }

    if (this.currentPoint.x > this.centerPoint.x) {
      this.currentPoint.x -= this.speed;
    }

    if (foundTargetY) {
      this.currentPoint.y = this.centerPoint.y;
    }

    if (this.currentPoint.y < this.centerPoint.y) {
      this.currentPoint.y += this.speed;
    }

    if (this.currentPoint.y > this.centerPoint.y) {
      this.currentPoint.y -= this.speed;
    }
  }

  travelPath({ path }: { path: Point[] }) {
    this.isPath = true;
    this.currentPath = path;
    this.currentPathIndex = 0;
    this.centerPoint = this.currentPath[0];
  }
}
