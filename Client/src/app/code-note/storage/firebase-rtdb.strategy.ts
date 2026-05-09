import {inject, Injectable} from '@angular/core';
import {Database, DataSnapshot, onValue, ref, set} from '@angular/fire/database';
import {WritableSignal} from '@angular/core';
import {CodeNoteData, CodeNoteStorageStrategy} from './code-note-storage.strategy';
import {Letter} from '../letter/Letter';

@Injectable()
export class FirebaseRtdbStrategy extends CodeNoteStorageStrategy {
  private db = inject(Database);

  connect(
    path: string,
    alphabet: WritableSignal<Letter[]>,
    messages: WritableSignal<number[][]>
  ): () => void {
    return onValue(ref(this.db, path), snapshot => {
      const data = this.toCodeNoteData(snapshot);
      alphabet.set(data.alphabet);
      messages.set(data.messages);
    });
  }

  async save(path: string, data: CodeNoteData): Promise<void> {
    await set(ref(this.db, path), {
      alphabet: data.alphabet,
      messages: data.messages,
    });
  }

  private toCodeNoteData(snapshot: DataSnapshot): CodeNoteData {
    if (!snapshot.exists()) {
      return {alphabet: [], messages: []};
    }

    const value = snapshot.val();
    return {
      alphabet: value.alphabet ? this.toArray(value.alphabet) : [],
      messages: value.messages ? this.toArray(value.messages) : [],
    };
  }

  /** Safely converts a Firebase value to an ordered array regardless of whether
   *  Firebase returned a plain JS array or a sparse object with numeric keys. */
  private toArray<T>(value: T[] | Record<string, T>): T[] {
    if (Array.isArray(value)) {
      return value;
    }
    return Object.keys(value)
      .sort((a, b) => Number(a) - Number(b))
      .map(k => (value as Record<string, T>)[k]);
  }
}
