import $ from "./document_helper";

const sizes = {
  x: window.innerWidth,
  y: window.innerHeight,
};

let contextInstance: CanvasRenderingContext2D | null = null;
let canvasInstance: HTMLCanvasElement | null = null;

export const getCanvas = () => {
  if (canvasInstance) {
    return canvasInstance;
  }

  const canvas = $`#my-canvas` as HTMLCanvasElement | null;

  if (!canvas) {
    return null;
  }

  canvasInstance = canvas;
  canvas.height = sizes.y;
  canvas.width = sizes.x;

  return canvas;
};

export const getContext = () => {
  if (contextInstance) {
    return contextInstance;
  }

  const canvas = getCanvas();

  if (!canvas) {
    return null;
  }

  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (context) {
    contextInstance = context;
  }

  return context;
};

const handleResize = () => {
  sizes.x = window.innerWidth;
  sizes.y = window.innerHeight;

  const canvas = getCanvas();

  if (!canvas) {
    return;
  }

  canvas.width = sizes.x;
  canvas.height = sizes.y;
};

window.addEventListener("resize", handleResize);
