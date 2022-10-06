import { assert } from "./utils";

const pieces = ["🔴", "⚫"] as const;

type Piece = typeof pieces[number];
type Cell = { container: HTMLDivElement; inner: HTMLDivElement };
type TrayItem = { el: HTMLDivElement; countEl: HTMLDivElement; count: number; piece: Piece };

export class Board {
  private cells: Cell[];
  private tray: TrayItem[];
  private trayEl: HTMLDivElement;
  private size: number;

  constructor(opts: { size: number; targetId: string; bgColours: string[]; trayHeight: number }) {
    this.size = opts.size;
    this.cells = [];
    this.tray = [];

    // Construct the board.
    const fragment = document.createDocumentFragment();
    const boardEl = document.createElement("div");
    boardEl.setAttribute("class", "board");
    boardEl.style.gridTemplateColumns = `repeat(${opts.size}, 1fr)`;
    fragment.appendChild(boardEl);

    // Assemble the cells.
    for (let x = 0; x < opts.size ** 2; x++) {
      const cellEl = document.createElement("div");
      cellEl.setAttribute("class", "board-cell");
      cellEl.style.backgroundColor = opts.bgColours[x % opts.bgColours.length];

      const innerEl = document.createElement("div");
      innerEl.setAttribute("class", "board-inner");
      innerEl.innerText = "";
      cellEl.appendChild(innerEl);

      this.cells.push({ container: cellEl, inner: innerEl });

      boardEl.appendChild(cellEl);
    }

    // Assemble the tray.
    const trayEl = document.createElement("div");
    trayEl.setAttribute("class", "tray");
    fragment.appendChild(trayEl);
    this.trayEl = trayEl;

    // Mount asembled elements to the target element.
    const targetEl = document.querySelector(`#${opts.targetId}`);
    assert(targetEl);
    targetEl.appendChild(fragment);
  }

  private addCssClass(classString: string) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = classString;
    document.querySelector("head")!.appendChild(style);
  }

  private get(x: number, y: number): Cell {
    return this.cells[this.size ** 2 - this.size * y + x - 5];
  }

  setPiece(x: number, y: number, piece: Piece) {
    this.get(x, y).inner.innerText = piece;
  }

  addToTray(piece: Piece, count: number) {
    const existingEntry = this.tray.find((e) => e.piece === piece);
    if (existingEntry !== undefined) {
      existingEntry.count += count;
      existingEntry.countEl.innerText = existingEntry.count.toString();
      return;
    }
    // TODO: Fragment?

    const cardEl = document.createElement("div");
    cardEl.setAttribute("class", "tray-card");

    const countEl = document.createElement("div");
    countEl.setAttribute("class", "card-count");
    countEl.innerText = count.toString();

    const pieceEl = document.createElement("div");
    pieceEl.setAttribute("class", "card-piece");
    pieceEl.innerText = piece;

    this.trayEl.appendChild(cardEl);
    cardEl.appendChild(pieceEl);
    cardEl.appendChild(countEl);
    this.tray.push({ count, el: cardEl, countEl: countEl, piece });
  }
}
