/**
 * 地图公用工具方法绑定
 */
define([
	'managerTool', 'measureMap', 'mapSetting'
], function (managerTool, measureMap, mapSetting) {
	'use strict';
	var swipeLayer = '';
	//是否吸附 设置为全局变量
	window.isBufferSnap = true;
	var exitFullScreen = true; // 退出全屏设置
	function init() {
		window.templates = [];
		var template = {
			"ID": 1,
			"C_TYPE": "default",
			"C_ZQCODE": "200000",
			"I_USERID": 1,
			"C_NR": [
				{ "FIELDNAME": "C_XIAN", "DICTNAME": "县(林业局)", "FIELDTYPE": "STRING", "ZINDEX": 1, "CANSHOW": "是", "DICTITEM": "" },
				{ "FIELDNAME": "C_XIANG", "DICTNAME": "乡(林场)", "FIELDTYPE": "STRING", "ZINDEX": 2, "CANSHOW": "是", "DICTITEM": "" },
				{ "FIELDNAME": "C_CUN", "DICTNAME": "村(林班)", "FIELDTYPE": "STRING", "ZINDEX": 3, "CANSHOW": "是", "DICTITEM": "" },
				{ "FIELDNAME": "C_XIAOBAN", "DICTNAME": "小班", "FIELDTYPE": "STRING", "ZINDEX": 5, "CANSHOW": "是", "DICTITEM": "" },
				{ "FIELDNAME": "C_WORKYEAR", "DICTNAME": "工作年度", "FIELDTYPE": "STRING", "ZINDEX": 6, "CANSHOW": "是", "DICTITEM": "" },
				{ "FIELDNAME": "I_LON_DEG", "DICTNAME": "经度", "FIELDTYPE": "DOUBLE", "ZINDEX": 7, "CANSHOW": "是", "DICTITEM": "" },
				{ "FIELDNAME": "I_LAT_DEG", "DICTNAME": "纬度", "FIELDTYPE": "DOUBLE", "ZINDEX": 8, "CANSHOW": "是", "DICTITEM": "" },
				{ "FIELDNAME": "D_AREA", "DICTNAME": "面积", "FIELDTYPE": "STRING", "ZINDEX": 9, "CANSHOW": "是", "DICTITEM": "" },
				{
					"FIELDNAME": "C_YSBHYY", "DICTNAME": "疑似变化原因", "FIELDTYPE": "STRING", "ZINDEX": 10, "CANSHOW": "是", "DICTITEM": [
						{ "CODE": 1, "NAME": "采伐" }, { "CODE": 2, "NAME": "占地" }, { "CODE": 3, "NAME": "毁林开垦" }, { "CODE": 4, "NAME": "灾害" },
						{ "CODE": 5, "NAME": "造林" }, { "CODE": 6, "NAME": "其他减少" }, { "CODE": 7, "NAME": "其他增加" }
					]
				},
				{
					"FIELDNAME": "C_HSBHYY", "DICTNAME": "核实变化原因", "FIELDTYPE": "STRING", "ZINDEX": 11, "CANSHOW": "是", "DICTITEM": [
						{ "CODE": 10, "NAME": "造林更新" }, { "CODE": 20, "NAME": "森林采伐" }, { "CODE": 30, "NAME": "规划调整" }, { "CODE": 41, "NAME": "经审批使用林地" },
						{ "CODE": 42, "NAME": "未审批使用林地" }, { "CODE": 50, "NAME": "毁林开垦" }, { "CODE": 71, "NAME": "火灾" },
						{ "CODE": 72, "NAME": "地质灾害" }, { "CODE": 73, "NAME": "其它灾害因素" }, { "CODE": 81, "NAME": "封山育林" },
						{ "CODE": 82, "NAME": "其他自然更新" }, { "CODE": 91, "NAME": "漏划" }, { "CODE": 92, "NAME": "错划" },
						{ "CODE": 93, "NAME": "其它调查因素" }, { "CODE": 96, "NAME": "行政界线调整" }, { "CODE": 99, "NAME": "管理因子变化" },
						{ "CODE": 11, "NAME": "人工造林或飞播造林" },
						{ "CODE": 12, "NAME": "人工更新" }, { "CODE": 98, "NAME": "新增管理界线" }, { "CODE": 97, "NAME": "边界引起的细碎合并" },
					]
				},
				{ "FIELDNAME": "C_YIJU", "DICTNAME": "依据", "FIELDTYPE": "STRING", "ZINDEX": 12, "CANSHOW": "是", "DICTITEM": "" },
				{ "FIELDNAME": "C_USERNAME", "DICTNAME": "判读人", "FIELDTYPE": "STRING", "ZINDEX": 12, "CANSHOW": "是", "DICTITEM": "" },
				{ "FIELDNAME": "DT_CREATETIME", "DICTNAME": "判读时间", "FIELDTYPE": "DATA", "ZINDEX": 12, "CANSHOW": "是", "DICTITEM": "" },

			]
		};
		window.templates.push(template);
		//queryTemplate();
		bindTool();
	}
	/**
	 * 工具条点击事绑定
	 */
	function bindTool() {
		//区划下面的按钮
		$(".board-qh .tool a").on("click", function () {
			var $target = $(this);
			var disable = $target.hasClass("disable");
			if (!disable) {
				changeStyle(this);
				var type = $target.attr("ref").split("_")[1];
				managerTool.start(type);
			}
			//by zzq 20180128
			if ($(".tool-cj").hasClass("selected")) {
				$(".is-buffer-snap").show();
			} else if (!$(this).hasClass("tool-ht")) {
				$(".is-buffer-snap").hide();
			}
		})
		//公共按钮
		$(".map-tool a").on("click", function () {
			var $target = $(this);
			var disable = $target.hasClass("disable");
			if (!disable) {
				changeStyle(this);
				if ($target.attr("ref")) {
					var type = $target.attr("ref").split("_")[1];
					managerTool.start(type);
					removeSwipe();
				}
			}
			$("#map").removeClass("noTrack");
			$("#map").removeClass("Track");
			//by zzq 20180128
			if ($(".tool-cj").hasClass("selected")) {
				$(".is-buffer-snap").show();
			} else if (!$(this).hasClass("tool-ht")) {
				$(".is-buffer-snap").hide();

			}
			//收起测量弹出菜单
			if (!$(".tool-cl").hasClass("selected")) {
				$(".tool-cl").children().hide()
			}


		});
		//长度测量
		$("#length_nav").on('click', function () {
			$(".zs-zyjg-header .tool-cl").click();
			$('.tool-qc').click();
			window.startTool = true;
			measureMap.line();
			removeSwipe()
		});
		//面积测量
		$("#area_nav").on('click', function () {
			$(".zs-zyjg-header .tool-cl").click();
			$('.tool-qc').click();
			window.startTool = true;
			measureMap.area();
			removeSwipe();
		});
		//卷帘效果
		$(".tool-jl").on('click', function () {
			if ($('.tool-jl').hasClass('selected')) {
				var tis = $("select#status").val();
				if (tis == "") {
					mini.alert("请选择将要进行卷帘的影像", "温馨提示");
				} else {
					swipeCtr(tis)
				}
			} else {
				removeSwipe();
			}
		});
		//是否吸附 by zzq
		$(".is-buffer-snap i").click(function () {
			$(this).toggleClass("selected");
			isBufferSnap = $(this).hasClass("selected");
			//        	console.log(isBufferSnap);
		});
		//设置按钮方法绑定
		$(".tool-sz").on('click', function () {
			mapSetting.pop();
		});
		// 退出全屏
		$("#zyjg_fullScreen").bind("click", fullScreen);
	}
	function changeStyle(e) {
		var className = e.className;
		if (className != "tool-qp" && className != "tool-hb" && className != "tool-sc" && className != "tool-sx" && className != "tool-ht") {
			var eachFun = function (index, element) {
				if (className == element.className && className != "tool-qc" && className != "tool-sz") {
					if (!$(element).hasClass("selected")) {
						$(element).addClass("selected");
						if (className.indexOf("tool-cj") > -1) {
							$(".tool-ht").removeClass("disable");
						} else {
							$(".tool-ht").addClass("disable");
						}
					} else if (className.indexOf("tool-jl") > -1) {
						$(element).removeClass("selected");
					}
				} else {
					if (className == "tool-qc") {
						$(".tool-ht").addClass("disable");
					}
					$(element).removeClass("selected");
				}
			}
			$(".board-qh .tool a").each(eachFun);
			$(".map-tool a").each(eachFun);
		}
	}
    /**
     * 查询模板
     * **/
	function queryTemplate() {
		var queryFilter = {
			whereString: "I_USERID=1",
			selectFields: "ID,I_USERID,C_TYPE,C_ZQCODE,C_NR"
		};
		var callBack = {
			callback: function (res) {
				if (res && res.length > 0) {
					for (var i = 0; i < res.length; i++) {
						window.templates.push(res[i].originalObjects);
					}
				}
			},
			exceptionHandler: function (err) {

			}
		};
		FsService.getEntityList("GZGL_MUBAN", queryFilter, callBack);
	}


	//    //记录点击过的影像layer
	//    var ssyx = [];
	//select获取图层名
	$("select#status").change(function (e) {

		var layerO = $(this).val();
		//fontcolor(layerO)
		removeSwipe()
		if (layerO == "SSYX" || layerO == "YNYBYX" || layerO == "LDYX") {
			//$(".mapToolJl [layer='"+layerO+"']")[0].checked=true;
			if (!$(".mapToolJl [layer='" + layerO + "']").attr("checked")) {
				$(".mapToolJl [layer='" + layerO + "']").click();
			}

		} else {
			if (!$(".mapToolJl [layer='" + layerO + "']").parent().hasClass('selected')) {
				$(".mapToolJl [layer='" + layerO + "']").trigger("click");
				$(".mapToolJl [layer='" + layerO + "']").parent().trigger("click");
			}
		}

		var xian_title = $("#status option:selected").text().trim()
		$(".xian_b .tips span").text("卷帘:" + xian_title);
		if ($('.tool-jl').hasClass('selected')) {
			if (layerO !== "") {
				swipeCtr(layerO);
				//            	var layer=map.getLayerByName(layerO);
				//            	layer.getSource().refresh();
				//            	setTimeout(function(){var m = map.getMap();
				//    			m.render();},1000);
				//            	var y = map.getLayerByName(layerO);
				$('.xian_test').show();
			}

		}

		//   底部文字变色
		if (layerO == "SSYX" || layerO == "YNYBYX" || layerO == "LDYX") {
			$("#fontcolor span").addClass("fonts")
		} else
			if (layerO == undefined) {
				$("#fontcolor span").removeClass("fonts")
			}

	});
	//   天地图 底部文字变色
	$(".ygyx input[type=checkbox]").on("click", function () {
		if ($(this).prop('checked')) {
			$("#fontcolor span").addClass("fonts")
		} else
			if ($(".mapType .sub-menu input[type=checkbox]").prop('checked') == false) {
				$("#fontcolor span").removeClass("fonts")
			}
	})
	$(".mapTypeCard").on("click", function () {
		if ($(this).attr("layer") == "TIAN_IMG") {
			$("#fontcolor span").addClass("fonts")
		}
		if ($(this).attr("layer") == "TIAN_VEC") {
			$("#fontcolor span").removeClass("fonts")
		}
	})





	var tips = $(".xian_b .tips");
	var arr = $(".xian_test .arr");
	//卷帘初始化位置
	var tipsWidth = tips.outerWidth();
	var swipe = (($(window).width() / 2) - (tipsWidth / 2)).toFixed(1);
	$(".xian_test").css("left", $(window).width() / 2 - 8 + 'px');
	tips.css({ "opacity": "1", "left": swipe + 'px' });
	$(".xian_test").mouseenter(function () {
		tips.stop().fadeIn('fast');
		arr.stop().fadeIn('fast');
		//		mySlider.setTipsPos();
	}).mouseleave(function () {
		tips.stop().fadeOut('fast');
		arr.stop().fadeOut('fast');
	})
	//卷帘效果
	function swipeCtr(layerO) {
		$('.xian_test').show();
		$('.xian_b').show();
		//第一版
		var m = map.getMap();
		var y = map.getLayerByName(layerO);
		//    	var y1 = map.getLayerByName(layerT);
    	/*if(!y || !y1){
    		alert('暂无影像图层');
    		return;
    	}*/
		swipeLayer = layerO;
		//起始的宽度位置
		var swipe = $(window).width() / 2 - 8;
		//获取线
		var xian_dom = document.getElementsByClassName("xian_test");
		//线的鼠标落下
		$(".xian_test").on('mousedown', function (e) {
			$("#map_continer").on('mousemove', function (evt) {
				var maxWidth = document.body.clientWidth;
				var maxHeight = window.innerHeight;
				if (evt.clientX > maxWidth - 8) {
					evt.clientX = maxWidth - 8;
				} else if (evt.clientX < 8) {
					evt.clientX = 8;
				}
				//判断鼠标是否超出范围
				if (evt.clientY > maxHeight - 10 || evt.clientY < 40 || evt.clientX > maxWidth - 2 || evt.clientX < 1) {
					$("#map_continer").off('mousemove');
					m.render();
				}
				//禁止选中文本
				$("body").addClass("banSelect");
				$(".xian_test").css("left", (evt.clientX) + "px");
				swipe = $(".xian_test").offset().left;
				setTipsPos(swipe, tips);
				m.render();
			})
		})
		$("#map_continer").on('mouseup', function (e) {
			//可以选中文本
			$("body").removeClass("banSelect");
			$("#map_continer").off('mousemove');
			m.render();
		})
		y.on('precompose', function (event) {
			//画布
			//画布的属性宽度和样式宽度的比（算误差）
			var flag = ($("#map .ol-viewport>.ol-unselectable")[0].width / $("#map .ol-viewport>.ol-unselectable").width()).toFixed(2);
			var ctx = event.context;
			//分割线和拉框的差值
			var changValue = 0;
			//var changValue = $("#map .ol-viewport>.ol-unselectable")[0].width/2;
			//分割线的位置
			var width = swipe - changValue * flag + 8;
			//保存当前环境的状态
			ctx.save();
			//起始一条路径，或重置当前路径
			ctx.beginPath();
			var w1 = (width) * flag;
			var w2 = (ctx.canvas.width) * flag - w1;
			//创建矩形(左上角的x坐标，左上角的y坐标，宽度，高度)
			ctx.rect(w1, 0, w2, ctx.canvas.height);
			//从原始画布剪切任意形状和尺寸的区域
			ctx.clip();
		});
		y.on('postcompose', function (event) {
			var ctx = event.context;
			//返回之前保存过的路径状态和属性
			ctx.restore();
		});
		xian_dom[0].addEventListener('onmousedown', function () {
			//地图重新渲染
			m.render();
		}, false);
		m.render();
	}
	//清除卷帘效果
	function removeSwipe() {
		if ($(".xian_test").is(':hidden')) {
			return;
		}
		var tipsWidth = tips.outerWidth();
		var swipe = (($(window).width() / 2) - (tipsWidth / 2)).toFixed(1);
		$(".xian_test").hide();
		$(".xian_b").hide();
		$(".xian_test").css("left", $(window).width() / 2 + 'px');
		tips.css({ "opacity": "1", "left": swipe + 'px' });
		if (map.getMap) {
			//清除卷帘线
			var m_ = map.getMap();
			if (swipeLayer) {
				var l_ = map.getLayerByName(swipeLayer);
				l_.removeEventListener('precompose');
			}
			m_.render();
		}
	}
	function setTipsPos(swipe, tips) {
		var tipsWidth = tips.outerWidth();
		tips.css("right", "auto");
		//		左侧
		if (left <= tipsWidth / 2) {
			tips.css("left", "0px");
			return;
		}
		//		右侧
		if (left >= (swipe - tipsWidth / 2)) {
			var left = swipe - tipsWidth / 2;
			tips.css({ "left": "auto", "right": "0px" });
			return;
		}
		var left = (swipe - tipsWidth / 2).toFixed(1);
		tips.css({ "opacity": "1", "left": left + 'px' });
	}
	// 退出全屏
	var  fullScreen = function (element){
    	var mapContainer=document.getElementById('map_continer');
    	//W3C 
		if (mapContainer.requestFullscreen) { 
    		mapContainer.requestFullscreen(); 
    		document.getElementById('zyjg_fullScreen').innerHTML = '退出全屏';
    		exitFullScreen = !exitFullScreen;
		}
		//FireFox 
		else if (mapContainer.mozRequestFullScreen) { 
			mapContainer.mozRequestFullScreen();
			document.getElementById('zyjg_fullScreen').innerHTML = '退出全屏';
			exitFullScreen = !exitFullScreen;
		}
		//Chrome等 
		else if (mapContainer.webkitRequestFullScreen) { 
			mapContainer.webkitRequestFullScreen(); 
			document.getElementById('zyjg_fullScreen').innerHTML = '退出全屏';
			exitFullScreen = !exitFullScreen;
		}
		//IE11
		else if (mapContainer.msRequestFullscreen) {
			mapContainer.msRequestFullscreen();
			document.getElementById('zyjg_fullScreen').innerHTML = '退出全屏';
			exitFullScreen = !exitFullScreen;
		}
    	// 退出全屏
    	if (exitFullScreen) {
    		if (document.exitFullscreen) { 
        		document.exitFullscreen(); 
        		document.getElementById('zyjg_fullScreen').innerHTML = '全屏';
    		} 
    		else if (document.mozCancelFullScreen) { 
    			document.mozCancelFullScreen(); 
    			document.getElementById('zyjg_fullScreen').innerHTML = '全屏';
    		} 
    		else if (document.webkitCancelFullScreen) { 
    			document.webkitCancelFullScreen(); 
    			document.getElementById('zyjg_fullScreen').innerHTML = '全屏';
    		} 
    		else if (document.msExitFullscreen) { 
    			document.msExitFullscreen();
    			document.getElementById('zyjg_fullScreen').innerHTML = '全屏';
    		}
    	}
    }
	return {
		init: init,
		removeSwipe: removeSwipe
	}
});