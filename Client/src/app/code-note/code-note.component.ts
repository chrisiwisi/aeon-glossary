import {Component, inject, signal} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ModularOverlayService} from "../modular-overlay/modular-overlay.service";
import {LetterComponent} from "./letter/letter.component";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {NzModalService} from "ng-zorro-antd/modal";
import {CdkScrollable} from "@angular/cdk/overlay";
import {CdkDrag, CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";
import {MessageComponent} from "./message/message.component";
import {CodeNoteService} from "./code-note.service";
import {CodeNoteStorageStrategy} from "./storage/code-note-storage.strategy";
import {FirebaseRtdbStrategy} from "./storage/firebase-rtdb.strategy";
import {Letter} from "./letter/Letter";
import {NameGeneratorService} from "./name-generator.service";
import {CodeNoteData} from "./storage/code-note-storage.strategy";
import {BackupRestoreComponent} from "./backup-restore/backup-restore.component";

const ROOT_CODE_NOTE_PATH = 'code-note';

@Component({
  selector: 'app-code-note',
  imports: [
    FormsModule,
    LetterComponent,
    NzButtonComponent,
    NzIconDirective,
    NzTagComponent,
    CdkScrollable,
    CdkDropList,
    CdkDrag,
    MessageComponent,
    BackupRestoreComponent,
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
  private modal = inject(NzModalService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private nameGeneratorService = inject(NameGeneratorService);
  protected codeNoteService = inject(CodeNoteService);

  get alphabet() { return this.codeNoteService.alphabet(); }
  get messages() { return this.codeNoteService.messages(); }

  readonly lobbyCode = signal<string>('');
  readonly copyLabel = signal<string>('Share');

  constructor() {
    const lobbyCode = this.resolveLobbyCode();
    this.lobbyCode.set(lobbyCode);
    this.codeNoteService.connect(`${ROOT_CODE_NOTE_PATH}/${lobbyCode}`);
  }

  private resolveLobbyCode(): string {
    const routeParam = this.route.snapshot.paramMap.get('lobbyCode');
    const normalized = this.normalizeLobbyCode(routeParam);

    if (normalized) {
      return normalized;
    }

    const generated = this.nameGeneratorService.generateLobbyCode().toLowerCase();
    void this.router.navigate(['/code', generated], {replaceUrl: true});
    return generated;
  }

  private normalizeLobbyCode(raw: string | null | undefined): string | null {
    if (!raw) {
      return null;
    }

    const normalized = raw.trim().toLowerCase();
    // Restrict to Firebase-safe path segment chars.
    if (!/^[a-z0-9-]{3,80}$/.test(normalized)) {
      return null;
    }

    return normalized;
  }

  private triggerAutoSave(): void {
    void this.codeNoteService.save();
  }

  async shareOrCopy(): Promise<void> {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: 'Code Note', url });
    } else {
      await navigator.clipboard.writeText(url);
      this.copyLabel.set('Copied!');
      setTimeout(() => this.copyLabel.set('Share'), 2000);
    }
  }

  backup(): void {
    this.codeNoteService.backup(this.lobbyCode());
  }

  onImport(data: CodeNoteData): void {
    this.modal.confirm({
      nzTitle: 'Import backup?',
      nzContent: 'This will replace all current letters and messages. This cannot be undone.',
      nzOkText: 'Import',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => this.codeNoteService.restore(data),
    });
  }

  addLetter(): void {    this.codeNoteService.addLetter();
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
