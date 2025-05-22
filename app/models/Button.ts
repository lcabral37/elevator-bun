import type EventEmitter from "events";
import { Direction, type EventOrder } from "../types";

export class Button {
  public light: boolean = false;

  constructor(
    public label: string | number,
    private events: EventEmitter<EventOrder>,
    private floor: number,
    private direction = Direction.NONE
  ) {
    this.events.on('atFloor', (floor) => {
      if (floor === this.floor) {
        this.light = false;
      }
    });

    this.events.on('pressed', (order) => {
      if (order.floor === floor && order.direction === this.direction) {
        this.press();
      }
    });
  }

  public press() {
    this.light = true;
    this.events.emit('press', { floor: this.floor, direction: this.direction });
  }

  public textInfo() {
    return this.light ? `\x1b[32m${this.label}\x1b[0m` : this.label;
  }
}