import {Component, input, output} from '@angular/core';
import {DecodePipe} from "../decode.pipe";
import {Letter} from "../letter/Letter";
import {NzButtonComponent} from "ng-zorro-antd/button";

@Component({
  selector: 'app-message',
  imports: [
    DecodePipe,
    NzButtonComponent
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  message = input.required<number[]>();
  alphabet = input.required<Letter[]>();

  delete = output<void>();

  protected deleteMessage() {
    this.delete.emit();
  }
}
