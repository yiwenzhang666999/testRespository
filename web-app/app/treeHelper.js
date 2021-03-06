define(function () {
	'use strict';
	var map = {}; 
	
	var TREE_CLASS = "tree_class";
	
	var defaultSetting = {
		showCheck : true,
		data : {
			id : "id",
			text : "text",
			pid : "pid",
			children : "children"
		},
		callback : {}
	}
	
	var eventsListener = {
			MORE_CLICK : [],
			ADD_CLICK : [],
			CREATE_CLICK : [],
			DEL_CLICK : [],
			CHECKED : [],
			LOADED : [],
			NODE_CLICK : []
		}
	
	var event = {
		MORE_CLICK : "MORE_CLICK",
		ADD_CLICK : "ADD_CLICK",
		CREATE_CLICK : "CREATE_CLICK",
		DEL_CLICK : "DEL_CLICK",
		CHECKED : "CHECKED",
		LOADED : "LOADED",
		NODE_CLICK : "NODE_CLICK",
	}
	
	var eventTarget = {
			BHDK : "变化地块",
			YWSJ : "业务数据"
		}
	
	/**
	 * 树元素操作API对象,包括基本的节点添加，删除，编辑，以及树的构建
	 */
	function getTree(id,setting,data){
		var tree = null;
		if(map[id]){
			tree =  map[id];
			tree.setting = combineSetting(setting);
		}else{
			tree =  new treeHelper(id,setting,data);
			map[id] = tree;
		}
		return tree;
	}
	
	
	function treeHelper(id,setting,data){
		this.setting = combineSetting(setting);
		this.treeObj = $("#"+id);
		this.__data = data ? data : [];
		this.__selectNode = null;
		this.__checkedNode = null;
		this.__checkedNodes = [];
		this.id_ = this.setting.data.id;
		this.pid_ = this.setting.data.pid;
		this.text_ = this.setting.data.text;
		this.children_ = this.setting.data.children;
		this.event = eventsListener;
		if(data && data.length > 0){
			buildTree(this,data,1,-1);
		}
	/*	var children = this.treeObj.children();
		for(var i = 0 ; i < children.length ; i++){
			var child = $(children[i]);
			if(!(child.attr("select") == "true")){
				child.find(".content").first().hide();
			}
		}*/
	}
	
	function combineSetting(setting){
		setting = setting ? setting : {};
		return $.extend(defaultSetting,setting);
	}
	
	Array.prototype.remove = function(b) { 
		var a = this.indexOf(b); 
		if (a >= 0) { 
			this.splice(a, 1); 
			return true; 
		} 
		return false; 
	}; 

	
	function getNodeHtml(tree,data){
		var text = data.text;
		var html = null;
		//buildNode属性：自定义节点html元素内容
		if(data.buildNode && typeof data.buildNode == "function"){
			html = data.buildNode(tree,data);
		}
		if(html) return $(html); 
		if(data.jb == 1){
			html = $('<li><a href="javascript:;" class="btns first">\
					<i class="ck-box"></i>\
					<input class="ck-inp" type="checkbox" />\
					<img class="icon" src="images/zs-tree-file.png" />\
					<span class="txt">'+text+'</span>\
					<div class="opa-box"></div>\
				</a></li>');
		}else{
			html = $('<li><a href="javascript:;" class="btns">\
					<i class="ck-box"></i>\
					<input class="ck-inp" type="checkbox" />\
					<img class="icon" src="images/zs-tree-file.png" />\
					<span class="txt">'+text+'</span>\
					<div class="opa-box"></div>\
				</a></li>');
		}
		if(data.iconType == 2){
			html.find("img").first().attr("src","images/zs-tree-trl.png");
		}
		if(data.disableCheck){
			html.attr("canChecked","disable");
		}else{
			html.attr("canChecked","enable");
		}
		html.attr("text",text);
		var padding = 12 + (data.jb - 1) * 20;
		html.find("a").first().css("padding","0 5px 0 "+padding+"px");
		html.attr("class",TREE_CLASS);
		return html;
	}
	
	/**
	 * type:事件类型
	 */
	function triggerClick(tree,selectNode,type,target){
		for(var e in tree.event){
			var f = tree.event[e];
			for(var i = 0 ; i < f.length ; i++){
				var eventObj = f[i];
				if(e == type && target == eventObj.eventTarget){
					if(type == event.LOADED){
						if(!eventObj.callback.called){
							eventObj.callback.called = true;
							eventObj.callback(selectNode);
						}
					}else{
						eventObj.callback(selectNode);
					}
				}
			}
		}
	}
	
	function confirmTarget(tree,curData){
		return $("[tid="+curData[tree.id_]+"]").attr("tag");
	}
	
	function parseNodeDataToHtml(tree,nodeHtml,curData){
		var t = null;
		var type = null;
		var target = null;
		target = confirmTarget(tree,curData);
		if(curData.showMore){
			t = $('<span class="more btn"></span>');
			type = event.MORE_CLICK;
			doParse(tree,nodeHtml,curData,type,target);
		}
		if(curData.showAdd){
			t = $('<span class="add btn"></span>');
			type = event.ADD_CLICK;
			doParse(tree,nodeHtml,curData,type,target);
		}
		if(curData.showCreate){
			t = $('<span class="create btn"></span>');
			type = event.CREATE_CLICK;
			doParse(tree,nodeHtml,curData,type,target);
		}
		if(curData.showDel){
			t = $('<span class="del btn"></span>');
			type = event.DEL_CLICK;
			doParse(tree,nodeHtml,curData,type,target);
		}
		
		if(curData.disableCheck){
			nodeHtml.find(".ck-box").first().css({
				border : "1px black",
			});
		}
		
		function doParse(tree,nodeHtml,curData,type,target){
			nodeHtml.find(".opa-box").append(t);
			t.unbind("click").bind("click",function(){
				triggerClick(tree,curData,type,target);
				return false;
			});
		}
		/*if(tree.setting.expand){
			treeObj.css("display","block");
		}else{
			treeObj.css("display","none");
		}*/
		
		var tmp = null;
	/*	if(tree.setting.callback.render) tmp = tree.setting.callback.render(nodeHtml,node,tree);
		nodeHtml = tmp ? tmp : nodeHtml;
		node.html = nodeHtml;*/
		nodeHtml.unbind("click").bind("click",function(){
			tree.__selectNode = curData;
			var tarList = $(this).find(".content").first();
			var ul = $(this).find("ul").first();
			var img = $(this).find("img.icon").first();
			if(img.attr("src").indexOf("zs-tree-file") >= 0){
				if(ul.css("display") == "block"){
					img.attr("src","images/zs-tree-file.png");
				}else{
					img.attr("src","images/zs-tree-file-open.png");
				}
			}
			tarList.slideToggle("fast", function(){
				$(".zs-tree-box .container").getNiceScroll().resize();
				$(".zs-nicescroll").getNiceScroll().resize();
			});
			
			tree.treeObj.children().attr("select","false");
			var tmp = $(this);
			var par = tmp.parents("li").first();
			while(par.length != 0){
				tmp = par;
				par = par.parents("li").first();
			}
			tmp.attr("select","true");
			var children = tree.treeObj.children();
			for(var i = 0 ; i < children.length ; i++){
				var child = $(children[i]);
				if(child.attr("select") == "false"){
					child.find("img.icon").first().attr("src","images/zs-tree-file.png");
					child.find(".content").first().hide("fast", function(){
						$(".zs-tree-box .container").getNiceScroll().resize();
						$(".zs-nicescroll").getNiceScroll().resize();
					});
				}
			}
			if(!curData[tree.children_] || curData[tree.children_].length == 0){
				//叶子结点可以添加NODE_CLICK事件
				triggerClick(tree,curData,event.NODE_CLICK,target);
			}
			return false;
		});
		
		var ckBox = nodeHtml.find(".ck-box");
		ckBox.unbind("click.tree").on("click.tree",function(eA){
			eA.stopPropagation();
			if(curData.disableCheck){
				return;
			}
			var tarA = $(this).parents("a");
			var flag;
			if(tarA.hasClass("selected")){
				flag = false;
				curData.checked = false;
				tree.__checkedNode = null;
				tree.__checkedNodes.remove(curData);
				tarA.removeClass("selected");
			}else{
				flag = true;
				curData.checked = true;
				tree.__checkedNode = curData;
				if(tree.__checkedNodes.indexOf(curData) < 0){
					tree.__checkedNodes.push(curData);
					//报表统计县级联动
					$("#tjzq_where [value='"+curData.xian+"']").prop("selected",true)
				}
				tarA.addClass("selected");
			}
			
			tarA.find("input[type=checkbox]").prop("checked", flag);
//			查找父节点
			checkParNode(tarA, flag);
			checkedParent(curData,flag);
			
//			查找子节点
			checkSonNode(tarA, flag);
			checkedChildren(curData,flag);
			triggerClick(tree,curData,event.CHECKED,target);
			
			$(".zs-tree-box").getNiceScroll().resize();
			
			function checkedParent(n,isCheck){
				while(n = tree.getParent(n)){
					if(n.disableCheck){
						return;
					}
					if(isCheck){
						n.checked = true;
						if(tree.__checkedNodes.indexOf(n) < 0){
							tree.__checkedNodes.push(n);
						}
					}else{
						n.checked = false;
						var flag = false;
						if(n[tree.children_] && n[tree.children_]["length"] > 0){
							var nc = n[tree.children_];
							for(var i = 0 ; i < nc.length ; i++){
								if(tree.__checkedNodes.indexOf(nc[i]) >= 0){
									flag = true;
									break;
								}
							}
						}
						if(!flag){
							tree.__checkedNodes.remove(n);
						}
					}
				}
			}

			function checkedChildren(n,isCheck){
				if(n[tree.children_] && n[tree.children_]["length"] > 0){
					for(var i = 0 ; i < n[tree.children_]["length"] ; i++){
						var tmp = n[tree.children_][i];
						if(tmp.disableCheck) continue;
						if(isCheck){
							tmp.checked = true;
							if(tree.__checkedNodes.indexOf(tmp) < 0){
								tree.__checkedNodes.push(tmp);
							}
						}else{
							tmp.checked = false;
							tree.__checkedNodes.remove(tmp);
						}
						checkedChildren(tmp,isCheck);
					}
				}
			}
		});
		
		function checkParNode(tarA, isCheck){
			var parLi = tarA.parent("li");
			var parCon = parLi.parent(".content");
			var parA = parCon.siblings(".btns");
			if(parA.parent().attr("canChecked") == "disable") return;
			var tarInp = parA.find("input[type=checkbox]");
			var nowLevalCheckedLen;
			if(parCon.length !== 0){
				nowLevalCheckedLen = parCon.children("li").children(".btns.selected").length;
			}
			if(parCon.length !== 0){
				if(isCheck === true){
					parA.addClass("selected");
					tarInp.prop("checked", true);
				}else{
					if(nowLevalCheckedLen === 0){
						parA.removeClass("selected");
						tarInp.prop("checked", false);
					}
				}
				
				checkParNode(parA, isCheck)
			}
		}
		function checkSonNode(tarA, isCheck){
			var childCon = tarA.siblings(".content");
			var childA = childCon.find(".btns");
			for(var i = 0 ; i < childA.length ; i++){
				if($(childA[i]).parent().attr("canChecked") == "disable") break;
				var childInp = childA.find("input[type=checkbox]");
				if(childCon.length === 0){
					return;
				}
				if(isCheck === true){
					childA.addClass("selected");
					childInp.prop("checked", true);
				}else{
					childA.removeClass("selected");
					childInp.prop("checked", false);
				}
			}
		}
	}
	
	function sortNodeData(tree,parentNode){
		var sortSetting = tree.setting.sort;
		if(!parentNode || !sortSetting) return;
		var children = parentNode[tree.children_];
		if(children && children.length > 0){
			var needSortChildren = [];
			var noSortChildren = [];
			for(var j = 0 ; j < children.length ; j++){
				var child = children[j];
				if(child.isAbstract == true){
					noSortChildren.push(child);
				}else{
					needSortChildren.push(child);
				}
			}
			if(needSortChildren.length == 0) return;
			var target = $("[tid="+parentNode[tree.id_]+"]").attr("tag");
			if(target){
				var rule = [];
				if(target == eventTarget.BHDK){
					if(sortSetting.BHDK){
						 rule = sortSetting.BHDK;
					}
				}else if(target == eventTarget.YWSJ){
					if(sortSetting.YWSJ){
						 rule = sortSetting.YWSJ;
					}
				}
				for(var i = 0 ; i < rule.length ; i++){
					var ruleObj = rule[i];
					if(ruleObj){
						if(children[0].jb == ruleObj.jb){
							if(ruleObj.rule && typeof ruleObj.rule == "function"){
								var sortedChildren = ruleObj.rule(tree,needSortChildren);
								if(sortedChildren && sortedChildren.length > 0){
									parentNode[tree.children_] = noSortChildren;
									for(var si = 0 ; si < sortedChildren.length ; si++){
										parentNode[tree.children_].push(sortedChildren[si]);
									}
								}
							}
						}
					}
				}
			}
		}
	}
	
	
	
	
	function addNodeHtml(tree,nodeHtml,pid,parentNode){
		var par = tree.treeObj.find("[tid="+pid+"]");
		var htmlArr = par.find("ul").first().children();
		var children = parentNode[tree.children_];
		if(htmlArr.length == 0) {
			par.find("ul").first().append(nodeHtml);
			return;
		}
		for(var i = 0 ; i < children.length ; i++){
			var child = children[i];
			var idx = -1;
			for(var j = 0 ; j < htmlArr.length ; j++){
				var html = $(htmlArr[j]);
				if(html.attr("text") == child[tree.text_]){
					idx = j;
					break;
				}
			}
			if(idx == -1 && child[tree.text_] == nodeHtml.attr("text")){
				if( i == 0){
					nodeHtml.insertBefore($(htmlArr[0]));
				}else{
					nodeHtml.insertAfter(par.find("ul").find("[tid="+children[i-1][tree.id_]+"]"));
				}
			}
		}
	}
	
	function buildNode(tree,curData,jb,pid,parentNode){
		var treeObj = tree.treeObj;
		curData.jb = jb;
		curData[tree.pid_] = pid;
		var id = curData[tree.id_];
		var text = curData[tree.text_];
		var children = curData[tree.children_];
		var nodeHtml = getNodeHtml(tree,curData);
		nodeHtml.attr("tid",id);
		if(jb == 1){
			nodeHtml.attr("tag",text);
			treeObj.append(nodeHtml);
		}else{
			var par = treeObj.find("[tid="+pid+"]");
			addNodeHtml(tree,nodeHtml,pid,parentNode);
			nodeHtml.attr("tag",par.attr("tag"));
		}
		parseNodeDataToHtml(tree,nodeHtml,curData);
		var ul = null;
		if(jb == 1){
			ul = $('<ul class="sec-list content" style="display:none"></ul>');
		}else if(jb == 2){
			ul = $('<ul class="thi-list content" style="display:none"></ul>');
		}else if(jb == 3){
			ul = $('<ul class="foru-list content" style="display:none"></ul>');
		}else if(jb == 4){
			ul = $('<ul class="five-list content" style="display:none"></ul>');
		}
		var expandLevel = tree.setting.expandLevel;
		nodeHtml.append(ul);
		if(children && children.length > 0){
			buildTree(tree,children,jb+1,id,curData);
		}
	}
	
	function buildTree(tree,data,jb,pid,parent){
		for(var i = 0 ; i < data.length ; i++){
			data[i].jb = jb;
		}
		//排序
		sortNodeData(tree,parent);
		for(var j = 0 ; j < data.length ; j++){
			buildNode(tree,data[j],jb,pid,parent);
		}
	}
	

	/**
	 * 通过树节点的id值获得节点对象
	 * @param id
	 * @returns
	 */
	treeHelper.prototype.getNodeById = function(id){
		if(!id || id <= 0) return null;
		var findNode = null;
		var that = this;
		function doFind(data){
			for(var i = 0 ; i < data.length ; i++){
				if(findNode) break;
				var tmp = data[i];
				if(tmp[that.id_] == id){
					findNode = tmp;
				}else{
					if(tmp[that.children_] && tmp[that.children_]["length"] > 0){
						doFind(tmp[that.children_]);
					}
				}
			}
		}
		doFind(that.__data);
		return findNode;
	}

	/**
	 * 添加树节点
	 * @param node
	 */
	treeHelper.prototype.addNodes = function(node){
		var parentNode = this.getNodeById(node[this.pid_]);
		if(parentNode != null){
			if(!parentNode[this.children_]) parentNode[this.children_] = [];
			parentNode[this.children_]["push"](node);
			//这里进行排序
			sortNodeData(this,parentNode);
			buildNode(this,node,parentNode.jb+1,parentNode[this.id_],parentNode);
			this.expandNode(parentNode);
		}else{
			this.__data.push(node);
			buildNode(this,node,1,-1,null);
		}
		var target = confirmTarget(this,node);
		var type = "LOADED";
		triggerClick(this,node,type,target);
	}
	
	/**
	 * 更新树节点
	 * @param node
	 * @returns
	 */
	treeHelper.prototype.updateNodes = function(node){
		var nodeHtml = $("[tid = "+node[this.id_]+"]");
		if(nodeHtml){
			nodeHtml.find(".txt").first().text(node[this.text_]);
			if(node.disableCheck){
				nodeHtml.find(".ck-box").first().css({
					border : "1px black",
					"background-color" : "gray"
				});
				nodeHtml.attr("canChecked","disable");
			}else{
				nodeHtml.find(".ck-box").first().css({
					border : "1px #f38e00 solid",
					"background-color" : "white" 
				});
				nodeHtml.attr("canChecked","enable");
			}
		}
	}
	
	/**
	 * 获得父级节点
	 * @param node
	 * @returns
	 */
	treeHelper.prototype.getParent = function(node){
		return this.getNodeById(node[this.pid_]);
	}
	
	/**
	 * 绑定事件
	 * @param target  事件目标
	 * @param eventType 事件类型
	 * @param callback 回调函数
	 */
	treeHelper.prototype.bindEvent = function(target,eventType,callback){
		for(var e in this.event){
			if(e == eventType){
				this.event[eventType]["push"]({eventTarget:target,callback:callback});
			}
		}
		if(eventType == event.LOADED){
			var node = null;
			if(target == eventTarget.BHDK){
				 node = this.getNodeById("bhdk");
			}else if(target == eventTarget.YWSJ){
				 node = this.getNodeById("ywsj")
			}
			if(node){
				triggerClick(this,node,eventType,target);
			}
		}
	}
	
	/**
	 * 绑定事件
	 * @param target  事件目标
	 * @param eventType 事件类型
	 */
/*	treeHelper.prototype.triggerEvent = function(target,eventType,data){
		triggerClick(this,data,eventType,target);
	}*/
	
	/**
	 * 获得数据结构
	 * @returns
	 */
	treeHelper.prototype.getNodes = function(){
		return this.__data;
	}
	
	/**
	 * 获得已选择的check节点
	 * @returns
	 */
	treeHelper.prototype.getCheckedNodes = function(){
		return this.__checkedNodes;
	}
	/**
	 * 获得当前选中的树节点
	 * @returns
	 */
	treeHelper.prototype.getSelectNode = function(){
		return this.__selectNode;
	}
	
	/**
	 * 获得当前选中(check)的树节点
	 * @returns
	 */
	treeHelper.prototype.getCheckedNode = function(){
		return this.__checkedNode;
	}
	
	/**
	 * 展开所有节点
	 * @returns
	 */
	treeHelper.prototype.expandAllNode = function(node){
		var tarList = this.treeObj.find(".content");
		tarList.show("fast", function(){
			$(".zs-tree-box .container").getNiceScroll().resize();
			$(".zs-nicescroll").getNiceScroll().resize();
		});
	}
	/**
	 * 展开指定节点
	 * @returns
	 */
	treeHelper.prototype.expandNode = function(node){
		var tarList = $("[tid="+node[this.id_]+"]").find(".content").first();
		tarList.show("fast", function(){
			$(".zs-tree-box .container").getNiceScroll().resize();
			$(".zs-nicescroll").getNiceScroll().resize();
		});
	}
	
	/**
	 * 收缩所有节点
	 * @returns
	 */
	treeHelper.prototype.unExpandAllNode = function(node){
		var tarList = this.treeObj.find(".content");
		tarList.hide("show", function(){
			$(".zs-tree-box .container").getNiceScroll().resize();
			$(".zs-nicescroll").getNiceScroll().resize();
		});
	}
	/**
	 * 收缩指定节点
	 * @returns
	 */
	treeHelper.prototype.unExpandNode = function(node){
		var tarList = $("[tid="+node[this.id_]+"]").find(".content").first();
		tarList.hide("fast", function(){
			$(".zs-tree-box .container").getNiceScroll().resize();
			$(".zs-nicescroll").getNiceScroll().resize();
		});
	}
	/**
	 * 根据树节点的ID删除该节点以及所有子元素
	 * @param id
	 * @returns
	 */
	treeHelper.prototype.removeNodeById = function(id){
		var node = this.getNodeById(id);
		if(node){
			return this.removeNode(node);
		}else{
			return null;
		}
	}
	
	/**
	 * 选中节点
	 * @param id
	 * @returns
	 */
	treeHelper.prototype.checkNode = function(id){
		var node = this.getNodeById(id);
		if(node){
			$("[tid="+id+"] a:first .ck-box").trigger("click");
		}
	}
	

	/**
	 * 根据node对象删除该节点以及所有子元素（注意node对象必须是树内部node）
	 * @param node
	 * @returns
	 */
	treeHelper.prototype.removeNode = function(node){
		var parent = this.getParent(node);
		if(parent){
			parent.children.remove(node);
		}else{
			this.__data.remove(node);
		}
		$("[tid="+node[this.id_]+"]").remove();
		removeSelectOrCheckedNode(node,this);
		function removeSelectOrCheckedNode(node,tree){
			var checkedNodes = tree.getCheckedNodes();
			var selectNode = tree.getSelectNode();
			var checkedNode = tree.getCheckedNode();
			for(var i = 0 ; i < checkedNodes.length; i++){
				var tmpNode = checkedNodes[i];
				if(node[tree.id_] == tmpNode[tree.id_]){
					checkedNodes.remove(tmpNode);
					break;
				}
			}
			if(selectNode && node[tree.id_] == selectNode[tree.id_]){
				tree.__selectNode = null;
			}
			
			if(checkedNode && node[tree.id_] == checkedNode[tree.id_]){
				tree.__checkedNode = null;
			}
			
			if(node.children && node.children.length > 0){
				for(var j = 0 ; j < node.children.length ; j++){
					removeSelectOrCheckedNode( node.children[j],tree)
				}
			}
		}
		return this.__data;
	}
	return {
		getTree : getTree,
		eventTarget : eventTarget,
		events : event
	};
});
