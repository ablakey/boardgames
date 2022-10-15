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
}
