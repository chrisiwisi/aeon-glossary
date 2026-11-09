import {buildTechnologyGraph, isStartingTechnology, researchedTechnologyIds, TechnologyCardDto, technologyStatus} from './technology.model';

function technology(name: string, requirements: string[] = []): TechnologyCardDto {
  return {refID: name, name, requirements, cycle: 'Cycle I', techType: 'Structural', flavorProject: name};
}

describe('technology prerequisites', () => {
  it('recognizes starting technologies without treating non-technology requirements as starting technologies', () => {
    for (const requirements of [[], ['—'], ['  —  ', ''], ['None — starting technology'], ['**None — starting technology**']]) {
      expect(isStartingTechnology(technology('Starting', requirements))).toBeTrue();
    }
    expect(isStartingTechnology(technology('Project', ['Defeat a level 1 Primordial']))).toBeFalse();
    expect(isStartingTechnology(technology('Project', ['Starting']))).toBeFalse();
  });

  it('defaults starting technologies to researched and immediately unlocks their dependents', () => {
    const graph = buildTechnologyGraph([
      technology('Starting', ['—']),
      technology('Next', ['Starting']),
      technology('Later', ['Next']),
    ]);
    const researched = researchedTechnologyIds(graph, new Set());
    expect([...researched]).toEqual(['Starting']);
    expect(graph.nodes.map(node => technologyStatus(node, researched, graph))).toEqual(['researched', 'available', 'locked']);
  });

  it('retains saved research while applying starting defaults to existing sessions', () => {
    const graph = buildTechnologyGraph([technology('Starting', ['—']), technology('Next', ['Starting'])]);
    const researched = researchedTechnologyIds(graph, new Set(['Next']));
    expect([...researched]).toEqual(['Starting', 'Next']);
  });

  it('creates a separate node and edge for every non-technology prerequisite', () => {
    const graph = buildTechnologyGraph([
      technology('Starting', ['—']),
      technology('Project', ['Starting, Defeat a level 1 Primordial', 'Build a settlement']),
    ]);
    const project = graph.nodes.find(node => node.name === 'Project')!;
    const prerequisites = graph.nodes.filter(node => node.kind === 'prerequisite');
    expect(prerequisites.map(node => node.name)).toEqual(['Defeat a level 1 Primordial', 'Build a settlement']);
    expect(project.prerequisiteIds).toEqual(['Starting', ...prerequisites.map(node => node.refID)]);
    expect(project.depth).toBe(2);
    for (const node of prerequisites) {
      expect(node.dependentIds).toEqual(['Project']);
      expect(graph.edges).toContain({fromId: node.refID, toId: 'Project'});
      expect(technologyStatus(node, researchedTechnologyIds(graph, new Set()), graph)).toBe('available');
    }
  });

  it('keeps projects locked until both technology and non-technology prerequisites are complete', () => {
    const graph = buildTechnologyGraph([
      technology('Starting', ['—']),
      technology('Intermediate', ['Starting']),
      technology('Project', ['Intermediate', 'Build a settlement']),
    ]);
    const project = graph.nodes.find(node => node.name === 'Project')!;
    const prerequisite = graph.nodes.find(node => node.kind === 'prerequisite')!;
    const researched = researchedTechnologyIds(graph, new Set());
    expect(technologyStatus(project, researched, graph)).toBe('locked');
    expect(technologyStatus(prerequisite, researched, graph)).toBe('locked');
    const completed = new Set([...researched, 'Intermediate']);
    expect(technologyStatus(prerequisite, completed, graph)).toBe('available');
    expect(technologyStatus(project, completed, graph)).toBe('locked');
    completed.add(prerequisite.refID);
    expect(technologyStatus(prerequisite, completed, graph)).toBe('researched');
    expect(technologyStatus(project, completed, graph)).toBe('available');
  });

  it('shares repeated prerequisites across branches without duplicate edges', () => {
    const graph = buildTechnologyGraph([
      technology('First', ['Build a settlement, build a settlement']),
      {...technology('Second', [' BUILD A SETTLEMENT ']), techType: 'Combat'},
    ]);
    const prerequisites = graph.nodes.filter(node => node.kind === 'prerequisite');
    expect(prerequisites.length).toBe(1);
    expect(prerequisites[0].dependentIds).toEqual(['First', 'Second']);
    expect(graph.edges.length).toBe(2);
    const researched = researchedTechnologyIds(graph, new Set([prerequisites[0].refID]));
    expect(graph.nodes.filter(node => node.kind === 'technology').map(node => technologyStatus(node, researched, graph)))
      .toEqual(['available', 'available']);
  });

  it('requires all technology prerequisites but does not gate special prerequisites behind each other', () => {
    const graph = buildTechnologyGraph([
      technology('Starting', ['—']),
      technology('First', ['Starting']),
      technology('Second', ['Starting']),
      technology('Project', ['First, Second', 'Build a settlement', 'Win a battle']),
    ]);
    const prerequisites = graph.nodes.filter(node => node.kind === 'prerequisite');
    const completed = new Set(researchedTechnologyIds(graph, new Set()));
    for (const prerequisite of prerequisites) {
      expect(technologyStatus(prerequisite, completed, graph)).toBe('locked');
    }
    completed.add('First');
    for (const prerequisite of prerequisites) {
      expect(technologyStatus(prerequisite, completed, graph)).toBe('locked');
    }
    completed.add('Second');
    for (const prerequisite of prerequisites) {
      expect(technologyStatus(prerequisite, completed, graph)).toBe('available');
    }
  });

  it('keeps saved special completion locked until the technology prerequisites are researched', () => {
    const graph = buildTechnologyGraph([
      technology('Starting', ['—']),
      technology('Intermediate', ['Starting']),
      technology('Project', ['Intermediate', 'Build a settlement']),
    ]);
    const prerequisite = graph.nodes.find(node => node.kind === 'prerequisite')!;
    const completed = new Set(researchedTechnologyIds(graph, new Set([prerequisite.refID])));
    expect(technologyStatus(prerequisite, completed, graph)).toBe('locked');
    completed.add('Intermediate');
    expect(technologyStatus(prerequisite, completed, graph)).toBe('researched');
  });

  it('allows shared prerequisites when any dependent is ready, respecting branch context', () => {
    const graph = buildTechnologyGraph([
      technology('Starting', ['—']),
      technology('First', ['Starting']),
      technology('Second', ['Starting']),
      technology('Structural project', ['First', 'Build a settlement']),
      {...technology('Combat project', ['Second', 'Build a settlement']), techType: 'Combat'},
    ]);
    const prerequisite = graph.nodes.find(node => node.kind === 'prerequisite')!;
    const completed = researchedTechnologyIds(graph, new Set(['First']));
    expect(technologyStatus(prerequisite, completed, graph)).toBe('available');
    expect(technologyStatus(prerequisite, completed, graph, 'Structural')).toBe('available');
    expect(technologyStatus(prerequisite, completed, graph, 'Combat')).toBe('locked');
  });

  it('gives prerequisites stable, cycle-specific IDs independent of card order', () => {
    const first = technology('First', ['Build a settlement']);
    const second = technology('Second', ['build a settlement']);
    const prerequisiteId = (cards: TechnologyCardDto[]) => buildTechnologyGraph(cards).nodes
      .find(node => node.kind === 'prerequisite')!.refID;
    expect(prerequisiteId([first, second])).toBe(prerequisiteId([second, first]));
    expect(prerequisiteId([first])).not.toBe(prerequisiteId([{...first, cycle: 'Cycle II'}]));
  });

  it('continues to reject duplicate technologies and prerequisite cycles', () => {
    expect(() => buildTechnologyGraph([technology('Same'), technology('Same')])).toThrowError(/unique/);
    expect(() => buildTechnologyGraph([technology('First', ['Second']), technology('Second', ['First'])]))
      .toThrowError(/cycle/);
  });
});
