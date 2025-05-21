import { Elevator } from "./models/Elevator";

const speed = 0.2;

const elevator = new Elevator();

function iteration() {
  console.clear();
  console.log('Elevator');
  console.log(`${elevator.floor} (${elevator.speed})`);
}

setInterval(iteration, speed);