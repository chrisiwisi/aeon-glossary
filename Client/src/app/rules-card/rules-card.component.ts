import {Component, Input} from '@angular/core';
import {Rule} from "./Rule";
import {MarkdownPipe} from "../pipe/markdown.pipe";

@Component({
    selector: 'app-rules-card',
    imports: [
      MarkdownPipe
    ],
    template: `
    <h4>{{ rule?.name }}</h4>
    <div [innerHTML]="rule?.rule | markdown">{{ rule?.rule }}</div>
  `,
    styleUrl: './rules-card.component.css'
})
export class RulesCardComponent {
  @Input() rule: Rule | undefined;
}
