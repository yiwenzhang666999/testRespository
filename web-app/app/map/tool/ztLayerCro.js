/**
 * 右下角图层控制工具
 */
define([
    'map',
    'config'
], function (map,config) {
    'use strict';
    function init() {
        moEvent();
        layerCtr();
    }
    /**
     * 鼠标事件
     */
    function moEvent() {
        $('.mapType-wrapper').mouseenter(function () {
            if ($('.mapType').is(":animated")) { return; }
            $('.mapType').animate({
                width: '864px',
                backgroundColor: 'rgba(255, 255, 255, .4)',
            }, 0);
            $('.mapTypeCard.second').animate({ right: '105px' }, 0);
            $('.ldxb').animate({ right: '201px' }, 0);
            $('.dcfw').animate({ right: '297px' }, 0);
            $('.ygyx').animate({ right: '393px' }, 0);
        })
        // 鼠标移出右下角地图切换
        $('.mapType-wrapper').mouseleave(function () {
            if ($('.mapType').is(":animated")) { return; }
            $('.mapType').delay('2000').animate({
                width: '110px',
                backgroundColor: 'rgba(255, 255, 255, 0)',
            }, 0);
            $('.mapTypeCard.second').delay('2000').animate({ right: '12px' }, 0);
            $('.ldxb,.dcfw,.ygyx').delay('2000').animate({ right: '20px' }, 0);
        })
    }
    /**
     * 图层控制
     */
    function layerCtr() {
        $(".mapType-wrapper .clk").on("click", function () {
            var $target = $(this);
            setTimeout(function(){
            	var bool_all = $target.hasClass("switch");
                var bool_sig = $target.hasClass("single");
                //
                var show_layer = $target.attr("layer");
                var hide_layer = $target.attr("hide");
                //
                var checked = $target.attr("checked");
                if (show_layer) {
                    if (bool_all) {        //专题图 全选
                        if (checked) {  //选择
                            map.showLayer(show_layer);
                            if(show_layer=="SSYX"){
                            	getYxDate();
                            }
                            //处理互斥
                            if (hide_layer) {
                                $.each(hide_layer.split(","), function (k, v) {
                                    map.hideLayer(v);
                                    //处理单选框显示
                                    var $only = $("input[layer='" + v + "']");
                                    $only.attr("checked",false)
                                    $($only.parent().parent()).find("input[class='clk single']").each(function () {
                                        $(this).attr("checked", false);
                                    })
                                });
                            }
                            //处理 单选框 组
                            $($target.parent().parent()).find("input[class='clk single']").each(function () {
                                $(this).attr("checked", 'checked');
                            })
                        } else {      //取消
                            map.hideLayer(show_layer);
                            if(show_layer=="SSYX"){
                            	delYxDate();
                            }
                            //处理 单选框 组
                            $($target.parent().parent()).find("input[class='clk single']").each(function () {
                                $(this).attr("checked", false);
                            })
                        }
                    } else if (bool_sig) {  //专题图 单选
                        var all_f = false;
                        if (checked) {//选择
                            map.showLayer(show_layer,true);
                            all_f = "checked";
                        } else {
                            map.hideLayer(show_layer,true);
                            var $single=$($target.parent().parent().parent()).find("input[class='clk single']");
                            $.each($single,function(){
                                var f_=$(this).attr("checked");
                                if(f_){
                                    all_f = "checked";
                                }
                            })
                        }
                        //处理全选按钮   勾选情况
                        var $all_check_s=$($target.parent().parent().parent().parent().parent()).find("input[class='clk switch']")
                        $.each($all_check_s,function () {
                            $(this).attr("checked", all_f);
                            hide_layer=$(this).attr("hide");
                        })
                        //处理互斥
                        if(all_f&&hide_layer){
                            $.each(hide_layer.split(","), function (k, v) {
                                map.hideLayer(v);
                                //处理单选框显示
                                var $only = $("input[layer='" + v + "']");
                                $only.attr("checked",false)
                                $($only.parent().parent()).find("input[class='clk single']").each(function () {
                                    $(this).attr("checked", false);
                                })
                            });
                        }
                    } else {              //底图控制
                        map.showLayer(show_layer);
                        map.hideLayer(hide_layer);
                        //页面样式
                        $target.addClass("active");
                        $("div[layer='" + hide_layer + "']").removeClass("active");
                    }
                }
            },0);
        })
    }
    //绑定2017年影像的事件，用于地图上展示时相
    function getYxDate(){
        var eventCont = 0;
        map.getMap().on('pointermove',function(event){
            if(event){
                eventCont++;
                (function(c){
                    setTimeout(function(){
                        if(c==eventCont){
                            queryYxDate(event.coordinate);
                        }
                    },500);
                })(eventCont);
            }
        });
    }
    //查询服务，返回时相值，加载到页面中
    function queryYxDate(evt){
        var datas ={};
        //var url = config.PROXY + '?' + config.yxDateQueryUrl + '?';
        var url = config.yxDateQueryUrlNow;
        datas.lon = evt[0];
        datas.lat = evt[1];
        $.ajax({
        	url:url,
            type: 'GET',
            data: datas,
            success: function(res){
                //在这个地方进行往地图上展示日期
                $("#mouse-date").show();
                $("#mouse-date").text('影像时相:'+res);
               
            },
            error: function(err) {
                console.error("查询影像数据 错误" + err);
            }
        });
    }
    //删除影像图层的绑定的事件
    function delYxDate(){
    	 map.getMap().removeEventListener('pointermove');
    	 $("#mouse-date").hide();
    	 $("#mouse-date").text('');
    }
    
    return {
        init: init
    }
});