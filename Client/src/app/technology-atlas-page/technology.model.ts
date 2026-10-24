export type TechnologyBranch = 'Structural' | 'Combat';
export type TechnologyStatus = 'researched' | 'available' | 'locked';

export interface TechnologyTextPart {
  type: 'plainText' | 'whitespace' | 'newline' | 'icon' | 'timing' | 'cardRef' | 'bold' | 'italics' | 'keyword';
  value?: string;
  refID?: string;
}

export interface TechnologyTextBlock {
  abilityText: TechnologyTextPart[];
}

export interface TechnologyAbility {
  name?: string;
  type?: string;
  effects: TechnologyTextBlock[];
}

// These are the API fields used by the atlas. requirements may contain comma-separated names.
export interface TechnologyCardDto {
  refID: string;
  name: string;
  techType: TechnologyBranch;
  flavorProject: string;
  flavorTech?: string;
  requirements: string[];
  abilities?: TechnologyAbility[];
  faq?: TechnologyTextBlock[];
  errata?: Record<string, TechnologyTextBlock[] | string>;
}

export interface TechnologyNode extends TechnologyCardDto {
  prerequisiteIds: string[];
  dependentIds: string[];
  depth: number;
  x: number;
  y: number;
}

export interface TechnologyEdge {
  fromId: string;
  toId: string;
}

export interface TechnologyGraph {
  nodes: TechnologyNode[];
  edges: TechnologyEdge[];
}

export function buildTechnologyGraph(cards: TechnologyCardDto[]): TechnologyGraph {
  const byName = new Map(cards.map(card => [card.name.toLocaleLowerCase(), card.refID]));
  if (byName.size !== cards.length || new Set(cards.map(card => card.refID)).size !== cards.length) {
    throw new Error('Technology names and IDs must be unique');
  }
  const nodes: TechnologyNode[] = cards.map(card => ({
    ...card,
    prerequisiteIds: card.requirements
      .flatMap(requirement => requirement.split(','))
      .map(name => name.trim())
      .filter(name => name && name !== '—')
      .map(name => {
        const id = byName.get(name.toLocaleLowerCase());
        if (!id) throw new Error(`Unknown prerequisite ${name} for ${card.name}`);
        return id;
      }),
    dependentIds: [],
    depth: 0,
    x: 0,
    y: 0,
  }));
  const byId = new Map(nodes.map(node => [node.refID, node]));
  const edges: TechnologyEdge[] = [];
  for (const node of nodes) {
    for (const prerequisiteId of node.prerequisiteIds) {
      byId.get(prerequisiteId)!.dependentIds.push(node.refID);
      edges.push({fromId: prerequisiteId, toId: node.refID});
    }
  }

  const visiting = new Set<string>();
  const depthOf = (node: TechnologyNode): number => {
    if (visiting.has(node.refID)) throw new Error(`Technology prerequisite cycle at ${node.name}`);
    if (node.depth) return node.depth;
    visiting.add(node.refID);
    node.depth = node.prerequisiteIds.length
      ? 1 + Math.max(...node.prerequisiteIds.map(id => depthOf(byId.get(id)!)))
      : 1;
    visiting.delete(node.refID);
    return node.depth;
  };
  nodes.forEach(depthOf);

  // Place each prerequisite tier in a column. Keep children near their parents
  // regardless of technology type, then separate cards sharing a column.
  const maxDepth = Math.max(0, ...nodes.map(node => node.depth));
  for (let depth = 1; depth <= maxDepth; depth++) {
    const column = nodes.filter(node => node.depth === depth).map((node, index) => ({
      node,
      index,
      targetY: node.prerequisiteIds.length
        ? node.prerequisiteIds.reduce((sum, id) => sum + byId.get(id)!.y, 0) / node.prerequisiteIds.length
        : 350,
    })).sort((a, b) => a.targetY - b.targetY || a.index - b.index);
    const positions: number[] = [];
    for (const item of column) {
      positions.push(Math.max(item.targetY, (positions[positions.length - 1] ?? -Infinity) + 158));
    }
    const targetCenter = column.reduce((sum, item) => sum + item.targetY, 0) / column.length;
    const positionCenter = positions.reduce((sum, y) => sum + y, 0) / positions.length;
    const offset = Math.max(targetCenter - positionCenter, 70 - positions[0]);
    column.forEach(({node}, index) => {
      node.x = 80 + (depth - 1) * 270;
      node.y = positions[index] + offset;
    });
  }
  return {nodes, edges};
}

export function technologyStatus(node: TechnologyNode, researchedIds: ReadonlySet<string>): TechnologyStatus {
  if (researchedIds.has(node.refID)) return 'researched';
  return node.prerequisiteIds.every(id => researchedIds.has(id)) ? 'available' : 'locked';
}

export function technologyFlavour(technology: TechnologyCardDto, status: TechnologyStatus): string {
  return status === 'researched' ? technology.flavorTech?.trim() || technology.flavorProject : technology.flavorProject;
}
