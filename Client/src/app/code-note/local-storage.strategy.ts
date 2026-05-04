import {Injectable} from '@angular/core';
import {CodeNoteData, CodeNoteStorageStrategy} from './code-note-storage.strategy';

const ALPHABET_KEY = 'alphabet';
const MESSAGES_KEY = 'messages';

@Injectable()
export class LocalStorageStrategy extends CodeNoteStorageStrategy {
  load(): Promise<CodeNoteData> {
    const rawAlphabet = localStorage.getItem(ALPHABET_KEY);
    const rawMessages = localStorage.getItem(MESSAGES_KEY);

    return Promise.resolve({
      alphabet: rawAlphabet ? JSON.parse(rawAlphabet) : [],
      messages: rawMessages ? JSON.parse(rawMessages) : [],
    });
  }

  save(data: CodeNoteData): Promise<void> {
    localStorage.setItem(ALPHABET_KEY, JSON.stringify(data.alphabet));
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(data.messages));
    return Promise.resolve();
  }
}

