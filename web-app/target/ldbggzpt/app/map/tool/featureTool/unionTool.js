define(["map","util","config"],function(a,g,f){var d=new ol.format.WKT();var b=new jsts.io.WKTReader();var j=new jsts.io.OL3Parser();var c=f.publicService+"/geometry/union.do";function h(o,k){var l=i(o);if(l){var q=e(o);if(q){var m=[];for(var n=0;n<o.length;n++){m.push(d.writeFeature(o[n]))}var p={geoWkt:m[0],geo1Wkt:m[1],tolerance:"0"};$.ajax({url:c,type:"POST",data:{data:JSON.stringify(p)},success:function(s){if(s.result=="success"){var r=d.readFeature(s.data);if(k){k(r)}}},error:function(r){g.validateSession(r);console.log(r)}})}else{mini.alert("请选择相交图斑进行合并!","温馨提示");return null}}else{mini.alert("请选择同一个县内的图斑进行合并！","温馨提示");return null}}function i(n){var m=n[0];var l=n[1];var k=false;if(m.getProperties().C_XIAN!=l.getProperties().C_XIAN){k=false}else{k=true}return k}function e(l){var m=false;var k=new jsts.io.OL3Parser();var o=k.read(l[0].getGeometry());var n=k.read(l[1].getGeometry());if(o.intersects(n)||o.touches(n)){m=true}else{m=false}return m}return{union:h}});