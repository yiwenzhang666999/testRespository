define(["map","drawMap","publicObj","config"],function(c,k,g,f){var e=new ol.format.WKT();var d=new jsts.io.WKTReader();var l=new jsts.io.OL3Parser();var h;var j;var i;var b=f.publicService+"/geometry/difference.do";function a(n,o,m){if(n==h){return}if(n){var p=function(q){window.openAlert();var r=e.writeFeature(q.feature);var t=e.writeFeature(o);var s={geoWkt:t,geo1Wkt:r,tolerance:"0"};$.ajax({url:b,type:"POST",data:{data:JSON.stringify(s)},success:function(u){if(u.result){$("#map").removeClass("noTrack");m(u.data)}},error:function(u){if(u){util.validateSession(u);console.error(u)}}})};k.draw("Polygon",p);$("#map").addClass("noTrack")}else{k.clear()}h=n}return{setActive:a}});