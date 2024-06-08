import { getContext } from "./context_helper";

let instance: Waves | null = null;

export default class Waves {
  frames!: number;
  phi!: number;
  ctx!: CanvasRenderingContext2D | null;
  step!: number;
  gradientA!: CanvasGradient;
  gradientB!: CanvasGradient;
  frequency!: number;
  amplitude!: number;
  y!: number;
  coords: any;

  constructor() {
    if (instance) {
      return instance;
    }

    this.frames = 0;
    this.phi = 0;
    this.ctx = getContext();
    this.step = 0;
    this.coords = {};

    if (!this.ctx) {
      return;
    }

    this.gradientA = this.ctx.createLinearGradient(
      0,
      window.innerHeight / 2,
      0,
      window.innerHeight
    );
    this.gradientA.addColorStop(0, "#29c3d3");
    this.gradientA.addColorStop(1, "#15656e");

    this.gradientB = this.ctx.createLinearGradient(
      0,
      window.innerHeight / 2,
      0,
      window.innerHeight
    );
    this.gradientB.addColorStop(0, "#55dee5");
    this.gradientB.addColorStop(1, "#399499");

    this.frequency = 0.01;
    this.amplitude = 100;
    this.y = 0;

    instance = this;
  }

  draw() {
    if (!this.ctx) {
      return;
    }

    this.ctx.save();

    this.frames++;
    this.phi = this.frames / 88;

    this.ctx.beginPath();
    this.ctx.moveTo(-1, window.innerHeight);

    for (var x = -1; x < window.innerWidth; x++) {
      this.y =
        (Math.sin(x * this.frequency + this.phi) * this.amplitude) / 2 +
        this.amplitude / 2;

      const waveHeight =
        this.y + window.innerHeight - 110 + Math.sin(this.step / 2) * 10;

      this.ctx.lineTo(x, waveHeight); // setting it to the bottom of the page 100= lift

      this.coords[x] = waveHeight;
    }
    this.ctx.lineTo(window.innerWidth, window.innerHeight);
    this.ctx.lineTo(-1, window.innerHeight);
    this.ctx.fillStyle = this.gradientA;
    this.ctx.fill();
    this.frames++;
    this.phi = this.frames / 72;

    this.ctx.beginPath();

    this.ctx.moveTo(-1, window.innerHeight);

    for (var x = -1; x < window.innerWidth; x++) {
      this.y =
        (Math.sin(x * this.frequency + this.phi) * this.amplitude) / 4 +
        this.amplitude / 4;

      const waveHeight =
        this.y + window.innerHeight - 110 + Math.sin(this.step) * 20;

      this.ctx.lineTo(x, waveHeight); // setting it to the bottom of the page 100= lift

      this.coords[x] = Math.max(waveHeight, this.coords?.[x] || 0);
    }

    this.ctx.lineTo(window.innerWidth, window.innerHeight);
    this.ctx.lineTo(-1, window.innerHeight);
    this.ctx.fillStyle = this.gradientB;
    this.ctx.fill();
    this.step += 0.02;

    this.ctx.restore();
  }
}
