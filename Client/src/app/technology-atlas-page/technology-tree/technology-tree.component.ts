import { Component, computed, effect, ElementRef, input, output, signal, viewChild, viewChildren } from '@angular/core';
import { TechnologyCardComponent } from '../technology-card/technology-card.component';
import { TechnologyPrerequisiteComponent } from '../technology-prerequisite/technology-prerequisite.component';
import { TechnologyFilter, TechnologyStatusFilter } from '../technology-filters/technology-filters.component';
import { TechnologyEdge, TechnologyGraph, TechnologyNode, TechnologyPrerequisiteNode, TechnologyTreeNode, technologyStatus } from '../technology.model';
import { layoutTechnologyTree, PREREQUISITE_CARD_HEIGHT, TECHNOLOGY_CARD_HEIGHT, TECHNOLOGY_CARD_WIDTH } from './technology-tree.layout';

@Component({
  selector: 'app-technology-tree',
  imports: [TechnologyCardComponent, TechnologyPrerequisiteComponent],
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
  readonly prerequisiteCompleted = output<string>();
  readonly branches = ['Structural', 'Combat'] as const;
  readonly cardWidth = TECHNOLOGY_CARD_WIDTH;
  readonly layout = computed(() => layoutTechnologyTree(this.graph(), this.cardHeights()));
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
    return this.layout().nodes.filter(node => {
      const status = this.status(node);
      if (node.kind === 'prerequisite' && status === 'locked') return currentFilter === 'locked';
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
    const nodes = this.visibleNodes();
    const visible = new Set(nodes.map(node => node.refID));
    return this.graph().edges.filter(edge => visible.has(edge.toId)
      && nodes.some(node => node.refID === edge.fromId && node.dependentIds.includes(edge.toId)));
  });

  readonly visiblePrerequisites = computed(() => {
    const prerequisites = new Map<string, TechnologyPrerequisiteNode>();
    for (const node of this.visibleNodes()) {
      if (node.kind !== 'prerequisite' || !this.matchesBranch(node)) continue;
      const existing = prerequisites.get(node.refID);
      if (!existing || this.status(existing) === 'locked') prerequisites.set(node.refID, node);
    }
    return [...prerequisites.values()];
  });

  readonly canvasWidth = computed(() => this.layout().width);
  readonly canvasHeight = computed(() => this.layout().height);

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
    if (event.button === 0 && (event.target as Element).closest('app-technology-card, app-technology-prerequisite')) return;
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

  status(node: TechnologyTreeNode) {
    const branch = this.filter();
    return technologyStatus(node, this.researchedIds(), this.graph(), branch === 'All' ? undefined : branch);
  }

  isEdgeComplete(edge: TechnologyEdge): boolean {
    return this.visibleNodes().some(node => node.refID === edge.fromId
      && node.dependentIds.includes(edge.toId) && this.status(node) === 'researched');
  }

  isTeasedLocked(node: TechnologyTreeNode): boolean {
    return this.status(node) === 'locked'
      && this.statusFilter() !== 'locked'
      && this.lockedPreviewIds().has(node.refID);
  }

  matchesBranch(node: TechnologyTreeNode): boolean {
    const branch = this.filter();
    if (branch === 'All') return true;
    if (node.kind === 'technology') return node.techType === branch;
    return this.graph().nodes.some(candidate => candidate.kind === 'technology'
      && candidate.techType === branch && node.dependentIds.includes(candidate.refID));
  }

  isDimmed(node: TechnologyTreeNode) {
    if (!this.matchesBranch(node)) return true;

    const currentFilter = this.statusFilter();
    const status = this.status(node);

    // "Locked" mode shows everything, so don't dim by status.
    if (currentFilter === 'locked') return false;

    if (status === 'locked') return !this.isTeasedLocked(node);

    return currentFilter !== 'All' && status !== currentFilter;
  }

  branchNodes(branch: 'Structural' | 'Combat') {
    return this.visibleNodes().filter((node): node is TechnologyNode => node.kind === 'technology' && node.techType === branch)
      .sort((first, second) => first.depth - second.depth);
  }

  researchedCount(branch: 'Structural' | 'Combat') {
    return this.branchNodes(branch).filter(node => this.researchedIds().has(node.refID)).length;
  }

  visibleBranchNodes(branch: 'Structural' | 'Combat') {
    return this.branchNodes(branch);
  }

  cardHeight(node: TechnologyTreeNode): number {
    return this.cardHeights().get(node.refID) ?? (node.kind === 'prerequisite' ? PREREQUISITE_CARD_HEIGHT : TECHNOLOGY_CARD_HEIGHT);
  }
  edgePath(fromId: string, toId: string): string {
    return this.layout().edgePaths.get(fromId)?.get(toId) ?? '';
  }
}
