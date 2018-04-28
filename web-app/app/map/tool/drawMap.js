/**
 *地图绘画工具（无吸附点查询）
 */
define([
    'map','style','treeHelper'
], function (map_,style,treeHelper) {
    'use strict';
    var layer;
    var interaction_draw;
    var stop =false;
    var isStop=false;
    /**
     * 图层画 点、线、面
     * @param {string} type  'Point', 'LineString', 'LinearRing', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection', 'Circle'.
     * @param {function} callBack
     */
    function draw(type, callBack) {
        var map=map_.getMap();
        if (!layer) {
            layer = map_.getLayerByName("DRAW_LAYER");
        }
        //
        var source = layer.getSource();
        source.clear();
        clear();
        //
        interaction_draw = new ol.interaction.Draw({
            source: source,
            type: type,
            snapTolerance:5,//结束点吸附距离 像素
            style: style.getDefaultStyleFunction()
        });
        map.addInteraction(interaction_draw);
        interaction_draw.on('drawend', function (evt) {
        	setTimeout(function(){
        		layer.getSource().clear();
        	},0)
        	if(stop){
        		stop=false;
        		return;
        	}
            map.render();
            map.removeInteraction(interaction_draw);
            interaction_draw=null;
            callBack(evt);
        });
    }
    function getLayerTreeChecked(zqCode,layerName){
    	var tree = treeHelper.getTree("zyjg");
    	var checkedNodes = tree.getCheckedNodes();
    	for(var i=0;i<checkedNodes.length;i++){
    		var item = checkedNodes[i];
    		if(item._data&&item._data.xian&&item._data.xian==zqCode){
    			return 1;
    		}
    	}
    	return 0;
    }
    /**
    * 清除地图交互
    */
    function clear() {
        var ia = map_.getMap().getInteractions().getArray();
        for (var i = 0; i < ia.length; i++) {
            if (ia[i] instanceof ol.interaction.Draw || ia[i] instanceof ol.interaction.Select) {
               /*ia[i].setActive(false)*/
            	map_.getMap().removeInteraction(ia[i]);
            	interaction_draw=null;
            }
        }
        map_.getLayerByName("BUFFER_LAYER").getSource().clear();
    }

    /**
     * 移出最后一个绘制点
     * */
    function removeLastPoint(){
    	if(interaction_draw&&interaction_draw.a&&interaction_draw.a&&interaction_draw.a[0].length>1){
    		interaction_draw.removeLastPoint();
    	}else if(interaction_draw&&interaction_draw.sketchCoords_
    			&&interaction_draw.sketchCoords_
    			&&interaction_draw.sketchCoords_[0].length>1){
    		interaction_draw.removeLastPoint();
    	}
    }
    ol.interaction.Draw.prototype.clearOverlay_=function(){
    	this.overlay_.getSource().clear();
    }
    	/**
	 * 扩展 点吸附（openlayers）
	 * */
	ol.interaction.Draw.prototype.atFinish_ = function(event) {
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
      }
    return {
        draw:draw,
        removeLastPoint:removeLastPoint,
        clear:clear
    }
});