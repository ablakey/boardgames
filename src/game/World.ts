import { Cell, Point, Rect, Tile } from "../structs";

export type Cardinal = "Up" | "Down" | "Left" | "Right";

export type Direction = Cardinal | "UpLeft" | "UpRight" | "DownLeft" | "DownRight";

export const cardinalDirections: readonly Cardinal[] = ["Up", "Down", "Left", "Right"] as const;

const offsets: Record<Direction, [number, number]> = {
  UpLeft: [-1, 1],
  Up: [0, 1],
  UpRight: [1, 1],
  Right: [1, 0],
  DownRight: [1, -1],
  Down: [0, -1],
  DownLeft: [-1, -1],
  Left: [-1, 0],
};

/**
 * An interface for an array of grid squares.
 */
export class World {
  public rooms: Rect[] = [];
  private data: Tile[]; // Row-major.
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Array<Tile>(width * height).fill("Wall");
  }

  get(point: Point, direction?: Direction, distance = 1): Cell | null {
    const [deltaX, deltaY] = direction ? offsets[direction] : [0, 0];

    const x = point.x + deltaX * distance;
    const y = point.y + deltaY * distance;

    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null;
    }

    return new Cell(x, y, this.data[y * this.width + x]);
  }

  /**
   * Return an array of neighbours
   */
  getNeighbours(point: Point): Cell[] {
    return cardinalDirections.map((c) => this.get(point, c)).filter((n) => n !== null) as Cell[];
  }

  set(point: Point, tile: Tile, direction?: Direction, distance = 1) {
    const cell = this.get(point, direction, distance);
    if (cell === null) {
      throw new Error(`Invalid coordinates: ${point}`);
    }

    this.data[cell.x + cell.y * this.width] = tile;
  }

  forEach(callback: (cell: Cell) => void) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback(this.get({ x, y })!);
      }
    }
  }

  forEachOdd(callback: (cell: Cell) => void) {
    this.forEach((c) => {
      if (c.x % 2 === 1 && c.y % 2 === 1) {
        callback(c);
      }
    });
  }

  forEachInRect(rect: Rect, callback: (cell: Cell) => void) {
    for (let y = rect.y; y < rect.height; y++) {
      for (let x = rect.x; x < rect.width; x++) {
        const c = this.get({ x, y });
        if (c) {
          callback(c);
        }
      }
    }
  }
}
