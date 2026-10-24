import {Component, computed, HostListener, input, output} from '@angular/core';
import {TechnologyNode, TechnologyStatus, TechnologyTextBlock, technologyFlavour} from '../technology.model';
import {TechnologyRichTextComponent} from '../technology-rich-text/technology-rich-text.component';

@Component({
  selector: 'app-technology-popup',
  imports: [TechnologyRichTextComponent],
  templateUrl: './technology-popup.component.html',
  styleUrl: './technology-popup.component.css'
})
export class TechnologyPopupComponent {
  readonly technology = input.required<TechnologyNode>();
  readonly prerequisites = input.required<TechnologyNode[]>();
  readonly researchedIds = input.required<ReadonlySet<string>>();
  readonly status = input.required<TechnologyStatus>();
  readonly closed = output<void>();
  readonly researched = output<string>();
  readonly errataEntries = computed(() => Object.entries(this.technology().errata ?? {})
    .map(([version, value]) => ({
      version,
      blocks: typeof value === 'string'
        ? value.trim() ? [{abilityText: [{type: 'plainText' as const, value}]}] : []
        : value,
    }))
    .filter((entry): entry is {version: string; blocks: TechnologyTextBlock[]} => entry.blocks.length > 0));

  flavour(): string { return technologyFlavour(this.technology(), this.status()); }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.closed.emit(); }
}
