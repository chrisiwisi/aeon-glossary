import type { TechnologyGraph, TechnologyTreeNode } from '../technology.model';

export const TECHNOLOGY_CARD_WIDTH = 220;
export const TECHNOLOGY_CARD_HEIGHT = 150;
export const PREREQUISITE_CARD_HEIGHT = 110;
const COLUMN_GAP = 100;
const ROW_GAP = 48;
const LEFT_PADDING = 80;
const TOP_PADDING = 80;

interface LayoutVertex {
  node?: TechnologyTreeNode;
  layer: number;
  height: number;
  center: number;
  parents: LayoutVertex[];
  children: LayoutVertex[];
}

export interface TechnologyTreeLayout {
  nodes: TechnologyTreeNode[];
  edgePaths: ReadonlyMap<string, ReadonlyMap<string, string>>;
  width: number;
  height: number;
}

function crossingCount(layers: LayoutVertex[][]): number {
  let crossings = 0;
  for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
    const positions = new Map(layers[layerIndex + 1].map((vertex, index) => [vertex, index]));
    const layer = layers[layerIndex];
    for (let firstIndex = 0; firstIndex < layer.length; firstIndex++) {
      for (let secondIndex = firstIndex + 1; secondIndex < layer.length; secondIndex++) {
        for (const firstChild of layer[firstIndex].children) {
          for (const secondChild of layer[secondIndex].children) {
            if (positions.get(firstChild)! > positions.get(secondChild)!) crossings++;
          }
        }
      }
    }
  }
  return crossings;
}

function orderLayer(layer: LayoutVertex[], adjacent: LayoutVertex[], forward: boolean): void {
  const positions = new Map(adjacent.map((vertex, index) => [vertex, index]));
  const scores = new Map(layer.map((vertex, index) => {
    const neighbours = forward ? vertex.parents : vertex.children;
    const score = neighbours.length
      ? neighbours.reduce((sum, neighbour) => sum + positions.get(neighbour)!, 0) / neighbours.length
      : index;
    return [vertex, score];
  }));
  layer.sort((first, second) => scores.get(first)! - scores.get(second)!);
}

function positionLayer(layer: LayoutVertex[], forward: boolean): void {
  const targets = layer.map(vertex => {
    const neighbours = forward ? vertex.parents : vertex.children;
    return neighbours.length
      ? neighbours.reduce((sum, neighbour) => sum + neighbour.center, 0) / neighbours.length
      : vertex.center;
  });
  let bottom = -Infinity;
  layer.forEach((vertex, index) => {
    vertex.center = Math.max(targets[index], bottom + ROW_GAP + vertex.height / 2);
    bottom = vertex.center + vertex.height / 2;
  });
  if (!layer.length) return;
  const offset = targets.reduce((sum, target, index) => sum + target - layer[index].center, 0) / layer.length;
  layer.forEach(vertex => vertex.center += offset);
}

function columnLeft(vertex: LayoutVertex): number {
  return LEFT_PADDING + vertex.layer * (TECHNOLOGY_CARD_WIDTH + COLUMN_GAP);
}

function port(vertex: LayoutVertex, neighbour: LayoutVertex, outgoing: boolean): number {
  if (!vertex.node) return vertex.center;
  const neighbours = [...(outgoing ? vertex.children : vertex.parents)].sort((first, second) => first.center - second.center);
  return vertex.center - vertex.height / 2 + vertex.height * (neighbours.indexOf(neighbour) + 1) / (neighbours.length + 1);
}

export function layoutTechnologyTree(
  graph: TechnologyGraph,
  cardHeights: ReadonlyMap<string, number> = new Map(),
): TechnologyTreeLayout {
  const graphById = new Map(graph.nodes.map(node => [node.refID, node]));
  const layoutNodes = graph.nodes.flatMap(node => {
    if (node.kind === 'technology' || !node.dependentIds.length) return [node];
    const depths = new Set(node.dependentIds.map(id => graphById.get(id)!.depth - 1));
    return [...depths].map(depth => ({
      ...node,
      depth,
      dependentIds: node.dependentIds.filter(id => graphById.get(id)!.depth === depth + 1),
    }));
  });
  const layerCount = Math.max(0, ...layoutNodes.map(node => node.depth));
  let layers: LayoutVertex[][] = Array.from({length: layerCount}, () => []);
  const byId = new Map<string, LayoutVertex[]>();
  for (const node of layoutNodes) {
    const vertex: LayoutVertex = {
      node,
      layer: node.depth - 1,
      height: cardHeights.get(node.refID) ?? (node.kind === 'prerequisite' ? PREREQUISITE_CARD_HEIGHT : TECHNOLOGY_CARD_HEIGHT),
      center: 0,
      parents: [],
      children: [],
    };
    layers[vertex.layer].push(vertex);
    if (!byId.has(node.refID)) byId.set(node.refID, []);
    byId.get(node.refID)!.push(vertex);
  }

  const routes = graph.edges.map(edge => {
    const target = byId.get(edge.toId)![0];
    const source = byId.get(edge.fromId)!.find(vertex => vertex.node!.kind === 'technology' || vertex.layer === target.layer - 1)!;
    const vertices = [source];
    for (let layer = source.layer + 1; layer < target.layer; layer++) {
      const vertex: LayoutVertex = {layer, height: 12, center: 0, parents: [], children: []};
      layers[layer].push(vertex);
      vertices.push(vertex);
    }
    vertices.push(target);
    for (let index = 1; index < vertices.length; index++) {
      vertices[index - 1].children.push(vertices[index]);
      vertices[index].parents.push(vertices[index - 1]);
    }
    return {edge, vertices};
  });

  let bestLayers = layers.map(layer => [...layer]);
  let fewestCrossings = crossingCount(layers);
  for (let sweep = 0; sweep < 8 && fewestCrossings > 0; sweep++) {
    for (let layer = 1; layer < layers.length; layer++) {
      orderLayer(layers[layer], layers[layer - 1], true);
    }
    let crossings = crossingCount(layers);
    if (crossings < fewestCrossings) {
      bestLayers = layers.map(layer => [...layer]);
      fewestCrossings = crossings;
    }
    for (let layer = layers.length - 2; layer >= 0; layer--) {
      orderLayer(layers[layer], layers[layer + 1], false);
    }
    crossings = crossingCount(layers);
    if (crossings < fewestCrossings) {
      bestLayers = layers.map(layer => [...layer]);
      fewestCrossings = crossings;
    }
  }
  layers = bestLayers;

  for (const layer of layers) {
    let bottom = 0;
    for (const vertex of layer) {
      vertex.center = bottom + vertex.height / 2;
      bottom += vertex.height + ROW_GAP;
    }
  }
  for (let sweep = 0; sweep < 4; sweep++) {
    for (let layer = 1; layer < layers.length; layer++) positionLayer(layers[layer], true);
    for (let layer = layers.length - 2; layer >= 0; layer--) positionLayer(layers[layer], false);
  }
  const vertices = layers.flat();
  const top = Math.min(0, ...vertices.map(vertex => vertex.center - vertex.height / 2));
  vertices.forEach(vertex => vertex.center += TOP_PADDING - top);

  const nodes = layoutNodes.map(node => {
    const vertex = byId.get(node.refID)!.find(candidate => candidate.layer === node.depth - 1)!;
    return {...node, x: columnLeft(vertex), y: vertex.center - vertex.height / 2};
  });
  const edgePaths = new Map<string, Map<string, string>>();
  for (const {edge, vertices: route} of routes) {
    let path = `M ${columnLeft(route[0]) + TECHNOLOGY_CARD_WIDTH} ${port(route[0], route[1], true)}`;
    for (let index = 1; index < route.length; index++) {
      const previous = route[index - 1];
      const current = route[index];
      const startX = columnLeft(previous) + TECHNOLOGY_CARD_WIDTH;
      const startY = port(previous, current, true);
      const endX = columnLeft(current);
      const endY = port(current, previous, false);
      path += ` C ${startX + COLUMN_GAP / 2} ${startY}, ${endX - COLUMN_GAP / 2} ${endY}, ${endX} ${endY}`;
      if (!current.node) path += ` L ${endX + TECHNOLOGY_CARD_WIDTH} ${endY}`;
    }
    if (!edgePaths.has(edge.fromId)) edgePaths.set(edge.fromId, new Map());
    edgePaths.get(edge.fromId)!.set(edge.toId, path);
  }
  return {
    nodes,
    edgePaths,
    width: Math.max(1100, LEFT_PADDING + layerCount * (TECHNOLOGY_CARD_WIDTH + COLUMN_GAP)),
    height: Math.max(750, ...vertices.map(vertex => vertex.center + vertex.height / 2 + TOP_PADDING)),
  };
}
