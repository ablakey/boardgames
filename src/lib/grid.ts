import { assert, pickRandom } from "../lib/utils";

const CELL_SIZE = 60;

export class Grid<Token extends string> {
  width: number;
  height: number;
  cells: { outer: HTMLDivElement; inner: HTMLDivElement }[] = [];
  tokens: Token[];

  constructor(opts: { onClick: VoidFunction; tokens: Token[] }) {
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
      outer.onclick = opts.onClick;

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

  private getCell(x: number, y: number) {
    if (x >= this.width || y >= this.height) {
      throw new Error("Coordinates sit outside the board.");
    }
    return this.cells[this.width * this.height - this.width + x - y * this.width];
  }

  public get(x: number, y: number): Token | null {
    return (this.getCell(x, y).inner.innerText || null) as Token | null;
  }

  public set(x: number, y: number, token: Token) {
    this.getCell(x, y).inner.innerText = token;
  }

  public populateCells() {
    this.cells.forEach((c) => {
      c.inner.innerText = pickRandom(this.tokens);
    });
  }
}
