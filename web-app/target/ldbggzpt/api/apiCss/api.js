var apiContent={zTree_Setting:null,zTree_Node:null,zTree_Function:null,overlayDiv:null,overlayContent:null,overlayDetailDiv:null,overlayCloseBtn:null,overlayArrow:null,contentBoxDiv:null,settingDiv:null,functionDiv:null,overlaySearch:null,searchKey:null,searchResultInput:null,searchPrevBtn:null,searchNextBtn:null,apiCache:{},lastValue:"",searchNodes:[],searchNodesCur:0,_init:function(){this.overlayDiv=$("#overlayDiv");this.overlayContent=$("#overlayContent");this.overlayDetailDiv=$("#overlayDetailDiv");this.overlayCloseBtn=$("#overlayDivCloseBtn");this.overlayArrow=$("#overlayDivArrow");this.contentBoxDiv=$("#contentBox");this.settingDiv=$("#api_setting");this.functionDiv=$("#api_function");this.searchKey=$(".searchKey");this.overlaySearch=$(".overlaySearch");this.searchResultInput=$(".searchResult");this.searchPrevBtn=$(".searchPrev");this.searchNextBtn=$(".searchNext");var a={view:{fontCss:this.getFontCss,showLine:false,showIcon:this.showIcon,showTitle:this.getTitle,selectedMulti:false,dblClickExpand:false},data:{key:{title:"tt"},simpleData:{enable:true,idKey:"id",pIdKey:"pId",rootPId:""}},callback:{onNodeCreated:this.onNodeCreated,beforeClick:this.beforeClick}};var d=[{id:1,pId:0,t:"setting",name:"setting : {",open:true},{id:11,pId:1,t:"expandLevel",name:'expandLevel : "",',iconSkin:"core",showAPI:true},{id:71,pId:0,name:"}"},];var c=[{id:1,pId:0,t:"treeNode",name:"treeNode : {",open:true},{id:101,pId:1,t:"id",name:"id : 1,",iconSkin:"check",showAPI:false},{id:102,pId:1,t:"text",name:"text : '节点1',",iconSkin:"core",showAPI:false},{id:128,pId:1,t:"children",name:"children : [{id:....,text:...},{id:....,text:...}]",iconSkin:"check",showAPI:false},{id:127,pId:1,t:"showMore",name:"showMore : true/false(是否显示'更多'按钮),",iconSkin:"core",showAPI:false},{id:103,pId:1,t:"showAdd",name:"showAdd : true/false(是否显示'导入'按钮),",iconSkin:"check",showAPI:false},{id:103,pId:1,t:"showCreate",name:"showCreate : true/false(是否显示'创建'按钮),",iconSkin:"check",showAPI:false},{id:103,pId:1,t:"showDel",name:"showDel : true/false(是否显示'删除'按钮),",iconSkin:"check",showAPI:false},{id:2,pId:0,name:"}"}];var b=[{id:4,pId:0,t:"treeHelper",name:"treeHelper : {",open:true},{id:402,pId:4,t:"getNodeById",name:"getNodeById (id)",iconSkin:"core",showAPI:true},{id:403,pId:4,t:"appendNode",name:"appendNode (node)",iconSkin:"edit",showAPI:true},{id:404,pId:4,t:"getParent",name:"getParent (node)",iconSkin:"core",showAPI:true},{id:405,pId:4,t:"bindEvent",name:"bindEvent (eventTarget,eventType,callback)",iconSkin:"check",showAPI:true},{id:406,pId:4,t:"getNodes",name:"getNodes ()",iconSkin:"check",showAPI:true},{id:407,pId:4,t:"getSelectNode",name:"getSelectNode ()",iconSkin:"edit",showAPI:true},{id:408,pId:4,t:"getCheckedNode",name:"getCheckedNode ()",iconSkin:"edit",showAPI:true},{id:409,pId:4,t:"getCheckedNodes",name:"getCheckedNodes ()",iconSkin:"edit",showAPI:true},{id:436,pId:4,t:"expandAllNode",name:"expandAllNode ()",iconSkin:"core",showAPI:true},{id:437,pId:4,t:"expandNode",name:"expandNode (node)",iconSkin:"core",showAPI:true},{id:438,pId:4,t:"removeNodeById",name:"removeNodeById (id)",iconSkin:"core",showAPI:true},{id:439,pId:4,t:"removeNode",name:"removeNode (node)",iconSkin:"core",showAPI:true},{id:5,pId:0,name:"}"}];apiContent.zTree_Setting=$.fn.zTree.init($("#settingTree"),$.fn.zTree._z.tools.clone(a),d);apiContent.zTree_Node=$.fn.zTree.init($("#treenodeTree"),$.fn.zTree._z.tools.clone(a),c);apiContent.zTree_Function=$.fn.zTree.init($("#functionTree"),$.fn.zTree._z.tools.clone(a),b);this.bindEvent()},beforeClick:function(b,a,d){if(!a.showAPI){return false}var c=$("#"+a.tId+"_a");if(!!apiContent.apiCache[a.tId]){apiContent.tmpDiv.html(apiContent.apiCache[a.tId]);apiContent.overlayShow(c,(apiContent.lastNode===a))}else{apiContent.overlayAjax(b,a)}apiContent.lastNode=a;if(!d){apiContent.clearSelectedNode()}return true},openAPI:function(){if(apiContent.searchNodes.length>0){var d=$.fn.zTree.getZTreeObj("settingTree"),c=$.fn.zTree.getZTreeObj("treenodeTree"),b=$.fn.zTree.getZTreeObj("functionTree");if(apiContent.searchNodesCur<0||apiContent.searchNodesCur>apiContent.searchNodes.length-1){apiContent.searchNodesCur=0}var a=apiContent.searchNodes[apiContent.searchNodesCur];if(a.tId.indexOf("setting")>-1){d.selectNode(a)}else{if(a.tId.indexOf("treenode")>-1){c.selectNode(a)}else{b.selectNode(a)}}apiContent.searchCur()}},getFontCss:function(b,a){return(!!a.highlight)?{color:"#A60000","font-weight":"bold"}:{color:"#333","font-weight":"normal"}},getTitle:function(c,b){var a=[],d=b;while(d&&!!d.t){a.push(d.t);d=d.getParentNode()}a=a.reverse();b.tt=a.join(".");return true},showIcon:function(b,a){return(!!a.iconSkin)},onNodeCreated:function(f,d,c){var b=$("#"+c.tId+"_a");if(c.showAPI){b.attr("rel","#overlayDiv")}else{b.css({cursor:"default"})}},clearSelectedNode:function(){apiContent.zTree_Setting.cancelSelectedNode();apiContent.zTree_Node.cancelSelectedNode();apiContent.zTree_Function.cancelSelectedNode()},overlayAutoClose:function(d){var c=d.target.id,a=d.target.getAttribute("rel"),b=d.target.className;if(c==="overlayDiv"||c==="overlayDivArrow"||b.indexOf("searchPrev")>-1||b.indexOf("searchNext")>-1||!!a){return}if(!$(d.target).parents("[rel]").length&&!$(d.target).parents("#overlayDiv").length){apiContent.overlayClose()}},overlayClose:function(){var a=apiContent.overlayDiv;a.stop();apiContent.clearSelectedNode();if(ie){a.hide()}else{setTimeout(function(){a.fadeTo("fast",0,function(){a.hide()})},200)}$(document).unbind("click",apiContent.overlayAutoClose)},overlayShow:function(y,m){var j=$(window),n=apiContent.overlayDiv,x=apiContent.overlayArrow,q=apiContent.overlayContent,v=apiContent.contentBoxDiv,k=y.offset().top-30,f=v.offset().left+v.outerWidth({margin:true})-n.outerWidth({margin:true})-10,r=Math.min(f,y.offset().left+y.width()+40),e=y.offset().top+16,d=100,b=50,p=false,g=j.height(),i=j.scrollTop(),s=g+i-b;if(!apiContent.overlayMaxTop){apiContent.overlayMaxTop=apiContent.contentBoxDiv.offset().top+apiContent.contentBoxDiv.height()}n.stop();if(n.css("display")!=="block"){n.css({top:k,left:r});x.css({top:e-k});$(document).bind("click",apiContent.overlayAutoClose)}if(ie){p=true;n.show()}else{n.fadeTo("fast",1)}var u=apiContent.tmpDiv.outerHeight({margin:true})+apiContent.overlaySearch.outerHeight();if((k+u)>s){k=s-u}if((k+u)>apiContent.overlayMaxTop){k=apiContent.overlayMaxTop-u}k=Math.max(k,i,d);if((k+u)>($("body").height()-b-20)){n.css("padding-bottom",b+"px")}else{n.css("padding-bottom","0")}apiContent.overlayDetailDiv.empty();apiContent.overlayDetailDiv.append(apiContent.tmpDiv.children());if(!p){p=(m&&k===parseInt(n.css("top").replace("px","")))}x.removeClass("reverse");if((e-k)>(u-55)){x.addClass("reverse");e-=55}if(p){n.css({top:k,left:r});q.css({height:u});x.css({top:e-k})}else{n.animate({top:k,left:r},{duration:"normal",easing:"swing",complete:null});q.animate({height:u},{duration:"fast",easing:"swing",complete:null});x.animate({top:e-k},{duration:"normal",easing:"linear",complete:null})}},bindEvent:function(){this.overlayCloseBtn.bind("click",apiContent.overlayClose)},overlayAjax:function(b,a){var c=$("#"+a.tId+"_a");if(a.isAjax){return}a.isAjax=true;$.ajax({type:"get",url:""+lang+"/"+a.tt.replace("$.","")+".html",data:null,dataType:"text",success:function(e){if(!apiContent.tmpDiv){var d=$(document.createElement("div"));d.addClass("baby_overlay_tmp");$("body").append(d);apiContent.tmpDiv=$(document.createElement("div"));apiContent.tmpDiv.addClass("details");d.append(apiContent.tmpDiv)}else{apiContent.tmpDiv.empty()}apiContent.tmpDiv.html(e);apiContent.overlayShow(c,false);apiContent.apiCache[a.tId]=e;a.isAjax=false},error:function(d,f,e){mini.alert(ajaxMsg,"温馨提示");if(apiContent.tmpDiv){apiContent.tmpDiv.empty()}a.isAjax=false}})}};