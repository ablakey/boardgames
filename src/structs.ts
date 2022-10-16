import { Tile } from "./config";

export type Point = { x: number; y: number };

export class Tiles {
  private data: Tile[]; // Row-major.
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Array<Tile>(width * height).fill(Tile.Wall);
  }

  get(point: Point) {
    return this.data[point.y * this.width + point.x];
  }

  set(point: Point, tile: Tile) {
    this.data[point.y * this.width + point.x] = tile;
  }

  forEach(callback: (point: Point, tile: Tile) => void) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback({ x, y }, this.get({ x, y }));
      }
    }
  }
}

export class Rect {
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(width: number, height: number, x: number, y: number) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  get xMax() {
    return this.x + this.width;
  }

  get yMax() {
    return this.y + this.height;
  }

  hasCollision(rect: Rect, buffer = 0) {
    return !(
      this.xMax < rect.x - buffer ||
      this.yMax < rect.y - buffer ||
      this.x - buffer > rect.xMax ||
      this.y - buffer > rect.yMax
    );
  }

  contains(rect: Rect): boolean {
    return rect.x >= this.x && rect.xMax <= this.xMax && rect.y >= this.y && rect.yMax <= this.yMax;
  }

  forEachCell(callback: (point: Point) => void) {
    for (let y = this.y; y < this.y + this.height; y++) {
      for (let x = this.x; x < this.x + this.width; x++) {
        callback({ x, y });
      }
    }
  }
}
