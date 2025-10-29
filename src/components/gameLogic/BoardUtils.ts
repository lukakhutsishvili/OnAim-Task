const boardSize = 5;
const cellSize = 95;
const padding = 3;
const positions: { x: number; y: number }[] = [];

export function savePositions() {
  {
    for (let j = 0; j < boardSize; j++) {
      positions.push({
        x: j * (cellSize + padding),
        y: 0,
      });
    }

    // ➡️ მარჯვენა სვეტი (ზედა → ქვედა, პირველი გამოტოვებით)
    for (let i = 1; i < boardSize - 1; i++) {
      positions.push({
        x: (boardSize - 1) * (cellSize + padding),
        y: i * (cellSize + padding),
      });
    }

    // ⬇️ ქვედა რიგი (მარჯვნიდან → მარცხნივ)
    for (let j = boardSize - 1; j >= 0; j--) {
      positions.push({
        x: j * (cellSize + padding),
        y: (boardSize - 1) * (cellSize + padding),
      });
    }

    // ⬅️ მარცხენა სვეტი (ქვედადან → ზემოთ, ბოლო გამოტოვებით)
    for (let i = boardSize - 2; i > 0; i--) {
      positions.push({
        x: 0,
        y: i * (cellSize + padding),
      });
    }

    return positions;
  }
}
