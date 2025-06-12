# AeonGlossary

This is just a very simple webapp that lets you search through the rules and keywords of Aeon Trespass Odyssey. 
The rules texts are taken from [This very helpful document](https://docs.google.com/document/d/1u3q2ngOWhVvixLbz3PiR-4HG0A1OpcAzCM-9cveigu4/edit?usp=sharing) someone has written up for the game.

I am currently working on a chatbot powered by OpenAI with the ability to answer rules questions. Maybe it's useful, maybe it isn't.
It's very much a work in Progress at the moment.

## Features

- [x] A searchable list of definitions and keywords
- [x] Include all keywords
- [ ] Include the rest of the rules
- [ ] Make cards load dynamically instead of all at once
- [ ] add filters for cycles and other categories
- [ ] dynamically link references to other rules
- [ ] add an icon glossary
- [ ] add interactive AI powered chatbot

## Build
Run  ng build --configuration production --base-href https://Christian-Wieser.github.io/aeon-glossary/ to build the project. The build artifacts will be stored in the docs/ directory which will then be automatically deployed to github-pages.

Or use `ng deploy` to deploy
