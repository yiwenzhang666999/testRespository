define(["config","util"],function(d,g){window.attrQuery_={};var l=window.attrQuery_;function n(){g.addEventListener("CLEAR",a);$(".zs-toolbar .btns a.tool-cx").click(function(){var o=$("#attr_pop").modal({title:"属性查询",overlay:false,showMin:true,showMax:false,showTop:false,isDrag:true,fullScreenId:"map_continer",contentWidth:350,type:"ajax",target:"./ibox/attrQuery.html",addCallBack:function(){$("#sxcx-btn .reset-button").unbind("click").on("click",b);$("#sxcx-btn .query-button").unbind("click").on("click",k);m();$("#qingchu").click()}});o.click()})}function a(){map.getLayerByName("ATTRQUERY_LAYER").getSource().clear()}function m(){var q="FS_BUSINESS_USERBUSLAYERS";var p=userObj;var r=p.userId;var u=window.appid_;var t="I_USERID = '"+r+"' and C_APPID ='"+u+"'";var s={callback:function(v){var x=$("#attrShengData");if(!v){var w="<option value =''>无省数据</option>";x.html(w)}else{if(v.length>0){var w="<option value=''>--请选择--</option>"+v[0];x.html(w)}else{var w="<option value =''>无省数据</option>";x.html(w)}}},exceptionHandler:function(v){console.log("错误信息："+v)}};var o={tableName:q,whereStr:t};$.ajax({url:"getAttrShengZqList.web",type:"POST",data:{data:JSON.stringify(o)},cache:false,dataType:"json",success:s.callback,error:s.exceptionHandler})}function b(){$("#attrShengData").children().eq(0).attr("selected",true).siblings().attr("selected",false);$("#attrShiData").children().eq(0).attr("selected",true).siblings().attr("selected",false);$("#attrXianData").children().eq(0).attr("selected",true).siblings().attr("selected",false);$("#attrXiangData").children().eq(0).attr("selected",true).siblings().attr("selected",false);$("#attrCunData").children().eq(0).attr("selected",true).siblings().attr("selected",false);$("#attrShiData").html("<option value=''>--请选择--</option>");$("#attrXianData").html("<option value=''>--请选择--</option>");$("#attrXiangData").html("<option value=''>--请选择--</option>");$("#attrCunData").html("<option value=''>--请选择--</option>");$("#ysbhyy").children().eq(0).attr("selected",true).siblings().attr("selected",false);$("#hsbhyy").children().eq(0).attr("selected",true).siblings().attr("selected",false);$("#shzt").children().eq(0).attr("selected",true).siblings().attr("selected",false);var q=$("#popIbox_sxcx")[0];var r=q.getElementsByTagName("input");for(var p=0;p<r.length;p++){var o=r[p];$(r[p]).val("")}}function k(){var p="ZYJG_BHTB";var o=$("#attrXianData").siblings("input").val();if(!o){return mini.alert("请选择县调查范围！","温馨提示")}var t=$("#popIbox_sxcx")[0];var v=t.getElementsByTagName("input");var u={};var q="";for(var s=0;s<v.length;s++){var r=v[s];u[r.name]=r.value;if(r.type!="hidden"&&r.name!="D_AREA"&&r.value){q+=r.name+" like '%"+r.value+"%' and "}else{if(r.type=="hidden"&&r.name!="D_AREA"&&r.value&&r.name!="C_SHI"&&r.name!="C_SHENG"){q+=r.name+" = '"+r.value+"' and "}else{if(r.name=="D_AREA"&&r.value){if(r.className=="left"&&r.value){q+=r.name+" >= "+r.value+" and "}else{if(r.className=="right"&&r.value){q+=r.name+" <= "+r.value+" and "}}}}}}q=q.substr(0,q.length-4)?q.substr(0,q.length-4):"1=1";map.getLayerByName("ATTRQUERY_LAYER").getSource().clear();$.ajax({url:"getSpaceQueryData.web",type:"POST",data:{data:JSON.stringify({tableName:p,whereStr:q,zqCode:o})},success:function(w){if(typeof(w)=="string"){var x=JSON.parse(w);return mini.alert("查询失败，错误信息："+x.message,"失败提示")}if(w.length>0){$(".min-btn").click();$(".tool-py").click();c(w)}else{mini.alert("该调查范围内没有变化图斑！","温馨提示")}},error:function(w){}})}function c(t){var q=new ol.style.Style({fill:new ol.style.Fill({color:"rgba(255,255,255,0)"}),stroke:new ol.style.Stroke({color:"rgb(255,0,0)",width:3})});var p=new ol.format.WKT();map.getLayerByName("ATTRQUERY_LAYER").getSource().clear();for(var s=0;s<t.length;s++){var v=t[s].originalObjects.C_OBJINFO;if(v.indexOf("(((")==0){v="MULTIPOLYGON "+v}else{if(v.indexOf("((")==0){v="POLYGON  "+v}}var r=p.readFeatureFromText(v);r.setStyle(q);map.getLayerByName("ATTRQUERY_LAYER").getSource().addFeature(r)}var u=map.getLayerByName("ATTRQUERY_LAYER").getSource().getExtent();var o=map.getMap().getView();o.fit(u)}function e(t){$(t).siblings("input").val(t.value);if(!t.value){$("#attrShiData").siblings("input").val("");$("#attrShiData").html("");$("#attrXianData").siblings("input").val("");$("#attrXianData").html("");$("#attrCunData").siblings("input").val("");$("#attrCunData").html("");$("#attrXiangData").siblings("input").val("");$("#attrXiangData").html("");$("#attrCunData").siblings("input").val("");$("#attrCunData").html("");return}var u="FS_BUSINESS_USERBUSLAYERS";var v=userObj;var s=v.userId;var w=window.appid_;var o=$("#attrShengData").val();var p="I_USERID = '"+s+"' and C_APPID ='"+w+"' and C_SHENG = '"+o+"'";var r={callback:function(x){var z=$("#attrShiData");if(!x){var y="<option value =''>无市数据</option>";z.html(y)}else{if(x.length>0){var y="<option value=''>--请选择--</option>"+x[0];z.html(y)}else{var y="<option value =''>无市数据</option>";z.html(y)}}},exceptionHandler:function(x){console.log("错误信息："+x)}};var q={tableName:u,whereStr:p};$.ajax({url:"getAttrShiZqList.web",type:"POST",data:{data:JSON.stringify(q)},cache:false,dataType:"json",success:r.callback,error:r.exceptionHandler})}function j(t){$(t).siblings("input").val(t.value);if(!t.value){$("#attrXianData").siblings("input").val("");$("#attrXianData").html("");$("#attrCunData").siblings("input").val("");$("#attrCunData").html("");$("#attrXiangData").siblings("input").val("");$("#attrXiangData").html("");$("#attrCunData").siblings("input").val("");$("#attrCunData").html("");return}var u="FS_BUSINESS_USERBUSLAYERS";var v=userObj;var s=v.userId;var w=window.appid_;var r=$("#attrShiData").val();var o="I_USERID = '"+s+"' and C_APPID ='"+w+"' and C_XIAN like '%"+r+"__'";var q={callback:function(x){var z=$("#attrXianData");if(!x){var y="<option value =''>无县数据</option>";z.html(y)}else{if(x.length>0){var y="<option value=''>--请选择--</option>"+x[0];z.html(y)}else{var y="<option value =''>无县数据</option>";z.html(y)}}},exceptionHandler:function(x){console.log("错误信息："+x)}};var p={tableName:u,whereStr:o};$.ajax({url:"getAttrXianZqList.web",type:"POST",data:{data:JSON.stringify(p)},cache:false,dataType:"json",success:q.callback,error:q.exceptionHandler})}function i(o){$(o).siblings("input").val(o.value);if(!o.value){$("#attrXiangData").siblings("input").val("");$("#attrXiangData").html("");$("#attrCunData").siblings("input").val("");$("#attrCunData").html("");return}$.ajax({type:"GET",url:d.publicService+"/ws/rest/LS/search/"+o.value,dataType:"JSON",success:function(s){var r=s.child;var q="<option value=''>--请选择--</option>";for(var p=0;p<r.length;p++){q+="<option value='"+r[p].code+"'>"+r[p].name+"</option>"}$("#attrXiangData").html(q)}})}function h(p){var r=$(p).find("option:selected").text();$(p).siblings("input").val(r);if(!r){$("#attrCunData").siblings("input").val("");$("#attrCunData").html("");return}var q={};q.whereString="L_PARID = '"+p.value+"'";var o={callback:function(t){var x=$("#attrCunData");if(!t){var w="<option value =''>无村数据</option>";x.html(w)}else{if(t.length>0){var u="<option value=''>--请选择--</option>";for(var s=0;s<t.length;s++){var v=t[s].originalObjects;u+="<option value='"+v.C_ZQCODE+"'>"+v.C_ZQNAME+"</option>"}x.html(u)}else{var w="";x.html(w)}}},exceptionHandler:function(s){console.log("错误信息："+s)}};FsService.getEntityList("FL_SYS_ZQSJZD",q,o)}function f(o){var p=$(o).find("option:selected").text();$(o).siblings("input").val(p)}l.shengChange=e;l.shiChange=j;l.xianChange=i;l.xiangChange=h;l.cunChange=f;return{init:n}});