import { Injectable } from '@angular/core';
import MiniSearch from "minisearch";
import {Rule} from "./rules-card/Rule";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private miniSearch: MiniSearch<Rule> = new MiniSearch<Rule>({
    fields: ['id', 'name', 'rule', 'keywords'],
    searchOptions: {
      boost: { ['id']: 3, ['name']: 2, ['keywords']: 2 },
      fuzzy: 0.1,
      prefix: true,
    },
  })

  constructor() { }

  addSearchObjects(rules: Rule[]) {
    this.miniSearch.addAll(rules);
  }

  search(searchTerm: string) {
    return this.miniSearch.search(searchTerm);
  }
}
