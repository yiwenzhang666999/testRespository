/**
 * 
 */
window.FsService = {};
(function(){
	var FsService = window.FsService;
	    FsService.schemaCode=getSchemaCodeByUserCode(userObj.zqCode);
	/**
	 * 保存/新增记录
	 */
	FsService.save = function(tableName, jsonStr, callback) {
		$.ajax({
			url : 'app/save.do',
			data : {data:JSON.stringify({tableName : tableName,xian:FsService.schemaCode,jsonStr : jsonStr})},
			type : 'post',
			cache : false,
			dataType : 'json',
			success : function(value) {
				if(value.result=="success"){
					callback.callback(value.data);
				}
			},
			error : function(evt) {
				if(evt.responseText=="timeout"||evt.status==0){
					mini.alert("当前用户失效，请重新登录！","温馨提示");
					window.location.href = "logout.do";
				}
				callback.exceptionHandler(evt);
			}
		});
	}
	/**
	 * 批量保存记录
	 */
	FsService.saveList = function(tableName, jsonStr, callback) {
		$.ajax({
			url : 'app/saveList.do',
			data : {data:JSON.stringify({tableName : tableName,xian:FsService.schemaCode,jsonStr : jsonStr})},
			type : 'post',
			cache : false,
			dataType : 'json',
			success : function(value) {
				if(value.result=="success"){
					callback.callback(value.data);
				}
			},
			error : function(evt) {
				if(evt.responseText=="timeout"||evt.status==0){
					mini.alert("当前用户失效，请重新登录！","温馨提示");
					window.location.href = "logout.do";
				}
				callback.exceptionHandler(evt);
			}
		});
	}
	/**
	 * 更新记录
	 */
	FsService.update = function(tableName, updateFilter, callback) {
		$.ajax({
			url : 'app/update.do',
			data : {data:JSON.stringify({tableName : tableName,xian:FsService.schemaCode,updateFilter : updateFilter})},
			type : 'post',
			cache : false,
			dataType : 'json',
			success : function(value) {
				if(value.result=="success"){
					callback.callback(value.data);
				}
			},
			error : function(evt) {
				if(evt.responseText=="timeout"||evt.status==0){
					mini.alert("当前用户失效，请重新登录！","温馨提示");
					window.location.href = "logout.do";
				}
				callback.exceptionHandler(evt);
			}
		});
	}	
	/**
	 * 删除记录
	 */
	FsService.del = function(tableName, queryFilter, callback) {
		$.ajax({
			url : 'app/del.do',
			data : {data:JSON.stringify({tableName : tableName,xian:FsService.schemaCode,queryFilter : queryFilter})},
			type : 'post',
			cache : false,
			dataType : 'json',
			success : function(value) {
				if(value.result=="success"){
					callback.callback(value.data);
				}
			},
			error : function(evt) {
				if(evt.responseText=="timeout"||evt.status==0){
					mini.alert("当前用户失效，请重新登录！","温馨提示");
					window.location.href = "logout.do";
				}
				callback.exceptionHandler(evt);
			}
		});
	}
	/**
	 * 分页查询满足条件的所有记录
	 */
	FsService.pageSelect = function(tableName, queryFilter, pageInfo, callback) {
		$.ajax({
			url : 'app/pageSelect.do',
			data : {data:JSON.stringify({tableName : tableName,xian:FsService.schemaCode,queryFilter : queryFilter,pageInfo : pageInfo})},
			type : 'post',
			cache : false,
			dataType : 'json',
			success : function(value) {
				if(value.result=="success"){
					callback.callback(value.data);
				}
			},
			error : function(evt) {
				if(evt.responseText=="timeout"||evt.status==0){
					mini.alert("当前用户失效，请重新登录！","温馨提示");
					window.location.href = "logout.do";
				}else{
					callback.exceptionHandler(evt);
				}
			}
		});
	}
	/**
	 * 查询满足条件的所有记录
	 */
	FsService.getEntityList = function(tableName, param, callback) {
		$.ajax({
			url : 'app/getEntityList.do',
			data : {data:JSON.stringify({tableName : tableName,xian:FsService.schemaCode,param : param})},
			type : 'post',
			cache : false,
			dataType : 'json',
			success : function(value) {
				if(value.result=="success"){
					callback.callback(value.data);
				}
			},
			error : function(evt) {
				if(evt.responseText=="timeout"||evt.status==0){
					mini.alert("当前用户失效，请重新登录！","温馨提示");
					window.location.href = "logout.do";
				}else{
					callback.exceptionHandler(evt);
				}
			}
		});
	}
	/**
	 * 根据唯一值字段查询
	 */
	FsService.getUniqueValue = function(tableName, uniqueField, addCaptionField,whereString, callback) {
		$.ajax({
			url : 'form/getUniqueValue.do',
			data : {data:JSON.stringify({tableName : tableName,uniqueField : uniqueField,addCaptionField:addCaptionField,whereString: whereString})},
			type : 'post',
			cache : false,
			dataType : 'json',
			success : function(value) {
				if(value.result=="success"){
					callback.callback(value.data);
				}
			},
			error : function(evt) {
				if(evt.responseText=="timeout"||evt.status==0){
					mini.alert("当前用户失效，请重新登录！","温馨提示");
					window.location.href = "logout.do";
				}
				callback.exceptionHandler(evt);
			}
		});
	}
	/**
	 * 查询指定rootId下一级所有节点
	 */
	FsService.getNextAllChilds = function(tableName, rootId, callback) {
		$.ajax({
			url : 'app/getNextAllChilds.do',
			data : {data:JSON.stringify({tableName : tableName,pid : rootId})},
			type : 'post',
			cache : false,
			dataType : 'json',
			success : function(value) {
				if(value.result=="success"){
					callback.callback(value.data);
				}
			},
			error : function(evt) {
				if(evt.responseText=="timeout"||evt.status==0){
					mini.alert("当前用户失效，请重新登录！","温馨提示");
					window.location.href = "logout.do";
				}
				callback.exceptionHandler(evt);
			}
		});
	}
	/**
	 * 执行sql查询
	 * */
	FsService.getDataTableSql=function(tableName, sql, callback){
		$.ajax({
			url:"app/getDataTableSql.do",
			type:"POST",
			data:{data:JSON.stringify({xian:FsService.schemaCode,tableName:tableName,sql:sql,para:[]})},
			success:function(value){
				if(value.result=="success"){
					callback.callback(value.data);
				}
			},
			error:function(evt){
				if(evt.responseText=="timeout"||evt.status==0){
					window.location.href = "logout.do";
				}else{
					callback.exceptionHandler(evt);
				}
			}
		});
	}
	function getSchemaCodeByUserCode(zqCode){
		if(zqCode.indexOf("20000")==-1){
    		return zqCode.substring(0,2);
    	}else{
    		return "200000";
    	}
	}
})();
