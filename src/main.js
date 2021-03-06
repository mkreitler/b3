var TILE_SIZE = 24;
var MAX_WINDOW_X = 1024;
var MAX_WINDOW_Y = 768;
var N_BIOMES = 5;
var LAYER_OFFSET = 3;
var SHADOW_OFFSET = 4;
var TILE_OFFSET_X = TILE_SIZE / 6;
var TILE_OFFSET_Y = TILE_SIZE / 6;

var tilesX = Math.floor(MAX_WINDOW_X / TILE_SIZE);
var tilesY = Math.floor(MAX_WINDOW_Y / TILE_SIZE);
var windowDx = tilesX * TILE_SIZE;
var windowDy = tilesY * TILE_SIZE;
var infoText = null;
var row = -1;
var col = -1;
var currentState = null;
var nextState = null;
var stateData = null;
var suspendedStates = [];
var suspendData = {state: null, data: null};
var bWantsStateChange = false;
var bWantsStatePush = false;
var bWantsStatePop = false;
var switchboard = {};

var game = new Phaser.Game(MAX_WINDOW_X, MAX_WINDOW_Y, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function listenFor(msg, listener) {
	var listeners = switchboard[msg];
	var bAdded = false;

	if (!listeners) {
		listeners = [];
		switchboard[msg] = listeners;
	}

	if (listeners.indexOf(listener) < 0) {
		for (i=0; i<listeners.length; ++i) {
			if (!listeners[i]) {
				listeners[i] = listener;
				bAdded = true;
				break;
			}
		}

		if (!bAdded) {
			listeners.push(listener);
		}
	}
}

function unlistenAll(listener) {
	var msg = null;
	var listeners = null;

	for (msg in switchboard) {
		this.unlistenFor(msg, listener);
	}
}

function unlistenFor(msg, listener) {
	var listeners = switchboard[msg];

	if (listeners && listeners.indexOf(listener) >= 0) {
		listeners[listeners.indexOf(listener)] = null;
	}
}

function broadcast(msg, data) {
	var listeners = switchboard[msg];
	var i = 0;
	var listener = null;

	if (listeners) {
		for (i=0; i<listeners.length; ++i) {
			listener = listeners[i];
			if (listener && listener[msg]) {
				listener[msg](data);
			}
		}
	}
}

// LOL API ////////////////////////////////////////////////////////////////////
function onPauseMainScreen() {
	// console.log("<<< Pausing main screen >>>");
	game.sound.pauseAll();
	game.paused = true;
}

function onResumeMainScreen() {
	// console.log("<<< Resuming main screen >>>");
	game.paused = false;
	game.sound.resumeAll();
}

function onPauseOther() {
	// console.log("<<< Pausing other stuff >>>");
	game.paused = true;
}

function onResumeOther() {
	// console.log("<<< Resuming other stuff >>>");
	game.paused = false;
}

// End LOL API ////////////////////////////////////////////////////////////////

function preload() {
	// Tilemaps
	game.load.image('world_ff', './res/tilesets/oryx_16bit_fantasy_world_trans.png', false);
	game.load.image('world_sf', './res/tilesets/oryx_16bit_scifi_world_trans.png', false);
	game.load.tilemap('globe', './res/tilesets/world.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap('base', './res/tilesets/base.json', null, Phaser.Tilemap.TILED_JSON);

	// Images
	game.load.image('noSelectLarge', './res/ui/noSelectLarge.png', false);
	game.load.image('eventMarker', './res/ui/eventMarker.png', false);
	game.load.image('eventInfo', './res/ui/eventInfo.png', false);
	game.load.image('infoShield', './res/ui/infoShield.png', false);
	game.load.image('infoPanel', './res/ui/infoPanel.png', false);
	game.load.image('saved', './res/ui/saved.png', false);
	game.load.image('reseeded', './res/ui/reseeded.png', false);
	game.load.image('adapted', './res/ui/adapted.png', false);
	game.load.image('migrated', './res/ui/migrated.png', false);
	game.load.image('displaced', './res/ui/displaced.png', false);
	game.load.image('eventResults', './res/ui/results.png', false);
	game.load.image('splash', './res/title.png', false);
	game.load.image('closeButton', './res/ui/closeButton.png', false);
	game.load.image('choiceDialog', './res/ui/choiceDialog.png', false);

	// Help System Images
	game.load.image('helperCenter', './res/ui/helperCenter.png', false);
	game.load.image('helperRing', './res/ui/helperRing.png', false);
	game.load.image('helperArrowOut', './res/ui/helperArrowOut.png', false);
	game.load.image('helperArrowIn', './res/ui/helperArrowIn.png', false);
	game.load.image('helperTop', './res/ui/helperTop.png', false);
	game.load.image('helperRight', './res/ui/helperRight.png', false);
	game.load.image('helperBottom', './res/ui/helperBottom.png', false);
	game.load.image('helperLeft', './res/ui/helperLeft.png', false);

	// Spritesheets
	game.load.spritesheet('ui_buttons', './res/ui/buttons.png', 315, 79);
	game.load.spritesheet('ui_buttons_g', './res/ui/buttons_g.png', 324, 98);
	game.load.spritesheet('ui_specials', './res/ui/specials.png', 24, 24);
	game.load.spritesheet('items_ff', './res/tilesets/oryx_16bit_fantasy_items_trans.png', 16, 16);
	game.load.spritesheet('cursor', './res/ui/cursor.png', 48, 96);
	game.load.image('ui_frame_right', './res/ui/frameRight.png');
	game.load.image('ui_frame_top', './res/ui/frameTop.png');

	// Fonts
	game.load.bitmapFont('smallbogboo', './res/fonts/bogboosmall.png', './res/fonts/bogboosmall.xml');	
	game.load.bitmapFont('bogboo', './res/fonts/bogboomid.png', './res/fonts/bogboomid.xml');	

    // Audio
    game.load.audio('uiButton', ['./res/uiSoundsEGG/exported/button5.ogg', './res/uiSoundsEGG/exported/button5.mp3']);
    game.load.audio('uiButtonHi', ['./res/uiSoundsEGG/exported/button4.ogg', './res/uiSoundsEGG/exported/button4.mp3']);
    game.load.audio('uiButtonLo', ['./res/uiSoundsEGG/exported/displace2.ogg', './res/uiSoundsEGG/exported/displace2.mp3']);
    game.load.audio('displace', ['./res/uiSoundsEGG/exported/destroy1.ogg', './res/uiSoundsEGG/exported/destroy1.mp3']);
    game.load.audio('destroy', ['./res/uiSoundsEGG/exported/displace1.ogg', './res/uiSoundsEGG/exported/displace1.mp3']);
    game.load.audio('event', ['./res/uiSoundsEGG/exported/event1.ogg', './res/uiSoundsEGG/exported/event1.mp3']);
    game.load.audio('eventReveal', ['./res/uiSoundsEGG/exported/event3.ogg', './res/uiSoundsEGG/exported/event3.mp3']);
    game.load.audio('info', ['./res/uiSoundsEGG/exported/info1.ogg', './res/uiSoundsEGG/exported/info1.mp3']);
    game.load.audio('infoReveal', ['./res/uiSoundsEGG/exported/event2.ogg', './res/uiSoundsEGG/exported/event2.mp3']);
    game.load.audio('dialogClose', ['./res/uiSoundsEGG/exported/dialogClose.ogg', './res/uiSoundsEGG/exported/dialogClose.mp3']);
    game.load.audio('score', ['./res/uiSoundsEGG/exported/score1.ogg', './res/uiSoundsEGG/exported/score1.mp3']);
    game.load.audio('phaseSwitch', ['./res/uiSoundsEGG/exported/phaseSwitch.ogg', './res/uiSoundsEGG/exported/phaseSwitch.mp3']);
    game.load.audio('reportOpen', ['./res/uiSoundsEGG/exported/event5.ogg', './res/uiSoundsEGG/exported/event5.mp3']);

    // Sounds
}

function create() {
	var key = null;

	gs.biomeMap = game.add.tilemap('globe');
	gs.biomeMap.addTilesetImage('ff_world', 'world_ff', 24, 24);
	gs.biomeMap.addTilesetImage('sf_world', 'world_sf', 24, 24);

	gs.baseMap = game.add.tilemap('base');
	gs.baseMap.addTilesetImage('sf_world', 'world_sf', 24, 24);
	gs.baseMap.addTilesetImage('ff_world', 'world_ff', 24, 24);

	gs.sounds.button = game.add.audio('uiButton');
	gs.sounds.buttonHi = game.add.audio('uiButtonHi');
	gs.sounds.buttonLo= game.add.audio('uiButtonLo');
	gs.sounds.destroy = game.add.audio('destroy');
	gs.sounds.displace = game.add.audio('displace');
	gs.sounds.event = game.add.audio('event');
	gs.sounds.eventReveal = game.add.audio('eventReveal');
	gs.sounds.info = game.add.audio('info');
	gs.sounds.infoReveal = game.add.audio('infoReveal');
	gs.sounds.dialogClose = game.add.audio('dialogClose');
	gs.sounds.score = game.add.audio('score');
	gs.sounds.phaseSwitch = game.add.audio('phaseSwitch');
	gs.sounds.reportOpen = game.add.audio('reportOpen');

	gs.layers.crust 		= gs.biomeMap.createLayer('Crust');
	gs.layers.terrain 		= gs.biomeMap.createLayer('Terrain');
	gs.layers.shadows		= gs.biomeMap.createLayer('Shadow');
	gs.layers.producers		= gs.biomeMap.createLayer('Producers');
	gs.layers.animals		= gs.biomeMap.createLayer('Animals');
	gs.layers.links 		= gs.biomeMap.createLayer('Links');
	gs.layers.grid 			= gs.biomeMap.createLayer('GridMarks');

	gs.baseLayers.floor 	= gs.baseMap.createLayer('Floor');
	gs.baseLayers.walls 	= gs.baseMap.createLayer('Walls');
	gs.baseLayers.objects	= gs.baseMap.createLayer('Objects');
	gs.baseLayers.ui 		= gs.baseMap.createLayer('UI');

	for (key in gs.layers) {
		if (gs.layers[key]) {
			gs.layers[key].setScale(1.5, 1.5);
			gs.layers[key].pivot.x += gs.getOffsetX();
			gs.layers[key].pivot.y += gs.getOffsetY();
		}
	}

	gs.layers.shadows.pivot.y -= SHADOW_OFFSET - TILE_OFFSET_Y;
	gs.layers.shadows.pivot.x += TILE_OFFSET_X;
	gs.layers.animals.pivot.y += TILE_OFFSET_Y;
	gs.layers.animals.pivot.x += TILE_OFFSET_X;
	gs.layers.producers.pivot.y += TILE_OFFSET_Y;
	gs.layers.producers.pivot.x += TILE_OFFSET_X;
	gs.layers.grid.pivot.x += TILE_OFFSET_X;
	gs.layers.links.alpha = gs.LINK_ALPHA;
	gs.layers.grid.alpha = gs.SPECIAL_ALPHA;

	for (key in gs.baseLayers) {
		if (gs.baseLayers[key]) {
			gs.baseLayers[key].pivot.y += gs.getBaseOffsetY();
			gs.baseLayers[key].setScale(1.5, 1.5);
		}
	}

	uim.init();
	gs.assignCardIds();
	startGame();
}

function startGame() {
	var bPhaseOneRestore = false;

	window.LOLSDK.init('com.markkreitler.eggs');
	window.LOLSDK.addLifecycleListener(onPauseMainScreen, onResumeMainScreen);
	window.LOLSDK.addLifecycleListener(onPauseOther, onResumeOther);

	// MAY HAVE TO MOVE THIS TO A BUTTON EVENT...
	window.LOLSDK.allowSound();

	addUiElements();
	gs.stockStores();
	gs.createEmitters();

	if (gs.doRestoreGame()) {
		gs.init();
		events.init();
		bPhaseOneRestore = gs.restoreGameState();
		uim.hideTitleText();
		broadcast("showCloseButton");
		
		// TEMP: force game into PhaseOne state.
		if (bPhaseOneRestore && gs.playerHasLegalMove(true)) {
			setState(sm.startPhaseOne);
		}
		else {
			sm.setTransitionState('startPhaseTwo', 'phaseTwo');
		}

		// DEBUG: force transition to testEvent state.
		events.seedTutorialEvent("poleShift");
		setTimeout(function() {setState(sm.chooseEvent);}, 1000);
	}
	else {
		setState(sm.startGame);
	}

	uim.raiseGroups();
}

function quitGame() {
	window.LOLSDK.completeGame();	
}

function assert(bTest, message) {
	if (!bTest) {
		// console.log("ASSERT FAILED: " + message);
		debugger;
	}
}

function pushState(newState, newStateData) {
	suspendData.state = newState;
	suspendData.data = newStateData;
	bWantsStatePush = true;
}

function popState() {
	bWantsStatePop = true;
}

function doStatePush() {
	if (suspendData.state) {
		if (currentState && currentState.hasOwnProperty('onPushed')) {
			currentState.onPushed();
		}

		suspendedStates.unshift(currentState);
		suspendData.state.enter(suspendData.data);
		currentState = suspendData.state;

		// Clear old 'nextState' settings from the state machine
		// history. Otherwise, the dialog will try to return to
		// the 'nextState', rather than the popped one.
		sm.clearNextState();

		bWantsStatePush = false;
	}
}

function doStatePop() {
	if (suspendedStates.length > 0) {
		if (currentState) {
			currentState.exit();
		}

		currentState = suspendedStates.shift();

		if (currentState && currentState.hasOwnProperty('onPopped')) {
			currentState.onPopped();
		}

		bWantsStatePop = false;
	}
}

function setState(newState, newStateData) {
	assert(!nextState, "setState: multiple state transitions in a single frame!");

	if (typeof newState === "string") {
		if (sm.hasOwnProperty(newState)) {
			newState = sm[newState];
		}
		else {
			newState = null;
		}
	}

	nextState = newState;
	stateData = newStateData;
	bWantsStateChange = true;
}

function changeState() {
	if (nextState && nextState !== currentState) {
		if (currentState) {
			currentState.exit();
		}

		currentState = nextState;
		currentState.enter(stateData);
	}
	else if (!nextState) {
		if (currentState) {
			currentState.exit();
			currentState = null;
		}
	}

	nextState = null;
	stateData = null;
	bWantsStateChange = false;
}

function update() {
	if (bWantsStatePush) {
		doStatePush();
	}
	else if (bWantsStatePop) {
		doStatePop();
	}
	else if (bWantsStateChange) {
		changeState();
	}

	if (currentState) {
		currentState.update();
	}
}

function render() {
	if (currentState && currentState.hasOwnProperty("render")) {
		currentState.render();
	}
}

function addUiElements() {
	var x = 0;
	var y = 0;
	var _y = 0;
	var btn = null;
	var bnr = null;
	var i = 0;
	var nTitles = gs.getNumTitles();
	var btnGroup = uim.getButtonGroup();

	y = 0.0;

	x = -game.cache.getImage('ui_buttons').width / nTitles + TILE_SIZE * gs.SPRITE_SCALE;
	for (i=0; i<uim.NUM_BANNERS; ++i) {
		_y = y + uim.BANNER_MARGIN + i * game.cache.getImage('ui_buttons').height + i * uim.BANNER_SPACING;
		btn = new uim.button(btnGroup, 'ui_buttons', 'ui_buttons_g', x, _y, onBannerPressedCallback.bind(this), gs.titleToAnimIndex, {buttonIndex: i})
		bnr = new uim.banner(btn, '', 0, '', '', gs.specialToAnimIndex, {bannerIndex: i});
	}

	x = game.width - game.cache.getImage('ui_frame_top').width;
	uim.frameTop = uim.group.create(0, 0, 'ui_frame_top');
	uim.frameTop.visible = false;

	x = 0;
	uim.frameRight = uim.group.create(x, y, 'ui_frame_right');
	uim.frameRight.visible = false;

	game.input.onDown.add(onInputDown, this);
	game.input.onUp.add(onInputUp, this);

	uim.createInfoArea();
	uim.createCursors();
	uim.createHints();
	uim.createEventReport();
	uim.createChoiceDialog();
	uim.createCloseButton();

	uim.enableInput();
}

function onInputDown(gameObject, pointer, bStillOver) {
	if (!uim.onInputDown(gameObject, pointer, bStillOver)) {
		// UI didn't handle the event.
	}
}

function onInputUp(gameObject, pointer, bStillOver) {
	if (!uim.onInputUp(gameObject, pointer, bStillOver)) {
		// UI didn't handle the event.
	}
}

function generateStartingTerrain() {
	var i = 0;
	var index = 0;
	var key = null;
	var type = null;
	var size = -1;
	var startCol = -1;
	var minCol = -1;
	var maxCol = -1;
	var biome = null;
	var biomeList = [];
	var blocker = null;
	var iNiche = 0;

	biome = gs.getNextAvailableBiome();

	for (key in biome.TYPES) {
		biomeList.push(key);
		biomeList.push(key);
	}

	tm.scrambleList(biomeList);

	for (i=0; i<N_BIOMES; ++i) {
		type = biome.TYPES[biomeList[i]];
		size = biome.sizeByLatitude[i];
		minCol = Math.min((biome.offsets[i] + 1) % 2 + biome.MAX_GROWTH - 1, biome.MAX_SIZE - size);
		maxCol = biome.MAX_SIZE - size - biome.offsets[i] % 2;

		if (maxCol < minCol) {
			maxCol = minCol;
		}

		biome.setType(type);
		biome.setLatitude(i);
		biome.setStartCol((Math.round(Math.random() * (maxCol - minCol)) + minCol));

		for (iNiche=0; iNiche<size; ++iNiche) {
			biome.addNiche(biome);
		}

		blocker = uim.addBlocker(0, 0, 'noSelectLarge');
		biome.build(gs.layers.terrain, 'ff_world', biome.getType(), blocker);

		gs.biomes.push(biome);

		if (i < N_BIOMES - 1) {
			biome = gs.getNextAvailableBiome();
		}
	}
 }

function onBannerPressedCallback(button) {
	if (currentState && currentState.onBannerPressedCallback) {
		currentState.onBannerPressedCallback(button);
	}
}

function onWorldPressCallback() {
	if (currentState && currentState.onWorldPressCallback) {
		currentState.onWorldPressCallback();

	}
}
