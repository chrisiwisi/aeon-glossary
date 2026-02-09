import {Component, inject, OnInit} from '@angular/core';
import {KeyValuePipe} from "@angular/common";
import {DecodePipe} from "./decode.pipe";
import {Letter, SPACE_LETTER} from "./letter/Letter";
import {FormsModule} from "@angular/forms";
import {ModularOverlayService} from "../modular-overlay/modular-overlay.service";
import {LetterComponent} from "./letter/letter.component";
import {NzButtonComponent} from "ng-zorro-antd/button";

@Component({
  selector: 'app-code-note',
  imports: [
    DecodePipe,
    KeyValuePipe,
    FormsModule,
    LetterComponent,
    NzButtonComponent,
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

  // openLetterModular(letterID: number) {
  //   const letter = this.alphabet.get(letterID);
  //   if (letter) {
  //     this.modularOverlayService.openLetterCanvas(letter);
  //   }
  // }

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
