// src/mockService.ts
import { mockData } from "./mockdata";

export const mockService = {
  async getInitialData() {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 300));
    return {
      balance: mockData.balance,
      defaultGamePrizes: mockData.defaultGamePrizes,
      bonusGamePrizes: mockData.bonusGamePrizes,
      betOptions: mockData.betOptions,
      freeSpinsOnBonus: mockData.freeSpinsOnBonus,
    };
  },

  async makeBet() {
    await new Promise((res) => setTimeout(res, 300));
    // 🎲 Random dice roll result (2–12)
    const roll = Math.floor(Math.random() * 11) + 2;
    return { roll };
  },
};
