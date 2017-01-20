var TILE_SIZE = 24;
var MAX_WINDOW_X = 1024;
var MAX_WINDOW_Y = 768;
var N_BIOMES = 5;
var LAYER_OFFSET = 3;
var SHADOW_OFFSET = 4;

var tilesX = Math.floor(MAX_WINDOW_X / TILE_SIZE);
var tilesY = Math.floor(MAX_WINDOW_Y / TILE_SIZE);
var windowDx = tilesX * TILE_SIZE;
var windowDy = tilesY * TILE_SIZE;
var infoText = null;
var row = -1;
var col = -1;
var currentState = null;
var nextState = null;
var bWantsStateChange = false;
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
	game.load.tilemap('globe', './art/globeTest.json', null, Phaser.Tilemap.TILED_JSON);

	// Images
	game.load.image('noSelectSmall', './res/noSelectSmall.png', false);
	game.load.image('noSelectMedium', './res/noSelectMedium.png', false);
	game.load.image('noSelectLarge', './res/noSelectLarge.png', false);

	// Spritesheets
	game.load.spritesheet('ui_buttons', './res/ui/buttons.png', 315, 79);
	game.load.spritesheet('ui_buttons_g', './res/ui/buttons_g.png', 324, 98);
	game.load.spritesheet('ui_specials', './res/ui/specials.png', 24, 24);
	game.load.spritesheet('cursor', './res/ui/cursor.png', 48, 96);
	game.load.image('ui_frame_right', './res/ui/frameRight.png');
	game.load.image('ui_frame_bottom', './res/ui/frameBottom.png');

	// Fonts
	game.load.bitmapFont('bogboo', './res/fonts/bogboo.png', './res/fonts/bogboo.xml');	
    game.load.bitmapFont('carrier_command', './res/carrier_command.png', './res/carrier_command.xml');

    // Sounds
}

function create() {
	gs.biomeMap = game.add.tilemap('globe');
	gs.biomeMap.addTilesetImage('ff_world', 'world_ff', 24, 24);
	gs.biomeMap.addTilesetImage('sf_world', 'world_sf', 24, 24);

	gs.layers.stars 		= gs.biomeMap.createLayer('StarField');
	gs.layers.ocean 		= gs.biomeMap.createLayer('Ocean01');
	gs.layers.crust 		= gs.biomeMap.createLayer('Crust');
	gs.layers.oceanDetail 	= gs.biomeMap.createLayer('OceanDetail');
	gs.layers.terrain 		= gs.biomeMap.createLayer('Terrain');
	gs.layers.ice 			= gs.biomeMap.createLayer('Ice');
	gs.layers.shadows		= gs.biomeMap.createLayer('Shadow');
	gs.layers.links 		= gs.biomeMap.createLayer('Links');
	gs.layers.producers		= gs.biomeMap.createLayer('Producers');
	gs.layers.animals		= gs.biomeMap.createLayer('Animals');
	gs.layers.ice 			= gs.biomeMap.createLayer('Ice');
	gs.layers.grid 			= gs.biomeMap.createLayer('GridMarks');

	gs.layers.producers.setScale(1.5, 1.5);	
	gs.layers.animals.setScale(1.5, 1.5);

	gs.layers.shadows.pivot.y -= SHADOW_OFFSET;
	gs.layers.links.alpha = gs.LINK_ALPHA;

	uim.init();
	generateStartingTerrain();
	addUiElements();

	// TEMP: force game into PhaseOne state.
	setState(sm.startPhaseOne);
}

function assert(bTest, message) {
	if (!bTest) {
		console.log("ASSERT FAILED: " + message);
		debugger;
	}
}

function setState(newState) {
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
	bWantsStateChange = true;
}

function changeState() {
	if (nextState && nextState !== currentState) {
		if (currentState) {
			currentState.exit();
		}

		nextState.enter();

		currentState = nextState;
	}
	else if (!nextState) {
		if (currentState) {
			currentState.exit();
			currentState = null;
		}
	}

	nextState = null;
	bWantsStateChange = false;
}

function update() {
	if (bWantsStateChange) {
		changeState();
	}

	if (currentState) {
		currentState.update();
	}
}

function addUiElements() {
	var x = 0;
	var y = 0;
	var btn = null;
	var bnr = null;
	var i = 0;
	var nTitles = gs.getNumTitles();

	x = game.width - 1 + game.cache.getImage('ui_buttons').width / nTitles;
	for (i=0; i<uim.NUM_BANNERS; ++i) {
		y = uim.BANNER_MARGIN + i * game.cache.getImage('ui_buttons').height + i * uim.BANNER_SPACING;
		btn = new uim.button(uim.group, 'ui_buttons', 'ui_buttons_g', x, y, onBannerPressedCallback.bind(this), gs.titleToAnimIndex, {buttonIndex: i})
		bnr = new uim.banner(btn, '', 0, '', '', gs.specialToAnimIndex, {bannerIndex: i});
	}

	x = game.width - game.cache.getImage('ui_frame_bottom').width;
	y = game.height - game.cache.getImage('ui_frame_bottom').height;
	uim.frameBottom = uim.group.create(x, y, 'ui_frame_bottom');

	x = game.width - game.cache.getImage('ui_frame_right').width;
	y -= game.cache.getImage('ui_frame_right').height;
	uim.frameRight = uim.group.create(x, y, 'ui_frame_right');

	game.input.onUp.add(onInputUp, this);

	uim.createInfoArea();
	uim.createCursors();

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
		size = biome.sizeByLatitude[i] + type.sizeMod;
		maxCol = biome.maxSizeAtLatitude[i] - size;
		minCol = biome.MAX_GROWTH;

		biome.setType(type);
		biome.setLatitude(i);
		biome.setStartOffset(i);
		biome.setStartCol((Math.floor(Math.random() * (maxCol - minCol)) + minCol));

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
