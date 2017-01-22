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

// GameState
gs =  {
	LINK_ALPHA: 0.5,
	WILD_CARD_VALUE: 4,
 	SPRITE_SCALE: 1.5,

//	linkTile: {down: 284, right: 282, left: 283},
	linkTile: {down: 81, right: 81, left: 81, up: 81},

	iter: 0,

	worldPressInfo: {biome: null, niche: null, tile: null},
	biomeMap: null,
	baseMap: null,
	biomes: [],
	layers: {ocean: null, crust: null, oceanDetail: null, terrain: null, ice: null, shadows: null, producers: null, animals: null, links: null, grid: null},
	baseLayers: {floor: null, walls: null, objects: null, ui: null},
	drawDeck: [],
	discardDeck: [],
	workPoint: new Phaser.Point(),
	titleToAnimIndex: {amphibia: 3, aves: 5, insecta: 6, mammalia: 2, nematoda: 3, plantae: 1, reptilia: 0},
	specialToAnimIndex: {pollinator: 0, angiosperm: 1, symbiote: 2, adaptor: 3, decomposer: 4, migrator: 5},

 	cardInfo: {
		plantae: {
			large: ['Large plants cannot grow in deserts or\nplains.', 'Some events do extra damage to Large\nplants. Some do less.'],
			small: ['Some events do extra damage to Small\nplants. Some do less.'],
			angiosperm: ['An Angiosperm can regrow from seeds\nconsumed by the animal below it.'],
		},

		animalia: {
			large: ['Some events do extra damage to Small\nanimals. Some do less.'],
			small: ['Some events to extra damage to Large\nanimals. Some do less.'],
			pollinator: ['A Pollinator strengthens the plant to its\nright by increasing its genetic diversity.'],
			decomposer: ['A Decomposer adds 1 niche to its biome.'],
			adaptor: ['Adaptors can can change role (herbivore,\ncarnivore, or scavenger) when displaced.'],
			migrator: ['Migratory animals can move to any biome\nif displaced by an event.'],
			symbiote: ['A Symbiote protects, and is protected by,\nthe animal to it left.'],
		},

		class: {
			herbivore: 'Herbivores must be played beneath a plant.',
			carnivore: 'Carnivores must be played beneath an\nherbivore, insect, or nematode.',
			scavenger: 'Scavengers must be played beneath a\ncarnivore.',
			omnivore: 'Omnivores can be played as an herbivore,\ncarnivore, or scavenger.',
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

gs.getBaseOffsetY = function() {
	return -30.0;
};

gs.getOffsetX = function() {
	return -TILE_SIZE * 5 - TILE_SIZE / 2;
};

gs.getOffsetY = function() {
	return TILE_SIZE * 1.75;
};

gs.getNumBiomes = function() {
	return this.biomes.length;
};

gs.getBiomeOffset = function(iBiome) {
	return iBiome >= 0 && iBiome < bd.biome.prototype.offsets.length ? bd.biome.prototype.offsets[iBiome] : -1;
};

gs.getMaxBiomeOffset = function() {
	var i = 0;
	var max = -1;

	for(i=0; i<bd.biome.prototype.offsets.length; ++i) {
		if (max < bd.biome.prototype.offsets[i]) {
			max = bd.biome.prototype.offsets[i];
		}
	}

	return max;
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

gs.getCardSuit = function(card, optTitle) {
	var value = typeof(card) === 'number' ? card : card.value;
	var key = card ? '' + value : 'unknown';
	var suit = card &&  gs.cardValueToSuit.hasOwnProperty(key) ? gs.cardValueToSuit['' + value] : '?';
	var title = optTitle ? optTitle : typeof(card) !== 'number' ? gs.getCardTitle(card).toLowerCase() : null;

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
	var _x = 0;
	var _y = 0;

	_x = uim.UiToWorldX(x);
	_y = uim.UiToWorldY(y);

	this.worldPressInfo.biome = null;
	this.worldPressInfo.tile  = null;

	this.workPoint = terrain.getTileXY(_x, _y, this.workPoint);
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
		else if (gs.getCardTitle(card).toLowerCase() === 'nematoda') {
			this.blockLargeBiomes();
		}
	}
};

gs.blockLargeBiomes = function() {
	var i = 0;

	for (i=0; i<this.biomes.length; ++i) {
		if (this.biomes[i].niches.length >= this.biomes[i].maxSizeAtLatitude[i] ||
			this.biomes[i].getNumNiches() * 3 + gs.getBiomeOffset(this.biomes[i]) >= (bd.biome.prototype.MAX_SIZE - 1) * 3) {
			this.biomes[i].block();
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

gs.showNextCardHints = function() {
	var i = 0;

	for (i=0; i<this.biomes.length; ++i) {
		this.biomes[i].showNextCardHints();
	}
}



