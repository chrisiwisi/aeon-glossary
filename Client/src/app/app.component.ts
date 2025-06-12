import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {RulesCardComponent} from "./rules-card/rules-card.component";
import {NgClass, NgForOf} from "@angular/common";
import {SearchPipe} from "./search/search.pipe";
import {FormsModule} from "@angular/forms";
import {SearchService} from "./search/search.service";
import {Rule} from "./rules-card/Rule";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ConversationComponent} from "./aion-chatbot/conversation/conversation.component";
import {ChatPromptComponent} from "./aion-chatbot/chat-prompt/chat-prompt.component";
import {AionComponent} from "./aion-chatbot/aion.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RulesCardComponent, NgForOf, SearchPipe, FormsModule, HttpClientModule, NgClass, ConversationComponent, ChatPromptComponent, AionComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
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
