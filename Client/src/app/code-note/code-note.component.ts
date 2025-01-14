import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {DecodePipe} from "./decode.pipe";
import {Letter} from "./Letter";

interface Alphabet {
  [id: number]: Letter
}

@Component({
  selector: 'app-code-note',
  standalone: true,
  imports: [
    NgForOf,
    DecodePipe
  ],
  templateUrl: './code-note.component.html',
  styleUrl: './code-note.component.css'
})
export class CodeNoteComponent implements OnInit {
  alphabet: Alphabet = {};
  messages: Letter[][] = [];

  ngOnInit(): void {
    let placeholderLetters = " 123456789アイウエオカキクケコサシスセソタチツテト";
    for (let i = 0; i < 17; i++) {
      this.alphabet[i] = { id: i, romanLetter: placeholderLetters[i] };
    }

    this.alphabet[1].romanLetter = 's';
    this.alphabet[2].romanLetter = 'e';
    this.alphabet[3].romanLetter = 'v';
    this.alphabet[4].romanLetter = 'r';

    this.messages.push([1,2,3,2,4,2,0,5,6,7,7,0,8,6,9,1,0,10,11,12].map((value) => this.alphabet[value]));
    this.messages.push([10,11,12,0,3,2,13,14,0,13,6,11,7,2,15,14,1,0,15,3,14,0,7,2,5,6,0,11,8,0,15,6,16,14].map((value) => this.alphabet[value]));
  }
}
