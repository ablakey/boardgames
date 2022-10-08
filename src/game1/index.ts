import { Grid } from "../lib/grid";

const tokens = ["😈", "👻", "🎃", "🧟"];

function main() {
  const grid = new Grid({ onClick: console.log, tokens });
  grid.populateCells();
  const x = grid.get(0, 0);
  console.log(x);

  grid.set(1, 1, "a");

  // requestAnimationFrame(() => {
  // setGrid();
  // });
}

window.onload = main;
