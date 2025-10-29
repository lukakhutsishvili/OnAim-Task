// src/components/GameBoard.tsx
import { useEffect, useState, useMemo, useRef, useLayoutEffect } from "react";
import { Application, extend } from "@pixi/react";
import * as PIXI from "pixi.js";
import gsap from "gsap";
import { BetOption, mockData } from "../mockdata";
import { savePositions } from "./gameLogic/BoardUtils";
import { useAssetsLoader } from "../hooks/useAssetsLoader";
import { usePlayerMovement } from "../hooks/usePlayerMovement";
import { useSpinHandler } from "../hooks/useSpinHandler";
import { PixiSpinButton } from "./UI/SpinButton";
import { DiceRoll } from "./UI/DiceRoll";
import { WinPopup } from "./UI/WinPopUp";
import { ModeCircle } from "./UI/ModeCircle";
import { RaysOverlay } from "./UI/RaysOverLay";
import { PixiBetSelector } from "./UI/BetSelector";
import { mockService } from "../mockService";
import { apiService } from "../apiService";
import { LoaderUI } from "./UI/Loader";
import { sounds } from "./gameLogic/Sounds";

extend({
  Graphics: PIXI.Graphics,
  Container: PIXI.Container,
  Sprite: PIXI.Sprite,
  Text: PIXI.Text,
});

export const GameBoard = () => {
  const [isBonus, setIsBonus] = useState(false);
  const [freeSpinsLeft, setFreeSpinsLeft] = useState(0);
  const [balance, setBalance] = useState(0);
  const [selectedBet, setSelectedBet] = useState<BetOption | null>(null);
  const [playerPos, setPlayerPos] = useState(0);
  const [triggerRoll, setTriggerRoll] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPrize, setPopupPrize] = useState("");
  const [popupAmount, setPopupAmount] = useState(0);
  const [config, setConfig] = useState<typeof mockData | null>(null);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false); // ⛔ disable spin during auto
  

  useEffect(() => {
    const isMock =
      new URLSearchParams(window.location.search).get("mock") === "true";
    const service = isMock ? mockService : apiService;
    service.getInitialData().then((data) => {
      setConfig(data);
      setBalance(data.balance);
      setSelectedBet(data.betOptions[0]);
    });
  }, []);

  const appSize = 600;
  const cellSize = 90;
  const padding = 8;
  const offsetX = (appSize - 5 * (cellSize + padding)) / 2;
  const offsetY = offsetX;
  const positions = savePositions();

  const { playerTexture, assetsLoaded } = useAssetsLoader();
  const { spriteRef, movePlayer } = usePlayerMovement(
    positions,
    offsetX,
    offsetY,
    cellSize,
    setPlayerPos,
    setIsBonus,
    isBonus,
    freeSpinsLeft
  );

  const drawCell = (g: PIXI.Graphics) => {
    g.clear();
    const fillColor = 0x228b22;
    const strokeColor = 0x006400;
    g.fill({ color: fillColor })
      .stroke({ color: strokeColor, width: 3 })
      .roundRect(0, 0, cellSize, cellSize, 10)
      .fill()
      .stroke();
  };

  const textsRef = useRef<PIXI.Text[]>([]);
  useLayoutEffect(() => {
    if (textsRef.current.length === 0) return;
    gsap.fromTo(
      textsRef.current,
      { alpha: 0, scale: 0.7 },
      {
        alpha: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.02,
      }
    );
  }, [selectedBet]);

  const activePrizes = useMemo(() => {
    if (!config || !selectedBet) return [];
    if (isBonus) return config.bonusGamePrizes;
    return config.defaultGamePrizes.map((p) => ({
      ...p,
      prizeValue:
        p.prizeName === "BONUS" ? 0 : p.prizeValue * selectedBet.multiplier,
    }));
  }, [isBonus, selectedBet, config]);

  const { fetchRoll, resolveSpin } = useSpinHandler({
    movePlayer,
    playerPos,
    activePrizes,
    selectedBet: selectedBet || { cost: 0, multiplier: 1 },
    setBalance,
    setPopupPrize,
    setPopupAmount,
    setShowPopup,
    setIsBonus,
    setFreeSpinsLeft,
    setLastRoll,
    config,
  });

  const startSpin = async () => {
    const roll = await fetchRoll();
    if (roll) {
      setTriggerRoll(true);
    }
  };

  const handleDiceFinish = (sum: number) => {
    resolveSpin(sum);
  };

  // 💫 when popup closes — chain next bonus spin
  const handlePopupClose = () => {
    setShowPopup(false);

    if (isBonus && freeSpinsLeft > 0) {
      setTimeout(() => {
        startSpin();
        sounds.spin?.play?.();
   
      }, 500); 
    }

    if (isBonus && freeSpinsLeft === 0) {
      setIsBonus(false);
      setButtonDisabled(false); // re-enable spin after all spins done
    }
  };

  // ✅ Main render
  return (
    <div className="relative bg-[#1e1e1e] flex flex-col items-center justify-center min-h-screen text-white">
      {!config || !selectedBet || !assetsLoaded ? (
        <LoaderUI />
      ) : (
        <div className="relative">
          {/* 💰 Top Info Bar */}
          <div className="  absolute top-2 left-13 z-50  mb-4 flex items-center justify-center gap-6 px-6 py-3 rounded-xl bg-linear-to-r from-[#115c24] to-[#0b441b] border border-[#1a6d2c]/60 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-2">
              <span className="text-[#aaffaa] font-bold text-xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                💵 Balance:
              </span>
              <span className="text-white text-xl font-extrabold tracking-wider">
                ${balance.toLocaleString()}
              </span>
            </div>

            {isBonus && (
              <div className="flex items-center gap-2 bg-[#1f7c37]/60 px-3 py-1 rounded-full border border-[#2fc94b]/50 shadow-inner">
                <span className="text-yellow-300 font-bold text-lg drop-shadow-[0_0_5px_rgba(255,255,0,0.6)]">
                  🎁 BONUS MODE
                </span>
                <span className="text-white text-lg font-semibold">
                  ({freeSpinsLeft} free spin{freeSpinsLeft === 1 ? "" : "s"}{" "}
                  left)
                </span>
              </div>
            )}
          </div>

          {/* 🎮 Game Frame */}
          <div className="rounded-xl border border-[#125e25]/60 bg-[#0d4f22] p-3 shadow-inner relative">
            <Application
              width={appSize}
              height={appSize + 150}
              backgroundColor={0x178b38}
            >
              <pixiContainer>
                {/* 🌟 Background Rays */}
                <RaysOverlay isBonus={isBonus} />

                {/* 🟩 Board Squares */}
                <pixiContainer x={offsetX} y={offsetY}>
                  {activePrizes.map((prize, i) => {
                    const pos = positions[prize.position];
                    const isBonusTile = prize.prizeName === "BONUS";

                    return (
                      <pixiContainer key={i} x={pos.x} y={pos.y}>
                        <pixiGraphics draw={(g) => drawCell(g)} />
                        <pixiText
                          ref={(el) => {
                            if (el) textsRef.current[i] = el;
                          }}
                          text={isBonusTile ? "BONUS" : `$${prize.prizeValue}`}
                          x={cellSize / 2}
                          y={cellSize / 2}
                          anchor={0.5}
                          style={
                            new PIXI.TextStyle({
                              fill: isBonusTile ? "#fff700" : "#ffeb3b",
                              fontSize: isBonusTile ? 26 : 24,
                              fontWeight: "900",
                              stroke: "#1a330f",
                              align: "center",
                              dropShadow: {
                                color: "#000000",
                                distance: 3,
                                alpha: 0.4,
                                blur: 2,
                              },
                            })
                          }
                        />
                      </pixiContainer>
                    );
                  })}
                </pixiContainer>

                {/* 🟢 Center Circle */}
                <ModeCircle
                  isBonus={isBonus}
                  x={appSize / 2}
                  y={appSize / 2.45}
                />

                {/* 🎲 Dice */}
                <DiceRoll
                  appSize={appSize}
                  triggerRoll={triggerRoll}
                  setTriggerRoll={setTriggerRoll}
                  rollValue={lastRoll ?? 2}
                  onFinish={handleDiceFinish}
                />

                {/* 🧍 Player */}
                {playerTexture && (
                  <pixiSprite
                    ref={spriteRef}
                    texture={playerTexture}
                    anchor={0.5}
                    x={positions[playerPos].x + offsetX + cellSize / 2}
                    y={positions[playerPos].y + offsetY + cellSize / 2}
                    width={70}
                    height={70}
                  />
                )}

                {/* 💵 Bet Selector */}
                <PixiBetSelector
                  x={appSize / 2 - 170}
                  y={appSize - 10}
                  options={config.betOptions}
                  selectedLabel={selectedBet.label}
                  onSelect={(label) =>
                    setSelectedBet(
                      config.betOptions.find((b) => b.label === label)!
                    )
                  }
                />

                {/* 🎰 Spin Button */}
                <PixiSpinButton
                  x={appSize / 2}
                  y={appSize + 80}
                  isBonus={isBonus}
                  freeSpinsLeft={freeSpinsLeft}
                  setFreeSpinsLeft={setFreeSpinsLeft}
                  balance={balance}
                  setBalance={setBalance}
                  selectedBet={selectedBet}
                  triggerRoll={triggerRoll}
                  setTriggerRoll={setTriggerRoll}
                  onClick={startSpin}
                  disabled={buttonDisabled} // ✅ triggers backend roll + dice animation
                />
              </pixiContainer>
            </Application>
          </div>

          {/* 🏆 Win Popup */}
          <WinPopup
            visible={showPopup}
            prizeName={popupPrize}
            winAmount={popupAmount}
            onClose={handlePopupClose}
            isBonusMode={isBonus}
            multiplier={selectedBet.multiplier}
          />
        </div>
      )}
    </div>
  );
};
