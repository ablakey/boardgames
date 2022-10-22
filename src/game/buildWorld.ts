import { MAX_ROOM_ITERATIONS, Tile } from "../config";
import { Rect } from "../structs/Rect";
import { randInt } from "../utils";
import { World } from "./World";

type WorldOptions = {
  width: number;
  height: number;
  maxEccentricity: number;
  minRoomSize: number;
  maxRoomSize: number;
  maxRoomCount: number;
};

export function buildWorld(opts: WorldOptions) {
  const world: World = new World(opts.width, opts.height);

  // Generate rooms.
  for (let n = 0; n < MAX_ROOM_ITERATIONS; n++) {
    tryBuildRoom();
    if (world.rooms.length >= opts.maxRoomCount) {
      break;
    }
  }

  // Populate tiles from rooms.
  world.rooms.forEach((r) =>
    r.forEachCell((point) => {
      world.set(point, Tile.Floor);
    })
  );

  return world;

  function tryBuildRoom() {
    const width = randInt(opts.minRoomSize, opts.maxRoomSize, true);
    const height = randInt(opts.minRoomSize, opts.maxRoomSize, true);

    const x = randInt(0, opts.width - width, true);
    const y = randInt(0, opts.height - height, true);

    const room = new Rect(width, height, x, y);

    for (let n = 0; n < world.rooms.length; n++) {
      if (world.rooms[n].hasCollision(room)) {
        return false;
      }
    }

    world.rooms.push(room);
    return true;
  }

  function buildMaze() {}

  function findBuriedCell() {
    for (const [tile, point] of world) {
      if (tile === Tile.Wall) {
        const neighbours = world.getNeighbours(point);
        if (
          neighbours.length === 8 &&
          neighbours.map((n) => n.tile).every((t) => t === Tile.Wall)
        ) {
          return point;
        }
      }
    }

    return null;
  }
}
