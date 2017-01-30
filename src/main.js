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

var game = new Phaser.Game(MAX_WINDOW_X, MAX_WINDOW_Y, Phaser.AUTO, '', { preload: preload, create: create, update: update });

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

function preload() {
	// Tilemaps
	game.load.image('world_ff', './res/tilesets/oryx_16bit_fantasy_world_trans.png', false);
	game.load.image('world_sf', './res/tilesets/oryx_16bit_scifi_world_trans.png', false);
	game.load.tilemap('globe', './art/world.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap('base', './art/base.json', null, Phaser.Tilemap.TILED_JSON);

	// Images
	game.load.image('noSelectSmall', './res/noSelectSmall.png', false);
	game.load.image('noSelectMedium', './res/noSelectMedium.png', false);
	game.load.image('noSelectLarge', './res/noSelectLarge.png', false);
	game.load.image('eventMarker', './res/ui/eventMarker.png', false);
	game.load.image('eventInfo', './res/ui/eventInfo.png', false);
	game.load.image('infoShield', './res/ui/infoShield.png', false);
	game.load.image('infoPanel', './res/ui/infoPanel.png', false);

	// Spritesheets
	game.load.spritesheet('ui_buttons', './res/ui/buttons.png', 315, 79);
	game.load.spritesheet('ui_buttons_g', './res/ui/buttons_g.png', 324, 98);
	game.load.spritesheet('ui_specials', './res/ui/specials.png', 24, 24);
	game.load.spritesheet('cursor', './res/ui/cursor.png', 48, 96);
	game.load.image('ui_frame_right', './res/ui/frameRight.png');
	game.load.image('ui_frame_top', './res/ui/frameTop.png');

	// Fonts
	game.load.bitmapFont('bogboo', './res/fonts/bogboo.png', './res/fonts/bogboo.xml');	
    game.load.bitmapFont('carrier_command', './res/carrier_command.png', './res/carrier_command.xml');

    // Sounds
}

function create() {
	var key = null;

	gs.biomeMap = game.add.tilemap('globe');
	gs.biomeMap.addTilesetImage('ff_world', 'world_ff', 24, 24);
	gs.biomeMap.addTilesetImage('sf_world', 'world_sf', 24, 24);

	gs.baseMap = game.add.tilemap('base');
	gs.baseMap.addTilesetImage('sf_world', 'world_sf', 24, 24);

//	gs.layers.stars 		= gs.biomeMap.createLayer('StarField');
//	gs.layers.ocean 		= gs.biomeMap.createLayer('Ocean01');
	gs.layers.crust 		= gs.biomeMap.createLayer('Crust');
//	gs.layers.oceanDetail 	= gs.biomeMap.createLayer('OceanDetail');
	gs.layers.terrain 		= gs.biomeMap.createLayer('Terrain');
//	gs.layers.ice 			= gs.biomeMap.createLayer('Ice');
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

	if (gs.doRestoreGame()) {
		bPhaseOneRestore = gs.restoreGameState();
		addUiElements();
		events.init();
		
		// TEMP: force game into PhaseOne state.
		if (bPhaseOneRestore && gs.playerHasLegalMove(true)) {
			setState(sm.startPhaseOne);
		}
		else {
			sm.setTransitionState('startPhaseTwo', 'phaseTwo');
		}

		// DEBUG: force transition to testEvent state.
		setTimeout(function() {setState(sm.chooseEvent);}, 1000);
	}
	else {
		generateStartingTerrain();
		addUiElements();
		events.init();
		
		// TEMP: force game into PhaseOne state.
		gs.initDrawDeck();
		gs.initDiscardDeck();
		setState(sm.startPhaseOne);
	}

	uim.raiseGroups();
}

function resetGame() {
	gs.resetBiomes();
	gs.resetCards();	
}

function assert(bTest, message) {
	if (!bTest) {
		console.log("ASSERT FAILED: " + message);
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

	gs.baseLayers.walls.bringToTop();
	gs.baseLayers.objects.bringToTop();
	gs.baseLayers.ui.bringToTop();

	x = game.width - game.cache.getImage('ui_frame_top').width;
	uim.frameTop = uim.group.create(0, 0, 'ui_frame_top');
	uim.frameTop.visible = false;

	x = 0;
	uim.frameRight = uim.group.create(x, y, 'ui_frame_right');
	uim.frameRight.visible = false;

	game.input.onUp.add(onInputUp, this);

	uim.createInfoArea();
	uim.createCursors();
	uim.createHints();

	uim.enableInput();
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

	biome = new bd.biome();

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

		if (i === 0 || i === N_BIOMES - 1) {
			blocker = uim.addBlocker(0, 0, 'noSelectSmall');
		}
		else if (i === 1 || i === N_BIOMES - 2) {
			blocker = uim.addBlocker(0, 0, 'noSelectMedium');
		}
		else {
			blocker = uim.addBlocker(0, 0, 'noSelectLarge');
		}

		biome.build(gs.layers.terrain, 'ff_world', biome.getType(), blocker);

		gs.biomes.push(biome);

		if (i < N_BIOMES - 1) {
			biome = new bd.biome();
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
