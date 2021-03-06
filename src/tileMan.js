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

 	listNullAndMoveToBack: function(list, item, bTrim) {
 		var i = 0;

 		for (i=0; i<list.length; ++i) {
 			if (list[i] === item) {
 				this.listReplaceWithLastNonNull(list, i);
 				break;
 			}
 		}
 	},

 	listDeleteElement: function(list, element) {
 		var i = 0;

 		i = list.indexOf(element);

 		if (i >= 0) {
 			for (;i<list.length - 1; ++i) {
 				list[i] = list[i + 1];
 			}

 			list.length = list.length - 1;
 		}
 	},

 	listReplaceWithLastNonNull: function(list, iReplace, bTrim) {
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
 			else {
 				// Only 'null' elements beyond iReplace, so we can
 				// null-out list[iReplace] without moving it.
 				list[iReplace] = null;
 				bReplaced = true;
 			}

 			if (bTrim) {
 				this.trimList(list);
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

 	numberListFindMaxima: function(list, maximaOut) {
 		var i = 0;
 		var max = Number.NEGATIVE_INFINITY;

 		assert(list, "numberListFindMaxima: invalid list!");

 		for (i=0; i<list.length; ++i) {
 			assert(typeof(list[i] == "number"), "numberListFindMaxima: found non-numerical data!");
 			if (list[i] > max) {
 				max = list[i];
 			}
 		}

 		for (i=0; i<list.length; ++i) {
 			if (list[i] === max) {
 				maximaOut.push(i);
 			}
 		}
 	},

 	numberListFindMaxValue: function(list) {
 		var i = 0;
 		var best = Number.NEGATIVE_INFINITY;

 		assert(list, "numberListFindMaxValue: invalid list!");

 		for (i=0; i<list.length; ++i) {
 			assert(typeof(list[i]) === 'number', "numberListFindMaxValue: found non-numerical data!");
 			if (list[i] > best) {
 				best = list[i];
 			}
 		}

 		return best;
 	},

 	listReturnRandomElement: function(list) {
 		assert(list, "listReturnRandomElement: invalid list!");

 		return (list[Math.floor(Math.random() * list.length)]);
 	},

 	getTileAt: function(layer, row, col) {
 		return layer.map.getTile(col, row);
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
 		var tileObj = null;

		if (layer && layer.map) {
			layer.map.putTile(null, col, row, layer);
 			tileObj = layer.map.getTile(col, row, layer);
		} 		

		return tileObj;
 	},

 	sortListHighToLow: function(list) {
 		var i = 0;
 		var j = 0;
 		var s = 0;

 		assert(list && list.length, "sortListHighToLow: invalid list!");

 		for (i=0; i<list.length - 1; ++i) {
 			for (j=i+1; j<list.length; ++j) {
 				if (list[j] > list[i]) {
 					s = list[j];
 					list[j] = list[i];
 					list[i] = s;
 				}
 			}
 		}
 	}
 }