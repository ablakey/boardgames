import { Cell, Point, Rect, Tile } from "../structs";

export type Cardinal = "Up" | "Down" | "Left" | "Right";

export type Direction = Cardinal | "UpLeft" | "UpRight" | "DownLeft" | "DownRight";

const neighbourOffsets: Record<Direction, [number, number]> = {
  UpLeft: [-1, 1],
  Up: [0, 1],
  UpRight: [1, 1],
  Right: [1, 0],
  DownRight: [1, -1],
  Down: [0, -1],
  DownLeft: [-0, -1],
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
    this.data = new Array<Tile>(width * height).fill(Tile.Wall);
  }

  get(point: Point, direction?: Direction): Cell | null {
    const [deltaX, deltaY] = direction ? neighbourOffsets[direction] : [0, 0];

    const x = point.x + deltaX;
    const y = point.y + deltaY;

    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null;
    }

    return { tile: this.data[y * this.width + x], ...point };
  }

  /**
   * Return an array of neighbours
   */
  getNeighbours(point: Point) {
    const neighbours = Object.keys(neighbourOffsets).reduce((acc, direction) => {
      const cell = this.get(point, direction as Direction);
      acc[direction as Direction] = cell === null ? null : cell;
      return acc;
    }, {} as Record<Direction, Cell | null>);

    return neighbours;
  }

  set(point: Point, tile: Tile) {
    this.data[point.y * this.width + point.x] = tile;
  }

  forEach(callback: (cell: Cell) => void) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback(this.get({ x, y })!);
      }
    }
  }

  *[Symbol.iterator]() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        yield this.get({ x, y })!;
      }
    }
  }
}
