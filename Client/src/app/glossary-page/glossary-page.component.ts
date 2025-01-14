import {Component, inject} from '@angular/core';
import {AionComponent} from "../aion-chatbot/aion.component";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {RulesCardComponent} from "../rules-card/rules-card.component";
import {SearchPipe} from "../search/search.pipe";
import {Rule} from "../rules-card/Rule";
import {HttpClient} from "@angular/common/http";
import {SearchService} from "../search/search.service";

@Component({
  selector: 'app-glossary-page',
  standalone: true,
    imports: [
        AionComponent,
        FormsModule,
        NgForOf,
        RulesCardComponent,
        SearchPipe
    ],
  templateUrl: './glossary-page.component.html',
  styleUrl: './glossary-page.component.css'
})
export class GlossaryPageComponent {
  title = 'Aeon Glossary';
  searchTerm: string = '';
  rules: Rule[] = [];

  http: HttpClient = inject(HttpClient);
  searchService: SearchService = inject(SearchService);

  constructor() {
    this.http.get<Rule[]>('assets/rules.json').subscribe(res => {
      this.rules = res;
      this.searchService.addSearchObjects(res);
    });
  }

}
