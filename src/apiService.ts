// src/apiService.ts
export const apiService = {
  async getInitialData() {
    const res = await fetch("/initialDataEndpoint");
    return res.json();
  },

  async makeBet() {
    const res = await fetch("/makeBet");
    return res.json();
  },
};
