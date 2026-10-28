import {parseGlossaryCache} from './glossary-cache.service';

describe('parseGlossaryCache', () => {
  const rule = {id: 'chapter.1', name: 'First', rule: 'Rule text', keywords: ['chapter']};

  it('accepts valid rules with unique IDs', () => {
    const rules = [rule, {...rule, id: 'chapter.2'}];

    expect(parseGlossaryCache(JSON.stringify(rules))).toEqual(rules);
  });

  it('rejects duplicate IDs before search indexing', () => {
    const rules = [rule, {...rule, name: 'Second'}];

    expect(() => parseGlossaryCache(JSON.stringify(rules))).toThrowError('Glossary cache is missing, empty, or invalid.');
  });

  it('rejects missing and malformed caches', () => {
    for (const value of [null, '[]', JSON.stringify([{...rule, keywords: null}]), '{']) {
      expect(() => parseGlossaryCache(value)).toThrow();
    }
  });
});
