import {Component, input, output} from '@angular/core';
import {TechnologyBranch, TechnologyStatus} from '../technology.model';

export type TechnologyFilter = 'All' | TechnologyBranch;
export type TechnologyStatusFilter = 'All' | TechnologyStatus;

@Component({
  selector: 'app-technology-filters',
  templateUrl: './technology-filters.component.html',
  styleUrl: './technology-filters.component.css'
})
export class TechnologyFiltersComponent {
  readonly options: TechnologyFilter[] = ['All', 'Structural', 'Combat'];
  readonly statusOptions: {value: TechnologyStatusFilter; label: string}[] = [
    {value: 'All', label: 'All'},
    {value: 'researched', label: 'Researched'},
    {value: 'available', label: 'Projects'},
    {value: 'locked', label: 'Locked'},
  ];
  readonly filter = input.required<TechnologyFilter>();
  readonly filterChange = output<TechnologyFilter>();
  readonly statusFilter = input.required<TechnologyStatusFilter>();
  readonly statusFilterChange = output<TechnologyStatusFilter>();
}
