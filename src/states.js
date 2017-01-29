// Contains the enter/update/exit code for all game states.

var sm = {
	nextState: null,
	eventBiome: null,

	setTransitionState: function(state, nextState, stateData) {
		this.nextState = nextState;
		setState(state, stateData);
	},

	clearNextState: function() {
		this.nextState = null;
	},

	///////////////////////////////////////////////////////////////////////////
	// End Game
	///////////////////////////////////////////////////////////////////////////
	endGame: {
		enter: function(data) {
			console.log("GAME OVER!");
		},

		update: function() {

		},

		exit: function() {

		}
	},

	///////////////////////////////////////////////////////////////////////////
	// Event Resolution
	///////////////////////////////////////////////////////////////////////////
	chooseEvent: {
		enter: function(data) {
			sm.eventBiome = gs.getEventBiome();
			uim.showEvent(sm.eventBiome, events.getCurrentEventTitle(), events.getCurrentEventInfo());
			listenFor('eventExited', this);
		},

		update: function() {

		},

		exit: function() {

		},

		eventExited: function(data) {
			unlistenFor('eventExited', this);
			setState(sm.applyEvent);
		}
	},

	applyEvent: {
		enter: function(data) {
			uim.disableBannerInput();
			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersOut', this);
		},

		update: function() {

		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			listenFor('eventApplied', this);
			uim.clearInfoText();
			uim.addInfoText(strings.EVENTS.LOST);

			events.applyCurrent(sm.eventBiome);
		},

		eventResolved: function(data) {
			unlistenFor('eventApplied', this);
			setState(sm.resolveEvent);
		},
	},

	resolveEvent: {
		enter: function(data) {

		},

		update: function() {

		},

		exit: function() {

		},
	},

	discussEvent: {
		enter: function(data) {

		},

		update: function() {

		},

		exit: function() {

		},
	},

	///////////////////////////////////////////////////////////////////////////
	// UI Messaging
	///////////////////////////////////////////////////////////////////////////
	// wiggleFocusBanner must be invoked with setTransitionState()!
	wiggleFocusBanner: {
		enter: function(data) {
			uim.disableBannerInput();
			listenFor('UIoperationComplete', this);
			uim.startOperation('wiggleFocusBanner');
		},

		update: function() {

		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			setState(sm.nextState);
		},
	},

	// wiggleBanners must be invoked with setTransitionState()!
	wiggleBanners: {
		enter: function(data) {
			uim.disableBannerInput();
			listenFor('UIoperationComplete', this);
			uim.startOperation('wiggleBanners');
		},

		update: function() {
		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			setState(sm.nextState);
		},
	},

	// showInfoDialog must be invoked with setTransitionState()!
	showInfoDialog: {
		enter: function(data) {
			listenFor('infoDialogOut', this);

			assert(data && data.title && data.text, "showInfoDialog: invalid text data!");

			uim.startInfoDialog(data.title, data.text);
			uim.blockInput();
		},

		update: function() {
		},

		exit: function() {
		},

		infoDialogOut: function(data) {
			uim.unblockInput();
			unlistenFor('infoDialogOut', this);

			if (sm.nextState) {
				setState(sm.nextState);
			}
			else {
				popState();
			}
		}
	},

	///////////////////////////////////////////////////////////////////////////
	// Phase Two
	///////////////////////////////////////////////////////////////////////////
	phaseTwoStart: {
		enter: function(data) {
			gs.shuffleDrawDeck();
			uim.syncBannersToCards();

			gs.setPhaseOne(false);

			uim.setLeftHint(strings.HINTS.CHOOSE_EGG);
			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersIn', this);
		},

		update: function() {

		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPushed: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPopped: function() {
			listenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			setState(sm.nextState);
		}
	},

	phaseTwo: {
		enter: function(data) {
			uim.enableBannerInput();
			gs.showNextCardHints();
		},

		update: function() {
		},

		exit: function() {

		},

		onBannerPressedCallback: function(button) {
			if (button && button.banner) {
				uim.clearAllCursors();
				uim.setRightHint(strings.HINTS.PLACE_ORGANISM);
				button.banner.showKeywordInfo();
				gs.showAvailableBiomes(button.banner.data);
				gs.showTargetableNiches(button.banner.data);
			}
		},

		onWorldPressCallback: function() {
			var worldPressInfo = null;
			var failMsg = null;

			if (uim.hasFocusCard()) {
			 	worldPressInfo = gs.getWorldPressInfo(game.input.activePointer.x, game.input.activePointer.y);

			 	if (worldPressInfo && worldPressInfo.biome) {
			 		if (worldPressInfo.biome.isBlocked()) {
					 	uim.clearInfoText();
					 	uim.addInfoText(strings.INFO.ILLEGAL_PLACEMENT);
					 	sm.setTransitionState('wiggleFocusBanner', 'phaseTwo');
			 		}
			 		else {
			 			failMsg = gs.populateNiche(uim.getFocusCard(), worldPressInfo.niche);
			 			if (failMsg) {
						 	uim.clearInfoText();
						 	uim.addInfoText(failMsg);
			 			}
			 			else {
			 				uim.clearInfoText();
			 				setState('phaseTwoDiscard');
			 			}
			 		}

			 		uim.clearAllCursors();
			 	}
			 }
			 else {
			 	uim.clearInfoText();
			 	uim.addInfoText(strings.INFO.SELECT_ORGANISM);

			 	sm.setTransitionState('wiggleBanners', 'phaseTwo');
			 }
		},
	},

	phaseTwoDiscard: {
		// TODO: Trigger extinction events every 7 discards.
		enter: function(data) {
			uim.disableBannerInput();
			listenFor('UIoperationComplete', this);
			uim.startOperation('hideFocusBanner', this);
		},

		update: function() {
		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPushed: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPopped: function() {
			listenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			if (gs.discardAndReplace(uim.getFocusCard())) {
				setState('phaseTwoDraw');
			}
			else {
				uim.clearFocusBanner();

				if (gs.playerHasLegalMove(false)) {
					uim.setLeftHint(strings.HINTS.CHOOSE_EGG);
					uim.enableBannerInput();
					setState('phaseTwo');
				}
				else {
					uim.setLeftHint('');
					uim.showInfoDialog(strings.INFO.OUT_OF_PLAYS, strings.INFO.RESHUFFLE_AND_TRY_AGAIN, 'phaseTwoReshuffle');
				}
			}
		},
	},

	phaseTwoReshuffle: {
		enter: function(data) {
			uim.startOperation('moveBannersOut');
			listenFor('UIoperationComplete', this);
		},

		update: function() {
		},

		exit: function() {

		},

		UIoperationComplete: function() {
			unlistenFor('UIoperationComplete', this);

			if (!gs.doPlaysRemainInDrawDeck()) {
				uim.showInfoDialog(strings.INFO.GAME_OVER, strings.INFO.NO_MORE_PLAYS, 'endGame');
			}
			else {
				gs.shuffleDrawDeck();
				sm.setTransitionState('phaseTwoStart', 'phaseTwo');
			}
		}
	},

	phaseTwoDraw: {
		enter: function(data) {
			uim.startOperation('showFocusBanner');
			listenFor('UIoperationComplete', this);
			uim.setLeftHint(strings.HINTS.CHOOSE_EGG);
			uim.clearFocusBanner();
		},

		update: function() {

		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);
			uim.enableBannerInput();
		},

		onPushed: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPopped: function() {
			listenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			if (gs.playerHasLegalMove(false)) {
				uim.enableBannerInput();
				setState('phaseTwo');
			}
			else {
				uim.setLeftHint('');
				uim.showInfoDialog(strings.INFO.OUT_OF_PLAYS, strings.INFO.RESHUFFLE_AND_TRY_AGAIN, 'phaseTwoReshuffle');
			}
		},
	},

	///////////////////////////////////////////////////////////////////////////
	// Phase One
	///////////////////////////////////////////////////////////////////////////
	endPhaseOne: {
		enter: function(data) {
			uim.disableBannerInput();
			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersOut', this);
		},

		update: function() {

		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPushed: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPopped: function() {
			listenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			gs.removeInsectsAndNematodes();
			gs.addPhaseTwoCards();
			sm.setTransitionState('phaseTwoStart', 'phaseTwo');
		},
	},

	phaseOneDiscard: {
		enter: function(data) {
			uim.disableBannerInput();
			listenFor('UIoperationComplete', this);
			gs.blockBiomes(null);
			uim.startOperation('hideFocusBanner', this);
		},

		update: function() {
		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPushed: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPopped: function() {
			listenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			if (gs.discardAndReplace(uim.getFocusCard())) {
				setState('phaseOneDraw');
			}
			else {
				if (gs.playerHasLegalMove(true)) {
					uim.setLeftHint(strings.HINTS.CHOOSE_EGG);
					uim.clearFocusBanner();
					uim.enableBannerInput();
					setState('phaseOne');
				}
				else {
					setState('endPhaseOne');
				}
			}
		},
	},

	phaseOneDraw: {
		enter: function(data) {
			uim.setLeftHint(strings.HINTS.CHOOSE_EGG);
			uim.startOperation('showFocusBanner');
			listenFor('UIoperationComplete', this);
			uim.clearFocusBanner();
		},

		update: function() {

		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);
			uim.enableBannerInput();
		},

		onPushed: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPopped: function() {
			listenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			if (gs.playerHasLegalMove(true)) {
				uim.enableBannerInput();
				setState('phaseOne');
			}
			else {
				setState('endPhaseOne');
			}
		},
	},

	startPhaseOne: {
		enter: function(data) {
			gs.shuffleDrawDeck();
			uim.syncBannersToCards();

			gs.setPhaseOne(true);

			uim.setLeftHint(strings.HINTS.CHOOSE_EGG);
			uim.disableBannerInput();
			uim.startOperation('moveBannersIn');
			listenFor('UIoperationComplete', this);
		},

		update: function() {

		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPushed: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPopped: function() {
			listenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			setState('phaseOne');
		},
	},

	phaseOne: {
		enter: function(data) {
			uim.enableBannerInput();
			gs.showNextCardHints();
		},

		update: function() {
		},

		exit: function() {

		},

		onBannerPressedCallback: function(button) {
			if (button && button.banner) {
				uim.clearAllCursors();
				button.banner.showKeywordInfo();
				gs.showAvailableBiomes(button.banner.data);
				gs.showTargetableNiches(button.banner.data);
				uim.setRightHint(strings.HINTS.PLACE_ORGANISM);
			}
		},

		onWorldPressCallback: function() {
			var worldPressInfo = null;
			var failMsg = null;

			if (uim.hasFocusCard()) {
			 	worldPressInfo = gs.getWorldPressInfo(game.input.activePointer.x, game.input.activePointer.y);

			 	if (worldPressInfo && worldPressInfo.biome) {
			 		if (worldPressInfo.biome.isBlocked()) {
					 	uim.clearInfoText();
					 	uim.addInfoText(strings.INFO.ILLEGAL_PLACEMENT);
					 	sm.setTransitionState('wiggleFocusBanner' ,'phaseOne');
			 		}
			 		else {
			 			failMsg = gs.populateNiche(uim.getFocusCard(), worldPressInfo.niche);
			 			if (failMsg) {
						 	uim.clearInfoText();
						 	uim.addInfoText(failMsg);
			 			}
			 			else {
			 				uim.clearInfoText();
			 				setState('phaseOneDiscard');
			 			}
			 		}

			 		uim.clearAllCursors();
			 	}
			 }
			 else {
			 	uim.clearInfoText();
			 	uim.addInfoText(strings.INFO.SELECT_ORGANISM);

			 	sm.setTransitionState('wiggleBanners', 'phaseOne');
			 }
		},
	}
}
