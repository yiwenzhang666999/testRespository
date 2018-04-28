/**
 * 查询点 高亮点周围的小班面
 */
define(["map",'config','style','drawBufferMap'],function(map,config,style,drawBufferMap){
	//主地图
	var mainMap=map;
	//绘制点后 高亮图层
	var bufferLayer=null;
	//所有高亮小班的features
	var bufferFeatures=null;
	//neighboursData  查找最近点的集合
	window.neighboursData=[];
	//判断两个点都是吸附点
	var isBufferPoint=false;
	//上一个 吸附点
	var prePoint=[];
	//吸附的 feature
	var bufferFeature=null;
	//最后追踪的那一段的点集合
	window.lastFPoints=[];
	function query(point,tableName){
		var code=$("#zyjg_jb_mc").attr("code");
		if(!code){
			console.log("获取政区失败！");
			return;
		}
		var proxy=config.PROXY.substring(0,config.PROXY.length-4);
		var url=config.publicService+"/ws/rest/DS/bufferQuery/zyjg/"+point[0]+"/"+point[1]+"/"+tableName+"/"+code;
		$.ajax({
			url:url,
			type:"get",
			success:function(res){
				if(res.message=="sucess"){
//					console.log("查询成功！");
					if(res["data"]){
						querySuccess(res["data"]);
					}
				}else{
					console.log("点查询失败！");
				}
			},
			error:function(evt){
				console.log(evt);
			}
		});
	};
	function querySuccess(data){
		if(drawBufferMap.getIsStop()){
			return;
		}
		if(!bufferLayer){
			bufferLayer=mainMap.getLayerByName("BUFFER_LAYER");
		}
		bufferLayer.setVisible(true);
		var layerFeatures=bufferLayer.getSource().getFeatures();
		
		var features=[];
		var geojsonFormat = new ol.format.GeoJSON();
		var wktForm=new ol.format.WKT();
//		neighboursData=[];
		for(var i=0;i<data.length;i++){
			 var geojson={
					 type:'Feature',
	                 geometry:JSON.parse(data[i].shape)
			  }
			 var shape=JSON.parse(data[i].shape);
			 if(shape.type=="Polygon"){
				 var coordinates=shape.coordinates[0];
				 for(var j=0;j<coordinates.length;j++){
					 var temp_arr=coordinates[j].concat(coordinates[j]);
					 neighboursData.push(temp_arr);
				 }
//				 neighboursData=neighboursData.concat(shape.coordinates[0]);
			 }
			  var feature = geojsonFormat.readFeature(geojson);
			  var wktString=wktForm.writeFeature(feature);
			  var isReapt=false;
			  for(var z=0;z<layerFeatures.length;z++){
				  var tempF=wktForm.writeFeature(layerFeatures[z]);
				  if(wktString==tempF){
					  isReapt=true;
					  break;
				  }
			  }
			  if(!isReapt){
				  features.push(feature);
			  }
		}
//		bufferLayer.getSource().clear();
		bufferLayer.getSource().addFeatures(features);
	}
	function arrToBox(arr) {
		return {
	        minX: arr[0],
	        minY: arr[1],
	        maxX: arr[2],
	        maxY: arr[3]
	    };
	}
	/**
	 * Modify the drawing.
	 * @param {ol.MapBrowserEvent} event Event.
	 * @private
	 * 重写 openlayer的这个方法，加个判断，如果有bufferTolerance， 需要返回小班边界上的吸附点
	 */
	ol.interaction.drawBuffer.prototype.modifyDrawing_ = function(event) {
	  var coordinate = event.coordinate;
	  var snapFlag=true;
	  var geometry = /** @type {ol.geom.SimpleGeometry} */ (this.sketchFeature_.getGeometry());
	  var coordinates, last;
	  if (this.mode_ === ol.interaction.Draw.Mode_.POINT) {
	    last = this.sketchCoords_;
	  } else if (this.mode_ === ol.interaction.Draw.Mode_.POLYGON) {
		//重新赋值 by zzq 20180125
		  this.sketchLineCoords_ = this.sketchCoords_[0];
	    coordinates = this.sketchCoords_[0];
	    last = coordinates[coordinates.length - 1];
	    //还原首点样式；刘永恒
	    if(this.pointFeatures.length>0){
	    	 this.pointFeatures[0].setStyle();
	    }
	    if (this.atFinish_(event)) {
	      // snap to finish
	      coordinate = this.finishCoordinate_.slice();
	      snapFlag=false;
	      this.pointFeatures[0].setStyle(style.getDefaultStyleFunction());
	    }
	  } else {
	    coordinates = this.sketchCoords_;
	    last = coordinates[coordinates.length - 1];
	  }
	  if (this.isBuffer&&snapFlag&&(!this.freehand_)&&isBufferSnap) {
		  var bufferData=findNeighbours(neighboursData,coordinate,1);
		  if(bufferData){
			  bufferCoordinate=bufferData[0];
			  var map=event.map;
			  var temp_coordinate=[bufferData[0]["minX"],bufferData[0]["minY"]];
			  var bufferPiex=map.getPixelFromCoordinate(temp_coordinate);
			  var coordinatePiex=map.getPixelFromCoordinate(coordinate);
			  var dx = bufferPiex[0] - coordinatePiex[0];
			  var dy = bufferPiex[1] - coordinatePiex[1];
			  var bufferDistance=Math.sqrt(dx*dx+dy*dy);
			  if(bufferDistance<=this.bufferTolerance_){
				  event.coordinate=coordinate=temp_coordinate;
				  isBufferPoint=true;
				  $("#map").removeClass("noTrack");
				  $("#map").addClass("Track");

			  }else{
				  isBufferPoint=false;
				  $("#map").removeClass("Track");
					 $("#map").addClass("noTrack");
			  }
		  }else{
			  isBufferPoint=false; 
		  }
	    }else{
	    	isBufferPoint=false;
	    }
	  last[0] = coordinate[0];
	  last[1] = coordinate[1];
	  this.geometryFunction_(/** @type {!Array.<ol.Coordinate>} */ (this.sketchCoords_), geometry);
	  if (this.sketchPoint_) {
	    var sketchPointGeom = /** @type {ol.geom.Point} */ (this.sketchPoint_.getGeometry());
	    sketchPointGeom.setCoordinates(coordinate);
	  }
	  var sketchLineGeom;
	  if (geometry instanceof ol.geom.Polygon &&
	      this.mode_ !== ol.interaction.Draw.Mode_.POLYGON) {
	    if (!this.sketchLine_) {
	      this.sketchLine_ = new ol.Feature(new ol.geom.LineString(null));
	    }
	    var ring = geometry.getLinearRing(0);
	    sketchLineGeom = /** @type {ol.geom.LineString} */ (this.sketchLine_.getGeometry());
	    sketchLineGeom.setFlatCoordinates(
	        ring.getLayout(), ring.getFlatCoordinates());
	  } else if (this.sketchLineCoords_) {
	    sketchLineGeom = /** @type {ol.geom.LineString} */ (this.sketchLine_.getGeometry());
	    sketchLineGeom.setCoordinates(this.sketchLineCoords_);
	  }
	  this.updateSketchFeatures_();
	};
	/**
	 * @param {ol.MapBrowserPointerEvent} event Event.
	 * @return {boolean} Stop drag sequence?
	 * @this {ol.interaction.Draw}
	 * @private
	 */
	ol.interaction.Draw.handleUpEvent_ = function(event) {
	  var pass = true;
	  this.handlePointerMove_(event);
	  var circleMode = this.mode_ === ol.interaction.Draw.Mode_.CIRCLE;
	  var judPoints=null;
	  if(isBufferPoint&&isBufferSnap){
		  if(this.sketchCoords_[0]&&this.sketchCoords_[0].length>=2){
			//判断新画的点是否 和已有的点重合， 重合则不追踪
			  var isReapt=null;
			  if(this.sketchLineCoords_.length>0){
				  isReapt=checkRepeat([event.coordinate],this.sketchLineCoords_);
			  }
			 /* //如果 重合  去掉这一个点
			  if(isReapt){
				  this.sketchLineCoords_.splice(this.sketchLineCoords_.length-1,1);
				  //this.sketchCoords_[0].splice(this.sketchCoords_[0].length-1,1);
			  }*/
			   //判断 最后两点是否在同一个面上
			   judPoints=judgePoints(this.sketchCoords_[0]);
			   if(judPoints&&!isReapt){
				   lastFPoints=judPoints;
//				   console.log(judPoints.length);
				   if(this.sketchLineCoords_.length>=2){
					   this.sketchLineCoords_= arrRemove(this.sketchLineCoords_,event.coordinate); 
				   }
				   if(this.sketchCoords_[0].length>=2){
					   this.sketchCoords_[0]=arrRemove(this.sketchCoords_[0],event.coordinate); 
				   }
				   this.sketchLineCoords_=this.sketchLineCoords_.concat(judPoints);
				   this.sketchCoords_[0]=this.sketchCoords_[0].concat(judPoints); 
				   //展示节点
				   this.showPoints(judPoints);
				   //重新  new个线 让其实时刷新
				   var sket_line=new ol.geom.LineString();
				   sket_line.setCoordinates(this.sketchLineCoords_);
				   this.sketchLine_.setGeometry(sket_line);
			   }else{
				   lastFPoints=[];
//				   console.log(judPoints);
//				   console.log(isReapt);
				   judPoints=null;
			   }
		  }
	  }else{
		  lastFPoints=[];
		  prePoint=[];
	  }
	  if (this.shouldHandle_) {
		  if(this.isBuffer&&isBufferSnap){
			  var coordinate = event.coordinate;
			  if(!this.atFinish_(event)){
				  query(coordinate,this.bufferLayerName_); 
			  }
		  }
	    if (!this.finishCoordinate_) {
	      this.startDrawing_(event);
	      if (this.mode_ === ol.interaction.Draw.Mode_.POINT) {
	        this.finishDrawing();
	      }
	    } else if (/*去掉自由绘制时，放开鼠标制动结束判断this.freehand_ || */circleMode) {
	      this.finishDrawing();
	    } else if (this.atFinish_(event)) {
	      if (this.finishCondition_(event)) {
	        this.finishDrawing();
	      }
	      if(this.isBuffer&&bufferLayer){
	    	  setTimeout(function(){
	    		  bufferLayer.getSource().clear();
	    		  bufferLayer.setVisible(false);
	    		  neighboursData=[];
	    	  },500)
	      }
	    } else {
	    	if(!isReapt){
	    		this.addToDrawing_(event);
	    		//展示节点，刘永恒
	  	        if(this.isBuffer){
	  	    	   if(!judPoints||!isBufferPoint){
	  	    		  this.showPoint(event.coordinate.slice()); 
	  		       }
	  	        }
	    	}
	    }
	    pass = false;
	  } else if (this.freehand_) {
	    this.finishCoordinate_ = null;
	    this.abortDrawing_();
	  }
//	  this.updateSketchFeatures_();
	  return pass;
	};
	/**
	 * 判断两个点是否在同一个面上
	 */
	function judgePoints(points){
		var point1=points[points.length-2];
		var point2=points[points.length-1];
		//是否在同一个面上
		onePlogy=false;
		prePoint=[];
		prePoint.push(point2);
		//两个点在一个面上的  feature
		var resultFeatures=[];
		var tempArr=[];
		var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#DE291D',
                width: 3
            }),
            fill: new ol.style.Fill({
                color: '#abe81c'
            })
        });
		//所有的图形  遍历图形坐标
		var allFeatrues=mainMap.getLayerByName("BUFFER_LAYER").getSource().getFeatures();
		for(var i=0;i<allFeatrues.length;i++){
			var featuresArr=[];
			var coordinates=allFeatrues[i].getGeometry().getCoordinates()[0];
			for(var j=0;j<coordinates.length;j++){
				var tenpArr=coordinates[j].concat(coordinates[j]);
				featuresArr.push(tenpArr);
			}
//			allFeatrues[i]["neighbData"]=tenpArr; F38B00
			//利用 rbush 找到最近的点，看返回的点是不是 和这个点相同
		    var r_point1=findNeighbours(featuresArr,point1,1);
		    var r_point2=findNeighbours(featuresArr,point2,1);
		    if(r_point1[0]["minX"]==point1[0]&&r_point1[0]["minY"]==point1[1]
		    &&r_point2[0]["minX"]==point2[0]&&r_point2[0]["minY"]==point2[1]){
		    	onePlogy=true;
//		    	allFeatrues[i].setStyle(style);
		    	resultFeatures.push(allFeatrues[i]);
		    	break;
		    }else{
		    	onePlogy=false;
		    }
		    
		}
		//不在一个面上 直接返回 false
		if(!onePlogy){
			return false;
		}
		//测试的时候 先加载一个高亮图层  显示出匹配到的 feature
//		var testHighrLayer=map.getLayerByName("TESTHIGH_LAYER").getSource();
//		testHighrLayer.addFeatures[resultFeatures];
		//得到 数组在 feature coordinates 中的位置
		var result_points1=[],result_points2=[],result_points3=[],
		point1_index=null,point2_index=null;
			var coordinates=resultFeatures[0].getGeometry().getCoordinates()[0];
//			coordinates.splice(coordinates.length-1,1);
			for(var i=0;i<coordinates.length-1;i++){
				var val=coordinates[i];
				var index=i;
				if(point1[0]==val[0]&&point1[1]==val[1]){
					point1_index=index;
				}
				else if(point2[0]==val[0]&&point2[1]==val[1]){
					point2_index=index;
				}
			}
			var num=point1_index-point2_index;
			//这里将数组 分为3段 0，point1_index，point2_index，last
			/**
			 * 0 到开始点
			 * 开始点到结束点
			 * 结束点到 最后
			 */
			if(num>0){
				for(var i=0;i<coordinates.length-1;i++){
					var val=coordinates[i];
					var index=i;
					if(index<point2_index){
						result_points1.push(val);
					}else if(index>point2_index&&index<point1_index){
						result_points2.push(val);
					}else if(index>point1_index){
						result_points3.push(val);
					}
				}
				result_points2=result_points2.reverse();
//				result_points2.splice(0,0,point1);
				result_points2=result_points2.concat([point2]);
				result_points1=result_points3.concat(result_points1);
//				result_points1.splice(0,0,point1);
				result_points1=result_points1.concat([point2]);
			}else if(num<0){
				for(var i=0;i<coordinates.length-1;i++){
					var val=coordinates[i];
					var index=i;
					if(index<point1_index){
						result_points1.push(val);
					}else if(index>point1_index&&index<point2_index){
						result_points2.push(val);
					}else if(index>point2_index){
						result_points3.push(val);
					}
				}
//				result_points2.splice(0,0,point1);
				result_points2=result_points2.concat([point2]);
				result_points1=result_points1.reverse().concat(result_points3.reverse());
//				result_points1.splice(0,0,point1);
				result_points1=result_points1.concat([point2]);
			}
			var length2=calcLength(result_points2);
			var length1=calcLength(result_points1);
			if(points.length>0){
				point1Flag=checkRepeat(result_points1,points);
				point2Flag=checkRepeat(result_points2,points);
				if(!point1Flag&&!point2Flag){
					if(length1>length2){
						return result_points2;
					}else{
						return result_points1;
					}
				}else if(!point1Flag){
					return result_points1;
				}else if(!point2Flag){
					return result_points2;
				}else{
					return false;
				}
			}else{
				if(length1>length2){
					return result_points2;
				}else{
					return result_points1;
				}
			}
	};
	/**
	 * 判断刚画的点 是否和已画的点重合
	 */
	function checkRepeat(coordinate,coordinates){
		/**
		 * 数组集合
		 * 采用 rbush 计算最近的一个点，再判断点是否相等
		 * 注意： 数据格式为[a,b,a,b]
		 */
		//先将 数组最后一个点去掉
//		coordinates.splice(coordinates.length-1,1);
		var featuresArr=[];
		for(var j=0;j<coordinates.length-1;j++){
			var tenpArr=coordinates[j].concat(coordinates[j]);
			featuresArr.push(tenpArr);
		}
		//重合 true
		var flag=false;
		for(var i=0;i<coordinate.length;i++){
			var r_point=findNeighbours(featuresArr,coordinate[i],1);
			if(r_point[0]["minX"]==coordinate[i][0]&&r_point[0]["minY"]==coordinate[i][1]){
				flag= true;
				break;
			}
		}
		return flag;
	}
	/**
	 * 计算长度 
	 * coordinates 坐标组 
	 */
	function calcLength(coordinates){
		sourceProj = mainMap.getMap().getView().getProjection();
		var wgs84Sphere = new ol.Sphere(6378137);
		var length = 0;
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
            length += wgs84Sphere.haversineDistance(c1, c2);
        }
        return length;
	}
	/**
	 * 删除 数组中的指定元素 二维数组
	 */
	function arrRemove(arrs,arr){
		var le=arrs.length-1;
		if(arrs[le][0]==arr[0]&&arrs[le][1]==arr[1]){
			arrs.splice(le,1);
		}
		return arrs;
	};
	//计算一个点是否在多边形里,参数:点,多边形数组
	function PointInPoly(pt, poly) { 
	    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) 
	        ((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1])) 
	        && (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]) 
	        && (c = !c); 
	    return c; 
	}
	return{
		query:query
	}
});