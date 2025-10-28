export const LoaderUI = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-[#39ff14] border-[#0b4b15] animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-[#22cc77] border-transparent animate-[spin_2s_linear_infinite_reverse]"></div>
      </div>
      <p className="text-[#aaffaa] text-lg font-semibold tracking-wide animate-pulse">
        Loading assets...
      </p>
      <p className="text-sm text-white/70 italic">
        {new URLSearchParams(window.location.search).get("mock") === "true"
          ? "Preparing mock game environment..."
          : "Connecting to server..."}
      </p>
    </div>
  );
};
