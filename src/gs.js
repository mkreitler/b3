// This file contains all relevant game state structures.
// The goal: be able to capture all session data by serializing the structures in this file.

// Kingdom
// Phylum
// Class
// Order
// Family
// Genus
// Species

// Nematoda
// 

// SaveState
ss = {
	drawDeck: null,
	discardDeck: null,
	biomes: null,
};

// GameState
gs =  {
	LINK_ALPHA: 0.67,
	WILD_CARD_VALUE: 4,
	linkTile: {down: 284, right: 282, left: 283},

	iter: 0,

	worldPressInfo: {biome: null, niche: null, tile: null},
	biomeMap: null,
	biomes: [],
	layers: {ocean: null, crust: null, oceanDetail: null, terrain: null, ice: null, shadows: null, producers: null, animals: null, links: null, grid: null},
	drawDeck: [],
	discardDeck: [],
	workPoint: new Phaser.Point(),
	titleToAnimIndex: {amphibia: 2, aves: 1, insecta: 0, mammalia: 4, nematoda: 3, plantae: 5, reptilia: 6},
	specialToAnimIndex: {pollinator: 0, angiosperm: 1, symbiote: 2, adaptor: 3, decomposer: 4, migrator: 5},

 	cardInfo: {
		plantae: {
			large: ['Large plants cannot grow in deserts or plains.', 'Some events do extra damage to Large plants. Some do less.'],
			small: ['Some events do extra damage to Small plants. Some do less.'],
			angiosperm: ['An Angiosperm can regrow from seeds consumed by the animal below it.'],
		},

		animalia: {
			large: ['Some events do extra damage to Small animals. Some do less.'],
			small: ['Some events to extra damage to Large animals. Some do less.'],
			pollinator: ['A Pollinator strengthens the plant to its right by increasing its genetic diversity.'],
			decomposer: ['A Decomposer adds 1 niche to its biome.'],
			adaptor: ['Adaptors can can change role (herbivore/carnivore/scavenger) when displaced.'],
			migrator: ['Migratory animals can move to any biome if displaced by an event.'],
			symbiote: ['A Symbiote protects, and is protected by, the animal to it left.'],
		},

		class: {
			herbivore: 'Herbivores must be played beneath a plant.',
			carnivore: 'Carnivores must be played beneath an herbivore, insect, or nematode.',
			scavenger: 'Scavengers must be played beneath a carnivore.',
			omnivore: 'Omnivores can be played as an herbivore, carnivore, or scavenger.',
		},
	},

	cardValueToSuit: {'0': 'P', '1': 'H', '2': 'C', '3': 'S', '4': 'W'},

	phaseOneCards: [
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer, Angiosperm', special: 'angiosperm'},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Producer, Angiosperm', special: 'angiosperm'},
		{title: 'Nematoda', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Decomposer', special: 'decomposer'},
		{title: 'Insecta', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer, Pollinator', special: 'pollinator'},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer, Angiosperm', special: 'angiosperm'},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Producer', special: ''},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer', special: ''},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer', special: ''},
		{title: 'Nematoda', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Decomposer', special: 'decomposer'},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Producer, Angiosperm', special: 'angiosperm'},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Producer', special: ''},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Producer, Angiosperm', special: 'angiosperm'},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Producer', special: ''},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Producer', special: ''},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Producer', special: ''},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Producer, Angiosperm', special: 'angiosperm'},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Producer', special: ''},
		{title: 'Insecta', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer, Pollinator', special: 'pollinator'},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Producer', special: ''},
		{title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer', special: ''},
	],

	phaseTwoCards: [
		{title: 'Amphibia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Carnivore', special: ''},
		{title: 'Amphibia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Scavenger', special: ''},
		{title: 'Amphibia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Scavenger, Symbiote', special: 'symbiote'},
		{title: 'Amphibia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Herbivore', special: ''},
		{title: 'Amphibia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Herbivore', special: ''},
		{title: 'Amphibia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Carnivore, Migrator', special: 'migrator'},
		{title: 'Amphibia', niche: null, value: 4, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Omnivore, Adaptor', special: 'adaptor'},
		{title: 'Amphibia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Herbivore', special: ''},
		{title: 'Amphibia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Herbivore', special: ''},

		{title: 'Reptilia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Scavenger', special: ''},
		{title: 'Reptilia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Herbivore', special: ''},
		{title: 'Reptilia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Carnivore', special: ''},
		{title: 'Reptilia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large Herbivore', special: ''},
		{title: 'Reptilia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large Carnivore', special: ''},
		{title: 'Reptilia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Herbivore', special: ''},
		{title: 'Reptilia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Carnivore, Symbiote', special: 'symbiote'},
		{title: 'Reptilia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Scavenger, Migrator', special: 'migrator'},
		{title: 'Reptilia', niche: null, value: 4, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Omnivore, Adaptor', special: 'adaptor'},

		{title: 'Aves', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Carnivore', special: ''},
		{title: 'Aves', niche: null, value: 4, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Omnivore, Adaptor', special: 'adaptor'},
		{title: 'Aves', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Herbivore', special: ''},
		{title: 'Aves', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Herbivore, Migrator', special: 'migrator'},
		{title: 'Aves', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Herbivore', special: ''},
		{title: 'Aves', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Scavenger', special: ''},
		{title: 'Aves', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Carnivore, Symbiote', special: 'symbiote'},
		{title: 'Aves', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Carnivore', special: ''},
		{title: 'Aves', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Herbivore', special: ''},

		{title: 'Mammalia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Herbivore', special: ''},
		{title: 'Mammalia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Carnivore', special: ''},
		{title: 'Mammalia', niche: null, value: 4, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Omnivore, Adaptor', special: 'adaptor'},
		{title: 'Mammalia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Herbivore, Migrator', special: 'migrator'},
		{title: 'Mammalia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Scavenger', special: ''},
		{title: 'Mammalia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Herbivore, Symbiote', special: 'symbiote'},
		{title: 'Mammalia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Carnivore', special: ''},
		{title: 'Mammalia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Carnivore', special: ''},
		{title: 'Mammalia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Herbivore', special: ''},

		// {title: '', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: '', special: ''},
	],

	cardSpecialFunctionTable: {
		onPlayed: {
			angiosperm: 'linkBelow',
			pollinator: 'linkRight',
			symbiote: 'linkLeft',
			decomposer: 'addNiche',
		},

		onDestroyed: {
			adaptor: 'adapt',
			migrator: 'migrate',
			symbiote: 'survive',
		},
	},

	indexInfo: {tile: -1, shadow: -1},

	// In the following table:
	// '0' indicates 'no entry'
	// Positive numbers represent indeces into the 'world' tileset.
	// Negative numbers represent indeces into the 'creatures' tileset.
	producerIndexTable: {
		desert: {
			plantae: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: [218, 219, 220], 	shadow: 2114}, 	small: {tile: [108, 109, 110], 	shadow: 0}},
			insecta: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -69, 			  	shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
			nematoda: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -177, 			  	shadow: 2112}, 	small: {tile: 0, 				shadow: 0}},
		},
		plains: {
			plantae: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: [103, 104, 105], 	shadow: 0}, 	small: {tile: [157, 158, 159], 	shadow: 0}},
			insecta: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -69, 			  	shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
			nematoda: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -177, 			  	shadow: 2112}, 	small: {tile: 0, 				shadow: 0}},
		},
		forest: {
			plantae: 	{large: {tile: {arctic: 275, normal: [274, 269, 270]}, 	shadow: 2115},	normal: {tile: 102, 				shadow: 2115},	small: {tile: 164, 				shadow: 2113}},
			insecta: 	{large: {tile: 0, 										shadow: 0}, 	normal: {tile:-69,					shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
			nematoda: 	{large: {tile: 0, 										shadow: 0}, 	normal: {tile:-177,					shadow: 2112}, 	small: {tile: 0, 				shadow: 0}},
		},
		wetlands: {
			plantae: 	{large: {tile: [269, 270, 271, 272], 					shadow: 2115}, 	normal: {tile: [102, 107], 			shadow: 2115}, 	small: {tile: [111, 112], 		shadow: 0}},
			insecta: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -69, 				shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
			nematoda: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -177, 				shadow: 2112}, 	small: {tile: 0, 				shadow: 0}},
		},
		mountains: {
			plantae: 	{large: {tile: {arctic: 275, normal: 274}, 				shadow: 2115},	normal: {tile: 163, 				shadow: 2115},	small: {tile: [103, 104, 105], 	shadow: 0}},
			insecta: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -69, 				shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
			nematoda: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -177, 				shadow: 2112}, 	small: {tile: 0, 				shadow: 0}},
		},
	},

	consumerIndexTable: {
		amphibia: {
			herbivore: 	{large: {tile: 241, shadow: 2110}, normal: {tile: 240, shadow: 2111}, small: {tile: 185, shadow: 2110}},
			carnivore: 	{large: {tile: 241, shadow: 2110}, normal: {tile: 240, shadow: 2111}, small: {tile: 185, shadow: 2110}},
			scavenger: 	{large: {tile: 241, shadow: 2110}, normal: {tile: 240, shadow: 2111}, small: {tile: 185, shadow: 2110}},
			omnivore: 	{large: {tile: 243, shadow: 2110}, normal: {tile: 242, shadow: 2111}, small: {tile: 186, shadow: 2110}},
		},

		aves: {
			herbivore: 	{large: {tile: 73, shadow: 2110}, normal: {tile: 74, shadow: 2110}, small: {tile: 75, shadow: 2110}},
			carnivore: 	{large: {tile: 73, shadow: 2110}, normal: {tile: 74, shadow: 2110}, small: {tile: 75, shadow: 2110}},
			scavenger: 	{large: {tile: 73, shadow: 2110}, normal: {tile: 74, shadow: 2110}, small: {tile: 75, shadow: 2110}},
			omnivore: 	{large: {tile: 241, shadow: 2110}, normal: {tile: 240, shadow: 2111}, small: {tile: 186, shadow: 2110}},
		},

		mammalia: {
			herbivore: 	{large: {tile: 179, shadow: 2111}, normal: {tile: 128, shadow: 2111}, small: {tile: 121, shadow: 2110}},
			carnivore: 	{large: {tile: 179, shadow: 2111}, normal: {tile: 128, shadow: 2111}, small: {tile: 121, shadow: 2110}},
			scavenger: 	{large: {tile: 179, shadow: 2111}, normal: {tile: 128, shadow: 2111}, small: {tile: 121, shadow: 2110}},
			omnivore: 	{large: {tile: 132, shadow: 2110}, normal: {tile: 184, shadow: 2111}, small: {tile: 76, shadow: 2110}},
		},

		reptilia: {
			herbivore: 	{large: {tile: 173, shadow: 2111}, normal: {tile: 67, shadow: 2111}, small: {tile: 61, shadow: 2110}},
			carnivore: 	{large: {tile: 173, shadow: 2111}, normal: {tile: 67, shadow: 2111}, small: {tile: 61, shadow: 2110}},
			scavenger: 	{large: {tile: 173, shadow: 2111}, normal: {tile: 67, shadow: 2111}, small: {tile: 61, shadow: 2110}},
			omnivore: 	{large: {tile: 170, shadow: 2111}, normal: {tile: 133, shadow: 2111}, small: {tile: 77, shadow: 2110}},
		}
	}
};

gs.save = function() {
	// ss.drawDeck = gs.drawDeck;
	// ss.biomes = gs.biomes;
	// ss.discardDeck = gs.discardDeck;

	console.log(JSON.stringify(ss));
};

gs.getNumBiomes = function() {
	return this.biomes.length;
};

gs.populateNiche = function(card, niche) {
	var rank = niche.getRank();
	var failMsg = null;
	var keywords = [];
	var length = 0;
	var special = null;

	switch(gs.getCardTitle(card).toLowerCase()) {
		case 'plantae': case 'insecta': case 'nematoda':
			if (niche.getRank() === -1) {
				gs.getTileIndexForCardInBiome(card, niche.getBiome());

				if (gs.indexInfo.shadow) {
					tm.addTilesToLayer(gs.layers.shadows, 'ff_world', gs.indexInfo.shadow, niche.getTopRow(), niche.getLeftCol() + 1);
				}

				if (gs.indexInfo.tile > 0) {
					tm.addTilesToLayer(gs.layers.producers, 'ff_world', gs.indexInfo.tile, niche.getTopRow(), niche.getLeftCol() + 1);
				}
				else {
					tm.addTilesToLayer(gs.layers.animals, 'ff_world', -gs.indexInfo.tile, niche.getTopRow(), niche.getLeftCol() + 1);
				}
			}
			else {
				failMsg = strings.INFO.NICHE_FULL_PRODUCER;
			}
		break;

		default:
			gs.getTileIndexForCardInBiome(card, niche.getBiome());

			if (niche.getRank() < gs.WILD_CARD_VALUE - 1) {
				if (niche.getRank() === gs.getCardValue(card) - 1 || gs.getCardValue(card) === gs.WILD_CARD_VALUE) {
					if (gs.indexInfo.shadow) {
						tm.addTilesToLayer(gs.layers.shadows, 'ff_world', gs.indexInfo.shadow, niche.getTopRow() + niche.getNumberOfCards(), niche.getLeftCol() + 1);
					}

					tm.addTilesToLayer(gs.layers.animals, 'ff_world', gs.indexInfo.tile, niche.getTopRow() + niche.getNumberOfCards(), niche.getLeftCol() + 1);

					if (gs.getCardValue(card) === gs.WILD_CARD_VALUE) {
						gs.setCardValue(card, niche.getLastCardValue() + 1);
					}

					special = gs.getCardSpecial(card);
					switch (special) {
						case 'migrator':
							tm.addTilesToLayer(gs.layers.animals, 'ff_world', 139, niche.getTopRow() + niche.getNumberOfCards(), niche.getLeftCol());
						break;

						case 'symbiote':
							// This case is handled by drawLink(..., 'left');
						break;

						case 'adaptor':
							tm.addTilesToLayer(gs.layers.animals, 'ff_world', 137, niche.getTopRow() + niche.getNumberOfCards(), niche.getLeftCol());
						break;
					}
				}
				else {
					failMsg = strings.INFO.NICHE_FULL;
				}
			}
			else {
				if (niche.getRank() === gs.WILD_CARD_VALUE - 1) {
					failMsg = strings.INFO.NICHE_FULL;
				}
				else {
					switch (gs.getCardValue(card)) {
						case 1:
							failMsg = strings.INFO.INVALID_PLACEMENT_HERBIVORE;
						break;

						case 2:
							failMsg = strings.INFO.INVALID_PLACEMENT_CARNIVORE;
						break;

						case 3:
							failMsg = strings.INFO.INVALID_PLACEMENT_SCAVENGER;
						break;

						default:
							assert(false, "populateNiche: unhandled case!");
						break;
					}
				}
			}
		break;
	}

	if (!failMsg) {
		niche.addCard(card);

		keywords = gs.getCardKeywords(card).split(',');
		for (i=0; i<keywords.length; ++i) {
			keywords[i] = keywords[i].toLowerCase().replace(' ', '');
			if (gs.hasOwnProperty(keywords[i])) {
				gs[keywords[i]](card, niche);
			}
		}
	}

	return failMsg;
};

///////////////////////////////////////////////////////////////////////////////
// Special Ability Functions
///////////////////////////////////////////////////////////////////////////////
gs.addNiche = function(card, niche) {
	assert(niche.getBiome(), "addNiche: invalid biome!");

	// TODO: add FX.
	niche.getBiome().prependNiche(niche.getBiome());
},

gs.linkBelow = function(card, niche, bBackLink) {
	var cardBelow = niche.getNextCard(card);

	if (cardBelow) {
		cardBelow.linkedCards.above = card;
		card.linkedCards.below = cardBelow;
	}

	if (!bBackLink) {
		gs.drawLink(card, 'down');
	}
};

gs.linkRight = function(card, niche, bBackLink) {
	var nextNiche = niche.next();
	var nextCard = nextNiche ? nextNiche.cardAtRank(niche.getRankForCard(card)) : null;

	if (!niche.isLast()) {
		if (!nextCard || gs.getCardTitle(nextCard).toLowerCase() === 'plantae') {
			card.linkedCards.right = nextCard;
			if (nextCard) {
				nextCard.linkedCards.left = card;
			}

			if (!bBackLink) {
				gs.drawLink(card, 'right');
			}
		}
		else {
			card.linkedCards.right = null;
			if (nextCard) {
				nextCard.linkedCards.left = null;
			}

			if (bBackLink) {
			 	uim.clearInfoText();
			 	uim.addInfoText(strings.INFO.INSECT_MISPLACED);
				gs.eraseLink(card, 'right');
			}
		}
	}
};

gs.linkLeft = function(card, niche, bBackLink) {
	var prevNiche = niche.prev();
	var prevCard = prevNiche ? prevNiche.cardAtRank(niche.getRankForCard(card)) : null;

	if (!niche.isFirst()) {
		card.linkedCards.left = prevCard;
		if (prevCard) {
			prevCard.linkedCards.right = card;
		}

		if (!bBackLink) {
			gs.drawLink(card, 'left');
		}
	}
};

gs.adapt = function(card, niche) {
	// TODO: implement!
};

gs.migrate = function(card, niche) {
	// TODO: implement!
};

gs.survive = function(card, niche) {
	// TODO: implement!
};

///////////////////////////////////////////////////////////////////////////////

gs.getTileIndexForCardInBiome = function(card, biome) {
	var title = card ? gs.getCardTitle(card).toLowerCase() : null;
	var bPlantInsectOrNematode = gs.isCardPlantInsectOrNematode(card);
	var keywords = card ? gs.getCardKeywords(card).toLowerCase().replace(' ', '') : null;
	var bIsLarge = keywords ? keywords.indexOf('large') >= 0 : false;
	var bIsSmall = keywords ? keywords.indexOf('small') >= 0 : false;
	var bIsArctic = biome.getLatitude() === 0 || biome.getLatitude() === this.biomes.length - 1;
	var role = null;
	var size = bIsLarge ? 'large' : (bIsSmall ? 'small' : 'normal');
	var biomeType = biome ? biome.getType().name.toLowerCase() : null;
	var indexInfo = null;
	var tileInfo = null;
	var key = null;

	assert(title && keywords, "getTileIndexForCardInBiome: invalid card data!");
	assert(biomeType, "getTileIndexForCardInBiome: invalid biome data!");

	gs.indexInfo.tile = 0;
	gs.indexInfo.shadow = 0;

	if (bPlantInsectOrNematode) {
		indexInfo = gs.producerIndexTable[biomeType][title][size];
	}
	else {
		if (keywords.indexOf('herbivore') >= 0 ) {
			role = 'herbivore';
		}
		else if (keywords.indexOf('carnivore') >= 0) {
			role = 'carnivore';
		}
		else if (keywords.indexOf('scavenger') >= 0) {
			role = 'scavenger';
		}
		else if (keywords.indexOf('omnivore') >= 0) {
			role = 'omnivore';
		}

		indexInfo = gs.consumerIndexTable[title][role][size];
	}

	assert(indexInfo, "getTileIndexForCardInBiome: invalid indexInfo!");
	gs.indexInfo.shadow = indexInfo.shadow;

	// Handle 'arctic' data.
	tileInfo = indexInfo.tile;
	if (typeof tileInfo === 'object' && !(tileInfo instanceof Array)) {
		// tileInfo is an object. Need to drill down further.
		if (tileInfo.hasOwnProperty ('arctic') && bIsArctic) {
			tileInfo = tileInfo.arctic;
		}
		else if (tileInfo.hasOwnProperty('normal') && !bIsArctic) {
			tileInfo = tileInfo.normal;
		}
		else {
			assert(false, "getTileIndexForCardInBiome: invalid tile index!");
		}
	}

	if (typeof tileInfo === 'number') {
		gs.indexInfo.tile = tileInfo;
	}
	else if (tileInfo instanceof Array) {
		gs.indexInfo.tile = tileInfo[Math.floor(Math.random() * tileInfo.length)];
	}

	return gs.indexInfo;
};

gs.cardHasLink = function(card, linkDirection) {
	var keywords = card ? gs.getCardKeywords(card).split(',') : null;
	var i = 0;
	var bHasLink = false;
	var key = null;

	assert(keywords, "cardHasLink: invalid keywords!");

	linkDirection = linkDirection.substring(0, 1).toUpperCase() + linkDirection.substring(1).toLowerCase();
	for (i=0; i<keywords.length; ++i) {
		keywords[i] = keywords[i].toLowerCase().replace(' ', '');
		if (gs.cardSpecialFunctionTable.onPlayed[keywords[i]]) {
			if (gs.cardSpecialFunctionTable.onPlayed[keywords[i]] === 'link' + linkDirection) {
				bHasLink = true;
				break;
			}
		}
	}

	return bHasLink;
}

gs.getCardSuit = function(card) {
	var key = card ? '' + card.value : 'unknown';
	var suit = card &&  gs.cardValueToSuit.hasOwnProperty(key) ? gs.cardValueToSuit['' + card.value] : '?';
	var title = card ? gs.getCardTitle(card).toLowerCase() : null;

	if (title) {
		// Overrides.
		if (title === 'insecta') {
			suit = "I";
		}
		else if (title === 'nematoda') {
			suit = "N";
		}
	}

	return suit;
};

gs.getCardTitle = function(card) {
	return card ? card.title : null;
};

gs.getCardKeywords = function(card) {
	return card ? card.keywords : null;
};

gs.getCardLinkedCards = function(card) {
	return card ? card.linkedCards : null;
};

gs.getCardValue = function(card) {
	return card ? card.value : -1;
};

gs.setCardValue = function(card, value) {
	card.value = value;
};

gs.getCardSpecial = function(card) {
	return card ? card.special : null;
};

gs.getCardPhaseValue = function(card, bPhaseOne) {
	var phaseValue = card ? card.value : -1;

	if (card && bPhaseOne) {
		if (gs.getCardTitle(card).toLowerCase() === 'insecta' || gs.getCardTitle(card).toLowerCase() === 'nematoda') {
			phaseValue = 0;
		}
	}

	return phaseValue;
};

gs.getCardNiche = function(card) {
	return card ? card.niche : null;
};

gs.setCardNiche = function(card, niche) {
	card.niche = niche;
}

gs.getTextForKeyword = function(title, keyword) {
	var text = null;

	title = title.toLowerCase();
	keyword = keyword.toLowerCase();

	if (this.cardInfo[title]) {
		text = this.cardInfo[title][keyword];
	}
	else {
		text = this.cardInfo['animalia'][keyword];
	}

	return text;
};

gs.getFirstKeywordForCard = function(card) {
	this.iter = 0;

	return this.getNextKeywordForCard(card);
};

gs.getNextKeywordForCard = function(card) {
	var keyword = null;
	var keywordList = card && card.keywords ? card.keywords.split(',') : null;

	if (keywordList && this.iter < keywordList.length) {
		keyword = keywordList[this.iter];
		keyword = keyword.toLowerCase().replace(' ', '');
		++this.iter;
	}

	return keyword;
}

gs.getNumTitles = function() {
	var key = null;
	var nTitles = 0;

	for (key in this.titleToAnimIndex) {
		++nTitles;
	}

	return nTitles;
};

gs.getDrawDeckType = function(index) {
	return (index < this.drawDeck.length ? this.drawDeck[index].title : 'INVALID INDEX');
};

gs.getDrawDeckValue = function(index) {
	return (index < this.drawDeck.length ? this.drawDeck[index].value : -1);
};

gs.getDrawDeckSuit = function(index) {
	var card = index >= 0 && index < this.drawDeck.length ? this.drawDeck[index] : null;

	return card ? gs.getCardSuit(card) : '?';
}

gs.getDrawDeckKeywords = function(index) {
	return (index < this.drawDeck.length ? this.drawDeck[index].keywords : 'invalid index');
};

gs.getDrawDeckSpecial = function(index) {
	return (index < this.drawDeck.length ? this.drawDeck[index].special : 'invalid index');
};

gs.getDrawDeckCard = function(index) {
	return (index < this.drawDeck.length ? this.drawDeck[index] : null);
};

gs.getWorldPressInfo = function(x, y) {
	var i = 0;
	var tile = null;
	var col = 0;
	var terrain = gs.layers['terrain'];
	var bContainsPoint = false;

	this.worldPressInfo.biome = null;
	this.worldPressInfo.tile  = null;

	this.workPoint = terrain.getTileXY(x, y, this.workPoint);
	tile = terrain.map.getTile(this.workPoint.x, this.workPoint.y, gs.layers["terrain"]);
	if (tile && tile.properties) {
		// Clicked on a tile, but still need to validate it as a niche.
		// console.log("Touched " + tile.properties.name);
		this.worldPressInfo.niche = tile.properties;
		this.worldPressInfo.biome = this.worldPressInfo.niche.getBiome();
		this.worldPressInfo.tile = tile;
	}

	return this.worldPressInfo;
};

gs.cardsAreSequentialRank = function(cardFirst, cardSecond) {
	assert(cardFirst && cardSecond, "cardsAreSequentialRank: invalid card(s)!");

	return cardFirst.value + 1 === cardSecond.value;
};

gs.isCardPlantInsectOrNematode = function(card) {
	var lcTitle = card ? this.getCardTitle(card).toLowerCase() : null;

	return lcTitle &&
		   lcTitle === 'plantae' ||
		   lcTitle === 'insecta' ||
		   lcTitle === 'nematoda';
};

gs.showTargetableNiches = function(card) {
	assert(card, "showTargetableNiches: invalid card!");

	if (gs.isCardPlantInsectOrNematode(card)) {
		this.placePhaseOneCursors(card);
	}
	else {
		this.placePhaseTwoCursors(card);
	}
};

gs.placePhaseOneCursors = function(card) {
	var i = 0;

	for (i=0; i<this.biomes.length; ++i) {
		this.biomes[i].placePhaseOneCursors(card);
	}
};

gs.placePhaseTwoCursors = function(card) {
	// TODO: fill this in!
};

gs.showAvailableBiomes = function(card) {
	var keywords = null;

	assert(card, "showAvailableBiomes: invalid card!");

	keywords = gs.getCardKeywords(card);

	this.blockBiomes(null);

	if (keywords) {
		keywords = keywords.toLowerCase();

		// Put biome-blocking conditions here.
		if (gs.getCardTitle(card).toLowerCase() === 'plantae' && keywords.toLowerCase().indexOf('large') >= 0) {
			this.blockBiomes(['desert', 'plains']);
		}
	}
};

gs.blockBiomes = function(biomeList) {
	var i = 0;

	if (biomeList) {
		// Block this.biomes whose name matches an entry in the list.
		for (i=0; i<this.biomes.length; ++i) {
			if (biomeList.indexOf(this.biomes[i].getType().name.toLowerCase()) >= 0) {
				this.biomes[i].block();
			}
			else {
				this.biomes[i].unblock();
			}
		}
	}
	else {
		// No list. Unblock all this.biomes.
		for (i=0; i<this.biomes.length; ++i) {
			this.biomes[i].unblock();
		}
	}
};

gs.initDrawDeck = function() {
	gs.drawDeck.length = 0;
	tm.copyListToList(gs.phaseOneCards, gs.drawDeck);
	this.shuffleDrawDeck();
};

gs.drawDeckExhausted = function() {
	return gs.drawDeck.length === 0;
};

gs.removeInsectsAndNematodes = function() {
	var i = 0;

	for (i=0; i<this.drawDeck.length; ++i) {
		if (this.drawDeck[i] && this.drawDeck[i].title.toLowerCase() !== 'plantae') {
			this.discardDeck.push(this.drawDeck[i]);
			tm.listReplaceWithLastNonNull(this.drawDeck, i);
		}
	}
};

gs.addPhaseTwoCards = function() {
	tm.copyListToList(gs.phaseTwoCards, gs.drawDeck);
};

gs.shuffleDrawDeck = function() {
	tm.scrambleList(gs.drawDeck);
	tm.scrambleList(gs.drawDeck);
	tm.scrambleList(gs.drawDeck);
};

gs.initDiscardDeck = function() {
	gs.discardDeck.length = 0;
};

gs.getDrawCardsRemaining = function() {
	var nCards = 0;
	var i = 0;

	for (i=0; i<gs.drawDeck.length; ++i) {
		if (gs.drawDeck[i]) {
			++nCards;
		}
	}

	return nCards;
};

gs.discardAndReplace = function(card) {
	var i = 0;
	var bReplaced = false;
	var iLast = -1;

	assert(card, "discardAndReplace: invalid card!");

	gs.discardDeck.push(card);

	if (gs.getDrawCardsRemaining() > uim.getNumBanners()) {
		for (i=0; i<gs.drawDeck.length; ++i) {
			if (gs.drawDeck[i] === card) {
				bReplaced = tm.listReplaceWithLastNonNull(gs.drawDeck, i) > i;
				break;
			}
		}
	}
	else {
		tm.listReplaceWithLastNonNull(gs.drawDeck, i);
	}

	if (bReplaced) {
		assert(i >= 0 && i < gs.drawDeck.length && gs.drawDeck[i], "discardAndReplace: invalid index!");
		uim.setFocusBannerInfo(gs.getDrawDeckType(i),
						   	   gs.getDrawDeckSuit(i),
						   	   gs.getDrawDeckKeywords(i),
						   	   gs.getDrawDeckSpecial(i),
						   	   gs.getDrawDeckCard(i));

	}
	else {
		uim.setFocusBannerInfo('', 9, '', '', null);
	}

	gs.save();

	return bReplaced;
};

gs.playerHasLegalMove = function(bPhaseOne) {
	var bHasLegalMove = false;
	var showingCards = null;
	var i = 0;
	var keywords = null;
	var bLargePlant = false;
	var nPlays = 0;

	showingCards = uim.getShowingCards();
	for (i=0; i<showingCards.length; ++i) {
		card = showingCards[i];
		keywords = gs.getCardKeywords(card);

		if (keywords) {
			keywords = keywords.toLowerCase();

			bLargePlant = (gs.getCardTitle(card).toLowerCase() === 'plantae' && keywords.toLowerCase().indexOf('large') >= 0);
			nPlays = this.countPlays(card, bLargePlant, bPhaseOne);

			if (nPlays > 0) {
				bHasLegalMove = true;
				break;
			}
		}
	}

	return bHasLegalMove;
};

gs.countPlays = function(card, bLargePlant, bPhaseOne) {
	var iBiome = 0;
	var iNiche = 0;
	var nPlays = 0;
	var biomeName = null;

	for (iBiome=0; iBiome<this.biomes.length; ++iBiome) {
		biomeName = this.biomes[iBiome].getType().name.toLowerCase();
		if (bLargePlant && (biomeName === 'desert'|| biomeName === 'plains')) {
			// Biome blocked. No play possible.
		}
		else {
			for (iNiche=0; iNiche < this.biomes[iBiome].getNumNiches(); ++iNiche) {
				if (gs.getCardPhaseValue(card, bPhaseOne) > this.biomes[iBiome].getNicheRank(iNiche)) {
					nPlays += 1;
				}
			}
		}
	}

	return nPlays;
};

gs.drawLink = function(fromCard, dir) {
	var fromNiche = gs.getCardNiche(fromCard);
	var fromRow = 0;
	var toRow = 0;
	var fromCol = 0;
	var toCol = 0;
	var row = 0;
	var col = 0;

	dir = dir.toLowerCase();

	switch(dir) {
		case 'down':
			fromCol = fromNiche.getLeftCol() + 1;
			toCol = fromCol;
			fromRow = fromNiche.getTopRow() + fromNiche.getRankForCard(fromCard);
			toRow = fromRow + 1;
		break;

		case 'right':
			fromCol = fromNiche.getLeftCol() + 1;
			toCol = fromCol + fromNiche.getBiome().getType().tiles[0].length;
			fromRow = fromNiche.getTopRow() + fromNiche.getRankForCard(fromCard);
			toRow = fromRow;
		break;

		case 'left':
			toCol = fromNiche.getLeftCol() + 1;
			fromCol = toCol - fromNiche.getBiome().getType().tiles[0].length;
			fromRow = fromNiche.getTopRow() + fromNiche.getRankForCard(fromCard);
			toRow = fromRow;
		break;
	}

	for (row=fromRow; row<=toRow; ++row) {
		for (col=fromCol; col<=toCol; ++col) {
			tm.addTilesToLayer(gs.layers.links, 'ff_world', gs.linkTile[dir], row, col);
		}
	}
};

gs.eraseLink = function(fromCard, dir) {
	var fromNiche = gs.getCardNiche(fromCard);
	var fromRow = 0;
	var toRow = 0;
	var fromCol = 0;
	var toCol = 0;
	var row = 0;
	var col = 0;

	dir = dir.toLowerCase();

	switch(dir) {
		case 'down':
			fromCol = fromNiche.getLeftCol() + 1;
			toCol = fromCol;
			fromRow = fromNiche.getTopRow() + fromNiche.getRankForCard(fromCard);
			toRow = fromRow + 1;
		break;

		case 'right':
			fromCol = fromNiche.getLeftCol() + 1;
			toCol = fromCol + fromNiche.getBiome().getType().tiles[0].length;
			fromRow = fromNiche.getTopRow() + fromNiche.getRankForCard(fromCard);
			toRow = fromRow;
		break;

		case 'left':
			toCol = fromNiche.getLeftCol() + 1;
			fromCol = fromCol - fromNiche.getBiome().getType().tiles[0].length;
			fromRow = fromNiche.getTopRow() + fromNiche.getRankForCard(fromCard);
			toRow = fromRow;
		break;
	}

	for (row=fromRow; row<=toRow; ++row) {
		for (col=fromCol; col<=toCol; ++col) {
			tm.removeTileFromLayer(gs.layers.links, row, col);
		}
	}
};

gs.resetGame = function() {
	var i =0;

	this.drawDeck.length = 0;
	this.discardDeck.length = 0;

	for (i=0; i<this.phaseOneCards.length; ++i) {
		this.phaseOneCards.linkedCards.above = null;
		this.phaseOneCards.linkedCards.right = null;
		this.phaseOneCards.linkedCards.below = null;
		this.phaseOneCards.linkedCards.left  = null;
	}

	for (i=0; i<this.phaseTwoCards.length; ++i) {
		this.phaseTwoCards.linkedCards.above = null;
		this.phaseTwoCards.linkedCards.right = null;
		this.phaseTwoCards.linkedCards.below = null;
		this.phaseTwoCards.linkedCards.left  = null;
	}
};

gs.executeCardSpecialFunction = function(card, fnType) {
	var keywords = card ? gs.getCardKeywords(card) : null;
	var keyList = null;
	var key = null;
	var i = 0;

	assert(keywords, "executeCardSpecialFunctions: invalid keywords!");

	keyList = keywords.split(',');

	for (i=0; i<keyList.length; ++i) {
		key = keyList[i].replace(' ', '').toLowerCase();
		if (gs.cardSpecialFunctionTable[fnType].hasOwnProperty(key)) {
			gs[gs.cardSpecialFunctionTable[fnType][key]](card, gs.getCardNiche(card), false);
		}
	}
};

///////////////////////////////////////////////////////////////////////////////
// Biome Data
///////////////////////////////////////////////////////////////////////////////
bd = {};
bd.ROW_OFFSET = 3;

// ----------------------------------------------------------------------------
// Niche
// ----------------------------------------------------------------------------
bd.niche = function(topRow, leftCol) {
	this.cards = [];
	this.topRow = topRow;
	this.leftCol = leftCol;
	this.text = game.add.bitmapText(this.leftCol * TILE_SIZE, this.topRow * TILE_SIZE, 'bogboo', uim.INFO_TEXT_SIZE);
	this.text.anchor.setTo(0.5, 0.5);
	this.text.visible = false;
	this.biome = null;
};

bd.niche.prototype.getLastCardValue = function() {
	return this.cards && this.cards.length > 0 ? this.cards[this.cards.length - 1].value : -1;
};

bd.niche.prototype.isLast = function() {
	return this.biome.isLastNiche(this);
};

bd.niche.prototype.isFirst = function() {
	return this.biome.isFirstNiche(this);
};

bd.niche.prototype.getNextCard = function(card) {
	var rank = this.getRankForCard(card);
	var nextCard = null;

	if (rank >= 0 && rank < this.cards.length) {
		nextCard = this.cards[rank + 1];
	}

	return nextCard;
};

bd.niche.prototype.getNumberOfCards = function() {
	return this.cards ? this.cards.length : 0;
};

bd.niche.prototype.getRankForCard = function(card) {
	var rank = -1;
	var i =0 ;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i] === card) {
			rank = i;
			break;
		}
	}

	return rank;
};

bd.niche.prototype.getTopRow = function() {
	return this.topRow;
};

bd.niche.prototype.getLeftCol = function() {
	return this.leftCol;
};

bd.niche.prototype.addCard = function(card) {
	var linkedCards = null;
	var neighbor = null;
	var neighborNiche = null;

	gs.setCardNiche(card, this);
	this.cards.push(card);

	gs.executeCardSpecialFunction(card, 'onPlayed');

	// Check for back-links.
	linkedCards = gs.getCardLinkedCards(card);
	assert(linkedCards, "niche.addCard: invalid linkedCards!");

	if (this.cards.length > 1) {
		neighbor = this.cards[this.cards.length - 2];
		assert(neighbor, "niche.addCard: invalid upper neighbor!");

		if (gs.cardHasLink(neighbor, 'below')) {
			gs.linkBelow(neighbor, gs.getCardNiche(neighbor), true);
		}
	}

	neighborNiche = this.prev(this);
	neighbor = neighborNiche ? neighborNiche.cardAtRank(this.cards.length - 1) : null;
	if (neighbor && gs.cardHasLink(neighbor, 'right')) {
		gs.linkRight(neighbor, neighborNiche, true);
	}

	neighborNiche = this.next(this);
	neighbor = neighborNiche ? neighborNiche.cardAtRank(this.cards.length - 1) : null;
	if (neighbor && gs.cardHasLink(neighbor, 'left')) {
		gs.linkLeft(neighbor, neighborNiche, true);
	}
};

bd.niche.prototype.next = function() {
	assert(this.biome, "niche.next: invalid biome!");

	return this.biome.getNextNiche(this);
};

bd.niche.prototype.prev = function() {
	assert(this.biome, "niche.prev: invalid biome!");

	return this.biome.getPrevNiche(this);
};

bd.niche.prototype.cardAtRank = function(rank) {
	return this.cards && rank < this.cards.length ? this.cards[rank] : null;
};

bd.niche.prototype.canAddCard = function(card) {
	var bCanAddCard = false;

	assert(card, 'niche.addCard: invalid card!');

	if (gs.isCardPlantInsectOrNematode(card)) {
		if (this.cards.length === 0) {
			bCanAddCard = true;
		}
	}
	else if (this.cards.length > 0 && gs.cardsAreSequentialRank(this.cards[this.cards.length - 1], card)) {
		bCanAddCard = true;
	}

	return bCanAddCard;
};

bd.niche.prototype.setBiome = function(biome) {
	this.biome = biome;
};

bd.niche.prototype.getBiome = function() {
	return this.biome;
};

bd.niche.prototype.setCursor = function(card) {
	var x = this.leftCol * TILE_SIZE;
	var y = this.topRow * TILE_SIZE;

	uim.setCursor(x, y, this);
};

bd.niche.prototype.getRank = function() {
	return this.cards.length > 0 ? this.cards[this.cards.length - 1].value : -1;
};

// ----------------------------------------------------------------------------
// Biome
// ----------------------------------------------------------------------------
bd.biome = function() {
	this.latitude 	= -1;
	this.type 		= null;
	this.startCol 	= -1;
	this.sprNoSelect= null;
	this.layer 		= null;
	this.sprBlocked = null;
	this.niches 	= [];
	this.tileSet  	= null;
};

bd.biome.prototype.MAX_GROWTH = 2;

bd.biome.prototype.sizeByLatitude = [2, 3, 4, 3, 2];
bd.biome.prototype.noSelectByLatitude = ['Small', 'Medium', 'Large', 'Medium', 'Small'];
bd.biome.prototype.maxSizeAtLatitude = [5, 6, 7, 6, 5];
bd.biome.prototype.offsets = [6, 5, 3, 4, 6];
bd.biome.prototype.TYPES = {
	DESERT: { name: "Desert", sizeMod: -1, tiles: [ [{row: 18, col: 37}, {row: 18, col: 36}, {row: 19, col: 34}],
												    [{row: 18, col: 35}, {row: 18, col: 33}, {row: 19, col: 35}],
												    [{row: 18, col: 35}, {row: 18, col: 33}, {row: 19, col: 35}],
												    [{row: 18, col: 38}, {row: 18, col: 39}, {row: 19, col: 36}] ]
			},
	FOREST: { name: "Forest", sizeMod: +1, tiles: [ [{row: 34, col: 37}, {row: 34, col: 36}, {row: 35, col: 34}],
												    [{row: 34, col: 35}, {row: 34, col: 33}, {row: 35, col: 35}],
												    [{row: 34, col: 35}, {row: 34, col: 33}, {row: 35, col: 35}],
												    [{row: 34, col: 38}, {row: 34, col: 39}, {row: 35, col: 36}] ]
			},
	PLAINS: { name: "Plains", sizeMod: +0, tiles: [ [{row: 16, col: 37}, {row: 16, col: 36}, {row: 17, col: 34}],
												    [{row: 16, col: 35}, {row: 16, col: 33}, {row: 17, col: 35}],
												    [{row: 16, col: 35}, {row: 16, col: 33}, {row: 17, col: 35}],
												    [{row: 16, col: 38}, {row: 16, col: 39}, {row: 17, col: 36}] ]
			},
	WETLANDS: { name: "Wetlands", sizeMod: +1, tiles: [ [{row: 31, col: 9}, {row: 31, col: 9}, {row: 31, col: 6}],
												    [{row: 31, col: 9}, {row: 31, col: 9}, {row: 31, col: 6}],
												    [{row: 31, col: 9}, {row: 31, col: 9}, {row: 31, col: 6}],
												    [{row: 31, col: 9}, {row: 31, col: 9}, {row: 31, col: 6}] ]
			},
	MOUNTAIN: { name: "Mountains", sizeMod: +0, tiles: [ [{row: 22, col: 37}, {row: 22, col: 36}, {row: 23, col: 34}],
												    	[{row: 22, col: 35}, {row: 22, col: 33}, {row: 23, col: 35}],
												    	[{row: 22, col: 35}, {row: 22, col: 33}, {row: 23, col: 35}],
												    	[{row: 22, col: 38}, {row: 22, col: 39}, {row: 23, col: 36}] ]
			},
}

bd.biome.prototype.isLastNiche = function(niche) {
	return this.niches && this.niches.length > 0 && this.niches[this.niches.length - 1] === niche;
}

bd.biome.prototype.isFirstNiche = function(niche) {
	return this.niches && this.niches.length > 0 && this.niches[0] === niche;
}

bd.biome.prototype.prependNiche = function(biome) {
	this.startCol -= 1;

	var niche = new bd.niche(this.getNicheRow(), this.getNicheColumn(0));

	niche.setBiome(biome);
	this.buildAdditionalNiche(biome.getType(), niche);
	this.niches.unshift(niche);

	return niche;
}

bd.biome.prototype.getNextNiche = function(curNiche) {
	var i = 0;
	var nextNiche = null;

	for (i=0; i<this.niches.length; ++i) {
		if (this.niches[i] === curNiche) {
			if (i < this.niches.length - 1) {
				nextNiche = this.niches[i + 1];
			}

			break;
		}
	}

	return nextNiche;
}

bd.biome.prototype.getPrevNiche = function(curNiche) {
	var i = 0;
	var prevNiche = null;

	for (i=0; i<this.niches.length; ++i) {
		if (this.niches[i] === curNiche) {
			if (i > 0) {
				prevNiche = this.niches[i - 1];
			}

			break;
		}
	}

	return prevNiche;
}

bd.biome.prototype.tileAt = function(x, y) {
	var tile = null;

	if (!gs.worldPressInfo.tile) {
		this.contains(x, y);
	}

	tile = gs.worldPressInfo.tile;

	gs.worldPressInfo.biome = null;
	gs.worldPressInfo.tile =  null;

	return tile;
}

bd.biome.prototype.block = function() {
	assert(this.sprBlocked, "biome.block: invalid blocking sprite!");
	this.sprBlocked.reset(this.sprBlocked.x, this.sprBlocked.y);
}

bd.biome.prototype.unblock = function() {
	assert(this.sprBlocked, "biome.unblock: invalid blocking sprite!");
	this.sprBlocked.kill();
}

bd.biome.prototype.isBlocked = function() {
	return this.sprBlocked && this.sprBlocked.exists;
}

bd.biome.prototype.addNiche = function(biome) {
	var niche = new bd.niche(this.getNicheRow(), this.getNicheColumn(this.niches.length));

	niche.setBiome(biome);
	this.niches.push(niche);

	return niche;
}

bd.biome.prototype.getType = function() { return this.type; }
bd.biome.prototype.setLatitude = function(lat) { this.latitude = lat; }
bd.biome.prototype.getLatitude = function() { return this.latitude; }
bd.biome.prototype.setType = function(t) { this.type = t; }
bd.biome.prototype.setStartCol = function(s) { this.startCol = s; }
bd.biome.prototype.setStartOffset = function(i) { this.startOffset = this.offsets[Math.max(0, Math.min(i, this.offsets.length))]; }
bd.biome.prototype.build = function(layer, tileSet, type, sprBlocked) {
	var i = 0;
	var iCol = 0;
	var iRow = 0;
	var row = 0;
	var col = 0;
	var x = 0;
	var y = 0;
	var tileData = null;
	var bLastNiche = false;
	var bSpacerCell = false;
	var tile = null;

	assert(sprBlocked, 'biome.build: invalid blocking sprite!');

	this.sprBlocked = sprBlocked;
	this.sprBlocked.x = this.startOffset * TILE_SIZE;
	this.sprBlocked.y = (this.latitude * this.type.tiles.length + LAYER_OFFSET) * TILE_SIZE;
	this.sprBlocked.kill();

	this.tileSet = tileSet;
	this.layer = layer;

	for (i=0; i<this.getNumNiches(); ++i) {
		for (iRow=0; iRow<this.type.tiles.length; ++iRow) {
			row = this.latitude * this.type.tiles.length + iRow;

			if (iRow === this.type.tiles.length - 1 && i === 0) {
				x = this.startOffset * TILE_SIZE;
				y = row * TILE_SIZE;
				this.sprNoSelect = uim.getGroup().create(x, y, 'noSelect' + this.noSelectByLatitude[this.latitude]);
				this.sprNoSelect.kill();
			}

			for (iCol=0; iCol<this.type.tiles[0].length; ++iCol) {
				col = (this.startCol + i) * this.type.tiles[0].length + iCol + this.startOffset;

				bLastNiche = i === this.getNumNiches() - 1;
				bSpacerCell = iCol === this.type.tiles[0].length - 1;
				if (!bLastNiche || !bSpacerCell) {
					if (bSpacerCell) {
						tile = tm.addTilesToLayer(layer, 'ff_world', this.type.tiles[iRow][iCol], row + bd.ROW_OFFSET, col);
						if (tile) {
							tile.properties = null;
						}
					}
					else {
						tile = tm.addTilesToLayer(layer, 'ff_world', this.type.tiles[iRow][iCol], row + bd.ROW_OFFSET, col);
						if (tile) {
							tile.properties = this.niches[i];
						}
					}
				}
			}
		}
	}
}

bd.biome.prototype.buildAdditionalNiche = function(type, newNiche) {
	var iCol = 0;
	var iRow = 0;
	var row = 0;
	var col = 0;
	var x = 0;
	var y = 0;
	var tileData = null;
	var bSpacerCell = false;
	var tile = null;

	for (iRow=0; iRow<this.type.tiles.length; ++iRow) {
		row = this.latitude * this.type.tiles.length + iRow;

		if (iRow === this.type.tiles.length - 1) {
			x = this.startOffset * TILE_SIZE;
			y = row * TILE_SIZE;
		}

		for (iCol=0; iCol<this.type.tiles[0].length; ++iCol) {
			col = (this.startCol) * this.type.tiles[0].length + iCol + this.startOffset;

			bSpacerCell = iCol === this.type.tiles[0].length - 1;
			if (bSpacerCell) {
				tile = tm.addTilesToLayer(this.layer, 'ff_world', this.type.tiles[iRow][iCol], row + bd.ROW_OFFSET, col);
				if (tile) {
					tile.properties = null;
				}
			}
			else {
				tile = tm.addTilesToLayer(this.layer, 'ff_world', this.type.tiles[iRow][iCol], row + bd.ROW_OFFSET, col);
				if (tile) {
					tile.properties = newNiche;
				}
			}
		}
	}
}

bd.biome.prototype.removeTiles = function(layer) {
	var i = 0;
	var iCol = 0;
	var iRow = 0;
	var row = 0;
	var col = 0;

	for (i=0; i<this.getNumNiches(); ++i) {
		for (iRow=0; iRow<this.type.tiles.length; ++iRow) {
			row = this.latitude * this.type.tiles.length + iRow;

			for (iCol=0; iCol<this.type.tiles[0].length; ++iCol) {
				col = (this.startCol + i) * this.type.tiles[0].length + iCol + this.startOffset;
				tm.aremoveilesFromLayer(layer, bd.ROW_OFFSET, row, col);
			}
		}
	}
}

bd.biome.prototype.getNumNiches = function() {
	return this.niches ? this.niches.length : 0;
}

bd.biome.prototype.placePhaseOneCursors = function(card) {
	var nNiches = this.getNumNiches();
	var i = 0;

	for (i=0; i<nNiches; ++i) {
		if (!this.isBlocked() && this.niches[i].canAddCard(card)) {
			this.niches[i].setCursor(card);
		}
	}
}

bd.biome.prototype.getNicheColumn = function(iNiche) {
	return (this.startCol + iNiche) * this.type.tiles[0].length + this.startOffset;
}

bd.biome.prototype.getNicheRow = function() {
	return this.latitude * this.type.tiles.length + LAYER_OFFSET;
}

bd.biome.prototype.getNicheRank = function(iNiche) {
	return iNiche >= 0 &&
		   iNiche < this.niches.length &&
		   this.niches[iNiche] ? this.niches[iNiche].getRank() : -1;
}


