require.config({
	urlArgs: "v=2.0", // 版本号
	paths: {
		//单例map
		map: "app/map/map",
		severZtree:"app/map/tool/severZtree",
		ztLayerCro:"app/map/tool/ztLayerCro",
		querySpace:"app/query/querySpace",
		queryLayer:"app/query/queryLayer",
		config: "app/config",
        layerFactory: "app/map/factory/layerFactory",   //图层生成工厂（简单工厂）
        //制图
        configMap:"app/printImg/config",
        canvasDarg:"app/printImg/canvasDarg",
        printCanvas:"app/printImg/printCanvas",
        //出图
        zyjg_map:"app/zyjg/zyjg_map",
        zyjg:"app/zyjg/zyjg",//资源监管js

		util:"app/util/util",
		addTool:"app/map/tool/featureTool/addTool",//区划（创建）
		selectTool:"app/map/tool/featureTool/selectTool",//选择
		toolCro:"app/map/tool/toolCro",//工具方法绑定类
		drawBufferMap:"app/map/tool/drawBufferMap",//绘画工具，新增工具用
		managerTool:"app/map/tool/featureTool/managerTool",//工具转换类
		modifyTool:"app/map/tool/featureTool/modifyTool",//图形编辑
		paramTool:"app/map/tool/featureTool/paramTool",//属性编辑
		unionTool:"app/map/tool/featureTool/unionTool",//合并
		measureMap:"app/map/tool/measureMap",//测量类
        drawMap:"app/map/tool/drawMap",//绘画工具
		publicObj:"app/map/tool/publicObj",//公用方法绑定类
		analyzeTool:"app/map/tool/featureTool/analyzeTool",//叠加分析
		splitTool:"app/map/tool/featureTool/splitTool",//修边
		cutTool:"app/map/tool/featureTool/cutTool",//分割
		style:"app/map/tool/style/style",//默认样式
        
        treeHelper:"app/treeHelper",
        bhdk:"app/bhdk/bhdk",
        loadTree:"app/loadTree/loadTree",
        shapefile:"app/shapeImport/shapefile",
        shapeMain:"app/shapeImport/main",
	},
	waitSeconds: 0 // 加载等待时间 设置为0 没有限制
})
colorManager = {
	textColor :"#C2CFDA"
}