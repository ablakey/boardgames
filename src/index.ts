import { Grid } from "./grid";
import { World } from "./World";

// const tokens = ["😈", "👻", "🎃", "🧟"];
const tokens = ["😈", "👻"] as const;

function main() {
  // function onClick(point: Point) {
  //   const contiguous = grid.getContiguous(point);
  //   contiguous.forEach((c) => grid.setBg(c.point, "cyan"));
  // }

  const grid = new Grid({ tokens, cellSize: 15 });

  const world = new World({
    width: grid.width,
    height: grid.height,
    minRoomSize: 5,
    maxRoomSize: 13,
    maxEccentricity: 7,
    maxRoomCount: 15,
  });
  world.rooms.forEach((r) => grid.drawRect(r, "😈"));
}

window.onload = main;
