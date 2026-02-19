import {InjectionToken} from "@angular/core";
import {Letter} from "../code-note/letter/Letter";

export const FILE_PREVIEW_DIALOG_DATA = new InjectionToken<string>('FILE_PREVIEW_DIALOG_DATA');
export const LETTER_DATA = new InjectionToken<Letter>('LETTER_DATA');
export const MESSAGE_INPUT_DATA = new InjectionToken<{ alphabet: Letter[]; message?: number[] }>('MESSAGE_INPUT_DATA');
