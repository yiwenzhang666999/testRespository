define(function(){window.appid_="ZYJG";var f="http://"+window.location.host+"/"+window.location.href.split(window.location.host+"/")[1].split("/")[0]+"/proxy?url=";var a="http://124.193.194.36/earth/evts?format=image/jpg&scene={scene}&type=edom&t=1469495862223&x={x}&y={y}&l={z}&ds=";var c="http://t{0-7}.tianditu.com";var d="http://192.168.1.164:9000/map_tile_server";var e="http://124.193.194.36/mapzone";var b={hintInfo:"",isLocal:true,publicService:"http://192.168.1.234:9010/web-ws",PROXY:"http://"+window.location.host+"/"+window.location.href.split(window.location.host+"/")[1].split("/")[0]+"/proxy.jsp",queryUrl:"http://124.193.194.36/forestry/getlinbanpoi",geoQueryUrl:"http://192.168.1.84:9000/geoserver/ldgx/wms",ccxQueryUrl:"http://124.193.194.36/forestry/getztxiaobanpoi",queryZqUrl:"http://www.tianditu.com/query.shtml",appKey:"8a7b9aac0db21f9dd995e61a14685f05",yxDateQueryUrl:"http://10.1.12.29:7090/dateTiff",yxDateQueryUrlNow:"http://60.194.14.226:7090/dateTiff?",pzErrorUrl:"http://124.193.194.36/gisservice/coordtrans/evaluate",MAP:{WKID:"4490",EXTENT:[-180,-90,180,90],CENTER:[108.77,34.39],ZOOM:4,MAXZOOM:18,MINZOOM:1},LAYER:[{TYPE:"TILE",OGC:"XYZ",SOURCE:"TDT",TABLENAME:"TIAN_VEC",TITLE:"政区",VISIBLE:true,OPACITY:1,FIRSTDPI:360/(256*2),ORIGIN:[-180,90],URL:c+"/DataServer?T=vec_c&x={x}&y={y}&l={z}",GROUP:[{TYPE:"TILE",TABLENAME:"TIAN_CVA",TITLE:"标注",VISIBLE:true,OGC:"XYZ",SOURCE:"TDT",OPACITY:1,FIRSTDPI:360/(256*2),ORIGIN:[-180,90],URL:c+"/DataServer?T=cva_c&x={x}&y={y}&l={z}",zIndex:20005,}]},{TYPE:"TILE",OGC:"XYZ",SOURCE:"TDT",TABLENAME:"TIAN_IMG",TITLE:"影像",VISIBLE:false,OPACITY:1,FIRSTDPI:360/(256*2),ORIGIN:[-180,90],URL:c+"/DataServer?T=img_c&x={x}&y={y}&l={z}",GROUP:[{TYPE:"TILE",TABLENAME:"TIAN_CIA",LAYER:"cia_c",TITLE:"标注",VISIBLE:false,OGC:"XYZ",SOURCE:"TDT",OPACITY:1,FIRSTDPI:360/(256*2),ORIGIN:[-180,90],URL:c+"/DataServer?T=cia_c&x={x}&y={y}&l={z}",zIndex:10005,}]},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"GJX",TITLE:"政区",MINZOOM:0,MAXZOOM:5,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"guojie",URL:a+"0",zIndex:10005},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"LDYX",TITLE:"林地影像",MINZOOM:0,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"default",URL:a+"g0",zIndex:10001},{TYPE:"TILE",OGC:"WMTS",SOURCE:"",TABLENAME:"YNYBYX",LAYER:"satImage",VERSION:"1.0.0",TITLE:"影像",MINZOOM:0,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:180/256,ORIGIN:[-180,90],SCENE:"default",URL:"http://60.194.14.226:7090/onemap/rest/wmts?ACCOUNT=ghyforestry&PASSWD=ghyforestry",zIndex:10001},{TYPE:"TILE",OGC:"WMTS",SOURCE:"",TABLENAME:"SSYX",LAYER:"satImage",VERSION:"1.0.0",TITLE:"影像",MINZOOM:0,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:180/256,ORIGIN:[-180,90],SCENE:"default",URL:"http://60.194.14.226:7090/rest/wmts?ACCOUNT=ghyforestry&PASSWD=ghyforestry",zIndex:10001},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"LDXB",MINZOOM:9,MAXZOOM:15,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"default",URL:a+"g2",zIndex:10004,GROUP:[{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"LDZJ",MINZOOM:9,MAXZOOM:15,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],URL:a+"g3",SCENE:"default",zIndex:10004}]},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"GJZDJCQ",TITLE:"重点监测区",MINZOOM:1,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"QGyjbhdj",URL:a+"36",zIndex:10003},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"GJZRBHQ",TITLE:"国家自然保护区",MINZOOM:1,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"QGyjbhdj",URL:a+"35",zIndex:10003},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"GJZRBHQ_XIAN",TITLE:"国家自然保护区(县)",MINZOOM:1,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"QGyjbhdj",URL:a+"34",zIndex:10003},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"XZQH",TITLE:"行政区划",MINZOOM:1,MAXZOOM:10,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"default",URL:a+"g1",zIndex:10005},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"LXYX2015",TITLE:"芦溪影像2015",MINZOOM:1,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"jiangxiluxi",URL:a+"2",zIndex:10002},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"LXYX2017",TITLE:"芦溪影像2017",MINZOOM:1,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"jiangxiluxi",URL:a+"1",zIndex:10002},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"SXYX2016",TITLE:"沙县影像2016",MINZOOM:1,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"16_17_fujian_yingxiang",URL:a+"1",zIndex:10002},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"SXYX2017",TITLE:"沙县影像2017",MINZOOM:1,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"16_17_fujian_yingxiang",URL:a+"2",zIndex:10002},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"JNYX2016",TITLE:"建宁影像2016",MINZOOM:1,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"16_17_fujian_yingxiang",URL:a+"0",zIndex:10002},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"JNYX2017",TITLE:"建宁影像2017",MINZOOM:1,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"16_17_fujian_yingxiang",URL:a+"3",zIndex:10002},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"LNYX2017",TITLE:"辽宁影像2017",MINZOOM:1,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"default",URL:a+"g47",zIndex:10002},{TYPE:"TILE",OGC:"XYZ",SOURCE:"EVIAL",TABLENAME:"HBYX2017",TITLE:"塞罕坝影像2017",MINZOOM:1,MAXZOOM:18,VISIBLE:false,OPACITY:1,FIRSTDPI:90/256,ORIGIN:[0,0],SCENE:"saihanba",URL:a+"0",zIndex:10002}],LDXB_PY:{DETAILS:{sheng_name:"省(森工集团)",xian_name:"县(林业局)",xiang_name:"乡(林场)",cun_name:"村(林班)",xiao_ban:"小班",di_mao:"地貌",po_xiang:"坡向",po_wei:"坡位",po_du:"坡度",ke_ji_du:"交通区位",tu_rang_lx:"土壤类型",tu_ceng_hd:"土层厚度",mian_ji:"面积",ld_qs:"土地权属",GJGYL_BHDJ:"国家级公益林保护等级",di_lei:"地类",lin_zhong:"林种",qi_yuan:"起源",sen_lin_lb:"森林类别",shi_quan_d:"事权等级",g_cheng_lb:"工程类别",ling_zu:"龄组",yu_bi_du:"郁闭度/覆盖度",YOU_SHI_SZ:"优势树种",pingjun_xj:"平均胸径",huo_lmgqxj:"公顷蓄积(活立木)",mei_gq_zs:"每公顷株树",td_th_lx:"土地退化类型",DISPE:"灾害类型",DISASTER_C:"灾害等级",zl_dj:"林地质量等级",ld_kd:"林带宽度",ld_cd:"林带长度",bh_dj:"保护等级",LYFQ:"林地功能分区",QYKZ:"主体功能区",GLLX:"土地管理类型",Remarks:"说明"},SIMPLE:{sheng_name:"省(森工集团)",xian_name:"县(林业局)",xiang_name:"乡(林场)",cun_name:"村(林班)",xiao_ban:"小班",}},test:{DETAILS:{"样地号_":"样地号_",XB_DL:"小班地类",PD_DL:"判读地类",YD_DL:"样地地类",HS_DL:"核实地类"},SIMPLE:{"样地号_":"样地号_",XB_DL:"小班地类",PD_DL:"判读地类",YD_DL:"样地地类",HS_DL:"核实地类"}}};proj4.defs("EPSG:4490","+proj=longlat +ellps=GRS80 +no_defs");proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");proj4.defs("EPSG:2349","+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=25500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2350","+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=26500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2351","+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=27500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2352","+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=28500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2353","+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=29500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2354","+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=30500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2355","+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=31500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2356","+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=32500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2357","+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=33500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2358","+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=34500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2359","+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=35500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2360","+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2361","+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2362","+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=38500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2363","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2364","+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2365","+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=41500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2366","+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=42500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2367","+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=43500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2368","+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=44500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");proj4.defs("EPSG:2369","+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=45500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs");return b});