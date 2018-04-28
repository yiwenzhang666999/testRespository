/**
 * 公共变量
 * */
define(function () {
	var layerObj_bhdk = {};
	var layerObj_ywsj = {};
	var features = [];//选择集
	var queryWhereArr = ["0","1","2","3"];//分类筛选的条件数组
	var selectStyle = new ol.style.Style({
        fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
        stroke: new ol.style.Stroke({ color: 'rgb(255,0,0)', width: 3 })
    });
	var addStyle = new ol.style.Style({
        fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
        stroke: new ol.style.Stroke({ color: 'rgb(0, 153, 255)', width: 3 })
    });
	var defaultStyle = new ol.style.Style(
		{
			fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
			stroke: new ol.style.Stroke({ color: 'rgb(255,255,0)', width: 3 })
		}
	);
	var tgStyle = new ol.style.Style({
		fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
		stroke: new ol.style.Stroke({ color: 'rgb(0, 255, 51)', width: 3 })
	});
	var tgEditeStyle = new ol.style.Style({
		fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
		stroke: new ol.style.Stroke({ color: 'rgb(153, 255, 0)', width: 3 })
	});
	var btgStyle = new ol.style.Style({
		fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
		stroke: new ol.style.Stroke({ color: 'rgb(153, 153, 153)', width: 3 })
	});
	var mbhStyle = new ol.style.Style({
		fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
		stroke: new ol.style.Stroke({ color: 'rgb(0,0,255)', width: 3 })
	});
	var shStyleObj = {
		"0":defaultStyle,//未审核
		"1": tgStyle,//通过
		"2": tgEditeStyle,//通过（有修改）
		"3": btgStyle,//重做
		"-1": mbhStyle//无变化
	}
	function getLayerByName(layerName) {
		var layer = null;
		if (layerObj_bhdk[layerName]) {
			layer = layerObj_bhdk[layerName];
		} else {
			layer = layerObj_ywsj[layerName];
		}
		return layer;
	}
	function getLayers() {
		var layers = [];
		for (var obj in layerObj_bhdk) {
			if (obj) {
				layers.push(layerObj_bhdk[obj]);
			}
		}
		return layers;
	}
	function setBHDKLayer(layerName,layer){
		layerObj_bhdk[layerName] = layer;
	}
	function setYWSJLayer(layerName,layer){
		layerObj_bhdk[layerName] = layer;
	}
	function removeLayer(name){
		delete layerObj_bhdk[name];
		delete layerObj_ywsj[name];

	}
	return {
		shStyleObj: shStyleObj,
		features: features,
		queryWhereArr:queryWhereArr,
		selectStyle:selectStyle,
		addStyle:addStyle,
		defaultStyle:defaultStyle,
		getLayerByName: getLayerByName,
		setBHDKLayer:setBHDKLayer,
		setYWSJLayer:setYWSJLayer,
		getLayers: getLayers,
		removeLayer:removeLayer
	}
});