import { Component, computed, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { TechnologyCardComponent } from '../technology-card/technology-card.component';
import { TechnologyFilter, TechnologyStatusFilter } from '../technology-filters/technology-filters.component';
import { TechnologyGraph, TechnologyNode, technologyStatus } from '../technology.model';

@Component({
  selector: 'app-technology-tree',
  imports: [TechnologyCardComponent],
  templateUrl: './technology-tree.component.html',
  styleUrl: './technology-tree.component.css'
})
export class TechnologyTreeComponent {
  private pan: { pointerId: number; x: number; y: number; left: number; top: number; viewport: HTMLElement } | null = null;
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  isPanning = false;
  readonly graph = input.required<TechnologyGraph>();
  readonly filter = input.required<TechnologyFilter>();
  readonly statusFilter = input.required<TechnologyStatusFilter>();
  readonly researchedIds = input.required<ReadonlySet<string>>();
  readonly selected = output<TechnologyNode>();
  readonly branches = ['Structural', 'Combat'] as const;
  readonly canvasWidth = computed(() => Math.max(1100, ...this.graph().nodes.map(node => node.x + 300)));
  readonly canvasHeight = computed(() => Math.max(750, ...this.graph().nodes.map(node => node.y + 200)));

  constructor() {
    effect(() => {
      this.graph();
      const viewport = this.viewport();
      if (viewport) {
        viewport.nativeElement.scrollLeft = 0;
        viewport.nativeElement.scrollTop = 0;
      }
    });
  }

  startPan(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || (event.button !== 0 && event.button !== 1)) return;
    const viewport = event.currentTarget as HTMLElement;
    if (event.target === viewport) return; // Let the native scrollbars handle their own pointer events.
    if (event.button === 0 && (event.target as Element).closest('app-technology-card')) return;
    event.preventDefault();
    viewport.setPointerCapture(event.pointerId);
    this.pan = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop, viewport };
    this.isPanning = true;
  }

  movePan(event: PointerEvent): void {
    if (!this.pan || this.pan.pointerId !== event.pointerId) return;
    this.pan.viewport.scrollLeft = this.pan.left - (event.clientX - this.pan.x);
    this.pan.viewport.scrollTop = this.pan.top - (event.clientY - this.pan.y);
  }

  endPan(event: PointerEvent): void {
    if (!this.pan || this.pan.pointerId !== event.pointerId) return;
    if (this.pan.viewport.hasPointerCapture(event.pointerId)) this.pan.viewport.releasePointerCapture(event.pointerId);
    this.pan = null;
    this.isPanning = false;
  }

  preventMiddleClick(event: MouseEvent): void {
    if (event.button === 1) event.preventDefault();
  }

  status(node: TechnologyNode) { return technologyStatus(node, this.researchedIds()); }
  matchesStatus(node: TechnologyNode) { return this.statusFilter() === 'All' || this.status(node) === this.statusFilter(); }
  isDimmed(node: TechnologyNode) { return (this.filter() !== 'All' && this.filter() !== node.techType) || !this.matchesStatus(node); }
  branchNodes(branch: 'Structural' | 'Combat') { return this.graph().nodes.filter(node => node.techType === branch).sort((a, b) => a.depth - b.depth); }
  visibleBranchNodes(branch: 'Structural' | 'Combat') { return this.branchNodes(branch).filter(node => this.matchesStatus(node)); }
  researchedCount(branch: 'Structural' | 'Combat') { return this.branchNodes(branch).filter(node => this.researchedIds().has(node.refID)).length; }
  edgePath(fromId: string, toId: string): string {
    const from = this.graph().nodes.find(node => node.refID === fromId)!;
    const to = this.graph().nodes.find(node => node.refID === toId)!;
    const x1 = from.x + 220, y1 = from.y + 75, x2 = to.x, y2 = to.y + 75;
    const bend = Math.max(35, (x2 - x1) / 2);
    return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
  }
}
