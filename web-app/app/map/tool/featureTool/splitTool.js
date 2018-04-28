/**
 *修边工具
 */
define(['config',
    'map',
    'drawMap', 'publicObj', 'util'
], function (config, map, drawMap, publicObj, util) {
    'use strict';
    var wktFormat = new ol.format.WKT();
    var jsts4wkt = new jsts.io.WKTReader();
    var ol4jsts = new jsts.io.OL3Parser();
    var active;
    var map_;
    var layer;
    var feature;
    var url = config.publicService + "/geometry/modifyBoundary.do";
    function setActive(bool, fea, done) {
        if (bool == active) {
            return;
        }
        if (bool) {
            var call = function (evt) {
                var lineFeature = evt.feature;
                var ids = [];
                var selectId = fea.getProperties().ID;
                ids.push(selectId);
                var crossesArr = [];
                crossesArr.push(wktFormat.writeFeature(fea));
                if (_isCrosses(evt.feature, fea)) {
                    var layer = _getLayer(fea);
                    var features = layer.getSource().getFeatures();
                    for (var i = 0; i < features.length; i++) {
                        var id = features[i].getProperties().ID;
                        var wkt = wktFormat.writeFeature(features[i]);
                        if (_isCrosses(lineFeature, features[i])) {
                            if (id != selectId) {
                                crossesArr.push(wkt);
                                ids.push(Number(id));
                            }
                        }
                    }
                    var data = { lineWkt: wktFormat.writeFeature(lineFeature), geoWkts: crossesArr, ids: ids };
                    $.ajax({
                        url: url,
                        type: "POST",
                        data: { data: JSON.stringify(data) },
                        success: function (res) {
                            if (res.result == "success") {
                                $("#map").removeClass("noTrack");
                                var geometrys = res.data.geometrys;
                                var idArr = res.data.ids;
                                var features = _createFeature(geometrys, idArr, ids);
                                done(features, ids);
                            }
                        },
                        error: function (err) {
                            util.validateSession(err);
                            console.log(err);
                        }
                    });
                }
            };
            drawMap.draw("LineString", call);
            $("#map").addClass("noTrack");
        } else {
            drawMap.clear();
        }
        active = bool;
    }
    /**
     * 获取图形来自于那个图层
     * @param {any} feature
     */
    function _getLayer(feature) {
        var property = feature.getProperties();
        var layerName = property.C_XIAN + "_" + property.C_WORKYEAR;
        return publicObj.getLayerByName(layerName);
    }
    /**
     *判断线是否穿过面
     * @param {any} lineFeature ol.geom.linestring
     * @param {any} polygonFeature ol.geom.polygon
     */
    function _isCrosses(lineFeature, polygonFeature) {
        var jstsLine = jsts4wkt.read(wktFormat.writeFeature(lineFeature));
        var jstsPolygon = jsts4wkt.read(wktFormat.writeFeature(polygonFeature));
        return jstsLine.crosses(jstsPolygon);
    }
    /**
     *创建feature
     * @param {any} geometrys wkt格式图形数组
     * @param {any} idArr 处理后的id数组
     * @param {any} ids 处理前的id数组
     * @returns
     */
    function _createFeature(geometrys, idArr, ids) {
        var features = [];
        for (var i = 0; i < idArr.length; i++) {
            var id = idArr[i];
            if (id > 0) {
                var wkt = geometrys[i];
                var feature = wktFormat.readFeature(wkt);
                feature.setProperties({ ID: id });
                features.push(feature);
                ids.remove(id)
            }
        }
        return features;
    }
    /**
     * 获得面积最大的feature  针对于面  或者多面
     * @param {array} fs
     * @returns
     */
    function getMaxArea(fs) {
        fs.sort(function (f1, f2) {
            var area1 = getArea(f1);
            var area2 = getArea(f2);
            return area2 - area1;
        })
        return fs[0];
    }
    /**
     * 获得 面或多面feature的面积
     * @param {any} f
     */
    function getArea(f) {
        var area = 0;
        var g = f.getGeometry();
        var type = g.getType();
        if (type === 'GeometryCollection') {
            var gs = g.getGeometries();
            for (var i = 0; i < gs.length; i++) {
                area += gs[i].getArea();
            }
        }
        if (type === 'Polygon') {
            area = g.getArea();
        }
        return area;
    }
    return {
        setActive: setActive,
        getMaxArea: getMaxArea
    }
});