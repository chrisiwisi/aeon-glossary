import {Component, input, output} from '@angular/core';
import {TechnologyNode, TechnologyStatus, technologyFlavour} from '../technology.model';

@Component({
  selector: 'app-technology-card',
  templateUrl: './technology-card.component.html',
  styleUrl: './technology-card.component.css'
})
export class TechnologyCardComponent {
  readonly technology = input.required<TechnologyNode>();
  readonly status = input.required<TechnologyStatus>();
  readonly selected = output<TechnologyNode>();

  flavour(): string { return technologyFlavour(this.technology(), this.status()); }
}
