/**
 *分割功能
 */
define([
    'map',
    'drawMap', 'publicObj', 'config'
], function (map, drawMap, publicObj, config) {
    'use strict';
    var wktFormat = new ol.format.WKT();
    var jsts4wkt = new jsts.io.WKTReader();
    var ol4jsts = new jsts.io.OL3Parser();
    var active;
    var map_;
    var layer;
    var feature;
    var url = config.publicService + "/geometry/cut.do";
    function setActive(bool, fea, done) {
        if (bool == active) {
            return;
        }
        if (bool) {
            fea.setStyle(publicObj.selectStyle);
            var call = function (evt) {
                var splitLine = evt.feature;
                var targetFeature = fea;
                var lineWkt = wktFormat.writeFeature(splitLine);
                var geoWkt = wktFormat.writeFeature(fea);
                var data = { geoWkt: geoWkt, lineWkt: lineWkt, tolerance: "0" };
                $.ajax({
                    url: url,
                    type: "POST",
                    data: { "data": JSON.stringify(data) },
                    success: function (res) {
                        if (res.result) {
                            $("#map").removeClass("noTrack");
                            var datas = res.data;
                            var features = [];
                            for (var i = 0; i < datas.length; i++) {
                                var feature = wktFormat.readFeature(datas[i]);
                                features.push(feature);
                            }
                            done(features);
                        }
                    },
                    error: function (err) {
                        if (err) {
                            util.validateSession(err);
                            console.error(err)
                        }
                    }
                });
            };
            drawMap.draw("LineString", call);
            $("#map").addClass("noTrack");
        } else {
            drawMap.clear();
        }
        active = bool;
    }
    return {
        setActive: setActive
    }
});