$(function(){
	(function($){
		$.fn.extend({
			idTabs:function(options){
				var opt=$.extend({
	                sClass: "selected",
	                event: "click"
					},options);
				opt.event+=".idTabs";
				return this.each(function() {
					var aList = [];
	            	var idList = [];
					$("a[href*='#']",this).each(function() {
						var id=$(this).attr("href").split("#")[1];
						if(id!=""){
							aList.push(this);
							idList.push("#"+id);	
						}
	                });
					var showIndex=0;
					for(var i=0,len=aList.length;i<len;i++){
						$(idList[i]).hide();
						if($(aList[i]).hasClass(opt.sClass)){
							showIndex=i;
						}
					}			
					$(aList[showIndex]).addClass(opt.sClass);
					$(idList[showIndex]).show();
					$(this).off(".idTabs").find("a[href*='#']").on(opt.event,function(e){
						eFunc.apply(this,[aList,idList]);
						e.preventDefault();
					});
	            });
	            function eFunc(){
					for(var i=0,len=arguments[0].length;i<len;i++){
						$(arguments[0][i]).removeClass(opt.sClass);
						$(arguments[1][i]).hide();
					}
					$(this).addClass(opt.sClass);
					$("#"+$(this).attr("href").split("#")[1]).show();
				}
			}
		});	
	})(jQuery);
})

$(function(){
	$(".idTabs").idTabs();
});