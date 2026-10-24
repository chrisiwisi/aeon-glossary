import { Routes } from '@angular/router';
import {CodeNoteComponent} from "./code-note/code-note.component";
import {GlossaryPageComponent} from "./glossary-page/glossary-page.component";
import {TechTreePageComponent} from "./tech-tree-page/tech-tree-page.component";

export const routes: Routes = [
  {path: '', pathMatch: 'full', component: GlossaryPageComponent},
  {path: 'tech-tree', component: TechTreePageComponent},
  {path: 'code/:lobbyCode', component: CodeNoteComponent},
  {path: 'code', component: CodeNoteComponent},
  {path: '**', redirectTo: ''},
];
