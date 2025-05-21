import { Elevator } from "./Elevator";
import { expect, test, describe, beforeEach } from "bun:test";

describe('elevator', () => {
  let elevator: Elevator;

  beforeEach(() => {
    elevator = new Elevator;
  });
  test('is instanciated', () => {
    expect(elevator).toBeInstanceOf(Elevator);
  });
});