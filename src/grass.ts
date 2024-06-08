import { getContext } from "./context_helper";

export default class Grass {
  grassBlades: number;
  grassData: any;
  constructor() {
    // Function to draw grass with pointy edges
    // Precompute random values for grass blades
    this.grassBlades = 1000; // Number of grass blades
    this.grassData = [];

    for (let i = 0; i < this.grassBlades; i++) {
      const x = Math.random() * window.innerWidth;
      const height = 30 + Math.random() * 50; // Vary height for natural look
      const cp1x = x + Math.random() * 20 - 10; // Control point 1 x-coordinate
      const cp1y = window.innerHeight - height / 2; // Control point 1 y-coordinate
      const cp2x = x + Math.random() * 20 - 10; // Control point 2 x-coordinate
      const cp2y = window.innerHeight - height; // Control point 2 y-coordinate

      this.grassData.push({ x, height, cp1x, cp1y, cp2x, cp2y });
    }
  }

  draw() {
    // Function to draw grass with bezier curves
    const ctx = getContext();

    if (!ctx) {
      return;
    }

    const grassBladeWidth = 2; // Width of each grass blade

    for (let i = 0; i < this.grassBlades; i++) {
      const { x, height, cp1x, cp1y, cp2x, cp2y } = this.grassData[i];
      const y = window.innerHeight;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y - height);
      ctx.strokeStyle = "green";
      ctx.lineWidth = grassBladeWidth;
      ctx.stroke();
    }
  }
}
