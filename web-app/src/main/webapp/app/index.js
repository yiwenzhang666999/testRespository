/**
 * 所有模块js文件引入配置
 */
require.config({
	urlArgs: "v=2.0"/*+new Date().getTime()*/, // 版本号
	paths: {
		//单例map
		map: "app/map/map",
		severZtree:"app/map/tool/severZtree",
		ztLayerCro:"app/map/tool/ztLayerCro",
		querySpace:"app/query/querySpace",
		queryLayer:"app/query/queryLayer",
		//工具
		attrQuery:"app/attrQuery",
		util:"app/util/util",
		toolCro:"app/map/tool/toolCro",//工具方法绑定类
		publicObj:"app/map/tool/publicObj",//公用方法绑定类
		drawMap:"app/map/tool/drawMap",//绘画工具,其他工具用
		drawBufferMap:"app/map/tool/drawBufferMap",//绘画工具，新增工具用
		mapSetting:"app/map/tool/mapSetting",//地图的设置工具
		addTool:"app/map/tool/featureTool/addTool",//区划（创建）
		selectTool:"app/map/tool/featureTool/selectTool",//选择
		splitTool:"app/map/tool/featureTool/splitTool",//修边
		cutTool:"app/map/tool/featureTool/cutTool",//分割
		burrowTool:"app/map/tool/featureTool/burrowTool",//挖洞
		unionTool:"app/map/tool/featureTool/unionTool",//合并
		paramTool:"app/map/tool/featureTool/paramTool",//属性编辑
		analyzeTool:"app/map/tool/featureTool/analyzeTool",//叠加分析
		modifyTool:"app/map/tool/featureTool/modifyTool",//图形编辑
		measureMap:"app/map/tool/measureMap",//测量类
		style:"app/map/tool/style/style",//默认样式
		managerTool:"app/map/tool/featureTool/managerTool",//工具转换类

		/*----- factory-------------------*/
        layerFactory: "app/map/factory/layerFactory",   //图层生成工厂（简单工厂）
        pointQuery:"app/map/tool/pointQuery",
        zyjg:"app/zyjg/zyjg",//资源监管js
        config: "app/config",
        report: "app/report/report",//报表统计
        reportService: "app/service/reportService",//查询数据库,
        //导入shape
        shapefile:"app/shapeImport/shapefile.min",
        shapeMain:"app/shapeImport/main",
        treeHelper:"app/treeHelper",
        bhdk:"app/bhdk/bhdk",
        shdk:"app/bhdk/shdk",
        loadTree:"app/loadTree/loadTree",
        //制图
        configMap:"app/printImg/config",
        canvasDarg:"app/printImg/canvasDarg",
        printCanvas:"app/printImg/printCanvas",
        zyjg_map:"app/zyjg/zyjg_map",
        printElement:"app/printImg/printElement",
        printTemplet:"app/printImg/printTemplet",
	},
	waitSeconds: 0  // 加载等待时间 设置为0 没有限制
});
