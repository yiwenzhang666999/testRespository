/**
 * 集成系统的数据服务
 */
define([''],function () {
        /**
         * 查询方案表服务
         * tableName:表名 String
         * queryFilter:条件 queryFilter{}
         * option:回调函数
         */
        function getReportProList(tableName,whereStr,option){
        	var datas={tableName:tableName,whereStr:whereStr};
        	$.ajax({
    			url:"getReportProList.web",
    			type:"POST",
    			data:{data:JSON.stringify(datas)},
    			cache : false,
    			dataType : 'json',
    			success :option.callback,
    			error:option.exceptionHandler
    		});
        } 
        function getReportZqList(tableName,whereStr,selectVal,option){
        	var datas={tableName:tableName,whereStr:whereStr,selectVal:selectVal};
        	$.ajax({
    			url:"getReportZqList.web",
    			type:"POST",
    			data:{data:JSON.stringify(datas)},
    			cache : false,
    			dataType : 'json',
    			success :option.callback,
    			error:option.exceptionHandler
    		});
        }
        return {
        	getReportProList:getReportProList,
        	getReportZqList:getReportZqList
        }
    });