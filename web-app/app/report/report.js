/**
 * 报表统计和导出功能
 */
define([
    'map','config','reportService','publicObj','util','severZtree'
], function (map,config,reportService,publicObj,util,severZtree) {
	'use strict';
	var formHtml_Report = "";
    function init() {
    	//绑定报表统计时，所用到的点击事件
        $("#startReportBtn").bind("click", startReport);
        //调查区域下拉选择值改变时，触发定位事件
        //TODO 无法定位默认区域，需要更改，但是定位事件的位置，需要思考
        $("#tjzq_where").on("change",zqChange_tj);
        //关闭按钮
        $("#bd-tj .tj_close").click(function(){
        	$("#bd-tj").hide();
        	$(".tool-tj").removeClass("selected");
        })
        //单选按钮值发生变化时，下拉框的显隐
        $("#bd-tj .content .line input[type='radio'][name='bdsj']").change(function(e){
        	if($(this).val()=='1'){
        		$('#tjzq_where').show();
        	}else{
        		$('#tjzq_where').hide();
        	}
        })
        //绑定自定义统计按钮的点击事件
    	//TODO 如果统计方式的li是动态生成的话，要添加属性统计报表的ID值，来生成li标签
       //createList();
       $(".tool-tj").click(tjbbInit);
    }
    function tjbbInit(){
    	var formWidth = $(document).width()-200;
        var fullScreenId="map_continer";
    	createZqList("");
        /*$("#customReport").modal({
 			title: "自定义报表",//标题
 			overlay: true,//遮罩层
 			showMin: true,//最小化
 			showMax: false,//最大化
 			showTop: false,//置顶
 			isDrag: true,//移动
 			fullScreenId:fullScreenId,
 			contentWidth: formWidth,//主体宽度 适用于 ajax clone类型
 			type:"ajax",//请求类型  img ajax iframe alert confirm prompt clone
 			target: "./ibox/customReport.html"//引入的页面(请求···)
 			//addCallBack:formLoad//添加页面之后的加载回调
 		});*/
        $("#startFormBtn").modal({
 			title: "报表统计",//标题
 			overlay: true,//遮罩层
 			showMin: true,//最小化
 			showMax: false,//最大化
 			showTop: false,//置顶
 			isDrag: true,//移动
 			fullScreenId:fullScreenId,
 			contentWidth: formWidth,//主体宽度 适用于 ajax clone类型
 			type:"ajax",//请求类型  img ajax iframe alert confirm prompt clone
 			target: "./ibox/reportForm.html",//引入的页面(请求···)
 			addCallBack:formLoad//添加页面之后的加载回调
 		});
    }
    //生成li标签中的报表方案
    function createList(){
    	//进行查表获取报表方案，遍历，拼接HTML放到页面中
    	var tableName = "";
    	var whereStr = "1=1";
    	var option ={
    			//生成li标签的HTML字符串
    			callback:function(res){
    				var contList = $("#bd-tj .content .item .gdtj");
    				contList.append(res[0]);
    			},
    			exceptionHandler:function(evt){
    				console.log("错误信息："+evt);
    			}
    	};
    	reportService.getReportProList(tableName,whereStr,option);
    }
    
    //生成下拉政区中的数据
    function createZqList(selectVal){
    	if(!selectVal){
    		var selectVal ="";
    	}else{
    		var selectVal = selectVal
    	}
    	var tableName = "FS_BUSINESS_USERBUSLAYERS";
    	//TODO 现在是值根据用户ID和APPID来查找，appID是在config中赋值的，暂为'ZYJG'.
    	var userInfo = userObj;
    	var userId = userInfo.userId;
    	var appId = window.appid_;
    	var whereStr = "I_USERID = '"+userId+"' and C_APPID ='"+appId+"'";
    	var option ={
    			//生成li标签的HTML字符串
    			callback:function(res){
    				var contList = $("#tjzq_where");
    				if(!res){
    					var zqHtml = "<option value =''>无政区数据</option>";
    					contList.html(zqHtml);
    				}else if(res.length>0){
	    				contList.html(res[0]);
    				}else{
    					var zqHtml = "<option value =''>无政区数据</option>";
    					contList.html(zqHtml);
    				}
    			},
    			exceptionHandler:function(evt){
    				console.log("错误信息："+evt);
    			}
    	};
    	reportService.getReportZqList(tableName,whereStr,selectVal,option);
    }
    //下拉选择定位
    function zqChange_tj(){
    	var zqCode = $("#tjzq_where").val();
		//缩放级别
		var level = 14;
		severZtree.zqDw(zqCode,level);
    }
    //开始统计报表
	function startReport(){
		//显示加载
		openAlert();
		var selReport = $("#bd-tj .content .item li.selected");
		//customId为固定表头的报表的ID
		var customId = selReport.attr("customId");
		//reportId为方案报表的ID
		var reportId = selReport.attr("reportId");
		var selWhere = $("#bd-tj .content .item p input[name='bdsj']:checked");
		var zqWhere = "";
		var queryId = "";
		var whereStr ="";
		var code = "";
		if(selWhere.val()==0){
			var features = publicObj.features;
			var arrId = [];
			if(features.length==0&&!reportId){
				mini.alert('未选中变化地块！',"温馨提示");
				closeAlert();
				return;
			}
			/*features.length=0;*/
			$("#startFormBtn").click();
			for(var i = 0;i<features.length;i++){
				arrId.push(features[i].getProperties().ID);
			}
			/*arrId.push('1437');
			arrId.push('1442');*/
			queryId = arrId.toString();
			whereStr = {};
			zqWhere = features[0].getProperties().C_XIAN;
			//判断地图上是否存在范围
		}else{
			$("#startFormBtn").click();
			var xianCode = $('#tjzq_where').val();
			zqWhere = xianCode;
			whereStr = {"XIAN":xianCode};
		}
		//TODO strFilter没值
		var strFilter ="";
		//判断选中的报表是什么报表,reportId有值为固定报表，反之为自定义报表
		if(reportId){
			//TODO 测试数据
			var whereString = whereStr;
			var country = selReport.text().replace(/(^\s*)|(\s*$)/g, "");
			fixedReportFun(reportId,whereString,strFilter,country,reportCallBack);
		}else if(customId){
			customReportFun(queryId,zqWhere,customId);
		}else{
			customReportFun(queryId,zqWhere);
		}
		
	}
	
	/**
	 * 固定报表统计方法
	 * reportId:固定报表的ID
	 * queryJson:统计条件
	 * strFilter:统计单位(调查范围)
	 * country:  表头名称
	 * showthead: 1表示只显示表头，2，表示显示表头和表内容
	 * TODO strFilter 页面中没有选择功能
	 */
	function fixedReportFun(id,queryJson,strFilter,country,callback){
		//参数：String reportId, String queryJson, String strFilter
		//strFilter:"XIAN,XIANG"
		var data = {"reportId":id,"strFilter":strFilter,"queryJson":JSON.stringify(queryJson),showthead:'2',country:country};
    	$.ajax({
			type: 'POST',
			url: "report/showreport.do",
			data:data,
			success:function(res){
				callback(res);
				},
			dataType: "json",
			error:function(err){
				util.validateSession(err);
			}
		});
    
	}
	
    //回调方法
    function reportCallBack(res){
    	closeAlert();
    	$(".reportFormTitle").hide();
    	$("#ExcelExport").show();
    	//返回的res结果是HTML字符串
    	//整合字符串，替换个别特殊字符
    	var htmlData = res[0].replace(/\"/g,"\'");
    	//截取字符串
		var startTh = htmlData.substring(0,htmlData.indexOf("<\/thead>")+8);
		var endTh = htmlData.substring(htmlData.indexOf("<\/thead>")+8);
		var pageWidth =  $(document).width()-200;
  		var pageHeight = $(".tjbb_reportView ").height()-$("#senfe").height();
  		//报表滚动条出现高度
		var endHeight = pageHeight - $(".tjbb_reportTitle").height() - $(".tjbb_reportDw").height();
		//将thead中的td替换为th
	    startTh = startTh.replace(/td/g,"th");
	    startTh = "<div id='reportHead' >" + startTh + "</table></div>";
	    endTh = "<div id='reportBody' ><table id='data_table'>" + endTh + "</div>";
  		//添加HTML节点
	    formHtml_Report = formHtml_Report;
	    $(".tjbb_reportView").html(startTh + endTh);
		setCss(pageWidth,endHeight,res);
		//合计行高亮显示
		var tabData=$(".tjbb_reportView tbody")
	    setDataTabCss(tabData);
    }
    
    //设置报表样式
    function setCss(pageWidth,endHeight,res){
    	//设置样式
    	$("#reportHead").css({ 
            "width":pageWidth,
            "overflow":"hidden"
        });
        $("#reportBody").css({ 
            "width":pageWidth,
            "height":endHeight - $("#reportHead").height()-20,
            "overflow":"auto"
        });
        var theadWidth=$(".tjbb_reportView table>thead").width();
        if(theadWidth<(pageWidth-40)){
        	$(".tjbb_reportView table").css("width",pageWidth-18);
        }else{
        	 $(".tjbb_reportView table").css("width",(res[1]+1)*150+1);//设置表宽度，避免IE出现表头与表身不对应（IE必须给固定宽度）
        }
    }
    
    //合计行高亮显示
    function setDataTabCss(tabData){
		var trrArray = tabData.find("tr");
		for (var i = 0; i < trrArray.length; i++) {
			if (trrArray[i].textContent.indexOf("合计") > -1) {
				for (var j = 1; j < trrArray[i].cells.length; j++) {
					if (trrArray[i].cells[j].getAttribute("rowspan") == "1") {
						trrArray[i].cells[j].style.color = "#F30";
						trrArray[i].cells[j].style.backgroundColor = "#A4FAA6";
					}
				}
			}
		}
	
    }
    function scrollDouble(divId,e) {//控制表头的左右移动。
        document.getElementById(divId).scrollLeft = e.scrollLeft;
    }
	/**
	 *自定义报表统计方法
	 */
	function customReportFun(queryId,zqWhere,customId){
		var queryJson = {XIAN:zqWhere,ID:queryId};
		if(customId){
			//var queryJson = "XIAN = '360323' and XIANG = '360323008' and CUN = '360323008010'";
			//var queryJson = {XIAN:"",ID:"12469"};
	    	var datas = {whereStr:queryJson,customId:customId};
	    	//请求后台，对数据进行拼接成HTML表格
			$.ajax({
				url:"getHeadReportData.web",
				type:"POST",
				data:{data:JSON.stringify(datas)},
				cache : false,
				dataType : 'json',
				success :function(result){
					if(result){
						if(result[0]){
					    	$("#ExcelExport").show();
							$(".tjbb_reportView").html(result[0].html);
							//合并合计项
							/*var totalCol = result[0].html.replace("<td></td><td></td><td></td><td></td>","<td colspan='4'>合计</td>");
							$(".tjbb_reportView").html(totalCol);*/
							formHtml_Report = result[0].html;
						}else if(!result.result){
							$(".reportFormTitle").html('统计数据报错,原因:'+result.message);
						}
					}else{
						$(".reportFormTitle").html('统计数据为空！');
					}
					closeAlert();
				},
				error:function(err){
					console.error(err);
				}
			});
		}else{
			var zq_code="";
			var bhtbId ="";
			//var queryJson = {XIAN:zq_code,ID:bhtbId};
			//var queryJson = {XIAN:"",ID:"12469"};
			var table_Name = "变化图斑叠加分析统计表";
			var unitName = "统计单位：公顷";
			var crosswise ={DI_LEI:"地类",QI_YUAN:"起源",SEN_LIN_LB:"森林（林地）类别",SHI_QUAN_D:"事权等级",BH_DJ:"林地保护等级"};
			var lengthways = [{C_XIANNAME:"县"},{C_XIANG:"乡"},{C_CUN:"村"},{C_XIAOBAN:"图斑号"},{MIAN_JI:"面积"}];
			var commonArr = {C_YSBHYY:"疑似变化原因",C_HSBHYY:"核实变化原因",C_YIJU:"依据"};
	    	var datas = {tableName:table_Name,unitName:unitName,crosswise:crosswise,lengthways:lengthways,commonArrs:commonArr,whereStr:queryJson};
	    	//请求后台，对数据进行拼接成HTML表格
			$.ajax({
				url:"getReportData.web",
				type:"POST",
				data:{data:JSON.stringify(datas)},
				cache : false,
				dataType : 'json',
				success :function(result){
					if(result){
						if(result[0]){
					    	$("#ExcelExport").show();
							$(".tjbb_reportView").html(result[0].html);
							//合并合计项
							/*var totalCol = result[0].html.replace("<td></td><td></td><td></td><td></td>","<td colspan='4'>合计</td>");
							$(".tjbb_reportView").html(totalCol);*/
							formHtml_Report = result[0].html;
						}else if(!result.result){
							$(".reportFormTitle").html('统计数据报错,原因:'+result.message);
						}
					}else{
						$(".reportFormTitle").html('统计数据为空！');
					}
					closeAlert();
				},
				error:function(err){
					console.error(err);
				}
			});
		}
		
	}
	/**
	 * 页面加载之后的回调
	 * 把组装的HTML放到弹框中
	 */
	function formLoad(){
   		//报表导出按钮
        $("#ExcelExport").bind("click", excelExport);
	}
	/**
	 * 导出报表
	 */
	function excelExport(){
		openAlert();
		var selReport = $("#bd-tj .content .item li.selected");
		//customId为固定表头的报表的ID
		var customId = selReport.attr("customId");
		//reportId为方案报表的ID
		var reportId = selReport.attr("reportId");
		var selWhere = $("#bd-tj .content .item p input[name='bdsj']:checked");
		var zqWhere = "";
		var queryId = "";
		var whereStr ="";
		//判断是什么统计范围.0:地图画范围，需要服务返回条件。1:为全县数据
		if(selWhere.val()==0){
			var features = publicObj.features;
			var arrId = [];
			for(var i = 0;i<features.length;i++){
				arrId.push(features[i].getProperties().ID);
			}
			queryId = arrId.toString();
			whereStr = {};
		}else{
			var xianCode = $('#tjzq_where').val();
			zqWhere = xianCode;
			whereStr = {"XIAN":xianCode};
		}
		//TODO strFilter没值
		var strFilter ="";
		//判断选中的报表是什么报表,reportId有值为固定报表，反之为自定义报表
		if(reportId){
			var whereString = whereStr;
			var country = selReport.text().replace(/(^\s*)|(\s*$)/g, "");
			fixedExportFun(reportId,whereString,strFilter,country);
		}else if(customId){
			customExportFun(queryId,zqWhere,customId);
		}else{
			customExportFun(queryId,zqWhere);
		}
	}
	/**
	 固定报表导出方法
	 * reportId:固定报表的ID
	 * queryJson:统计条件
	 * strFilter:统计单位(调查范围)
	 * strFilter 页面中没有选择功能（为空）
	 */
	function fixedExportFun(reportId,queryJson,strFilter,country){
		var data = {"reportId":reportId,"queryJson":JSON.stringify(queryJson),"strFilter":strFilter,"country":country};
 		var form=$(".gjj-tjbb_form");
 		var url="report/exportExcel.do?";
 		form.attr("action",url);
 		var input_Id=$(".tjbb_reportId");
 		var input_Json=$(".tjbb_queryJson");
 		var input_Filter=$(".tjbb_strFilter");
 		input_Id.attr("value",data.reportId);
 		input_Json.attr("value",data.queryJson);
 		input_Filter.attr("value",data.strFilter);
 		form.submit();
 		closeAlert();
	}
    function formSubmit(data){
    	var url = 'customExportExcel.web';
		var formHtml = '<form action="'+url+'" method="post" style="display:none;" target="_blank">';
		formHtml += "<input type='hidden' name='data' value='"+JSON.stringify(data)+"'>";
 		formHtml += '</form>';
		$(formHtml).appendTo($('body')).submit();
		$(formHtml).remove();
	  	closeAlert();
    }
	/**
	 * 自定义导出报表
	 * 
	 */
	function customExportFun(queryId,zqWhere,customId){
		var queryJson = {XIAN:zqWhere,ID:queryId};
		if(customId){
			//var queryJson = "XIAN = '360323' and XIANG = '360323008' and CUN = '360323008010'";
			//var queryJson = {XIAN:"",ID:"12469"};
			var unitName = "统计单位：公顷";
			var data={
					fileName:"变化图斑叠加分析统计表"	,
					sheetName:"变化图斑叠加分析统计表",
					whereStr:queryJson,
					customId:customId,
					unitName:unitName
					}
			formSubmit(data);
//			$.ajax({
//		        url: "customExportExcel.web",
//		        data:{data:JSON.stringify(data)},
//		        type: "post",
//		        error: function(e) {
//		        	closeAlert();
//		        },
//		        success: function(c) {
//		        	closeAlert();
//		        	var path="./upload/"+data.fileName+".xls";
//		        	window.open(path,"_blank");
//		        }
//		    })
		}else{
			//var queryJson = "XIAN = '360323' and XIANG = '360323008' and CUN = '360323008010'";
			//var queryJson = {XIAN:"",ID:"12469"};
			var crosswise ={DI_LEI:"地类",QI_YUAN:"起源",SEN_LIN_LB:"森林（林地）类别",SHI_QUAN_D:"事权等级",BH_DJ:"林地保护等级"};
			var lengthways = [{XIAN_NAME:"县"},{XIANG_NAME:"乡"},{CUN_NAME:"村"},{XIAO_BAN:"小班"},{D_AREA:"图斑面积"},{C_YSBHYY:"疑似变化原因"},{C_HSBHYY:"核实变化原因"},{C_YIJU:"依据"}];
	    	var unitName = "统计单位：公顷";
			var data={
					fileName:'变化图斑叠加分析统计表',
					sheetName:'变化图斑叠加分析统计表',
					crosswise:crosswise,
					lengthways:lengthways,
					whereStr:queryJson,
					unitName:unitName
					}
			formSubmit(data);
//			$.ajax({
//		        url: "customExportExcel.web",
//		        data:{data:JSON.stringify(data)},
//		        type: "post",
//		        error: function(e) {
//		        	closeAlert();
//		        },
//		        success: function(c) {
//		        	closeAlert();
//		        	var path="./upload/"+data.fileName+".xls";
//		        	window.open(path,"_blank");
//		        }
//		    })
		}
		
	}
	
    return {
        init: init,
        createZqList:createZqList
    }
})