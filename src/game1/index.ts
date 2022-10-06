import { Board } from "../lib/board";

function main() {
  const board = new Board({ size: 5, targetId: "container", bgColours: ["#AAA"], trayHeight: 10 });
  board.setPiece(0, 0, "🔴");
  board.setPiece(1, 0, "🔴");
  board.setPiece(2, 0, "⚫");
  board.setPiece(3, 3, "⚫");
  board.setPiece(4, 3, "⚫");

  board.addToTray("🔴", 2);
  board.addToTray("🔴", 2);
}

window.onload = main;
