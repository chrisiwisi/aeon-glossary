import {Component, DestroyRef, computed, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Database, get, onValue, ref, runTransaction, set} from '@angular/fire/database';
import {ActivatedRoute, Router} from '@angular/router';
import {distinctUntilChanged, map} from 'rxjs';
import {NameGeneratorService} from '../code-note/name-generator.service';
import {SessionDialogComponent} from '../session-dialog/session-dialog.component';
import {TechnologyFiltersComponent, TechnologyFilter, TechnologyStatusFilter} from './technology-filters/technology-filters.component';
import {TechnologyPopupComponent} from './technology-popup/technology-popup.component';
import {TechnologyTreeComponent} from './technology-tree/technology-tree.component';
import {TechnologyCycleService} from './technology-cycle.service';
import {buildTechnologyGraph, TechnologyCardDto, TechnologyNode, TechnologyStatus, technologyStatus} from './technology.model';

const SESSIONS_PATH = 'technologySessions';
const CACHE_PATH = 'technologyCache/cardsJson';
const STORED_SESSION_CODE = 'technologySessionCode';
const SESSION_CODE_PATTERN = /^[a-z0-9-]{3,80}$/;

@Component({
  selector: 'app-technology-atlas-page',
  imports: [SessionDialogComponent, TechnologyFiltersComponent, TechnologyTreeComponent, TechnologyPopupComponent],
  templateUrl: './technology-atlas-page.component.html',
  styleUrl: './technology-atlas-page.component.css'
})
export class TechnologyAtlasPageComponent {
  private readonly db = inject(Database);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly nameGenerator = inject(NameGeneratorService);
  private readonly cycles = inject(TechnologyCycleService);
  private disconnect: () => void = () => undefined;
  private disconnectCache: () => void = () => undefined;

  readonly technologies = signal<TechnologyCardDto[]>([]);
  readonly cacheLoading = signal(true);
  readonly cacheError = signal('');
  readonly sessionCode = signal('');
  readonly sessionState = signal<Record<string, boolean>>({});
  readonly sessionExists = signal(false);
  readonly error = signal('');
  readonly loading = signal(false);
  readonly dialogVisible = signal(false);
  readonly graph = computed(() => buildTechnologyGraph(this.technologies().filter(card => card.cycle === this.cycles.selectedCycle())));
  readonly filter = signal<TechnologyFilter>('All');
  readonly statusFilter = signal<TechnologyStatusFilter>('All');
  readonly researchedIds = computed<ReadonlySet<string>>(() => new Set(
    this.technologies()
      .filter(card => this.sessionState()[this.technologyKey(card.refID)] === true)
      .map(card => card.refID)
  ));
  readonly selectedTechnology = signal<TechnologyNode | null>(null);
  readonly selectedStatus = computed<TechnologyStatus>(() => {
    const node = this.selectedTechnology();
    return node ? technologyStatus(node, this.researchedIds()) : 'locked';
  });

  constructor() {
    this.disconnectCache = onValue(ref(this.db, CACHE_PATH), snapshot => {
      this.cacheLoading.set(false);
      try {
        const cards = JSON.parse(snapshot.val() ?? 'null');
        if (!Array.isArray(cards) || !cards.length || cards.some(card =>
          typeof card.refID !== 'string' || typeof card.name !== 'string' ||
          !Array.isArray(card.requirements) || typeof card.cycle !== 'string' ||
          !['Structural', 'Combat'].includes(card.techType))) {
          throw new Error('Invalid technology cache');
        }
        this.technologies.set(cards);
        this.cacheError.set('');
        this.selectedTechnology.set(null);
      } catch {
        this.technologies.set([]);
        this.cacheError.set('Technology data is unavailable. Sync the technology cache and try again.');
      }
    }, () => {
      this.cacheLoading.set(false);
      this.cacheError.set('Could not load technology data.');
    });

    this.route.paramMap.pipe(
      map(params => params.get('sessionCode')),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe(rawCode => {
      this.disconnect();
      this.disconnect = () => undefined;
      this.error.set('');
      this.sessionState.set({});
      this.sessionExists.set(false);

      const code = rawCode?.trim().toLowerCase() ?? '';
      if (rawCode && !SESSION_CODE_PATTERN.test(code)) {
        void this.router.navigate(['/technology-atlas'], {replaceUrl: true});
        return;
      }

      if (!code) {
        const storedCode = localStorage.getItem(STORED_SESSION_CODE);
        if (storedCode && SESSION_CODE_PATTERN.test(storedCode)) {
          this.sessionCode.set(storedCode);
          void this.router.navigate(['/technology-atlas', storedCode], {replaceUrl: true});
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
          this.sessionExists.set(snapshot.exists());
          const state = snapshot.child('state').val();
          this.sessionState.set(state && typeof state === 'object' && !Array.isArray(state) ? state : {});
          if (snapshot.exists()) {
            localStorage.setItem(STORED_SESSION_CODE, code);
          } else if (localStorage.getItem(STORED_SESSION_CODE) === code) {
            localStorage.removeItem(STORED_SESSION_CODE);
          }
        }, () => {
          this.loading.set(false);
          this.sessionExists.set(false);
          this.sessionState.set({});
          this.error.set('Could not load this technology session.');
        });
      }
    });

    this.destroyRef.onDestroy(() => {
      this.disconnect();
      this.disconnectCache();
    });
  }

  openDialog(): void {
    this.error.set('');
    this.dialogVisible.set(true);
  }

  private technologyKey(id: string): string {
    return encodeURIComponent(id).replace(/\./g, '%2E');
  }

  async researchTechnology(id: string): Promise<void> {
    const node = this.graph().nodes.find(candidate => candidate.refID === id);
    if (!node || technologyStatus(node, this.researchedIds()) !== 'available') return;
    if (!this.sessionExists()) {
      this.selectedTechnology.set(null);
      if (!this.sessionCode()) this.openDialog();
      return;
    }
    try {
      await set(ref(this.db, `${SESSIONS_PATH}/${this.sessionCode()}/state/${this.technologyKey(id)}`), true);
      this.selectedTechnology.set(null);
    } catch {
      this.selectedTechnology.set(null);
      this.error.set('Could not save the technology research status. Please try again.');
    }
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
  }

  async createSession(): Promise<void> {
    this.error.set('');
    this.loading.set(true);
    try {
      for (let attempt = 0; attempt < 5; attempt++) {
        const code = this.nameGenerator.generateLobbyCode().toLowerCase();
        const result = await runTransaction(ref(this.db, `${SESSIONS_PATH}/${code}`), current =>
          current === null ? {
            createdAt: new Date().toISOString(),
            state: Object.fromEntries(this.technologies().map(card => [this.technologyKey(card.refID), false]))
          } : undefined
        );
        if (result.committed) {
          await this.router.navigate(['/technology-atlas', code]);
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
      await this.router.navigate(['/technology-atlas', code]);
    } catch {
      this.error.set('Could not join the technology session.');
    } finally {
      this.loading.set(false);
    }
  }
}
