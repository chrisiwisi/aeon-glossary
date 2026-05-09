import { Injectable } from '@angular/core';

const LOBBY_ADJECTIVES = [
  'archaic', 'relentless', 'growing', 'cursed', 'cretan', 'delving', 'dreamy', 'elysian',
  'heraclean', 'heroic', 'homeric', 'ancient', 'forlorn', 'minoan', 'golden', 'olympian',
  'odyssean', 'orphaned', 'maddening', 'persean', 'pious', 'sacred', 'spartan', 'stoic',
  'forgotten', 'titanic', 'bleeding', 'trojan', 'indebted', 'old', 'trespassed', 'towering',
  'primordial', 'immortal', 'doomed', 'greek', 'merciless', 'sinful', 'haunted', 'abandoned',
  'abyssal', 'labyrinthine', 'mysterious', 'desperate', 'fated', 'dangerous', 'exhausted',
  'fractured', 'isolated'
];

const LOBBY_NOUNS = [
  'achilles', 'aegis', 'apollo', 'argo', 'athena', 'atlas', 'daedalus', 'delphi',
  'elysium', 'hermes', 'harpy', 'herakles', 'hydra', 'ithaca', 'labyrinth', 'medusa',
  'midas', 'minos', 'odyssey', 'olympus', 'pegasus', 'perseus', 'sun', 'sparta',
  'styx', 'cyclops', 'nietschean', 'crete', 'ship', 'adversary', 'priest', 'horse',
  'titan', 'voyage', 'triskelion', 'muse', 'nymph', 'helios', 'trespass', 'ambrosia',
  'tower', 'hekaton', 'satyr', 'debt'
];

@Injectable({
  providedIn: 'root',
})
export class NameGeneratorService {
  /** Generate a unique-ish lobby code in the form "adj-noun-NNNN". */
  generateLobbyCode(): string {
    const adj = LOBBY_ADJECTIVES[Math.floor(Math.random() * LOBBY_ADJECTIVES.length)];
    const noun = LOBBY_NOUNS[Math.floor(Math.random() * LOBBY_NOUNS.length)];
    const num = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    return `${adj}-${noun}-${num}`;
  }
}
