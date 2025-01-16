import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-chat-prompt',
  imports: [
    FormsModule
  ],
  templateUrl: './chat-prompt.component.html',
  standalone: true,
  styleUrl: './chat-prompt.component.css'
})
export class ChatPromptComponent {
  userInput: string = '';
  @Output() messageChange: EventEmitter<string> = new EventEmitter<string>();

  sendMessage() {
    if (this.userInput.trim() !== '') {
      this.messageChange.emit(this.userInput.trim());
      this.userInput = '';
    }
  }
}
