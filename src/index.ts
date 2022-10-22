import { Board } from "./ui/Board";
import {
  MAX_ROOM_COUNT,
  MAX_ROOM_ECCENTRICITY,
  MAX_ROOM_SIZE,
  MIN_ROOM_SIZE,
  tileEmojis,
} from "./config";
import { buildWorld } from "./game/buildWorld";

function main() {
  const board = new Board({ cellSize: 15 });

  const world = buildWorld({
    width: board.width,
    height: board.height,
    minRoomSize: MIN_ROOM_SIZE,
    maxRoomSize: MAX_ROOM_SIZE,
    maxEccentricity: MAX_ROOM_ECCENTRICITY,
    maxRoomCount: MAX_ROOM_COUNT,
  });

  for (const cell of world) {
    board.set(cell);
  }
}

window.onload = main;
