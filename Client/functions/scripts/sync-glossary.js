const {initializeApp} = require('firebase-admin/app');
const {getDatabase} = require('firebase-admin/database');
const {CACHE_PATH, updateGlossaryCache} = require('../glossary-cache');

const isEmulator = !!process.env.FIREBASE_DATABASE_EMULATOR_HOST;

if (!isEmulator && process.env.ALLOW_PROD_SYNC !== 'true') {
  console.error('Refusing to write to the live database without ALLOW_PROD_SYNC=true.');
  process.exit(1);
}

initializeApp({
  projectId: 'aeon-glossary-cb44f',
  databaseURL: 'https://aeon-glossary-cb44f-default-rtdb.europe-west1.firebasedatabase.app',
});

updateGlossaryCache({cacheRef: getDatabase().ref(CACHE_PATH)})
  .then(result => {
    const target = isEmulator ? 'emulator' : 'production';
    console.log(`Cached ${result.ruleCount} rules to ${target} at ${result.updatedAt}`);
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

