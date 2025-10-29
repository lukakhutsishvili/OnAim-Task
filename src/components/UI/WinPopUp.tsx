import { useEffect, useRef } from "react";
import gsap from "gsap";
import { sounds } from "../gameLogic/Sounds";

interface WinPopupProps {
  visible: boolean;
  prizeName: string;
  winAmount: number;
  onClose: () => void;
  isBonusMode?: boolean;
  multiplier?: number;
}

export const WinPopup: React.FC<WinPopupProps> = ({
  visible,
  prizeName,
  winAmount,
  onClose,
  isBonusMode = false,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // ⚡ Animate popup + play sound when visible
  useEffect(() => {
    if (visible && popupRef.current && backdropRef.current) {
      if (prizeName === "BONUS") sounds.bonus?.play?.();
      else sounds.win?.play?.();

      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );
      gsap.fromTo(
        popupRef.current,
        { scale: 0.5, opacity: 0, y: 100 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.8)" },
      );

      // 🕒 Auto-close after short delay (with animation)
      const timer = setTimeout(() => {
        closeWithAnimation();
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [visible, prizeName]);

  // 🧩 Shared smooth close animation
  const closeWithAnimation = () => {
    if (!popupRef.current || !backdropRef.current) return;
    gsap.to(popupRef.current, {
      scale: 0.7,
      opacity: 0,
      y: 80,
      duration: 0.5,
      ease: "power1.inOut",
    });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.4,
      delay: 0.1,
      onComplete: onClose,
    });
  };

  if (!visible) return null;

  const displayAmount =
    prizeName === "BONUS" || isBonusMode ? winAmount : winAmount;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div
        ref={popupRef}
        className="relative bg-linear-to-br from-[#00cc00] via-[#1b7431] to-[#0d4a1d]
                   border border-[#00ff80]/40 text-white rounded-2xl
                   shadow-[0_0_25px_rgba(0,255,100,0.6)] text-center
                   w-[300px] p-4"
      >
        {/* ❌ Manual close button */}
        <button
          onClick={closeWithAnimation}
          className="absolute z-100 cursor-pointer top-2 right-2 text-white text-xl font-bold 
                     hover:text-yellow-400 transition-colors duration-200"
        >
          ❌
        </button>

        {/* 🏆 Title */}
        <h2 className="text-3xl font-extrabold mb-2 text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          🎉 YOU WON!
        </h2>

        {/* 🎁 Prize Name */}
        <p className="text-lg font-semibold text-white/90">
          {prizeName === "BONUS" ? "Bonus Game Activated!" : prizeName}
        </p>

        {/* 💰 Win Amount */}
        {prizeName !== "BONUS" && (
          <p className="text-4xl font-extrabold mt-2 text-yellow-400 drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
            +${displayAmount}
          </p>
        )}
      </div>
    </div>
  );
};
