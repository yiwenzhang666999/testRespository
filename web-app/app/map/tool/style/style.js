/**
 * 默认样式
 * */

define(function () {
	/**
	* api
	* */
	function getDefaultStyleFunction() {
		var styles = createDefaultEditing();
		return function (feature, resolution) {
			return styles[feature.getGeometry().getType()];
		}
	}


	function createDefaultEditing() {
		var styles = {};
		var white = [255, 255, 255, 1];
		var blue = [0, 153, 255, 1];
		styles[ol.geom.GeometryType.POLYGON] = [
			new ol.style.Style({
				fill: new ol.style.Fill({
					color: [255, 255, 255, 0.05]
				})
			})
		];
		styles[ol.geom.GeometryType.MULTI_POLYGON] =
			styles[ol.geom.GeometryType.POLYGON];

		styles[ol.geom.GeometryType.LINE_STRING] = [
			new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: white,
					width: 2
				})
			}),
			new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: blue,
					width: 2
				})
			})
		];
		styles[ol.geom.GeometryType.MULTI_LINE_STRING] =
			styles[ol.geom.GeometryType.LINE_STRING];

		styles[ol.geom.GeometryType.CIRCLE] =
			styles[ol.geom.GeometryType.POLYGON].concat(
				styles[ol.geom.GeometryType.LINE_STRING]
			);


		styles[ol.geom.GeometryType.POINT] = [
			new ol.style.Style({
				image: new ol.style.Circle({
					radius: 4,
					fill: new ol.style.Fill({
						color: blue
					}),
					stroke: new ol.style.Stroke({
						color: white,
						width: 1
					})
				}),
				zIndex: Infinity
			})
		];
		styles[ol.geom.GeometryType.MULTI_POINT] =
			styles[ol.geom.GeometryType.POINT];

		styles[ol.geom.GeometryType.GEOMETRY_COLLECTION] =
			styles[ol.geom.GeometryType.POLYGON].concat(
				styles[ol.geom.GeometryType.LINE_STRING],
				styles[ol.geom.GeometryType.POINT]
			);

		return styles;
	}
	return {
		getDefaultStyleFunction: getDefaultStyleFunction
	}
})