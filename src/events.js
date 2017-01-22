events = {
	remaining: [],
};

events.all = {
	famine: {
		// Destroy all 'large' birds and mammals.
	},

	poleShift: {
		// Destroy all 'large' reptiles and amphibians.
	},

	blight: {
		// Destroy all 'large' plants in 3 neighboring biomes.
	},

	insectPlague: {
		// Destroy all 'small' plants in 3 neighboring biomes.
	},

	disease: {
		// Destoy all animations of one suit in one biome.
	},

	drought: {
		// Destroy all herbivores in one biome.
	},

	metabolicPoisonSlow: {
		// Destroy all small reptiles and amphibians.
	},

	metabolicPosionFast: {
		// Destroy all small birds and mammals.
	},

	climateChange: {
		// Swap the terrain in 2 neighboring biomes.
	},

	superParasite: {
		// Destroy all carnivores and scavengers in one biome.
	},

	conflagration: {
		// Return all vegetation in one biome to the
		// top of the draw deck.
	},
};

events.init = function() {
	var key = null;

	this.remaining.length = 0;

	for (key in events.all) {
		this.remaining.push(events.all[key]);
	}

	tm.scrambleList(this.remaining);
};

events.next = function() {
	var nextEvent = this.remaining.length > 0 ? this.remaining[this.remaining.length - 1]: null;

	this.remaining.pop();

	return nextEvent;
};

