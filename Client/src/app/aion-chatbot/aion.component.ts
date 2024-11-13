import { Component } from '@angular/core';
import {MessageDTO} from "./MessageDTO";
import {NgClass} from "@angular/common";
import {ConversationComponent} from "./conversation/conversation.component";
import {ChatPromptComponent} from "./chat-prompt/chat-prompt.component";

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
  messages: MessageDTO[] = [];

  toggleChatbox() {
    this.chatBox = !this.chatBox;
  }

}
