import { EventEmitter } from "stream";
import { type EventOrder, type Order } from "../types";
import { Button } from "./Button";
import { WithButtons } from "./WithButtons";


export class Elevator extends WithButtons {
  public floor: number = 0;
  public currentSpeed: number = 0;

  public events = new EventEmitter<EventOrder>();
  public queue: Order[] = [];

  constructor(
    private floors: number,
    private speed: number = 0.1,
    private maxIdle = 60
  ) {
    super();

    this.events.setMaxListeners(0);
    this.buttons = Array.from(Array(floors)).map((_, floor) => {
      return new Button(floor.toString(), this.events, floor);
    });

    this.events.on('press', (order: Order) => {
      this.queue.push(order);
    });

    this.events.on('pressed', (order: Order) => {
      this.queue.push(order);
    });
  }

  public textInfo(): string {
    const queueInfo = this.queue.map(o => `${o.floor}${o.direction }` )
    return this.buttonsInfo() +  (this.queue.length ? ' << ' +  queueInfo : '')
  }
}