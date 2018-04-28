/**
 * ol.interaction.Draw 的子类
 * 新增了属性
 * bufferTolerance_ 吸附时的距离
 * bufferLayerName_  吸附时查询的图层 名称
 * isBuffer  是否吸附
 */
ol.interaction.drawBuffer=function(options){
	ol.interaction.Draw.call(this,options);
	/**
	 * buffer 扩展，by zzq 20180115
	 * 当 配置bufferTolerance 时，根据这个点进行点的吸附
	 */
	this.bufferTolerance_=options.bufferTolerance ? options.bufferTolerance : false;
	 /**
	   * buffer 扩展，by zzq 20180115
	   * 当 配置bufferLayerName 时，根据这个点进行点查询出周围的小班
	   */
	this.bufferLayerName_=options.bufferLayerName ? options.bufferLayerName : false;
	this.isBuffer=options.isBuffer ? options.isBuffer : false;
	/**
	 * 以下参数为区划工具创建使用
	 * */
	this.lastPixel = [0,0];//记录上一次像素
	this.pointFeatures = [];//点集合feature
	var pointStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 4,
          stroke: new ol.style.Stroke({
            color: 'rgba(70,70,70,1)',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255,255,255,1)'
          })
        })
	});
	this.pointlay_ = new ol.layer.Vector({
	    source: new ol.source.Vector({
	      useSpatialIndex: false,
	      wrapX: options.wrapX ? options.wrapX : false
	    }),
	    style: pointStyle
	  });
}
ol.interaction.drawBuffer.prototype = Object.create(ol.interaction.Draw.prototype);
ol.interaction.drawBuffer.prototype.constructor = ol.interaction.drawBuffer;

ol.interaction.drawBuffer.prototype.clearOverlay_=function(){
	this.overlay_.getSource().clear();
	this.pointlay_.getSource().clear();
}
/**
 * 扩展
 * */
ol.interaction.drawBuffer.prototype.startDrawing_ = function(event) {
	  var start = event.coordinate;
	  this.finishCoordinate_ = start;
	  if (this.mode_ === ol.interaction.Draw.Mode_.POINT) {
	    this.sketchCoords_ = start.slice();
	  } else if (this.mode_ === ol.interaction.Draw.Mode_.POLYGON) {
	    this.sketchCoords_ = [[start.slice(), start.slice()]];
	    this.sketchLineCoords_ = this.sketchCoords_[0];
	  } else {
	    this.sketchCoords_ = [start.slice(), start.slice()];
	    if (this.mode_ === ol.interaction.Draw.Mode_.CIRCLE) {
	      this.sketchLineCoords_ = this.sketchCoords_;
	    }
	  }
	  if (this.sketchLineCoords_) {
	    this.sketchLine_ = new ol.Feature(
	        new ol.geom.LineString(this.sketchLineCoords_));
	  }
	  var geometry = this.geometryFunction_(this.sketchCoords_);
	  this.sketchFeature_ = new ol.Feature();
	  if (this.geometryName_) {
	    this.sketchFeature_.setGeometryName(this.geometryName_);
	  }
	  this.sketchFeature_.setGeometry(geometry);
		this.updateSketchFeatures_();
		//扩展绘制后显示节点
	  this.showPoint(event.coordinate.slice());
	  this.dispatchEvent(new ol.interaction.Draw.Event(
	      ol.interaction.DrawEventType.DRAWSTART, this.sketchFeature_));
};

ol.interaction.drawBuffer.prototype.addToDrawing_ = function(event) {
	  var coordinate = event.coordinate;
	  var geometry = /** @type {ol.geom.SimpleGeometry} */ (this.sketchFeature_.getGeometry());
	  var done;
	  var coordinates;
	  if (this.mode_ === ol.interaction.Draw.Mode_.LINE_STRING) {
	    this.finishCoordinate_ = coordinate.slice();
	    coordinates = this.sketchCoords_;
	    if (coordinates.length >= this.maxPoints_) {
	      if (this.freehand_) {
	        coordinates.pop();
	      } else {
	        done = true;
	      }
	    }
	    coordinates.push(coordinate.slice());
	    this.geometryFunction_(coordinates, geometry);
	  } else if (this.mode_ === ol.interaction.Draw.Mode_.POLYGON) {
	    coordinates = this.sketchCoords_[0];
	    if (coordinates.length >= this.maxPoints_) {
	      if (this.freehand_) {
	        coordinates.pop();
	      } else {
	        done = true;
	      }
	    }
			coordinates.push(coordinate.slice());
			//扩展自由绘制时展示当前绘制节点
	    if(this.freehand_){
	    	this.showPoint(coordinate.slice());
	    }
	    if (done) {
	      this.finishCoordinate_ = coordinates[0];
	    }
	    this.geometryFunction_(this.sketchCoords_, geometry);
	  }
	  this.updateSketchFeatures_();
	  if (done) {
	    this.finishDrawing();
	  }
};
/**
 * 扩展，展示节点方法
 */
ol.interaction.drawBuffer.prototype.showPoint = function(coor){
	var point = new ol.geom.Point(coor);
	var fea = new ol.Feature({geometry:point});
	 var pointStyle = new ol.style.Style({
	        image: new ol.style.Circle({
	          radius: 4,
	          stroke: new ol.style.Stroke({
	            color: 'rgba(70,70,70,1)',
	            width: 1
	          }),
	          fill: new ol.style.Fill({
	            color: 'rgba(255,255,255,1)'
	          })
	        })
		});
	fea.setStyle(pointStyle);
    this.pointFeatures.push(fea);
    this.pointlay_.getSource().addFeature(fea);
}
/**
 * 继承自父类方法，目前没有扩展
 */
ol.interaction.drawBuffer.prototype.updateSketchFeatures_ = function() {
	  var sketchFeatures = [];
	  if (this.sketchFeature_) {
	    sketchFeatures.push(this.sketchFeature_);
	  }
	  if (this.sketchLine_) {
	    sketchFeatures.push(this.sketchLine_);
	  }
	  if (this.sketchPoint_) {
	    sketchFeatures.push(this.sketchPoint_);
	  }
	  var overlaySource = this.overlay_.getSource();
	  overlaySource.clear(true);
	  overlaySource.addFeatures(sketchFeatures);
	};
	/**
	 * 扩展 点吸附（openlayers）
	 * */
	ol.interaction.drawBuffer.prototype.atFinish_ = function(event) {
		  var at = false;
		  if (this.sketchFeature_) {
		    var potentiallyDone = false;
		    var potentiallyFinishCoordinates = [this.finishCoordinate_];
		    if (this.mode_ === ol.interaction.Draw.Mode_.LINE_STRING) {
		      potentiallyDone = this.sketchCoords_.length > this.minPoints_;
		    } else if (this.mode_ === ol.interaction.Draw.Mode_.POLYGON) {
		      potentiallyDone = this.sketchCoords_[0].length >
		          this.minPoints_;
		      potentiallyFinishCoordinates = [this.sketchCoords_[0][0],
		        this.sketchCoords_[0][this.sketchCoords_[0].length - 2]];
		    }
		    if (potentiallyDone) {
		      var map = event.map;
		      for (var i = 0, ii = potentiallyFinishCoordinates.length; i < ii; i++) {
		    	  /**
		    	   * potentiallyFinishCoordinates
		    	   * 此数组只有两个值，第一个为起始点第二个为最后一点；
		    	   * 此处重写方法，改变判断，起始点有吸附，在范围内即可，
		    	   * 最后一点没有吸附，必须是重合点才会吸附，用这种方式达成双击的结束效果；
		    	   * */
		        var finishCoordinate = potentiallyFinishCoordinates[i];
		        var finishPixel = map.getPixelFromCoordinate(finishCoordinate);
		        var pixel = event.pixel;
		        //event中只改变了追踪后的经纬度点，没有改变像素点；
		        //var pixel = map.getPixelFromCoordinate(event.coordinate);
		        var dx = pixel[0] - finishPixel[0];
		        var dy = pixel[1] - finishPixel[1];
		        if(i==0){
		        	var snapTolerance =  this.freehand_ ? 5 : this.snapTolerance_;
		        	at = Math.sqrt(dx * dx + dy * dy) <= snapTolerance;
		        }else if(i==1){
		        	at=Math.sqrt(dx * dx + dy * dy)<=0.01;
		        }
		        if (at) {
		          this.finishCoordinate_ = finishCoordinate;
		          break;
		        }
		      }
		    }
		  }
		  return at;
		};
	/**
	 * 获取节点
	 * */
ol.interaction.drawBuffer.prototype.getInflectionPoint=function(){
	var coords = [];
	var sketchCoords = [];
	if(this.mode_===ol.interaction.Draw.Mode_.POINT){

	}else if(this.mode_===ol.interaction.Draw.Mode_.LINE_STRING){
		sketchCoords = this.sketchCoords_;
	}else if(this.mode_===ol.interaction.Draw.Mode_.POLYGON){
		sketchCoords = this.sketchCoords_[0];
	}else if(this.mode_===ol.interaction.Draw.Mode_.CIRCLE){

	}else{

	}
	  	var length = sketchCoords.length;
	  	for(var z=0;z<length;z++){
	  		var item = sketchCoords[z];
	  		if(!coords.isHaveArr(item)){
	  			coords.push(item);
	  		}
	  	}
	  	var pointFeatureArr = [];
	  	for(var i=0;i<coords.length;i++){
	  		var point = new ol.geom.Point(coords[i]);
	  		var fea = new ol.Feature({geometry:point});
  	  	var style = new ol.style.Style({
	          image: new ol.style.Circle({
	            radius: 4,
	            stroke: new ol.style.Stroke({
	              color: 'rgba(70,70,70,1)',
	              width: 1
	            }),
	            fill: new ol.style.Fill({
	              color: 'rgba(255,255,255,1)'
	            })
	          })
	        });
  	  	fea.setStyle(style);
	  	    pointFeatureArr.push(fea);
	  	}
	  return pointFeatureArr;
}

ol.interaction.Draw.prototype.removeLastPoint = function() {
	  if (!this.sketchFeature_) {
	    return;
	  }
	  var geometry = /** @type {ol.geom.SimpleGeometry} */ (this.sketchFeature_.getGeometry());
	  var coordinates, sketchLineGeom;
	  if (this.mode_ === ol.interaction.Draw.Mode_.LINE_STRING) {
	    coordinates = this.sketchCoords_;
	    coordinates.splice(-2, 1);
	    this.geometryFunction_(coordinates, geometry);
	    if (coordinates.length >= 2) {
	      this.finishCoordinate_ = coordinates[coordinates.length - 2].slice();
	    }
	  } else if (this.mode_ === ol.interaction.Draw.Mode_.POLYGON) {
	    coordinates = this.sketchCoords_[0];
	    if(lastFPoints.length>0){
	    	coordinates.splice(-1-lastFPoints.length, lastFPoints.length);
	    }else{
	    	coordinates.splice(-2, 1);
	    }
	    sketchLineGeom = /** @type {ol.geom.LineString} */ (this.sketchLine_.getGeometry());
	    sketchLineGeom.setCoordinates(coordinates);
	    this.geometryFunction_(this.sketchCoords_, geometry);
	    //最后是追踪点 删除节点 by  zzq 20180309
	    if(lastFPoints.length>0){
	    	//先获得 追点的节点
	    	var lastFFeatures=this.pointFeatures.splice(-lastFPoints.length,lastFPoints.length);
	    	for(var i=0;i<lastFFeatures.length;i++){
	    		this.pointlay_.getSource().removeFeature(lastFFeatures[i]);
	    	}
	    	lastFPoints=[];
	    }else{
	    	if(this.pointFeatures.length>0){
		    	this.pointlay_.getSource().removeFeature(this.pointFeatures.pop());
		    }
	    }
	  }

	  if (coordinates.length === 0) {
	    this.finishCoordinate_ = null;
	  }
	  this.updateSketchFeatures_();
	};
ol.interaction.drawBuffer.prototype.updateState_ = function() {
		  var map = this.getMap();
		  var active = this.getActive();
		  if (!map || !active) {
		    this.abortDrawing_();
		  }
		  this.overlay_.setMap(active ? map : null);
		  this.pointlay_.setMap(active?map:null);
};
ol.interaction.Draw.prototype.abortDrawing_ = function() {
	  this.finishCoordinate_ = null;
	  var sketchFeature = this.sketchFeature_;
	  if (sketchFeature) {
	    this.sketchFeature_ = null;
	    this.sketchPoint_ = null;
	    this.sketchLine_ = null;
	    this.overlay_.getSource().clear(true);
	  }
	  if(this.pointFeatures){
		  this.pointFeatures=[];
		  this.pointlay_.getSource().clear();
	  }
	  var bufferLayer=map.getLayerByName("BUFFER_LAYER");
	  if(bufferLayer){
		  bufferLayer.getSource().clear();
	  }
	  return sketchFeature;
};
ol.interaction.drawBuffer.prototype.showPoints = function(coors){
	var pointStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 4,
          stroke: new ol.style.Stroke({
            color: 'rgba(70,70,70,1)',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255,255,255,1)'
          })
        })
	});
	for(var i=0;i<coors.length;i++){
		var point = new ol.geom.Point(coors[i]);
		var fea = new ol.Feature({geometry:point});
		fea.setStyle(pointStyle);
	    this.pointFeatures.push(fea);
	    this.pointlay_.getSource().addFeature(fea);
	}
}
//查找数组中是否包含，另一个点数组；
Array.prototype.isHaveArr = function(arr){
	for(var i=0;i<this.length;i++){
		if(this[i].indexOf(arr[0])>0&&this[i].indexOf(arr[1])>0){
			return true;
		}
	}
	return false;
}
/**
 * 定义一个 keydown 事件，一个全局变量，
 * 当按住这个键时，不吸附  q keycode是81
 * isBufferSnap
 */
document.onkeydown=function(event){
	  var e=event||window.event;
	  var keyCode=e.keyCode||e.which;
	  if(keyCode==81){
		  $(".is-buffer-snap i").click();
	  }
	};