import { getContext } from "./context_helper";

export default class Sun {
  constructor() {}

  // Function to draw a sun
  drawSun(x: number, y: number, radius: number) {
    const ctx = getContext();

    if (!ctx) {
      return;
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "yellow";
    ctx.fill();
  }
  draw() {
    // Draw the sun
    this.drawSun(window.innerWidth * 0.3, window.innerHeight * 0.1, 50);
  }
}
