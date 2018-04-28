/**
 *空间位置组，功能js
 *作者：gp
 *功能：实现政区定位，高亮，模糊查询等
 */
define(['map','drawMap','config'], function (map, drawMap,config) {
    'use strict';
    //收藏位置
  //  var isOpen=true;
    //保存父级编码
    var thisCode;
    //地图高亮样式
    var selectStyle = new ol.style.Style({
        fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
        stroke: new ol.style.Stroke({ color: 'rgb(255,0,0)', width: 3 })
    });
    //初始化方法
    function initZq() {
    	//TODO 36是江西政区编码，集成后需使用实际登录用户的政区编码
    	//参数说明：1：政区编码；2：是否有元素移除，原因：初始化时不需要移除，在点击后需要将上一次将在数据移除

    	var zqCode=36;
    	if(userObj&&userObj.zqCode){
    		zqCode=userObj.zqCode;
    	}
    	queryZq(zqCode,false);
    	$("#dcfw_id").css("display","block");
    	$("#kjwz-area").css("display","block");
    	var userAgent = navigator.userAgent;
    	 if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !(userAgent.indexOf("Opera") > -1)) {
    		 $("#input_keypress").on("propertychange",function(){inputChange()});
    	 }else
		 {
    		 //模糊查询绑定回车事件
    		 $("#input_keypress").on("input",function(){inputChange()});
		 }
    	 
    	 $(".kjwz-search-btn").on("click",function(){inputChange()});
        //制图
        $("#zhitu").on("click",function(){button_click()});
        //初始化查询
        //初始化收藏位置
//        $("#collectBut").on("click",function(){querySc();})
       // $("document").ready(querySc());
        
        //初始化添加收藏位置按钮方法
        $("#addScButton").on("click",function(){scwzSave();})
    }
    //-----------------------------------------------------------------------------
    //收藏开始
    /**初始化收藏的位置*/
    querySc()
    function querySc()
    {
    	//userid
    	var userId = userObj.userId;
    	//表名
    	var tableName = "FAVOURITE_T";
    	//查询条件
    	var queryFilter = {
				whereString:"C_USERID = '"+userId+"'"
			}
		var callBack = {
				callback:function(data){
					//加入收藏位置到页面前清空初始化元素
					document.getElementById("scwz_ul").innerHTML = "";
					//将收藏位置初始化
					for(var a=0;a<data.length;a++)
					{
						var obj = data[a];
						var scwz_li = $('<li><a href="javascript:;" class="btns third" id="'+obj.originalObjects.C_NAME+'_'+obj.originalObjects.ID+'"><input class="ck-inp" type="checkbox" name="" id="" value="" /></a></li>');
			    		$("#scwz_ul").append(scwz_li);
			    		var scwzSpan = $('<span class="txt">'+obj.originalObjects.C_NAME+'</span>');
			    		(function(ext){
			    			scwzSpan.on('click',function(){
								dwSc(ext);
							});
						})(obj.originalObjects.C_EXTENT)
						$("#"+obj.originalObjects.C_NAME+'_'+obj.originalObjects.ID).append(scwzSpan);
			    		var scwzDiv = $('<div class="opa-box" id="'+obj.originalObjects.ID+'"></div>');
			    		$("#"+obj.originalObjects.C_NAME+'_'+obj.originalObjects.ID).append(scwzDiv);
			    		//删除位置绑定
			    		var scSpan = $('<span class="del btn"></span>');
			    		(function(id){
			    			scSpan.on('click',function(){
								delSc(id);
							});
						})(obj.originalObjects.ID)
						$("#"+obj.originalObjects.ID).append(scSpan);
			    		//定位位置绑定
			    		var dwSpan = $('<span class="location btn"></span>');
			    		(function(extent){
			    			dwSpan.on('click',function(){
								dwSc(extent);
							});
						})(obj.originalObjects.C_EXTENT)
						$("#"+obj.originalObjects.ID).append(dwSpan);
					}
					if(data.length > 0)
					{
						var display = $("#scwz_ul").css("display");
						if(display == "none");
						var lengthi=$("#scwz_ul li").length;
						//如果大于五条显示滚动条
						 if(lengthi>5){
							 $("#scwz_ul").addClass("myHeight");
							 $("#scwz_ul").niceScroll({
								    cursorcolor: "#777",
								    cursorborder: "0", 
								});
						 }
						//如果等于5不显示滚动条
							 if(lengthi==5){
								 $("#scwz_ul").addClass("myHeight");
							 }
						//如果小于5
							 if(lengthi<5){
								 $("#scwz_ul").removeClass("myHeight");
							 }
						{
							$("#scwz_ul").css("display","block");
						}
					}
				}
		};
		FsService.getEntityList(tableName,queryFilter,callBack);
    }
    
    function scwzSave()
    {
    	//TODO 获取中心点，地图缩放级别，设置当前日期，保存当前收藏名称
    	//地图缩放级别
    	var leave = map.getMap().getView().getZoom();
    	//中心点
    	var center = map.getMap().getView().getCenter();
    	var extent ={
    			"leave":leave,
    			"center":center}; 
    	//表名
    	var tableName = "FAVOURITE_T";
    	//收藏名称
    	var scName = $("#addScInput").val();
    	if(scName == "" || scName == null || typeof(scName) == undefined || typeof(scName) == "undefined")
    		{
    		mini.alert("收藏点名称不能为空！","温馨提示");
    		return false;
    		}
    	$(".inpuDiv").css("display","none");
    	//userid
    	var userId = userObj.userId;
    	//日期
    	var date = new Date();
    	var year = date.getFullYear();
    	var month = date.getMonth()+1;
    	var day = date.getDate();
    	var thisDate = year+"-"+month+"-"+day;
    	var oldData = {};
    	var dataJson = {
			"C_NAME":scName,
			"C_USERID":userId,
			"D_CREATEDATE":thisDate,
			"C_EXTENT":extent
		};
    	//保存收藏位置
    	var ajaxData = [oldData,dataJson,null,null];
    	var json = JSON.stringify(ajaxData);
    	FsService.save(tableName,json,{
			callback:function(e){
				
	    		$("#addScInput").val("");
	    		$(".tjscd ").removeClass("open");
	    		$(".add-collect").css("display","none");
	    		var scwz_li = $('<li><a href="javascript:;" class="btns third" id="'+e.currentObjects.C_NAME+'_'+e.currentObjects.ID+'"><input class="ck-inp" type="checkbox" name="" id="" value="" /></a></li>');
	    		$("#scwz_ul").append(scwz_li);
	    		var scwzSpan = $('<span class="txt">'+e.currentObjects.C_NAME+'</span>');
	    		(function(ext){
	    			scwzSpan.on('click',function(){
						dwSc(ext);
					});
				})(e.currentObjects.C_EXTENT)
				$("#"+e.currentObjects.C_NAME+'_'+e.currentObjects.ID).append(scwzSpan);
	    		var scwzDiv = $('<div class="opa-box" id="'+e.currentObjects.ID+'"></div>');
	    		$("#"+e.currentObjects.C_NAME+'_'+e.currentObjects.ID).append(scwzDiv);
	    		
	    		
	    		var scSpan = $('<span class="del btn" title="删除"></span>');
	    		(function(id){
	    			scSpan.on('click',function(){
						delSc(id);
					});
				})(e.currentObjects.ID)
				$("#"+e.currentObjects.ID).append(scSpan);
	    		var dwSpan = $('<span class="location btn" title="定位"></span>');
	    		(function(extent){
	    			dwSpan.on('click',function(){
						dwSc(extent);
					});
				})(e.currentObjects.C_EXTENT)
				$("#"+e.currentObjects.ID).append(dwSpan);
	    		querySc();
			}}
    		);
    }
    
    //删除收藏位置
    function delSc(id)
    {
    	mini.confirm("确定删除收藏的位置?", "温馨提示",  
    		    function (action) {  
    		        if (action == "ok") {  
    		        	var queryFilter = {
    		        			whereString:"ID = "+id	
    		        		};
    		        	//表名
    		        	var tableName = "FAVOURITE_T";
    		        		FsService.del(tableName,queryFilter,{
    		        			callback:function(res){
    		        				if(res){
    		        					querySc();
    		        				}
    		        			},
    		        			exceptionHandler:function(e){
    		        				mini.alert("删除失败！","失败提示");
    		        			}
    		        		});  
    		        } else {
    		        	return;
    		        } 
    		    }  
    	);
    }
    //收藏位置定位
    function dwSc(extent)
    {
    	var json = JSON.parse(extent)
    	glSc(json.center,json.leave);
    }
    
    //地图定位
    function glSc(center,level)
    {
    	map.getMap().getView().setCenter(center);
        map.getMap().getView().setZoom(level); 
    }
    //收藏结束
    //--------------------------------------------------------------------------------------
    
    
//============================监测区开始=====================================================================

    
    //政区定位开始
   /**初始化政区树方法，参数1：政区编码；参数2：是否需要清除之前数据
    * 点击A标签时调用
    * */
    function queryZq(code,bool)
    {
    	//code为查询参数，不可以为空，否则后台会报错没有做异常处理
    	if(code == null || code == "" || typeof(code) == "undefined" || typeof(code) == undefined)
    		{
    		return;
    		}
    	//将code保存，在回调中使用
    	thisCode = code;
    	$.ajax({  
	        type:"GET",  
	        url:config.publicService+"/ws/rest/LS/search/"+code, 
	        dataType:"JSON",  
	        success:function(data){
	        	if(bool)
	        		{
	        		//点击a标签时需要将父级记录，以便返回
	        		addOrRemove(thisCode);
	        		//移除p，a标签
	        		$("#kjwz_area_zq").remove();
	        		$("#zq_context").remove();
	        		}
	        	if(data !=null)
        		{
	        		//初始化p标签
	        		var itemCode = data.item.code;
	        		var itemcenter = data.item.center;
	        		if(itemcenter == "" )
        			{
	        			itemcenter = "99.47809569035006,33.79135697109885";
        			}
	        		var itemlevel = data.item.level;
	        		var itemshape = data.item.shape;
	        		if(itemshape == "" )
        			{
	        			itemshape = "null";
        			}
	        		
	        		gl(itemcenter,itemlevel,itemshape)
//	        		highLayer(itemshape);
	        		var p_item = $('<p  style="cursor:pointer;font-size:12px;"  class="title" zqcode="'+itemCode+'" zqcenter="'+itemcenter+'" zqlevel="'+itemlevel+'" zqshape='+itemshape+' id="kjwz_area_zq">'+data.item.name+':</p>');
	        		p_item.on('click',function(){
        	        	zqDw_p(itemCode,itemcenter,itemlevel,itemshape);
        	        });
	        		$("#kjwz-area").append(p_item);
	        		var p_a = $('<p class="context" id="zq_context"></p>');
	        		$("#kjwz-area").append(p_a);
	        		var zqString = "";
	        		zqString = '';
	        		//初始化a标签
	        		if(data.child)
        			{
	        			var arr = data.child;
	        			for(var i=0;i<arr.length;i++)
	        			{
	        				var code = arr[i].code;
	        				var center =arr[i].center;
	        				var level =arr[i].level;
	        				var shape =arr[i].shape;
	        				var a_name = $("<a  style='cursor:pointer;font-size:12px;' >"+arr[i].name+"</a>");
	        				(function(c,cen,l,s){
	        					a_name.on('click',function(){
	        						queryZq(c,true);
//	        						zqDw(c,cen,l,s);
	        					});
	        				})(code,center,level,shape)
	        				$("#zq_context").append(a_name);
	        			}
        			}
        		
        		}
	        }, 
    	error:function(msg){
			console.log(msg);
		}
	    });
    }
    
    /**
     * 点击P标签时调用
     * 参数说明：
     * 依次政区编码，中心点，政区级别，政区范围
     * */
    function zqDw_p(code,center,level,shape)
    {
    	//调用政区定位，高亮方法
    	gl(center,level,shape);
    	
    }
    /**
     * 添加移除元素
     * */
    function addOrRemove(code)
    {
    	//如果br_length=0说明没有有br元素
    	var br_length = $('#clickHistory w').length;
    	if(br_length==0)
		{
    		//将父级保存为第一个父级元素
	    	var ys = $("#kjwz_area_zq");
	    	var itemCode = ys.attr("zqcode");
	    	var itemcenter = ys.attr("zqcenter");
	    	var itemlevel = ys.attr("zqlevel");
	    	var itemshape = ys.attr("zqshape");
	    	var value = $("#kjwz_area_zq")[0].innerText;
	    	var arr = value.split(":");
	    	var valueStr = arr[0];
    		var p_item = $('<w  style="cursor:pointer;font-size:12px;color:#3d9b00"  class="title position" level="1" zqcode="'+itemCode+'" zqcenter="'+itemcenter+'" zqlevel="'+itemlevel+'" zqshape='+itemshape+' id="'+itemCode+'_zqcode">'+valueStr+'&nbsp;&nbsp;</w>');
    		p_item.on('click',function(){
    			zqDw(itemCode,itemcenter,itemlevel,itemshape);
    		});
    		$("#clickHistory").append(p_item);
		}else
		{
			//否则有br元素
			isNotBr(br_length,code);
		}
    }
    /**
     * 已经有br元素，说明已经有历史记录，在添加历史记录时需要注意移除之前的br
     * */
    function isNotBr(br_length,code)
    {
    	var thisP = $("#"+code+"_zqcode");
    	if(thisP.length>0)
		{
    		thisP.nextAll().remove();
    		$("#"+code+"_zqcode").remove();
    		var length = $('#clickHistory w').length;
    		/*if(length > 0)
			{
    			$('#kjwz-area').append($('<br>'));
			}*/
		}
    	else
		{
    		//重新添加历史记录
    		var ys = $("#kjwz_area_zq");
        	var itemCode = ys.attr("zqcode");
        	var itemcenter = ys.attr("zqcenter");
        	var itemlevel = ys.attr("zqlevel");
        	var itemshape = ys.attr("zqshape");
        	//$("#kjwz-area").find('br').remove();
        	if(document.getElementById(itemCode+"_zqcode"))
    		{
        		$("#"+itemCode+"_zqcode").remove();
    		}
        	var value = $("#kjwz_area_zq")[0].innerText;
        	var arr = value.split(":");
        	var valueStr = arr[0];
    		var p_item = $('<w  style="cursor:pointer;font-size:12px;color: #3d9b00;"  class="title" level="'+(br_length+1)+'" zqcode="'+itemCode+'" zqcenter="'+itemcenter+'" zqlevel="'+itemlevel+'" zqshape='+itemshape+' id="'+itemCode+'_zqcode">'+'<span class="arr" style="display: inline-block;margin: 0px 5px 5px 0;font-size: 12px;color: #3d9b00;">&gt;</span>'+valueStr+'&nbsp;&nbsp;</w>');
    		p_item.on('click',function(){
    			zqDw(itemCode,itemcenter,itemlevel,itemshape);
    		});
    		$("#clickHistory").append(p_item);
		}
    	
    }
    //政区定位，点击a标签调用，参数依次：政区编码，中心点，级别，政区范围
    function zqDw(code,center,level,shape)
    {
    	queryZq(code,true);
    	gl(center,level,shape);
    }
    //地图定位，高亮方法
    function gl(center,level,shape)
    {
    	var l = level;
    	var jb = 1;
    	if(l==1)
		{
    		jb = 4;
		}else if(l==2)
		{
			jb = 5;
		}else if(l==3)
		{
			jb = 7;
		}else if(l==4)
		{
			jb = 9;
		}else if(l==5)
		{
			jb = 11;
		}else
		{
			jb=12;
		}
    	 //地图缩放
        var arr = center.split(",");
        arr[0] = parseFloat(arr[0]);
        arr[1] = parseFloat(arr[1]);
        map.getMap().getView().setCenter(arr);
        map.getMap().getView().setZoom(jb); 
        //高亮显示
    	if(shape && shape !="null"){
    		var geojsonFormat = new ol.format.GeoJSON();
            var feature = geojsonFormat.readFeature(shape);
            feature.setStyle(selectStyle);
            map.getLayerByName("ZQDW_LAYER").getSource().clear();
            (function(f){
            	setTimeout(function(){
            	map.getLayerByName("ZQDW_LAYER").getSource().addFeature(f);
            	},500);
	        setTimeout(function(){
	        	f.setStyle();
				},800);
	        setTimeout(function(){
	        	f.setStyle(selectStyle);
				},1500);
	        setTimeout(function(){
	        	f.setStyle();
	        	//map.getLayerByName("ZQDW_LAYER").getSource().removeFeature(f);
				},2200);})(feature)
    	}
       
    }
    //先将 高亮提出来  by zzq
    function highLayer(shape){
    	//高亮显示
    	var geojsonFormat = new ol.format.GeoJSON();
        var feature = geojsonFormat.readFeature(shape);
        feature.setStyle(selectStyle);
        map.getLayerByName("ZQDW_LAYER").getSource().clear();
        map.getLayerByName("ZQDW_LAYER").getSource().addFeature(feature);
    }
    //政区定位结束
    //---------------------------------------------------------------------------------------
    //政区模糊匹配开始
    //模糊查询方法，绑定回车事件
    function inputChange()
    {
    	
    	var value = $("#input_keypress").val();
    	if(value == null || value == "" || typeof(value) == "undefined" || typeof(value) == undefined)
		{
    		$("#openScwz").css("display","none");
    		$(".kjwz-normal-content").css("display","block");
    		$(".kjwz-search-btn").removeClass("btn_x");
    		return;
		}else{
			if($(".kjwz-search-btn").hasClass("btn_x")){
				$(".kjwz-search-btn").removeClass("btn_x");
				document.getElementById("zqdw_query").innerHTML = "";
				$("#openScwz").css("display","none");
	    		$(".kjwz-normal-content").css("display","block");
	    		$("#input_keypress").val("");
	    		return;
	        }
		}
    	$.ajax({  
	        type:"GET",  
	        url:config.publicService+"/ws/rest/LS/analyze/"+value, 
	        dataType:"JSON",  
	        success:function(data){
	        	document.getElementById("zqdw_query").innerHTML = "";
	        	if(data)
	    		{
	        		if(data.length > 0){
        				$(".kjwz-search-btn").addClass("btn_x")
        			}
	        		for(var i=0;i<data.length;i++)
        			{
	        			$("#openScwz").css("display","block");
	        			$(".kjwz-normal-content").css("display","none");
	        			var center =data[i].location.center;
	        			var level =data[i].location.level;
	        			var shape =data[i].location.shape;
	        			//加载a标签
	        			var a_name = $("<li  style='cursor:pointer;font-size:14px;' >"+data[i].fullName+"</li>");
	        			(function(cen,l,s){
	        				a_name.on('click',function(){
	        					gl(cen,l,s);
		        	        });
	        			})(center,level,shape)
	        			$("#zqdw_query").append(a_name);
	        			//判断只加载前三个数据
	        			if(i==2)
	        			{
	        				return;
	        			}
        			}
	        		if(data.length < 1)
        			{
	        			$(".kjwz-search-btn").removeClass("btn_x");
	        			$("#openScwz").css("display","none");
	        			$(".kjwz-normal-content").css("display","block");
        			}
	    		}
	        }  
	    });
    }
    //模糊匹配结束
    //----------------------------------------------------------------------------------
    //制图使用事件
    
    function button_click()
    {
    	var url="zyjgMap.do";
		var form=$("<form>");//定义一个form表单
	  	form.attr("style","display:none");
	  	form.attr("target","_blank");
	  	form.attr("method","post");
	  	form.attr("action",url);
	    var input=$("<input>");
	    input.attr("name","base64url");
	  //  input.attr("value",dataUrl);
		form.append(input);
	  	$("body").append(form);//将表单放置在web中
	  	form.submit();//表单提交
    }
          
    return {
    	init:initZq,
    	inputChange:inputChange
    } 
    
    
    
    
  
});