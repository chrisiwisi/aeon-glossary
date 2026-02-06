import {Component, inject, OnInit} from '@angular/core';
import {KeyValuePipe} from "@angular/common";
import {DecodePipe} from "./decode.pipe";
import {Letter, SPACE_LETTER} from "./Letter";
import {FormsModule} from "@angular/forms";
import {ModularOverlayService} from "../modular-overlay/modular-overlay.service";

@Component({
  selector: 'app-code-note',
  imports: [
    DecodePipe,
    KeyValuePipe,
    FormsModule,
  ],
  templateUrl: './code-note.component.html',
  standalone: true,
  styleUrl: './code-note.component.css'
})
export class CodeNoteComponent implements OnInit {
  private modularOverlayService: ModularOverlayService = inject(ModularOverlayService);

  alphabet: Map<number, Letter> = new Map<number, Letter>();
  messages: number[][] = [];

  ngOnInit(): void {
    this.reloadFromLocalStorage();
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

  addLetter() {
    this.alphabet.set(this.alphabet.size, { id: this.alphabet.size, romanLetter: ''} as Letter);
  }

  openLetterModular(letterID: number) {
    const letter = this.alphabet.get(letterID);
    if (letter) {
      this.modularOverlayService.openLetterCanvas(letter);
    }
  }

  protected openMessageModular() {
    this.modularOverlayService.openMessageInput(this.alphabet).sendData.subscribe(result => {
      console.log(result);
      if (result) {
        console.log(result)
        this.messages.push(result);
      }
    });
  }

  saveCurrentProgress() {
    localStorage.setItem('messages', JSON.stringify(this.messages));
    localStorage.setItem('alphabet', JSON.stringify(Array.from(this.alphabet.entries())));
  }

  reloadFromLocalStorage(): void {
    let storedAlphabet: string | null = localStorage.getItem('alphabet');
    let storedMessages: string | null = localStorage.getItem('messages');

    if (storedAlphabet) {
      this.alphabet = new Map(JSON.parse(storedAlphabet));
    } else {
      this.alphabet.set(0, SPACE_LETTER);
      for (let i = 1; i < 18; i++) {
        this.alphabet.set(i, {id: i, romanLetter: ''});
      }
    }

    if (storedMessages) {
      this.messages = JSON.parse(storedMessages);
    } else {
      this.messages.push([1, 2, 3, 2, 4, 2, 0, 5, 6, 7, 7, 0, 8, 6, 9, 1, 0, 10, 11, 12]);
      this.messages.push([10, 11, 12, 0, 3, 2, 13, 14, 0, 13, 6, 11, 7, 2, 15, 14, 1, 0, 15, 3, 14, 0, 7, 2, 5, 17, 0, 11, 8, 0, 15, 6, 16, 14]);
    }
  }

  reset() {
    this.alphabet.clear();
    this.messages = [];
  }

  protected deleteMessage(messageIndex: number) {
    this.messages.splice(messageIndex, 1);
  }
}
