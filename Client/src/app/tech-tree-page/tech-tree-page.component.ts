import {Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Database, get, onValue, ref, runTransaction} from '@angular/fire/database';
import {ActivatedRoute, Router} from '@angular/router';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {distinctUntilChanged, map} from 'rxjs';
import {NameGeneratorService} from '../code-note/name-generator.service';
import {SessionDialogComponent} from '../session-dialog/session-dialog.component';

const SESSIONS_PATH = 'technologySessions';
const STORED_SESSION_CODE = 'technologySessionCode';
const SESSION_CODE_PATTERN = /^[a-z0-9-]{3,80}$/;

@Component({
  selector: 'app-tech-tree-page',
  imports: [NzButtonComponent, SessionDialogComponent],
  templateUrl: './tech-tree-page.component.html',
  styleUrl: './tech-tree-page.component.css'
})
export class TechTreePageComponent {
  private readonly db = inject(Database);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly nameGenerator = inject(NameGeneratorService);
  private disconnect: () => void = () => undefined;

  readonly sessionCode = signal('');
  readonly sessionState = signal<unknown>(null);
  readonly error = signal('');
  readonly loading = signal(false);
  readonly dialogVisible = signal(false);

  constructor() {
    this.route.paramMap.pipe(
      map(params => params.get('sessionCode')),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe(rawCode => {
      this.disconnect();
      this.disconnect = () => undefined;
      this.error.set('');
      this.sessionState.set(null);

      const code = rawCode?.trim().toLowerCase() ?? '';
      if (rawCode && !SESSION_CODE_PATTERN.test(code)) {
        void this.router.navigate(['/tech-tree'], {replaceUrl: true});
        return;
      }

      if (!code) {
        const storedCode = localStorage.getItem(STORED_SESSION_CODE);
        if (storedCode && SESSION_CODE_PATTERN.test(storedCode)) {
          this.sessionCode.set(storedCode);
          void this.router.navigate(['/tech-tree', storedCode], {replaceUrl: true});
          return;
        }
        if (storedCode) {
          localStorage.removeItem(STORED_SESSION_CODE);
        }
      }

      this.sessionCode.set(code);
      if (code) {
        this.dialogVisible.set(false);
        this.loading.set(true);
        this.disconnect = onValue(ref(this.db, `${SESSIONS_PATH}/${code}`), snapshot => {
          this.loading.set(false);
          this.error.set(snapshot.exists() ? '' : 'This technology session does not exist.');
          this.sessionState.set(snapshot.child('state').val());
          if (snapshot.exists()) {
            localStorage.setItem(STORED_SESSION_CODE, code);
          } else if (localStorage.getItem(STORED_SESSION_CODE) === code) {
            localStorage.removeItem(STORED_SESSION_CODE);
          }
        }, () => {
          this.loading.set(false);
          this.error.set('Could not load this technology session.');
        });
      } else {
        this.openDialog();
      }
    });

    this.destroyRef.onDestroy(() => this.disconnect());
  }

  openDialog(): void {
    this.error.set('');
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    if (this.sessionCode()) {
      this.dialogVisible.set(false);
    } else {
      void this.router.navigate(['/']);
    }
  }

  async createSession(): Promise<void> {
    this.error.set('');
    this.loading.set(true);
    try {
      for (let attempt = 0; attempt < 5; attempt++) {
        const code = this.nameGenerator.generateLobbyCode().toLowerCase();
        const result = await runTransaction(ref(this.db, `${SESSIONS_PATH}/${code}`), current =>
          current === null ? {createdAt: new Date().toISOString(), state: {initialized: true}} : undefined
        );
        if (result.committed) {
          await this.router.navigate(['/tech-tree', code]);
          return;
        }
      }
      this.error.set('Could not find an unused session code. Please try again.');
    } catch {
      this.error.set('Could not create the technology session.');
    } finally {
      this.loading.set(false);
    }
  }

  async joinSession(rawCode: string): Promise<void> {
    const code = rawCode.trim().toLowerCase();
    if (!SESSION_CODE_PATTERN.test(code)) {
      this.error.set('Enter a valid session code (3–80 letters, numbers, or hyphens).');
      return;
    }

    this.error.set('');
    this.loading.set(true);
    try {
      const snapshot = await get(ref(this.db, `${SESSIONS_PATH}/${code}`));
      if (!snapshot.exists()) {
        this.error.set('No technology session was found with that code.');
        return;
      }
      await this.router.navigate(['/tech-tree', code]);
    } catch {
      this.error.set('Could not join the technology session.');
    } finally {
      this.loading.set(false);
    }
  }
}
