﻿/**
 * 导入 shape文件
 * 1.先用H5 的FileReader 将文件转为readAsArrayBuffer 在转为 Int8Array
 * 2.用shapefile.js 中的方法进行转换
 */
define(["shapefile","config","layerFactory","treeHelper","severZtree",'util'], function (shapefile,config,layerFactory,treeHelper,severZtree,util) {
	'use strict';
	var layerName="SHAPE_LAYER";
	var allLayers = {};
	//暂时做个控制 ，同一个用户不允许同时配准两份数据
	var isLoading=false;
	//导入的shape数据
	var shapeData=[];
	//导入图层的四至，导入完成后将主地图定位过去
	var layerExtent;
	//弹框的map对象
	var map_;
	var geojsonFormat = new ol.format.GeoJSON();
	var defaultStyle = new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          })
        });
	//导入的图层
	var layer_;
	// 校准点图层的source
	var pointSource=new ol.source.Vector();
	// 校准点连线图层的source
	var lineSource=new ol.source.Vector();
	//校准点的 图层
	var pointLayer;
	//校准点的 线 图层
	var lineLayer;
	//校准点绘制对象
	var draw;
	//校准线绘制事件
	var drawLineString;
	//点绘制的计数
	var pointCount=0;
	//new style 当加的点为偶数时 点的颜色变为红色
	//存放点集合 需要传到后台
	var checkPoints=[];
	//临时点对象
	var tempPoint={from:'',to:''};
	//设置投影
    var epsg = "EPSG:" + config.MAP.WKID;
    var projection = new ol.proj.Projection({
        code: epsg,
        extent: config.MAP.EXTENT
    });
    var view = new ol.View({
        center: config.MAP.CENTER,
        zoom: config.MAP.ZOOM,
        maxZoom: config.MAP.MAXZOOM,
        minZoom: config.MAP.MINZOOM,
        projection: projection
    });
    //树对象
    var tree = treeHelper.getTree("zyjg");
    //树节点
    var treeDataZ=null;
    window.treeH=treeHelper;
    var treeObjz = $("#zyjg_ywsj");
    //地图图层集合
    var layerNames=['TIAN_VEC','TIAN_IMG','LDXB','XZQH','LDYX','YNYBYX','SSYX'];
    var timer=null;//js 定时器
    var timerCount=0;//循环次数  超过5次 不再循环
    //初始化方法  绑定事件 创建map 
	function init(){
		// 新增事件
		 tree.bindEvent(treeHelper.eventTarget.YWSJ,treeHelper.events.ADD_CLICK,function(node){
			 	if(isLoading){
			 		mini.alert("当前数据正在配准，请稍后...","温馨提示");
			 		return;
			 	}
		    	$("#import_map").show();
		    	if(!map_){
		    		initMap();
		    		initLayer();
		    	}
		    });
		 //删除事件
		 tree.bindEvent(treeHelper.eventTarget.YWSJ,treeHelper.events.DEL_CLICK,function(node){
//		    	console.log(node);
		    	var data=node._data;
		    	var id=data["layerId"];
		    	var shengCode=data["zqCode"];
		    	if(!id||!shengCode){
		    		return;
		    	}
		    	//
		    	mini.confirm("您确定要删除这个图层吗？", "温馨提示",  
	    		    function (action) {  
	    		        if (action == "ok") {  
	    		        	delLayer(id,shengCode);  
	    		        } else{
	    		    		return false;
	    		    	} 
	    		    }  
	    		); 
		    });
		 //点击图层进行定位
		 tree.bindEvent(treeHelper.eventTarget.YWSJ,treeHelper.events.NODE_CLICK,function(node){
     		var data=node["_data"];
     		if(data&&data["layerExtent"]){
				var extent=JSON.parse(data["layerExtent"]);
				map.getMap().getView().fit(extent);
			}
         });
		$("#import-btn-input").on("change",importZip);
		moEvent();
        layerCtr();
        if($("#point-check").is(":hidden")){
    		$("#import_map .zs-tree a.first").trigger("click");
    	}
        //绑定绘制点的事件
		$("#check_point").click(drawPoint);
        //取消绘制点时间
        $("#uncheck_point").click(cancle);
        $(".opa-box .btn-del").click(removePoint);
        //checkbox勾选
        $("#point-check .ck-box").on("click",function(event){
        	event.stopPropagation();
			var tarA = $(this).parents("a");
			var flag;
			if(tarA.hasClass("selected")){
				flag = false;
				tarA.removeClass("selected");
			}else{
				flag = true;
				tarA.addClass("selected");
			}
			tarA.find("input[type=checkbox]").prop("checked", flag);
			$(".zs-tree-box").getNiceScroll().resize();
        });
        //导入图层
        $(".zs-tree .add.ywsj").click(function(){
        	/*$(".import_pop").show();*/
        	$("#import_map").show();
        	if(!map_){
        		initMap();
        		initLayer();
        	}
        });
        //开始
        $("#zs-btn-start").click(function(){
        	$("#import_map").show();
        	if(!map_){
        		initMap();
        		initLayer();
        	}
        	if(shapeData.length>0){
    			handShapeData();
    		}
        });
        //取消
        $("#zs-btn-cancle").click(function(){
        	$(".import_pop").hide();
        });
        //关闭
        $(".tool-close").click(function(){
        	$("#import_map").hide();
        });
        //点击配准点 实现定位
        $("#point-check a span").on("click",function(){
        	pointClick(this);
        });
        /**
         * 开始校准的点击事件
         * 用formdata 将上传的zip文件提交到后台
         * 并且将处理后的（字符串） 配准点数据也传到后台
         */
        $(".tool-kspz").click(function(){
        	submitFile();
        	});
        //清空
        $(".opa-box .btn-clear").click(clearPoints);
//        $("#point-check a").on("click",removePoint);
//		$("#file").on("change",importZip);
	};
	
	window.queryData=function(returndata){
		tree=treeHelper.getTree("zyjg");
		var uuid=returndata.data.uuid;
		 var tem_obj={"uuid":uuid};
//		 console.log(uuid);
		 $.ajax({
			 url:"queryState.do",
			 type: 'POST',  
            data: {data:JSON.stringify(tem_obj)},  
            async: false,  
            cache: false,  
            success:function(result){
           	 if(result.data.length>0){
           		var res=result.data[0]["originalObjects"];
           		var la_id=res["I_ID"];
           		var  layerName=res["C_DATANAME"];
           		var ext=res["C_FULLEXTENT"];
           		var zqcode=res["C_SHENG"]
               	//树上生成 不能点击的节点
           		if(!treeDataZ){
           			treeDataZ={id:la_id,text:layerName,
           				 pid:"ywsj",
           				 layerId:la_id,
           				 showDel:true,
           				 type:"z",
           				 edit:true,
           				 isQuery:true,
           				 _data:{layerId:la_id,type:"ywsj",layerExtent:ext,zqCode:zqcode}};
           			tree.addNodes(treeDataZ);
                 	treeDataZ["disableCheck"]=true;
                 	tree.updateNodes(treeDataZ);
           		}
        		 if(res["I_STATE"]=="2"){
        			 clearInterval(timer);
               		 timer=null;
               		isLoading=false;
        			 checkSuccess(result);
        		 }else if(res["I_STATE"]=="-1"){
        			 clearInterval(timer);
               		 timer=null;
               		 timerCount=0;
               		 treeDataZ=null;
               		isLoading=false;
        			 mini.alert("配准失败！请检查数据或者联系管理员！","失败提示");
        			 $(".check-alert-div").hide();
        		 }
           		 
           	 }
            },
            error:function(err){
            	util.validateSession(err);
           	 	console.log(err);
            }
		 });
	};
	function checkSuccess(res){
		 var File_= document.getElementById("import-btn-input").files[0];
		 var File=File_.name.split(".")[0];
		 var data=res["data"][0]["originalObjects"];
 		var la_id=data["I_ID"];
 		var name=data["C_DATANAME"];
// 		var ext=data["C_FULLEXTENT"];
 		treeDataZ.disableCheck=false;
      	 /*treeDataZ={id:la_id,text:name,
 				 pid:"ywsj",
 				 layerId:la_id,
 				 showDel:true,
 				 type:"z",
 				 edit:true,
 				 isQuery:true,
 				disableCheck:false,
 				 _data:{layerId:la_id,type:"ywsj"}};*/
      	tree.updateNodes(treeDataZ);
      	treeDataZ=null;
		$("#zyjg li[tid='ywsj'] ul.sec-list li").last().find("i").click();
		$("#zyjg li[tid='ywsj'] ul.sec-list li").last().find("span").first().click();
		$(".check-alert-div").hide();
		mini.alert("已完成配准！","成功提示");
	}
	function initMap(){
		//创建测试 map
		var test_map = new ol.Map({
	        target: 'test_map',
	        view: view,
	        logo: false,
	    });
		map_=test_map;
	};
	function pointClick(e){
		var value=$(e).parent(".second").attr("point");
		if(!value){
			return;
		}
		var points=value.split(",");
		var arrFrom=points.from;
		var arrTo=points.to;
		var arr=[];
		arr[0]=Number(points[0]);
		arr[1]=Number(points[1]);
		map_.getView().setCenter(arr);
	};
	function fileChange(){
		   var myFiles = document.getElementById("import-btn-input").files;  
			if(!myFiles){
				return;
			}
			shapeData=[];
			 for (var i = 0, f; f = myFiles[i]; i++) {
			     readFileAsArrayBuffer(f, function(data) {
			    	shapeData.push(data);
			    }, function (e) {
			        console.error(e);
			    });
			 }
		};
		function readFileAsArrayBuffer(file, success, error) {
		    var fr = new FileReader();
		    fr.addEventListener('error', error, false);
		    	fr.addEventListener('loadstart',function(e){
		    	});
		        fr.addEventListener('load', function () {
		            success(this.result);
		        }, false);
		        
		        return fr.readAsArrayBuffer(file);
		    
		};
		function addLayer(geo){
			var geojson={
					UTF8Encoding: false,
					type:"FeatureCollection",
					features:geo,
			} 
			layer_.getSource().clear();
			layer_.getSource().addFeatures((new ol.format.GeoJSON()).readFeatures(geojson));
			var extent=layer_.getSource().getExtent();
			layerExtent=extent;
//			console.log(layerExtent);
			map_.getView().fit(extent);
			$("#layer_extent").val(layerExtent);
		};
		function importZip(){
			 var file = this.files[0];
			 var text=$("#import-btn-input").val();
			 if(!text){
				 return;
			 }
			 var index=text.lastIndexOf("\\");
			 var lastName=text.substring(text.length-4,text.length);
			 if(lastName!=".zip"){
				 mini.alert("请导入shape的.zip文件","温馨提示");
				 return;
			 }
			 var fileName=text.substring(index+1,text.length);
			 $("#import-file-text").val(fileName);
            window.un = new UnZipArchive(file);
            un.getData( function() {
                var arr = un.getEntries();
                var entries=un.entries;
                getData(entries);
                var data=[];
            });
            function getData(entries){
            	var data=[];
                for(var i=0;i<entries.length;i++){
                	var fileName=entries[i].filename;
                	var final_=fileName.substring(fileName.length-4,fileName.length);
                	if(final_==".shp"){
//                		console.log(Date.parse(new Date()));
                		entries[i].getData(new zip.BlobWriter(zip.getMimeType(entries[i].filename)), function(result) {
                			readFileAsArrayBuffer(result,function(dat){
                				shapeData=[];
                				shapeData.push(dat);
                				handShapeData();
                			});
                         });
//                		break;
                	}
                }
            };
            getMD5(file);
		};
	//初始化加载图层  值加载底图
    function initLayer(){
    	var that=this;
    	//按config图层配置加载图层
        var setLayers = function (con) {
           var layer_p = layerFactory.getLayer(con);
           allLayers[con['TABLENAME']] = layer_p;
           map_.addLayer(layer_p);
           if (con.GROUP) {
               for (var j = 0; j < con.GROUP.length; j++) {
                   var con_c = con.GROUP[j];
                   var layer_c = layerFactory.getLayer(con_c);
                   allLayers[con_c['TABLENAME']] = layer_c;
                   map_.addLayer(layer_c);
               }
           }
       }
      //加载所有图层
        var all_layers =config.LAYER;
        for(var j=0;j<layerNames.length;j++){
        	for (var i = 0; i < all_layers.length; i++) {
        		if(layerNames[j]==all_layers[i].TABLENAME){
        			setLayers(all_layers[i]);
        			continue;
        		}
            }
        }
        //导入的图层
        layer_ = new ol.layer.Vector({
			source: new ol.source.Vector(),
	        style: defaultStyle,
	        zIndex:10005
	      });
        //校准点图层
        pointLayer = new ol.layer.Vector({
			source: pointSource,
			zIndex:20010,
			style: new ol.style.Style({  
                //样式填充  
                fill: new ol.style.Fill({  
                    //填充颜色  
                    color: 'rgba(37,241,239,0.2)'  
                }),  
                //笔触  
                stroke: new ol.style.Stroke({  
                    //笔触颜色  
                    color: '#264df6',  
                    //笔触宽度  
                    width:2  
                }),  
                //图形样式，主要适用于点样式  
                image: new ol.style.Circle({  
                    //半径大小  
                    radius: 7,  
                    //填充  
                    fill: new ol.style.Fill({  
                        //填充颜色  
                        color: '#0099FF'  
                    })  
                })  
            })
        });
        //校准点 线图层
        lineLayer=new ol.layer.Vector({
			source: lineSource,
			zIndex:20010,
			style: styleFunction
        });
        map_.addLayer(layer_);
        map_.addLayer(lineLayer);
        map_.addLayer(pointLayer);
    };
    /**
     * 鼠标事件
     */
    function moEvent() {
        $('.mapType-wrapper-import').mouseenter(function () {
            if ($('.mapType-import').is(":animated")) { return; }
            $('.mapType-import').animate({
                width: '864px',
                backgroundColor: 'rgba(255, 255, 255, .4)',
            }, 0);
            $('.second-import').animate({ right: '105px' }, 0);
            $('.ldxb-import').animate({ right: '201px' }, 0);
            $('.dcfw-import').animate({ right: '297px' }, 0);
            $('.ygyx-import').animate({ right: '393px' }, 0);
        })
        // 鼠标移出右下角地图切换
        $('.mapType-wrapper-import').mouseleave(function () {
            if ($('.mapType-import').is(":animated")) { return; }
            $('.mapType-import').delay('2000').animate({
                width: '110px',
                backgroundColor: 'rgba(255, 255, 255, 0)',
            }, 0);
            $('.second-import').delay('2000').animate({ right: '12px' }, 0);
            $('.ldxb-import,.dcfw-import,.ygyx-import').delay('2000').animate({ right: '20px' }, 0);
        })
    };
    /**
     * 图层控制
     */
    function layerCtr() {
        $(".mapType-wrapper-import .clk").on("click", function () {
            var $target = $(this);
            var bool_all = $target.hasClass("switch");
            var bool_sig = $target.hasClass("single");
            //
            var show_layer = $target.attr("layer");
            var hide_layer = $target.attr("hide");
            //
            var checked = $target.attr("checked");
            if (show_layer) {
                if (bool_all) {        //专题图 全选
                    if (checked) {  //选择
                    	showLayer(show_layer);
                        //处理互斥
                        if (hide_layer) {
                            $.each(hide_layer.split(","), function (k, v) {
                            	hideLayer(v);
                                //处理单选框显示
                                var $only = $("input[layer='" + v + "']");
                                $only.attr("checked",false)
                                $($only.parent().parent()).find("input[class='clk single']").each(function () {
                                    $(this).attr("checked", false);
                                })
                            });
                        }
                        //处理 单选框 组
                        $($target.parent().parent()).find("input[class='clk single']").each(function () {
                            $(this).attr("checked", 'checked');
                        })
                    } else {      //取消
                    	hideLayer(show_layer);
                        //处理 单选框 组
                        $($target.parent().parent()).find("input[class='clk single']").each(function () {
                            $(this).attr("checked", false);
                        })
                    }
                } else if (bool_sig) {  //专题图 单选
                    var all_f = false;
                    if (checked) {//选择
                    	showLayer(show_layer,true);
                        all_f = "checked";
                    } else {
                    	hideLayer(show_layer,true);
                        var $single=$($target.parent().parent().parent()).find("input[class='clk single']");
                        $.each($single,function(){
                            var f_=$(this).attr("checked");
                            if(f_){
                                all_f = "checked";
                            }
                        })
                    }
                    //处理全选按钮   勾选情况
                    var $all_check_s=$($target.parent().parent().parent().parent().parent()).find("input[class='clk switch']")
                    $.each($all_check_s,function () {
                        $(this).attr("checked", all_f);
                        hide_layer=$(this).attr("hide");
                    })
                    //处理互斥
                    if(all_f&&hide_layer){
                        $.each(hide_layer.split(","), function (k, v) {
                        	hideLayer(v);
                            //处理单选框显示
                            var $only = $("input[layer='" + v + "']");
                            $only.attr("checked",false)
                            $($only.parent().parent()).find("input[class='clk single']").each(function () {
                                $(this).attr("checked", false);
                            })
                        });
                    }
                } else {              //底图控制
                	showLayer(show_layer);
                	hideLayer(hide_layer);
                    //页面样式
                    $target.addClass("active");
                    $("div[layer='" + hide_layer + "']").removeClass("active");
                }
            }
        })
    };
    /**
     * 控制图层显示
     * @param {string} tableName 图层标识
     * @param {boolean} bool 标识是单独显示（true）还是按组显示（）
     */
	function showLayer(tableName, bool) {
        if (bool) {
            allLayers[tableName].setVisible(true)
        } else {
            var arr =getLayer4Config(tableName);
            for (var i = 0; i < arr.length; i++) {
                allLayers[arr[i]].setVisible(true)
            }
        }
    }
    /**
     * 控制图层隐藏
     * @param {string} tableName
     * @param {boolean} bool 标识是单独隐藏（true）还是按组隐藏（）
     */
	function hideLayer(tableName, bool) {
        if (bool) {
            allLayers[tableName].setVisible(false)
        } else {
            var arr = getLayer4Config(tableName);
            for (var i = 0; i < arr.length; i++) {
                allLayers[arr[i]].setVisible(false)
            }
        }
    }
	/**
     * 获得对应的配置
     * @param {*} tableName
     * @return {object} param
     */
	function getLayer4Config(tableName) {
        var layers = [];
        var base = config.LAYER;
        for (var i = 0; i < base.length; i++) {
            var item = base[i];
            if (item['TABLENAME'] === tableName) {
                layers.push(tableName);
                if (item['GROUP']) {
                    $(item['GROUP']).each(function (index, v) {
                        layers.push(v['TABLENAME']);
                    })
                }
                break;
            }
        }
        return layers;
	};
	/**
	 * 绘制事件
	 * 注册 绘制事件为line（注意每条线只能有两个点，画完第二个点需要自动结束）
	 * 在两个点之间连一个带箭头的线
	 */
	function drawLine(){
		if(!drawLineString){
			drawLineString= new ol.interaction.Draw({  
                //数据源  
                source: pointSource,  
                //绘制类型  
                type: "LineString",  
                //回调函数  
                //Function that is called when a geometry's coordinates are updated  
                geometryFunction: geometryLineFunction,
                //最大点数  
                maxPoints: 2
            });
		}
		 map_.addInteraction(drawLineString);  
	}
	function geometryLineFunction (coordinates){
//		console.log(coordinates);
		var startPoint=coordinates[0];
		var endPoint=coordinates[1];
		var style=new ol.style.Style({
	            stroke: new ol.style.Stroke({
		              color: '#ffcc33',
		              width: 2
		            }),
		            //图形样式，主要适用于点样式  
		            image: new ol.style.Circle({  
		                //半径大小  
		                radius: 10,  
		                //填充  
		                fill: new ol.style.Fill({  
		                    //填充颜色  
		                    color: '#0099FF'  
		                })  
		            })
		          });
		 var styles =[];
	        styles.push(style);
		 if(startPoint[0]!=endPoint[0]||startPoint[1]!=endPoint[1]){
			 styles.push(style);
		 }
		var line=new ol.geom.LineString(coordinates);
		var feature = new ol.Feature(line);
		pointSource.addFeature(feature);
	}
	 var styleFunction = function(feature) {
	        var geometry = feature.getGeometry();
	        var style=new ol.style.Style({
	            stroke: new ol.style.Stroke({
	            		lineDash:[1,3,5],
	            		color: '#DF3B3E',
	            		width: 2
		            }),
		          });
	        var styles =[];
	        styles.push(style);
	        geometry.forEachSegment(function(start, end) {
	         var arrowLonLat = [(end[0]+start[0])/2,(end[1]+start[1])/2];  
	          var dx = end[0] - start[0];
	          var dy = end[1] - start[1];
	          
	          var rotation = Math.atan2(dy, dx);
	          // arrows
	          styles.push(new ol.style.Style({
	            geometry: new ol.geom.Point(arrowLonLat),
	            image: new ol.style.Icon({
	              src: 'images/arrow-(1).png',
	              anchor: [0.5, 0.5],
	              rotateWithView: true,
	              rotation: -rotation
	            })
	          }));
	        });

	        return styles;
	      };
    /**
     * 绘制事件 
     * 注意draw 的source 
     * 将画的点放到source 上，source是draw图层的source 图层在map上
     */
    function drawPoint(){
    	//将交互绘图对象赋给draw对象  
        //初始化交互绘图对象  
    	if(!draw){
    		draw = new ol.interaction.Draw({  
                //数据源  
                source: pointSource,  
                //绘制类型  
                type: "Point",  
                //回调函数  
                //Function that is called when a geometry's coordinates are updated  
                geometryFunction: geometryFunction,
                //最大点数  
                maxPoints: 9999
            });
    	}
        //将draw对象添加到map中，然后就可以进行图形绘制了  
//        map_.removeInteraction(draw);
        map_.addInteraction(draw);  
    };
    /**
     * 将画的点放到图层中
     * 需要根据点的个数 给定颜色  奇数oldStyle (from ) 偶数newStyle(to)
     */
    function geometryFunction(coordinates,geo){
    	var newStyle=new ol.style.Style({  
            //图形样式，主要适用于点样式  
            image: new ol.style.Circle({  
                //半径大小  
                radius: 10,  
                //填充  
                fill: new ol.style.Fill({  
                    //填充颜色  
                    color: '#e81818'  
                })  
            }),
    	 text: new ol.style.Text({ //文本样式
    	    font: '14px Calibri,sans-serif',
    	    fill: new ol.style.Fill({
    	      color: '#000'
    	    }),
    	    stroke: new ol.style.Stroke({
    	      color: '#fff',
    	      width: 3
    	    }),
    	  })
        });
    	var oldStyle=new ol.style.Style({  
            //样式填充  
            fill: new ol.style.Fill({  
                //填充颜色  
                color: 'rgba(37,241,239,0.2)'  
            }),  
            //笔触  
            stroke: new ol.style.Stroke({  
                //笔触颜色  
                color: '#264df6',  
                //笔触宽度  
                width:2  
            }),  
            //图形样式，主要适用于点样式  
            image: new ol.style.Circle({  
                //半径大小  
                radius: 10,  
                //填充  
                fill: new ol.style.Fill({  
                    //填充颜色  
                    color: '#0099FF'  
                })  
            }),
            text: new ol.style.Text({ //文本样式
        	    font: '14px Calibri,sans-serif',
        	    fill: new ol.style.Fill({
        	      color: '#000'
        	    }),
        	    stroke: new ol.style.Stroke({
        	      color: '#fff',
        	      width: 3
        	    }),
        	  })
        });
    	++pointCount;
    	var poin=new ol.geom.Point(coordinates);
    	poin.setProperties({name:String(pointCount)})
    	var feature = new ol.Feature(poin);
    	
    	if(pointCount%2==0){
    		tempPoint.to=coordinates;
    		// tempPoint  是全局的  所以需要重新定义个
    		var temp_={
    				from:tempPoint.from,
    				to:tempPoint.to
    		};
    		var p_oint=coordinates.toString();
    		checkPoints.push(temp_);
    		var a=parseInt(pointCount/2);
    		addLineFeature(pointCount,temp_);
    		newStyle.getText().setText(String(a));
    		feature.setStyle(newStyle);
    		var html='<li><a href="javascript:;" value="'+pointCount+'" class="btns second" point="'+p_oint+'"><i class="ck-box"></i><input class="ck-inp" type="checkbox" name="" id="" '+
    		'value="'+pointCount+'" /><span class="txt">配准点'+a+'</span></a></li>'
    		//加载坐标对
//    		var html="<li>校准点"+checkPoints.length+"<a point='"+pointCount+"'>删除</a></li>";
    		$("#point-check").append(html);
    		$(".alignmentNum").text(checkPoints.length);
    		if(checkPoints.length>=3){
    			$(".deviationDisplay").show();
    			alignmentDev(checkPoints);
    		}else{
    			$(".deviationDisplay").hide();
    		}
    	}else{
    		var txt=String(parseInt(pointCount/2)+1);
    		oldStyle.getText().setText(String(txt));
    		feature.setStyle(oldStyle);
    		tempPoint.from=coordinates;
    	}
    	pointSource.addFeature(feature);
    };
    //配准误差评估方法
    function alignmentDev(checkPoints){
    	var url=config.pzErrorUrl;
    	var datas =  {
                data: JSON.stringify({"controlPoints":checkPoints})
            }
    	$.ajax({
    		url:url,
    		data:{"data":JSON.stringify({"controlPoints":checkPoints})},
    		type:"GET",
			dataType: "JSON",
			success:function(res){
				var oldVal = $("#point-check a").first().attr('value');
				var oldList = $("#point-check a");
				var html="";
				for(var i in res){
					var val = parseInt(oldList.eq(i).attr("value"))/2;
					html+="<span class='devVal"+val+"'>&nbsp;&nbsp;&nbsp;&nbsp;点"+val+"的误差为"+parseFloat(res[i]).toFixed(2)+"米。</span>";
				}
				$(".devDisplayText").html(html);
    		},
    		error:function(ex){
    			console.log(ex);
    		}
    	});
    }
    //加连线
    function addLineFeature(pointCount,temp_){
    	var endPoint=temp_["to"];
    	var start=temp_["from"];
    	var coordinates=[start,endPoint];
    	var line=new ol.geom.LineString(coordinates);
		var feature = new ol.Feature({geometry:line});
		feature.setId("line_"+pointCount);
		lineSource.addFeature(feature);
    };
    //取消方法
    function cancle(){
    	//取消事件
    	map_.removeInteraction(draw);
    };
    /**
     * 删除点调用的方法
     * 
     */
    function removePoint(){
    	$("#point-check a.selected").each(function(e){
    		var value=$(this).attr("value");
        	var features=pointSource.getFeatures();
        	var obj={};
        	//remove 地图上的点
        	for(var i=0;i<features.length;i++){
        		if(features[i].getGeometry()){
        			var name=features[i].getGeometry().values_.name;
        			if(name==value){
        				obj.to=features[i].getGeometry().getExtent().splice(0,2);
        				pointSource.removeFeature(features[i]);
        			}else if(name==(value-1)){
        				obj.from=features[i].getGeometry().getExtent().splice(0,2);
            			pointSource.removeFeature(features[i]);
//            			features.remove(features[i]);
            		}
        		}
        	}
        	//remove 线图层
			var lineFeature=lineSource.getFeatureById("line_"+value);
			lineSource.removeFeature(lineFeature);
        	//remove 保存的点
        	checkPoints=removeByValue(obj);
//        	console.log(checkPoints);
        	//remove html
        	var li_=$(this).parent("li");
        	li_.remove();
        	//添加删除配准误差评估结果的值
        	var oldVal = parseInt($(".alignmentNum").text())-1;
        	$(".alignmentNum").text(oldVal);
        	var devVal_ = parseInt(value)/2;
        	$(".devVal"+devVal_).remove();
    	})
    };
    /**
     * 删除配准点数组里的因素
     * 数组里存的是对象 不能比较，手动匹配删除生成新的数组并返回
     */
    function removeByValue(obj){
    	var newArr=[];
    	for(var i=0;i<checkPoints.length;i++){
    		var obj_=checkPoints[i];
    		if(obj_.to[0]!=obj.to[0]||obj_.to[1]!=obj.to[1]||
    				obj_.from[0]!=obj.from[0]||obj_.from[1]!=obj.from[1]){
    			newArr.push(obj_);
    		}
    	}
    	return newArr;
    };
    //清除校验点
    function clearPoints(){
    	//清除 html
    	$(".import_map #point-check").empty();
    	//清除点集合
    	checkPoints=[];
    	tempPoint={from:'',to:''};
    	pointCount=0;
    	pointSource.clear();
    	lineSource.clear();
    	$(".alignmentNum").text(0);
    	$(".deviationDisplay").hide();
    	$(".devDisplayText").html('');
    };
    Array.prototype.indexOf = function(val) {
    	for (var i = 0; i < this.length; i++) {
    	if (this[i] == val){
    		return i;
    		} 
    	}
    	return -1;
    };
    Array.prototype.remove = function(val) {
    	var index = this.indexOf(val);
    	if (index > -1) {
    		this.splice(index, 1);
    	}
    };
    //将shape数据加载到地图上
    function handShapeData(){
    	for(var j=0;j<shapeData.length;j++){
    		var data=shapeData[j];
    		 var array = new Int8Array(data);
		        //调用 shapeFile的方法  截取100为
		        var sourceArry=array.slice(0,100);
		        var source={
		        		_array:array,
		        		_index:100,
		        };
		        var geo=[];
		        var sources=shapefile.Shp(source,shapefile.view(sourceArry));
		        sources.read=shapefile.shp_read;
		        sources._source.slice=shapefile.slice_slice;
		        source=sources;
		        sources.read().then(function log(results){
		        	if(source._source._array.length==source._source._index){
		        		addLayer(geo);
		        	}else{
		        		var tempObj={
			        			type: "Feature",
			        	        properties:'',
			        	        geometry: results.value
			        	};
		        		geo.push(tempObj);
		        		return source.read().then(log);
		        	}
		        })
    	}
    };
    //删除事件
    function delLayer(layerId,shengCode){
    	$.ajax({
    		url:"ywsj/del.do",
    		data:{data:JSON.stringify({"layerId":layerId,"code":shengCode})},
    		type:"POST",
			async:false,
			success:function(result){
    			if(result){
    				tree.removeNodeById(layerId);
    				mini.alert("删除成功！","成功提示");
    			}
    		},
    		error:function(ex){
    			util.validateSession(err);
    			console.log(ex);
    		}
    	});
    }
  //loading 状态判断  by 张自强 20170804
    window.loadFlag=false;
    window.openAlert=function(){
    	if(loadFlag){
    		return;
    	}
    	$("#myAlert_").show();
    	$("#myAlert_mask").show();
    	loadFlag=true;
    	$("#myAlert_mask").css({"width":document.body.scrollWidth});
    	setTimeout(function(){
    		closeAlert();
    	},50000);
    }
    window.closeAlert=function (){
    	loadFlag=false;
    	$("#myAlert_").hide();
    	$("#myAlert_mask").hide();
    }
    /**
     *获取 md5值
     */
    function getMD5(file){  
        var fileReader = new FileReader(),  
            blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,  
            chunkSize = 20971520,  
            // read in chunks of 2MB
            chunks = Math.ceil(file.size / chunkSize),  
            currentChunk = 0,  
            spark = new SparkMD5(),  
         	mdString="";
      
        fileReader.onload = function(e) {  
//            console.log("read chunk nr", currentChunk + 1, "of", chunks);  
            spark.appendBinary(e.target.result); // append binary string
            currentChunk++;  
            if (currentChunk < chunks) {  
                loadNext();  
            }  
            else {  
            	mdString=spark.end();
            	$("#md5").val(mdString);
//            	return ;
            }  
        };  
      
        function loadNext() {  
            var start = currentChunk * chunkSize,  
                end = start + chunkSize >= file.size ? file.size : start + chunkSize;  
      
            fileReader.readAsBinaryString(blobSlice.call(file, start, end));  
        };  
      
        loadNext();  
    }  
    function submitFile(){
    	var tem_=[];
    	for(var i=0;i<checkPoints.length;i++){
    		tem_.push(JSON.stringify(checkPoints[i]));
    	}
    	$("#checkPoints").val(tem_.toString());
    	// shengcode
    	var zqCode=userObj["zqCode"];
    	if(zqCode!="200000"&&zqCode!="200001"&&zqCode!="200002"&&zqCode!="200003"&&zqCode!="200004"&&zqCode!="200005"){
    		zqCode=zqCode.substring(0,2);
    	}else{
    		zqCode="200000";
    	}
    	$("#layer_shengcode").val(zqCode);
    	var formData = new FormData($("#f1")[0]);
    	var layerName=$(".ul-import-name").val();
    	if(!layerName){
    		mini.alert("请输入图层名称！","温馨提示");
    		return;
    	}
    	if(checkPoints.length!=0&&checkPoints.length<3){
    		return;
    	}
    	$("#import_map").hide();
    	$(".check-alert-div").show();
    	$("#check-ul").html(layerName+"图层数据正在配准，请稍候...");
    	isLoading=true;
    	var url="getfile.do";
    	/*FsService.getEntityList("FS_BUSINESS_USERCUSLAYERS",{selectFields:"max(I_ID) as ID"},{callback:function(res){
    		var data=res[0]["originalObjects"];
    		var la_id=Number(data["ID"])+1;
         	treeDataZ={id:la_id,text:layerName,
    				 pid:"ywsj",
    				 layerId:la_id,
    				 showDel:true,
    				 type:"z",
    				 edit:true,
    				 isQuery:true,
    				 _data:{layerId:la_id,type:"ywsj"}};
         	tree.addNodes(treeDataZ);
         	treeDataZ["disableCheck"]=true;
         	tree.updateNodes(treeDataZ);
    		},exceptionHandler:function(ex){
    			console.log("查询图层ID失败！");
    		}})*/
   	 $.ajax({  
            url: url,  
            type: 'POST',  
            data: formData,  
            async: false,  
            cache: false,  
            contentType: false,  
            processData: false,  
            success: function (returndata) {  
           	 window.returndata=returndata;
                if(returndata){
               	 //查询数据库是否 插入数据
//                	queryData(returndata);
                	timer = setInterval("queryData(returndata)", 5000);
                }  
            },  
            error: function (err) {
            	util.validateSession(err);
                console.log(err);  
            }  
       }); 
    }
	 return {
	        init: init
	    };
});
