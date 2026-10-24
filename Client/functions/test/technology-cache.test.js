const test = require('node:test');
const assert = require('node:assert/strict');
const {updateTechnologyCache} = require('../technology-cache');

const technology = {
  refID: 'o.1.structural.1',
  name: 'Last Tome',
  renderType: 'Technology',
  requirements: ['—'],
  leadsTo: ['Rhetoric'],
  errata: {'v1.1': 'Updated text'},
};

function response(cards, ok = true) {
  return {ok, status: ok ? 200 : 503, json: async () => ({cards})};
}

test('caches technology cards with their full text and update time', async () => {
  let saved;
  const result = await updateTechnologyCache({
    cacheRef: {set: async value => { saved = value; }},
    fetchImpl: async () => response([technology, {renderType: 'Gear'}]),
    now: () => new Date('2026-10-24T03:00:00.000Z'),
    minimumCardCount: 1,
  });
  assert.equal(result.cardCount, 1);
  assert.deepEqual(JSON.parse(saved.cardsJson), [technology]);
  assert.equal(saved.updatedAt, '2026-10-24T03:00:00.000Z');
});

test('an API failure leaves the previous cache untouched', async () => {
  let writes = 0;
  await assert.rejects(updateTechnologyCache({
    cacheRef: {set: async () => { writes++; }},
    fetchImpl: async () => response([], false),
  }), /HTTP 503/);
  assert.equal(writes, 0);
});

test('invalid and duplicate responses do not replace the cache', async () => {
  let writes = 0;
  const cacheRef = {set: async () => { writes++; }};
  await assert.rejects(updateTechnologyCache({
    cacheRef,
    fetchImpl: async () => response([{...technology, leadsTo: null}]),
    minimumCardCount: 1,
  }), /invalid technology/);
  await assert.rejects(updateTechnologyCache({
    cacheRef,
    fetchImpl: async () => response([technology, technology]),
    minimumCardCount: 1,
  }), /duplicate technology/);
  assert.equal(writes, 0);
});

test('a partial catalog does not replace the cache', async () => {
  let writes = 0;
  await assert.rejects(updateTechnologyCache({
    cacheRef: {set: async () => { writes++; }},
    fetchImpl: async () => response([technology]),
  }), /invalid technology/);
  assert.equal(writes, 0);
});
