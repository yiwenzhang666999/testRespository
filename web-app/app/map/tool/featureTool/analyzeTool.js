/**
 * 对应图层要素选择
 */
define([ 'map', 'queryLayer' ], function(map, queryLayer) {
	'use strict';
	var map_;

	var wktFormat = new ol.format.WKT();
	/**
	 * 初始化
	 * 
	 * @param {string}
	 *            name
	 * @param {function}
	 *            done
	 */
	function init(done) {
		map_ = map.getMap();
	}
	/**
	 * 执行图形分析
	 */
	function execute(feature) {

		var ajaxData = {};
		if (feature) {
			var fobj = feature.getProperties();
			if(fobj)
			ajaxData.fid = fobj.ID;
		}
		var callback = {
			callback : function(res) {
				var data = typeof res == 'object' ? res : JSON
						.parse(res);
				var html = getPopHtml(data);
				var ibox = $().iBox(
						{
							title : "叠加分析报告&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; 单位（公顷）",
							requestType : "html",
							html : html || '',
							containerId : "containerId_ibox",
							showMin : false,
							overlay : true,
							opacity : 0.5,
							callBack : function() {
								$(".zs-nicescroll").niceScroll({
									cursorcolor : "#777",
									cursorborder : "none",
								});
								$(".close-button").on('click', function() {
									$(".ibox-close").click();
								});
							}
						});
				ibox.showBox();
			},
			exceptionHandler : function(err) {

			}
		};
		httpRequest("", JSON.stringify(ajaxData), callback);
	}
	
	function getPopHtml(result){
		var html = "<form id='popIbox_analyze' style='width:400px'><table class='fore-common-form-tabs'>";
		var dilei = result.DI_LEI;
		var isPro = 0;
		if(JSON.stringify(dilei)!="{}"){
			var dileiHtml = "";
			var lastHtml = "";
			var total = 0;
			for(var key in dilei){
				var value_ = dilei[key];
				//value_ = 0.0666667*parseFloat(value_);
				if("0.00" != value_.toFixed(2)){
					total += parseFloat(value_);
					if((key.replace(/(^\s*)|(\s*$)/g, ""))==""){
						lastHtml +="<tr><td></td><td>" + (key.replace(/(^\s*)|(\s*$)/g, "")==""?"-":key)+"</td><td>"+value_.toFixed(2)+"</td></tr>";
					}else{
						dileiHtml +="<tr><td></td><td>" + (key.replace(/(^\s*)|(\s*$)/g, "")==""?"-":key)+"</td><td>"+value_.toFixed(2)+"</td></tr>";	
					}
				}
			}
			if("0.00" != total.toFixed(2))
			html +="<tr><td style='font-weight:bold;'>地类</td><td style='font-weight:bold;'>合计</td><td style='font-weight:bold;'>"+total.toFixed(2)+"</td></tr>";
			html += dileiHtml;
			html += lastHtml;
			isPro++;
		}
		var qiyuan = result.QI_YUAN;
		if(JSON.stringify(qiyuan)!="{}"){
			var qiyuanHtml = "";
			var lastHtml = "";
			var total = 0;
			for(var key in qiyuan){
				var value_ = qiyuan[key];
				//value_ = 0.0666667*parseFloat(value_);
				if("0.00" != value_.toFixed(2)){
					total += parseFloat(value_);
					if((key.replace(/(^\s*)|(\s*$)/g, ""))==""){
						lastHtml +="<tr><td></td><td>" + (key.replace(/(^\s*)|(\s*$)/g, "")==""?"-":key)+"</td><td>"+value_.toFixed(2)+"</td></tr>";
					}else{
						qiyuanHtml +="<tr><td></td><td>" + (key.replace(/(^\s*)|(\s*$)/g, "")==""?"-":key)+"</td><td>"+value_.toFixed(2)+"</td></tr>";
					}
				}
			}
			if("0.00" != total.toFixed(2))
			html +="<tr><td style='font-weight:bold;'>起源</td><td style='font-weight:bold;'>合计</td><td style='font-weight:bold;'>"+total.toFixed(2)+"</td></tr>";
			html += qiyuanHtml;
			html += lastHtml;
			isPro++;
		}
		var senlinlb = result.SEN_LIN_LB;
		if(JSON.stringify(senlinlb)!="{}"){
			var senlinlbHtml = "";
			var lastHtml = "";
			var total = 0;
			for(var key in senlinlb){
				var value_ = senlinlb[key];
				//value_ = 0.0666667*parseFloat(value_);
				if("0.00" != value_.toFixed(2)){
					total += parseFloat(value_);
					if((key.replace(/(^\s*)|(\s*$)/g, ""))==""){
						lastHtml +="<tr><td></td><td>" + (key.replace(/(^\s*)|(\s*$)/g, "")==""?"-":key)+"</td><td>"+value_.toFixed(2)+"</td></tr>";
					}else{
						senlinlbHtml +="<tr><td></td><td>" + (key.replace(/(^\s*)|(\s*$)/g, "")==""?"-":key)+"</td><td>"+value_.toFixed(2)+"</td></tr>";
					}
				}
			}
			if("0.00" != total.toFixed(2))
			html +="<tr><td style='font-weight:bold;'>森林类别</td><td style='font-weight:bold;'>合计</td><td style='font-weight:bold;'>"+total.toFixed(2)+"</td></tr>";
			html += senlinlbHtml;
			html += lastHtml;
			isPro++;
		}
		if(isPro==0)
			html+="<tr><td>分析结果无数据.</td></tr>"
		html+="</table></form>";
		return html;
	}
	/**
	 * 处理
	 */
	function httpRequest(url, datas, callback) {
		$.ajax({
			url : "analyze/execute.web",
			data : {data:datas},
			type : 'post',
			cache : false,
			//dataType : 'json',
			success : function(value) {
				if (value.result == "success") {
					callback.callback(value.data);
				}
			},
			error : function(evt) {
				if (evt.responseText == "timeout") {
					window.location.href = "login.do";
				} else {
					callback.exceptionHandler(evt);
				}
			}
		});
	}
	return {
		init : init,
		execute : execute
	}
});