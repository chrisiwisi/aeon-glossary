import { buildTechnologyGraph, TechnologyCardDto } from '../technology.model';
import { layoutTechnologyTree, TECHNOLOGY_CARD_HEIGHT, TECHNOLOGY_CARD_WIDTH } from './technology-tree.layout';

function technology(name: string, requirements: string[] = []): TechnologyCardDto {
  return {
    refID: name,
    name,
    requirements,
    cycle: 'Cycle I',
    techType: 'Structural',
    flavorProject: name,
  };
}

function samplePath(path: string): {x: number; y: number}[] {
  const tokens = path.match(/[MCL]|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g)!;
  const points: {x: number; y: number}[] = [];
  let start = {x: 0, y: 0};
  let index = 0;
  const readPoint = () => ({x: Number(tokens[index++]), y: Number(tokens[index++])});
  while (index < tokens.length) {
    const command = tokens[index++];
    if (command === 'M') {
      start = readPoint();
      points.push(start);
      continue;
    }
    const first = readPoint();
    const second = command === 'C' ? readPoint() : first;
    const end = command === 'C' ? readPoint() : first;
    for (let step = 1; step <= 100; step++) {
      const progress = step / 100;
      const remaining = 1 - progress;
      points.push(command === 'C' ? {
        x: remaining ** 3 * start.x + 3 * remaining ** 2 * progress * first.x + 3 * remaining * progress ** 2 * second.x + progress ** 3 * end.x,
        y: remaining ** 3 * start.y + 3 * remaining ** 2 * progress * first.y + 3 * remaining * progress ** 2 * second.y + progress ** 3 * end.y,
      } : {
        x: start.x + progress * (end.x - start.x),
        y: start.y + progress * (end.y - start.y),
      });
    }
    start = end;
  }
  return points;
}

describe('layoutTechnologyTree', () => {
  it('handles an empty graph without invalid coordinates', () => {
    expect(layoutTechnologyTree(buildTechnologyGraph([]))).toEqual({
      nodes: [],
      edgePaths: new Map(),
      width: 1100,
      height: 750,
    });
  });

  it('places every technology after all of its prerequisites', () => {
    const graph = buildTechnologyGraph([
      technology('Root'),
      technology('Intermediate', ['Root']),
      technology('Final', ['Root, Intermediate']),
    ]);
    const layout = layoutTechnologyTree(graph);
    for (const edge of graph.edges) {
      const source = layout.nodes.find(node => node.refID === edge.fromId)!;
      const target = layout.nodes.find(node => node.refID === edge.toId)!;
      expect(target.x).toBeGreaterThan(source.x + TECHNOLOGY_CARD_WIDTH);
    }
  });

  it('reorders layers to remove avoidable crossings', () => {
    const graph = buildTechnologyGraph([
      technology('First root'),
      technology('Second root'),
      technology('Second child', ['Second root']),
      technology('First child', ['First root']),
    ]);
    const layout = layoutTechnologyTree(graph);
    const center = (name: string) => layout.nodes.find(node => node.name === name)!.y + TECHNOLOGY_CARD_HEIGHT / 2;
    expect((center('First root') - center('Second root')) * (center('First child') - center('Second child'))).toBeGreaterThan(0);
  });

  it('uses measured heights to keep tall cards separated and inside the canvas', () => {
    const graph = buildTechnologyGraph(Array.from({length: 6}, (_, index) => technology(`Root ${index}`)));
    const heights = new Map(graph.nodes.map((node, index) => [node.refID, 200 + index * 75]));
    const layout = layoutTechnologyTree(graph, heights);
    const column = [...layout.nodes].sort((first, second) => first.y - second.y);
    column.forEach((node, index) => {
      expect(node.y).toBeGreaterThanOrEqual(80);
      expect(node.y + heights.get(node.refID)!).toBeLessThan(layout.height);
      expect(node.x + TECHNOLOGY_CARD_WIDTH).toBeLessThan(layout.width);
      if (index) {
        const previous = column[index - 1];
        expect(node.y - previous.y - heights.get(previous.refID)!).toBeGreaterThanOrEqual(48);
      }
    });
  });

  it('routes long edges through reserved slots instead of intervening cards', () => {
    const graph = buildTechnologyGraph([
      technology('Root'),
      technology('Other root'),
      technology('Middle', ['Root']),
      technology('Other middle', ['Other root']),
      technology('Later', ['Middle']),
      technology('Final', ['Root', 'Later', 'Other middle']),
    ]);
    const heights = new Map(graph.nodes.map((node, index) => [node.refID, 180 + index * 60]));
    const layout = layoutTechnologyTree(graph, heights);
    expect(layout.edgePaths.get('Root')!.get('Final')).toContain(' L ');
    for (const edge of graph.edges) {
      const points = samplePath(layout.edgePaths.get(edge.fromId)!.get(edge.toId)!);
      for (const node of layout.nodes) {
        if (node.refID === edge.fromId || node.refID === edge.toId) continue;
        const overlaps = points.some(point => point.x > node.x - 4 && point.x < node.x + TECHNOLOGY_CARD_WIDTH + 4
          && point.y > node.y - 4 && point.y < node.y + heights.get(node.refID)! + 4);
        expect(overlaps).withContext(`${edge.fromId} → ${edge.toId} overlaps ${node.refID}`).toBeFalse();
      }
    }
  });

  it('gives fan-out and fan-in edges separate attachment points', () => {
    const graph = buildTechnologyGraph([
      technology('Root'),
      technology('Upper', ['Root']),
      technology('Lower', ['Root']),
      technology('Join', ['Upper', 'Lower']),
    ]);
    const layout = layoutTechnologyTree(graph);
    const upperPath = samplePath(layout.edgePaths.get('Root')!.get('Upper')!);
    const lowerPath = samplePath(layout.edgePaths.get('Root')!.get('Lower')!);
    expect(upperPath[0].y).not.toEqual(lowerPath[0].y);
    const upperJoin = samplePath(layout.edgePaths.get('Upper')!.get('Join')!);
    const lowerJoin = samplePath(layout.edgePaths.get('Lower')!.get('Join')!);
    expect(upperJoin[upperJoin.length - 1].y).not.toEqual(lowerJoin[lowerJoin.length - 1].y);
  });

  it('reflows after card heights change without mutating graph data', () => {
    const graph = buildTechnologyGraph([technology('First'), technology('Second')]);
    const original = JSON.stringify(graph);
    const initial = layoutTechnologyTree(graph);
    const heights = new Map([['First', 600], ['Second', 300]]);
    const resized = layoutTechnologyTree(graph, heights);
    expect(resized.nodes[1].y - resized.nodes[0].y).toBeGreaterThanOrEqual(648);
    expect(resized.height).toBeGreaterThan(initial.height);
    expect(JSON.stringify(graph)).toEqual(original);
    expect(layoutTechnologyTree(graph, heights)).toEqual(resized);
  });

  it('retains a route for every edge in a graph with unavoidable crossings', () => {
    const cards = ['First', 'Second', 'Third'].map(name => technology(name));
    cards.push(...['Upper', 'Middle', 'Lower'].map(name => technology(name, ['First, Second, Third'])));
    const graph = buildTechnologyGraph(cards);
    const layout = layoutTechnologyTree(graph);
    for (const edge of graph.edges) {
      const path = layout.edgePaths.get(edge.fromId)!.get(edge.toId)!;
      expect(path).toMatch(/^M /);
      expect(path).not.toMatch(/NaN|Infinity/);
    }
  });
});
