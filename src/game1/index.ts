import { Board } from "../lib/board";

function main() {
  const board = new Board(5, "top");
  board.set(0, 0, "🔴");
  board.set(1, 0, "🔴");
  board.set(2, 0, "⚫");
  board.set(3, 3, "⚫");
  board.set(4, 3, "⚫");
}

window.onload = main;
