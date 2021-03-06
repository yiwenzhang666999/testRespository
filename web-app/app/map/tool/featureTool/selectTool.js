/**
 * 要素选择
 */
define([
	'map', 'publicObj',
	'queryLayer', 'ztLayerCro','shdk'
], function (map, publicObj, queryLayer, ztLayerCro,shdk) {
	'use strict';
	var map_;
	var done_;
	var layer;
	var selectInteraction;
	var active = null;
	function setActive(bool, done) {
		if (bool == active) {
			return;
		}
		if (bool) {
			map_ = map.getMap();
			if (!layer) {
				layer = map.getLayerByName("HIGH_LAYER");
			}
			if (selectInteraction) {
				selectInteraction.setActive(bool);
			} else {
				selectInteraction = new ol.interaction.Select({
					layers: function (layer) {
						var layers = publicObj.getLayers();
						return layers.indexOf(layer) >= 0;
					},
					style: publicObj.defaultStyle
				});
				map_.addInteraction(selectInteraction);
				selectInteraction.on('select', function (e) {
					if (e.selected && e.selected.length > 0) {
						var f = e.selected[0];
						 /*判断是否为审核状态 */
            		   if($(".tool-sh").hasClass("selected")){
            			   /*清除原有元素*/
            			   for(var i=0;i< publicObj.features.length;i++){
            					var key = publicObj.features[i].getProperties().C_STATUS+"";
            		 		  publicObj.features[i].setStyle(publicObj.shStyleObj[key]);
            		 	   }
            		 	   if(layer&&publicObj.features&&layer.getSource().getFeatures().length>0){
            		 		   for(var i=0;i< publicObj.features.length;i++){
            		 			   layer.getSource().clear();
            		 		   }
            		 	   }
            		 	   publicObj.features= [];
            		 	   /*新增点击元素*/
            			   publicObj.features.push(f);
            			   f.setStyle(publicObj.selectStyle);
            			   layer.getSource().addFeature(f);
            			   /*获取小班审核数据*/
            			   shdk.getDataById(f.getProperties().ID,f.getProperties().C_XIAN);
            		   }else{
							var isAdd = true;
							for (var i = 0; i < publicObj.features.length; i++) {
								if (publicObj.features[i].getProperties().ID == f.getProperties().ID) {
									isAdd = false;
									var key = f.getProperties().C_STATUS + "";
									f.setStyle(publicObj.shStyleObj[key]);
									layer.getSource().removeFeature(f);
									publicObj.features.splice(i, 1);
									break;
								}
							}
							if (isAdd) {
								publicObj.features.push(f);
								f.setStyle(publicObj.selectStyle);
								layer.getSource().addFeature(f);
							}
							if (typeof done == 'function') {
								done(f);
							}
						}
					}
				});
			}
		} else {
			if (map_) {
				selectInteraction.setActive(bool);
			}
		}
		active = bool;
	}
	function clear() {
		if (map_ && selectInteraction) {
			selectInteraction.setActive(false);
			map_.removeInteraction(selectInteraction);
		}
		for (var i = 0; i < publicObj.features.length; i++) {
			var key = publicObj.features[i].getProperties().C_STATUS + "";
			publicObj.features[i].setStyle(publicObj.shStyleObj[key]);
		}
		if (layer) {
			layer.getSource().clear();
		}
		publicObj.features = [];
		selectInteraction = null;
		active = false;
	}
	ol.interaction.Select.handleEvent = function (mapBrowserEvent) {
		if (!this.condition_(mapBrowserEvent)) {
			return true;
		}
		var add = this.addCondition_(mapBrowserEvent);
		var remove = this.removeCondition_(mapBrowserEvent);
		var toggle = this.toggleCondition_(mapBrowserEvent);
		var set = !add && !remove && !toggle;
		var map = mapBrowserEvent.map;
		var features = this.featureOverlay_.getSource().getFeaturesCollection();
		var deselected = [];
		var selected = [];
		if (set) {
			// Replace the currently selected feature(s) with the feature(s) at the
			// pixel, or clear the selected feature(s) if there is no feature at
			// the pixel.
			ol.obj.clear(this.featureLayerAssociation_);
			map.forEachFeatureAtPixel(mapBrowserEvent.pixel,
				(
					/**
					 * @param {ol.Feature|ol.render.Feature} feature Feature.
					 * @param {ol.layer.Layer} layer Layer.
					 * @return {boolean|undefined} Continue to iterate over the features.
					 */
					function (feature, layer) {
						if (this.filter_(feature, layer)) {
							selected.push(feature);
							this.addFeatureLayerAssociation_(feature, layer);
							return !this.multi_;
						}
					}).bind(this), {
					layerFilter: this.layerFilter_,
					hitTolerance: this.hitTolerance_
				});
			var i;
			for (i = features.getLength() - 1; i >= 0; --i) {
				var feature = features.item(i);
				var index = selected.indexOf(feature);
				/*if (index > -1) {
					// feature is already selected
					selected.splice(index, 1);
				} else {*/
				features.remove(feature);
				deselected.push(feature);
				/*}*/
			}
			if (selected.length !== 0) {
				features.extend(selected);
			}
		} else {
			// Modify the currently selected feature(s).
			map.forEachFeatureAtPixel(mapBrowserEvent.pixel,
				(
					/**
					 * @param {ol.Feature|ol.render.Feature} feature Feature.
					 * @param {ol.layer.Layer} layer Layer.
					 * @return {boolean|undefined} Continue to iterate over the features.
					 */
					function (feature, layer) {
						if (this.filter_(feature, layer)) {
							if ((add || toggle) &&
								!ol.array.includes(features.getArray(), feature)) {
								selected.push(feature);
								this.addFeatureLayerAssociation_(feature, layer);
							} else if ((remove || toggle) &&
								ol.array.includes(features.getArray(), feature)) {
								deselected.push(feature);
								this.removeFeatureLayerAssociation_(feature);
							}
							return !this.multi_;
						}
					}).bind(this), {
					layerFilter: this.layerFilter_,
					hitTolerance: this.hitTolerance_
				});
			var j;
			for (j = deselected.length - 1; j >= 0; --j) {
				features.remove(deselected[j]);
			}
			features.extend(selected);
		}
		if (selected.length > 0 || deselected.length > 0) {
			this.dispatchEvent(
				new ol.interaction.Select.Event(ol.interaction.Select.EventType_.SELECT,
					selected, deselected, mapBrowserEvent));
		}
		return ol.events.condition.pointerMove(mapBrowserEvent);
	};
	return {
		setActive: setActive,
		clear: clear
	}
});