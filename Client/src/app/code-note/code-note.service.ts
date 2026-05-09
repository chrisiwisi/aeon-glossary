import {inject, Injectable, OnDestroy, signal} from '@angular/core';
import {Letter} from './letter/Letter';
import {CodeNoteData, CodeNoteStorageStrategy, DisconnectFn} from './storage/code-note-storage.strategy';

@Injectable()
export class CodeNoteService implements OnDestroy {
  private storage = inject(CodeNoteStorageStrategy);
  private disconnect: DisconnectFn = () => undefined;
  private activePath = '';

  readonly alphabet = signal<Letter[]>([]);
  readonly messages = signal<number[][]>([]);

  connect(path: string): void {
    this.disconnect();
    this.activePath = path;
    this.disconnect = this.storage.connect(path, this.alphabet, this.messages);
  }

  async save(): Promise<void> {
    await this.storage.save(this.activePath, {
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

  backup(lobbyCode: string): void {
    const data: CodeNoteData = {alphabet: this.alphabet(), messages: this.messages()};
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lobbyCode}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  restore(data: CodeNoteData): void {
    this.alphabet.set(data.alphabet ?? []);
    this.messages.set(data.messages ?? []);
    void this.save();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
