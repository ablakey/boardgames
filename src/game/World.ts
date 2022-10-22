import { Tile } from "../config";
import { Point } from "../structs/Point";
import { Rect } from "../structs/Rect";

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

  get(point: Point): Tile | null {
    if (point.x < 0 || point.y < 0 || point.x >= this.width || point.y >= this.height) {
      return null;
    }
    return this.data[point.y * this.width + point.x];
  }

  /**
   * Return an array of neighbours
   */
  getNeighbours(point: Point) {
    const neighbours: (Point & { tile: Tile })[] = [];

    for (let y = point.y - 1; y === point.y + 1; y++) {
      for (let x = point.x - 1; x === point.x + 1; x++) {
        console.log(x, y);
        if (x === point.x && y === point.y) {
          continue;
        }

        const tile = this.get({ x, y });
        if (tile !== null) {
          neighbours.push({ x, y, tile });
        } else {
          console.log(tile, x, y);
        }
      }
    }

    return neighbours;
  }

  set(point: Point, tile: Tile) {
    this.data[point.y * this.width + point.x] = tile;
  }

  forEach(callback: (tile: Tile, point: Point) => void) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback(this.get({ x, y })!, { x, y });
      }
    }
  }

  *[Symbol.iterator]() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        yield [this.get({ x, y })!, { x, y }] as const;
      }
    }
  }
}
