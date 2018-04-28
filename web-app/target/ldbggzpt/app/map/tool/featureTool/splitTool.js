define(["config","map","drawMap","publicObj","util"],function(o,p,m,h,a){var n=new ol.format.WKT();var b=new jsts.io.WKTReader();var i=new jsts.io.OL3Parser();var e;var s;var q;var d;var c=o.publicService+"/geometry/modifyBoundary.do";function r(u,v,t){if(u==e){return}if(u){var w=function(G){var H=G.feature;var x=[];var z=v.getProperties().ID;x.push(z);var E=[];E.push(n.writeFeature(v));if(l(G.feature,v)){var D=j(v);var A=D.getSource().getFeatures();for(var C=0;C<A.length;C++){var y=A[C].getProperties().ID;var F=n.writeFeature(A[C]);if(l(H,A[C])){if(y!=z){E.push(F);x.push(Number(y))}}}var B={lineWkt:n.writeFeature(H),geoWkts:E,ids:x};$.ajax({url:c,type:"POST",data:{data:JSON.stringify(B)},success:function(J){if(J.result=="success"){$("#map").removeClass("noTrack");var I=J.data.geometrys;var L=J.data.ids;var K=g(I,L,x);t(K,x)}},error:function(I){a.validateSession(I);console.log(I)}})}};m.draw("LineString",w);$("#map").addClass("noTrack")}else{m.clear()}e=u}function j(u){var v=u.getProperties();var t=v.C_XIAN+"_"+v.C_WORKYEAR;return h.getLayerByName(t)}function l(v,u){var t=b.read(n.writeFeature(v));var w=b.read(n.writeFeature(u));return t.crosses(w)}function g(v,z,x){var w=[];for(var u=0;u<z.length;u++){var A=z[u];if(A>0){var y=v[u];var t=n.readFeature(y);t.setProperties({ID:A});w.push(t);x.remove(A)}}return w}function k(t){t.sort(function(u,x){var w=f(u);var v=f(x);return v-w});return t[0]}function f(y){var x=0;var w=y.getGeometry();var v=w.getType();if(v==="GeometryCollection"){var t=w.getGeometries();for(var u=0;u<t.length;u++){x+=t[u].getArea()}}if(v==="Polygon"){x=w.getArea()}return x}return{setActive:r,getMaxArea:k}});