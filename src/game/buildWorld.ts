import { MAX_ROOM_ITERATIONS } from "../config";
import { Rect, Tile } from "../structs";
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

  // Generate maze.
  // buildMaze();

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

  function buildMaze() {
    while (true) {
      // While there are cells to be found (until it returns null)
      const cell = findBuriedCell();

      // No more cells left to unbury with a maze.
      if (cell == null) {
        break;
      }

      // Look at cardinal directions around cell (if we find none, loop around, finding a new buried cell)
      const choices = (["Up", "Down", "Left", "Right"] as const)
        .map((direction) => ({ tile: world.get(cell, direction) }))
        .filter((c) => c !== null);

      // There are no valid choices left.
      if (choices.length === 0) {
        break;
      }
    }

    // Assemble list of which are openable (surrounded by dirt except for the parent cell)
    // Pick one and open it, then repeat. Bias towards same direction.

    // console.log(cell);
  }

  function findBuriedCell() {
    for (const cell of world) {
      if (cell.tile === Tile.Wall) {
        const neighbours = world.getNeighbours(cell);
        const wallTiles = Object.values(neighbours)
          .filter((t) => t !== null)
          .filter((t) => t!.tile === Tile.Wall);

        if (wallTiles.length === 8) {
          return cell;
        }
      }
    }

    return null;
  }
}
