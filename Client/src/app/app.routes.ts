import { Routes } from '@angular/router';
import {CodeNoteComponent} from "./code-note/code-note.component";
import {GlossaryPageComponent} from "./glossary-page/glossary-page.component";

export const routes: Routes = [
  {path: '', pathMatch: 'full', component: GlossaryPageComponent},
  {path: 'code/:lobbyCode', component: CodeNoteComponent},
  {path: 'code', component: CodeNoteComponent},
  {path: '**', redirectTo: ''},
];
