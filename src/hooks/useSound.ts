import { useEffect } from "react";
import { Howl } from "howler";

export const useSounds = () => {
  const spin = new Howl({ src: ["/sounds/spin.mp3"], volume: 0.6 });
  const win = new Howl({ src: ["/sounds/win.mp3"], volume: 0.6 });

  useEffect(() => {
    return () => {
      spin.unload();
      win.unload();
    };
  }, []);

  return {
    playSpin: () => spin.play(),
    playWin: () => win.play(),
  };
};