export default class Point {
  y: number;
  x: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static findMinValuesFromPoints(points: Point[]): {
    minPoint: Point;
    maxPoint: Point;
  } {
    const xValues = points.map((point) => point.x);
    const yValues = points.map((point) => point.y);

    const minX = Math.min(...xValues);
    const minY = Math.min(...yValues);
    const maxX = Math.max(...xValues);
    const maxY = Math.max(...yValues);

    const minPoint = new Point(minX, minY);
    const maxPoint = new Point(maxX, maxY);

    return { minPoint, maxPoint };
  }

  static normalizePoints(points: Point[]): Point[] {
    const { minPoint } = Point.findMinValuesFromPoints(points);

    return points.map((point) => {
      return new Point(point.x - minPoint.x, point.y - minPoint.y);
    });
  }

  static movePointsCloser(point: Point, center: Point, scale: number) {
    const currentDistanceFromCenter = Math.sqrt(
      (point.x - center.x) ** 2 + (point.y - center.y) ** 2
    );

    const newDistance = currentDistanceFromCenter / scale;
    const direction = new Point(
      (point.x - center.x) / currentDistanceFromCenter,
      (point.y - center.y) / currentDistanceFromCenter
    );

    point.x = center.x + direction.x * newDistance;
    point.y = center.y + direction.y * newDistance;
  }

  static scaleDownShape(
    points: Point[],
    scale: number,
    center: Point
  ): Point[] {
    let normalizedPoints: Point[] = [];

    console.log("scale down");

    for (let index = 0; index < points.length; index++) {
      const point = points[index];

      Point.movePointsCloser(point, center, scale);

      if (index % scale !== 0) {
        normalizedPoints.push(point);
      }
    }

    return normalizedPoints;
  }

  static scaleUpShape(points: Point[], scale: number): Point[] {
    let normalizedPoints: Point[] = [];

    console.log("scale up");

    for (let index = 0; index < points.length; index++) {
      const point = points[index];

      // move points further

      if (index % scale === 0) {
        // add more points in between, and space points
      }
      normalizedPoints.push(point);
    }

    return normalizedPoints;
  }

  static normalizeShape({
    points,
    targetWidth = 60,
    targetHeight = 60,
    scale,
  }: {
    points: Point[];
    targetWidth?: number;
    targetHeight?: number;
    scale?: number;
    redundancyThreshold?: number;
  }): Point[] {
    const { minPoint, maxPoint } = Point.findMinValuesFromPoints(points);
    const center = Point.calculateCenterPoint(points);
    const width = maxPoint.x - minPoint.x;
    const height = maxPoint.y - minPoint.y;

    const scaleX = scale || targetWidth / width;
    const scaleY = scale || targetHeight / height;

    const isScaleXUp = scaleX > 1;
    const isScaleYUp = scaleY > 1;
    const isNaturalScaleX = scaleX === 1;
    const effectiveScaleX = isScaleXUp ? scaleX : Math.round(1 / scaleX);

    if (isNaturalScaleX) {
      return points;
    }

    if (isScaleYUp) {
      return Point.scaleUpShape(points, effectiveScaleX);
    }

    return Point.scaleDownShape(points, effectiveScaleX, center);
  }

  static getRandomSidePoint() {
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;

    const coefficient = Math.round(Math.random()); // 0 or 1

    x = x * coefficient;
    y = y * (1 - coefficient);

    return new Point(x, y);
  }

  static calculateCenterPoint(points: Point[]): Point {
    const { minPoint, maxPoint } = Point.findMinValuesFromPoints(points);
    const centerX = (minPoint.x + maxPoint.x) / 2;
    const centerY = (minPoint.y + maxPoint.y) / 2;
    return new Point(centerX, centerY);
  }

  static calculateDrawingBox(points: Point[]) {
    // const positionsObject = this.getPositionsObject();

    // const currentValue = (positionsObject as TPositionsObject)?.[name];

    // if (!currentValue) {
    // return { width: null, height: null, centerPoint: null };
    // }

    let minX: number | null = null;
    let minY: number | null = null;
    let maxX: number | null = null;
    let maxY: number | null = null;

    points.forEach((pointData) => {
      if (minX === null || pointData.x < minX) {
        minX = pointData.x;
      }

      if (minY === null || pointData.y < minY) {
        minY = pointData.y;
      }

      if (maxX === null || pointData.x > maxX) {
        maxX = pointData.x;
      }

      if (maxY === null || pointData.y > maxY) {
        maxY = pointData.y;
      }
    });

    const width = maxX! - minX!;
    const height = maxY! - minY!;

    const centerPoint = new Point(minX! + width / 2, minY! + height / 2);

    return {
      width,
      height,
      centerPoint,
    };
  }
}
