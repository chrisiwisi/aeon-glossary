import {Component, input, output} from '@angular/core';
import {DecodePipe} from "../decode.pipe";
import {Letter} from "../letter/Letter";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-message',
  imports: [
    DecodePipe,
    NzButtonComponent,
    NzSwitchComponent,
    FormsModule
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  message = input.required<number[]>();
  alphabet = input.required<Letter[]>();
  showEdit = input<boolean>(true);
  showDelete = input<boolean>(true);

  delete = output<void>();
  open = output<void>();

  isDecoded: boolean = true;

  protected toggleDecode(value: boolean) {
    this.isDecoded = value;
  }

  protected deleteMessage() {
    this.delete.emit();
  }

  protected openDialog(): void {
    this.open.emit();
  }
}
