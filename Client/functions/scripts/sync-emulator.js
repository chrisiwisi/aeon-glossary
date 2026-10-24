const {initializeApp} = require('firebase-admin/app');
const {getDatabase} = require('firebase-admin/database');
const {CACHE_PATH, updateTechnologyCache} = require('../technology-cache');

if (!process.env.FIREBASE_DATABASE_EMULATOR_HOST) {
  console.error('Set FIREBASE_DATABASE_EMULATOR_HOST before seeding the emulator.');
  process.exit(1);
}

initializeApp({
  projectId: 'aeon-glossary-cb44f',
  databaseURL: 'https://aeon-glossary-cb44f-default-rtdb.europe-west1.firebasedatabase.app',
});

updateTechnologyCache({cacheRef: getDatabase().ref(CACHE_PATH)})
  .then(result => {
    console.log(`Cached ${result.cardCount} technology cards at ${result.updatedAt}`);
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
