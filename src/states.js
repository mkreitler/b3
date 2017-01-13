// Contains the enter/update/exit code for all game states.

var sm = {
	nextState: null,

	setTransitionState: function(state, nextState) {
		this.nextState = nextState;
		setState(state);
	},

	wiggleFocusBanner: {
		enter: function() {
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

	wiggleBanners: {
		enter: function() {
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

	phaseOneDiscard: {
		enter: function() {
			uim.disableBannerInput();
			listenFor('UIoperationComplete', this);
			uim.startOperation('hideFocusBanner', this);
		},

		update: function() {
		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			if (gs.discardAndReplace(uim.getFocusCard())) {
				setState('phaseOneDraw');
			}
			else {
				if (gs.playerHasLegalMove()) {
					uim.clearFocusBanner();
					uim.enableBannerInput();
					setState('phaseOne');
				}
				else {
					assert(false, "phaseOneDiscard.UIoperationComplete: player out of moves!");
				}
			}
		},
	},

	phaseOneDraw: {
		enter: function() {
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

		UIoperationComplete: function(data) {
			if (gs.playerHasLegalMove()) {
				uim.enableBannerInput();
				setState('phaseOne');
			}
			else {
				assert(false, "phaseOneDraw.UIoperationComplete: player out of moves!");
			}
		},
	},

	startPhaseOne: {
		enter: function() {
			gs.initDrawDeck();
			gs.initDiscardDeck();
			uim.syncBannersToCards();

			uim.disableBannerInput();
			uim.startOperation('moveBannersIn');
			listenFor('UIoperationComplete', this);
		},

		update: function() {

		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			setState('phaseOne');
		},
	},

	phaseOne: {
		enter: function() {
			uim.enableBannerInput();
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
				gs.showTargetableBiomes(button.banner.data);
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
