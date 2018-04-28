define(function() {
	'use strict';
	var exitFullScreen = true;
	//当前纸张,默认A4纸
	var zz="A4";
	var zzsize={
		"A0":"841*1189",
		"A1":"594*841",
		"A2":"420*594",
		"A3":"297*420",
		"A4":"210*297",
		"A5":"148*210",
	}
	var divsize={
		"A3":{"width":1587,"height":1122},
		"A4":{"width":1122,"height":793},
		"A5":{"width":793,"height":559},
	}
	var pos={
		"scale": {
	        "jz": 57,
	        "js": 727,
	        "tpkd": 96,
	        "tpgd": 48,
	        "type": "scale",
	        "text": "",
	        "unique":"true",//判断是否为唯一元素
		},
		"compass": {
	        "jz": 976,
	        "js": 120,
	        "tpkd": 96,
	        "tpgd": 96,
	        "type": "img",
	        "unique":"true",//判断是否为唯一元素
	        "url": "images/print/compass.png"
		},
		"tili": {
			"jz": 937,
        	"js": 573,
	        "padding-lr":12,
	    	"padding-tb":8,
	    	"color-width":50,
	    	"color-height":20,
	        "tpkd": 140,
	        "tpgd": 160,
	        "type": "img",
	        "unique":"true",//判断是否为唯一元素
	        "url":"",
	        "tili":{"tili1":{
	        	"color":"#FFB299",
	        	"text":"Pleiades",
	        	"dqys":"tili1",
	        	"px":1,
	        },"tili2":{
	        	"color":"#FFE57F",
	        	"text":"GF2",
	        	"dqys":"tili2",
	        	"px":2,
	        },"tili3":{
	        	"color":"#B2FF99",
	        	"text":"WorldView",
	        	"dqys":"tili3",
	        	"px":3,
	        },"tili4":{
	        	"color":"#FFE57F",
	        	"text":"GF1",
	        	"dqys":"tili4",
	        	"px":4,
	        },"tili5":{
	        	"color":"#FFB2E5",
	        	"text":"ZY102C",
	        	"dqys":"tili5",
	        	"px":5,
//	        },"tili6":{
//	        	"color":"#B2FFCC",
//	        	"text":"ZY3",
//	        	"dqys":"tili6",
//	        	"px":6,
//	        },"tili7":{
//	        	"color":"#B2FFFF",
//	        	"text":"BJ2",
//	        	"dqys":"tili7",
//	        	"px":7,
//	        },"tili8":{
//	        	"color":"#FFCCE5",
//	        	"text":"TM",
//	        	"dqys":"tili8",
//	        	"px":8,
//	        },"tili9":{
//	        	"color":"#7FCCFF",
//	        	"text":"GF16",
//	        	"dqys":"tili9",
//	        	"px":9,
	        },length:5}
	    },
	    "title": {
	        "jz": 500,
	        "js": 20,
	        "tpkd": 80,
	        "tpgd": 26,
	        "font-size":"20",
	        "type": "text",
	        "text": "打印地图",
	        "unique":"true",//判断是否为唯一元素
	        "textcolor": "000000",
	        "zt": "Adobe Ming Std",
	        "url": ""
	    },
	    "text":{
	        "jz": 485,
	        "js": 200,
	        "tpkd": 80,
	        "tpgd": 26,
	        "font-size":"20",
	        "type": "text",
	        "text": "文字",
	        "textcolor": "000000",
	        "zt": "Adobe Ming Std",
	        "url": ""
	    },
	    "picture":{
	        "jz": 0,
	        "js": 450,
	        "tpkd": 48,
	        "tpgd": 48,
	        "type": "img",
	        "url": "images/print/compass.png"
	    }
	};
	var mapLods = [
       	{"level" : 0,"resolution" : 1.40625,"scale" : 590995186.11750006}, 
       	{"level" : 1,"resolution" : 0.703125,"scale" : 295497593.05875003},
       	{"level" : 2,"resolution" : 0.3515625,"scale" : 147748796.52937502}, 
       	{"level" : 3,"resolution" : 0.17578125,"scale" : 73874398.264687508}, 
       	{"level" : 4,"resolution" : 0.087890625,"scale" : 36937199.132343754}, 
       	{"level" : 5,"resolution" : 0.0439453125,"scale" : 18468599.566171877},
       	{"level" : 6,"resolution" : 0.02197265625,"scale" : 9234299.7830859385}, 
       	{"level" : 7,"resolution" : 0.010986328125,"scale" : 4617149.8915429693},
       	{"level" : 8,"resolution" : 0.0054931640625,"scale" : 2308574.9457714846}, 
       	{"level" : 9,"resolution" : 0.00274658203125,"scale" : 1154287.4728857423},
       	{"level" : 10,"resolution" : 0.001373291015625,"scale" : 577143.73644287116}, 
       	{"level" : 11,"resolution" : 0.0006866455078125,"scale" : 288571.86822143558},
       	{"level" : 12,"resolution" : 0.00034332275390625,"scale" : 144285.93411071779}, 
       	{"level" : 13,"resolution" : 0.000171661376953125,"scale" : 72142.967055358895},
       	{"level" : 14,"resolution" : 0.0000858306884765625,"scale" : 36071.483527679447},
       	{"level" : 15,"resolution" : 0.0000429153442382812,"scale" : 18035.741763839724},
       	{"level" : 16,"resolution" : 0.0000214576721191406,"scale" : 9017.8708819198619},
       	{"level" : 17,"resolution" : 0.0000107288360595703,"scale" : 4508.9354409599309},
       	{"level" : 18,"resolution" : 5.36441802978515E-06,"scale" : 2254.4677204799655}
	];
//	tree 添加事件
	function activeTree(){
		var treeBox = $(".zs-tree-box");
		var closeBtn = treeBox.find(".header .close");
		var btns = $(".zs-tree .btns").not(".disable");
		var ckBox = $(".zs-tree .ck-box");
//		树的最小化/还原
		closeBtn.unbind("click.tree").on("click.tree",function(event){
			event.stopPropagation();
			var tarTree = $(this).parents(".zs-tree-box");
			tarTree.toggleClass("on-min");
			resetScroll();
			$(".zs-tree-box .card").hide();
			treeBox.find(".opa-box .more").removeClass("on");
		});
		treeBox.not(".zyjg").find(".header .close").click();
//		展开/收缩列表
		btns.unbind("click.tree").on("click.tree",function(event){
			event.stopPropagation();
			$(".zs-tree").children().attr("select","false");
			var tmp = $(this);
			var par = tmp.parents("li").first();
			while(par.length != 0){
				tmp = par;
				par = par.parents("li").first();
			}
			if(tmp.parent().hasClass("treeHelper")){
				if(tmp.parent().hasClass("treeHelper")){
					var ul = $(this).parent().find("ul").first();
					var img = $(this).parent().find("img.icon").first();
					if(img.attr("src").indexOf("zs-tree-file") >= 0){
						if(ul.css("display") == "block"){
							img.attr("src","images/zs-tree-file.png");
						}else{
							img.attr("src","images/zs-tree-file-open.png");
						}
					}
				}
				tmp.attr("select","true");
				var children = $(".zs-tree").children();
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
				
			}
			var tarList = $(this).siblings(".content");
			tarList.slideToggle("fast", resetScroll);
//			resetScroll();
		});
//		默认打开第一个
//		$(".zs-tree").each(function(){
//			$(this).find(".btns.first").eq(0).click();
//			$(this).find(".btns.second").eq(0).click();
//		});
//		checkbox勾选
		ckBox.unbind("click.tree").on("click.tree",function(event){
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
//			查找父节点
			checkParNode(tarA, flag);
//			查找子节点
			checkSonNode(tarA, flag);
			$(".zs-tree-box").getNiceScroll().resize();
		});
		function resetScroll(){
			$(".zs-tree-box .container").getNiceScroll().resize();
			$(".zs-nicescroll").getNiceScroll().resize();
		}
		function checkParNode(tarA, isCheck){
			var parLi = tarA.parent("li");
			var parCon = parLi.parent(".content");
			var parA = parCon.siblings(".btns");
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
			require(["severZtree"], function (severZtree) {
				childA.find(".data").each(function(e){
					severZtree.getData(this);
				})
			});
		}
		var legend = treeBox.find(".legend");
//		2017/12/22 修改top值计算 及 触发 显示图例的类名
		treeBox.find(".showLegend").mouseover(function(){
			var max = treeBox.height() - legend.outerHeight();
			console.log(max);
			var top = $(this).offset().top - treeBox.offset().top;
			if(top >= max){
				top = max;
			}
			legend.show().css("top",top+"px");
		}).mouseout(function(){
			legend.hide();
		});
		//	2017/12/22 新增
		$(".zs-tree .opa-box").click(function(e){
			e.stopPropagation();
		});
		var moreBtn = treeBox.find(".opa-box .more");
		moreBtn.click(function(e){
			e.stopPropagation();
			var card = $(".zs-tree-box .card");
			if($(this).hasClass("on")){
				card.hide();
				$(this).removeClass("on");
			}else{
				card.hide();
				moreBtn.removeClass("on");
				$(this).addClass("on");
				var type = $(this).attr("data-card");
				var targetCard = $(".zs-tree-box .card." + type);
				var max = treeBox.height() - targetCard.outerHeight();
				var top = $(this).offset().top - treeBox.offset().top;
				if(top >= max){
					top = max;
				}
				targetCard.show().css("top", top + "px");
			}
		});
//		空间位置
//		切换内容
		var btns = treeBox.find(".opa-box.kjwz .btn");
		var contents = treeBox.find(".kjwz-content .item");
		btns.click(function(e){
			contents.hide();
			var content = $(this).attr("data-content");
			var tarCon = treeBox.find(".kjwz-content .item." + content);
			tarCon.show();
			$(this).addClass("selected").siblings(".selected").removeClass("selected");
		});
		btns.eq(0).click();
		treeBox.find(".kjwz-search .cancel").click(function(e){
			e.stopPropagation();
			contents.hide();
			btns.removeClass("selected");
			//点击取消后跳转到空间定位页面
			$("span.area").click();
		})
//		//		添加收藏点
		$(".zs-tree .add.tjscd").click(function(e){
			e.stopPropagation();
			$(this).toggleClass("open");
			$(".zs-tree .add-collect").stop().slideToggle("fast");
		});
//		搜索按钮
		$(".zs-tree .kjwz-search-btn").click(function(e){
			e.stopPropagation();
			if($(this).hasClass("open")){
				$(".zs-tree .kjwz-search-content").hide();
				$(".zs-tree .kjwz-normal-content").show();
				$(this).removeClass("open");
			}else{
				$(".zs-tree .kjwz-search-content").show();
				$(".zs-tree .kjwz-normal-content").hide();
				$(this).addClass("open");
			}
		})
	}
	function fullScreen(callback){
    	var mapContainer=document.getElementsByClassName('zs-zyjg-zt-body')[0];
    	var tool_qp=document.getElementsByClassName('tool-qp')[0];
    	//W3C 
		if (mapContainer.requestFullscreen) { 
    		mapContainer.requestFullscreen(); 
    		tool_qp.innerHTML = '退出全屏';
    		exitFullScreen = !exitFullScreen;
		}
		//FireFox 
		else if (mapContainer.mozRequestFullScreen) { 
			mapContainer.mozRequestFullScreen();
			tool_qp.innerHTML = '退出全屏';
			exitFullScreen = !exitFullScreen;
		}
		//Chrome等 
		else if (mapContainer.webkitRequestFullScreen) { 
			mapContainer.webkitRequestFullScreen(); 
			tool_qp.innerHTML = '退出全屏';
			exitFullScreen = !exitFullScreen;
		}
		//IE11
		else if (mapContainer.msRequestFullscreen) {
			mapContainer.msRequestFullscreen();
			tool_qp.innerHTML = '退出全屏';
			exitFullScreen = !exitFullScreen;
		}
    	// 退出全屏
    	if (exitFullScreen) {
    		if (document.exitFullscreen) { 
        		document.exitFullscreen(); 
        		tool_qp.innerHTML = '全屏';
        		
    		} 
    		else if (document.mozCancelFullScreen) { 
    			document.mozCancelFullScreen(); 
    			tool_qp.innerHTML = '全屏';
    			
    		} 
    		else if (document.webkitCancelFullScreen) { 
    			document.webkitCancelFullScreen(); 
    			tool_qp.innerHTML = '全屏';
    			
    		} 
    		else if (document.msExitFullscreen) { 
    			document.msExitFullscreen();
    			tool_qp.innerHTML = '全屏';
    			
    		}
    	}
    	$(mapContainer).off('fullscreenchange');
    	$(mapContainer).off('webkitfullscreenchange');
    	$(mapContainer).off('mozfullscreenchange');
    	$(mapContainer).off('MSFullscreenChange');
    	
    	$(mapContainer).on('fullscreenchange', callback);
    	$(mapContainer).on('webkitfullscreenchange', callback);
    	$(mapContainer).on('mozfullscreenchange', callback);
    	$(mapContainer).on('MSFullscreenChange', callback);
	}
    function getDate(fmt){
    	Date.prototype.Format = function (fmt) { //author: meizz
		    var o = {
		        "M+": this.getMonth() + 1, //月份
		        "d+": this.getDate(), //日
		        "h+": this.getHours(), //小时
		        "m+": this.getMinutes(), //分
		        "s+": this.getSeconds(), //秒
		        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
		        "S": this.getMilliseconds() //毫秒
		    };
		    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		    for (var k in o)
		    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		    return fmt;
		}
    	return new Date().Format(fmt);
    }
  return {
	  activeTree:activeTree,
	  zzsize:zzsize,
	  divsize:divsize,
	  zz:zz,
	  mapLods:mapLods,
	  pos:pos,
	  fullScreen:fullScreen,
	  getDate:getDate,
  }
});