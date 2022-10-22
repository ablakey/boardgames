import { tileEmojis } from "../config";
import { Cell, Point, Rect, Tile } from "../structs";
import { assert } from "../utils";

export class Board extends Rect {
  cells: { outer: HTMLDivElement; inner: HTMLDivElement }[] = [];

  cellSize: number;

  constructor(opts: {
    onClick?: (point: Point, value: string | null) => void;

    cellSize: number;
  }) {
    // Hack to make the board on iOS devices not get covered up by the bottom bar.
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    document.documentElement.style.setProperty("--cellsize", `${opts.cellSize}px`);

    // Get the body and board, calculate how many cells should exist.
    const boardContainer = document.querySelector<HTMLDivElement>(".boardcontainer");
    assert(boardContainer);

    const board = document.querySelector<HTMLDivElement>(".board");
    assert(board);

    const width = Math.floor(boardContainer.offsetWidth / opts.cellSize);
    const height = Math.floor(boardContainer.offsetHeight / opts.cellSize);
    super(width, height, 0, 0);

    // Make sure there's always an odd number of cells (for games with a centered tile).
    if (this.width % 2 === 0) {
      this.width -= 1;
      boardContainer.style.paddingLeft = `${opts.cellSize / 2}px`;
      boardContainer.style.paddingRight = `${opts.cellSize / 2}px`;
    }

    if (this.height % 2 === 0) {
      this.height -= 1;
      boardContainer.style.paddingTop = `${opts.cellSize / 2}px`;
      boardContainer.style.paddingBottom = `${opts.cellSize / 2}px`;
    }

    // Build all the elements as a fragment to be appended in one operation.
    const fragment = document.createDocumentFragment();

    for (let n = 0; n < this.width * this.height; n++) {
      const outer = document.createElement("div");
      outer.className = "outer";

      if (opts.onClick !== undefined) {
        outer.onclick = () => {
          const x = n % this.width;
          const y = this.height - Math.floor(n / this.width) - 1;
          opts.onClick!({ x, y }, null);
        };
      }

      const inner = document.createElement("div");
      inner.className = "inner";
      outer.appendChild(inner);

      fragment.appendChild(outer);

      this.cells.push({ inner, outer });
    }

    board.appendChild(fragment);

    // Absolutely size the board so that it doesn't reshape if window resizes.
    boardContainer.style.width = boardContainer.offsetWidth.toString();
    boardContainer.style.height = boardContainer.offsetHeight.toString();

    this.cellSize = opts.cellSize;
  }

  private getCell(point: Point) {
    if (point.x >= this.width || point.y >= this.height) {
      throw new Error("Coordinates sit outside the board.");
    }
    return this.cells[this.width * this.height - this.width + point.x - point.y * this.width];
  }

  get(point: Point): string | null {
    return (this.getCell(point).inner.innerText || null) as string | null;
  }

  set(cell: Cell) {
    this.getCell(cell).inner.innerText = tileEmojis[cell.tile];
  }

  setBg(point: Point, backgroundColor: string) {
    this.getCell(point).outer.style.backgroundColor = backgroundColor;
  }

  /**
   * Return a collection of all cells whose value is the same of `point`,
   * where they are touching `point` or any cell touched by point, recursively.
   */
  getContiguous(point: Point): { point: Point; value: string | null }[] {
    const self = this; // eslint-disable-line @typescript-eslint/no-this-alias
    const value = this.get(point);
    const matches = new Map<string, Point>();

    function checkNeighbours(pt: Point) {
      if (matches.has(`${pt.x}.${pt.y}`) || self.get(pt) !== value) {
        return;
      }

      matches.set(`${pt.x}.${pt.y}`, pt);

      const neighbours: Point[] = [
        { x: pt.x - 1, y: pt.y },
        { x: pt.x + 1, y: pt.y },
        { x: pt.x, y: pt.y - 1 },
        { x: pt.x, y: pt.y + 1 },
      ];

      neighbours.forEach((n) => {
        if (n.x >= 0 && n.y >= 0 && n.x < self.width && n.y < self.height) {
          checkNeighbours(n);
        }
      });
    }

    checkNeighbours(point);

    return Array.from(matches.values()).map((point) => ({ point, value: this.get(point) }));
  }

  drawRect(rect: Rect, tile: Tile) {
    if (!this.contains(rect)) {
      throw new Error("Cannot draw rect. It does not fit on the grid.");
    }

    for (let y = rect.y; y < rect.yMax; y++) {
      for (let x = rect.x; x < rect.xMax; x++) {
        this.set({ x, y, tile });
      }
    }
  }
}
