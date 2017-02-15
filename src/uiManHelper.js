uim.helperGroup = null;

uim.helper = {
	OFFSET: 110,
	VELOCITY: 512 / 1.0,
	ANGULAR_VELOCITY: 360 / 3,
	MARGIN: 5,
	MIN_DT: 667,
	ALPHA_THRESH: 0.1,

	top: null,
	right: null,
	bottom: null,
	left: null,
	center: null,
	ring: null,
	arrowIn: null,
	arrowOut: null,
	textCenter: null,
	textTop: null,
	textRight: null,
	textBottom: null,
	textLeft: null,
	bInputBlocked: false,

	node: null,

	create: function() {
		this.node 		= uim.helperGroup.create(0, 0);
		this.center 	= uim.helperGroup.create(0, 0, 'helperCenter');
		this.ring 		= uim.helperGroup.create(0, 0, 'helperRing');
		this.top 		= uim.helperGroup.create(0, 0, 'helperTop');
		this.right 		= uim.helperGroup.create(0, 0, 'helperRight');
		this.bottom 	= uim.helperGroup.create(0, 0, 'helperBottom');
		this.left 		= uim.helperGroup.create(0, 0, 'helperLeft');
		this.arrowOut 	= uim.helperGroup.create(0, 0, 'helperArrowOut');
		this.arrowIn 	= uim.helperGroup.create(0, 0, 'helperArrowIn');

		this.textCenter	= game.add.bitmapText(0, 0, 'bogboo', "Center\nText", uim.INFO_TEXT_SIZE); 		
		this.textTop	= game.add.bitmapText(0, -this.top.height / 2 + this.MARGIN, 'bogboo', "Top\nText", uim.INFO_TEXT_SIZE); 		
		this.textRight	= game.add.bitmapText(this.right.width / 2 - this.MARGIN, 0, 'bogboo', "Right\nText", uim.INFO_TEXT_SIZE); 
		this.textBottom	= game.add.bitmapText(0, 0, 'bogboo', "Bottom\nText", uim.INFO_TEXT_SIZE); 		
		this.textLeft	= game.add.bitmapText(-this.left.width / 2 + this.MARGIN, 0, 'bogboo', "Left\nText", uim.INFO_TEXT_SIZE); 		

		this.node.anchor.set(0.5, 0.5);
		this.center.anchor.set(0.5, 0.5);
		this.ring.anchor.set(0.5, 0.5);
		this.top.anchor.set(0.5, 0.5);
		this.right.anchor.set(0.5, 0.5);
		this.bottom.anchor.set(0.5, 0.5);
		this.left.anchor.set(0.5, 0.5);
		this.arrowOut.anchor.set(0.5, 0.5);
		this.arrowIn.anchor.set(0.5, 0.5);

		this.center.events.onInputDown.add(this.onHelpTapped, this.center);
		this.ring.events.onInputDown.add(this.onHelpTapped, this.ring);
		this.top.events.onInputDown.add(this.onHelpTapped, this.top);
		this.right.events.onInputDown.add(this.onHelpTapped, this.right);
		this.bottom.events.onInputDown.add(this.onHelpTapped, this.bottom);
		this.left.events.onInputDown.add(this.onHelpTapped, this.left);
		this.arrowOut.events.onInputDown.add(this.onHelpTapped, this.arrowOut);
		this.arrowIn.events.onInputDown.add(this.onHelpTapped, this.arrowIn);

		this.textCenter.events.onInputDown.add(this.onHelpTapped, this.textCenter);
		this.textTop.events.onInputDown.add(this.onHelpTapped, this.textTop);
		this.textRight.events.onInputDown.add(this.onHelpTapped, this.textRight);
		this.textBottom.events.onInputDown.add(this.onHelpTapped, this.textBottom);
		this.textLeft.events.onInputDown.add(this.onHelpTapped, this.textLeft);

		this.center.inputEnabled = true;
		this.ring.inputEnabled = true;
		this.top.inputEnabled = true;
		this.right.inputEnabled = true;
		this.bottom.inputEnabled = true;
		this.left.inputEnabled = true;
		this.arrowOut.inputEnabled = true;
		this.arrowIn.inputEnabled = true;

		this.textCenter.anchor.set(0.5, 0.5);
		this.textTop.anchor.set(0.5, 0.0);
		this.textRight.anchor.set(1.0, 0.5);
		this.textBottom.anchor.set(0.5, 0.0);
		this.textLeft.anchor.set(0.0, 0.5);

		this.textCenter.align = "center";
		this.textTop.align = "center";
		this.textRight.align = "right";
		this.textBottom.align = "center";
		this.textLeft.align = "left";

		this.node.addChild(this.center);
		this.node.addChild(this.top);
		this.node.addChild(this.right);
		this.node.addChild(this.bottom);
		this.node.addChild(this.left);

		this.node.addChild(this.ring);
		this.ring.addChild(this.arrowOut);
		this.ring.addChild(this.arrowIn);

		this.center.addChild(this.textCenter);
		this.top.addChild(this.textTop);
		this.right.addChild(this.textRight);
		this.bottom.addChild(this.textBottom);
		this.left.addChild(this.textLeft);

		this.node.x = game.width / 2;
		this.node.y = -game.height / 2;

		this.left.x = -this.OFFSET;
		this.top.y = -this.OFFSET;
		this.right.x = this.OFFSET;
		this.bottom.y = this.OFFSET;

		this.arrowIn.x = -67;
		this.arrowOut.x = 100;

		this.center.alpha 	= 0;
		this.ring.alpha 	= 0;
		this.top.alpha 		= 0;
		this.right.alpha 	= 0;
		this.bottom.alpha 	= 0;
		this.left.alpha 	= 0;

		this.node.data 		= {};
		this.center.data 	= {};
		this.ring.data 		= {};
		this.top.data 		= {};
		this.right.data 	= {};
		this.bottom.data 	= {};
		this.left.data 		= {};

 		this.node.data.tweenTranslate	= game.add.tween(this.node).to({x: 0, y: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.ring.data.tweenRotate 		= game.add.tween(this.ring).to({angle: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);

 		this.node.data.tweenTranslate.onComplete.add(uim.onUIopComplete, uim);
 		this.ring.data.tweenRotate.onComplete.add(uim.onUIopComplete, uim);

 		this.top.data.tweenFadeIn 		= game.add.tween(this.top).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.right.data.tweenFadeIn 	= game.add.tween(this.right).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.bottom.data.tweenFadeIn 	= game.add.tween(this.bottom).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.left.data.tweenFadeIn 		= game.add.tween(this.left).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.ring.data.tweenFadeIn 		= game.add.tween(this.ring).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.center.data.tweenFadeIn 	= game.add.tween(this.center).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.arrowIn.data.tweenFadeIn 	= game.add.tween(this.arrowIn).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.arrowOut.data.tweenFadeIn 	= game.add.tween(this.arrowOut).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);

 		this.textCenter.data.tweenFadeIn = game.add.tween(this.textCenter).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.textTop.data.tweenFadeIn = game.add.tween(this.textTop).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.textRight.data.tweenFadeIn = game.add.tween(this.textRight).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.textBottom.data.tweenFadeIn = game.add.tween(this.textBottom).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.textLeft.data.tweenFadeIn = game.add.tween(this.textLeft).to({alpha: 1}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);

 		this.top.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.top);
 		this.right.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.right);
 		this.bottom.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.bottom);
 		this.left.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.left);
 		this.ring.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.ring);
 		this.center.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.center);
 		this.arrowIn.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.arrowIn);
 		this.arrowOut.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.arrowOut);

 		this.textCenter.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.textCenter);
 		this.textTop.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.textTop);
 		this.textRight.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.textRight);
 		this.textBottom.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.textBottom);
 		this.textLeft.data.tweenFadeIn.onComplete.add(this.onHelperOpComplete, this.textLeft);

 		this.top.data.tweenFadeOut 		= game.add.tween(this.top).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.right.data.tweenFadeOut 	= game.add.tween(this.right).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.bottom.data.tweenFadeOut 	= game.add.tween(this.bottom).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.left.data.tweenFadeOut 	= game.add.tween(this.left).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.ring.data.tweenFadeOut 	= game.add.tween(this.ring).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.center.data.tweenFadeOut 	= game.add.tween(this.center).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.arrowIn.data.tweenFadeOut 	= game.add.tween(this.arrowIn).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.arrowOut.data.tweenFadeOut = game.add.tween(this.arrowOut).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);

 		this.textCenter.data.tweenFadeOut = game.add.tween(this.textCenter).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.textTop.data.tweenFadeOut = game.add.tween(this.textTop).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.textRight.data.tweenFadeOut = game.add.tween(this.textRight).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.textBottom.data.tweenFadeOut = game.add.tween(this.textBottom).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);
 		this.textLeft.data.tweenFadeOut = game.add.tween(this.textLeft).to({alpha: 0}, uim.INFO_TWEEN_TIME, Phaser.Easing.Cubic.InOut, false);

 		this.top.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.top);
 		this.right.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.right);
 		this.bottom.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.bottom);
 		this.left.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.left);
 		this.ring.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.ring);
 		this.center.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.center);
 		this.arrowIn.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.arrowIn);
 		this.arrowOut.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.arrowOut);

 		this.textCenter.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.textCenter);
 		this.textTop.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.textTop);
 		this.textRight.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.textRight);
 		this.textBottom.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.textBottom);
 		this.textLeft.data.tweenFadeOut.onComplete.add(this.onHelperOpComplete, this.textLeft);
	},

	onHelperOpComplete: function(data) {
		if (this.alpha < uim.helper.ALPHA_THRESH) {
			this.inputEnabled = false;
		}
		else {
			this.inputEnabled = true;
		}

		uim.onUIopComplete(this);
	},

	onHelpTapped: function(data) {
		if (this.alpha > uim.helper.ALPHA_THRESH && !uim.helper.bInputBlocked) {
			broadcast('onHelpTapped');
			gs.playSound(gs.sounds.buttonHi);
		}
	},

	resetNode: function() {
		this.node.x = game.width / 2;
		this.node.y = -game.height / 2;
	},

	blockInput: function() {
		this.bInputBlocked = true;
	},

	unblockInput: function() {
		this.bInputBlocked = false;
	},

	blendTo: function(args) {
		var dt = 0;
		var x = args.hasOwnProperty('x') ? args.x : this.node.x;
		var y = args.hasOwnProperty('y') ? args.y : this.node.y;

		dt = 1000 * Math.sqrt((x - this.node.x) * (x - this.node.x) + (y - this.node.y) * (y - this.node.y)) / this.VELOCITY;
		dt = Math.max(dt, this.MIN_DT);

 		this.node.data.tweenTranslate.updateTweenData('vEnd', {x: x, y: y});
 		this.node.data.tweenTranslate.updateTweenData('duration', dt);

 		this.node.data.tweenTranslate.start();
	},

	setText: function(widget, text) {
		var key = widget ? widget.substring(0, 1).toUpperCase() + widget.substring(1).toLowerCase() : null;

		assert(widget && this.hasOwnProperty("text" + key), "setText: invalid widget identifier!");

		widget = this["text" + key];

		assert(typeof(widget) !== 'undefined' , "setText: widget is not a text object!");

		widget.text = text;
	},

	turnRingTo: function(args) {
		assert(args.hasOwnProperty("angle") && args.hasOwnProperty("bShortest"), "turnRingTo: invalid arguments!");

		this.turnTo(args.angle, args.bShortest);
	},

	turnRingBy: function(args) {
		assert(args.hasOwnProperty("angle") && args.hasOwnProperty("bShortest"), "turnRingBy: invalid arguments!");

		this.turnTo(this.ring.angle + args.angle, args.bShortest);
	},

	snapArrowsOn: function(bIn, bOut) {
		if (bIn) {
			this.arrowIn.alpha = 1.0;
			this.arrowIn.inputEnabled = true;
		}
		else {
			this.arrowIn.alpha = 0.0;
			this.arrowIn.inputEnabled = false;
		}

		if (bOut) {
			this.arrowOut.alpha = 1.0;
			this.arrowOut.inputEnabled = true;
		}
		else {
			this.arrowOut.alpha = 0.0;
			this.arrowOut.inputEnabled = false;
		}
	},

	snapArrowsOff: function(bIn, bOut) {
		if (bIn) {
			this.arrowIn.alpha = 0.0;
			this.arrowIn.inputEnabled = false;
		}
		else {
			this.arrowIn.alpha = 1.0;
			this.arrowIn.inputEnabled = true;
		}

		if (bOut) {
			this.arrowOut.alpha = 0.0;
			this.arrowOut.inputEnabled = false;
		}
		else {
			this.arrowOut.alpha = 1.0;
			this.arrowOut.inputEnabled = true;
		}
	},

	snapRingTo: function(angle) {
		this.ring.angle = angle;
	},

	snapRingBy: function(dAngle) {
		this.ring.angle += dAngle;
	},

	snapTo: function(x, y) {
		if (typeof(x) === "number") {
			this.node.x = x;
		}

		if (typeof(y) === "number") {
			this.node.y = y;
		}

		return 0;
	},

	snapIn: function(el) {
		var nExecs = this.executeOnElements(el, function(w) {
				assert(w, "snapIn: invalid property identifier!");

				w.alpha = 1.0;
			});

		return nExecs;
	},

	snapOut: function(el) {
		var nExecs = this.executeOnElements(el, function(w) {
				assert(w, "snapOut: invalid property identifier!");

				w.alpha = 0.0;
			});

		return nExecs;
	},

	turnTo: function(newAngle, bUseShortest) {
		var dAngle = newAngle - this.ring.angle;
		var dt = 0;

		if (bUseShortest) {
			if (dAngle > 180.0) {
				dAngle = dAngle - 360.0;
			}
			else if (dAngle < -180.0) {
				dAngle = dAngle + 360.0;
			}

			newAngle = this.ring.angle + dAngle;
		}

		dt = 1000 * Math.abs(dAngle) / this.ANGULAR_VELOCITY;
		dt = Math.max(dt, this.MIN_DT);
 		this.ring.data.tweenRotate.updateTweenData('vEnd', {angle: newAngle});
 		this.ring.data.tweenRotate.updateTweenData('duration', dt);

 		this.ring.data.tweenRotate.start();
	},

	fadeOut: function(el) {
		var nExecs = this.executeOnElements(el, function(w) {
				assert(w, "fadeOut: invalid property identifier!");

				w.data.tweenFadeOut.start();
			});

		return nExecs;
	},

	fadeIn: function(el) {
		var nExecs = this.executeOnElements(el, function(w) {
				assert(w, "fadeIn: invalid property identifier!");

				w.data.tweenFadeIn.start();
			});

		return nExecs;
	},

	executeOnElements: function(el, fn) {
		var bIsArray = el instanceof Array;
		var elements = !bIsArray ? [] : el;
		var i = 0;
		var widget = null;
		var nStarted = 0;

		assert(elements instanceof Array, "fadeOut: invalid elements!");

		if (elements.length === 0 && !bIsArray) {
			elements.push(el);
		}

		for (i=0; i<elements.length; ++i) {
			if (this.hasOwnProperty(elements[i])) {
				widget = this[elements[i]];

				assert(widget, "fadeOut: invalid property identifier!");

				fn(widget);
				nStarted += 1;
			}
		}

		return nStarted;
	}
};
