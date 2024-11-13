import { Component } from '@angular/core';
import {NgClass} from "@angular/common";
import {ConversationComponent} from "./conversation/conversation.component";
import {ChatPromptComponent} from "./chat-prompt/chat-prompt.component";
import {MessageDTO} from "./MessageDTO";

@Component({
  selector: 'app-aion',
  standalone: true,
  imports: [
    NgClass,
    ConversationComponent,
    ChatPromptComponent
  ],
  templateUrl: './aion.component.html',
  styleUrl: './aion.component.css'
})
export class AionComponent {
  chatBox: boolean = false;
  messages: MessageDTO[] | undefined;

  toggleChatbox() {
    this.chatBox = !this.chatBox;
  }
}
