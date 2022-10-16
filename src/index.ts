import { Board } from "./Board";
import {
  MAX_ROOM_COUNT,
  MAX_ROOM_ECCENTRICITY,
  MAX_ROOM_SIZE,
  MIN_ROOM_SIZE,
  tileEmojis,
} from "./config";
import { World } from "./World";

function main() {
  const board = new Board({ cellSize: 15 });

  const world = new World({
    width: board.width,
    height: board.height,
    minRoomSize: MIN_ROOM_SIZE,
    maxRoomSize: MAX_ROOM_SIZE,
    maxEccentricity: MAX_ROOM_ECCENTRICITY,
    maxRoomCount: MAX_ROOM_COUNT,
  });

  world.tiles.forEach((point, tile) => board.set(point, tileEmojis[tile]));
}

window.onload = main;
