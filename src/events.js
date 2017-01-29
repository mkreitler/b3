events = {
	remaining: [],
};

events.all = {
	famine: {
		// Destroy all 'large' birds and mammals.
		getTitle: function() {
			return strings.EVENTS.FAMINE.title;
		},

		getInfo: function() {
			return strings.EVENTS.FAMINE.info;
		},

		getPrimaryBiome: function() {
			return gs.DEBUGgetRandomBiome();
		},

		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		},

		apply: function(targetBiome) {

		}
	},

	poleShift: {
		// Destroy all 'large' reptiles and amphibians.
		getTitle: function() {
			return strings.EVENTS.POLE_SHIFT.title;
		},

		getInfo: function() {
			return strings.EVENTS.POLE_SHIFT.info;
		},

		getPrimaryBiome: function() {
			return gs.DEBUGgetRandomBiome();
		},

		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		},

		apply: function(targetBiome) {
			
		}
	},

	blight: {
		// Destroy all 'large' plants in 3 neighboring biomes.
		getTitle: function() {
			return strings.EVENTS.BLIGHT.title;
		},

		getInfo: function() {
			return strings.EVENTS.BLIGHT.info;
		},

		getPrimaryBiome: function() {
			var biomeScores = [];
			var maxIndeces = []
			var i = 0;
			var iMax = -1;
			var max = 0;
			var test = 0;
			
			gs.scoreBiomesBy('plantae', 'large', true, true, biomeScores);

			for (i=0; i<biomeScores.length - 2; ++i) {
				test = biomeScores[i] + biomeScores[i + 1] + biomeScores[i + 2];
				if (test > max) {
					max = test;
				}
			}

			// Break ties.
			for (i=0; i<biomeScores.length - 2; ++i) {
				test = biomeScores[i] + biomeScores[i + 1] + biomeScores[i + 2];
				if (test === max) {
					maxIndeces.push(i);
				}
			}
			assert(maxIndeces.length > 0, "events.blight.getPrimaryBiome: no max index!");
			iMax = maxIndeces[Math.floor(Math.random() * maxIndeces.length)];

			return gs.getIthBiome(iMax);
		},

		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		},

		apply: function(targetBiome) {
			// Discard large plants.
			gs.clearDisplacementDeck();
			targetBiome.discard('plantae', 'large');

			// Displace dependent organisms.
			// 		Swap out draw deck.
			// 		Swap in temp draw deck.
			//		Remove displaced animals.
			// 		Sort by role.
			//		Restore 'Wild' value for Adaptors.

			broadcast('eventApplied');
		}
	},

	insectPlague: {
		// Destroy all 'small' plants in 3 neighboring biomes.
		getTitle: function() {
			return strings.EVENTS.INSECT_PLAGUE.title;
		},

		getInfo: function() {
			return strings.EVENTS.INSECT_PLAGUE.info;
		},

		getPrimaryBiome: function() {
			return gs.DEBUGgetRandomBiome();
		},

		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		},

		apply: function(targetBiome) {
			
		}
	},

	disease: {
		// Destoy all animations of one suit in one biome.
		getTitle: function() {
			return strings.EVENTS.DISEASE.title;
		},

		getInfo: function() {
			return strings.EVENTS.DISEASE.info;
		},

		getPrimaryBiome: function() {
			return gs.DEBUGgetRandomBiome();
		},

		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		},

		apply: function(targetBiome) {
			
		}
	},

	drought: {
		// Destroy all herbivores in one biome.
		getTitle: function() {
			return strings.EVENTS.DROUGHT.title;
		},

		getInfo: function() {
			return strings.EVENTS.DROUGHT.info;
		},

		getPrimaryBiome: function() {
			return gs.DEBUGgetRandomBiome();
		},

		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		},

		apply: function(targetBiome) {
			
		}
	},

	contamination: {
		// Destroy all small reptiles and amphibians.
		getTitle: function() {
			return strings.EVENTS.CONTAMINATION.title;
		},

		getInfo: function() {
			return strings.EVENTS.CONTAMINATION.info;
		},

		getPrimaryBiome: function() {
			return gs.DEBUGgetRandomBiome();
		},

		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		},

		apply: function(targetBiome) {
			
		}
	},

	poison: {
		// Destroy all small birds and mammals.
		getTitle: function() {
			return strings.EVENTS.POISON.title;
		},

		getInfo: function() {
			return strings.EVENTS.POISON.info;
		},

		getPrimaryBiome: function() {
			return gs.DEBUGgetRandomBiome();
		},

		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		},

		apply: function(targetBiome) {
			
		}
	},

	climateChange: {
		// Swap the terrain in 2 neighboring biomes.
		getTitle: function() {
			return strings.EVENTS.CLIMATE_CHANGE.title;
		},

		getInfo: function() {
			return strings.EVENTS.CLIMATE_CHANGE.info;
		},

		getPrimaryBiome: function() {
			return gs.DEBUGgetRandomBiome();
		},

		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		},

		apply: function(targetBiome) {
			
		}
	},

	superParasite: {
		// Destroy all carnivores and scavengers in one biome.
		getTitle: function() {
			return strings.EVENTS.SUPER_PARASITE.title;
		},

		getInfo: function() {
			return strings.EVENTS.SUPER_PARASITE.info;
		},

		getPrimaryBiome: function() {
			return gs.DEBUGgetRandomBiome();
		},

		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		},

		apply: function(targetBiome) {
			
		}
	},

	conflagration: {
		// Return all vegetation in one biome to the
		// top of the draw deck.
		getTitle: function() {
			return strings.EVENTS.CONFLAGRATION.title;
		},

		getInfo: function() {
			return strings.EVENTS.CONFLAGRATION.info;
		},

		getPrimaryBiome: function() {
			return gs.DEBUGgetRandomBiome();
		},

		findTargetBiome: function() {
			var iBiome = -1;

			return iBiome;			
		},

		apply: function(targetBiome) {
			
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

	// DEBUG
	this.remaining.unshift(events.all['blight']);
};

events.next = function() {
	if (this.remaining.length > 0) {
		this.remaining.shift();
	}
};

events.getCurrentEventTitle = function() {
	assert(this.remaining.length > 0, "getCurrentPrimaryBiome: out of Event cards!");
	return this.remaining[0].getTitle();
};

events.getCurrentEventInfo = function() {
	assert(this.remaining.length > 0, "getCurrentPrimaryBiome: out of Event cards!");
	return this.remaining[0].getInfo();
};

events.getCurrentPrimaryBiome = function() {
	assert(this.remaining.length > 0, "getCurrentPrimaryBiome: out of Event cards!");
	return this.remaining[0].getPrimaryBiome();
};


events.applyCurrent = function(targetBiome) {
	assert(this.remaining.length > 0, "applyCurrent: out of Event cards!");

	this.remaining[0].apply(targetBiome);
};

