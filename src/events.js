events = {
	CARD_DESTROY_INTERVAL_MS: 667,

	remaining: [],

	targetBiome: null,
	iCurBiome: -1,
	affectedBiomes: [],
	nCardsDestroyed: 0,
	nCardsDisplaced: 0,

	init: function() {
		this.remaining.length = 0;

		this.buildDeck();
	},

	buildDeck: function() {
		var key = null;

		for (key in this.normal) {
			this.remaining.push(this.normal[key]);
		}

		tm.scrambleList(this.remaining);
		tm.scrambleList(this.remaining);
		tm.scrambleList(this.remaining);
	},

	seedTutorialEvent: function(event) {
		if (this.normal.hasOwnProperty(event)) {
			this.remaining.unshift(this.normal[event]);
		}
		else if (this.endGame.hasOwnProperty(event)) {
			this.remaining.unshift(this.endGame[event]);
		}
		else {
			assert(false, "seedTutorialEvent: unknown event!");
		}
	},

	getNextAffectedBiome: function() {
		return this.iCurBiome < this.affectedBiomes.length ? this.affectedBiomes[this.iCurBiome++] : null;
	},

	next: function() {
		if (this.remaining.length === 0) {
			this.buildDeck();
		}

		this.remaining.shift();
	},

	getCurrentEventTitle: function() {
		assert(this.remaining.length > 0, "getCurrentEventTitle: out of Event cards!");
		return this.remaining[0].getTitle();
	},

	getCurrentEventInfo: function() {
		assert(this.remaining.length > 0, "getCurrentEventInfo: out of Event cards!");
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

		if (this.nCardsDestroyed === 0) {
			unlistenFor('cardDestroyed');
			broadcast('noCardsRemoved');
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
	endGame: {
		humanSettlement: {
			// Destroy all 'normal' plants in a single biome.
			getTitle: function() {
				return strings.EVENTS.HUMAN_SETTLEMENT.title;
			},

			getInfo: function() {
				return strings.EVENTS.HUMAN_SETTLEMENT.info;
			},

			getPrimaryBiome: function() {
				var biomeScores = [];
				var biomeAntiScores = [];
				var maxIndeces = [];
				var i = 0;
				var iMax = -1;

				gs.scoreBiomesBy('plantae', null, true, true, biomeScores);
				gs.scoreBiomesBy('plantae', 'large', true, true, biomeAntiScores);
				gs.scoreBiomesBy('plantae', 'small', false, true, biomeAntiScores);

				for (i=0; i<biomeScores.length; ++i) {
					biomeScores[i] = biomeScores[i] - biomeAntiScores[i];
				}

				tm.numberListFindMaxima(biomeScores, maxIndeces);
				iMax = tm.listReturnRandomElement(maxIndeces);

				return iMax >= 0 && iMax < biomeScores.length ? gs.getIthBiome(iMax) : null;
			},

			tagCardsForDestruction: function(targetBiome) {
				assert(gs.displacementDeckEmpty(), "events.humanSettlement.tagCardsForDestruction: displacementDeck not empty!");

				targetBiome.tagCardsOfTypeForDestruction('plantae', null, true);
				targetBiome.untagDestroyedCardsWithKeyword('large');
				targetBiome.untagDestroyedCardsWithKeyword('small');

				if (targetBiome.getNumCardsDestroyed() > 0) {
					events.affectedBiomes.push(targetBiome);
				}

				broadcast('cardsDestroyed');
			}
		},
	},

	normal: {
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

				return iMax >= 0 && iMax < biomeScores.length ? gs.getIthBiome(iMax) : null;
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

				return iMax >= 0 && iMax < biomeScores.length ? gs.getIthBiome(iMax) : null;
			},

			tagCardsForDestruction: function(targetBiome) {
				assert(gs.displacementDeckEmpty(), "events.poleShift.tagCardsForDestruction: displacementDeck not empty!");

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
				var max = Number.NEGATIVE_INFINITY;
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

				if(maxIndeces.length > 0 && maxIndeces.length <= biomeScores.length) {
					iMax = maxIndeces[Math.floor(Math.random() * maxIndeces.length)];
				}

				return iMax >= 0 ? gs.getIthBiome(iMax) : null;
			},

			tagCardsForDestruction: function(targetBiome) {
				var i = 0;

				// Discard large plants.
				assert(gs.displacementDeckEmpty(), "events.blight.tagCardsForDestruction: displacementDeck not empty!");

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
			NUM_BIOMES_AFFECTED: 3,

			// Destroy all 'small' plants in 3 neighboring biomes.
			getTitle: function() {
				return strings.EVENTS.INSECT_PLAGUE.title;
			},

			getInfo: function() {
				return strings.EVENTS.INSECT_PLAGUE.info;
			},

			getPrimaryBiome: function() {
				var biomeScores = [];
				var maxIndeces = []
				var i = 0;
				var iMax = -1;
				var max = 0;
				var test = 0;
				
				gs.scoreBiomesBy('plantae', 'small', true, true, biomeScores);

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

				if (maxIndeces.length > 0 && maxIndeces.length <= biomeScores.length) {
					iMax = maxIndeces[Math.floor(Math.random() * maxIndeces.length)];
				}

				return iMax >= 0 ? gs.getIthBiome(iMax) : null;
			},

			tagCardsForDestruction: function(targetBiome) {
				var i = 0;

				// Discard large plants.
				assert(gs.displacementDeckEmpty(), "events.insectPlague.tagCardsForDestruction: displacementDeck not empty!");

				for (i=0; i<this.NUM_BIOMES_AFFECTED; ++i) {
					targetBiome.tagCardsOfTypeForDestruction('plantae', 'small', true);

					if (targetBiome.getNumCardsDestroyed() > 0) {
						events.affectedBiomes.push(targetBiome);
					}

					targetBiome = gs.getNextBiome(targetBiome);
				}

				broadcast('cardsDestroyed');
			},
		},

		disease: {
			targetFamily: null,

			// Destoy all animals of one family (amphibia/reptilia/aves/mammalia) in one biome.
			getTitle: function() {
				return strings.EVENTS.DISEASE.title;
			},

			getInfo: function() {
				return strings.EVENTS.DISEASE.info;
			},

			getPrimaryBiome: function() {
				var biomeScores = {amphibia: [], reptilia: [], aves: [], mammalia: []};
				var bestBiomes = [];
				var key = null;
				var iMax = [];
				var iTargetBiome = -1;
				var test = 0;
				var best = 0;

				for (key in biomeScores) {
					gs.scoreBiomesBy(key, null, true, true, biomeScores[key]);
					test = tm.numberListFindMaxValue(biomeScores[key]);

					if (test > best) {
						bestBiomes.length = 0;
						bestBiomes.push(key);
						best = test;
					}
					else if (test === best && test > 0) {
						bestBiomes.push(key);
					}
				}

				this.targetFamily = tm.listReturnRandomElement(bestBiomes);

				tm.numberListFindMaxima(biomeScores[this.targetFamily], iMax);

				iTargetBiome = tm.listReturnRandomElement(iMax);

				return iTargetBiome >= 0 && iTargetBiome < biomeScores[this.targetFamily].length ? gs.getIthBiome(iTargetBiome) : null;
			},

			tagCardsForDestruction: function(targetBiome) {
				assert(gs.displacementDeckEmpty(), "events.disease.tagCardsForDestruction: displacementDeck not empty!");

				targetBiome.tagCardsOfTypeForDestruction(this.targetFamily, null, true);

				if (targetBiome.getNumCardsDestroyed() > 0) {
					events.affectedBiomes.push(targetBiome);
				}

				broadcast('cardsDestroyed');
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
				var biomeScores = [];
				var maxIndeces = [];
				var iMax = -1;

				gs.scoreBiomesBy('amphibia', 'herbivore', true, true, biomeScores);
				gs.scoreBiomesBy('reptilia', 'herbivore', false, true, biomeScores);
				gs.scoreBiomesBy('aves', 'herbivore', false, true, biomeScores);
				gs.scoreBiomesBy('mammalia', 'herbivore', false, true, biomeScores);

				tm.numberListFindMaxima(biomeScores, maxIndeces);
				iMax = tm.listReturnRandomElement(maxIndeces);

				return iMax >= 0 && iMax < biomeScores.length ? gs.getIthBiome(iMax) : null;
			},

			tagCardsForDestruction: function(targetBiome) {
				assert(gs.displacementDeckEmpty(), "events.drought.tagCardsForDestruction: displacementDeck not empty!");

				targetBiome.tagCardsOfTypeForDestruction('amphibia', 'herbivore', true);
				targetBiome.tagCardsOfTypeForDestruction('reptilia', 'herbivore', false);
				targetBiome.tagCardsOfTypeForDestruction('aves', 'herbivore', false);
				targetBiome.tagCardsOfTypeForDestruction('mammalia', 'herbivore', false);

				if (targetBiome.getNumCardsDestroyed() > 0) {
					events.affectedBiomes.push(targetBiome);
				}

				broadcast('cardsDestroyed');
			},
		},

		fastActingToxins: {
			// Destroy all small reptiles and amphibians.
			getTitle: function() {
				return strings.EVENTS.FAST_ACTING_TOXINS.title;
			},

			getInfo: function() {
				return strings.EVENTS.FAST_ACTING_TOXINS.info;
			},

			getPrimaryBiome: function() {
				var biomeScores = [];
				var maxIndeces = [];
				var iMax = -1;

				gs.scoreBiomesBy('amphibia', 'small', true, true, biomeScores);
				gs.scoreBiomesBy('reptilia', 'small', false, true, biomeScores);
				tm.numberListFindMaxima(biomeScores, maxIndeces);
				iMax = tm.listReturnRandomElement(maxIndeces);

				return iMax >= 0 && iMax < biomeScores.length ? gs.getIthBiome(iMax) : null;
			},

			tagCardsForDestruction: function(targetBiome) {
				assert(gs.displacementDeckEmpty(), "events.fastActingToxins.tagCardsForDestruction: displacementDeck not empty!");

				targetBiome.tagCardsOfTypeForDestruction('amphibia', 'small', true);
				targetBiome.tagCardsOfTypeForDestruction('reptilia', 'small', false);

				if (targetBiome.getNumCardsDestroyed() > 0) {
					events.affectedBiomes.push(targetBiome);
				}

				broadcast('cardsDestroyed');
			}
		},

		cumulativeToxins: {
			// Destroy all small birds and mammals.
			getTitle: function() {
				return strings.EVENTS.CUMULATIVE_TOXINS.title;
			},

			getInfo: function() {
				return strings.EVENTS.CUMULATIVE_TOXINS.info;
			},

			getPrimaryBiome: function() {
				var biomeScores = [];
				var maxIndeces = [];
				var iMax = -1;

				gs.scoreBiomesBy('aves', 'small', true, true, biomeScores);
				gs.scoreBiomesBy('mammalia', 'small', false, true, biomeScores);
				tm.numberListFindMaxima(biomeScores, maxIndeces);
				iMax = tm.listReturnRandomElement(maxIndeces);

				return iMax >= 0 && iMax < biomeScores.length ? gs.getIthBiome(iMax) : null;
			},

			tagCardsForDestruction: function(targetBiome) {
				assert(gs.displacementDeckEmpty(), "events.cumulativeToxins.tagCardsForDestruction: displacementDeck not empty!");

				targetBiome.tagCardsOfTypeForDestruction('aves', 'small', true);
				targetBiome.tagCardsOfTypeForDestruction('mammalia', 'small', false);

				if (targetBiome.getNumCardsDestroyed() > 0) {
					events.affectedBiomes.push(targetBiome);
				}

				broadcast('cardsDestroyed');
			}
		},

		globalWarming: {
			// One wetlands becomes a desert, destroying all insects and large plants.
			getTitle: function() {
				return strings.EVENTS.GLOBAL_WARMING.title;
			},

			getInfo: function() {
				return strings.EVENTS.GLOBAL_WARMING.info;
			},

			getPrimaryBiome: function() {
				var biomes = [];
				var targetBiome = null;
				var i = 0;
				var biomeScores = [];
				var maxIndeces = [];
				var iMax = -1;

				gs.getBiomesOfType('WETLANDS', biomes);

				if (biomes.length > 0) {
					for (i=0; i<biomes.length; ++i) {
						biomes[i].setScore(0);
						biomes[i].setScore(biomes[i].scoreNichesBy("insecta", null, true));
						biomes[i].setScore(biomes[i].getScore() + biomes[i].scoreNichesBy("plantae", "large", true));
						biomeScores.push(biomes[i].getScore());

						tm.numberListFindMaxima(biomeScores, maxIndeces);
						iMax = tm.listReturnRandomElement(maxIndeces);

						if (biomeScores[iMax] > 0) {
							targetBiome = biomes[iMax];
						}
						else {
							biomes[iMax].convertToNewType('DESERT');
						}
					}
				}

				return targetBiome;
			},

			tagCardsForDestruction: function(targetBiome) {
				assert(gs.displacementDeckEmpty(), "events.globalWarming.tagCardsForDestruction: displacementDeck not empty!");

				targetBiome.convertToNewType('DESERT');

				targetBiome.tagCardsOfTypeForDestruction('insecta', null, true);
				targetBiome.tagCardsOfTypeForDestruction('plantae', 'large', false);

				if (targetBiome.getNumCardsDestroyed() > 0) {
					events.affectedBiomes.push(targetBiome);
				}

				broadcast('cardsDestroyed');
			}
		},

		globalCooling: {
			// One desert becomes a wetlands, destroying all nematodes and small plants.
			getTitle: function() {
				return strings.EVENTS.GLOBAL_COOLING.title;
			},

			getInfo: function() {
				return strings.EVENTS.GLOBAL_COOLING.info;
			},

			getPrimaryBiome: function() {
				var biomes = [];
				var targetBiome = null;
				var i = 0;
				var biomeScores = [];
				var maxIndeces = [];
				var iMax = -1;

				gs.getBiomesOfType('DESERT', biomes);

				if (biomes.length > 0) {
					for (i=0; i<biomes.length; ++i) {
						biomes[i].setScore(0);
						biomes[i].setScore(biomes[i].scoreNichesBy("nematoda", null, true));
						biomes[i].setScore(biomes[i].getScore() + biomes[i].scoreNichesBy("plantae", "small", true));
						biomeScores.push(biomes[i].getScore());

						tm.numberListFindMaxima(biomeScores, maxIndeces);
						iMax = tm.listReturnRandomElement(maxIndeces);

						if (biomeScores[iMax] > 0) {
							targetBiome = biomes[iMax];
						}
						else {
							biomes[iMax].convertToNewType('WETLANDS');
						}
					}
				}

				return targetBiome;
			},

			tagCardsForDestruction: function(targetBiome) {
				assert(gs.displacementDeckEmpty(), "events.globalCooling.tagCardsForDestruction: displacementDeck not empty!");

				targetBiome.convertToNewType('WETLANDS');

				targetBiome.tagCardsOfTypeForDestruction('nematoda', null, true);
				targetBiome.tagCardsOfTypeForDestruction('plantae', 'small', false);

				if (targetBiome.getNumCardsDestroyed() > 0) {
					events.affectedBiomes.push(targetBiome);
				}

				broadcast('cardsDestroyed');
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
				var biomeScores = [];
				var maxIndeces = [];
				var iMax = -1;

				gs.scoreBiomesBy('amphibia', 'carnivore', true, true, biomeScores);
				gs.scoreBiomesBy('reptilia', 'carnivore', false, true, biomeScores);
				gs.scoreBiomesBy('aves', 'carnivore', false, true, biomeScores);
				gs.scoreBiomesBy('mammalia', 'carnivore', false, true, biomeScores);

				tm.numberListFindMaxima(biomeScores, maxIndeces);
				iMax = tm.listReturnRandomElement(maxIndeces);

				return iMax >= 0 && iMax < biomeScores.length ? gs.getIthBiome(iMax) : null;
			},

			tagCardsForDestruction: function(targetBiome) {
				assert(gs.displacementDeckEmpty(), "events.drought.tagCardsForDestruction: displacementDeck not empty!");

				targetBiome.tagCardsOfTypeForDestruction('amphibia', 'carnivore', true);
				targetBiome.tagCardsOfTypeForDestruction('reptilia', 'carnivore', false);
				targetBiome.tagCardsOfTypeForDestruction('aves', 'carnivore', false);
				targetBiome.tagCardsOfTypeForDestruction('mammalia', 'carnivore', false);

				if (targetBiome.getNumCardsDestroyed() > 0) {
					events.affectedBiomes.push(targetBiome);
				}

				broadcast('cardsDestroyed');
			},
		},
	},
};

