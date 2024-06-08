import Point from "../point";

export type TDrawing = {
  keySequence: string[] | string;
  displayTime?: number;
  isText?: boolean;
  isImage?: boolean;
  gap?: number;
};

export type TAddDrawing = {
  isFirstWord?: boolean;
  startingPosition: Point;
  drawingName: string;
};
