import CanvasButton from "../canvas_button";
import { getContext } from "../context_helper";
import Point from "../point";

let instance: EditorManager | null = null;

export default class EditorManager {
  isInEditorMode!: boolean;
  editorModeButtons!: CanvasButton[];
  noEditorModeButtons!: CanvasButton[];
  zoom!: number;
  input!: HTMLInputElement | null;
  image!: HTMLImageElement | null;
  wasSent!: boolean;
  currentFrame!: number;

  constructor() {
    if (instance) {
      return instance;
    }

    this.isInEditorMode = false;
    this.input = null;
    this.image = null;
    this.wasSent = false;
    this.zoom = 1;
    this.currentFrame = 0;
    this.initButtons();

    window.addEventListener("resize", this.initButtons.bind(this));

    instance = this;
  }

  initButtons() {
    this.editorModeButtons = [];
    this.noEditorModeButtons = [];

    const startEditorButton = new CanvasButton({
      x: window.innerWidth - 100,
      y: 10,
      width: 64,
      height: 30,
      text: "Start Editor",
      onClick: this.handleStartEditorMode.bind(this),
    });

    const closeEditorButton = new CanvasButton({
      x: 10,
      y: 10,
      width: 20,
      height: 20,
      text: "X",
      onClick: this.handleFinishEditorMode.bind(this),
    });

    const uploadImageButton = new CanvasButton({
      x: 50,
      y: 10,
      width: 100,
      height: 20,
      text: "Upload Image",
      onClick: this.handleUploadImage.bind(this),
    });

    const zoomButton = new CanvasButton({
      x: 200,
      y: 10,
      width: 50,
      height: 20,
      text: "Zoom",
      onClick: this.handleZoom.bind(this),
    });

    const releaseZoomButton = new CanvasButton({
      x: 300,
      y: 10,
      width: 100,
      height: 20,
      text: "Release Zoom",
      onClick: this.handleReleaseZoom.bind(this),
    });

    this.editorModeButtons = [
      closeEditorButton,
      uploadImageButton,
      zoomButton,
      releaseZoomButton,
    ];

    this.noEditorModeButtons = [startEditorButton];
  }

  handleZoom() {
    const context = getContext();

    if (!context) {
      return;
    }

    this.zoom *= 2;

    this.zoom = Math.min(this.zoom, 100);

    context.scale(this.zoom, this.zoom);
  }

  handleReleaseZoom() {
    const context = getContext();

    if (!context) {
      return;
    }

    this.zoom *= 0.5;

    this.zoom = Math.max(this.zoom, 1);

    context.scale(this.zoom, this.zoom);
  }

  drawImage({ isOnlyDraw = true }) {
    const context = getContext();

    if (!context || !this.image) {
      return;
    }

    // image.width = 64;
    // image.height = 64;

    const compositeOperation = context.globalCompositeOperation;
    // context.globalCompositeOperation = "destination-over";
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.globalCompositeOperation = "hard-light";
    context.fillStyle = "#ffffff";
    this.image.style.backgroundColor = "#ffffff";

    // Define the size of a frame

    // if (this.currentFrame >= numColumns * numRows - 1) {
    //   this.currentFrame = 0;
    // }

    // context.drawImage(
    //   this.image,
    //   column * frameWidth,
    //   row * frameHeight + 185,
    //   frameWidth,
    //   frameHeight,
    //   200,
    //   200,
    //   frameWidth,
    //   frameHeight
    // );
    context.drawImage(this.image, 0, 0);
    context.fillStyle = "#000000";

    this.currentFrame += 1;

    if (isOnlyDraw) {
      return;
    }

    const imageData = context.getImageData(
      0,
      0,
      this.image.naturalWidth,
      this.image.naturalHeight
    ).data;

    const eventData = [];

    for (let y = 0; y < this.image.height; y += 1) {
      for (let x = 0; x < this.image.width; x += 1) {
        const index = y * this.image.width + x;
        const red = imageData[index * 4];
        const blue = imageData[index * 4 + 1];
        const green = imageData[index * 4 + 2];
        const alpha = imageData[index * 4 + 3];

        const shouldBeWhite = alpha < 255;

        if (shouldBeWhite) {
          continue;
        }

        eventData.push({
          x: x,
          y: y,
          r: shouldBeWhite ? 255 : red,
          g: shouldBeWhite ? 255 : green,
          b: shouldBeWhite ? 255 : blue,
          a: shouldBeWhite ? 255 : 0,
        });
      }
    }
    context.globalCompositeOperation = compositeOperation;

    if (this.wasSent === false) {
      window.dispatchEvent(new CustomEvent("new-image", { detail: eventData }));
      this.wasSent = true;
      console.log(eventData);
    }
  }

  handleFileImage() {
    if (!this.input) {
      return;
    }

    const file = this.input.files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const src = reader.result;

      if (!src) {
        return;
      }

      const image = new Image();

      image.onload = () => {
        this.image = image;
        this.wasSent = false;
      };

      image.src = src as string;
    };
  }

  handleUploadImage() {
    this.input = document.createElement("input");
    this.input.type = "file";
    this.input.accept = "image/*";
    this.input.onchange = this.handleFileImage.bind(this);
    this.input.click();
  }

  handleStartEditorMode() {
    this.isInEditorMode = true;
  }

  handleFinishEditorMode() {
    this.isInEditorMode = false;
  }

  wasEditorButtonClicked(point: Point): boolean {
    const buttonsList = [
      ...this.editorModeButtons,
      ...this.noEditorModeButtons,
    ];

    for (const button of buttonsList) {
      if (button.isDrawn && button.isPointInsideButton(point)) {
        return true;
      }
    }

    return false;
  }

  draw() {
    if (this.isInEditorMode) {
      if (this.image && this.wasSent === false) {
        this.drawImage({});
      }

      this.editorModeButtons.forEach((button) => {
        button.draw();
        button.isDrawn = true;
      });

      this.noEditorModeButtons.forEach((button) => {
        button.isDrawn = false;
      });

      return;
    }

    this.noEditorModeButtons.forEach((button) => {
      button.draw();
      button.isDrawn = true;
    });

    this.editorModeButtons.forEach((button) => {
      button.isDrawn = false;
    });
  }
}
