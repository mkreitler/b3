// ----------------------------------------------------------------------------
// Niche
// ----------------------------------------------------------------------------
bd.niche = function(topRow, leftCol) {
	this.cards = [];
	this.topRow = topRow;
	this.leftCol = leftCol;
	this.text = game.add.bitmapText(this.leftCol * TILE_SIZE, this.topRow * TILE_SIZE, 'bogboo', uim.INFO_TEXT_SIZE * gs.SPRITE_SCALE);
	this.text.anchor.setTo(0.5, 0.5);
	this.text.visible = false;
	this.biome = null;
	this.bAddedDuringPlay = false;
};

bd.niche.prototype.setAddedDuringPlay = function() {
	this.bAddedDuringPlay = true;
};

bd.niche.prototype.wasAddedDuringPlay = function() {
	return this.bAddedDuringPlay;
};

bd.niche.prototype.getLastCardValue = function() {
	return this.cards && this.cards.length > 0 ? this.cards[this.cards.length - 1].value : -1;
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

bd.niche.prototype.getNumberOfCards = function() {
	return this.cards ? this.cards.length : 0;
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

	return rank;
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

bd.niche.prototype.getTopRow = function() {
	return this.topRow;
};

bd.niche.prototype.getLeftCol = function() {
	return this.leftCol;
};

bd.niche.prototype.getLastCard = function() {
	return this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
};

bd.niche.prototype.showNextCardHint = function() {
	var nCards = this.cards.length;
	var cardVal = this.getLastCardValue() + 1;
	var x = (this.leftCol + 0.5) * TILE_SIZE;
	var y = (this.topRow + 0.5 + nCards) * TILE_SIZE;

	if (cardVal > 0 && cardVal < gs.WILD_CARD_VALUE) {
		this.text.x = Math.floor(uim.worldToUiX(x));
		this.text.y = Math.floor(uim.worldToUiY(y));
		this.text.text = gs.getCardSuit(cardVal, this.getLastCard().title);
		this.text.visible = true;
	}
	else {
		this.text.visible = false;
	}
};

bd.niche.prototype.addCard = function(card) {
	var linkedCards = null;
	var neighbor = null;
	var neighborNiche = null;

	gs.setCardNiche(card, this);
	this.cards.push(card);

	this.text.visible = false;

	gs.executeCardSpecialFunction(card, 'onPlayed');

	// Check for back-links.
	linkedCards = gs.getCardLinkedCards(card);
	assert(linkedCards, "niche.addCard: invalid linkedCards!");

	if (this.cards.length > 1) {
		neighbor = this.cards[this.cards.length - 2];
		assert(neighbor, "niche.addCard: invalid upper neighbor!");

		if (gs.cardHasLink(neighbor, 'below')) {
			gs.linkBelow(neighbor, gs.getCardNiche(neighbor), true);
		}
	}

	neighborNiche = this.prev(this);
	neighbor = neighborNiche ? neighborNiche.cardAtRank(this.cards.length - 1) : null;
	if (neighbor && gs.cardHasLink(neighbor, 'right')) {
		gs.linkRight(neighbor, neighborNiche, true);
	}

	neighborNiche = this.next(this);
	neighbor = neighborNiche ? neighborNiche.cardAtRank(this.cards.length - 1) : null;
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

bd.niche.prototype.canAddCard = function(card) {
	var bCanAddCard = false;

	assert(card, 'niche.addCard: invalid card!');

	if (gs.isCardPlantInsectOrNematode(card)) {
		if (this.cards.length === 0) {
			bCanAddCard = true;
		}
	}
	else if (this.cards.length > 0 && gs.cardsAreSequentialRank(this.cards[this.cards.length - 1], card)) {
		bCanAddCard = true;
	}

	return bCanAddCard;
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

bd.niche.prototype.getRank = function() {
	return this.cards.length > 0 ? this.cards[this.cards.length - 1].value : -1;
};
