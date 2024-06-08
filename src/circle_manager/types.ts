import Circle from "../circle/index";
import Point from "../point";

export type TLoadDrawingBase = {
  newCenterPoint?: Point;
  colorOverride?: string | (() => string);
  radiusOverride?: number | (() => number);
  scale?: number;
};

export type TLoadDrawing = {
  name: string;
  newCenterPoint?: Point;
  colorOverride?: string | (() => string);
  radiusOverride?: number | (() => number);
  scale?: number;
  objectName: string;
};

export type TPointData = {
  x: number;
  y: number;
};

export type TPositionsObjectData = {
  points: TPointData[];
  height: number;
  width: number;
  centerPoint: TPointData;
  colors: string[];
  radiuses: number[];
};

export type TPositionsObject = {
  [key: string]: TPositionsObjectData;
};

export type TCirclesObject = {
  [key: string]: Circle[];
};

export type TLoadedImgToCircles = {
  currentValue: TPositionsObjectData;
} & TLoadDrawingBase;

export type TUpdateDrawing = {
  name: string;
  shouldSave?: boolean;
  positionsObject?: TPositionsObject | null;
  targetWidth?: number;
  targetHeight?: number;
  scale?: number;
};
