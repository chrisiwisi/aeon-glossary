import {ComponentFixture, TestBed} from '@angular/core/testing';
import {buildTechnologyGraph, researchedTechnologyIds, TechnologyCardDto} from '../technology.model';
import {TechnologyTreeComponent} from './technology-tree.component';

describe('TechnologyTreeComponent prerequisites', () => {
  let fixture: ComponentFixture<TechnologyTreeComponent>;
  const technology = (name: string, requirements: string[] = [], techType: 'Structural' | 'Combat' = 'Structural'): TechnologyCardDto => ({
    refID: name, name, requirements, techType, cycle: 'Cycle I', flavorProject: name,
  });
  const graph = buildTechnologyGraph([
    technology('Starting', ['—']),
    technology('Structural project', ['Starting', 'Build a settlement']),
    technology('Combat project', ['Win a battle'], 'Combat'),
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [TechnologyTreeComponent]}).compileComponents();
    fixture = TestBed.createComponent(TechnologyTreeComponent);
    fixture.componentRef.setInput('graph', graph);
    fixture.componentRef.setInput('filter', 'All');
    fixture.componentRef.setInput('statusFilter', 'All');
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(graph, new Set()));
    fixture.detectChanges();
  });

  it('renders distinct prerequisite buttons on desktop and mobile', () => {
    for (const selector of ['.desktop-atlas', '.mobile-atlas']) {
      const buttons = fixture.nativeElement.querySelectorAll(`${selector} app-technology-prerequisite button`);
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent).toContain('Prerequisite');
      expect(buttons[0].textContent).toContain('Mark complete');
    }
    expect(fixture.componentInstance.branchNodes('Structural').length).toBe(2);
    expect(fixture.componentInstance.researchedCount('Structural')).toBe(1);
  });

  it('emits completion and unlocks dependents when the updated state arrives', () => {
    const completed = jasmine.createSpy('completed');
    fixture.componentInstance.prerequisiteCompleted.subscribe(completed);
    const prerequisite = graph.nodes.find(node => node.name === 'Build a settlement')!;
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.desktop-atlas app-technology-prerequisite button');
    button.click();
    expect(completed).toHaveBeenCalledOnceWith(prerequisite.refID);
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(graph, new Set([prerequisite.refID])));
    fixture.detectChanges();
    expect(button.disabled).toBeTrue();
    expect(button.textContent).toContain('✓ Complete');
    expect(fixture.componentInstance.status(graph.nodes.find(node => node.refID === 'Structural project')!)).toBe('available');
    expect(fixture.nativeElement.querySelector('.desktop-atlas path.complete')).not.toBeNull();
  });

  it('keeps prerequisites relevant to the selected branch without including them in technology counts', () => {
    fixture.componentRef.setInput('filter', 'Combat');
    fixture.detectChanges();
    expect(fixture.componentInstance.visiblePrerequisites().map(node => node.name)).toEqual(['Win a battle']);
    const prerequisite = graph.nodes.find(node => node.name === 'Build a settlement')!;
    expect(fixture.componentInstance.isDimmed(prerequisite)).toBeTrue();
    expect(fixture.componentInstance.branchNodes('Combat').length).toBe(1);
  });

  it('applies researched filters to completed prerequisites', () => {
    const prerequisite = graph.nodes.find(node => node.name === 'Build a settlement')!;
    fixture.componentRef.setInput('statusFilter', 'researched');
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(graph, new Set([prerequisite.refID])));
    fixture.detectChanges();
    expect(fixture.componentInstance.visiblePrerequisites().map(node => node.refID)).toEqual([prerequisite.refID]);
  });

  it('does not start panning when a prerequisite is clicked', () => {
    const button = fixture.nativeElement.querySelector('.desktop-atlas app-technology-prerequisite button');
    const event = new PointerEvent('pointerdown', {pointerType: 'mouse', button: 0, bubbles: true});
    button.dispatchEvent(event);
    expect(fixture.componentInstance.isPanning).toBeFalse();
  });

  it('synchronizes repeated prerequisite nodes and only lists them once on mobile', () => {
    const sharedGraph = buildTechnologyGraph([
      technology('Starting', ['—']),
      technology('Early', ['Starting', 'Build a settlement']),
      technology('Intermediate', ['Early']),
      technology('Late', ['Intermediate', 'Build a settlement']),
    ]);
    fixture.componentRef.setInput('graph', sharedGraph);
    fixture.componentRef.setInput('statusFilter', 'locked');
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(sharedGraph, new Set()));
    fixture.detectChanges();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.desktop-atlas app-technology-prerequisite button');
    expect(buttons.length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.mobile-atlas app-technology-prerequisite').length).toBe(1);
    expect(buttons[0].disabled).toBeFalse();
    expect(buttons[1].disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('.mobile-atlas app-technology-prerequisite button').disabled).toBeFalse();
    const prerequisite = sharedGraph.nodes.find(node => node.kind === 'prerequisite')!;
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(sharedGraph, new Set([prerequisite.refID])));
    fixture.detectChanges();
    expect(buttons[0].textContent).toContain('✓ Complete');
    expect(buttons[1].textContent).toContain('Research technology prerequisites first');
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(sharedGraph, new Set([prerequisite.refID, 'Early', 'Intermediate'])));
    fixture.detectChanges();
    for (const button of buttons) {
      expect(button.disabled).toBeTrue();
      expect(button.textContent).toContain('✓ Complete');
    }
  });

  it('filters repeated prerequisite nodes by the branch they connect to at each level', () => {
    const sharedGraph = buildTechnologyGraph([
      technology('Starting', ['—']),
      technology('Early', ['Starting', 'Build a settlement']),
      technology('Intermediate', ['Early']),
      technology('Late', ['Intermediate', 'Build a settlement'], 'Combat'),
    ]);
    fixture.componentRef.setInput('graph', sharedGraph);
    fixture.componentRef.setInput('filter', 'Combat');
    fixture.componentRef.setInput('statusFilter', 'locked');
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(sharedGraph, new Set()));
    fixture.detectChanges();
    const prerequisites = fixture.componentInstance.layout().nodes.filter(node => node.kind === 'prerequisite');
    expect(fixture.componentInstance.isDimmed(prerequisites[0])).toBeTrue();
    expect(fixture.componentInstance.isDimmed(prerequisites[1])).toBeFalse();
    expect(fixture.componentInstance.visiblePrerequisites().map(node => node.depth)).toEqual([3]);
  });

  it('hides special prerequisites until all technology prerequisites are researched, even for teased technologies', () => {
    const gatedGraph = buildTechnologyGraph([
      technology('Starting', ['—']),
      technology('First', ['Starting']),
      technology('Second', ['Starting']),
      technology('Project', ['First, Second', 'Build a settlement', 'Win a battle']),
    ]);
    fixture.componentRef.setInput('graph', gatedGraph);
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(gatedGraph, new Set()));
    fixture.detectChanges();
    expect(fixture.componentInstance.visibleNodes().some(node => node.refID === 'Project')).toBeTrue();
    expect(fixture.componentInstance.visiblePrerequisites()).toEqual([]);
    expect(fixture.nativeElement.querySelectorAll('app-technology-prerequisite').length).toBe(0);
    fixture.componentRef.setInput('statusFilter', 'available');
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(gatedGraph, new Set(['First'])));
    fixture.detectChanges();
    expect(fixture.componentInstance.visiblePrerequisites()).toEqual([]);
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(gatedGraph, new Set(['First', 'Second'])));
    fixture.detectChanges();
    expect(fixture.componentInstance.visiblePrerequisites().length).toBe(2);
    for (const selector of ['.desktop-atlas', '.mobile-atlas']) {
      const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(`${selector} app-technology-prerequisite button`);
      expect(buttons.length).toBe(2);
      for (const button of buttons) expect(button.disabled).toBeFalse();
    }
  });

  it('shows locked prerequisites in show-all mode but prevents early completion on desktop and mobile', () => {
    const gatedGraph = buildTechnologyGraph([
      technology('Starting', ['—']),
      technology('Intermediate', ['Starting']),
      technology('Project', ['Intermediate', 'Build a settlement']),
    ]);
    const completed = jasmine.createSpy('completed');
    fixture.componentInstance.prerequisiteCompleted.subscribe(completed);
    fixture.componentRef.setInput('graph', gatedGraph);
    fixture.componentRef.setInput('statusFilter', 'locked');
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(gatedGraph, new Set()));
    fixture.detectChanges();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('app-technology-prerequisite button');
    expect(buttons.length).toBe(2);
    for (const button of buttons) {
      expect(button.disabled).toBeTrue();
      expect(button.classList.contains('locked')).toBeTrue();
      expect(button.textContent).toContain('Research technology prerequisites first');
      button.click();
    }
    expect(completed).not.toHaveBeenCalled();
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(gatedGraph, new Set(['Intermediate'])));
    fixture.detectChanges();
    for (const button of buttons) expect(button.disabled).toBeFalse();
  });

  it('gates shared prerequisite copies and their edges independently at each level', () => {
    const sharedGraph = buildTechnologyGraph([
      technology('Starting', ['—']),
      technology('Early', ['Starting', 'Build a settlement']),
      technology('Intermediate', ['Early']),
      technology('Late', ['Intermediate', 'Build a settlement']),
    ]);
    const prerequisite = sharedGraph.nodes.find(node => node.kind === 'prerequisite')!;
    fixture.componentRef.setInput('graph', sharedGraph);
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(sharedGraph, new Set([prerequisite.refID, 'Early'])));
    fixture.detectChanges();
    expect(fixture.componentInstance.visibleNodes().some(node => node.refID === 'Late')).toBeTrue();
    expect(fixture.componentInstance.visibleNodes().filter(node => node.kind === 'prerequisite').map(node => node.depth)).toEqual([1]);
    expect(fixture.componentInstance.visibleEdges()).toContain({fromId: prerequisite.refID, toId: 'Early'});
    expect(fixture.componentInstance.visibleEdges()).not.toContain({fromId: prerequisite.refID, toId: 'Late'});
    fixture.componentRef.setInput('statusFilter', 'researched');
    fixture.detectChanges();
    expect(fixture.componentInstance.visiblePrerequisites().map(node => node.depth)).toEqual([1]);
    fixture.componentRef.setInput('statusFilter', 'locked');
    fixture.detectChanges();
    expect(fixture.componentInstance.isEdgeComplete({fromId: prerequisite.refID, toId: 'Early'})).toBeTrue();
    expect(fixture.componentInstance.isEdgeComplete({fromId: prerequisite.refID, toId: 'Late'})).toBeFalse();
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(sharedGraph, new Set([prerequisite.refID, 'Early', 'Intermediate'])));
    fixture.componentRef.setInput('statusFilter', 'All');
    fixture.detectChanges();
    expect(fixture.componentInstance.visibleNodes().filter(node => node.kind === 'prerequisite').map(node => node.depth)).toEqual([1, 3]);
    expect(fixture.componentInstance.visibleEdges()).toContain({fromId: prerequisite.refID, toId: 'Late'});
  });

  it('does not reveal a shared prerequisite for a branch whose technology prerequisites are still missing', () => {
    const sharedGraph = buildTechnologyGraph([
      technology('Starting', ['—']),
      technology('First', ['Starting']),
      technology('Second', ['Starting']),
      technology('Structural project', ['First', 'Build a settlement']),
      technology('Combat project', ['Second', 'Build a settlement'], 'Combat'),
    ]);
    fixture.componentRef.setInput('graph', sharedGraph);
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(sharedGraph, new Set(['First'])));
    fixture.detectChanges();
    expect(fixture.componentInstance.visiblePrerequisites().length).toBe(1);
    fixture.componentRef.setInput('filter', 'Combat');
    fixture.detectChanges();
    expect(fixture.componentInstance.visiblePrerequisites()).toEqual([]);
    fixture.componentRef.setInput('researchedIds', researchedTechnologyIds(sharedGraph, new Set(['First', 'Second'])));
    fixture.detectChanges();
    expect(fixture.componentInstance.visiblePrerequisites().length).toBe(1);
  });
});
