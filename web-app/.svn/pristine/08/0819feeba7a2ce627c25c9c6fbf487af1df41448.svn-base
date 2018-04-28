/**
 * 查询服务接口
 * */
define([
    'map',
    'config', 'publicObj', 'util'
], function (map, config, publicObj, util) {
    'use strict';
    var geojsonFormat = new ol.format.GeoJSON();
    var defaultStyle = new ol.style.Style({
        fill: new ol.style.Fill({ color: "rgba(255,255,255,0)" }),
        stroke: new ol.style.Stroke({ color: 'rgb(255,255,0)', width: 3 })
    });
    /**
     * 针对geoServer进行查询（包括属性，空间) wfs方式
     * @param {object} options
     * @param {function} callBack
     */
    function query(options) {
        $.ajax(config.PROXY + '?' + options.url + '?', {
            type: 'GET',
            data: {
                service: 'WFS',
                version: '1.0.0',
                request: 'GetFeature',
                typename: options.typename, //服务名称
                outputFormat: 'application/json', //返回格式
                maxFeatures: 5000, //最大返回值
                filter: getFilter(options) //查询条件  可以传点、线、面、属性
            },
            success: options.success,
            error: function (err) {
                console.error("查询geoserver wfs 错误" + err);
            }
        });
    };
    /**
     * 拼接geoserver查询格式
     * */
    function getFilter(options) {
        var op = options.XY.toString();
        var geo = "the_geom";
        var filter = '<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><Intersects>  <PropertyName>' +
            geo + '</PropertyName>  <gml:Point>  <gml:coordinates>' +
            op + '</gml:coordinates>  </gml:Point>  </Intersects> </Filter>'
        return filter;
    };
    /**
     *空间查询
     *@parma option{coor,layerName,nd}
     *@callback function
     * */
    function queryBySpace(coor, nd, option, callback) {
        if (option.url) {
            var datas = {
                lng: coor[0],
                lat: coor[1],
                years: nd
            }
            $.ajax({
                url: option.url,
                type: "GET",
                data: datas,
                success: function (res) {
                    if (callback) {
                        callback(res);
                    }
                },
                error: function (err) {
                    console.error("调用易伟航接口错误：" + err);
                }
            });
        } else {
            if (option.queryType == "bhdk") {
                var data = { X: coor[0], Y: coor[1], nd: nd, queryType: "BHDK" };
                //callback({type:"bhdk","success":true,"data":'{"C_XIAN":"360323","C_HSBHYY":null,"L_LON_DEG":null,"D_CREATETIME":null,"C_CUN":"360323008010","D_EDITTIME":null,"C_YSBHYY":null,"I_EDITUSERID":null,"C_YIJU":null,"L_LAT_DEG":null,"C_NR":null,"C_XIANG":"360323008","C_XIAOBAN":"0037","ID":1278099,"D_AREA":2.806E-5,"I_CREATEUSERID":" ","OBJECTID":1}'});
            } else {
                var data = { X: coor[0], Y: coor[1], nd: nd, queryType: 'z', layerId: option.layerId };
            }
            $.ajax({
                url: "spaceQuery.do",
                type: "POST",
                data: { jsonStr: JSON.stringify(data) },
                success: function (res) {
                    if (callback) {
                        callback(res);
                    }
                },
                error: function (err) {
                    util.validateSession(err);
                    //console.error("查询服务错误："+err);
                }
            });
        }


    }
    /*
     * 获取政区名称方法（调用天地图接口）
     * center 点坐标数组
     * callback  回调函数
     * */
    function queryZqNameByPoint(center, callback) {
        var coorJson = "{'lon':" + center[0] + ",'lat':" + center[1] + ",'appkey':" + config.appKey + ",'ver':1}";
        $.ajax({
            url: config.queryZqUrl + "?",
            //                url:config.PROXY+"?"+config.queryZqUrl+"?",
            type: "GET",
            data: {
                postStr: coorJson,
                type: 'geocode'
            },
            success: function (res) {
                if (callback) {
                    callback(res);
                }
            },
            error: function (err) {
                console.error("调用地址逆编码错误：" + err);
            }
        });
    }
    /**
	 * 范围查询小班
	 * url:请求地址
	 * id:图层ID
	 * setColor:是否向图层填充颜色（false|ture）
	 * */
    function queryByExtent(url,id,setColor) {
        var newid = id;
        var layer =publicObj.getLayerByName(newid);
        $.ajax({
            url: url,//config.PROXY+"?"+"http://192.168.1.234:9010/web-ws/ws/rest/DS/export/zyjg/114.02255058289/27.5941747427/114.03551101685/27.604131102563/360323",
            type: "GET",
            success: function (res) {
                if (res.message == "sucess") {
                    var features = [];
                    var data = res.data;
                    for (var i = 0; i < data.length; i++) {
                        if (!isSelected_(data[i].id)) {
                            var status = data[i].status||'';
                            var geojson = {
                                type: 'Feature',
                                geometry: JSON.parse(data[i].shape),
                                properties: { ID: data[i].id, C_XIAN: data[i].xian, C_WORKYEAR: data[i].year,C_STATUS:status,I_CREATEUSERID:data[i].user_creat}
                            }
                            var feature = geojsonFormat.readFeature(geojson);
                            if (setColor) {
                                feature.setStyle(publicObj.shStyleObj[status]);
                            }
                            features.push(feature);
                        }
                    }
                    layer.getSource().clear();
                    layer.getSource().addFeatures(features.concat(publicObj.features));
                }else if(res.message=="error"){
                    console.log(res.message);
                    console.log(url);
                }
            },
            error: function (e) {
                console.log("查询服务出错！");
               /* if (newlayerObj[newid]) {
                    newlayerObj[newid].setVisible(false);
                    map.getMap().removeLayer(newlayerObj[newid]);
                    delete newlayerObj[newid];
                }*/
            }
        });
    }
    function query_ws(url, callback) {
        $.ajax({
            url: url,
            type: "GET",
            success: function (res) {
                if (res.message && res.message === "sucess") {
                    callback(res.data)
                }
            },
            error: function (e) {
                console.log(e);
            }

        });
    }
    function isSelected_(id) {
        var isSelect = false;
        for (var j = 0; j < publicObj.features.length; j++) {
            var item = publicObj.features[j].getProperties();
            if (id == item.ID) {
                isSelect = true;
                break;
            }
        }
        return isSelect;
    }
    return {
        query: query,
        queryBySpace: queryBySpace,
        queryZqNameByPoint: queryZqNameByPoint,
        queryByExtent: queryByExtent,
        query_ws: query_ws
    }
});