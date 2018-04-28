/**
 * 左侧变化地块组，工具；
 * 
 * */

define([
    "treeHelper","config","report","util"
], function (treeHelper,config,report,util) {
    'use strict';
    /**
	 * 查询
	 * */
    var datas=[];
    var xian_code=null;
    var treeObj = $("#zyjg_bhdk");
    var userid="-1";//默认为-1
    function initSearch(){
    	if(userObj&&userObj.userId){
    		userid=userObj.userId;
    	}
    	var tree=treeHelper.getTree("zyjg");
    	var i=0;
    	tree.bindEvent(treeHelper.eventTarget.BHDK,treeHelper.events.MORE_CLICK,function(node){
    		$(".more",$('[tid='+node.id+']')).modal({
    			title: "变化地块图层管理",
    			overlay: false,
    			showMin: false,
    			showMax: false,
    			showTop: false,
    			isDrag: true,
    			contentWidth: 'auto',
    			fullScreenId:"map_continer",
    			type:"ajax",
    			target: "./ibox/zyjg/bhdk/_tjdkbhsj.html"
    		});
    		if(i++!=0){
    			return;
    		}else{
    			$(".more",$('[tid='+node.id+']')).click();
    		}
        });
    	tree.bindEvent(treeHelper.eventTarget.BHDK,treeHelper.events.DEL_CLICK,function(node){
    		if(node.children){
    			var nd="";
    			for(var i=0;i<node.children.length;i++){
    				nd+=node.children[i]["_data"]["nd"]+"','";
    			}
    			nd=nd.substring(0,nd.length-3);
    			var where ={
    					id:node.pid.replace("bhdk",""), 
    					xian:node["_data"]["xian"],
    					nd:nd,
    					userid:userid,
    					appid:window.appid_
    			}
            	del(where,node.id,node.pid);
    		}
        });
    }
    function cancel(){
    	$("#xianName").val("");
    	document.getElementById("bhdk_item").innerHTML = "";
    }
	function funclick(){
		$("input[name='add']").unbind("click").on("click",add_create);
		$("input[name='create']").unbind("click").on("click",add_create);
	}
    function search(){
	    	var xianName=$("#xianName").val();
	    	var style="background: rgb(238, 238, 238); color: rgb(136, 136, 136); border: 1px solid rgb(170, 170, 170);"
	    	$.ajax({  
		        type:"GET",  
		        url:config.publicService+"/ws/rest/LS/analyze/"+xianName, 
		        dataType:"JSON", 
		        async:false ,
		        success:function(data){
		        	document.getElementById("bhdk_item").innerHTML = "";
	    			datas=[];
		        	if(data.length>0){
		        		for(var i=0;i<3;i++){
				        	var htmlStr = "";
		        			htmlStr+="<p class='line'><span class='name'>"+data[i].fullName+"</span>";
		        			htmlStr+="<span class='opa'><input type='button' id='yl"+i+"' class='zs-btn reset' value='预览' disabled='disabled' style='"+style+"'/>";
		        			//根据省code判断来判断是否已经创建过，控制按钮创建/添加可用不可用, 获取需要添加年度判断
		        			//根据县code和用户id判断来判断是否已经添加过变化地块，控制按钮添加可用不可用
		        			var where ={
		        					xian:data[i].location.code,
		        					appid:window.appid_,
		        					tableid:'1',
		        					nd:$("#bhdkNd").val()
		        			}
		        			var flag=getDatareg(JSON.stringify(where));//表1
		        			where["userid"]=userid;
		        			where["tableid"]='2';
		        			var flag2=getDatareg(where);//表2
//		        			htmlStr+="<input type='button' id='add"+i+"' name='add' data='"+i+"' class='zs-btn reset' value='添加' />";
//		        			htmlStr+="<input type='button' id='create"+i+"' name='create' data='"+i+"' class='zs-btn reset' value='添加'/></span></p>";
			        		if(flag && !flag2){//表1有值，表2没值,创建按钮不可用，添加按钮可用
			        			htmlStr+="<input type='button' id='add"+i+"' name='add' data='"+i+"' class='zs-btn reset' value='添加' />";
			        			$("#bhdk_item").append(htmlStr);
//				        		$("#create"+i).attr("disabled","disabled");
//				        		$("#create"+i)[0].style.cssText = style;
		        			}
		        			if(flag && flag2){//两者都有值，两个按钮都隐藏
//				        		$("#add"+i).attr("disabled","disabled");
//				        		$("#add"+i)[0].style.cssText = style;
		        				htmlStr+="<input type='button' id='create"+i+"' name='create' data='"+i+"' class='zs-btn reset' value='添加'/></span></p>";
			        			$("#bhdk_item").append(htmlStr);
		        				$("#create"+i).attr("disabled","disabled");
				        		$("#create"+i)[0].style.cssText = style;
		        			}
		        			if(!flag){//表1没有值，两个按钮都可用
		        				htmlStr+="<input type='button' id='create"+i+"' name='create' data='"+i+"' class='zs-btn reset' value='添加'/></span></p>";
				        		$("#bhdk_item").append(htmlStr);
//		        				$("#add"+i).attr("disabled","disabled");
//				        		$("#add"+i)[0].style.cssText = style;
		        			}
	        			}
		        		datas=data;
		        		funclick();//绑定事件
		    		}
		        },
				error : function(msg){
					console.log(msg);
				}
		    });
    }
 
    /**
     * 添加变化地块
     * @param  {} xianName 县名称
     * @param  {} xiancode 县代码
     * @param  {} nd 年度
     * @param  {} shengName 省名称
     * @param  {} shiName 市名称
     */
   function addNewBhdk(xianName,xiancode,nd,shengName,shiName){
        var code=xiancode;
		//根据省code判断来判断是否已经创建过，控制按钮创建/添加可用不可用, 获取需要添加年度判断
		//根据县code和用户id判断来判断是否已经添加过变化地块，控制按钮添加可用不可用
		var where ={
				xian:code,
				appid:window.appid_,
				tableid:'1',
				nd:nd
		}
		var flag=getDatareg(JSON.stringify(where));//表1
		where["userid"]=userid;
		where["tableid"]='2';
		var flag2=getDatareg(where);//表2
		var url="";
		if(flag && !flag2){//表1有值，表2没值,创建按钮不可用，添加按钮可用
			url="bhdk/add.do";
		}
		if(flag && flag2){//两者都有值，两个按钮都隐藏
			mini.alert("当前变化图斑已存在！","温馨提示");
			closeAlert();
		}
		if(!flag){//表1没有值，两个按钮都可用
			url="bhdk/create.do";
		}
		if(url!=""){
			add_new_create(xianName,xiancode,shengName,shiName,url,nd);
		}
    }
	/**
	 * 判断按钮可用不
	 */
	function getDatareg(where){
		var flag=false;
		$.ajax({
			url:"bhdk/getData.do",
			type:"POST",
			async:false,
			data:{data:JSON.stringify({"where":where})},
			success:function(result){
				if(result=="true"){
					flag=true;
				}
			},
			error : function(msg){
				util.validateSession(err);
			}
		});
		return flag;
	}
	/**
     * 添加
     * @param  {} xianName 县名称
     * @param  {} xiancode 县代码
     * @param  {} nd 年度
     * @param  {} shiName 市名称
     * @param  {} url 请求地址
     * @param  {} nd 年度
     */
	function add_new_create(xianName,xiancode,shengName,shiName,url,nd){
		if(!url){
			var that=$(this);
			var url="";
			if(that.attr("id").indexOf("add")>-1){
				url="bhdk/add.do";
			}else if(that.attr("id").indexOf("create")>-1){
				url="bhdk/create.do";
			}
			//按钮样式
			that.removeClass();
			that.addClass("zs-btn");
			data=datas[that.attr("data")];
		}
		
		var sheng=xiancode.substring(0,2);
		var xian=xiancode;
		var Xname=xianName;
		var fullName=shengName + shiName + xianName;
		if(!nd){
			nd=$("#bhdkNd").val();
		}
		xian_code=xian;
		var jsonData={
			"sheng":sheng,
			"shengName":shengName,
			"xian":xian,
			"Xname":Xname,
			"fullName":fullName,
			"nd":nd,
			"userid":userid,
			"appid":window.appid_
		}
		$.ajax({
			url:url,
			type:"POST",
			async:false,
			data:{data:JSON.stringify(jsonData)},
			success:function(result){
				if(result){
					//模拟触发下查询事件
					$("#xianName").trigger("keypress");
					var tree=treeHelper.getTree("zyjg");
					var node =JSON.parse(result);
					tree.addNodes(node);
					//添加节点后，自动选中
					$("[tid='"+node.id+"'] i:first").click();
					//01.22 添加变化图斑，对于统计报表地方的争取范围进行同步更新
					if($(".tool-tj").hasClass("selected")){
						report.createZqList();
					}
					
				}
				closeAlert();
			},
			error : function(msg){
				mini.alert("添加失败！","失败提示");
				closeAlert();
				util.validateSession(err);
			}
		});
		
	}
	
	
    function getChildrenNode(node,node_id){
		if(node.id==node_id&&(!node.children||node.children.length==0)){
	    	var tree=treeHelper.getTree("zyjg");
			tree.removeNodeById(node.id);
		}else if(node.children){
			for(var i=0;i<node.children.length;i++){
        		getChildrenNode(node.children[i],node_id);
        	}
		}
    }
	//删除
	function del(where,node_id,node_pid){
		$.ajax({
			url:"bhdk/delTdata.do",
			type:"POST",
			async:false,
			data:{data:JSON.stringify({"where":where})},
			success:function(result){
				//删除树节点
				var tree=treeHelper.getTree("zyjg");
				tree.removeNodeById(node_id);
				//01.22 添加变化图斑，对于统计报表地方的争取范围进行同步更新
				if($(".tool-tj").hasClass("selected")){
					report.createZqList();
				}
				for(var i=0;i<tree.__data.length;i++){
					if(node_id.indexOf(tree.__data[i].id)>-1){
						getChildrenNode(tree.__data[i],node_pid);
					}
				}
			},
			error : function(msg){
				util.validateSession(err);
			}
		});
	}
	
	 //根据code查询省name
    function queryShengName(code){
    	var shengName="";
    	$.ajax({  
	        type:"GET",  
	        url:config.publicService+"/ws/rest/LS/search/"+code, 
	        dataType:"JSON",  
	        async:false,
	        success:function(res){
	        	if(res !=null){
	        		shengName = res.item.name;
	        	}
	        },
			error : function(msg){
				util.validateSession(err);
			}
	    });
    	return shengName;
    }
    //获取树data
    function getTreeData(tableName, where){
		var datas = [];
		$.ajax({
			url:"bhdk/getTData.do",
			type:"POST",
			async:false,
			data:{data:JSON.stringify({"where":where,"tableName":tableName})},
			success:function(result){
				datas=result;
			},
			error : function(msg){
				util.validateSession(err);
			}
		});
        return datas;
	}
    
    /**
     * 添加变化地块
     * xianName:县name
     * xiancode:县code
     * nd:图斑年度
     */
    function addBhdk(xianName,xiancode,nd){
    	var style="background: rgb(238, 238, 238); color: rgb(136, 136, 136); border: 1px solid rgb(170, 170, 170);"
    	$.ajax({
	        type:"GET",  
	        url:config.publicService+"/ws/rest/LS/analyze/"+xianName, 
	        dataType:"JSON", 
	        async:false ,
	        success:function(data){
	        	openAlert();
	        	if(data.length>0){
	        		var f=true;
		        	for(var i=0;i<data.length;i++){
		        		var code=data[i].location.code;
		        		if(xiancode==code){
		        			f=false;
			    			//根据省code判断来判断是否已经创建过，控制按钮创建/添加可用不可用, 获取需要添加年度判断
			    			//根据县code和用户id判断来判断是否已经添加过变化地块，控制按钮添加可用不可用
			    			var where ={
			    					xian:data[i].location.code,
			    					appid:window.appid_,
			    					tableid:'1',
			    					nd:nd
			    			}
			    			var flag=getDatareg(JSON.stringify(where));//表1
			    			where["userid"]=userid;
			    			where["tableid"]='2';
			    			var flag2=getDatareg(where);//表2
			    			var url="";
			        		if(flag && !flag2){//表1有值，表2没值,创建按钮不可用，添加按钮可用
			        			url="bhdk/add.do";
		        			}
		        			if(flag && flag2){//两者都有值，两个按钮都隐藏
		        				mini.alert("当前变化图斑已存在！","温馨提示");
		        				closeAlert();
		        			}
		        			if(!flag){//表1没有值，两个按钮都可用
		        				url="bhdk/create.do";
		        			}
		        			if(url!=""){
		        				add_create(data[i],url,nd);
		        			}
		        		}
		        	}
		        	if(f){//当参数县code与县名称不对应时。
		        		mini.alert("添加失败！","失败提示");
		        		closeAlert();
		        	}
	        	}else{
	        		mini.alert("添加失败！","失败提示");
					closeAlert();
	        	}
	        },
			error : function(msg){
				mini.alert("添加失败！","失败提示");
				closeAlert();
				util.validateSession(err);
			}
	    });
    }

	/**
	 * 添加
	 * **/
	function add_create(data,url,nd){
		if(!url){
			var that=$(this);
			var url="";
			if(that.attr("id").indexOf("add")>-1){
				url="bhdk/add.do";
			}else if(that.attr("id").indexOf("create")>-1){
				url="bhdk/create.do";
			}
			//按钮样式
			that.removeClass();
			that.addClass("zs-btn");
			data=datas[that.attr("data")];
		}
		if(data){
			var sheng=data.location.code.substring(0,2);
			var xian=data.location.code;
			var Xname=data.location.name;
			var fullName=data.fullName;
			if(!nd){
				nd=$("#bhdkNd").val();
			}
			var shengName=queryShengName(sheng);
			xian_code=xian;
			var jsonData={
				"sheng":sheng,
				"shengName":shengName,
				"xian":xian,
				"Xname":Xname,
				"fullName":fullName,
				"nd":nd,
				"userid":userid,
				"appid":window.appid_
			}
			$.ajax({
				url:url,
				type:"POST",
				async:false,
				data:{data:JSON.stringify(jsonData)},
				success:function(result){
					if(result){
						//模拟触发下查询事件
						$("#xianName").trigger("keypress");
						var tree=treeHelper.getTree("zyjg");
						var node =JSON.parse(result);
//						var pNode=tree.getParent(node.children[0]);
//						if(pNode){
//							console.log(pNode);
//						}
						tree.addNodes(node);
						//添加节点后，自动选中
						$("[tid='"+node.id+"'] i:first").click();
						//添加节点成功后，自动关闭弹出窗
//						$(".close-btn.ope-btn.iconfont.icon-zsicon-close").click();
						//01.22 添加变化图斑，对于统计报表地方的争取范围进行同步更新
						if($(".tool-tj").hasClass("selected")){
							report.createZqList();
						}
					}
					closeAlert();
				},
				error : function(msg){
					mini.alert("添加失败！","失败提示");
					closeAlert();
					util.validateSession(err);
				}
			});
		}
	}
	return {
		init:initSearch,
		search:search,
		del: del,
		addBhdk:addBhdk,
		addNewBhdk:addNewBhdk,
		getChildrenNode:getChildrenNode,
	}
});