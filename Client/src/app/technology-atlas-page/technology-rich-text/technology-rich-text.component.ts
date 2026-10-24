import {Component, input} from '@angular/core';
import {TechnologyTextBlock} from '../technology.model';

@Component({
  selector: 'app-technology-rich-text',
  templateUrl: './technology-rich-text.component.html',
  styleUrl: './technology-rich-text.component.css',
})
export class TechnologyRichTextComponent {
  readonly content = input.required<TechnologyTextBlock>();

  iconLabel(value: string | undefined): string {
    return (value ?? 'Icon').replace(/([a-z])([A-Z])/g, '$1 $2');
  }
}
