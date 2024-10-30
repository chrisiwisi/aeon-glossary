import {Component, Input} from '@angular/core';
import {Rule} from "./Rule";

@Component({
  selector: 'app-rules-card',
  standalone: true,
  imports: [],
  template: `
    <h4>{{ rule?.name }}</h4>
    <div>{{ rule?.rule }}</div>
  `,
  styleUrl: './rules-card.component.css'
})
export class RulesCardComponent {
  @Input() rule: Rule | undefined;
}
