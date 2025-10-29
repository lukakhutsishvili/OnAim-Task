import { useEffect, useState } from "react";
import { Assets } from "pixi.js";
import * as PIXI from "pixi.js";

export const useAssetsLoader = () => {
  const [playerTexture, setPlayerTexture] = useState<PIXI.Texture | null>(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  async function loadAssets() {
    const texture = await Assets.load("/assets/pngwing.com.png");
    setPlayerTexture(texture);
    setAssetsLoaded(true);
  }

  useEffect(() => {
    loadAssets();
  }, []);

  return { playerTexture, assetsLoaded };
};
