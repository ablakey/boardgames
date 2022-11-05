import { MAX_ROOM_ITERATIONS } from "../config";
import { Cell, Rect } from "../structs";
import { randInt, pickRandom, shuffle } from "../utils";
import { Cardinal, cardinalDirections, World } from "./World";

type WorldOptions = {
  width: number;
  height: number;
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

  // Populate Tiles from rooms.
  world.rooms.forEach((r) =>
    r.forEachCell((point) => {
      world.set(point, "Floor");
    })
  );

  // Generate maze.
  world.forEachOdd((c) => {
    if (c.tile === "Wall") {
      buildMaze(c);
    }
  });

  // Make connections for each room.
  // Note: There still might be different regions of mazes that do not connect.
  world.rooms.forEach((room) => {
    outer: for (const cardinal of shuffle(cardinalDirections)) {
      for (const cell of shuffle(room.getEdge(cardinal))) {
        if (world.get(cell, cardinal, 2)?.tile === "Floor") {
          world.set(cell, "Floor");
          console.log("set");
          break outer;
        }
      }
    }
  });

  // Uncarve dead ends.
  while (true) {
    let updated = false;
    world.forEach((cell) => {
      if (
        cell.tile === "Floor" &&
        world.getNeighbours(cell).filter((n) => n.tile === "Wall").length >= 3
      ) {
        world.set(cell, "Wall");
        updated = true;
      }
    });

    if (!updated) {
      break;
    }
  }

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

      const openNeighbours: Cardinal[] = cardinalDirections.filter(
        (d) => world.get(cell, d, 3) && world.get(cell, d, 2)!.tile === "Wall"
      );

      if (openNeighbours.length) {
        let newCardinal: Cardinal;
        if (openNeighbours.includes(lastCardinal) && Math.random() > 0.5) {
          newCardinal = lastCardinal;
        } else {
          newCardinal = pickRandom(openNeighbours);
        }

        world.set(cell, "Floor", newCardinal);
        world.set(cell, "Floor", newCardinal, 2);

        cells.push(world.get(cell, newCardinal, 2)!);
        lastCardinal = newCardinal;
      } else {
        cells.pop();
        lastCardinal = "Right";
      }
    }
  }
}
