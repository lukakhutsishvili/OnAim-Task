import { useRef } from "react";
import gsap from "gsap";
import * as PIXI from "pixi.js";
import { sounds } from "../components/gameLogic/Sounds";

export const usePlayerMovement = (
  positions: { x: number; y: number }[],
  offsetX: number,
  offsetY: number,
  cellSize: number,
  setPlayerPos: React.Dispatch<React.SetStateAction<number>>,
  setIsBonus: React.Dispatch<React.SetStateAction<boolean>>,
  isBonus: boolean,
  freeSpinsLeft: number
) => {
  const spriteRef = useRef<PIXI.Sprite>(null);

  const movePlayer = (currentPos: number, steps: number, onEnd: () => void) => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const nextPos = (currentPos + step) % positions.length;
      const pos = positions[nextPos];

      if (spriteRef.current) {
        gsap.to(spriteRef.current, {
          x: pos.x + offsetX + cellSize / 2,
          y: pos.y + offsetY + cellSize / 2,
          duration: 0.25,
          ease: "power1.inOut",
        });
      }

      sounds.movement.play();
      if (step === steps) {
        clearInterval(interval);
        setPlayerPos(nextPos);
        onEnd();
         if (isBonus && freeSpinsLeft === 0) setIsBonus(false);
      }
    }, 300);
  };

  return { spriteRef, movePlayer };
};

