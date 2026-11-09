import type {TechnologyCycle} from './technology-cycle.service';

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
  cycle: TechnologyCycle;
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
        return id;
      })
      .filter((id): id is string => !!id),
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

  return {nodes, edges};
}

export function technologyStatus(node: TechnologyNode, researchedIds: ReadonlySet<string>): TechnologyStatus {
  if (researchedIds.has(node.refID)) return 'researched';
  return node.prerequisiteIds.every(id => researchedIds.has(id)) ? 'available' : 'locked';
}

export function technologyFlavour(technology: TechnologyCardDto, status: TechnologyStatus): string {
  return status === 'researched' ? technology.flavorTech?.trim() || technology.flavorProject : technology.flavorProject;
}
