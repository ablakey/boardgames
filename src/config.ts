import { Tile } from "./structs";

export const tileEmojis: Record<Tile, string> = {
  Floor: "⬜",
  Wall: "⬛",
  Maze: "🟧",
} as const;

// Room generation.
export const MIN_ROOM_SIZE = 5;
export const MAX_ROOM_SIZE = 13;
export const MAX_ROOM_ECCENTRICITY = 7;
export const MAX_ROOM_COUNT = 30;
export const MAX_ROOM_ITERATIONS = 0;
