import $ from "./document_helper";

export default class AudioManager {
  audio: HTMLAudioElement | null;
  isPlaying: boolean;
  constructor(canDrawEnv: boolean) {
    this.audio = $`#my-audio` as HTMLAudioElement | null;
    this.isPlaying = false;

    window.addEventListener("click", () => {
      if (!this.isPlaying && canDrawEnv) {
        this.audio?.play();
        this.isPlaying = true;
      }
    });
  }
}
