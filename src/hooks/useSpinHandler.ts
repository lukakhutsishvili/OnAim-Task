import { mockService } from "../mockService";
import { apiService } from "../apiService";
import { sounds } from "../components/gameLogic/Sounds";
import { mockData } from "../mockdata";

interface SpinHandlerProps {
  movePlayer: (currentPos: number, steps: number, onEnd: () => void) => void;
  playerPos: number;
  activePrizes: any[];
  selectedBet: { cost: number; multiplier: number };
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setPopupPrize: React.Dispatch<React.SetStateAction<string>>;
  setPopupAmount: React.Dispatch<React.SetStateAction<number>>;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBonus: React.Dispatch<React.SetStateAction<boolean>>;
  setFreeSpinsLeft: React.Dispatch<React.SetStateAction<number>>;
  setLastRoll: React.Dispatch<React.SetStateAction<number | null>>;
  config: typeof mockData | null;
}

export const useSpinHandler = ({
  movePlayer,
  playerPos,
  activePrizes,
  setBalance,
  setPopupPrize,
  setPopupAmount,
  setShowPopup,
  setIsBonus,
  setFreeSpinsLeft,
  setLastRoll,
  config,
}: SpinHandlerProps) => {
  const isMock = new URLSearchParams(window.location.search).get("mock") === "true";
  const service = isMock ? mockService : apiService;

  // 🎲 Step 1: fetch roll
  const fetchRoll = async (): Promise<number | null> => {
    try {
      const { roll } = await service.makeBet();
      setLastRoll(roll);
      return roll;
    } catch (err) {
      console.error("Roll fetch failed:", err);
      return null;
    }
  };

  // 🎯 Step 2: resolve prize logic
  const resolveSpin = (roll: number) => {
    movePlayer(playerPos, roll, () => {
      const newIndex = (playerPos + roll) % activePrizes.length;
      const landedPrize = activePrizes[newIndex];
      if (!landedPrize) return;

      const { prizeName, prizeValue } = landedPrize;
      let totalWin = 0;

      if (prizeName !== "BONUS") {
        totalWin = prizeValue;
        setBalance((prev) => prev + totalWin);
        sounds.win?.play?.();
      }

      // 🎁 Bonus mode activation
      if (prizeName === "BONUS") {
        setIsBonus(true);
        setFreeSpinsLeft(config?.freeSpinsOnBonus ?? 3);
        sounds.bonus?.play?.();
      }

      setPopupPrize(prizeName);
      setPopupAmount(totalWin);
      setShowPopup(true);

      // 🧮 Decrease free spins if already in bonus mode
      if (prizeName !== "BONUS") {
        setFreeSpinsLeft((prev) => Math.max(0, prev - 1));
      }
    });
  };

  return { fetchRoll, resolveSpin };
};
