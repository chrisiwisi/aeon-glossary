import {Component, DestroyRef, inject} from '@angular/core';
import {AionComponent} from "../aion-chatbot/aion.component";
import {FormsModule} from "@angular/forms";
import {RulesCardComponent} from "../rules-card/rules-card.component";
import {SearchPipe} from "../search/search.pipe";
import {Rule} from "../rules-card/Rule";
import {SearchService} from "../search/search.service";
import {environment} from "../../environments/environment";
import {GlossaryCacheService} from './glossary-cache.service';

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
  rules: Rule[] = [];

  private readonly destroyRef = inject(DestroyRef);
  private readonly searchService = inject(SearchService);
  private readonly glossaryCache = inject(GlossaryCacheService);
  private disconnect: () => void = () => undefined;

  constructor() {
    this.disconnect = this.glossaryCache.connect(rules => {
      this.rules = rules;
      this.searchService.setSearchObjects(rules);
    }, () => {
      this.rules = [];
      this.searchService.setSearchObjects([]);
    });

    this.destroyRef.onDestroy(() => this.disconnect());
  }

  protected readonly environment = environment;
}
