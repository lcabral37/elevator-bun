import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { EventEmitter } from "stream";
import { Direction, type EventOrder, type Order } from "./types";
import { InputResolver } from "./InputResolver";

describe('InputResolver', () => {
  const ee = new EventEmitter<EventOrder>();
  let lastOrder: Order | undefined;
  const ir = new InputResolver(ee, 8);

  beforeAll(() => {
    ee.on('pressed', (order) => lastOrder = order);
  });

  beforeEach(() => {
    lastOrder = undefined;
  });

  test('handles a elevator click', () => {
    ir.sendCommand('E1');
    expect(lastOrder).toEqual({ floor: 1, direction: Direction.NONE });
  });

  test('handles a floor click up', () => {
    ir.sendCommand('2U');
    expect(lastOrder).toEqual({ floor: 2, direction: Direction.UP });
  });
  test('handles a floor click down', () => {
    ir.sendCommand('2D');
    expect(lastOrder).toEqual({ floor: 2, direction: Direction.DOWN });
  });

  describe('ignores', () => {
    test('out of range elevator buttons', () => {
      ir.sendCommand('E8');
      expect(lastOrder).toBeUndefined();
    });

    test('out of range floor buttons', () => {
      ir.sendCommand('8U');
      expect(lastOrder).toBeUndefined();
    });

    test('out of range floor symbols', () => {
      ir.sendCommand('1A');
      expect(lastOrder).toBeUndefined();
    });
  });
});