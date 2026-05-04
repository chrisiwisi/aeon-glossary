import {Letter} from './letter/Letter';

export interface CodeNoteData {
  alphabet: Letter[];
  messages: number[][];
}

export abstract class CodeNoteStorageStrategy {
  abstract load(): Promise<CodeNoteData>;
  abstract save(data: CodeNoteData): Promise<void>;
}

