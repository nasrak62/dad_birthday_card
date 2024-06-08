import CircleManager from "../circle_manager";
import Drawing from "../drawing";
import { TDrawing } from "../drawing/types";
import Point from "../point";
import { TDrawingManagerArgs } from "./types";

export default class DrawingManager {
  drawingMatrix: TDrawing[];

  constructor({ drawingMatrix }: TDrawingManagerArgs) {
    this.drawingMatrix = drawingMatrix;
  }

  calculateTotalWidth(drawIndex?: number): number {
    let lineTotalWidth = 0;
    const positionsObject = CircleManager.getPositionsObject();

    if (drawIndex !== undefined) {
      const data = this.drawingMatrix[drawIndex];
      const keySequence = Drawing.initSequence(
        data?.isText || false,
        data.keySequence
      );

      for (const character of keySequence) {
        const results = positionsObject?.[character];
        lineTotalWidth += results?.width || 0;
      }

      return lineTotalWidth;
    }

    const keySequences = this.drawingMatrix.map((drawingData) => {
      return Drawing.initSequence(
        drawingData.isText || false,
        drawingData.keySequence
      );
    });

    for (const currentSequence of keySequences) {
      for (const character of currentSequence) {
        const results = positionsObject?.[character];
        lineTotalWidth += results?.width || 0;
      }
    }

    return lineTotalWidth;
  }

  draw({
    drawIndex,
    currentStartingPosition,
    drawingName,
  }: {
    drawIndex: number;
    currentStartingPosition: Point;
    drawingName: string;
  }) {
    let lineMaxHeight = 0;

    if (drawIndex >= this.drawingMatrix.length) {
      return null;
    }

    const isFirstWord = drawIndex === 0;
    const drawingObject = this.drawingMatrix[drawIndex];

    const currentDrawing = new Drawing(drawingObject);
    const { maxHeight, totalWidth } = currentDrawing.addDrawing({
      isFirstWord,
      startingPosition: currentStartingPosition,
      drawingName,
    });

    lineMaxHeight = Math.max(lineMaxHeight, maxHeight);

    const point = new Point(
      currentStartingPosition.x + 40,
      currentStartingPosition.y
    );

    return { startingPosition: point, lineMaxHeight, totalWidth };
  }
}
