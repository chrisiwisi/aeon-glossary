# AeonGlossary

This is just my personal companion web-app for the game Aeon Trespass: Odyssey. It contains a glossary of keywords and other rules directly adapted from from [This very helpful document](https://docs.google.com/document/d/1u3q2ngOWhVvixLbz3PiR-4HG0A1OpcAzCM-9cveigu4/edit?usp=sharing) someone has written up for the game. 

It also contains the Technology Atlas, a shared session live tech tree that can be used to visualize researched and available projects on desktop or on mobile to quickly see which projects are available to research. All of that snced between your playgroups phones and other devices.

There is also the code note component that can be used to help take notes while decoding any substitution cyphers. This is the least refined part of the app and won't really work on mobile, but it helped us a lot with the Cycle 4 babelian language since this is a big part of the cycle.

## Firebase Hosting

From the `Client` directory, run `npm ci` and then `npm run deploy`.
The result will be doployed under: `https://aeon-glossary-cb44f.web.app/` (I wanna get rid of that -cb44f in the future)

# common issues

Production uses the hosted Firebase database; development builds connect to the local database emulator on port 9000.
Do not upload development builds to HTTPS hosting, since the emulator's HTTP
connections will be blocked as mixed content.

The build copies `public/manifest.webmanifest` and `public/icons/` to the hosting
root. Without these files, the single-page-app rewrite returns HTML instead of
the manifest, causing a manifest JSON syntax error.
