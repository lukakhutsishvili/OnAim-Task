import { Howl } from "howler";

export const sounds = {
  spin: new Howl({ src: ["/assets/sounds/spin.mp3"], volume: 0.6 }),
  move: new Howl({ src: ["/sounds/move.mp3"], volume: 0.4 }),
  win: new Howl({ src: ["/assets/sounds/win.mp3"], volume: 0.7 }),
  bonus: new Howl({ src: ["/assets/sounds/bonus.mp3"], volume: 0.8 }),
  movement: new Howl({
    src: ["public/assets/sounds/movement.mp3"],
    volume: 0.6,
  }),
};
