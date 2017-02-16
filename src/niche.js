// ----------------------------------------------------------------------------
// Niche
// ----------------------------------------------------------------------------
bd.niche = function(topRow, leftCol) {
	var i = 0;

	this.cards = [];
	this.topRow = topRow;
	this.leftCol = leftCol;
	this.text = game.add.bitmapText(this.leftCol * TILE_SIZE, this.topRow * TILE_SIZE, 'bogboo', uim.INFO_TEXT_SIZE * gs.SPRITE_SCALE);
	uim.addToCardHintGroup(this.text);
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

	if (this.cards.length === 0) {
		for (i=0; i<=this.MAX_RANK; ++i) {
			this.cards.push(null);
		}
	}
	else {
		assert(this.cards.length === this.MAX_RANK + 1, "niche.init: invalid card array!");

		for (i=0; i<=this.MAX_RANK; ++i) {
			this.cards[i] = null;
		}
	}
}

bd.niche.prototype.getCardWithValue = function(value) {
	var i = 0;
	var card = null;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i] && this.cards[i].value === value) {
			card = this.cards[i];
			break;
		}
	}

	return card;
}

bd.niche.prototype.computeScore = function() {
	var i = 0;
	var score = 0;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			score += 1;
		}
	}

	return score * gs.UNIT_SCORE_SCALAR;
}

bd.niche.prototype.getCards = function(cardsOut) {
	var i = 0;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			cardsOut.push(this.cards[i]);
		}
	}
}

bd.niche.prototype.eraseCards = function(tileRef) {
	var i = 0;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			gs.eraseCard(this.cards[i]);
		}
	}

	tileRef.rating = this.computeEcosystemBiodiversity();
}

bd.niche.prototype.redrawCards = function() {
	var i = 0;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			gs.redrawCard(this.cards[i]);
		}
	}
}

bd.niche.prototype.eraseCardAtRank = function(iRank) {
	var card = this.cardAtRank(iRank);

	if (card) {
		gs.eraseCard(card);
	}
}

bd.niche.prototype.redrawCardAtRank = function(iRank) {
	var card = this.cardAtRank(iRank);

	if (card) {
		gs.redrawCard(card);
	}
}

bd.niche.prototype.computeEcosystemBiodiversity = function() {
	var i = 0;
	var iWord = 0;
	var uniqueWords = [];
	var keywords = null;
	var title = null;
	var keyword = null;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i] && this.cards[i].value > 0) {
			keywords = gs.getCardKeywords(this.cards[i]);
			title = gs.getCardTitle(this.cards[i]);

			if (title && uniqueWords.indexOf(title.toLowerCase()) < 0) {
				uniqueWords.push(title.toLowerCase());
			}

			keywords = keywords ? keywords.split(',') : null;

			for (iWord=0; keywords && iWord<keywords.length; ++iWord) {
				keyword = keywords[iWord].replace(' ', '').toLowerCase();

				if (uniqueWords.indexOf(keyword) < 0) {
					if (!gs.isNicheIdentifier(keyword)) {
						uniqueWords.push(keyword);
					}
				}
			}
		}
	}

	return uniqueWords.length;
}

bd.niche.prototype.getCardAt = function(tileRef, bDown) {
	var card = null;
	var i = 0;

	assert(tileRef.iCard >= 0 && tileRef.iCard < this.cards.length, "getCardAt: invalid card index!");

	for (i=tileRef.iCard; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			card = this.cards[i];
			tileRef.iCard = i + 1;
			break;
		}
	}

	if (!card || tileRef.iCard >= this.cards.length) {
		tileRef.iCard = -1;
	}

	return card;
}

bd.niche.prototype.setTopLeft = function(topRow, leftCol) {
	this.topRow = topRow;
	this.leftCol = leftCol;
}

bd.niche.prototype.hasOrganismAtRank = function(rank) {
	assert(rank >= 0 && rank < this.cards.length, "hasOrganismAtRank: invalid rank!");

	return this.cards[rank] !== null;
}

bd.niche.prototype.scoreOrganismsAboveRank = function(rank, orgType, keyword) {
	var i = 0;
	var score = 0;

	for (i=rank+1; i<this.cards.length; ++i) {
		if (this.cards[i] && gs.getCardTitle(this.cards[i]).toLowerCase() === orgType) {
			if (!keyword || gs.cardHasKeyword(this.cards[i], keyword)) {
				score += 1;
			}
		}

		if (this.cards[i]) {
			score += 1;
		}
	}

	return score;
}

bd.niche.prototype.getOrganismRank = function(orgType, keyword) {
	var iRank = -1;
	var i = 0;

	orgType = orgType.toLowerCase();
	keyword = keyword ? keyword.toLowerCase() : null;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i] && gs.getCardTitle(this.cards[i]).toLowerCase() === orgType) {
			if (!keyword || gs.getCardKeywords(this.cards[i]).toLowerCase().indexOf(keyword) >= 0) {
				iRank = i;
				break;
			}
		}
	}

	return iRank;
}

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

	if (this.cards[0]) {
		rank += gs.getCardValue(this.cards[0]);
	}

	if (rank < gs.WILD_CARD_VALUE) {
		suit = gs.getCardSuitFromValue(rank);
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

bd.niche.prototype.getCurrentPopulationCount = function() {
	var i = 0;
	var count = 0;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			++count;
		}
	}

	return count;
};

bd.niche.prototype.reset = function() {
	var i = 0;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			gs.eraseCard(this.cards[i]);
		}

		this.cards[i] = null;
	}
};

bd.niche.prototype.getMaxPopulationCount = function() {
	// Return the largest possible count. Most games will fall
	// short of this, because insects and nematodes reduce the
	// population count of their niches from 4 to 3. The
	// overestimate is preferable because any other approximation
	// would cause the 'max progress' metric to either fluctuate
	// or overflow.
	return this.MAX_RANK + 1;
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
	var wantRank = gs.isCardPlantInsectOrNematode(card) ? 0 : gs.getCardValue(card);

	// If the base card in this niche is an insect or nematode, the niche will support
	// only 3 cards total.
	var maxRank = this.cards.length - 1 - (this.cards[0] ? gs.getCardValue(this.cards[0]) : 0);

	if (gs.isCardWild(card)) {
		maxRank = gs.WILD_CARD_VALUE - 1;
		for (i=1; i<=maxRank; ++i) {
			wantRank = i;

			if (this.cards[0]) {
				wantRank -= gs.getCardValue(this.cards[0]);
			}

			newRank = this.isRankOpenAndSupported(card, wantRank);

			if (newRank >= 0) {
				break;
			}
		}
	}
	else {
		if (this.cards[0]) {
			wantRank -= gs.getCardValue(this.cards[0]);
		}
		newRank = this.isRankOpenAndSupported(card, wantRank);
	}

	return newRank;
};

bd.niche.prototype.isRankOpenAndSupported = function(card, iRank) {
	var checkedCards = [];
	var newRank = -1;

	if (this.cards[iRank]) {
		newRank = this.ERR_INVALID_PLACEMENT;
	}
	else {
		if (this.isCardSupported(card, checkedCards, iRank)) {
			newRank = iRank;
		}
	}

	return newRank;
};

bd.niche.prototype.canHoldCard = function(card) {
	return this.getRankForNewCard(card) >= 0;
};

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

bd.niche.prototype.recordPopulations = function(record) {
	var i = 0;
	var title = null;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			title = gs.getCardTitle(this.cards[i]);

			if (title) {
				title = title.toLowerCase();

				if (record.hasOwnProperty(title)) {
					record[title] += 1;
				}
			}
		}
	}

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

bd.niche.prototype.hideCardHint = function() {
	this.text.visible = false;
};

bd.niche.prototype.isProtected = function(card) {
	var otherNiche = null;
	var otherCard = null;
	var bProtected = false;

	assert(card, "isProtected: invalid card!");

	if (gs.cardTitleIs(card, 'plantae')) {
		otherNiche = this.prev();
		otherCard = otherNiche ? otherNiche.cardAtRank(this.getRankForCard(card)) : null;

		bProtected = otherCard && gs.cardTitleIs(otherCard, 'insecta');
	}

	return bProtected;
};

bd.niche.prototype.tagCardsOfTypeForDestruction = function(organism, keyword, cardsDestroyed) {
	var i = 0;

	organism = organism.toLowerCase();

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			if (gs.getCardTitle(this.cards[i]).toLowerCase() === organism) {
				if (!keyword || gs.getCardKeywords(this.cards[i]).toLowerCase().indexOf(keyword) >= 0) {
					if (!this.isProtected(this.cards[i])) {
						cardsDestroyed.push(this.cards[i]);
					}
				}
			}
		}
	}
};

bd.niche.prototype.tagCardsForDisplacement = function(cardsDisplaced) {
	var i = 0;
	var checkedCards = [];
	var coCard = null;

	for (i=0; i<this.cards.length; ++i) {
		checkedCards.length = 0;
		if (this.cards[i]) {
			if (this.isCardSupported(this.cards[i], checkedCards)) {
				coCard = gs.getCardCoCard(this.cards[i]);
				if (coCard && gs.cardHasKeyword(coCard, "angiosperm")) {
					assert(i === 1, "tagCardsForDisplacement: found angiosperm coCard outside rank 1!");
					assert(this.cards[0] === null, "tagCardsForDisplacement: angiosperm replacement blocked!");

					gs.setCardCoCard(this.cards[i], null);

					gs.populateNiche(coCard, this);
					broadcast("angiospermRepopulated", coCard);
				}
			}
			else {
				cardsDisplaced.push(this.cards[i]);
			}
		}
	}
};

bd.niche.prototype.displaceCard = function(card) {
	this.removeCard(this.cards[i], false);
};

bd.niche.prototype.removeCard = function(card, bDestroyed) {
	var rank = -1;

	// TODO: create particle effect at this location.

	assert(card, "removeCard: invalid card!");

	// var linkedCards = null;
	// linkedCards = gs.getCardLinkedCards(card);

	// if (gs.cardBreakLink(linkedCards.left, 'right')) {
	// 	gs.unlinkLeft(card);
	// }
	// if (gs.cardBreakLink(linkedCards.above, 'below')) {
	// 	gs.unlinkAbove(card);
	// }
	// if (gs.cardBreakLink(linkedCards.right, 'left')) {
	// 	gs.unlinkRight(card);
	// }
	// if (gs.cardBreakLink(linkedCards.below, 'above')) {
	// 	gs.unlinkBelow(card);
	// }

	gs.unlogCard(card);

	if (bDestroyed) {
		gs.onCardDestroyed(card);
		broadcast("cardDestroyed", card);
	}
	else {
		gs.onCardDisplaced(card);
		broadcast("cardDisplaced", card);
	}

	gs.eraseCard(card);
	gs.cardResetSuitAndValue(card);

	rank = this.getRankForCard(card);
	this.cards[rank] = null;

	gs.setCardNiche(card, null);
};

bd.niche.prototype.addToCardLog = function(logOut) {
	var i = 0;

	for (i=0; i<this.cards.length; ++i) {
		if (this.cards[i]) {
			logOut.push(this.cards[i].id + '~' + this.getBiomeId() + '~' + this.getId());
		}
	}
};

bd.niche.prototype.isCardSupported = function(card, checkedCards, rank) {
	var bSupported = false;
	var supportCard = null;
	var supportNiche = null;

	if (typeof(rank) === 'undefined') {
		rank = this.getRankForCard(card);
	}

	checkedCards.push(card);

	bSupported = rank === 0;

	if (!bSupported) {
		// Check for support from above.
		supportCard = this.cardAtRank(rank - 1);
		if (supportCard && checkedCards.indexOf(supportCard) < 0) {
			bSupported = this.isCardSupported(supportCard, checkedCards);
		}
	}

	if (!bSupported) {
		// Check for lateral support from symbiotes.
		if (gs.cardHasKeyword(card, 'symbiote')) {
			// If this card is a symbiote, it could be supported by
			// the card to its left.
			supportNiche = this.prev();
			if (supportNiche) {
				supportCard = supportNiche.cardAtRank(rank);
				if (supportCard && checkedCards.indexOf(supportCard) < 0) {
					bSupported = supportNiche.isCardSupported(supportCard, checkedCards);
				}
			}
		}

		if (!bSupported) {
			// All cards can be supported by symbiotes to the right.
			supportNiche = this.next();
			if (supportNiche) {
				supportCard = supportNiche.cardAtRank(rank);
				if (supportCard && gs.cardHasKeyword(supportCard, 'symbiote') && checkedCards.indexOf(supportCard) < 0) {
					bSupported = supportNiche.isCardSupported(supportCard, checkedCards);
				}
			}
		}
	}

	return bSupported;
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
	// linkedCards = gs.getCardLinkedCards(card);
	// assert(linkedCards, "niche.addCard: invalid linkedCards!");

	// if (newRank > 0) {
	// 	neighbor = this.cards[newRank - 1];

	// 	if (neighbor && gs.cardHasLink(neighbor, 'below')) {
	// 		gs.linkBelow(neighbor, gs.getCardNiche(neighbor), true);
	// 	}
	// }

	// neighborNiche = this.prev(this);
	// neighbor = neighborNiche ? neighborNiche.cardAtRank(newRank) : null;
	// if (neighbor && gs.cardHasLink(neighbor, 'right')) {
	// 	gs.linkRight(neighbor, neighborNiche, true);
	// }

	// neighborNiche = this.next(this);
	// neighbor = neighborNiche ? neighborNiche.cardAtRank(newRank) : null;
	// if (neighbor && gs.cardHasLink(neighbor, 'left')) {
	// 	gs.linkLeft(neighbor, neighborNiche, true);
	// }
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
