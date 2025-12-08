import {AfterViewInit, Component, inject, input, InputSignal, OnDestroy, OnInit} from '@angular/core';
import {Letter} from "../../code-note/Letter";
import {DIALOG_DATA} from "@angular/cdk/dialog";
import {NgClass} from "@angular/common";
import {DecodePipe} from "../../code-note/decode.pipe";
import {ModularOverlayRef} from "../modular-overlay-ref";
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-message-input',
  imports: [
    NgClass,
    DecodePipe
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent implements OnInit, OnDestroy {
  protected alphabet: Map<number, Letter> = inject(DIALOG_DATA);
  private dialogRef: ModularOverlayRef = inject(ModularOverlayRef);
  private subscription: Subscription;
  private layoutPattern: string[][] = [
    ['q','w','e','r','t','z','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['y','x','c','v','b','n','m'],
    [' ']
  ];
  layout: (Letter | undefined)[][] = [];
  message: number[] = [];

  constructor() {
    this.subscription = this.dialogRef.onClose.subscribe(() => {
      console.log('dialog closed');
      this.dialogRef.emit(this.message);
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  emit(): void {
    this.dialogRef.emit(this.message);
    this.message = [];
  }

  ngOnInit(): void {
    this.layoutPattern.forEach((value, index) => {
      let result = value.map(this.getLetter);
      this.layout.push(result);
    });
    // const allLayoutLetters = this.layoutPattern.flat();
  }

  private getLetter = (layoutKey: string): Letter | undefined => {
    for (let [key, value] of this.alphabet.entries()) {
      if (value.romanLetter === layoutKey) {
        return this.alphabet.get(key)!;
      }
    }
    return undefined;
  };

  protected addLetterToMessage(letter: Letter | undefined) {
    if (!letter) {
      return;
    }
    this.message.push(letter.id); //TODO make sure that the map is handled differently
    //currently this causes an issue when map number, Letter has a mismatch between letter id and index
  }
}
