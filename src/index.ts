import { Board } from "./ui/Board";
import { MAX_ROOM_COUNT, MAX_ROOM_SIZE, MIN_ROOM_SIZE } from "./config";
import { buildWorld } from "./game/buildWorld";
import { Rect } from "./structs";

function main() {
  const board = new Board({ cellSize: 15 });

  const world = buildWorld({
    width: 150,
    height: 150,
    // width: board.width,
    // height: board.height,
    minRoomSize: MIN_ROOM_SIZE,
    maxRoomSize: MAX_ROOM_SIZE,
    maxRoomCount: MAX_ROOM_COUNT,
  });

  world.forEachInRect(new Rect(40, 40, 0, 0), (c) => {
    board.set(c);
  });

  // for (const cell of world) {
  //   board.set(cell);
  // }
}

window.onload = main;
