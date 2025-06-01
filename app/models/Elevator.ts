import { EventEmitter } from "stream";
import { Direction, type EventOrder, type Order } from "../types";
import { Button } from "./Button";
import { WithButtons } from "./WithButtons";

export class Elevator extends WithButtons {
  public idleSince: number;
  public floor: number = 0;
  public next: number = 0;

  public currentSpeed: number = 0;
  // To signal it is not on the way to some floor

  public stopped: boolean = true;
  // when stopping by a floor
  public stoppedBy: boolean = false;
  public stoppedBySince: number;

  public events = new EventEmitter<EventOrder>();
  public queue: Order[] = [];

  /**
   *
   * @param floors  Total number of floors
   * @param speed this represents what distance the elevator moves per iteration
   * @param maxIdleSecs
   */
  constructor(
    private floors: number,
    private speed: number = 0.1,
    private maxIdleSecs = 180,
    private maxStopBySecs = 3

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
    this.events.on('press', (order: Order) => this.addOrder(order));
    this.events.on('pressed', (order: Order) => this.addOrder(order));
  }

  private addOrder(order: Order) {
    if (order.floor === this.floor && this.checkIfStoppedBy()) {
      // hold the door open
      this.stopBy();
    } else if (!this.queue.find(o => o.floor === order.floor && o.direction === order.direction)) {
      // Add it only if not already in the queue
      this.queue.push(order);
    }
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
    if (this.checkIfStoppedBy()) {
      return;
    }

    if (this.queue.length) {
      //If stopped  tries to pick  something from the queue
      if (this.stopped) {
        const next = this.queue.shift();
        this.goTo(next!.floor);
        this.startMoving();
      } else if (this.shouldStop()) {
        this.stopBy();
      }
    }


    // If it reaches the floor then it stops
    if (this.next === this.floor && this.currentSpeed) {
      this.stop(true);
      this.events.emit('atFloor', this.floor);
    }

    if (this.isIdle()) {
      this.goTo(Math.ceil(this.floors / 2));
      this.startMoving();
    }
    this.move();
  }

  // Check if any of the queue requests is valid to stop by
  private shouldStop(): boolean {
    //needs to be an exact number
    if (this.floor !== Math.round(this.floor)) {
      return false;
    }

    // If the a button in the elevator was pressed, it stops
    const matchElevatorOrder = this.queue.findIndex(
      order => order.floor === this.floor && order.direction === Direction.NONE
    );
    if (matchElevatorOrder >= 0) {
      this.queue.splice(matchElevatorOrder, 1);
      return true;
    }

    // If the elevator is going in the same direction the floor button was pressed it stops
    const currentDirection = this.currentSpeed > 0
      ? Direction.UP
      : Direction.DOWN;
    const matchFloorDirectionOrder = this.queue.findIndex(
      order => order.floor === this.floor && order.direction === currentDirection
    );
    if (matchFloorDirectionOrder >= 0) {
      this.queue.splice(matchFloorDirectionOrder, 1);
      return true;
    }

    return false;
  }

  private stop(fullStop: boolean = false) {
    this.currentSpeed = 0;
    this.stopped = fullStop;
  }

  /**
   * Stops by a Floor
   * This can be used for in transit stop
   * or also when the button in the same floor is pressed
   */
  public stopBy() {
    this.stoppedBy = true;
    this.stoppedBySince = this.now();
    this.events.emit('atFloor', this.floor)
  }

  public checkIfStoppedBy(): boolean {
    if (this.stoppedBy && this.stoppedBySince + this.maxStopBySecs > this.now()) {
      return true;
    }
    this.stoppedBy = false;
    return false;
  }

  // Updates the floor partial location
  private move() {
    if (this.currentSpeed) {
      this.floor = Math.round((this.floor + this.currentSpeed) * 10) / 10;
      this.idleSince = this.now();
      this.stopped = false;
    }
  }

  public isIdle() {
    return this.queue.length === 0
      && this.currentSpeed === 0
      && this.floor !== Math.ceil(this.floors / 2)
      && this.idleSince + this.maxIdleSecs < this.now();
  }

  public goTo(floor: number) {
    this.next = floor;
  }

  public startMoving() {
    this.stopped = false;
    this.currentSpeed = this.next > this.floor
      ? this.speed
      : (-this.speed);
  }
}