/**
 * Helper functions for managing user interface.
 */

 uim = {
 	FRAME_MARGIN: {X: 7, Y: 7},
 	INFO_TITLE_SIZE: 24,
 	TITLE_SIZE: 33, // was 24
 	VALUE_SIZE: 33, // was 24
 	KEYWORD_SIZE: 19, // was 18
 	BANNER_WIDTH_FACTOR: 25,
 	VALUE_WIDTH_NUM: 19,
 	VALUE_WIDTH_DENOM: 20,
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
 	TOP_TITLE_SIZE: 60,
 	BOTTOM_TITLE_SIZE: 150,
 	INFO_TEXT_SIZE: 20,
 	INFO_TEXT_SPACING: 4,
 	HINT_TEXT_SIZE: 32,
 	MAX_CURSORS: 7 + 6 * 2 + 5 * 2, // <-- All possible biome spaces (actually, more than the possible number).
 	WIGGLE_FACTOR: 3,
 	HINT_WIDTH: 12,
 	EVENT_MARGIN: 14,
 	INFO_BORDER_SIZE: 10,
 	EVENT_EXPAND_TIME: 499,
 	EVENT_INFO_SCALE_SMALL: 0.00001,
 	EVENT_ALPHA_TIME: 333,
 	INFO_TWEEN_TIME: 499,
 	INFO_EXPAND_TIME: 333,
 	INFO_INFO_SCALE_SMALL: 0.00001,
 	INFO_ALPHA_TIME: 333,
 	MIN_OPERATION_DELAY: 100,
 	UI_BANNER_INDEX: 1,
 	GET_FROM_FUNCTION: -1,
 	NOOP: -99,
 	INFO_TEXT_MARGIN: 12,
 	VALUE_OFFSET_X: 24,
 	VALUE_OFFSET_Y: 18,
 	INFO_DLG_FUDGE_Y: 3,
 	TITLE_SCALAR: 0.8,
 	CLOSE_BUTTON_WIDTH: 44,
 	CLOSE_BUTTON_HEIGHT: 44,
 	RIGHT_PANEL_WIDTH: 590,

 	REPORT_COLORS: [0x0044AA, 0x445016, 0xAA8800, 0x4D4D4D],

	group: null,
	buttonGroup: null,
	infoGroup: null,
	choiceGroup: null,
	reportGroup: null,
	frameRight: null,
	frameTop: null,
	groupBottomFrame: null,
	titleGroup: null,
	infoText: {currentLine: -1, lines:[]},
	banners: [],
	cursors: [],
	showingCards: [],
	cursorGroup: null,
	hint: {group: null, sprite: null, text: null, wasText: null, bWasLeftHint: false},
	cardHintGroup: null,
	bInputBlocked: false,	// Filthy hack to make dialog box behave modally.
	lastOp: null,			// DEBUG: tracks last uiOperation executed.

	// Event dialog
	eventShield: null,
	eventInfo: null,
	eventMarker: null,
	eventTitle: null,
	eventText: null,
	eventPrompt: null,

	// Info dialog
	infoDlgMarker: null,
	infoDlgPanel: null,
	infoDlgShield: null,
	infoDlgTitle: null,
	infoDlgText: null,
	infoDlgPrompt: null,

	// Event report
	eventReport: null,
	beforeResults: {aves: 0, reptilia: 0, amphibia: 0, mammalia: 0},
	afterResults: {aves: 0, reptilia: 0, amphibia: 0, mammalia: 0},
	textBefore: {aves: null, reptilia: null, amphibia: null, mammalia: null},
	textAfter: {aves: null, reptilia: null, amphibia: null, mammalia: null},
	eventGfx: null,
	questionText: null,

	// Choice dialog
	choiceDialog: null,
	textTop: null,
	textBottom: null,
	topAction: null,
	bottomAction: null,

 	focusWidget: null,

 	raiseGroups: function() {
		gs.baseLayers.objects.bringToTop();
		gs.baseLayers.ui.bringToTop();
 		game.world.bringToTop(this.helperGroup);
 		game.world.bringToTop(this.buttonGroup);
		gs.baseLayers.walls.bringToTop();
 		game.world.bringToTop(this.group);
 		game.world.bringToTop(this.hint.group);
 		game.world.bringToTop(this.cardHintGroup);
 		game.world.bringToTop(this.infoGroup);
 		game.world.bringToTop(this.titleGroup);

 		// TODO: move to beneath titleGroup?
 		game.world.bringToTop(this.reportGroup);
 		game.world.bringToTop(this.choiceGroup);
 	},

 	closeEventReport: function() {
 		if (!this.choiceGroup.visible) {
			this.hideEventReport();
			gs.playSound(gs.sounds.dialogClose);
			broadcast("eventReportClosed");
		}
 	},

 	createChoiceDialog: function() {
 		var groupX = Math.round(((game.width - this.RIGHT_PANEL_WIDTH) + game.width) * 0.5);

 		this.choiceGroup = game.add.group();
 		this.choiceDialog = this.choiceGroup.create(groupX, game.height / 2, 'choiceDialog');
 		this.choiceDialog.anchor.set(0.5, 0.5);

 		this.textTop = game.add.bitmapText(0, 20, 'bogboo', 'Click here\nto quit', 2 * uim.INFO_TEXT_SIZE);
 		this.textTop.anchor.set(0.5, 0.5);
 		this.textTop.x = Math.round(0);
 		this.textTop.y = Math.round(-this.choiceDialog.height / 4);
 		this.textTop.align = "center";
 		this.choiceDialog.addChild(this.textTop);

 		this.textBottom = game.add.bitmapText(0, 20, 'bogboo', 'Click here\nto resume', 2 * uim.INFO_TEXT_SIZE);
 		this.textBottom.anchor.set(0.5, 0.5);
 		this.textBottom.x = Math.round(0);
 		this.textBottom.y = Math.round(this.choiceDialog.height / 4);
 		this.textBottom.align = "center";
 		this.choiceDialog.addChild(this.textBottom);

 		this.choiceDialog.events.onInputDown.add(this.onChoiceClicked.bind(this));
 		this.choiceDialog.inputEnabled = true;
 		this.choiceGroup.visible = false;
 	},

 	offerChoice: function(topChoice, topAction, bottomChoice, bottomAction) {
 		gs.playSound(gs.sounds.reportOpen);

 		this.textTop.text = topChoice;
 		this.topAction = topAction;

 		this.textBottom.text = bottomChoice;
 		this.bottomAction = bottomAction;

 		this.blockInput();
 		this.choiceGroup.visible = true;
 	},

 	onChoiceClicked: function(object, pointer) {
 		if (pointer.y < game.height / 2) {
 			if (this.topAction) {
 				this.topAction();
 			}
 		}
 		else {
 			if (this.bottomAction) {
 				this.bottomAction();
 			}
 		}

 		this.unblockInput();
 		this.choiceGroup.visible = false;
		gs.playSound(gs.sounds.dialogClose);
 	},

 	createEventReport: function() {
 		var key = null;
 		var i = 0;

 		gs.computePopulationsPerFamily();

 		this.reportGroup = game.add.group();
 		this.eventReport = this.reportGroup.create(game.width / 2, game.height / 2, 'eventResults');
 		this.eventReport.anchor.setTo(0.5, 0.5);
 		this.eventGfx = game.add.graphics(500, 310); // x = 25, y = 127
 		this.eventGfx.pivot.x = 237;
 		this.eventGfx.pivot.y = 162;
 		this.reportGroup.addChild(this.eventGfx);

 		this.eventReport.inputEnabled = true;

 		this.eventReport.events.onInputDown.add(this.closeEventReport, this);

 		uim.textBefore.aves = game.add.bitmapText(0, 20, 'bogboo', '', uim.INFO_TEXT_SIZE);
 		uim.textBefore.reptilia = game.add.bitmapText(0, 20, 'bogboo', '', uim.INFO_TEXT_SIZE);
 		uim.textBefore.amphibia = game.add.bitmapText(0, 20, 'bogboo', '', uim.INFO_TEXT_SIZE);
 		uim.textBefore.mammalia = game.add.bitmapText(0, 20, 'bogboo', '', uim.INFO_TEXT_SIZE);

 		this.eventGfx.addChild(uim.textBefore.aves);
 		this.eventGfx.addChild(uim.textBefore.reptilia);
 		this.eventGfx.addChild(uim.textBefore.amphibia);
 		this.eventGfx.addChild(uim.textBefore.mammalia);

 		i = 0;
 		for (key in uim.textBefore) {
 			uim.textBefore[key].anchor.setTo(0.5, 1.0);
 			uim.textBefore[key].x = 32 + i * 60;
 			i += 1;
 		}

 		uim.textAfter.aves = game.add.bitmapText(0, 20, 'bogboo', '', uim.INFO_TEXT_SIZE);
 		uim.textAfter.reptilia = game.add.bitmapText(0, 20, 'bogboo', '', uim.INFO_TEXT_SIZE);
 		uim.textAfter.amphibia = game.add.bitmapText(0, 20, 'bogboo', '', uim.INFO_TEXT_SIZE);
 		uim.textAfter.mammalia = game.add.bitmapText(0, 20, 'bogboo', '', uim.INFO_TEXT_SIZE);

 		this.eventGfx.addChild(uim.textAfter.aves);
 		this.eventGfx.addChild(uim.textAfter.reptilia);
 		this.eventGfx.addChild(uim.textAfter.amphibia);
 		this.eventGfx.addChild(uim.textAfter.mammalia);

 		i = 0;
 		for (key in uim.textAfter) {
 			uim.textAfter[key].anchor.setTo(0.5, 1.0);
 			uim.textAfter[key].x = 290 + i * 60;
 			i += 1;
 		}

 		uim.questionText = game.add.bitmapText(0, 0, 'bogboo', 'A question goes here to prompt\nplayers to think about how\nbest to optimize play.', uim.HINT_TEXT_SIZE);
 		this.eventGfx.addChild(uim.questionText);
 		this.questionText.x = 20;
 		this.questionText.y = 430;

 		this.hideEventReport();
 	},

 	setCurrentEventQuestion: function(question) {
 		this.questionText.text = question;
 	},

 	showEventReport: function() {
 		uim.setLeftHint('');
 		this.reportGroup.visible = true;
 		this.eventReport.inputEnabled = true;
 		gs.playSound(gs.sounds.reportOpen);
 	},

 	hideEventReport: function() {
 		this.reportGroup.visible = false;
 		this.eventReport.inputEnabled = false;
 	},

 	drawReportBarGraph: function(color, offset, textObj, population, maxPopulation) {
 		var dy = Math.round(307 * population / maxPopulation);

 		this.eventGfx.beginFill(color);	// AVES
 		this.eventGfx.drawRect(offset, 1 + (307 - dy), 58, dy);
 		this.eventGfx.endFill();

 		textObj.y = 307 - dy + uim.INFO_TEXT_SIZE;
 		textObj.y = Math.min(textObj.y, 307);
 		textObj.text = "" + population;
 	},

 	keyIndex: 0,
 	keyTimer: 0,
 	DEBUGrenderEventReport: function() {
 		var keys = Object.keys(strings.EVENTS);

 		this.keyTimer += game.time.physicsElapsedMS;

 		if (this.keyTimer > 2000) {
 			this.keyTimer -= 2000;
 			this.keyIndex += 1;
 			this.keyIndex = this.keyIndex % keys.length;
 		}

 		if (strings.EVENTS[keys[this.keyIndex]].hasOwnProperty("question")) {
 			this.setCurrentEventQuestion(strings.EVENTS[keys[this.keyIndex]].question);
 		}
 		else {
 			this.keyTimer += 2000;
 		}
 	},

 	renderEventReport: function(beforePopulations, afterPopulations) {
 		var familySize = gs.getPopulationsPerFamily();
 		var i = 0;
 		var key = null;

 		this.eventGfx.clear();

 		i = 0;
 		for (key in beforePopulations) {
 			assert(uim.textBefore.hasOwnProperty(key), "renderEventReport: invalid population key (before)!");
	 		this.drawReportBarGraph(uim.REPORT_COLORS[i], 2 + 60 * i, uim.textBefore[key], beforePopulations[key], familySize);
	 		++i;
 		}

 		i = 0;
 		for (key in afterPopulations) {
 			assert(uim.textAfter.hasOwnProperty(key), "renderEventReport: invalid population key (after)!");
	 		this.drawReportBarGraph(uim.REPORT_COLORS[i], 260 + 60 * i, uim.textAfter[key], afterPopulations[key], familySize);
	 		++i;
 		}
 	},

 	createCloseButton: function() {
 		this.closeButton = this.group.create(game.width - this.CLOSE_BUTTON_WIDTH / 2, this.CLOSE_BUTTON_HEIGHT / 2, 'closeButton');
 		this.closeButton.anchor.set(0.5, 0.5);
 		this.closeButton.inputEnabled = true;
 		this.closeButton.visible = false;
		this.closeButton.events.onInputDown.add(this.onCloseButtonClicked, this);
		listenFor("showCloseButton", this);
		listenFor("hideCloseButton", this);
 	},

 	showCloseButton: function() {
 		this.closeButton.visible = true;
 	},

 	hideCloseButton: function() {
 		this.closeButton.visible = false;
 	},

 	createHints: function() {
 		this.cardHintGroup = game.add.group();
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

 	addToCardHintGroup: function(item) {
 		this.cardHintGroup.addChild(item);
 	},

 	leftHintCenter: function() {
 		return Math.round(this.HINT_WIDTH * TILE_SIZE * gs.SPRITE_SCALE / 2);
 	},

 	rightHintCenter: function() {
 		return Math.round(this.HINT_WIDTH * TILE_SIZE * gs.SPRITE_SCALE + (game.width - this.HINT_WIDTH * TILE_SIZE * gs.SPRITE_SCALE) / 2);
 	},

 	setLeftHint: function(message) {
 		if (message) {
	 		this.hint.text.text = message;

	 		this.hint.sprite.x = this.hint.text.width;
	 		this.hint.group.x = Math.round(this.leftHintCenter() - (this.hint.text.width / 2 + TILE_SIZE * gs.SPRITE_SCALE / 2));

	 		this.hint.text.visible = true;
	 		this.hint.sprite.visible = true;

	 		this.hint.text.inputEnabled = false;
	 		this.hint.bWasLeftHint = true;
	 	}
	 	else {
	 		this.hideHint();
	 	}
 	},

 	setRightHint: function(message) {
 		if (message) {
	 		this.hint.text.text = message;

	 		this.hint.sprite.x = this.hint.text.width;
	 		this.hint.group.x = Math.round(this.rightHintCenter() - (this.hint.text.width / 2 + TILE_SIZE * gs.SPRITE_SCALE / 2));

	 		this.hint.text.visible = true;
	 		this.hint.sprite.visible = true;

	 		this.hint.text.inputEnabled = false;
	 		this.hint.bWasLeftHint = false;
	 	}
	 	else {
	 		this.hideHint();
	 	}
 	},

	release: function() {
		var data = null;

		if (this.focusWidget) {
			data = this.focusWidget.banner.getData();
			if (data) {
				this.clearFocusBanner();
			}
		}

		if (data && typeof(data) === 'function') {
			data(this);
		}
	},

 	hideHint: function() {
 		this.hint.text.text = '';
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

 	createInfoDialog: function(bReset) {
 		if (!bReset) {
	 		this.infoDlgMarker = this.infoGroup.create(0, 0);
	 		this.infoDlgShield = this.infoGroup.create(0, 0, 'infoShield');
	 		this.infoDlgPanel = this.infoGroup.create(0, 0, 'infoPanel');
	 	}

 		this.infoDlgMarker.x = this.EVENT_MARGIN * TILE_SIZE + this.infoDlgShield.width + TILE_SIZE * gs.SPRITE_SCALE / 2;
 		this.infoDlgMarker.y = -this.infoDlgShield.height;
 		this.infoDlgMarker.anchor.setTo(0, 0);
 		this.infoDlgMarker.visible = false;

 		if (!bReset) {
	 		this.infoDlgMarker.data = {};
	 		this.infoDlgMarker.data.tweenOut = game.add.tween(this.infoDlgMarker).to({x: this.infoDlgMarker.x, y: -this.infoDlgShield.height }, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.In, false);
	 		this.infoDlgMarker.data.tweenIn = game.add.tween(this.infoDlgMarker).to({x: this.infoDlgMarker.x, y: game.height / 2 - this.infoDlgShield.height / 2}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.Out, false);
	 	}

 		this.infoDlgPanel.x = this.infoDlgShield.width / 2;
 		this.infoDlgPanel.y = 0;
 		this.infoDlgPanel.anchor.setTo(0.0, 0.0);

 		if (!bReset) {
	 		this.infoDlgPanel.data.tweenOut = game.tweens.create(this.infoDlgPanel.scale);
	 		this.infoDlgPanel.data.tweenOut.to({x: 1.0, y: 1.0}, uim.INFO_EXPAND_TIME, Phaser.Easing.Cubic.InOut);
	 		this.infoDlgPanel.data.tweenOut.onComplete.add(this.revealInfoText, this);
	 		this.infoDlgPanel.data.tweenBack = game.tweens.create(this.infoDlgPanel.scale);
	 		this.infoDlgPanel.data.tweenBack.to({x: this.INFO_INFO_SCALE_SMALL, y: 1.0}, uim.INFO_EXPAND_TIME, Phaser.Easing.Cubic.InOut);
	 		this.infoDlgPanel.data.tweenBack.onComplete.add(this.hideInfoText, this);
	 		this.infoDlgMarker.addChild(this.infoDlgPanel);
	 	}

 		this.infoDlgShield.anchor.setTo(0, 0);

 		if (!bReset) {
	 		this.infoDlgMarker.addChild(this.infoDlgShield);
	 	}

	 	if (!bReset) {
	 		this.infoDlgMarker.data.tweenOut.onComplete.add(this.onInfoDialogOut, this);
	 		this.infoDlgMarker.data.tweenIn.onComplete.add(this.onInfoDialogIn, this);

			this.infoDlgTitle = game.add.bitmapText(this.infoDlgPanel.width / 2, uim.INFO_TITLE_SIZE / 2, 'bogboo', "Event Title", Math.floor(uim.TITLE_SIZE * uim.TITLE_SCALAR));
		}

		this.infoDlgTitle.x = Math.round(this.infoDlgTitle.x);
		this.infoDlgTitle.y = Math.floor(this.infoDlgTitle.y);

		if (!bReset) {
			this.infoDlgText = game.add.bitmapText(this.infoDlgPanel.width / 2, Math.floor(this.infoDlgPanel.height * 1 / 5 + uim.TITLE_SIZE / 2), 'smallbogboo', "Event Info", uim.INFO_TEXT_SIZE); 		
		}

		if (!bReset) {
			this.infoDlgText.x = Math.round(this.infoDlgText.x);
			this.infoDlgText.y = Math.round(this.infoDlgText.y) - uim.INFO_DLG_FUDGE_Y;

			this.infoDlgPrompt = game.add.bitmapText(this.infoDlgPanel.width / 2, this.infoDlgPanel.height - uim.INFO_TEXT_SIZE, 'smallbogboo', strings.EVENTS.PROMPT, uim.INFO_TEXT_SIZE * 3 / 4);
		}

		if (!bReset) {
			this.infoDlgPrompt.x = Math.round(this.infoDlgPrompt.x);
			this.infoDlgPrompt.y = Math.floor(this.infoDlgPrompt.y) - uim.INFO_DLG_FUDGE_Y;

			this.infoDlgPanel.addChild(this.infoDlgTitle);
			this.infoDlgPanel.addChild(this.infoDlgText);
			this.infoDlgPanel.addChild(this.infoDlgPrompt);
		}

		this.infoDlgTitle.anchor.setTo(0.5, 0.0);
		this.infoDlgText.anchor.setTo(0.5, 0.0);
		this.infoDlgPrompt.anchor.setTo(0.5, 0.0);
		this.infoDlgTitle.alpha = 0.0;
		this.infoDlgText.alpha = 0.0;
		this.infoDlgPrompt.alpha = 0.0;

		if (!bReset) {
			this.infoDlgShield.events.onInputDown.add(this.onInfoPanelClicked, this);
			this.infoDlgPanel.events.onInputDown.add(this.onInfoPanelClicked, this);
		}

		this.infoDlgShield.enableInput = false;
		this.infoDlgPanel.enableInput = false;

		if (!bReset) {
			this.infoDlgTitle.tweenIn = game.add.tween(this.infoDlgTitle).to({alpha: 1}, uim.INFO_ALPHA_TIME, Phaser.Easing.Cubic.InOut);
			this.infoDlgText.tweenIn = game.add.tween(this.infoDlgText).to({alpha: 1}, uim.INFO_ALPHA_TIME, Phaser.Easing.Cubic.InOut);
			this.infoDlgPrompt.tweenIn = game.add.tween(this.infoDlgPrompt).to({alpha: 1}, uim.INFO_ALPHA_TIME, Phaser.Easing.Cubic.InOut);
			this.infoDlgText.tweenIn.onComplete.add(this.onInfoRevealed, this);

			this.infoDlgTitle.tweenOut = game.add.tween(this.infoDlgTitle).to({alpha: 0}, uim.INFO_ALPHA_TIME, Phaser.Easing.Cubic.InOut);
			this.infoDlgText.tweenOut = game.add.tween(this.infoDlgText).to({alpha: 0}, uim.INFO_ALPHA_TIME, Phaser.Easing.Cubic.InOut);
			this.infoDlgPrompt.tweenOut = game.add.tween(this.infoDlgPrompt).to({alpha: 0}, uim.INFO_ALPHA_TIME, Phaser.Easing.Cubic.InOut);
		}

 		this.infoDlgPanel.scale.setTo(uim.INFO_INFO_SCALE_SMALL, 1.0);

 		if (!bReset) {
	 		this.infoDlgMarker.bringToTop();
	 	}
 	},

 	showInfoDialog: function(title, text, nextState) {
 		if (nextState) {
 			sm.setTransitionState('showInfoDialog', nextState, {title: title, text: text});
 		}
 		else {
 			pushState(sm.showInfoDialog, {title: title, text: text});
 		}

 		uim.setLeftHint('');

 		gs.playSound(gs.sounds.info);
 	},

 	startInfoDialog: function(title, text) {
 		this.infoDlgTitle.text = title;
 		this.infoDlgText.text = text;

 		this.infoDlgMarker.visible = true;

 		this.infoDlgTitle.visible = true;
 		this.infoDlgTitle.alpha = 0.0;
 		this.infoDlgText.visible = true;
 		this.infoDlgText.alpha = 0.0;
 		this.infoDlgPrompt.visible = true;
 		this.infoDlgPrompt.alpha = 0.0;

		this.infoDlgMarker.data.tweenIn.start();
 	},

 	showInfoPrompt: function() {
 		this.infoDlgPrompt.tweenIn.start();
 	},

 	onInfoDialogIn: function() {
		this.infoDlgPanel.data.tweenOut.start();
 	},

 	revealInfoText: function() {
		this.infoDlgTitle.tweenIn.start();
		this.infoDlgText.tweenIn.start();
		gs.playSound(gs.sounds.infoReveal);
 	},

 	hideInfoText: function() {
 		this.infoDlgMarker.data.tweenOut.start();
 		broadcast("hideInfoText");
 	},

 	onInfoDialogOut: function() {
 		this.infoDlgTitle.visible = false;
 		this.infoDlgText.visible = false;
 		this.infoDlgPrompt.visible = false;
 		this.infoDlgMarker.visible = false;

 		broadcast("infoDialogOut");
 	},

 	onInfoRevealed: function() {
 		this.infoDlgShield.inputEnabled = true;
 		this.infoDlgPanel.inputEnabled = true;
 	},

 	onInfoPanelClicked: function() {
 		if (!this.choiceGroup.visible) {
	 		this.infoDlgShield.inputEnabled = false;
	 		this.infoDlgPanel.inputEnabled = false;

			this.infoDlgTitle.tweenIn.stop();
			this.infoDlgText.tweenIn.stop();
			this.infoDlgPrompt.tweenIn.stop();

			this.infoDlgTitle.tweenOut.start();
			this.infoDlgText.tweenOut.start();
			this.infoDlgPrompt.tweenOut.start();

			gs.playSound(gs.sounds.dialogClose);

			this.infoDlgPanel.data.tweenBack.start();
		}
 	},

 	onCloseButtonClicked: function() {
 		this.offerChoice(strings.INFO.OFFER_ABORT_GAME, gs.abortGame.bind(gs), strings.INFO.OFFER_RESUME_GAME, null);
 	},

 	createEvents: function(bReset) {
 		if (!bReset) {
	 		this.eventMarker = this.infoGroup.create(0, 0);
	 		this.eventShield = this.infoGroup.create(0, 0, 'eventMarker');
	 		this.eventInfo = this.infoGroup.create(0, 0, 'eventInfo');
	 	}

 		this.eventMarker.x = this.EVENT_MARGIN * TILE_SIZE + this.eventShield.width + TILE_SIZE * gs.SPRITE_SCALE / 2;
 		this.eventMarker.y = -this.eventShield.height;
 		this.eventMarker.anchor.setTo(0, 0);
 		this.eventMarker.visible = false;

 		if (!bReset) {
	 		this.eventMarker.data = {};
	 		this.eventMarker.data.tweenOut = game.add.tween(this.eventMarker).to({x: this.eventMarker.x, y: -this.eventShield.height }, uim.EVENT_TWEEN_TIME, Phaser.Easing.Cubic.In, false);
	 		this.eventMarker.data.tweenIn = game.add.tween(this.eventMarker).to({x: this.eventMarker.x, y: game.height - this.eventShield.height}, uim.EVENT_TWEEN_TIME, Phaser.Easing.Cubic.Out, false);
	 		this.eventMarker.data.tweenToBiome = game.add.tween(this.eventMarker).to({x: this.eventMarker.x, y:0}, uim.EVENT_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
	 		this.eventMarker.data.tweenFromBiome = game.add.tween(this.eventMarker).to({x: this.eventMarker.x, y:0}, uim.EVENT_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
	 	}

 		this.eventInfo.x = this.eventShield.width / 2;
 		this.eventInfo.y = 0;
 		this.eventInfo.anchor.setTo(0.0, 0.0);

 		if (!bReset) {
	 		this.eventInfo.data.tweenOut = game.tweens.create(this.eventInfo.scale);
	 		this.eventInfo.data.tweenOut.to({x: 1.0, y: 1.0}, uim.EVENT_EXPAND_TIME, Phaser.Easing.Cubic.InOut);
	 		this.eventInfo.data.tweenOut.onComplete.add(this.revealEventText, this);
	 		this.eventInfo.data.tweenBack = game.tweens.create(this.eventInfo.scale);
	 		this.eventInfo.data.tweenBack.to({x: this.EVENT_INFO_SCALE_SMALL, y: 1.0}, uim.EVENT_EXPAND_TIME, Phaser.Easing.Cubic.InOut);
	 		this.eventInfo.data.tweenBack.onComplete.add(this.hideEventText, this);
	 		this.eventMarker.addChild(this.eventInfo);
	 	}

 		this.eventShield.anchor.setTo(0, 0);

 		if (!bReset) {
	 		this.eventMarker.addChild(this.eventShield);

	 		this.eventMarker.data.tweenOut.onComplete.add(this.onEventOff, this);
	 		this.eventMarker.data.tweenIn.onComplete.add(this.onEventIn, this);
	 		this.eventMarker.data.tweenToBiome.onComplete.add(this.onEventArrived, this);
	 		this.eventMarker.data.tweenFromBiome.onComplete.add(this.onEventExited, this);
	 	}


	 	if (!bReset) {
			this.eventTitle = game.add.bitmapText(this.eventInfo.width, uim.TITLE_SIZE / 2, 'bogboo', "Event Title", Math.floor(uim.TITLE_SIZE * uim.TITLE_SCALAR));
			this.eventText = game.add.bitmapText(this.eventInfo.width, this.eventInfo.height * 1 / 4 + uim.TITLE_SIZE / 2, 'smallbogboo', "Event Info", uim.INFO_TEXT_SIZE); 		
			this.eventPrompt = game.add.bitmapText(this.eventInfo.width, this.eventInfo.height - uim.TITLE_SIZE, 'smallbogboo', strings.EVENTS.PROMPT, uim.INFO_TEXT_SIZE * 3 / 4); 		
			this.eventInfo.addChild(this.eventTitle);
			this.eventInfo.addChild(this.eventText);
			this.eventInfo.addChild(this.eventPrompt);
		}

		this.eventTitle.anchor.setTo(0.5, 0.0);
		this.eventText.anchor.setTo(0.5, 0.0);
		this.eventPrompt.anchor.setTo(0.5, 0.0);
		this.eventTitle.alpha = 0.0;
		this.eventText.alpha = 0.0;
		this.eventPrompt.alpha = 0.0;

		if (!bReset) {
			this.eventTitle.y -= 2;
			this.eventText.y -= 4;
			this.eventPrompt.y += 10;

			this.eventShield.events.onInputDown.add(this.onEventInfoClicked, this);
			this.eventInfo.events.onInputDown.add(this.onEventInfoClicked, this);
		}

		this.eventShield.enableInput = false;
		this.eventInfo.enableInput = false;

		if (!bReset) {
			this.eventTitle.tweenIn = game.add.tween(this.eventTitle).to({alpha: 1}, uim.EVENT_ALPHA_TIME, Phaser.Easing.Cubic.InOut);
			this.eventText.tweenIn = game.add.tween(this.eventText).to({alpha: 1}, uim.EVENT_ALPHA_TIME, Phaser.Easing.Cubic.InOut);
			this.eventPrompt.tweenIn = game.add.tween(this.eventPrompt).to({alpha: 1}, uim.EVENT_ALPHA_TIME, Phaser.Easing.Cubic.InOut);
			this.eventText.tweenIn.onComplete.add(this.onEventRevealed, this);

			this.eventTitle.tweenOut = game.add.tween(this.eventTitle).to({alpha: 0}, uim.EVENT_ALPHA_TIME, Phaser.Easing.Cubic.InOut);
			this.eventText.tweenOut = game.add.tween(this.eventText).to({alpha: 0}, uim.EVENT_ALPHA_TIME, Phaser.Easing.Cubic.InOut);
			this.eventPrompt.tweenOut = game.add.tween(this.eventPrompt).to({alpha: 0}, uim.EVENT_ALPHA_TIME, Phaser.Easing.Cubic.InOut);
		}

 		this.eventInfo.scale.setTo(uim.EVENT_INFO_SCALE_SMALL, 1.0);
 	},

 	alignEventText: function() {
 		var margin = 0;
 		this.eventTitle.x = (this.eventInfo.width - margin) / 2 + margin;
 		this.eventText.x = this.eventTitle.x;
 		this.eventPrompt.x = this.eventTitle.x;
 	},

 	showEvent: function(biome, title, info) {
 		var y = biome ? biome.getY() + TILE_SIZE / 2 * gs.SPRITE_SCALE : game.height / 2 - this.eventShield.height / 2;
 		var dt = uim.EVENT_TWEEN_TIME * Math.abs(y - (game.height - this.eventShield.height)) / game.height;

 		uim.setLeftHint('');

 		gs.playSound(gs.sounds.event);

 		this.eventMarker.y = -this.eventShield.height;

 		this.eventTitle.text = title;
 		this.eventText.text = info;

 		this.eventMarker.data.tweenToBiome.updateTweenData('vEnd', {y: y});
 		this.eventMarker.data.tweenToBiome.updateTweenData('duration', dt);
 		this.eventMarker.data.tweenIn.start();
 		this.eventMarker.visible = true;
 	},

 	onEventRevealed: function() {
 		this.eventShield.inputEnabled = true;
 		this.eventInfo.inputEnabled = true;
 		broadcast('eventArrived');
 	},

 	revealEventText: function() {
		this.alignEventText();
 		this.eventTitle.tweenIn.start();
 		this.eventText.tweenIn.start();
 		this.eventPrompt.tweenIn.start();
 		gs.playSound(gs.sounds.eventReveal);
 	},

 	onEventOff: function() {
 	},

 	onEventIn: function() {
 		this.eventMarker.data.tweenToBiome.start();
 	},

 	onEventArrived: function() {
		this.eventInfo.data.tweenOut.start();
 	},

 	onEventInfoClicked: function() {
 		if (!this.choiceGroup.visible) {
	 		this.eventShield.inputEnabled = false;
	 		this.eventInfo.inputEnabled = false;

	 		// TODO: apply event.
	 		this.eventTitle.tweenOut.start();
	 		this.eventText.tweenOut.start();
	 		this.eventPrompt.tweenOut.start();
	 		this.eventInfo.data.tweenBack.start();

			gs.playSound(gs.sounds.dialogClose);
		}
 	},

 	hideEventText: function() {
 		var dt = uim.EVENT_TWEEN_TIME * Math.abs(-this.eventShield.height - this.eventMarker.y) / game.height;

 		this.eventMarker.data.tweenFromBiome.updateTweenData('vEnd', {y: -this.eventShield.height});
 		this.eventMarker.data.tweenFromBiome.updateTweenData('duration', dt);
 		this.eventMarker.data.tweenFromBiome.start();
 	},

 	onEventExited: function() {
 		this.eventMarker.visible = false;
 		broadcast('eventExited');
 	},

 	blockInput: function() {
 		uim.bInputBlocked = true;
 	},

 	unblockInput: function() {
 		uim.bInputBlocked = false;
 	},

 	inputBlocked: function() {
 		return uim.bInputBlocked || uim.reportGroup.visible;
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

 	onInputDown: function(gameObject, pointer, bStillOver) {
 	},

 	onInputUp: function(gameObject, pointer, bStillOver) {
 		var bHandled = false;

 		if (this.focusWidget && sm.isMenuState()) {
 			this.release();
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

 	setupBanner: function(iBanner, iImage, label, callback) {
 		assert(iBanner >= 0 && iBanner < this.banners.length, "setupBanner: invalid banner index!");

		this.banners[iBanner].setUiTitle(label, gs.bannerStateFromIndex(iImage));
		this.banners[iBanner].setValue('');
		this.banners[iBanner].setKeywords('');
		this.banners[iBanner].setSpecial('');
		this.banners[iBanner].setData(callback);
 	},

	syncBannersToCards: function() {
		// TODO: generalize this for any deck (not just a freshly-initialized one).
		var i = 0;
		var deckSize = gs.getDrawDeckSize();
		var iSynced = -1;

		while (i < deckSize && i<this.banners.length) {
			this.setBannerInfo(i,
							   gs.getDrawDeckType(i),
							   gs.getDrawDeckSuit(i),
							   gs.getDrawDeckKeywords(i),
							   gs.getDrawDeckSpecial(i),
							   gs.getDrawDeckCard(i));

			++i;
		}

		iSynced = i;

		for (i=i; i<this.banners.length; ++i ){
			uim.setBannerInfo(i, '', 9, '', '', null);
		}		

		return iSynced;
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

		uim.closeAllEggChambers();
	},

 	moveBannersIn: function() {
		var i = 0;
		var fn = null;

		for (i=0; i<this.banners.length; ++i) {
			if (this.banners[i].data) {
				fn = function(index) { return function() { uim.moveBannerIn(index); } };
				setTimeout(fn(i), uim.SLIDE_IN_DELAY * i);
			}
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

	 		this.value  	= game.add.bitmapText(-uim.VALUE_OFFSET_X, uim.VALUE_OFFSET_Y, 'bogboo', "" + value, uim.VALUE_SIZE);
	 		this.value.anchor.setTo(0.0, 1.0);

	 		this.keywords  	= game.add.bitmapText(this.button.width(), this.button.height(), 'smallbogboo', keywords, uim.KEYWORD_SIZE);
	 		this.keywords.anchor.setTo(0.0, 1.0);

	 		this.button.group.addChild(this.title);
	 		this.title.x = this.button.sprOn.width / uim.BANNER_WIDTH_FACTOR;
	 		this.title.y = 0;

	 		this.button.group.addChild(this.value);
	 		this.value.x += uim.VALUE_WIDTH_NUM * this.button.sprOn.width / uim.VALUE_WIDTH_DENOM;
	 		this.value.x = Math.round(this.value.x);
	 		this.value.y = 0;
	 		this.value.anchor.setTo(0.5, 1.0);
	 		this.value.align ="center";

	 		this.button.group.addChild(this.keywords);
	 		this.keywords.x = Math.round(this.button.sprOn.width / uim.BANNER_WIDTH_FACTOR);
	 		this.keywords.y = Math.round(this.keywords.height * (1 + uim.KEYWORDS_NUM / uim.KEYWORDS_DENOM));

 			this.special = this.button.group.create(0, 0, 'ui_specials');
 			this.special.visible = false;
 			this.special.anchor.setTo(0.5, 0.5);
 			this.special.x = this.value.x;
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

 	startOperation: function(opName, args, bAdditive) {
 		var bDoOperation = true;
 		var bVariableOpCount = false;

 		if (!bAdditive) {
 			this.uiOpCounter = 0;
 		}

 		switch(opName) {
 			case 'moveBannersOut':
 				this.uiOpCounter += this.getNumBannersWithData();
 			break;

 			case 'moveBannerOut': case 'moveBannerIn':
 				this.uiOpCounter += 1;
 			break;

 			case 'moveBannersIn': case 'wiggleBanners':
 				this.uiOpCounter += this.getNumBannersWithData();
 			break;

 			case 'hideFocusBanner': case 'showFocusBanner':
 				this.uiOpCounter += 1;
 				bDoOperation = this.focusWidget;
 			break;

 			case 'wiggleFocusBanner':
 				this.uiOpCounter += 1;
 				bDoOperation = this.focusWidget && this.focusWidget.banner;
 			break;

 			case 'fadeIn': case 'fadeOut':
 				bVariableOpCount = true;
 			break;

 			case 'turnRingTo':
 				this.uiOpCounter += 1;
 			break;

 			case 'turnRingBy':
 				this.uiOpCounter += 1;
 			break;

 			case 'blendTo':
 				this.uiOpCounter += 1;
 			break;

 			case 'wait':
 				assert(!bAdditive, "startOperation: cannot combine 'wait' with additive commands!");

 				this.uiOpCounter = this.NOOP;
 				setTimeout(function() { broadcast('UIoperationComplete'); }, args);
 			break;

 			default:
 				bDoOperation = false;
 			break;
 		}

 		if (!bVariableOpCount && (this.uiOpCounter === 0 || this.uiOpCounter === this.NOOP)) {
 			bDoOperation = false;
 		}

 		if (bDoOperation && this.hasOwnProperty(opName)) {
 			if (bVariableOpCount) {
 				this.lastOp = opName;
 				this.uiOpCounter += this[opName](args);
 			}
 			else {
 				this.lastOp = opName;
 				this[opName](args);
 			}
 		}
 		else if (bDoOperation && this.helper.hasOwnProperty(opName)) {
 			if (bVariableOpCount) {
 				this.lastOp = opName;
 				this.uiOpCounter += this.helper[opName](args);
 			}
 			else {
 				this.lastOp = opName;
 				this.helper[opName](args);
 			}
 		}

 		if (this.uiOpCounter === 0) {
 			// FILTHY HACK: introduce slight delay to prevent state machines from
 			// transitioning multiple times in a single frame. This can happen when
 			// a state's enter() method calls startOperation() and the operation
 			// immediately broadcasts "UIoperationComplete", triggering a state
 			// change in the state's listening method.
 			setTimeout(function() { broadcast('UIoperationComplete'); }, this.MIN_OPERATION_DELAY);
 		}
 	},

 	onUIopComplete: function() {
 		this.uiOpCounter -= 1;
 		if (this.uiOpCounter <= 0) {
 			broadcast('UIoperationComplete');
 		}
 	},

 	hideTitleText: function() {
 		this.titleGroup.visible = false;
 	},

 	showTitleText: function() {
 		this.titleGroup.visible = true;
 	},

 	init: function() {
		this.helperGroup = game.add.group();
		this.buttonGroup = game.add.group();
		this.group = game.add.group();
		this.infoGroup = game.add.group();
		this.titleGroup = game.add.group();

 		this.titleSplash = this.titleGroup.create(game.width - this.RIGHT_PANEL_WIDTH / 2, game.height / 2, 'splash');
 		this.titleSplash.anchor.setTo(0.5, 0.5);

		this.createEvents();
		this.createInfoDialog();
		this.helper.create();
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

 	getBannerButton: function(index) {
 		assert(index >= 0 && index < this.banners.length, "getBannerButton: invalid index!");

 		return this.banners[index].button;
 	},

 	getFocusControlIndex: function() {
 		var index = -1;
 		var i = 0;

 		if (uim.focusWidget) {
 			for (i=0; i<this.banners.length; ++i) {
 				if (this.banners[i].button === uim.focusWidget) {
 					index = i;
 					break;
 				}
 			}
 		}

 		return index;
 	},

 	getButtonIndexFromFocusWidget: function() {
 		var i = 0;
 		var index = -1;

 		for (i=0; uim.focusWidget && i<this.banners.length; ++i) {
 			if (uim.focusWidget.banner === this.banners[i]) {
 				index = i;
 				break;
 			}
 		}

 		return index;
 	},

 	openFocusEggChamber: function() {
 		var iChamber = uim.getButtonIndexFromFocusWidget();

 		if (iChamber >= 0) {
 			if (uim.focusWidget.banner.data && uim.focusWidget.banner.data.tileId >= 0) {
	 			uim.openEggChamber(uim.focusWidget.banner.data.tileId, iChamber);
 			}
 			else {
 				uim.openEggChamber(gs.getCardTitle(uim.focusWidget.banner.data), iChamber);
 			}
 		}
 	},

 	closeFocusEggChamber: function() {
 		var iChamber = uim.getButtonIndexFromFocusWidget();

 		if (iChamber >= 0) {
 			uim.closeEggChamber(iChamber);
 		}
 	},

 	closeAllEggChambers: function() {
 		var i = 0;

 		for (i=0; i<this.banners.length; ++i) {
 			uim.closeEggChamber(i);
 		}
 	},

 	openEggChamber: function(eggType, iChamber) {
 		var iEgg = null;

 		if (eggType) {
	 		tm.addTilesToLayer(gs.baseLayers.objects, 'sf_world', 340, 1 + 3 * iChamber, 11);

	 		if (typeof(eggType) === "number") {
	 			iEgg = eggType;
		 		assert(iEgg >= 0, "openEggChamber: unknown EGG type (1)!");

		 		tm.addTilesToLayer(gs.baseLayers.ui, 'sf_world', iEgg, 1 + 3 * iChamber, 11);
	 		}
	 		else {
	 			iEgg = gs.getEggIndexFromType(eggType);
		 		assert(iEgg >= 0, "openEggChamber: unknown EGG type (2)!");

		 		tm.addTilesToLayer(gs.baseLayers.ui, 'sf_world', 285 + iEgg, 1 + 3 * iChamber, 11);
	 		}
		}
 	},

 	closeEggChamber: function(iChamber) {
 		tm.removeTileFromLayer(gs.baseLayers.ui, 1 + 3 * iChamber, 11);
 		tm.addTilesToLayer(gs.baseLayers.objects, 'sf_world', 338, 1 + 3 * iChamber, 11);
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
 		var iChamber = uim.getButtonIndexFromFocusWidget();

 		if (this.focusWidget instanceof uim.button && uim.focusWidget.banner) {
 			this.focusWidget.buttonStateClear();

 			if (iChamber >= 0) {
 				uim.closeEggChamber(iChamber);
 			}

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

 		x = uim.FRAME_BOTTOM_MARGIN.X + uim.INFO_TEXT_MARGIN;
 		for (i=0; i<nLines; ++i) {
 			y = uim.FRAME_BOTTOM_MARGIN.Y + i * (uim.INFO_TEXT_SIZE + uim.INFO_TEXT_SPACING) + gs.getOffsetY();
 			bmpText = game.add.bitmapText(x, y, 'smallbogboo', '', uim.INFO_TEXT_SIZE);
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

 	simulateButtonPress: function(iBanner) {
 		if (iBanner >= 0 && iBanner < this.banners.length) {
 			this.banners[iBanner].button.press();
 		}
 	},

 	isBannerFocusControl: function(iBanner) {
 		return (iBanner >= 0 && iBanner < this.banners.length) ?
 			   this.banners[iBanner].button === this.focusWidget :
 			   false;
 	}
 };

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

uim.banner.prototype.setUiTitle = function(newTitle, newState) {
	this.title.text = newTitle;
	this.button.setState(newState);
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
	var data = null;

	if (!uim.inputBlocked()) {
		this.sprOff.kill();
		this.sprOn.revive(0, this.sprOn.height / 2);
		this.sprOn.animations.play(this.state + 'On');

		if (uim.focusWidget) {
			uim.closeFocusEggChamber();
			uim.focusWidget.buttonStateClear();
		}

		if (this.onPressedCallback) {
			// Check for overridden callback function.
			if (this.banner) {
				data = this.banner.getData();
			}

			if (!data || typeof(data) !== 'function') {
				this.onPressedCallback(this);
			}

			uim.focusWidget = this;

			uim.openFocusEggChamber();
		}

		if (game.sound.volume > 0) {
			gs.playSound(gs.sounds.button);
		}
	}
}

uim.button.prototype.buttonStateClear = function() {
	if (!uim.inputBlocked()) {
		this.sprOn.kill();
		this.sprOff.revive(0, this.sprOff.height / 2);
		this.sprOff.animations.play(this.state + 'Off');

		if (this === uim.focusWidget) {
			uim.focusWidget = null;
		}
	}
}