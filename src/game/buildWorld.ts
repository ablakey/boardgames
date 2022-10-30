import { MAX_ROOM_ITERATIONS } from "../config";
import { Cell, Rect, Tile } from "../structs";
import { randInt, pickRandom } from "../utils";
import { Cardinal, World } from "./World";

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
  buildMaze();

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
    let lastCardinal: Cardinal = "Right";
    let cell: Cell | null = null;

    let x = 0;
    while (x < 100) {
      // Seed another strand of the maze.
      if (cell === null) {
        cell = findBuriedCell();
      }

      // If cannot be seeded, we're done.
      if (cell === null) {
        break;
      }

      world.set(cell, Tile.Maze);

      // TODO: make Reduce?
      const candidates: Partial<Record<Cardinal, Cell>> = {};
      for (const cardinal of ["Up", "Down", "Left", "Right"] as const) {
        if (world.isDiggable(cell, cardinal)) {
          candidates[cardinal] = world.get(cell, cardinal)!;
        }
      }

      console.log(candidates);

      if (Object.keys(candidates).length === 0) {
        cell = null;
      } else if (Math.random() > 0.5 && Object.keys(candidates).includes(lastCardinal)) {
        cell = candidates[lastCardinal]!;
      } else {
        const [nextCardinal, nextCell] = pickRandom(Object.entries(candidates));
        cell = nextCell;
        lastCardinal = nextCardinal as Cardinal;
      }

      // // Find another candidate.
      // if (Math.random() > 0.25 && world.isDiggable(world.get(cell, lastCardinal), cell)) {
      //   const newCell = world.get(cell, lastCardinal);
      //   cell = newCell;
      // } else {
      //   const choices = ["Up", "Down", "Left", "Right"]
      //     .filter((c) => c !== lastCardinal)
      //     .filter((c) => world.isDiggable(world.get(cell!, c as Cardinal), cell)) as Cardinal[];

      //   if (choices.length) {
      //     lastCardinal = pickRandom(choices);
      //     cell = world.get(cell, lastCardinal);
      //   } else {
      //     cell = null;
      //   }

      x++;
      // Pick randomly from another direction.
    }
    console.log(x);

    // Note: When growing a maze, every cell that we carve must be completely enclosed with
    // exception of the origin.  So we need a function that checks enclosure, minus a direction
    // It should return true if there's 7 directions that are closed, and none of them are
    // the point provided.

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
