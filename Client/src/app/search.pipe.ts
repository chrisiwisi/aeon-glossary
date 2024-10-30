import {inject, Pipe, PipeTransform} from '@angular/core';
import {Rule} from "./rules-card/Rule";
import {SearchService} from "./search.service";
import {SearchResult} from "minisearch";

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {
  private searchService: SearchService = inject(SearchService);

  transform(rules: Rule[], searchTerm: string | undefined): Rule[] {
    console.log(searchTerm)
    if (!searchTerm) {
      return rules;
    }
    const searchResult = this.searchService.search(searchTerm);
    console.log(searchResult);
    return searchResult.map((result: SearchResult) => rules.find(e => result.id === e.id)).filter(Boolean) as Rule[];
  }

}
