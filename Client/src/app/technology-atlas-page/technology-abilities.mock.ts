import {TechnologyAbility} from './technology.model';

// Ability content from the selected Odyssey technology API cards.
export const MOCK_ABILITIES: Record<string, TechnologyAbility[]> = {
  "o.1.structural.4": [
    {
      "name": "Craft Gear",
      "type": "Reference",
      "effects": [
        {
          "abilityText": [
            {
              "type": "plainText",
              "value": "During the Advancement Step, you can use available resources to craft"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "icon",
              "value": "Gear"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "cards using Production Technologies"
            }
          ]
        }
      ]
    }
  ],
  "o.1.structural.6": [
    {
      "name": "Theban Trader",
      "type": "Immediate",
      "effects": [
        {
          "abilityText": [
            {
              "type": "plainText",
              "value": "Add the Theban Trader Exploration card to the Exploration deck"
            }
          ]
        }
      ]
    },
    {
      "name": "Port Trading",
      "type": "City Negotiation",
      "effects": [
        {
          "abilityText": [
            {
              "type": "plainText",
              "value": "Gain +1"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "icon",
              "value": "ArgoFate"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "to exchange (up to 3 times):"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "newline"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "3 Trireme"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "1 Armament"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "newline"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "2 Trireme"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "1 Monument"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "newline"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "1 Monument"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "2 Trireme"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "newline"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "1 Armament"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "3 Trireme"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "newline"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "1 Muscle Cluster or Infused Mechanism"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "3 Raw Ambrosia"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "newline"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "1 Calcified Knuckle Bone or Fleshy Mantle"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "4 Raw Ambrosia"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "newline"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "3 Raw Ambrosia"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "1 Muscle Cluster or Infused Mechanism"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "newline"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "4 Raw Ambrosia"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "1 Calcified Knuckle Bone or Fleshy Mantle"
            }
          ]
        }
      ]
    }
  ],
  "o.1.structural.8": [
    {
      "name": "Shallows Navigation",
      "type": "Permanent",
      "effects": [
        {
          "abilityText": [
            {
              "type": "plainText",
              "value": "You can move through"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "icon",
              "value": "Lock"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "waterways with the River"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "icon",
              "value": "River"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "symbol"
            }
          ]
        }
      ]
    }
  ],
  "o.1.structural.10": [
    {
      "name": "Diplomatic Corps",
      "type": "City Negotiation",
      "effects": [
        {
          "abilityText": [
            {
              "type": "plainText",
              "value": "Lose 4 Mortal resources of your choosing and gain +1"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "icon",
              "value": "ArgoFate"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "to gain +1 Diplomacy with the Local Faction"
            }
          ]
        }
      ]
    }
  ],
  "o.1.structural.24": [
    {
      "name": "Port Recruitment",
      "type": "City Negotiation",
      "effects": [
        {
          "abilityText": [
            {
              "type": "plainText",
              "value": "Gain +1"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "icon",
              "value": "ArgoFate"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "and +1"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "icon",
              "value": "Strangers"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "plainText",
              "value": "to gain +1"
            },
            {
              "type": "whitespace",
              "value": " "
            },
            {
              "type": "icon",
              "value": "Crew"
            }
          ]
        }
      ]
    }
  ],
  "o.1.structural.17": [
    {
      "name": "Argo Support II",
      "type": "Permanent",
      "effects": [
        {
          "abilityText": [
            {
              "type": "plainText",
              "value": "AA Limit: 3"
            }
          ]
        }
      ]
    }
  ]
};
