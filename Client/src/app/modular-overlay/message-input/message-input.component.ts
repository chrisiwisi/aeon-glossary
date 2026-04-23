import {Component, Inject, inject, OnDestroy, OnInit} from '@angular/core';
import {Letter} from "../../code-note/letter/Letter";
import {NgClass} from "@angular/common";
import {ModularOverlayRef} from "../modular-overlay-ref";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {MESSAGE_INPUT_DATA} from "../modular-overlay.tokens";
import {MessageComponent} from "../../code-note/message/message.component";

@Component({
  selector: 'app-message-input',
  imports: [
    NgClass,
    NzButtonComponent,
    NzIconDirective,
    MessageComponent
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent implements OnInit, OnDestroy {
  protected alphabet: Letter[] = [];
  message: number[] = [];
  private dialogRef: ModularOverlayRef = inject(ModularOverlayRef);
  private layoutPattern: string[][] = [
    ['q','w','e','r','t','z','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['y','x','c','v','b','n','m'],
    [' ']
  ];
  layout: (Letter | undefined)[][] = [];

  constructor(@Inject(MESSAGE_INPUT_DATA) data: { alphabet: Letter[]; message: number[] }) {
    this.alphabet = data.alphabet;
    this.message = data.message ?? [];
  }

  ngOnDestroy() {
    this.emit();
  }

  emit(): void {
    this.dialogRef.emit(this.message);
    this.message = [];
  }

  ngOnInit(): void {
    this.layoutPattern.forEach((value) => {
      let result = value.map(this.getLetter);
      this.layout.push(result);
    });

    this.addAllUnusedLettersToLayout();
  }

  private getLetter = (layoutKey: string): Letter | undefined => {
    for (let letter of this.alphabet) {
      if (letter.romanLetter === layoutKey) {
        return letter;
      }
    }
    return undefined;
  };

  private addAllUnusedLettersToLayout(): void {
    // TODO refactor this ai slop
    const usedLetters = new Set<string>();
    this.layout.forEach(row => {
      row.forEach(letter => {
        if (letter) {
          usedLetters.add(letter.romanLetter);
        }
      });
    });

    // Find letters that are not in the layout
    const remainingLetters: Letter[] = [];
    for (let letter of this.alphabet.values()) {
      if (!usedLetters.has(letter.romanLetter)) {
        remainingLetters.push(letter);
      }
    }

    // Append remaining letters as a new row if any
    if (remainingLetters.length > 0) {
      this.layout.push(remainingLetters);
    }
  }


  protected addLetterToMessage(letter: Letter | undefined) {
    if (!letter) {
      return;
    }
    this.message.push(letter.id); //TODO make sure that the map is handled differently
    //currently this causes an issue when map number, Letter has a mismatch between letter id and index
  }

  protected removeLastLetter() {
    this.message.pop();
  }
}
