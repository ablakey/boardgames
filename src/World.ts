import { Tile } from "./config";
import { Tiles, Rect } from "./structs";
import { randInt } from "./utils";

const MAX_ROOM_ITERATIONS = 10000;

type WorldOptions = {
  width: number;
  height: number;
  maxEccentricity: number;
  minRoomSize: number;
  maxRoomSize: number;
  maxRoomCount: number;
};

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
