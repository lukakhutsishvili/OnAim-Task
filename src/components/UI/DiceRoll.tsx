// ✅ DiceRoll.tsx
import * as PIXI from "pixi.js";
import { extend } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

extend({
  Container: PIXI.Container,
  Graphics: PIXI.Graphics,
  Text: PIXI.Text,
});

interface DiceRollProps {
  appSize: number;
  triggerRoll: boolean;
  setTriggerRoll: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish: (sum: number) => void;
  rollValue?: number;
}

export const DiceRoll: React.FC<DiceRollProps> = ({
  appSize,
  triggerRoll,
  setTriggerRoll,
  onFinish,
  rollValue = 2,
}) => {
  const leftDie = useRef<PIXI.Graphics>(null);
  const rightDie = useRef<PIXI.Graphics>(null);
  const [leftValue, setLeftValue] = useState(1);
  const [rightValue, setRightValue] = useState(1);

  const drawDie = (g: PIXI.Graphics, value: number) => {
    const size = 70;
    g.clear();
    g.beginFill(0xffffff);
    g.lineStyle(2, 0x000000);
    g.drawRoundedRect(-size / 2, -size / 2, size, size, 10);
    g.endFill();

    const pip = (x: number, y: number) => {
      g.beginFill(0x000000);
      g.drawCircle(x, y, 5);
      g.endFill();
    };
    const o = size / 4;

    switch (value) {
      case 1:
        pip(0, 0);
        break;
      case 2:
        pip(-o, -o);
        pip(o, o);
        break;
      case 3:
        pip(-o, -o);
        pip(0, 0);
        pip(o, o);
        break;
      case 4:
        pip(-o, -o);
        pip(o, -o);
        pip(-o, o);
        pip(o, o);
        break;
      case 5:
        pip(-o, -o);
        pip(o, -o);
        pip(0, 0);
        pip(-o, o);
        pip(o, o);
        break;
      case 6:
        pip(-o, -o);
        pip(-o, 0);
        pip(-o, o);
        pip(o, -o);
        pip(o, 0);
        pip(o, o);
        break;
    }
  };

  useEffect(() => {
    if (!triggerRoll) return;

    // ✅ Reset rotation before each roll to ensure visible spin
    if (leftDie.current && rightDie.current) {
      leftDie.current.rotation = 0;
      rightDie.current.rotation = 0;
    }

    const tl = gsap.timeline({
      onUpdate: () => {
        if (leftDie.current && rightDie.current) {
          drawDie(leftDie.current, ((Math.random() * 6) | 0) + 1);
          drawDie(rightDie.current, ((Math.random() * 6) | 0) + 1);
        }
      },
      onComplete: () => {
        let left = Math.floor(Math.random() * 6) + 1;
        let right = rollValue - left;
        if (right < 1 || right > 6) {
          left = Math.floor(rollValue / 2);
          right = rollValue - left;
        }

        setLeftValue(left);
        setRightValue(right);
        if (leftDie.current && rightDie.current) {
          drawDie(leftDie.current, left);
          drawDie(rightDie.current, right);
        }

        // ✅ Reset rotation back to 0 for next roll
        if (leftDie.current && rightDie.current) {
          gsap.set([leftDie.current, rightDie.current], { rotation: 0 });
        }

        setTriggerRoll(false);
        onFinish(rollValue);
      },
    });

    // ✅ Shared rotation animation
    tl.to([leftDie.current, rightDie.current], {
      rotation: Math.PI * 4,
      duration: 1.2,
      ease: "back.out(2)",
      transformOrigin: "center center",
    });

    return () => {
      tl.kill();
    };
  }, [triggerRoll, rollValue]);

  return (
    <pixiContainer x={appSize / 2} y={appSize / 1.6}>
      <pixiGraphics ref={leftDie} x={-50} draw={(g) => drawDie(g, leftValue)} />
      <pixiGraphics
        ref={rightDie}
        x={50}
        draw={(g) => drawDie(g, rightValue)}
      />
    </pixiContainer>
  );
};
