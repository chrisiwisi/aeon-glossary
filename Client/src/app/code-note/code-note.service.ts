import {inject, Injectable, signal} from '@angular/core';
import {Letter} from './letter/Letter';
import {CodeNoteStorageStrategy} from './storage/code-note-storage.strategy';

@Injectable()
export class CodeNoteService {
  private storage = inject(CodeNoteStorageStrategy);

  readonly alphabet = signal<Letter[]>([]);
  readonly messages = signal<number[][]>([]);

  async load(): Promise<void> {
    const data = await this.storage.load();
    this.alphabet.set(data.alphabet);
    this.messages.set(data.messages);
  }

  async save(): Promise<void> {
    await this.storage.save({
      alphabet: this.alphabet(),
      messages: this.messages(),
    });
  }

  addLetter(): void {
    const current = this.alphabet();
    const newId = current.reduce((max, l) => (l.id > max ? l.id : max), 0) + 1;
    this.alphabet.set([...current, {id: newId, romanLetter: '', order: null}]);
  }

  deleteLetter(letter: Letter): void {
    this.alphabet.update(list => list.filter(l => l.id !== letter.id));
  }

  moveLetters(previousIndex: number, currentIndex: number): void {
    const list = [...this.alphabet()];
    const [removed] = list.splice(previousIndex, 1);
    list.splice(currentIndex, 0, removed);
    this.alphabet.set(list);
  }

  addMessage(message: number[]): void {
    this.messages.update(list => [...list, message]);
  }

  updateMessage(index: number, message: number[]): void {
    this.messages.update(list => list.map((existing, i) => (i === index ? message : existing)));
  }

  deleteMessage(index: number): void {
    this.messages.update(list => list.filter((_, i) => i !== index));
  }

  reset(): void {
    this.alphabet.set([]);
    this.messages.set([]);
  }
}
