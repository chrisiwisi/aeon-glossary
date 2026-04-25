import {Component, OnInit, signal} from '@angular/core';
import {NgClass} from "@angular/common";
import {ConversationComponent} from "./conversation/conversation.component";
import {ChatPromptComponent} from "./chat-prompt/chat-prompt.component";
import {MessageDTO} from "./DTOs/MessageDTO";
import {AionService} from "./aion.service";
import {FullThreadDTO} from "./DTOs/FullThreadDTO";

@Component({
    selector: 'app-aion',
    imports: [
        NgClass,
        ConversationComponent,
        ChatPromptComponent
    ],
    templateUrl: './aion.component.html',
    styleUrl: './aion.component.css'
})
export class AionComponent implements OnInit {
  chatBox: boolean = false;
  messages = signal<MessageDTO[]>([]);

  constructor(
    private aionService: AionService,
  ) {
  }

  toggleChatbox(): void {
    this.chatBox = !this.chatBox;
  }

  handleMessage(event: string): void {
    this.aionService.promptAndAwaitResponse(event).subscribe({
      next: (thread: FullThreadDTO) => {
        this.messages.set(thread.data)
      }
    });
  }

  ngOnInit(): void {
    this.aionService.getFullThread().subscribe({
      next: (thread: FullThreadDTO) => {
        this.messages.set(thread.data)
      }
    })
  }
}
