import { Direction } from "../types";
import { Elevator } from "./Elevator";
import { expect, test, describe, beforeEach } from "bun:test";

describe('elevator', () => {
  beforeEach(() => {
  });
  test('is instanciated', () => {
    const elevator = new Elevator(8);
    expect(elevator).toBeInstanceOf(Elevator);
  });

  test('elevator has 8 buttons', () => {
    const elevator = new Elevator(8);
    expect(elevator.buttons.length).toEqual(8);
  });

  test('pressing a floor button queues a order', async () => {
    const elevator = new Elevator(8);
    elevator.buttons[3]?.press();

    expect(elevator.queue.length).toEqual(1);
    expect(elevator.queue[0]?.floor).toEqual(3);
    expect(elevator.queue[0]?.direction).toEqual(Direction.NONE);
  });
  test('event of pressing a elevator button queues a order', async () => {
    const elevator = new Elevator(8);
    elevator.events.emit('press', { floor: 4, direction: Direction.NONE });

    expect(elevator.queue.length).toEqual(1);
    expect(elevator.queue[0]?.floor).toEqual(4);
    expect(elevator.queue[0]?.direction).toEqual(Direction.NONE);
  });

  test('TextInfo() should return a list of buttons labels', () => {
    const elevator = new Elevator(3);
    expect(elevator.textInfo()).toEqual('0 1 2');
  });
  test('TextInfo() should return a list of buttons labels and order', () => {
    const elevator = new Elevator(3);
    elevator.queue.push({floor: 3, direction: Direction.NONE})
    elevator.queue.push({floor: 4, direction: Direction.DOWN})
    expect(elevator.textInfo()).toEqual('0 1 2 << 30,4-1');
  });
});