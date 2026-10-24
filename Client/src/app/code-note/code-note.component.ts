import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Database, get, ref, runTransaction} from '@angular/fire/database';
import {ActivatedRoute, Router} from "@angular/router";
import {ModularOverlayService} from "../modular-overlay/modular-overlay.service";
import {LetterComponent} from "./letter/letter.component";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
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
import {CodeNoteLobbiesService} from "./code-note-lobbies.service";
import {SessionDialogComponent} from '../session-dialog/session-dialog.component';
import {distinctUntilChanged, map} from "rxjs";

const ROOT_CODE_NOTE_PATH = 'code-note';
const LOBBY_CODE_PATTERN = /^[a-z0-9-]{3,80}$/;

@Component({
  selector: 'app-code-note',
  imports: [
    LetterComponent,
    NzButtonComponent,
    NzIconDirective,
    CdkScrollable,
    CdkDropList,
    CdkDrag,
    MessageComponent,
    BackupRestoreComponent,
    SessionDialogComponent,
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
  private db = inject(Database);
  private modularOverlayService = inject(ModularOverlayService);
  private modal = inject(NzModalService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private nameGeneratorService = inject(NameGeneratorService);
  private lobbyStorage = inject(CodeNoteLobbiesService);
  protected codeNoteService = inject(CodeNoteService);

  get alphabet() { return this.codeNoteService.alphabet(); }
  get messages() { return this.codeNoteService.messages(); }

  readonly lobbyCode = signal<string>('');
  readonly dialogError = signal('');
  readonly dialogLoading = signal(false);
  readonly dialogVisible = signal(false);

  constructor() {
    this.route.paramMap
      .pipe(
        map(params => params.get('lobbyCode')),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe(rawCode => {
        const lobbyCode = this.normalizeLobbyCode(rawCode);
        if (rawCode && !lobbyCode) {
          void this.router.navigate(['/code'], {replaceUrl: true});
          return;
        }

        if (!lobbyCode) {
          this.lobbyCode.set('');
          this.openDialog();
          return;
        }

        this.lobbyCode.set(lobbyCode);
        this.dialogVisible.set(false);
        this.codeNoteService.connect(`${ROOT_CODE_NOTE_PATH}/${lobbyCode}`);
        this.lobbyStorage.addLobbyCode(lobbyCode);
      });
  }

  private openDialog(): void {
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    void this.router.navigate(['/']);
  }

  private normalizeLobbyCode(raw: string | null | undefined): string | null {
    if (!raw) {
      return null;
    }

    const normalized = raw.trim().toLowerCase();
    // Restrict to Firebase-safe path segment chars.
    if (!LOBBY_CODE_PATTERN.test(normalized)) {
      return null;
    }

    return normalized;
  }

  async createSession(): Promise<void> {
    this.dialogError.set('');
    this.dialogLoading.set(true);
    try {
      for (let attempt = 0; attempt < 5; attempt++) {
        const code = this.nameGeneratorService.generateLobbyCode().toLowerCase();
        const result = await runTransaction(ref(this.db, `${ROOT_CODE_NOTE_PATH}/${code}`), current =>
          current === null ? {createdAt: new Date().toISOString()} : undefined
        );
        if (result.committed) {
          await this.router.navigate(['/code', code]);
          return;
        }
      }
      this.dialogError.set('Could not find an unused session code. Please try again.');
    } catch {
      this.dialogError.set('Could not create the code note session.');
    } finally {
      this.dialogLoading.set(false);
    }
  }

  async joinSession(rawCode: string): Promise<void> {
    const code = this.normalizeLobbyCode(rawCode);
    if (!code) {
      this.dialogError.set('Enter a valid session code (3–80 letters, numbers, or hyphens).');
      return;
    }

    this.dialogError.set('');
    this.dialogLoading.set(true);
    try {
      const snapshot = await get(ref(this.db, `${ROOT_CODE_NOTE_PATH}/${code}`));
      if (!snapshot.exists()) {
        this.dialogError.set('No code note session was found with that code.');
        return;
      }
      await this.router.navigate(['/code', code]);
    } catch {
      this.dialogError.set('Could not join the code note session.');
    } finally {
      this.dialogLoading.set(false);
    }
  }

  private triggerAutoSave(): void {
    void this.codeNoteService.save();
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
