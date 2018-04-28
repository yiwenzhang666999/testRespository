/**
 * 配置map图层
 * 说明：MINZOOM: 8, //显示级别控制（不包含本身）  最小 注意：此处如8级显示配8级  另外与openlayer差两级级  openlayer10级为此处8级 下同
       MAXZOOM: 10, //显示级别控制 最大
   在config.js中修改内容时注释格式
   修改人：xxx
   修改时间：xxx
   ------------------------------------------------------------------
   (修改内容)
   ------------------------------------------------------------------
 */
define(function () {
    'use strict';
     window.appid_ = 'ZYJG' // 定义临时appid
    /*---------------------地图服务地址配置-------------------*/
    //代理地址--支持带参
    var proxyUrl = "http://" + window.location.host + "/" + window.location.href.split(window.location.host + '/')[1].split('/')[0] + "/proxy?url=";
    //易伟航专题服务
    var tiledefine = 'http://124.193.194.36/earth/evts?format=image/jpg&scene={scene}&type=edom&t=1469495862223&x={x}&y={y}&l={z}&ds=';
    //天地图内网地址
    var tdtService = 'http://t{0-7}.tianditu.com';
    //mapZone瓦片服务
    var mapZoneService = "http://192.168.1.164:9000/map_tile_server";
    //mapZone动态服务
    var mapZoneDyService = "http://124.193.194.36/mapzone";//为映射外网
    /*---------------------地图、图层基本配置-------------------*/
    var config = {
    		//提示文字
    		hintInfo:"",
    		//是否启用ws查询
    		isLocal:true,
    		//查询政区树
    		publicService:"http://192.168.1.234:9010/web-ws",
            //代理文件地址
            PROXY: "http://" + window.location.host + "/" + window.location.href.split(window.location.host + '/')[1].split('/')[0] + "/proxy.jsp",
            //i键查询
            queryUrl:"http://124.193.194.36/forestry/getlinbanpoi",
            //queryUrl:"http://192.168.1.48:8081/ldbggzpt/testQuery.web",
            //geoserver的服务的i键查询
            geoQueryUrl:"http://192.168.1.84:9000/geoserver/ldgx/wms",
            //geoQueryUrl:"http://10.1.12.20:9001/geoserver/ldgx/wms",
            //赤城县I键查询
            ccxQueryUrl:"http://124.193.194.36/forestry/getztxiaobanpoi",
            //地图中心点查询政区名地址
            queryZqUrl:"http://www.tianditu.com/query.shtml",
            //中心点查询政区时用到的天地图的授权key
            appKey:"8a7b9aac0db21f9dd995e61a14685f05",
            //查询影像的时相服务(内网服务地址，暂时用的是公网的)
            yxDateQueryUrl:"http://10.1.12.29:7090/dateTiff",
            //查询影像的时相服务(公网服务地址)
            yxDateQueryUrlNow:"http://60.194.14.226:7090/dateTiff?",
            //配准误差服务
            pzErrorUrl:"http://124.193.194.36/gisservice/coordtrans/evaluate",
            //地图基础配置
            MAP: {
                WKID: '4490', //地理坐标参考
                EXTENT: [-180, -90, 180, 90],//minx,miny,maxx,maxy
                CENTER: [108.77, 34.39],
                ZOOM: 4,
                MAXZOOM: 18,
                MINZOOM: 1
            },
            //图层配置
            LAYER: [
                {
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "TDT",   //来源天地图
                    TABLENAME: 'TIAN_VEC', //图层名称----唯一标识   一般命名为表名
                    TITLE: "政区",
                    VISIBLE: true,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 360 / (256 * 2),
                    ORIGIN: [-180, 90],
                    URL: tdtService + "/DataServer?T=vec_c&x={x}&y={y}&l={z}",
                    GROUP: [
                        {
                            TYPE: "TILE", //图层的类型  瓦片
                            TABLENAME: 'TIAN_CVA', //天地图政区
                            TITLE: "标注", //图层名称----唯一标识   一般命名为表名
                            VISIBLE: true,
                            OGC: "XYZ",
                            SOURCE: "TDT",   //来源天地图
                            OPACITY: 1,           //图层透明度
                            FIRSTDPI: 360 / (256 * 2),
                            ORIGIN: [-180, 90],
                            URL: tdtService + "/DataServer?T=cva_c&x={x}&y={y}&l={z}",
                            zIndex:20005,//显示顺序
                        }
                    ]
                },
                {
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "TDT",   //来源天地图
                    TABLENAME: 'TIAN_IMG', //图层名称----唯一标识   一般命名为表名
                    TITLE: "影像",
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 360 / (256 * 2),
                    ORIGIN: [-180, 90],
                    URL: tdtService + "/DataServer?T=img_c&x={x}&y={y}&l={z}",
                    GROUP: [
                        {
                            TYPE: "TILE", //图层的类型  瓦片
                            TABLENAME: 'TIAN_CIA', //天地图政区
                            LAYER: "cia_c",         //图层类型
                            TITLE: "标注", //图层名称----唯一标识   一般命名为表名
                            VISIBLE: false,
                            OGC: "XYZ",
                            SOURCE: "TDT",   //来源天地图
                            OPACITY: 1,           //图层透明度
                            FIRSTDPI: 360 / (256 * 2),
                            ORIGIN: [-180, 90],
                            URL: tdtService + "/DataServer?T=cia_c&x={x}&y={y}&l={z}",
                            zIndex:10005,//显示顺序
                        }
                    ]
                },
              //易伟航 专题图
    			//政区底图
    			{
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "EVIAL",   //来源天地图
                    TABLENAME: 'GJX', //图层名称----唯一标识   一般命名为表名
                    TITLE: "政区",
                    MINZOOM: 0, //显示级别控制  最小     -----可配可不配
                    MAXZOOM: 5, //显示级别控制  最大    -----可配可不配
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 90 / 256,
                    ORIGIN: [0, 0],
    				SCENE: "guojie",
                    URL: tiledefine + '0',
                    zIndex:10005//2009年
                },
                //林地影像
                {
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "EVIAL",   //
                    TABLENAME: 'LDYX', //图层名称----唯一标识   一般命名为表名
                    TITLE: "林地影像",
                    MINZOOM: 0, //显示级别控制  最小     -----可配可不配
                    MAXZOOM: 18, //显示级别控制  最大    -----可配可不配
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 90 / 256,
                    ORIGIN: [0, 0],
    				SCENE: "default",
                    URL: tiledefine + 'g0',  //2009年
                    zIndex:10001
                },
                //2016影像
                {
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "WMTS",
                    SOURCE: "",
                    TABLENAME: 'YNYBYX', //图层名称----唯一标识   一般命名为表名
                    LAYER:"satImage",
                    VERSION:"1.0.0",
                    TITLE: "影像",
                    MINZOOM: 0, //显示级别控制  最小     -----可配可不配
                    MAXZOOM: 18, //显示级别控制  最大    -----可配可不配
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 180 / 256,
                    ORIGIN: [-180, 90],
    				SCENE: "default",
                    URL: 'http://60.194.14.226:7090/onemap/rest/wmts?ACCOUNT=ghyforestry&PASSWD=ghyforestry',
                    zIndex:10001
                },
                //2017影像
                {
                	TYPE: "TILE", //图层的类型  瓦片
                	OGC: "WMTS",
                	SOURCE: "",
                	TABLENAME: 'SSYX', //图层名称----唯一标识   一般命名为表名
                	LAYER:"satImage",
                	VERSION:"1.0.0",
                	TITLE: "影像",
                	MINZOOM: 0, //显示级别控制  最小     -----可配可不配
                	MAXZOOM: 18, //显示级别控制  最大    -----可配可不配
                	VISIBLE: false,
                	OPACITY: 1,     //图层透明度
                	FIRSTDPI: 180 / 256,
                	ORIGIN: [-180, 90],
                	SCENE: "default",
                    URL: 'http://60.194.14.226:7090/rest/wmts?ACCOUNT=ghyforestry&PASSWD=ghyforestry',
                    zIndex:10001
                },
    			//林地小班和注记
    			{
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "EVIAL",   //来源天地图
                    TABLENAME: 'LDXB', //图层名称----唯一标识   一般命名为表名
                    //zIndex:10001,//显示顺序
                    MINZOOM: 9, //显示级别控制  最小     -----可配可不配
                    MAXZOOM: 15, //显示级别控制  最大    -----可配可不配
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 90 / 256,
                    ORIGIN: [0, 0],
    				SCENE:"default",//服务名称
                    URL: tiledefine + 'g2',   //2009年  2015(g36)
                    zIndex:10004,
                    GROUP: [
                        {
                            TYPE: "TILE", //图层的类型  瓦片
                            OGC: "XYZ",
                            SOURCE: "EVIAL",   //来源天地图
                            TABLENAME: 'LDZJ', //图层名称----唯一标识   一般命名为表名//注记
                            //zIndex:10001,//显示顺序
                            MINZOOM: 9, //显示级别控制  最小     -----可配可不配
                            MAXZOOM: 15, //显示级别控制  最大    -----可配可不配
                            VISIBLE: false,
                            OPACITY: 1,     //图层透明度
                            FIRSTDPI: 90 / 256,
                            ORIGIN: [0, 0],
                            URL: tiledefine + 'g3',   //2009年  2015(g37)
    						SCENE:"default",//服务名称
    						zIndex:10004
                        }
                    ]
                },
                //===============================
                {
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "EVIAL",   //来源天地图
                    TABLENAME: 'GJZDJCQ', //图层名称----唯一标识   一般命名为表名
                    TITLE: "重点监测区",
                    MINZOOM: 1, //显示级别控制  最小     -----可配可不配 注意：此处如8级显示配8级  另外与openlayer差三级  openlayer11级为此处8级 下同
                    MAXZOOM: 18, //显示级别控制  最大    -----可配可不配  注意：此处如10级显示需要配置11
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 90 / 256,
                    ORIGIN: [0, 0],
    				SCENE:"QGyjbhdj",//服务名称
                    URL: tiledefine + '36',   //2009年
                    zIndex:10003//显示顺序
                },
                //国家自然保护区
                {
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "EVIAL",   //来源天地图
                    TABLENAME: 'GJZRBHQ', //图层名称----唯一标识   一般命名为表名
                    TITLE: "国家自然保护区",
                    MINZOOM: 1, //显示级别控制  最小     -----可配可不配 注意：此处如8级显示配8级  另外与openlayer差三级  openlayer11级为此处8级 下同
                    MAXZOOM: 18, //显示级别控制  最大    -----可配可不配  注意：此处如10级显示需要配置11
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 90 / 256,
                    ORIGIN: [0, 0],
    				SCENE:"QGyjbhdj",//服务名称
                    URL: tiledefine + '35',   //2009年
                    zIndex:10003//显示顺序
                },
              //国家自然保护区(涉及县)
                {
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "EVIAL",   //来源天地图
                    TABLENAME: 'GJZRBHQ_XIAN', //图层名称----唯一标识   一般命名为表名
                    TITLE: "国家自然保护区(县)",
                    MINZOOM: 1, //显示级别控制  最小     -----可配可不配 注意：此处如8级显示配8级  另外与openlayer差三级  openlayer11级为此处8级 下同
                    MAXZOOM: 18, //显示级别控制  最大    -----可配可不配  注意：此处如10级显示需要配置11
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 90 / 256,
                    ORIGIN: [0, 0],
    				SCENE:"QGyjbhdj",//服务名称
                    URL: tiledefine + '34',   //2009年
                    zIndex:10003//显示顺序
                },
                //================================
              //调查范围界限
    			{
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "EVIAL",   //来源天地图
                    TABLENAME: 'XZQH', //图层名称----唯一标识   一般命名为表名
                    TITLE: "行政区划",
                    MINZOOM: 1, //显示级别控制  最小     -----可配可不配 注意：此处如8级显示配8级  另外与openlayer差三级  openlayer11级为此处8级 下同
                    MAXZOOM: 10, //显示级别控制  最大    -----可配可不配  注意：此处如10级显示需要配置11
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 90 / 256,
                    ORIGIN: [0, 0],
    				SCENE:"default",//服务名称
                    URL: tiledefine + 'g1',   //2009年
                    zIndex:10005//显示顺序
                },
                /**
                 * 资源监管图层配置
                 * */
              //芦溪影像2015
                {
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "EVIAL",   //来源天地图
                    TABLENAME: 'LXYX2015', //图层名称----唯一标识   一般命名为表名
                    TITLE: "芦溪影像2015",
                    MINZOOM: 1, //显示级别控制  最小     -----可配可不配 注意：此处如8级显示配8级  另外与openlayer差三级  openlayer11级为此处8级 下同
                    MAXZOOM: 18, //显示级别控制  最大    -----可配可不配  注意：此处如10级显示需要配置11
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 90 / 256,
                    ORIGIN: [0, 0],
    				SCENE:"jiangxiluxi",//服务名称
                    URL: tiledefine + '2',   
                    zIndex:10002//显示顺序
                },
                //芦溪影像2017
                {
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "EVIAL",   //来源天地图
                    TABLENAME: 'LXYX2017', //图层名称----唯一标识   一般命名为表名
                    TITLE: "芦溪影像2017",
                    MINZOOM: 1, //显示级别控制  最小     -----可配可不配 注意：此处如8级显示配8级  另外与openlayer差三级  openlayer11级为此处8级 下同
                    MAXZOOM: 18, //显示级别控制  最大    -----可配可不配  注意：此处如10级显示需要配置11
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 90 / 256,
                    ORIGIN: [0, 0],
    				SCENE:"jiangxiluxi",//服务名称
                    URL: tiledefine + '1',   
                    zIndex:10002//显示顺序
                },
                //沙县影像2016
              {
                  TYPE: "TILE", //图层的类型  瓦片
                  OGC: "XYZ",
                  SOURCE: "EVIAL",   //来源天地图
                  TABLENAME: 'SXYX2016', //图层名称----唯一标识   一般命名为表名
                  TITLE: "沙县影像2016",
                  MINZOOM: 1, //显示级别控制  最小     -----可配可不配 注意：此处如8级显示配8级  另外与openlayer差三级  openlayer11级为此处8级 下同
                  MAXZOOM: 18, //显示级别控制  最大    -----可配可不配  注意：此处如10级显示需要配置11
                  VISIBLE: false,
                  OPACITY: 1,     //图层透明度
                  FIRSTDPI: 90 / 256,
                  ORIGIN: [0, 0],
  				  SCENE:"16_17_fujian_yingxiang",//服务名称
                  URL: tiledefine + '1',   
                  zIndex:10002//显示顺序
              },
              //沙县影像2017
              {
                  TYPE: "TILE", //图层的类型  瓦片
                  OGC: "XYZ",
                  SOURCE: "EVIAL",   //来源天地图
                  TABLENAME: 'SXYX2017', //图层名称----唯一标识   一般命名为表名
                  TITLE: "沙县影像2017",
                  MINZOOM: 1, //显示级别控制  最小     -----可配可不配 注意：此处如8级显示配8级  另外与openlayer差三级  openlayer11级为此处8级 下同
                  MAXZOOM: 18, //显示级别控制  最大    -----可配可不配  注意：此处如10级显示需要配置11
                  VISIBLE: false,
                  OPACITY: 1,     //图层透明度
                  FIRSTDPI: 90 / 256,
                  ORIGIN: [0, 0],
  				  SCENE:"16_17_fujian_yingxiang",//服务名称
                  URL: tiledefine + '2',   
                  zIndex:10002//显示顺序
              },
              //建宁影像2016
                {
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "EVIAL",   //来源天地图
                    TABLENAME: 'JNYX2016', //图层名称----唯一标识   一般命名为表名
                    TITLE: "建宁影像2016",
                    MINZOOM: 1, //显示级别控制  最小     -----可配可不配 注意：此处如8级显示配8级  另外与openlayer差三级  openlayer11级为此处8级 下同
                    MAXZOOM: 18, //显示级别控制  最大    -----可配可不配  注意：此处如10级显示需要配置11
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 90 / 256,
                    ORIGIN: [0, 0],
    				SCENE:"16_17_fujian_yingxiang",//服务名称
                    URL: tiledefine + '0',   
                    zIndex:10002//显示顺序
                },
                //建宁影像2017
                {
                    TYPE: "TILE", //图层的类型  瓦片
                    OGC: "XYZ",
                    SOURCE: "EVIAL",   //来源天地图
                    TABLENAME: 'JNYX2017', //图层名称----唯一标识   一般命名为表名
                    TITLE: "建宁影像2017",
                    MINZOOM: 1, //显示级别控制  最小     -----可配可不配 注意：此处如8级显示配8级  另外与openlayer差三级  openlayer11级为此处8级 下同
                    MAXZOOM: 18, //显示级别控制  最大    -----可配可不配  注意：此处如10级显示需要配置11
                    VISIBLE: false,
                    OPACITY: 1,     //图层透明度
                    FIRSTDPI: 90 / 256,
                    ORIGIN: [0, 0],
    				SCENE:"16_17_fujian_yingxiang",//服务名称
                    URL: tiledefine + '3',   
                    zIndex:10002//显示顺序
                },
                
                //辽宁影像
                {
                	TYPE: "TILE", //图层的类型  瓦片
                	OGC: "XYZ",
                	SOURCE: "EVIAL",   //来源天地图
                	TABLENAME: 'LNYX2017', //图层名称----唯一标识   一般命名为表名
                	TITLE: "辽宁影像2017",
                	MINZOOM: 1, //显示级别控制  最小     -----可配可不配 注意：此处如8级显示配8级  另外与openlayer差三级  openlayer11级为此处8级 下同
                	MAXZOOM: 18, //显示级别控制  最大    -----可配可不配  注意：此处如10级显示需要配置11
                	VISIBLE: false,
                	OPACITY: 1,     //图层透明度
                	FIRSTDPI: 90 / 256,
                	ORIGIN: [0, 0],
                	SCENE:"default",//服务名称
                	URL: tiledefine + 'g47',   
                	zIndex:10002//显示顺序
                },
                {
                	TYPE: "TILE", //图层的类型  瓦片
                	OGC: "XYZ",
                	SOURCE: "EVIAL",   //来源天地图
                	TABLENAME: 'HBYX2017', //图层名称----唯一标识   一般命名为表名
                	TITLE: "塞罕坝影像2017",
                	MINZOOM: 1, //显示级别控制  最小     -----可配可不配 注意：此处如8级显示配8级  另外与openlayer差三级  openlayer11级为此处8级 下同
                	MAXZOOM: 18, //显示级别控制  最大    -----可配可不配  注意：此处如10级显示需要配置11
                	VISIBLE: false,
                	OPACITY: 1,     //图层透明度
                	FIRSTDPI: 90 / 256,
                	ORIGIN: [0, 0],
                	SCENE:"saihanba",//服务名称
                	URL: tiledefine + '0',   
                	zIndex:10002//显示顺序
                }
            ],
            LDXB_PY: {
                DETAILS: {  //详情展示字段
                	sheng_name: "省(森工集团)",
                    xian_name: "县(林业局)",
                    /*lin_ye_ju: "林业局",*/
                    xiang_name: "乡(林场)",
                    /*lin_chang: "乡(林场)",*/
                    cun_name:"村(林班)",
                    /*lin_ban: "村(林班)",*/
                    xiao_ban: "小班",
                    di_mao: "地貌",
                    po_xiang: "坡向",
                    po_wei: "坡位",
                    po_du: "坡度",
                    ke_ji_du: "交通区位",
                    tu_rang_lx: "土壤类型",
                    tu_ceng_hd: "土层厚度",
                    mian_ji: "面积",
                    ld_qs: "土地权属",
                    GJGYL_BHDJ:"国家级公益林保护等级",
                    di_lei: "地类",
                    lin_zhong: "林种",
                    qi_yuan: "起源",
                    sen_lin_lb: "森林类别",
                    shi_quan_d: "事权等级",
                    g_cheng_lb: "工程类别",
                    ling_zu: "龄组",
                    yu_bi_du: "郁闭度/覆盖度",
                    YOU_SHI_SZ:"优势树种",
                    pingjun_xj: "平均胸径",
                    huo_lmgqxj: "公顷蓄积(活立木)",
                    mei_gq_zs: "每公顷株树",
                    td_th_lx: "土地退化类型",
                    DISPE:"灾害类型",
                    DISASTER_C:"灾害等级",
                    zl_dj: "林地质量等级",
                    ld_kd: "林带宽度",
                    ld_cd: "林带长度",
                    bh_dj: "保护等级",
                    LYFQ:"林地功能分区",
                    QYKZ:"主体功能区",
                    GLLX:"土地管理类型",
                    Remarks:"说明"
                },
                SIMPLE: {    //简单展示字段
                	sheng_name: "省(森工集团)",
                    xian_name: "县(林业局)",
                    /*lin_ye_ju: "林业局",*/
                    xiang_name: "乡(林场)",
                    /*lin_chang: "乡(林场)",*/
                    cun_name:"村(林班)",
                    /*lin_ban: "村(林班)",*/
                    xiao_ban: "小班",
                }
            },
            test:{
            	DETAILS:{
            		"样地号_":"样地号_","XB_DL":"小班地类","PD_DL":"判读地类","YD_DL":"样地地类","HS_DL":"核实地类"
            	},
            	SIMPLE:{
            		"样地号_":"样地号_","XB_DL":"小班地类","PD_DL":"判读地类","YD_DL":"样地地类","HS_DL":"核实地类"
            	}
            }

        }
    /*---------------------设置常见的投影-------------------*/
    proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
    proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
    //zone=25
    proj4.defs("EPSG:2349","+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=25500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=26
    proj4.defs("EPSG:2350","+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=26500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=27
    proj4.defs("EPSG:2351","+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=27500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=28
    proj4.defs("EPSG:2352","+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=28500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=29
    proj4.defs("EPSG:2353","+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=29500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=30
    proj4.defs("EPSG:2354","+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=30500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=31
    proj4.defs("EPSG:2355","+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=31500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=32
    proj4.defs("EPSG:2356","+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=32500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=33
    proj4.defs("EPSG:2357","+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=33500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=34
    proj4.defs("EPSG:2358","+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=34500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=35
    proj4.defs("EPSG:2359","+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=35500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=36
    proj4.defs("EPSG:2360","+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=37
    proj4.defs("EPSG:2361","+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=38
    proj4.defs("EPSG:2362","+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=38500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=39
    proj4.defs("EPSG:2363","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=40
    proj4.defs("EPSG:2364","+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=41
    proj4.defs("EPSG:2365","+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=41500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=42
    proj4.defs("EPSG:2366","+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=42500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=43
    proj4.defs("EPSG:2367","+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=43500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=44
    proj4.defs("EPSG:2368","+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=44500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    //zone=45
    proj4.defs("EPSG:2369","+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=45500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");
    return config;
});