import { MAX_ROOM_ITERATIONS } from "../config";
import { Cell, Rect, Tile } from "../structs";
import { randInt, pickRandom } from "../utils";
import { Cardinal, cardinalDirections, World } from "./World";

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
      world.set(point, "Floor");
    })
  );

  // Generate maze.
  buildMaze(world.get({ x: 1, y: 1 })!);

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

  function buildMaze(start: Cell) {
    const cells: Cell[] = [];
    let lastCardinal: Cardinal = "Right";
    cells.push(start);

    while (cells.length) {
      const cell = cells[cells.length - 1];

      const openNeighbours: Cardinal[] = cardinalDirections.filter((d) => canCarve(cell, d));

      if (openNeighbours.length) {
        let newCardinal: Cardinal;
        if (openNeighbours.includes(lastCardinal) && Math.random() > 0.5) {
          newCardinal = lastCardinal;
        } else {
          newCardinal = pickRandom(openNeighbours);
        }

        world.set(cell, "Maze", newCardinal);
        world.set(cell, "Maze", newCardinal, 2);

        cells.push(world.get(cell, newCardinal, 2)!);
        lastCardinal = newCardinal;
      } else {
        cells.pop();
        lastCardinal = "Right";
      }
    }
  }

  function canCarve(cell: Cell, cardinal: Cardinal) {
    return world.get(cell, cardinal, 3) && world.get(cell, cardinal, 2)!.tile === "Wall";
  }

  // function buildMaze() {
  //   let lastCardinal: Cardinal = "Right";
  //   let cell: Cell | null = null;

  //   let x = 0;
  //   while (x < 100) {
  //     // Seed another strand of the maze.
  //     if (cell === null) {
  //       cell = findBuriedCell();
  //     }

  //     // If cannot be seeded, we're done.
  //     if (cell === null) {
  //       break;
  //     }

  //     world.set(cell, Tile.Maze);

  //     // TODO: make Reduce?
  //     const candidates: Partial<Record<Cardinal, Cell>> = {};
  //     for (const cardinal of ["Up", "Down", "Left", "Right"] as const) {
  //       if (world.isDiggable(cell, cardinal)) {
  //         candidates[cardinal] = world.get(cell, cardinal)!;
  //       }
  //     }

  //     console.log(candidates);

  //     if (Object.keys(candidates).length === 0) {
  //       cell = null;
  //     } else if (Math.random() > 0.5 && Object.keys(candidates).includes(lastCardinal)) {
  //       cell = candidates[lastCardinal]!;
  //     } else {
  //       const [nextCardinal, nextCell] = pickRandom(Object.entries(candidates));
  //       cell = nextCell;
  //       lastCardinal = nextCardinal as Cardinal;
  //     }

  //     x++;
  //     // Pick randomly from another direction.
  //   }
  //   console.log(x);

  //   // Note: When growing a maze, every cell that we carve must be completely enclosed with
  //   // exception of the origin.  So we need a function that checks enclosure, minus a direction
  //   // It should return true if there's 7 directions that are closed, and none of them are
  //   // the point provided.

  //   // Assemble list of which are openable (surrounded by dirt except for the parent cell)
  //   // Pick one and open it, then repeat. Bias towards same direction.

  //   // console.log(cell);
  // }
}
