strings = {
	construct: function(string, addIns) {
		var segments = string.split('~');
		var i = 0;
		var strOut = null;

		for (i=0; i<addIns.length; ++i) {
			if (i === 0) {
				strOut = segments[i] + addIns[i];
			}
			else {
				strOut += segments[i] + addIns[i];
			}
		}

		if (segments.length > addIns.length) {
			strOut = strOut + segments[segments.length - 1];
		}

		return strOut;
	},

	INFO: {
		SELECT_ORGANISM: "Select an E.G.G. on the left, then click\non the map to add it to the world.",
		ILLEGAL_PLACEMENT: "You can't place that organism in this\nbiome.",
		NICHE_FULL_PRODUCER: "This niche already contains a producer or\ndecomposer.",
		OUT_OF_PLAYS: "Out of Plays!",
		RESHUFFLE_AND_TRY_AGAIN: "Reshuffle and try again.",
		GAME_OVER: "Game Over",
		NO_MORE_PLAYS: "None of your remaining E.G.G.s can hatch\non this world.",
		NO_MORE_MOVES: "No More Moves!",
		INSECT_MISPLACED: "Place insects to the left of a plant\nto activate their special ability.",
		NICHE_FULL: "This organism's place in the\nniche is already full.",
		INVALID_PLACEMENT_HERBIVORE: "Herbivores must be placed beneath\na Producer.",
		INVALID_PLACEMENT_CARNIVORE: "Carnivores must be placed beneath\nherbivores, insects, or nematodes.",
		INVALID_PLACEMENT_SCAVENGER: "Scavengers must be placed beneath\ncarnivores.",
	},
	HINTS: {
		CHOOSE_EGG: "          Choose an E.G.G.        ",
		CHOOSE_DISPLACED_ORGANISM: "Pick a displaced organism",
		PLACE_ORGANISM: "Place it in the biosphere",
	},
	EVENTS: {
		FAMINE: {title: "Famine", info: "Destroy all large birds and mammals."},
		POLE_SHIFT: {title: "Pole Shift", info: "Destroy all large amphibians and reptiles."},
		BLIGHT: {title: "Blight", info: "Destroy all large vegetation in 3\nneighboring biomes."},
		INSECT_PLAGUE: {title: "Insect Plague", info: "Destroy all small vegetation in 3\nneighboring biomes."},
		DISEASE: {title: "Disease", info: "Destroy all animals of one suit in one biome."},
		DROUGHT: {title: "Drought", info: "Destroy all herbivores in one biome."},
		CONTAMINATION: {title: "Contamination", info: "Destroy all small amphibians and reptiles."},
		POISON: {title: "Poison", info: "Destroy all small birds and mammals."},
		CLIMATE_CHANGE: {title: "Climate Change", info: "Swap the terrain from two adjacent biomes."},
		SUPER_PARASITE: {title: "Super Parasite", info: "Destroy all carnivores and dependent\nscavengers in one biome."},
		CONFLAGRATION: {title: "Conflagration", info: "All vegetation in 1 biome is temporarily\ndestroyed."},

		BIOME_DAMAGED: "Biome damaged!",
		BIOMES_DAMAGED: "Biomes damaged!",
		BIOME_DAMAGE_REPORT_SINGULAR: "~ of your biomes lost a total of\n1 population. This may displace\nother populations.",
		BIOME_DAMAGE_REPORT_PLURAL: "~ of your biomes lost a total of\n~ populations. This may displace\nother populations.",
		RESOLVED: "Resolved!",
		RESOLUTION_MESSAGE: "You have survived this event! Now you\ncan return to building the biosphere.",
		WILL_DISCARD_REMAINING_ORGANISMS: "None of the remaining displaced\npopulations can find a niche.\nThey will not survive.",

		PROMPT: "(Tap here to continue...)",
		LOST: "LOST:",
	},
	DESCRIPTIONS: {
		LARGE_PLANT: 'Large plants cannot grow in deserts or\nplains.',
		ANGIOSPERM: 'An Angiosperm can regrow from seeds\nconsumed by the animal below it.',
		POLLINATOR: 'A Pollinator strengthens the plant to its\nright by increasing its genetic diversity.',
		DECOMPOSER: "Decomposers increase a biome's arable\nland.",
		ADAPTOR: 'Adaptors can can change role (herbivore,\ncarnivore, or scavenger) when displaced.',
		MIGRATOR: 'Migratory animals can move to any biome\nif displaced by an event.',
		SYMBIOTE: 'A Symbiote protects, and is protected by,\nthe animal to it left.',		
	},
	WARNINGS: {
	}
}
