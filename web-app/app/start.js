/**
 * 全局初始化设置
 */

require(["map","severZtree","ztLayerCro","toolCro","querySpace","report","zyjg","shapeMain","loadTree","bhdk","shdk","pointQuery","config","attrQuery"], function (map,severZtree,ztLayerCro,toolCro,querySpace,report,zyjg,shapeMain,loadTree,bhdk,shdk,pointQuery,config,attrQuery) {
    window.map = map;//暴露map用于调试
	map.init();
	//右下角地图控制
	ztLayerCro.init();
	//初始化 加载树
	loadTree.init();
	//左侧树控制
	severZtree.init();
	//工具条按钮控制
	toolCro.init();
	//查询初始化
    querySpace.init();
    //初始化政区
    zyjg.init();
    //初始化统计报表
	report.init();
	//初始化 导入map
	shapeMain.init();
	//变化地块导入数据
	bhdk.init();
	//审核地块
	shdk.init();
	//属性查询
	attrQuery.init();
	//新增特殊查询 01.22
	bindAndQuery();
	//定义参数 在判断session中使用
    window.sessionTime1=0,window.sessionTime2=0,window.sessionTimes=1,window.sessionInter;
    //绑定定时器
    bindMapEvents();
    bindTimeOut();
	//判断是否有提示信息
    if(config.hintInfo){
    	$("#map_continer .map-tool .hintInfo").show();
    	var html="<marquee scrolldelay='180'>"
    			+config.hintInfo
    			+"</marquee>"	
    	$("#map_continer .map-tool .hintInfo").html(html);
    }
    if(window.addEventListener){
		if(document.body.requestFullscreen){
			 document.addEventListener('fullscreenchange',function(){
				 if(document.fullscreenElement){
					 window.ldyzt_fullScreen=true;
				 }else{
					 window.ldyzt_fullScreen=false;
				 }
			 });
		}else if(document.body.msRequestFullscreen){
			 document.addEventListener('MSFullscreenChange',function(){
				 if(document.msFullscreenElement){
					 window.ldyzt_fullScreen=true;
				 }else{
					 window.ldyzt_fullScreen=false;
				 }
			 });
		}else if(document.body.mozRequestFullScreen){
			 document.addEventListener('mozfullscreenchange',function(){
				 if(document.mozFullScreenElement){
					 window.ldyzt_fullScreen=true;
				 }else{
					 window.ldyzt_fullScreen=false;
				 }
			 });
		}else if(document.body.webkitRequestFullscreen){
			 document.addEventListener('webkitfullscreenchange',function(){
				 if(document.webkitFullscreenElement){
					 window.ldyzt_fullScreen=true;
				 }else{
					 window.ldyzt_fullScreen=false;
				 }
			 });
		}
	}
    
function bindAndQuery(){
    	$("#test_query").bind('click',function(){
    		if(window.istest_query){
    			return;
    		}
    		window.istest_query=true;
    		/*var features = window.pointlay.getSource().getFeatures();
    		for(var i=0;i<features.length;i++){
    			var item = features[i];
    			item.setStyle();
    			item.setProperties({name:"刘永恒",age:i,sex:"男"});
    		}
    		window.test_layer.getSource().addFeatures(features);*/
    	});
    	 window.test_layer = new ol.layer.Vector({
         	zIndex:99998,
             source: new ol.source.Vector(),
             style: function (feature) {
                 if (feature.get('style')) {
                     return feature.get('style');
                 } else {
                     var style__ = new ol.style.Style({
                         stroke: new ol.style.Stroke({
                             color: '#92f9f8',
                             width: 5
                         }),
                         fill: new ol.style.Fill({
                             color: '#abe81c'
                         }),
                         image: new ol.style.Circle({
                             radius: 6,
                             fill: new ol.style.Fill({
                                 color: '#ffcc33'
                             })
                         })
                     });
                     return style__;
                 }
             },
             opacity: 1
         });
    	 
    	 map.getMap().addLayer(window.test_layer);
    	 window.test_layer.setVisible(false);
    	 var geojsonFormat = new ol.format.GeoJSON();
         var callback = function(geojson){
        	 if(geojson){
        		 var features = geojsonFormat.readFeatures(geojson);
        		 window.test_layer.getSource().addFeatures(features);
        	 }
         }
         get_geojson("thefile",callback);
         map.getMap().on('moveend',function(event){
        	 var zoom = event.target.getView().getZoom();
        	 if(zoom>9){
        		 window.test_layer.setVisible(true);
        	 }else{
        		 window.test_layer.setVisible(false);
        	 }
         });
}
function get_geojson(name,callback){
	 if (name){
             var url ="geojson/" + name + ".json?"+new Date().getTime();   //加载路径
             $.get(url).done(function (res) {
            	 /*var geojson = {type:"FeatureCollection"};
            	 var features = [];
            	 for(var i=0;i<res.features.length;i++){
            		 features.push(JSON.parse(res.features[i]));
            	 }
            	 geojson.features=features;*/
                 callback(res);
             }).fail(function (err) {
                 console.log(err);
             });
     }
}
//绑定地图的 移动和缩放事件 25 min=1500000ms
function bindMapEvents(){
	var mainMap=map.getMap()
	mainMap.on("movestart",function(e){
		sessionTime2=(new Date()).valueOf();
		if(sessionTime1!=0 && sessionTime2-sessionTime1>=1500000){
			clearInterval(sessionInter);
			//做一次ajax请求
			ajaxFunftion();
		}else{
			sessionTimes=0;
		}
		sessionTime1=sessionTime2;
	});
	
	mainMap.on("pointermove",function(e){
		sessionTime2=(new Date()).valueOf();
		if(sessionTime1!=0 && sessionTime2-sessionTime1>=1500000){
			clearInterval(sessionInter);
			//做一次ajax请求
			ajaxFunftion();
		}else{
			sessionTimes=0;
		}
		sessionTime1=sessionTime2;
	});
}
//开启定时器
function bindTimeOut(){
	sessionInter=setInterval('ajaxFunftion()',1500000);
}
//ajax 请求
window.ajaxFunftion=function (){
	$.ajax({
		url : "testAjax.do",
		type : 'post',
		cache : false,
		success : function(value) {
			/*if (value.result == "success") {
				callback.callback(value.data);
			}*/
			//先清除 再重新开启
			console.log("清除了定时器");
			window.clearInterval(sessionInter);
			if(sessionTimes<=24){
				sessionTimes++;
				console.log("开启定时器");
				sessionInter=setInterval('ajaxFunftion()',1500000);
			}
			
		},
		error : function(evt) {
			if (evt.responseText == "timeout"||evt.status==0) {
				window.location.href = "login.do";
			} else {
				console.log(evt);
			}
		}
	});
}
   	 
});
