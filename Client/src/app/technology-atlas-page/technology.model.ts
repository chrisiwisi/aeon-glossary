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

interface TechnologyTreeNodeBase {
  refID: string;
  name: string;
  prerequisiteIds: string[];
  dependentIds: string[];
  depth: number;
  x: number;
  y: number;
}

export interface TechnologyNode extends TechnologyCardDto, TechnologyTreeNodeBase {
  kind: 'technology';
}

export interface TechnologyPrerequisiteNode extends TechnologyTreeNodeBase {
  kind: 'prerequisite';
}

export type TechnologyTreeNode = TechnologyNode | TechnologyPrerequisiteNode;

export interface TechnologyEdge {
  fromId: string;
  toId: string;
}

export interface TechnologyGraph {
  nodes: TechnologyTreeNode[];
  edges: TechnologyEdge[];
}

function prerequisiteNames(card: TechnologyCardDto): string[] {
  return card.requirements
    .flatMap(requirement => requirement.split(','))
    .map(name => name.trim())
    .filter(name => name && name !== '—' && !/^None\s*—\s*starting technology$/i.test(name.replace(/\*\*/g, '')));
}

export function isStartingTechnology(card: TechnologyCardDto): boolean {
  return prerequisiteNames(card).length === 0;
}

export function researchedTechnologyIds(graph: TechnologyGraph, completedIds: ReadonlySet<string>): ReadonlySet<string> {
  return new Set(graph.nodes
    .filter(node => completedIds.has(node.refID) || (node.kind === 'technology' && isStartingTechnology(node)))
    .map(node => node.refID));
}

export function buildTechnologyGraph(cards: TechnologyCardDto[]): TechnologyGraph {
  const byName = new Map(cards.map(card => [card.name.toLocaleLowerCase(), card.refID]));
  if (byName.size !== cards.length || new Set(cards.map(card => card.refID)).size !== cards.length) {
    throw new Error('Technology names and IDs must be unique');
  }
  const nodes: TechnologyTreeNode[] = cards.map(card => ({
    ...card,
    kind: 'technology',
    prerequisiteIds: [],
    dependentIds: [],
    depth: 0,
    x: 0,
    y: 0,
  }));
  const byId = new Map(nodes.map(node => [node.refID, node]));
  for (const card of cards) {
    const node = byId.get(card.refID)!;
    for (const name of prerequisiteNames(card)) {
      const normalizedName = name.toLocaleLowerCase();
      const id = byName.get(normalizedName) ?? `prerequisite:${card.cycle}:${normalizedName}`;
      if (!byId.has(id)) {
        const prerequisite: TechnologyPrerequisiteNode = {
          kind: 'prerequisite', refID: id, name,
          prerequisiteIds: [], dependentIds: [], depth: 0, x: 0, y: 0,
        };
        nodes.push(prerequisite);
        byId.set(id, prerequisite);
      }
      if (!node.prerequisiteIds.includes(id)) node.prerequisiteIds.push(id);
    }
  }
  const edges: TechnologyEdge[] = [];
  for (const node of nodes) {
    for (const prerequisiteId of node.prerequisiteIds) {
      byId.get(prerequisiteId)!.dependentIds.push(node.refID);
      edges.push({fromId: prerequisiteId, toId: node.refID});
    }
  }

  const visiting = new Set<string>();
  const depthOf = (node: TechnologyTreeNode): number => {
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

export function technologyStatus(
  node: TechnologyTreeNode,
  researchedIds: ReadonlySet<string>,
  graph: TechnologyGraph,
  branch?: TechnologyBranch,
): TechnologyStatus {
  if (node.kind === 'prerequisite') {
    const byId = new Map(graph.nodes.map(candidate => [candidate.refID, candidate]));
    const ready = node.dependentIds.some(id => {
      const dependent = byId.get(id);
      return dependent?.kind === 'technology' && (!branch || dependent.techType === branch)
        && dependent.prerequisiteIds.every(prerequisiteId =>
          byId.get(prerequisiteId)?.kind === 'prerequisite' || researchedIds.has(prerequisiteId));
    });
    if (!ready) return 'locked';
  }
  if (researchedIds.has(node.refID)) return 'researched';
  return node.prerequisiteIds.every(id => researchedIds.has(id)) ? 'available' : 'locked';
}

export function technologyFlavour(technology: TechnologyCardDto, status: TechnologyStatus): string {
  return status === 'researched' ? technology.flavorTech?.trim() || technology.flavorProject : technology.flavorProject;
}
