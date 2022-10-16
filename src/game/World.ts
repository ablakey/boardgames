import { MAX_ROOM_ITERATIONS, Tile } from "../config";
import { Point } from "../structs/Point";
import { Rect } from "../structs/Rect";
import { randInt } from "../utils";

type WorldOptions = {
  width: number;
  height: number;
  maxEccentricity: number;
  minRoomSize: number;
  maxRoomSize: number;
  maxRoomCount: number;
};

class Tiles {
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

export class World {
  tiles: Tiles;
  rooms: Rect[] = [];
  opts: WorldOptions;

  constructor(opts: WorldOptions) {
    this.opts = opts;
    this.tiles = new Tiles(opts.width, opts.height);

    // Generate rooms.
    for (let n = 0; n < MAX_ROOM_ITERATIONS; n++) {
      this.tryBuildRoom();
      if (this.rooms.length >= this.opts.maxRoomCount) {
        break;
      }
    }

    // Populate tiles from rooms.
    this.rooms.forEach((r) =>
      r.forEachCell((point) => {
        this.tiles.set(point, Tile.Floor);
      })
    );
  }

  private tryBuildRoom() {
    const width = randInt(this.opts.minRoomSize, this.opts.maxRoomSize, true);
    const height = randInt(this.opts.minRoomSize, this.opts.maxRoomSize, true);

    const x = randInt(0, this.opts.width - width, true);
    const y = randInt(0, this.opts.height - height, true);

    const room = new Rect(width, height, x, y);

    for (let n = 0; n < this.rooms.length; n++) {
      if (this.rooms[n].hasCollision(room)) {
        return false;
      }
    }

    this.rooms.push(room);
    return true;
  }

  /**
   * Starting at the top-left, find a "wall" cell that is surrounded by other "wall" cells.
   */
  private findBuriedCell() {}
}
