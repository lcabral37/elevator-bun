import { EventEmitter } from "stream";
import { type EventOrder, type Order } from "../types";
import { Button } from "./Button";
import { WithButtons } from "./WithButtons";

export class Elevator extends WithButtons {
  public idleSince: number;
  public floor: number = 0;
  public next: number = 0;

  public currentSpeed: number = 0;

  public events = new EventEmitter<EventOrder>();
  public queue: Order[] = [];

  /**
   *
   * @param floors  Total number of floors
   * @param speed this represents what distance the elevator moves per iteration
   * @param maxIdle
   */
  constructor(
    private floors: number,
    private speed: number = 0.1,
    private maxIdle = 180
  ) {
    super();
    this.idleSince = this.now();
    // Got an exception with having too many event listeners...
    // Internet said this fixed it
    this.events.setMaxListeners(0);

    this.setupFloorButtons(floors);
    this.setupEventListeners();
  }

  private setupFloorButtons(floors: number) {
    this.buttons = Array.from(Array(floors)).map((_, floor) => {
      return new Button(floor.toString(), this.events, floor);
    });
  }

  private setupEventListeners() {
    this.events.on('press', (order: Order) => {
      this.queue.push(order);
    });

    this.events.on('pressed', (order: Order) => {
      this.queue.push(order);
    });
  }

  public textInfo(): string {
    const queueInfo = this.queue.map(o => `${o.floor}${o.direction}`);
    return this.buttonsInfo() + (this.queue.length ? ' << ' + queueInfo : '');
  }

  /* Current time in Secs */
  public now() {
    return Math.round(new Date().getTime() / 1000);
  }

  public tick() {
    if (this.next === this.floor) {
      this.currentSpeed = 0;
    }

    if (this.isIdle()) {
      this.goTo(Math.ceil(this.floors / 2));
      this.startMoving();
    }
    this.move();
  }

  public move() {
    if (this.currentSpeed) {
      this.floor = Math.round((this.floor + this.currentSpeed) * 10) / 10;
      this.idleSince = this.now();
    }
  }

  public isIdle() {
    return this.queue.length === 0
      && this.currentSpeed === 0
      && this.floor !== Math.ceil(this.floors / 2)
      && this.idleSince + this.maxIdle < this.now();
  }

  public goTo(floor: number) {
    this.next = floor;
  }

  public startMoving() {
    this.currentSpeed = this.next > this.floor
      ? this.speed
      : (-this.speed);
  }
}