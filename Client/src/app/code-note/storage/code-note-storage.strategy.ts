import {WritableSignal} from '@angular/core';
import {Letter} from "../letter/Letter";


export interface CodeNoteData {
  alphabet: Letter[];
  messages: number[][];
}

export type DisconnectFn = () => void;

export abstract class CodeNoteStorageStrategy {
  /** Load data and write into provided signals */
  abstract connect(
    path: string,
    alphabet: WritableSignal<Letter[]>,
    messages: WritableSignal<number[][]>
  ): DisconnectFn;

  abstract save(path: string, data: CodeNoteData): Promise<void>;
}
