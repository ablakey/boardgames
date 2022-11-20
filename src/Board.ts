export type Direction = "up" | "down" | "left" | "right";
type Point = { x: number; y: number };

export class Board {
  cells: HTMLDivElement[] = [];
  width: number;
  height: number;

  constructor(width: number) {
    this.width = width;
    this.height = Math.floor(this.width * (16 / 9) * 0.8);

    const boardEl = document.querySelector<HTMLDivElement>(".board")!;

    boardEl.style.setProperty("--cols", this.width.toLocaleString());
    boardEl.style.setProperty("--distance", `${boardEl.offsetWidth / this.width}px`);

    addEventListener("resize", () => {
      // boardEl.style.setProperty("--distance", (boardEl.offsetWidth / this.width).toLocaleString());
    });

    for (let x = 0; x < this.width * this.height; x++) {
      const cell = document.createElement("div");
      const inner = document.createElement("div");
      cell.appendChild(inner);
      this.cells.push(inner);
      boardEl.appendChild(cell);
    }
  }

  getCoords(point: Point, direction: Direction) {
    let { x, y } = point;

    if (direction === "up") {
      y += 1;
    } else if (direction === "down") {
      y -= 1;
    } else if (direction === "left") {
      x -= 1;
    } else if (direction === "right") {
      x += 1;
    }

    return { x, y };
  }

  get(point: Point, direction?: Direction) {
    const { x, y } = direction ? this.getCoords(point, direction) : point;

    if (x >= this.width || y >= this.height) {
      throw new Error(`Coordinates sit outside the board: ${x}, ${y}`);
    }
    return this.cells[this.width * this.height - this.width + x - y * this.width];
  }

  place(point: Point, value: string) {
    this.get(point).innerText = value;
  }

  move(point: Point, direction: Direction, callback: (point: Point) => void) {
    const start = this.get(point);
    const end = this.get(point, direction);

    start.onanimationend = () => {
      start.onanimationend = null;
      end.innerText = start.innerText; // TODO hold actual state.
      start.innerText = "";
      start.classList.remove(`animate-${direction}`);
      callback(this.getCoords(point, direction));
    };
    start.classList.add(`animate-${direction}`);
  }
}
