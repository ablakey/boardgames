import { tileEmojis } from "./config";
import { Cardinal } from "./game/World";
import { range } from "./utils";

export type Tile = keyof typeof tileEmojis;

export type Point = { x: number; y: number };

export class Cell {
  x: number;
  y: number;
  tile: Tile;

  constructor(x: number, y: number, tile: Tile) {
    this.x = x;
    this.y = y;
    this.tile = tile;
  }

  is(c: Cell) {
    return this.x === c.x && this.y === c.y;
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

  getEdge(cardinal: Cardinal): Point[] {
    switch (cardinal) {
      case "Up":
        return range(0, this.width).map((v) => ({ x: this.x + v, y: this.y + this.height }));
      case "Down":
        return range(0, this.width).map((v) => ({ x: this.x + v, y: this.y - 1 }));
      case "Left":
        return range(0, this.height).map((v) => ({ x: this.x - 1, y: this.y + v }));
      case "Right":
        return range(0, this.height).map((v) => ({ x: this.x + this.width, y: this.y + v }));
    }
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
