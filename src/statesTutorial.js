sm.bannerInputStages = [],
sm.worldInputStages = [],

sm.startTutorial = {
	enter: function(data) {
		uim.disableBannerInput();
		listenFor('UIoperationComplete', this);
		uim.startOperation('moveBannersOut');
	},

	update: function() {

	},

	exit: function() {

	},

	UIoperationComplete: function(data) {
		unlistenFor('UIoperationComplete', this);
		setState(sm.startTutorialIntro);
	}
};

sm.handleTutorialBannerPress = function(button, stage) {
	if (button && button.banner && sm.bannerInputStages.indexOf(sm.startTutorialIntro.stage) >= 0) {
		if (sm.startTutorialIntro.stageAction) {
			sm.startTutorialIntro.stageAction(true);
		}

		if (stage > 99) {
			uim.setRightHint(strings.HINTS.PLACE_ORGANISM);
			gs.showAvailableBiomes(button.banner.data);
			gs.showTargetableNiches(button.banner.data);
		}
	}
};

sm.handleTutorialWorldPress = function(arg1, arg2) {
	console.log("Mouse: (" + game.input.mousePointer.x + ", " + game.input.mousePointer.y + ")");
	
	if (sm.worldInputStages.indexOf(sm.startTutorialIntro.stage) >= 0) {

		if (sm.startTutorialIntro.stageAction) {
			sm.startTutorialIntro.stageAction(true);
		}
	}
};

sm.handleTutorialBannerPress02 = function(button, stage) {
	if (button && button.banner && sm.bannerInputStages.indexOf(sm.continueTutorial01.stage) >= 0) {
		if (sm.continueTutorial01.stageAction) {
			sm.continueTutorial01.stageAction(true);
		}

		if (stage > 99) {
			uim.setRightHint(strings.HINTS.PLACE_ORGANISM);
			gs.showAvailableBiomes(button.banner.data);
			gs.showTargetableNiches(button.banner.data);
		}
	}
};

sm.handleTutorialWorldPress02 = function(arg1, arg2) {
	console.log("Mouse: (" + game.input.mousePointer.x + ", " + game.input.mousePointer.y + ")");
	
	if (sm.worldInputStages.indexOf(sm.continueTutorial01.stage) >= 0) {

		if (sm.continueTutorial01.stageAction) {
			sm.continueTutorial01.stageAction(true);
		}
	}
};

sm.doAction12 = function(bFromEvent) {
	var button = uim.getBannerButton(1);

	sm.startTutorialIntro.stageAction = null;

	button.banner.showKeywordInfo();
	uim.simulateButtonPress(1);
	sm.startTutorialIntro.nextStage();
};

sm.doAction16 = function(bFromEvent) {
	var worldPressInfo = null;
	var failMsg = null;

	worldPressInfo = gs.getWorldPressInfo(game.input.activePointer.x, game.input.activePointer.y);

	 if (!bFromEvent || (worldPressInfo && worldPressInfo.niche == gs.getNiche(1, 0))) {
		sm.startTutorialIntro.stageAction = null;

		failMsg = gs.populateNiche(uim.getFocusCard(), gs.getNiche(1, 0));

		assert(!failMsg, "handleTutorialWorldPress: EGG population failed!");

		uim.clearInfoText();
		uim.clearAllCursors();
		sm.startTutorialIntro.nextStage();
	}
};

sm.doAction1202 = function(bFromEvent) {
	var button = uim.getBannerButton(0);

	sm.continueTutorial01.stageAction = null;

	button.banner.showKeywordInfo();
	uim.simulateButtonPress(0);
	sm.continueTutorial01.nextStage();
};

sm.doAction1602 = function(bFromEvent) {
	var worldPressInfo = null;
	var failMsg = null;

	worldPressInfo = gs.getWorldPressInfo(game.input.activePointer.x, game.input.activePointer.y);

	 if (!bFromEvent || (worldPressInfo && worldPressInfo.niche == gs.getNiche(1, 0))) {
		sm.continueTutorial01.stageAction = null;

		failMsg = gs.populateNiche(uim.getFocusCard(), gs.getNiche(1, 0));

		assert(!failMsg, "handleTutorialWorldPress: EGG population failed!");

		uim.clearInfoText();
		uim.clearAllCursors();
		sm.continueTutorial01.nextStage();
	}
};

sm.startTutorialIntro = {
	bAcceptingInput: false,
	bWantsNextStage: false,
	stage: 0,
	skipStage: [],
	stageAction: null,
	eventBiome:null,

	enter: function(data) {
		listenFor('UIoperationComplete', this);
		listenFor("onHelpTapped", this);

		this.stage = 0;
		this.inputStage = 0;
		this.skipStage.length = 0;
		sm.bannerInputStages.length = 0;
		sm.worldInputStages.length = 0;
		this.bAcceptingInput = false;
		this.bWantsNextStage = false;

		gs.seedTutorialDeck(0);

		uim.setLeftHint(null);
		uim.helper.snapTo(720, 400);
		uim.helper.snapArrowsOff(true, false);
		uim.helper.setText('center', strings.TUTORIAL.WELCOME_TERRAFORMER_AND_TAPOUT);
		uim.helper.snapOut(['arrowOut', 'arrowIn']);

		uim.startOperation('fadeIn', ['center', 'ring']);
	},

	update: function() {

	},

	onBannerPressedCallback: function(button) {
		sm.handleTutorialBannerPress(button, this.stage);
	},

	onWorldPressCallback: function() {
		sm.handleTutorialWorldPress(null, null);
	},

	exit: function() {
	},

	autoAdvance: function() {
		this.skipStage.push(this.stage);
	},

	acceptBannerInput: function() {
		sm.bannerInputStages.push(this.stage);
		uim.enableBannerInput();
	},

	acceptWorldInput: function() {
		sm.worldInputStages.push(this.stage);
	},

	nextStage: function() {
		var nBiomesAffected = null;
		var nCardsDestroyed = null;

		this.bAcceptingInput = false;
		this.bWantsNextStage = false;

		if (this.stageAction) {
			this.stageAction(false);
			this.stageAction = null;
		}

		uim.disableBannerInput();
		uim.helper.unblockInput();

		++this.stage;

		switch(this.stage) {
			case 1:
				uim.startOperation('fadeIn', ['arrowOut']);
				uim.startOperation('fadeOut', ['textCenter'], true);
				this.autoAdvance();
			break;

			case 2:
				uim.helper.setText('center', strings.TUTORIAL.THIS_IS_YOUR_BIOSPHERE);
				uim.startOperation('fadeIn', ['textCenter']);
				uim.startOperation('turnRingBy', {angle: 360.0, bShortest: false}, true);
			break;

			case 3:
				uim.startOperation('fadeOut', ['arrowOut']);
				uim.startOperation('fadeOut', ['textCenter'], true);
				this.autoAdvance();
			break;

			case 4:
				uim.helper.setText('center', strings.TUTORIAL.MISSION_OBJECTIVE);
				uim.startOperation('fadeIn', ['textCenter']);
			break;

			case 5:
				uim.startOperation('fadeOut', ['center', 'ring', 'textCenter']);
				this.autoAdvance();
			break;

			case 6:
				uim.openEggChamber("plantae", 1);
				uim.helper.snapTo(Math.round(11.5 * TILE_SIZE * gs.SPRITE_SCALE), Math.round(6.33 * TILE_SIZE * gs.SPRITE_SCALE));
				uim.helper.setText('right', strings.TUTORIAL.INTRODUCING_THE_EGG);
				uim.helper.snapRingBy(90.0);
				uim.helper.snapArrowsOn(true, false);
				uim.startOperation('fadeIn', ['textRight', 'right', 'ring']);
			break;

			case 7:
				uim.startOperation('fadeOut', ['textRight'], true);
				this.autoAdvance();
			break;

			case 8:
				uim.helper.setText('right', strings.TUTORIAL.EGG_PURPOSE);
				uim.startOperation('fadeIn', ['textRight']);
			break;

			case 9:
				uim.startOperation('fadeOut', ['textRight', 'right', 'ring'], true);
				this.autoAdvance();
			break;

			case 10:
				uim.syncBannersToCards();
				uim.startOperation('moveBannerIn', 1);
				uim.helper.snapTo(Math.round(5.5 * TILE_SIZE * gs.SPRITE_SCALE), Math.round(11 * TILE_SIZE * gs.SPRITE_SCALE));
				uim.helper.setText('center', strings.TUTORIAL.INTRODUCING_THE_DATA_CARD);
				uim.helper.snapRingTo(-90.0);
				uim.helper.snapArrowsOn(false, true);
				uim.startOperation('fadeIn', ['textCenter', 'ring', "center"]);
			break;

			case 11:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 12:
				this.acceptBannerInput();
				uim.helper.blockInput();
				this.stageAction = sm.doAction12;
				uim.helper.setText('center', strings.TUTORIAL.CLICK_DATA_CARD);
				uim.startOperation('fadeIn', ['textCenter']);
				uim.startOperation('turnRingTo', {angle:90, bShortest: true}, true);
			break;

			case 13:
				uim.startOperation('blendTo', {x: 702, y: 260});
				uim.startOperation('fadeOut', ['textCenter', 'center', 'arrowOut'], true);
				uim.startOperation('fadeIn', ['arrowIn'], true);
				this.autoAdvance();
			break;

			case 14:
				uim.helper.setText('bottom', strings.TUTORIAL.THIS_IS_A_HABITAT);
				uim.startOperation('fadeIn', ['textBottom', 'bottom']);
			break;

			case 15:
				uim.startOperation('fadeOut', ['textBottom', 'bottom', 'arrowIn']);
				uim.startOperation('blendTo', {x: 550, y: 260}, true);
				uim.startOperation('fadeIn', ['center', 'arrowOut'], true);
				uim.startOperation('turnRingBy', {angle:-90, bShortest: true}, true);
				this.autoAdvance();
			break;

			case 16:
				uim.helper.setText('center', strings.TUTORIAL.POPULATE_EGG_01);
				uim.startOperation('fadeIn', ['textCenter']);
				gs.selectNiche(1, 0);
				this.acceptWorldInput();
				uim.helper.blockInput();
				this.stageAction = sm.doAction16;
			break;

			case 17:
				uim.startOperation('hideFocusBanner');
				uim.closeEggChamber(uim.getFocusControlIndex());
				uim.startOperation('fadeOut', ['textCenter']);
				uim.startOperation('turnRingBy', {angle:-20, bShortest: true}, true);
				this.autoAdvance();
			break;

			case 18:
				uim.helper.setText('center', strings.TUTORIAL.YOU_MADE_A_PLANT);
				uim.startOperation('fadeIn', ['textCenter']);
			break;

			case 19:
				uim.startOperation('blendTo', {x: 702, y: 260});
				uim.startOperation('fadeOut', ['textCenter', 'center', 'arrowOut'], true);
				uim.startOperation('fadeIn', ['arrowIn'], true);
				uim.startOperation('turnRingBy', {angle:20, bShortest: true}, true);
				this.autoAdvance();
			break;

			case 20:
				uim.helper.setText('bottom', strings.TUTORIAL.BUILDING_ECOSYSTEMS_01);
				uim.startOperation('fadeIn', ['textBottom', 'bottom']);
			break;

			case 21: case 23: case 25:
				uim.startOperation('fadeOut', ['textBottom']);
				this.autoAdvance();
			break;

			case 22:
				uim.helper.setText('bottom', strings.TUTORIAL.BUILDING_ECOSYSTEMS_02);
				uim.startOperation('fadeIn', ['textBottom']);
			break;

			case 24:
				uim.helper.setText('bottom', strings.TUTORIAL.BUILDING_ECOSYSTEMS_03);
				uim.startOperation('fadeIn', ['textBottom']);
			break;

			case 26:
				uim.helper.setText('bottom', strings.TUTORIAL.BUILDING_ECOSYSTEMS_04);
				uim.startOperation('fadeIn', ['textBottom']);
				gs.getNiche(1, 0).showNextCardHint();
				uim.startOperation('turnRingBy', {angle:50, bShortest: true}, true);
			break;

			case 27:
				uim.startOperation('fadeOut', ['textBottom', 'bottom', 'arrowIn']);
				uim.startOperation('blendTo', {x: 550, y: 260}, true);
				uim.startOperation('fadeIn', ['center', 'arrowOut'], true);
				uim.startOperation('turnRingBy', {angle:-50, bShortest: true}, true);
				this.autoAdvance();
			break;

			case 28:
				uim.helper.setText('center', strings.TUTORIAL.TRY_IT_NOW);
				uim.startOperation('fadeIn', ['textCenter']);
				uim.startOperation('turnRingBy', {angle:-170, bShortest: true}, true);

				gs.seedTutorialDeck(1);
				uim.syncBannersToCards();
				uim.startOperation('moveBannerIn', 1);
				uim.clearFocusBanner();

				this.acceptBannerInput();
				uim.helper.blockInput();
				uim.openEggChamber("aves", 1);

				this.stageAction = sm.doAction12;
			break;

			case 29:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 30:
				gs.selectNiche(1, 0);
				this.acceptWorldInput();
				uim.helper.blockInput();

				uim.helper.setText('center', strings.TUTORIAL.POPULATE_HERBIVORE);
				uim.startOperation('fadeIn', ['textCenter']);
				uim.startOperation('turnRingBy', {angle:170, bShortest: true}, true);

				this.stageAction = sm.doAction16;
			break;

			case 31:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 32:
				uim.helper.setText('center', strings.TUTORIAL.POPULATION_DEFINITION_01);
				uim.startOperation('hideFocusBanner');
				uim.startOperation('fadeIn', ['textCenter'], true);
				uim.closeEggChamber(1);
			break;

			case 33:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 34:
				uim.helper.setText('center', strings.TUTORIAL.POPULATION_DEFINITION_02);
				uim.startOperation('fadeIn', ['textCenter']);
			break;

			case 35:
				uim.startOperation('fadeOut', ['textCenter']);
				uim.startOperation('blendTo', {x:312, y:Math.round(11 * TILE_SIZE * gs.SPRITE_SCALE)});
				uim.startOperation('turnRingBy', {angle:-90, bShortest:true}, true);

				gs.seedTutorialDeck(2);
				uim.syncBannersToCards();
				uim.startOperation('moveBannerIn', 1);
				uim.clearFocusBanner();
				uim.openEggChamber("aves", 1);
				gs.getNiche(1, 0).showNextCardHint();

				this.autoAdvance();
			break;

			case 36:
				uim.helper.setText('center', strings.TUTORIAL.POPULATE_CARNIVORE_01);
				uim.startOperation('fadeIn', ['textCenter']);
			break;

			case 37:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 38:
				uim.helper.setText('center', strings.TUTORIAL.POPULATE_CARNIVORE_02);
				uim.startOperation('fadeIn', ['textCenter']);
				this.acceptBannerInput();
				uim.helper.blockInput();
				this.stageAction = sm.doAction12;
			break;

			case 39:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 40:
				uim.helper.setText('center', strings.TUTORIAL.POPULATE_CARNIVORE_03);
				uim.startOperation('fadeIn', ['textCenter']);
				uim.startOperation('turnRingBy', {angle:180, bShortest:true}, true);
			break;

			case 41:
				uim.startOperation('blendTo', {x: 550, y: 260});
				uim.startOperation('fadeOut', ['textCenter'], true);
				uim.startOperation('turnRingBy', {angle:-90, bShortest: true}, true);
				this.autoAdvance();
			break;

			case 42:
				uim.helper.setText('center', strings.TUTORIAL.POPULATE_CARNIVORE_04);
				uim.startOperation('fadeIn', ['textCenter']);

				gs.selectNiche(1, 0);
				this.acceptWorldInput();
				uim.helper.blockInput();
				this.stageAction = sm.doAction16;
			break;

			case 43:
				uim.startOperation('hideFocusBanner');
				uim.startOperation('turnRingBy', {angle:-170, bShortest:true}, true);
				uim.startOperation('fadeOut', ['textCenter'], true);
				gs.getNiche(1, 0).showNextCardHint();

				uim.closeEggChamber(1);
				this.autoAdvance();
			break;

			case 44:
				uim.helper.setText('center', strings.TUTORIAL.POPULATE_OMNIVORE_01);

				gs.seedTutorialDeck(3);
				uim.syncBannersToCards();
				uim.clearFocusBanner();

				uim.startOperation('fadeIn', ['textCenter']);
				uim.startOperation('moveBannerIn', 1, true);

				uim.openEggChamber('reptilia', 1);
			break;

			case 45:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 46:
				uim.helper.setText('center', strings.TUTORIAL.POPULATE_OMNIVORE_02);
				uim.startOperation('fadeIn', ['textCenter']);

				this.acceptBannerInput();
				uim.helper.blockInput();
				this.stageAction = sm.doAction12;
			break;

			case 47:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 48:
				gs.selectNiche(1, 0);
				this.acceptWorldInput();
				uim.helper.blockInput();

				uim.helper.setText('center', strings.TUTORIAL.POPULATE_OMNIVORE_03);
				uim.startOperation('fadeIn', ['textCenter']);
				uim.startOperation('turnRingBy', {angle:170, bShortest: true}, true);

				this.stageAction = sm.doAction16;
			break;

			case 49:
				uim.startOperation('hideFocusBanner');
				uim.closeEggChamber(uim.getFocusControlIndex());
				uim.startOperation('fadeOut', ['textCenter', 'arrowOut']);
				uim.startOperation('blendTo', {x:312, y:Math.round(11 * TILE_SIZE * gs.SPRITE_SCALE)});

				this.autoAdvance();
			break;

			case 50:
				uim.helper.setText('center', strings.TUTORIAL.PROCESS_EVENT_01);
				uim.startOperation('fadeIn', ['textCenter']);
				events.seedTutorialEvent();
			break;

			case 51:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 52:
				uim.helper.setText('center', strings.TUTORIAL.PROCESS_EVENT_02);
				uim.startOperation('fadeIn', ['textCenter']);
				uim.helper.blockInput();

				this.eventBiome = gs.getEventBiome();

				events.setBiome(this.eventBiome);
				uim.showEvent(this.eventBiome, events.getCurrentEventTitle(), events.getCurrentEventInfo());
				listenFor('eventExited', this);
			break;

			case 53:
				events.tagCardsForDestruction();
				listenFor('allCardsRemoved', this);
				events.destroyCards();
			break;

			case 54: case 56: case 58: case 60:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 55:
				uim.helper.setText('center', strings.TUTORIAL.PROCESS_EVENT_03);
				uim.startOperation('fadeIn', ['textCenter']);
			break;

			case 57:
				uim.helper.setText('center', strings.TUTORIAL.PROCESS_EVENT_04);
				uim.startOperation('fadeIn', ['textCenter']);
			break;

			case 59:
				uim.helper.setText('center', strings.TUTORIAL.PROCESS_EVENT_05);
				uim.startOperation('fadeIn', ['textCenter']);
			break;

			case 61:
				uim.helper.setText('center', strings.TUTORIAL.PROCESS_EVENT_06);
				uim.startOperation('fadeIn', ['textCenter']);
			break;

			case 62:
				nBiomesAffected = events.getNumBiomesAffected();
				nCardsDestroyed = events.getNumCardsDestroyed();
				uim.showInfoDialog(strings.EVENTS.BIOME_DAMAGED,
								   strings.construct(strings.EVENTS.BIOME_DAMAGE_REPORT_PLURAL, [nBiomesAffected, nCardsDestroyed]),
								   'continueTutorial01');
			break;

			/*
			case 19:
				uim.syncBannersToCards();
				uim.startOperation('showFocusBanner');
				uim.openEggChamber("plantae", uim.getFocusControlIndex());
				uim.clearFocusBanner();
				uim.startOperation('fadeOut', ['textCenter']);
				uim.startOperation('turnRingBy', {angle:-145, bShortest: true}, true);
				this.autoAdvance();
			break;

			case 20:
				uim.helper.setText('center', strings.TUTORIAL.NEW_EGG_AVAILABLE);
				uim.startOperation('fadeIn', ['textCenter']);
			break;
			*/

			default:
				unlistenFor("onHelpTapped", this);
				unlistenFor('UIoperationComplete', this);
				unlistenFor('eventExited', this);

				// TODO: transition to next state.
			break;
		}
	},

	allCardsRemoved: function(data) {
		unlistenFor('allCardsRemoved', this);
		this.nextStage();
	},

	eventExited: function(data) {
		unlistenFor('eventExited', this);
		gs.makeDisplacementDeckDrawDeck();
		this.nextStage();
	},

	UIoperationComplete: function(data) {
		var i = 0;

		if (this.bWantsNextStage) {
			this.nextStage();
		}
		else {
			this.bAcceptingInput = true;

			// Some stages auto-advance.
			for (i=0; i<this.skipStage.length; ++i) {
				if (this.stage === this.skipStage[i]) {
					this.onHelpTapped(null);
					break;
				}
			}
		}
	},

	onHelpTapped: function(data) {
		if (this.bAcceptingInput) {
			this.nextStage();
		}
		else {
			this.bWantsNextStage = true;
		}
	},
};

sm.tutorialEndEvent = {
	enter: function(data) {

	},

	update: function() {
		gs.unblockAllBiomes();
		uim.showInfoDialog(strings.EVENTS.RESOLVED,
						   strings.EVENTS.RESOLUTION_MESSAGE,
						   "tutorialEnd");
	},

	exit: function() {

	}
};

sm.tutorialEnd = {
	bAcceptingInput: false,
	bWantsNextStage: false,
	stage: 0,
	skipStage: [],
	stageAction: null,

	enter: function(data) {
		var nextBiome = null;

		listenFor('UIoperationComplete', this);
		listenFor("onHelpTapped", this);

		this.stage = -1;
		this.inputStage = 0;
		this.skipStage.length = 0;
		sm.bannerInputStages.length = 0;
		sm.worldInputStages.length = 0;
		this.bAcceptingInput = false;
		this.bWantsNextStage = false;

		this.UIoperationComplete = sm.startTutorialIntro.UIoperationComplete.bind(this);
		this.onHelpTapped = sm.startTutorialIntro.onHelpTapped.bind(this);
		this.autoAdvance = sm.startTutorialIntro.autoAdvance.bind(this);

		this.nextStage();
	},

	update: function() {

	},

	exit: function() {

	},

	nextStage: function() {
		this.bAcceptingInput = false;
		this.bWantsNextStage = false;

		if (this.stageAction) {
			this.stageAction(false);
			this.stageAction = null;
		}

		uim.disableBannerInput();
		uim.helper.unblockInput();

		++this.stage;

		switch(this.stage) {
			case 0:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 1:
				uim.helper.setText('center', strings.TUTORIAL.END_01);
				uim.startOperation('fadeIn', ['textCenter']);
			break;

			case 2:
				uim.startOperation('fadeOut', ['textCenter', 'center', 'ring']);
				this.autoAdvance();
			break;

			case 3:
				uim.helper.restNode();
				setState(sm.startGame);
			break;
		}
	},
};

sm.continueTutorial01 = {
	bAcceptingInput: false,
	bWantsNextStage: false,
	stage: 0,
	skipStage: [],
	stageAction: null,

	enter: function(data) {
		var nextBiome = null;

		listenFor('UIoperationComplete', this);
		listenFor("onHelpTapped", this);

		this.stage = -1;
		this.inputStage = 0;
		this.skipStage.length = 0;
		sm.bannerInputStages.length = 0;
		sm.worldInputStages.length = 0;
		this.bAcceptingInput = false;
		this.bWantsNextStage = false;

		this.UIoperationComplete = sm.startTutorialIntro.UIoperationComplete.bind(this);
		this.onHelpTapped = sm.startTutorialIntro.onHelpTapped.bind(this);
		this.autoAdvance = sm.startTutorialIntro.autoAdvance.bind(this);
		this.acceptBannerInput = sm.startTutorialIntro.acceptBannerInput.bind(this);
		this.acceptWorldInput = sm.startTutorialIntro.acceptWorldInput.bind(this);
		this.doAction12 = sm.doAction12.bind(this);
		this.doAction16 = sm.doAction16.bind(this);

		nextBiome = events.getNextAffectedBiome();

		gs.clearDisplacementDeck();

		listenFor('allCardsDisplaced', this);

		gs.isolateBiome(nextBiome);
		events.tagCardsForDisplacement(nextBiome);
		events.displaceCards(nextBiome);
	},

	update: function() {

	},

	exit: function() {

	},

	onBannerPressedCallback: function(button) {
		sm.handleTutorialBannerPress02(button, this.stage);
	},

	onWorldPressCallback: function() {
		sm.handleTutorialWorldPress02(null, null);
	},

	allCardsDisplaced: function(data) {
		unlistenFor('allCardsDisplaced', this);
		this.nextStage();
	},

	nextStage: function() {
		this.bAcceptingInput = false;
		this.bWantsNextStage = false;

		if (this.stageAction) {
			this.stageAction(false);
			this.stageAction = null;
		}

		uim.disableBannerInput();
		uim.helper.unblockInput();

		++this.stage;

		switch(this.stage) {
			case 0:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 1:
				uim.syncBannersToCards();
				uim.disableBannerInput();

				uim.helper.setText('center', strings.TUTORIAL.PROCESS_EVENT_07);
				uim.startOperation('fadeIn', ['textCenter']);
				uim.startOperation('moveBannerIn', 0, true);
			break;

			case 2:
				uim.startOperation('fadeOut', ['textCenter']);
				this.autoAdvance();
			break;

			case 3:
				uim.helper.setText('center', strings.TUTORIAL.PROCESS_EVENT_08);
				uim.startOperation('fadeIn', ['textCenter']);
			break;

			case 4:
				uim.startOperation('blendTo', {x: 312, y: 300});
				uim.startOperation('fadeOut', ['textCenter'], true);
				uim.startOperation('fadeIn', ['arrowOut'], true);
				uim.startOperation('turnRingBy', {angle: -90, bShortest: true}, true);
				this.autoAdvance();
			break;

			case 5:
				uim.helper.setText('center', strings.TUTORIAL.PROCESS_EVENT_09);
				uim.startOperation('fadeIn', ['textCenter']);
				gs.showNextCardHints();
				this.acceptBannerInput();
				uim.helper.blockInput();
				this.stageAction = sm.doAction1202;

				// TODO: show omnivore in egg case.
			break;

			case 6:
				uim.startOperation('fadeOut', ['textCenter']);
				uim.startOperation('turnRingBy', {angle: 90, bShortest: true}, true);
				this.autoAdvance();
			break;

			case 7:
				uim.helper.setText('center', strings.TUTORIAL.PROCESS_EVENT_10);
				uim.startOperation('fadeIn', ['textCenter']);
				
				gs.selectNiche(1, 0);
				this.acceptWorldInput();
				uim.helper.blockInput();
				this.stageAction = sm.doAction1602;
			break;

			case 8:
				uim.startOperation('fadeOut', ['textCenter', 'arrowOut']);
				uim.startOperation('hideFocusBanner', true);
				this.autoAdvance();

				// TODO: close egg case.
			break;

			case 9:
				uim.helper.setText('center', strings.TUTORIAL.PROCESS_EVENT_11);
				uim.startOperation('fadeIn', ['textCenter']);
				uim.clearFocusBanner();
			break;

			case 10:
				uim.startOperation('fadeOut', ['textCenter', 'arrowOut']);
				this.autoAdvance();
			break;

			case 11:
				uim.helper.setText('center', strings.TUTORIAL.PROCESS_EVENT_12);
				uim.startOperation('fadeIn', ['textCenter']);
				gs.unblockAllBiomes();
				gs.hideCardHints();
			break;

			case 12:
				gs.restoreOriginalDrawDeck();

				uim.showInfoDialog(strings.EVENTS.WELL_DONE,
								   strings.EVENTS.PLACED_ALL_ORGANISMS,
								   "tutorialEndEvent");
			break;
		}
	},
};

