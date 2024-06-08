import "./main.css";
import { getContext } from "./context_helper";
import CircleManager from "./circle_manager";
import { TPointData, TUpdateDrawing } from "./circle_manager/types";
import Point from "./point";
import { TDrawing } from "./drawing/types";
// import DrawingManager from "./drawing_manager";
import EditorManager from "./editor_manager";
import { getBirthDayTextList } from "./text_helper";
import Waves from "./waves";
import Clouds from "./clouds";
import Sun from "./sun";
import Sky from "./sky";
import Grass from "./grass";
import Kayak from "./kayak";
import AudioManager from "./audio_manager";
import DrawingManager from "./drawing_manager";

const editorManager = new EditorManager();
const circleManager = new CircleManager();

(window as any).saveDrawing = ({
  name,
  scale,
}: {
  name: string;
  scale?: number;
}) => circleManager.saveDrawing({ name, scale });

(window as any).migrateAllDrawings = () => circleManager.migrateAllDrawings();
(window as any).updateDrawingShape = ({
  name,
  targetWidth,
  targetHeight,
}: TUpdateDrawing) =>
  circleManager.updateDrawingShape({
    name,
    shouldSave: true,
    targetHeight,
    targetWidth,
  });

(window as any).loadDrawing = (name: string, centerData?: TPointData) => {
  if (centerData) {
    const point = new Point(centerData.x, centerData.y);

    return circleManager.loadDrawing({
      name,
      newCenterPoint: point,
      objectName: name,
    });
  }

  return circleManager.loadDrawing({ name, objectName: name });
};

(window as any).context = getContext();

(window as any).circleManager = circleManager;

const drawingMatrix: TDrawing[] = [];

const textList = getBirthDayTextList();

for (const text of textList) {
  drawingMatrix.push({
    keySequence: text,
    isText: true,
  });
}

const drawingManager = new DrawingManager({ drawingMatrix });
let drawIndex = 0;

const threshHold = 400;
let innerIndex = 0;

const getStartingX = () => window.innerWidth * 0.9;
const getStartingY = () => window.innerHeight * 0.25;
const startingPosition = new Point(getStartingX(), getStartingY());

let finishedSentence = false;

let result2: {
  totalWidth: number;
  lineMaxHeight: number;
  startingPosition: Point;
} | null;

const updatePosition = (index: number) => {
  if (index % 6 === 0 && index !== 0) {
    startingPosition.x = getStartingX();
    startingPosition.y = getStartingY() + 240;

    return;
  }

  if (index % 3 === 0 && index !== 0) {
    startingPosition.x = getStartingX();
    startingPosition.y = getStartingY() + 120;

    return;
  }

  startingPosition.x -= (result2?.totalWidth || 0) * 1.5 + 100;
};

const drawSentence = () => {
  const numberOfDrawings = 8;

  for (let index = 0; index < numberOfDrawings; index++) {
    circleManager.clearCircles(`sentence${index}`);
  }

  for (let index = 0; index < numberOfDrawings; index++) {
    result2 = drawingManager.draw({
      drawIndex: innerIndex + index,
      currentStartingPosition: startingPosition,
      drawingName: `sentence${index}`,
    });

    if (result2 === null) {
      finishedSentence = true;
    }

    updatePosition(index);
  }

  startingPosition.x = getStartingX();
  startingPosition.y = getStartingY();

  innerIndex += numberOfDrawings;
};

let canDrawEnv = true;

const waves = new Waves();
const clouds = new Clouds();
const sun = new Sun();
const sky = new Sky();
const grass = new Grass();
const kayak = new Kayak(canDrawEnv);
new AudioManager(canDrawEnv);
let startTime: number | null = null;
let isKayakInAnimation = true;

const drawSetUp = () => {
  sky.draw();
  sun.draw();
  grass.draw();
  waves.draw();
  clouds.draw();
  isKayakInAnimation = kayak.draw();
};

const animate = (timeStamp: number) => {
  if (!startTime) {
    startTime = timeStamp;
  }

  startTime = timeStamp;

  requestAnimationFrame((currentTimeStamp) => animate(currentTimeStamp));
  const context = getContext();

  if (context) {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "#000000";

    if (canDrawEnv) {
      drawSetUp();
    }
  }

  editorManager.draw();
  circleManager.draw();

  if (drawIndex % threshHold === 0) {
    if (canDrawEnv && !finishedSentence && !isKayakInAnimation) {
      drawSentence();
    }
  }

  drawIndex++;
};

const start = () => {
  requestAnimationFrame((timeStamp) => animate(timeStamp));
};

start();
