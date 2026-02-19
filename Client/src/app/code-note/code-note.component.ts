import {Component, inject, OnInit} from '@angular/core';
import {Letter} from "./letter/Letter";
import {FormsModule} from "@angular/forms";
import {ModularOverlayService} from "../modular-overlay/modular-overlay.service";
import {LetterComponent} from "./letter/letter.component";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {CdkScrollable} from "@angular/cdk/overlay";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {MessageComponent} from "./message/message.component";

@Component({
  selector: 'app-code-note',
  imports: [
    FormsModule,
    LetterComponent,
    NzButtonComponent,
    CdkScrollable,
    CdkDropList,
    CdkDrag,
    MessageComponent,
  ],
  templateUrl: './code-note.component.html',
  standalone: true,
  styleUrl: './code-note.component.css'
})
export class CodeNoteComponent implements OnInit {
  private modularOverlayService: ModularOverlayService = inject(ModularOverlayService);

  alphabet: Letter[] = [];
  messages: number[][] = [];

  ngOnInit(): void {
    this.reloadFromLocalStorage();
  }

  addLetter() {
    const newId = this.alphabet.reduce((largest, current) => current.id > largest ? current.id : largest, 0);
    this.alphabet.push({ id: newId + 1, romanLetter: ''} as Letter);
    console.log(this.alphabet);
  }

  protected openMessageModular(message: number[] = []) {
    this.modularOverlayService.openMessageInput(this.alphabet, message).sendData.subscribe(result => {
      console.log(result);
      if (result) {
        console.log(result)
        this.messages.push(result);
      }
    });
  }

  saveCurrentProgress() {
    localStorage.setItem('messages', JSON.stringify(this.messages));
    localStorage.setItem('alphabet', JSON.stringify(this.alphabet));
  }

  reloadFromLocalStorage(): void {
    let storedAlphabet: string | null = localStorage.getItem('alphabet');
    let storedMessages: string | null = localStorage.getItem('messages');

    if (storedAlphabet) {
      this.alphabet = JSON.parse(storedAlphabet);
    }

    if (storedMessages) {
      this.messages = JSON.parse(storedMessages);
    }
  }

  reset() {
    this.alphabet = [];
    this.messages = [];
  }

  protected deleteMessage(messageIndex: number) {
    this.messages.splice(messageIndex, 1);
  }

  protected drop(event: CdkDragDrop<Letter[]>) {
    moveItemInArray(this.alphabet, event.previousIndex, event.currentIndex);
  }

  protected deleteLetter(event: Letter) {
    const index = this.alphabet.findIndex(l => l.id === event.id);
    if (index < 0) {
      return;
    }
    this.alphabet.splice(index, 1);
  }
}
