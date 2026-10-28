# Technology cache

`syncTechnologyCardsDaily` fetches `https://atcc-api.onrender.com/api/cards/all`
every day at 03:00 Europe/Vienna time. It keeps only `Technology` cards and
writes them to Realtime Database at `technologyCache`. The page reads that
cache.

## Local development

From `Client`:

Use Node.js 22.12 or newer within the configured Node.js 22 runtime and run
`npm --prefix functions install` after pulling dependency changes. The functions
pin `jose` for `jwks-rsa` to its CommonJS-compatible v5 release because the
standalone Firebase CLI can load functions without support for requiring ESM.

1. Run `npm run emulators` (Database, Functions, Pub/Sub, and UI).
2. In a second terminal run `FIREBASE_DATABASE_EMULATOR_HOST=127.0.0.1:9000 npm run sync:technology:emulator` to fill an empty local cache.

## Production

Deploy the database rules and function with `npx firebase deploy --only database,functions`
from `Client`.
The scheduled job is created on deployment. Run that job once to populate a
new production cache before its first 03:00 execution.

# Glossary cache

The glossary page starts with bundled rules and reads live updates from Realtime
Database at `glossaryCache`. Missing or invalid cache data and read failures show
a warning without clearing the available rules.

From `Client`:

1. Run `npm run emulators`.
2. Run `FIREBASE_DATABASE_EMULATOR_HOST=127.0.0.1:9000 npm run sync:glossary:emulator`.

To seed production explicitly run `npm run sync:glossary:prod`.

## Law of ATO source (not yet connected to the cache)

The separate Python `glossary` codebase downloads and converts the current Law
of ATO. See the [Python setup and preview instructions](../RulesTableConverter/README.md).
The existing sync commands still upload the bundled rules. Set up the Python
virtual environment before starting the Functions emulator for both codebases.
