import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { Button } from "./Button";
import { Direction, type EventOrder } from "../types";
import { EventEmitter } from "stream";

describe('Button', () => {
  const events = new EventEmitter<EventOrder>();
  let button: Button;

  beforeEach(() => {
    button = new Button('Up', events, 1);
  });

  test('is instanciated', () => {

    expect(button).toBeDefined();
    expect(button.light).toBeFalse();
  });

  test('light is is on when pressed', () => {
    button.press();
    expect(button.light).toBeTrue();
  });

  test('light keeps on after pressed', () => {
    button.press();
    button.press();
    expect(button.light).toBeTrue();
  });

  test('the light switches off when the elevator stops at same floor', () => {
    button.press();
    events.emit('atFloor', 1);
    expect(button.light).toBeFalse();
  });

  test('the light remains on when the elevator stops in another floor', () => {
    button.press();
    events.emit('atFloor', 2);
    expect(button.light).toBeTrue();
  });

  test('textInfo() show the button label', () => {
    expect(button.textInfo()).toEqual('Up');
  });
  test('textInfo() show the highlighted button label', () => {
    button.press();
    expect(button.textInfo()).toEqual('\x1b[32mUp\x1b[0m');
  });

  test('ignores pressed command for other floors', () => {
    events.emit('pressed', 2);
    expect(button.light).toBeFalse();
  });
});