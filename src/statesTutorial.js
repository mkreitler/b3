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

sm.startTutorialIntro = {
	bAcceptingInput: false,
	bWantsNextStage: false,
	stage: 0,

	enter: function(data) {
		uim.enableBannerInput();
		listenFor('UIoperationComplete', this);
		listenFor("onHelpTapped", this);

		this.stage = 0;
		this.bAcceptingInput = false;
		this.bWantsNextStage = false;

		uim.helper.snapTo(720, 400);
		uim.helper.snapArrowsOff(true, false);
		uim.helper.setText('center', strings.TUTORIAL.WELCOME_TERRAFORMER_AND_TAPOUT);
		uim.helper.snapOut(['arrowOut', 'arrowIn']);

		uim.startOperation('fadeIn', ['center', 'ring']);
	},

	update: function() {

	},

	exit: function() {
	},

	nextStage: function() {
		this.bAcceptingInput = false;
		this.bWantsNextStage = false;
		++this.stage;

		switch(this.stage) {
			case 1:
				uim.startOperation('fadeIn', ['arrowOut']);
				uim.startOperation('fadeOut', ['textCenter'], true);
			break;

			case 2:
				uim.helper.setText('center', strings.TUTORIAL.THIS_IS_YOUR_BIOSPHERE);
				uim.startOperation('fadeIn', ['textCenter']);
				uim.startOperation('turnRingBy', {angle: 360.0, bShortest: false}, true);
			break;

			default:
				unlistenFor("onHelpTapped", this);
				unlistenFor('UIoperationComplete', this);

				// TODO: transition to next state.
			break;
		}
	},

	UIoperationComplete: function(data) {
		if (this.bWantsNextStage) {
			this.nextStage();
		}
		else {
			this.bAcceptingInput = true;

			// Some stages auto-advance.
			if (this.stage === 1) {
				this.onHelpTapped(null);
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

