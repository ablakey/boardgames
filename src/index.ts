const COLUMNS = 12;
const ROWS = Math.floor(COLUMNS * (16 / 9) * 0.8);

function main() {
  const cells: HTMLDivElement[] = [];
  const boardEl = document.querySelector<HTMLDivElement>(".board")!;

  boardEl.style.setProperty("--cols", COLUMNS.toLocaleString());
  boardEl.style.setProperty("--emojisize", (boardEl.offsetWidth / COLUMNS).toLocaleString());

  addEventListener("resize", () => {
    boardEl.style.setProperty("--emojisize", (boardEl.offsetWidth / COLUMNS).toLocaleString());
  });

  for (let x = 0; x < COLUMNS * ROWS; x++) {
    const cell = document.createElement("div");
    const inner = document.createElement("div");
    cell.appendChild(inner);
    cells.push(inner);
    boardEl.appendChild(cell);
  }

  cells[3].innerText = "🤖";
  cells[30].innerText = "😊";

  console.log(boardEl.offsetWidth, boardEl.offsetHeight);
}

window.onload = main;
