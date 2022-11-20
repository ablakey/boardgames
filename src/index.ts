const COLUMNS = 12;
const ROWS = Math.floor(COLUMNS * (16 / 9) * 0.8);

function main() {
  const boardEl = document.querySelector<HTMLDivElement>(".board")!;
  boardEl.style.setProperty("--cols", COLUMNS.toLocaleString());
  boardEl.style.setProperty("--rows", ROWS.toLocaleString());
  for (let x = 0; x < COLUMNS * ROWS; x++) {
    const cell = document.createElement("div");
    boardEl.appendChild(cell);
  }

  console.log(boardEl.offsetWidth, boardEl.offsetHeight);
}

window.onload = main;
