///////////////////////////////////////////////////////////////////////////////
// Biome Data
///////////////////////////////////////////////////////////////////////////////
bd = {};
bd.ROW_OFFSET = 3;

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
	this.tileSet  	= null;
	this.suitText 	= null;
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
	MOUNTAIN: { name: "Mountains", tiles: [ [{row: 22, col: 37}, {row: 22, col: 36}, {row: 23, col: 34}],
												    	[{row: 22, col: 35}, {row: 22, col: 33}, {row: 23, col: 35}],
												    	[{row: 22, col: 35}, {row: 22, col: 33}, {row: 23, col: 35}],
												    	[{row: 22, col: 38}, {row: 22, col: 39}, {row: 23, col: 36}] ]
			},
}

bd.biome.prototype.showNextCardHints = function() {
	var i = 0;

	for (i=0; i<this.niches.length; ++i) {
		this.niches[i].showNextCardHint();
	}
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
	var bLastNiche = false;
	var bSpacerCell = false;
	var tile = null;
	var blockFudge = this.startOffset % 2 === 0 ? 1 : 0;

	assert(sprBlocked, 'biome.build: invalid blocking sprite!');

	this.sprBlocked = sprBlocked;
	this.sprBlocked.x = uim.worldToUiX((this.startOffset + blockFudge) * TILE_SIZE);
	this.sprBlocked.y = uim.worldToUiY((this.latitude * this.type.tiles.length + LAYER_OFFSET) * TILE_SIZE);
	this.sprBlocked.scale.setTo(gs.SPRITE_SCALE, gs.SPRITE_SCALE);

	this.sprBlocked.kill();

	this.tileSet = tileSet;
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

	for (iRow=0; iRow<this.type.tiles.length; ++iRow) {
		row = this.latitude * this.type.tiles.length + iRow;

		if (iRow === this.type.tiles.length - 1) {
			x = this.startOffset * TILE_SIZE;
			y = row * TILE_SIZE;
		}

		for (iCol=0; iCol<this.type.tiles[0].length; ++iCol) {
			col = (this.startCol) * this.type.tiles[0].length + iCol + this.startOffset;

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
