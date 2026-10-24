import {Component, inject, signal} from '@angular/core';
import {Router, RouterModule, RouterOutlet} from "@angular/router";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {CodeNoteLobbiesService} from "./code-note/code-note-lobbies.service";
import {CodeNoteComponent} from './code-note/code-note.component';
import {TechnologyAtlasPageComponent} from './technology-atlas-page/technology-atlas-page.component';
import {environment} from '../environments/environment';
import {BackupRestoreComponent} from './code-note/backup-restore/backup-restore.component';
import {CodeNoteData} from './code-note/storage/code-note-storage.strategy';
import {TECHNOLOGY_CYCLES, TechnologyCycleService} from './technology-atlas-page/technology-cycle.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzTagComponent,
    BackupRestoreComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly router = inject(Router);
  protected readonly technologyCycles = inject(TechnologyCycleService);
  protected readonly cycleOptions = TECHNOLOGY_CYCLES;
  protected readonly lobbyStorage = inject(CodeNoteLobbiesService)
  protected readonly copyLabel = signal('Share');
  protected readonly theLawUrl = environment.theLawUrl;
  activePage: unknown = null;

  isSidebarCollapsed = true;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  closeSidebar(): void {
    this.isSidebarCollapsed = true;
  }

  isGlossaryRoute(): boolean {
    return this.router.url === '/';
  }

  isTechnologyAtlasRoute(): boolean {
    return this.router.url.startsWith('/technology-atlas');
  }

  isCodeRoute(): boolean {
    return this.router.url.startsWith('/code');
  }

  sessionCode(): string | null {
    const segments = this.router.parseUrl(this.router.url).root.children['primary']?.segments;
    if (segments?.length === 2 && (segments[0].path === 'code' || segments[0].path === 'technology-atlas')) {
      return segments[1].path.toLowerCase();
    }
    return null;
  }

  openSessionDialog(): void {
    if (this.activePage instanceof TechnologyAtlasPageComponent) {
      this.activePage.openDialog();
    }
  }

  backupCodeNote(): void {
    if (this.activePage instanceof CodeNoteComponent) this.activePage.backup();
  }

  importCodeNote(data: CodeNoteData): void {
    if (this.activePage instanceof CodeNoteComponent) this.activePage.onImport(data);
  }

  async shareOrCopy(): Promise<void> {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({title: this.isCodeRoute() ? 'Code Note' : 'Technology Atlas', url});
    } else {
      await navigator.clipboard.writeText(url);
      this.copyLabel.set('Copied!');
      setTimeout(() => this.copyLabel.set('Share'), 2000);
    }
  }
}
