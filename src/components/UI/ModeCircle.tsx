import * as PIXI from "pixi.js";
import { extend } from "@pixi/react";
import React from "react";

extend({
  Container: PIXI.Container,
  Graphics: PIXI.Graphics,
  Text: PIXI.Text,
});

interface ModeCircleProps {
  isBonus: boolean;
  x: number;
  y: number;
}

export const ModeCircle: React.FC<ModeCircleProps> = ({ isBonus, x, y }) => {
  return (
    <pixiContainer x={x} y={y}>
      {/* 🟢 Main circle */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: 0x00A300 }) // base green fill
            .stroke({ color: 0x0d4a1d, width: 4 }) // dark green border
            .circle(0, 0, 85)
            .fill()
            .stroke();
        }}
      />

      {/* 🔤 Text */}
      <pixiText
        text={isBonus ? "BONUS" : "DEFAULT"}
        anchor={0.5}
        y={1}
        style={
          new PIXI.TextStyle({
            fill: isBonus ? "#ffe600" : "#ffffff",
            fontFamily: "Arial Black",
            fontWeight: "800",
            fontSize: 30,
            align: "center",
            // ✅ Pixi v8 dropShadow format
            dropShadow: {
              color: "#000000",
              blur: 4,
              distance: 3,
              alpha: 0.6,
            },
          })
        }
      />
    </pixiContainer>
  );
};
