// Tiles
export enum Tile {
  Wall,
  Floor,
}

export const tileEmojis: Record<Tile, string> = {
  [Tile.Floor]: "⬜",
  [Tile.Wall]: "⬛",
} as const;

// Room generation.
export const MIN_ROOM_SIZE = 5;
export const MAX_ROOM_SIZE = 13;
export const MAX_ROOM_ECCENTRICITY = 7;
export const MAX_ROOM_COUNT = 30;
