import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {RulesCardComponent} from "./rules-card/rules-card.component";
import {NgForOf} from "@angular/common";
import {SearchPipe} from "./search.pipe";
import {FormsModule} from "@angular/forms";
import {SearchService} from "./search.service";
import {Rule} from "./rules-card/Rule";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RulesCardComponent, NgForOf, SearchPipe, FormsModule, HttpClientModule],
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
