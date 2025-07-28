import {Component, inject} from '@angular/core';
import {RulesCardComponent} from "./rules-card/rules-card.component";
import {SearchPipe} from "./search/search.pipe";
import {FormsModule} from "@angular/forms";
import {SearchService} from "./search/search.service";
import {Rule} from "./rules-card/Rule";
import {HttpClient} from "@angular/common/http";
import {AionComponent} from "./aion-chatbot/aion.component";
import {environment} from "../environments/environment";

@Component({
    selector: 'app-root',
    imports: [RulesCardComponent, SearchPipe, FormsModule, AionComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Aeon Glossary';
  searchTerm: string = '';
  rules: Rule[] = [];
  theLawUrl = environment.theLawUrl;

  http: HttpClient = inject(HttpClient);
  searchService: SearchService = inject(SearchService);

  constructor() {
    this.http.get<Rule[]>('assets/rules.json').subscribe(res => {
      this.rules = res;
      this.searchService.addSearchObjects(res);
    });
  }

  protected readonly environment = environment;
}
