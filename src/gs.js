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
	iter: 0,

	worldPressInfo: {biome: null, niche: null, tile: null},
	biomeMap: null,
	biomes: [],
	layers: {ocean: null, crust: null, oceanDetail: null, terrain: null, ice: null, shadows: null, producers: null, animals: null, grid: null},
	drawDeck: [],
	discardDeck: [],
	workPoint: new Phaser.Point(),
	titleToAnimIndex: {amphibia: 0, aves: 1, insecta: 2, mammalia: 3, nematoda: 4, plantae: 5, reptilia: 6},
	specialToAnimIndex: {pollinator: 0, angiosperm: 1, symbiote: 2, hibernator: 3, decomposer: 4, migrator: 5},

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
			hibernator: ['Hibernators removed by events will reappear later.'],
			migrator: ['Migratory animals can move to any biome if displaced by an event.'],
			symbiote: ['A Symbiote protects, and is protected by, the animals to it left.'],
		},

		class: {
			herbivore: 'Herbivores must be played beneath a plant.',
			carnivore: 'Carnivores must be played beneath an herbivore, insect, or nematode.',
			scavenger: 'Scavengers must be played beneath a carnivore.'
		},
	},

	cardValueToSuit: {'0': 'P', '1': 'H', '2': 'C', '3': 'S'},

	phaseOneCards: [
		{title: 'Plantae', value: 0, keywords: 'Producer, Angiosperm', special: 'angiosperm'},
		{title: 'Plantae', value: 0, keywords: 'Small, Producer, Angiosperm', special: 'angiosperm'},
		{title: 'Nematoda', value: 1, keywords: 'Decomposer', special: 'decomposer'},
		{title: 'Insecta', value: 1, keywords: 'Producer, Pollinator', special: 'pollinator'},
		{title: 'Plantae', value: 0, keywords: 'Producer, Angiosperm', special: 'angiosperm'},
		{title: 'Plantae', value: 0, keywords: 'Small, Producer', special: ''},
		{title: 'Plantae', value: 0, keywords: 'Producer', special: ''},
		{title: 'Nematoda', value: 1, keywords: 'Decomposer', special: 'decomposer'},
		{title: 'Plantae', value: 0, keywords: 'Small, Producer, Angiosperm', special: 'angiosperm'},
		{title: 'Plantae', value: 0, keywords: 'Large, Producer', special: ''},
		{title: 'Plantae', value: 0, keywords: 'Large, Producer, Angiosperm', special: 'angiosperm'},
		{title: 'Plantae', value: 0, keywords: 'Small, Producer', special: ''},
		{title: 'Plantae', value: 0, keywords: 'Large, Producer', special: ''},
		{title: 'Plantae', value: 0, keywords: 'Small, Producer', special: ''},
		{title: 'Plantae', value: 0, keywords: 'Large, Producer, Angiosperm', special: 'angiosperm'},
		{title: 'Plantae', value: 0, keywords: 'Small, Producer', special: ''},
		{title: 'Insecta', value: 1, keywords: 'Producer, Pollinator', special: 'pollinator'},
		{title: 'Plantae', value: 0, keywords: 'Large, Producer', special: ''},
		{title: 'Plantae', value: 0, keywords: 'Producer', special: ''},
	],

	phaseTwoCards: [
		{title: 'Amphibia', value: 2, keywords: 'Small, Carnivore', special: ''},
		{title: 'Amphibia', value: 3, keywords: 'Small, Scavenger', special: ''},
		{title: 'Amphibia', value: 3, keywords: 'Scavenger, Symbiote', special: 'symbiote'},
		{title: 'Amphibia', value: 1, keywords: 'Large, Herbivore', special: ''},
		{title: 'Amphibia', value: 1, keywords: 'Large, Herbivore', special: ''},
		{title: 'Amphibia', value: 2, keywords: 'Carnivore, Migrator', special: 'migrator'},
		{title: 'Amphibia', value: 2, keywords: 'Carnivore, Hibernator', special: 'hibernator'},
		{title: 'Amphibia', value: 1, keywords: 'Herbivore', special: ''},
		{title: 'Amphibia', value: 1, keywords: 'Herbivore', special: ''},

		{title: 'Reptilia', value: 3, keywords: 'Small, Scavenger', special: ''},
		{title: 'Reptilia', value: 1, keywords: 'Small, Herbivore', special: ''},
		{title: 'Reptilia', value: 2, keywords: 'Carnivore', special: ''},
		{title: 'Reptilia', value: 1, keywords: 'Large Herbivore', special: ''},
		{title: 'Reptilia', value: 2, keywords: 'Large Carnivore', special: ''},
		{title: 'Reptilia', value: 1, keywords: 'Herbivore', special: ''},
		{title: 'Reptilia', value: 2, keywords: 'Carnivore, Symbiote', special: 'symbiote'},
		{title: 'Reptilia', value: 3, keywords: 'Scavenger, Migrator', special: 'migrator'},
		{title: 'Reptilia', value: 1, keywords: 'Herbivore, Hibernator', special: 'hibernator'},

		{title: 'Aves', value: 2, keywords: 'Large, Carnivore', special: ''},
		{title: 'Aves', value: 3, keywords: 'Scavenger, Hibernator', special: 'hibernator'},
		{title: 'Aves', value: 1, keywords: 'Small, Herbivore', special: ''},
		{title: 'Aves', value: 1, keywords: 'Herbivore, Migrator', special: 'migrator'},
		{title: 'Aves', value: 1, keywords: 'Small, Herbivore', special: ''},
		{title: 'Aves', value: 3, keywords: 'Scavenger', special: ''},
		{title: 'Aves', value: 2, keywords: 'Carnivore, Symbiote', special: 'symbiote'},
		{title: 'Aves', value: 2, keywords: 'Small, Carnivore', special: ''},
		{title: 'Aves', value: 1, keywords: 'Herbivore', special: ''},

		{title: 'Mammalia', value: 1, keywords: 'Large, Herbivore', special: ''},
		{title: 'Mammalia', value: 2, keywords: 'Carnivore', special: ''},
		{title: 'Mammalia', value: 3, keywords: 'Scavenger, Hibernator', special: 'hibernator'},
		{title: 'Mammalia', value: 1, keywords: 'Herbivore, Migrator', special: 'migrator'},
		{title: 'Mammalia', value: 3, keywords: 'Large, Scavenger', special: ''},
		{title: 'Mammalia', value: 1, keywords: 'Herbivore, Symbiote', special: 'symbiote'},
		{title: 'Mammalia', value: 2, keywords: 'Small, Carnivore', special: ''},
		{title: 'Mammalia', value: 2, keywords: 'Large, Carnivore', special: ''},
		{title: 'Mammalia', value: 1, keywords: 'Herbivore', special: ''},

		{title: '', value: 0, keywords: '', special: ''},
	],

	indexInfo: {tile: -1, shadow: -1},

	// In the following table:
	// '0' indicates 'no entry'
	// Positive numbers represent indeces into the 'world' tileset.
	// Negative numbers represent indeces into the 'creatures' tileset.
	producerIndexTable: {
		desert: {
			plantae: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: [218, 219, 220], 	shadow: 2114}, 	small: {tile: [108, 109, 110], 	shadow: 0}},
			insecta: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -69, 			  	shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
			nematoda: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -177, 			  	shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
		},
		plains: {
			plantae: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: [103, 104, 105], 	shadow: 0}, 	small: {tile: [157, 158, 159], 	shadow: 0}},
			insecta: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -69, 			  	shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
			nematoda: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -177, 			  	shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
		},
		forest: {
			plantae: 	{large: {tile: {arctic: 275, normal: [274, 269, 270]}, 	shadow: 2114},	normal: {tile: 102, 				shadow: 2113},	small: {tile: 164, 				shadow: 2113}},
			insecta: 	{large: {tile: 0, 										shadow: 0}, 	normal: {tile:-69,					shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
			nematoda: 	{large: {tile: 0, 										shadow: 0}, 	normal: {tile:-177,					shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
		},
		wetlands: {
			plantae: 	{large: {tile: [269, 270, 271, 272], 					shadow: 2114}, 	normal: {tile: [102, 107], 			shadow: 2113}, 	small: {tile: [111, 112], 		shadow: 0}},
			insecta: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -69, 				shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
			nematoda: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -177, 				shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
		},
		mountains: {
			plantae: 	{large: {tile: {arctic: 275, normal: 274}, 				shadow: 2114},	normal: {tile: 163, 				shadow: 2113},	small: {tile: [103, 104, 105], 	shadow: 0}},
			insecta: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -69, 				shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
			nematoda: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: -177, 				shadow: 2111}, 	small: {tile: 0, 				shadow: 0}},
		},
	},

	consumerIndexTable: {
		amphibia: {
			herbivore: 	{large: {tile: 0, shadow: 0}, normal: {tile: 0, shadow: 0}, small: {tile: 0, shadow: 0}},
			carnivore: 	{large: {tile: 0, shadow: 0}, normal: {tile: 0, shadow: 0}, small: {tile: 0, shadow: 0}},
			scavenger: 	{large: {tile: 0, shadow: 0}, normal: {tile: 0, shadow: 0}, small: {tile: 0, shadow: 0}},
		},

		aves: {
			herbivore: 	{large: {tile: 0, shadow: 0}, normal: {tile: 0, shadow: 0}, small: {tile: 0, shadow: 0}},
			carnivore: 	{large: {tile: 0, shadow: 0}, normal: {tile: 0, shadow: 0}, small: {tile: 0, shadow: 0}},
			scavenger: 	{large: {tile: 0, shadow: 0}, normal: {tile: 0, shadow: 0}, small: {tile: 0, shadow: 0}},
		},

		mammalia: {
			herbivore: 	{large: {tile: 0, shadow: 0}, normal: {tile: 0, shadow: 0}, small: {tile: 0, shadow: 0}},
			carnivore: 	{large: {tile: 0, shadow: 0}, normal: {tile: 0, shadow: 0}, small: {tile: 0, shadow: 0}},
			scavenger: 	{large: {tile: 0, shadow: 0}, normal: {tile: 0, shadow: 0}, small: {tile: 0, shadow: 0}},
		},

		reptilia: {
			herbivore: 	{large: {tile: 0, shadow: 0}, normal: {tile: 0, shadow: 0}, small: {tile: 0, shadow: 0}},
			carnivore: 	{large: {tile: 0, shadow: 0}, normal: {tile: 0, shadow: 0}, small: {tile: 0, shadow: 0}},
			scavenger: 	{large: {tile: 0, shadow: 0}, normal: {tile: 0, shadow: 0}, small: {tile: 0, shadow: 0}},
		}
	}
};

gs.getNumBiomes = function() {
	return this.biomes.length;
};

gs.populateNiche = function(card, niche) {
	var rank = niche.getRank();
	var failMsg = null;

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
	}

	if (!failMsg) {
		niche.addCard(card);
	}

	return failMsg;
};

gs.getTileIndexForCardInBiome = function(card, biome) {
	var title = card ? gs.getCardTitle(card).toLowerCase() : null;
	var bPlantInsectOrNematode = gs.isCardPlantInsectOrNematode(card);
	var keywords = card ? gs.getCardKeywords(card).toLowerCase() : null;
	var bIsLarge = keywords ? keywords.indexOf('large') >= 0 : false;
	var bIsSmall = keywords ? keywords.indexOf('small') >= 0 : false;
	var bIsArctic = biome.getLatitude() === 0 || biome.getLatitude() === this.biomes.length - 1;
	var size = bIsLarge ? 'large' : (bIsSmall ? 'small' : 'normal');
	var biomeType = biome ? biome.getType().name.toLowerCase() : null;
	var indexInfo = null;
	var tileInfo = null;

	assert(title && keywords, "getTileIndexForCardInBiome: invalid card data!");
	assert(biomeType, "getTileIndexForCardInBiome: invalid biome data!");

	gs.indexInfo.tile = 0;
	gs.indexInfo.shadow = 0;

	if (bPlantInsectOrNematode) {
		indexInfo = gs.producerIndexTable[biomeType][title][size]
	}
	else {
		indexInfo = gs.consumerIndexTable[biomeType][title][size]
	}

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

gs.getCardSuit = function(card) {
	var key = card ? '' + card.value : 'unknown';

	return card && card.hasOwnProperty(key) ? gs.cardValueToSuit['' + card.value] : '?';
};

gs.getCardTitle = function(card) {
	return card ? card.title : null;
};

gs.getCardKeywords = function(card) {
	return card ? card.keywords : null;
};

gs.getCardValue = function(card) {
	return card ? card.value : -1;
};

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

gs.showTargetableBiomes = function(card) {
	assert(card, "showTargetableBiomes: invalid card!");

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
		// IN_PROGRESS
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
	tm.scrambleList(gs.drawDeck);
};

gs.initDiscardDeck = function() {
	gs.discardDeck.length = 0;
};

gs.discardAndReplace = function(card) {
	var i = 0;
	var bReplaced = false;

	assert(card, "discardAndReplace: invalid card!");

	for (i=0; i<gs.drawDeck.length; ++i) {
		if (gs.drawDeck[i] === card) {
			bReplaced = tm.listReplaceLastNonNull(gs.drawDeck, i);
			break;
		}
	}

	if (bReplaced) {
		uim.setFocusBannerInfo(gs.getDrawDeckType(i),
						   	   gs.getDrawDeckValue(i),
						   	   gs.getDrawDeckKeywords(i),
						   	   gs.getDrawDeckSpecial(i),
						   	   gs.getDrawDeckCard(i));

	}
	else {
		uim.setFocusBannerInfo(null, -1, null, null, null);
	}

	return bReplaced;
};

gs.playerHasLegalMove = function() {
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
			nPlays = this.countPlays(card, bLargePlant);

			if (nPlays > 0) {
				bHasLegalMove = true;
				break;
			}
		}
	}

	return bHasLegalMove;
};

gs.countPlays = function(card, bLargePlant) {
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
				if (gs.getCardValue(card) > this.biomes[iBiome].getNicheRank(iNiche)) {
					nPlays += 1;
				}
			}
		}
	}

	return nPlays;
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

bd.niche.prototype.getTopRow = function() {
	return this.topRow;
};

bd.niche.prototype.getLeftCol = function() {
	return this.leftCol;
};

bd.niche.prototype.addCard = function(card) {
	this.cards.push(card);
};

bd.niche.prototype.canAddCard = function(card) {
	var bCanAddCard = false;

	assert(card, 'niche.addCard: invalid card!');

	if (this.cards.length === 0 && gs.isCardPlantInsectOrNematode(card)) {
		bCanAddCard = true;
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
	var rank = this.cards.length;
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


