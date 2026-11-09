import {Component, input, output} from '@angular/core';
import {TechnologyPrerequisiteNode, TechnologyStatus} from '../technology.model';

@Component({
  selector: 'app-technology-prerequisite',
  templateUrl: './technology-prerequisite.component.html',
  styleUrl: './technology-prerequisite.component.css'
})
export class TechnologyPrerequisiteComponent {
  readonly prerequisite = input.required<TechnologyPrerequisiteNode>();
  readonly status = input.required<TechnologyStatus>();
  readonly completed = output<string>();
}
