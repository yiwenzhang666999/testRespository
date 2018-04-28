/**
 * 查询方法
 */
define([
    "config","util"
], function (config,util) {
    'use strict';
    window.attrQuery_={};
    var attrQuery_ = window.attrQuery_;
    //查询初始化
    function init(){
    	util.addEventListener('CLEAR',attrQueryClear);
    	$(".zs-toolbar .btns a.tool-cx").click(function(){
    		var attrIbox=$("#attr_pop").modal({
     			title: "属性查询",//标题
     			overlay: false,//遮罩层
     			showMin: true,//最小化
     			showMax: false,//最大化
     			showTop: false,//置顶
     			isDrag: true,//移动
     			fullScreenId:"map_continer",
     			contentWidth: 350,//主体宽度 适用于 ajax clone类型
     			type:"ajax",//请求类型  img ajax iframe alert confirm prompt clone
     			target: "./ibox/attrQuery.html",
     			addCallBack:function(){
     				//重置条件
     		        $("#sxcx-btn .reset-button").unbind('click').on('click',resetData);
     		        //查询条件方法 queryBywhere
     		        $("#sxcx-btn .query-button").unbind('click').on('click',queryBywhere);
     		        //组装政区数据
     		        getZqData();
     		        //清除地图现有高亮图层
     		        $("#qingchu").click();
     			}
     		});
    		attrIbox.click();
    	});
    }
    //清除查询图层的高亮方法
    function attrQueryClear(){
    	map.getLayerByName("ATTRQUERY_LAYER").getSource().clear();
    }
    //获取政区数据(市数据是通过用户的所拥有的图层来得到县，过滤政区表得到的)
    function getZqData(){
    	var tableName = "FS_BUSINESS_USERBUSLAYERS";
    	//TODO 现在是值根据用户ID和APPID来查找，appID是在config中赋值的，暂为'ZYJG'.
    	var userInfo = userObj;
    	var userId = userInfo.userId;
    	var appId = window.appid_;
    	var whereStr = "I_USERID = '"+userId+"' and C_APPID ='"+appId+"'";
    	var option ={
    			//生成li标签的HTML字符串
    			callback:function(res){
    				var contList = $("#attrShengData");
    				if(!res){
    					var zqHtml = "<option value =''>无省数据</option>";
    					contList.html(zqHtml);
    				}else if(res.length>0){
    					var zqHtml = "<option value=''>--请选择--</option>"+res[0];
	    				contList.html(zqHtml);
    				}else{
    					var zqHtml = "<option value =''>无省数据</option>";
    					contList.html(zqHtml);
    				}
    			},
    			exceptionHandler:function(evt){
    				console.log("错误信息："+evt);
    			}
    	};
    	var datas={tableName:tableName,whereStr:whereStr};
    	$.ajax({
			url:"getAttrShengZqList.web",
			type:"POST",
			data:{data:JSON.stringify(datas)},
			cache : false,
			dataType : 'json',
			success :option.callback,
			error:option.exceptionHandler
		});
    }
    //重置
    function resetData(){
    	//省初始化
    	$("#attrShengData").children().eq(0).attr("selected",true).siblings().attr("selected",false);
    	//市初始化
    	$("#attrShiData").children().eq(0).attr("selected",true).siblings().attr("selected",false);
    	//县初始化
    	$("#attrXianData").children().eq(0).attr("selected",true).siblings().attr("selected",false);
    	//乡初始化
    	$("#attrXiangData").children().eq(0).attr("selected",true).siblings().attr("selected",false);
    	//村初始化
    	$("#attrCunData").children().eq(0).attr("selected",true).siblings().attr("selected",false);
		$("#attrShiData").html("<option value=''>--请选择--</option>");
    	$("#attrXianData").html("<option value=''>--请选择--</option>");
    	$("#attrXiangData").html("<option value=''>--请选择--</option>");
		$("#attrCunData").html("<option value=''>--请选择--</option>");
    	$("#ysbhyy").children().eq(0).attr("selected",true).siblings().attr("selected",false);
    	$("#hsbhyy").children().eq(0).attr("selected",true).siblings().attr("selected",false);
    	$("#shzt").children().eq(0).attr("selected",true).siblings().attr("selected",false);
    	var form = $('#popIbox_sxcx')[0];
		var elements = form.getElementsByTagName('input');
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			$(elements[i]).val("");
		}
    }
    //查询
    function queryBywhere(){
    	var tableName="ZYJG_BHTB";
    	var zqCode = $("#attrXianData").siblings("input").val();
    	if(!zqCode){
    		return mini.alert("请选择县调查范围！","温馨提示");
    	}
    	var form = $('#popIbox_sxcx')[0];
		var elements = form.getElementsByTagName('input');
		var property = {};
		var where="";
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			property[element.name] = element.value;
			if(element.type!="hidden" && element.name!="D_AREA"&&element.value){
				where += element.name +" like '%"+element.value+"%' and ";
			}else if(element.type=="hidden" && element.name!="D_AREA"&&element.value&&element.name!="C_SHI"&&element.name!="C_SHENG"){
				where += element.name +" = '"+element.value+"' and ";
			}else if(element.name=="D_AREA"&&element.value){
				if(element.className =="left" && element.value){
					where += element.name +" >= "+element.value+" and ";
				}else if(element.className =="right" && element.value){
					where += element.name +" <= "+element.value+" and ";
				}
			}
		}
		where=where.substr(0,where.length-4)?where.substr(0,where.length-4):"1=1";
		//清除高亮
		map.getLayerByName("ATTRQUERY_LAYER").getSource().clear();
		$.ajax({
			url:"getSpaceQueryData.web",
			type:"POST",
			data:{data:JSON.stringify({tableName:tableName,whereStr:where,zqCode:zqCode})},
			success:function(res){
				if(typeof(res)=="string"){
					var resMessage = JSON.parse(res);
					return mini.alert("查询失败，错误信息："+resMessage.message,"失败提示");
				}
				if(res.length>0){
					$('.min-btn').click();
					$(".tool-py").click();
					highLayer(res);
				}else{
					mini.alert("该调查范围内没有变化图斑！","温馨提示")
				}
			},
			error:function(evt){
				
			}
		});
		
    }
    //高亮并定位图斑
    function highLayer(res){
    	//地图高亮样式
        var selectStyle = new ol.style.Style({
            fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
            stroke: new ol.style.Stroke({ color: 'rgb(255,0,0)', width: 3 })
        });
    	//高亮显示
    	var wktFormat = new ol.format.WKT();
        map.getLayerByName("ATTRQUERY_LAYER").getSource().clear();
        for(var i =0;i<res.length;i++){
			var wkt = res[i].originalObjects.C_OBJINFO;
			//判断wkt是否完整
			if (wkt.indexOf("(((") == 0) {
				wkt = "MULTIPOLYGON " + wkt;
            } else if (wkt.indexOf("((") == 0) {
            	wkt = "POLYGON  " + wkt;
            }
	        var feature = wktFormat.readFeatureFromText(wkt);
	        feature.setStyle(selectStyle);
	        map.getLayerByName("ATTRQUERY_LAYER").getSource().addFeature(feature);
		}
        var tbExtent = map.getLayerByName("ATTRQUERY_LAYER").getSource().getExtent();
        var mapView = map.getMap().getView();
        mapView.fit(tbExtent);
    }
    //省值改变，市也要改变
    function shengChange(e){
    	$(e).siblings("input").val(e.value);
    	if(!e.value){
    		$("#attrShiData").siblings("input").val("");
    		$("#attrShiData").html("");
    		$("#attrXianData").siblings("input").val("");
    		$("#attrXianData").html("");
    		$("#attrCunData").siblings("input").val("");
    		$("#attrCunData").html("");
    		$("#attrXiangData").siblings("input").val("");
    		$("#attrXiangData").html("");
    		$("#attrCunData").siblings("input").val("");
    		$("#attrCunData").html("");
    		return;
    	}
    	var tableName = "FS_BUSINESS_USERBUSLAYERS";
    	//TODO 现在是值根据用户ID和APPID来查找，appID是在config中赋值的，暂为'ZYJG'.
    	var userInfo = userObj;
    	var userId = userInfo.userId;
    	var appId = window.appid_;
    	var shengCode = $("#attrShengData").val();
    	var whereStr = "I_USERID = '"+userId+"' and C_APPID ='"+appId+"' and C_SHENG = '"+shengCode+"'";
    	var option ={
    			//生成li标签的HTML字符串
    			callback:function(res){
    				var contList = $("#attrShiData");
    				if(!res){
    					var zqHtml = "<option value =''>无市数据</option>";
    					contList.html(zqHtml);
    				}else if(res.length>0){
    					var zqHtml = "<option value=''>--请选择--</option>"+res[0];
	    				contList.html(zqHtml);
    				}else{
    					var zqHtml = "<option value =''>无市数据</option>";
    					contList.html(zqHtml);
    				}
    			},
    			exceptionHandler:function(evt){
    				console.log("错误信息："+evt);
    			}
    	};
    	var datas={tableName:tableName,whereStr:whereStr};
    	$.ajax({
			url:"getAttrShiZqList.web",
			type:"POST",
			data:{data:JSON.stringify(datas)},
			cache : false,
			dataType : 'json',
			success :option.callback,
			error:option.exceptionHandler
		});
    }
    //市值改变组装县数据，通过市code来过滤用户所拥有的县级图层
    function shiChange(e){
    	$(e).siblings("input").val(e.value);
    	if(!e.value){
    		$("#attrXianData").siblings("input").val("");
    		$("#attrXianData").html("");
    		$("#attrCunData").siblings("input").val("");
    		$("#attrCunData").html("");
    		$("#attrXiangData").siblings("input").val("");
    		$("#attrXiangData").html("");
    		$("#attrCunData").siblings("input").val("");
    		$("#attrCunData").html("");
    		return;
    	}
    	var tableName = "FS_BUSINESS_USERBUSLAYERS";
    	//TODO 现在是值根据用户ID和APPID来查找，appID是在config中赋值的，暂为'ZYJG'.
    	var userInfo = userObj;
    	var userId = userInfo.userId;
    	var appId = window.appid_;
    	var shiCode = $("#attrShiData").val();
    	var whereStr = "I_USERID = '"+userId+"' and C_APPID ='"+appId+"' and C_XIAN like '%"+shiCode+"__'";
    	var option ={
    			//生成li标签的HTML字符串
    			callback:function(res){
    				var contList = $("#attrXianData");
    				if(!res){
    					var zqHtml = "<option value =''>无县数据</option>";
    					contList.html(zqHtml);
    				}else if(res.length>0){
    					var zqHtml = "<option value=''>--请选择--</option>"+res[0];
	    				contList.html(zqHtml);
    				}else{
    					var zqHtml = "<option value =''>无县数据</option>";
    					contList.html(zqHtml);
    				}
    			},
    			exceptionHandler:function(evt){
    				console.log("错误信息："+evt);
    			}
    	};
    	var datas={tableName:tableName,whereStr:whereStr};
    	$.ajax({
			url:"getAttrXianZqList.web",
			type:"POST",
			data:{data:JSON.stringify(datas)},
			cache : false,
			dataType : 'json',
			success :option.callback,
			error:option.exceptionHandler
		});
    }

    //县值改变组装乡数据，通过查询服务来得到乡数据
    function xianChange(e){
    	$(e).siblings("input").val(e.value);
    	if(!e.value){
    		$("#attrXiangData").siblings("input").val("");
    		$("#attrXiangData").html("");
    		$("#attrCunData").siblings("input").val("");
    		$("#attrCunData").html("");
    		return;
    	}
    	$.ajax({  
	        type:"GET",  
	        url:config.publicService+"/ws/rest/LS/search/"+e.value, 
	        dataType:"JSON",  
	        success:function(data){	        	
	        	var zqChild = data.child;
	        	var zqChildHtml = "<option value=''>--请选择--</option>";
	        	for(var i =0;i<zqChild.length;i++){
	        		zqChildHtml+="<option value='"+zqChild[i].code+"'>"+zqChild[i].name+"</option>";
	        	}
	        	$("#attrXiangData").html(zqChildHtml);
	        }  
	    });
    }

    //乡值改变组装村数据，通过查询政区字典表来查询村数据
    function xiangChange(e){
    	var text =$(e).find("option:selected").text();
    	$(e).siblings("input").val(text);
    	if(!text){
    		$("#attrCunData").siblings("input").val("");
    		$("#attrCunData").html("");
    		return;
    	}
    	var param={};
    	param.whereString ="L_PARID = '"+e.value+"'";
    	var option ={
    			//生成li标签的HTML字符串
    		callback:function(res){
				var contList = $("#attrCunData");
				if(!res){
					var zqHtml = "<option value =''>无村数据</option>";
					contList.html(zqHtml);
				}else if(res.length>0){
		        	var zqChildHtml = "<option value=''>--请选择--</option>";
		        	for(var i =0;i<res.length;i++){
						var zqChild = res[i].originalObjects;
		        		zqChildHtml+="<option value='"+zqChild.C_ZQCODE+"'>"+zqChild.C_ZQNAME+"</option>";
		        	}
		        	contList.html(zqChildHtml);
		        	
				}else{
					var zqHtml = "";
					contList.html(zqHtml);
				}
			},
			exceptionHandler:function(evt){
				console.log("错误信息："+evt);
			}
    	}
    	FsService.getEntityList("FL_SYS_ZQSJZD",param,option);
    }
    //村改变更改其本身的文本值
    function cunChange(e){
    	var text =$(e).find("option:selected").text();
    	$(e).siblings("input").val(text);
    	
    }
    attrQuery_.shengChange = shengChange;
    attrQuery_.shiChange = shiChange;
    attrQuery_.xianChange = xianChange;
    attrQuery_.xiangChange = xiangChange;
    attrQuery_.cunChange = cunChange;
	return {
		init:init
	}
})