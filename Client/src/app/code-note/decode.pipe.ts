import {Pipe, PipeTransform} from '@angular/core';
import {INVALID_LETTER, Letter} from "./Letter";

@Pipe({
  name: 'decode',
  standalone: true,
  pure: false
})
export class DecodePipe implements PipeTransform {

  transform(messageKeys: number[], alphabet: Map<number, Letter>): string {
    const letterArray: (Letter | undefined)[] = messageKeys.map((value) => alphabet.get(value));
    return letterArray.map((value: Letter | undefined) => value ? value.romanLetter : INVALID_LETTER.romanLetter).join('');
  }

}
