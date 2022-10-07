import { assert } from "../lib/utils";

const CELL_SIZE = 60;

function setGrid() {
  const body = document.querySelector<HTMLDivElement>("body");
  assert(body);

  const grid = document.querySelector<HTMLDivElement>(".grid");
  assert(grid);
  grid.style.margin = "unset";

  let widthCount = Math.floor(body.offsetWidth / CELL_SIZE);
  let heightCount = Math.floor(body.offsetHeight / CELL_SIZE);

  if (widthCount % 2 === 0) {
    widthCount -= 1;
    grid.style.marginLeft = `${CELL_SIZE / 2}px`;
    grid.style.marginRight = `${CELL_SIZE / 2}px`;
  }

  if (heightCount % 2 === 0) {
    heightCount -= 1;
    grid.style.marginTop = `${CELL_SIZE / 2}px`;
    grid.style.marginBottom = `${CELL_SIZE / 2}px`;
  }

  const fragment = document.createDocumentFragment();

  for (let n = 0; n < widthCount * heightCount; n++) {
    const div = document.createElement("div");
    div.className = "cell";

    if (n === Math.floor((widthCount * heightCount) / 2)) {
      div.style.backgroundColor = "red";
    }

    const inner = document.createElement("div");
    inner.className = "inner";
    div.appendChild(inner);

    inner.innerText = randomEmoji();

    fragment.appendChild(div);
  }
  grid.replaceChildren(fragment);
  // requestAnimationFrame(setGrid);
}

function main() {
  window.addEventListener("resize", setGrid);

  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  requestAnimationFrame(() => {
    setGrid();
  });
}

window.onload = main;

function randomEmoji() {
  const emojis = ["🎃", "😱"];
  const x = Math.floor(Math.random() * emojis.length);
  return emojis[x];
}
