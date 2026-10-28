import {Component, inject} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {CodeNoteLobbiesService} from '../code-note/code-note-lobbies.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, NzButtonModule, NzIconModule, NzMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private readonly router = inject(Router);
  protected readonly lobbyStorage = inject(CodeNoteLobbiesService);
  isGlossaryRoute(): boolean { return this.router.url === '/'; }
  isTechnologyAtlasRoute(): boolean { return this.router.url.startsWith('/technology-atlas'); }
}
