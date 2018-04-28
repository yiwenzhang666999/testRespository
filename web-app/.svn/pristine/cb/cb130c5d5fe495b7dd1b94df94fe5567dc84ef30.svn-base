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
    var url = config.publicService + "/geometry/difference.do";
    function setActive(bool, fea, done) {
        if (bool == active) {
            return;
        }
        if (bool) {
            var call = function (evt) {
            	window.openAlert();
                var burrowWkt = wktFormat.writeFeature(evt.feature);
                var geoWkt = wktFormat.writeFeature(fea);
                var data = { geoWkt: geoWkt, geo1Wkt: burrowWkt, tolerance: "0" };
                $.ajax({
                    url: url,
                    type: "POST",
                    data: { "data": JSON.stringify(data) },
                    success: function (res) {
                        if (res.result) {
                            $("#map").removeClass("noTrack");
                            done(res.data);
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
            drawMap.draw("Polygon", call);
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