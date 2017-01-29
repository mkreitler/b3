/**
 * Helper functions for managing tileMaps.
 */

 tm = {
 	copyListToList: function(src, dest, bOverwrite) {
 		var i = 0;

 		assert(src && dest, "copyListToList: invalid list!");

 		if (bOverwrite) {
	 		dest.length = 0;
	 	}

 		for (i=0; i<src.length; ++i) {
 			dest.push(src[i]);
 		}
 	},

 	scrambleList: function(list) {
 		var i = 0;
 		var iSwap = 0;
 		var temp = null;

 		for (i=0; list && i<list.length; ++i) {
 			iSwap = Math.floor(Math.random() * (list.length - i));
 			if (iSwap !== i) {
 				temp = list[i];
 				list[i] = list[iSwap];
 				list[iSwap] = temp;
 			}
 		}
 	},

 	listsExclusive: function(list1, list2) {
 		var bExclusive = true;
 		var i1 = 0;
 		var i2 = 0;

 		for (i1=0; i1<list1.length; ++i1) {
 			for (i2=0; i2<list2.length; ++i2) {
 				if (list1[i1] === list2[i2]) {
 					bExclusive = false;
 					break;
 				}
 			}
 		}

 		return bExclusive;
 	},

 	listNullAndMoveToBack: function(list, item) {
 		var i = 0;

 		for (i=0; i<list.length; ++i) {
 			if (list[i] === item) {
 				this.listReplaceWithLastNonNull(list, i);
 				break;
 			}
 		}
 	},

 	listReplaceWithLastNonNull: function(list, iReplace) {
 		var bReplaced = false;
 		var iLast = -1;

 		if (list && iReplace < list.length) {
 			for (iLast = list.length - 1; iLast > iReplace; --iLast) {
 				if (list[iLast]) {
 					break;
 				}
 			}

 			if (iLast > iReplace) {
 				list[iReplace] = list[iLast];
 				list[iLast] = null;
 				bReplaced = true;
 			}
 		}

 		return bReplaced;
 	},

 	trimList: function(list) {
 		var i = 0;

 		assert(list, "terminateListAtFirstNull: invalid list!");

 		for (i=0; i<list.length; ++i) {
 			if (!list[i]) {
 				list.length = i;
 				break;
 			}
 		}
 	},

 	addTilesToLayer: function(layer, imageName, tile, row, col) {
 		var image = null;
 		var imageCols = -1;
 		var tileObj = null;

 		if (layer && layer.map) {
 			image = layer.map.tilesets[layer.map.getTilesetIndex(imageName)].image;

 			if (image) {
 				if (typeof tile === "number") {
	 				imageCols = Math.floor(image.width / layer.map.tileWidth);
	 				layer.map.putTile(tile, col, row, layer);
 				}
 				else {
	 				imageCols = Math.floor(image.width / layer.map.tileWidth);
	 				layer.map.putTile(tile.row * imageCols + tile.col, col, row, layer);
 				}

// 				layer.map.putTile(2110, col, row, layer);

 				tileObj = layer.map.getTile(col, row, layer);
 			}
 		}

 		return tileObj;
 	},

 	removeTileFromLayer: function(layer, row, col) {
		if (layer && layer.map) {
			layer.map.putTile(null, col, row, layer);
		} 		
 	}
 }