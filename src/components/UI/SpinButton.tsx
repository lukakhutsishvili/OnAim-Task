import * as PIXI from "pixi.js";
import { useEffect, useRef } from "react";
import { useTick } from "@pixi/react";
import { sounds } from "../gameLogic/Sounds";
import { BetOption } from "../../mockdata";

export interface PixiSpinButtonProps {
  x: number;
  y: number;
  isBonus: boolean;
  freeSpinsLeft?: number;
  setFreeSpinsLeft?: React.Dispatch<React.SetStateAction<number>>;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  selectedBet: BetOption;
  triggerRoll: boolean;
  setTriggerRoll: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
}

export const PixiSpinButton: React.FC<PixiSpinButtonProps> = ({
  x,
  y,
  isBonus,
  freeSpinsLeft = 0,
  setFreeSpinsLeft,
  balance,
  setBalance,
  selectedBet,
  triggerRoll,
  setTriggerRoll,
  onClick,
  disabled = false,
}) => {
  const shadowRef = useRef<PIXI.Graphics>(null);
  const buttonRef = useRef<PIXI.Graphics>(null);
  const textRef = useRef<PIXI.Text>(null);
  const offsetRef = useRef(0);

  // 🔊 Handle click
  const handleSpinClick = async () => {
    if (triggerRoll || disabled) return;

    sounds.spin?.play?.();
    offsetRef.current = 8;

    // 🎁 Bonus spin
    if (isBonus && freeSpinsLeft > 0) {
      setTriggerRoll(true);
      setFreeSpinsLeft?.((prev) => prev - 1);
      await onClick?.();
      return;
    }

    // 💰 Regular spin
    const betCost = selectedBet.cost;
    if (balance < betCost) {
      alert("Not enough balance!");
      return;
    }

    setBalance((prev) => prev - betCost);
    setTriggerRoll(true);
    await onClick?.();
  };

  // 🟩 Shadow
  useEffect(() => {
    const shadow = shadowRef.current;
    if (!shadow) return;
    shadow.clear();
    shadow
      .fill({ color: 0x003300, alpha: 0.55 })
      .roundRect(-120, -28, 240, 70, 12)
      .fill();
  }, []);

  // 🟩 Button visuals & events
  useEffect(() => {
    const g = buttonRef.current;
    if (!g) return;

    const baseColor = disabled
      ? 0x4c4c4c
      : isBonus
      ? 0x00cc00
      : 0x00a000;

    g.clear();
    g.fill({ color: baseColor }).roundRect(-120, -35, 240, 70, 12).fill();

    g.eventMode = disabled ? "none" : "static";
    g.cursor = disabled ? "not-allowed" : "pointer";
    g.removeAllListeners();

    if (!disabled) {
      g.on("pointertap", handleSpinClick);
      g.on("pointerover", () => {
        g.alpha = 0.85;
      });
      g.on("pointerout", () => {
        g.alpha = 1;
      });
    } else {
      g.alpha = 0.6;
    }
  }, [isBonus, triggerRoll, balance, selectedBet, disabled]);

  // 🧾 Text label (✨ Updated)
  useEffect(() => {
    if (!textRef.current) return;

    if (disabled) {
      textRef.current.text = "SPINNING...";
    } else if (isBonus) {
      // 🌀 Auto spin mode text
      textRef.current.text = `AUTO SPIN (${freeSpinsLeft})`;
    } else {
      textRef.current.text = `SPIN -$${selectedBet.cost}`;
    }
  }, [isBonus, freeSpinsLeft, selectedBet.cost, disabled]);

  // 🎬 Press animation
  useTick(() => {
    const g = buttonRef.current;
    if (!g) return;
    const targetOffset = 0;
    const diff = targetOffset - offsetRef.current;
    offsetRef.current += diff * 0.2;
    g.y = offsetRef.current;
    if (textRef.current) textRef.current.y = offsetRef.current;
  });

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics ref={shadowRef} draw={() => {}} />
      <pixiGraphics ref={buttonRef} draw={() => {}} />
      <pixiText
        ref={textRef}
        anchor={0.5}
        style={
          new PIXI.TextStyle({
            fill: "#ffffff",
            fontSize: 28,
            fontWeight: "900",
            dropShadow: {
              color: "#003300",
              blur: 0,
              distance: 3,
              alpha: 0.7,
              angle: Math.PI / 2,
            },
          })
        }
      />
    </pixiContainer>
  );
};
