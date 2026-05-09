import {Component, inject} from '@angular/core';
import {Router, RouterModule, RouterOutlet} from "@angular/router";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly router = inject(Router);
  protected readonly lobbyStorage = inject(CodeNoteLobbiesService)

  isSidebarCollapsed = true;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  closeSidebar(): void {
    this.isSidebarCollapsed = true;
  }

  isCodeRoute(): boolean {
    return this.router.url.startsWith('/code');
  }
}
