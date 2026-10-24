import {Injectable, signal} from '@angular/core';

export const TECHNOLOGY_CYCLES = ['Cycle I', 'Cycle II', 'Cycle III', 'Cycle IV', 'Cycle V'] as const;
export type TechnologyCycle = typeof TECHNOLOGY_CYCLES[number];

const STORAGE_KEY = 'technologyAtlasCycle';

@Injectable({providedIn: 'root'})
export class TechnologyCycleService {
  readonly selectedCycle = signal<TechnologyCycle>(this.readStoredCycle());

  selectCycle(cycle: TechnologyCycle): void {
    this.selectedCycle.set(cycle);
    localStorage.setItem(STORAGE_KEY, cycle);
  }

  private readStoredCycle(): TechnologyCycle {
    const stored = localStorage.getItem(STORAGE_KEY);
    return TECHNOLOGY_CYCLES.find(cycle => cycle === stored) ?? 'Cycle I';
  }
}
