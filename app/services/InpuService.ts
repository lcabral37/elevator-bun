import type { EventEmitter } from "stream";
import { Direction, type EventOrder } from "../types";

/**
 *  Handles text inputs and determines what command the user typed.
 * It emits an event via a EventEmitter to signal the button in a floor or the elevator.
 */
export class InputService {
  private validDirections = {
    'U': Direction.UP,
    'D': Direction.DOWN
  };

  constructor(private events: EventEmitter<EventOrder>, private floors = 8) { }

  sendCommand(text: string) {
    const [rawFloor, rawDirection] = text.toUpperCase().split('');
    if (this.isValidFloor(rawFloor)) {
      {
        const floor = parseInt(rawFloor!);
        if (!rawDirection) {
          this.events.emit('pressed', { floor, direction: Direction.NONE });
        } else {
          const direction = this.validDirections[rawDirection.toUpperCase() as 'U' | 'D'];
          if (direction) {
            this.events.emit('pressed', { floor, direction });
          }
        }
      }
    }
  }

  private isValidFloor(text: string | undefined): boolean {
    try {
      const floor = parseInt(text!);
      return floor >= 0 && floor < this.floors;
    } catch (e) {
      return false;
    }
  }
}