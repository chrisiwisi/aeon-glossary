import {Component, Input} from '@angular/core';
import {MessageDTO} from "../MessageDTO";

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent {
  @Input() messages!: MessageDTO[];

}
