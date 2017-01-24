/**
 * Helper functions for managing user interface.
 */

 uim = {
 	FRAME_MARGIN: {X: 7, Y: 7},
 	TITLE_SIZE: 24,
 	VALUE_SIZE: 24,
 	KEYWORD_SIZE: 18,
 	BANNER_WIDTH_FACTOR: 25,
 	VALUE_WIDTH_NUM: 23,
 	VALUE_WIDTH_DENOM: 25,
 	KEYWORDS_NUM: 2,
 	KEYWORDS_DENOM: 5,
 	SPECIAL_HEIGHT_NUM: 2,
 	SPECIAL_HEIGHT_DENOM: 3,
 	TWEEN_TIME: 333,
 	EVENT_TWEEN_TIME: 999,
 	NUM_BANNERS: 5,
 	BANNER_MARGIN: 120,
 	BANNER_SPACING: 27,
 	SLIDE_IN_DELAY: 50,
 	FRAME_BOTTOM_MARGIN: {X: 8, Y: 304},
 	INFO_TEXT_SIZE: 20,
 	INFO_TEXT_SPACING: 4,
 	HINT_TEXT_SIZE: 32,
 	MAX_CURSORS: 7 + 6 * 2 + 5 * 2, // <-- All possible biome spaces (actually, more than the possible number).
 	WIGGLE_FACTOR: 3,
 	HINT_WIDTH: 12,
 	EVENT_MARGIN: 14,

	group: null,
	buttonGroup: null,
	frameRight: null,
	frameTop: null,
	groupBottomFrame: null,
	infoText: {currentLine: -1, lines:[]},
	banners: [],
	cursors: [],
	showingCards: [],
	cursorGroup: null,
	hint: {group: null, sprite: null, text: null},
	eventMarker: null,

 	focusWidget: null,

 	createHints: function() {
 		this.hint.group = game.add.group();
 		this.hint.sprite = this.hint.group.create(0, Math.round(TILE_SIZE / 3), 'ui_specials');
 		this.hint.sprite.animations.add('point', [1], 1, false);
 		this.hint.sprite.animations.play('point');
 		this.hint.sprite.scale.x = gs.SPRITE_SCALE;
 		this.hint.sprite.scale.y = gs.SPRITE_SCALE;
 		this.hint.sprite.visible = false;

 		this.hint.text = game.add.bitmapText(0, uim.HINT_TEXT_SIZE / 2, 'bogboo', '', uim.HINT_TEXT_SIZE);
 		this.hint.text.visible = false;
 		this.hint.group.addChild(this.hint.text);
 	},

 	leftHintCenter: function() {
 		return Math.round(this.HINT_WIDTH * TILE_SIZE * gs.SPRITE_SCALE / 2);
 	},

 	rightHintCenter: function() {
 		return Math.round(this.HINT_WIDTH * TILE_SIZE * gs.SPRITE_SCALE + (game.width - this.HINT_WIDTH * TILE_SIZE * gs.SPRITE_SCALE) / 2);
 	},

 	setLeftHint: function(message) {
 		this.hint.text.text = message;

 		this.hint.sprite.x = this.hint.text.width;
 		this.hint.group.x = Math.round(this.leftHintCenter() - (this.hint.text.width / 2 + TILE_SIZE * gs.SPRITE_SCALE / 2));

 		this.hint.text.visible = true;
 		this.hint.sprite.visible = true;
 	},

 	setRightHint: function(message) {
 		this.hint.text.text = message;

 		this.hint.sprite.x = this.hint.text.width;
 		this.hint.group.x = Math.round(this.rightHintCenter() - (this.hint.text.width / 2 + TILE_SIZE * gs.SPRITE_SCALE / 2));

 		this.hint.text.visible = true;
 		this.hint.sprite.visible = true;
 	},

 	hideHint: function() {
 		this.hint.text.visible = false;
 		this.hint.sprite.visible = false;
 	},

 	createCursors: function() {
 		var i = 0;
 		var sprite = null;

 		this.cursorGroup = game.add.group();

 		for (i=0; i<this.MAX_CURSORS; ++i) {
 			sprite = this.cursorGroup.create(0, 0, 'cursor');
 			sprite.animations.add('pulse', [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], 10, true);
 			sprite.scale.setTo(gs.SPRITE_SCALE, gs.SPRITE_SCALE);
 			sprite.kill();
 		}
 	},

 	createEvents: function() {
 		this.eventMarker = this.group.create(0, 0, 'eventMarker');
 		this.eventMarker.x = 0;
 		this.eventMarker.y = -this.eventMarker.height;
 		this.eventMarker.anchor.setTo(0, 0);
 		this.eventMarker.visible = false;
 		this.eventMarker.data = {};
 		this.eventMarker.data.tweenOut = game.add.tween(this.group).to({x: 0, y: -this.eventMarker.height }, uim.EVENT_TWEEN_TIME, Phaser.Easing.Cubic.In, false);
 		this.eventMarker.data.tweenIn = game.add.tween(this.group).to({x: 0, y: game.height}, uim.EVENT_TWEEN_TIME, Phaser.Easing.Cubic.Out, false);
 		this.eventMarker.data.tweenToBiome = game.add.tween(this.group).to({x: 0, y:0}, uim.EVENT_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);

 		this.eventMarker.data.tweenOut.onComplete.add(this.onEventOff, this);
 		this.eventMarker.data.tweenIn.onComplete.add(this.onEventIn, this);
 		this.eventMarker.data.tweenToBiome.onComplete.add(this.onEventArrived, this);
 	},

 	showEvent: function(biome) {
 		var x = this.EVENT_MARGIN * TILE_SIZE + this.eventMarker.width + TILE_SIZE * gs.SPRITE_SCALE / 2;
 		var y = biome.getY();
 		var dt = Math.abs(y - game.height) / game.height * uim.EVENT_TWEEN_TIME;

 		this.eventMarker.x = x;
 		this.eventMarker.y = -this.eventMarker.height;

 		this.eventMarker.data.tweenToBiome.updateTweenData('vEnd', {x: x - this.eventMarker.x, y: y - this.eventMarker.y});
 		this.eventMarker.data.tweenIn.start();
 		this.eventMarker.visible = true;
 	},

 	onEventOff: function() {

 	},

 	onEventIn: function() {
 		this.eventMarker.data.tweenToBiome.start();
 	},

 	onEventArrived: function() {
 		// TODO: apply event.
 		broadcast('eventArrived');
 	},

 	worldToUiX: function(x) {
 		return Math.round(x * gs.SPRITE_SCALE - gs.getOffsetX() + 2 * TILE_SIZE * gs.SPRITE_SCALE - 5);
 	},

 	worldToUiY: function(y) {
 		return Math.round(y * gs.SPRITE_SCALE - gs.getOffsetY() - TILE_SIZE * 0.6 * gs.SPRITE_SCALE);
 	},

 	UiToWorldX: function(x) {
 		return Math.round((x + gs.getOffsetX() - 2 * TILE_SIZE * gs.SPRITE_SCALE + 5) / gs.SPRITE_SCALE);
 	},

 	UiToWorldY: function(y) {
 		return Math.round((y + gs.getOffsetY() + TILE_SIZE * 0.6 * gs.SPRITE_SCALE) / gs.SPRITE_SCALE);
 	},

 	setCursor: function(x, y, card) {
 		var cursor = this.cursorGroup.getFirstDead();

 		assert(cursor, "setCursor: no available cursors!");

 		cursor.data = card;
 		cursor.x = uim.worldToUiX(x);
 		cursor.y = uim.worldToUiY(y);
 		cursor.revive();
 		cursor.animations.play('pulse');
 	},

 	clearAllCursors: function() {
 		var cursor = this.cursorGroup.getFirstAlive();

 		while (cursor) {
 			cursor.animations.stop();
 			cursor.kill();
 			cursor = this.cursorGroup.getFirstAlive();
 		}
 	},

 	positionRelative: function(parent, child, localX, localY) {
 		if (parent && child) {
 			child.x = parent.x + localX;
 			child.y = parent.y + localY;
 		}
 	},

 	onInputUp: function(gameObject, pointer, bStillOver) {
 		var bHandled = false;

 		if (this.focusWidget) {
 			// this.focusWidget.release();
 			bHandled = true;
 		}

 		return bHandled;
 	},

 	setBannerInfo: function(index, title, value, keywords, special, data) {
 		if (index >= 0 && index < this.banners.length) {
 			this.banners[index].setTitle(title);
 			this.banners[index].setValue(value);
 			this.banners[index].setKeywords(keywords);
 			this.banners[index].setSpecial(special);
 			this.banners[index].setData(data);
 		}
 	},

 	getShowingCards: function() {
 		var i = 0;

 		this.showingCards.length = 0;

 		for (i=0; i<this.banners.length; ++i) {
 			if (!this.banners[i].isMovedOut()) {
 				this.showingCards.push(this.banners[i].data);
 			}
 		}

 		return this.showingCards;
 	},

 	setFocusBannerInfo: function(title, value, keywords, special, data) {
 		var banner = null;

 		if (this.focusWidget && uim.focusWidget instanceof uim.button) {
 			banner = uim.focusWidget.banner;

 			banner.setTitle(title);
 			banner.setValue(value);
 			banner.setKeywords(keywords);
 			banner.setSpecial(special);
 			banner.setData(data);
 		}
 	},

	syncBannersToCards: function() {
		// TODO: generalize this for any deck (not just a freshly-initialized one).
		var i = 0;

		if (gs.drawDeck.length >= this.banners.length) {
			for (i=0; i<this.banners.length; ++i) {
				this.setBannerInfo(i,
								   gs.getDrawDeckType(i),
								   gs.getDrawDeckSuit(i),
								   gs.getDrawDeckKeywords(i),
								   gs.getDrawDeckSpecial(i),
								   gs.getDrawDeckCard(i));
			}
		}
	},

 	moveBannersOut: function() {
		var i = 0;
		var fn = null;

		for (i=0; i<this.banners.length; ++i) {
			if (this.banners[i].data) {
				fn = function(index) { return function() { uim.moveBannerOut(index); } };
				setTimeout(fn(i), uim.SLIDE_IN_DELAY * i);
			}
		}
	},

 	moveBannersIn: function() {
		var i = 0;
		var fn = null;

		for (i=0; i<this.banners.length; ++i) {
			fn = function(index) { return function() { uim.moveBannerIn(index); } };
			setTimeout(fn(i), uim.SLIDE_IN_DELAY * i);
		}
	},

 	hideFocusBanner: function() {
		var i = 0;
		var fn = null;

		if (this.focusWidget instanceof uim.button) {
			uim.moveBannerOut(this.banners.indexOf(this.focusWidget.banner));
		}
	},

 	showFocusBanner: function() {
		var i = 0;
		var fn = null;

		if (this.focusWidget instanceof uim.button) {
			uim.moveBannerIn(this.banners.indexOf(this.focusWidget.banner));
		}
	},

 	wiggleFocusBanner: function() {
		var i = 0;
		var fn = null;

		if (this.focusWidget instanceof uim.button) {
			uim.wiggleBanner(this.banners.indexOf(this.focusWidget.banner));
		}
	},

 	wiggleBanners: function() {
		var i = 0;
		var fn = null;

		for (i=0; i<this.banners.length; ++i) {
			if (this.banners[i].data) {
				fn = function(index) { return function() { uim.wiggleBanner(index); } };
				setTimeout(fn(i), uim.SLIDE_IN_DELAY * i);
			}
		}
	},

 	enableBannerInput: function() {
 		var i = 0;

 		for (i=0; i<this.banners.length; ++i) {
 			this.banners[i].enableInput();
 		}
 	},

 	disableBannerInput: function() {
 		var i = 0;

 		for (i=0; i<this.banners.length; ++i) {
 			this.banners[i].disableInput();
 		}
 	},

 	moveBannerOut: function(bannerIndex) {
 		if (bannerIndex >= 0 && bannerIndex < this.banners.length) {
 			this.banners[bannerIndex].moveOut();
 		}
 	},

 	moveBannerIn: function(bannerIndex) {
 		if (bannerIndex >= 0 && bannerIndex < this.banners.length) {
 			this.banners[bannerIndex].moveIn();
 		}
 	},

 	wiggleBanner: function(bannerIndex) {
 		if (bannerIndex >= 0 && bannerIndex < this.banners.length) {
 			this.banners[bannerIndex].wiggle();
 		}
 	},

 	// The 'button' object assumes a two-state button, where the images for the
 	// 'up' state is on one spritesheet, and the images for the 'down' state is
 	// on another. It also assumes that the index for the 'up' and 'down' images
 	// are the same on their respective sprite sheets.
 	button: function(group, spriteSheetUp, spriteSheetDown, x, y, onPressedCallback, buttonStates, data) {
 		var key = null;

		this.x = x;
		this.y = y;
		this.type = 'amphibia';
		this.banner = null;
		this.state = '';

 		if (group && spriteSheetUp && spriteSheetDown) {
 			// Call 'getGroup' to ensure ui group exists.
 			this.group = game.add.group();
 			this.group.x = x;
 			this.group.y = y;
 			group.add(this.group);

 			this.sprOff = group.create(0, spriteSheetUp.height / 2, spriteSheetUp);

 			// Add all possible 'off' states.
 			for (key in buttonStates) {
 				this.sprOff.animations.add(key + 'Off', [buttonStates[key]], 1, false);
 			}

 			this.sprOff.anchor.setTo(0.0, 0.5);
 			this.sprOff.revive(0, this.sprOff.height / 2);
 			this.sprOff.inputEnabled = false;
 			this.sprOff.events.onInputDown.add(this.press, this);
 			this.group.add(this.sprOff);

	 		this.sprOn = group.create(0, spriteSheetDown.height / 2, spriteSheetDown);
 			this.sprOn.anchor.setTo(0.0, 0.5);

 			// Add all possible 'on' states.
 			for (key in buttonStates) {
 				this.sprOn.animations.add(key + 'On', [buttonStates[key]], 1, false);
 			}

	 		this.sprOn.kill();
	 		this.group.add(this.sprOn);

	 		this.data = data;
	 		this.onPressedCallback = onPressedCallback;

	 		// Set default appearance.
	 		this.setState(this.type);
	 	}
	 	else {
	 		assert(false, "Button create failed!");
	 	}
 	},

 	banner: function(button, title, value, keywords, special, specialStates, data) {
 		var key = null;

 		if (button && title !== null) {
	 		this.button 	= button;
	 		this.button.setState(title);
	 		this.button.setBanner(this);
	 		this.data = data;

	 		this.title  	= game.add.bitmapText(this.button.width(), this.button.height() / 2, 'bogboo', title, uim.TITLE_SIZE);
	 		this.title.anchor.setTo(0.0, 1.0);

	 		this.value  	= game.add.bitmapText(-15, 15, 'bogboo', "" + value, uim.VALUE_SIZE);
	 		this.value.anchor.setTo(0.0, 1.0);

	 		this.keywords  	= game.add.bitmapText(this.button.width(), this.button.height(), 'bogboo', keywords, uim.KEYWORD_SIZE);
	 		this.keywords.anchor.setTo(0.0, 1.0);

	 		this.button.group.addChild(this.title);
	 		this.title.x = this.button.sprOn.width / uim.BANNER_WIDTH_FACTOR;
	 		this.title.y = 0;

	 		this.button.group.addChild(this.value);
	 		this.value.x += uim.VALUE_WIDTH_NUM * this.button.sprOn.width / uim.VALUE_WIDTH_DENOM;
	 		this.value.y = 0;

	 		this.button.group.addChild(this.keywords);
	 		this.keywords.x = this.button.sprOn.width / uim.BANNER_WIDTH_FACTOR;
	 		this.keywords.y = this.keywords.height * (1 + uim.KEYWORDS_NUM / uim.KEYWORDS_DENOM);

 			this.special = this.button.group.create(0, 0, 'ui_specials');
 			this.special.visible = false;
 			this.special.anchor.setTo(0.5, 0.5);
 			this.special.x = this.value.x - this.value.width / 2;
 			this.special.y += uim.SPECIAL_HEIGHT_NUM * this.special.height / uim.SPECIAL_HEIGHT_DENOM;

			for (key in specialStates) { 			
	 			this.special.animations.add(key, [specialStates[key]], 1, false);
	 		}

	 		this.tweenOut = game.add.tween(this.button.group).to({x: -this.button.width() }, uim.TWEEN_TIME, Phaser.Easing.Cubic.Out, false);
	 		this.tweenIn = game.add.tween(this.button.group).to({x: TILE_SIZE * gs.SPRITE_SCALE}, uim.TWEEN_TIME, Phaser.Easing.Cubic.Out, false);

	 		this.tweenWiggle = game.add.tween(this.button.group).to({x: (-this.button.width() + TILE_SIZE * gs.SPRITE_SCALE) / uim.WIGGLE_FACTOR}, uim.TWEEN_TIME / uim.WIGGLE_FACTOR, Phaser.Easing.Cubic.Out, false);
	 		this.tweenWiggle.chain(game.add.tween(this.button.group).to({x: TILE_SIZE * gs.SPRITE_SCALE}, uim.TWEEN_TIME / uim.WIGGLE_FACTOR, Phaser.Easing.Cubic.Out, false));

	 		uim.banners.push(this);

 			this.setMoveOutCallback(uim.onUIopComplete.bind(uim));
 			this.setMoveInCallback(uim.onUIopComplete.bind(uim));
 			this.setWiggleCallback(uim.onUIopComplete.bind(uim));
	 	}
 	},

 	startOperation: function(opName) {
 		var bDoOperation = true;

 		switch(opName) {
 			case 'moveBannersOut':
 				this.uiOpCounter = this.getNumBannersWithData();
 			break;

 			case 'moveBannersIn': case 'wiggleBanners':
 				this.uiOpCounter = this.getNumBannersWithData();
 			break;

 			case 'hideFocusBanner': case 'showFocusBanner':
 				this.uiOpCounter = 1;
 				bDoOperation = this.focusWidget;
 			break;

 			case 'wiggleFocusBanner':
 				this.uiOpCounter = 1;
 				bDoOperation = this.focusWidget && this.focusWidget.banner;
 			break;

 			default:
 				bDoOperation = false;
 			break;
 		}

 		if(this.uiOpCounter === 0) {
 			bDoOperation = false;
 		}

 		if (bDoOperation && this.hasOwnProperty(opName)) {
 			this[opName]();
 		}
 		else {
 			broadcast('UIoperationComplete');
 		}
 	},

 	onUIopComplete: function() {
 		this.uiOpCounter -= 1;
 		if (this.uiOpCounter <= 0) {
 			broadcast('UIoperationComplete');
 		}
 	},

 	init: function() {
		this.group = game.add.group();
		this.buttonGroup = game.add.group();

		this.createEvents();
 	},

 	getButtonGroup: function() {
 		return this.buttonGroup;
 	},

 	addBlocker: function(x, y, sprName) {
 		assert(uim.group, "uim.addBlocker: undefined group!");
 		assert(sprName, "uim.addBlocker: invalid sprite identifier!");

 		return uim.group.create(x, y, sprName);
 	},

 	getNumBanners: function() {
 		return uim.banners.length;
 	},

 	getNumBannersWithData: function() {
 		var i = 0;
 		var nBanners = 0;

 		for (i=0; i<uim.banners.length; ++i) {
 			if (uim.banners[i] && uim.banners[i].data) {
 				++nBanners;
 			}
 		}

 		return nBanners;
 	},

 	getGroup: function() {
 		if (!this.group) {
 			this.group = game.add.group();
 		}

 		return this.group;
 	},

 	enableInput: function() {
		gs.layers.grid.inputEnabled = true;
		gs.layers.grid.events.onInputDown.add(onWorldPressCallback, this);
 	},

 	hasFocusCard: function() {
 		return uim.focusWidget instanceof uim.button && uim.focusWidget.banner && uim.focusWidget.banner.data;
 	},

 	getFocusCard: function() {
 		return uim.focusWidget instanceof uim.button ? uim.focusWidget.banner.data : null;
 	},

 	clearFocusBanner: function() {
 		if (this.focusWidget instanceof uim.button && uim.focusWidget.banner) {
 			this.focusWidget.release();
 			this.focusWidget = null;
 		}
 	},

 	createInfoArea: function() {
 		var nLines = 0;
 		var i = 0;
 		var x = 0;
 		var y = 0;
 		var bmpTxt = null;

 		this.groupBottomFrame = game.add.group();
 		this.groupBottomFrame.x = uim.frameTop.x + uim.FRAME_BOTTOM_MARGIN.X;
 		this.groupBottomFrame.y = uim.frameTop.y + uim.FRAME_BOTTOM_MARGIN.Y;

 		nLines = this.frameTop.height / (uim.INFO_TEXT_SIZE + uim.INFO_TEXT_SIZE);

 		x = uim.FRAME_BOTTOM_MARGIN.X + TILE_SIZE;
 		for (i=0; i<nLines; ++i) {
 			y = uim.FRAME_BOTTOM_MARGIN.Y + i * (uim.INFO_TEXT_SIZE + uim.INFO_TEXT_SPACING) + gs.getOffsetY();
 			bmpText = game.add.bitmapText(x, y, 'bogboo', '', uim.INFO_TEXT_SIZE);
 			this.groupBottomFrame.add(bmpText);
 			this.infoText.lines.push(bmpText);
 		}
 	},

 	clearInfoText: function() {
 		var i = 0;

 		for (i=0; i<this.infoText.lines.length; ++i) {
 			this.infoText.lines[i].text = '';
 		}

 		this.infoText.currentLine = -1;
 	},

 	addInfoText: function(newLine) {
 		if (newLine && this.infoText.currentLine < this.infoText.lines.length - 1) {
 			this.infoText.currentLine += 1;
 			this.infoText.lines[this.infoText.currentLine].text = newLine;
 			if (newLine.indexOf('\n') >= 0) {
 				this.infoText.currentLine += 1;
 			}
 		}
 	},
 }

// uim.banner /////////////////////////////////////////////////////////////////
uim.banner.prototype.showKeywordInfo = function() {
	var keyword = null;
	var text = null;
	var i = 0;

	uim.clearInfoText();

	for (keyword = gs.getFirstKeywordForCard(this.data); keyword != null; keyword = gs.getNextKeywordForCard(this.data)) {
		text = gs.getTextForKeyword(gs.getCardTitle(this.data), keyword);

		if (text instanceof Array) {
			for (i=0; i<text.length; ++i) {
				uim.addInfoText(text[i]);
			}
		}
		else {
			uim.addInfoText(text);
		}
	}
},

uim.banner.prototype.enableInput = function() {
	this.button.enableInput();
},

uim.banner.prototype.disableInput = function() {
	this.button.disableInput();
},

uim.banner.prototype.setTitle = function(newTitle) {
	this.title.text = newTitle;
	this.button.setState(newTitle);
},

uim.banner.prototype.setValue = function(newValue) {
	this.value.text = newValue;
},

uim.banner.prototype.setKeywords = function(newKeywords) {
	this.keywords.text = newKeywords;
	 this.keywords.y = this.keywords.height * (1 + uim.KEYWORDS_NUM / uim.KEYWORDS_DENOM);
},

uim.banner.prototype.setSpecial = function(newSpecial) {
	if (newSpecial) {
		this.special.animations.play(newSpecial.toLowerCase());
		this.special.visible = true;
	}
	else {
	 	this.special.visible = false;
	}
},

uim.banner.prototype.setData = function(newData) {
	this.data = newData;
},

uim.banner.prototype.getData = function() {
	return this.data;
},

uim.banner.prototype.setMoveOutCallback = function(newCallback) {
	this.tweenOut.onComplete.removeAll();

	if (newCallback) {
		this.tweenOut.onComplete.add(newCallback, this);
	}
}

uim.banner.prototype.setMoveInCallback = function(newCallback) {
	this.tweenIn.onComplete.removeAll();

	if (newCallback) {
		this.tweenIn.onComplete.add(newCallback, this);
	}
}

uim.banner.prototype.setWiggleCallback = function(newCallback) {
	this.tweenWiggle.chainedTween.onComplete.removeAll();

	if (newCallback) {
		this.tweenWiggle.chainedTween.onComplete.add(newCallback, this);
	}
}

uim.banner.prototype.isMovedOut = function() {
	var bMovedOut = false;

	bMovedOut = this.x > game.width + this.button.width() * 0.5;

	return bMovedOut;
}

uim.banner.prototype.moveOut = function() {
	this.tweenOut.start();
}

uim.banner.prototype.moveIn = function() {
	this.tweenIn.start();
}

uim.banner.prototype.wiggle = function() {
	this.tweenWiggle.start();
}

// uim.button /////////////////////////////////////////////////////////////////
uim.button.prototype.enableInput = function() {
	this.sprOff.inputEnabled = true;
}

uim.button.prototype.disableInput = function() {
	this.sprOff.inputEnabled = false;
}

uim.button.prototype.setState = function(state) {
	if (state) {
		state = state.toLowerCase();

		this.state = state;
		this.sprOff.animations.play(state + "Off");
		this.sprOn.animations.play(state + "On");
	}
}

uim.button.prototype.setBanner = function(banner) {
	this.banner = banner;
}

uim.button.prototype.width = function() {
	return this.sprOff.width;
}

uim.button.prototype.height = function() {
	return this.sprOff.height;
}

uim.button.prototype.press = function() {
	this.sprOff.kill();
	this.sprOn.revive(0, this.sprOn.height / 2);
	this.sprOn.animations.play(this.state + 'On');

	if (uim.focusWidget) {
		uim.focusWidget.release();
		uim.focusWidget = null;
	}

	if (this.onPressedCallback) {
		this.onPressedCallback(this);
		uim.focusWidget = this;
	}
}

uim.button.prototype.release = function() {
	this.sprOn.kill();
	this.sprOff.revive(0, this.sprOff.height / 2);
	this.sprOff.animations.play(this.state + 'Off');

	if (this === uim.focusWidget) {
		uim.focusWidget = null;
	}
}