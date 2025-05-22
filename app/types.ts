export enum Direction {
  UP = 1,
  NONE = 0,
  DOWN = -1
}

export type Order = {
  floor: number;
  direction: Direction;
  info?: string;
};

export type EventOrder = {
  'press': [arg1: Order];
  'pressed': [arg1: Order];
  'atFloor': [arg1: number];
}