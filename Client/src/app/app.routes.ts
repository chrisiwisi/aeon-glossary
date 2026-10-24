import { Routes } from '@angular/router';
import {CodeNoteComponent} from "./code-note/code-note.component";
import {GlossaryPageComponent} from "./glossary-page/glossary-page.component";
import {TechnologyAtlasPageComponent} from './technology-atlas-page/technology-atlas-page.component';

export const routes: Routes = [
  {path: '', pathMatch: 'full', component: GlossaryPageComponent},
  {path: 'technology-atlas/:sessionCode', component: TechnologyAtlasPageComponent},
  {path: 'technology-atlas', component: TechnologyAtlasPageComponent},
  {path: 'tech-tree/:sessionCode', redirectTo: 'technology-atlas/:sessionCode'},
  {path: 'tech-tree', redirectTo: 'technology-atlas'},
  {path: 'code/:lobbyCode', component: CodeNoteComponent},
  {path: 'code', component: CodeNoteComponent},
  {path: '**', redirectTo: ''},
];
