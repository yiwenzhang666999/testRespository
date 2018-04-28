/**
 *创建功能js
 */
define([
	'map',
	'drawBufferMap', 'publicObj'
], function (map, drawBufferMap, publicObj) {
	'use strict';
	var feature;//绘画的克隆对象，以绘制的颜色增加在地图上
	var active;
	var layer;
	var map_;
	var popFun;
	function setActive(bool, pop) {
		if (bool == active) {
			return;
		}
		if (bool) {
			popFun = pop;
			if (!map_) {
				map_ = map.getMap();
			}
			if (!layer) {
				layer = map.getLayerByName("HIGH_LAYER");
			}
			_changePointerStyle();
			drawBufferMap.draw("Polygon", callback);
		} else {
			if (layer && feature && layer.getSource().getFeatures() > 0) {
				layer.getSource().clear();
			}
			feature = null;
			drawBufferMap.clear();
		}
		active = bool;
	}
	function undo() {
		drawBufferMap.removeLastPoint();
	}
	function callback(evt) {
		//克隆一个绘画图形，以绘画的颜色加载图层上
		feature = evt.feature.clone();
		feature.setStyle(publicObj.addStyle);
		layer.getSource().addFeature(feature);
		popFun("add", evt.feature, templates[0]);
	}
	function _changePointerStyle() {
		$("#map").removeClass("Track");
		$("#map").removeClass("noTrack");
		$("#map").addClass("noTrack");
	}
	return {
		setActive: setActive,
		undo: undo
	}
});