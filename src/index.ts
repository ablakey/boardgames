import { Board, Direction } from "./Board";

const COLUMNS = 12;

function main() {
  const board = new Board(COLUMNS);

  const position = { x: 0, y: 0 };
  board.place(position, "😊");

  addEventListener("keyup", (e) => {
    const mapping: Record<string, Direction> = {
      ArrowUp: "up",
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowDown: "down",
    };

    if (e.key in mapping) {
      console.log(position);
      board.move(position, mapping[e.key], ({ x, y }) => {
        position.x = x;
        position.y = y;
      });
    }
  });
}

window.onload = main;
