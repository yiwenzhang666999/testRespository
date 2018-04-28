define(['printCanvas','configMap'],function (printCanvas,configMap) {
    'use strict';
	//输出图片
    function formSubmit(){
		var url="zyjgZt.do";
		var form=$("<form>");//定义一个form表单
	  	form.attr("style","display:none");
	  	form.attr("target","_blank");
	  	form.attr("method","post");
	  	form.attr("action",url);
	    var input=$("<input>");
	    input.attr("name","base64url");
	    input.attr("value",JSON.stringify(getUrls()));
		form.append(input);
	  	$("body").append(form);//将表单放置在web中
	  	form.submit();//表单提交
    }
    //获取表单数据
	function getUrls(){
		var urls=[];
		var layerStatesArray=Dmap.getLayers().array_;
		var zoom=Dmap.getView().getZoom()-1;
		var projection=Dmap.getProperties().view.projection_;
//		var extent=getExtents();
//		var extent=Dmap.getView().calculateExtent();
		var width=configMap.divsize[configMap.zz]["width"]-80-4;
		var height=configMap.divsize[configMap.zz]["height"]-40-100-4;
		var xymax=Dmap.getCoordinateFromPixel([width,height]);
		var xymin=Dmap.getCoordinateFromPixel([0,0]);
		var extent=[xymin[0],xymax[1],xymax[0],xymin[1]];
		var layers=[]
		for (var i=0;i<layerStatesArray.length;i++) {
		    var layerState = layerStatesArray[i];
		    if(layerState.getVisible()&&layerState.getSource().getTileGrid){
		        layers.push(layerState);
		    }
		}
		layers.sort(function(layer1,layer2){
			if(layer1.getZIndex()>layer2.getZIndex())return 1;
			else return -1;
		})
		
		for (var i=0;i<layers.length;i++) {
		    var layerState = layers[i];
		    if(layerState.getVisible()&&layerState.getSource().getTileGrid){
			    urls=manageTilePyramid(layerState.getSource(), projection, extent,zoom,urls);
		    }
		}
		return imgwh(urls);
	}
	//通过图层的四至获取url
    function manageTilePyramid(tileSource, projection, extent,z,urls) {
    	var tileGrid = tileSource.getTileGrid();
		var minZoom = tileGrid.getMinZoom();
		var tile, tileRange, tileResolution, x, y;
	    tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z, tileRange);
	    tileResolution = tileGrid.getResolution(z);
	    for (x = tileRange.minX; x <= tileRange.maxX; ++x) {
	    	for (y = tileRange.minY; y <= tileRange.maxY; ++y) {
	    		tile = tileSource.getTile(z, x, y, 1, projection);
	    		if(tile.src_){
		    		if(tile.src_.indexOf("tianditu")>-1){
		    			urls.push("http://" + window.location.host + "/" + window.location.href.split(window.location.host + '/')[1].split('/')[0] + "/proxy?url="+tile.src_);
		    		}else{
		    			urls.push(tile.src_);
		    		}
	    		}
	    	}
	    }
	    return urls;
	};
	//获取div的四至
	function getExtents(){
		var jb = Dmap.getView().getZoom()-1;
		var size=(2*Math.pow(4,jb));
		var width=Math.pow(2,(jb+1));
		var height=Math.pow(2,(jb));
		var xdu=180/width;
		var ydu=90/height;

		var pxxdu=xdu/256;
		var pxydu=ydu/256;

		var testDiv=document.getElementById("map");
		var top1=0;
		var left1=0;
		var width1=testDiv.offsetWidth-2;
		var height1=testDiv.offsetHeight-2;
		
		var xy1=Dmap.getCoordinateFromPixel([left1,top1]);
		var xy2=Dmap.getCoordinateFromPixel([width1,height1]);
		var mapdiv=document.getElementById("map");
		var ex=[xy1[0],xy2[1],xy2[0],xy1[1]];
		return ex;
	}
	//获取下级图层url
    function getNextTile(urls){
    	var newUrls=[];
    	for(var i=0;i<urls.length;i++){
    		var src=urls[i];
    		var xindex=src.indexOf("x=");
    	    var str=src.substring(xindex+2,src.length);
    	    var leftindex=str.indexOf("&");
    	    var x=Number(str.substring(0,leftindex));
    	    var x1=(x-10)*256;

    	    var yindex=src.indexOf("y=");
    	    var ystr=src.substring(yindex+2,src.length);
    	    var yleftindex=ystr.indexOf("&");
    	    var y=Number(ystr.substring(0,yleftindex));
    	    var y1=(y-1)*256;
    	    
    	    var zindex=src.indexOf("l=");
    	    var l=Number(src.substring(zindex+2,src.length));

    	    newUrls[i*4+0]=src.replace("x="+x,"x="+(x*2)).replace("y="+y,"y="+(y*2+1)).replace("l="+l,"l="+(l+1));
    	    newUrls[i*4+1]=src.replace("x="+x,"x="+(x*2+1)).replace("y="+y,"y="+(y*2+1)).replace("l="+l,"l="+(l+1));
    	    newUrls[i*4+2]=src.replace("x="+x,"x="+(x*2)).replace("y="+y,"y="+(y*2)).replace("l="+l,"l="+(l+1));
    	    newUrls[i*4+3]=src.replace("x="+x,"x="+(x*2+1)).replace("y="+y,"y="+(y*2)).replace("l="+l,"l="+(l+1));
    	}
    	return newUrls;
    }
    //去除xyz重复的url
    function quchong(urls){
    	var newUrls=[];
    	newUrls.push(urls[0]);
    	for(var i=1;i<urls.length;i++){
    		var index=urls[i].indexOf("x=");
    		var str1=urls[i].substring(index+2,urls[i].length);

    		var index=urls[i-1].indexOf("x=");
    		var str2=urls[i-1].substring(index+2,urls[i-1].length);
    		
    		if(str1!=str2){
    			newUrls.push(urls[i]);
    		}
    	}
    	return newUrls;
    }
    function getTitlPixel(urls){
    	var newUrls=quchong(urls);
    	var xy=getTileExtent(newUrls);
    	//计算最小与最大瓦片的经纬度位置
    	
    	var jb = xy.jb-1;
    	var size=(2*Math.pow(4,jb));
    	var width=Math.pow(2,(jb+1));
    	var height=Math.pow(2,(jb));
    	var xdu=180/width*2;
    	var ydu=90/height*2;
    	//瓦片最小像素点
    	var minpxxdu=xdu*(xy.xmin-height);//因为地图中心点在（15,7）,所以一块瓦片的宽高比是2:1，并且X坐标从0开始，从左向右计算
    	var minpxydu=ydu*(-xy.ymin+height/2);
    	var minPixelxy=Dmap.getPixelFromCoordinate([minpxxdu,minpxydu]);
//    	console.log("minPixelxy"+minPixelxy);
    	//瓦片最大像素点
    	var axpxxdu=xdu*(xy.xmax-height+1);//计算当前瓦片左下角的点，实际上是计算(x+1,y-1)瓦片的右上角的点(y坐标：从上向下递增，所以减一)
    	var axpxydu=ydu*(-xy.ymax+height/2-1);
    	var maxPixelxy=Dmap.getPixelFromCoordinate([axpxxdu,axpxydu]);
//    	console.log("maxPixelxy"+maxPixelxy);
    	//与出图div计算差值
    	var div=document.getElementById("map");
    	var divxmin=Math.floor(minPixelxy[0]);
    	var divymin=Math.floor(minPixelxy[1]);
    	var divxmax=Math.floor(maxPixelxy[0]);
    	var divymax=Math.floor(maxPixelxy[1]);
    	return {divxmin:divxmin,divymin:divymin,divxmax:divxmax,divymax:divymax};
    }
    function getTileExtent(newUrls){
    	var xmin=0;
    	var xmax=0;
    	var ymin=0;
    	var ymax=0;
    	for(var i=0;i<newUrls.length;i++){
    		var src=newUrls[i];
    		var xindex=src.indexOf("&x=");
    	    var str=src.substring(xindex+3,src.length);
    	    var leftindex=str.indexOf("&");
    	    var x=Number(str.substring(0,leftindex));

    	    var yindex=src.indexOf("&y=");
    	    var ystr=src.substring(yindex+3,src.length);
    	    var yleftindex=ystr.indexOf("&");
    	    var y=Number(ystr.substring(0,yleftindex));
    	    
    	    var zindex=src.indexOf("&l=");
    	    var z=Number(src.substring(zindex+3,src.length));
    	    
    		if(i==0){
    			xmin=x;
    			xmax=x;
    			ymin=y;
    			ymax=y;
    		}
    		if(x<xmin){
    			xmin=x;
    		}
    		if(x>xmax){
    			xmax=x;
    		}
    		if(y<ymin){
    			ymin=y;
    		}
    		if(y>ymax){
    			ymax=y;
    		}
    	}
    	return {xmin:xmin,xmax:xmax,ymin:ymin,ymax:ymax,jb:z};
    }
    //根据url的xzy计算div的像素大小
    function imgwh(urls){
    	var xy={};
    	var newUrls=quchong(urls);
//    	var newUrls1=getNextTile(urls);
//    	var newUrls=quchong(newUrls1);
    	//计算瓦片范围
    	xy=getTileExtent(newUrls);
    	var divxy=getTitlPixel(urls);
//    	$.extend(xy,{width:(xy.xmax-xy.xmin+1)*256,height:(xy.ymax-xy.ymin+1)*256},divxy}
    	xy["width"]=(xy.xmax-xy.xmin+1)*256;
    	xy["height"]=(xy.ymax-xy.ymin+1)*256;
    	return {"urls":urls,"xy":xy,"divxy":divxy,"len":urls.length};
//    	return {"urls":newUrls1,"xy":xy,"divxy":divxy};
    }
    return {
    	getUrls:getUrls,
    }
});