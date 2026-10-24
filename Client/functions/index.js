const {onSchedule} = require('firebase-functions/v2/scheduler');
const {logger} = require('firebase-functions');
const {initializeApp} = require('firebase-admin/app');
const {getDatabase} = require('firebase-admin/database');
const {CACHE_PATH, updateTechnologyCache} = require('./technology-cache');

initializeApp({
  projectId: 'aeon-glossary-cb44f',
  databaseURL: 'https://aeon-glossary-cb44f-default-rtdb.europe-west1.firebasedatabase.app',
});

exports.syncTechnologyCardsDaily = onSchedule({
  schedule: '0 3 * * *',
  timeZone: 'Europe/Vienna',
  region: 'europe-west1',
  timeoutSeconds: 180,
}, async () => {
  const result = await updateTechnologyCache({cacheRef: getDatabase().ref(CACHE_PATH)});
  logger.info(`Cached ${result.cardCount} technology cards at ${result.updatedAt}`);
});
