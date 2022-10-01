import { assert } from "./utils";

export class Board {
  constructor(size: number, targetId: string) {
    const fragment = document.createDocumentFragment();

    // Build the board.
    console.log("foo");
    const boardEl = document.createElement("div");
    boardEl.setAttribute("class", "board");
    boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    console.log(boardEl.style.gridTemplateColumns);

    fragment.appendChild(boardEl);

    for (let x = 0; x < size ** 2; x++) {
      const cellEl = document.createElement("div");
      cellEl.setAttribute("class", "board-cell");

      const innerEl = document.createElement("div");
      innerEl.setAttribute("class", "board-inner");
      innerEl.innerText = "A";
      cellEl.appendChild(innerEl);
      // cellEl.draggable = true;

      boardEl.appendChild(cellEl);
    }

    // Attach to DOM.
    const parent = document.querySelector(`#${targetId}`);
    assert(parent);
    parent.appendChild(fragment);
  }
}
