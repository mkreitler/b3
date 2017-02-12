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
	LINK_ALPHA: 0.67,
	SPECIAL_ALPHA: 0.5,
	WILD_CARD_VALUE: 4,
 	SPRITE_SCALE: 1.5,

//	linkTile: {down: 284, right: 282, left: 283},
	linkTile: {down: 81, right: 81, left: 81, up: 81},

	iter: 0,

	bLogging: true,
	cardLog: [],
	debugLog: [
		{"biomes":"{~Mountains~0~3~2~}{~Plains~1~2~3~}{~Wetlands~2~2~4~}{~Desert~3~2~3~}{~Forest~4~3~2~}","cards":[]},
		{"biomes":"{~Mountains~0~3~2~}{~Desert~1~1~3~}{~Wetlands~2~2~4~}{~Forest~3~1~3~}{~Forest~4~2~2~}","cards":["3~1~2","6~1~1","15~1~0","12~0~1","2~0~0","4~2~3","0~2~2","13~3~2","8~4~1","9~2~1","5~3~1","14~4~0","10~2~0","16~3~0","69~0~1"]},
		{"biomes":"{~Mountains~0~3~2~}{~Desert~1~1~3~}{~Wetlands~2~2~4~}{~Forest~3~1~3~}{~Forest~4~2~2~}","cards":["3~1~2","6~1~1","15~1~0","12~0~1","2~0~0","4~2~3","0~2~2","13~3~2","8~4~1","9~2~1","5~3~1","14~4~0","10~2~0","16~3~0","69~0~1","38~0~1","21~1~2","27~1~1","71~2~2","65~0~1","30~4~0","28~3~2","32~3~1","29~4~1","49~0~0","39~1~0","56~1~0","37~4~1","51~4~1","22~2~3","50~1~1","47~1~2","24~2~1","66~0~0","59~1~2","48~2~3","17~2~0","46~2~0","25~3~0","64~1~1","34~2~2","54~2~3","67~2~2","35~4~0","45~2~1","41~3~2","55~2~1","43~3~0","53~4~0","70~3~1","57~3~2","68~3~1"]},
		{"biomes":"{~Mountains~0~4~2~}{~Wetlands~1~1~3~}{~Desert~2~2~4~}{~Plains~3~2~3~}{~Plains~4~3~2~}","cards":["0~2~3","10~2~2","15~2~1","9~1~2","3~3~2","4~4~1","1~1~1","12~3~1","7~3~0","13~1~1","8~2~0","2~3~0","6~1~0","16~0~1","14~4~0","11~0~0"]},
	],
	iRestore: -1,
	logData: '',

	lastPopulationCount: 0,
	worldPressInfo: {biome: null, niche: null, tile: null},
	biomeMap: null,
	baseMap: null,
	biomes: [],
	biomeStore: [
		null, null, null, null, null
	],
	availableBiomes: [],
	nicheStore: [
		// Default niches
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,

		// Possible additions from nematodes
		null,
		null,
	],
	availableNiches: [],
	layers: {ocean: null, crust: null, oceanDetail: null, terrain: null, ice: null, shadows: null, producers: null, animals: null, links: null, grid: null},
	baseLayers: {floor: null, walls: null, objects: null, ui: null},
	drawDeck: [],
	primaryDrawDeck: [],
	discardDeck: [],
	displacementDeck: [],
	workPoint: new Phaser.Point(),
	titleToAnimIndex: {amphibia: 3, aves: 5, insecta: 6, mammalia: 2, nematoda: 3, plantae: 1, reptilia: 0},
	specialToAnimIndex: {pollinator: 0, angiosperm: 1, symbiote: 2, adaptor: 3, decomposer: 4, migrator: 5},
	biomeScores: [],
	bPhaseOne: false,

	discardFn: [
		this.canDiscardPlantae,
		this.canDiscardAnimal
	],

 	cardInfo: {
		plantae: {
			producer: [strings.DESCRIPTIONS.PRODUCER],
			large: [strings.DESCRIPTIONS.LARGE_PLANT],
			small: [strings.DESCRIPTIONS.SMALL_PLANT],
			angiosperm: [strings.DESCRIPTIONS.ANGIOSPERM],
		},

		animalia: {
			pollinator: [strings.DESCRIPTIONS.POLLINATOR],
			decomposer: [strings.DESCRIPTIONS.DECOMPOSER],
			adaptor: [strings.DESCRIPTIONS.ADAPTOR],
			migrator: [strings.DESCRIPTIONS.MIGRATOR],
			symbiote: [strings.DESCRIPTIONS.SYMBIOTE],
		},

		class: {
			herbivore: strings.WARNINGS.HERBIVORE,
			carnivore: strings.WARNINGS.CARNIVORE,
			scavenger: strings.WARNINGS.SCAVENGER,
			omnivore: strings.WARNINGS.OMNIVORE,
		},
	},

	cardValueToSuit: {'0': 'P', '1': 'H', '2': 'C', '3': 'S', '4': 'W'},

	phaseOneCards: [
		{id: 0, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer, Angiosperm', special: 'angiosperm'},
		{id: 1, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Nematoda', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Decomposer', special: 'decomposer'},
		{id: 2, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Insecta', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer, Pollinator', special: 'pollinator'},
		{id: 3, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer, Angiosperm', special: 'angiosperm'},
		{id: 4, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Producer', special: ''},
		{id: 5, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer', special: ''},
		{id: 6, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer', special: ''},
		{id: 7, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Nematoda', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Decomposer', special: 'decomposer'},
		{id: 8, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Producer, Angiosperm', special: 'angiosperm'},
		{id: 9, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Producer, Angiosperm', special: 'angiosperm'}, // DEBUG: remove 'angiosperm' keyword
		{id: 10, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Producer', special: ''},
		{id: 11, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Producer', special: ''},
		{id: 12, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Producer', special: ''},
		{id: 13, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Producer, Angiosperm', special: 'angiosperm'},
		{id: 14, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Producer', special: ''},
		{id: 15, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Insecta', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Producer, Pollinator', special: 'pollinator'},
		{id: 16, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Plantae', niche: null, value: 0, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Producer', special: ''},
	],

	phaseTwoCards: [
		{id: 17, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Herbivore', special: ''},
		{id: 18, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Herbivore', special: ''},
		{id: 19, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Herbivore', special: ''},
		{id: 20, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Herbivore', special: ''},
		{id: 21, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Herbivore, Migrator', special: 'migrator'},
		{id: 22, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Herbivore, Symbiote', special: 'symbiote'},
		{id: 23, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Herbivore', special: ''},
		{id: 24, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Herbivore, Migrator', special: 'migrator'},
		{id: 25, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Small, Herbivore', special: ''},
		{id: 26, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Small, Herbivore', special: ''},
		{id: 27, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Herbivore', special: ''},
		{id: 28, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Herbivore, Symbiote', special: 'symbiote'},
		{id: 29, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Herbivore, Migrator', special: 'migrator'},
		{id: 30, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Herbivore', special: ''},
		{id: 31, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Herbivore', special: ''},
		{id: 32, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Herbivore', special: ''},
		{id: 33, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 1, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Herbivore, Symbiote', special: 'symbiote'},

		{id: 34, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Carnivore, Symbiote', special: 'symbiote'},
		{id: 35, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Large, Carnivore', special: ''},
		{id: 36, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Carnivore', special: ''},
		{id: 37, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Small, Carnivore', special: ''},
		{id: 38, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Small, Carnivore, Migrator', special: 'migrator'},
		{id: 39, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Carnivore', special: ''},
		{id: 40, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Carnivore', special: ''},
		{id: 41, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Carnivore, Symbiote', special: 'symbiote'},
		{id: 42, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Carnivore', special: ''},
		{id: 43, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Carnivore', special: ''},
		{id: 44, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Carnivore', special: ''},
		{id: 45, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Carnivore', special: ''},
		{id: 46, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Carnivore, Migrator', special: 'migrator'},
		{id: 47, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Carnivore, Symbiote', special: 'symbiote'},
		{id: 48, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Carnivore', special: ''},
		{id: 49, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Carnivore, Migrator', special: 'migrator'},
		{id: 50, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 2, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Carnivore', special: ''},

		{id: 51, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Scavenger, Symbiote', special: 'symbiote'},
		{id: 52, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Scavenger, Migrator', special: 'migrator'},
		{id: 53, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Scavenger', special: ''},
		{id: 54, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Scavenger', special: ''},
		{id: 55, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Scavenger', special: ''},
		{id: 56, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Small, Scavenger', special: ''},
		{id: 57, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Small, Scavenger', special: ''},
		{id: 58, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Scavenger, Symbiote', special: 'symbiote'},
		{id: 59, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Scavenger', special: ''},
		{id: 60, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Scavenger', special: ''},
		{id: 61, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Scavenger, Symbiote', special: 'symbiote'},
		{id: 62, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Scavenger, Migrator', special: 'migrator'},
		{id: 63, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Scavenger', special: ''},
		{id: 64, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Scavenger', special: ''},
		{id: 65, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Scavenger', special: ''},
		{id: 66, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Large, Scavenger', special: ''},
		{id: 67, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 3, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Small, Scavenger, Migrator', special: 'migrator'},

		{id: 68, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Amphibia', niche: null, value: 4, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Omnivore, Adaptor', special: 'adaptor'},
		{id: 69, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Reptilia', niche: null, value: 4, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Omnivore, Adaptor', special: 'adaptor'},
		{id: 70, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Aves', niche: null, value: 4, linkedCards: {above: null, right: null, below: null, left: null}, 	keywords: 'Omnivore, Adaptor', special: 'adaptor'},
		{id: 71, coCard: null, bRemovePending: false, bWantsRemoved: false, title: 'Mammalia', niche: null, value: 4, linkedCards: {above: null, right: null, below: null, left: null}, keywords: 'Omnivore, Adaptor', special: 'adaptor'},
	],

	cardSpecialFunctionTable: {
		onPlayed: {
			decomposer: 'addNiche',
		},

		onDestroyed: {
			angiosperm: 'transferSeeds',
			migrator: 'migrate',
		},

		onDisplaced: {
			adaptor: 'adapt',
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
			plantae: 	{large: {tile: 0, shadow: 0}, 											normal: {tile: [102, 107, 163], 	shadow: 0}, 	small: {tile: [157, 158, 159], 	shadow: 0}},
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
			omnivore: 	{large: {tile: 77, shadow: 2110}, normal: {tile: 78, shadow: 2111}, small: {tile: 79, shadow: 2110}},
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

gs.stockStores = function() {
	var i = 0;

	for (i=0; i<this.biomeStore.length; ++i) {
		this.biomeStore[i] = new bd.biome();
	}

	for (i=0; i<this.nicheStore.length; ++i) {
		this.nicheStore[i] = new bd.niche(0, 0);
	}
};

gs.startGame = function(data) {

	uim.clearFocusBanner();

	gs.init();
	events.init();
	generateStartingTerrain();
	setState(sm.startPhaseOne);
};

gs.instructions = function(data) {
	uim.clearFocusBanner();
	this.restoreGameState(0);
	setState(sm.startTutorial);
};

gs.getNextAvailableBiome = function() {
	var biome = gs.availableBiomes.shift();

	assert(biome, "getNextAvailableBiome: out of biomes!");

	biome.init();

	return biome;
};

gs.getNextAvailableNiche = function() {
	var niche = gs.availableNiches.shift();

	assert(niche, "getNextAvailableNiche: out of niches!");

	niche.init();

	return niche;
};

gs.seedTutorialDeck = function(iDeck) {
	this.drawDeck.length = 0;

	switch (iDeck) {
		case 0:
			this.drawDeck.push(this.phaseOneCards[5]);
			this.drawDeck.push(this.phaseOneCards[5]);
			this.drawDeck.push(this.phaseOneCards[5]);
			this.drawDeck.push(this.phaseOneCards[5]);
			this.drawDeck.push(this.phaseOneCards[5]);
			this.drawDeck.push(this.phaseOneCards[5]);
		break;

		case 1:
			this.drawDeck.push(this.phaseTwoCards[6]);
			this.drawDeck.push(this.phaseTwoCards[6]);
			this.drawDeck.push(this.phaseTwoCards[6]);
			this.drawDeck.push(this.phaseTwoCards[6]);
			this.drawDeck.push(this.phaseTwoCards[6]);
			this.drawDeck.push(this.phaseTwoCards[6]);
		break;

		case 2:
			this.drawDeck.push(this.phaseTwoCards[21]);
			this.drawDeck.push(this.phaseTwoCards[21]);
			this.drawDeck.push(this.phaseTwoCards[21]);
			this.drawDeck.push(this.phaseTwoCards[21]);
			this.drawDeck.push(this.phaseTwoCards[21]);
			this.drawDeck.push(this.phaseTwoCards[21]);
		break;

		case 3:
			this.drawDeck.push(this.phaseTwoCards[52]);
			this.drawDeck.push(this.phaseTwoCards[52]);
			this.drawDeck.push(this.phaseTwoCards[52]);
			this.drawDeck.push(this.phaseTwoCards[52]);
			this.drawDeck.push(this.phaseTwoCards[52]);
			this.drawDeck.push(this.phaseTwoCards[52]);
		break;
	}
};

gs.toggleSound = function(data) {
	uim.clearFocusBanner();
};

gs.getBiomeId = function(biome) {
	var i = 0;
	var id = -1;

	for (i=0; i<this.biomes.length; ++i) {
		if (biome === this.biomes[i]) {
			id = i;
			break;
		}
	}

	return id;
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

gs.isPhaseOne = function() {
	return gs.bPhaseOne;
};

gs.setPhaseOne = function(bIsPhaseOne) {
	gs.bPhaseOne = bIsPhaseOne;
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

gs.isLogging = function() {
	return this.bLogging;
};

gs.saveGameState = function() {
	var i = 0;
	var saveData = {biomes: null, cards: null};

	if (gs.isLogging()) {
		for (i=0; i<this.biomes.length; ++i) {
			if (saveData.biomes) {
				saveData.biomes += '{~' + this.biomes[i].type.name + '~' + this.biomes[i].latitude + '~' + (this.biomes[i].startCol + this.biomes[i].getNumPrepended()) + '~' + (this.biomes[i].getNumNiches() - this.biomes[i].getNumPrepended()) + '~}';
			}
			else {
				saveData.biomes = '{~' + this.biomes[i].type.name + '~' + this.biomes[i].latitude + '~' + (this.biomes[i].startCol + this.biomes[i].getNumPrepended()) + '~' + (this.biomes[i].getNumNiches() - this.biomes[i].getNumPrepended()) + '~}';
			}
		}

		saveData.cards = this.cardLog;

		console.log(JSON.stringify(saveData));
	}
};

gs.doRestoreGame = function() {
	return this.iRestore !== -1;
};

gs.restoreGameState = function(iSave) {
	var gameData = null;
	var bIsPhaseOneRestore = false;
	var iOldRestore = this.iRestore;

	if (typeof(iSave) !== "undefined") {
		this.iRestore = iSave;
	}

	if (this.iRestore >= 0 && this.iRestore < this.debugLog.length) {
		gameData = gs.debugLog[this.iRestore];
		gs.rebuildBiomes(gameData.biomes);
		bIsPhaseOneRestore = gs.populateBiomes(gameData.cards);
	}
	else {
		assert(false, "restoreGameState: invalid restore ID!");
	}

	this.iRestore = iOldRestore;

	return bIsPhaseOneRestore;
};

gs.getEggIndexFromType = function(typeName) {
	var iEgg = -1;

	typeName = typeName.toLowerCase();

	if (gs.titleToAnimIndex.hasOwnProperty(typeName)) {
		iEgg = gs.titleToAnimIndex[typeName];
	}

	return iEgg;
};

gs.getBiomesOfType = function(typeName, biomesOut) {
	var i = 0;

	typeName = typeName.toLowerCase();

	for (i=0; i<this.biomes.length; ++i) {
		if (this.biomes[i].getType().name.toLowerCase() === typeName) {
			biomesOut.push(this.biomes[i]);
		}
	}
}

gs.rebuildBiomes = function(biomeData) {
	var biomes = biomeData.split('{');
	var biomeInfo = null;
	var iNiche = 0;
	var iBiome = 0;
	var typeName = '';
	var latitude = -1;
	var startCol = -1;
	var nNiches = 0;
	var biome = null;
	var biomeList = [];
	var key = null;
	var startOffset = -1;

	for (iBiome=1; iBiome<biomes.length; ++iBiome) {
		biome = gs.getNextAvailableBiome();

		biomeInfo = biomes[iBiome].split('~');
		typeName = biomeInfo[1];

		biome.setType(biome.TYPES[typeName.toUpperCase()]);
		biome.setLatitude(parseInt(biomeInfo[2]));

		startOffset = biome.offsets[iBiome - 1];

		biome.setStartCol(parseInt(biomeInfo[3]));

		nNiches = parseInt(biomeInfo[4]);

		for (iNiche=0; iNiche<nNiches; ++iNiche) {
			biome.addNiche(biome);
		}
	
		blocker = uim.addBlocker(0, 0, 'noSelectLarge');

		biome.build(gs.layers.terrain, 'ff_world', biome.getType(), blocker);

		gs.biomes.push(biome);
	}
};

gs.populateBiomes = function(cardData) {
	var i = 0;
	var card = null;
	var cardInfo = null;
	var cardId = -1;
	var biomeId = -1;
	var nicheId = -1;
	var biome = null;
	var niche = null;
	var bPhaseOneRestore = true;
	var failMsg = null;
	var cardsAdded = [];

	if (cardData.length >= this.getNumNiches()) {
		bPhaseOneRestore = false;
		gs.removeInsectsAndNematodes();
		gs.addPhaseTwoCards();
	}

	for (i=0; i<cardData.length; ++i) {
		if (i < this.phaseOneCards.length && !gs.isPhaseOne()) {
			gs.setPhaseOne(true);
		}
		else if (i >= this.phaseOneCards.length && gs.isPhaseOne()) {
			gs.setPhaseOne(false);
		}

		cardInfo = cardData[i].split('~');
		assert(cardInfo.length === 3, "populateBiomes: invalid cardInfo!");

		cardId = parseInt(cardInfo[0]);
		biomeId = parseInt(cardInfo[1]);
		nicheId = parseInt(cardInfo[2]);

		assert(biomeId >= 0 && biomeId < this.biomes.length, "populateBiomes: invalid biome ID!");

		biome = this.biomes[biomeId];

		assert(nicheId >= 0 && nicheId < biome.getNumNiches());

		niche = biome.getNicheAt(nicheId);

		card = this.getCardWithId(cardId);

		cardsAdded.push(card);

		tm.listNullAndMoveToBack(this.drawDeck, card, true);

		failMsg = this.populateNiche(card, niche);
		if (failMsg) {
			console.log("FAIL: " + cardData[i] + "-- " + failMsg)
		}
	}

	assert(tm.listsExclusive(this.drawDeck, cardsAdded), "populateBiomes: drawDeck and world share cards!");

	return bPhaseOneRestore;
};

gs.getNiche = function(iBiome, iNiche) {
	assert(iBiome >= 0 && iBiome < this.biomes.length, "getNiche: invalid biome index!");

	return this.biomes[iBiome].getNicheAt(iNiche);
};

gs.addLogData = function(data) {
	this.logData += data;
};

gs.clearLogData = function() {
	this.logData = '';
};

gs.saveLogData = function() {
	this.cardLog.push(this.logData);
};

gs.getCardWithId = function(id) {
	var i = 0;
	var card = null;

	if (typeof(id) === "string") {
		id = parseInt(id);
	}

	if (id >= this.phaseOneCards.length) {
		card = this.phaseTwoCards[id - this.phaseOneCards.length];
	}
	else {
		card = this.phaseOneCards[id];
	}

	return card;
};

gs.eraseCard = function(card) {
	var niche = card ? gs.getCardNiche(card) : null;
	var rank = niche ? niche.getRankForCard(card) : -1;

	assert(niche, "eraseCard: invalid card or niche!");

	switch(gs.getCardTitle(card).toLowerCase()) {
		case 'plantae': case 'insecta': case 'nematoda':
			tm.removeTileFromLayer(gs.layers.shadows, niche.getTopRow(), niche.getLeftCol() + 1);
			tm.removeTileFromLayer(gs.layers.producers, niche.getTopRow(), niche.getLeftCol() + 1);
			tm.removeTileFromLayer(gs.layers.animals, niche.getTopRow(), niche.getLeftCol() + 1);

			special = gs.getCardSpecial(card);
			switch (special) {
				case 'angiosperm':
					tm.removeTileFromLayer(gs.layers.grid, niche.getTopRow(), niche.getLeftCol());
				break;

				case 'pollinator':
					tm.removeTileFromLayer(gs.layers.grid, niche.getTopRow(), niche.getLeftCol() + 2);
				break;
			}
		break;

		default:
			assert(rank > 0, "eraseCard: invalid rank!");

			tm.removeTileFromLayer(gs.layers.shadows, niche.getTopRow() + rank, niche.getLeftCol() + 1);
			tm.removeTileFromLayer(gs.layers.animals, niche.getTopRow() + rank, niche.getLeftCol() + 1);

			special = gs.getCardSpecial(card);
			switch (special) {
				case 'migrator': case 'symbiote': case 'adaptor':
					tm.removeTileFromLayer(gs.layers.grid, niche.getTopRow() + rank, niche.getLeftCol());
				break;
			}
		break;
	}
};

gs.populateNiche = function(card, niche) {
	var failMsg = null;
	var keywords = [];
	var length = 0;
	var special = null;
	var rank = -1;

	switch(gs.getCardTitle(card).toLowerCase()) {
		case 'plantae': case 'insecta': case 'nematoda':
			if (!niche.hasOrganismAtRank(0)) {
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

				special = gs.getCardSpecial(card);
				switch (special) {
					case 'angiosperm':
						tm.addTilesToLayer(gs.layers.grid, 'ff_world', 135, niche.getTopRow(), niche.getLeftCol());
					break;

					case 'pollinator':
						tm.addTilesToLayer(gs.layers.grid, 'ff_world', 134, niche.getTopRow(), niche.getLeftCol() + 2);
					break;
				}
			}
			else {
				failMsg = strings.INFO.NICHE_FULL_PRODUCER;
			}
		break;

		default:
			gs.getTileIndexForCardInBiome(card, niche.getBiome());

			rank = niche.getRankForNewCard(card);

			if (rank >= 0) {
				if (gs.indexInfo.shadow) {
					tm.addTilesToLayer(gs.layers.shadows, 'ff_world', gs.indexInfo.shadow, niche.getTopRow() + rank, niche.getLeftCol() + 1);
				}

				tm.addTilesToLayer(gs.layers.animals, 'ff_world', gs.indexInfo.tile, niche.getTopRow() + rank, niche.getLeftCol() + 1);

				if (gs.getCardValue(card) === gs.WILD_CARD_VALUE) {
					gs.setCardValue(card, rank);
				}

				special = gs.getCardSpecial(card);
				switch (special) {
					case 'migrator':
						tm.addTilesToLayer(gs.layers.grid, 'ff_world', 139, niche.getTopRow() + rank, niche.getLeftCol());
					break;

					case 'symbiote':
						tm.addTilesToLayer(gs.layers.grid, 'ff_world', 136, niche.getTopRow() + rank, niche.getLeftCol());
					break;

					case 'adaptor':
						tm.addTilesToLayer(gs.layers.grid, 'ff_world', 137, niche.getTopRow() + rank, niche.getLeftCol());
					break;
				}
			}
			else if (rank !== niche.ERR_INVALID_PLACEMENT && rank !== niche.ERR_MAX_RANK_EXCEED) {
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
			else {
				failMsg = strings.INFO.NICHE_FULL;
			}
		break;
	}

	if (!failMsg) {
		if (this.bLogging) {
			this.cardLog.push(card.id + '~' + niche.getBiomeId() + '~' + niche.getId());
		}

		niche.addCard(card);

		// TODO: remove this code if nothing hits the 'assert' after a while.
		keywords = gs.getCardKeywords(card).split(',');
		for (i=0; i<keywords.length; ++i) {
			keywords[i] = keywords[i].toLowerCase().replace(' ', '');
			if (gs.hasOwnProperty(keywords[i])) {
				assert(false, "addCard: something called this code!");
				gs[keywords[i]](card, niche);
			}
		}
	}

	return failMsg;
};

///////////////////////////////////////////////////////////////////////////////
// Special Ability Functions
///////////////////////////////////////////////////////////////////////////////
gs.onCardDestroyed = function(card) {
	var special = gs.getCardSpecial(card);
	var bCardSaved = false;

	if (gs.cardSpecialFunctionTable.onDestroyed.hasOwnProperty(special)) {
		bCardSaved = gs[gs.cardSpecialFunctionTable.onDestroyed[special]](card);
	}

	if (!bCardSaved) {
		gs.discard(card);
		gs.resetCard(card);
	}
	else {
		broadcast("cardSaved", card);
	}

	return bCardSaved;
},

gs.onCardDisplaced = function(card) {
	var special = gs.getCardSpecial(card);
	var bAnchored = false;

	if (gs.cardSpecialFunctionTable.onDisplaced.hasOwnProperty(special)) {
		bAnchored = gs[gs.cardSpecialFunctionTable.onDisplaced[special]](card);
	}

	if (!bAnchored) {
		gs.displacementDeck.push(card);
	}

	return bAnchored;
},

gs.addNiche = function(card, niche) {
	assert(niche.getBiome(), "addNiche: invalid biome!");

	// TODO: add FX.
	niche.getBiome().prependNiche(niche.getBiome());
},

gs.transferSeeds = function(card) {
	var niche = null;
	var cardBelow = null;
	var bCardSaved = false;

	assert(card, "transferSeeds: invalid card!");

	niche = gs.getCardNiche(card);
	cardBelow = niche.getNextCard(card);

	if (cardBelow) {
		gs.setCoCard(cardBelow, card);
		broadcast("seedsTransferred", {angiosperm: card, seedCarrier: cardBelow});

		bCardSaved = true;
	}

	return bCardSaved;
};

gs.adapt = function(card) {
	assert(card, "adapt: invalid card!");
	gs.setCardValue(card, gs.WILD_CARD_VALUE);
	gs.setCardSuitFromValue(card);

	broadcast("cardAdapted", card);

	return false;
};

gs.migrate = function(card) {
	var coCard = gs.getCardCoCard(card);

	if (coCard && gs.cardHasKeyword(coCard, "angiosperm")) {
		gs.setCardCoCard(card, null);
		this.primaryDrawDeck.unshift(coCard);
		broadcast("angiospermMigrated");
	}

	this.primaryDrawDeck.unshift(card);

	broadcast("cardMigrated", card);

	return true;
};

// gs.unlinkBelow = function(card) {
// 	gs.eraseLink(card, 'below');
// };

// gs.unlinkRight = function(card) {
// 	gs.eraseLink(card, 'right');
// };

// gs.unlinkAbove = function(card) {
// 	gs.eraseLink(card, 'above');
// };

// gs.unlinkLeft = function(card) {
// 	gs.eraseLink(card, 'left');
// };

// gs.linkBelow = function(card, niche, bBackLink) {
// 	var cardBelow = niche.getNextCard(card);

// 	if (cardBelow) {
// 		cardBelow.linkedCards.above = card;
// 		card.linkedCards.below = cardBelow;
// 	}

// 	if (!bBackLink) {
// 		gs.drawLink(card, 'down');
// 	}
// };

// gs.linkRight = function(card, niche, bBackLink) {
// 	var nextNiche = niche.next();
// 	var nextCard = nextNiche ? nextNiche.cardAtRank(niche.getRankForCard(card)) : null;

// 	if (!niche.isLast()) {
// 		if (!nextCard || gs.getCardTitle(nextCard).toLowerCase() === 'plantae') {
// 			card.linkedCards.right = nextCard;
// 			if (nextCard) {
// 				nextCard.linkedCards.left = card;
// 			}

// 			if (!bBackLink) {
// 				gs.drawLink(card, 'right');
// 			}
// 		}
// 		else {
// 			card.linkedCards.right = null;
// 			if (nextCard) {
// 				nextCard.linkedCards.left = null;
// 			}

// 			if (bBackLink) {
// 			 	uim.clearInfoText();
// 			 	uim.addInfoText(strings.INFO.INSECT_MISPLACED);
// 				gs.eraseLink(card, 'right');
// 			}
// 		}
// 	}
// };

// gs.linkLeft = function(card, niche, bBackLink) {
// 	var prevNiche = niche.prev();
// 	var prevCard = prevNiche ? prevNiche.cardAtRank(niche.getRankForCard(card)) : null;

// 	if (!niche.isFirst()) {
// 		card.linkedCards.left = prevCard;
// 		if (prevCard) {
// 			prevCard.linkedCards.right = card;
// 		}

// 		if (!bBackLink) {
// 			gs.drawLink(card, 'left');
// 		}
// 	}
// };

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

gs.cardTitleIs = function(card, title) {
	var bTitleIs = false;

	if (card) {
		bTitleIs = gs.getCardTitle(card).toLowerCase() === title.toLowerCase();
	}

	return bTitleIs;
};

gs.cardHasKeyword = function(card, keyword) {
	var bHasKeyword = false;
	var keywords = card ? gs.getCardKeywords(card) : null;

	assert(card && keyword, "cardHasKeyword: invalid input!");

	if (keywords) {
		bHasKeyword = keywords.toLowerCase().indexOf(keyword.toLowerCase()) >= 0;
	}

	return bHasKeyword;
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

gs.getCardSuitFromValue = function(value) {
	var suit = null;

	value = '' + value; // Convert to string.

	if (gs.cardValueToSuit.hasOwnProperty(value)) {
		suit = gs.cardValueToSuit[value];
	}

	return suit;
};

gs.setCardSuitFromValue = function(card) {
	var value = gs.getCardValue(card);

	assert(value >= 0 && value <= gs.WILD_CARD_VALUE, "setCardSuitFromValue: invalid value!");

	card.suit = gs.cardValueToSuit[value];
};

gs.getCardCoCard = function(card) {
	assert(card, "getCardCoCard: invalid card!");
	return card.coCard;
};

gs.setCardCoCard = function(card, coCard) {
	assert(card,  "setCardCoCard: invalid card!");
	card.coCard = card;
};

gs.getCardTitle = function(card) {
	return card ? card.title : null;
};

gs.getCardKeywords = function(card) {
	return card ? card.keywords : null;
};

gs.getCardLinkedCards = function(card) {
	var linkedCards = card ? card.linkedCards : null;

	assert(linkedCards, "getCardLinkedCards: no linked cards!");
	return linkedCards;
};

gs.cardBreakLink = function(card, direction) {
	var linkedCards = card ? gs.getCardLinkedCards(card) : null;
	var bBrokeLinke = false;

	assert(card && linkedCards && linkedCards.hasOwnProperty(direction), 'cardBreakLink: invalid input!');

	if (linkedCards[direction]) {	
		linkedCards[direction] = null;
		bBrokeLink = true;
	}

	return bBrokeLink;
};

gs.isCardWild = function(card) {
	return card && gs.cardHasKeyword(card, 'adaptor');
};

gs.getCardValue = function(card) {
	return card ? card.value : -1;
};

gs.setCardValue = function(card, value) {
	card.value = value;
};

gs.setCoCard = function(card, coCard) {
	card.coCard = coCard;
};

gs.getCardSpecial = function(card) {
	return card ? card.special : null;
};

gs.getCardPhaseValue = function(card) {
	var phaseValue = card ? card.value : -1;

	if (card && gs.isPhaseOne()) {
		if (gs.getCardTitle(card).toLowerCase() === 'insecta' || gs.getCardTitle(card).toLowerCase() === 'nematoda') {
			phaseValue = 0;
		}
	}

	return phaseValue;
};

gs.cardTaggedForRemoval = function(card) {
	return card && card.bWantsRemoved;
};

gs.tagCardForRemoval = function(card) {
	assert(card, "tagCardForRemoval: invalid card!");
	
	card.bWantsRemoved = true;
};

gs.untagCardForRemove = function(card) {
	assert(card, "untagCardForRemoval: invalid card!");

	card.bWantsRemoved = false;
};

gs.cardConfirmRemoval = function(card) {
	assert(card, "cardConfirmRemoval: invalid card!");

	card.bRemovePending = true;
};

gs.cardUnconfirmRemoval = function(card) {
	assert(card, "cardConfirmRemoval: invalid card!");

	card.bRemovePending = true;
};

gs.cardRemovalConfirmed = function(card) {
	assert(card, "cardRemovalConfirmed: invalid card!");

	return card.bRemovePending;
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

gs.getNextBiome = function(refBiome) {
	var index = 0;
	var nextBiome = null;

	assert(refBiome, "getNextBiome: invalid reference biome!");

	index = this.biomes.indexOf(refBiome);

	if (index >= 0 && index < this.biomes.length - 1) {
		nextBiome = this.biomes[index + 1];
	}

	return nextBiome;
};

gs.getPrevBiome = function(refBiome) {
	var index = 0;
	var prevBiome = null;

	assert(refBiome, "getPrevBiome: invalid reference biome!");

	index = this.biomes.indexOf(refBiome);

	if (index > 0) {
		prevBiome = this.biomes[index - 1];
	}

	return prevBiome;
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
};

gs.bannerStateFromIndex = function(index) {
	var i = 0;
	var state = null;

	assert(index >= 0 && index < Object.keys(this.titleToAnimIndex).length, "bannerStateFromIndex: invalid index!");

	for (state in this.titleToAnimIndex) {
		if (index === i) {
			break;
		}
		else {
			++i;
		}
	}

	return state;
};

gs.getNumTitles = function() {
	var key = null;
	var nTitles = 0;

	for (key in this.titleToAnimIndex) {
		++nTitles;
	}

	return nTitles;
};

gs.getDrawDeckSize = function() {
	var i = 0;
	var size = 0;

	for (i=0; i<this.drawDeck.length; ++i) {
		if (this.drawDeck[i]) {
			size = i + 1;
		}
		else {
			break;
		}
	}

	return size;
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

	this.placeCursors(card);
};

gs.resolvingEvents = function() {
	return currentState === sm.eventResolveDisplacement;
};

gs.selectNiche = function(iBiome, iNiche) {
	assert(iBiome >= 0 && iBiome < this.biomes.length, "placeCursor: invalid biome index!");

	this.biomes[iBiome].placeCursor(iNiche);	
};

gs.placeCursors = function(card) {
	var i = 0;

	for (i=0; i<this.biomes.length; ++i) {
		this.biomes[i].placeCursors(card);
	}
};

gs.showAvailableBiomes = function(card) {
	var keywords = null;

	assert(card, "showAvailableBiomes: invalid card!");

	keywords = gs.getCardKeywords(card);

	if (!gs.resolvingEvents()) {
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
	}
};

gs.unblockAllBiomes = function() {
	var i = 0;

	for (i=0; i<this.biomes.length; ++i) {
		this.biomes[i].unblock();
	}
};

gs.isolateBiome = function(biome) {
	var i = 0;

	assert(biome, "isolateBiome: invalid biome!");

	for (i=0; i<this.biomes.length; ++i) {
		if (this.biomes[i] !== biome) {
			this.biomes[i].block();
		}
	}

	biome.unblock();	
}

gs.blockLargeBiomes = function() {
	var i = 0;

	for (i=0; i<this.biomes.length; ++i) {
		if (this.biomes[i].niches.length >= this.biomes[i].maxSizeAtLatitude[i] ||
			this.biomes[i].getStartColumn() === 1 - this.biomes[i].getStartOffset() % 2) {
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

gs.assignCardIds = function() {
	var i = 0;

	for(i=0; i<this.phaseOneCards.length; ++i) {
		this.phaseOneCards[i].id = i;
	}

	for(i=0; i<this.phaseTwoCards.length; ++i) {
		this.phaseTwoCards[i].id = this.phaseOneCards.length + i;
	}
};

// Argument 'checkedCards' not used in this function, but included
// in prototype to keep the calling convention the same for all
// discardFn methods.
gs.canDiscardPlantae = function(card, checkedCards) {
	var bCanDiscard = true;
	var linkedCards = null;

	assert(card, "canDiscardPlantae: invalid card!");

	if (gs.getCardTitle(card).toLowerCase() === 'plantae') {
		linkedCards = gs.getCardLinkedCards(card);
		if (linkedCards && gs.cardTitleIs(linkedCards.left, 'insecta')) {
			bCanDiscard = false;
		}
	}

	return bCanDiscard;
};

gs.canDiscardAnimal = function(card, checkedCards) {
	var bAnchored = false;
	var linkedCards = null;

	assert(card, "canDiscardAnimal: invalid card!");

	bAnchored = !gs.cardTaggedForRemoval(card) ;

	if (!bAnchored) {
		linkedCards = gs.getCardLinkedCards(card);

		checkedCards.push(card);
		if (linkedCards.left && checkedCards.indexOf(linkedCards.left) < 0) {
			bAnchored = !gs.canDiscardAnimal(linkedCards.left);
		}

		if (!bAnchored && linkedCards.right && checkedCards.indexOf(linkedCards.right) < 0) {
			bAnchored = !gs.canDiscardAnimal(linkedCards.right);
		}
	}

	return !bAnchored;
};

gs.verifyCardCanBeRemoved = function(niche, card) {
	var bCanDiscard = true;
	var iFn = 0;
	var checkedCards = [];

	while (bCanDiscard && iFn < gs.discardFn.length) {
		bCanDiscard = gs.discardFn[iFn](card, checkedCards);
		iFn++;
	}

	if (!bCanDiscard) {
		gs.untagCardForRemoval(card);
	}
	else {
		gs.cardConfirmRemoval(card);		
	}
};

gs.cardPrepForRemoval = function(niche, card) {
	var linkedCards = null;

	if (gs.cardHasKeyword(card, 'angiosperm')) {
		linkedCards = gs.getCardLinkedCards(card);
		if (linkedCards.below) {
			gs.setCardCoCard(linkedCards.below, card);
		}
	}
};

gs.cardRemove = function(niche, card) {
	niche.removeCard(card);
};

gs.makeDisplacementDeckDrawDeck = function() {
	this.drawDeck = this.displacementDeck;
};

gs.restoreOriginalDrawDeck = function() {
	var i = 0;

	this.drawDeck = this.primaryDrawDeck;

	gs.clearDisplacementDeck();
};

gs.cardOnPostDisplacementShuffle = function(card) {
	if (gs.cardHasKeyword(card, 'adaptor')) {
		gs.setCardValue(gs.WILD_CARD_VALUE);
	}
};

gs.resetBiomes = function() {
	var i = 0;

	for (i=0; i<this.biomes.length; ++i) {
		this.biomes[i].reset(gs.layers.terrain);
	}
}

gs.resetCards = function() {
	var i = 0;

	for (i=0; i<this.phaseOneCards.length; ++i) {
		this.resetCard(this.phaseOneCards[i]);
	}

	for (i=0; i<this.phaseTwoCards.length; ++i) {
		this.resetCard(this.phaseTwoCards[i]);
	}
}

gs.resetCard = function(card) {
	assert(card, "resetCard: invalid card");

	card.bWantsRemoved = false;
	card.bRemovePending = false;

	card.linkedCards.above = null;
	card.linkedCards.right = null;
	card.linkedCards.below = null;
	card.linkedCards.left = null;

	card.suit = gs.cardValueToSuit["" + card.value];

	card.coCard = null;
};

gs.init = function() {
	var i = 0;

	gs.availableBiomes.length = 0;
	gs.availableNiches.length = 0;

	for (i=0; i<gs.biomeStore.length; ++i) {
		gs.availableBiomes.push(gs.biomeStore[i]);
	}

	for (i=0; i<gs.nicheStore.length; ++i) {
		gs.availableNiches.push(gs.nicheStore[i]);
	}

	gs.resetWorld();

	gs.lastPopulationCount = 0;

	gs.initDrawDeck();
	gs.initDiscardDeck();
};

gs.initDrawDeck = function() {
	var i = 0;

	for (i=0; i<gs.phaseOneCards.length; ++i) {
		gs.resetCard(gs.phaseOneCards[i]);
	}

	for (i=0; i<gs.phaseTwoCards.length; ++i) {
		gs.resetCard(gs.phaseTwoCards[i]);
	}

	gs.primaryDrawDeck.length = 0;
	tm.copyListToList(gs.phaseOneCards, gs.primaryDrawDeck, true);

	gs.drawDeck = gs.primaryDrawDeck;
};

gs.drawDeckExhausted = function() {
	tm.trimList(gs.drawDeck);

	return gs.drawDeck.length === 0;
};

gs.removeInsectsAndNematodes = function() {
	var i = 0;
	var bReplacedNull = true;

	while (bReplacedNull) {
		bReplacedNull = false;

		for (i=0; i<this.drawDeck.length; ++i) {
			if (this.drawDeck[i] && this.drawDeck[i].title.toLowerCase() !== 'plantae') {
				this.drawDeck[i] = null;
				bReplacedNull = tm.listReplaceWithLastNonNull(this.drawDeck, i, true);
				break;
			}
		}
	}

	tm.trimList(this.drawDeck);
};

gs.addPhaseTwoCards = function() {
	tm.copyListToList(gs.phaseTwoCards, gs.primaryDrawDeck, false);
};

gs.shuffleDrawDeck = function() {
	tm.trimList(this.drawDeck);

	tm.scrambleList(gs.drawDeck);
	tm.scrambleList(gs.drawDeck);
	tm.scrambleList(gs.drawDeck);

	if (!gs.playerHasLegalMove(gs.isPhaseOne())) {
		gs.movePlayableCardToTop();
	}
};

gs.movePlayableCardToTop = function() {
	var i = 0;
	var bPhaseOne = gs.isPhaseOne();
	var bLargePlant = false;
	var card = null;
	var iSwap = -1;
	var swap = null;

	for (i=uim.getNumBanners(); i<this.drawDeck.length; ++i) {
		card = this.drawDeck[i];

		bLargePlant = gs.cardTitleIs(card, 'plantae') && gs.cardHasKeyword(card, 'large');

		if (gs.countPlays(card, bLargePlant, bPhaseOne) > 0) {
			// If we're here, we're guaranteed that i > the current number of banners.
			iSwap = Math.floor(Math.random() * uim.getNumBanners());
			swap = gs.drawDeck[iSwap];
			gs.drawDeck[iSwap] = gs.drawDeck[i];
			gs.drawDeck[i] = swap;
			break;
		}
	}
};

gs.postDeckProgress = function() {
	var progress = {
		currentProgress: gs.discardDeck.length,
		maximumProgress: gs.phaseOneCards.length + gs.phaseTwoCards.length,
		score: gs.getCurrentPopulationCount()
	}

	window.LOLSDK.submitProgress(progress);	
};

gs.postPopulationProgress = function() {
	var currentPopulationCount = gs.getCurrentPopulationCount();
	var maxPopulationCount = gs.getMaxPopulationCount();

	var progress = {
	  currentProgress: Math.max(gs.lastPopulationCount, currentPopulationCount),
	  maximumProgress: maxPopulationCount,
	  score: currentPopulationCount
	};

	gs.lastPopulationCount = Math.max(gs.lastPopulationCount, currentPopulationCount);

	window.LOLSDK.submitProgress(progress);	
};

gs.getCurrentPopulationCount = function() {
	var nPopulations = 0;
	var i = 0;

	for (i=0; i<this.biomes.length; ++i) {
		nPopulations += this.biomes[i].getCurrentPopulationCount();
	}

	return nPopulations;
};

gs.getMaxPopulationCount = function() {
	var i = 0;
	var maxPopCount = 0;

	for (i=0; i<this.biomes.length; ++i) {
		maxPopCount += this.biomes[i].getMaxPopulationCount();
	}

	return maxPopCount;
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

gs.discard = function(card) {
	gs.discardDeck.push(card);
};

gs.discardAndReplace = function(card) {
	var i = 0;
	var bReplaced = false;
	var iLast = -1;

	assert(card, "discardAndReplace: invalid card!");

	gs.discard(card);

	if (gs.getDrawCardsRemaining() > uim.getNumBanners()) {
		for (i=0; i<gs.drawDeck.length; ++i) {
			if (gs.drawDeck[i] === card) {
				bReplaced = tm.listReplaceWithLastNonNull(gs.drawDeck, i, true);
				break;
			}
		}
	}
	else {
		for (i=0; i<gs.drawDeck.length; ++i) {
			if (gs.drawDeck[i] === card) {
				tm.listReplaceWithLastNonNull(gs.drawDeck, i, true);
				break;
			}
		}
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
	var i = 0;
	var keywords = null;
	var bLargePlant = false;
	var nPlays = 0;

	for (i=0; i<Math.min(this.drawDeck.length, uim.getNumBanners()); ++i) {
		card = this.drawDeck[i];
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

gs.isCardLargePlant = function(card) {
	var bIsLargePlant = false;

	assert(card, "isCardLargePlant: invalid card!");

	if (gs.getCardTitle(card).toLowerCase() === 'plantae' && gs.cardHasKeyword(card, 'large')) {
		bIsLargePlant = true;
	}

	return bIsLargePlant;
};

gs.cardsContiguous = function() {
	var i = 0;
	var bDeckContiguous = true;

	for (i=0; i<this.drawDeck.length - 1; ++i) {
		if (!this.drawDeck[i] && this.drawDeck[i + 1]) {
			bDeckContiguous = false;
			break;
		}
	}

	return bDeckContiguous;
};

gs.doPlaysRemainInDrawDeck = function() {
	var bPlaysRemain = false;
	var i = 0;

	assert(gs.cardsContiguous(), "doPlaysRemainInDrawDeck: deck data corrupted.");

	while (this.drawDeck[i] && !bPlaysRemain) {
		if (gs.countPlays(this.drawDeck[i], gs.isCardLargePlant(this.drawDeck[i]), true) > 0) {
			bPlaysRemain = true;
		}
		else {
			i += 1;
		}
	}

	return bPlaysRemain;
};

gs.getNumNiches = function() {
	var i = 0;
	var nNiches = 0;

	for (i=0; i<this.biomes.length; ++i) {
		nNiches += this.biomes[i].getNumNiches();
	}

	return nNiches;
};

gs.countPlays = function(card, bLargePlant, bPhaseOne) {
	var iBiome = 0;
	var iNiche = 0;
	var nPlays = 0;
	var biomeName = null;

	for (iBiome=0; iBiome<this.biomes.length; ++iBiome) {
		biomeName = this.biomes[iBiome].getType().name.toLowerCase();
		if (!this.biomes[iBiome].isBlocked()) {
			if (bLargePlant && (biomeName === 'desert'|| biomeName === 'plains')) {
				// Biome blocked. No play possible.
			}
			else {
				if (this.biomes[iBiome].canHoldCard(card)) {
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
	var toCard = null;
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
			toCard = gs.getCardLinkedCards(fromCard).below;
		break;

		case 'right':
			fromCol = fromNiche.getLeftCol() + 1;
			toCol = fromCol + fromNiche.getBiome().getType().tiles[0].length;
			fromRow = fromNiche.getTopRow() + fromNiche.getRankForCard(fromCard);
			toRow = fromRow;
			toCard = gs.getCardLinkedCards(fromCard).right;
		break;

		case 'left':
			toCol = fromNiche.getLeftCol() + 1;
			fromCol = fromCol - fromNiche.getBiome().getType().tiles[0].length;
			fromRow = fromNiche.getTopRow() + fromNiche.getRankForCard(fromCard);
			toRow = fromRow;
			toCard = gs.getCardLinkedCards(fromCard).left;
		break;

		case 'up':
			fromCol = fromNiche.getLeftCol() + 1;
			toCol = fromCol;
			fromRow = fromNiche.getTopRow() + fromNiche.getRankForCard(fromCard);
			toRow = fromRow - 1;
			toCard = gs.getCardLinkedCards(fromCard).right;
		break;
	}

	for (row=fromRow; row<=toRow; ++row) {
		for (col=fromCol; col<=toCol; ++col) {
			if (row === toRow && col === toCol) {
				// If the card at the destination location still has
				// links, do not erase the final link tile.
				if (gs.cardHasNoOtherLinks(toCard, fromCard)) {
					tm.removeTileFromLayer(gs.layers.links, row, col);
				}
			}
			else {
				tm.removeTileFromLayer(gs.layers.links, row, col);
			}
		}
	}
};

gs.cardHasNoOtherLinks = function(card, otherCard) {
	var bHasOtherLinks = true;
	var linkedCards = null;

	if (card) {
		linkedCards = gs.getCardLinkedCards(card);

		if (card.left && card.left !== otherCard) {
			bHasOtherLinks = true;
		}

		if (!bHasOtherLinks && card.above && card.above !== otherCard) {
			bHasOtherLinks = true;
		}

		if (!bHasOtherLinks && card.right && card.right !== otherCard) {
			bHasOtherLinks = true;
		}

		if (!bHasOtherLinks && card.below && card.below !== otherCard) {
			bHasOtherLinks = true;
		}
	}

	return !bHasOtherLinks;
};

gs.resetGame = function() {
	var i =0;

	// TODO: lots!
	this.cardLog.length = 0;
	this.drawDeck.length = 0;
	this.discardDeck.length = 0;

	for (i=0; i<this.phaseOneCards.length; ++i) {
		if (this.phaseOneCards.linkedCards.above) this.phaseOneCards.linkedCards.above = null;
		if (this.phaseOneCards.linkedCards.right) this.phaseOneCards.linkedCards.right = null;
		if (this.phaseOneCards.linkedCards.below) this.phaseOneCards.linkedCards.below = null;
		if (this.phaseOneCards.linkedCards.left) this.phaseOneCards.linkedCards.left  = null;
	}

	for (i=0; i<this.phaseTwoCards.length; ++i) {
		if (this.phaseTwoCards.linkedCards.above) this.phaseTwoCards.linkedCards.above = null;
		if (this.phaseTwoCards.linkedCards.right) this.phaseTwoCards.linkedCards.right = null;
		if (this.phaseTwoCards.linkedCards.below) this.phaseTwoCards.linkedCards.below = null;
		if (this.phaseTwoCards.linkedCards.left) this.phaseTwoCards.linkedCards.left  = null;
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

gs.resetWorld = function() {
	this.resetBiomes();
	this.resetCards();
};

gs.hideCardHints = function() {
	var i = 0;

	for (i=0; i<this.biomes.length; ++i) {
		this.biomes[i].hideCardHints();
	}
};

gs.showNextCardHints = function() {
	var i = 0;

	for (i=0; i<this.biomes.length; ++i) {
		this.biomes[i].showNextCardHints();
	}
};

gs.DEBUGgetRandomBiome = function() {
	return (this.biomes[Math.floor(Math.random() * this.biomes.length)]);
};

gs.getEventBiome = function() {
	var primaryBiome = events.getCurrentPrimaryBiome();

	// TEMP!
	return primaryBiome;
};

gs.scoreBiomesBy = function(organismType, keyword, bClearScores, bCascade, scoresOut) {
	var i = 0;
	var scores = 0;

	assert(scoresOut, "scoreBiomesBy: invalid scores out array!");

	if (bClearScores) {
		scoresOut.length = 0;
	}

	for (i=0; i<this.biomes.length; ++i) {
		if (bClearScores) {
			scoresOut.push(0);
			this.biomes[i].setScore(0);
		}

		this.biomes[i].setScore(this.biomes[i].getScore() + this.biomes[i].scoreNichesBy(organismType, keyword, bCascade));
		scoresOut[i] = this.biomes[i].getScore();
	}
};

gs.getIthBiome = function(index) {
	assert(index >= 0 && index < this.biomes.length, "getIthBiome: invalid index!");

	return this.biomes[index];
};

gs.clearDisplacementDeck = function() {
	var i = 0;

	// Discard remainind displaced cards.
	for (i=0; i<this.displacementDeck.length; ++i) {
		if (this.displacementDeck[i]) {
			gs.onCardDestroyed(this.displacementDeck[i]);
			gs.discard(this.displacementDeck[i]);
		}
	}

	this.displacementDeck.length = 0;
};

gs.displaceCard = function(card) {
	var coCard = gs.getCardCoCard(card);

	if (coCard && gs.cardHasKeyword(coCard, "angiosperm")) {
		this.displacementDeck.push(coCard);
		gs.setCardCoCarad(card, null);
		broadcast("angiospermDisplaced");
	}

	this.displacementDeck.push(card);
};

gs.displacementDeckEmpty = function() {
	return this.displacementDeck.length === 0;
};

