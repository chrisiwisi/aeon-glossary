import {Component, signal} from '@angular/core';
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
export class AionComponent {
  chatBox: boolean = false;
  messages = signal<MessageDTO[]>([]);
  readonly loading = signal(false);
  readonly disabled = signal(false);
  readonly threadLoaded = signal(false);

  constructor(
    private aionService: AionService,
  ) {
  }

  toggleChatbox(): void {
    if (this.disabled()) return;
    this.chatBox = !this.chatBox;
    if (this.chatBox && !this.threadLoaded() && !this.loading()) {
      this.loadThread();
    }
  }

  handleMessage(event: string): void {
    if (this.disabled() || !this.threadLoaded() || this.loading()) return;
    this.aionService.promptAndAwaitResponse(event).subscribe({
      next: (thread: FullThreadDTO) => {
        this.messages.set(thread.data)
      },
      error: () => this.disableChat()
    });
  }

  private loadThread(): void {
    this.loading.set(true);
    this.aionService.getFullThread().subscribe({
      next: (thread: FullThreadDTO) => {
        this.messages.set(thread.data);
        this.threadLoaded.set(true);
        this.loading.set(false);
      },
      error: () => this.disableChat()
    })
  }

  private disableChat(): void {
    this.disabled.set(true);
    this.loading.set(false);
    this.chatBox = false;
  }
}
