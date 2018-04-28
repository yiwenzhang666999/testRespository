/**
 * 地图设置功能js
 */
define(['map', 'publicObj'], function (map, publicObj) {
	function pop() {
		var ibox = $("#public_pop").modal({
			title: "设置",
			overlay: false,
			showMin: false,
			showMax: false,
			showTop: false,
			isDrag: true,
			contentWidth: 'auto',
			fullScreenId: "map_continer",
			type: "ajax",
			target: "./ibox/mapSetting.html",
			addCallBack: function () {
				$(".tool-qc").click();
				var arr = publicObj.queryWhereArr.clone();
				$("#mapSetting div input").each(function(index,element){
					if(arr.length==0){

					}else{
						for(var i=0;i<arr.length;i++){
							if(element.value+"" == arr[i]+""){
								element.checked = true;
								break;
							}
						}
					}
				});
				//绑定范围查询的审核状态查询条件
				$("#mapSetting input").bind('click', function (e) {
					var checked = e.target.checked;
					var value = e.target.value;
					publicObj.queryWhereArr.remove(value);
					if (checked) {
						publicObj.queryWhereArr.push(value);
					}
					refresh();
				});
			}
		});
		ibox.click();
	}
	function refresh() {
		var v = map.getMap().getView();
		var c = v.getCenter();
		c[1] = c[1] + 0.00000000001;
		v.setCenter([c[0], c[1]]);
	}
	return {
		pop: pop
	}
});
