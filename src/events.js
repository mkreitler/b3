events = {
	remaining: [],
};

events.all = {
	famine: {
		info: [
			'Destroy all large birds and mammals.'
		],

		// Destroy all 'large' birds and mammals.
		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		}
	},

	poleShift: {
		info: [
			'Destroy all large amphibians and reptiles.'
		],

		// Destroy all 'large' reptiles and amphibians.
		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		}
	},

	blight: {
		info: [
			'Destroy all large vegetation in 3\nneighboring biomes.'
		],

		// Destroy all 'large' plants in 3 neighboring biomes.
		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		}
	},

	insectPlague: {
		info: [
			'Destroy all small vegetation in 3\nneighboring biomes.'
		],

		// Destroy all 'small' plants in 3 neighboring biomes.
		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		}
	},

	disease: {
		info: [
			'Destroy all animals of one suit in one biome.'
		],

		// Destoy all animations of one suit in one biome.
		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		}
	},

	drought: {
		info: [
			'Destroy all herbivores in one biome.'
		],

		// Destroy all herbivores in one biome.
		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		}
	},

	metabolicPoisonSlow: {
		// Destroy all small reptiles and amphibians.
		info: [
			'Destroy all small amphibians and reptiles.'
		],

		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		}
	},

	metabolicPosionFast: {
		info: [
			'Destroy all small birds and mammals.'
		],

		// Destroy all small birds and mammals.
		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		}
	},

	climateChange: {
		info: [
			'Swap the terrain from two adjacent biomes.'
		],

		// Swap the terrain in 2 neighboring biomes.
		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		}
	},

	superParasite: {
		info: [
			'Destroy all carnivores and dependent\nscavengers in one biome.'
		],

		// Destroy all carnivores and scavengers in one biome.
		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		}
	},

	conflagration: {
		info: [
			'Return all vegetation in 1 biome to the\ntop of the draw deck.'
		],

		// Return all vegetation in one biome to the
		// top of the draw deck.
		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		}
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

