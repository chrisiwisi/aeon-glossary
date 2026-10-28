import {inject, Injectable} from '@angular/core';
import {Database, onValue, ref} from '@angular/fire/database';
import {Rule} from '../rules-card/Rule';

export function parseGlossaryCache(value: string | null): Rule[] {
  const rules = JSON.parse(value ?? 'null');
  if (!Array.isArray(rules) || !rules.length || rules.some(rule => !isRule(rule)) ||
    new Set(rules.map(rule => rule.id)).size !== rules.length) {
    throw new Error('Glossary cache is missing, empty, or invalid.');
  }
  return rules;
}

function isRule(candidate: unknown): candidate is Rule {
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
        rules = parseGlossaryCache(snapshot.val());
      } catch (error) {
        onError(error instanceof Error ? error : new Error('Invalid glossary cache.'));
        return;
      }
      onRules(rules);
    }, error => onError(error));
  }
}
