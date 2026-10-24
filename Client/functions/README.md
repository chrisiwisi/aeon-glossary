# Technology cache

`syncTechnologyCardsDaily` fetches `https://atcc-api.onrender.com/api/cards/all`
every day at 03:00 Europe/Vienna time. It keeps only `Technology` cards and
writes them to Realtime Database at `technologyCache`. The page reads that
cache.

## Local development

From `Client`:

1. Run `npm run emulators` (Database, Functions, Pub/Sub, and UI).
2. In a second terminal run `FIREBASE_DATABASE_EMULATOR_HOST=127.0.0.1:9000 npm run sync:technology:emulator` to fill an empty local cache.

## Production

Deploy the database rules and function with `npx firebase deploy --only database,functions`
from `Client`.
The scheduled job is created on deployment. Run that job once to populate a
new production cache before its first 03:00 execution.

# Glossary cache

The glossary page reads rules from Realtime Database at `glossaryCache`.

From `Client`:

1. Run `npm run emulators`.
2. Run `npm run sync:technology:emulator`.

To seed production explicitly run `npm run sync:glossary:prod`.
