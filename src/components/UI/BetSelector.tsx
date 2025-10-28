import * as PIXI from "pixi.js";
import React, { useEffect, useRef } from "react";

interface PixiBetSelectorProps {
  x: number;
  y: number;
  options: { label: string; cost: number }[];
  selectedLabel: string;
  onSelect: (label: string) => void;
}

export const PixiBetSelector: React.FC<PixiBetSelectorProps> = ({
  x,
  y,
  options,
  selectedLabel,
  onSelect,
}) => {
  const BUTTON_WIDTH = 100;
  const BUTTON_HEIGHT = 42;
  const GAP = 15;

  const graphicsRefs = useRef<(PIXI.Graphics | null)[]>([]);

  useEffect(() => {
    graphicsRefs.current.forEach((g, i) => {
      if (!g) return;
      const opt = options[i];

      g.eventMode = "static"; // Pixi v8 way to enable interactivity
      g.cursor = "pointer";

      g.removeAllListeners();
      g.on("pointertap", () => onSelect(opt.label));
      g.on("pointerover", () => (g.alpha = 0.85));
      g.on("pointerout", () => (g.alpha = 1));
    });
  }, [options, onSelect, selectedLabel]);

  return (
    <pixiContainer x={x} y={y}>
      {options.map((opt, i) => (
        <pixiContainer key={opt.label} x={i * (BUTTON_WIDTH + GAP)}>
          <pixiGraphics
            ref={(el) => {
              graphicsRefs.current[i] = el;
            }}
            draw={(g) => {
              g.clear();

              const isSelected = selectedLabel === opt.label;

              // 🎨 Color theme
              const baseColor = isSelected ? 0xffe600 : 0x1b7431; // yellow highlight / dark green
              const borderColor = isSelected ? 0xfff08a : 0x00cc00; // gold / bright green border

              // ✅ Modern Pixi v8 fill/stroke
              g.fill({ color: baseColor })
                .stroke({ color: borderColor, width: 3 })
                .roundRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 10)
                .fill()
                .stroke();
            }}
          />

          <pixiText
            text={`${opt.label} ($${opt.cost})`}
            x={BUTTON_WIDTH / 2}
            y={BUTTON_HEIGHT / 2}
            anchor={0.5}
            style={
              new PIXI.TextStyle({
                fill: selectedLabel === opt.label ? "#000000" : "#ffffff",
                fontSize: 15,
                fontWeight: "bold",
                dropShadow: {
                  color: "#003300",
                  distance: 2,
                  alpha: 0.6,
                  blur: 1,
                },
              })
            }
          />
        </pixiContainer>
      ))}
    </pixiContainer>
  );
};
