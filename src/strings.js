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
		NICHE_FULL_PRODUCER: "This habitat already contains a producer\nor decomposer.",
		OUT_OF_PLAYS: "Out of Plays!",
		RESHUFFLE_AND_TRY_AGAIN: "Reshuffle and try again.",
		GAME_OVER: "Game Over",
		NO_MORE_PLAYS: "None of your remaining E.G.G.s can hatch\non this world.",
		NO_MORE_MOVES: "No More Moves!",
		INSECT_MISPLACED: "Place insects to the left of a plant\nto activate their special ability.",
		HABITAT_FULL: "This population's niche is\nalready occupied.",
		INVALID_PLACEMENT_HERBIVORE: "Herbivores must be placed beneath\na Producer.",
		INVALID_PLACEMENT_CARNIVORE: "Carnivores must be placed beneath\nherbivores, insects, or nematodes.",
		INVALID_PLACEMENT_SCAVENGER: "Scavengers must be placed beneath\ncarnivores.",
		HUMANS_ARRIVE: "Humans Arrive!",
		SEE_THEIR_IMPACT: "They build their colony into\nthe biosphere you have created.",
		FINAL_SCORE: "Final Score",
		SCORE: "Score (populations x~): ~\nBiodiversity Rating: ~",
		PROJECT: "Project",
		EGG: "E.G.G.",
		OFFER_ABORT_GAME: "Click here to quit",
		OFFER_RESUME_GAME: "Click here to resume",
	},
	HINTS: {
		CHOOSE_EGG: "          Choose an E.G.G.        ",
		CHOOSE_DISPLACED_ORGANISM: "Pick a displaced population",
		PLACE_ORGANISM: "Place it in the biosphere",
	},
	TUTORIAL: {
		WELCOME_TERRAFORMER_AND_TAPOUT: "Welcome\nterraformer!\n\n(tap messages\nto clear\nthem.)",
		THIS_IS_YOUR_BIOSPHERE: "This is your\nbiosphere.\n\nYour mission:",
		MISSION_OBJECTIVE: "Populate it\nbefore the\nfirst colonists\narrive!",
		INTRODUCING_THE_EGG: "This is an\nE.G.G.\n(Engineered\nGenome\nGerminator).",
		EGG_PURPOSE: "Using E.G.G.s,   \nyou can build\ncreatures\n from custom\n DNA. Deploy\nE.G.G.s to\npopulate\nyour world.             ",
		INTRODUCING_THE_DATA_CARD: "This is a\ndatacard. It\ntells you what\nthis E.G.G.'s\norganisms\nwill be.",
		CLICK_DATA_CARD: "Tap the\ncard. When it\nhighlights, look\nfor extra data\nin the window\nbelow.",
		THIS_IS_A_HABITAT: "This is a habitat.\n\nDrop E.G.G.s here\nto start\npopulating.",
		POPULATE_EGG_01: "Try it\nnow. With the\ndata card\nhighlighted, tap\nthe selected\nhabitat.",
		YOU_MADE_A_PLANT: "Great!\nYou made a\n plant! This\nstarts a new\necosystem.",
		BUILDING_ECOSYSTEMS_01: "An Ecosystem is\na group of\ninterrelated\nplants and animals\nin a habitat.",
		BUILDING_ECOSYSTEMS_02: "Build\necosystems\nniche by niche.\nProducers (P),\nfirst, then...",
		BUILDING_ECOSYSTEMS_03: "...Herbivores (H),\nCarnivores (C),\nand, finally,\nScavengers (S).\n",
		BUILDING_ECOSYSTEMS_04: "When you see letters\nby a habitat, you\nwill know what\nniche to build\nnext.\n",
		TRY_IT_NOW: "Try it now.\nTap on a\ndatacard to\nselect its\nE.G.G...",
		POPULATE_HERBIVORE: "...then tap on\nthis habitat to\ncreate a new\npopulation.",
		POPULATION_DEFINITION_01: "Each\nicon in an\nEcosystem is a\nPopulation.",
		POPULATION_DEFINITION_02: "A\nPopulation is\nmany organisms\nof the same\nspecies.",
		POPULATE_CARNIVORE_01: "Now,\npopulate a\nCarnivore.\nNote the extra\nsymbol on its\ndatacard.",
		POPULATE_CARNIVORE_02: "Cards\nwith icons\nlike these have\nspecial abilities.\nTap the\ndatacard...",
		POPULATE_CARNIVORE_03: "...then\nlook in the\ndata window to\nsee what the\ncreature can\ndo.",
		POPULATE_CARNIVORE_04: "Tap on\nthe habitat to\npopulate the\nCarnivore.",
		POPULATE_OMNIVORE_01: "Now,\nplace the\nfinal population\ninto your\nEcosystem.",
		POPULATE_OMNIVORE_02: "Tap\nthe datacard.\nNotice that the\nOmnivore is\na wild\ncard!",
		POPULATE_OMNIVORE_03: "Tap\nthe habitat to\npopulate the\nOmnivore.",
		PROCESS_EVENT_01: "As you\nbuild the\nbiosphere,\nEvents will\ntake place.",
		PROCESS_EVENT_02: "Events\nchange the\nbiosphere, often\ndestroying\npopulations.",
		PROCESS_EVENT_03: "When\nevents destroy\npopulations\nin an\necosystem...",
		PROCESS_EVENT_04: "...the\nremaining\npopulations are\ndisplaced. For\nexample...",
		PROCESS_EVENT_05: "...when\nHerbivores and\nCarnivores die,\nScavengers...",
		PROCESS_EVENT_06: "...must\n move to a\nnew habitat in\norder to\nsurvive.",
		PROCESS_EVENT_07: "When\nthis happens,\nthe displaced\npopulations...",
		PROCESS_EVENT_08: "...return\nto your base\nso you can\nmove them to\nanother\nhabitat.",
		PROCESS_EVENT_09: "Tap\nthe datacard\nof the displaced\npopulation...",
		PROCESS_EVENT_10: "...then\ntap the habitat\ninto which you\nwant to place\nit.",
		PROCESS_EVENT_11: "Note\nthat some\npopulations can\nreturn to their\noriginal\nhabitat.",
		PROCESS_EVENT_12: "When\nyou finish\nrelocating\npopulations,\nthe event\nwill end.",
		END_01: "This\nconcludes the\nin-game\ntutorial.",
		// NEW_EGG_AVAILABLE: "When you\nuse an E.G.G.,\na new one will\nappear from\nstorage."
	},
	EVENTS: {
		FAMINE: {title: "Famine", info: "Destroy all large birds and mammals.", question: "What happens during a famine\nif all populations consist\nof large organisms?"},
		POLE_SHIFT: {title: "Pole Shift", info: "Destroy all large amphibians and reptiles.", question: "What happens during a pole\nshift if all populations\nconsist of large organisms?"},
		BLIGHT: {title: "Blight", info: "Destroy all large vegetation in 3\nneighboring biomes.", question: "What happens to biomes that\nhave only large plants\nwhen blight appears?"},
		INSECT_PLAGUE: {title: "Insect Plague", info: "Destroy all small vegetation in 3\nneighboring biomes.", question: "What happens to biomes that\nhave only small plants\nduring an insect plague?"},
		DISEASE: {title: "Disease", info: "Destroy all animals of one\nfamily in one biome.", question: "If all populations in a\nbiome belong to one family,\nis disease more dangerous?"},
		DROUGHT: {title: "Drought", info: "Destroy all herbivores in one biome.", question: "What kinds of ecosystems\ncan exist without herbivores?\nDid this biome have any?"},
		FAST_ACTING_TOXINS: {title: "Fast Acting Toxins", info: "Destroy all small amphibians and reptiles.", question: "Which populations can resist\nfast-acting toxins? Did you\nhave any in this biome?"},
		CUMULATIVE_TOXINS: {title: "Cumulative Toxins", info: "Destroy all small birds and mammals.", question: "Which populations can resist\ncumulative toxins? Did you\nhave any in this biome?"},
		GLOBAL_WARMING: {title: "Global Warming", info: "One wetland becomes a desert,\ndestroying large plants,\ninsects, and amphibians.", question: "How might biodiversity help\na biome recover from\nglobal warming, if at all?"},
		SUPER_PARASITE: {title: "Super Parasite", info: "Destroy all carnivores\nin one biome.", question: "What populations can occupy\na Carnivore niche and resist\nparasites?"},
		GLOBAL_COOLING: {title: "Global Cooling", info: "One desert becomes a wetland,\ndestroying small plants,\nnematodes, and reptiles.", question: "How does biodiversity help\na biome recover from\nglobal cooling, if at all?"},
		HUMAN_SETTLEMENT: {title: "Human Settlement", info: "Humans build a colony,\ndestroying mid-sized plants.", question: "Can biodiversity help ecosystems\nresist damage from human\nsettlement. If so, how?"},

		BIOSPHERE_SAFE: "Biosphere safe!",
		BIOME_DAMAGED: "Biome damaged!",
		BIOMES_DAMAGED: "Biomes damaged!",
		BIOME_DAMAGE_REPORT_NONE: "Fortunately, this event didn't\naffect any biomes. All\npopulations survived!",
		BIOME_DAMAGE_REPORT_SINGULAR: "~ of your biomes lost a total of\n1 population. This may displace\nother populations.",
		BIOME_DAMAGE_REPORT_PLURAL: "~ of your biomes lost a total of\n~ populations. This may displace\nother populations.",
		RESOLVED: "Resolved!",
		COLONY_COMPLETE: "Colony Complete!",
		RESOLUTION_MESSAGE: "You have survived this event! Now you\ncan return to building the biosphere.",
		RESOLUTION_MESSAGE_END: "The humans have completed their\ncolony! You can now review your work.",
		WILL_DISCARD_REMAINING_ORGANISMS: "None of the remaining displaced\npopulations can find a niche. Only\nmigratory populations will survive.",
		PLACED_ALL_ORGANISMS: "All of the populations have found\nnew niches. They will survive.",
		WELL_DONE: "Well done!",

		PROMPT: "(Tap here to continue...)",
		LOST: "LOST:",
	},
	DESCRIPTIONS: {
		PRODUCER: 'Producers are the root of all\necosystems.',
		LARGE_PLANT: 'Large plants cannot grow in deserts or\nplains.',
		ANGIOSPERM: 'An Angiosperm can regrow from seeds\nconsumed by the animal below it.',
		POLLINATOR: 'A Pollinator strengthens the plant to its\nright by increasing its genetic diversity.',
		DECOMPOSER: "Decomposers increase a biome's arable\nland.",
		ADAPTOR: 'Adaptors can fill any niche (herbivore,\ncarnivore, or scavenger) when displaced.',
		MIGRATOR: 'Migratory animals move to new biomes\ninstead of being destroyed.',
		SYMBIOTE: 'A Symbiote protects, and is protected by,\nthe animal to it left.',		
	},
	WARNINGS: {
	},
	UI: {
		START_GAME: "Start Game",
		TUTORIAL: "Play Tutorial",
		TOGGLE_SOUND: "Toggle Sound",
		CHOOSE_ONE: "Choose One",
		RESTART_GAME: "Restart Game",
		QUIT: "Quit",
	}
}
