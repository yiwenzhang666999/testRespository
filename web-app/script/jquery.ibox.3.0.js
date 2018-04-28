;$(function() {
	(function($) {
		//添加box 
		function addBox(_this) {
			var g = _this.data("globals");
			g._box = $('<div class="plugin-box" id="'+g._opts.id+'"></div>');
			g._header = $('<div class="box-header"><h2 class="title">' + g._opts.title + '</h2></div>');
			var opers = $('<div class="operations"></div>');
			g._closeBtn = $('<span class="close-btn ope-btn iconfont icon-zsicon-close"></span>');
			g._restoreBtn = $('<span class="restore-btn ope-btn iconfont icon-zsicon-restore"></span>').hide();
			g._content = $('<div class="box-content"></div>');
			var contentMsg = "";
			//处理header,根据参数添加最大,最小,置顶按钮
			if (g._opts.showMax) {
				g._maxBtn = $('<span class="max-btn ope-btn iconfont icon-zsicon-max"></span>');
			}
			if (g._opts.showMin) {
				g._minBtn = $('<span class="min-btn ope-btn iconfont icon-zsicon-min"></span>')
			}
			if (g._opts.showTop) {
				g._topBtn = $('<span class="top-btn ope-btn iconfont icon-zsicon-top"></span>')
			}
			opers.append(g._topBtn || "", g._maxBtn || "", g._minBtn || "", g._restoreBtn, g._closeBtn);
			g._header.append(opers);
			//处理_content(img/ajax/iframe / clone 类型下)
			if (g._opts.type && $.inArray(g._opts.type, ['iframe', 'ajax', 'img']) != -1) {
				if (g._opts.type === "img") {
					var img = $("<img />");
					img.attr("src", g._opts.target);
//					$.get(g._opts.target, function(data) {
//					img.load("","",function() {
					img.appendTo(g._content.empty());
					setPos(_this,g);
					typeof g._opts.addCallBack === 'function' ? g._opts.addCallBack() : null;
//					});
				} else {
					if (g._opts.type === "ajax") {
						$.get(g._opts.target, function(data) {
							g._content.html(data).css({
								"overflow": "auto",
								"width": g._opts.contentWidth + "px",
								"max-width": g._win.width(),
								"max-height": g._win.height() - 52
							});
							setPos(_this,g);
							typeof g._opts.addCallBack === 'function' ? g._opts.addCallBack() : null;
						});
					} else {
						var ifr = $("<iframe id='box-iframe' name='iBoxIframe' style='width:" + g._opts.iframeWH.width + "px;height:" + g._opts.iframeWH.height + "px;' scrolling='auto' frameborder='0' src='" + g._opts.target + "'></iframe>");
						ifr.appendTo(g._content.empty());
//						ifr.load("","",function() {
							try {
								$it = $(this).contents();
								$it.find('.close-btn').click(close);
								var fH = $it.height() + 20;
								var fW = $it.width() + 20;
								var newW = Math.min(g._win.width() - 180, fW);
								var newH = Math.min(g._win.height() - 200, fH);
								ifr.attr({
									"data-width": newW,
									"data-height": newH
								});
								if (!newH) {
									return;
								};
								$(this).css({
									height: newH,
									width: newW
								});
								setPos(_this,g);
								typeof g._opts.addCallBack === 'function' ? g._opts.addCallBack() : null;
							} catch (e) {}
//						});
					}
				}
			} else if (g._opts.type === "clone") {
				g._cloneNode = $(g._opts.target);
				g._cloneParent = g._cloneNode.parent();
				g._cloneIndex = g._cloneNode.index();
				g._cloneNode.show().appendTo(g._content.empty().width(g._opts.contentWidth + "px"));
				setTimeout(function(){
					typeof g._opts.addCallBack === 'function' ? g._opts.addCallBack() : null;
				},0);
			}
			//处理(alert/confirm/prompt)类型下的_footer/_content
			if (g._opts.type == "alert") {
				contentMsg = $('<p class="content-msg">' + g._opts.contentMsg + '</p>');
				g._content.append(contentMsg);
				g._footer = $('<div class="box-footer"><button type="button" class="zs-btn primary btn-ok btn" value="ok">确定</button></div>');
			} else if (g._opts.type == "confirm") {
				contentMsg = $('<p class="content-msg">' + g._opts.contentMsg + '</p>');
				g._content.append(contentMsg);
				g._footer = $('<div class="box-footer"><button type="button" class="zs-btn primary btn-ok btn" value="ok">确定</button><button type="button" class="zs-btn btn btn-cancel" value="cancel">取消</button></div>');
			} else if (g._opts.type == "prompt") {
				contentMsg = $('<p class="content-msg">' + g._opts.contentMsg + '</p><input type="text" placeholder="请输入内容" class="prompt-msg zs-input"/>');
				g._content.append(contentMsg);
				g._footer = $('<div class="box-footer"><button type="button" class="zs-btn primary btn-ok btn" value="ok">确定</button><button type="button" class="zs-btn btn-cancel btn" value="cancel">取消</button></div>');
			}
			g._box.append(g._header, g._content, g._footer || "");
				var index = $(".plugin-box").length + 1001;
				if (g._opts.overlay && $(".plugin-box-model").length == 0) {
					g._overlay = $('<div class="plugin-box-model"></div>');
				}
				//TODO 全屏时可能用到，需要把弹出的box放入被全屏的element中；
				if(g._opts.fullScreenId){
					$("#"+g._opts.fullScreenId).append(g._overlay || "", g._box);
				}else{
					$("body").append(g._overlay || "", g._box);
				}
			if (g._opts.overlay) {
				g._box.addClass("withOverlay");
			}
			//添加成功回调函数 alert confirm prompt
			if (g._opts.type == "alert" || g._opts.type == "confirm" || g._opts.type == "prompt") {
				typeof g._opts.addCallBack === 'function' ? g._opts.addCallBack() : null;
			}
			g._box.css("z-index", index).attr("data-index", index);
			if (g._opts.overlay) {
				$(".plugin-box-model").css("opacity", g._opts.opacity).fadeIn();
				$("body").addClass("show-model");
			}
			setPos(_this,g);
		}
		//移动
		function darg(g) {
			var doc = $(document);
			var dx, dy, l, t;
			var T = g._header.css('cursor', 'move');
			T.bind("selectstart.modal", function() {
				return false;
			});
			T.on("mousedown.model", function(e) {
				dx = e.clientX - parseInt(g._box.css("left"));
				dy = e.clientY - parseInt(g._box.css("top"));
				doc.on("mousemove.modal", move);
				g._box.css('opacity', 0.8);
				doc.on("mouseup.modal", up);
				return false;
			});
			//移动
			function move(e) {
				l = e.clientX - dx;
				t = e.clientY - dy;
				if (l > g._win.width() - g._box.width()) {
					l = g._win.width() - g._box.width();
				}
				if (l < 0) {
					l = 0;
				}
				if (t > g._win.height() + g._win.scrollTop() - g._box.height()) {
					t = g._win.height() - g._box.height() + g._win.scrollTop();
				}
				if (t < g._win.scrollTop()) {
					t = g._win.scrollTop();
				}
				g._box.css({
					left: l,
					top: t
				});
			}
			function up(e) {
				doc.unbind("mousemove.modal", move);
				g._box.css('opacity', 1);
			}
		}
		//最大化
		function maxSize(_this,g) {
			var box = g._box
			$("body").addClass("show-model");
			box.addClass("max-mark").find(".max-btn").hide().end().find(".restore-btn").show().attr("data-flag", "2");
			box.find(".min-btn").show();
			var winW = g._win.width();
			var winH = g._win.height();
			var conW;
			var conH;
			box.animate({
				"left": "0px",
				"top": g._win.scrollTop(),
				"width": winW,
				"height": winH
			}, 500, function() {
				box.find(".box-content,.box-footer").show();
				if (g._opts.type == "iframe" || g._opts.type == "ajax" || g._opts.type == "img" || g._opts.type == "clone") {
					conH = winH - g._header.outerHeight();
				} else {
					conH = winH - g._header.outerHeight() - g._footer.outerHeight();
				}
				g._box.find(".box-content").css({
					"width": "100%",
					"height": conH
				});
				conW = g._box.find(".box-content").width();
				box.find("#box-iframe").css({
					"width": conW,
					"height": conH - 40
				})
			});
		}
		//最小化
		function minSize(_this,g) {
			var box = g._box
			box.removeClass("max-mark").find(".min-btn").hide().end().find(".restore-btn").show().attr("data-flag", "1").end().find(".max-btn").show();
			box.height("auto").find(".box-content,.box-footer").height("auto").stop().slideUp(function() {
				box.width("auto");
			});
		}
		//还原
		function restore(_this,g) {
			var box = g._box
			var overlay = $(".plugin-box-model");
			box.removeClass("max-mark").width("auto").find(".box-content,.box-footer").stop().slideDown();
			if (g._restoreBtn.attr("data-flag") == 1) {
				//最小化还原时
				box.find(".restore-btn").hide().end().find(".min-btn").show();
			} else if (g._restoreBtn.attr("data-flag") == 2) {
				//最大化还原时
				box.height("auto").find(".restore-btn").hide().end().find(".max-btn").show();
			}
			if (g._opts.type == "ajax" || g._opts.type == "clone") {
				box.find(".box-content").height("auto").width(g._opts.contentWidth + "px");
			} else {
				box.find(".box-content").height("auto");
			}
			var ifrs = box.find("#box-iframe");
			ifrs.css({
				"height": ifrs.attr("data-height"),
				"width": ifrs.attr("data-width")
			});
			setPos(_this,g);
		}
		//置顶&&取消
		function goTop(_this,g) {
			var _box = g._box;
			if (g._topBtn.hasClass("cancel")) {
				_box.css("z-index", _box.attr("data-index")).removeClass("is-on-top");
				g._topBtn.removeClass("cancel icon-zsicon-un-top").addClass("icon-zsicon-top");
			} else {
				_box.css("z-index", "99999").addClass("is-on-top").removeClass("clickTop");
				g._topBtn.addClass("cancel icon-zsicon-un-top").removeClass("icon-zsicon-top");
			}
		}
		//box 点击事件
		function changeIndex(_this,g) {
			var box = g._box;
			if (box.hasClass("is-on-top")) {
				box.removeClass("clickTop");
			} else {
				var boxs = $(".plugin-box:not(.is-on-top)");
				var maxIndex = 1001;
				for (var i = 0; i < boxs.length; i++) {
					var tarIndex = parseFloat(boxs.eq(i).css("z-index"));
					if (maxIndex < tarIndex) {
						maxIndex = tarIndex;
					}
				}
				if (!box.hasClass("clickTop")) {
					boxs.removeClass("clickTop");
					box.css("z-index", maxIndex + 1).addClass("clickTop");
				}
			}
		}
		//定位
		function setPos(_this,g) {
			var _box = g._box;
			var boxW = _box.outerWidth();;
			var boxH = _box.outerHeight();
			var left = (g._win.width() - boxW) / 2;
			var top = g._win.scrollTop() + (g._win.height() - boxH) / 2;
			_box.css({
				"left": g._opts.ibox_left||left,
				"top": g._opts.ibox_top||top
			})
		}
		//resize 事件
		function resize() {
			var ww;
			var wh
			var winH;
			var winW;
			$(window).resize(function() {
				winH = $(window).height();
				winW = $(window).width();
				//最大化状态
				if ($(".plugin-box.max-mark")) {
					ww = winW - 80;
					wh = winH - 94;
					$(".plugin-box.max-mark").css({
						"height": winH,
						"width": winW
					}).find("#box-iframe").css({
						"height": wh,
						"width": ww
					})
				}
				//普通状态&最小化状态
				var boxs = $(".plugin-box:not(.max-mark)");
				for (var i = 0; i < boxs.length; i++) {
					boxs.eq(i).css({
						"left": (winW / 2) - (boxs.eq(i).width() / 2)
					})
				}

			})
		}
		//关闭/移除事件

		function close(_this,g,target) {
			var box ;
			if(!g){
				var g = _this.data("globals");
				box = g._box;
			}else{
				box = g._box;
			}
			if (g._opts.type === "clone") {
				var nodes = g._cloneParent.children();
				if (g._cloneIndex == nodes.length) {
					g._cloneParent.append(g._cloneNode.hide());
				} else {
					nodes.eq(g._cloneIndex).before(g._cloneNode.hide());
				}
			}
			box.addClass("hide");
			_this.removeClass("plugin-with-box");
			//alert/prompt/confirm关闭/确定按钮点击
			if(target){
				if (target.hasClass("btn-ok")) {
					var promptMsg = box.find(".prompt-msg").val();
					var obj = "";
					if (promptMsg !== undefined && $.trim(promptMsg) !== "") {
						var obj = promptMsg;
					}
					typeof g._opts.okCallBack === 'function' ? g._opts.okCallBack(obj) : null;
				} else if (target.hasClass("btn-cancel")) {
					typeof g._opts.cancelCallBack === 'function' ? g._opts.cancelCallBack() : null;
				}
			}
			setTimeout(function() {
				box.remove();
				typeof g._opts.removeCallBack === 'function' ? g._opts.removeCallBack() : null;
				if ($(".plugin-box.withOverlay").length == 0) {
					$(".plugin-box-model").fadeOut();
					$("body").removeClass("show-model");
				}
				if(_this.hasClass("plugin-create-modal-btn")){
					_this.remove();
				}
			}, 360);
		}
		//点击事件 || 注册事件
		function bindEvent(_this) {
			var g = _this.data("globals");
			//resize事件
			resize();
			//拖拽事件
			if (g._opts.isDrag) {
				darg(g);
			}
			//最大化事件
			if (g._opts.showMax) {
				g._maxBtn.on("click.modal",function(event){
					event.stopPropagation();
					event.preventDefault();
					maxSize(_this,g);
				})
			}
			//最小化事件
			if (g._opts.showMin) {
				g._minBtn.on("click.modal", function(event) {
					event.stopPropagation();
					event.preventDefault();
					minSize(_this,g);
				})
			}
			//置顶事件 自动置顶
			if (g._opts.showTop) {
				g._topBtn.on("click.modal", function(event) {
					event.stopPropagation();
					event.preventDefault();
					goTop(_this,g);
				}).click();
			}
			//还原事件
			g._restoreBtn.on("click.modal", function(event) {
				event.stopPropagation();
				event.preventDefault();
				restore(_this,g);
			})
			//alert / prompt / confirm 底部按钮点击 关闭事件
			if (g._footer) {
				g._footer.find(".btn").on("click.modal", function(event) {
					event.stopPropagation();
					event.preventDefault();
					close(_this,g,$(this));
				});
			}
			//关闭事件 closebtn
			g._closeBtn.on("click.modal", function(event) {
				event.stopPropagation();
				event.preventDefault();
				close(_this,g,$(this));
				if($(".tool-cj").hasClass("selected")){
					$(".tool-qc").click();
				};
			});
			//点击box 改变 z-index
			g._box.on("click.modal",function(event){
				/**
				 * TODO 添加类型判断，防止元素的默认动作被取消目前只添加了复选框
				 *label标签的过滤；如果后续弹窗中增加了其他有默认动作的元素，要
				 *在此处做判断过滤，不执行preventDefault方法；
				 * */
				if(event.target.type!="checkbox"&&event.target.tagName!="LABEL"){
					event.stopPropagation();
					event.preventDefault();
					changeIndex(_this,g);
				}
			})
		}
		$.fn.modal = function(options) {
			var defaults = {
				overlay: false,
				//遮罩层
				title: "Modal",
				//获取ibox弹框
				id:"",
				//弹出框位置
				ibox_top:"",
				ibox_left:"",
				//标题
				contentMsg: "",
				//alert/confirm/prompt 主体信息
				type: null,
				//请求类型  img ajax iframe alert confirm prompt clone
				target: null,
				//请求目标
				showMin: false,
				//最小化
				showMax: false,
				//最大化
				showTop: false,
				//置顶
				isDrag: false,
				fullScreenId:"",
				//移动
				contentWidth: 500,
				//主体宽度 适用于 ajax clone类型
				iframeWH: {
					width: 500,
					height: 400
				},
				//iframe 宽高
				addCallBack: null,
				//添加后的回调函数
				removeCallBack: null,
				//移除后的回调函数
				okCallBack: null,
				//alert/confirm/prompt点击ok的回调函数
				cancelCallBack: null //alert/confirm/prompt点击cancel的回调函数
			};
			var opts = $.fn.modal.parseOptions(defaults, options);
			var _this = $(this);
			var globals = {
				_opts: opts,
				_win: $(window)
			};
			//存储参数
			_this.data("globals", globals);
			_this.on("click.modal", function(event) {
				//是否已有对应box
				if (!_this.hasClass("plugin-with-box")) {
					//是否为iframe内元素
					addBox(_this);
					if(_this.get(0).tagName.toLowerCase() !== "body"){
						_this.addClass("plugin-with-box");
					}
					bindEvent(_this);
				}
			});
			return this;
		}
		$.fn.modal.methods = {
			tiggerBox: function(options,target) {
				//iframe里多级弹窗时
				if(target){
					var tarBtns = $("#plugin-create-modal-btn-"+target+"");
					if(!tarBtns.hasClass("plugin-with-box")){
						var btns = $('<div id="plugin-create-modal-btn-'+target+'" class="plugin-create-modal-btn"></div>');
						$("body").append(btns.hide());
						btns.modal(options).click().unbind("click.modal");
						btns.addClass("plugin-with-box");
					}
				}else{
					//普通回调时 例如 alert confirm
					$("body").modal(options).click().unbind("click.modal");
				}
			},
			close: function(_this) {
				if (_this.hasClass("plugin-with-box")) {
					close(_this);
				}
			}
		}
		$.fn.modal.parseOptions = function(defaults, options) {
			return $.extend(defaults, options);
		}
	})(jQuery);
})