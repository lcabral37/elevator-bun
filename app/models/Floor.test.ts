import { describe, test } from "node:test";
import { Floor } from "./Floor";
import { EventEmitter } from "stream";
import type { EventOrder } from "../types";
import { expect } from "bun:test";

describe('Floor', () => {
  const events = new EventEmitter<EventOrder>();

  test('has an instance', () => {
    const floor = new Floor({
      floor: 0,
      label: 'Lobby',
      hasUp: true,
      hasDown: true,
      events: events
    });

    expect(floor).toBeInstanceOf(Floor);
    expect(floor.label).toEqual('Lobby');
    expect(floor.floor).toEqual(0);
    expect(floor.buttons.length).toEqual(2);
  });


  test('has an only has a up Button', () => {
    const floor = new Floor({
      floor: 0,
      label: 'Lobby',
      hasUp: true,
      hasDown: false,
      events: events
    });

    expect(floor.buttons.length).toEqual(1);
    expect(floor.buttons[0]?.label).toEqual('U');
  });

  test('has an only has a down Button', () => {
    const floor = new Floor({
      floor: 5,
      hasUp: false,
      hasDown: true,
      events: events
    });

    expect(floor.buttons.length).toEqual(1);
    expect(floor.buttons[0]?.label).toEqual('D');
  });

  test('testInfo() displays the buttons labels & floor label', () => {
    const floor = new Floor({
      floor: 5,
      hasUp: true,
      hasDown: true,
      events: events
    });

    expect(floor.textInfo()).toEqual('D U 5');
  });

});