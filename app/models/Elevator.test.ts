import { InputService } from "../services/InpuService";
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
    elevator.queue.push({ floor: 3, direction: Direction.NONE });
    elevator.queue.push({ floor: 4, direction: Direction.DOWN });
    expect(elevator.textInfo()).toEqual('0 1 2 << 30,4-1');
  });

  describe('tick()', () => {
    test('when Idle it starts going up to the middle floor', () => {
      const elevator = new Elevator(8, 0.1, 10);
      elevator.idleSince = elevator.now() - 11;

      elevator.tick();

      expect(elevator.next).toEqual(4);
      expect(elevator.currentSpeed).toEqual(0.1);
      expect(elevator.floor).toEqual(0.1);
    });

    test('when Idle it starts going down to the middle floor', () => {
      const elevator = new Elevator(8, 0.1, 10);
      elevator.floor = 6;
      elevator.idleSince = elevator.now() - 11;

      elevator.tick();

      expect(elevator.next).toEqual(4);
      expect(elevator.currentSpeed).toEqual(-0.1);
      expect(elevator.floor).toEqual(5.9);
    });

    test('it picks a floor from the go and goes to it', () => {
      const elevator = new Elevator(8, 0.5);
      elevator.floor = 0;
      elevator.queue.push({ floor: 3, direction: Direction.DOWN });

      [...Array(10)].forEach(() => elevator.tick());

      expect(elevator.floor).toEqual(3);
    });

    test('when going up it does not stop unless its the exact ', () => {
      const elevator = new Elevator(8, 0.1);
      elevator.floor = 0;
      elevator.queue.push({ floor: 3, direction: Direction.NONE }); //elevator press
      elevator.queue.push({ floor: 1, direction: Direction.UP }); //1st floor wants to go  up

      [...Array(9)].forEach(() => elevator.tick());

      expect(elevator.currentSpeed).toBe(0.1);
    });


    test('when pressing both buttons in a floor  when it reaches there both buttons should be turned off', () => {
      const elevator = new Elevator(8, 1);
      const ir = new InputService(elevator.events);

      ir.sendCommand('4u');
      ir.sendCommand('4d');


      tickUntil(elevator, () => elevator.floor === 4)
      ir.sendCommand('7');
      ir.sendCommand('2');

      tickUntil(elevator, () => elevator.floor === 4)


      expect(elevator.floor).toEqual(7)
      expect(elevator.queue.length).toBe(1);

      [...Array(7)].forEach(() => elevator.tick());

      expect(elevator.queue).toBeEmpty();
      expect(elevator.floor).toEqual(2)

  });
});

});

function tickUntil(elevator: Elevator, fn:  () => boolean ) {
  while(!fn()) {
    elevator.tick()
  }
}