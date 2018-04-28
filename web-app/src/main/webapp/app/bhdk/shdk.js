/**
 * 审核功能
 * */
define(["publicObj","queryLayer","util","treeHelper","config"], function (publicObj,queryLayer,util,treeHelper,config) {
	'use strict';
	var total=0;
	var Current=0;
	var ids=[];
	var xys={};
	// 当前图斑数据，用于审核前对比图斑属性与图形是否存在改变
	var newData={};
	// 网格大小
	var xDvalue=0;
	var yDvalue=0;
	var xDvalue_km=0;
	var yDvalue_km=0;
	var cc=0.0001;
	// 网格整体偏移量
	var offsetX=0;
	var offsetY=0;
	// 当前县范围
	var xian_Extent=[];
	//当前县feature
	var xian_Feature={};
	// 网格数据集合
	var gridxy=[];
	// 网格行列好集合
	var gridtitl=[];
	// 网格图形集合
	var idIndex={};
	// 当前选中网格下标
	var gridIndex=0;
	// 审核地块图层
	var shdk_ywc_layer=null;//已完成
	var shdk_p_ywc_layer=null;//已完成标记
	var shdk_p_wwc_layer=null;//未完成标记
	var shdk_wwc_layer=null;//未完成
	var shdk_high_layer=null;//网格高亮
	var high_layer=null;//小班高亮
	// 审核状态翻译
	var shzt_status={
			"0":"未审核",
			"1":"通过",
			"2":"通过（已修改）",
			"3":"重做",
			"-1":"没变化"
	}
	// 转换工具
	var geojsonFormat = new ol.format.GeoJSON();
	// 高亮颜色
	var selectStyle = new ol.style.Style({
        fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
        stroke: new ol.style.Stroke({ color: '#FF0000', width: 2 }),// 红
    });
	var unselectStyle = new ol.style.Style({
        fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
        stroke: new ol.style.Stroke({ color: '#FFFF00', width: 2 }),// 黄
    });
	var ywcStyle = new ol.style.Style({
        fill: new ol.style.Fill({ color: "rgba(255,255,255,0.5)" }),
        stroke: new ol.style.Stroke({ color: '#00FF00', width: 2 }),// 绿
    });
	var ywc_src="images/gezi-bg.png";
	var wwc_src="images/gezi-wbg.png";
	/**
	 * 初始化
	 */
	function init() {
		shdk_ywc_layer=map.getLayerByName("SHDK_YWC_LAYER").getSource();
		shdk_wwc_layer=map.getLayerByName("SHDK_WWC_LAYER").getSource();
		shdk_high_layer = map.getLayerByName("SHDK_HIGH_LAYER").getSource();
		high_layer = map.getLayerByName("HIGH_LAYER").getSource();
		shdk_p_ywc_layer=map.getLayerByName("SHDK_P_YWC_LAYER").getSource();
		shdk_p_wwc_layer=map.getLayerByName("SHDK_P_WWC_LAYER").getSource();
		map.getLayerByName("SHDK_P_YWC_LAYER").setVisible(false);
		map.getLayerByName("SHDK_P_WWC_LAYER").setVisible(false);
		
		$(".zs-toolbar .btns a.tool-sh").click(function(e){
			if($(this).hasClass("selected")){
				$("#shdk_pop .close-btn").click();
				$(this).removeClass("selected");
			}else{
				start();
				$(this).addClass("selected");
			}
		});
		$(".tool-wg").click(function(e){
			if($(".zs-grid-tool").is(":visible")){
				//关闭审核工具栏
				$(".zs-grid-tool").hide();
				$(this).removeClass("selected");
				//清除网格相关图层
				clearLayer();
				if($("#public_shdk_pop.plugin-with-box").length==1){
					
				}
			}else{
				//打开审核工具栏
				$(".zs-grid-tool").show();
				$(this).addClass("selected");
				// 获取政区下拉数据
				getZqList();
			}
		});
		//生成网格
		$("#createGrid").click(function(e){
			if(!$("#shdkSelect").val()){
				mini.alert("请选择县！");
				return;
			}
			mini.confirm("是否创建判图格网？","提示",function(e){
				if(e=="ok"){
					$(".close.iconfont.icon-zsicon-close").trigger("click");
					zqOptionClick();
				}
			})
		});
		//预览
		$("#viewGrid").click(function(e){
			zqOptionClick(true);
		})
		//关闭预览
		$("#closeviewGrid").click(function(e){
			getZqGridData();
		})
		//自适应网格
		$("#autoGrid").click(function(e){
			var gridwh=getAuto();
			$("#grid_width").val(gridwh[0]);
			$("#grid_height").val(gridwh[1]);
		})
		$(".zs-grid-tool .line.wcqk input").click(function(e){
			setGridVisible();
			sortLayer();
		});
		$(".zs-grid-tool .line.dhfw input").click(function(e){
			reload();
		});
		$("#shtbSelect").change(function(e){
			TboptionClick(e);
		});
		$("#shdkSelect").change(function(e){
			getZqGridData();
		});
		$(".zs-btn.syg-button").click(function(e){
			newData={};
			NextData(true);
		});
		$(".zs-btn.xyg-button").click(function(e){
			newData={};
			NextData(false);
		});
		$(".zs-btn.syg-grid-button").click(function(e){
			NextGrid(true);
		});
		$(".zs-btn.shwg-grid-button").click(function(e){
			var idx=shdk_high_layer.idIndex_;
			for(var key in idx){
			    if(typeof key == "string"){
                    check_ywc_layer(key);
                    break;
			    } 
			}
		});
		$(".zs-btn.xyg-grid-button").click(function(e){
			NextGrid(false);
		});
		$(".zs-btn.qt-grid-button").click(function(e){
			ExtentGrid(true);
		});
		$(".zs-btn.fd-grid-button").click(function(e){
			ExtentGrid(false);
		});
		$(".zs-grid-tool #reload").click(function(e){
			reload();
		});
		$("#shdk_grid_current").keydown(function(event){
			if(event.keyCode == 13){
				inputGridIndex();
			}
		});
		$("#shdk_current").keydown(function(event){
			if(event.keyCode == 13){
				inputIndex();
			}
		});
    	map.getMap().on('moveend',function(event){
    		setGridVisible();
    		var zoom=map.getMap().getView().getZoom();
    		if(zoom>15){
    			setLayerStyle(true);
    		}else{
    			setLayerStyle(false);
    		}
        });
	}
	/**
	 * 审核入口
	 */
	function start(){
		var template = {
		        "ID":1,
		        "C_TYPE":"default",
		        "C_ZQCODE":"200000",
		        "I_USERID":1,
		        "C_NR":[
		            {"FIELDNAME":"C_XIAN","DICTNAME":"县(林业局)","FIELDTYPE":"STRING","ZINDEX":1,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"C_XIANG","DICTNAME":"乡(林场)","FIELDTYPE":"STRING","ZINDEX":2,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"C_CUN","DICTNAME":"村(林班)","FIELDTYPE":"STRING","ZINDEX":3,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"C_XIAOBAN","DICTNAME":"小班","FIELDTYPE":"STRING","ZINDEX":5,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"C_WORKYEAR","DICTNAME":"工作年度","FIELDTYPE":"STRING","ZINDEX":6,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"I_LON_DEG","DICTNAME":"经度","FIELDTYPE":"DOUBLE","ZINDEX":7,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"I_LAT_DEG","DICTNAME":"纬度","FIELDTYPE":"DOUBLE","ZINDEX":8,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"D_AREA","DICTNAME":"面积","FIELDTYPE":"STRING","ZINDEX":9,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"C_YSBHYY","DICTNAME":"疑似变化原因","FIELDTYPE":"STRING","ZINDEX":10,"CANSHOW":"是","DICTITEM":[
		                {"CODE":1,"NAME":"采伐"},{"CODE":2,"NAME":"占地"},{"CODE":3,"NAME":"毁林开垦"},{"CODE":4,"NAME":"灾害"},
		                {"CODE":5,"NAME":"造林"},{"CODE":6,"NAME":"其他减少"},{"CODE":7,"NAME":"其他增加"}
		            ]},
		            {"FIELDNAME":"C_HSBHYY","DICTNAME":"核实变化原因","FIELDTYPE":"STRING","ZINDEX":11,"CANSHOW":"是","DICTITEM":[
		                {"CODE":10,"NAME":"造林更新"},{"CODE":20,"NAME":"森林采伐"},{"CODE":30,"NAME":"规划调整"},{"CODE":41,"NAME":"经审批使用林地"},
		                {"CODE":42,"NAME":"未审批使用林地"},{"CODE":50,"NAME":"毁林开垦"},{"CODE":71,"NAME":"火灾"},
		                {"CODE":72,"NAME":"地质灾害"},{"CODE":73,"NAME":"其它灾害因素"},{"CODE":81,"NAME":"封山育林"},
		                {"CODE":82,"NAME":"其他自然更新"},{"CODE":91,"NAME":"漏划"},{"CODE":92,"NAME":"错划"},
		                {"CODE":93,"NAME":"其它调查因素"}, {"CODE":96,"NAME":"行政界线调整"}, {"CODE":99,"NAME":"管理因子变化"},
		                {"CODE":11,"NAME":"人工造林或飞播造林"},
		                {"CODE":12,"NAME":"人工更新"}, {"CODE":98,"NAME":"新增管理界线"}, {"CODE":97,"NAME":"边界引起的细碎合并"},
		            ]},
		            {"FIELDNAME":"C_YIJU","DICTNAME":"依据","FIELDTYPE":"STRING","ZINDEX":12,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"C_USERNAME","DICTNAME":"判读人","FIELDTYPE":"STRING","ZINDEX":13,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"DT_CREATETIME","DICTNAME":"判读时间","FIELDTYPE":"DATA","ZINDEX":14,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"C_CHECKUSERNAME","DICTNAME":"审核人","FIELDTYPE":"STRING","ZINDEX":15,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"DT_CHECKTIME","DICTNAME":"审核时间","FIELDTYPE":"DATA","ZINDEX":16,"CANSHOW":"是","DICTITEM":""},
		            {"FIELDNAME":"C_STATUS_DESC","DICTNAME":"审核状态","FIELDTYPE":"DATA","ZINDEX":17,"CANSHOW":"是","DICTITEM":""},
		        ]
		    };
		// 弹出属性框
		popFun(null,publicObj.features[0],template);
	}
    /**
	 * 弹窗方法
	 * @param type：类型(add)目前只有这一个标识，不是新增情况null
	 * @param feature：图形元素ol.feature
	 * @param template：模板
	 */
	function popFun(type, feature, template) {
		var html = getPopHtml(template);
		var ibox = $("#public_shdk_pop").modal({
			title: "审核",
			id:"shdk_pop",
			ibox_top:$(".zs-zyjg-header").height()+22,
			ibox_left:0.1,
			overlay: false,
			showMin: false,
			showMax: false,
			showTop: false,
			fullScreenId:"map_continer",
			isDrag: true,
			contentWidth: 260,
			type: "clone",
			target: html || "",
			removeCallBack:function(){
				// 显示更多功能按钮
				$(".zs-toolbar .tool-cx,.zs-toolbar .tabs").show();
				// 显示政区树
				$(".zs-tree-box.zyjg.mapToolJl").show();
				// 选择功能置灰还原
//				$(".tool-xz").removeClass("disable");
				$(".tool-sh").removeClass("selected");
				//还原“规划”工具栏
				setButtonStatus("98");
				$(".tool-qc").click();
			},
			addCallBack: function () {
				var iBox = this;
				$("#shdk_pop").height($(".zs-zyjg-body.isyyzx").height()-22);
				// 隐藏更多功能按钮
				$(".zs-toolbar .tool-cx,.zs-toolbar .tabs").hide();
				// 隐藏政区树
				$(".zs-tree-box.zyjg.mapToolJl").hide();
				// 清除选中图斑
				util.dispatchEvent("CLEAR");
				// 选择功能置灰不可用
//				$(".tool-xz").addClass("disable");
				//初始化工具栏
				setButtonStatus("1");
				$(".zs-nicescroll").niceScroll({
					cursorcolor: "#777",
					cursorborder: "none",
				});
				$(".zs-btn.tg-button").click(function(e){
					shdk(1);
				});
				$(".zs-btn.cz-button").click(function(e){
					shdk(3);
				});
				$(".zs-btn.bsbh-button").click(function(e){
					shdk(-1);
				});
			}
		});
		ibox.click();
	}
    /**
	 * 图斑审核
	 * @param status：审核状态
	 */
	function shdk(status){
		window.openAlert();
		var form = $('#popIbox_shdk')[0];
		var elements = form.getElementsByTagName('input');
		var property = {};
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element.name && element.name != 'lon' && element.name != 'lat') {
				property[element.name] = element.value;
			}
		}
		if(status==0){
			for(var k in property){
				if(typeof k !="string"){
					continue;
				}
				if(property[k]!=newData[k]){
					status=1; 
					break;
				}
			}
		}
		var feature=publicObj.features[0];
		feature.setProperties(property);
		// 新增 wkt 字段 by zzq 20171205
		var z_wkt = new ol.format.WKT();
		var C_WKT = z_wkt.writeFeature(feature);
		// property.wkt=C_WKT;
		property.C_OBJINFO = C_WKT; 
		// 属性编辑的保存
		property.ID = feature.getProperties().ID;
		property.C_STATUS = status+"";
		property.D_EDITTIME = util.getLocalDate();
		property.C_CHECKUSERID = userObj.userId;
		property.DT_CHECKTIME = util.getLocalDate();
		delete property.C_OBJINFO;
		var data = {
			addRows: null,
			updateRows: [property],
			delRows: null,
			type: "updateParam",
			tableName: 'ZYJG_BHTB',
			xianCode: property.C_XIAN,
			y: property.I_LAT_DEG,
			x: property.I_LON_DEG
		}
		var shdkdata={xian:property.C_XIAN,id:property.ID}
		// 查询当前地块是否已经审核
		$.ajax({
			url: "shdk/shdkData.do",
			type: "POST",
			data: { data: JSON.stringify(shdkdata) },
			success: function (res) {
				if ("1"==res) {
					$.ajax({
						url: "dataService.do",
						type: "POST",
						data: { jsonStr: JSON.stringify(data) },
						success: function (res) {
							if (res.success) {
								//如果当前图形的审核状态在设置中未不可见，则移除当前图形
								if(publicObj.queryWhereArr.indexOf(status)==-1){
									var layerName = publicObj.features[0].get("C_XIAN") + "_" + publicObj.features[0].get("C_WORKYEAR");
									var layer = publicObj.getLayerByName(layerName).getSource();
									layer.removeFeature(publicObj.features[0]);
									layer.refresh();
								}else{
									publicObj.features[0].set("C_STATUS",status);
								}
								/*清除原有元素*/
								for(var i=0;i< publicObj.features.length;i++){
	            					var key = publicObj.features[i].getProperties().C_STATUS+"";
	            		 		  publicObj.features[i].setStyle(publicObj.shStyleObj[key]);
	            		 	    }
								var layer = map.getLayerByName("HIGH_LAYER");
	            		 	    if(layer&&publicObj.features&&layer.getSource().getFeatures().length>0){
	            		 		   for(var i=0;i< publicObj.features.length;i++){
	            		 			   layer.getSource().clear();
	            		 			   layer.getSource().refresh();
	            		 		   }
	            		 	    }
	            		 	    publicObj.features= [];
	            		 	    
								mini.alert("审核成功！");
							}
							//清空表单
							//禁用审核按钮
							clearForm();
//							if($("#shdk_current").val()!=$("#shdk_total").val()){
//								$(".zs-btn.xyg-button").click();
//							}
							window.closeAlert();
						},
						error: function (err) {
							util.validateSession(err);
							window.closeAlert();
							console.log(err);
							mini.alert("审核失败！");
						}
					});
				}else{
					window.closeAlert();
					mini.alert("当前小班已审核！");
				}
			},
			error: function (err) {
				util.validateSession(err);
				window.closeAlert();
				console.log(err);
				mini.alert("审核失败！");
			}
		});
	}
    /**
	 * 获取政区下拉数据
	 */
	function getZqList(){
		window.openAlert();
		//清除关于审核的所有元素
		clearForm();
		clearLayer();
		hideGridBtn();
		hideTbBtn();
		// 获取政区
		var tableName = "FS_BUSINESS_USERBUSLAYERS";
		var userInfo = userObj;
		var userId = userInfo.userId;
		var appId = window.appid_;
		var whereStr = "I_USERID = '"+userId+"' and C_APPID ='"+appId+"'";
		//清空政区
		var zqHtml = "<option value =''>无政区数据</option>";
        var contList = $("#shdkSelect");
        contList.html(zqHtml);
		var option ={
		        // 生成li标签的HTML字符串
		        callback:function(res){
		            if(!res){
		                var zqHtml = "<option value =''>无政区数据</option>";
		                contList.html(zqHtml);
		            }else if(res.length>0){
		                contList.html("<option value =''>--请选择--</option>"+res[0]);
		            }else{
		                var zqHtml = "<option value =''>无政区数据</option>";
		                contList.html(zqHtml);
		            }
		            window.closeAlert();
		        },
		        exceptionHandler:function(evt){
		        	window.closeAlert();
		            console.log("错误信息："+evt);
		        }
		};
		var datas={tableName:tableName,whereStr:whereStr,selectVal:''};
		$.ajax({
		    url:"getReportZqList.web",
		    type:"POST",
		    data:{data:JSON.stringify(datas)},
		    cache : false,
		    dataType : 'json',
		    success :option.callback,
		    error:option.exceptionHandler
		});
	}
    /**
	 * 政区下拉框值改变事件
	 */
	function zqOptionClick(flag){
		//清除关于审核的所有元素
		clearForm();
		clearLayer();
		hideGridBtn();
		hideTbBtn();
		
		var xian=$("#shdkSelect").val();
		var width=Number($("#grid_width").val());
		var height=Number($("#grid_height").val());
		if(!xian){
			mini.alert("请先选择需要审核的县！");
			return;
		}
		if(!width||!height||height<=0||width<=0){
			mini.alert("请先输入网格长宽！");
			return;
		}
		cc=0.0001;
		//计算网格长宽
		degTometer(width,height,cc);
		//获取县四至
		getZqExtent(xian,flag);
	}
	function getZqGridData(){
		window.openAlert();
		var xian=$("#shdkSelect").val();
		var datas={xian:xian,userid:userObj.userId,datakey:"SHDKGDATA",appid:window.appid_};
    	setTimeout(function(e){
    		$.ajax({
    	        type:"post",  
    	        url:"shdk/getZqGridData.do", 
    	        dataType:"JSON",
    	        data:{data:JSON.stringify(datas)},
    	        success:function(data){
    	        	if(!data){
    	        		zqOptionClick();
    	        	}else{
    	            	window.openAlert();
    	        		//清除关于审核的所有元素
    	        		clearForm();
    	        		clearLayer();
    	        		hideGridBtn();
    	        		hideTbBtn();
    	        		
    	        		var extent=data.extent;
    	        		xDvalue=data.grid_width_deg;
    	        		yDvalue=data.grid_height_deg;
    	        		xDvalue_km=data.grid_width_km;
    	        		yDvalue_km=data.grid_height_km;
    	        		cc=data.grid_space;
    	        		$("#grid_width").val(xDvalue_km);
    	        		$("#grid_height").val(yDvalue_km);
    	        		
    	        		var geo={
	    					"type":"Polygon",
	    					"coordinates":[[
				                [extent[0],extent[3]],
				                [extent[2],extent[3]],
				                [extent[2],extent[1]],
				                [extent[0],extent[1]],
				                [extent[0],extent[3]]]],"crs":{"type":"name","properties":{"name":"EPSG:0"}}
	    				};
	    				var geojson = {
    						type: 'Feature',
    						geometry: geo,
    						properties: null
    					}
        	            var feature = geojsonFormat.readFeature(geojson);
        	            
    		    		xian_Extent=extent;
    		    		xian_Feature=$.extend({},feature);
//    		    		ExtentGrid(true);
    		    		// 生成网格集合数据
    		    		idIndex={};
    		    		var ylayer=[],
    		    		yindex={},
    		    		wlayer=[],
    		    		windex={},
    		    		pylayer=[],
    		    		pyidnex=[],
    		    		pwlayer=[],
    		    		pwidnex=[];
    		    		gridtitl=data.grid_data;
    	    			var e1=Number(extent[0]);
    	    			var e2=Number(extent[3]);
    		    		for(var i=0;i<gridtitl.length;i++){
    		    			var x=Number(gridtitl[i][0]);
    		    			var y=Number(gridtitl[i][1])+1;
    			            var geo={
    								"type":"Polygon",
    								"coordinates":[[[e1+(x*xDvalue),e2-(y*yDvalue)],
    								               [e1+((x+1)*xDvalue)-cc,e2-(y*yDvalue)],
    								               [e1+((x+1)*xDvalue)-cc,e2-((y-1)*yDvalue)-cc],
    								               [e1+(x*xDvalue),e2-((y-1)*yDvalue)-cc],
    								               [e1+(x*xDvalue),e2-(y*yDvalue)]]
    								],"crs":{"type":"name","properties":{"name":"EPSG:0"}}
    							};
    						var geojson = {
    								type: 'Feature',
    								geometry: geo,
    								properties: null
    							}
    						var feature=geojsonFormat.readFeature(geojson);
    						feature.setProperties({index:(i+1)});
    						idIndex[(i+1)]=$.extend({},feature);
    						
    		    			if(gridtitl[i][2]=="0"){
    		    				//未完成
    		    				var f=$.extend({},feature);
    				            f.setStyle(unselectStyle);
    				    		wlayer.push(f);
    				    		windex[(i+1)]=f;
    				    		//已完成标记
    				    		var point =newPoint((i+1),geo.coordinates[0][1],wwc_src,[1.4, 1.5]);
    				            pwlayer.push(point);
    				            pwidnex[(i+1)]=point;
    		    			}else if(gridtitl[i][2]=="1"){
    		    				//已完成
    		    				var f=$.extend({},feature);
    				            f.setStyle(ywcStyle);
    				    		ylayer.push(f);
    				    		yindex[(i+1)]=f;
    				    		//已完成标记
    				    		var point =newPoint((i+1),geo.coordinates[0][1],ywc_src,[1.2, 1.5]);
    				            pylayer.push(point);
    				            pyidnex[(i+1)]=point;
    		    			}
    		    		}
    		            shdk_p_ywc_layer.addFeatures(pylayer);
    		            shdk_p_ywc_layer.idIndex_=pyidnex;
    		            shdk_p_wwc_layer.addFeatures(pwlayer);
    		            shdk_p_wwc_layer.idIndex_=pwidnex;
    		    		shdk_ywc_layer.addFeatures(ylayer);
    		    		shdk_ywc_layer.idIndex_=yindex;
    		    		shdk_wwc_layer.addFeatures(wlayer);
    		    		shdk_wwc_layer.idIndex_=windex;
    		    		idIndex.length=gridtitl.length;
    		    		sortLayer();
    		    		$("#shdk_grid_total").val(idIndex.length);
    		    		$("#shdk_grid_current").val(1);
//    		    		//自动选中第一个
    		    		gridIndex=1;
    		    		selectGrid(gridIndex,1);
    		    		getExtent(gridIndex);
    		    		$("#shdk_grid_current").val(idIndex[gridIndex].getProperties().index);
    	            	window.closeAlert();
    	        	}
    	        },
    			error: function (err) {
    				util.validateSession(err);
    				console.log(err);
                	window.closeAlert();
    			}
        	});
    	},100);
	}
	function saveZqGridData(){
		var jsondata={
				extent:xian_Extent,
				grid_width_km:xDvalue_km,
				grid_height_km:yDvalue_km,
				grid_width_deg:xDvalue,
				grid_height_deg:yDvalue,
				grid_space:cc,
				grid_data:gridtitl
		}
		var xian=$("#shdkSelect").val();
		var datas={xian:xian,userid:userObj.userId,appid:window.appid_,datakey:"SHDKGDATA",jsondata:jsondata};
    	var url="";
		$.ajax({
	        type:"post",  
	        url:"shdk/saveZqGridData.do", 
	        dataType:"JSON",
	        data:{data:JSON.stringify(datas)},
	        success:function(data){
	        	console.log("保存网格信息成功");
	        },
			error: function (err) {
				util.validateSession(err);
				console.log(err);
				mini.alert("保存失败");
			}
    	});
	}
    /**
	 * 通过县code获取政区四至
	 * @param template:弹出框表单模板
	 */
	function getZqExtent(xian,flag){
		window.openAlert();
    	setTimeout(function(){
    		$.ajax({
    	        type:"GET",  
    	        url:config.publicService+"/ws/rest/LS/search/"+xian, 
    	        dataType:"JSON",  
    	        success:function(data){
    	        	if(!data){
    	        		return;
    	        	}
    	            var feature = geojsonFormat.readFeature(data.item.shape);
    	            feature.setStyle(selectStyle);
    	    		var extent=feature.getGeometry().getExtent();
    	    		xian_Extent=extent;
    	    		xian_Feature=$.extend({},feature);
//    	    		ExtentGrid(true);
    	    		getOffset();
    	    		// 生成网格集合数据,加上偏移量
    	    		var left=extent[0]-offsetX;
    	    		var bottom=extent[1];
    	    		var right=extent[2];
    	    		var top=extent[3]+offsetY;
    	    		gridxy=[];
    	    		var x=0,y=0;
    	    		//网格宽高向上取整
    	    		for(var i=left;i<=(right+xDvalue);i+=xDvalue){
    	    			gridxy[x]=[];
    	    			for(var j=top;j>=(bottom-yDvalue);j-=yDvalue){
    	    				gridxy[x][y]={
    	    						grid_col:i, grid_row:j, del:false, finished:false
    	    					};
    	    				y++;
    		    		}
    		    		if(i<=right){
    		    			y=0;
    		    		}
    	    			x++;
    	    		}
    	    		gridxy.width=x-1;
    	    		gridxy.height=y-1;
    	    		addGridLayer(flag);
    	        },
    			error: function (err) {
    				util.validateSession(err);
    				console.log(err);
    			}
        	});
    	},100)
	}
    /**
	 * 生成网格图层
	 */
	function addGridLayer(flag){
		idIndex={};
		var pwlayer=[],pwidnex={};
		for(var i=0;i<(gridxy.length-1);i++){
			for(var j=0;j<(gridxy[i].length-1);j++){
				var geo={
					"type":"Polygon",
					"coordinates":[[
					                [gridxy[i+1][j]["grid_col"]-cc,gridxy[i][j]["grid_row"]],
					                [gridxy[i+1][j]["grid_col"]-cc,gridxy[i][j+1]["grid_row"]+cc],
					                [gridxy[i][j]["grid_col"],gridxy[i][j+1]["grid_row"]+cc],
					                [gridxy[i][j]["grid_col"],gridxy[i][j]["grid_row"]],
					                [gridxy[i+1][j]["grid_col"]-cc,gridxy[i][j]["grid_row"]]]],"crs":{"type":"name","properties":{"name":"EPSG:0"}}
				};
				var geojson = {
						type: 'Feature',
						geometry: geo,
						properties: null
					}
				var feature=geojsonFormat.readFeature(geojson);
				feature.setStyle(unselectStyle);
				idIndex[j*gridxy.width+(i+1)]=feature;
				
			}
		}
//		isIntersection();
		var features=[];
		var k=1;
		for(var key in idIndex){
			if(typeof key =="string"){
				idIndex[key].setProperties({index:k});
				idIndex[key].setStyle(unselectStyle);
				features.push(idIndex[key]);
				
				//已完成标记
	    		var point =newPoint(k,geo.coordinates[0][1],wwc_src,[1.4, 1.5]);
	            pwlayer.push(point);
	            pwidnex[k]=point;
				
				if(k==1&&flag){
					var f1=$.extend(true,{},idIndex[key]);
					f1.setStyle(selectStyle);
					shdk_high_layer.idIndex_[k]=f1;
					shdk_high_layer.addFeature(f1);
				}
				k++;
			}
		}
		idIndex.length=features.length;
		shdk_wwc_layer.addFeatures(features);
		shdk_wwc_layer.idIndex_=$.extend({},idIndex);

        shdk_p_wwc_layer.addFeatures(pwlayer);
        shdk_p_wwc_layer.idIndex_=pwidnex;
		shdk_p_ywc_layer.refresh();
		if(!flag){
			saveZqGridData();
			$("#shdk_grid_total").val(idIndex.length);
			$("#shdk_grid_current").val(1);
			
			//自动选中第一个
			gridIndex=1;
			selectGrid(gridIndex,1);
			getExtent(gridIndex);
			$("#shdk_grid_current").val(idIndex[gridIndex].getProperties().index);
		}else{
			$(".zs-btn.qt-grid-button").removeClass("disabled").attr("disabled", false);
			$(".zs-btn.fd-grid-button").removeClass("disabled").attr("disabled", false);
			window.closeAlert();
		}
	}
    /**
	 * 高亮单元格
	 * @param id:需要高亮的网格id
	 */
	function selectGrid(id,z){
		id=Number(id);
		//清除关于审核的所有元素
		//全省则不再清除图斑信息
		var radio=$(".zs-grid-tool .dhfw input:checked");
		if(radio.attr("value")=="part"){
			clearForm();
			hideGridBtn();
			hideTbBtn();
		}
		var f="";
		var ck=$(".zs-grid-tool .line.wcqk input:checked");
		var len=idIndex.length;
		//获取下一格 显示的网格
		for(var i=id;true;i=(i+z)){
			var f="";
			if(ck.length==2){
				f=idIndex[i];
			}else if(ck.length==1){
				if(ck.attr("value")=="ywc"&&shdk_ywc_layer.getFeatures().length!=0){
					f=shdk_ywc_layer.getFeatureById(i);
				}else if(ck.attr("value")=="wwc"&&shdk_wwc_layer.getFeatures().length!=0){
					f=shdk_wwc_layer.getFeatureById(i);
				}else{
					return;
				}
			}else{
				return;
			}
			if(f){
				gridIndex=i;
				id=i;
				break;
			}
			if(i<=-1){
				i=(len+1);
			}else if(i>=(len+1)){
				i=0;
			}
		}
		if(f){
			var f1=shdk_high_layer.getFeatureById(id);
			if(f1){
//				try{
//					shdk_high_layer.removeFeature(f1);
//					delete shdk_high_layer.idIndex_[id];
//				}catch (e) {
//				}
			}else{
				shdk_high_layer.clear();
				shdk_high_layer.idIndex_={};
				f1=$.extend({},idIndex[id]);
				f1.setStyle(selectStyle);
				shdk_high_layer.idIndex_[id]=f1;
				shdk_high_layer.addFeature(f1);
			}
			//显示网格功能按钮
			showGridBtn();
		}
	}
	/**
	 * 废弃
	 */
	function getExtent(id){
		window.closeAlert();
		return;
		try{
			var extent="";
			var radio=$(".zs-grid-tool .dhfw input:checked");
			if(radio.attr("value")=="all"){//全县
				extent=xian_Extent;
			}else if(radio.attr("value")=="part"){
				extent=idIndex[id].getGeometry().getExtent();
			}
			getGridData(extent);
		}catch(e){
			
		}
	}
    /**
	 * 通过四至获取图斑的id与经纬度信息
	 * @param extent:四至
	 */
	function getGridData(extent){
		var nd = "2017";
		var xian = $("#shdkSelect").val();
		var url = config.publicService+"/ws/rest/DS/export/zyjg/";
		var shzt="";
		var ck=$(".zs-grid-tool .line.shzt input:checked");
		ck.each(function(e){
			shzt+=ck[e].value+",";
		});
		if(!shzt){
			shzt="999";
		}
		shzt=shzt.substring(0,shzt.length-1);
		url += extent[0]+"/"+extent[1]+"/"+extent[2]+"/"+extent[3]+"/"+nd+"/"+xian+"/"+shzt;
		window.openAlert();
        $.ajax({
            url: url,
            type: "GET",
            success: function (res) {
                if (res.message == "sucess") {
                    var features = [];
                    var data = res.data;
                    ids=[];
	            	xys={};
	            	total=0;
                    for (var i = 0; i < data.length; i++) {
                    	if(data[i].lon&&data[i].lat&&data[i].lon.length>6&&data[i].lat>6){
                    		total++;
                        	ids.push(data[i].id);
                        	var name=data[i].c_xiang+data[i].c_cun+data[i].c_xiaoban+"小班";
                        	xys[data[i].id]={lon:data[i].lon,lat:data[i].lat,name:name};
                    	}
                    }
                    ids=ids.sort();
                    var shdk_current = $("#shdk_current");
		            var shdk_total = $("#shdk_total");
		            shdk_current.val("0");
		            shdk_total.val("0");
		            $("#shtbSelect").html("<option value =''>无图斑数据</option>");
		            if(total>0){
			            shdk_current.val("1");
			            shdk_total.val(total);
			    		setTboption();
			    		// 获取数据
			    		getData(xys[ids[0]]);
		            }else{
		            	high_layer.clear();
		        		publicObj.features=[];
		            	window.closeAlert();
		            }
                } else {
                	window.closeAlert();
                }
            },
            error: function (e) {
            }
        });
	}
	/**
	 * 图斑选中事件
	 */
	function TboptionClick(){
		var id=$("#shtbSelect").val();
		var i=0;
		for(var key in xys){
			if(typeof key =="string"){
				i++;
				if(key==id){
		            break;
				}
			}
		}
		clearForm();
		$("#shdk_current").val(i);
		getData(xys[id]);
	}
	/**
	 * 图斑下拉列表
	 */
	 function setTboption(){
         var contList = $("#shtbSelect");
         if(!xys){
        	 contList.html("<option value =''>无图斑数据</option>");
        	 return;
         }
         var zqHtml = "";
         var i=0;
         for(var key in xys){
        	 if(typeof key =="string"){
        		 i++;
        		 zqHtml+="<option oid='"+i+"' value ='"+key+"'>"+xys[key]["name"]+"</option>";
        	 }
         }
         contList.html(zqHtml);
	 }
    /**
	 * 通过xy点坐标获取数据
	 * @param coor：点坐标xy
	 */
	function getData(data){
		clearForm();
		high_layer.clear();
		publicObj.features=[];
		var coor=[data.lon,data.lat];
		var name=data.name;
		if(!coor||!(Number(coor[0])&&Number(coor[1]))){
			mini.alert("坐标不正确！");
			window.closeAlert();
			return;
		}
		$(".zs-btn.xyg-button").removeClass("disabled").attr("disabled", false);
		$(".zs-btn.syg-button").removeClass("disabled").attr("disabled", false);
		var callback = function (res) {
			if (typeof res == 'object' && res.success) {
				var data = JSON.parse(res.data);
				var form = $('#popIbox_shdk')[0];
				if(form){//如果没有审核弹出框，则不查询数据
					var elements = form.getElementsByTagName('input');
					newData=data;
					elements.C_XIAN.value = data.C_XIAN || '';
					elements.C_XIANNAME.value = data.C_XIANNAME || '';
					elements.C_XIANG.value = data.C_XIANG || '';
					elements.C_CUN.value = Number(data.C_CUN) ? (Number(data.C_CUN)) : (data.C_CUN || '');
					elements.C_XIAOBAN.value = Number(data.C_XIAOBAN) ? (Number(data.C_XIAOBAN)) : (data.C_XIAOBAN || '');
					elements.C_WORKYEAR.value = data.C_WORKYEAR || '';
					elements.I_LON_DEG.value = coor[0]/* .toFixed(2) */;
					var lonArr = util.getDFM(coor[0]);
					elements.lon.value = lonArr[0] + "°" + lonArr[1] + "′" + lonArr[2] + "″";
					elements.I_LAT_DEG.value = coor[1]/* .toFixed(2) */;
					var latArr = util.getDFM(coor[1]);
					elements.lat.value = latArr[0] + "°" + latArr[1] + "′" + latArr[2] + "″";
					elements.D_AREA.value = data.D_AREA || '';
					elements.C_YSBHYY.value = data.C_YSBHYY || '';
					$(elements.C_YSBHYY).siblings().val(data.C_YSBHYY);
					elements.C_HSBHYY.value = data.C_HSBHYY || '';
					$(elements.C_HSBHYY).siblings().val(data.C_HSBHYY);
					elements.C_YIJU.value = data.C_YIJU || '';
					elements.C_USERNAME.value = data.C_USERNAME || '';
					elements.DT_CREATETIME.value = data.DT_CREATETIME || '';
					elements.C_CHECKUSERNAME.value =  userObj.realName||data.C_CHECKUSERNAME;
					elements.DT_CHECKTIME.value = util.getDate("yyyy-MM-dd")||data.DT_CHECKTIME;
					elements.C_STATUS_DESC.value = data.C_STATUS_DESC||'';

					if([1,2,-1].indexOf(data.C_STATUS)==-1){
						$(".zs-btn.tg-button").removeClass("disabled").attr("disabled", false);
						$(".zs-btn.cz-button").removeClass("disabled").attr("disabled", false);
						$(".zs-btn.bsbh-button").removeClass("disabled").attr("disabled", false);
					}
				}
				setActive(data);
			}else{
				if(publicObj.features.length!=0){
					high_layer.clear();
					publicObj.features=[];
				}
//				mini.alert("查询失败");
			}
			window.closeAlert();
		}
		window.openAlert();
		queryLayer.queryBySpace(coor, '2017', { queryType: "bhdk" }, callback);
	}
    /**
	 * 刷新数据
	 * 
	 */
	function reload(){
		var features=shdk_high_layer.getFeatures();
		if(features&&features.length>0){
			for(var key in shdk_high_layer.idIndex_){
				if(typeof key =="string"){
					selectGrid(key,0);
					getExtent(gridIndex);
					$("#shdk_grid_current").val(idIndex[gridIndex].getProperties().index);
				}
			}
		}
	}
    /**
	 * 获取一条数据
	 * @param bool：判断向上获取||向下获取
	 */
	function NextData(bool){
		var shdk_current = $("#shdk_current");
		var len=0;
		if(!bool){
			len=Number(shdk_current.val())+1;
		}else{
			len=Number(shdk_current.val())-1;
		}
		//图班的游标循环
		if(len<=0){
			len=ids.length;
		}else if(len>ids.length){
			len=1;
		}
		//选中图斑下拉列表
		shdk_current.val(len);
		$("#shtbSelect").val(ids[len-1]);
		getData(xys[ids[len-1]]);
	}
    /**
	 * 获取全图或单个网格的四至，并定位
	 * @param flag:判断是全图网格||单个网格
	 */
	function ExtentGrid(flag){
		var extent,geo;
		if(flag){
			extent=xian_Extent;
			geo=xian_Feature.getGeometry();
		}else{
			var features=shdk_high_layer.getFeatures();
			if(features&&features.length>0){
				geo=features[0].getGeometry();
				extent=geo.getExtent();
			}else{
				return;
			}
		}
		if(extent.length!=0){
				map.getMap().getView().fit(extent);
		}
	}
    /**
	 * 移动到下一个网格
	 * @param bool:判断是上一个网格||下一个网格
	 */
	function NextGrid(bool){
		var shdk_grid_current=$("#shdk_grid_current");
		if(bool){
			gridIndex=Number(gridIndex)-1;
			selectGrid(gridIndex,-1);
		}else{
			gridIndex=Number(gridIndex)+1;
			selectGrid(gridIndex,1);
		}
		//全省则不再查询
		var radio=$(".zs-grid-tool .dhfw input:checked");
		if(radio.attr("value")=="part"){
			getExtent(gridIndex);
		}
		$("#shdk_grid_current").val(idIndex[gridIndex].getProperties().index);
		var zoom=map.getMap().getView().getZoom();
		if(zoom>12){
			$(".fd-grid-button").click();
		}
	}
    /**
	 * 获取输入框游标，定位到游标指定小班
	 * 
	 */
	function inputIndex(){
		var val=Number($("#shdk_current").val());
		if(!val||val<1||val>ids.length){
			$("#shdk_current").val($("#shtbSelect :checked").attr("oid"));
			return;
		}
		val=Math.floor(val);
		$("#shdk_current").val(val);
		var i=0;
		for(var key in ids){
		    if(typeof key =="string"){
		        i++;
		        if(i==val){
		        	i=key;
		            break;
		        }
		    }
		}
		$("#shtbSelect").val(ids[i]);
		getData(xys[ids[i]]);
	}
    /**
	 * 获取输入框游标，定位到游标指定网格
	 * 
	 */
	function inputGridIndex(){
		var val=Number($("#shdk_grid_current").val());
		if(!val||val<1||val>idIndex.length){
			$("#shdk_grid_current").val(gridIndex);
			return;
		}
		val=Math.floor(val);
		$("#shdk_current").val(val);
		var ck=$(".zs-grid-tool .line.wcqk input:checked");
		var fs=[];
		if(ck.length==2){
			fs=idIndex;
		}else if(ck.length==1){
			if(ck.attr("value")=="ywc"){
				fs=shdk_ywc_layer.idIndex_;
			}else if(ck.attr("value")=="wwc"){
				fs=shdk_wwc_layer.idIndex_;
			}
		}else{
			return;
		}
		for(var key in fs){
		    if(typeof key =="string"){
		        if(fs[key]&&fs[key].getProperties().index==val){
		    		gridIndex=key;
					break;
				}
		    }
		}
		selectGrid(gridIndex,0);
		//全省则不再查询
		var radio=$(".zs-grid-tool .dhfw input:checked");
		if(radio.attr("value")=="part"){
			getExtent(gridIndex);
		}
	}
    /**
	 * 标记网格完成||未完成
	 * @param id:需要标记的网格id
	 * @param flag:完成||未完成
	 */
	function check_ywc_layer(id){
		var f=idIndex[id];
		if(f){
			var f1=shdk_ywc_layer.getFeatureById(id);
			var src="";
			var finished=0;
			if(!f1){
				//删除当前高亮元素，从“未完成图层”
				delete shdk_wwc_layer.idIndex_[id];
				shdk_wwc_layer.removeFeature(f);
				
				//添加当前高亮元素到“已完成图层”
				f.setStyle(ywcStyle);
				shdk_ywc_layer.idIndex_[id]=f;
				shdk_ywc_layer.addFeature(f);
				shdk_ywc_layer.refresh();
				
				shdk_p_wwc_layer.removeFeature(shdk_p_wwc_layer.idIndex_[id]);
				delete shdk_p_wwc_layer.idIndex_[id];
				
				//已完成标记网格
				var point=newPoint(id,f.getGeometry().getCoordinates()[0][1],ywc_src,[1.2, 1.5]);
	            shdk_p_ywc_layer.idIndex_[id]=point;
				shdk_p_ywc_layer.addFeature(point);
				shdk_p_ywc_layer.refresh();
				finished=1;
			}else if(f1){
				delete shdk_ywc_layer.idIndex_[id];
				shdk_ywc_layer.removeFeature(f1);
				
				f.setStyle(unselectStyle);
				shdk_wwc_layer.idIndex_[id]=f;
				shdk_wwc_layer.addFeature(f);
				shdk_wwc_layer.refresh();

				shdk_p_ywc_layer.removeFeature(shdk_p_ywc_layer.idIndex_[id]);
				delete shdk_p_ywc_layer.idIndex_[id];
				
				//已完成标记网格
				var point=newPoint(id,f.getGeometry().getCoordinates()[0][1],wwc_src,[1.4, 1.5]);
	            shdk_p_wwc_layer.idIndex_[id]=point;
				shdk_p_wwc_layer.addFeature(point);
				shdk_p_wwc_layer.refresh();
				finished=0;
			}
			
			sortLayer();
			//更新网格信息
			var i=0;
	        for(var k in idIndex){
	            if(typeof k == "string"&&k!="length"){
					i++;
	                if(k==id){
						gridtitl[(i-1)][2]=finished;
						saveZqGridData();
						break;
	                }
	            }
	        }
		}
	}
	/**
	 * 游标重新排序
	 * 
	 * */
	function sortLayer(){
		var checks=$(".zs-grid-tool .line.wcqk input:checked");
		if(checks.length==2){
			var i=0;
			for(var key in idIndex){
				if(typeof key =="string"&&key!="length"){
					i++;
					var f=shdk_ywc_layer.getFeatureById(key);
					if(f){
						f.setProperties({index:i});
						//已完成标记
			            var point =shdk_p_ywc_layer.getFeatureById(key);
			            point.getStyle().text_.text_=i+"";
			            shdk_p_ywc_layer.refresh();
					}
					var f1=shdk_wwc_layer.getFeatureById(key);
					if(f1){
						f1.setProperties({index:i});

						//已完成标记
			            var point =shdk_p_wwc_layer.getFeatureById(key);
			            point.getStyle().text_.text_=i+"";
			            shdk_p_wwc_layer.refresh();
					}
				}
			}
			$("#shdk_grid_total").val(idIndex.length);
			var hf=shdk_high_layer.getFeatures()[0];
			if(hf){
				$("#shdk_grid_current").val(hf.get("index"));
			}
		}else if(checks.length==1){
			var i=0;
			for(var key in shdk_ywc_layer.idIndex_){
				if(typeof key =="string"&&key!="length"){
					i++
					var f=shdk_ywc_layer.getFeatureById(key);
					if(f){
						f.setProperties({index:i});
						//已完成标记
						var point =shdk_p_ywc_layer.getFeatureById(key);
			            point.getStyle().text_.text_=i+"";
			            shdk_p_ywc_layer.refresh();
					}
				}
			}
			i=0;
			for(var key in shdk_wwc_layer.idIndex_){
				if(typeof key =="string"&&key!="length"){
					i++
					var f=shdk_wwc_layer.getFeatureById(key);
					if(f){
						f.setProperties({index:i});
						//未完成标记
						var point =shdk_p_wwc_layer.getFeatureById(key);
			            point.getStyle().text_.text_=i+"";
			            shdk_p_wwc_layer.refresh();
					}
				}
			}
			var len=0;
			if(checks.attr("value")=="ywc"){
				len=shdk_ywc_layer.getFeatures().length;
			}else if(checks.attr("value")=="wwc"){
				len=shdk_wwc_layer.getFeatures().length;
			}
			$("#shdk_grid_total").val(len);
			selectGrid(gridIndex,1);
			getExtent(gridIndex);
		}else{
			$("#shdk_grid_total").val(0);
			$("#shdk_grid_current").val(0);
		}
	}
	/**
	 * 控制网格显示内容
	 * @param i ： 显示标注文字
	 * @param point : 标注点xy坐标
	 * */
	function setGridVisible(){
		var checks=$(".zs-grid-tool .line.wcqk input:checked");
		var zoom=map.getMap().getView().getZoom();
		var ywc_layer=map.getLayerByName("SHDK_YWC_LAYER");
		var wwc_layer=map.getLayerByName("SHDK_WWC_LAYER");
		var p_ywc_layer=map.getLayerByName("SHDK_P_YWC_LAYER");
		var p_wwc_layer=map.getLayerByName("SHDK_P_WWC_LAYER");
		if(checks.length==0){
			ywc_layer.setVisible(false);
			wwc_layer.setVisible(false);
			p_ywc_layer.setVisible(false);
			p_wwc_layer.setVisible(false);
		}
		if(checks.length==1){
			var layer={};
			if(checks.attr("value")=="ywc"){
				wwc_layer.setVisible(false);
				ywc_layer.setVisible(true);
				p_wwc_layer.setVisible(false);
				if(zoom>15){
					p_ywc_layer.setVisible(true);
				}else{
					p_ywc_layer.setVisible(false);
				}
			}
			if(checks.attr("value")=="wwc"){
				wwc_layer.setVisible(true);
				ywc_layer.setVisible(false);
				p_ywc_layer.setVisible(false);
				if(zoom>15){
					p_wwc_layer.setVisible(true);
				}else{
					p_wwc_layer.setVisible(false);
				}
			}
		}
		if(checks.length==2){
			ywc_layer.setVisible(true);
			wwc_layer.setVisible(true);
			if(zoom>15){
				p_ywc_layer.setVisible(true);
				p_wwc_layer.setVisible(true);
			}else{
				p_ywc_layer.setVisible(false);
				p_wwc_layer.setVisible(false);
			}
		}
	}
    /**
	 * 高亮图斑
	 * @param data:图斑基本信息
	 */
	function setActive(data){
		// 判断是否有此图层，避免编辑图形时报错
		var layerName = data.C_XIAN + "_" + data.C_WORKYEAR;
		if(!publicObj.getLayerByName(layerName)){
			var tree=treeHelper.getTree("zyjg");
			nodeClick(tree.getNodes()[0],layerName);
		}
		// 高亮
		var geojson = {
            type: 'Feature',
            geometry: JSON.parse(data.shape),
            properties: { ID: data.ID+"", C_XIAN: data.C_XIAN, C_WORKYEAR: data.C_WORKYEAR,C_STATUS:data.C_STATUS,I_CREATEUSERID:data.I_CREATEUSERID}
        }
        var feature = geojsonFormat.readFeature(geojson);
		publicObj.features.push(feature);
		feature.setStyle(selectStyle);
		high_layer.addFeature(feature);
		
		map.getMap().getView().fit(feature.getGeometry().getExtent());
		map.getMap().getView().setZoom(14);

		!data.C_STATUS?data.C_STATUS="0":"0";
		setButtonStatus(data.C_STATUS);
	}
    /**
	 * 选中对应县的变化图斑图层树
	 * @param node：bhdk的节点
	 * @param layerName：县code+nd组成，例“201020_2017”
	 */
	function nodeClick(node,layerName){
		if(node.children&&node.children.length>0){
			for(var i=0;i<node.children.length;i++){
				nodeClick(node.children[i],layerName);
			}
		}else{
			if(node.selectId&&node.selectId==layerName){
				var tid =$("[tid='"+node.id+"'] i");
				if(!tid.parent("a").hasClass("selected")){
					$("[tid='"+node.id+"'] i").click();
				}
			}
		}
	}
    /**
	 * 解析模板，生成表单的html
	 * @param template:弹出框表单模板
	 */
	function getPopHtml(template) {
		var arr = typeof template.C_NR == 'object' ? template.C_NR : JSON.parse(template.C_NR);
		var data = {};
		var html = "<div class='zs-nicescroll'>" +
				"<form id='popIbox_shdk'><table class='fore-common-form-tabs'";
		window.optionClick = optionClick;
		for (var i = 0; i < arr.length; i++) {
			var fieldObj = arr[i];
			html += "<tr><td class='text'>" + fieldObj.DICTNAME + "</td>";
			var value = data[fieldObj.FIELDNAME] ? data[fieldObj.FIELDNAME] : '';
			if (fieldObj.GROUP) {
				html += "<td class='input'>";
				var groupArr = fieldObj.GROUP;
				for (var z = 0; z < groupArr.length; z++) {
					var item = groupArr[z];
					var itemValue = data[item.FIELDNAME] ? data[item.FIELDNAME] : '';
					html += "<input type='text' style='width:35px;' name= '" + item.FIELDNAME + "'value='" + itemValue + "'/> " + item.DICTNAME + " ";
				}
				html += "</td></tr>";
			} else if (fieldObj.DICTITEM) {
				var itemArr = fieldObj.DICTITEM;
				html += "<td class='input'>" +
					"<input type='hidden' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>" +
					"<select style='width:100px;' onchange='optionClick(this)'>" +
					"<option value=''>--请选择--</option>";
				for (var j = 0; j < itemArr.length; j++) {
					var item = itemArr[j];
					if (value == item.NAME) {
						html += "<option selected='selected' value='" + item.NAME + "'>" + item.NAME + "</option>";
					} else {
						html += "<option value='" + item.NAME + "'>" + item.NAME + "</option>";
					}
				}
				html += "</select>" + "</td></tr>";
			} else {
				if (fieldObj.FIELDNAME == "I_LON_DEG") {
					html += "<td class='input'>"
						+ "<input type='hidden' style='width:100px;' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "<input type='text' style='width:100px;' value='' name='lon'/>"
						+ "</td></tr>";
				} else if (fieldObj.FIELDNAME == "I_LAT_DEG") {
					html += "<td class='input'>"
						+ "<input type='hidden' style='width:100px;' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "<input type='text' style='width:100px;' value='' name='lat'/>"
						+ "</td></tr>";
				} else if (fieldObj.FIELDNAME == "C_XIAN") {
					html += "<td class='input'>"
						+ "<input type='hidden' style='width:100px;' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "<input type='text'    style='width:100px;' value='' name='C_XIANNAME'/>"
						+ "</td></tr>";
				} else if (fieldObj.FIELDNAME == "C_USERNAME") {
					html += "<td class='input'>"
						+ "<input type='text' disabled='disabled' style='width:100px;' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "</td></tr>";
				}
				else if (fieldObj.FIELDNAME == "DT_CREATETIME") {
					html += "<td class='input'>"
						+ "<input type='text' style='width:100px;'  disabled='disabled' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "</td></tr>";
				} else if (fieldObj.FIELDNAME == "C_CHECKUSERNAME") {
					html += "<td class='input'>"
						+ "<input type='text' disabled='disabled' style='width:100px;' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "</td></tr>";
				}
				else if (fieldObj.FIELDNAME == "DT_CHECKTIME") {
					html += "<td class='input'>"
						+ "<input type='text' style='width:100px;'  disabled='disabled' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "</td></tr>";
				}
				else if (fieldObj.FIELDNAME == "C_STATUS_DESC") {
					html += "<td class='input'>"
						+ "<input type='text' style='width:100px;'  disabled='disabled' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "</td></tr>";
				}
				else {
					html += "<td class='input'>"
						+ "<input type='text' style='width:100px;' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "</td></tr>";
				}
			}
		}
		html += "</table></form></div>";
		html += "<div class='fore-core-btnboxs'>" +
		"<button class='zs-btn disabled tg-button' disabled='disabled' style='padding: 0px 10px;'>通过</button>" +
		"<button class='zs-btn disabled cz-button' disabled='disabled' style='padding: 0px 10px;'>重做</button>" +
		"<button class='zs-btn disabled bsbh-button' disabled='disabled' style='padding: 0px 10px;'>不是变化</button></div>";
		return html;
	}
	// select标签的change事件
	function optionClick(e) {
		$(e).siblings("input").val(e.value);
	}
    /**
	 * 设置“区划”工具栏状态
	 * @param status:图斑审核状态
	 */
	function setButtonStatus(status) {
		var tools = $(".board-qh a");
		var disableArr = [];
		if (status) {
			switch (status) {
				case "0":// 未审核
					disableArr = ["tool-cj", "tool-fg", "tool-hb", "tool-sc", "tool-sx"];
					break
				case "1":// 审核通过
					disableArr = ["tool-cj","tool-xb", "tool-jdbj", "tool-fg", "tool-hb", "tool-sc", "tool-sx"];
					break
				case "2":// 审核通过（有修改）
					disableArr = ["tool-cj","tool-xb", "tool-jdbj", "tool-fg", "tool-hb", "tool-sc", "tool-sx"];
					break
				case "3":// 重做
					disableArr = ["tool-cj", "tool-fg", "tool-hb", "tool-sc", "tool-sx"];
					break
				case "-1":// 无变化
					disableArr = ["tool-cj", "tool-fg", "tool-hb", "tool-sc", "tool-sx"];
					break
				case "98":// 工具栏按钮放开
					break
			}
		} else {
			disableArr = ["tool-cj","tool-xb", "tool-jdbj", "tool-fg", "tool-hb", "tool-sc", "tool-sx"];
		}
		var len = tools.length;
		for (var i = 0; i < len; i++) {
			var e = tools[i];
			if (e.className.indexOf("tool-ht") < 0) {
				$(e).removeClass("disable");
			}
			if (disableArr.contains(e.className)) {
				$(e).addClass("disable");
			}
		}
	}
	/**
	 * 计算米转换度公式
	 * 
	 * */
	function degTometer(width,height,wh){
		xDvalue_km=width;
		yDvalue_km=height;
		var m=360.0 / (6371000 * 2 * Math.PI);
		xDvalue=width*1000*m;
		yDvalue=height*1000*m;
		cc=wh*1000*m;
	}
	/**
	 * 计算网格与县边界相交
	 * 
	 * */
	function isIntersection(){
		var allFeature_ = $.extend({},idIndex);
		var parser_ = new jsts.io.OL3Parser();
		var drawGraphics = parser_.read(xian_Feature.getGeometry());
		var i=0;
		gridtitl=[];
		var sTime=new Date().getTime();
		for(var key in allFeature_){
			if(typeof key =="string"){
				var currentGraphics = parser_.read(allFeature_[key].getGeometry());
		        var overlapGraphics = currentGraphics.intersection(drawGraphics);
		        if(overlapGraphics.getArea()<=0){
		            delete idIndex[key];
		        }else{
		        	gridtitl[i]=[(key-1)%gridxy.width,Math.floor(key/gridxy.width),0];
			        i++;
		        }
			}
		}
		console.log(new Date().getTime()-sTime);
	}
	/**
	 * 清除表单内容
	 * 
	 * */
	function clearForm(){
		// 清空表单元素
		var form = document.getElementById("popIbox_shdk");  
		if(form){
			var tagElements = form.getElementsByTagName('input');  
			for (var j = 0; j < tagElements.length; j++){ 
				tagElements[j].value="";
			}
			var tagElements = form.getElementsByTagName('select'); 
			for (var j = 0; j < tagElements.length; j++){ 
				tagElements[j].value="";
			}
		}
		//审核按钮禁用
		$(".zs-btn.tg-button").addClass("disabled").attr("disabled", "disabled");
		$(".zs-btn.cz-button").addClass("disabled").attr("disabled", "disabled");
		$(".zs-btn.bsbh-button").addClass("disabled").attr("disabled", "disabled");

		//清除“区划”工具栏
//		$(".tool-qc").click();
	}
	/**
	 * 清除所有图层
	 * 
	 * */
	function clearLayer(){
		//清除审核图层
		shdk_ywc_layer.clear();
		shdk_wwc_layer.clear();
		shdk_high_layer.clear();
		shdk_p_ywc_layer.clear();
		shdk_p_wwc_layer.clear();
		shdk_ywc_layer.idIndex_={};
		shdk_wwc_layer.idIndex_={};
		shdk_high_layer.idIndex_={};
		shdk_p_ywc_layer.idIndex_={};
		shdk_p_wwc_layer.idIndex_={};
		
		//清除高亮元素
		high_layer.clear();
		publicObj.features=[];
	}
	/**
	 * 禁用网格按钮并归零网格游标
	 * 
	 * */
	function hideGridBtn(){
		$(".zs-btn.qt-grid-button").addClass("disabled").attr("disabled", "disabled");
		$(".zs-btn.fd-grid-button").addClass("disabled").attr("disabled", "disabled");
		$(".zs-btn.syg-grid-button.prev").removeClass("line").addClass("disabled").attr("disabled", "disabled");
		$(".zs-btn.xyg-grid-button.next").removeClass("line").addClass("disabled").attr("disabled", "disabled");
		$(".zs-btn.shwg-grid-button.endLeft").addClass("disabled").attr("disabled", "disabled");

		$("#shdk_grid_current").val("0");
		$("#shdk_grid_total").val("0");
	}
	/**
	 * 禁用图斑按钮并归零图斑游标
	 * 
	 * */
	function hideTbBtn(){
		$(".zs-btn.syg-button.prev").removeClass("line").addClass("disabled").attr("disabled", "disabled");
		$(".zs-btn.xyg-button.next").removeClass("line").addClass("disabled").attr("disabled", "disabled");
		$("#shdk_current").val("0");
		$("#shdk_total").val("0");
		//清空图斑下拉框
		$("#shtbSelect").html("<option value =''>无图斑数据</option>");
	}
	/**
	 * 可用网格按钮
	 * 
	 * */
	function showGridBtn(){
		$(".zs-btn.qt-grid-button").removeClass("disabled").attr("disabled", false);
		$(".zs-btn.fd-grid-button").removeClass("disabled").attr("disabled", false);
		$(".zs-btn.syg-grid-button.prev").addClass("line").removeClass("disabled").attr("disabled", false);
		$(".zs-btn.xyg-grid-button.next").addClass("line").removeClass("disabled").attr("disabled", false);
		$(".zs-btn.shwg-grid-button.endLeft").removeClass("disabled").attr("disabled", false);

		if(idIndex[gridIndex]){
			$("#shdk_grid_current").val(idIndex[gridIndex].getProperties().index);
		}
		
		var checks=$(".zs-grid-tool .line.wcqk input:checked");
		if(checks.length==2){
			$("#shdk_grid_total").val(idIndex.length);
		}else if(checks.length==1){
			if(checks.attr("value")=="ywc"){
				$("#shdk_grid_total").val(shdk_ywc_layer.getFeatures().length);
			}else if(checks.attr("value")=="wwc"){
				$("#shdk_grid_total").val(shdk_wwc_layer.getFeatures().length);
			}
		}else{
			$("#shdk_grid_total").val(0);
		}
	}
	/**
	 * 可用图斑按钮
	 * 
	 * */
	function showTbBtn(){
		$(".zs-btn.syg-button.prev").addClass("line").removeClass("disabled").attr("disabled", false);
		$(".zs-btn.xyg-button.next").addClass("line").removeClass("disabled").attr("disabled", false);
		$("#shdk_current").val("0");
		$("#shdk_total").val("0");
		//清空图斑下拉框
		$("#shtbSelect").html("<option value =''>无图斑数据</option>");
	}
	/**
	 * 是否添加已完成图层的遮罩
	 * @param bool ： ture||false
	 * */
	function setLayerStyle(bool){
		var yfs=shdk_ywc_layer.getFeatures();
		for(var i=0;i<yfs.length;i++){
			if(!bool){
				yfs[i].getStyle().fill_.color_="rgba(255,255,255,0.5)";
			}else{
				yfs[i].getStyle().fill_.color_="rgba(255,255,255,0)";
			}
		}
		shdk_ywc_layer.refresh();
	}
	/**
	 * 创建一个标注点
	 * @param i ： 显示标注文字
	 * @param point : 标注点xy坐标
	 * */
	function newPoint(text,point,src,anchor){
		var point =new ol.Feature(new ol.geom.Point(point));
    	var pointStyle=new ol.style.Style({
            fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
            image: new ol.style.Icon({
    	        anchor: anchor,
    		    src: src
    		}),
    		text:new ol.style.Text({
                text: text+"",
                font: '30px serif',
                offsetX:'-70',
                offsetY:'-50',
                fill: new ol.style.Fill({color: 'red'}),
                stroke: new ol.style.Stroke({
                  color: 'white',
                  width: 3
                })
            })
        });
    	point.setStyle(pointStyle);
    	return point;
	}
	/**
	 * 获取屏幕自适应高度
	 */
	function getAuto(){
		var m=map.getMap().getView();
		var zoom=m.getZoom();
		if(zoom<15){
			mini.alert("请把地图放大到合适比例，再创建网格!");
			return;
		}
		//当前四至范围
		var ex=m.calculateExtent();
		//纵坐标差
		var a=ex[2]-ex[0];
		//横坐标差
		var b=ex[3]-ex[1];
		//格网外空白高度占比1/4;
		var c=b*0.25;
		//网格宽*高（经纬度）
		xDvalue=a-c;
		yDvalue=b-c;
		//单元格所占长度
		var dd=6371000 * 2 * Math.PI / 360.0/1000;
		xDvalue_km=dd*xDvalue;
		yDvalue_km=dd*yDvalue;
		return [xDvalue_km,yDvalue_km];
	}
	function getOffset(){
		var m=map.getMap().getView();
		var zoom=m.getZoom();
		if(zoom<15){
			offsetX=0;
			offsetY=0;
			return;
		}
		//当前四至范围
		var ex=m.calculateExtent();
//		//纵坐标差
//		var a=ex[2]-ex[0];
		//横坐标差
		var b=ex[3]-ex[1];
		//格网外空白高度占比1/4;
		var c=b*0.25;
		//(当前四至minx-县四至minx+格网外空白高度/2)/网格宽=当前视角网格 距 县四至左上角点横坐标的距离
		var xd=(ex[0]-xian_Extent[0]+(c/2))/xDvalue;
		//(县四至maxy-当前四至maxy+格网外空白高度/2)/网格高=当前视角网格 距 县四至左上角点纵坐标的距离
		var yd=(xian_Extent[3]-ex[3]+(c/2))/yDvalue;
		//整体网格偏移量
		offsetX=(1-(xd-Math.floor(xd)))*xDvalue;
		offsetY=(1-(yd-Math.floor(yd)))*yDvalue;
	}
	//工具栏选择按钮
	function getDataById(id,xian){
		$(".zs-btn.tg-button").addClass("disabled").attr("disabled", "disabled");
		$(".zs-btn.cz-button").addClass("disabled").attr("disabled", "disabled");
		$(".zs-btn.bsbh-button").addClass("disabled").attr("disabled", "disabled");
		$.ajax({
			url: "shdk/getDataById.do",
			type: "POST",
			data: { data: JSON.stringify({xian:xian,id:id})},
			success: function (res) {
				if (res) {
					var data=JSON.parse(res);
					if(data["C_STATUS"]&&data["C_STATUS"].length>0){
						data["C_STATUS_DESC"]=shzt_status[data["C_STATUS"]];
					}
					var form = $('#popIbox_shdk')[0];
					if(form){//如果没有审核弹出框，则不查询数据
						var elements = form.getElementsByTagName('input');
						newData=data;
						elements.C_XIAN.value = data.C_XIAN || '';
						elements.C_XIANNAME.value = data.C_XIANNAME || '';
						elements.C_XIANG.value = data.C_XIANG || '';
						elements.C_CUN.value = Number(data.C_CUN) ? (Number(data.C_CUN)) : (data.C_CUN || '');
						elements.C_XIAOBAN.value = Number(data.C_XIAOBAN) ? (Number(data.C_XIAOBAN)) : (data.C_XIAOBAN || '');
						elements.C_WORKYEAR.value = data.C_WORKYEAR || '';
						elements.I_LON_DEG.value = data.I_LON_DEG/* .toFixed(2) */;
						var lonArr = util.getDFM(data.I_LON_DEG);
						elements.lon.value = lonArr[0] + "°" + lonArr[1] + "′" + lonArr[2] + "″";
						elements.I_LAT_DEG.value = data.I_LAT_DEG/* .toFixed(2) */;
						var latArr = util.getDFM(data.I_LAT_DEG);
						elements.lat.value = latArr[0] + "°" + latArr[1] + "′" + latArr[2] + "″";
						elements.D_AREA.value = data.D_AREA || '';
						elements.C_YSBHYY.value = data.C_YSBHYY || '';
						$(elements.C_YSBHYY).siblings().val(data.C_YSBHYY);
						elements.C_HSBHYY.value = data.C_HSBHYY || '';
						$(elements.C_HSBHYY).siblings().val(data.C_HSBHYY);
						elements.C_YIJU.value = data.C_YIJU || '';
						elements.C_USERNAME.value = data.C_USERNAME || '';
						elements.DT_CREATETIME.value =util.getDate("yyyy-MM-dd",new Date(data.DT_CREATETIME)) || '';
						elements.C_CHECKUSERNAME.value =  userObj.realName||data.C_CHECKUSERNAME;
						elements.DT_CHECKTIME.value = util.getDate("yyyy-MM-dd")||data.DT_CHECKTIME;
						elements.C_STATUS_DESC.value = data.C_STATUS_DESC||'';

						if([1,2,-1].indexOf(data.C_STATUS)==-1){
							$(".zs-btn.tg-button").removeClass("disabled").attr("disabled", false);
							$(".zs-btn.cz-button").removeClass("disabled").attr("disabled", false);
							$(".zs-btn.bsbh-button").removeClass("disabled").attr("disabled", false);
						}
					}
				}else{
					window.closeAlert();
				}
			},
			error: function (err) {
				util.validateSession(err);
				window.closeAlert();
				mini.alert("查询失败！");
			}
		});
	}
	return {
		init:init,
		getDataById:getDataById,
	}
});