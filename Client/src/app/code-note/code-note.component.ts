import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ModularOverlayService} from "../modular-overlay/modular-overlay.service";
import {LetterComponent} from "./letter/letter.component";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {CdkScrollable} from "@angular/cdk/overlay";
import {CdkDrag, CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";
import {MessageComponent} from "./message/message.component";
import {CodeNoteService} from "./code-note.service";
import {CodeNoteStorageStrategy} from "./code-note-storage.strategy";
import {LocalStorageStrategy} from "./local-storage.strategy";
import {Letter} from "./letter/Letter";

@Component({
  selector: 'app-code-note',
  imports: [
    FormsModule,
    LetterComponent,
    NzButtonComponent,
    NzIconDirective,
    NzTooltipDirective,
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
    {provide: CodeNoteStorageStrategy, useClass: LocalStorageStrategy},
  ],
})
export class CodeNoteComponent implements OnInit {
  private modularOverlayService = inject(ModularOverlayService);
  protected codeNoteService = inject(CodeNoteService);

  get alphabet() { return this.codeNoteService.alphabet(); }
  get messages() { return this.codeNoteService.messages(); }

  async ngOnInit(): Promise<void> {
    await this.codeNoteService.load();
  }

  addLetter(): void {
    this.codeNoteService.addLetter();
  }

  protected openMessageModular(message: number[] = []): void {
    this.modularOverlayService.openMessageInput(this.alphabet, message).sendData.subscribe(result => {
      if (result) {
        this.codeNoteService.addMessage(result);
      }
    });
  }

  async saveCurrentProgress(): Promise<void> {
    await this.codeNoteService.save();
  }

  reset(): void {
    this.codeNoteService.reset();
  }

  protected deleteMessage(messageIndex: number): void {
    this.codeNoteService.deleteMessage(messageIndex);
  }

  protected drop(event: CdkDragDrop<Letter[]>): void {
    this.codeNoteService.moveLetters(event.previousIndex, event.currentIndex);
  }

  protected deleteLetter(letter: Letter): void {
    this.codeNoteService.deleteLetter(letter);
  }
}
