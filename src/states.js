// Contains the enter/update/exit code for all game states.

var sm = {
	TURNS_UNTIL_EVENT: 7,

	nextState: null,
	bLastEvent: false,
	eventTimer: 0,

	setTransitionState: function(state, nextState, stateData) {
		this.nextState = nextState;
		setState(state, stateData);
	},

	clearNextState: function() {
		this.nextState = null;
	},

	isMenuState: function() {
		return currentState === sm.chooseMenuItem;
	},

	handleBannerPress: function(button) {
		if (button && button.banner) {
			uim.clearAllCursors();
			uim.setRightHint(strings.HINTS.PLACE_ORGANISM);
			button.banner.showKeywordInfo();
			gs.showAvailableBiomes(button.banner.data);
			gs.showTargetableNiches(button.banner.data);
		}
	},

	handleWorldPress: function(transReturnState, discardState) {
		var worldPressInfo = null;
		var failMsg = null;

		if (uim.hasFocusCard()) {
		 	worldPressInfo = gs.getWorldPressInfo(game.input.activePointer.x, game.input.activePointer.y);

		 	if (worldPressInfo && worldPressInfo.biome) {
		 		if (worldPressInfo.biome.isBlocked()) {
				 	uim.clearInfoText();
				 	uim.addInfoText(strings.INFO.ILLEGAL_PLACEMENT);
				 	sm.setTransitionState('wiggleFocusBanner', transReturnState);
		 		}
		 		else {
		 			failMsg = gs.populateNiche(uim.getFocusCard(), worldPressInfo.niche);
		 			if (failMsg) {
					 	uim.clearInfoText();
					 	uim.addInfoText(failMsg);
		 			}
		 			else {
		 				uim.clearInfoText();
		 				setState(discardState);
		 			}
		 		}

		 		uim.clearAllCursors();
		 	}
		 }
		 else {
		 	uim.clearInfoText();
		 	uim.addInfoText(strings.INFO.SELECT_ORGANISM);

		 	sm.setTransitionState('wiggleBanners', transReturnState);
		 }
	},

	///////////////////////////////////////////////////////////////////////////
	// Start Game
	///////////////////////////////////////////////////////////////////////////
	startGame: {
		enter: function(data) {
			uim.setupBanner(0, uim.UI_BANNER_INDEX, strings.UI.START_GAME, function() {setState("outroToStartGame"); });
			uim.setupBanner(1, uim.UI_BANNER_INDEX, strings.UI.TUTORIAL, gs.instructions.bind(gs));
			uim.setupBanner(2, uim.UI_BANNER_INDEX, strings.UI.TOGGLE_SOUND, gs.toggleSound.bind(gs));
			uim.setupBanner(3, uim.UI_BANNER_INDEX, strings.UI.TOGGLE_SOUND, null);
			uim.setupBanner(4, uim.UI_BANNER_INDEX, strings.UI.TOGGLE_SOUND, null);

			gs.resetWorld();

			listenFor('UIoperationComplete', this);
			uim.disableBannerInput();
			uim.startOperation('moveBannersIn', this);
		},

		update: function() {

		},

		exit: function() {

		},

		UIoperationComplete: function(data) {
			unlistenFor('UIoperationComplete', this);
			uim.setLeftHint(strings.UI.CHOOSE_ONE);
			setState('chooseMenuItem');
		}
	},

	chooseMenuItem: {
		enter: function(data) {
			uim.enableBannerInput();
		},

		update: function() {

		},

		exit: function() {

		},
	},

	outroToStartGame: {
		enter: function(data) {
			listenFor("UIoperationComplete", this);
			uim.startOperation("moveBannersOut", this);
		},

		update: function() {
		},

		exit: function() {

		},

		UIoperationComplete: function(data) {
			unlistenFor("UIoperationComplete", this);
			gs.startGame();
		}
	},

	///////////////////////////////////////////////////////////////////////////
	// End Game
	///////////////////////////////////////////////////////////////////////////
	startGameEnd: {
		enter: function(data) {
			uim.clearInfoText();
			uim.disableBannerInput();
			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersOut', this);
			uim.hideHint();
		},

		update: function() {},

		exit: function() {},

		UIoperationComplete: function(data) {
			unlistenFor('UIoperationComplete', this);
			uim.showInfoDialog(strings.INFO.HUMANS_ARRIVE, strings.INFO.SEE_THEIR_IMPACT, 'endGame');
		}
	},

	endGame: {
		enter: function(data) {
			sm.bLastEvent = true;
			events.seedTutorialEvent('humanSettlement');
		},

		update: function() {
			setState(sm.chooseEvent);
		},

		exit: function() {

		}
	},

	showScore: {
		bExit: false,

		enter: function(data) {
			this.bExit = true;
		},

		update: function() {
			if (this.bExit) {
				setState(sm.showRestartMenu);
			}
		},

		exit: function() {

		},
	},

	showRestartMenu: {
		enter: function(data) {
			uim.setupBanner(0, uim.UI_BANNER_INDEX, strings.UI.RESTART_GAME, function() {
				setState("hideRestartMenu");
			});
			uim.setupBanner(1, uim.UI_BANNER_INDEX, "", null);
			uim.setupBanner(2, uim.UI_BANNER_INDEX, "", null);
			uim.setupBanner(3, uim.UI_BANNER_INDEX, "", null);
			uim.setupBanner(4, uim.UI_BANNER_INDEX, "", null);

			listenFor('UIoperationComplete', this);
			uim.disableBannerInput();
			uim.startOperation('moveBannersIn');
		},

		update: function() {

		},

		exit: function() {

		},

		UIoperationComplete: function(data) {
			unlistenFor('UIoperationComplete', this);
			uim.setLeftHint(strings.UI.CHOOSE_ONE);
			setState('chooseMenuItem');
		}
	},

	hideRestartMenu: {
		enter: function(data) {
			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersOut');
		},

		update: function() {

		},

		exit: function() {

		},

		UIoperationComplete: function(data) {
			unlistenFor("UIoperationComplete", this);
			setState(sm.startGame);
		}
	},

	///////////////////////////////////////////////////////////////////////////
	// Event Resolution
	///////////////////////////////////////////////////////////////////////////
	chooseEvent: {
		eventBiome: null,

		enter: function(data) {
			this.eventBiome = gs.getEventBiome();
			gs.hideCardHints();

			events.setBiome(this.eventBiome);
			uim.showEvent(this.eventBiome, events.getCurrentEventTitle(), events.getCurrentEventInfo());
			listenFor('eventExited', this);
		},

		update: function() {
		},

		exit: function() {

		},

		eventExited: function(data) {
			unlistenFor('eventExited', this);
			gs.makeDisplacementDeckDrawDeck();

			if (this.eventBiome === null) {
				if (sm.bLastEvent) {
					setState(sm.endFinalEvent);
				}
				else {
					uim.showInfoDialog(strings.EVENTS.BIOSPHERE_SAFE,
									   strings.EVENTS.BIOME_DAMAGE_REPORT_NONE,
									   'eventEndNoDamage');
				}
			}
			else {
				setState(sm.eventDestroyCards);
			}
		}
	},

	eventDestroyCards: {
		enter: function(data) {
			uim.clearInfoText();
			uim.disableBannerInput();
			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersOut', this);
		},

		update: function() {

		},

		exit: function() {
		},

		UIoperationComplete: function(data) {
			events.tagCardsForDestruction();
			unlistenFor('UIoperationComplete', this);

			setState(sm.eventShowDestroyed);
		},
	},

	eventShowDestroyed: {
		bExit: false,

		enter: function(data) {
			this.bExit = false;
			listenFor('allCardsRemoved', this);
			listenFor('noCardsRemoved', this);
			events.destroyCards();
		},

		update: function() {
			var nBiomesAffected = events.getNumBiomesAffected();
			var nCardsDestroyed = events.getNumCardsDestroyed();

			if (this.bExit) {
				if (events.getNumBiomesAffected() === 0) {
					uim.showInfoDialog(strings.EVENTS.BIOSPHERE_SAFE,
									   strings.EVENTS.BIOME_DAMAGE_REPORT_NONE,
									   'eventEndNoDamage');
				}
				else if (events.getNumBiomesAffected() === 1) {
					if (nCardsDestroyed === 1) {
						uim.showInfoDialog(strings.EVENTS.BIOME_DAMAGED,
										   strings.construct(strings.EVENTS.BIOME_DAMAGE_REPORT_SINGULAR, [nCardsDestroyed]),
										   'eventDisplaceCards');
					}
					else {
						uim.showInfoDialog(strings.EVENTS.BIOME_DAMAGED,
										   strings.construct(strings.EVENTS.BIOME_DAMAGE_REPORT_PLURAL, [nBiomesAffected, nCardsDestroyed]),
										   'eventDisplaceCards');
					}
				}
				else {
					if (nCardsDestroyed === 1) {
						uim.showInfoDialog(strings.EVENTS.BIOMES_DAMAGED,
										   strings.construct(strings.EVENTS.BIOME_DAMAGE_REPORT_SINGULAR, [nCardsDestroyed]),
										   'eventDisplaceCards');
					}
					else {
						uim.showInfoDialog(strings.EVENTS.BIOMES_DAMAGED,
										   strings.construct(strings.EVENTS.BIOME_DAMAGE_REPORT_PLURAL, [nBiomesAffected, nCardsDestroyed]),
										   'eventDisplaceCards');
					}
				}
			}
		},

		exit: function() {
		},

		noCardsRemoved: function(data) {
			unlistenFor('allCardsRemoved', this);
			unlistenFor('noCardsRemoved', this);
			this.bExit = true;
		},

		allCardsRemoved: function(data) {
			unlistenFor('allCardsRemoved', this);
			unlistenFor('noCardsRemoved', this);
			this.bExit = true;
		}
	},

	eventDisplaceCards: {
		bExit: false,

		enter: function(data) {
			var nextBiome = null;

			this.bExit = false;
			nextBiome = events.getNextAffectedBiome();

			gs.clearDisplacementDeck();

			while (nextBiome) {
				listenFor('allCardsDisplaced', this);
				gs.isolateBiome(nextBiome);
				events.tagCardsForDisplacement(nextBiome);

				if (events.getNumCardsDisplaced()) {
					events.displaceCards(nextBiome);
					break;
				}
				else {
					nextBiome = events.getNextAffectedBiome();
				}
			}

			if (!nextBiome) {
				this.bExit = true;
			}
		},

		update: function() {
			if (this.bExit) {
				// Set up next state here.
				gs.unblockAllBiomes();
				if (sm.bLastEvent) {
					uim.showInfoDialog(strings.EVENTS.RESOLVED,
									   strings.EVENTS.RESOLUTION_MESSAGE,
									   "endFinalEvent");
				}
				else {
					uim.showInfoDialog(strings.EVENTS.RESOLVED,
									   strings.EVENTS.RESOLUTION_MESSAGE,
									   "eventEnd");
				}
			}
		},

		exit: function() {
		},

		allCardsDisplaced: function(data) {
			unlistenFor('allCardsDisplaced', this);
			setState(sm.eventStartDisplacementResolution);
		},
	},

	eventStartDisplacementResolution: {
		bExit: false,

		enter: function(data) {
			this.bExit = false;

			uim.syncBannersToCards();
			uim.disableBannerInput();

			uim.setLeftHint(strings.HINTS.CHOOSE_DISPLACED_ORGANISM);
			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersIn', this);
		},

		update: function() {

		},

		exit: function() {
		},

		UIoperationComplete: function(data) {
			unlistenFor('UIoperationComplete', this);
			setState(sm.eventResolveDisplacement);
		}
	},

	eventResolveDisplacement: {
		bExit: false,

		enter: function(data) {
			this.bExit = false;

			if (gs.playerHasLegalMove(false)) {
				uim.enableBannerInput();
				gs.showNextCardHints();
			}
			else {
				this.bExit = true;
			}
		},

		update: function() {
			if (this.bExit) {
				uim.disableBannerInput();

				if (!gs.doPlaysRemainInDrawDeck()) {
					uim.showInfoDialog(strings.INFO.NO_MORE_MOVES, strings.EVENTS.WILL_DISCARD_REMAINING_ORGANISMS, 'eventCloseBannersAndDisplace');
				}
				else {
					uim.setLeftHint('');
					uim.showInfoDialog(strings.INFO.OUT_OF_PLAYS, strings.INFO.RESHUFFLE_AND_TRY_AGAIN, 'eventReshuffle');
				}
			}
		},

		exit: function() {
		},

		onBannerPressedCallback: function(button) {
			sm.handleBannerPress(button);
		},

		onWorldPressCallback: function() {
			sm.handleWorldPress('eventResolveDisplacement', 'eventDiscard');
		},
	},

	eventCloseBannersAndDisplace: {
		bExit: false,

		enter: function(data) {
			this.bExit = false;
			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersOut');
		},

		update: function() {
			if (this.bExit) {
				setState(sm.eventDisplaceCards);
			}
		},

		exit: function() {

		},

		UIoperationComplete: function() {
			unlistenFor('UIoperationComplete', this);
			this.bExit = true;
		}
	},

	eventReshuffle: {
		enter: function(data) {
			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersOut');
		},

		update: function() {
		},

		exit: function() {

		},

		UIoperationComplete: function() {
			unlistenFor('UIoperationComplete', this);
			gs.shuffleDrawDeck();
			setState(sm.eventStartDisplacementResolution);
		}
	},

	eventDiscard: {
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
			unlistenFor('UIoperationComplete', this);

			if (gs.doPlaysRemainInDrawDeck()) {
				if (gs.discardAndReplace(uim.getFocusCard())) {
					setState('eventDraw');
				}
				else {
					// No cards left in deck. Check to see if legal
					// plays remain.
					uim.clearFocusBanner();

					if (gs.playerHasLegalMove(false)) {
						uim.setLeftHint(strings.HINTS.CHOOSE_EGG);
						uim.enableBannerInput();
						setState('eventResolveDisplacement');
					}
					else {
						if (gs.drawDeckExhausted()) {
							uim.showInfoDialog(strings.EVENTS.WELL_DONE,
											   strings.EVENTS.PLACED_ALL_ORGANISMS,
											   "eventDisplaceCards");
						}
						else {
							// TODO: transition to next biome.
							// If this is the last biome, transition
							// back to normal game.
							uim.setLeftHint('');
							gs.shuffleDrawDeck();
							uim.showInfoDialog(strings.INFO.OUT_OF_PLAYS, strings.INFO.RESHUFFLE_AND_TRY_AGAIN, 'eventResolveDisplacement');
						}
					}
				}
			}
			else {
				uim.showInfoDialog(strings.INFO.NO_MORE_MOVES, strings.EVENTS.WILL_DISCARD_REMAINING_ORGANISMS, 'eventCloseBannersAndDisplace');
			}
		},
	},

	eventDraw: {
		enter: function(data) {
			listenFor('UIoperationComplete', this);
			uim.startOperation('showFocusBanner');
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
			unlistenFor('UIoperationComplete', this);

			uim.enableBannerInput();
			setState('eventResolveDisplacement');
		},
	},

	endFinalEvent: {
		enter: function(data) {
		},

		update: function() {
			setState(sm.showScore);
		},

		exit: function() {
			gs.restoreOriginalDrawDeck();
		},
	},

	eventEnd: {
		enter: function(data) {
			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersOut');
			uim.setLeftHint('');
		},

		update: function() {

		},

		exit: function() {

		},

		UIoperationComplete: function(data) {
			unlistenFor('UIoperationComplete', this);

			gs.restoreOriginalDrawDeck();

			// TODO: start phase two without reshuffling the draw deck!
			sm.setTransitionState("startPhaseTwo", "phaseTwo");

			// TODO: if this is the final event, go to game over.
		}
	},

	eventEndNoDamage: {
		enter: function(data) {
			gs.restoreOriginalDrawDeck();
		},

		update: function() {
			sm.setTransitionState("startPhaseTwo", "phaseTwo");
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
		PROMPT_DELAY_MS: 2000,
		promptTimer: 0,
		bCanShowPrompt: true,

		enter: function(data) {
			listenFor('infoDialogOut', this);
			listenFor('hideInfoText', this);

			this.bCanShowPrompt = true;

			assert(data && data.title && data.text, "showInfoDialog: invalid text data!");

			this.promptTimer = 0;
			uim.startInfoDialog(data.title, data.text);
			uim.blockInput();
		},

		update: function() {
			var oldTime = this.promptTimer;

			this.promptTimer += game.time.physicsElapsedMS;

			if (this.bCanShowPrompt && oldTime < this.PROMPT_DELAY_MS && this.promptTimer >= this.PROMPT_DELAY_MS) {
				uim.showInfoPrompt();
			}
		},

		exit: function() {
		},

		hideInfoText: function(data) {
			this.bCanShowPrompt = false;
		},

		infoDialogOut: function(data) {
			uim.unblockInput();
			unlistenFor('infoDialogOut', this);
			unlistenFor('hideInfoText', this);

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
	startPhaseTwo: {
		bExit: false,

		enter: function(data) {
			this.bExit = false;
			sm.eventTimer = 0;

			if (gs.doPlaysRemainInDrawDeck()) {
				uim.syncBannersToCards();
				uim.clearFocusBanner();

				gs.setPhaseOne(false);

				uim.setLeftHint(strings.HINTS.CHOOSE_EGG);
				listenFor('UIoperationComplete', this);
				uim.startOperation('moveBannersIn', this);
			}
			else {
				this.bExit = true;
			}
		},

		update: function() {
			if (this.bExit) {
				uim.showInfoDialog(strings.INFO.GAME_OVER, strings.INFO.NO_MORE_PLAYS, 'endGame');
			}
		},

		exit: function() {
			unlistenFor('UIoperationComplete', this);

			gs.postPopulationProgress();
			gs.postDeckProgress();
		},

		onPushed: function() {
			unlistenFor('UIoperationComplete', this);
		},

		onPopped: function() {
			listenFor('UIoperationComplete', this);
		},

		UIoperationComplete: function(data) {
			unlistenFor('UIoperationComplete', this);
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
			sm.handleBannerPress(button);
		},

		onWorldPressCallback: function() {
			sm.handleWorldPress('phaseTwo', 'phaseTwoDiscard');
		},
	},

	phaseTwoDiscard: {
		// TODO: Trigger extinction events every 7 discards.
		enter: function(data) {
			uim.disableBannerInput();
			listenFor('UIoperationComplete', this);
			uim.startOperation('hideFocusBanner', this);
			sm.eventTimer += 1;
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
			unlistenFor('UIoperationComplete', this);

			if (gs.discardAndReplace(uim.getFocusCard())) {
				if (gs.doPlaysRemainInDrawDeck()) {
					setState('phaseTwoDraw');
				}
				else {
					setState(sm.startGameEnd);
				}
			}
			else {
				uim.clearFocusBanner();

				if (gs.doPlaysRemainInDrawDeck()) {
					if (gs.playerHasLegalMove(false)) {
						if (sm.eventTimer === sm.TURNS_UNTIL_EVENT) {
							setState(sm.chooseEvent);
						}
						else {
							uim.setLeftHint(strings.HINTS.CHOOSE_EGG);
							uim.enableBannerInput();
							setState('phaseTwo');
						}
					}
					else {
						uim.setLeftHint('');
						uim.showInfoDialog(strings.INFO.OUT_OF_PLAYS, strings.INFO.RESHUFFLE_AND_TRY_AGAIN, 'phaseTwoReshuffle');
					}
				}
				else {
					setState(sm.startGameEnd);
				}
			}
		},
	},

	phaseTwoReshuffle: {
		enter: function(data) {
			assert(gs.doPlaysRemainInDrawDeck(), "phaseTwoReshuffle.enter: no plays remain in draw deck!");

			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersOut');
		},

		update: function() {
		},

		exit: function() {

		},

		UIoperationComplete: function() {
			unlistenFor('UIoperationComplete', this);

			gs.shuffleDrawDeck();
			if (sm.eventTimer === sm.TURNS_UNTIL_EVENT) {
				setState(sm.chooseEvent);
			}
			else {
				sm.setTransitionState('startPhaseTwo', 'phaseTwo');
			}
		}
	},

	phaseTwoDraw: {
		enter: function(data) {
			assert(gs.doPlaysRemainInDrawDeck(), "phaseTwoReshuffle.enter: no plays remain in draw deck!");
			
			listenFor('UIoperationComplete', this);
			uim.startOperation('showFocusBanner');
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
			unlistenFor('UIoperationComplete', this);
			
			if (gs.playerHasLegalMove(false)) {
				if (sm.eventTimer === sm.TURNS_UNTIL_EVENT) {
					setState(sm.chooseEvent);
				}
				else {
					uim.enableBannerInput();
					setState('phaseTwo');
				}
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
	startPhaseOne: {
		enter: function(data) {
			gs.shuffleDrawDeck();
			uim.syncBannersToCards();

			sm.bLastEvent = false;

			gs.setPhaseOne(true);

			uim.setLeftHint(strings.HINTS.CHOOSE_EGG);
			uim.disableBannerInput();
			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersIn');
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
			unlistenFor('UIoperationComplete', this);
			
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
			sm.handleBannerPress(button);
		},

		onWorldPressCallback: function() {
			sm.handleWorldPress('phaseOne', 'phaseOneDiscard');
		}
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
			unlistenFor('UIoperationComplete', this);
			
			if (gs.discardAndReplace(uim.getFocusCard())) {
				if (gs.doPlaysRemainInDrawDeck()) {
					if (gs.playerHasLegalMove(true)) {
						setState('phaseOneDraw');
					}
					else {
						uim.setLeftHint('');
						uim.showInfoDialog(strings.INFO.OUT_OF_PLAYS, strings.INFO.RESHUFFLE_AND_TRY_AGAIN, 'phaseOneReshuffle');
					}
				}
				else {
					setState('endPhaseOne');
				}
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

	phaseOneReshuffle: {
		enter: function(data) {
			assert(gs.doPlaysRemainInDrawDeck(), "phaseOneReshuffle.enter: no plays remain in draw deck!");

			listenFor('UIoperationComplete', this);
			uim.startOperation('moveBannersOut');
		},

		update: function() {
		},

		exit: function() {

		},

		UIoperationComplete: function() {
			unlistenFor('UIoperationComplete', this);

			gs.shuffleDrawDeck();
			if (sm.eventTimer === sm.TURNS_UNTIL_EVENT) {
				setState(sm.chooseEvent);
			}
			else {
				sm.setTransitionState('startPhaseOne', 'phaseOne');
			}
		}
	},

	phaseOneDraw: {
		enter: function(data) {
			uim.setLeftHint(strings.HINTS.CHOOSE_EGG);
			listenFor('UIoperationComplete', this);
			uim.startOperation('showFocusBanner');
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
			unlistenFor('UIoperationComplete', this);
			
			if (gs.playerHasLegalMove(true)) {
				uim.enableBannerInput();
				setState('phaseOne');
			}
			else {
				setState('endPhaseOne');
			}
		},
	},

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
			unlistenFor('UIoperationComplete', this);
			
			gs.removeInsectsAndNematodes();
			gs.addPhaseTwoCards();
			gs.shuffleDrawDeck();

			sm.setTransitionState('startPhaseTwo', 'phaseTwo');
		},
	},
}
