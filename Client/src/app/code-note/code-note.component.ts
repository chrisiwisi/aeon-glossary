import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ModularOverlayService} from "../modular-overlay/modular-overlay.service";
import {LetterComponent} from "./letter/letter.component";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {CdkScrollable} from "@angular/cdk/overlay";
import {CdkDrag, CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";
import {MessageComponent} from "./message/message.component";
import {CodeNoteService} from "./code-note.service";
import {CodeNoteStorageStrategy} from "./storage/code-note-storage.strategy";
import {FirebaseRtdbStrategy} from "./storage/firebase-rtdb.strategy";
import {Letter} from "./letter/Letter";

@Component({
  selector: 'app-code-note',
  imports: [
    FormsModule,
    LetterComponent,
    NzButtonComponent,
    NzIconDirective,
    CdkScrollable,
    CdkDropList,
    CdkDrag,
    MessageComponent,
  ],
  templateUrl: './code-note.component.html',
  standalone: true,
  styleUrl: './code-note.component.css',
  providers: [
    CodeNoteService,
    {provide: CodeNoteStorageStrategy, useClass: FirebaseRtdbStrategy},
  ],
})
export class CodeNoteComponent {
  private modularOverlayService = inject(ModularOverlayService);
  protected codeNoteService = inject(CodeNoteService);

  get alphabet() { return this.codeNoteService.alphabet(); }
  get messages() { return this.codeNoteService.messages(); }

  constructor() {
    this.codeNoteService.connect('code-note');
  }

  private triggerAutoSave(): void {
    void this.codeNoteService.save();
  }

  addLetter(): void {
    this.codeNoteService.addLetter();
    this.triggerAutoSave();
  }

  protected openMessageModular(message: number[] = [], messageIndex: number | null = null): void {
    this.modularOverlayService.openMessageInput(this.alphabet, message).sendData.subscribe(result => {
      if (!Array.isArray(result) || result.length === 0) {
        return;
      }

      if (messageIndex !== null) {
        this.codeNoteService.updateMessage(messageIndex, result);
      } else {
        this.codeNoteService.addMessage(result);
      }

      this.triggerAutoSave();
    });
  }

  reset(): void {
    this.codeNoteService.reset();
    this.triggerAutoSave();
  }

  protected deleteMessage(messageIndex: number): void {
    this.codeNoteService.deleteMessage(messageIndex);
    this.triggerAutoSave();
  }

  protected drop(event: CdkDragDrop<Letter[]>): void {
    this.codeNoteService.moveLetters(event.previousIndex, event.currentIndex);
    this.triggerAutoSave();
  }

  protected deleteLetter(letter: Letter): void {
    this.codeNoteService.deleteLetter(letter);
    this.triggerAutoSave();
  }

  protected onLetterChanged(): void {
    this.triggerAutoSave();
  }
}
