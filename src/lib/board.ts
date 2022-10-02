import { assert } from "./utils";

const pieces = ["🔴", "⚫"] as const;

type Piece = typeof pieces[number];
type Cell = { container: HTMLDivElement; inner: HTMLDivElement };

export class Board {
  private cells: Cell[];
  private size: number;

  constructor(size: number, targetId: string) {
    this.size = size;
    this.cells = [];

    const fragment = document.createDocumentFragment();

    const boardEl = document.createElement("div");
    boardEl.setAttribute("class", "board");
    boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    fragment.appendChild(boardEl);

    for (let x = 0; x < size ** 2; x++) {
      const cellEl = document.createElement("div");
      cellEl.setAttribute("class", "board-cell");

      const innerEl = document.createElement("div");
      innerEl.setAttribute("class", "board-inner");
      innerEl.innerText = "";
      cellEl.appendChild(innerEl);

      this.cells.push({ container: cellEl, inner: innerEl });

      boardEl.appendChild(cellEl);
    }

    const parent = document.querySelector(`#${targetId}`);
    assert(parent);
    parent.appendChild(fragment);
  }

  private get(x: number, y: number): Cell {
    return this.cells[this.size ** 2 - this.size * y + x - 5];
  }

  set(x: number, y: number, piece: Piece) {
    this.get(x, y).inner.innerText = piece;
  }
}
