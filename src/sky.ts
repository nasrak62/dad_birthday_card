import { getContext } from "./context_helper";

export default class Sky {
  constructor() {}

  draw() {
    // Create a linear gradient
    const ctx = getContext();

    if (!ctx) {
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);

    // Define the colors for the gradient
    gradient.addColorStop(0, "skyblue"); // Top color
    gradient.addColorStop(1, "white"); // Bottom color

    // Fill the canvas with the gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }
}
