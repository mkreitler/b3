events = {
	CARD_DESTROY_INTERVAL_MS: 333,

	remaining: [],

	targetBiome: null,
	iCurBiome: -1,
	affectedBiomes: [],
	nCardsDestroyed: 0,
	nCardsDisplaced: 0,

	init: function() {
		var key = null;

		this.remaining.length = 0;

		for (key in this.all) {
			this.remaining.push(this.all[key]);
		}

		tm.scrambleList(this.remaining);

		// DEBUG
		this.remaining.unshift(this.all['poleShift']);
	},

	getNextAffectedBiome: function() {
		return this.iCurBiome < this.affectedBiomes.length ? this.affectedBiomes[this.iCurBiome++] : null;
	},

	next: function() {
		if (this.remaining.length > 0) {
			this.remaining.shift();
		}
	},

	getCurrentEventTitle: function() {
		assert(this.remaining.length > 0, "getCurrentPrimaryBiome: out of Event cards!");
		return this.remaining[0].getTitle();
	},

	getCurrentEventInfo: function() {
		assert(this.remaining.length > 0, "getCurrentPrimaryBiome: out of Event cards!");
		return this.remaining[0].getInfo();
	},

	getCurrentPrimaryBiome: function() {
		assert(this.remaining.length > 0, "getCurrentPrimaryBiome: out of Event cards!");
		return this.remaining[0].getPrimaryBiome();
	},

	tagCardsForDestruction: function() {
		assert(this.remaining.length > 0, "applyCurrent: out of Event cards!");

		this.iCurBiome = 0;
		events.affectedBiomes.length = 0;

		return this.remaining[0].tagCardsForDestruction(this.targetBiome);
	},

	tagCardsForDisplacement: function(biome) {
		var i = 0;

		if (biome) {
			this.nCardsDisplaced = biome.tagCardsForDisplacement();
		}
	},

	displaceCards: function(biome) {
		var iCard = 0;

		listenFor("cardDisplaced", this);

		for (iCard=0; iCard<this.nCardsDisplaced; ++iCard) {
			fn = function(card) { return function() { gs.getCardNiche(card).removeCard(card, false); } };
			setTimeout(fn(biome.getDisplacedCard(iCard)), events.CARD_DESTROY_INTERVAL_MS * (iCard + 1));
		}
	},

	cardDisplaced: function(data) {
		this.nCardsDisplaced -= 1;

		if (this.nCardsDisplaced === 0) {
			unlistenFor("cardDisplaced", this);
			broadcast("allCardsDisplaced");
		}
	},

	getNumCardsDisplaced: function() {
		return this.nCardsDisplaced;
	},

	destroyCards: function() {
		var iBiome = 0;
		var iCard = 0;
		var fn = null;
		
		this.nCardsDestroyed = 0;

		listenFor('cardDestroyed', this);

		for (iBiome=0; iBiome<this.affectedBiomes.length; ++iBiome) {
			for (iCard=0; iCard<this.affectedBiomes[iBiome].getNumCardsDestroyed(); ++iCard) {
				fn = function(biome, card) { return function() { gs.getCardNiche(card).removeCard(card, true); } };
				setTimeout(fn(events.affectedBiomes[iBiome], events.affectedBiomes[iBiome].getTaggedCard(iCard)),
						   events.CARD_DESTROY_INTERVAL_MS * (this.nCardsDestroyed + 1));

				++this.nCardsDestroyed;
			}
		}
	},

	cardDestroyed: function() {
		--this.nCardsDestroyed;

		if (this.nCardsDestroyed === 0) {
			unlistenFor('cardDestroyed');
			broadcast('allCardsRemoved');
		}
	},

	getNumCardsDestroyed: function() {
		var i = 0;
		var nDestroyed = 0;

		for (i=0; i<this.affectedBiomes.length; ++i) {
			nDestroyed += this.affectedBiomes[i] ? this.affectedBiomes[i].getNumCardsDestroyed() : 0;
		}

		return nDestroyed;
	},

	getNumBiomesAffected: function() {
		return this.affectedBiomes.length;
	},

	setBiome: function(biome) {
		this.targetBiome = biome;
	},

	// Events /////////////////////////////////////////////////////////////////
	all: {
		that: null,

		famine: {
			// Destroy all 'large' birds and mammals.
			getTitle: function() {
				return strings.EVENTS.FAMINE.title;
			},

			getInfo: function() {
				return strings.EVENTS.FAMINE.info;
			},

			getPrimaryBiome: function() {
				var biomeScores = [];
				var maxIndeces = [];
				var iMax = -1;

				gs.scoreBiomesBy('aves', 'large', true, true, biomeScores);
				gs.scoreBiomesBy('mammalia', 'large', false, true, biomeScores);
				tm.numberListFindMaxima(biomeScores, maxIndeces);
				iMax = tm.listReturnRandomElement(maxIndeces);

				assert(iMax > 0 && iMax < biomeScores.length, "events.famine.getPrimaryBiome: invalid max index!");

				return gs.getIthBiome(iMax);
			},

			tagCardsForDestruction: function(targetBiome) {
				assert(gs.displacementDeckEmpty(), "events.famine.tagCardsForDestruction: displacementDeck not empty!");

				targetBiome.tagCardsOfTypeForDestruction('aves', 'large', true);
				targetBiome.tagCardsOfTypeForDestruction('mammalia', 'large', false);

				if (targetBiome.getNumCardsDestroyed() > 0) {
					events.affectedBiomes.push(targetBiome);
				}

				broadcast('cardsDestroyed');
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
				var biomeScores = [];
				var maxIndeces = [];
				var iMax = -1;

				gs.scoreBiomesBy('reptilia', 'large', true, true, biomeScores);
				gs.scoreBiomesBy('amphibia', 'large', false, true, biomeScores);
				tm.numberListFindMaxima(biomeScores, maxIndeces);
				iMax = tm.listReturnRandomElement(maxIndeces);

				assert(iMax > 0 && iMax < biomeScores.length, "events.famine.getPrimaryBiome: invalid max index!");

				return gs.getIthBiome(iMax);
			},

			tagCardsForDestruction: function(targetBiome) {
				assert(gs.displacementDeckEmpty(), "events.famine.tagCardsForDestruction: displacementDeck not empty!");

				targetBiome.tagCardsOfTypeForDestruction('reptilia', 'large', true);
				targetBiome.tagCardsOfTypeForDestruction('amphibia', 'large', false);

				if (targetBiome.getNumCardsDestroyed() > 0) {
					events.affectedBiomes.push(targetBiome);
				}

				broadcast('cardsDestroyed');
			}
		},

		blight: {
			NUM_BIOMES_AFFECTED: 3,

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

			tagCardsForDestruction: function(targetBiome) {
				var i = 0;

				// Discard large plants.
				assert(gs.displacementDeckEmpty(), "events.famine.tagCardsForDestruction: displacementDeck not empty!");

				for (i=0; i<this.NUM_BIOMES_AFFECTED; ++i) {
					targetBiome.tagCardsOfTypeForDestruction('plantae', 'large', true);

					if (targetBiome.getNumCardsDestroyed() > 0) {
						events.affectedBiomes.push(targetBiome);
					}

					targetBiome = gs.getNextBiome(targetBiome);
				}

				broadcast('cardsDestroyed');
			},
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

			tagCardsForDestruction: function(targetBiome) {
				
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

			tagCardsForDestruction: function(targetBiome) {
				
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

			tagCardsForDestruction: function(targetBiome) {
				
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

			tagCardsForDestruction: function(targetBiome) {
				
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

			tagCardsForDestruction: function(targetBiome) {
				
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

			tagCardsForDestruction: function(targetBiome) {
				
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

			tagCardsForDestruction: function(targetBiome) {
				
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

			tagCardsForDestruction: function(targetBiome) {
				
			}
		},
	},
};

