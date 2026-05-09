import {Injectable, WritableSignal} from '@angular/core';
import {CodeNoteData, CodeNoteStorageStrategy} from './code-note-storage.strategy';
import {Letter} from '../letter/Letter';


@Injectable()
export class LocalStorageStrategy extends CodeNoteStorageStrategy {
  connect(
    path: string,
    alphabet: WritableSignal<Letter[]>,
    messages: WritableSignal<number[][]>
  ): () => void {
    const rawAlphabet = localStorage.getItem(`${path}/alphabet`);
    const rawMessages = localStorage.getItem(`${path}/messages`);
    alphabet.set(rawAlphabet ? JSON.parse(rawAlphabet) : []);
    messages.set(rawMessages ? JSON.parse(rawMessages) : []);
    return () => undefined;
  }

  save(path: string, data: CodeNoteData): Promise<void> {
    localStorage.setItem(`${path}/alphabet`, JSON.stringify(data.alphabet));
    localStorage.setItem(`${path}/messages`, JSON.stringify(data.messages));
    return Promise.resolve();
  }
}
