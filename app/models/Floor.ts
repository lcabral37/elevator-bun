import type { EventEmitter } from "stream";
import { Button } from "./Button";
import { Direction, type EventOrder } from "../types";
import { WithButtons } from "./WithButtons";

/**
 * Representation of a floor object.
 * Its constructor parameters `hasUp`  and `hasDown` allow to determine which buttons to
 * it has.
 */
export class Floor extends WithButtons {
  public floor: number;
  public label: string;

  constructor(options: {
    floor: number,
    label?: string,
    hasUp?: boolean,
    hasDown?: boolean,
    events: EventEmitter<EventOrder>;
  }) {
    super();
    this.floor = options.floor;
    this.label = options.label || options.floor.toString();
    if (options.hasDown) {
      this.buttons.push(new Button('D', options.events, this.floor, Direction.DOWN));
    }
    if (options.hasUp) {
      this.buttons.push(new Button('U', options.events, this.floor, Direction.UP));
    }
  }

  public textInfo(): string {
    return this.buttonsInfo() + ' ' + this.label;
  }
}