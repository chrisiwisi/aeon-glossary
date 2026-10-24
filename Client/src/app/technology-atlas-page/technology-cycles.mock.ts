import {TechnologyCardDto} from './technology.model';

// Selected linked cards adapted from the Odyssey technology API for each later cycle.
export const MOCK_OTHER_CYCLE_TECHNOLOGIES: TechnologyCardDto[] = [
  {
    "refID": "o.2.structural.5",
    "cycle": "Cycle II",
    "name": "Argo Works II",
    "techType": "Structural",
    "flavorProject": "Alkibiades Argo Works is the living, beating heart of the ship. This is where dreams become reality",
    "flavorTech": "To stand a chance against the Primordials, the smiths and priests of the Argo work tirelessly on new types of gear and new engineering solutions",
    "requirements": [
      "—"
    ],
    "abilities": [
      {
        "name": "Abyss Power",
        "type": "Reference",
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "When instructed to apply Ascendency rules, all Gear cards with a Power Level lower than II (and without the Ascended keyword) incur the following penalties for the remainder of the Cycle:"
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
                "value": "(Weapons only) When you attack with this weapon, you cannot use any tokens from the Kratos Pool or place any tokens in the Kratos Pool"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "newline"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "You do not benefit from"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "keyword",
                "value": "Power Re-roll X"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "newline"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "Increase all"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Fate"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "cost on the card by 1"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "newline"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "(Armor and Shield only) -1"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Potential"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "on Armor Roll"
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
                "value": "-1 Evasion re-roll"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "EvasionReroll"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "(to a minimum of 0)"
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
                "value": "-1 Evasion bonus"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Evasion"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "(to a minimum of 0)"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.2.facility.1",
    "cycle": "Cycle II",
    "name": "Temenos Armor",
    "techType": "Combat",
    "flavorProject": "Temenos's mazeflesh is some kind of coral composite, harder than stone. It'll do",
    "requirements": [
      "—"
    ]
  },
  {
    "refID": "o.2.facility.2",
    "cycle": "Cycle II",
    "name": "Temenos Weapons",
    "techType": "Combat",
    "flavorProject": "With the proper emotional stimulation, Temenos's remains still contract and expand. We can weaponize this",
    "requirements": [
      "—"
    ]
  },
  {
    "refID": "o.2.aa.1",
    "cycle": "Cycle II",
    "name": "Trireme Ballista Fire",
    "techType": "Combat",
    "flavorProject": "Mere arrows and javelins are not enough to pierce the thick armor of the Spartan Primordials. We need concentrated ballista fire",
    "flavorTech": "A well timed bolt can turn the tide of battle",
    "requirements": [
      "Temenos Armor"
    ],
    "abilities": [
      {
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Choose a Titan performing a Power Roll"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "That Titan gains"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "keyword",
                "value": "Power Re-roll 1"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.2.aa.2",
    "cycle": "Cycle II",
    "name": "Triskelion Power Boost",
    "techType": "Combat",
    "flavorProject": "There is some latent power in the Balaneion itself, power we can temporarily transfer through the junction",
    "flavorTech": "Is this Us exerting our strength, or something else entirely?",
    "requirements": [
      "Temenos Weapons"
    ],
    "abilities": [
      {
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Choose an attacking Titan"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "That Titan gains"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "keyword",
                "value": "Pushback 2"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.2.facility.4",
    "cycle": "Cycle II",
    "name": "Temenos Advanced Gear",
    "techType": "Combat",
    "flavorProject": "As we tinker with the transformative properties of Temenos's flesh, new, more intricate weapon designs become available",
    "requirements": [
      "Triskelion Power Boost",
      "Trireme Ballista Fire"
    ]
  },
  {
    "refID": "o.2.facility.5",
    "cycle": "Cycle II",
    "name": "Temenos Support Equipment",
    "techType": "Combat",
    "flavorProject": "The Last Academy scholars have devised plans for utility equipment employing more intricate maze designs",
    "requirements": [
      "Temenos Advanced Gear"
    ]
  },
  {
    "refID": "o.2.aa.5",
    "cycle": "Cycle II",
    "name": "13th Muse Grand Cannon",
    "techType": "Combat",
    "flavorProject": "We once found a cannon with no name and hoped we never had to use it. Today we hope it still works",
    "flavorTech": "",
    "requirements": [
      "Temenos Advanced Gear"
    ],
    "abilities": [
      {
        "effects": [
          {
            "abilityText": [
              {
                "type": "timing",
                "value": "Start of Titan Round"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "You may choose an effect from the Payload card and roll a d10"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "On a 6+, the Cannon is primed"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "It remains primed until you fire, decide to prime a different effect, or the Battle ends"
              }
            ]
          }
        ]
      },
      {
        "name": "Godkiller Shot",
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "When the Cannon is primed, discard 1"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Energy"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "and lose the indicated resource to fire"
              }
            ]
          }
        ]
      },
      {
        "name": "Emergency Priming",
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "As a"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Reaction"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "or after drawing a BP card you may discard 1"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Energy"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "to perform an emergency priming"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Immediately choose an effect from the Payload card and roll for priming as normal"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.2.aa.9",
    "cycle": "Cycle II",
    "name": "Hyperadrenaline Infusion",
    "techType": "Combat",
    "flavorProject": "By stimulating the Titan's adrenal glands through the Junction, we can manufacture an incredible reflex reaction",
    "flavorTech": "Is there a limit to the Titan's power?",
    "requirements": [
      "Temenos Support Equipment"
    ],
    "abilities": [
      {
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Choose a Titan that is about to perform a voluntary movement"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "That Titan may move 4 more spaces during this movement"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.3.structural.4",
    "cycle": "Cycle III",
    "name": "Argo Works III",
    "techType": "Structural",
    "flavorProject": "Alkibiades Argo Works is the living, beating heart of the ship. This is where dreams become reality",
    "flavorTech": "To stand a chance against the Primordials, the smiths and priests of the Argo work tirelessly on new types of gear and new engineering solutions",
    "requirements": [
      "—"
    ],
    "abilities": [
      {
        "name": "Pitiless Power",
        "type": "Reference",
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "When instructed to apply Ascendency rules, all Gear cards with a Power Level lower than III (and without the Ascended keyword) incur the following penalties for the remainder of the Cycle:"
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
                "value": "(Weapons only) When you attack with this weapon, you cannot use any tokens from the Kratos Pool or place any tokens in the Kratos Pool"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "newline"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "You do not benefit from"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "keyword",
                "value": "Power Re-roll X"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "newline"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "Increase all"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Fate"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "cost on the card by 2"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "newline"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "(Armor and Shield only) -1"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Potential"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "on Armor Roll"
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
                "value": "-1 Evasion re-roll"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "EvasionReroll"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "(to a minimum of 0)"
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
                "value": "-1 Evasion bonus"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Evasion"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "(to a minimum of 0)"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.3.structural.21",
    "cycle": "Cycle III",
    "name": "Delphian Investigations",
    "techType": "Structural",
    "flavorProject": "Scouts are sent to all corners - and times - of Delphi",
    "flavorTech": "You begin to piece together a temporal topography of Delphi",
    "requirements": [
      "Argo Works III"
    ],
    "abilities": [
      {
        "name": "Delphian Scout Reports",
        "type": "Permanent",
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "After you roll on the Adventure Hubs Table, you may choose to resolve an Adventure from the hub you rolled or the one in the row directly below"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.3.structural.22",
    "cycle": "Cycle III",
    "name": "Ultimate Trading Solutions",
    "techType": "Structural",
    "flavorProject": "Delphi is rich in resources, we need to establish trade with its powers",
    "flavorTech": "",
    "requirements": [
      "Argo Works III"
    ],
    "abilities": [
      {
        "name": "City Trading",
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "City Negotation"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "keyword",
                "value": "Trading"
              }
            ]
          }
        ]
      },
      {
        "name": "Nubian Contacts",
        "type": "Immediate",
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Add the"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "cardRef",
                "value": "Nubian Traders",
                "refID": "CB1677"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "Exploration card to the Exploration deck"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.3.facility.1",
    "cycle": "Cycle III",
    "name": "Nietzschean Weapons",
    "techType": "Combat",
    "flavorProject": "In death, the Nietzschean will serve one last purpose",
    "requirements": [
      "—"
    ]
  },
  {
    "refID": "o.3.facility.2",
    "cycle": "Cycle III",
    "name": "Nietzschean Reach Weapons",
    "techType": "Combat",
    "flavorProject": "The Nietzschean abhored ranged weapons. Forge them to spite him",
    "requirements": [
      "—"
    ]
  },
  {
    "refID": "o.3.facility.3",
    "cycle": "Cycle III",
    "name": "Nietzschean Armor",
    "techType": "Combat",
    "flavorProject": "What is left of the Nietzschean's Shadow will become your shield",
    "requirements": [
      "—"
    ]
  },
  {
    "refID": "o.3.facility.4",
    "cycle": "Cycle III",
    "name": "Temporal Support Equipment",
    "techType": "Combat",
    "flavorProject": "Delphi is stuck in some kind of temporal anomaly. Combating its effects is of top priority",
    "requirements": [
      "—"
    ]
  },
  {
    "refID": "o.3.aa.2",
    "cycle": "Cycle III",
    "name": "Reverse Timeflow",
    "techType": "Combat",
    "flavorProject": "Reverse-engineered reversed time",
    "flavorTech": "Fast-tracked to victory",
    "requirements": [
      "Nietzschean Reach Weapons",
      "Nietzschean Armor"
    ],
    "abilities": [
      {
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Choose a Titan"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "That Titan arrives from Time-clocked"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.3.aa.3",
    "cycle": "Cycle III",
    "name": "Possibility Matrix",
    "techType": "Combat",
    "flavorProject": "The Oracle prunes possible outcomes, we need to multiply them",
    "flavorTech": "From the infinite pool of outcomes, survival requires just one",
    "requirements": [
      "Temporal Support Equipment",
      "Nietzschean Weapons"
    ],
    "abilities": [
      {
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Place the top card of any Trauma deck on the bottom of that deck"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "You may use this ability as a free action or as a"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Reaction"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.3.facility.5",
    "cycle": "Cycle III",
    "name": "Delphian Siren Armor",
    "techType": "Combat",
    "flavorProject": "Before the Eschaton, the Sirens were not the viscious beasts they are now. This armor is proof",
    "requirements": [
      "Possibility Matrix",
      "Reverse Timeflow"
    ]
  },
  {
    "refID": "o.4.structural.1",
    "cycle": "Cycle IV",
    "name": "Argo Academy",
    "techType": "Structural",
    "flavorProject": "Now you know the truth of the gods. It is your duty to pass it on, so no generation of mortals finds themselves in divine shackles again",
    "flavorTech": "Here the philosophers and academicians conduct their research, poring over dusty tomes and phos scripture",
    "requirements": [
      "—"
    ],
    "abilities": [
      {
        "name": "Forgotten Knowledge",
        "type": "Reference",
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "When you start a new Cycle IV campaign, take all of the Combat and Structural Technology cards you have researched and remove all that have a \"Cycle III only\" tag"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "You won't need them in Cycle IV"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Note that you will also have very limited use of Cycle III Production Facilities, so you may remove these cards too"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Permanent"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Crew Limit: 6, Hull Limit: 5"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "(You cannot gain"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Crew"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "or"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Hull"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "if they would exceed this limit"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": ")"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.4.structural.6",
    "cycle": "Cycle IV",
    "name": "Law Mora",
    "techType": "Structural",
    "flavorProject": "The Empire's bureaucratic threat must not be underestimated",
    "flavorTech": "Our negotiators have been thoroughly briefed on local trade customs",
    "requirements": [
      "Argo Academy"
    ],
    "abilities": [
      {
        "name": "Creative Accounting",
        "type": "Save",
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
                "value": "when you are about to gain"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "BabelianDebt"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "during the Voyage or Adventure Phase to test Diplomcay (7+)"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "newline"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "bold",
                "value": "Success:"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "Lower this gain"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "BabelianDebt"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "gain by 1 (to a minimum of 0)"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.4.structural.7",
    "cycle": "Cycle IV",
    "name": "Curse Economy Basics",
    "techType": "Structural",
    "flavorProject": "How can an Empire that runs on deficits and curses function, let alone grow?",
    "flavorTech": "There are procedures here for every circumstance, even getting cursed",
    "requirements": [
      "Law Mora"
    ],
    "abilities": [
      {
        "name": "Curse Traders",
        "type": "City Negotiation",
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Lose -2"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "BabelianDebt"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "to add a random Cursed Trait to the next Battle"
              }
            ]
          }
        ]
      },
      {
        "name": "Recovery Procedure",
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Lose -2 Priests to make one Argonaut lose any Curse Affliction"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.4.facility.2",
    "cycle": "Cycle IV",
    "name": "Cinder Ranged Weapons",
    "techType": "Combat",
    "flavorProject": "Weapons capable of chasing the Sun across the horizon",
    "requirements": [
      "—"
    ]
  },
  {
    "refID": "o.4.facility.3",
    "cycle": "Cycle IV",
    "name": "Cinder Armor",
    "techType": "Combat",
    "flavorProject": "Once the source of light was known, it stopped providing warmth",
    "requirements": [
      "—"
    ]
  },
  {
    "refID": "o.4.facility.4",
    "cycle": "Cycle IV",
    "name": "Cinder Support",
    "techType": "Combat",
    "flavorProject": "What knowledge we could gleam from the lies of light and the truths of aid",
    "requirements": [
      "—"
    ]
  },
  {
    "refID": "o.4.facility.1",
    "cycle": "Cycle IV",
    "name": "Cinder Weapons",
    "techType": "Combat",
    "flavorProject": "From the cinders of the old world, we will make a better one",
    "requirements": [
      "Cinder Support"
    ]
  },
  {
    "refID": "o.4.aa.1",
    "cycle": "Cycle IV",
    "name": "Irem Protocols",
    "techType": "Combat",
    "flavorProject": "Our scholars have broken the wish-codes used to hide the towers in the sand",
    "flavorTech": "Action exigent: Emergy retraction",
    "requirements": [
      "Cinder Support",
      "Cinder Ranged Weapons"
    ],
    "abilities": [
      {
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Move an empty Irem Tower Terrain tile any number of spaces in a straight line"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "It cannot move through other Terrain tiles or the Primordial"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.4.aa.2",
    "cycle": "Cycle IV",
    "name": "Wish Deflector",
    "techType": "Combat",
    "flavorProject": "When properly calibrated, Delphian paracausal shielding can provide a brief respit from the barrage of wishes",
    "flavorTech": "Wishing you did not have to wish",
    "requirements": [
      "Cinder Ranged Weapons",
      "Cinder Armor"
    ],
    "abilities": [
      {
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "When a Titan becomes the Target of a Wish Attack, choose that Titan"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "That Titan gains"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "keyword",
                "value": "Wish Armor"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.4.facility.5",
    "cycle": "Cycle IV",
    "name": "Imperial Deprived Armorer",
    "techType": "Combat",
    "flavorProject": "Even on their back foot, the Empire was always the aggressor",
    "requirements": [
      "Cinder Armor",
      "Cinder Weapons"
    ]
  },
  {
    "refID": "o.5.structural.1",
    "cycle": "Cycle V",
    "name": "Sharing the Knowledge",
    "techType": "Structural",
    "flavorProject": "You have sat on this trasure trove of knowledge like an ancient dragon. Maybe they are right. Maybe it is time to share your achievements with the world...",
    "flavorTech": "Here the philosophers and academicians conduct their research, poring over dusty tomes and phos scripture",
    "requirements": [
      "—"
    ],
    "abilities": [
      {
        "name": "Forgotten Knowledge",
        "type": "Reference",
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "When you start a new Cycle V campaign, take all of the Combat and Structural Technology cards you have researched and remove all that have a \"Cycle IV only\" tag"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "You won't need them in Cycle V"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Note that you will also have very limited use of Cycle IV Production Facilities, so you may remove these cards too"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Permanent"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Crew Limit: 6, Hull Limit: 6"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "(You cannot gain"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Crew"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "or"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Hull"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "if they would exceed this limit"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": ")"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.5.structural.6",
    "cycle": "Cycle V",
    "name": "Argo Crew Rebuilding",
    "techType": "Structural",
    "flavorProject": "Persia was a harsh land, and the journey through Phlegeton grueling",
    "flavorTech": "With the Cyclades touched by an environmental disaster, there is no shortage of volunteers",
    "requirements": [
      "Sharing the Knowledge"
    ],
    "abilities": [
      {
        "name": "Argo Comissions",
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
                "value": "to gain +1"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Crew"
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
                "value": "Paranoia"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.5.structural.7",
    "cycle": "Cycle V",
    "name": "Argo Philosophy",
    "techType": "Structural",
    "flavorProject": "The Symmachy's ideas are rubbing off on you. You don't know if that's a good thing",
    "flavorTech": "No mortal or Titan left behind, no task too great for the many hands of the Argo",
    "requirements": [
      "Argo Crew Rebuilding"
    ],
    "abilities": [
      {
        "name": "Argo Syneikismos",
        "type": "Save",
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
                "value": "when you are about to lose"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Crew"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "during the Voyage or Adventure Phase to test Diplomacy (7+)"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "newline"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "bold",
                "value": "Success:"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "Lower this"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "icon",
                "value": "Crew"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "loss by 1 (to a minimum of 0)"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.5.facility.1",
    "cycle": "Cycle V",
    "name": "Babelian Armor",
    "techType": "Combat",
    "flavorProject": "Deep blood-stone from the bowels of the Lunacy",
    "requirements": [
      "—"
    ]
  },
  {
    "refID": "o.5.facility.3",
    "cycle": "Cycle V",
    "name": "Babelian Ranged Weapons",
    "techType": "Combat",
    "flavorProject": "Forged in a place where greeds met the sky",
    "requirements": [
      "—"
    ]
  },
  {
    "refID": "o.5.facility.4",
    "cycle": "Cycle V",
    "name": "Babelian Support",
    "techType": "Combat",
    "flavorProject": "Natural, manufactured, stolen--light is light",
    "requirements": [
      "—"
    ]
  },
  {
    "refID": "o.5.facility.2",
    "cycle": "Cycle V",
    "name": "Babelian Weapons",
    "techType": "Combat",
    "flavorProject": "The oldest reclaimed part of the tower show a surprising connection to Selene",
    "requirements": [
      "Babelian Support"
    ]
  },
  {
    "refID": "o.5.aa.1",
    "cycle": "Cycle V",
    "name": "Calculate Statistical Certainty",
    "techType": "Combat",
    "flavorProject": "A wise and ancient advisor of unknown origin, brought into existence by the wonders of Mnestis. It always tells the truth, no matter how bleak it is",
    "flavorTech": "Chance of survival: bleak",
    "requirements": [
      "Babelian Ranged Weapons",
      "Babelian Support"
    ],
    "abilities": [
      {
        "effects": [
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Choose a Titan"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "That Titan uses the Truth Machine"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "refID": "o.5.aa.2",
    "cycle": "Cycle V",
    "name": "Kintsukuroi Pharos",
    "techType": "Combat",
    "flavorProject": "This giant searchlight is an unexpected by-product of the Last Wish. This is the 13th Muse, reconstructed",
    "flavorTech": "There is value in mending broken things",
    "requirements": [
      "Babelian Armor",
      "Babelian Ranged Weapons"
    ],
    "abilities": [
      {
        "effects": [
          {
            "abilityText": [
              {
                "type": "timing",
                "value": "Start of Battle"
              },
              {
                "type": "whitespace",
                "value": " "
              },
              {
                "type": "plainText",
                "value": "Choose one Kintsukuroi Pharos Payload and place it on this card"
              }
            ]
          },
          {
            "abilityText": [
              {
                "type": "plainText",
                "value": "Until the end of Battle, the Payload becomes the effect of this Argo Ability"
              }
            ]
          }
        ]
      }
    ],
    "faq": [
      {
        "abilityText": [
          {
            "type": "plainText",
            "value": "Titan deaths cannot cause this Argo Ability to gain more charges than it started with (1)"
          }
        ]
      }
    ]
  },
  {
    "refID": "o.5.facility.5",
    "cycle": "Cycle V",
    "name": "Abyss Armor",
    "techType": "Combat",
    "flavorProject": "Crude but effective diving gear",
    "requirements": [
      "Babelian Armor",
      "Babelian Weapons"
    ]
  }
];
