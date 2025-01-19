import {Pipe, PipeTransform} from '@angular/core';
import {INVALID_LETTER, Letter} from "./Letter";

@Pipe({
  name: 'decode',
  standalone: true,
  pure: false
})
export class DecodePipe implements PipeTransform {

  transform(messageKeys: number[], alphabet: Map<number, Letter>): { letter?: string, URL?: string }[] {
    const letterArray: (Letter | undefined)[] = messageKeys.map((value) => alphabet.get(value));
    return letterArray.map((letter: Letter | undefined) => {
      if (letter) {
        let result = {letter: ''} as { letter?: string, URL?: string };
        if (letter.imageURL) {result = {URL: letter.imageURL};}
        if (letter.romanLetter) {result = {...result, letter: letter.romanLetter};}
        return result;
      } else {
        return {letter: INVALID_LETTER.romanLetter};
      }
    });
  }

}
