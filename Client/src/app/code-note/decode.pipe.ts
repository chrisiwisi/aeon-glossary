import { Pipe, PipeTransform } from '@angular/core';
import {Letter} from "./Letter";

@Pipe({
  name: 'decode',
  standalone: true
})
export class DecodePipe implements PipeTransform {

  transform(value: Letter[]): string {
    return value.map((value) => value.romanLetter? value.romanLetter : value.id).join('');
  }

}
