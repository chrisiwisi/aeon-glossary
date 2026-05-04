import {inject, Injectable} from '@angular/core';
import {Database, get, ref, set} from '@angular/fire/database';
import {CodeNoteData, CodeNoteStorageStrategy} from './code-note-storage.strategy';

const DB_PATH = 'code-note';

@Injectable()
export class FirebaseRtdbStrategy extends CodeNoteStorageStrategy {
  private db = inject(Database);

  async load(): Promise<CodeNoteData> {
    const snapshot = await get(ref(this.db, DB_PATH));

    if (!snapshot.exists()) {
      return {alphabet: [], messages: []};
    }

    const value = snapshot.val();
    return {
      alphabet: value.alphabet ? this.toArray(value.alphabet) : [],
      messages: value.messages ? this.toArray(value.messages) : [],
    };
  }

  async save(data: CodeNoteData): Promise<void> {
    await set(ref(this.db, DB_PATH), {
      alphabet: data.alphabet,
      messages: data.messages,
    });
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

