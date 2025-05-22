# The challenge: Elevator

You are working in a building with an elevator. Sadly, the elevator isn't working as it should and you are given the task implementing a new module for controlling the elevator.

On each floor there are two buttons to call the elevator. One to signal you are going up, the other to signal that you are going down.

There are buttons inside the elevator as well which lets the passengers select floor.

## Expected behaviour

1.  The call buttons on each floor must light up after being pressed while waiting on the elevator to arrive.
2.  Pressing the call button sends the request to the control module together with the requested direction (up or down).
3.  The elevator travels to the requested floor.
4.  When the elevator arrives at the requested floor the call button's light should be switched off.
5.  The door opens and closes again when the passenger selects a floor from within the elevator.
6.  When the elevator is going up or down the elevator is expected to make intermediate stops at floors with passenger wanting to travel in the same direction.
    - Ex. Given an elevator going from 2nd to 7th floor: If someone on the 4th floor calls the elevator requesting to go up the elevator is expected to stop at 4th floor before completing it's trip to 7th floor.
    - If someone on the 4th floor calls the elevator requesting to go down the elevator should go to 7th first before going to 4th floor.
7.  The building has 7 floors. When the elevator has been idle for two minutes the elevator is expect to go to 4th floor.

## Running the application

To run the application run

```
bun index.ts
```

Current interaction allows for typing in commands from the terminal in simple syntax
For pressing a button in the elevator, type a number followed by Enter.
For pressing a floor button, type a number corresponding to the floor followed by
_U_ (Up) or _D_ (Down)

The button order is queue, if it happens to stop by and heading the same direction, it stops
Or if it was pressed from the inside the elevator it stops
If the elevator is idle for 2m then it goes to floor 4


## Testing

To test run

```
bun test --coverage
```
