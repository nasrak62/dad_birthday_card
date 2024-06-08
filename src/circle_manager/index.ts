import Circle from "../circle/index";
import EditorManager from "../editor_manager";
import Point from "../point";
import filePositions from "../positions.json";
import {
  TCirclesObject,
  TLoadDrawing,
  TLoadedImgToCircles,
  TPositionsObject,
  TPositionsObjectData,
  TUpdateDrawing,
} from "./types";
import { getEffectiveColor, getEffectiveRadius } from "./utils";

let instance: CircleManager | null = null;

const editorManager = new EditorManager();

export default class CircleManager {
  circleListObject!: TCirclesObject;
  canDraw!: boolean;

  constructor() {
    if (instance) {
      return instance;
    }

    this.circleListObject = {};
    this.canDraw = false;

    window.addEventListener("mousedown", this.handleMouseDown.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    (window.addEventListener as any)(
      "new-image",
      this.handleNewImage.bind(this)
    );

    instance = this;
  }

  handleNewImage(event: CustomEvent) {
    const eventData = event.detail;

    console.log({ eventData });

    for (const dataPoint of eventData) {
      const red = dataPoint.r;
      const green = dataPoint.g;
      const blue = dataPoint.b;

      const threshHold = 60 * 3;

      if (red + green + blue >= threshHold) {
        continue;
      }

      const point = new Point(dataPoint.x + 100, dataPoint.y + 200);
      const circle = new Circle({
        centerPoint: point,
        color: "#000000",
        radius: 0.15,
      });

      this.addCircle(circle, "default");
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.canDraw) {
      console.log("skipping, can draw");

      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    const point = new Point(x, y);

    if (editorManager.wasEditorButtonClicked(point)) {
      return;
    }

    const circle = new Circle({ centerPoint: point });

    this.addCircle(circle, "default");
  }

  handleMouseUp() {
    this.canDraw = false;
  }

  handleMouseDown() {
    this.canDraw = true;
  }

  draw() {
    const keys = Object.keys(this.circleListObject);

    for (const key of keys) {
      const circleList = this.circleListObject[key];

      for (
        let circleIndex = 0;
        circleIndex < circleList.length;
        circleIndex++
      ) {
        const circle = circleList[circleIndex];

        circle.draw();
      }
    }
  }

  addCircle(circle: Circle, name: string) {
    if (!this.circleListObject[name]) {
      this.circleListObject[name] = [];
    }

    this.circleListObject[name].push(circle);
  }

  removeCircle(currentCircle: Circle, name: string) {
    this.circleListObject[name] = this.circleListObject[name].filter(
      (circle) => circle !== currentCircle
    );
  }

  removeLastCircle(name: string) {
    return this.circleListObject[name].pop();
  }

  clearCircles(name: string) {
    if (name === "all") {
      this.circleListObject = {};
    }

    const keys = Object.keys(this.circleListObject);

    for (const key of keys) {
      if (key.includes(name)) {
        this.circleListObject[key] = [];
      }
    }
  }

  static getPositionsObjectInnerData(name: string): TPositionsObjectData {
    const positionsObject = CircleManager.getPositionsObject();

    return positionsObject[name];
  }

  static getPositionsObject(): TPositionsObject {
    let jsonData = localStorage.getItem("positionsObject");

    if (jsonData) {
      const positionsObject = JSON.parse(jsonData);

      return positionsObject;
    }

    return filePositions;
  }

  saveDrawing({ name, scale }: { name: string; scale?: number }) {
    const centerPoints = [];
    const colors = [];
    const radiuses = [];
    const baseName = "default";
    let currentList = this.circleListObject[baseName];

    if (currentList === undefined) {
      currentList = this.circleListObject[name];
    }

    console.log({ currentList });

    currentList = Circle.removeOverlappingCircles(currentList);

    for (const circle of currentList) {
      centerPoints.push(circle.centerPoint);
      colors.push(circle.color);
      radiuses.push(circle.radius);
    }

    const normalizePoints = Point.normalizeShape({
      points: centerPoints,
      scale,
    });
    const drawingSized = Point.calculateDrawingBox(normalizePoints);
    const positionsObject = CircleManager.getPositionsObject();

    const data = {
      points: normalizePoints,
      height: drawingSized.height,
      width: drawingSized.height,
      centerPoint: drawingSized.centerPoint,
      colors: colors,
      radiuses: radiuses,
    };

    positionsObject[name] = data;

    console.log(`saved ${name}`);

    // normalize first
    const jsonData = JSON.stringify(positionsObject);
    localStorage.setItem("positionsObject", jsonData);

    return jsonData;
  }

  updateDrawingShape({
    name,
    shouldSave = false,
    positionsObject = null,
    targetHeight = 60,
    targetWidth = 60,
    scale = 1,
  }: TUpdateDrawing) {
    if (!positionsObject) {
      positionsObject = CircleManager.getPositionsObject();
    }

    const currentValue = positionsObject[name];

    let circles = this.loadedDataToCircles({
      currentValue,
    });

    circles = Circle.removeOverlappingCircles(circles);

    const newPoints = circles.map((circle) => circle.centerPoint);

    const normalizedPoints = Point.normalizeShape({
      points: newPoints as unknown as Point[],
      targetWidth,
      targetHeight,
      scale,
    });
    const drawingSized = Point.calculateDrawingBox(normalizedPoints);

    const data = {
      points: normalizedPoints,
      height: drawingSized.height,
      width: drawingSized.width,
      centerPoint: drawingSized.centerPoint,
      colors:
        currentValue?.colors ||
        Array.from({ length: newPoints.length }, () => "#000000"),

      radiuses:
        currentValue?.radiuses ||
        Array.from({ length: newPoints.length }, () => 1),
    };

    positionsObject[name] = data;

    if (shouldSave) {
      const jsonData = JSON.stringify(positionsObject);

      console.log(jsonData);

      localStorage.setItem("positionsObject", jsonData);
    }
  }

  migrateAllDrawings() {
    const positionsObject = CircleManager.getPositionsObject();

    const keys = Object.keys(positionsObject);

    for (const key of keys) {
      this.updateDrawingShape({ name: key, positionsObject });
    }

    const jsonData = JSON.stringify(positionsObject);
    localStorage.setItem("positionsObject", jsonData);
  }

  loadedDataToCircles({
    currentValue,
    newCenterPoint,
    colorOverride,
    radiusOverride,
    scale,
  }: TLoadedImgToCircles) {
    let currentPoints = currentValue.points;

    if (scale) {
      currentPoints = Point.normalizeShape({ points: currentPoints, scale });
    }

    const colors = currentValue.colors;
    const radiuses = currentValue.radiuses;

    const points = currentPoints.map((pointData) => {
      if (newCenterPoint) {
        return new Point(
          pointData.x + newCenterPoint.x,
          pointData.y + newCenterPoint.y
        );
      }

      return new Point(pointData.x, pointData.y);
    });

    const circles = points.map((point, index) => {
      let effectiveColor: string | undefined = getEffectiveColor(colorOverride);

      return new Circle({
        centerPoint: point,
        color: effectiveColor || colors[index],
        radius: getEffectiveRadius(radiusOverride) || radiuses[index],
      });
    });

    return circles;
  }

  loadDrawing({
    name,
    objectName,
    newCenterPoint,
    colorOverride,
    radiusOverride,
    scale,
  }: TLoadDrawing) {
    const positionsObject = CircleManager.getPositionsObject();

    const currentValue = (positionsObject as TPositionsObject)?.[name];

    if (!currentValue) {
      return;
    }

    let circles = this.loadedDataToCircles({
      currentValue,
      newCenterPoint,
      colorOverride,
      radiusOverride,
      scale,
    });

    circles = Circle.removeOverlappingCircles(circles);

    if (!this.circleListObject[objectName]) {
      this.circleListObject[objectName] = [];
    }

    this.circleListObject[objectName].push(...circles);
  }

  moveDrawing({ name }: { name: string }) {
    const circles = this.circleListObject[name];

    const inAnimation = circles.some((circle) => !circle.isManifested);
    const isAllCrossed = circles.every(
      (circles) => circles.centerPoint.x > window.innerWidth
    );
    const randomValue = Math.random() * 200 + 200;

    for (const circle of circles) {
      if (circle.isPath || inAnimation) {
        continue;
      }

      circle.centerPoint.x += 2;

      if (isAllCrossed) {
        circle.currentPoint.x -= window.innerWidth + randomValue;
        circle.centerPoint.x -= window.innerWidth + randomValue;
      }
    }

    return inAnimation;
  }

  moveOnPath({ name, pathName }: { name: string; pathName: string }) {
    const positionsObject = CircleManager.getPositionsObject();

    const currentValue = (positionsObject as TPositionsObject)?.[pathName];

    if (!currentValue) {
      return;
    }

    const circles = this.circleListObject[name];

    for (const circle of circles) {
      circle.travelPath({ path: currentValue.points });
    }
  }
}
