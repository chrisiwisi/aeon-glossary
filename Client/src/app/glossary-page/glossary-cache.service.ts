import {inject, Injectable} from '@angular/core';
import {Database, onValue, ref} from '@angular/fire/database';
import {Rule} from '../rules-card/Rule';

@Injectable({
  providedIn: 'root'
})
export class GlossaryCacheService {
  private readonly db = inject(Database);
  private readonly cachePath = 'glossaryCache/rulesJson';

  connect(onRules: (rules: Rule[]) => void, onError: () => void): () => void {
    return onValue(ref(this.db, this.cachePath), snapshot => {
      try {
        const rules = JSON.parse(snapshot.val() ?? 'null');
        if (!Array.isArray(rules) || rules.some(rule => !this.isRule(rule))) {
          throw new Error('Invalid glossary cache');
        }
        onRules(rules);
      } catch {
        onRules([]);
      }
    }, () => onError());
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
