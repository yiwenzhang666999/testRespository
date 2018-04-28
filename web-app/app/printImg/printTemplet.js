define(["util"],function(util) {
	'use strict';
	function init() {
		//保存模板
		$(".tool-gcmb").on("click",saveTemplet);
	}
	/**
	 * 保存模板
	 */
	function saveTemplet(pos){
		var data={
			option:JSON.stringify(pos),
			id:-1,
			isDefault:-1,
			templetName:"制图模板"+configMap.getDate("yyyyMMddhhmmss")
		}
		$.ajax({
	        url: "printMap/add.do",
	        type: "post",
	        data:{data:JSON.stringify(data)},
	        error: function(e) {
	        	util.validateSession(err);
	        	if(e.statusText=="OK"){
	        		$("body").html(JSON.parse(e.responseText).html);
	        	}
	        },
	        success: function(c) {
	        	$("body").html(c.html);
	        }
	    })
	}
	return {
		init:init,
	}
});