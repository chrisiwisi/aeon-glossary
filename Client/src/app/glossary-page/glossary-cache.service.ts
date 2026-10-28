import {inject, Injectable} from '@angular/core';
import {Database, onValue, ref} from '@angular/fire/database';
import {Rule} from '../rules-card/Rule';

@Injectable({
  providedIn: 'root'
})
export class GlossaryCacheService {
  private readonly db = inject(Database);
  private readonly cachePath = 'glossaryCache/rulesJson';

  connect(onRules: (rules: Rule[]) => void, onError: (error: Error) => void): () => void {
    return onValue(ref(this.db, this.cachePath), snapshot => {
      let rules: Rule[];
      try {
        const cachedRules = JSON.parse(snapshot.val() ?? 'null');
        if (!Array.isArray(cachedRules) || !cachedRules.length || cachedRules.some(rule => !this.isRule(rule))) {
          throw new Error('Glossary cache is missing, empty, or invalid.');
        }
        rules = cachedRules;
      } catch (error) {
        onError(error instanceof Error ? error : new Error('Invalid glossary cache.'));
        return;
      }
      onRules(rules);
    }, error => onError(error));
  }

  private isRule(candidate: unknown): candidate is Rule {
    if (!candidate || typeof candidate !== 'object') return false;
    const record = candidate as Record<string, unknown>;
    const id = record['id'];
    const name = record['name'];
    const rule = record['rule'];
    const keywords = record['keywords'];
    return typeof id === 'string' && !!id &&
      typeof name === 'string' && !!name &&
      typeof rule === 'string' &&
      Array.isArray(keywords) && keywords.every(keyword => typeof keyword === 'string');
  }
}
