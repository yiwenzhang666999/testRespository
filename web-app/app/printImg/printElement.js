define(['configMap','printCanvas'],function(configMap,printCanvas) {
	'use strict';
    var zzsize=configMap.zzsize;
    var divsize=configMap.divsize;
    var pos=configMap.pos;
    //当前纸张,默认A4纸
    var zz=configMap.zz;
    //当前添加元素的id
    var posid="";
    //元素起始下标
    var startIndex=1;
	function init() {
		//添加元素
		$(".card span.wrapper").on("click",addElement);
		//添加元素-添加图片
		$("#picture_file").on("change",newPicture);
		//删除元素
//		$(".tool-scys").on("click",delElement);
		//右侧元素列表
//		$('.sec-list.content li a span').on("click", liClick);
		//修改元素位置
//		$("#table_ys tbody:not([id='table_tili']) input,#table_ys tbody:not([id='table_tili']) select").on("input propertychange",butClick);
//		$("#table_ys #table_tili input").on("input propertychange",tiliClick);
		//默认图标
//		for(var i=0;i<4;i++){
//			$(".zs-zt-tool .card span.wrapper")[i].click();
//		}
	}
	//添加元素
	function addElement(e){
		//获取标识id
		var id=$(this).attr("id");
		console.log(id);
		if(id=="tili"){
			addTili(id);
		}else if(id=="text"){
			addText(id);
		}else if(id=="picture"){
			addPicture(id);
		}else{
			//title,scale,compass
			addElement(id);
		}
	}
	function addPicture(posid){
		var oldpos=pos[posid];
		var len=$(".map-wrapper [id*="+posid+"]").length;
		var html="文字";
		pos[posid]=$.extend([],oldpos);
		var li='<li id="'+posid+'"><a href="javascript:;" class="btns second">'+
			'<i class="ck-box"></i>'+
			'<input class="ck-inp" type="checkbox">'+
			'<span class="txt" >'+html+'</span>'+
			'<div class="opa-box"><span title="添加'+html+'项" text="'+html+'" class="add btn"></span></div>'+
		'</a>'+
		'<ul class="thi-list content">'+
			'<li>'+
				'<a href="javascript:;" class="btns third">'+
					'<i class="ck-box"></i>'+
					'<input class="ck-inp" type="checkbox" name="" id="" value="">'+
					'<span class="txt" id="'+posid+'">'+html+'</span>'+
				'</a>'+
			'</li>'+
		'</ul>'+
		'</li>';
		$('.sec-list.content').first().append(li);
		$('.sec-list.content li a span').unbind("click").on("click", liClick);
		//添加元素项
		$(".zs-tree.zt .add.btn").unbind("click").on("click",function(e){
			e.stopPropagation();
			addChildElement(this,$(this).parents("li").attr("id"));
		});
		startIndex++;
		configMap.activeTree();
		newCanvas(posid,pos[posid]["text"]);
	}
	function addText(id){
		var oldpos=pos[posid];
		var len=$(".map-wrapper [id*="+posid+"]").length;
		var html="文字";
		pos[posid]=$.extend([],oldpos);
		var li='<li id="'+posid+'"><a href="javascript:;" class="btns second">'+
			'<i class="ck-box"></i>'+
			'<input class="ck-inp" type="checkbox">'+
			'<span class="txt" >'+html+'</span>'+
			'<div class="opa-box"><span title="添加'+html+'项" text="'+html+'" class="add btn"></span></div>'+
		'</a>'+
		'<ul class="thi-list content">'+
			'<li>'+
				'<a href="javascript:;" class="btns third">'+
					'<i class="ck-box"></i>'+
					'<input class="ck-inp" type="checkbox" name="" id="" value="">'+
					'<span class="txt" id="'+posid+'">'+html+'</span>'+
				'</a>'+
			'</li>'+
		'</ul>'+
		'</li>';
		$('.sec-list.content').first().append(li);
		$('.sec-list.content li a span').unbind("click").on("click", liClick);
		//添加元素项
		$(".zs-tree.zt .add.btn").unbind("click").on("click",function(e){
			e.stopPropagation();
			addChildElement(this,$(this).parents("li").attr("id"));
		});
		startIndex++;
		configMap.activeTree();
		newCanvas(id,pos[posid]["text"]);
	}
	//添加图例
	function addTili(id){
		var dataPos=pos[id];
		var tiliPos=dataPos[id];
		var px=2+startIndex++;
		//插入新图例
		var t=id+px;
		tiliPos[t]={
			"color":"#61ba37",
        	"text":"有林地",
        	"px":px,
        	"dqys":t,
		};
		startIndex++;
		tiliPos.length+=1;
		tiliPos=cxpx(tiliPos);
		//重新绘图
		resizTili();
	}
	function addChildTili(){
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	function resizTili(flag){
		var dataPos=pos["tili"];
		var tiliPos=dataPos["tili"];
		var tili=$("[id^=canvastili]")[0];
		var tili_2d=tili.getContext("2d");
		//重新计算画布高度
		var len=tiliPos.length;
		if(len==0)return;
		var height=dataPos.tpgd=len*(dataPos["color-height"]+dataPos["padding-tb"])+dataPos["padding-tb"]+40;//高度为13px,距上5px,最后一个加5px
		var width=dataPos.tpkd;
		tili.width=width*zoom;
		tili.height=height*zoom;
		//清除画布上的所有元素
		tili_2d.clearRect(0,0,pos["tili"].tpkd*zoom,pos["tili"].tpgd*zoom);
		tili_2d.beginPath();
		tili_2d.fillStyle="white";
		tili_2d.rect(0,0,pos["tili"].tpkd*zoom,pos["tili"].tpgd*zoom);
		tili_2d.fill();
		tili_2d.closePath();
		
	    tili_2d.beginPath();
	    tili_2d.font=20*zoom+"px Arial";
	    tili_2d.fillStyle="#000";
	    tili_2d.fillText("图例",(pos["tili"].tpkd/2-20)*zoom,30*zoom);
	    tili_2d.fill();
	    tili_2d.closePath();
		
		//重新循环插入所有
		var i=0;
		for(var key in tiliPos){
			if(key=="length")continue;
		    tili_2d.beginPath();
		    tili_2d.fillStyle=tiliPos[key].color;
		    tili_2d.rect(dataPos["padding-lr"]*zoom,(dataPos["padding-tb"]+(dataPos["padding-tb"]+dataPos["color-height"])*i+40)*zoom,dataPos["color-width"]*zoom,dataPos["color-height"]*zoom);
		    tili_2d.fill();
		    tili_2d.closePath();

		    tili_2d.beginPath();
		    tili_2d.font=13*zoom+"px Arial";
		    tili_2d.fillStyle="#000";
		    tili_2d.fillText(tiliPos[key].text,(dataPos["padding-lr"]+dataPos["color-width"]+dataPos["padding-lr"])*zoom,((dataPos["color-height"]+dataPos["padding-tb"])*(i+1)-5+40)*zoom);
		    tili_2d.closePath();
		    
		    if(!flag){
			    if(i==0){
			    	$("#tili").parents("li").eq(0).find("ul").remove();
			    	var ul='<ul class="thi-list content" style="overflow: hidden; display: none;"></ul>';
				    $("#tili").parents("li").eq(0).append(ul);
			    }
			    var li='<li><a href="javascript:;" class="btns third"><i class="ck-box"></i><input class="ck-inp" type="checkbox"><span class="txt" id="'+tiliPos[key].dqys+'">'+tiliPos[key].text+'</span></a></li>';
			    $("#tili").parents("li").eq(0).find("ul").append(li);
		    }
		    i++;
		}
		$('.sec-list.content li a span').unbind("click").on("click", liClick);
		configMap.activeTree();
		pos["tili"]["url"]=tili.toDataURL();

		printCanvas.canDrag($("[id^=canvastili]")[0]);
	}
	/**
	 * 重新排序
	 */
	function cxpx(datas){
		var objectList = new Array();
		function sersis(mykey,mydata){
		    this.mykey=mykey;
			this.mydata=mydata;
		}
		for (var key in datas) {
			if(key!="length")
			objectList.push(new sersis(key,datas[key]));
		}
		//获取排序字段与排序方式后排序
		var compare = function (obj1, obj2) {
		    var val1 = Number(obj1.mydata['px']);
		    var val2 = Number(obj2.mydata['px']);
		    if (val1>val2) {
		        return 1;
		    } else if (val1<val2) {
		        return -1;
		    } else {
		        return -1;
		    }
		} 
		var a =objectList.sort(compare);
		var tiliData={};
		for(var i=0;i<a.length;i++){
			var key=a[i].mykey;
			var data=a[i].mydata;
			tiliData[key]=data;
		}
		tiliData["length"]=a.length;
		return tiliData;
	}
	return {
		init:init,
//		liClick:liClick,
	}
})