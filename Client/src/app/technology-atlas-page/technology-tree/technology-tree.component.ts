import { Component, computed, effect, ElementRef, input, output, signal, viewChild, viewChildren } from '@angular/core';
import { TechnologyCardComponent } from '../technology-card/technology-card.component';
import { TechnologyFilter, TechnologyStatusFilter } from '../technology-filters/technology-filters.component';
import { TechnologyEdge, TechnologyGraph, TechnologyNode, technologyStatus } from '../technology.model';

@Component({
  selector: 'app-technology-tree',
  imports: [TechnologyCardComponent],
  templateUrl: './technology-tree.component.html',
  styleUrl: './technology-tree.component.css'
})
export class TechnologyTreeComponent {
  private pan: { pointerId: number; x: number; y: number; left: number; top: number; viewport: HTMLElement } | null = null;
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  private readonly placedCards = viewChildren<ElementRef<HTMLElement>>('placedCard');
  private readonly cardHeights = signal<ReadonlyMap<string, number>>(new Map());
  isPanning = false;
  readonly graph = input.required<TechnologyGraph>();
  readonly filter = input.required<TechnologyFilter>();
  readonly statusFilter = input.required<TechnologyStatusFilter>();
  readonly researchedIds = input.required<ReadonlySet<string>>();
  readonly selected = output<TechnologyNode>();
  readonly branches = ['Structural', 'Combat'] as const;
  readonly lockedPreviewIds = computed(() => {
    const currentFilter = this.statusFilter();
    if (currentFilter === 'locked' || currentFilter === 'researched') {
      return new Set<string>();
    }

    const byId = new Map(this.graph().nodes.map(node => [node.refID, node] as const));
    const preview = new Set<string>();
    for (const node of this.graph().nodes) {
      if (this.status(node) !== 'available') continue;
      for (const dependentId of node.dependentIds) {
        const dependent = byId.get(dependentId);
        if (dependent && this.status(dependent) === 'locked') {
          preview.add(dependentId);
        }
      }
    }
    return preview;
  });

  readonly visibleNodes = computed(() => {
    const currentFilter = this.statusFilter();
    const preview = this.lockedPreviewIds();
    return this.graph().nodes.filter(node => {
      const status = this.status(node);
      if (currentFilter === 'All') {
        return status !== 'locked' || preview.has(node.refID);
      }
      if (currentFilter === 'available') {
        return status === 'available' || preview.has(node.refID);
      }
      if (currentFilter === 'researched') {
        return status === 'researched';
      }
      // "Locked" acts as a visibility toggle: show everything, including locked.
      return true;
    });
  });

  readonly visibleEdges = computed<TechnologyEdge[]>(() => {
    const visible = new Set(this.visibleNodes().map(node => node.refID));
    return this.graph().edges.filter(edge => visible.has(edge.fromId) && visible.has(edge.toId));
  });

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
    effect(onCleanup => {
      const observer = new ResizeObserver(entries => {
        this.cardHeights.update(current => {
          const next = new Map(current);
          let changed = false;
          for (const entry of entries) {
            const id = entry.target.getAttribute('data-technology-id');
            const height = Math.ceil(entry.target.getBoundingClientRect().height);
            if (id && height > 0 && next.get(id) !== height) {
              next.set(id, height);
              changed = true;
            }
          }
          return changed ? next : current;
        });
      });
      for (const card of this.placedCards()) observer.observe(card.nativeElement);
      onCleanup(() => observer.disconnect());
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

  isTeasedLocked(node: TechnologyNode): boolean {
    return this.status(node) === 'locked'
      && this.statusFilter() !== 'locked'
      && this.lockedPreviewIds().has(node.refID);
  }

  isDimmed(node: TechnologyNode) {
    if (this.filter() !== 'All' && this.filter() !== node.techType) return true;

    const currentFilter = this.statusFilter();
    const status = this.status(node);

    // "Locked" mode shows everything, so don't dim by status.
    if (currentFilter === 'locked') return false;

    if (status === 'locked') return !this.isTeasedLocked(node);

    return currentFilter !== 'All' && status !== currentFilter;
  }

  branchNodes(branch: 'Structural' | 'Combat') {
    return this.visibleNodes().filter(node => node.techType === branch).sort((a, b) => a.depth - b.depth);
  }

  researchedCount(branch: 'Structural' | 'Combat') {
    return this.branchNodes(branch).filter(node => this.researchedIds().has(node.refID)).length;
  }

  visibleBranchNodes(branch: 'Structural' | 'Combat') {
    return this.branchNodes(branch);
  }

  cardHeight(node: TechnologyNode): number { return this.cardHeights().get(node.refID) ?? 150; }
  edgePath(fromId: string, toId: string): string {
    const from = this.graph().nodes.find(node => node.refID === fromId)!;
    const to = this.graph().nodes.find(node => node.refID === toId)!;
    const x1 = from.x + 220, y1 = from.y + this.cardHeight(from) / 2;
    const x2 = to.x, y2 = to.y + this.cardHeight(to) / 2;
    const bend = Math.max(35, (x2 - x1) / 2);
    return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
  }
}
