/**
 * 加载树形结构
 */
define(["treeHelper", "severZtree", 'config', 'bhdk', "report"], function (treeHelper, severZtree, config, bhdk, report) {
	'use strict';
	var thisCode;
	var provinceName; // 政区面板省名称
	var cityName; // 县名称
	var setting = { // 控制第一层展开
		expandLevel: 1,
		sort: {
			BHDK: [
				{
					jb: 2,
					rule: function (tree, arr) {
						if (arr.length > 1) {
							arr.sort(function (a, b) {
								if (!a.sort) return -1;
								if (!b.sort) return 1;
								return (a.sort.localeCompare(b.sort));
							});
						}
						return arr;
					}
				},
				{
					jb: 3,
					rule: function (tree, arr) {
						if (arr.length > 1) {
							arr.sort(function (a, b) {
								if (!a.sort) return -1;
								if (!b.sort) return 1;
								return (a.sort.localeCompare(b.sort));
							});
						}
						return arr;
					}
				},
				{
					jb: 4,
					rule: function (tree, arr) {
						if (arr.length > 1) {
							arr.sort(function (a, b) {
								if (!a.sort) return -1;
								if (!b.sort) return 1;
								return (a.sort.localeCompare(b.sort));
							});
						}

					}
				}
			]
		}
	};
	var tree = treeHelper.getTree("zyjg", setting, []);
	function init() {
		var userid = -1;
		if (userObj && userObj.userId) {
			userid = userObj.userId;
		}
		var treeHelper1 = treeHelper;
		initializationTree ();
	}
	/**
	 * 初始化树加载
	 */
	function initializationTree () {
		var where = {
			userid: userObj.userId,
			appid: window.appid_
		}
		$.ajax({
			url: "./tree/initialTree.do",
			type: "POST",
			async: false,
			data: { data: JSON.stringify({ "where": where }) },
			success: function (result) {
				var res=  result.replace(/"data"/g,"\"_data\"");
				var jsonData = JSON.parse(res);
				var tree = treeHelper.getTree("zyjg");
				tree.addNodes(jsonData[0]);
				tree.addNodes(jsonData[1]);
				$("[tid='bhdk'] a:first .ck-box").click();
			},
			error: function (msg) {

			}
		});
	}
    /**
     * 加载用户图层管理面板
     * @param  {} zqcode 政区编码
     * @param  {boolean} clearHistory  是否需要清除之前数据
     */
	function loadUserLayerManagePanel(zqcode, clearHistory) {
		//code为查询参数，不可以为空，否则后台会报错没有做异常处理
		if (zqcode == null || zqcode == "" || typeof (zqcode) == "undefined" || typeof (zqcode) == undefined) {
			return;
		}
		//将code保存，在回调中使用
		thisCode = zqcode.toString();
		if (thisCode.length == 6 && !thisCode.startsWith('2000')) {
			loadCountryUserDataOfPanel(thisCode); // 县级用户
		} else {
			$.ajax({
				type: "GET",
				url: config.publicService + "/ws/rest/LS/search/" + zqcode,
				dataType: "JSON",
				success: function (data) {
					if (clearHistory) {
						//点击a标签时需要将父级记录，以便返回
						addOrRemove(thisCode);
						//移除p，a标签
						$("#bhdk_area_zq").remove();
						$("#zq_contexts").remove();
					}
					if (data != null) {
						//初始化p标签
						var itemCode = data.item.code;
						var itemlevel = data.item.level;
						var p_item = $('<p  style="cursor:pointer;font-size:12px;"  class="title" zqcode="' + itemCode + '" id="bhdk_area_zq">' + data.item.name + ':</p>');
						p_item.on('click', function () {
							loadUserLayerManagePanel(itemCode, true); // 递归调用加载政区面板
						});
						$("#centent").append(p_item);
						var p_a = $('<p class="context" id="zq_contexts"> </p>');
						$("#centent").append(p_a);
						var zqString = "";
						zqString = '';
						//初始化a标签
						if (data.child) {
							var arr = data.child;
							if (thisCode.length == 4) {
								addSelectedClassOnContry(thisCode,arr); // 给县一级的数据添加selected属性
								cityName = data.item.name;
							} else {
								if (thisCode.length == 2) {
									provinceName = data.item.name;
								}
								for (var i = 0; i < arr.length; i++) {
									var code = arr[i].code;
									//var center = arr[i].center;
									var level = arr[i].level;
									//var shape = arr[i].shape;
									var a_xianname = $("<a  style='cursor:pointer;font-size:12px;' >" + arr[i].name + "</a>");
									(function (c, l) {
										a_xianname.on('click', function () {
											loadUserLayerManagePanel(c, true);
										});
									})(code, level)
									$("#zq_contexts").append(a_xianname);
								}
							}
						}
					}
				},
				error: function () {

				}
			});
		}
	}
    /**
     * 加载县级用户面板数据
     * @param  {} countryCode 县代码
     */
	function loadCountryUserDataOfPanel(countryCode) {
		// 在面板上只显示县
		$("#centent")[0].innerHTML = "" // 清空面板
		var name = queryNameByCode(countryCode); // 获取县的名称
		var p_item = $('<a  style="cursor: pointer; font-size: 12px; color: rgb(153, 153, 153); padding:1px 5px;"  class="title" zqcode="' + countryCode + '"  id="bhdk_area_zq">' + name + '</a>');
		p_item.on('click', function () {
			provinceName = queryNameByCode(countryCode.substring(0, 2));
			cityName = queryNameByCode(countryCode.substring(0, 4));
			var node;
			if ($(this).hasClass('xianSelected')) { // 已经添加
				$(this).removeClass('xianSelected');
				node = getTreeNode(countryCode);
				delTreeNode(node);
			} else {
				bhdk.addNewBhdk(this.innerText, countryCode, $("#bhdkYears").val(), provinceName, cityName);
				node = getTreeNode(countryCode);
				if (node) {
					$(this).addClass('xianSelected');
					this.style.color = '#999'
				}
			}
			loadTreeHasAdded(); // 增加或删除后需要重新加载已选择中的数据
		});
		$("#centent").append(p_item);
		// 初始化判断县是否已添加
		if ($("#bhdkYears").val()) {
			var callBack = {
				callback: function (res) {
					if (res.length > 0) {
						$('#bhdk_area_zq').addClass('xianSelected');
					}
				},
				exceptionHandler: function (err) {

				}
			};
			var param = {
				"selectFields": "C_XIAN,C_XIANNAME",
				"whereString": "C_XIAN = '" + thisCode + "' AND C_WORKYEAR = '" + $("#bhdkYears").val() + "' AND I_USERID = " + userObj.userId + " AND C_APPID = '" + window.appid_ + "'"
			};
			FsService.getEntityList("FS_BUSINESS_USERBUSLAYERS", param, callBack);
		} else {
			var xianNode = getTreeNode(thisCode);
			if (xianNode) {
				$('#bhdk_area_zq').addClass('xianSelected');
			}
		}
	}

    /**
     * 加载树结构中已选择的地块
     * @param  {} code 政区编码
     * @param  {} bool 是否需要清除之前数据
     */
	function loadTreeHasAdded() {
		var nodes = getTreeNodes();
		var treeData = getTreeOfProvinceCodeAndCountryNodes();
		var shengName;
		$("#loadedBhdkq").remove();
		if (nodes.length > 0) {
			$('#loadedBhdk h2').show();
			var pq = $("<div id=loadedBhdkq></div>");
			$("#loadedBhdk").append(pq);
			var provinceCodes = treeData[0].sort();
			var xianNodes = treeData[1];
			var shengNodeObj = treeData[2];
			for (var k = 0; k < provinceCodes.length; k++) {
				var shengNode = shengNodeObj[provinceCodes[k]];
				shengName = shengNode.text;
				var pa_namesheng = $("<div>" + "<span sheng='" + provinceCodes[k] + "'>" + "<i></i>" + shengName + ":</span><p class=" + shengName + ">" + "</p>" + "</div>");
				$("#loadedBhdkq").append(pa_namesheng);
				for (var j = 0; j < xianNodes.length; j++) {
					if (xianNodes[j].xian.startsWith(provinceCodes[k])) {
						var pa_namexian = $("<a" + " xiancode ='" + xianNodes[j].xian + "'>" + "<i></i>" + xianNodes[j].text + "</a>");
						pa_namexian.on('click', function () {
							var node = getTreeNode(this.getAttribute('xiancode'));
							delTreeNode(node);
							this.remove();
							removeZqSelectedClass(this.innerText);
							loadTreeHasAdded();
						});
						$("." + shengName).append(pa_namexian);
					}
				}
			}
			delProvinceData();
		} else {
			$('#loadedBhdk h2').hide();
		}
	}

    /**
     * 获取树节点的的省名称与县名称
     */
	function getTreeOfProvinceCodeAndCountryNodes() {
		var nodes = getTreeNodes();
		var treeData = [];
		var provinceCodes = []; // 省级政区代码
		var xianNodes = [];
		var shengNodeObj = {};//省一级数据的对象
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].jb == 2) {
				provinceCodes.push(nodes[i].sort);
				shengNodeObj[nodes[i].sort] = nodes[i];
				if (nodes[i].children.length > 0) {
					for (var j = 0; j < nodes[i].children.length; j++) {
						xianNodes.push(nodes[i].children[j]);
					}

				}
			}
		}
		treeData.push(provinceCodes);
		treeData.push(xianNodes);
		treeData.push(shengNodeObj);
		return treeData;
	}

    /**
     * 获取变化地块树节点数据数据
     * @param  {} xianName 县名称
     */
	function getTreeNodes() {
		var tree = treeHelper.getTree("zyjg");
		var nodes = tree.getNodes()[0].children;
		return nodes;
	}
    /**
     * 删除省数据
     */
	function delProvinceData() {
		$('#loadedBhdkq div span').click(function (e) { // 点击省的删除方法
			var xianNode;
			var a = $(this).parent().find('a');
			this.remove();
			var tree = treeHelper.getTree("zyjg");
			var where = {
				sheng: this.getAttribute('sheng'),
				userid: userObj.userId,
				appid: window.appid_
			}
			$.ajax({
				url: "bhdk/delProvincedatas.do",
				type: "POST",
				async: false,
				data: { data: JSON.stringify({ "where": where }) },
				success: function (result) {
					//删除树节点
					for (var j = 0; j < a.length; j++) {
						a[j].remove();
						removeZqSelectedClass($(a[j])[0].innerText);
						xianNode = getTreeNode(a[j].getAttribute('xiancode'));
						tree.removeNodeById(xianNode.id);
						//01.22 删除变化图斑，对于统计报表地方的争取范围进行同步更新
						report.createZqList();
						for (var i = 0; i < tree.__data.length; i++) {
							if (xianNode.id.indexOf(tree.__data[i].id) > -1) {
								bhdk.getChildrenNode(tree.__data[i], xianNode.pid);
							}
						}
					}
					loadTreeHasAdded();
				},
				error: function (msg) {

				}
			});
		});
	}
    /**
     * 移除政区面板中选中的县的状态
     * @param  {} xianName 县名称
     */
	function removeZqSelectedClass(xianName) {
		if (userObj.zqCode.length == 6 && !userObj.zqCode.startsWith('2000')) {
			$('#bhdk_area_zq').removeClass('xianSelected');
		}
		var $a = $("#zq_contexts a");
		for (var i = 0; i < $a.length; i++) {
			if (xianName == $a[i].innerText) {
				$($a[i]).removeClass('xianSelected');
			}
		}
	}
    /**
     * 加载变化地块政区面板中年度选项
     */
	function getYear() {
		// 获取年度下拉框选项
		$.ajax({
			url: "bhdk/getYear.do",
			type: "post",
			dataType: "JSON",
			async: false,
			success: function (year) {
				if (typeof year == "number") {
					for (var i = (year - 1); i < (year + 5); i++) {
						$("#bhdkYears").append("<option>" + i + "</option>");
					}
					$('#bhdkYears').change(function () { // 年度选项增加单击事件，重新刷新政区面板
						loadUserLayerManagePanel(thisCode, true);
					});
				} else {

				}
			},
			error: function () {

			}
		})
	}
    /**
     * 添加移除元素
     * @param  {} code 政区编码
     */
	function addOrRemove(code) {
		//如果br_length=0说明没有有br元素
		var br_length = $('#clickHistorys w').length;
		if (br_length == 0) {
			//将父级保存为第一个父级元素
			var ys = $("#bhdk_area_zq");
			var itemCode = ys.attr("zqcode");
			var value = $("#bhdk_area_zq")[0].innerText;
			var arr = value.split(":");
			var valueStr = arr[0];
			var p_item = $('<w  style="cursor:pointer;font-size:12px;color:#3d9b00"  class="title position" level="1" zqcode="' + itemCode + '"' + 'id="' + itemCode + '_zqcode">' + valueStr + '&nbsp;&nbsp;</w>');
			p_item.on('click', function () {
				loadUserLayerManagePanel(itemCode, true);
			});
			$("#clickHistorys").append(p_item);
		} else {
			//否则有br元素
			isNotBr(br_length, code);
		}
	}

    /**
     * 已经有br元素，说明已经有历史记录，在添加历史记录时需要注意移除之前的br
     * @param  {} br_length 
     * @param  {} code 政区编码
     */
	function isNotBr(br_length, code) {
		var thisP = $("#" + code + "_zqcode");
		if (thisP.length > 0) {
			thisP.nextAll().remove();
			$("#" + code + "_zqcode").remove();
			var length = $('#clickHistorys w').length;
		}
		else {
			//重新添加历史记录
			var ys = $("#bhdk_area_zq");
			var itemCode = ys.attr("zqcode");
			if (document.getElementById(itemCode + "_zqcode")) {
				$("#" + itemCode + "_zqcode").remove();
			}
			var value = $("#bhdk_area_zq")[0].innerText;
			var arr = value.split(":");
			var valueStr = arr[0];
			var p_item = $('<w  style="cursor:pointer;font-size:12px;color: #3d9b00;"  class="title" level="' + (br_length + 1) + '" zqcode="' + itemCode + '"' + 'id="' + itemCode + '_zqcode">' + '<span class="arr" style="display: inline-block;margin: 0px 5px 5px 0;font-size: 12px;color: #3d9b00;">&gt;</span>' + valueStr + '&nbsp;&nbsp;</w>');
			p_item.on('click', function () {
				loadUserLayerManagePanel(itemCode, true);
			});
			$("#clickHistorys").append(p_item);
		}

	}
    /**
     * 给县一级的数据添加selected属性
     * @param  {} zqcode 政区代码
     * @param xianDatas 市下的所有县
     */
	function addSelectedClassOnContry(zqcode,xianDatas) {
		var a_xianname; // 县名称的a标签
    	var callBack = {
    			callback:function(res){
    					var xianCode;
    					for (var i = 0; i < xianDatas.length; i++) {
    						if (res&&res.length>0) {
    							for (var j = 0; j < res.length; j++) {
            						xianCode = res[j].originalObjects.C_XIAN
            						if (xianCode == xianDatas[i].code) {
            							a_xianname = $("<a  style='cursor:pointer;font-size:12px;' class ='xianSelected'>"+xianDatas[i].name+"</a>");
            							break;
            						} else {
            							a_xianname = $("<a  style='cursor:pointer;font-size:12px;' >"+xianDatas[i].name+"</a>");
            						}
            					}
    						} else {
    							a_xianname = $("<a  style='cursor:pointer;font-size:12px;' >"+xianDatas[i].name+"</a>");
    						}
    						var code = xianDatas[i].code;
	        				var level =xianDatas[i].level;
	        				(function(c,l){
	        					a_xianname.on('click',function(){
	        						var node;
	        						if (this.className == "xianSelected") { // 已经添加
	        							$(this).removeClass('xianSelected');
	        							node = getTreeNode(c);
	        							delTreeNode (node);
	        						} else {
	        							provinceName = queryNameByCode(thisCode.substring(0,2));
	        							bhdk.addNewBhdk(this.innerText, c, $("#bhdkYears").val(),provinceName,cityName);
	        							node = getTreeNode(c);
	        							if (node) {
	        								$(this).addClass('xianSelected');
	        							}
	        						}
	        						loadTreeHasAdded ();
	        					});
	        				})(code,level)
	        				$("#zq_contexts").append(a_xianname);
    						
						}
    			},
    			exceptionHandler:function(err){
    				
    			}
    	};
    	var param = {
    			"selectFields": "C_XIAN,C_XIANNAME",
    			"whereString": "C_XIAN  LIKE '" + zqcode + "%' AND C_WORKYEAR = '" + $("#bhdkYears").val() + "' AND I_USERID = " + userObj.userId + " AND C_APPID = '" + window.appid_ + "'"
    		};
    	FsService.getEntityList("FS_BUSINESS_USERBUSLAYERS", param, callBack);
	}
    /**
     * 根据政区code获取树上某个节点
     * @param  {} code 政区编码
     */
	function getTreeNode(code) {
		var node = '';
		var tree = treeHelper.getTree("zyjg");
		var nodes = tree.getNodes()[0].children;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].children.length > 0) {
				for (var j = 0; j < nodes[i].children.length; j++) {
					if (code == nodes[i].children[j].xian) {
						node = nodes[i].children[j]
						break;
					}
				}
			}
		}
		return node;
	}
    /**
     * 根据政区code删除树上某个节点
     * @param  {} node 树节点
     */
	function delTreeNode(node) {
		var nd = "";
		if (node) {
			for (var i = 0; i < node.children.length; i++) {
				nd += node.children[i]["_data"]["nd"] + "','";
			}
			nd = nd.substring(0, nd.length - 3);
			var where = {
				id: node.pid.replace("bhdk", ""),
				xian: node["_data"]["xian"],
				nd: nd,
				userid: userObj.userId,
				appid: window.appid_
			}
			bhdk.del(where, node.id, node.pid);
		}
	}
	 /**
     * 根据code查询省name
     * @param  {} code 政区代码
     */
	function queryNameByCode(code) {
		var name = "";
		$.ajax({
			type: "GET",
			url: config.publicService + "/ws/rest/LS/search/" + code,
			dataType: "JSON",
			async: false,
			success: function (res) {
				if (res != null) {
					name = res.item.name;
				}
			},
			error: function (msg) {

			}
		});
		return name;
	}
	return {
		init: init,
		getYear: getYear,
		loadUserLayerManagePanel: loadUserLayerManagePanel,
		loadTreeHasAdded: loadTreeHasAdded
	}
});