import {AfterViewChecked, Component, ElementRef, Input, Signal, ViewChild} from '@angular/core';
import {MessageDTO} from "../MessageDTO";
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [
    NgClass,
    NgForOf
  ],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent implements AfterViewChecked {
  @Input() messages!: Signal<MessageDTO[]>;

  @ViewChild('conversationContainer', { static: true }) conversationContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewChecked(): void {
    const calculatedTop = this.conversationContainer.nativeElement.scrollHeight
      - this.conversationContainer.nativeElement.clientHeight;
    if (calculatedTop != this.conversationContainer.nativeElement.scrollTop) {
      this.conversationContainer.nativeElement.scrollTop = calculatedTop;
    }
  }
}
