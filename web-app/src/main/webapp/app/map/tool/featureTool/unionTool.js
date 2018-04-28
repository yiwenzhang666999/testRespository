/**
 * 合并工具
 */
define([
	'map', 'util', 'config'
], function (map, util, config) {
	'use strict';
	var wktFormat = new ol.format.WKT();
	var jsts4wkt = new jsts.io.WKTReader();
	var ol4jsts = new jsts.io.OL3Parser();
	var url = config.publicService + "/geometry/union.do";
	function union(features, done) {
		//TODO 未判断是否同一年
		var bool = _isSameXian(features);
		if (bool) {
			var isIntersection = _isIntersection(features);
			if (isIntersection) {
				var geoWktArr = [];
				for (var i = 0; i < features.length; i++) {
					geoWktArr.push(wktFormat.writeFeature(features[i]));
				}
				var data = { geoWkt: geoWktArr[0], geo1Wkt: geoWktArr[1], tolerance: "0" };
				$.ajax({
					url: url,
					type: "POST",
					data: { "data": JSON.stringify(data) },
					success: function (res) {
						if (res.result == "success") {
							var feature = wktFormat.readFeature(res.data);
							if (done) {
								done(feature);
							}
						}
					},
					error: function (err) {
						util.validateSession(err);
						console.log(err);
					}
				});
			} else {
				mini.alert("请选择相交图斑进行合并!", "温馨提示");
				return null;
			}
		} else {
			mini.alert("请选择同一个县内的图斑进行合并！", "温馨提示");
			return null;
		}
	}
	function _isSameXian(features) {
		var item1 = features[0];
		var item2 = features[1];
		var b = false;
		if (item1.getProperties().C_XIAN != item2.getProperties().C_XIAN) {
			b = false;
		} else {
			b = true;
		}
		return b;
	}
	/**
	 *  判断图斑是否相交
	 * @param {any} features
	 * @returns
	 */
	function _isIntersection(features) {
		var isSave = false;
		var parser_ = new jsts.io.OL3Parser();
		//使用jsts读取绘制图形
		var drawGraphics = parser_.read(features[0].getGeometry());
		var currentGraphics = parser_.read(features[1].getGeometry());
		if (drawGraphics.intersects(currentGraphics) || drawGraphics.touches(currentGraphics)) {
			isSave = true;
		} else {
			isSave = false;
		}
		return isSave;
	}
	return {
		union: union
	}
});