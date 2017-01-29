// ----------------------------------------------------------------------------
// Niche
// ----------------------------------------------------------------------------
bd.niche = function(topRow, leftCol) {
	var i = 0;

	this.cards = [];
	this.topRow = topRow;
	this.leftCol = leftCol;
	this.text = game.add.bitmapText(this.leftCol * TILE_SIZE, this.topRow * TILE_SIZE, 'bogboo', uim.INFO_TEXT_SIZE * gs.SPRITE_SCALE);
	this.text.anchor.setTo(0.5, 0.5);
	this.text.visible = false;
	this.biome = null;
	this.bAddedDuringPlay = false;

	for (i=0; i<=this.MAX_RANK; ++i) {
		this.cards.push(null);
	}
};

bd.niche.prototype.MAX_RANK = 3;
bd.niche.prototype.ERR_INVALID_PLACEMENT = -99;

bd.niche.prototype.init = function() {
	var i = 0;

	this.cards.length = 0;

	for (i=0; i<=this.MAX_RANK; ++i) {
		this.cards.push(null);
	}
}

bd.niche.prototype.hasOrganismAtRank = function(rank) {
	assert(rank >= 0 && rank < this.cards.length, "hasOrganismAtRank: invalid rank!");

	return this.cards[rank] !== null;
}

bd.niche.prototype.countOrganismsAboveRank = function(rank) {
	var i = 0;
	var nOrgs = 0;

	for (i=rank+1; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			nOrgs += 1;
		}
	}

	return nOrgs;
}

bd.niche.prototype.getOrganismRank = function(orgType, keyword) {
	var iRank = -1;
	var i = 0;

	orgType = orgType.toLowerCase();
	keyword = keyword.toLowerCase();

	for (i=0; i<this.cards.length; ++i) {
		if (gs.getCardTitle(this.cards[i]).toLowerCase() === orgType) {
			if (!keyword || gs.getCardKeywords(this.cards[i]).toLowerCase().indexOf(keyword) >= 0) {
				iRank = i;
				break;
			}
		}
	}

	return iRank;
}

bd.niche.prototype.setAddedDuringPlay = function() {
	this.bAddedDuringPlay = true;
};

bd.niche.prototype.wasAddedDuringPlay = function() {
	return this.bAddedDuringPlay;
};

bd.niche.prototype.getRankOfFirstHole = function() {
	var rank = -1;
	var i = 0;

	for (i=0; i<this.cards.length; ++i) {
		if (!this.cards[i]) {
			rank = i;
			break;
		}
	}

	return rank;
}

bd.niche.prototype.getValueOfFirstHole = function() {
	var value = -1;
	var i = 0;

	var holeRank = this.getRankOfFirstHole();
	if (rank >= 0) {
		if (rank === 0) {
			value = 0;
		}
		else {
			value = this.cards[rank - 1] ? gs.getCardValue(this.cards[rank - 1]) + 1 : -1;
		}
	}

	return value;
};

bd.niche.prototype.getSuitOfFirstHole = function() {
	var rank = this.getRankOfFirstHole();
	var suit = null;

	if (rank === 0) {
		gs.getCardSuitFromValue(0);
	}
	else if (this.cards[rank - 1]) {
		value = gs.getCardValue(this.cards[rank - 1]) + 1;

		if (value !== gs.WILD_CARD_VALUE) {
			suit = gs.getCardSuitFromValue(value);
		}
	}

	return suit;
};


bd.niche.prototype.isLast = function() {
	return this.biome.isLastNiche(this);
};

bd.niche.prototype.isFirst = function() {
	return this.biome.isFirstNiche(this);
};

bd.niche.prototype.getNextCard = function(card) {
	var rank = this.getRankForCard(card);
	var nextCard = null;

	if (rank >= 0 && rank < this.cards.length) {
		nextCard = this.cards[rank + 1];
	}

	return nextCard;
};

bd.niche.prototype.getRankForCard = function(card) {
	var rank = -1;
	var i =0 ;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i] === card) {
			rank = i;
			break;
		}
	}

	assert(rank >= 0 && rank < this.cards.length, "getRankForCard: invalid rank!");

	return rank;
};

bd.niche.prototype.getRankForNewCard = function(card) {
	var i = 0;
	var newRank = -1;
	var cardValue = gs.getCardPhaseValue(card);
	var bFoundHole = false;

	for (i=0; i<this.cards.length; ++i) {
		if (!this.cards[i]) {
			// Found a hole.
			bFoundHole = true;

			if (i === 0) {
				if (cardValue === 0) {
					newRank = i;
					break;
				}
			}
			else if (this.cards[i - 1]) {
				if (cardValue === gs.WILD_CARD_VALUE || gs.getCardValue(this.cards[i - 1]) === cardValue - 1) {
					newRank = i;
					break;
				}
			}
			else if (gs.cardHasKeyword(card, 'symbiote') && gs.getCardLinkedCards(card).left) {
				newRank = i;
				break;
			}
		}
	}

	if (!bFoundHole) {
		newRank = this.ERR_INVALID_PLACEMENT;
	}

	return newRank;
}

bd.niche.prototype.canHoldCard = function(card) {
	return this.getRankForNewCard(card) >= 0;
}

bd.niche.prototype.getBiomeId = function() {
	return gs.getBiomeId(this.biome);
};

bd.niche.prototype.getId = function() {
	var id = -1;

	if (this.biome) {
		id = this.biome.getNicheId(this);
	}

	return id;
};

bd.niche.prototype.getTopRow = function() {
	return this.topRow;
};

bd.niche.prototype.getLeftCol = function() {
	return this.leftCol;
};

bd.niche.prototype.showNextCardHint = function() {
	var suit = this.getSuitOfFirstHole();
	var x = (this.leftCol + 0.5) * TILE_SIZE;
	var y = (this.topRow + 0.5 + this.getRankOfFirstHole()) * TILE_SIZE;

	if (suit) {
		this.text.x = Math.floor(uim.worldToUiX(x));
		this.text.y = Math.floor(uim.worldToUiY(y));
		this.text.text = suit;
		this.text.visible = true;
	}
	else {
		this.text.visible = false;
	}
};

bd.niche.prototype.markForDiscard = function(organism, keyword) {
	var i = 0;

	// ###
	organism = organism.toLowerCase();

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			if (gs.getCardTitle(this.cards[i]).toLowerCase() === organism) {
				if (!keyword || gs.getCardKeywords(this.cards[i]).toLowerCase().indexOf(keyword) >= 0) {
					gs.tagCardForRemoval(this.cards[i]);
				}
			}
		}
	}

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			if (gs.cardTaggedForRemoval(this.cards[i])) {
				gs.verifyCardCanBeRemoved(this, this.cards[i]);
			}
		}
	}
};

bd.niche.prototype.discard = function() {
	var i = 0;
	var iLowest = -1;

	// Remove destroyed cards.
	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i] && gs.cardRemovalConfirmed(this.cards[i])) {
			gs.cardPrepForRemoval(this, this.cards[i]);
			gs.cardRemove(this, this.cards[i]);
			gs.cardOnRemoved(this, this.cards[i]);

			if (iLowest < 0) {
				iLowest = i;
			}
		}
	}

	// Displace "downstream" cards.
	// ###
	for (i=iLowest + 1; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			gs.displaceCard(this.cards[i]);
			this.cards[i] = null;
		}
	}

	return iLowest;
}

bd.niche.prototype.removeCard = function(card) {
	var rank = -1;
	var linkedCards = null;

	// TODO: create particle effect at this location.

	assert(card, "removeCard: invalid card!");

	tm.removeTilesFromLayer(gs.layers.shadows, this.getTopRow(), this.getLeftCol() + 1);
	tm.removeTilesFromLayer(gs.layers.producers, this.getTopRow(), this.getLeftCol() + 1);

	rank = this.getRankForCard(card);
	this.cards[rank] = null;

	linkedCards = gs.getCardLinkedCards(card);

	if (gs.cardBreakLink(linkedCards.left, 'right')) {
		gs.unlinkLeft(card);
	}
	if (gs.cardBreakLink(linkedCards.above, 'below')) {
		gs.unlinkAbove(card);
	}
	if (gs.cardBreakLink(linkedCards.right, 'left')) {
		gs.unlinkRight(card);
	}
	if (gs.cardBreakLink(linkedCards.below, 'above')) {
		gs.unlinkBelow(card);
	}

	gs.resetCard(card);
};

bd.niche.prototype.addCard = function(card) {
	var linkedCards = null;
	var neighbor = null;
	var neighborNiche = null;
	var newRank = this.getRankForNewCard(card);

	assert(newRank >= 0, "addCard: niche cannot hold card!");

	gs.setCardNiche(card, this);
	this.cards[newRank] = card;

	this.text.visible = false;

	gs.executeCardSpecialFunction(card, 'onPlayed');

	// Check for back-links.
	linkedCards = gs.getCardLinkedCards(card);
	assert(linkedCards, "niche.addCard: invalid linkedCards!");

	if (newRank > 0) {
		neighbor = this.cards[newRank - 1];

		if (neighbor && gs.cardHasLink(neighbor, 'below')) {
			gs.linkBelow(neighbor, gs.getCardNiche(neighbor), true);
		}
	}

	neighborNiche = this.prev(this);
	neighbor = neighborNiche ? neighborNiche.cardAtRank(newRank) : null;
	if (neighbor && gs.cardHasLink(neighbor, 'right')) {
		gs.linkRight(neighbor, neighborNiche, true);
	}

	neighborNiche = this.next(this);
	neighbor = neighborNiche ? neighborNiche.cardAtRank(newRank) : null;
	if (neighbor && gs.cardHasLink(neighbor, 'left')) {
		gs.linkLeft(neighbor, neighborNiche, true);
	}
};

bd.niche.prototype.next = function() {
	assert(this.biome, "niche.next: invalid biome!");

	return this.biome.getNextNiche(this);
};

bd.niche.prototype.prev = function() {
	assert(this.biome, "niche.prev: invalid biome!");

	return this.biome.getPrevNiche(this);
};

bd.niche.prototype.cardAtRank = function(rank) {
	return this.cards && rank < this.cards.length ? this.cards[rank] : null;
};

bd.niche.prototype.setBiome = function(biome) {
	this.biome = biome;
};

bd.niche.prototype.getBiome = function() {
	return this.biome;
};

bd.niche.prototype.setCursor = function(card) {
	var x = this.leftCol * TILE_SIZE;
	var y = this.topRow * TILE_SIZE;

	uim.setCursor(x, y, this);
};
