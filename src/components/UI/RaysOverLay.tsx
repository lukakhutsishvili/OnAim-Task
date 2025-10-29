import * as PIXI from "pixi.js";
import { useEffect, useRef } from "react";
import { useTick } from "@pixi/react";

interface RaysOverlayProps {
  isBonus?: boolean; // 🟡 triggers golden mode
  alpha?: number;
}

export const RaysOverlay: React.FC<RaysOverlayProps> = ({
  isBonus = false,
  alpha = 0.25,
}) => {
  const gRef = useRef<PIXI.Graphics>(null);
  const containerRef = useRef<PIXI.Container>(null);

  const CANVAS_SIZE = 600;
  const CENTER = CANVAS_SIZE / 2;
  const RADIUS = 650;

  // 🌀 Slightly faster spin in bonus mode
  const baseSpeed = isBonus ? 0.0032 : 0.002;

  // Continuous rotation
  useTick((ticker) => {
    if (containerRef.current) {
      containerRef.current.rotation += baseSpeed * ticker.deltaTime;
    }
  });

  // ☀️ Draw two-tone rays (enhanced contrast in bonus)
  useEffect(() => {
    const g = gRef.current;
    if (!g) return;

    g.clear();

    // 🎨 Slightly brighter, more saturated palette in bonus
    const baseColor = isBonus ? 0x9b6b00 : 0x0d4a1d; // golden brown vs deep forest
    const brightColor = isBonus ? 0xffd700 : 0x00e600; // gold vs vivid green

    const rayCount = 24;
    const step = (Math.PI * 2) / rayCount;

    for (let i = 0; i < rayCount; i++) {
      const angle = i * step;
      const color = i % 2 === 0 ? brightColor : baseColor;

      g.fill({ color, alpha })
        .moveTo(0, 0)
        .lineTo(Math.cos(angle) * RADIUS, Math.sin(angle) * RADIUS)
        .lineTo(
          Math.cos(angle + step) * RADIUS,
          Math.sin(angle + step) * RADIUS
        )
        .closePath()
        .fill();
    }
  }, [isBonus, alpha]);

  return (
    <pixiContainer ref={containerRef} x={CENTER} y={CENTER - 50}>
      <pixiGraphics ref={gRef} draw={() => {}} />
    </pixiContainer>
  );
};
