import type { EventEmitter } from "stream";
import { Direction, type EventOrder } from "../types";

/**
 *  Handles text inputs and determines what command the user typed.
 * It emits an event via a EventEmitter to signal the button in a floor or the elevator.
 */
export class InputService {

  constructor(private events: EventEmitter<EventOrder>, private floors = 8) { }

  sendCommand(text: string) {
    const [arg1, arg2] = text.toUpperCase().split('');
    if (arg1 === 'E' && this.isValidFloor(arg2)) {
      const floor = parseInt(arg2!);
      this.events.emit('pressed', { floor, direction: Direction.NONE });
    } else if (this.isValidFloor(arg1)) {
      const floor = parseInt(arg1!);
      if (arg2 === 'U') {
        this.events.emit('pressed', { floor, direction: Direction.UP });
      } else if (arg2 === 'D') {
        this.events.emit('pressed', { floor, direction: Direction.DOWN });
      }
    }
  }

  private isValidFloor(text: string | undefined): boolean {
    try {
      const floor = parseInt(text!);
      return floor >= 0 && floor < this.floors - 1;
    } catch (e) {
      return false;
    }
  }
}