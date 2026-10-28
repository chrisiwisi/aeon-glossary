import {Component, DestroyRef, inject, signal} from '@angular/core';
import {AionComponent} from "../aion-chatbot/aion.component";
import {FormsModule} from "@angular/forms";
import {RulesCardComponent} from "../rules-card/rules-card.component";
import {SearchPipe} from "../search/search.pipe";
import {Rule} from "../rules-card/Rule";
import {SearchService} from "../search/search.service";
import {environment} from "../../environments/environment";
import {GlossaryCacheService} from './glossary-cache.service';
import bundledRules from '../../assets/rules.json';

@Component({
    selector: 'app-glossary-page',
    imports: [
        AionComponent,
        FormsModule,
        RulesCardComponent,
        SearchPipe
    ],
    templateUrl: './glossary-page.component.html',
    styleUrl: './glossary-page.component.css'
})
export class GlossaryPageComponent {
  searchTerm: string = '';
  readonly rules = signal<Rule[]>(bundledRules);
  readonly cacheError = signal('');

  private readonly destroyRef = inject(DestroyRef);
  private readonly searchService = inject(SearchService);
  private readonly glossaryCache = inject(GlossaryCacheService);
  private disconnect: () => void = () => undefined;

  constructor() {
    this.searchService.setSearchObjects(this.rules());
    this.disconnect = this.glossaryCache.connect(rules => {
      this.searchService.setSearchObjects(rules);
      this.rules.set(rules);
      this.cacheError.set('');
    }, error => {
      console.error('Could not load glossary cache.', error);
      this.cacheError.set('Live glossary updates are unavailable. Showing the last available rules.');
    });

    this.destroyRef.onDestroy(() => this.disconnect());
  }

  protected readonly environment = environment;
}
