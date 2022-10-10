import { assert, pickRandom } from "../lib/utils";

export type Point = { x: number; y: number };

const CELL_SIZE = 60;

export class Grid<Token extends string> {
  width: number;
  height: number;
  cells: { outer: HTMLDivElement; inner: HTMLDivElement }[] = [];
  tokens: Token[];

  constructor(opts: { onClick: (point: Point, value: Token | null) => void; tokens: Token[] }) {
    this.tokens = opts.tokens;

    // Hack to make the grid on iOS devices not get covered up by the bottom bar.
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    // Get the body and grid, calculate how many cells should exist.
    const body = document.querySelector<HTMLDivElement>("body");
    assert(body);

    const grid = document.querySelector<HTMLDivElement>(".grid");
    assert(grid);

    this.width = Math.floor(body.offsetWidth / CELL_SIZE);
    this.height = Math.floor(body.offsetHeight / CELL_SIZE);

    // Make sure there's always an odd number of cells (for games with a centered token).
    if (this.width % 2 === 0) {
      this.width -= 1;
      grid.style.marginLeft = `${CELL_SIZE / 2}px`;
      grid.style.marginRight = `${CELL_SIZE / 2}px`;
    }

    if (this.height % 2 === 0) {
      this.height -= 1;
      grid.style.marginTop = `${CELL_SIZE / 2}px`;
      grid.style.marginBottom = `${CELL_SIZE / 2}px`;
    }

    // Build all the elements as a fragment to be appended in one operation.
    const fragment = document.createDocumentFragment();

    for (let n = 0; n < this.width * this.height; n++) {
      const outer = document.createElement("div");
      outer.className = "outer";
      outer.onclick = () => {
        const x = n % this.width;
        const y = this.height - Math.floor(n / this.width) - 1;
        opts.onClick({ x, y }, null);
      };

      const inner = document.createElement("div");
      inner.className = "inner";
      outer.appendChild(inner);

      fragment.appendChild(outer);

      this.cells.push({ inner, outer });
    }

    grid.appendChild(fragment);

    // Absolutely size the grid so that it doesn't reshape if window resizes.
    grid.style.width = grid.offsetWidth.toString();
    grid.style.height = grid.offsetHeight.toString();
  }

  private getCell(point: Point) {
    if (point.x >= this.width || point.y >= this.height) {
      throw new Error("Coordinates sit outside the board.");
    }
    return this.cells[this.width * this.height - this.width + point.x - point.y * this.width];
  }

  public get(point: Point): Token | null {
    return (this.getCell(point).inner.innerText || null) as Token | null;
  }

  public set(point: Point, token: Token) {
    this.getCell(point).inner.innerText = token;
  }

  public setBg(point: Point, backgroundColor: string) {
    this.getCell(point).outer.style.backgroundColor = backgroundColor;
  }

  public populateCells() {
    this.cells.forEach((c) => {
      c.inner.innerText = pickRandom(this.tokens);
    });
  }

  /**
   * Return a collection of all cells whose value is the same of `point`,
   * where they are touching `point` or any cell touched by point, recursively.
   */
  public getContiguous(point: Point): { point: Point; value: Token | null }[] {
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
}
