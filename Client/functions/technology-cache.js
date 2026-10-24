const SOURCE_URL = 'https://atcc-api.onrender.com/api/cards/all';
const CACHE_PATH = 'technologyCache';
const MIN_TECHNOLOGY_CARDS = 300;

function isInvalidTechnologyCard(card) {
  return typeof card.refID !== 'string' || !card.refID ||
    typeof card.name !== 'string' || !card.name ||
    !Array.isArray(card.requirements) || !Array.isArray(card.leadsTo);
}

async function fetchTechnologyCards(fetchImpl = fetch, minimumCardCount = MIN_TECHNOLOGY_CARDS) {
  const response = await fetchImpl(SOURCE_URL, {
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) {
    throw new Error(`Card API returned HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload?.cards)) {
    throw new Error('Card API response has no cards array');
  }

  const cards = payload.cards.filter(card => card?.renderType === 'Technology');
  if (cards.length < minimumCardCount || cards.some(isInvalidTechnologyCard)) {
    throw new Error('Card API returned invalid technology cards');
  }
  if (new Set(cards.map(card => card.refID)).size !== cards.length) {
    throw new Error('Card API returned duplicate technology IDs');
  }
  return cards;
}

async function updateTechnologyCache({cacheRef, fetchImpl = fetch, now = () => new Date(), minimumCardCount = MIN_TECHNOLOGY_CARDS}) {
  const cards = await fetchTechnologyCards(fetchImpl, minimumCardCount);
  const updatedAt = now().toISOString();
  await cacheRef.set({
    cardsJson: JSON.stringify(cards),
    cardCount: cards.length,
    updatedAt,
    sourceUrl: SOURCE_URL,
  });
  return {cardCount: cards.length, updatedAt};
}

module.exports = {CACHE_PATH, SOURCE_URL, MIN_TECHNOLOGY_CARDS, fetchTechnologyCards, updateTechnologyCache};
