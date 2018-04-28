/**
 * 地图区划工具主方法；（不包含卷帘，样地查询，测量，全屏）
 * */

define([
	'map', 'util', 'config', 'publicObj', "addTool", 'selectTool', 'modifyTool', 'paramTool', 'analyzeTool', 'queryLayer', 'unionTool', 'splitTool', 'cutTool', 'burrowTool', 'measureMap'
], function (map, util, config, publicObj, addTool, selectTool, modifyTool, paramTool, analyzeTool, queryLayer, unionTool, splitTool, cutTool, burrowTool, measureMap) {
	'use strict';
	var wktFormat = new ol.format.WKT();
	var jstsParser = new jsts.io.OL3Parser();
	var createFeature;//绘制的对象原型，用于更新本地layer
	var selectTemplate;//当前选中的模板
	var lastType;
	var toolType;
	//高亮图层默认颜色
	var defaultStyle = new ol.style.Style({
		fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
		stroke: new ol.style.Stroke({ color: 'rgb(255,255,0)', width: 3 })
	});
	//选中的颜色
	var selectStyle = new ol.style.Style({
		fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
		stroke: new ol.style.Stroke({ color: "rgb(255,0,0)", width: 3 })
	});
    /**
     *工具条点击事件
     * @param {string} tool
     * @param {string} layerName
     */
	function start(tool) {
		window.startTool = true;
		lastType = toolType;
		$("#map").removeClass("movehand");
		if (tool === "select") {
			//TODO 清除其他所有状态,启动选择
			if (lastType == "move") {
				clear(false);
			} else {
				clear(true);
			}
			selectTool.setActive(true, selectFun);
		} else if (tool === "move") {
			//TODO 清除所有状态，启动平移
			window.startTool = false;
			clear(false);
			selectTool.setActive(false);
			$("#map").addClass("movehand");
			//restore();
		} else if (tool === "clear") {
			//TODO 清除所有状态
			clear(true);
			restore();
		} else if (tool == "") {
			//TODO 待定义
		} else {
			//区划中的实际编辑工具
			var selectFeatures = getSelecteds();
			$("#map").removeClass("noTrack");
			$("#map").removeClass("Track");
			$("#map").removeClass("movehand");
			switch (tool) {
				case "add"://创建
					//TODO 清除所有装态，启动创建
					clear(true);
					addTool.setActive(true, popFun);
					break;
				case "trim"://修边
					//TODO 清除除选择外的所有状态，启动修边，修边完成后清除选择状态
					if (selectFeatures.length === 1) {
						clear(false);
						splitTool.setActive(true, selectFeatures[0], trimFun);
					} else {
						clear(true);
						restore();
						mini.alert("请选择一个图形，进行修边！", "温馨提示");
					}
					break;
				case "modify"://节点编辑
					//TODO 清除所有状态，启动节点编辑
					if (selectFeatures.length === 1) {
						clear(false);
						selectTool.setActive(false);
						modifyTool.setActive(true, saveModifyFun, selectFeatures[0]);
					} else {
						clear(true);
						restore();
						mini.alert("请选择一个图形！", "温馨提示");
					}
					break;
				case "cut"://分割
					//TODO 清除除选择外的所有状态，启动分割，分割后清除选择状态
					if (selectFeatures.length === 1) {
						clear(false);
						cutTool.setActive(true, selectFeatures[0], cutFun);
					} else {
						clear(true);
						restore();
						mini.alert("请选择一个图形，进行分割！", "温馨提示");
					}
					break;
				case "burrow"://挖洞
					if (selectFeatures.length === 1) {
						clear(false);
						burrowTool.setActive(true, selectFeatures[0], burrowFun);
					} else {
						clear(true);
						restore();
						mini.alert("请选择一个图形，进行分割！", "温馨提示");
					}
					break;

				case "union"://合并
					//TODO 清除除选择外的所有状态，合并后清除选择状态
					if (selectFeatures.length == 2) {
						clear(false);
						var unionedFeature = unionTool.union(selectFeatures, unionFun);
					} else {
						clear(true, true);
						restore();
						$(".tool  .selected").removeClass("selected");
						mini.alert("请选择两个图形，进行合并！", "温馨提示");
					}
					break;
				case "del"://删除
					//TODO 清除除选择外的所有状态，删除后清除选择状态
					if (selectFeatures.length == 1) {
						clear(false);
						del(selectFeatures);
					} else {
						mini.alert("请选择一个图形！", "温馨提示");
						$(".tool  .selected").removeClass("selected");
						clear(true, true);
					}
					break;
				case "param"://属性编辑
					//TODO 清除除选择外的所有状态，编辑后清除选择状态
					if (selectFeatures.length === 1) {
						clear(false);
						paramTool.handler(selectFeatures[0], popFun);
						if (lastType == "modify") {
							selectFeatures[0].setStyle(defaultStyle);
							$(".tool  .selected").removeClass("selected");
							clear(true, true);
							restore();
						}
					} else {
						clear(true, true);
						restore();
						$(".tool  .selected").removeClass("selected");
						mini.alert("请选择一个图形！", "温馨提示");
					}
					break;
				case "revoke"://撤回
					//TODO 目前和add 联合使用
					if (lastType == "add") {
						addTool.undo();
						return;
					} else {
						window.startTool = false;
					}
					break;
			}
		}
		toolType = tool;
	}
    /**
     * 选择回调
     * @param ol.feature 被选中的feature
     * **/
	function selectFun() {
		//点击选择后自动点击区划
		if (!$(".tool-qh").hasClass("selected")) {
			$(".tool-qh").click();
		}
		if (publicObj.features.length == 1) {
			judgeRole(0);
		} else if (publicObj.features.length == 2) {
			judgeRole(0);
			setTimeout(function () {
				if (!$(".tool-hb").hasClass("disable")) {
					judgeRole(1);
				}
			}, 0);
		} else {
			//选择集中选中的个数大于2,
			setButtonStatus();
		}
	}
	function judgeRole(index) {
		var status = publicObj.features[index].getProperties().C_STATUS + "";
		if (userObj.functions.indexOf("ZYJG_SH") > 0) {
			//审核用户
			setButtonStatus(status);
		} else if (userObj.functions.indexOf("ZYJG_PD") > 0) {
			//判读用户
			var I_CREATEUSERID = publicObj.features[index].getProperties().I_CREATEUSERID;
			if (I_CREATEUSERID == userObj.userId) {
				//所选图形是当前用户创建
				setButtonStatus(status);
			} else {
				//所选图形非当前用户创建
				setButtonStatus();
			}
		} else {
			//TODO 其他用户，暂未实现
		}
	}
	function setButtonStatus(status) {
		var tools = $(".board-qh a");
		var disableArr = [];
		if (status) {
			switch (status) {
				case "0"://未审核

					break
				case "1"://审核通过
					disableArr = ["tool-xb", "tool-jdbj", "tool-fg", "tool-wd", "tool-hb", "tool-sc", "tool-sx"];
					break
				case "2"://审核通过（有修改）
					disableArr = ["tool-xb", "tool-jdbj", "tool-fg", "tool-wd", "tool-hb", "tool-sc", "tool-sx"];
					break
				case "3"://重做

					break
				case "-1"://无变化

					break
			}
		} else {
			disableArr = ["tool-xb", "tool-jdbj", "tool-fg", "tool-wd", "tool-hb", "tool-sc", "tool-sx"];
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
     * 合并回调
     * @para ol.feature 合并后的feature
     * */
	function unionFun(unionedFeature) {
		window.openAlert();
		var maxAreaFeature = splitTool.getMaxArea(getSelecteds());
		var properties = maxAreaFeature.getProperties();
		delete properties.geometry;
		properties.D_AREA = util.getArea(unionedFeature.getGeometry());

		var layerName = maxAreaFeature.getProperties().C_XIAN + "_" + maxAreaFeature.getProperties().C_WORKYEAR;
		var layer = publicObj.getLayerByName(layerName);
		var z_wkt = new ol.format.WKT();
		var C_WKT = z_wkt.writeFeature(unionedFeature);
		var delId = 0;
		var selectFeatures = getSelecteds();
		for (var i = 0; i < selectFeatures.length; i++) {
			if (selectFeatures[i].getProperties().ID !== maxAreaFeature.getProperties().ID) {
				delId = selectFeatures[i].getProperties().ID;
			}
		}
		properties.C_OBJINFO = C_WKT;
		properties.I_EDITUSERID = userObj.userId;
		properties.DT_EDITTIME = util.getLocalDate();
		var data = {
			addRows: null,
			updateRows: [properties],
			delRows: [delId + ""],
			type: "updateGeom",
			tableName: 'ZYJG_BHTB',
			xianCode: properties.C_XIAN
		}
		$.ajax({
			url: "dataService.do",
			type: "POST",
			data: { jsonStr: JSON.stringify(data) },
			success: function (res) {
				if (res.success) {

				} else {
					mini.alert("合并失败！", "失败提示");
				}
				editEnd();
			},
			error: function (err) {
				util.validateSession(err);
				console.log(err);
			}
		});
	}
    /**
     * 分割后方法
     *
     * */
	function cutFun(features) {
		window.openAlert();
		var coor_old = jstsParser.write(jstsParser.read(getSelecteds()[0].getGeometry()).getInteriorPoint()).getCoordinates();
		var x = coor_old[0];
		var y = coor_old[1];
		var property = getSelecteds()[0].getProperties();
		delete property.geometry;
		var callback = function (res) {
			if (typeof res == 'object' && res.success) {
				var data = JSON.parse(res.data);
				delete data.shape;
				var layerName = property.C_XIAN + "_" + property.C_WORKYEAR;
				var layer = publicObj.getLayerByName(layerName);
				var z_wkt = new ol.format.WKT();
				var adds = [];
				for (var i = 0; i < features.length; i++) {
					var area = util.getArea(features[i].getGeometry());
					var coor = jstsParser.write(jstsParser.read(features[i].getGeometry()).getInteriorPoint()).getCoordinates();
					var lon = coor[0];
					var lat = coor[1];
					var C_OBJINFO = z_wkt.writeFeature(features[i]);
					data.I_EDITUSERID = userObj.userId;
					data.D_EDITTIME = util.getLocalDate();
					data.D_AREA = area;
					data.I_LON_DEG = lon;
					data.I_LAT_DEG = lat;
					data.C_OBJINFO = C_OBJINFO;
					features[i].setProperties(data);
					adds.push(features[i].getProperties());
					delete adds[i].geometry;
				}
				var data = {
					addRows: adds,
					updateRows: null,
					delRows: [property.ID + ""],
					type: "cut",
					tableName: 'ZYJG_BHTB',
					xianCode: adds[0].C_XIAN
				}
				$.ajax({
					url: "dataService.do",
					type: "POST",
					data: { jsonStr: JSON.stringify(data) },
					success: function (res) {
						if (res.success) {
							/* if (res.rowId) {
								layer.getSource().removeFeature(getSelecteds()[0]);
								setStyle(features);
								layer.getSource().addFeatures(features);
							} */
						} else {
							mini.alert("分割失败！", "失败提示");
						}
						editEnd();
					},
					error: function (err) {
						util.validateSession(err);
						console.log(err);
					}
				});
			}
		}
		queryLayer.queryBySpace([x, y], '2017', { queryType: "bhdk" }, callback);

	}
	function burrowFun(wkt) {
		var feature = wktFormat.readFeature(wkt);
		var coor_old = jstsParser.write(jstsParser.read(feature.getGeometry()).getInteriorPoint()).getCoordinates();
		var x = coor_old[0];
		var y = coor_old[1];
		var area = util.getArea(feature.getGeometry());
		var property = getSelecteds()[0].getProperties();
		delete property.geometry;
		property.C_OBJINFO = wkt;
		property.D_AREA = area;
		property.I_LAT_DEG = x;
		property.I_LON_DEG = y;
		property.I_EDITUSERID = userObj.userId;
		property.DT_EDITTIME = util.getLocalDate();
		var data = {
			addRows: null,
			updateRows: [property],
			delRows: null,
			type: "burrow",
			tableName: 'ZYJG_BHTB',
			xianCode: property.C_XIAN
		}
		$.ajax({
			url: "dataService.do",
			type: "POST",
			data: { jsonStr: JSON.stringify(data) },
			success: function (res) {
				if (!res.success) {
					mini.alert("分割失败！", "失败提示");
				}
				editEnd();
			},
			error: function (err) {
				util.validateSession(err);
				console.log(err);
			}
		});
	}
    /**
     * 修边后方法
     *
     * */
	function trimFun(features, ids) {
		window.openAlert();
		var updateRows = [];
		var selectProperty = publicObj.features[0].getProperties();
		var xianCode = selectProperty.C_XIAN;
		var nd = selectProperty.C_WORKYEAR;
		var status = selectProperty.C_STATUS;
		var layerName = xianCode + "_" + nd;
		var layer = publicObj.getLayerByName(layerName);
		for (var i = 0; i < features.length; i++) {
			var coor = jstsParser.write(jstsParser.read(features[i].getGeometry()).getInteriorPoint()).getCoordinates();
			var area = util.getArea(features[i].getGeometry());
			var property = features[i].getProperties();
			delete property.geometry;
			var z_wkt = new ol.format.WKT();
			var C_WKT = z_wkt.writeFeature(features[i]);
			property.I_LON_DEG = coor[0];
			property.I_LAT_DEG = coor[1];
			property.D_AREA = area;
			property.C_OBJINFO = C_WKT;
			property.DT_EDITTIME = util.getLocalDate();
			property.I_EDITUSERID = userObj.userId;
			property.C_XIAN = xianCode;
			property.C_WORKYEAR = nd;
			property.C_STATUS = status;
			property.I_CREATEUSERID = selectProperty.I_CREATEUSERID;
			updateRows.push(property);
			features[i].setProperties(property);
		}
		var data = {
			addRows: null,
			updateRows: updateRows,
			delRows: ids,
			type: "updateGeom",
			tableName: 'ZYJG_BHTB',
			xianCode: xianCode
		}

		$.ajax({
			url: "dataService.do",
			type: "POST",
			data: { jsonStr: JSON.stringify(data) },
			success: function (res) {
				if (res.success) {
					/* 	setStyle(features);
						layer.getSource().addFeatures(features); */
					//审核地块，面积重新赋值
					if (publicObj.features.length === 1 && $("[name='D_AREA']").length === 1) {
						$("[name='D_AREA']").val(util.getArea(feature.getGeometry()));
					}
				} else {
					mini.alert("保存失败！", "错误提示");
				}
				editEnd();
			},
			error: function (err) {
				util.validateSession(err);
				console.log(err);
			}
		});
	}
    /**
     * 弹窗方法
     * @param type：类型(add)目前只有这一个标识，不是新增情况null
     * @param feature：图形元素ol.feature
     * @param template：模板
     * **/
	function popFun(type, feature, template) {
		createFeature = feature;
		selectTemplate = template;
		if (window.ldyzt_fullScreen) {
			var fullScreenId = "map_continer";
		} else {
			var fullScreenId = null;
		}
		var html = getPopHtml(feature, template);
		var ibox = $("#public_pop").modal({
			title: "属性信息",
			overlay: false,
			showMin: false,
			showMax: false,
			showTop: false,
			isDrag: true,
			fullScreenId: fullScreenId,
			contentWidth: 350,
			type: "clone",
			target: html || "",
			addCallBack: function () {
				var iBox = this;
				$(".zs-nicescroll").niceScroll({
					cursorcolor: "#777",
					cursorborder: "none",
				});
				$(".close-button").on('click', function () {
					$(".close-btn").click();
					if (toolType == "add") {
						$(".tool-qc").click();
					}
				});
				$(".save-button").on('click', function () {
					save(feature);
				});
				var coor = jstsParser.write(jstsParser.read(feature.getGeometry()).getInteriorPoint()).getCoordinates();
				var form = $('#popIbox_xbsx')[0];
				var elements = form.getElementsByTagName('input');
				if (toolType == "add") {
					//先设置不需要查询的属性，防止异步查询慢，点击保存存储失败
					elements.C_WORKYEAR.value = userObj.defineNd;
					elements.I_LON_DEG.value = coor[0]/* .toFixed(2) */;
					elements.C_USERNAME.value = userObj.realName;
					elements.DT_CREATETIME.value = util.getLocalDate();
					var lonArr = util.getDFM(coor[0]);
					elements.lon.value = lonArr[0] + "°" + lonArr[1] + "′" + lonArr[2] + "″";
					elements.I_LAT_DEG.value = coor[1]/* .toFixed(2) */;
					var latArr = util.getDFM(coor[1]);
					elements.lat.value = latArr[0] + "°" + latArr[1] + "′" + latArr[2] + "″";
					elements.D_AREA.value = util.getArea(feature.getGeometry());
					var callback = function (res) {
						var data = typeof res == 'object' ? res : JSON.parse(res);
						if (config.isLoacl) {
                			/**
                    		 * 调用ws服务的赋值
                    		 * */
							var xianName = data.XIAN_NAME || data.LIN_YE_JU;
							var xianCode = data.XIAN || data.LIN_YE_JU;
							var xiang = data.XIANG_NAME || data.LIN_CHANG;
							var cun = data.CUN_NAME || data.LIN_BAN;
							var xiaoban = data.XIAO_BAN || '';
							//
						} else {
                			/**
                    		 * 调用易伟航服务的赋值
                    		 * **/
							if (data.sheng_name == '云南省') {
								data.xian = "5" + data.xiao_ban.substring(0, 5);
							}
							if (data.geojson) {
								if(data.lin_ye_ju.trim()){
									var xianName = data.linyeju_name.trim();
									var xianCode = data.lin_ye_ju.trim();
									var xiang = data.lin_chang_name.trim();
									var cun = data.lin_ban;
									var xiaoban = data.xiao_ban || '';
								}else{
									var xianName = data.xian_name;
									var xianCode = data.xian;
									var xiang = data.xiang_name;
									var cun = data.cun_name;
									var xiaoban = data.xiao_ban || '';
								}
							} else {
								var zqNameArr = getZqName(coor[0], coor[1]);
								var xianName = zqNameArr[2] || '';
								var xiang = zqNameArr[3] || '';
							}

						}
						elements.C_XIAN.value = (xianCode) || '';
						elements.C_XIANNAME.value = (xianName) || '';
						elements.C_XIANG.value = (xiang) || '';
						elements.C_CUN.value = Number(cun) ? (Number(cun)) : (cun || '');
						elements.C_XIAOBAN.value = Number(xiaoban) ? (Number(xiaoban)) : (xiaoban || '');
						$(".zs-btn.save-button").removeClass("disabled").attr("disabled", false);
					}

					if (config.isLoacl) {
                		/**
                		 * 调用ws服务
                		 * */
						var url = config.publicService + "/ws/rest/DS/linbanpoi/zyjg/" + coor[0] + "/" + coor[1];
						queryLayer.query_ws(url, callback);
					} else {
                		/**
                		 * 调用易伟航服务
                		 * **/
						var url = config.queryUrl + "?";
						queryLayer.queryBySpace(coor, '2009', { url: url }, callback);
					}

				} else if (toolType == "param") {
					var callback = function (res) {
						if (typeof res == 'object' && res.success) {
							var data = JSON.parse(res.data);
							elements.C_XIAN.value = data.C_XIAN || '';
							elements.C_XIANNAME.value = data.C_XIANNAME || '';
							elements.C_XIANG.value = data.C_XIANG || '';
							elements.C_CUN.value = Number(data.C_CUN) ? (Number(data.C_CUN)) : (data.C_CUN || '');
							elements.C_XIAOBAN.value = Number(data.C_XIAOBAN) ? (Number(data.C_XIAOBAN)) : (data.C_XIAOBAN || '');
							elements.C_WORKYEAR.value = data.C_WORKYEAR || '';
							elements.I_LON_DEG.value = coor[0];
							var lonArr = util.getDFM(coor[0]);
							elements.lon.value = lonArr[0] + "°" + lonArr[1] + "′" + lonArr[2] + "″";
							elements.I_LAT_DEG.value = coor[1];
							var latArr = util.getDFM(coor[1]);
							elements.lat.value = latArr[0] + "°" + latArr[1] + "′" + latArr[2] + "″";
							elements.D_AREA.value = data.D_AREA || util.getArea(feature.getGeometry());
							elements.C_YSBHYY.value = data.C_YSBHYY || '';
							$(elements.C_YSBHYY).siblings().val(data.C_YSBHYY);
							elements.C_HSBHYY.value = data.C_HSBHYY || '';
							$(elements.C_HSBHYY).siblings().val(data.C_HSBHYY);
							elements.C_YIJU.value = data.C_YIJU || '';
							elements.C_USERNAME.value = data.C_USERNAME || '';
							elements.DT_CREATETIME.value = data.DT_CREATETIME || '';
						}
						$(".zs-btn.save-button").removeClass("disabled").attr("disabled", false);
					}
					queryLayer.queryBySpace(coor, '2017', { queryType: "bhdk" }, callback);
				}
			}
		});
		ibox.click();
	}
	/**
	 * 解析模板生成html
	 *
	 * @param {any} feature
	 * @param {any} template
	 * @returns
	 */
	function getPopHtml(feature, template) {
		var arr = typeof template.C_NR == 'object' ? template.C_NR : JSON.parse(template.C_NR);
		var data = feature.getProperties();
		var html = "<form id='popIbox_xbsx' style='width:300px'><table class='fore-common-form-tabs'";
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
					"<select style='width:160px;' onchange='optionClick(this)'>" +
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
						+ "<input type='hidden' style='width:160px;' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "<input type='text' style='width:160px;' value='' name='lon'/>"
						+ "</td></tr>";
				} else if (fieldObj.FIELDNAME == "I_LAT_DEG") {
					html += "<td class='input'>"
						+ "<input type='hidden' style='width:160px;' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "<input type='text' style='width:160px;' value='' name='lat'/>"
						+ "</td></tr>";
				} else if (fieldObj.FIELDNAME == "C_XIAN") {
					html += "<td class='input'>"
						+ "<input type='hidden' style='width:160px;' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "<input type='text'    style='width:160px;' value='' name='C_XIANNAME'/>"
						+ "</td></tr>";
				} else if (fieldObj.FIELDNAME == "C_USERNAME") {
					html += "<td class='input'>"
						+ "<input type='text' disabled='disabled' style='width:160px;' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "</td></tr>";
				}
				else if (fieldObj.FIELDNAME == "DT_CREATETIME") {
					html += "<td class='input'>"
						+ "<input type='text' style='width:160px;'  disabled='disabled' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "</td></tr>";
				}
				else {
					html += "<td class='input'>"
						+ "<input type='text' style='width:160px;' value='" + value + "' name='" + fieldObj.FIELDNAME + "'/>"
						+ "</td></tr>";
				}
			}
		}
		html += "</table></form>";
		html += "<div class='fore-core-btnboxs'>" +
			"<button class='zs-btn close-button'>关闭</button>" +
			"<button class='zs-btn save-button disabled' disabled='disabled'>保存</button></div>";
		return html;
	}
	/**
	 * select标签的change事件
	 * @param {any} e
	 */
	function optionClick(e) {
		$(e).siblings("input").val(e.value);
	}
	function closePop() {
		$(".close-btn").click();
	}
    /**
     * feature：ol.feature
     * 保存方法
     * **/
	function save(feature) {
		window.openAlert();
		var form = $('#popIbox_xbsx')[0];
		var elements = form.getElementsByTagName('input');
		var property = {};
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element.name && element.name != 'lon' && element.name != 'lat') {
				property[element.name] = element.value;
			}
		}
		var z_wkt = new ol.format.WKT();
		var C_WKT = z_wkt.writeFeature(feature);
		property.C_OBJINFO = C_WKT;
		if (getSelecteds().length === 1) {
			//属性编辑的保存
			property.ID = getSelecteds()[0].getProperties().ID + "";
			property.I_EDITUSERID = userObj.userId;
			property.DT_EDITTIME = util.getLocalDate();
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
		} else {
			//新增
			property.C_STATUS = 0;
			property.I_CREATEUSERID = userObj.userId;
			var data = {
				addRows: [property],
				updateRows: null,
				delRows: null,
				type: "insert",
				tableName: 'ZYJG_BHTB',
				xianCode: property.C_XIAN,
				y: property.I_LAT_DEG,
				x: property.I_LON_DEG
			}
			var XY_ = {
				y: property.I_LAT_DEG,
				x: property.I_LON_DEG
			}
			/*03.01 by zh --S--*/
			var isSave = isIntersection(property, feature, "add", XY_);
			if (!isSave) {
				return;
			}
			/*03.01 by zh --E--*/
		}
		feature.setProperties(property);

		$.ajax({
			url: "dataService.do",
			type: "POST",
			data: { jsonStr: JSON.stringify(data) },
			success: function (res) {
				if (res.success) {
					if (res.rowId && res.xianCode) {
						map.getLayerByName("HIGH_LAYER").getSource().clear();
					}
				} else {
					createFeature = null;
					mini.alert("保存失败！", "错误提示");
				}
				closePop();
				editEnd();
			},
			error: function (err) {
				util.validateSession(err);
				console.log(err);
			}
		});
	}
    /**
     * 删除方法
     * @param features [ol.feature]
     * */
	function del(features) {
		mini.confirm("确定删除？", "温馨提示",
			function (action) {
				if (action == "ok") {
					window.openAlert();
					var ids = [];
					var xian = null;
					for (var i = 0; i < features.length; i++) {
						var f = features[i];
						ids.push(f.getProperties().ID);
						xian = f.getProperties().C_XIAN;
					}
					if (ids) {
						var delFilter = {
							whereString: "ID in (" + ids.join(',') + ")"
						};

						$.ajax({
							url: "app/del.do",
							type: "POST",
							data: { data: JSON.stringify({ tableName: "ZYJG_BHTB", xian: xian, queryFilter: delFilter }) },
							success: function (res) {
								for (var i = 0; i < features.length; i++) {
									var feature = features[i];
									var layerName = feature.getProperties().C_XIAN + "_" + feature.getProperties().C_WORKYEAR;
									var layer = publicObj.getLayerByName(layerName);
									layer.getSource().removeFeature(feature);
								}
								editEnd();
							},
							error: function (err) {
								util.validateSession(err);
								console.log(err);
							}
						});
					}
				} else {
					return;
				}
			}
		);
	}
	/**
	 * 节点编辑保存
	 *
	 * @param {any} feature
	 * @returns
	 */
	function saveModifyFun(feature) {
		window.openAlert();
		var oldData = null;
		var z_wkt = new ol.format.WKT();
		var C_WKT = z_wkt.writeFeature(feature);
		var property = feature.getProperties();
		delete property.geometry;
		property.D_AREA = util.getArea(feature.getGeometry());
		property.C_OBJINFO = C_WKT;
		property.DT_EDITTIME = util.getLocalDate();
		property.I_EDITUSERID = userObj.userId;
		//判断是否自交
		var parser_ = new jsts.io.OL3Parser();
		if (!parser_.read(feature.getGeometry()).isValid()) {
			window.closeAlert();
			mini.alert("图形自相交请重新绘制", "温馨提示!");
			return;
		};
		//判断是否相交
		var isSave = isIntersection(property, feature, "modify");
		if (!isSave) {
			return;
		}
		var data = {
			addRows: null,
			updateRows: [property],
			delRows: null,
			type: "modify",
			tableName: 'ZYJG_BHTB',
			xianCode: property.C_XIAN
		}

		$.ajax({
			url: "dataService.do",
			type: "POST",
			data: { jsonStr: JSON.stringify(data) },
			success: function (res) {
				window.closeAlert();
				if (res.success) {
					if (getSelecteds().length === 1) {
						getSelecteds()[0].setGeometry(feature.getGeometry().clone());
						getSelecteds()[0].setProperties(property);
						//refresh();

						//审核地块，面积重新赋值
						if ($("[name='D_AREA']").length === 1) {
							$("[name='D_AREA']").val(util.getArea(feature.getGeometry()));
						}
					}
				} else {
					modifyTool.setActive(false);
					mini.alert("操作失败!", "失败提示")
				}
			},
			error: function (err) {
				util.validateSession(err);
			}
		});
	}
	/**
	 * 保存，编辑，删除等编辑操作结束后的处理方法；
     * 用于清空状态；
	 *
	 */
	function editEnd() {
		var tipMsg = "";
		window.closeAlert();
		switch (toolType) {
			case 'add'://
				addTool.setActive(false);
				$(".tool-cj").removeClass("selected");
				$(".tool-ht").addClass("disable");
				break;
			case 'param':
				selectTool.clear();
				modifyTool.setActive(false);
				$(".tool-xz").removeClass("selected");
				break;
			case 'del':
				selectTool.clear();
				modifyTool.setActive(false);
				$(".tool-xz").removeClass("selected");
				break;
			case 'union':
				selectTool.clear();
				$(".tool-xz").removeClass("selected");
				break;
			case 'cut':
				selectTool.clear();
				cutTool.setActive(false);
				$(".tool-fg").removeClass("selected");
				break;
			case 'burrow':
				selectTool.clear();
				burrowTool.setActive(false);
				$(".tool-wd").removeClass("selected");
				break;
			case 'trim':
				selectTool.clear();
				splitTool.setActive(false);
				$(".tool-xb").removeClass("selected");
				break;
		}
		createFeature = null;
		restore();
		refresh();
	}
	/**
	 *根据状态值设置颜色
	 * @param {ol.feature Array} features
	 * @return
	 */
	function setStyle(features) {
		var bool = false;
		try {
			for (var i = 0; i < features.length; i++) {
				var key = features[i].getProperties().C_STATUS;
				features[i].setStyle(publicObj.shStyleObj[key]);
			}
			bool = true;
		} catch (error) {

		}
		return bool;
	}
    /**
     * 清除
     */
	function clear(isAll) {
		if (isAll) {
			selectTool.clear();
		}
		addTool.setActive(false);
		createFeature = null;
		splitTool.setActive(false);
		modifyTool.setActive(false);
		cutTool.setActive(false);
		burrowTool.setActive(false);
		//清除测量
		measureMap.clear();
		// 清除缓冲图层
		map.getLayerByName("BUFFER_LAYER").getSource().clear();
		//清除查询
		map.getLayerByName("CREATE_LAYER").getSource().clear();
//		$("#popup-closer").click();
//		$(".close-btn").click();
		map.getLayerByName("HIGH_LAYER").getSource().clear();
		//清除定位
		//map.getLayerByName("ZQDW_LAYER").getSource().clear();
		//test_query临时加的
		window.istest_query = false;
		util.dispatchEvent("CLEAR");
	}
    /**
     * 还原状态值
     * */
	function restore() {
		//恢复鼠标样式
		document.getElementById("map").style.cursor = "";
		window.startTool = false;
		lastType = "";
		toolType = "";
		$("#map").removeClass("noTrack");
		$("#map").removeClass("Track");
		$("#map").removeClass("movehand");
	}
    /**
     * 刷新修改的图层
     */
	function refresh() {
		var v = map.getMap().getView();
		var c = v.getCenter();
		c[1] = c[1] + 0.00000000001;
		v.setCenter([c[0], c[1]]);
	}
	function getSelecteds() {
		return publicObj.features;
	}
	/**
	 * 判断图形是否相交
	 * property：编辑的图层信息
	 * feature：操作后的图形
	 * type:类型是新增还是节点编辑（add,modify）
	 */
	function isIntersection(property, feature, type, xy) {
		var isSave_ = true;
		if (property.C_XIAN && property.C_XIAN.trim().length != 0) {
			//获取当前保存的图层
			var layerName = property.C_XIAN + "_" + property.C_WORKYEAR;
		} else {
			var xian_Code = getNowZqCode(xy)
			var layerName = xian_Code + "_" + property.C_WORKYEAR;;
		}
		var layer = publicObj.getLayerByName(layerName);
		//获取图层中所有的feature
		var allFeature_ = layer.getSource().getFeatures();
		//定义jsts
		var parser_ = new jsts.io.OL3Parser();
		//使用jsts读取绘制图形
		var drawGraphics = parser_.read(feature.getGeometry());
		//有交集的图形临时存储
		var intersectionArr = [];
		//判断当前绘制的图斑和现有的图斑是否有交集
		for (var j = 0; j < allFeature_.length; j++) {
			var currentGraphics = parser_.read(allFeature_[j].getGeometry());
			var overlapGraphics = currentGraphics.intersection(drawGraphics);
			var spaceAttr = allFeature_[j].getProperties();
			var createuserId = "";
			var userId = userObj.userId;
			if (spaceAttr) {
				createuserId = spaceAttr.I_CREATEUSERID;
			}
			//判断是否有相交面积并且，创建人和用户不是同一人
			if (overlapGraphics.getArea() > 0 && createuserId != userId) {
				intersectionArr.push(overlapGraphics);
			}
		}
		if (intersectionArr.length > 0 && type == "add") {
			window.closeAlert();
			isSave_ = false;
			$(".close-btn").click();
			mini.alert("该图形和原有图形有相交，请重新绘制", "温馨提示");
		} else if (intersectionArr.length > 1 && type == "modify") {
			window.closeAlert();
			isSave_ = false;
			mini.alert("该图形和原有图形有相交，请重新绘制", "温馨提示");
		}
		return isSave_;
	}
	/**
	 *获取当前政区编码
	 * @param {OBJECT} xy
	 * @returns {String}
	 */
	function getNowZqCode(xy) {
		var zqCode;
		$.ajax({
			type: "GET",
			url: config.publicService + "/ws/rest/LS/address/5/" + xy.x + "/" + xy.y,
			async: false,
			dataType: "JSON",
			success: function (data) {
				zqCode = data.code;
			}
		})
		return zqCode;
	}
	/**
	 *根据经纬度获取政区名称
	 *
	 * @param {int} x
	 * @param {int} y
	 * @returns Array
	 */
	function getZqName(x, y) {
		var zqNameArr = [];
		$.ajax({
			type: "GET",
			url: config.publicService + "/ws/rest/LS/address/" + x + "/" + y,
			async: false,
			dataType: "JSON",
			success: function (data) {
				if (data) {
					zqNameArr = data.name.split(",");
				}
			}
		});
		return zqNameArr;
	}
	/**
	 *
	 *改变工具条选中的属性
	 * @param {any} newToolType
	 */
	function changeToolType(newToolType) {
		toolType = newToolType
	}
	return {
		start: start,
		clear: clear,
		popFun: popFun,
		changeToolType: changeToolType
	}
});