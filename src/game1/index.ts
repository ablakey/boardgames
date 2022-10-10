import { Grid, Point } from "../lib/grid";

// const tokens = ["😈", "👻", "🎃", "🧟"];
const tokens = ["😈", "👻"];

function main() {
  function onClick(point: Point) {
    const contiguous = grid.getContiguous(point);
    contiguous.forEach((c) => grid.setBg(c.point, "cyan"));
  }

  const grid = new Grid({ onClick, tokens });
  grid.populateCells();
}

window.onload = main;
