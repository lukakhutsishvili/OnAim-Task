import * as PIXI from "pixi.js";
import { useEffect, useRef } from "react";
import { useTick } from "@pixi/react";

interface RaysOverlayProps {
  isBonus?: boolean; // 🟡 triggers golden mode
  alpha?: number;
  speed?: number;
}

export const RaysOverlay: React.FC<RaysOverlayProps> = ({
  isBonus = false,
  alpha = 0.25,
  speed = 0.002,
}) => {
  const gRef = useRef<PIXI.Graphics>(null);
  const containerRef = useRef<PIXI.Container>(null);

  const CANVAS_SIZE = 600;
  const CENTER = CANVAS_SIZE / 2;
  const RADIUS = 650;

  // 🌀 Continuous rotation
  useTick((ticker) => {
    if (containerRef.current) {
      containerRef.current.rotation += speed * ticker.deltaTime;
    }
  });

  // ☀️ Draw two-tone rays (color depends on mode)
  useEffect(() => {
    const g = gRef.current;
    if (!g) return;

    g.clear();

    // 🎨 Dynamic palette
    const baseColor = isBonus ? 0x7a5b00 : 0x0d4a1d; // deep gold / dark green
    const brightColor = isBonus ? 0xffe600 : 0x00cc00; // vivid yellow / vivid green

    const rayCount = 24;
    const step = (Math.PI * 2) / rayCount;

    for (let i = 0; i < rayCount; i++) {
      const angle = i * step;
      const isBright = i % 2 === 0;
      const color = isBright ? brightColor : baseColor;

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
