import type { Button } from "./Button";

export class WithButtons {
  public buttons: Button[] = [];

  public buttonsInfo() {
    return this.buttons.map(b => b.textInfo()).join(' ');
  }
}