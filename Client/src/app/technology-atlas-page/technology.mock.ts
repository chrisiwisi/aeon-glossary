import {TechnologyCardDto} from './technology.model';
import {MOCK_ABILITIES} from './technology-abilities.mock';

// Adapted from the Odyssey Cycle I API cards. The two combat roots use the
// displayed Excursion Propylon II card as their prerequisite for this mock atlas.
// Combat facility cards lack flavorTech in the API, so theirs is mock copy.
const MOCK_CARDS: TechnologyCardDto[] = [
  {refID: 'o.1.structural.4', name: 'Argo Works', techType: 'Structural', flavorProject: 'Set up a production hub aboard the Argo and restore its dormant systems.', flavorTech: 'Smiths and priests develop new gear and engineering solutions aboard the Argo.', requirements: ['—']},
  {refID: 'o.1.structural.6', name: 'Trading Solutions', techType: 'Structural', flavorProject: 'Strengthen our connection to the people of Crete.', flavorTech: 'A small dock welcomes traders and strengthens ties across the island.', requirements: ['Argo Works']},
  {refID: 'o.1.structural.8', name: 'Shallows Navigation', techType: 'Structural', flavorProject: 'Restore the Argo’s shallow water navigation systems.', flavorTech: 'The Argo rises above the waterline and glides across shallow rivers.', requirements: ['Trading Solutions']},
  {refID: 'o.1.structural.10', name: 'Diplomatic Relations', techType: 'Structural', flavorProject: 'Learn about the island and forge new alliances.', flavorTech: 'Envoys establish the Argo’s presence on the island.', requirements: ['Trading Solutions']},
  {refID: 'o.1.structural.24', name: 'Crew Expansion', techType: 'Structural', flavorProject: 'Recruit new crew members for the journey ahead.', flavorTech: 'New recruits join the Argo in search of shelter and a warm meal.', requirements: ['Trading Solutions']},
  {refID: 'o.1.structural.17', name: 'Excursion Propylon II', techType: 'Structural', flavorProject: 'Raise the Argo to meet the growing Primordial threat.', flavorTech: 'The rebuilt Propylon gives the Argo a greater presence in battle.', requirements: ['Shallows Navigation']},
  {refID: 'o.1.facility.1', name: 'Trireme Armor', techType: 'Combat', flavorProject: 'Create armor strong enough to withstand a Primordial attack.', flavorTech: 'Trireme armorsmiths equip warriors for encounters with the Primordials.', requirements: ['Excursion Propylon II']},
  {refID: 'o.1.facility.6', name: 'Trireme Weapons', techType: 'Combat', flavorProject: 'Build weapons that can penetrate Primordial defenses.', flavorTech: 'Trireme weaponsmiths forge arms for the Titans.', requirements: ['Excursion Propylon II']},
  {refID: 'o.1.facility.9', name: 'Trireme Ranged Weapons', techType: 'Combat', flavorProject: 'Put war trireme equipment to use at range.', flavorTech: 'Trireme bowyers supply ranged arms for the Titans.', requirements: ['Trireme Weapons, Trireme Armor']},
  {refID: 'o.1.facility.2', name: 'Siren Armor', techType: 'Combat', flavorProject: 'Shape hardened AE-siren shells into defensive armor.', flavorTech: 'Siren armor sculptors shape hard shells into protective armor.', requirements: ['Trireme Ranged Weapons']},
  {refID: 'o.1.facility.7', name: 'Advanced Trireme Weapons', techType: 'Combat', flavorProject: 'Strike harder and faster with Poseidon’s bounty.', flavorTech: 'Trireme bone carvers refine heavier weapons for the Titans.', requirements: ['Siren Armor']},
];

export const MOCK_TECHNOLOGIES: TechnologyCardDto[] = MOCK_CARDS.map(card => ({
  ...card,
  abilities: MOCK_ABILITIES[card.refID] ?? [],
}));
