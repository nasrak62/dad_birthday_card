import { getContext } from "./context_helper";

export default class Clouds {
  numberOfClouds: number;
  cloudPoints: any[];
  constructor() {
    this.numberOfClouds = Math.round(window.innerWidth / 100);
    this.cloudPoints = [];

    for (let index = 0; index < this.numberOfClouds; index++) {
      const cloudX = Math.random() * window.innerWidth;
      const cloudY = Math.random() * window.innerHeight * 0.1 + 80;
      const cloudSpeed = (Math.random() + 0.1) * this.numberOfClouds * 0.2;

      this.cloudPoints.push({ x: cloudX, y: cloudY, speed: cloudSpeed });
    }
  }

  // Function to draw clouds
  drawCloud(x: number, y: number) {
    const ctx = getContext();

    if (!ctx) {
      return;
    }

    ctx.beginPath();
    ctx.arc(x, y, 30, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + 40, y - 20, 40, Math.PI * 1, Math.PI * 1.95);
    ctx.arc(x + 80, y, 30, Math.PI * 1.37, Math.PI * 0.5);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();
  }

  draw() {
    for (const cloudPoint of this.cloudPoints) {
      this.drawCloud(cloudPoint.x, cloudPoint.y);

      cloudPoint.x += cloudPoint.speed;

      if (cloudPoint.x > window.innerWidth * 1.1) {
        cloudPoint.x = 0;
      }
    }
  }
}
