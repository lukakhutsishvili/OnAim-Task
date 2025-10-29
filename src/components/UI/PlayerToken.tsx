// src/components/UI/PlayerToken.tsx
import * as PIXI from "pixi.js";
import { forwardRef, useEffect, useState, useRef } from "react";
import gsap from "gsap";

interface PlayerTokenProps {
  x: number;
  y: number;
  texture: PIXI.Texture;
  isBonus: boolean;
}

const phrases = [
  "Keep spinning!",
  "You’ll win soon!",
  "Feeling lucky?",
  "Let’s go!",
  "Big one coming!",
  "Good vibes only ✨",
  "Don’t stop now!",
  "Almost there!",
];

export const PlayerToken = forwardRef<PIXI.Sprite, PlayerTokenProps>(
  ({ x, y, texture, isBonus }, ref) => {
    const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
    const chatRef = useRef<PIXI.Container>(null);

    // 🎙️ Cycle phrases — fade the entire bubble (graphics + text)
    useEffect(() => {
      let isMounted = true;

      const cyclePhrases = () => {
        if (!chatRef.current || !isMounted) return;

        // Fade out entire bubble
        gsap.to(chatRef.current, {
          alpha: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            // After fade-out, wait and then switch text
            setTimeout(() => {
              if (!isMounted || !chatRef.current) return;
              const newPhrase =
                phrases[Math.floor(Math.random() * phrases.length)];
              setCurrentPhrase(newPhrase);

              // Fade the whole thing back in
              gsap.to(chatRef.current, {
                alpha: 1,
                duration: 0.6,
                ease: "power2.out",
              });

              // Schedule next phrase switch
              setTimeout(cyclePhrases, Math.random() * 3000 + 4000);
            }, 1000); // delay before next appearance
          },
        });
      };

      const timer = setTimeout(cyclePhrases, 2500);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }, []);

    // 🗨️ Make the chat bubble follow player position
    useEffect(() => {
      if (!ref || typeof ref === "function" || !chatRef.current) return;
      const s = ref as React.MutableRefObject<PIXI.Sprite | null>;
      const chat = chatRef.current;
      if (!s.current) return;

      const update = () => {
        if (s.current && chat) {
          chat.x = s.current.x + 45;
          chat.y = s.current.y - 40;
        }
      };
      gsap.ticker.add(update);
      return () => gsap.ticker.remove(update);
    }, [ref]);

    return (
      <>
        {/* 👤 Player Sprite */}
        <pixiSprite
          ref={ref}
          texture={texture}
          anchor={0.5}
          x={x}
          y={y}
          width={70}
          height={70}
          tint={isBonus ? 0xffd700 : 0xffffff}
        />

        {/* 💬 Entire Chat Bubble that fades together */}
        <pixiContainer ref={chatRef} alpha={1}>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: 0xffffff, alpha: 0.95 })
                .roundRect(-50, -20, 100, 35, 10)
                .fill();
              g.moveTo(-10, 15)
                .lineTo(0, 25)
                .lineTo(10, 15)
                .fill({ color: 0xffffff, alpha: 0.95 });
              g.stroke({ color: 0x000000, width: 2, alpha: 0.6 })
                .roundRect(-50, -20, 100, 35, 10)
                .stroke();
            }}
          />
          <pixiText
            text={currentPhrase}
            anchor={0.5}
            y={-2}
            style={
              new PIXI.TextStyle({
                fill: "#000000",
                fontSize: 13,
                fontWeight: "900",
                wordWrap: true,
                wordWrapWidth: 85,
                align: "center",
              })
            }
          />
        </pixiContainer>
      </>
    );
  },
);
