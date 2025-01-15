import {Component, OnInit} from '@angular/core';
import {KeyValuePipe, NgForOf} from "@angular/common";
import {DecodePipe} from "./decode.pipe";
import {INVALID_LETTER, Letter, SPACE_LETTER} from "./Letter";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-code-note',
  standalone: true,
  imports: [
    NgForOf,
    DecodePipe,
    KeyValuePipe,
    FormsModule
  ],
  templateUrl: './code-note.component.html',
  styleUrl: './code-note.component.css'
})
export class CodeNoteComponent implements OnInit {
  alphabet: Map<number, Letter> = new Map<number, Letter>();
  messages: number[][] = [];

  ngOnInit(): void {
    let placeholderLetters = " 123456789アイウエオカキクケコサシスセソタチツテト";
    this.alphabet.set(0, SPACE_LETTER);
    this.alphabet.set(1, {id: 1, romanLetter: 's'});
    this.alphabet.set(2, {id: 2, romanLetter: 'e'});
    this.alphabet.set(3, {id: 3, romanLetter: 'v'});
    this.alphabet.set(4, {id: 4, romanLetter: 'r'});

    this.messages.push([1, 2, 3, 2, 4, 2, 0, 5, 6, 7, 7, 0, 8, 6, 9, 1, 0, 10, 11, 12]);
    this.messages.push([10, 11, 12, 0, 3, 2, 13, 14, 0, 13, 6, 11, 7, 2, 15, 14, 1, 0, 15, 3, 14, 0, 7, 2, 5, 6, 0, 11, 8, 0, 15, 6, 16, 14]);
  }

  updateLetter(letterKey: number, event: Event) {
    const inputElement: HTMLInputElement = event.target as HTMLInputElement;
    let newValue = inputElement.value;
    let oldLetter: (Letter | undefined) = this.alphabet.get(letterKey);
    if (oldLetter) {
      //replace old letter
      this.alphabet.set(letterKey, {...oldLetter, romanLetter: newValue});
      return;
    }
    //create new letter
    this.alphabet.set(letterKey, {id: letterKey, romanLetter: newValue} as Letter);
  }
}
