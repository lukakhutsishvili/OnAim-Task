
export interface Prize {
  position: number;        // 0..15 (outer ring)
  prizeName: string;       // "Coin", "Star", "Bonus" etc.
  prizeValue: number;      // 0 for Bonus tile
  icon?: string;           // optional icon url/emoji
}

export interface BetOption {
  cost: number;            // play cost
  multiplier: number;      // win multiplier
  label: string;           // e.g. "1x", "2x"
}

export interface InitialData {
  defaultGamePrizes: Prize[];   // length 16, includes exactly one "Bonus"
  bonusGamePrizes: Prize[];     // length 16, includes the same bonus position (value 0)
  freeSpinsOnBonus: number;     // e.g., 3
  betOptions: BetOption[];      // e.g., [{cost:10,multiplier:1,label:'1x'}, ...]
  balance: number;              // current user balance
}

export const mockData: InitialData = {
  balance: 200,
  freeSpinsOnBonus: 3,
  betOptions: [
    { cost: 5, multiplier: 1, label: "1x" },
    { cost: 10, multiplier: 2, label: "2x" },
    { cost: 20, multiplier: 3, label: "3x" },
  ],
  defaultGamePrizes: [
    { position: 0, prizeName: "$5", prizeValue: 5 },
    { position: 1, prizeName: "$10", prizeValue: 10 },
    { position: 2, prizeName: "$15", prizeValue: 15 },
    { position: 3, prizeName: "$20", prizeValue: 20 },
    { position: 4, prizeName: "$25", prizeValue: 25 },
    { position: 5, prizeName: "$30", prizeValue: 30 },
    { position: 6, prizeName: "$30", prizeValue: 30 },
    { position: 7, prizeName: "$40", prizeValue: 40 },
    { position: 8, prizeName: "$55", prizeValue: 55 },
    { position: 9, prizeName: "$40", prizeValue: 40 },
    { position: 10, prizeName: "$30", prizeValue: 30 },
    { position: 11, prizeName: "$25", prizeValue: 25 },
    { position: 12, prizeName: "$10", prizeValue: 10 },
    { position: 13, prizeName: "$5", prizeValue: 5 },
    { position: 14, prizeName: "BONUS", prizeValue: 0 },
    { position: 15, prizeName: "$5", prizeValue: 5 },
  ],
  bonusGamePrizes: [
    { position: 0, prizeName: "$10", prizeValue: 10 },
    { position: 1, prizeName: "$15", prizeValue: 15 },
    { position: 2, prizeName: "$20", prizeValue: 20 },
    { position: 3, prizeName: "$25", prizeValue: 25 },
    { position: 4, prizeName: "$30", prizeValue: 30 },
    { position: 5, prizeName: "$35", prizeValue: 35 },
    { position: 6, prizeName: "$40", prizeValue: 40 },
    { position: 7, prizeName: "$45", prizeValue: 45 },
    { position: 8, prizeName: "$50", prizeValue: 50 },
    { position: 9, prizeName: "$55", prizeValue: 55 },
    { position: 10, prizeName: "$60", prizeValue: 60 },
    { position: 11, prizeName: "$65", prizeValue: 65 },
    { position: 12, prizeName: "$70", prizeValue: 70 },
    { position: 13, prizeName: "75", prizeValue: 75 },
    { position: 14, prizeName: "$80", prizeValue: 80 },
    { position: 15, prizeName: "$90", prizeValue: 90 },
  ],
};
