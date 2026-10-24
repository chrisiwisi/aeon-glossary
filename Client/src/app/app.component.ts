import {Component, inject, signal} from '@angular/core';
import {Router, RouterModule, RouterOutlet} from "@angular/router";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {CodeNoteLobbiesService} from "./code-note/code-note-lobbies.service";

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly router = inject(Router);
  protected readonly lobbyStorage = inject(CodeNoteLobbiesService)
  protected readonly copyLabel = signal('Share');

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

  isTechTreeRoute(): boolean {
    return this.router.url.startsWith('/tech-tree');
  }

  isCodeRoute(): boolean {
    return this.router.url.startsWith('/code');
  }

  sessionCode(): string | null {
    const segments = this.router.parseUrl(this.router.url).root.children['primary']?.segments;
    if (segments?.length === 2 && (segments[0].path === 'code' || segments[0].path === 'tech-tree')) {
      return segments[1].path.toLowerCase();
    }
    return null;
  }

  async shareOrCopy(): Promise<void> {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({title: this.isCodeRoute() ? 'Code Note' : 'Technology Tree', url});
    } else {
      await navigator.clipboard.writeText(url);
      this.copyLabel.set('Copied!');
      setTimeout(() => this.copyLabel.set('Share'), 2000);
    }
  }
}
