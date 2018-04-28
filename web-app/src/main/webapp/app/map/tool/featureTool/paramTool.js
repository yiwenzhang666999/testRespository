/**
 *  要素属性编辑
 */
define(function () {
    'use strict';
    function handler(f,done) {
    	if(f){
    		var MBID = f.getProperties().I_MBID;
    		var template=null;
    		for(var i=0;i<templates.length;i++){
    			var item = templates[i];
    			if(item.ID==MBID){
    				template=item;
    			}
    		}
    		done(null,f,templates[0]);
    	}else{
    		mini.alert("请选择一个图形！","温馨提示");
    	}
    }
    return {
        handler: handler
    }
});