import { InputService } from "./app/services/InpuService";
import { Elevator } from "./app/models/Elevator";
import { Floor } from "./app/models/Floor";

const floorCount = 8;
const refresh = 200;
const speed = 0.1;
let order = 'idle';


const elevator = new Elevator(floorCount, speed);
const floors = Array.from(Array(floorCount)).map((_, floor) => new Floor({
  floor,
  ...(floor === 0 ? { label: 'Lobby' } : {}),
  hasDown: floor !== 0,
  hasUp: floor !== floorCount - 1,
  events: elevator.events
},));

function iteration(): void {
  console.clear();
  console.log(`Elevator ${elevator.floor} (S${elevator.currentSpeed} - F${elevator.next})`);
  console.log(elevator.textInfo());
  [...floors].reverse().forEach(floor => {
    const elevatorIsHere = floor.floor === Math.round(elevator.floor);
    let elPlaceholder = '   ';
    if (elevatorIsHere) {
      elPlaceholder = elevator.stoppedBy ? '[ ]' : '[X]';
    }
    console.log(`${elPlaceholder} | ${floor.textInfo()} |`);
  });
  console.log('_______________________________________');
  console.log(` - type N to press a elevator button`);
  console.log(` - type [N][U|D] To press the Floor [0..${floors.length}], button [U]p or [D]own`);
  console.log(` Press [Enter] after the command`);
}

async function waitForTextInput(): Promise<void> {
  const ir = new InputService(elevator.events);
  for await (const line of console) {
    order = `${line}`;
    ir.sendCommand(`${line}`);
  }
}

setInterval(iteration, refresh);
setInterval(() => elevator.tick(), refresh);
waitForTextInput();

