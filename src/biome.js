///////////////////////////////////////////////////////////////////////////////
// Biome Data
///////////////////////////////////////////////////////////////////////////////
bd = {};
bd.ROW_OFFSET = 3;

// ----------------------------------------------------------------------------
// Biome
// ----------------------------------------------------------------------------
bd.biome = function() {
	this.latitude 		= -1;
	this.type 			= null;
	this.startCol 		= -1;
	this.sprNoSelect	= null;
	this.layer 			= null;
	this.sprBlocked 	= null;
	this.niches 		= [];
	this.tileSet  		= null;
	this.suitText 		= null;
	this.score 			= 0;
	this.nPrepended 	= 0;
	this.cardsDestroyed	= [];
	this.cardsDisplaced = [];
};

bd.biome.prototype.MAX_GROWTH = 2;
bd.biome.prototype.MAX_SIZE = 6;

bd.biome.prototype.sizeByLatitude = [2, 3, 4, 3, 2];
bd.biome.prototype.noSelectByLatitude = ['Small', 'Medium', 'Large', 'Medium', 'Small'];
bd.biome.prototype.maxSizeAtLatitude = [4, 5, 5, 5, 4];
bd.biome.prototype.offsets = [6, 7, 6, 7, 6];
bd.biome.prototype.TYPES = {
	DESERT: { name: "Desert", tiles: [ [{row: 18, col: 37}, {row: 18, col: 36}, {row: 19, col: 34}],
												    [{row: 18, col: 35}, {row: 18, col: 33}, {row: 19, col: 35}],
												    [{row: 18, col: 35}, {row: 18, col: 33}, {row: 19, col: 35}],
												    [{row: 18, col: 38}, {row: 18, col: 39}, {row: 19, col: 36}] ]
			},
	FOREST: { name: "Forest", tiles: [ [{row: 34, col: 37}, {row: 34, col: 36}, {row: 35, col: 34}],
												    [{row: 34, col: 35}, {row: 34, col: 33}, {row: 35, col: 35}],
												    [{row: 34, col: 35}, {row: 34, col: 33}, {row: 35, col: 35}],
												    [{row: 34, col: 38}, {row: 34, col: 39}, {row: 35, col: 36}] ]
			},
	PLAINS: { name: "Plains", tiles: [ [{row: 16, col: 37}, {row: 16, col: 36}, {row: 17, col: 34}],
												    [{row: 16, col: 35}, {row: 16, col: 33}, {row: 17, col: 35}],
												    [{row: 16, col: 35}, {row: 16, col: 33}, {row: 17, col: 35}],
												    [{row: 16, col: 38}, {row: 16, col: 39}, {row: 17, col: 36}] ]
			},
	WETLANDS: { name: "Wetlands", tiles: [ [{row: 31, col: 9}, {row: 31, col: 9}, {row: 31, col: 6}],
												    [{row: 31, col: 9}, {row: 31, col: 9}, {row: 31, col: 6}],
												    [{row: 31, col: 9}, {row: 31, col: 9}, {row: 31, col: 6}],
												    [{row: 31, col: 9}, {row: 31, col: 9}, {row: 31, col: 6}] ]
			},
	MOUNTAINS: { name: "Mountains", tiles: [ [{row: 22, col: 37}, {row: 22, col: 36}, {row: 23, col: 34}],
												    	[{row: 22, col: 35}, {row: 22, col: 33}, {row: 23, col: 35}],
												    	[{row: 22, col: 35}, {row: 22, col: 33}, {row: 23, col: 35}],
												    	[{row: 22, col: 38}, {row: 22, col: 39}, {row: 23, col: 36}] ]
			},
};

bd.biome.prototype.reset = function() {
	var i = 0;

	for (i=0; i<this.niches.length; ++i) {
		this.niches[i].init();
	}
}

bd.biome.prototype.getStartColumn = function() {
	return this.startCol;
};

bd.biome.prototype.getStartOffset = function() {
	return this.offsets[this.getLatitude()];
};

bd.biome.prototype.showNextCardHints = function() {
	var i = 0;

	for (i=0; i<this.niches.length; ++i) {
		this.niches[i].showNextCardHint();
	}
}

bd.biome.prototype.convertToNewType = function(newType) {
	var key = null;

	for (key in this.TYPES) {
		if (this.TYPES[key].name.toLowerCase() === newType.toLowerCase()) {
			newType = this.TYPES[key];
			break;
		}
	}

	this.type = newType;
	this.draw(this.layer, 'ff_world');
}

bd.biome.prototype.getScore = function() {
	return this.score;
}

bd.biome.prototype.setScore = function(newScore) {
	this.score = newScore;
}

bd.biome.prototype.isLastNiche = function(niche) {
	return this.niches && this.niches.length > 0 && this.niches[this.niches.length - 1] === niche;
}

bd.biome.prototype.isFirstNiche = function(niche) {
	return this.niches && this.niches.length > 0 && this.niches[0] === niche;
}

bd.biome.prototype.prependNiche = function(biome) {
	this.startCol -= 1;

	var niche = new bd.niche(this.getNicheRow(), this.getNicheColumn(0));

	niche.setBiome(biome);
	this.buildAdditionalNiche(biome.getType(), niche);
	this.niches.unshift(niche);
	this.nPrepended += 1;

	return niche;
}

bd.biome.prototype.getNumCardsDestroyed = function() {
	return this.cardsDestroyed.length;
}

bd.biome.prototype.getNumPrepended = function() {
	return this.nPrepended;
}

bd.biome.prototype.getNicheAt = function(iNiche) {
	var niche = null;

	if (iNiche >= 0 && iNiche < this.niches.length) {
		niche = this.niches[iNiche];
	}

	return niche;
}

bd.biome.prototype.getNextNiche = function(curNiche) {
	var i = 0;
	var nextNiche = null;

	for (i=0; i<this.niches.length; ++i) {
		if (this.niches[i] === curNiche) {
			if (i < this.niches.length - 1) {
				nextNiche = this.niches[i + 1];
			}

			break;
		}
	}

	return nextNiche;
}

bd.biome.prototype.getPrevNiche = function(curNiche) {
	var i = 0;
	var prevNiche = null;

	for (i=0; i<this.niches.length; ++i) {
		if (this.niches[i] === curNiche) {
			if (i > 0) {
				prevNiche = this.niches[i - 1];
			}

			break;
		}
	}

	return prevNiche;
}

bd.biome.prototype.getCurrentPopulationCount = function() {
	var i = 0;
	var count = 0;

	for (i=0; i<this.niches.length; ++i) {
		count += this.niches[i].getCurrentPopulationCount();
	}

	return count;
}

bd.biome.prototype.getMaxPopulationCount = function() {
	var i = 0;
	var count = 0;

	for (i=0; i<this.niches.length; ++i) {
		count += this.niches[i].getMaxPopulationCount();
	}

	return count;
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

bd.biome.prototype.getX = function(bRight) {
	var startOffset = this.getStartOffset();
	var blockFudge = startOffset % 2 === 0 ? 1 : 0;
	var tilesPerNiche = this.type.tiles[0].length;

	return bRight ? uim.worldToUiX((startOffset + blockFudge (this.getNumNiches() - 1) * tilesPerNiche + tilesPerNiche - 1) * TILE_SIZE) : uim.worldToUiX((startOffset + blockFudge) * TILE_SIZE);
}
bd.biome.prototype.getY = function(bBottom) {
	var tilesPerNiche = this.type.tiles.length;
	return bBottom ? uim.worldToUiY((this.latitude * tilesPerNiche + tilesPerNiche - 1 + LAYER_OFFSET) * TILE_SIZE) : uim.worldToUiY((this.latitude * tilesPerNiche + LAYER_OFFSET) * TILE_SIZE)
}
bd.biome.prototype.getType = function() { return this.type; }
bd.biome.prototype.setLatitude = function(lat) { this.latitude = lat; }
bd.biome.prototype.getLatitude = function() { return this.latitude; }
bd.biome.prototype.setType = function(t) { this.type = t; }
bd.biome.prototype.setStartCol = function(s) { this.startCol = s; }
bd.biome.prototype.build = function(layer, tileSet, type, sprBlocked) {
	var i = 0;
	var iCol = 0;
	var iRow = 0;
	var row = 0;
	var col = 0;
	var x = 0;
	var y = 0;
	var bLastNiche = false;
	var bSpacerCell = false;
	var tile = null;
	var startOffset = this.getStartOffset();
	var blockFudge = startOffset % 2 === 0 ? 1 : 0;

	assert(sprBlocked, 'biome.build: invalid blocking sprite!');

	this.sprBlocked = sprBlocked;
	this.sprBlocked.x = uim.worldToUiX((startOffset + blockFudge) * TILE_SIZE);
	this.sprBlocked.y = uim.worldToUiY((this.latitude * this.type.tiles.length + LAYER_OFFSET) * TILE_SIZE);
	this.sprBlocked.scale.setTo(gs.SPRITE_SCALE, gs.SPRITE_SCALE);

	this.sprBlocked.kill();

	this.tileSet = tileSet;
	this.layer = layer;

	row = this.latitude * this.type.tiles.length + (this.type.tiles.length - 1);

	x = startOffset * TILE_SIZE;
	y = row * TILE_SIZE;
	this.sprNoSelect = uim.getGroup().create(x, y, 'noSelect' + this.noSelectByLatitude[this.latitude]);
	this.sprNoSelect.kill();

	this.draw(layer, tileSet, type);
}

bd.biome.prototype.draw = function(layer, tileSet) {
	var i = 0;
	var iCol = 0;
	var iRow = 0;
	var row = 0;
	var col = 0;
	var x = 0;
	var y = 0;
	var bLastNiche = false;
	var bSpacerCell = false;
	var tile = null;
	var startOffset = this.getStartOffset();

	for (i=0; i<this.getNumNiches(); ++i) {
		for (iRow=0; iRow<this.type.tiles.length; ++iRow) {
			row = this.latitude * this.type.tiles.length + iRow;

			if (iRow === this.type.tiles.length - 1 && i === 0) {
				x = startOffset * TILE_SIZE;
				y = row * TILE_SIZE;
			}

			for (iCol=0; iCol<this.type.tiles[0].length; ++iCol) {
				col = (this.startCol + i) * this.type.tiles[0].length + iCol + startOffset;

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

bd.biome.prototype.scoreNichesBy = function(organismType, keyword, bCascade) {
	var i = 0;
	var organismRank = -1;
	var iRank = 0;
	var score = 0;

	for (i=0; i<this.niches.length; ++i) {
		organismRank = this.niches[i].getOrganismRank(organismType, keyword);
		if (organismRank >= 0) {
			// Score two points for each destroyed card...
			score += 2;

			if (bCascade) {
				// ...plus 1 point for every card destroyed or displaced.
				score += this.niches[i].scoreOrganismsAboveRank(organismRank, organismType, keyword);
			}
		}
	}

	return score;
}

bd.biome.prototype.tagCardsForDisplacement = function() {
	var i = 0;
	var niche = null;

	this.cardsDisplaced.length = 0;

	for (i=0; i<this.niches.length; ++i) {
		this.niches[i].tagCardsForDisplacement(this.cardsDisplaced);
	}

	return this.cardsDisplaced.length;
}

bd.biome.prototype.getDisplacedCard = function(iCard) {
	assert(this.cardsDisplaced &&
		   iCard >= 0 &&
		   iCard < this.cardsDisplaced.length,
		   "getDisplacedCard: invalid card index!");

	return this.cardsDisplaced[iCard];
}

bd.biome.prototype.getTaggedCard = function(iCard) {
	assert(this.cardsDestroyed &&
		   iCard >= 0 &&
		   iCard < this.cardsDestroyed.length,
		   "getTaggedCard: invalid card index!");

	return this.cardsDestroyed[iCard];
}

bd.biome.prototype.removeTaggedCard = function(card) {
	var niche = card ? gs.getCardNiche(card) : null;

	assert(niche, "removeTaggedCard: invalid card or niche!");

	niche.removeCard(card, true);
}

bd.biome.prototype.tagCardsOfTypeForDestruction = function(organism, keyword, bClear) {
	var i = 0;

	if (bClear) {
		this.cardsDestroyed.length = 0;
	}

	for (i=0; i<this.niches.length; ++i) {
		this.niches[i].tagCardsOfTypeForDestruction(organism, keyword, this.cardsDestroyed);
	}
}

bd.biome.prototype.buildAdditionalNiche = function(type, newNiche) {
	var iCol = 0;
	var iRow = 0;
	var row = 0;
	var col = 0;
	var x = 0;
	var y = 0;
	var tileData = null;
	var bSpacerCell = false;
	var tile = null;
	var startOffset = this.getStartOffset();

	for (iRow=0; iRow<this.type.tiles.length; ++iRow) {
		row = this.latitude * this.type.tiles.length + iRow;

		if (iRow === this.type.tiles.length - 1) {
			x = startOffset * TILE_SIZE;
			y = row * TILE_SIZE;
		}

		for (iCol=0; iCol<this.type.tiles[0].length; ++iCol) {
			col = (this.startCol) * this.type.tiles[0].length + iCol + startOffset;

			bSpacerCell = iCol === this.type.tiles[0].length - 1;
			if (bSpacerCell) {
				tile = tm.addTilesToLayer(this.layer, 'ff_world', this.type.tiles[iRow][iCol], row + bd.ROW_OFFSET, col);
				if (tile) {
					tile.properties = null;
				}
			}
			else {
				tile = tm.addTilesToLayer(this.layer, 'ff_world', this.type.tiles[iRow][iCol], row + bd.ROW_OFFSET, col);
				if (tile) {
					tile.properties = newNiche;
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
	var startOffset = this.getStartOffset();

	for (i=0; i<this.getNumNiches(); ++i) {
		for (iRow=0; iRow<this.type.tiles.length; ++iRow) {
			row = this.latitude * this.type.tiles.length + iRow;

			for (iCol=0; iCol<this.type.tiles[0].length; ++iCol) {
				col = (this.startCol + i) * this.type.tiles[0].length + iCol + startOffset;
				tm.aremoveilesFromLayer(layer, bd.ROW_OFFSET, row, col);
			}
		}
	}
}

bd.biome.prototype.getNumNiches = function() {
	return this.niches ? this.niches.length : 0;
}

bd.biome.prototype.placeCursor = function(iNiche) {
	assert(iNiche >= 0 && iNiche < this.niches.length, "placeCursor: invalid niche index!");

	this.niches[iNiche].setCursor(null);
}

bd.biome.prototype.placeCursors = function(card) {
	var nNiches = this.getNumNiches();
	var i = 0;

	for (i=0; i<nNiches; ++i) {
		if (!this.isBlocked() && this.niches[i].canHoldCard(card)) {
			this.niches[i].setCursor(card);
		}
	}
}

bd.biome.prototype.getNicheColumn = function(iNiche) {
	return (this.startCol + iNiche) * this.type.tiles[0].length + this.getStartOffset();
}

bd.biome.prototype.getNicheRow = function() {
	return this.latitude * this.type.tiles.length + LAYER_OFFSET;
}

bd.biome.prototype.canHoldCard = function(card) {
	var i = 0;
	var bCanHoldCard = false;

	for (i=0; i<this.niches.length; ++i) {
		if (this.niches[i].canHoldCard(card)) {
			bCanHoldCard = true;
		}
	}

	return bCanHoldCard;
}

bd.biome.prototype.getNicheId = function(niche) {
	var i = 0;
	var id = -1;

	for (i=0; i<this.niches.length; ++i) {
		if (this.niches[i] === niche) {
			id = i;
			break;
		}
	}

	return id;
}
