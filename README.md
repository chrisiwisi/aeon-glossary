# AeonGlossary

This is just a very simple webapp that lets you search through the rules and keywords of Aeon Trespass Odyssey. 
The rules texts are taken from [This very helpful document](https://docs.google.com/document/d/1u3q2ngOWhVvixLbz3PiR-4HG0A1OpcAzCM-9cveigu4/edit?usp=sharing) someone has written up for the game.

## Features

- [x] A searchable list of definitions and keywords
- [ ] Include all keywords
- [ ] Include the rest of the rules
- [ ] Make cards load dynamically instead of all at once
- [ ] add filters for cycles and other categories
- [ ] dynamically link references to other rules
- [ ] add an icon glossary

## Build
Run  ng build --configuration production --base-href https://todlicherteddy.github.io/aeon-glossary/ to build the project. The build artifacts will be stored in the docs/ directory which will then be automatically deployed to github-pages.

Or use `ng deploy` to deploy
