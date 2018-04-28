/*
 * Compressed by JSA(www.xidea.org)
 */
mini = {
	components : {},
	uids : {},
	ux : {},
	isReady : false,
	byClass : function(B, A) {
		if (typeof A == "string")
			A = mini.byId(A);
		return jQuery("." + B, A)[0]
	},
	getComponents : function() {
		var B = [];
		for ( var C in mini.components) {
			var A = mini.components[C];
			B.push(A)
		}
		return B
	},
	get : function(B) {
		if (!B)
			return null;
		if (mini.isControl(B))
			return B;
		if (typeof B == "string")
			if (B.charAt(0) == "#")
				B = B.substr(1);
		if (typeof B == "string")
			return mini.components[B];
		else {
			var A = mini.uids[B.uid];
			if (A && A.el == B)
				return A
		}
		return null
	},
	getbyUID : function(A) {
		return mini.uids[A]
	},
	findControls : function(G, D) {
		if (!G)
			return [];
		D = D || mini;
		var A = [], F = mini.uids;
		for ( var C in F) {
			var B = F[C], E = G.call(D, B);
			if (E === true || E === 1) {
				A.push(B);
				if (E === 1)
					break
			}
		}
		return A
	},
	getChildControls : function(C) {
		var B = C.el ? C.el : C, A = mini.findControls(function(A) {
			if (!A.el || C == A)
				return false;
			if (mini.isAncestor(B, A.el) && A.within)
				return true;
			return false
		});
		return A
	},
	emptyFn : function() {
	},
	createNameControls : function(C, H) {
		if (!C || !C.el)
			return;
		if (!H)
			H = "_";
		var E = C.el, A = mini.findControls(function(A) {
			if (!A.el || !A.name)
				return false;
			if (mini.isAncestor(E, A.el))
				return true;
			return false
		});
		for ( var B = 0, F = A.length; B < F; B++) {
			var D = A[B], G = H + D.name;
			if (H === true)
				G = D.name[0].toUpperCase()
						+ D.name.substring(1, D.name.length);
			C[G] = D
		}
	},
	getbyName : function(E, B) {
		var D = mini.isControl(B), C = B;
		if (B && D)
			B = B.el;
		B = mini.byId(B);
		B = B || document.body;
		var A = this.findControls(function(A) {
			if (!A.el)
				return false;
			if (A.name == E && mini.isAncestor(B, A.el))
				return 1;
			return false
		}, this);
		if (D && A.length == 0 && C && C.getbyName)
			return C.getbyName(E);
		return A[0]
	},
	getParams : function(E) {
		if (!E)
			E = location.href;
		E = E.split("?")[1];
		var D = {};
		if (E) {
			var C = E.split("&");
			for ( var B = 0, F = C.length; B < F; B++) {
				var A = C[B].split("=");
				try {
					D[A[0]] = decodeURIComponent(unescape(A[1]))
				} catch (G) {
				}
			}
		}
		return D
	},
	reg : function(A) {
		this.components[A.id] = A;
		this.uids[A.uid] = A
	},
	unreg : function(A) {
		delete mini.components[A.id];
		delete mini.uids[A.uid]
	},
	classes : {},
	uiClasses : {},
	getClass : function(A) {
		if (!A)
			return null;
		return this.classes[A.toLowerCase()]
	},
	getClassByUICls : function(A) {
		return this.uiClasses[A.toLowerCase()]
	},
	idPre : "mini-",
	idIndex : 1,
	newId : function(A) {
		return (A || this.idPre) + this.idIndex++
	},
	copyTo : function(A, C) {
		if (A && C)
			for ( var B in C)
				A[B] = C[B];
		return A
	},
	copyIf : function(A, C) {
		if (A && C)
			for ( var B in C)
				if (mini.isNull(A[B]))
					A[B] = C[B];
		return A
	},
	createDelegate : function(B, A) {
		if (!B)
			return function() {
			};
		return function() {
			return B.apply(A, arguments)
		}
	},
	isControl : function(A) {
		return !!(A && A.isControl)
	},
	isElement : function(A) {
		return A && A.appendChild
	},
	isDate : function(A) {
		return A && A.getFullYear
	},
	isArray : function(A) {
		return A && !!A.unshift
	},
	isNull : function(A) {
		return A === null || A === undefined
	},
	isNumber : function(A) {
		return !isNaN(A) && typeof A == "number"
	},
	isEquals : function(A, B) {
		if (A !== 0 && B !== 0)
			if ((mini.isNull(A) || A == "") && (mini.isNull(B) || B == ""))
				return true;
		if (A && B && A.getFullYear && B.getFullYear)
			return A.getTime() === B.getTime();
		if (typeof A == "object" && typeof B == "object")
			return A === B;
		return String(A) === String(B)
	},
	forEach : function(G, F, D) {
		var B = G.clone();
		for ( var C = 0, E = B.length; C < E; C++) {
			var A = B[C];
			if (F.call(D, A, C, G) === false)
				break
		}
	},
	sort : function(C, B, A) {
		A = A || C;
		C.sort(B)
	},
	removeNode : function(A) {
		jQuery(A).remove()
	},
	elWarp : document.createElement("div")
};
if (typeof mini_debugger == "undefined")
	mini_debugger = true;
mini_regClass = function(C, B) {
	B = B.toLowerCase();
	if (!mini.classes[B]) {
		mini.classes[B] = C;
		C.prototype.type = B
	}
	var A = C.prototype.uiCls;
	if (!mini.isNull(A) && !mini.uiClasses[A])
		mini.uiClasses[A] = C
};
mini_extend = function(newConstractor, superClass, extendAttrs) {
	if (typeof superClass != "function")
		return this;
	var subClass = newConstractor, newProto = subClass.prototype, oldProto = superClass.prototype;
	if (subClass.superclass == oldProto)
		return;
	subClass.superclass = oldProto;
	subClass.superclass.constructor = superClass;
	for ( var D in oldProto)
		newProto[D] = oldProto[D];
	if (extendAttrs)
		for (D in extendAttrs)
			newProto[D] = extendAttrs[D];
	return subClass
};
mini.copyTo(mini, {
	extend : mini_extend,
	regClass : mini_regClass,
	debug : false
});
mini.namespace = function(C) {
	if (typeof C != "string")
		return;
	C = C.split(".");
	var F = window;
	for ( var A = 0, D = C.length; A < D; A++) {
		var E = C[A], B = F[E];
		if (!B)
			B = F[E] = {};
		F = B
	}
};
mini._BindCallbacks = [];
mini._BindEvents = function(B, A) {
	mini._BindCallbacks.push( [ B, A ]);
	if (!mini._EventTimer)
		mini._EventTimer = setTimeout(function() {
			mini._FireBindEvents()
		}, 50)
};
mini._FireBindEvents = function() {
	for ( var A = 0, B = mini._BindCallbacks.length; A < B; A++) {
		var C = mini._BindCallbacks[A];
		C[0].call(C[1])
	}
	mini._BindCallbacks = [];
	mini._EventTimer = null
};
mini._getFunctoin = function(E) {
	if (typeof E != "string")
		return null;
	var B = E.split("."), F = null;
	for ( var A = 0, C = B.length; A < C; A++) {
		var D = B[A];
		if (!F)
			F = window[D];
		else
			F = F[D];
		if (!F)
			break
	}
	return F
};
mini._getMap = function(name, obj) {
	if (!name)
		return null;
	if (name.indexOf(".") == -1)
		return obj[name];
	var s = "obj." + name;
	try {
		var v = eval(s)
	} catch (e) {
		return null
	}
	return v
};
mini._setMap = function(J, C, D) {
	if (!D)
		return;
	if (typeof J != "string")
		return;
	var G = J.split(".");
	function H(C, F, A) {
		var D = C[F];
		if (!D)
			D = C[F] = [];
		for ( var B = 0; B <= A; B++) {
			var E = D[B];
			if (!E)
				E = D[B] = {}
		}
		return C[F][A]
	}
	var A = null;
	for ( var B = 0, I = G.length; B <= I - 1; B++) {
		var J = G[B];
		if (B == I - 1) {
			D[J] = C;
			break
		}
		if (J.indexOf("]") == -1) {
			A = D[J];
			if (B <= I - 2 && A == null)
				D[J] = A = {};
			D = A
		} else {
			var E = J.split("["), F = E[0], K = parseInt(E[1]);
			D = H(D, F, K)
		}
	}
	return C
};
mini.getAndCreate = function(A) {
	if (!A)
		return null;
	if (typeof A == "string")
		return mini.components[A];
	if (typeof A == "object")
		if (mini.isControl(A))
			return A;
		else if (mini.isElement(A))
			return mini.uids[A.uid];
		else
			return mini.create(A);
	return null
};
mini.create = function(A) {
	if (!A)
		return null;
	if (mini.get(A.id) === A)
		return A;
	var B = this.getClass(A.type);
	if (!B)
		return null;
	var C = new B();
	C.set(A);
	return C
};
mini.Component = function() {
	this._events = {};
	this.uid = mini.newId(this._idPre);
	this._id = this.uid;
	if (!this.id)
		this.id = this.uid;
	mini.reg(this)
};
mini.Component.prototype = {
	isControl : true,
	id : null,
	_idPre : "mini-",
	_idSet : false,
	_canFire : true,
	set : function(D) {
		if (typeof D == "string")
			return this;
		var B = this._allowLayout;
		this._allowLayout = false;
		var E = D.renderTo || D.render;
		delete D.renderTo;
		delete D.render;
		for ( var A in D)
			if (A.toLowerCase().indexOf("on") == 0) {
				var H = D[A];
				this.on(A.substring(2, A.length).toLowerCase(), H);
				delete D[A]
			}
		for (A in D) {
			var G = D[A], F = "set" + A.charAt(0).toUpperCase()
					+ A.substring(1, A.length), C = this[F];
			if (C)
				C.call(this, G);
			else
				this[A] = G
		}
		if (E && this.render)
			this.render(E);
		this._allowLayout = B;
		if (this.doLayout)
			this.doLayout();
		return this
	},
	fire : function(type, event) {
		if (this._canFire == false)
			return;
		type = type.toLowerCase();
		var handlers = this._events[type];
		if (handlers) {
			if (!event)
				event = {};
			if (event && event != this) {
				event.source = event.sender = this;
				if (!event.type)
					event.type = type
			}
			for ( var i = 0, length = handlers.length; i < length; i++) {
				var handler = handlers[i];
				if (handler)	//handler: [ fn, context ]
					handler[0].apply(handler[1], [ event ])
			}
		}
	},
	on : function(type, fn, scope) {	//scope: context
		if (typeof fn == "string") {
			var f = mini._getFunctoin(fn);
			if (!f) {
				var id = mini.newId("__str_");
				window[id] = fn;
				eval("fn = function(e){var s = "
						+ id
						+ ";var fn = mini._getFunctoin(s); if(fn) {fn.call(this, e)}else{eval(s);}}")
			} else
				fn = f
		}
		if (typeof fn != "function" || !type)
			return false;
		type = type.toLowerCase();
		var event = this._events[type];
		if (!event)
			event = this._events[type] = [];
		scope = scope || this;
		if (!this.findListener(type, fn, scope))
			event.push( [ fn, scope ]);
		return this
	},
	un : function(A, E, B) {
		if (typeof E != "function")
			return false;
		A = A.toLowerCase();
		var C = this._events[A];
		if (C) {
			B = B || this;
			var D = this.findListener(A, E, B);
			if (D)
				C.remove(D)
		}
		return this
	},
	findListener : function(C, G, D) {
		C = C.toLowerCase();
		D = D || this;
		var B = this._events[C];
		if (B)
			for ( var A = 0, F = B.length; A < F; A++) {
				var E = B[A];
				if (E[0] === G && E[1] === D)
					return E
			}
	},
	setId : function(A) {
		if (!A)
			throw new Error("id not null");
		if (this._idSet)
			throw new Error("id just set only one");
		mini["unreg"](this);
		this.id = A;
		if (this.el)
			this.el.id = A;
		if (this._textEl)
			this._textEl.id = A + "$text";
		if (this._valueEl)
			this._valueEl.id = A + "$value";
		this._idSet = true;
		mini.reg(this)
	},
	getId : function() {
		return this.id
	},
	destroy : function() {
		mini["unreg"](this);
		this.fire("destroy")
	}
};
mini.Control = function() {
	mini.Control.superclass.constructor.call(this);
	this._create();
	this.el.uid = this.uid;
	this._initEvents();
	if (this._clearBorder)
		this.el.style.borderWidth = "0";
	this.addCls(this.uiCls);
	this.setWidth(this.width);
	this.setHeight(this.height);
	this.el.style.display = this.visible ? this._displayStyle : "none"
};
mini.extend(mini.Control, mini.Component, {
	jsName : null,
	width : "",
	height : "",
	visible : true,
	readOnly : false,
	enabled : true,
	tooltip : "",
	_readOnlyCls : "mini-readonly",
	_disabledCls : "mini-disabled",
	_create : function() {
		this.el = document.createElement("div")
	},
	_initEvents : function() {
	},
	within : function(A) {
		if (mini.isAncestor(this.el, A.target))
			return true;
		return false
	},
	name : "",
	setName : function(A) {
		this.name = A
	},
	getName : function() {
		return this.name
	},
	isAutoHeight : function() {
		var A = this.el.style.height;
		return A == "auto" || A == ""
	},
	isAutoWidth : function() {
		var A = this.el.style.width;
		return A == "auto" || A == ""
	},
	isFixedSize : function() {
		var A = this.width, B = this.height;
		if (parseInt(A) + "px" == A && parseInt(B) + "px" == B)
			return true;
		return false
	},
	isRender : function(A) {
		return !!(this.el && this.el.parentNode && this.el.parentNode.tagName)
	},
	render : function(B, A) {
		if (typeof B === "string")
			if (B == "#body")
				B = document.body;
			else
				B = mini.byId(B);
		if (!B)
			return;
		if (!A)
			A = "append";
		A = A.toLowerCase();
		if (A == "before")
			jQuery(B).before(this.el);
		else if (A == "preend")
			jQuery(B).preend(this.el);
		else if (A == "after")
			jQuery(B).after(this.el);
		else
			B.appendChild(this.el);
		this.el.id = this.id;
		this.doLayout();
		this.fire("render")
	},
	getEl : function() {
		return this.el
	},
	setJsName : function(A) {
		this.jsName = A;
		window[A] = this
	},
	getJsName : function() {
		return this.jsName
	},
	setTooltip : function(A) {
		this.tooltip = A;
		this.el.title = A
	},
	getTooltip : function() {
		return this.tooltip
	},
	_sizeChaned : function() {
		this.doLayout()
	},
	setWidth : function(A) {
		if (parseInt(A) == A)
			A += "px";
		this.width = A;
		this.el.style.width = A;
		this._sizeChaned()
	},
	getWidth : function(B) {
		var A = B ? jQuery(this.el).width() : jQuery(this.el).outerWidth();
		if (B && this._borderEl) {
			var C = mini.getBorders(this._borderEl);
			A = A - C.left - C.right
		}
		return A
	},
	setHeight : function(A) {
		if (parseInt(A) == A)
			A += "px";
		this.height = A;
		this.el.style.height = A;
		this._sizeChaned()
	},
	getHeight : function(B) {
		var A = B ? jQuery(this.el).height() : jQuery(this.el).outerHeight();
		if (B && this._borderEl) {
			var C = mini.getBorders(this._borderEl);
			A = A - C.top - C.bottom
		}
		return A
	},
	getBox : function() {
		return mini.getBox(this.el)
	},
	setBorderStyle : function(A) {
		var B = this._borderEl || this.el;
		mini.setStyle(B, A);
		this.doLayout()
	},
	getBorderStyle : function() {
		return this.borderStyle
	},
	_clearBorder : true,
	setStyle : function(A) {
		this.style = A;
		mini.setStyle(this.el, A);
		if (this._clearBorder)
			this.el.style.borderWidth = "0";
		this.width = this.el.style.width;
		this.height = this.el.style.height;
		this._sizeChaned()
	},
	getStyle : function() {
		return this.style
	},
	setCls : function(A) {
		this.addCls(A)
	},
	getCls : function() {
		return this.cls
	},
	addCls : function(A) {
		mini.addClass(this.el, A)
	},
	removeCls : function(A) {
		mini.removeClass(this.el, A)
	},
	_doReadOnly : function() {
		if (this.readOnly)
			this.addCls(this._readOnlyCls);
		else
			this.removeCls(this._readOnlyCls)
	},
	setReadOnly : function(A) {
		this.readOnly = A;
		this._doReadOnly()
	},
	getReadOnly : function() {
		return this.readOnly
	},
	getParent : function(C) {
		var A = document, D = this.el.parentNode;
		while (D != A && D != null) {
			var B = mini.get(D);
			if (B) {
				if (!mini.isControl(B))
					return null;
				if (!C || B.uiCls == C)
					return B
			}
			D = D.parentNode
		}
		return null
	},
	isReadOnly : function() {
		if (this.readOnly || !this.enabled)
			return true;
		var A = this.getParent();
		if (A)
			return A.isReadOnly();
		return false
	},
	setEnabled : function(A) {
		this.enabled = A;
		if (this.enabled)
			this.removeCls(this._disabledCls);
		else
			this.addCls(this._disabledCls);
		this._doReadOnly()
	},
	getEnabled : function() {
		return this.enabled
	},
	enable : function() {
		this.setEnabled(true)
	},
	disable : function() {
		this.setEnabled(false)
	},
	_displayStyle : "",
	setVisible : function(A) {
		this.visible = A;
		if (this.el) {
			this.el.style.display = A ? this._displayStyle : "none";
			this.doLayout()
		}
	},
	getVisible : function() {
		return this.visible
	},
	show : function() {
		this.setVisible(true)
	},
	hide : function() {
		this.setVisible(false)
	},
	isDisplay : function() {
		if (mini.WindowVisible == false)
			return false;
		var A = document.body, B = this.el;
		while (1) {
			if (B == null || !B.style)
				return false;
			if (B && B.style && B.style.display == "none")
				return false;
			if (B == A)
				return true;
			B = B.parentNode
		}
		return true
	},
	_allowUpdate : true,
	beginUpdate : function() {
		this._allowUpdate = false
	},
	endUpdate : function() {
		this._allowUpdate = true;
		this.doUpdate()
	},
	doUpdate : function() {
	},
	canLayout : function() {
		if (this._allowLayout == false)
			return false;
		return this.isDisplay()
	},
	doLayout : function() {
	},
	layoutChanged : function() {
		if (this.canLayout() == false)
			return;
		this.doLayout()
	},
	_destroyChildren : function(D) {
		if (this.el) {
			var C = mini.getChildControls(this);
			for ( var A = 0, E = C.length; A < E; A++) {
				var B = C[A];
				B.destroy(D)
			}
		}
	},
	destroy : function(B) {
		this._destroyChildren(B);
		if (this.el) {
			mini.clearEvent(this.el);
			if (B !== false) {
				var A = this.el.parentNode;
				if (A)
					A.removeChild(this.el)
			}
		}
		this._borderEl = null;
		this.el = null;
		mini["unreg"](this);
		this.fire("destroy")
	},
	focus : function() {
		try {
			var A = this;
			A.el.focus()
		} catch (B) {
		}
	},
	blur : function() {
		try {
			var A = this;
			A.el.blur()
		} catch (B) {
		}
	},
	allowAnim : true,
	setAllowAnim : function(A) {
		this.allowAnim = A
	},
	getAllowAnim : function() {
		return this.allowAnim
	},
	_getMaskWrapEl : function() {
		return this.el
	},
	mask : function(A) {
		if (typeof A == "string")
			A = {
				html : A
			};
		A = A || {};
		A.el = this._getMaskWrapEl();
		if (!A.cls)
			A.cls = this._maskCls;
		mini.mask(A)
	},
	unmask : function() {
		mini.unmask(this._getMaskWrapEl())
	},
	_maskCls : "mini-mask-loading",
	loadingMsg : "Loading...",
	loading : function(A) {
		this.mask(A || this.loadingMsg)
	},
	setLoadingMsg : function(A) {
		this.loadingMsg = A
	},
	getLoadingMsg : function() {
		return this.loadingMsg
	},
	_getContextMenu : function(A) {
		var B = A;
		if (typeof A == "string") {
			B = mini.get(A);
			if (!B) {
				mini.parse(A);
				B = mini.get(A)
			}
		} else if (mini.isArray(A))
			B = {
				type : "menu",
				items : A
			};
		else if (!mini.isControl(A))
			B = mini.create(A);
		return B
	},
	__OnHtmlContextMenu : function(B) {
		var A = {
			popupEl : this.el,
			htmlEvent : B,
			cancel : false
		};
		this.contextMenu.fire("BeforeOpen", A);
		if (A.cancel == true)
			return;
		this.contextMenu.fire("opening", A);
		if (A.cancel == true)
			return;
		this.contextMenu.showAtPos(B.pageX, B.pageY);
		this.contextMenu.fire("Open", A);
		return false
	},
	contextMenu : null,
	setContextMenu : function(A) {
		var B = this._getContextMenu(A);
		if (!B)
			return;
		if (this.contextMenu !== B) {
			this.contextMenu = B;
			this.contextMenu.owner = this;
			mini.on(this.el, "contextmenu", this.__OnHtmlContextMenu, this)
		}
	},
	getContextMenu : function() {
		return this.contextMenu
	},
	setDefaultValue : function(A) {
		this.defaultValue = A
	},
	getDefaultValue : function() {
		return this.defaultValue
	},
	setValue : function(A) {
		this.value = A
	},
	getValue : function() {
		return this.value
	},
	ajaxData : null,
	ajaxType : "",
	setAjaxData : function(A) {
		this.ajaxData = A
	},
	getAjaxData : function() {
		return this.ajaxData
	},
	setAjaxType : function(A) {
		this.ajaxType = A
	},
	getAjaxType : function() {
		return this.ajaxType
	},
	_afterApply : function(A) {
	},
	getAttrs : function(el) {
		var attrs = {}, cls = el.className;
		if (cls)
			attrs.cls = cls;
		if (el.value)
			attrs.value = el.value;
		mini._ParseString(el, attrs,
				[ "id", "name", "width", "height", "borderStyle", "value",
						"defaultValue", "contextMenu", "tooltip", "ondestroy",
						"data-options", "ajaxData", "ajaxType" ]);
		mini._ParseBool(el, attrs, [ "visible", "enabled", "readOnly" ]);
		if (el.readOnly && el.readOnly != "false")
			attrs.readOnly = true;
		var style = el.style.cssText;
		if (style)
			attrs.style = style;
		if (isIE9) {
			var bg = el.style.background;
			if (bg) {
				if (!attrs.style)
					attrs.style = "";
				attrs.style += ";background:" + bg
			}
		}
		if (this.style)
			if (attrs.style)
				attrs.style = this.style + ";" + attrs.style;
			else
				attrs.style = this.style;
		if (this.borderStyle)
			if (attrs.borderStyle)
				attrs.borderStyle = this.borderStyle + ";" + attrs.borderStyle;
			else
				attrs.borderStyle = this.borderStyle;
		var ts = mini._attrs;
		if (ts)
			for ( var i = 0, l = ts.length; i < l; i++) {
				var t = ts[i], name = t[0], type = t[1];
				if (!type)
					type = "string";
				if (type == "string")
					mini._ParseString(el, attrs, [ name ]);
				else if (type == "bool")
					mini._ParseBool(el, attrs, [ name ]);
				else if (type == "int")
					mini._ParseInt(el, attrs, [ name ])
			}
		var options = attrs["data-options"];
		if (options) {
			options = eval("(" + options + ")");
			if (options)
				mini.copyTo(attrs, options)
		}
		return attrs
	}
});
mini._attrs = null;
mini.regHtmlAttr = function(B, A) {
	if (!B)
		return;
	if (!A)
		A = "string";
	if (!mini._attrs)
		mini._attrs = [];
	mini._attrs.push( [ B, A ])
};
__mini_setControls = function(A, D, E) {
	D = D || this._contentEl;
	E = E || this;
	if (!A)
		A = [];
	if (!mini.isArray(A))
		A = [ A ];
	for ( var B = 0, F = A.length; B < F; B++) {
		var C = A[B];
		if (typeof C == "string") {
			if (C.indexOf("#") == 0)
				C = mini.byId(C)
		} else if (mini.isElement(C))
			;
		else {
			C = mini.getAndCreate(C);
			C = C.el
		}
		if (!C)
			continue;
		mini.append(D, C)
	}
	mini.parse(D);
	E.doLayout();
	return E
};
mini.Container = function() {
	mini.Container.superclass.constructor.call(this);
	this._contentEl = this.el
};
mini.extend(mini.Container, mini.Control, {
	setControls : __mini_setControls,
	getContentEl : function() {
		return this._contentEl
	},
	getBodyEl : function() {
		return this._contentEl
	}
});
mini.ValidatorBase = function() {
	mini.ValidatorBase.superclass.constructor.call(this)
};
mini.extend(mini.ValidatorBase, mini.Control, {
	required : false,
	requiredErrorText : "This field is required.",
	_requiredCls : "mini-required",
	errorText : "",
	_errorCls : "mini-error",
	_invalidCls : "mini-invalid",
	errorMode : "icon",
	validateOnChanged : true,
	validateOnLeave : true,
	_IsValid : true,
	_tryValidate : function() {
		if (this._tryValidateTimer)
			clearTimeout(this._tryValidateTimer);
		var A = this;
		this._tryValidateTimer = setTimeout(function() {
			A.validate()
		}, 30)
	},
	validate : function() {
		if (this.enabled == false) {
			this.setIsValid(true);
			return true
		}
		var A = {
			value : this.getValue(),
			errorText : "",
			isValid : true
		};
		if (this.required)
			if (mini.isNull(A.value) || String(A.value).trim() === "") {
				A.isValid = false;
				A.errorText = this.requiredErrorText
			}
		this.fire("validation", A);
		this.errorText = A.errorText;
		this.setIsValid(A.isValid);
		return this.isValid()
	},
	isValid : function() {
		return this._IsValid
	},
	setIsValid : function(A) {
		this._IsValid = A;
		this.doUpdateValid()
	},
	getIsValid : function() {
		return this._IsValid
	},
	setValidateOnChanged : function(A) {
		this.validateOnChanged = A
	},
	getValidateOnChanged : function(A) {
		return this.validateOnChanged
	},
	setValidateOnLeave : function(A) {
		this.validateOnLeave = A
	},
	getValidateOnLeave : function(A) {
		return this.validateOnLeave
	},
	setErrorMode : function(A) {
		if (!A)
			A = "none";
		this.errorMode = A.toLowerCase();
		if (this._IsValid == false)
			this.doUpdateValid()
	},
	getErrorMode : function() {
		return this.errorMode
	},
	setErrorText : function(A) {
		this.errorText = A;
		if (this._IsValid == false)
			this.doUpdateValid()
	},
	getErrorText : function() {
		return this.errorText
	},
	setRequired : function(A) {
		this.required = A;
		if (this.required)
			this.addCls(this._requiredCls);
		else
			this.removeCls(this._requiredCls)
	},
	getRequired : function() {
		return this.required
	},
	setRequiredErrorText : function(A) {
		this.requiredErrorText = A
	},
	getRequiredErrorText : function() {
		return this.requiredErrorText
	},
	errorIconEl : null,
	getErrorIconEl : function() {
		return this._errorIconEl
	},
	_RemoveErrorIcon : function() {
	},
	doUpdateValid : function() {
		var A = this;
		this._doUpdateValidTimer = setTimeout(function() {
			A.__doUpdateValid()
		}, 1)
	},
	__doUpdateValid : function() {
		if (!this.el)
			return;
		this.removeCls(this._errorCls);
		this.removeCls(this._invalidCls);
		this.el.title = "";
		if (this._IsValid == false)
			switch (this.errorMode) {
			case "icon":
				this.addCls(this._errorCls);
				var A = this.getErrorIconEl();
				if (A)
					A.title = this.errorText;
				break;
			case "border":
				this.addCls(this._invalidCls);
				this.el.title = this.errorText;
			default:
				this._RemoveErrorIcon();
				break
			}
		else
			this._RemoveErrorIcon();
		this.doLayout()
	},
	_OnValueChanged : function() {
		if (this.validateOnChanged)
			this._tryValidate();
		this.fire("valuechanged", {
			value : this.getValue()
		})
	},
	onValueChanged : function(B, A) {
		this.on("valuechanged", B, A)
	},
	onValidation : function(B, A) {
		this.on("validation", B, A)
	},
	getAttrs : function(B) {
		var C = mini.ValidatorBase.superclass.getAttrs.call(this, B);
		mini._ParseString(B, C, [ "onvaluechanged", "onvalidation",
				"requiredErrorText", "errorMode" ]);
		mini._ParseBool(B, C, [ "validateOnChanged", "validateOnLeave" ]);
		var A = B.getAttribute("required");
		if (!A)
			A = B.required;
		if (A)
			C.required = A != "false" ? true : false;
		return C
	}
});
mini.ListControl = function() {
	this.data = [];
	this._selecteds = [];
	mini.ListControl.superclass.constructor.call(this);
	this.doUpdate()
};
mini
		.extend(
				mini.ListControl,
				mini.ValidatorBase,
				{
					defaultValue : "",
					value : "",
					valueField : "id",
					textField : "text",
					delimiter : ",",
					data : null,
					url : "",
					_itemCls : "mini-list-item",
					_itemHoverCls : "mini-list-item-hover",
					_itemSelectedCls : "mini-list-item-selected",
					set : function(C) {
						if (typeof C == "string")
							return this;
						var A = C.value;
						delete C.value;
						var D = C.url;
						delete C.url;
						var B = C.data;
						delete C.data;
						mini.ListControl.superclass.set.call(this, C);
						if (!mini.isNull(B))
							this.setData(B);
						if (!mini.isNull(D))
							this.setUrl(D);
						if (!mini.isNull(A))
							this.setValue(A);
						return this
					},
					uiCls : "mini-list",
					_create : function() {
					},
					_initEvents : function() {
						mini._BindEvents(function() {
							mini_onOne(this.el, "click", this.__OnClick, this);
							mini_onOne(this.el, "dblclick", this.__OnDblClick,
									this);
							mini_onOne(this.el, "mousedown",
									this.__OnMouseDown, this);
							mini_onOne(this.el, "mouseup", this.__OnMouseUp,
									this);
							mini_onOne(this.el, "mousemove",
									this.__OnMouseMove, this);
							mini_onOne(this.el, "mouseover",
									this.__OnMouseOver, this);
							mini_onOne(this.el, "mouseout", this.__OnMouseOut,
									this);
							mini_onOne(this.el, "keydown", this.__OnKeyDown,
									this);
							mini_onOne(this.el, "keyup", this.__OnKeyUp, this);
							mini_onOne(this.el, "contextmenu",
									this.__OnContextMenu, this)
						}, this)
					},
					destroy : function(A) {
						if (this.el) {
							this.el.onclick = null;
							this.el.ondblclick = null;
							this.el.onmousedown = null;
							this.el.onmouseup = null;
							this.el.onmousemove = null;
							this.el.onmouseover = null;
							this.el.onmouseout = null;
							this.el.onkeydown = null;
							this.el.onkeyup = null;
							this.el.oncontextmenu = null
						}
						mini.ListControl.superclass.destroy.call(this, A)
					},
					name : "",
					setName : function(A) {
						this.name = A;
						if (this._valueEl)
							mini.setAttr(this._valueEl, "name", this.name)
					},
					getItemByEvent : function(B) {
						var C = mini.findParent(B.target, this._itemCls);
						if (C) {
							var A = parseInt(mini.getAttr(C, "index"));
							return this.data[A]
						}
					},
					addItemCls : function(B, C) {
						var A = this.getItemEl(B);
						if (A)
							mini.addClass(A, C)
					},
					removeItemCls : function(B, C) {
						var A = this.getItemEl(B);
						if (A)
							mini.removeClass(A, C)
					},
					getItemEl : function(B) {
						B = this.getItem(B);
						var A = this.data.indexOf(B), C = this._createItemId(A);
						return document.getElementById(C)
					},
					_focusItem : function(B, A) {
						B = this.getItem(B);
						if (!B)
							return;
						var C = this.getItemEl(B);
						if (A && C)
							this.scrollIntoView(B);
						if (this._focusedItem == B) {
							if (C)
								mini.addClass(C, this._itemHoverCls);
							return
						}
						this._blurItem();
						this._focusedItem = B;
						if (C)
							mini.addClass(C, this._itemHoverCls)
					},
					_blurItem : function() {
						if (!this._focusedItem)
							return;
						var A = this.getItemEl(this._focusedItem);
						if (A)
							mini.removeClass(A, this._itemHoverCls);
						this._focusedItem = null
					},
					getFocusedItem : function() {
						return this._focusedItem
					},
					getFocusedIndex : function() {
						return this.data.indexOf(this._focusedItem)
					},
					_scrollViewEl : null,
					scrollIntoView : function(B) {
						try {
							var A = this.getItemEl(B), C = this._scrollViewEl
									|| this.el;
							mini.scrollIntoView(A, C, false)
						} catch (D) {
						}
					},
					getItem : function(A) {
						if (typeof A == "object")
							return A;
						if (typeof A == "number")
							return this.data[A];
						return this.findItems(A)[0]
					},
					getCount : function() {
						return this.data.length
					},
					indexOf : function(A) {
						return this.data.indexOf(A)
					},
					getAt : function(A) {
						return this.data[A]
					},
					updateItem : function(A, B) {
						A = this.getItem(A);
						if (!A)
							return;
						mini.copyTo(A, B);
						this.doUpdate()
					},
					load : function(A) {
						if (typeof A == "string")
							this.setUrl(A);
						else
							this.setData(A)
					},
					loadData : function(A) {
						this.setData(A)
					},
					setData : function(data) {
						if (typeof data == "string")
							data = eval(data);
						if (!mini.isArray(data))
							data = [];
						this.data = data;
						this.doUpdate();
						if (this.value != "") {
							this.deselectAll();
							var records = this.findItems(this.value);
							this.selects(records)
						}
					},
					getData : function() {
						return this.data.clone()
					},
					setUrl : function(A) {
						this.url = A;
						this._doLoad( {})
					},
					getUrl : function() {
						return this.url
					},
					ajaxData : null,
					_doLoad : function(params) {
						try {
							var url = eval(this.url);
							if (url != undefined)
								this.url = url
						} catch (e) {
						}
						var url = this.url, ajaxMethod = "post";
						if (url)
							if (url.indexOf(".txt") != -1
									|| url.indexOf(".json") != -1)
								ajaxMethod = "get";
						var obj = mini._evalAjaxData(this.ajaxData, this);
						mini.copyTo(params, obj);
						var e = {
							url : this.url,
							async : false,
							type : this.ajaxType ? this.ajaxType : ajaxMethod,
							data : params,
							cache : false,
							cancel : false
						};
						this.fire("beforeload", e);
						if (e.data != e.params && e.params != params)
							e.data = e.params;
						if (e.cancel == true)
							return;
						var sf = this, url = e.url;
						mini.copyTo(e, {
							success : function(A) {
								var B = null;
								try {
									B = mini.decode(A)
								} catch (C) {
									B = [];
									if (mini_debugger == true)
										alert(url + "\njson is error.")
								}
								var C = {
									data : B,
									cancel : false
								};
								sf.fire("preload", C);
								if (C.cancel == true)
									return;
								sf.setData(C.data);
								sf.fire("load");
								setTimeout(function() {
									sf.doLayout()
								}, 100)
							},
							error : function(A, C, B) {
								var D = {
									xmlHttp : A,
									errorMsg : A.responseText,
									errorCode : A.status
								};
								if (mini_debugger == true)
									alert(url + "\n" + D.errorCode + "\n"
											+ D.errorMsg);
								sf.fire("loaderror", D)
							}
						});
						this._ajaxer = mini.ajax(e)
					},
					setValue : function(A) {
						if (mini.isNull(A))
							A = "";
						if (this.value !== A) {
							this.deselectAll();
							this.value = A;
							if (this._valueEl)
								this._valueEl.value = A;
							var B = this.findItems(this.value);
							this.selects(B)
						}
					},
					getValue : function() {
						return this.value
					},
					getFormValue : function() {
						return this.value
					},
					setValueField : function(A) {
						this.valueField = A
					},
					getValueField : function() {
						return this.valueField
					},
					setTextField : function(A) {
						this.textField = A
					},
					getTextField : function() {
						return this.textField
					},
					getItemValue : function(A) {
						return String(A[this.valueField])
					},
					getItemText : function(A) {
						var B = A[this.textField];
						return mini.isNull(B) ? "" : String(B)
					},
					getValueAndText : function(C) {
						if (mini.isNull(C))
							C = [];
						if (!mini.isArray(C))
							C = this.findItems(C);
						var D = [], E = [];
						for ( var B = 0, F = C.length; B < F; B++) {
							var A = C[B];
							if (A) {
								D.push(this.getItemValue(A));
								E.push(this.getItemText(A))
							}
						}
						return [ D.join(this.delimiter), E.join(this.delimiter) ]
					},
					findItems : function(D) {
						if (mini.isNull(D) || D === "")
							return [];
						var G = String(D).split(this.delimiter), F = this.data, J = {};
						for ( var H = 0, C = F.length; H < C; H++) {
							var B = F[H], K = B[this.valueField];
							J[K] = B
						}
						var E = [];
						for ( var A = 0, I = G.length; A < I; A++) {
							K = G[A], B = J[K];
							if (B)
								E.push(B)
						}
						return E
					},
					removeAll : function() {
						var A = this.getData();
						this.removeItems(A)
					},
					addItems : function(B, A) {
						if (!mini.isArray(B))
							return;
						if (mini.isNull(A))
							A = this.data.length;
						this.data.insertRange(A, B);
						this.doUpdate()
					},
					addItem : function(B, A) {
						if (!B)
							return;
						if (this.data.indexOf(B) != -1)
							return;
						if (mini.isNull(A))
							A = this.data.length;
						this.data.insert(A, B);
						this.doUpdate()
					},
					removeItems : function(A) {
						if (!mini.isArray(A))
							return;
						this.data.removeRange(A);
						this._checkSelecteds();
						this.doUpdate()
					},
					removeItem : function(B) {
						var A = this.data.indexOf(B);
						if (A != -1) {
							this.data.removeAt(A);
							this._checkSelecteds();
							this.doUpdate()
						}
					},
					moveItem : function(B, A) {
						if (!B || !mini.isNumber(A))
							return;
						if (A < 0)
							A = 0;
						if (A > this.data.length)
							A = this.data.length;
						this.data.remove(B);
						this.data.insert(A, B);
						this.doUpdate()
					},
					_selected : null,
					_selecteds : [],
					multiSelect : false,
					_checkSelecteds : function() {
						for ( var B = this._selecteds.length - 1; B >= 0; B--) {
							var A = this._selecteds[B];
							if (this.data.indexOf(A) == -1)
								this._selecteds.removeAt(B)
						}
						var C = this.getValueAndText(this._selecteds);
						this.value = C[0];
						if (this._valueEl)
							this._valueEl.value = this.value
					},
					setMultiSelect : function(A) {
						this.multiSelect = A
					},
					getMultiSelect : function() {
						return this.multiSelect
					},
					isSelected : function(A) {
						if (!A)
							return false;
						return this._selecteds.indexOf(A) != -1
					},
					getSelecteds : function() {
						var A = this._selecteds.clone(), B = this;
						mini.sort(A, function(C, E) {
							var A = B.indexOf(C), D = B.indexOf(E);
							if (A > D)
								return 1;
							if (A < D)
								return -1;
							return 0
						});
						return A
					},
					setSelected : function(A) {
						if (A) {
							this._selected = A;
							this.select(A)
						}
					},
					getSelected : function() {
						return this._selected
					},
					select : function(A) {
						A = this.getItem(A);
						if (!A)
							return;
						if (this.isSelected(A))
							return;
						this.selects( [ A ])
					},
					deselect : function(A) {
						A = this.getItem(A);
						if (!A)
							return;
						if (!this.isSelected(A))
							return;
						this.deselects( [ A ])
					},
					selectAll : function() {
						var A = this.data.clone();
						this.selects(A)
					},
					deselectAll : function() {
						this.deselects(this._selecteds)
					},
					clearSelect : function() {
						this.deselectAll()
					},
					selects : function(C) {
						if (!C || C.length == 0)
							return;
						C = C.clone();
						for ( var B = 0, E = C.length; B < E; B++) {
							var A = C[B];
							if (!this.isSelected(A))
								this._selecteds.push(A)
						}
						var D = this;
						setTimeout(function() {
							D._doSelects()
						}, 1)
					},
					deselects : function(C) {
						if (!C || C.length == 0)
							return;
						C = C.clone();
						for ( var B = C.length - 1; B >= 0; B--) {
							var A = C[B];
							if (this.isSelected(A))
								this._selecteds.remove(A)
						}
						var D = this;
						setTimeout(function() {
							D._doSelects()
						}, 1)
					},
					_doSelects : function() {
						var E = this.getValueAndText(this._selecteds);
						this.value = E[0];
						if (this._valueEl)
							this._valueEl.value = this.value;
						for ( var C = 0, F = this.data.length; C < F; C++) {
							var B = this.data[C], H = this.isSelected(B);
							if (H)
								this.addItemCls(B, this._itemSelectedCls);
							else
								this.removeItemCls(B, this._itemSelectedCls);
							var A = this.data.indexOf(B), G = this
									._createCheckId(A), D = document
									.getElementById(G);
							if (D)
								D.checked = !!H
						}
					},
					_OnSelectionChanged : function(B, D) {
						var A = this.getValueAndText(this._selecteds);
						this.value = A[0];
						if (this._valueEl)
							this._valueEl.value = this.value;
						var C = {
							selecteds : this.getSelecteds(),
							selected : this.getSelected(),
							value : this.getValue()
						};
						this.fire("SelectionChanged", C)
					},
					_createCheckId : function(A) {
						return this.uid + "$ck$" + A
					},
					_createItemId : function(A) {
						return this.uid + "$" + A
					},
					__OnClick : function(A) {
						this._fireEvent(A, "Click")
					},
					__OnDblClick : function(A) {
						this._fireEvent(A, "Dblclick")
					},
					__OnMouseDown : function(A) {
						this._fireEvent(A, "MouseDown")
					},
					__OnMouseUp : function(A) {
						this._fireEvent(A, "MouseUp")
					},
					__OnMouseMove : function(A) {
						this._fireEvent(A, "MouseMove")
					},
					__OnMouseOver : function(A) {
						this._fireEvent(A, "MouseOver")
					},
					__OnMouseOut : function(A) {
						this._fireEvent(A, "MouseOut")
					},
					__OnKeyDown : function(A) {
						this._fireEvent(A, "KeyDown")
					},
					__OnKeyUp : function(A) {
						this._fireEvent(A, "KeyUp")
					},
					__OnContextMenu : function(A) {
						this._fireEvent(A, "ContextMenu")
					},
					_fireEvent : function(E, C) {
						if (!this.enabled)
							return;
						var A = this.getItemByEvent(E);
						if (!A)
							return;
						var D = this["_OnItem" + C];
						if (D)
							D.call(this, A, E);
						else {
							var B = {
								item : A,
								htmlEvent : E
							};
							this.fire("item" + C, B)
						}
					},
					_OnItemClick : function(A, C) {
						if (this.isReadOnly() || this.enabled == false
								|| A.enabled === false) {
							C.preventDefault();
							return
						}
						var B = this.getValue();
						if (this.multiSelect) {
							if (this.isSelected(A)) {
								this.deselect(A);
								if (this._selected == A)
									this._selected = null
							} else {
								this.select(A);
								this._selected = A
							}
							this._OnSelectionChanged()
						} else if (!this.isSelected(A)) {
							this.deselectAll();
							this.select(A);
							this._selected = A;
							this._OnSelectionChanged()
						}
						if (B != this.getValue())
							this._OnValueChanged();
						var C = {
							item : A,
							htmlEvent : C
						};
						this.fire("itemclick", C)
					},
					_blurOnOut : true,
					_OnItemMouseOut : function(A, B) {
						mini.repaint(this.el);
						if (!this.enabled)
							return;
						if (this._blurOnOut)
							this._blurItem();
						var B = {
							item : A,
							htmlEvent : B
						};
						this.fire("itemmouseout", B)
					},
					_OnItemMouseMove : function(A, B) {
						mini.repaint(this.el);
						if (!this.enabled || A.enabled === false)
							return;
						this._focusItem(A);
						var B = {
							item : A,
							htmlEvent : B
						};
						this.fire("itemmousemove", B)
					},
					onItemClick : function(B, A) {
						this.on("itemclick", B, A)
					},
					onItemMouseDown : function(B, A) {
						this.on("itemmousedown", B, A)
					},
					onBeforeLoad : function(B, A) {
						this.on("beforeload", B, A)
					},
					onLoad : function(B, A) {
						this.on("load", B, A)
					},
					onLoadError : function(B, A) {
						this.on("loaderror", B, A)
					},
					onPreLoad : function(B, A) {
						this.on("preload", B, A)
					},
					getAttrs : function(E) {
						var I = mini.ListControl.superclass.getAttrs.call(this,
								E);
						mini._ParseString(E, I, [ "url", "data", "value",
								"textField", "valueField", "onitemclick",
								"onitemmousemove", "onselectionchanged",
								"onitemdblclick", "onbeforeload", "onload",
								"onloaderror", "ondataload" ]);
						mini._ParseBool(E, I, [ "multiSelect" ]);
						var G = I.valueField || this.valueField, D = I.textField
								|| this.textField;
						if (E.nodeName.toLowerCase() == "select") {
							var F = [];
							for ( var C = 0, H = E.length; C < H; C++) {
								var B = E.options[C], A = {};
								A[D] = B.text;
								A[G] = B.value;
								F.push(A)
							}
							if (F.length > 0)
								I.data = F
						}
						return I
					}
				});
mini._Layouts = {};
mini.layout = function(A, B) {
	function C(E) {
		var F = mini.get(E);
		if (F) {
			if (F.doLayout)
				if (!mini._Layouts[F.uid]) {
					mini._Layouts[F.uid] = F;
					if (B !== false || F.isFixedSize() == false)
						F.doLayout(false);
					delete mini._Layouts[F.uid]
				}
		} else {
			var G = E.childNodes;
			if (G)
				for ( var A = 0, H = G.length; A < H; A++) {
					var D = G[A];
					C(D)
				}
		}
	}
	if (!A)
		A = document.body;
	C(A);
	if (A == document.body)
		mini.layoutIFrames()
};
mini.applyTo = function(B) {
	B = mini.byId(B);
	if (!B)
		return this;
	if (mini.get(B))
		throw new Error("not applyTo a mini control");
	var A = this.getAttrs(B);
	delete A._applyTo;
	if (mini.isNull(A.defaultValue) && !mini.isNull(A.value))
		A.defaultValue = A.value;
	var C = B.parentNode;
	if (C && this.el != B)
		C.replaceChild(this.el, B);
	this.set(A);
	this._afterApply(B);
	return this
};
mini._doParse = function(I) {
	var H = I.nodeName.toLowerCase();
	if (!H)
		return;
	var D = I.className;
	if (D) {
		var A = mini.get(I);
		if (!A) {
			var J = D.split(" ");
			for ( var G = 0, E = J.length; G < E; G++) {
				var C = J[G], K = mini.getClassByUICls(C);
				if (K) {
					mini.removeClass(I, C);
					var F = new K();
					mini.applyTo.call(F, I);
					I = F.el;
					break
				}
			}
		}
	}
	if (H == "select" || mini.hasClass(I, "mini-menu")
			|| mini.hasClass(I, "mini-datagrid")
			|| mini.hasClass(I, "mini-treegrid")
			|| mini.hasClass(I, "mini-tree") || mini.hasClass(I, "mini-button")
			|| mini.hasClass(I, "mini-textbox")
			|| mini.hasClass(I, "mini-buttonedit"))
		return;
	var L = mini.getChildNodes(I, true);
	for (G = 0, E = L.length; G < E; G++) {
		var B = L[G];
		if (B.nodeType == 1)
			if (B.parentNode == I)
				mini._doParse(B)
	}
};
mini._Removes = [];
mini.parse = function(A) {
	if (typeof A == "string") {
		var C = A;
		A = mini.byId(C);
		if (!A)
			A = document.body
	}
	if (A && !mini.isElement(A))
		A = A.el;
	if (!A)
		A = document.body;
	var B = mini.WindowVisible;
	if (isIE)
		mini.WindowVisible = false;
	mini._doParse(A);
	mini.WindowVisible = B;
	mini.layout(A)
};
mini._ParseString = function(D, C, G) {
	for ( var A = 0, F = G.length; A < F; A++) {
		var E = G[A], B = mini.getAttr(D, E);
		if (B)
			C[E] = B
	}
};
mini._ParseBool = function(D, C, G) {
	for ( var A = 0, F = G.length; A < F; A++) {
		var E = G[A], B = mini.getAttr(D, E);
		if (B)
			C[E] = B == "true" ? true : false
	}
};
mini._ParseInt = function(D, C, G) {
	for ( var A = 0, F = G.length; A < F; A++) {
		var E = G[A], B = parseInt(mini.getAttr(D, E));
		if (!isNaN(B))
			C[E] = B
	}
};
mini._ParseColumns = function(P) {
	var I = [], Q = mini.getChildNodes(P);
	for ( var O = 0, J = Q.length; O < J; O++) {
		var E = Q[O], V = jQuery(E), F = {}, L = null, M = null, B = mini
				.getChildNodes(E);
		if (B)
			for ( var A = 0, R = B.length; A < R; A++) {
				var D = B[A], C = jQuery(D).attr("property");
				if (!C)
					continue;
				C = C.toLowerCase();
				if (C == "columns") {
					F.columns = mini._ParseColumns(D);
					jQuery(D).remove()
				}
				if (C == "editor" || C == "filter") {
					var H = D.className, T = H.split(" ");
					for ( var N = 0, U = T.length; N < U; N++) {
						var G = T[N], S = mini.getClassByUICls(G);
						if (S) {
							var K = new S();
							if (C == "filter") {
								M = K.getAttrs(D);
								M.type = K.type
							} else {
								L = K.getAttrs(D);
								L.type = K.type
							}
							break
						}
					}
					jQuery(D).remove()
				}
			}
		F.header = E.innerHTML;
		mini._ParseString(E, F, [ "name", "header", "field", "editor",
				"filter", "renderer", "width", "type", "renderer",
				"headerAlign", "align", "headerCls", "cellCls", "headerStyle",
				"cellStyle", "displayField", "dateFormat", "listFormat",
				"mapFormat", "trueValue", "falseValue", "dataType", "vtype",
				"currencyUnit", "summaryType", "summaryRenderer",
				"groupSummaryType", "groupSummaryRenderer", "defaultValue",
				"defaultText", "decimalPlaces" ]);
		mini._ParseBool(E, F, [ "visible", "readOnly", "allowSort",
				"allowResize", "allowMove", "allowDrag", "autoShowPopup",
				"unique", "autoEscape" ]);
		if (L)
			F.editor = L;
		if (M)
			F.filter = M;
		if (F.dataType)
			F.dataType = F.dataType.toLowerCase();
		if (F.defaultValue === "true")
			F.defaultValue = true;
		if (F.defaultValue === "false")
			F.defaultValue = false;
		I.push(F)
	}
	return I
};
mini._Columns = {};
mini._getColumn = function(A) {
	var B = mini._Columns[A.toLowerCase()];
	if (!B)
		return {};
	return B()
};
mini.IndexColumn = function(A) {
	return mini.copyTo( {
		width : 30,
		cellCls : "",
		align : "center",
		draggable : false,
		allowDrag : true,
		init : function(A) {
			A.on("addrow", this.__OnIndexChanged, this);
			A.on("removerow", this.__OnIndexChanged, this);
			A.on("moverow", this.__OnIndexChanged, this);
			if (A.isTree) {
				A.on("loadnode", this.__OnIndexChanged, this);
				this._gridUID = A.uid;
				this._rowIdField = "_id"
			}
		},
		getNumberId : function(A) {
			return this._gridUID + "$number$" + A[this._rowIdField]
		},
		createNumber : function(A, B) {
			if (mini.isNull(A.pageIndex))
				return B + 1;
			else
				return (A.pageIndex * A.pageSize) + B + 1
		},
		renderer : function(C) {
			var A = C.sender;
			if (this.draggable) {
				if (!C.cellStyle)
					C.cellStyle = "";
				C.cellStyle += ";cursor:move;"
			}
			var B = "<div id=\"" + this.getNumberId(C.record) + "\">";
			if (mini.isNull(A.pageIndex))
				B += C.rowIndex + 1;
			else
				B += (A.pageIndex * A.pageSize) + C.rowIndex + 1;
			B += "</div>";
			return B
		},
		__OnIndexChanged : function(H) {
			var A = H.sender, E = A.toArray();
			for ( var C = 0, F = E.length; C < F; C++) {
				var B = E[C], G = this.getNumberId(B), D = document
						.getElementById(G);
				if (D)
					D.innerHTML = this.createNumber(A, C)
			}
		}
	}, A)
};
mini._Columns["indexcolumn"] = mini.IndexColumn;
mini.CheckColumn = function(A) {
	return mini
			.copyTo(
					{
						width : 30,
						cellCls : "mini-checkcolumn",
						headerCls : "mini-checkcolumn",
						_multiRowSelect : true,
						header : function(A) {
							var C = this.uid + "checkall", B = "<input type=\"checkbox\" id=\""
									+ C + "\" />";
							if (this.multiSelect == false)
								B = "";
							return B
						},
						getCheckId : function(A) {
							return this._gridUID + "$checkcolumn$"
									+ A[this._rowIdField]
						},
						init : function(A) {
							A.on("selectionchanged", this.__OnSelectionChanged,
									this);
							A.on("HeaderCellClick", this.__OnHeaderCellClick,
									this)
						},
						renderer : function(E) {
							var D = this.getCheckId(E.record), B = E.sender.isSelected ? E.sender
									.isSelected(E.record)
									: false, C = "checkbox", A = E.sender;
							if (A.multiSelect == false)
								C = "radio";
							return "<input type=\""
									+ C
									+ "\" id=\""
									+ D
									+ "\" "
									+ (B ? "checked" : "")
									+ " hidefocus style=\"outline:none;\" onclick=\"return false\"/>"
						},
						__OnHeaderCellClick : function(D) {
							var A = D.sender;
							if (D.column != this)
								return;
							var C = A.uid + "checkall", B = document
									.getElementById(C);
							if (B) {
								if (A.getMultiSelect()) {
									if (B.checked)
										A.selectAll();
									else
										A.deselectAll()
								} else {
									A.deselectAll();
									if (B.checked)
										A.select(0)
								}
								A.fire("checkall")
							}
						},
						__OnSelectionChanged : function(J) {
							var A = J.sender, E = A.toArray();
							for ( var C = 0, G = E.length; C < G; C++) {
								var B = E[C], I = A.isSelected(B), H = A.uid
										+ "$checkcolumn$" + B[A._rowIdField], D = document
										.getElementById(H);
								if (D)
									D.checked = I
							}
							var F = this;
							if (!this._timer)
								this._timer = setTimeout(function() {
									F._doCheckState(A);
									F._timer = null
								}, 10)
						},
						_doCheckState : function(A) {
							var D = A.uid + "checkall", B = document
									.getElementById(D);
							if (B && A._getSelectAllCheckState) {
								var C = A._getSelectAllCheckState();
								if (C == "has") {
									B.indeterminate = true;
									B.checked = true
								} else {
									B.indeterminate = false;
									B.checked = C
								}
							}
						}
					}, A)
};
mini._Columns["checkcolumn"] = mini.CheckColumn;
mini.ExpandColumn = function(A) {
	return mini
			.copyTo(
					{
						width : 30,
						headerAlign : "center",
						align : "center",
						draggable : false,
						cellStyle : "padding:0",
						cellCls : "mini-grid-expandCell",
						renderer : function(A) {
							return "<a class=\"mini-grid-ecIcon\" href=\"javascript:#\" onclick=\"return false\"></a>"
						},
						init : function(A) {
							A.on("cellclick", this.__OnCellClick, this)
						},
						__OnCellClick : function(C) {
							var A = C.sender;
							if (C.column == this && A.isShowRowDetail)
								if (mini.findParent(C.htmlEvent.target,
										"mini-grid-ecIcon")) {
									var B = A.isShowRowDetail(C.record);
									if (A.autoHideRowDetail)
										A.hideAllRowDetail();
									if (B)
										A.hideRowDetail(C.record);
									else
										A.showRowDetail(C.record)
								}
						}
					}, A)
};
mini._Columns["expandcolumn"] = mini.ExpandColumn;
mini.CheckBoxColumn = function(A) {
	return mini
			.copyTo(
					{
						_type : "checkboxcolumn",
						header : "#",
						headerAlign : "center",
						cellCls : "mini-checkcolumn",
						trueValue : true,
						falseValue : false,
						readOnly : false,
						getCheckId : function(A) {
							return this._gridUID + "$checkbox$"
									+ A[this._rowIdField]
						},
						getCheckBoxEl : function(A) {
							return document.getElementById(this.getCheckId(A))
						},
						renderer : function(D) {
							var C = this.getCheckId(D.record), B = D.record[D.field] == this.trueValue ? true
									: false, A = "checkbox";
							return "<input type=\""
									+ A
									+ "\" id=\""
									+ C
									+ "\" "
									+ (B ? "checked" : "")
									+ " hidefocus style=\"outline:none;\" onclick=\"return false;\"/>"
						},
						init : function(A) {
							this.grid = A;
							function B(D) {
								if (A.isReadOnly() || this.readOnly)
									return;
								D.value = D.record[D.field];
								A.fire("cellbeginedit", D);
								if (D.cancel !== true) {
									var C = mini._getMap(D.column.field,
											D.record), B = C == this.trueValue ? this.falseValue
											: this.trueValue;
									if (A._OnCellCommitEdit)
										A._OnCellCommitEdit(D.record, D.column,
												B)
								}
							}
							function C(E) {
								if (E.column == this) {
									var D = this.getCheckId(E.record), C = E.htmlEvent.target;
									if (C.id == D)
										if (A.allowCellEdit) {
											E.cancel = false;
											B.call(this, E)
										} else if (A.isEditingRow
												&& A.isEditingRow(E.record))
											setTimeout(function() {
												C.checked = !C.checked
											}, 1)
								}
							}
							A.on("cellclick", C, this);
							mini.on(this.grid.el, "keydown", function(E) {
								if (E.keyCode == 32 && A.allowCellEdit) {
									var C = A.getCurrentCell();
									if (!C)
										return;
									var D = {
										record : C[0],
										column : C[1]
									};
									B.call(this, D);
									E.preventDefault()
								}
							}, this);
							var D = parseInt(this.trueValue), E = parseInt(this.falseValue);
							if (!isNaN(D))
								this.trueValue = D;
							if (!isNaN(E))
								this.falseValue = E
						}
					}, A)
};
mini._Columns["checkboxcolumn"] = mini.CheckBoxColumn;
mini.ComboBoxColumn = function(A) {
	return mini
			.copyTo(
					{
						renderer : function(O) {
							var B = !mini.isNull(O.value) ? String(O.value)
									: "", E = B.split(","), F = "id", L = "text", C = {}, I = O.column.editor;
							if (I && I.type == "combobox") {
								var D = this.__editor;
								if (!D) {
									if (mini.isControl(I))
										D = I;
									else {
										I = mini.clone(I);
										D = mini.create(I)
									}
									this.__editor = D
								}
								F = D.getValueField();
								L = D.getTextField();
								C = this._valueMaps;
								if (!C) {
									C = {};
									var M = D.getData();
									for ( var J = 0, G = M.length; J < G; J++) {
										var A = M[J];
										C[A[F]] = A
									}
									this._valueMaps = C
								}
							}
							var N = [];
							for (J = 0, G = E.length; J < G; J++) {
								var H = E[J], A = C[H];
								if (A) {
									var K = A[L];
									if (K === null || K === undefined)
										K = "";
									N.push(K)
								}
							}
							return N.join(",")
						}
					}, A)
};
mini._Columns["comboboxcolumn"] = mini.ComboBoxColumn;
mini._Resizer = function(A) {
	this.owner = A;
	mini.on(this.owner.el, "mousedown", this.__OnMouseDown, this)
};
mini._Resizer.prototype = {
	__OnMouseDown : function(C) {
		var A = mini.hasClass(C.target, "mini-resizer-trigger");
		if (A && this.owner.allowResize) {
			var B = this._getResizeDrag();
			B.start(C)
		}
	},
	_getResizeDrag : function() {
		if (!this._resizeDragger)
			this._resizeDragger = new mini.Drag( {
				capture : true,
				onStart : mini.createDelegate(this._OnDragStart, this),
				onMove : mini.createDelegate(this._OnDragMove, this),
				onStop : mini.createDelegate(this._OnDragStop, this)
			});
		return this._resizeDragger
	},
	_OnDragStart : function(A) {
		this.proxy = mini.append(document.body,
				"<div class=\"mini-resizer-proxy\"></div>");
		this.proxy.style.cursor = "se-resize";
		this.elBox = mini.getBox(this.owner.el);
		mini.setBox(this.proxy, this.elBox)
	},
	_OnDragMove : function(D) {
		var A = this.owner, F = D.now[0] - D.init[0], B = D.now[1] - D.init[1], C = this.elBox.width
				+ F, E = this.elBox.height + B;
		if (C < A.minWidth)
			C = A.minWidth;
		if (E < A.minHeight)
			E = A.minHeight;
		if (C > A.maxWidth)
			C = A.maxWidth;
		if (E > A.maxHeight)
			E = A.maxHeight;
		mini.setSize(this.proxy, C, E)
	},
	_OnDragStop : function(A, C) {
		if (!this.proxy)
			return;
		var B = mini.getBox(this.proxy);
		jQuery(this.proxy).remove();
		this.proxy = null;
		this.elBox = null;
		if (C) {
			this.owner.setWidth(B.width);
			this.owner.setHeight(B.height);
			this.owner.fire("resize")
		}
	}
};
mini._topWindow = null;
mini._getTopWindow = function() {
	if (mini._topWindow)
		return mini._topWindow;
	var A = [];
	function B(C) {
		try {
			C["___try"] = 1;
			A.push(C)
		} catch (D) {
		}
		if (C.parent && C.parent != C)
			B(C.parent)
	}
	B(window);
	mini._topWindow = A[A.length - 1];
	return mini._topWindow
};
var __ps = mini.getParams();
if (__ps._winid) {
	try {
		window.Owner = mini._getTopWindow()[__ps._winid]
	} catch (ex) {
	}
}
mini._WindowID = "w" + Math.floor(Math.random() * 10000);
mini._getTopWindow()[mini._WindowID] = window;
mini.__IFrameCreateCount = 1;
mini.createIFrame = function(G, H) {
	var J = "__iframe_onload" + mini.__IFrameCreateCount++;
	window[J] = B;
	if (!G)
		G = "";
	var F = G.split("#");
	G = F[0];
	var E = "_t=" + Math.floor(Math.random() * 1000000);
	if (G.indexOf("?") == -1)
		G += "?" + E;
	else
		G += "&" + E;
	if (F[1])
		G = G + "#" + F[1];
	var I = "<iframe style=\"width:100%;height:100%;\" onload=\"" + J
			+ "()\"  frameborder=\"0\"></iframe>", A = document
			.createElement("div"), D = mini.append(A, I), K = false;
	setTimeout(function() {
		if (D) {
			D.src = G;
			K = true
		}
	}, 5);
	var C = true;
	function B() {
		if (K == false)
			return;
		setTimeout(function() {
			if (H)
				H(D, C);
			C = false
		}, 1)
	}
	D._ondestroy = function() {
		window[J] = mini.emptyFn;
		D.src = "";
		try {
			D.contentWindow.document.write("");
			D.contentWindow.document.close()
		} catch (A) {
		}
		D._ondestroy = null;
		D = null
	};
	return D
};
mini._doOpen = function(E) {
	if (typeof E == "string")
		E = {
			url : E
		};
	E = mini.copyTo( {
		width : 700,
		height : 400,
		allowResize : true,
		allowModal : true,
		closeAction : "destroy",
		title : "",
		titleIcon : "",
		iconCls : "",
		iconStyle : "",
		bodyStyle : "padding: 0",
		url : "",
		showCloseButton : true,
		showFooter : false
	}, E);
	E.closeAction = "destroy";
	var A = E.onload;
	delete E.onload;
	var D = E.ondestroy;
	delete E.ondestroy;
	var B = E.url;
	delete E.url;
	var C = new mini.Window();
	C.set(E);
	C.load(B, A, D);
	C.show();
	return C
};
mini.open = function(G) {
	if (!G)
		return;
	var E = G.url;
	if (!E)
		E = "";
	var D = E.split("#"), E = D[0], C = "_winid=" + mini._WindowID;
	if (E.indexOf("?") == -1)
		E += "?" + C;
	else
		E += "&" + C;
	if (D[1])
		E = E + "#" + D[1];
	G.url = E;
	G.Owner = window;
	var A = [];
	function B(C) {
		if (C.mini)
			A.push(C);
		if (C.parent && C.parent != C)
			B(C.parent)
	}
	B(window);
	var F = A[A.length - 1];
	return F["mini"]._doOpen(G)
};
mini.openTop = mini.open;
mini.getData = function(E, C, G, F, B) {
	var A = mini.getText(E, C, G, F, B), D = mini.decode(A);
	return D
};
mini.getText = function(D, C, F, E, B) {
	var A = null;
	mini.ajax( {
		url : D,
		data : C,
		async : false,
		type : B ? B : "get",
		cache : false,
		dataType : "text",
		success : function(C, B) {
			A = C;
			if (F)
				F(C, B)
		},
		error : E
	});
	return A
};
if (!window.mini_RootPath)
	mini_RootPath = "/";
mini_CreateJSPath = function(D) {
	var C = document.getElementsByTagName("script"), F = "";
	for ( var A = 0, G = C.length; A < G; A++) {
		var E = C[A].src;
		if (E.indexOf(D) != -1) {
			var H = E.split(D);
			F = H[0];
			break
		}
	}
	var B = location.href;
	B = B.split("#")[0];
	B = B.split("?")[0];
	H = B.split("/");
	H.length = H.length - 1;
	B = H.join("/");
	if (F.indexOf("http:") == -1 && F.indexOf("file:") == -1)
		F = B + "/" + F;
	return F
};
if (!window.mini_JSPath)
	mini_JSPath = mini_CreateJSPath("miniui.js");
mini.update = function(C, B) {
	if (typeof C == "string")
		C = {
			url : C
		};
	if (B)
		C.el = B;
	var A = mini.loadText(C.url);
	mini.innerHTML(C.el, A);
	mini.parse(C.el)
};
mini.createSingle = function(A) {
	if (typeof A == "string")
		A = mini.getClass(A);
	if (typeof A != "function")
		return;
	var B = A.single;
	if (!B)
		B = A.single = new A();
	return B
};
mini.createTopSingle = function(A) {
	if (typeof A != "function")
		return;
	var B = A.prototype.type;
	if (top && top != window && top.mini && top.mini.getClass(B))
		return top.mini.createSingle(B);
	else
		return mini.createSingle(A)
};
mini.sortTypes = {
	"string" : function(A) {
		return String(A).toUpperCase()
	},
	"date" : function(A) {
		if (!A)
			return 0;
		if (mini.isDate(A))
			return A.getTime();
		return mini.parseDate(String(A))
	},
	"float" : function(B) {
		var A = parseFloat(String(B).replace(/,/g, ""));
		return isNaN(A) ? 0 : A
	},
	"int" : function(B) {
		var A = parseInt(String(B).replace(/,/g, ""), 10);
		return isNaN(A) ? 0 : A
	}
};
mini._ValidateVType = function(I, A, M, J) {
	var H = I.split(";");
	for ( var G = 0, E = H.length; G < E; G++) {
		var I = H[G].trim(), L = I.split(":"), C = L[0], B = L[1];
		if (B)
			B = B.split(",");
		else
			B = [];
		var F = mini.VTypes[C];
		if (F) {
			var K = F(A, B);
			if (K !== true) {
				M.isValid = false;
				var D = L[0] + "ErrorText";
				M.errorText = J[D] || mini.VTypes[D] || "";
				M.errorText = String.format(M.errorText, B[0], B[1], B[2],
						B[3], B[4]);
				break
			}
		}
	}
};
mini._getErrorText = function(A, B) {
	if (A && A[B])
		return A[B];
	else
		return mini.VTypes[B]
};
mini.VTypes = {
	uniqueErrorText : "This field is unique.",
	requiredErrorText : "This field is required.",
	emailErrorText : "Please enter a valid email address.",
	urlErrorText : "Please enter a valid URL.",
	floatErrorText : "Please enter a valid number.",
	intErrorText : "Please enter only digits",
	dateErrorText : "Please enter a valid date. Date format is {0}",
	maxLengthErrorText : "Please enter no more than {0} characters.",
	minLengthErrorText : "Please enter at least {0} characters.",
	maxErrorText : "Please enter a value less than or equal to {0}.",
	minErrorText : "Please enter a value greater than or equal to {0}.",
	rangeLengthErrorText : "Please enter a value between {0} and {1} characters long.",
	rangeCharErrorText : "Please enter a value between {0} and {1} characters long.",
	rangeErrorText : "Please enter a value between {0} and {1}.",
	required : function(B, A) {
		if (mini.isNull(B) || B === "")
			return false;
		return true
	},
	email : function(B, A) {
		if (mini.isNull(B) || B === "")
			return true;
		if (B
				.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
			return true;
		else
			return false
	},
	url : function(C, A) {
		if (mini.isNull(C) || C === "")
			return true;
		function B(B) {
			B = B.toLowerCase();
			var A = "^((https|http|ftp|rtsp|mms)?://)"
					+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
					+ "(([0-9]{1,3}.){3}[0-9]{1,3}" + "|"
					+ "([0-9a-z_!~*'()-]+.)*"
					+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." + "[a-z]{2,6})"
					+ "(:[0-9]{1,4})?" + "((/?)|"
					+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$", C = new RegExp(A);
			if (C.test(B))
				return (true);
			else
				return (false)
		}
		return B(C)
	},
	"int" : function(C, B) {
		if (mini.isNull(C) || C === "")
			return true;
		function A(B) {
			var A = String(B);
			return A.length > 0 && !(/[^0-9]/).test(A)
		}
		return A(C)
	},
	"float" : function(C, B) {
		if (mini.isNull(C) || C === "")
			return true;
		function A(B) {
			if (B < 0)
				B = -B;
			var A = String(B);
			return A.length > 0 && !(/[^0-9.]/).test(A)
		}
		return A(C)
	},
	"date" : function(D, B) {
		if (mini.isNull(D) || D === "")
			return true;
		if (!D)
			return false;
		var A = null, C = B[0];
		if (C) {
			A = mini.parseDate(D, C);
			if (A && A.getFullYear)
				if (mini.formatDate(A, C) == D)
					return true
		} else {
			A = mini.parseDate(D, "yyyy-MM-dd");
			if (!A)
				A = mini.parseDate(D, "yyyy/MM/dd");
			if (!A)
				A = mini.parseDate(D, "MM/dd/yyyy");
			if (A && A.getFullYear)
				return true
		}
		return false
	},
	maxLength : function(C, A) {
		if (mini.isNull(C) || C === "")
			return true;
		var B = parseInt(A);
		if (!C || isNaN(B))
			return true;
		if (C.length <= B)
			return true;
		else
			return false
	},
	minLength : function(C, A) {
		if (mini.isNull(C) || C === "")
			return true;
		var B = parseInt(A);
		if (isNaN(B))
			return true;
		if (C.length >= B)
			return true;
		else
			return false
	},
	rangeLength : function(D, B) {
		if (mini.isNull(D) || D === "")
			return true;
		if (!D)
			return false;
		var A = parseFloat(B[0]), C = parseFloat(B[1]);
		if (isNaN(A) || isNaN(C))
			return true;
		if (A <= D.length && D.length <= C)
			return true;
		return false
	},
	rangeChar : function(I, D) {
		if (mini.isNull(I) || I === "")
			return true;
		var C = parseFloat(D[0]), G = parseFloat(D[1]);
		if (isNaN(C) || isNaN(G))
			return true;
		function E(B) {
			var A = new RegExp("^[\u4e00-\u9fa5]+$");
			if (A.test(B))
				return true;
			return false
		}
		var A = 0, H = String(I).split("");
		for ( var B = 0, F = H.length; B < F; B++)
			if (E(H[B]))
				A += 2;
			else
				A += 1;
		if (C <= A && A <= G)
			return true;
		return false
	},
	range : function(D, B) {
		if (mini.isNull(D) || D === "")
			return true;
		D = parseFloat(D);
		if (isNaN(D))
			return false;
		var A = parseFloat(B[0]), C = parseFloat(B[1]);
		if (isNaN(A) || isNaN(C))
			return true;
		if (A <= D && D <= C)
			return true;
		return false
	}
};
mini.summaryTypes = {
	"count" : function(A) {
		if (!A)
			A = [];
		return A.length
	},
	"max" : function(D, E) {
		if (!D)
			D = [];
		var G = null;
		for ( var B = 0, F = D.length; B < F; B++) {
			var A = D[B], C = parseFloat(A[E]);
			if (C === null || C === undefined || isNaN(C))
				continue;
			if (G == null || G < C)
				G = C
		}
		return G
	},
	"min" : function(E, F) {
		if (!E)
			E = [];
		var D = null;
		for ( var B = 0, G = E.length; B < G; B++) {
			var A = E[B], C = parseFloat(A[F]);
			if (C === null || C === undefined || isNaN(C))
				continue;
			if (D == null || D > C)
				D = C
		}
		return D
	},
	"avg" : function(E, F) {
		if (!E)
			E = [];
		if (E.length == 0)
			return 0;
		var D = 0;
		for ( var B = 0, G = E.length; B < G; B++) {
			var A = E[B], C = parseFloat(A[F]);
			if (C === null || C === undefined || isNaN(C))
				continue;
			D += C
		}
		var H = D / E.length;
		return H
	},
	"sum" : function(E, F) {
		if (!E)
			E = [];
		var D = 0;
		for ( var B = 0, G = E.length; B < G; B++) {
			var A = E[B], C = parseFloat(A[F]);
			if (C === null || C === undefined || isNaN(C))
				continue;
			D += C
		}
		return D
	}
};
mini.formatCurrency = function(A, C) {
	if (A === null || A === undefined)
		null == "";
	A = String(A).replace(/\$|\,/g, "");
	if (isNaN(A))
		A = "0";
	sign = (A == (A = Math.abs(A)));
	A = Math.floor(A * 100 + 0.50000000001);
	cents = A % 100;
	A = Math.floor(A / 100).toString();
	if (cents < 10)
		cents = "0" + cents;
	for ( var B = 0; B < Math.floor((A.length - (1 + B)) / 3); B++)
		A = A.substring(0, A.length - (4 * B + 3)) + ","
				+ A.substring(A.length - (4 * B + 3));
	C = C || "";
	return (((sign) ? "" : "-") + C + A + "." + cents)
};
mini.emptyFn = function() {
};
mini.Drag = function(A) {
	mini.copyTo(this, A)
};
mini.Drag.prototype = {
	onStart : mini.emptyFn,
	onMove : mini.emptyFn,
	onStop : mini.emptyFn,
	capture : false,
	fps : 20,
	event : null,
	delay : 80,
	start : function(B) {
		B.preventDefault();
		if (B)
			this.event = B;
		this.now = this.init = [ this.event.pageX, this.event.pageY ];
		var A = document;
		mini.on(A, "mousemove", this.move, this);
		mini.on(A, "mouseup", this.stop, this);
		mini.on(A, "contextmenu", this.contextmenu, this);
		if (this.context)
			mini.on(this.context, "contextmenu", this.contextmenu, this);
		this.trigger = B.target;
		mini.selectable(this.trigger, false);
		mini.selectable(A.body, false);
		if (this.capture)
			if (isIE)
				this.trigger.setCapture(true);
			else if (document.captureEvents)
				document.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP
						| Event.MOUSEDOWN);
		this.started = false;
		this.startTime = new Date()
	},
	contextmenu : function(A) {
		if (this.context)
			mini.un(this.context, "contextmenu", this.contextmenu, this);
		mini.un(document, "contextmenu", this.contextmenu, this);
		A.preventDefault();
		A.stopPropagation()
	},
	move : function(B) {
		if (this.delay)
			if (new Date() - this.startTime < this.delay)
				return;
		if (!this.started) {
			this.started = true;
			this.onStart(this)
		}
		var A = this;
		if (!this.timer)
			this.timer = setTimeout(function() {
				A.now = [ B.pageX, B.pageY ];
				A.event = B;
				A.onMove(A);
				A.timer = null
			}, 5)
	},
	stop : function(D) {
		this.now = [ D.pageX, D.pageY ];
		this.event = D;
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null
		}
		var C = document;
		mini.selectable(this.trigger, true);
		mini.selectable(C.body, true);
		if (isIE) {
			this.trigger.setCapture(false);
			this.trigger.releaseCapture()
		}
		var B = mini.MouseButton.Right != D.button;
		if (B == false)
			D.preventDefault();
		mini.un(C, "mousemove", this.move, this);
		mini.un(C, "mouseup", this.stop, this);
		var A = this;
		setTimeout(function() {
			mini.un(document, "contextmenu", A.contextmenu, A);
			if (A.context)
				mini.un(A.context, "contextmenu", A.contextmenu, A)
		}, 1);
		if (this.started)
			this.onStop(this, B)
	}
};
mini.JSON = new (function() {
	var sb = [], _dateFormat = null, useHasOwn = !! {}.hasOwnProperty, replaceString = function(
			A, C) {
		var B = m[C];
		if (B)
			return B;
		B = C.charCodeAt();
		return "\\u00" + Math.floor(B / 16).toString(16)
				+ (B % 16).toString(16)
	}, doEncode = function(A, D) {
		if (A === null) {
			sb[sb.length] = "null";
			return
		}
		var C = typeof A;
		if (C == "undefined") {
			sb[sb.length] = "null";
			return
		} else if (A.push) {
			sb[sb.length] = "[";
			var G, B, F = A.length, H;
			for (B = 0; B < F; B += 1) {
				H = A[B];
				C = typeof H;
				if (C == "undefined" || C == "function" || C == "unknown")
					;
				else {
					if (G)
						sb[sb.length] = ",";
					doEncode(H);
					G = true
				}
			}
			sb[sb.length] = "]";
			return
		} else if (A.getFullYear) {
			if (_dateFormat)
				sb[sb.length] = _dateFormat(A, D);
			else {
				var E;
				sb[sb.length] = "\"";
				sb[sb.length] = A.getFullYear();
				sb[sb.length] = "-";
				E = A.getMonth() + 1;
				sb[sb.length] = E < 10 ? "0" + E : E;
				sb[sb.length] = "-";
				E = A.getDate();
				sb[sb.length] = E < 10 ? "0" + E : E;
				sb[sb.length] = "T";
				E = A.getHours();
				sb[sb.length] = E < 10 ? "0" + E : E;
				sb[sb.length] = ":";
				E = A.getMinutes();
				sb[sb.length] = E < 10 ? "0" + E : E;
				sb[sb.length] = ":";
				E = A.getSeconds();
				sb[sb.length] = E < 10 ? "0" + E : E;
				sb[sb.length] = "\"";
				return
			}
		} else if (C == "string") {
			if (strReg1.test(A)) {
				sb[sb.length] = "\"";
				sb[sb.length] = A.replace(strReg2, replaceString);
				sb[sb.length] = "\"";
				return
			}
			sb[sb.length] = "\"" + A + "\"";
			return
		} else if (C == "number") {
			sb[sb.length] = A;
			return
		} else if (C == "boolean") {
			sb[sb.length] = String(A);
			return
		} else {
			sb[sb.length] = "{";
			G, B, H;
			for (B in A)
				if (!useHasOwn || (A.hasOwnProperty && A.hasOwnProperty(B))) {
					H = A[B];
					C = typeof H;
					if (C == "undefined" || C == "function" || C == "unknown")
						;
					else {
						if (G)
							sb[sb.length] = ",";
						doEncode(B);
						sb[sb.length] = ":";
						doEncode(H, B);
						G = true
					}
				}
			sb[sb.length] = "}";
			return
		}
	}, m = {
		"\b" : "\\b",
		"\t" : "\\t",
		"\n" : "\\n",
		"\f" : "\\f",
		"\r" : "\\r",
		"\"" : "\\\"",
		"\\" : "\\\\"
	}, strReg1 = /["\\\x00-\x1f]/, strReg2 = /([\x00-\x1f\\"])/g;
	this.encode = function() {
		var A;
		return function(A, B) {
			sb = [];
			_dateFormat = B;
			doEncode(A);
			_dateFormat = null;
			return sb.join("")
		}
	}();
	this.decode = function() {
		var re = /[\"\'](\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})[\"\']/g;
		return function(json) {
			if (json === "" || json === null || json === undefined)
				return json;
			if (typeof json == "object")
				json = this.encode(json);
			json = json.replace(re, "new Date($1,$2-1,$3,$4,$5,$6)");
			json = json.replace(__js_dateRegEx, "$1new Date($2)");
			json = json.replace(__js_dateRegEx2, "new Date($1)");
			var s = eval("(" + json + ")");
			return s
		}
	}()
})();
__js_dateRegEx = new RegExp(
		"(^|[^\\\\])\\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\\"",
		"g");
__js_dateRegEx2 = new RegExp("[\"']/Date\\(([0-9]+)\\)/[\"']", "g");
mini.encode = mini.JSON.encode;
mini.decode = mini.JSON.decode;
mini.clone = function(A, C) {
	if (A === null || A === undefined)
		return A;
	var D = mini.encode(A), B = mini.decode(D);
	function E(C) {
		for ( var B = 0, F = C.length; B < F; B++) {
			var A = C[B];
			delete A._state;
			delete A._id;
			delete A._pid;
			delete A._uid;
			for ( var D in A) {
				var G = A[D];
				if (G instanceof Array)
					E(G)
			}
		}
	}
	if (C !== false)
		E(B instanceof Array ? B : [ B ]);
	return B
};
var DAY_MS = 86400000, HOUR_MS = 3600000, MINUTE_MS = 60000;
mini
		.copyTo(
				mini,
				{
					clearTime : function(A) {
						if (!A)
							return null;
						return new Date(A.getFullYear(), A.getMonth(), A
								.getDate())
					},
					maxTime : function(A) {
						if (!A)
							return null;
						return new Date(A.getFullYear(), A.getMonth(), A
								.getDate(), 23, 59, 59)
					},
					cloneDate : function(A) {
						if (!A)
							return null;
						return new Date(A.getTime())
					},
					addDate : function(C, A, B) {
						if (!B)
							B = "D";
						C = new Date(C.getTime());
						switch (B.toUpperCase()) {
						case "Y":
							C.setFullYear(C.getFullYear() + A);
							break;
						case "MO":
							C.setMonth(C.getMonth() + A);
							break;
						case "D":
							C.setDate(C.getDate() + A);
							break;
						case "H":
							C.setHours(C.getHours() + A);
							break;
						case "M":
							C.setMinutes(C.getMinutes() + A);
							break;
						case "S":
							C.setSeconds(C.getSeconds() + A);
							break;
						case "MS":
							C.setMilliseconds(C.getMilliseconds() + A);
							break
						}
						return C
					},
					getWeek : function(F, A, B) {
						A += 1;
						var G = Math.floor((14 - (A)) / 12), I = F + 4800 - G, C = (A)
								+ (12 * G) - 3, E = B
								+ Math.floor(((153 * C) + 2) / 5) + (365 * I)
								+ Math.floor(I / 4) - Math.floor(I / 100)
								+ Math.floor(I / 400) - 32045, H = (E + 31741 - (E % 7)) % 146097 % 36524 % 1461, J = Math
								.floor(H / 1460), D = ((H - J) % 365) + J;
						NumberOfWeek = Math.floor(D / 7) + 1;
						return NumberOfWeek
					},
					getWeekStartDate : function(E, D) {
						if (!D)
							D = 0;
						if (D > 6 || D < 0)
							throw new Error("out of weekday");
						var C = E.getDay(), B = D - C;
						if (C < D)
							B -= 7;
						var A = new Date(E.getFullYear(), E.getMonth(), E
								.getDate()
								+ B);
						return A
					},
					getShortWeek : function(B) {
						var A = this.dateInfo.daysShort;
						return A[B]
					},
					getLongWeek : function(B) {
						var A = this.dateInfo.daysLong;
						return A[B]
					},
					getShortMonth : function(A) {
						var B = this.dateInfo.monthsShort;
						return B[A]
					},
					getLongMonth : function(A) {
						var B = this.dateInfo.monthsLong;
						return B[A]
					},
					dateInfo : {
						monthsLong : [ "January", "Febraury", "March", "April",
								"May", "June", "July", "August", "September",
								"October", "November", "December" ],
						monthsShort : [ "Jan", "Feb", "Mar", "Apr", "May",
								"Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
						daysLong : [ "Sunday", "Monday", "Tuesday",
								"Wednesday", "Thursday", "Friday", "Saturday" ],
						daysShort : [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
						quarterLong : [ "Q1", "Q2", "Q3", "Q4" ],
						quarterShort : [ "Q1", "Q2", "Q3", "Q4" ],
						halfYearLong : [ "first half", "second half" ],
						patterns : {
							"d" : "M/d/yyyy",
							"D" : "dddd, MMMM dd, yyyy",
							"f" : "dddd, MMMM dd, yyyy H:mm tt",
							"F" : "dddd, MMMM dd, yyyy H:mm:ss tt",
							"g" : "M/d/yyyy H:mm tt",
							"G" : "M/d/yyyy H:mm:ss tt",
							"m" : "MMMM dd",
							"o" : "yyyy-MM-ddTHH:mm:ss.fff",
							"s" : "yyyy-MM-ddTHH:mm:ss",
							"t" : "H:mm tt",
							"T" : "H:mm:ss tt",
							"U" : "dddd, MMMM dd, yyyy HH:mm:ss tt",
							"y" : "MMM, yyyy"
						},
						tt : {
							"AM" : "AM",
							"PM" : "PM"
						},
						ten : {
							"Early" : "Early",
							"Mid" : "Mid",
							"Late" : "Late"
						},
						today : "Today",
						clockType : 24
					}
				});
Date.prototype.getHalfYear = function() {
	if (!this.getMonth)
		return null;
	var A = this.getMonth();
	if (A < 6)
		return 0;
	return 1
};
Date.prototype.getQuarter = function() {
	if (!this.getMonth)
		return null;
	var A = this.getMonth();
	if (A < 3)
		return 0;
	if (A < 6)
		return 1;
	if (A < 9)
		return 2;
	return 3
};
mini.formatDate = function(E, Q, H) {
	if (!E || !E.getFullYear || isNaN(E))
		return "";
	var I = E.toString(), D = mini.dateInfo;
	if (!D)
		D = mini.dateInfo;
	if (typeof (D) !== "undefined") {
		var O = typeof (D.patterns[Q]) !== "undefined" ? D.patterns[Q] : Q, L = E
				.getFullYear(), A = E.getMonth(), B = E.getDate();
		if (Q == "yyyy-MM-dd") {
			A = A + 1 < 10 ? "0" + (A + 1) : A + 1;
			B = B < 10 ? "0" + B : B;
			return L + "-" + A + "-" + B
		}
		if (Q == "MM/dd/yyyy") {
			A = A + 1 < 10 ? "0" + (A + 1) : A + 1;
			B = B < 10 ? "0" + B : B;
			return A + "/" + B + "/" + L
		}
		I = O.replace(/yyyy/g, L);
		I = I.replace(/yy/g, (L + "").substring(2));
		var N = E.getHalfYear();
		I = I.replace(/hy/g, D.halfYearLong[N]);
		var K = E.getQuarter();
		I = I.replace(/Q/g, D.quarterLong[K]);
		I = I.replace(/q/g, D.quarterShort[K]);
		I = I.replace(/MMMM/g, D.monthsLong[A].escapeDateTimeTokens());
		I = I.replace(/MMM/g, D.monthsShort[A].escapeDateTimeTokens());
		I = I.replace(/MM/g, A + 1 < 10 ? "0" + (A + 1) : A + 1);
		I = I.replace(/(\\)?M/g, function(C, B) {
			return B ? C : A + 1
		});
		var P = E.getDay();
		I = I.replace(/dddd/g, D.daysLong[P].escapeDateTimeTokens());
		I = I.replace(/ddd/g, D.daysShort[P].escapeDateTimeTokens());
		I = I.replace(/dd/g, B < 10 ? "0" + B : B);
		I = I.replace(/(\\)?d/g, function(C, A) {
			return A ? C : B
		});
		var J = E.getHours(), C = J > 12 ? J - 12 : J;
		if (D.clockType == 12)
			if (J > 12)
				J -= 12;
		I = I.replace(/HH/g, J < 10 ? "0" + J : J);
		I = I.replace(/(\\)?H/g, function(B, A) {
			return A ? B : J
		});
		I = I.replace(/hh/g, C < 10 ? "0" + C : C);
		I = I.replace(/(\\)?h/g, function(B, A) {
			return A ? B : C
		});
		var F = E.getMinutes();
		I = I.replace(/mm/g, F < 10 ? "0" + F : F);
		I = I.replace(/(\\)?m/g, function(B, A) {
			return A ? B : F
		});
		var M = E.getSeconds();
		I = I.replace(/ss/g, M < 10 ? "0" + M : M);
		I = I.replace(/(\\)?s/g, function(B, A) {
			return A ? B : M
		});
		I = I.replace(/fff/g, E.getMilliseconds());
		I = I.replace(/tt/g,
				E.getHours() > 12 || E.getHours() == 0 ? D.tt["PM"]
						: D.tt["AM"]);
		var E = E.getDate(), G = "";
		if (E <= 10)
			G = D.ten["Early"];
		else if (E <= 20)
			G = D.ten["Mid"];
		else
			G = D.ten["Late"];
		I = I.replace(/ten/g, G)
	}
	return I.replace(/\\/g, "")
};
String.prototype.escapeDateTimeTokens = function() {
	return this.replace(/([dMyHmsft])/g, "\\$1")
};
mini.fixDate = function(A, B) {
	if (+A)
		while (A.getDate() != B.getDate())
			A.setTime(+A + (A < B ? 1 : -1) * HOUR_MS)
};
mini.parseDate = function(s, ignoreTimezone) {
	try {
		var d = eval(s);
		if (d && d.getFullYear)
			return d
	} catch (ex) {
	}
	if (typeof s == "object")
		return isNaN(s) ? null : s;
	if (typeof s == "number") {
		d = new Date(s * 1000);
		if (d.getTime() != s)
			return null;
		return isNaN(d) ? null : d
	}
	if (typeof s == "string") {
		if (s.match(/^\d+(\.\d+)?$/)) {
			d = new Date(parseFloat(s) * 1000);
			if (d.getTime() != s)
				return null;
			else
				return d
		}
		if (ignoreTimezone === undefined)
			ignoreTimezone = true;
		d = mini.parseISO8601(s, ignoreTimezone) || (s ? new Date(s) : null);
		return isNaN(d) ? null : d
	}
	return null
};
mini.parseISO8601 = function(F, A) {
	var B = F
			.match(/^([0-9]{4})([-\/]([0-9]{1,2})([-\/]([0-9]{1,2})([T ]([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);
	if (!B) {
		B = F
				.match(/^([0-9]{4})[-\/]([0-9]{2})[-\/]([0-9]{2})[T ]([0-9]{1,2})/);
		if (B) {
			var C = new Date(B[1], B[2] - 1, B[3], B[4]);
			return C
		}
		B = F.match(/^([0-9]{4}).([0-9]*).([0-9]*)/);
		if (B) {
			C = new Date(B[1], B[2] - 1, B[3]);
			return C
		}
		B = F.match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/);
		if (!B)
			return null;
		else {
			C = new Date(B[3], B[1] - 1, B[2]);
			return C
		}
	}
	C = new Date(B[1], 0, 1);
	if (A || !B[14]) {
		var E = new Date(B[1], 0, 1, 9, 0);
		if (B[3]) {
			C.setMonth(B[3] - 1);
			E.setMonth(B[3] - 1)
		}
		if (B[5]) {
			C.setDate(B[5]);
			E.setDate(B[5])
		}
		mini.fixDate(C, E);
		if (B[7])
			C.setHours(B[7]);
		if (B[8])
			C.setMinutes(B[8]);
		if (B[10])
			C.setSeconds(B[10]);
		if (B[12])
			C.setMilliseconds(Number("0." + B[12]) * 1000);
		mini.fixDate(C, E)
	} else {
		C.setUTCFullYear(B[1], B[3] ? B[3] - 1 : 0, B[5] || 1);
		C.setUTCHours(B[7] || 0, B[8] || 0, B[10] || 0, B[12] ? Number("0."
				+ B[12]) * 1000 : 0);
		var D = Number(B[16]) * 60 + (B[18] ? Number(B[18]) : 0);
		D *= B[15] == "-" ? 1 : -1;
		C = new Date(+C + (D * 60 * 1000))
	}
	return C
};
mini.parseTime = function(G, H) {
	if (!G)
		return null;
	var D = parseInt(G);
	if (D == G && H) {
		A = new Date(0);
		if (H[0] == "H")
			A.setHours(D);
		else if (H[0] == "m")
			A.setMinutes(D);
		else if (H[0] == "s")
			A.setSeconds(D);
		return A
	}
	var A = mini.parseDate(G);
	if (!A) {
		var F = G.split(":"), B = parseInt(parseFloat(F[0])), E = parseInt(parseFloat(F[1])), C = parseInt(parseFloat(F[2]));
		if (!isNaN(B) && !isNaN(E) && !isNaN(C)) {
			A = new Date(0);
			A.setHours(B);
			A.setMinutes(E);
			A.setSeconds(C)
		}
		if (!isNaN(B) && (H == "H" || H == "HH")) {
			A = new Date(0);
			A.setHours(B)
		} else if (!isNaN(B) && !isNaN(E) && (H == "H:mm" || H == "HH:mm")) {
			A = new Date(0);
			A.setHours(B);
			A.setMinutes(E)
		} else if (!isNaN(B) && !isNaN(E) && H == "mm:ss") {
			A = new Date(0);
			A.setMinutes(B);
			A.setSeconds(E)
		}
	}
	return A
};
mini.dateInfo = {
	monthsLong : [ "\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708",
			"\u56db\u6708", "\u4e94\u6708", "\u516d\u6708", "\u4e03\u6708",
			"\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708",
			"\u5341\u4e00\u6708", "\u5341\u4e8c\u6708" ],
	monthsShort : [ "1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708",
			"6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708",
			"12\u6708" ],
	daysLong : [ "\u661f\u671f\u65e5", "\u661f\u671f\u4e00",
			"\u661f\u671f\u4e8c", "\u661f\u671f\u4e09", "\u661f\u671f\u56db",
			"\u661f\u671f\u4e94", "\u661f\u671f\u516d" ],
	daysShort : [ "\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94",
			"\u516d" ],
	quarterLong : [ "\u4e00\u5b63\u5ea6", "\u4e8c\u5b63\u5ea6",
			"\u4e09\u5b63\u5ea6", "\u56db\u5b63\u5ea6" ],
	quarterShort : [ "Q1", "Q2", "Q2", "Q4" ],
	halfYearLong : [ "\u4e0a\u534a\u5e74", "\u4e0b\u534a\u5e74" ],
	patterns : {
		"d" : "yyyy-M-d",
		"D" : "yyyy\u5e74M\u6708d\u65e5",
		"f" : "yyyy\u5e74M\u6708d\u65e5 H:mm",
		"F" : "yyyy\u5e74M\u6708d\u65e5 H:mm:ss",
		"g" : "yyyy-M-d H:mm",
		"G" : "yyyy-M-d H:mm:ss",
		"m" : "MMMd\u65e5",
		"o" : "yyyy-MM-ddTHH:mm:ss.fff",
		"s" : "yyyy-MM-ddTHH:mm:ss",
		"t" : "H:mm",
		"T" : "H:mm:ss",
		"U" : "yyyy\u5e74M\u6708d\u65e5 HH:mm:ss",
		"y" : "yyyy\u5e74MM\u6708"
	},
	tt : {
		"AM" : "\u4e0a\u5348",
		"PM" : "\u4e0b\u5348"
	},
	ten : {
		"Early" : "\u4e0a\u65ec",
		"Mid" : "\u4e2d\u65ec",
		"Late" : "\u4e0b\u65ec"
	},
	today : "\u4eca\u5929",
	clockType : 24
};
mini.append = function(B, C) {
	B = mini.byId(B);
	if (!C || !B)
		return;
	if (typeof C == "string") {
		if (C.charAt(0) == "#") {
			C = mini.byId(C);
			if (!C)
				return;
			B.appendChild(C);
			return C
		} else {
			if (C.indexOf("<tr") == 0) {
				return jQuery(B).append(C)[0].lastChild;
				return
			}
			var A = document.createElement("div");
			A.innerHTML = C;
			C = A.firstChild;
			while (A.firstChild)
				B.appendChild(A.firstChild);
			return C
		}
	} else {
		B.appendChild(C);
		return C
	}
};
mini.prepend = function(B, C) {
	if (typeof C == "string")
		if (C.charAt(0) == "#")
			C = mini.byId(C);
		else {
			var A = document.createElement("div");
			A.innerHTML = C;
			C = A.firstChild
		}
	return jQuery(B).prepend(C)[0].firstChild
};
mini.after = function(B, C) {
	if (typeof C == "string")
		if (C.charAt(0) == "#")
			C = mini.byId(C);
		else {
			var A = document.createElement("div");
			A.innerHTML = C;
			C = A.firstChild
		}
	if (!C || !B)
		return;
	B.nextSibling ? B.parentNode.insertBefore(C, B.nextSibling) : B.parentNode
			.appendChild(C);
	return C
};
mini.before = function(B, C) {
	if (typeof C == "string")
		if (C.charAt(0) == "#")
			C = mini.byId(C);
		else {
			var A = document.createElement("div");
			A.innerHTML = C;
			C = A.firstChild
		}
	if (!C || !B)
		return;
	B.parentNode.insertBefore(C, B);
	return C
};
mini.__wrap = document.createElement("div");
mini.createElements = function(A) {
	mini.removeChilds(mini.__wrap);
	var B = A.indexOf("<tr") == 0;
	if (B)
		A = "<table>" + A + "</table>";
	mini.__wrap.innerHTML = A;
	return B ? mini.__wrap.firstChild.rows : mini.__wrap.childNodes
};
mini_byId = function(F, C) {
	if (typeof F == "string") {
		if (F.charAt(0) == "#")
			F = F.substr(1);
		if (C) {
			var D = C.getElementsByTagName("*");
			for ( var A = 0, E = D.length; A < E; A++) {
				var B = D[A];
				if (B.id == F)
					return B
			}
		}
		return document.getElementById(F)
	} else
		return F
};
mini_hasClass = function(A, B) {
	A = mini.byId(A);
	if (!A)
		return;
	if (!A.className)
		return false;
	var C = String(A.className).split(" ");
	return C.indexOf(B) != -1
};
mini_addClass = function(A, B) {
	if (!B)
		return;
	if (mini.hasClass(A, B) == false)
		jQuery(A).addClass(B)
};
mini_removeClass = function(A, B) {
	if (!B)
		return;
	jQuery(A).removeClass(B)
};
mini_getMargins = function(A) {
	A = mini.byId(A);
	var B = jQuery(A);
	return {
		top : parseInt(B.css("margin-top"), 10) || 0,
		left : parseInt(B.css("margin-left"), 10) || 0,
		bottom : parseInt(B.css("margin-bottom"), 10) || 0,
		right : parseInt(B.css("margin-right"), 10) || 0
	}
};
mini_getBorders = function(A) {
	A = mini.byId(A);
	var B = jQuery(A);
	return {
		top : parseInt(B.css("border-top-width"), 10) || 0,
		left : parseInt(B.css("border-left-width"), 10) || 0,
		bottom : parseInt(B.css("border-bottom-width"), 10) || 0,
		right : parseInt(B.css("border-right-width"), 10) || 0
	}
};
mini_getPaddings = function(A) {
	A = mini.byId(A);
	var B = jQuery(A);
	return {
		top : parseInt(B.css("padding-top"), 10) || 0,
		left : parseInt(B.css("padding-left"), 10) || 0,
		bottom : parseInt(B.css("padding-bottom"), 10) || 0,
		right : parseInt(B.css("padding-right"), 10) || 0
	}
};
mini_setWidth = function(B, A) {
	B = mini.byId(B);
	A = parseInt(A);
	if (isNaN(A) || !B)
		return;
	if (jQuery.boxModel) {
		var C = mini.getPaddings(B), D = mini.getBorders(B);
		A = A - C.left - C.right - D.left - D.right
	}
	if (A < 0)
		A = 0;
	B.style.width = A + "px"
};
mini_setHeight = function(B, A) {
	B = mini.byId(B);
	A = parseInt(A);
	if (isNaN(A) || !B)
		return;
	if (jQuery.boxModel) {
		var C = mini.getPaddings(B), D = mini.getBorders(B);
		A = A - C.top - C.bottom - D.top - D.bottom
	}
	if (A < 0)
		A = 0;
	B.style.height = A + "px"
};
mini_getWidth = function(A, B) {
	A = mini.byId(A);
	if (A.style.display == "none" || A.type == "text/javascript")
		return 0;
	return B ? jQuery(A).width() : jQuery(A).outerWidth()
};
mini_getHeight = function(A, B) {
	A = mini.byId(A);
	if (A.style.display == "none" || A.type == "text/javascript")
		return 0;
	return B ? jQuery(A).height() : jQuery(A).outerHeight()
};
mini_setBox = function(C, E, D, A, B) {
	if (D === undefined) {
		D = E.y;
		A = E.width;
		B = E.height;
		E = E.x
	}
	mini.setXY(C, E, D);
	mini.setWidth(C, A);
	mini.setHeight(C, B)
};
mini_getBox = function(C) {
	var A = mini.getXY(C), B = {
		x : A[0],
		y : A[1],
		width : mini.getWidth(C),
		height : mini.getHeight(C)
	};
	B.left = B.x;
	B.top = B.y;
	B.right = B.x + B.width;
	B.bottom = B.y + B.height;
	return B
};
mini_setStyle = function(C, D) {
	C = mini.byId(C);
	if (!C || typeof D != "string")
		return;
	var H = jQuery(C), B = D.toLowerCase().split(";");
	for ( var A = 0, E = B.length; A < E; A++) {
		var G = B[A], F = G.split(":");
		if (F.length == 2)
			H.css(F[0].trim(), F[1].trim())
	}
};
mini_getStyle = function() {
	var A = document.defaultView;
	return new Function(
			"el",
			"style",
			[
					"style.indexOf('-')>-1 && (style=style.replace(/-(\\w)/g,function(m,a){return a.toUpperCase()}));",
					"style=='float' && (style='",
					A ? "cssFloat" : "styleFloat",
					"');return el.style[style] || ",
					A ? "window.getComputedStyle(el, null)[style]"
							: "el.currentStyle[style]", " || null;" ].join(""))
}();
mini_isAncestor = function(C, A) {
	var B = false;
	C = mini.byId(C);
	A = mini.byId(A);
	if (C === A)
		return true;
	if (C && A)
		if (C.contains) {
			try {
				return C.contains(A)
			} catch (D) {
				return false
			}
		} else if (C.compareDocumentPosition)
			return !!(C.compareDocumentPosition(A) & 16);
		else
			while (A = A.parentNode)
				B = A == C || B;
	return B
};
mini_findParent = function(D, C, A) {
	D = mini.byId(D);
	var E = document.body, B = 0, F;
	A = A || 50;
	if (typeof A != "number") {
		F = mini.byId(A);
		A = 10
	}
	while (D && D.nodeType == 1 && B < A && D != E && D != F) {
		if (mini.hasClass(D, C))
			return D;
		B++;
		D = D.parentNode
	}
	return null
};
mini
		.copyTo(
				mini,
				{
					byId : mini_byId,
					hasClass : mini_hasClass,
					addClass : mini_addClass,
					removeClass : mini_removeClass,
					getMargins : mini_getMargins,
					getBorders : mini_getBorders,
					getPaddings : mini_getPaddings,
					setWidth : mini_setWidth,
					setHeight : mini_setHeight,
					getWidth : mini_getWidth,
					getHeight : mini_getHeight,
					setBox : mini_setBox,
					getBox : mini_getBox,
					setStyle : mini_setStyle,
					getStyle : mini_getStyle,
					repaint : function(A) {
						if (!A)
							A = document.body;
						mini.addClass(A, "mini-repaint");
						setTimeout(function() {
							mini.removeClass(A, "mini-repaint")
						}, 1)
					},
					getSize : function(A, B) {
						return {
							width : mini.getWidth(A, B),
							height : mini.getHeight(A, B)
						}
					},
					setSize : function(C, A, B) {
						mini.setWidth(C, A);
						mini.setHeight(C, B)
					},
					setX : function(B, D) {
						D = parseInt(D);
						var A = jQuery(B).offset(), C = parseInt(A.top);
						if (C === undefined)
							C = A[1];
						mini.setXY(B, D, C)
					},
					setY : function(B, C) {
						C = parseInt(C);
						var A = jQuery(B).offset(), D = parseInt(A.left);
						if (D === undefined)
							D = A[0];
						mini.setXY(B, D, C)
					},
					setXY : function(B, D, C) {
						var A = {
							left : parseInt(D),
							top : parseInt(C)
						};
						jQuery(B).offset(A);
						jQuery(B).offset(A)
					},
					getXY : function(B) {
						var A = jQuery(B).offset();
						return [ parseInt(A.left), parseInt(A.top) ]
					},
					getViewportBox : function() {
						var A = jQuery(window).width(), B = jQuery(window)
								.height(), D = jQuery(document).scrollLeft(), C = jQuery(
								document.body).scrollTop();
						if (document.documentElement)
							C = document.documentElement.scrollTop;
						return {
							x : D,
							y : C,
							width : A,
							height : B,
							right : D + A,
							bottom : C + B
						}
					},
					getChildNodes : function(C, E) {
						C = mini.byId(C);
						if (!C)
							return;
						var G = C.childNodes, D = [];
						for ( var A = 0, F = G.length; A < F; A++) {
							var B = G[A];
							if (B.nodeType == 1 || E === true)
								D.push(B)
						}
						return D
					},
					removeChilds : function(D, B) {
						D = mini.byId(D);
						if (!D)
							return;
						var E = mini.getChildNodes(D, true);
						for ( var A = 0, F = E.length; A < F; A++) {
							var C = E[A];
							if (B && C == B)
								;
							else
								D.removeChild(E[A])
						}
					},
					isAncestor : mini_isAncestor,
					findParent : mini_findParent,
					findChild : function(B, C) {
						B = mini.byId(B);
						var D = B.getElementsByTagName("*");
						for ( var A = 0, E = D.length; A < E; A++) {
							var B = D[A];
							if (mini.hasClass(B, C))
								return B
						}
					},
					isAncestor : function(C, A) {
						var B = false;
						C = mini.byId(C);
						A = mini.byId(A);
						if (C === A)
							return true;
						if (C && A)
							if (C.contains) {
								try {
									return C.contains(A)
								} catch (D) {
									return false
								}
							} else if (C.compareDocumentPosition)
								return !!(C.compareDocumentPosition(A) & 16);
							else
								while (A = A.parentNode)
									B = A == C || B;
						return B
					},
					getOffsetsTo : function(B, C) {
						var A = this.getXY(B), D = this.getXY(C);
						return [ A[0] - D[0], A[1] - D[1] ]
					},
					scrollIntoView : function(K, J, H) {
						var D = mini.byId(J) || document.body, A = this
								.getOffsetsTo(K, D), E = A[0] + D.scrollLeft, L = A[1]
								+ D.scrollTop, F = L + K.offsetHeight, C = E
								+ K.offsetWidth, I = D.clientHeight, M = parseInt(
								D.scrollTop, 10), B = parseInt(D.scrollLeft, 10), N = M
								+ I, G = B + D.clientWidth;
						if (K.offsetHeight > I || L < M)
							D.scrollTop = L;
						else if (F > N)
							D.scrollTop = F - I;
						D.scrollTop = D.scrollTop;
						if (H !== false) {
							if (K.offsetWidth > D.clientWidth || E < B)
								D.scrollLeft = E;
							else if (C > G)
								D.scrollLeft = C - D.clientWidth;
							D.scrollLeft = D.scrollLeft
						}
						return this
					},
					setOpacity : function(B, A) {
						jQuery(B).css( {
							"opacity" : A
						})
					},
					selectable : function(B, A) {
						B = mini.byId(B);
						if (!!A) {
							jQuery(B).removeClass("mini-unselectable");
							if (isIE)
								B.unselectable = "off";
							else {
								B.style.MozUserSelect = "";
								B.style.KhtmlUserSelect = "";
								B.style.UserSelect = ""
							}
						} else {
							jQuery(B).addClass("mini-unselectable");
							if (isIE)
								B.unselectable = "on";
							else {
								B.style.MozUserSelect = "none";
								B.style.UserSelect = "none";
								B.style.KhtmlUserSelect = "none"
							}
						}
					},
					selectRange : function(D, C, B) {
						if (D.createTextRange) {
							var A = D.createTextRange();
							A.moveStart("character", C);
							A.moveEnd("character", B - D.value.length);
							A.select()
						} else if (D.setSelectionRange)
							D.setSelectionRange(C, B);
						try {
							D.focus()
						} catch (E) {
						}
					},
					getSelectRange : function(C) {
						C = mini.byId(C);
						if (!C)
							return;
						try {
							C.focus()
						} catch (E) {
						}
						var A = 0, D = 0;
						if (C.createTextRange) {
							var B = document.selection.createRange()
									.duplicate();
							B.moveEnd("character", C.value.length);
							if (B.text === "")
								A = C.value.length;
							else
								A = C.value.lastIndexOf(B.text);
							B = document.selection.createRange().duplicate();
							B.moveStart("character", -C.value.length);
							D = B.text.length
						} else {
							A = C.selectionStart;
							D = C.selectionEnd
						}
						return [ A, D ]
					}
				});
(function() {
	var A = {
		tabindex : "tabIndex",
		readonly : "readOnly",
		"for" : "htmlFor",
		"class" : "className",
		maxlength : "maxLength",
		cellspacing : "cellSpacing",
		cellpadding : "cellPadding",
		rowspan : "rowSpan",
		colspan : "colSpan",
		usemap : "useMap",
		frameborder : "frameBorder",
		contenteditable : "contentEditable"
	}, B = document.createElement("div");
	B.setAttribute("class", "t");
	var C = B.className === "t";
	mini.setAttr = function(D, E, B) {
		D.setAttribute(C ? E : (A[E] || E), B)
	};
	mini.getAttr = function(D, E) {
		if (E == "value" && (isIE6 || isIE7)) {
			var B = D.attributes[E];
			return B ? B.value : null
		}
		var F = D.getAttribute(C ? E : (A[E] || E));
		if (typeof F == "function")
			F = D.attributes[E].value;
		return F
	}
})();
mini_onOne = function(B, A, E, C) {
	var D = "on" + A.toLowerCase();
	B[D] = function(B) {
		B = B || window.event;
		B.target = B.target || B.srcElement;
		if (!B.preventDefault)
			B.preventDefault = function() {
				if (window.event)
					window.event.returnValue = false
			};
		if (!B.stopPropogation)
			B.stopPropogation = function() {
				if (window.event)
					window.event.cancelBubble = true
			};
		var A = E.call(C, B);
		if (A === false)
			return false
	}
};
mini_on = function(B, A, F, C) {
	B = mini.byId(B);
	C = C || B;
	if (!B || !A || !F || !C)
		return false;
	var D = mini.findListener(B, A, F, C);
	if (D)
		return false;
	var E = mini.createDelegate(F, C);
	mini.listeners.push( [ B, A, F, C, E ]);
	if (isFirefox && A == "mousewheel")
		A = "DOMMouseScroll";
	jQuery(B).bind(A, E)
};
mini_un = function(B, A, E, C) {
	B = mini.byId(B);
	C = C || B;
	if (!B || !A || !E || !C)
		return false;
	var D = mini.findListener(B, A, E, C);
	if (!D)
		return false;
	mini.listeners.remove(D);
	if (isFirefox && A == "mousewheel")
		A = "DOMMouseScroll";
	jQuery(B).unbind(A, D[4])
};
mini.copyTo(mini, {
	listeners : [],
	on : mini_on,
	un : mini_un,
	findListener : function(C, B, H, D) {
		C = mini.byId(C);
		D = D || C;
		if (!C || !B || !H || !D)
			return false;
		var F = mini.listeners;
		for ( var A = 0, G = F.length; A < G; A++) {
			var E = F[A];
			if (E[0] == C && E[1] == B && E[2] == H && E[3] == D)
				return E
		}
	},
	clearEvent : function(C, B) {
		C = mini.byId(C);
		if (!C)
			return false;
		var E = mini.listeners;
		for ( var A = E.length - 1; A >= 0; A--) {
			var D = E[A];
			if (D[0] == C)
				if (!B || B == D[1])
					mini.un(C, D[1], D[2], D[3])
		}
		C.onmouseover = C.onmousedown = null
	}
});
mini.__windowResizes = [];
mini.onWindowResize = function(B, A) {
	mini.__windowResizes.push( [ B, A ])
};
mini.on(window, "resize", function(E) {
	var B = mini.__windowResizes;
	for ( var A = 0, D = B.length; A < D; A++) {
		var C = B[A];
		C[0].call(C[1], E)
	}
});
mini.htmlEncode = function(B) {
	if (typeof B !== "string")
		return B;
	var A = "";
	if (B.length == 0)
		return "";
	A = B;
	A = A.replace(/</g, "&lt;");
	A = A.replace(/>/g, "&gt;");
	A = A.replace(/ /g, "&nbsp;");
	A = A.replace(/\'/g, "&#39;");
	A = A.replace(/\"/g, "&quot;");
	return A
};
mini.htmlDecode = function(B) {
	if (typeof B !== "string")
		return B;
	var A = "";
	if (B.length == 0)
		return "";
	A = B.replace(/&gt;/g, "&");
	A = A.replace(/&lt;/g, "<");
	A = A.replace(/&gt;/g, ">");
	A = A.replace(/&nbsp;/g, " ");
	A = A.replace(/&#39;/g, "'");
	A = A.replace(/&quot;/g, "\"");
	return A
};
mini.copyTo(Array.prototype, {
	add : Array.prototype.enqueue = function(A) {
		this[this.length] = A;
		return this
	},
	getRange : function(C, D) {
		var E = [];
		for ( var B = C; B <= D; B++) {
			var A = this[B];
			if (A)
				E[E.length] = A
		}
		return E
	},
	addRange : function(C) {
		for ( var A = 0, B = C.length; A < B; A++)
			this[this.length] = C[A];
		return this
	},
	clear : function() {
		this.length = 0;
		return this
	},
	clone : function() {
		if (this.length === 1)
			return [ this[0] ];
		else
			return Array.apply(null, this)
	},
	contains : function(A) {
		return (this.indexOf(A) >= 0)
	},
	indexOf : function(B, D) {
		var A = this.length;
		for ( var C = (D < 0) ? Math.max(0, A + D) : D || 0; C < A; C++)
			if (this[C] === B)
				return C;
		return -1
	},
	dequeue : function() {
		return this.shift()
	},
	insert : function(B, A) {
		this.splice(B, 0, A);
		return this
	},
	insertRange : function(B, D) {
		for ( var C = D.length - 1; C >= 0; C--) {
			var A = D[C];
			this.splice(B, 0, A)
		}
		return this
	},
	remove : function(B) {
		var A = this.indexOf(B);
		if (A >= 0)
			this.splice(A, 1);
		return (A >= 0)
	},
	removeAt : function(A) {
		var B = this[A];
		this.splice(A, 1);
		return B
	},
	removeRange : function(B) {
		B = B.clone();
		for ( var A = 0, C = B.length; A < C; A++)
			this.remove(B[A])
	}
});
mini.Keyboard = {
	Left : 37,
	Top : 38,
	Right : 39,
	Bottom : 40,
	PageUp : 33,
	PageDown : 34,
	End : 35,
	Home : 36,
	Enter : 13,
	ESC : 27,
	Space : 32,
	Tab : 9,
	Del : 46,
	F1 : 112,
	F2 : 113,
	F3 : 114,
	F4 : 115,
	F5 : 116,
	F6 : 117,
	F7 : 118,
	F8 : 119,
	F9 : 120,
	F10 : 121,
	F11 : 122,
	F12 : 123
};
var ua = navigator.userAgent.toLowerCase(), check = function(A) {
	return A.test(ua)
}, DOC = document, isStrict = DOC.compatMode == "CSS1Compat", isOpera = Object.prototype.toString
		.call(window.opera) == "[object Opera]", isChrome = check(/chrome/), isWebKit = check(/webkit/), isSafari = !isChrome
		&& check(/safari/), isSafari2 = isSafari && check(/applewebkit\/4/), isSafari3 = isSafari
		&& check(/version\/3/), isSafari4 = isSafari && check(/version\/4/), isIE = !!window.attachEvent
		&& !isOpera, isIE7 = isIE && check(/msie 7/), isIE8 = isIE
		&& check(/msie 8/), isIE9 = isIE && check(/msie 9/), isIE10 = isIE
		&& document.documentMode == 10, isIE6 = isIE && !isIE7 && !isIE8
		&& !isIE9 && !isIE10, isFirefox = navigator.userAgent
		.indexOf("Firefox") > 0, isGecko = !isWebKit && check(/gecko/), isGecko2 = isGecko
		&& check(/rv:1\.8/), isGecko3 = isGecko && check(/rv:1\.9/), isBorderBox = isIE
		&& !isStrict, isWindows = check(/windows|win32/), isMac = check(/macintosh|mac os x/), isAir = check(/adobeair/), isLinux = check(/linux/), isSecure = /^https/i
		.test(window.location.protocol);
if (isIE6) {
	try {
		DOC.execCommand("BackgroundImageCache", false, true)
	} catch (e) {
	}
}
mini.boxModel = !isBorderBox;
mini.isIE = isIE;
mini.isIE6 = isIE6;
mini.isIE7 = isIE7;
mini.isIE8 = isIE8;
mini.isIE9 = isIE9;
mini.isFirefox = isFirefox;
mini.isOpera = isOpera;
mini.isSafari = isSafari;
if (jQuery)
	jQuery.boxModel = mini.boxModel;
mini.noBorderBox = false;
if (jQuery.boxModel == false && isIE && isIE9 == false)
	mini.noBorderBox = true;
mini.MouseButton = {
	Left : 0,
	Middle : 1,
	Right : 2
};
if (isIE && !isIE9)
	mini.MouseButton = {
		Left : 1,
		Middle : 4,
		Right : 2
	};
mini._MaskID = 1;
mini._MaskObjects = {};
mini.mask = function(E) {
	var B = mini.byId(E);
	if (mini.isElement(B))
		E = {
			el : B
		};
	else if (typeof E == "string")
		E = {
			html : E
		};
	E = mini.copyTo( {
		html : "",
		cls : "",
		style : "",
		backStyle : "background:#ccc"
	}, E);
	E.el = mini.byId(E.el);
	if (!E.el)
		E.el = document.body;
	B = E.el;
	mini["unmask"](E.el);
	B._maskid = mini._MaskID++;
	mini._MaskObjects[B._maskid] = E;
	var A = mini.append(B, "<div class=\"mini-mask\">"
			+ "<div class=\"mini-mask-background\" style=\"" + E.backStyle
			+ "\"></div>" + "<div class=\"mini-mask-msg " + E.cls
			+ "\" style=\"" + E.style + "\">" + E.html + "</div>" + "</div>");
	E.maskEl = A;
	if (!mini.isNull(E.opacity))
		mini.setOpacity(A.firstChild, E.opacity);
	function C() {
		D.style.display = "block";
		var A = mini.getSize(D);
		D.style.marginLeft = -A.width / 2 + "px";
		D.style.marginTop = -A.height / 2 + "px"
	}
	var D = A.lastChild;
	D.style.display = "none";
	setTimeout(function() {
		C()
	}, 0)
};
mini["unmask"] = function(B) {
	B = mini.byId(B);
	if (!B)
		B = document.body;
	var C = mini._MaskObjects[B._maskid];
	if (!C)
		return;
	delete mini._MaskObjects[B._maskid];
	var A = C.maskEl;
	C.maskEl = null;
	if (A && A.parentNode)
		A.parentNode.removeChild(A)
};
mini.Cookie = {
	get : function(F) {
		var C = document.cookie.split("; "), D = null;
		for ( var A = 0; A < C.length; A++) {
			var B = C[A].split("=");
			if (F == B[0])
				D = B
		}
		if (D) {
			var E = D[1];
			if (E === undefined)
				return E;
			return unescape(E)
		}
		return null
	},
	set : function(E, A, D, C) {
		var B = new Date();
		if (D != null)
			B = new Date(B.getTime() + (D * 1000 * 3600 * 24));
		document.cookie = E + "=" + escape(A)
				+ ((D == null) ? "" : ("; expires=" + B.toGMTString()))
				+ ";path=/" + (C ? "; domain=" + C : "")
	},
	del : function(B, A) {
		this.set(B, null, -100, A)
	}
};
mini.copyTo(mini, {
	treeToArray : function(E, K, L, C, A) {
		if (!K)
			K = "children";
		var H = [];
		for ( var J = 0, F = E.length; J < F; J++) {
			var D = E[J];
			H[H.length] = D;
			if (C)
				D[C] = A;
			var B = D[K];
			if (B && B.length > 0) {
				var G = D[L], I = this.treeToArray(B, K, L, C, G);
				H.addRange(I)
			}
		}
		return H
	},
	arrayToTree : function(E, C, J, D) {
		if (!C)
			C = "children";
		J = J || "_id";
		D = D || "_pid";
		var I = [], H = {};
		for ( var B = 0, G = E.length; B < G; B++) {
			var A = E[B];
			if (!A)
				continue;
			var K = A[J];
			if (K !== null && K !== undefined)
				H[K] = A;
			delete A[C]
		}
		for (B = 0, G = E.length; B < G; B++) {
			var A = E[B], F = H[A[D]];
			if (!F) {
				I.push(A);
				continue
			}
			if (!F[C])
				F[C] = [];
			F[C].push(A)
		}
		return I
	}
});
mini.treeToList = mini.treeToArray;
mini.listToTree = mini.arrayToTree;
function UUID() {
	var C = [], B = "0123456789ABCDEF".split("");
	for ( var A = 0; A < 36; A++)
		C[A] = Math.floor(Math.random() * 16);
	C[14] = 4;
	C[19] = (C[19] & 3) | 8;
	for (A = 0; A < 36; A++)
		C[A] = B[C[A]];
	C[8] = C[13] = C[18] = C[23] = "-";
	return C.join("")
}
String.format = function(B) {
	var A = Array.prototype.slice.call(arguments, 1);
	B = B || "";
	return B.replace(/\{(\d+)\}/g, function(C, B) {
		return A[B]
	})
};
String.prototype.trim = function() {
	var A = /^\s+|\s+$/g;
	return function() {
		return this.replace(A, "")
	}
}();
mini
		.copyTo(
				mini,
				{
					measureText : function(D, B, E) {
						if (!this.measureEl)
							this.measureEl = mini.append(document.body,
									"<div></div>");
						this.measureEl.style.cssText = "position:absolute;left:-1000px;top:-1000px;visibility:hidden;";
						if (typeof D == "string")
							this.measureEl.className = D;
						else {
							this.measureEl.className = "";
							var I = jQuery(D), C = jQuery(this.measureEl), H = [
									"font-size", "font-style", "font-weight",
									"font-family", "line-height",
									"text-transform", "letter-spacing" ];
							for ( var A = 0, G = H.length; A < G; A++) {
								var F = H[A];
								C.css(F, I.css(F))
							}
						}
						if (E)
							mini.setStyle(this.measureEl, E);
						this.measureEl.innerHTML = B;
						return mini.getSize(this.measureEl)
					}
				});
jQuery(function() {
	var A = new Date();
	mini.isReady = true;
	mini.parse();
	mini._FireBindEvents();
	if ((mini.getStyle(document.body, "overflow") == "hidden" || mini.getStyle(
			document.documentElement, "overflow") == "hidden")
			&& (isIE6 || isIE7)) {
		jQuery(document.body).css("overflow", "visible");
		jQuery(document.documentElement).css("overflow", "visible")
	}
	mini.__LastWindowWidth = document.documentElement.clientWidth;
	mini.__LastWindowHeight = document.documentElement.clientHeight
});
mini_onload = function(A) {
	mini.layout(null, false);
	mini.on(window, "resize", mini_onresize)
};
mini.on(window, "load", mini_onload);
mini.__LastWindowWidth = document.documentElement.clientWidth;
mini.__LastWindowHeight = document.documentElement.clientHeight;
mini.doWindowResizeTimer = null;
mini.allowLayout = true;
mini_onresize = function(C) {
	if (mini.doWindowResizeTimer)
		clearTimeout(mini.doWindowResizeTimer);
	mini.WindowVisible = mini.isWindowDisplay();
	if (mini.WindowVisible == false || mini.allowLayout == false)
		return;
	if (typeof Ext != "undefined")
		mini.doWindowResizeTimer = setTimeout(
				function() {
					var B = document.documentElement.clientWidth, A = document.documentElement.clientHeight;
					if (mini.__LastWindowWidth == B
							&& mini.__LastWindowHeight == A)
						;
					else {
						mini.__LastWindowWidth = B;
						mini.__LastWindowHeight = A;
						mini.layout(null, false)
					}
					mini.doWindowResizeTimer = null
				}, 300);
	else {
		var A = 100;
		try {
			if (parent && parent != window && parent.mini)
				A = 0
		} catch (B) {
		}
		mini.doWindowResizeTimer = setTimeout(
				function() {
					var B = document.documentElement.clientWidth, A = document.documentElement.clientHeight;
					if (mini.__LastWindowWidth == B
							&& mini.__LastWindowHeight == A)
						;
					else {
						mini.__LastWindowWidth = B;
						mini.__LastWindowHeight = A;
						mini.layout(null, false)
					}
					mini.doWindowResizeTimer = null
				}, A)
	}
};
mini.isDisplay = function(B, C) {
	var A = C || document.body;
	while (1) {
		if (B == null || !B.style)
			return false;
		if (B && B.style && B.style.display == "none")
			return false;
		if (B == A)
			return true;
		B = B.parentNode
	}
	return true
};
mini.isWindowDisplay = function() {
	try {
		var B = window.parent, G = B != window;
		if (G) {
			var E = B.document.getElementsByTagName("iframe"), J = B.document
					.getElementsByTagName("frame"), I = [];
			for ( var A = 0, F = E.length; A < F; A++)
				I.push(E[A]);
			for (A = 0, F = J.length; A < F; A++)
				I.push(J[A]);
			var D = null;
			for (A = 0, F = I.length; A < F; A++) {
				var C = I[A];
				if (C.contentWindow == window) {
					D = C;
					break
				}
			}
			if (!D)
				return false;
			return mini.isDisplay(D, B.document.body)
		} else
			return true
	} catch (H) {
		return true
	}
};
mini.WindowVisible = mini.isWindowDisplay();
mini.layoutIFrames = function(A) {
	if (!A)
		A = document.body;
	var B = A.getElementsByTagName("iframe");
	setTimeout(
			function() {
				for ( var C = 0, E = B.length; C < E; C++) {
					var D = B[C];
					try {
						if (mini.isDisplay(D) && mini.isAncestor(A, D)) {
							if (D.contentWindow.mini)
								if (D.contentWindow.mini.WindowVisible == false) {
									D.contentWindow.mini.WindowVisible = D.contentWindow.mini
											.isWindowDisplay();
									D.contentWindow.mini.layout()
								} else
									D.contentWindow.mini.layout(null, false);
							D.contentWindow.mini.layoutIFrames()
						}
					} catch (F) {
					}
				}
			}, 30)
};
$.ajaxSetup( {
	cache : false
});
if (isIE)
	setInterval(function() {
		CollectGarbage()
	}, 1000);
mini_unload = function(J) {
	try {
		var G = mini._getTopWindow();
		G[mini._WindowID] = "";
		delete G[mini._WindowID]
	} catch (F) {
	}
	var I = document.body.getElementsByTagName("iframe");
	if (I.length > 0) {
		var H = [];
		for ( var A = 0, E = I.length; A < E; A++)
			H.push(I[A]);
		for (A = 0, E = H.length; A < E; A++) {
			try {
				var D = H[A];
				D.src = "";
				if (D.parentNode)
					D.parentNode.removeChild(D)
			} catch (J) {
			}
		}
	}
	var C = mini.getComponents();
	for (A = 0, E = C.length; A < E; A++) {
		var B = C[A];
		B.destroy(false)
	}
	C.length = 0;
	C = null;
	mini.un(window, "unload", mini_unload);
	mini.un(window, "load", mini_onload);
	mini.un(window, "resize", mini_onresize);
	mini.components = {};
	mini.classes = {};
	mini.uiClasses = {};
	mini.uids = {};
	mini._topWindow = null;
	window.mini = null;
	window.Owner = null;
	window.CloseOwnerWindow = null;
	try {
		CollectGarbage()
	} catch (J) {
	}
	window.onerror = function() {
		return true
	}
};
mini.on(window, "unload", mini_unload);
function __OnIFrameMouseDown() {
	jQuery(document).trigger("mousedown")
}
function __BindIFrames() {
	var E = document.getElementsByTagName("iframe");
	for ( var A = 0, C = E.length; A < C; A++) {
		var B = E[A];
		try {
			if (B.contentWindow)
				B.contentWindow.document.onmousedown = __OnIFrameMouseDown
		} catch (D) {
		}
	}
}
setInterval(function() {
	__BindIFrames()
}, 1500);
mini.zIndex = 1000;
mini.getMaxZIndex = function() {
	return mini.zIndex++
};
function js_isTouchDevice() {
	try {
		document.createEvent("TouchEvent");
		return true
	} catch (A) {
		return false
	}
}
function js_touchScroll(C) {
	if (js_isTouchDevice()) {
		var B = typeof C == "string" ? document.getElementById(C) : C, A = 0;
		B.addEventListener("touchstart", function(B) {
			A = this.scrollTop + B.touches[0].pageY;
			B.preventDefault()
		}, false);
		B.addEventListener("touchmove", function(B) {
			this.scrollTop = A - B.touches[0].pageY;
			B.preventDefault()
		}, false)
	}
}
mini._placeholder = function(C) {
	C = mini.byId(C);
	if (!C || !isIE)
		return;
	function A() {
		var B = C._placeholder_label;
		if (!B)
			return;
		var A = C.getAttribute("placeholder");
		if (!A)
			A = C.placeholder;
		if (!C.value && !C.disabled) {
			B.innerHTML = A;
			B.style.display = ""
		} else
			B.style.display = "none"
	}
	if (C._placeholder) {
		A();
		return
	}
	C._placeholder = true;
	var B = document.createElement("label");
	B.className = "mini-placeholder-label";
	C.parentNode.appendChild(B);
	C._placeholder_label = B;
	B.onmousedown = function() {
		C.focus()
	};
	C.onpropertychange = function(B) {
		B = B || window.event;
		if (B.propertyName == "value")
			A()
	};
	A();
	mini.on(C, "focus", function(A) {
		if (!C.readOnly)
			B.style.display = "none"
	});
	mini.on(C, "blur", function(B) {
		A()
	})
};
mini.ajax = function(A) {
	if (!A.dataType)
		A.dataType = "text";
	return window.jQuery.ajax(A)
};
mini._evalAjaxData = function(ajaxData, scope) {
	var obj = ajaxData, t = typeof ajaxData;
	if (t == "string") {
		obj = eval("(" + ajaxData + ")");
		if (typeof obj == "function")
			obj = obj.call(scope)
	}
	return obj
};
if (typeof window.rootpath == "undefined")
	rootpath = "/";
mini.loadJS = function(B, A) {
	if (!B)
		return;
	if (typeof A == "function")
		return loadJS._async(B, A);
	else
		return loadJS._sync(B)
};
mini.loadJS._js = {};
mini.loadJS._async = function(F, B) {
	var E = mini.loadJS._js[F];
	if (!E)
		E = mini.loadJS._js[F] = {
			create : false,
			loaded : false,
			callbacks : []
		};
	if (E.loaded) {
		setTimeout(function() {
			B()
		}, 1);
		return
	} else {
		E.callbacks.push(B);
		if (E.create)
			return
	}
	E.create = true;
	var D = document.getElementsByTagName("head")[0], C = document
			.createElement("script");
	C.src = F;
	C.type = "text/javascript";
	function A() {
		for ( var A = 0; A < E.callbacks.length; A++) {
			var B = E.callbacks[A];
			if (B)
				B()
		}
		E.callbacks.length = 0
	}
	setTimeout(function() {
		if (document.all)
			C.onreadystatechange = function() {
				if (C.readyState == "loaded" || C.readyState == "complete") {
					A();
					E.loaded = true
				}
			};
		else
			C.onload = function() {
				A();
				E.loaded = true
			};
		D.appendChild(C)
	}, 1);
	return C
};
mini.loadJS._sync = function(C) {
	if (loadJS._js[C])
		return;
	loadJS._js[C] = {
		create : true,
		loaded : true,
		callbacks : []
	};
	var B = document.getElementsByTagName("head")[0], A = document
			.createElement("script");
	A.type = "text/javascript";
	A.text = loadText(C);
	B.appendChild(A);
	return A
};
mini.loadText = function(E) {
	var D = "", F = document.all && location.protocol == "file:", C = null;
	if (F)
		C = new ActiveXObject("Microsoft.XMLHTTP");
	else if (window.XMLHttpRequest)
		C = new XMLHttpRequest();
	else if (window.ActiveXObject)
		C = new ActiveXObject("Microsoft.XMLHTTP");
	C.onreadystatechange = A;
	var B = "_t=" + new Date().getTime();
	if (E.indexOf("?") == -1)
		B = "?" + B;
	else
		B = "&" + B;
	E += B;
	C.open("GET", E, false);
	C.send(null);
	function A() {
		if (C.readyState == 4) {
			var A = F ? 0 : 200;
			if (C.status == A)
				D = C.responseText
		}
	}
	return D
};
mini.loadJSON = function(url) {
	var text = loadText(url), o = eval("(" + text + ")");
	return o
};
mini.loadCSS = function(C, D) {
	if (!C)
		return;
	if (loadCSS._css[C])
		return;
	var A = document.getElementsByTagName("head")[0], B = document
			.createElement("link");
	if (D)
		B.id = D;
	B.href = C;
	B.rel = "stylesheet";
	B.type = "text/css";
	A.appendChild(B);
	return B
};
mini.loadCSS._css = {};
mini.innerHTML = function(C, B) {
	if (typeof C == "string")
		C = document.getElementById(C);
	if (!C)
		return;
	B = "<div style=\"display:none\">&nbsp;</div>" + B;
	C.innerHTML = B;
	mini.__executeScripts(C);
	var A = C.firstChild
};
mini.__executeScripts = function(A) {
	var C = A.getElementsByTagName("script");
	for ( var B = 0, G = C.length; B < G; B++) {
		var D = C[B], F = D.src;
		if (F)
			mini.loadJS(F);
		else {
			var E = document.createElement("script");
			E.type = "text/javascript";
			E.text = D.text;
			A.appendChild(E)
		}
	}
	for (B = C.length - 1; B >= 0; B--) {
		D = C[B];
		D.parentNode.removeChild(D)
	}
};
mini.Hidden = function() {
	mini.Hidden.superclass.constructor.call(this)
};
mini.extend(mini.Hidden, mini.Control, {
	_clearBorder : false,
	formField : true,
	value : "",
	uiCls : "mini-hidden",
	_create : function() {
		this.el = document.createElement("input");
		this.el.type = "hidden";
		this.el.className = "mini-hidden"
	},
	setName : function(A) {
		this.name = A;
		this.el.name = A
	},
	setValue : function(B) {
		if (B === null || B === undefined)
			B = "";
		this.value = B;
		if (mini.isDate(B)) {
			var D = B.getFullYear(), C = B.getMonth() + 1, A = B.getDate();
			C = C < 10 ? "0" + C : C;
			A = A < 10 ? "0" + A : A;
			this.el.value = D + "-" + C + "-" + A
		} else
			this.el.value = B
	},
	getValue : function() {
		return this.value
	},
	getFormValue : function() {
		return this.el.value
	}
});
mini.regClass(mini.Hidden, "hidden");
mini.Popup = function() {
	mini.Popup.superclass.constructor.call(this);
	this.setVisible(false);
	this.setAllowDrag(this.allowDrag);
	this.setAllowResize(this.allowResize)
};
mini.extend(mini.Popup, mini.Container, {
	_clearBorder : false,
	uiCls : "mini-popup",
	_create : function() {
		var A = this.el = document.createElement("div");
		this.el.className = "mini-popup";
		this._contentEl = this.el
	},
	_initEvents : function() {
		mini._BindEvents(function() {
			mini_onOne(this.el, "mouseover", this.__OnMouseOver, this)
		}, this)
	},
	doLayout : function() {
		if (!this.canLayout())
			return;
		mini.Popup.superclass.doLayout.call(this);
		this._doShadow();
		var C = this.el.childNodes;
		if (C)
			for ( var A = 0, D = C.length; A < D; A++) {
				var B = C[A];
				mini.layout(B)
			}
	},
	destroy : function(A) {
		if (this.el)
			this.el.onmouseover = null;
		mini.removeChilds(this._contentEl);
		mini.un(document, "mousedown", this.__OnBodyMouseDown, this);
		mini.un(window, "resize", this.__OnWindowResize, this);
		if (this._modalEl) {
			jQuery(this._modalEl).remove();
			this._modalEl = null
		}
		if (this.shadowEl) {
			jQuery(this.shadowEl).remove();
			this.shadowEl = null
		}
		mini.Popup.superclass.destroy.call(this, A)
	},
	setWidth : function(A) {
		if (parseInt(A) == A)
			A += "px";
		this.width = A;
		if (A.indexOf("px") != -1)
			mini.setWidth(this.el, A);
		else
			this.el.style.width = A;
		this._sizeChaned()
	},
	setHeight : function(A) {
		if (parseInt(A) == A)
			A += "px";
		this.height = A;
		if (A.indexOf("px") != -1)
			mini.setHeight(this.el, A);
		else
			this.el.style.height = A;
		this._sizeChaned()
	},
	setBody : function(B) {
		if (!B)
			return;
		if (!mini.isArray(B))
			B = [ B ];
		for ( var A = 0, C = B.length; A < C; A++)
			mini.append(this._contentEl, B[A])
	},
	getAttrs : function(A) {
		var C = mini.Popup.superclass.getAttrs.call(this, A);
		mini._ParseString(A, C, [ "popupEl", "popupCls", "showAction",
				"hideAction", "xAlign", "yAlign", "modalStyle", "onbeforeopen",
				"open", "onbeforeclose", "onclose" ]);
		mini._ParseBool(A, C, [ "showModal", "showShadow", "allowDrag",
				"allowResize" ]);
		mini._ParseInt(A, C, [ "showDelay", "hideDelay", "xOffset", "yOffset",
				"minWidth", "minHeight", "maxWidth", "maxHeight" ]);
		var B = mini.getChildNodes(A, true);
		C.body = B;
		return C
	}
});
mini.regClass(mini.Popup, "popup");
mini.Popup_prototype = {
	isPopup : false,
	popupEl : null,
	popupCls : "",
	showAction : "mouseover",
	hideAction : "outerclick",
	showDelay : 300,
	hideDelay : 500,
	xAlign : "left",
	yAlign : "below",
	xOffset : 0,
	yOffset : 0,
	minWidth : 50,
	minHeight : 25,
	maxWidth : 2000,
	maxHeight : 2000,
	showModal : false,
	showShadow : true,
	modalStyle : "opacity:0.2",
	_dragCls : "mini-popup-drag",
	_resizeCls : "mini-popup-resize",
	allowDrag : false,
	allowResize : false,
	_unbindPopupEl : function() {
		if (!this.popupEl)
			return;
		mini.un(this.popupEl, "click", this.__OnLeftClick, this);
		mini.un(this.popupEl, "contextmenu", this.__OnRightClick, this);
		mini.un(this.popupEl, "mouseover", this.__OnMouseOver, this)
	},
	_bindPopupEl : function() {
		if (!this.popupEl)
			return;
		mini.on(this.popupEl, "click", this.__OnLeftClick, this);
		mini.on(this.popupEl, "contextmenu", this.__OnRightClick, this);
		mini.on(this.popupEl, "mouseover", this.__OnMouseOver, this)
	},
	doShow : function(C) {
		var A = {
			popupEl : this.popupEl,
			htmlEvent : C,
			cancel : false
		};
		this.fire("BeforeOpen", A);
		if (A.cancel == true)
			return;
		this.fire("opening", A);
		if (A.cancel == true)
			return;
		if (!this.popupEl)
			this.show();
		else {
			var B = {};
			if (C)
				B.xy = [ C.pageX, C.pageY ];
			this.showAtEl(this.popupEl, B)
		}
	},
	doHide : function(B) {
		var A = {
			popupEl : this.popupEl,
			htmlEvent : B,
			cancel : false
		};
		this.fire("BeforeClose", A);
		if (A.cancel == true)
			return;
		this.close()
	},
	show : function(B, A) {
		this.showAtPos(B, A)
	},
	showAtPos : function(D, C) {
		this.render(document.body);
		if (!D)
			D = "center";
		if (!C)
			C = "middle";
		this.el.style.position = "absolute";
		this.el.style.left = "-2000px";
		this.el.style.top = "-2000px";
		this.el.style.display = "";
		this._measureSize();
		var B = mini.getViewportBox(), A = mini.getBox(this.el);
		if (D == "left")
			D = 0;
		if (D == "center")
			D = B.width / 2 - A.width / 2;
		if (D == "right")
			D = B.width - A.width;
		if (C == "top")
			C = 0;
		if (C == "middle")
			C = B.y + B.height / 2 - A.height / 2;
		if (C == "bottom")
			C = B.height - A.height;
		if (D + A.width > B.right)
			D = B.right - A.width;
		if (C + A.height > B.bottom)
			C = B.bottom - A.height - 20;
		this._Show(D, C)
	},
	_doModal : function() {
		jQuery(this._modalEl).remove();
		if (!this.showModal)
			return;
		if (this.visible == false)
			return;
		var A = document.documentElement, C = parseInt(Math.max(
				document.body.scrollWidth, A ? A.scrollWidth : 0)), F = parseInt(Math
				.max(document.body.scrollHeight, A ? A.scrollHeight : 0)), E = mini
				.getViewportBox(), D = E.height;
		if (D < F)
			D = F;
		var B = E.width;
		if (B < C)
			B = C;
		this._modalEl = mini.append(document.body,
				"<div class=\"mini-modal\"></div>");
		this._modalEl.style.height = D + "px";
		this._modalEl.style.width = B + "px";
		this._modalEl.style.zIndex = mini.getStyle(this.el, "zIndex") - 1;
		mini.setStyle(this._modalEl, this.modalStyle)
	},
	_doShadow : function() {
		if (!this.shadowEl)
			this.shadowEl = mini.append(document.body,
					"<div class=\"mini-shadow\"></div>");
		this.shadowEl.style.display = this.showShadow ? "" : "none";
		if (this.showShadow) {
			function A() {
				this.shadowEl.style.display = "";
				var A = mini.getBox(this.el), C = this.shadowEl.style;
				C.width = A.width + "px";
				C.height = A.height + "px";
				C.left = A.x + "px";
				C.top = A.y + "px";
				var B = mini.getStyle(this.el, "zIndex");
				if (!isNaN(B))
					this.shadowEl.style.zIndex = B - 2
			}
			this.shadowEl.style.display = "none";
			if (this._doShadowTimer) {
				clearTimeout(this._doShadowTimer);
				this._doShadowTimer = null
			}
			var B = this;
			this._doShadowTimer = setTimeout(function() {
				B._doShadowTimer = null;
				A.call(B)
			}, 20)
		}
	},
	_measureSize : function() {
		this.el.style.display = "";
		var A = mini.getBox(this.el);
		if (A.width > this.maxWidth) {
			mini.setWidth(this.el, this.maxWidth);
			A = mini.getBox(this.el)
		}
		if (A.height > this.maxHeight) {
			mini.setHeight(this.el, this.maxHeight);
			A = mini.getBox(this.el)
		}
		if (A.width < this.minWidth) {
			mini.setWidth(this.el, this.minWidth);
			A = mini.getBox(this.el)
		}
		if (A.height < this.minHeight) {
			mini.setHeight(this.el, this.minHeight);
			A = mini.getBox(this.el)
		}
	},
	showAtEl : function(J, F) {
		J = mini.byId(J);
		if (!J)
			return;
		if (!this.isRender() || this.el.parentNode != document.body)
			this.render(document.body);
		var C = {
			xAlign : this.xAlign,
			yAlign : this.yAlign,
			xOffset : this.xOffset,
			yOffset : this.yOffset,
			popupCls : this.popupCls
		};
		mini.copyTo(C, F);
		mini.addClass(J, C.popupCls);
		J.popupCls = C.popupCls;
		this._popupEl = J;
		this.el.style.position = "absolute";
		this.el.style.left = "-2000px";
		this.el.style.top = "-2000px";
		this.el.style.display = "";
		this.doLayout();
		this._measureSize();
		var L = mini.getViewportBox(), D = mini.getBox(this.el), N = mini
				.getBox(J), H = C.xy, E = C.xAlign, G = C.yAlign, O = L.width
				/ 2 - D.width / 2, M = 0;
		if (H) {
			O = H[0];
			M = H[1]
		}
		switch (C.xAlign) {
		case "outleft":
			O = N.x - D.width;
			break;
		case "left":
			O = N.x;
			break;
		case "center":
			O = N.x + N.width / 2 - D.width / 2;
			break;
		case "right":
			O = N.right - D.width;
			break;
		case "outright":
			O = N.right;
			break;
		default:
			break
		}
		switch (C.yAlign) {
		case "above":
			M = N.y - D.height;
			break;
		case "top":
			M = N.y;
			break;
		case "middle":
			M = N.y + N.height / 2 - D.height / 2;
			break;
		case "bottom":
			M = N.bottom - D.height;
			break;
		case "below":
			M = N.bottom;
			break;
		default:
			break
		}
		O = parseInt(O);
		M = parseInt(M);
		if (C.outYAlign || C.outXAlign) {
			if (C.outYAlign == "above")
				if (M + D.height > L.bottom) {
					var B = N.y - L.y, K = L.bottom - N.bottom;
					if (B > K)
						M = N.y - D.height
				}
			if (C.outXAlign == "outleft")
				if (O + D.width > L.right) {
					var I = N.x - L.x, A = L.right - N.right;
					if (I > A)
						O = N.x - D.width
				}
			if (C.outXAlign == "right")
				if (O + D.width > L.right)
					O = N.right - D.width;
			this._Show(O, M)
		} else
			this.showAtPos(O + C.xOffset, M + C.yOffset)
	},
	_Show : function(C, B) {
		this.el.style.display = "";
		this.el.style.zIndex = mini.getMaxZIndex();
		mini.setX(this.el, C);
		mini.setY(this.el, B);
		this.setVisible(true);
		if (this.hideAction == "mouseout")
			mini.on(document, "mousemove", this.__OnBodyMouseMove, this);
		var A = this;
		this._doShadow();
		this._doModal();
		mini.layoutIFrames(this.el);
		this.isPopup = true;
		mini.on(document, "mousedown", this.__OnBodyMouseDown, this);
		mini.on(window, "resize", this.__OnWindowResize, this);
		this.fire("Open")
	},
	open : function() {
		this.show()
	},
	close : function() {
		this.hide()
	},
	hide : function() {
		if (!this.el)
			return;
		if (this.popupEl)
			mini.removeClass(this.popupEl, this.popupEl.popupCls);
		if (this._popupEl)
			mini.removeClass(this._popupEl, this._popupEl.popupCls);
		this._popupEl = null;
		jQuery(this._modalEl).remove();
		if (this.shadowEl)
			this.shadowEl.style.display = "none";
		mini.un(document, "mousemove", this.__OnBodyMouseMove, this);
		mini.un(document, "mousedown", this.__OnBodyMouseDown, this);
		mini.un(window, "resize", this.__OnWindowResize, this);
		this.setVisible(false);
		this.isPopup = false;
		this.fire("Close")
	},
	setPopupEl : function(A) {
		A = mini.byId(A);
		if (!A)
			return;
		this._unbindPopupEl();
		this.popupEl = A;
		this._bindPopupEl()
	},
	setPopupCls : function(A) {
		this.popupCls = A
	},
	setShowAction : function(A) {
		this.showAction = A
	},
	setHideAction : function(A) {
		this.hideAction = A
	},
	setShowDelay : function(A) {
		this.showDelay = A
	},
	setHideDelay : function(A) {
		this.hideDelay = A
	},
	setXAlign : function(A) {
		this.xAlign = A
	},
	setYAlign : function(A) {
		this.yAlign = A
	},
	setxOffset : function(A) {
		A = parseInt(A);
		if (isNaN(A))
			A = 0;
		this.xOffset = A
	},
	setyOffset : function(A) {
		A = parseInt(A);
		if (isNaN(A))
			A = 0;
		this.yOffset = A
	},
	setShowModal : function(A) {
		this.showModal = A
	},
	setShowShadow : function(A) {
		this.showShadow = A
	},
	setMinWidth : function(A) {
		if (isNaN(A))
			return;
		this.minWidth = A
	},
	setMinHeight : function(A) {
		if (isNaN(A))
			return;
		this.minHeight = A
	},
	setMaxWidth : function(A) {
		if (isNaN(A))
			return;
		this.maxWidth = A
	},
	setMaxHeight : function(A) {
		if (isNaN(A))
			return;
		this.maxHeight = A
	},
	setAllowDrag : function(A) {
		this.allowDrag = A;
		mini.removeClass(this.el, this._dragCls);
		if (A)
			mini.addClass(this.el, this._dragCls)
	},
	setAllowResize : function(A) {
		this.allowResize = A;
		mini.removeClass(this.el, this._resizeCls);
		if (A)
			mini.addClass(this.el, this._resizeCls)
	},
	__OnLeftClick : function(B) {
		if (this._inAniming)
			return;
		if (this.showAction != "leftclick")
			return;
		var A = jQuery(this.popupEl).attr("allowPopup");
		if (String(A) == "false")
			return;
		this.doShow(B)
	},
	__OnRightClick : function(B) {
		if (this._inAniming)
			return;
		if (this.showAction != "rightclick")
			return;
		var A = jQuery(this.popupEl).attr("allowPopup");
		if (String(A) == "false")
			return;
		B.preventDefault();
		this.doShow(B)
	},
	__OnMouseOver : function(C) {
		if (this._inAniming)
			return;
		if (this.showAction != "mouseover")
			return;
		var B = jQuery(this.popupEl).attr("allowPopup");
		if (String(B) == "false")
			return;
		clearTimeout(this._hideTimer);
		this._hideTimer = null;
		if (this.isPopup)
			return;
		var A = this;
		this._showTimer = setTimeout(function() {
			A.doShow(C)
		}, this.showDelay)
	},
	__OnBodyMouseMove : function(A) {
		if (this.hideAction != "mouseout")
			return;
		this._tryHide(A)
	},
	__OnBodyMouseDown : function(A) {
		if (this.hideAction != "outerclick")
			return;
		if (!this.isPopup)
			return;
		if (this.within(A)
				|| (this.popupEl && mini.isAncestor(this.popupEl, A.target)))
			;
		else
			this.doHide(A)
	},
	_tryHide : function(B) {
		if (mini.isAncestor(this.el, B.target)
				|| (this.popupEl && mini.isAncestor(this.popupEl, B.target)))
			;
		else {
			clearTimeout(this._showTimer);
			this._showTimer = null;
			if (this._hideTimer)
				return;
			var A = this;
			this._hideTimer = setTimeout(function() {
				A.doHide(B)
			}, this.hideDelay)
		}
	},
	__OnWindowResize : function(A) {
		if (this.isDisplay() && !mini.isIE6)
			this._doModal()
	},
	within : function(E) {
		if (mini.isAncestor(this.el, E.target))
			return true;
		var A = mini.getChildControls(this);
		for ( var B = 0, D = A.length; B < D; B++) {
			var C = A[B];
			if (C.within(E))
				return true
		}
		return false
	}
};
mini.copyTo(mini.Popup.prototype, mini.Popup_prototype);
mini.Button = function() {
	mini.Button.superclass.constructor.call(this)
};
mini.extend(mini.Button, mini.Control, {
	text : "",
	iconCls : "",
	iconStyle : "",
	plain : false,
	checkOnClick : false,
	checked : false,
	groupName : "",
	_plainCls : "mini-button-plain",
	_hoverCls : "mini-button-hover",
	_pressedCls : "mini-button-pressed",
	_checkedCls : "mini-button-checked",
	_disabledCls : "mini-button-disabled",
	allowCls : "",
	_clearBorder : false,
	set : function(A) {
		if (typeof A == "string")
			return this;
		this._allowUpdate = A.text || A.iconStyle || A.iconCls
				|| A.iconPosition;
		mini.Button.superclass.set.call(this, A);
		if (this._allowUpdate === false) {
			this._allowUpdate = true;
			this.doUpdate()
		}
		return this
	},
	uiCls : "mini-button",
	_create : function() {
		this.el = document.createElement("a");
		this.el.className = "mini-button";
		this.el.hideFocus = true;
		this.el.href = "javascript:void(0)";
		this.doUpdate()
	},
	_initEvents : function() {
		mini._BindEvents(function() {
			mini_onOne(this.el, "mousedown", this.__OnMouseDown, this);
			mini_onOne(this.el, "click", this.__OnClick, this)
		}, this)
	},
	destroy : function(A) {
		if (this.el) {
			this.el.onclick = null;
			this.el.onmousedown = null
		}
		if (this.menu)
			this.menu.owner = null;
		this.menu = null;
		mini.Button.superclass.destroy.call(this, A)
	},
	doUpdate : function() {
		if (this._allowUpdate === false)
			return;
		var B = "", A = this.text;
		if (this.iconCls && A)
			B = " mini-button-icon " + this.iconCls;
		else if (this.iconCls && A === "") {
			B = " mini-button-iconOnly " + this.iconCls;
			A = "&nbsp;"
		} else if (A == "")
			A = "&nbsp;";
		var C = "<span class=\"mini-button-text " + B + "\">" + A + "</span>";
		if (this.allowCls)
			C = C + "<span class=\"mini-button-allow " + this.allowCls
					+ "\"></span>";
		this.el.innerHTML = C
	},
	href : "",
	setHref : function(A) {
		this.href = A;
		this.el.href = A;
		var B = this.el;
		setTimeout(function() {
			B.onclick = null
		}, 100)
	},
	getHref : function() {
		return this.href
	},
	target : "",
	setTarget : function(A) {
		this.target = A;
		this.el.target = A
	},
	getTarget : function() {
		return this.target
	},
	setText : function(A) {
		if (this.text != A) {
			this.text = A;
			this.doUpdate()
		}
	},
	getText : function() {
		return this.text
	},
	setIconCls : function(A) {
		this.iconCls = A;
		this.doUpdate()
	},
	getIconCls : function() {
		return this.iconCls
	},
	setIconStyle : function(A) {
		this.iconStyle = A;
		this.doUpdate()
	},
	getIconStyle : function() {
		return this.iconStyle
	},
	setIconPosition : function(A) {
		this.iconPosition = "left";
		this.doUpdate()
	},
	getIconPosition : function() {
		return this.iconPosition
	},
	setPlain : function(A) {
		this.plain = A;
		if (A)
			this.addCls(this._plainCls);
		else
			this.removeCls(this._plainCls)
	},
	getPlain : function() {
		return this.plain
	},
	setGroupName : function(A) {
		this.groupName = A
	},
	getGroupName : function() {
		return this.groupName
	},
	setCheckOnClick : function(A) {
		this.checkOnClick = A
	},
	getCheckOnClick : function() {
		return this.checkOnClick
	},
	setChecked : function(A) {
		var B = this.checked != A;
		this.checked = A;
		if (A)
			this.addCls(this._checkedCls);
		else
			this.removeCls(this._checkedCls);
		if (B)
			this.fire("CheckedChanged")
	},
	getChecked : function() {
		return this.checked
	},
	doClick : function() {
		this.__OnClick(null)
	},
	__OnClick : function(F) {
		if (this.readOnly || this.enabled == false)
			return;
		this.focus();
		if (this.checkOnClick)
			if (this.groupName) {
				var B = this.groupName, E = mini.findControls(function(A) {
					if (A.type == "button" && A.groupName == B)
						return true
				});
				if (E.length > 0) {
					for ( var A = 0, C = E.length; A < C; A++) {
						var D = E[A];
						if (D != this)
							D.setChecked(false)
					}
					this.setChecked(true)
				} else
					this.setChecked(!this.checked)
			} else
				this.setChecked(!this.checked);
		this.fire("click", {
			htmlEvent : F
		});
		return false
	},
	__OnMouseDown : function(A) {
		if (this.isReadOnly())
			return;
		this.addCls(this._pressedCls);
		mini.on(document, "mouseup", this.__OnDocMouseUp, this)
	},
	__OnDocMouseUp : function(A) {
		this.removeCls(this._pressedCls);
		mini.un(document, "mouseup", this.__OnDocMouseUp, this)
	},
	onClick : function(B, A) {
		this.on("click", B, A)
	},
	getAttrs : function(A) {
		var B = mini.Button.superclass.getAttrs.call(this, A);
		B.text = A.innerHTML;
		mini._ParseString(A, B, [ "text", "href", "iconCls", "iconStyle",
				"iconPosition", "groupName", "menu", "onclick",
				"oncheckedchanged", "target" ]);
		mini._ParseBool(A, B, [ "plain", "checkOnClick", "checked" ]);
		return B
	}
});
mini.regClass(mini.Button, "button");
mini.MenuButton = function() {
	mini.MenuButton.superclass.constructor.call(this)
};
mini.extend(mini.MenuButton, mini.Button, {
	uiCls : "mini-menubutton",
	allowCls : "mini-button-menu",
	setMenu : function(A) {
		if (mini.isArray(A))
			A = {
				type : "menu",
				items : A
			};
		if (typeof A == "string") {
			var B = mini.byId(A);
			if (!B)
				return;
			mini.parse(A);
			A = mini.get(A)
		}
		if (this.menu !== A) {
			this.menu = mini.getAndCreate(A);
			this.menu.setPopupEl(this.el);
			this.menu.setPopupCls("mini-button-popup");
			this.menu.setShowAction("leftclick");
			this.menu.setHideAction("outerclick");
			this.menu.setXAlign("left");
			this.menu.setYAlign("below");
			this.menu.hide();
			this.menu.owner = this
		}
	},
	setEnabled : function(A) {
		this.enabled = A;
		if (A)
			this.removeCls(this._disabledCls);
		else
			this.addCls(this._disabledCls);
		jQuery(this.el).attr("allowPopup", !!A)
	}
});
mini.regClass(mini.MenuButton, "menubutton");
mini.SplitButton = function() {
	mini.SplitButton.superclass.constructor.call(this)
};
mini.extend(mini.SplitButton, mini.MenuButton, {
	uiCls : "mini-splitbutton",
	allowCls : "mini-button-split"
});
mini.regClass(mini.SplitButton, "splitbutton");
mini.CheckBox = function() {
	mini.CheckBox.superclass.constructor.call(this)
};
mini
		.extend(
				mini.CheckBox,
				mini.Control,
				{
					formField : true,
					_clearText : false,
					text : "",
					checked : false,
					defaultValue : false,
					trueValue : true,
					falseValue : false,
					uiCls : "mini-checkbox",
					_create : function() {
						var A = this.uid + "$check";
						this.el = document.createElement("span");
						this.el.className = "mini-checkbox";
						this.el.innerHTML = "<input id=\""
								+ A
								+ "\" name=\""
								+ this.id
								+ "\" type=\"checkbox\" class=\"mini-checkbox-check\"><label for=\""
								+ A + "\" onclick=\"return false;\">"
								+ this.text + "</label>";
						this._checkEl = this.el.firstChild;
						this._labelEl = this.el.lastChild
					},
					destroy : function(A) {
						if (this._checkEl) {
							this._checkEl.onmouseup = null;
							this._checkEl.onclick = null;
							this._checkEl = null
						}
						mini.CheckBox.superclass.destroy.call(this, A)
					},
					_initEvents : function() {
						mini._BindEvents(function() {
							mini.on(this.el, "click", this.__onClick, this);
							this._checkEl.onmouseup = function() {
								return false
							};
							var A = this;
							this._checkEl.onclick = function() {
								if (A.isReadOnly())
									return false
							}
						}, this)
					},
					setName : function(A) {
						this.name = A;
						mini.setAttr(this._checkEl, "name", this.name)
					},
					setText : function(A) {
						if (this.text !== A) {
							this.text = A;
							this._labelEl.innerHTML = A
						}
					},
					getText : function() {
						return this.text
					},
					setChecked : function(A) {
						if (A === true)
							A = true;
						else if (A == this.trueValue)
							A = true;
						else if (A == "true")
							A = true;
						else if (A === 1)
							A = true;
						else if (A == "Y")
							A = true;
						else
							A = false;
						if (this.checked !== A) {
							this.checked = !!A;
							this._checkEl.checked = this.checked;
							this.value = this.getValue()
						}
					},
					getChecked : function() {
						return this.checked
					},
					setValue : function(A) {
						if (this.checked != A) {
							this.setChecked(A);
							this.value = this.getValue()
						}
					},
					getValue : function() {
						return String(this.checked == true ? this.trueValue
								: this.falseValue)
					},
					getFormValue : function() {
						return this.getValue()
					},
					setTrueValue : function(A) {
						this._checkEl.value = A;
						this.trueValue = A
					},
					getTrueValue : function() {
						return this.trueValue
					},
					setFalseValue : function(A) {
						this.falseValue = A
					},
					getFalseValue : function() {
						return this.falseValue
					},
					__onClick : function(A) {
						if (this.isReadOnly())
							return;
						this.setChecked(!this.checked);
						this.fire("checkedchanged", {
							checked : this.checked
						});
						this.fire("valuechanged", {
							value : this.getValue()
						});
						this.fire("click", A, this)
					},
					getAttrs : function(C) {
						var F = mini.CheckBox.superclass.getAttrs.call(this, C), E = jQuery(C);
						F.text = C.innerHTML;
						mini._ParseString(C, F, [ "text", "oncheckedchanged",
								"onclick", "onvaluechanged" ]);
						mini._ParseBool(C, F, [ "enabled" ]);
						var D = mini.getAttr(C, "checked");
						if (D)
							F.checked = (D == "true" || D == "checked") ? true
									: false;
						var B = E.attr("trueValue");
						if (B) {
							F.trueValue = B;
							B = parseInt(B);
							if (!isNaN(B))
								F.trueValue = B
						}
						var A = E.attr("falseValue");
						if (A) {
							F.falseValue = A;
							A = parseInt(A);
							if (!isNaN(A))
								F.falseValue = A
						}
						return F
					}
				});
mini.regClass(mini.CheckBox, "checkbox");
mini.ButtonEdit = function() {
	mini.ButtonEdit.superclass.constructor.call(this);
	var A = this.isReadOnly();
	if (A || this.allowInput == false)
		this._textEl.readOnly = true;
	if (this.enabled == false)
		this.addCls(this._disabledCls);
	if (A)
		this.addCls(this._readOnlyCls);
	if (this.required)
		this.addCls(this._requiredCls)
};
mini
		.extend(
				mini.ButtonEdit,
				mini.ValidatorBase,
				{
					name : "",
					formField : true,
					selectOnFocus : false,
					showClose : false,
					emptyText : "",
					defaultValue : "",
					value : "",
					text : "",
					maxLength : 1000,
					minLength : 0,
					width : 125,
					height : 21,
					inputAsValue : false,
					allowInput : true,
					_noInputCls : "mini-buttonedit-noInput",
					_readOnlyCls : "mini-buttonedit-readOnly",
					_disabledCls : "mini-buttonedit-disabled",
					_emptyCls : "mini-buttonedit-empty",
					_focusCls : "mini-buttonedit-focus",
					_buttonCls : "mini-buttonedit-button",
					_buttonHoverCls : "mini-buttonedit-button-hover",
					_buttonPressedCls : "mini-buttonedit-button-pressed",
					_closeCls : "mini-buttonedit-close",
					set : function(C) {
						if (typeof C == "string")
							return this;
						var A = C.value;
						delete C.value;
						var B = C.text;
						delete C.text;
						this._allowUpdate = !(C.enabled == false
								|| C.allowInput == false || C.readOnly);
						mini.ButtonEdit.superclass.set.call(this, C);
						if (this._allowUpdate === false) {
							this._allowUpdate = true;
							this.doUpdate()
						}
						if (!mini.isNull(B))
							this.setText(B);
						if (!mini.isNull(A))
							this.setValue(A);
						return this
					},
					uiCls : "mini-buttonedit",
					_getButtonHtml : function() {
						var A = "onmouseover=\"mini.addClass(this, '"
								+ this._buttonHoverCls + "');\" "
								+ "onmouseout=\"mini.removeClass(this, '"
								+ this._buttonHoverCls + "');\"";
						return "<span class=\"mini-buttonedit-button\" "
								+ A
								+ "><span class=\"mini-buttonedit-icon\"></span></span>"
					},
					_create : function() {
						this.el = document.createElement("span");
						this.el.className = "mini-buttonedit";
						var A = this._getButtonHtml()
								+ "<span class=\"mini-buttonedit-close\"></span>";
						this.el.innerHTML = "<span class=\"mini-buttonedit-border\"><input type=\"input\" class=\"mini-buttonedit-input\" autocomplete=\"off\"/>"
								+ A
								+ "</span><input name=\""
								+ this.name
								+ "\" type=\"hidden\"/>";
						this._borderEl = this.el.firstChild;
						this._textEl = this._borderEl.firstChild;
						this._valueEl = this.el.lastChild;
						this._closeEl = this._borderEl.lastChild;
						this._buttonEl = this._closeEl.previousSibling;
						this._doEmpty()
					},
					destroy : function(A) {
						if (this.el) {
							this.el.onmousedown = null;
							this.el.onmousewheel = null;
							this.el.onmouseover = null;
							this.el.onmouseout = null
						}
						if (this._textEl) {
							this._textEl.onchange = null;
							this._textEl.onfocus = null;
							mini.clearEvent(this._textEl);
							this._textEl = null
						}
						mini.ButtonEdit.superclass.destroy.call(this, A)
					},
					_initEvents : function() {
						mini._BindEvents(function() {
							mini_onOne(this.el, "mousedown",
									this.__OnMouseDown, this);
							mini_onOne(this._textEl, "focus", this.__OnFocus,
									this);
							mini_onOne(this._textEl, "change",
									this.__OnInputTextChanged, this);
							var A = this.text;
							this.text = null;
							this.setText(A)
						}, this)
					},
					_inputEventsInited : false,
					_initInputEvents : function() {
						if (this._inputEventsInited)
							return;
						this._inputEventsInited = true;
						mini.on(this.el, "click", this.__OnClick, this);
						mini.on(this._textEl, "blur", this.__OnBlur, this);
						mini.on(this._textEl, "keydown", this.__OnInputKeyDown,
								this);
						mini.on(this._textEl, "keyup", this.__OnInputKeyUp,
								this);
						mini.on(this._textEl, "keypress",
								this.__OnInputKeyPress, this)
					},
					_buttonWidth : 20,
					_closeWidth : 20,
					doLayout : function() {
						if (!this.canLayout())
							return;
						mini.ButtonEdit.superclass.doLayout.call(this);
						if (this._closeEl)
							this._closeEl.style.display = this.showClose ? ""
									: "none";
						var B = mini.getWidth(this.el);
						if (this.el.style.width == "100%")
							B -= 1;
						if (this._errorIconEl)
							B -= 18;
						B -= 2;
						var A = this.el.style.width.toString();
						if (A.indexOf("%") != -1)
							B -= 1;
						if (B < 0)
							B = 0;
						this._borderEl.style.width = B + "px";
						B -= this._buttonWidth;
						if (this.el.style.width == "100%")
							B -= 1;
						if (this.showClose)
							B -= this._closeWidth;
						if (B < 0)
							B = 0;
						this._textEl.style.width = B + "px"
					},
					setHeight : function(A) {
						if (parseInt(A) == A)
							A += "px";
						this.height = A
					},
					focus : function() {
						try {
							this._textEl.focus();
							var A = this;
							setTimeout(function() {
								if (A._focused)
									A._textEl.focus()
							}, 10)
						} catch (B) {
						}
					},
					blur : function() {
						try {
							this._textEl.blur()
						} catch (A) {
						}
					},
					selectText : function() {
						this._textEl.select()
					},
					getTextEl : function() {
						return this._textEl
					},
					setName : function(A) {
						this.name = A;
						if (this._valueEl)
							mini.setAttr(this._valueEl, "name", this.name)
					},
					setText : function(A) {
						if (A === null || A === undefined)
							A = "";
						var B = this.text !== A;
						this.text = A;
						this._textEl.value = A;
						this._doEmpty()
					},
					getText : function() {
						var A = this._textEl.value;
						return A
					},
					setValue : function(A) {
						if (A === null || A === undefined)
							A = "";
						var B = this.value !== A;
						this.value = A;
						this._valueEl.value = this.getFormValue()
					},
					getValue : function() {
						return this.value
					},
					getFormValue : function() {
						value = this.value;
						if (value === null || value === undefined)
							value = "";
						return String(value)
					},
					_doEmpty : function() {
						this._textEl.placeholder = this.emptyText;
						if (this.emptyText)
							mini._placeholder(this._textEl)
					},
					setEmptyText : function(A) {
						if (this.emptyText != A) {
							this.emptyText = A;
							this._doEmpty()
						}
					},
					getEmptyText : function() {
						return this.emptyText
					},
					setMaxLength : function(A) {
						A = parseInt(A);
						if (isNaN(A))
							return;
						this.maxLength = A;
						this._textEl.maxLength = A
					},
					getMaxLength : function() {
						return this.maxLength
					},
					setMinLength : function(A) {
						A = parseInt(A);
						if (isNaN(A))
							return;
						this.minLength = A
					},
					getMinLength : function() {
						return this.minLength
					},
					setEnabled : function(A) {
						mini.ButtonEdit.superclass.setEnabled.call(this, A);
						this._tryValidate()
					},
					_doReadOnly : function() {
						var A = this.isReadOnly();
						if (A || this.allowInput == false)
							this._textEl.readOnly = true;
						else
							this._textEl.readOnly = false;
						if (A)
							this.addCls(this._readOnlyCls);
						else
							this.removeCls(this._readOnlyCls);
						if (this.allowInput)
							this.removeCls(this._noInputCls);
						else
							this.addCls(this._noInputCls);
						if (this.enabled)
							this._textEl.disabled = false;
						else
							this._textEl.disabled = true
					},
					setAllowInput : function(A) {
						this.allowInput = A;
						this._doReadOnly()
					},
					getAllowInput : function() {
						return this.allowInput
					},
					setInputAsValue : function(A) {
						this.inputAsValue = A
					},
					getInputAsValue : function() {
						return this.inputAsValue
					},
					_errorIconEl : null,
					getErrorIconEl : function() {
						if (!this._errorIconEl)
							this._errorIconEl = mini.append(this.el,
									"<span class=\"mini-errorIcon\"></span>");
						return this._errorIconEl
					},
					_RemoveErrorIcon : function() {
						if (this._errorIconEl) {
							var A = this._errorIconEl;
							jQuery(A).remove()
						}
						this._errorIconEl = null
					},
					__OnClick : function(B) {
						if (this.isReadOnly() || this.enabled == false)
							return;
						if (!mini.isAncestor(this._borderEl, B.target))
							return;
						var A = new Date();
						if (mini.isAncestor(this._buttonEl, B.target))
							this._OnButtonClick(B);
						if (mini.findParent(B.target, this._closeCls))
							this.fire("closeclick", {
								htmlEvent : B
							})
					},
					__OnMouseDown : function(D) {
						if (this.isReadOnly() || this.enabled == false)
							return;
						if (!mini.isAncestor(this._borderEl, D.target))
							return;
						if (!mini.isAncestor(this._textEl, D.target)) {
							this._clickTarget = D.target;
							var A = this;
							setTimeout(function() {
								A.focus();
								mini.selectRange(A._textEl, 1000, 1000)
							}, 1);
							if (mini.isAncestor(this._buttonEl, D.target)) {
								var B = mini.findParent(D.target,
										"mini-buttonedit-up"), C = mini
										.findParent(D.target,
												"mini-buttonedit-down");
								if (B) {
									mini.addClass(B, this._buttonPressedCls);
									this._OnButtonMouseDown(D, "up")
								} else if (C) {
									mini.addClass(C, this._buttonPressedCls);
									this._OnButtonMouseDown(D, "down")
								} else {
									mini.addClass(this._buttonEl,
											this._buttonPressedCls);
									this._OnButtonMouseDown(D)
								}
								mini.on(document, "mouseup",
										this.__OnDocMouseUp, this)
							}
						}
					},
					__OnDocMouseUp : function(B) {
						this._clickTarget = null;
						var A = this;
						setTimeout(function() {
							var C = A._buttonEl.getElementsByTagName("*");
							for ( var B = 0, D = C.length; B < D; B++)
								mini.removeClass(C[B], A._buttonPressedCls);
							mini.removeClass(A._buttonEl, A._buttonPressedCls);
							mini.removeClass(A.el, A._pressedCls)
						}, 80);
						mini.un(document, "mouseup", this.__OnDocMouseUp, this)
					},
					__OnFocus : function(A) {
						this.doUpdate();
						this._initInputEvents();
						if (this.isReadOnly())
							return;
						this._focused = true;
						this.addCls(this._focusCls);
						if (this.selectOnFocus)
							this.selectText();
						this.fire("focus", {
							htmlEvent : A
						})
					},
					__fireBlur : function(C) {
						this._focused = false;
						var A = this;
						function B() {
							if (A._focused == false)
								A.removeCls(A._focusCls)
						}
						setTimeout(function() {
							B.call(A)
						}, 2);
						this.fire("blur", {
							htmlEvent : C
						})
					},
					__OnBlur : function(B) {
						var A = this;
						setTimeout(function() {
							A.__fireBlur(B)
						}, 10)
					},
					__OnInputKeyDown : function(D) {
						var C = {
							htmlEvent : D
						};
						this.fire("keydown", C);
						if (D.keyCode == 8
								&& (this.isReadOnly() || this.allowInput == false))
							return false;
						if (D.keyCode == 13 || D.keyCode == 9) {
							var A = this;
							A.__OnInputTextChanged(null);
							if (D.keyCode == 13) {
								var B = this;
								B.fire("enter", C)
							}
						}
						if (D.keyCode == 27)
							D.preventDefault()
					},
					__OnInputTextChanged : function() {
						var B = this._textEl.value, A = this.getValue();
						this.setValue(B);
						if (A !== this.getFormValue())
							this._OnValueChanged()
					},
					__OnInputKeyUp : function(A) {
						this.fire("keyup", {
							htmlEvent : A
						})
					},
					__OnInputKeyPress : function(A) {
						this.fire("keypress", {
							htmlEvent : A
						})
					},
					_OnButtonClick : function(A) {
						var B = {
							htmlEvent : A,
							cancel : false
						};
						this.fire("beforebuttonclick", B);
						if (B.cancel == true)
							return;
						this.fire("buttonclick", B)
					},
					_OnButtonMouseDown : function(B, A) {
						this.focus();
						this.addCls(this._focusCls);
						this.fire("buttonmousedown", {
							htmlEvent : B,
							spinType : A
						})
					},
					onButtonClick : function(B, A) {
						this.on("buttonclick", B, A)
					},
					onButtonMouseDown : function(B, A) {
						this.on("buttonmousedown", B, A)
					},
					onTextChanged : function(B, A) {
						this.on("textchanged", B, A)
					},
					textName : "",
					setTextName : function(A) {
						this.textName = A;
						if (this._textEl)
							mini.setAttr(this._textEl, "name", this.textName)
					},
					getTextName : function() {
						return this.textName
					},
					setSelectOnFocus : function(A) {
						this.selectOnFocus = A
					},
					getSelectOnFocus : function(A) {
						return this.selectOnFocus
					},
					setShowClose : function(A) {
						this.showClose = A;
						this.doLayout()
					},
					getShowClose : function(A) {
						return this.showClose
					},
					getAttrs : function(A) {
						var C = mini.ButtonEdit.superclass.getAttrs.call(this,
								A), B = jQuery(A);
						mini._ParseString(A, C, [ "value", "text", "textName",
								"emptyText", "onenter", "onkeydown", "onkeyup",
								"onkeypress", "onbuttonclick",
								"onbuttonmousedown", "ontextchanged",
								"onfocus", "onblur", "oncloseclick" ]);
						mini._ParseBool(A, C, [ "allowInput", "inputAsValue",
								"selectOnFocus", "showClose" ]);
						mini._ParseInt(A, C, [ "maxLength", "minLength" ]);
						return C
					}
				});
mini.regClass(mini.ButtonEdit, "buttonedit");
mini.TextBox = function() {
	mini.TextBox.superclass.constructor.call(this)
};
mini
		.extend(
				mini.TextBox,
				mini.ValidatorBase,
				{
					name : "",
					formField : true,
					selectOnFocus : false,
					minHeight : 15,
					maxLength : 5000,
					emptyText : "",
					text : "",
					value : "",
					defaultValue : "",
					width : 125,
					height : 21,
					_emptyCls : "mini-textbox-empty",
					_focusCls : "mini-textbox-focus",
					_disabledCls : "mini-textbox-disabled",
					uiCls : "mini-textbox",
					_InputType : "text",
					_create : function() {
						var A = "<input  type=\""
								+ this._InputType
								+ "\" class=\"mini-textbox-input\" autocomplete=\"off\"/>";
						if (this._InputType == "textarea")
							A = "<textarea  class=\"mini-textbox-input\" autocomplete=\"off\"/></textarea>";
						A += "<input type=\"hidden\"/>";
						this.el = document.createElement("span");
						this.el.className = "mini-textbox";
						this.el.innerHTML = A;
						this._textEl = this.el.firstChild;
						this._valueEl = this.el.lastChild;
						this._borderEl = this._textEl;
						this._doEmpty()
					},
					_initEvents : function() {
						mini._BindEvents(function() {
							mini_onOne(this._textEl, "drop", this.__OnDropText,
									this);
							mini_onOne(this._textEl, "change",
									this.__OnInputTextChanged, this);
							mini_onOne(this._textEl, "focus", this.__OnFocus,
									this);
							mini_onOne(this.el, "mousedown",
									this.__OnMouseDown, this);
							var A = this.value;
							this.value = null;
							this.setValue(A)
						}, this);
						this.on("validation", this.__OnValidation, this)
					},
					_inputEventsInited : false,
					_initInputEvents : function() {
						if (this._inputEventsInited)
							return;
						this._inputEventsInited = true;
						mini.on(this._textEl, "blur", this.__OnBlur, this);
						mini.on(this._textEl, "keydown", this.__OnInputKeyDown,
								this);
						mini.on(this._textEl, "keyup", this.__OnInputKeyUp,
								this);
						mini.on(this._textEl, "keypress",
								this.__OnInputKeyPress, this)
					},
					destroy : function(A) {
						if (this.el)
							this.el.onmousedown = null;
						if (this._textEl) {
							this._textEl.ondrop = null;
							this._textEl.onchange = null;
							this._textEl.onfocus = null;
							mini.clearEvent(this._textEl);
							this._textEl = null
						}
						if (this._valueEl) {
							mini.clearEvent(this._valueEl);
							this._valueEl = null
						}
						mini.TextBox.superclass.destroy.call(this, A)
					},
					doLayout : function() {
						if (!this.canLayout())
							return;
						var B = mini.getWidth(this.el);
						if (this._errorIconEl)
							B -= 18;
						B -= 4;
						var A = this.el.style.width.toString();
						if (A.indexOf("%") != -1)
							B -= 1;
						if (B < 0)
							B = 0;
						this._textEl.style.width = B + "px"
					},
					setHeight : function(A) {
						if (parseInt(A) == A)
							A += "px";
						this.height = A;
						if (this._InputType == "textarea") {
							this.el.style.height = A;
							this.doLayout()
						}
					},
					setName : function(A) {
						if (this.name != A) {
							this.name = A;
							if (this._valueEl)
								mini.setAttr(this._valueEl, "name", this.name)
						}
					},
					setValue : function(A) {
						if (A === null || A === undefined)
							A = "";
						A = String(A);
						if (A.length > this.maxLength)
							A = A.substring(0, this.maxLength);
						if (this.value !== A) {
							this.value = A;
							this._valueEl.value = this._textEl.value = A;
							this._doEmpty()
						}
					},
					getValue : function() {
						return this.value
					},
					getFormValue : function() {
						value = this.value;
						if (value === null || value === undefined)
							value = "";
						return String(value)
					},
					setAllowInput : function(A) {
						if (this.allowInput != A) {
							this.allowInput = A;
							this.doUpdate()
						}
					},
					getAllowInput : function() {
						return this.allowInput
					},
					_placeholdered : false,
					_doEmpty : function() {
						this._textEl.placeholder = this.emptyText;
						if (this.emptyText)
							mini._placeholder(this._textEl)
					},
					setEmptyText : function(A) {
						if (this.emptyText != A) {
							this.emptyText = A;
							this._doEmpty()
						}
					},
					getEmptyText : function() {
						return this.emptyText
					},
					setMaxLength : function(A) {
						this.maxLength = A;
						mini.setAttr(this._textEl, "maxLength", A);
						if (this._InputType == "textarea" && mini.isIE)
							mini.on(this._textEl, "keypress",
									this.__OnMaxLengthKeyUp, this)
					},
					__OnMaxLengthKeyUp : function(A) {
						if (this._textEl.value.length >= this.maxLength)
							A.preventDefault()
					},
					getMaxLength : function() {
						return this.maxLength
					},
					setReadOnly : function(A) {
						if (this.readOnly != A) {
							this.readOnly = A;
							this.doUpdate()
						}
					},
					setEnabled : function(A) {
						if (this.enabled != A) {
							this.enabled = A;
							this.doUpdate();
							this._tryValidate()
						}
					},
					doUpdate : function() {
						if (this.enabled)
							this.removeCls(this._disabledCls);
						else
							this.addCls(this._disabledCls);
						if (this.isReadOnly() || this.allowInput == false) {
							this._textEl.readOnly = true;
							mini.addClass(this.el, "mini-textbox-readOnly")
						} else {
							this._textEl.readOnly = false;
							mini.removeClass(this.el, "mini-textbox-readOnly")
						}
						if (this.required)
							this.addCls(this._requiredCls);
						else
							this.removeCls(this._requiredCls);
						if (this.enabled)
							this._textEl.disabled = false;
						else
							this._textEl.disabled = true
					},
					focus : function() {
						try {
							this._textEl.focus()
						} catch (A) {
						}
					},
					blur : function() {
						try {
							this._textEl.blur()
						} catch (A) {
						}
					},
					selectText : function() {
						var B = this;
						function A() {
							try {
								B._textEl.select()
							} catch (A) {
							}
						}
						A();
						setTimeout(function() {
							A()
						}, 30)
					},
					getTextEl : function() {
						return this._textEl
					},
					getInputText : function() {
						return this._textEl.value
					},
					setSelectOnFocus : function(A) {
						this.selectOnFocus = A
					},
					getSelectOnFocus : function(A) {
						return this.selectOnFocus
					},
					_errorIconEl : null,
					getErrorIconEl : function() {
						if (!this._errorIconEl)
							this._errorIconEl = mini.append(this.el,
									"<span class=\"mini-errorIcon\"></span>");
						return this._errorIconEl
					},
					_RemoveErrorIcon : function() {
						if (this._errorIconEl) {
							var A = this._errorIconEl;
							jQuery(A).remove()
						}
						this._errorIconEl = null
					},
					__OnMouseDown : function(B) {
						var A = this;
						if (!mini.isAncestor(this._textEl, B.target))
							setTimeout(function() {
								A.focus();
								mini.selectRange(A._textEl, 1000, 1000)
							}, 1);
						else
							setTimeout(function() {
								try {
									A._textEl.focus()
								} catch (B) {
								}
							}, 1)
					},
					__OnInputTextChanged : function(C, B) {
						var A = this.value;
						this.setValue(this._textEl.value);
						if (A !== this.getValue() || B === true)
							this._OnValueChanged()
					},
					__OnDropText : function(B) {
						var A = this;
						setTimeout(function() {
							A.__OnInputTextChanged(B)
						}, 0)
					},
					__OnInputKeyDown : function(C) {
						var B = {
							htmlEvent : C
						};
						this.fire("keydown", B);
						if (C.keyCode == 8
								&& (this.isReadOnly() || this.allowInput == false))
							return false;
						if (C.keyCode == 13 || C.keyCode == 9) {
							this.__OnInputTextChanged(null, true);
							if (C.keyCode == 13) {
								var A = this;
								A.fire("enter", B)
							}
						}
						if (C.keyCode == 27)
							C.preventDefault()
					},
					__OnInputKeyUp : function(A) {
						this.fire("keyup", {
							htmlEvent : A
						})
					},
					__OnInputKeyPress : function(A) {
						this.fire("keypress", {
							htmlEvent : A
						})
					},
					__OnFocus : function(A) {
						this.doUpdate();
						if (this.isReadOnly())
							return;
						this._focused = true;
						this.addCls(this._focusCls);
						this._initInputEvents();
						if (this.selectOnFocus)
							this.selectText();
						this.fire("focus", {
							htmlEvent : A
						})
					},
					__OnBlur : function(B) {
						this._focused = false;
						var A = this;
						setTimeout(function() {
							if (A._focused == false)
								A.removeCls(A._focusCls)
						}, 2);
						this.fire("blur", {
							htmlEvent : B
						});
						if (this.validateOnLeave)
							this._tryValidate()
					},
					getAttrs : function(A) {
						var C = mini.TextBox.superclass.getAttrs.call(this, A), B = jQuery(A);
						mini._ParseString(A, C, [ "value", "text", "emptyText",
								"onenter", "onkeydown", "onkeyup",
								"onkeypress", "maxLengthErrorText",
								"minLengthErrorText", "onfocus", "onblur",
								"vtype", "emailErrorText", "urlErrorText",
								"floatErrorText", "intErrorText",
								"dateErrorText", "minErrorText",
								"maxErrorText", "rangeLengthErrorText",
								"rangeErrorText", "rangeCharErrorText" ]);
						mini
								._ParseBool(A, C, [ "allowInput",
										"selectOnFocus" ]);
						mini._ParseInt(A, C, [ "maxLength", "minLength",
								"minHeight" ]);
						return C
					},
					vtype : "",
					setVtype : function(A) {
						this.vtype = A
					},
					getVtype : function() {
						return this.vtype
					},
					__OnValidation : function(A) {
						if (A.isValid == false)
							return;
						mini._ValidateVType(this.vtype, A.value, A, this)
					},
					setEmailErrorText : function(A) {
						this.emailErrorText = A
					},
					getEmailErrorText : function() {
						return this.emailErrorText
					},
					setUrlErrorText : function(A) {
						this.urlErrorText = A
					},
					getUrlErrorText : function() {
						return this.urlErrorText
					},
					setFloatErrorText : function(A) {
						this.floatErrorText = A
					},
					getFloatErrorText : function() {
						return this.floatErrorText
					},
					setIntErrorText : function(A) {
						this.intErrorText = A
					},
					getIntErrorText : function() {
						return this.intErrorText
					},
					setDateErrorText : function(A) {
						this.dateErrorText = A
					},
					getDateErrorText : function() {
						return this.dateErrorText
					},
					setMaxLengthErrorText : function(A) {
						this.maxLengthErrorText = A
					},
					getMaxLengthErrorText : function() {
						return this.maxLengthErrorText
					},
					setMinLengthErrorText : function(A) {
						this.minLengthErrorText = A
					},
					getMinLengthErrorText : function() {
						return this.minLengthErrorText
					},
					setMaxErrorText : function(A) {
						this.maxErrorText = A
					},
					getMaxErrorText : function() {
						return this.maxErrorText
					},
					setMinErrorText : function(A) {
						this.minErrorText = A
					},
					getMinErrorText : function() {
						return this.minErrorText
					},
					setRangeLengthErrorText : function(A) {
						this.rangeLengthErrorText = A
					},
					getRangeLengthErrorText : function() {
						return this.rangeLengthErrorText
					},
					setRangeCharErrorText : function(A) {
						this.rangeCharErrorText = A
					},
					getRangeCharErrorText : function() {
						return this.rangeCharErrorText
					},
					setRangeErrorText : function(A) {
						this.rangeErrorText = A
					},
					getRangeErrorText : function() {
						return this.rangeErrorText
					}
				});
mini.regClass(mini.TextBox, "textbox");
mini.Password = function() {
	mini.Password.superclass.constructor.call(this)
};
mini.extend(mini.Password, mini.TextBox, {
	uiCls : "mini-password",
	_InputType : "password",
	setEmptyText : function(A) {
		this.emptyText = ""
	}
});
mini.regClass(mini.Password, "password");
mini.TextArea = function() {
	mini.TextArea.superclass.constructor.call(this)
};
mini.extend(mini.TextArea, mini.TextBox, {
	maxLength : 10000000,
	width : 180,
	height : 50,
	minHeight : 50,
	_InputType : "textarea",
	uiCls : "mini-textarea",
	doLayout : function() {
		if (!this.canLayout())
			return;
		mini.TextArea.superclass.doLayout.call(this);
		var A = mini.getHeight(this.el);
		A -= 2;
		if (A < 0)
			A = 0;
		this._textEl.style.height = A + "px"
	}
});
mini.regClass(mini.TextArea, "textarea");
mini.PopupEdit = function() {
	mini.PopupEdit.superclass.constructor.call(this);
	this._createPopup();
	this.el.className += " mini-popupedit"
};
mini.extend(mini.PopupEdit, mini.ButtonEdit, {
	uiCls : "mini-popupedit",
	popup : null,
	popupCls : "mini-buttonedit-popup",
	_hoverCls : "mini-buttonedit-hover",
	_pressedCls : "mini-buttonedit-pressed",
	destroy : function(A) {
		if (this.isShowPopup())
			this.hidePopup();
		if (this.popup) {
			this.popup.destroy();
			this.popup = null
		}
		if (this._popupInner) {
			this._popupInner.owner = null;
			this._popupInner = null
		}
		mini.PopupEdit.superclass.destroy.call(this, A)
	},
	_initEvents : function() {
		mini.PopupEdit.superclass._initEvents.call(this);
		mini._BindEvents(function() {
			mini_onOne(this.el, "mouseover", this.__OnMouseOver, this);
			mini_onOne(this.el, "mouseout", this.__OnMouseOut, this)
		}, this)
	},
	_initButtons : function() {
		this.buttons = [];
		var A = this.createButton( {
			cls : "mini-buttonedit-popup",
			iconCls : "mini-buttonedit-icons-popup",
			name : "popup"
		});
		this.buttons.push(A)
	},
	__OnBlur : function(A) {
		if (this._clickTarget && mini.isAncestor(this.el, this._clickTarget))
			return;
		if (this.isShowPopup())
			return;
		mini.PopupEdit.superclass.__OnBlur.call(this, A)
	},
	__OnMouseOver : function(A) {
		if (this.isReadOnly() || this.allowInput)
			return;
		if (mini.findParent(A.target, "mini-buttonedit-border"))
			this.addCls(this._hoverCls)
	},
	__OnMouseOut : function(A) {
		if (this.isReadOnly() || this.allowInput)
			return;
		this.removeCls(this._hoverCls)
	},
	__OnMouseDown : function(A) {
		if (this.isReadOnly())
			return;
		mini.PopupEdit.superclass.__OnMouseDown.call(this, A);
		if (this.allowInput == false
				&& mini.findParent(A.target, "mini-buttonedit-border")) {
			mini.addClass(this.el, this._pressedCls);
			mini.on(document, "mouseup", this.__OnDocMouseUp, this)
		}
	},
	__OnInputKeyDown : function(A) {
		this.fire("keydown", {
			htmlEvent : A
		});
		if (A.keyCode == 8 && (this.isReadOnly() || this.allowInput == false))
			return false;
		if (A.keyCode == 9) {
			this.hidePopup();
			return
		}
		if (A.keyCode == 27) {
			this.hidePopup();
			return
		}
		if (A.keyCode == 13)
			this.fire("enter");
		if (this.isShowPopup())
			if (A.keyCode == 13 || A.keyCode == 27)
				A.stopPropagation()
	},
	within : function(A) {
		if (mini.isAncestor(this.el, A.target))
			return true;
		if (this.popup.within(A))
			return true;
		return false
	},
	popupWidth : "100%",
	popupMinWidth : 50,
	popupMaxWidth : 2000,
	popupHeight : "",
	popupMinHeight : 30,
	popupMaxHeight : 2000,
	setPopup : function(A) {
		if (typeof A == "string") {
			mini.parse(A);
			A = mini.get(A)
		}
		var B = mini.getAndCreate(A);
		if (!B)
			return;
		B.setVisible(false);
		this._popupInner = B;
		B.owner = this;
		B.on("beforebuttonclick", this.__OnPopupButtonClick, this)
	},
	getPopup : function() {
		if (!this.popup)
			this._createPopup();
		return this.popup
	},
	_createPopup : function() {
		this.popup = new mini.Popup();
		this.popup.setShowAction("none");
		this.popup.setHideAction("outerclick");
		this.popup.setPopupEl(this.el);
		this.popup.on("BeforeClose", this.__OnPopupBeforeClose, this);
		mini.on(this.popup.el, "keydown", this.__OnPopupKeyDown, this)
	},
	__OnPopupBeforeClose : function(A) {
		if (this.within(A.htmlEvent))
			A.cancel = true
	},
	__OnPopupKeyDown : function(A) {
	},
	showPopup : function() {
		var B = {
			cancel : false
		};
		this.fire("beforeshowpopup", B);
		if (B.cancel == true)
			return;
		var A = this.getPopup();
		this._syncShowPopup();
		A.on("Close", this.__OnPopupHide, this);
		this.fire("showpopup")
	},
	doLayout : function() {
		mini.PopupEdit.superclass.doLayout.call(this);
		if (this.isShowPopup())
			;
	},
	_syncShowPopup : function() {
		var B = this.getPopup();
		if (this._popupInner
				&& this._popupInner.el.parentNode != this.popup._contentEl) {
			this.popup._contentEl.appendChild(this._popupInner.el);
			this._popupInner.setVisible(true)
		}
		var D = this.getBox(), A = this.popupWidth;
		if (this.popupWidth == "100%")
			A = D.width;
		B.setWidth(A);
		var C = parseInt(this.popupHeight);
		if (!isNaN(C))
			B.setHeight(C);
		else
			B.setHeight("auto");
		B.setMinWidth(this.popupMinWidth);
		B.setMinHeight(this.popupMinHeight);
		B.setMaxWidth(this.popupMaxWidth);
		B.setMaxHeight(this.popupMaxHeight);
		B.showAtEl(this.el, {
			xAlign : "left",
			yAlign : "below",
			outYAlign : "above",
			outXAlign : "right",
			popupCls : this.popupCls
		})
	},
	__OnPopupHide : function(A) {
		this.__OnBlur();
		this.fire("hidepopup")
	},
	hidePopup : function() {
		var A = this.getPopup();
		A.close();
		this.blur()
	},
	isShowPopup : function() {
		if (this.popup && this.popup.isDisplay())
			return true;
		else
			return false
	},
	setPopupWidth : function(A) {
		this.popupWidth = A
	},
	setPopupMaxWidth : function(A) {
		this.popupMaxWidth = A
	},
	setPopupMinWidth : function(A) {
		this.popupMinWidth = A
	},
	getPopupWidth : function(A) {
		return this.popupWidth
	},
	getPopupMaxWidth : function(A) {
		return this.popupMaxWidth
	},
	getPopupMinWidth : function(A) {
		return this.popupMinWidth
	},
	setPopupHeight : function(A) {
		this.popupHeight = A
	},
	setPopupMaxHeight : function(A) {
		this.popupMaxHeight = A
	},
	setPopupMinHeight : function(A) {
		this.popupMinHeight = A
	},
	getPopupHeight : function(A) {
		return this.popupHeight
	},
	getPopupMaxHeight : function(A) {
		return this.popupMaxHeight
	},
	getPopupMinHeight : function(A) {
		return this.popupMinHeight
	},
	__OnClick : function(B) {
		if (this.isReadOnly())
			return;
		if (mini.isAncestor(this._buttonEl, B.target))
			this._OnButtonClick(B);
		if (mini.findParent(B.target, this._closeCls)) {
			if (this.isShowPopup())
				this.hidePopup();
			this.fire("closeclick", {
				htmlEvent : B
			});
			return
		}
		if (this.allowInput == false
				|| mini.isAncestor(this._buttonEl, B.target))
			if (this.isShowPopup())
				this.hidePopup();
			else {
				var A = this;
				setTimeout(function() {
					A.showPopup()
				}, 1)
			}
	},
	__OnPopupButtonClick : function(A) {
		if (A.name == "close")
			this.hidePopup();
		A.cancel = true
	},
	getAttrs : function(A) {
		var B = mini.PopupEdit.superclass.getAttrs.call(this, A);
		mini._ParseString(A, B, [ "popupWidth", "popupHeight", "popup",
				"onshowpopup", "onhidepopup", "onbeforeshowpopup" ]);
		mini._ParseInt(A, B, [ "popupMinWidth", "popupMaxWidth",
				"popupMinHeight", "popupMaxHeight" ]);
		return B
	}
});
mini.regClass(mini.PopupEdit, "popupedit");
mini.ComboBox = function() {
	this.data = [];
	this.columns = [];
	mini.ComboBox.superclass.constructor.call(this);
	var A = this;
	if (isFirefox)
		this._textEl.oninput = function() {
			A._tryQuery()
		}
};
mini.extend(mini.ComboBox, mini.PopupEdit, {
	text : "",
	value : "",
	valueField : "id",
	textField : "text",
	delimiter : ",",
	multiSelect : false,
	data : [],
	url : "",
	columns : [],
	allowInput : false,
	valueFromSelect : false,
	popupMaxHeight : 200,
	set : function(C) {
		if (typeof C == "string")
			return this;
		var A = C.value;
		delete C.value;
		var D = C.url;
		delete C.url;
		var B = C.data;
		delete C.data;
		mini.ComboBox.superclass.set.call(this, C);
		if (!mini.isNull(B)) {
			this.setData(B);
			C.data = B
		}
		if (!mini.isNull(D)) {
			this.setUrl(D);
			C.url = D
		}
		if (!mini.isNull(A)) {
			this.setValue(A);
			C.value = A
		}
		return this
	},
	uiCls : "mini-combobox",
	_createPopup : function() {
		mini.ComboBox.superclass._createPopup.call(this);
		this._listbox = new mini.ListBox();
		this._listbox.setBorderStyle("border:0;");
		this._listbox.setStyle("width:100%;height:auto;");
		this._listbox.render(this.popup._contentEl);
		this._listbox.on("itemclick", this.__OnItemClick, this);
		this._listbox.on("drawcell", this.__OnItemDrawCell, this);
		var A = this;
		this._listbox.on("beforeload", function(B) {
			A.fire("beforeload", B)
		}, this);
		this._listbox.on("load", function(B) {
			A.fire("load", B)
		}, this);
		this._listbox.on("loaderror", function(B) {
			A.fire("loaderror", B)
		}, this)
	},
	showPopup : function() {
		var B = {
			cancel : false
		};
		this.fire("beforeshowpopup", B);
		if (B.cancel == true)
			return;
		this._listbox.setHeight("auto");
		mini.ComboBox.superclass.showPopup.call(this);
		var A = this.popup.el.style.height;
		if (A == "" || A == "auto")
			this._listbox.setHeight("auto");
		else
			this._listbox.setHeight("100%");
		this._listbox.setValue(this.value)
	},
	select : function(A) {
		this._listbox.deselectAll();
		A = this.getItem(A);
		if (A) {
			this._listbox.select(A);
			this.__OnItemClick()
		}
	},
	getItem : function(A) {
		return typeof A == "object" ? A : this.data[A]
	},
	indexOf : function(A) {
		return this.data.indexOf(A)
	},
	getAt : function(A) {
		return this.data[A]
	},
	load : function(A) {
		if (typeof A == "string")
			this.setUrl(A);
		else
			this.setData(A)
	},
	setData : function(data) {
		if (typeof data == "string")
			data = eval("(" + data + ")");
		if (!mini.isArray(data))
			data = [];
		this._listbox.setData(data);
		this.data = this._listbox.data;
		var vts = this._listbox.getValueAndText(this.value);
		this._textEl.value = vts[1]
	},
	getData : function() {
		return this.data
	},
	setUrl : function(B) {
		this.getPopup();
		this._listbox.setUrl(B);
		this.url = this._listbox.url;
		this.data = this._listbox.data;
		var A = this._listbox.getValueAndText(this.value);
		this.text = this._textEl.value = A[1]
	},
	getUrl : function() {
		return this.url
	},
	setValueField : function(A) {
		this.valueField = A;
		if (this._listbox)
			this._listbox.setValueField(A)
	},
	getValueField : function() {
		return this.valueField
	},
	setTextField : function(A) {
		if (this._listbox)
			this._listbox.setTextField(A);
		this.textField = A
	},
	getTextField : function() {
		return this.textField
	},
	setDisplayField : function(A) {
		this.setTextField(A)
	},
	setValue : function(A) {
		if (this.value !== A) {
			var B = this._listbox.getValueAndText(A);
			this.value = A;
			this._valueEl.value = this.value;
			this.text = this._textEl.value = B[1];
			this._doEmpty()
		} else {
			B = this._listbox.getValueAndText(A);
			this.text = this._textEl.value = B[1]
		}
	},
	setMultiSelect : function(A) {
		if (this.multiSelect != A) {
			this.multiSelect = A;
			if (this._listbox) {
				this._listbox.setMultiSelect(A);
				this._listbox.setShowCheckBox(A)
			}
		}
	},
	getMultiSelect : function() {
		return this.multiSelect
	},
	setColumns : function(A) {
		if (!mini.isArray(A))
			A = [];
		this.columns = A;
		this._listbox.setColumns(A)
	},
	getColumns : function() {
		return this.columns
	},
	showNullItem : false,
	setShowNullItem : function(A) {
		if (this.showNullItem != A) {
			this.showNullItem = A;
			this._listbox.setShowNullItem(A)
		}
	},
	getShowNullItem : function() {
		return this.showNullItem
	},
	setNullItemText : function(A) {
		if (this.nullItemText != A) {
			this.nullItemText = A;
			this._listbox.setNullItemText(A)
		}
	},
	getNullItemText : function() {
		return this.nullItemText
	},
	setValueFromSelect : function(A) {
		this.valueFromSelect = A
	},
	getValueFromSelect : function() {
		return this.valueFromSelect
	},
	_OnValueChanged : function() {
		if (this.validateOnChanged)
			this.validate();
		var A = this.getValue(), D = this.getSelecteds(), B = D[0], C = this;
		C.fire("valuechanged", {
			value : A,
			selecteds : D,
			selected : B
		})
	},
	getSelecteds : function() {
		return this._listbox.findItems(this.value)
	},
	getSelected : function() {
		return this.getSelecteds()[0]
	},
	__OnItemDrawCell : function(A) {
		this.fire("drawcell", A)
	},
	__OnItemClick : function(E) {
		var D = this._listbox.getSelecteds(), C = this._listbox
				.getValueAndText(D), A = this.getValue();
		this.setValue(C[0]);
		this.setText(C[1]);
		if (E) {
			if (A != this.getValue()) {
				var B = this;
				setTimeout(function() {
					B._OnValueChanged()
				}, 1)
			}
			if (!this.multiSelect)
				this.hidePopup();
			this.focus();
			this.fire("itemclick", {
				item : E.item
			})
		}
	},
	__OnInputKeyDown : function(F, C) {
		this.fire("keydown", {
			htmlEvent : F
		});
		if (F.keyCode == 8 && (this.isReadOnly() || this.allowInput == false))
			return false;
		if (F.keyCode == 9) {
			this.hidePopup();
			return
		}
		if (this.isReadOnly())
			return;
		switch (F.keyCode) {
		case 27:
			F.preventDefault();
			if (this.isShowPopup())
				F.stopPropagation();
			this.hidePopup();
			this.focus();
			break;
		case 13:
			if (this.isShowPopup()) {
				F.preventDefault();
				F.stopPropagation();
				var B = this._listbox.getFocusedIndex();
				if (B != -1) {
					var A = this._listbox.getAt(B);
					if (this.multiSelect)
						;
					else {
						this._listbox.deselectAll();
						this._listbox.select(A)
					}
					var E = this._listbox.getSelecteds(), D = this._listbox
							.getValueAndText(E);
					this.setValue(D[0]);
					this.setText(D[1]);
					this._OnValueChanged()
				}
				this.hidePopup();
				this.focus();
			} else
				this.fire("enter");
			break;
		case 37:
			break;
		case 38:
			B = this._listbox.getFocusedIndex();
			if (B == -1) {
				B = 0;
				if (!this.multiSelect) {
					A = this._listbox.findItems(this.value)[0];
					if (A)
						B = this._listbox.indexOf(A)
				}
			}
			if (this.isShowPopup())
				if (!this.multiSelect) {
					B -= 1;
					if (B < 0)
						B = 0;
					this._listbox._focusItem(B, true)
				}
			break;
		case 39:
			break;
		case 40:
			B = this._listbox.getFocusedIndex();
			if (B == -1) {
				B = 0;
				if (!this.multiSelect) {
					A = this._listbox.findItems(this.value)[0];
					if (A)
						B = this._listbox.indexOf(A)
				}
			}
			if (this.isShowPopup()) {
				if (!this.multiSelect) {
					B += 1;
					if (B > this._listbox.getCount() - 1)
						B = this._listbox.getCount() - 1;
					this._listbox._focusItem(B, true)
				}
			} else {
				this.showPopup();
				if (!this.multiSelect)
					this._listbox._focusItem(B, true)
			}
			break;
		default:
			this._tryQuery(this._textEl.value);
			break
		}
	},
	__OnInputKeyUp : function(A) {
		this.fire("keyup", {
			htmlEvent : A
		})
	},
	__OnInputKeyPress : function(A) {
		this.fire("keypress", {
			htmlEvent : A
		})
	},
	_tryQuery : function(B) {
		var A = this;
		setTimeout(function() {
			var C = A._textEl.value;
			if (C != B)
				A._doQuery(C)
		}, 10)
	},
	_doQuery : function(D) {
		if (this.multiSelect == true)
			return;
		var C = [];
		for ( var E = 0, H = this.data.length; E < H; E++) {
			var B = this.data[E], F = B[this.textField];
			if (typeof F == "string") {
				F = F.toUpperCase();
				D = D.toUpperCase();
				if (F.indexOf(D) != -1)
					C.push(B)
			}
		}
		this._listbox.setData(C);
		this._filtered = true;
		if (D !== "" || this.isShowPopup()) {
			this.showPopup();
			var A = 0;
			if (this._listbox.getShowNullItem())
				A = 1;
			var G = this;
			G._listbox._focusItem(A, true)
		}
	},
	__OnPopupHide : function(A) {
		if (this._filtered) {
			this._filtered = false;
			if (this._listbox.el)
				this._listbox.setData(this.data)
		}
		this.fire("hidepopup")
	},
	findItems : function(A) {
		return this._listbox.findItems(A)
	},
	__OnInputTextChanged : function(L) {
		if (this.multiSelect == false) {
			var G = this._textEl.value, J = this.getData(), H = null;
			for ( var F = 0, D = J.length; F < D; F++) {
				var A = J[F], K = A[this.textField];
				if (K == G) {
					H = A;
					break
				}
			}
			if (H) {
				this._listbox.setValue(H ? H[this.valueField] : "");
				var E = this._listbox.getValue(), C = this._listbox
						.getValueAndText(E), B = this.getValue();
				this.setValue(E);
				this.setText(C[1])
			} else if (this.valueFromSelect) {
				this.setValue("");
				this.setText("")
			} else {
				this.setValue(G);
				this.setText(G)
			}
			if (B != this.getValue()) {
				var I = this;
				I._OnValueChanged()
			}
		}
	},
	setAjaxData : function(A) {
		this.ajaxData = A;
		this._listbox.setAjaxData(A)
	},
	setAjaxType : function(A) {
		this.ajaxType = A;
		this._listbox.setAjaxType(A)
	},
	getAttrs : function(I) {
		var G = mini.ComboBox.superclass.getAttrs.call(this, I);
		mini._ParseString(I, G, [ "url", "data", "textField", "valueField",
				"displayField", "nullItemText", "ondrawcell", "onbeforeload",
				"onload", "onloaderror", "onitemclick" ]);
		mini._ParseBool(I, G, [ "multiSelect", "showNullItem",
				"valueFromSelect" ]);
		if (G.displayField)
			G.textField = G.displayField;
		var E = G.valueField || this.valueField, J = G.textField
				|| this.textField;
		if (I.nodeName.toLowerCase() == "select") {
			var K = [];
			for ( var H = 0, F = I.length; H < F; H++) {
				var A = I.options[H], B = {};
				B[J] = A.text;
				B[E] = A.value;
				K.push(B)
			}
			if (K.length > 0)
				G.data = K
		} else {
			var L = mini.getChildNodes(I);
			for (H = 0, F = L.length; H < F; H++) {
				var C = L[H], D = jQuery(C).attr("property");
				if (!D)
					continue;
				D = D.toLowerCase();
				if (D == "columns")
					G.columns = mini._ParseColumns(C);
				else if (D == "data")
					G.data = C.innerHTML
			}
		}
		return G
	}
});
mini.regClass(mini.ComboBox, "combobox");
mini.DatePicker = function() {
	mini.DatePicker.superclass.constructor.call(this)
};
mini.extend(mini.DatePicker, mini.PopupEdit, {
	valueFormat : "",
	format : "yyyy-MM-dd",
	maxDate : null,
	minDate : null,
	popupWidth : "",
	viewDate : new Date(),
	showTime : false,
	timeFormat : "H:mm",
	showTodayButton : true,
	showClearButton : true,
	showOkButton : false,
	uiCls : "mini-datepicker",
	_getCalendar : function() {
		if (!mini.DatePicker._Calendar) {
			var A = mini.DatePicker._Calendar = new mini.Calendar();
			A.setStyle("border:0;")
		}
		return mini.DatePicker._Calendar
	},
	_createPopup : function() {
		mini.DatePicker.superclass._createPopup.call(this);
		this._calendar = this._getCalendar()
	},
	showPopup : function() {
		var C = {
			cancel : false
		};
		this.fire("beforeshowpopup", C);
		if (C.cancel == true)
			return;
		this._calendar.beginUpdate();
		this._calendar._allowLayout = false;
		if (this._calendar.el.parentNode != this.popup._contentEl)
			this._calendar.render(this.popup._contentEl);
		this._calendar.set( {
			showTime : this.showTime,
			timeFormat : this.timeFormat,
			showClearButton : this.showClearButton,
			showTodayButton : this.showTodayButton,
			showOkButton : this.showOkButton
		});
		this._calendar.setValue(this.value);
		if (this.value)
			this._calendar.setViewDate(this.value);
		else
			this._calendar.setViewDate(this.viewDate);
		mini.DatePicker.superclass.showPopup.call(this);
		function A() {
			if (this._calendar._target) {
				var A = this._calendar._target;
				this._calendar.un("timechanged", A.__OnTimeChanged, A);
				this._calendar.un("dateclick", A.__OnDateClick, A);
				this._calendar.un("drawdate", A.__OnDrawDate, A)
			}
			this._calendar.on("timechanged", this.__OnTimeChanged, this);
			this._calendar.on("dateclick", this.__OnDateClick, this);
			this._calendar.on("drawdate", this.__OnDrawDate, this);
			this._calendar.endUpdate();
			this._calendar._allowLayout = true;
			this._calendar.doLayout();
			this._calendar.focus();
			this._calendar._target = this
		}
		var B = this;
		A.call(B)
	},
	hidePopup : function() {
		mini.DatePicker.superclass.hidePopup.call(this);
		this._calendar.un("timechanged", this.__OnTimeChanged, this);
		this._calendar.un("dateclick", this.__OnDateClick, this);
		this._calendar.un("drawdate", this.__OnDrawDate, this)
	},
	within : function(A) {
		if (mini.isAncestor(this.el, A.target))
			return true;
		if (this._calendar.within(A))
			return true;
		return false
	},
	__OnPopupKeyDown : function(A) {
		if (A.keyCode == 13)
			this.__OnDateClick();
		if (A.keyCode == 27) {
			this.hidePopup();
			this.focus()
		}
	},
	__OnDrawDate : function(D) {
		var B = D.date, A = mini.parseDate(this.maxDate), C = mini
				.parseDate(this.minDate);
		if (mini.isDate(A))
			if (B.getTime() > A.getTime())
				D.allowSelect = false;
		if (mini.isDate(C))
			if (B.getTime() < C.getTime())
				D.allowSelect = false;
		this.fire("drawdate", D)
	},
	__OnDateClick : function(C) {
		if (this.showOkButton && C.action != "ok")
			return;
		var B = this._calendar.getValue(), A = this.getFormValue();
		this.setValue(B);
		if (A !== this.getFormValue())
			this._OnValueChanged();
		this.focus();
		this.hidePopup()
	},
	__OnTimeChanged : function(B) {
		if (this.showOkButton)
			return;
		var A = this._calendar.getValue();
		this.setValue(A);
		this._OnValueChanged()
	},
	setFormat : function(A) {
		if (typeof A != "string")
			return;
		if (this.format != A) {
			this.format = A;
			this._textEl.value = this._valueEl.value = this.getFormValue()
		}
	},
	getFormat : function() {
		return this.format
	},
	setValueFormat : function(A) {
		if (typeof A != "string")
			return;
		if (this.valueFormat != A)
			this.valueFormat = A
	},
	getValueFormat : function() {
		return this.valueFormat
	},
	setValue : function(A) {
		A = mini.parseDate(A);
		if (mini.isNull(A))
			A = "";
		if (mini.isDate(A))
			A = new Date(A.getTime());
		if (this.value != A) {
			this.value = A;
			this.text = this._textEl.value = this._valueEl.value = this
					.getFormValue()
		}
	},
	getValue : function() {
		if (!mini.isDate(this.value))
			return "";
		var A = this.value;
		if (this.valueFormat)
			A = mini.formatDate(A, this.valueFormat);
		return A
	},
	getFormValue : function() {
		if (!mini.isDate(this.value))
			return "";
		return mini.formatDate(this.value, this.format)
	},
	setViewDate : function(A) {
		A = mini.parseDate(A);
		if (!mini.isDate(A))
			return;
		this.viewDate = A
	},
	getViewDate : function() {
		return this._calendar.getViewDate()
	},
	setShowTime : function(A) {
		if (this.showTime != A)
			this.showTime = A
	},
	getShowTime : function() {
		return this.showTime
	},
	setTimeFormat : function(A) {
		if (this.timeFormat != A)
			this.timeFormat = A
	},
	getTimeFormat : function() {
		return this.timeFormat
	},
	setShowTodayButton : function(A) {
		this.showTodayButton = A
	},
	getShowTodayButton : function() {
		return this.showTodayButton
	},
	setShowClearButton : function(A) {
		this.showClearButton = A
	},
	getShowClearButton : function() {
		return this.showClearButton
	},
	setShowOkButton : function(A) {
		this.showOkButton = A
	},
	getShowOkButton : function() {
		return this.showOkButton
	},
	setMaxDate : function(A) {
		this.maxDate = A
	},
	getMaxDate : function() {
		return this.maxDate
	},
	setMinDate : function(A) {
		this.minDate = A
	},
	getMinDate : function() {
		return this.minDate
	},
	__OnInputTextChanged : function(D) {
		var C = this._textEl.value, A = mini.parseDate(C);
		if (!A || isNaN(A) || A.getFullYear() == 1970)
			A = null;
		var B = this.getFormValue();
		this.setValue(A);
		if (A == null)
			this._textEl.value = "";
		if (B !== this.getFormValue())
			this._OnValueChanged()
	},
	__OnInputKeyDown : function(B) {
		this.fire("keydown", {
			htmlEvent : B
		});
		if (B.keyCode == 8 && (this.isReadOnly() || this.allowInput == false))
			return false;
		if (B.keyCode == 9) {
			this.hidePopup();
			return
		}
		if (this.isReadOnly())
			return;
		switch (B.keyCode) {
		case 27:
			B.preventDefault();
			if (this.isShowPopup())
				B.stopPropagation();
			this.hidePopup();
			break;
		case 9:
		case 13:
			if (this.isShowPopup()) {
				B.preventDefault();
				B.stopPropagation();
				this.hidePopup()
			} else {
				this.__OnInputTextChanged(null);
				var A = this;
				setTimeout(function() {
					A.fire("enter")
				}, 10)
			}
			break;
		case 37:
			break;
		case 38:
			B.preventDefault();
			break;
		case 39:
			break;
		case 40:
			B.preventDefault();
			this.showPopup();
			break;
		default:
			break
		}
	},
	getAttrs : function(A) {
		var B = mini.DatePicker.superclass.getAttrs.call(this, A);
		mini._ParseString(A, B, [ "format", "viewDate", "timeFormat",
				"ondrawdate", "minDate", "maxDate", "valueFormat" ]);
		mini._ParseBool(A, B, [ "showTime", "showTodayButton",
				"showClearButton", "showOkButton" ]);
		return B
	}
});
mini.regClass(mini.DatePicker, "datepicker");
mini.Calendar = function() {
	this.viewDate = new Date();
	this._selectedDates = [];
	mini.Calendar.superclass.constructor.call(this)
};
mini
		.extend(
				mini.Calendar,
				mini.Control,
				{
					width : 220,
					height : 160,
					_clearBorder : false,
					viewDate : null,
					_selectedDate : "",
					_selectedDates : [],
					multiSelect : false,
					firstDayOfWeek : 0,
					todayText : "Today",
					clearText : "Clear",
					okText : "OK",
					cancelText : "Cancel",
					daysShort : [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri",
							"Sat" ],
					format : "MMM, yyyy",
					timeFormat : "H:mm",
					showTime : false,
					currentTime : true,
					rows : 1,
					columns : 1,
					headerCls : "",
					bodyCls : "",
					footerCls : "",
					_todayCls : "mini-calendar-today",
					_weekendCls : "mini-calendar-weekend",
					_otherMonthCls : "mini-calendar-othermonth",
					_selectedDateCls : "mini-calendar-selected",
					showHeader : true,
					showFooter : true,
					showWeekNumber : false,
					showDaysHeader : true,
					showMonthButtons : true,
					showYearButtons : true,
					showTodayButton : true,
					showClearButton : true,
					showOkButton : false,
					isWeekend : function(B) {
						var A = B.getDay();
						return A == 0 || A == 6
					},
					getFirstDateOfMonth : function(A) {
						var A = new Date(A.getFullYear(), A.getMonth(), 1);
						return mini.getWeekStartDate(A, this.firstDayOfWeek)
					},
					getShortWeek : function(A) {
						return this.daysShort[A]
					},
					uiCls : "mini-calendar",
					_create : function() {
						var E = "<tr style=\"width:100%;\"><td style=\"width:100%;\"></td></tr>";
						E += "<tr ><td><div class=\"mini-calendar-footer\">"
								+ "<span style=\"display:inline-block;\"><input name=\"time\" class=\"mini-timespinner\" style=\"width:80px\" format=\""
								+ this.timeFormat
								+ "\"/>"
								+ "<span class=\"mini-calendar-footerSpace\"></span></span>"
								+ "<span class=\"mini-calendar-tadayButton\">"
								+ this.todayText
								+ "</span>"
								+ "<span class=\"mini-calendar-footerSpace\"></span>"
								+ "<span class=\"mini-calendar-clearButton\">"
								+ this.clearText
								+ "</span>"
								+ "<span class=\"mini-calendar-okButton\">"
								+ this.okText
								+ "</span>"
								+ "<a href=\"#\" class=\"mini-calendar-focus\" style=\"position:absolute;left:-10px;top:-10px;width:0px;height:0px;outline:none\" hideFocus></a>"
								+ "</div></td></tr>";
						var C = "<table class=\"mini-calendar\" cellpadding=\"0\" cellspacing=\"0\">"
								+ E + "</table>", B = document
								.createElement("div");
						B.innerHTML = C;
						this.el = B.firstChild;
						var A = this.el.getElementsByTagName("tr"), D = this.el
								.getElementsByTagName("td");
						this._innerEl = D[0];
						this._footerEl = mini.byClass("mini-calendar-footer",
								this.el);
						this.timeWrapEl = this._footerEl.childNodes[0];
						this.todayButtonEl = this._footerEl.childNodes[1];
						this.footerSpaceEl = this._footerEl.childNodes[2];
						this.closeButtonEl = this._footerEl.childNodes[3];
						this.okButtonEl = this._footerEl.childNodes[4];
						this._focusEl = this._footerEl.lastChild;
						mini.parse(this._footerEl);
						this.timeSpinner = mini.getbyName("time", this.el);
						this.doUpdate()
					},
					focus : function() {
						try {
							this._focusEl.focus()
						} catch (A) {
						}
					},
					destroy : function(A) {
						this._innerEl = this._footerEl = this.timeWrapEl = this.todayButtonEl = this.footerSpaceEl = this.closeButtonEl = null;
						mini.Calendar.superclass.destroy.call(this, A)
					},
					_initEvents : function() {
						if (this.timeSpinner)
							this.timeSpinner.on("valuechanged",
									this.__OnTimeChanged, this);
						mini._BindEvents(function() {
							mini.on(this.el, "click", this.__OnClick, this);
							mini.on(this.el, "mousedown", this.__OnMouseDown,
									this);
							mini.on(this.el, "keydown", this.__OnKeyDown, this)
						}, this)
					},
					getDateEl : function(A) {
						if (!A)
							return null;
						var B = this.uid + "$" + mini.clearTime(A).getTime();
						return document.getElementById(B)
					},
					within : function(A) {
						if (mini.isAncestor(this.el, A.target))
							return true;
						if (this.menuEl
								&& mini.isAncestor(this.menuEl, A.target))
							return true;
						return false
					},
					setShowHeader : function(A) {
						this.showHeader = A;
						this.doUpdate()
					},
					getShowHeader : function() {
						return this.showHeader
					},
					setShowFooter : function(A) {
						this.showFooter = A;
						this.doUpdate()
					},
					getShowFooter : function() {
						return this.showFooter
					},
					setShowWeekNumber : function(A) {
						this.showWeekNumber = A;
						this.doUpdate()
					},
					getShowWeekNumber : function() {
						return this.showWeekNumber
					},
					setShowDaysHeader : function(A) {
						this.showDaysHeader = A;
						this.doUpdate()
					},
					getShowDaysHeader : function() {
						return this.showDaysHeader
					},
					setShowMonthButtons : function(A) {
						this.showMonthButtons = A;
						this.doUpdate()
					},
					getShowMonthButtons : function() {
						return this.showMonthButtons
					},
					setShowYearButtons : function(A) {
						this.showYearButtons = A;
						this.doUpdate()
					},
					getShowYearButtons : function() {
						return this.showYearButtons
					},
					setShowTodayButton : function(A) {
						this.showTodayButton = A;
						this.todayButtonEl.style.display = this.showTodayButton ? ""
								: "none";
						this.doUpdate()
					},
					getShowTodayButton : function() {
						return this.showTodayButton
					},
					setShowClearButton : function(A) {
						this.showClearButton = A;
						this.closeButtonEl.style.display = this.showClearButton ? ""
								: "none";
						this.doUpdate()
					},
					getShowClearButton : function() {
						return this.showClearButton
					},
					setShowOkButton : function(A) {
						this.showOkButton = A;
						this.okButtonEl.style.display = this.showOkButton ? ""
								: "none";
						this.doUpdate()
					},
					getShowOkButton : function() {
						return this.showOkButton
					},
					setViewDate : function(A) {
						A = mini.parseDate(A);
						if (!A)
							A = new Date();
						if (mini.isDate(A))
							A = new Date(A.getTime());
						this.viewDate = A;
						this.doUpdate()
					},
					getViewDate : function() {
						return this.viewDate
					},
					setSelectedDate : function(A) {
						A = mini.parseDate(A);
						if (!mini.isDate(A))
							A = "";
						else
							A = new Date(A.getTime());
						var B = this.getDateEl(this._selectedDate);
						if (B)
							mini.removeClass(B, this._selectedDateCls);
						this._selectedDate = A;
						if (this._selectedDate)
							this._selectedDate = mini
									.cloneDate(this._selectedDate);
						B = this.getDateEl(this._selectedDate);
						if (B)
							mini.addClass(B, this._selectedDateCls);
						this.fire("datechanged")
					},
					setSelectedDates : function(A) {
						if (!mini.isArray(A))
							A = [];
						this._selectedDates = A;
						this.doUpdate()
					},
					getSelectedDate : function() {
						return this._selectedDate ? this._selectedDate : ""
					},
					setTime : function(A) {
						this.timeSpinner.setValue(A)
					},
					getTime : function() {
						return this.timeSpinner.getFormValue()
					},
					setValue : function(A) {
						this.setSelectedDate(A);
						if (!A)
							A = new Date();
						this.setTime(A)
					},
					getValue : function() {
						var A = this._selectedDate;
						if (A) {
							A = mini.clearTime(A);
							if (this.showTime) {
								var B = this.timeSpinner.getValue();
								A.setHours(B.getHours());
								A.setMinutes(B.getMinutes());
								A.setSeconds(B.getSeconds())
							}
						}
						return A ? A : ""
					},
					getFormValue : function() {
						var A = this.getValue();
						if (A)
							return mini.formatDate(A, "yyyy-MM-dd HH:mm:ss");
						return ""
					},
					isSelectedDate : function(A) {
						if (!A || !this._selectedDate)
							return false;
						return mini.clearTime(A).getTime() == mini.clearTime(
								this._selectedDate).getTime()
					},
					setMultiSelect : function(A) {
						this.multiSelect = A;
						this.doUpdate()
					},
					getMultiSelect : function() {
						return this.multiSelect
					},
					setRows : function(A) {
						if (isNaN(A))
							return;
						if (A < 1)
							A = 1;
						this.rows = A;
						this.doUpdate()
					},
					getRows : function() {
						return this.rows
					},
					setColumns : function(A) {
						if (isNaN(A))
							return;
						if (A < 1)
							A = 1;
						this.columns = A;
						this.doUpdate()
					},
					getColumns : function() {
						return this.columns
					},
					setShowTime : function(A) {
						if (this.showTime != A) {
							this.showTime = A;
							this.timeWrapEl.style.display = this.showTime ? ""
									: "none";
							this.doLayout()
						}
					},
					getShowTime : function() {
						return this.showTime
					},
					setTimeFormat : function(A) {
						if (this.timeFormat != A) {
							this.timeSpinner.setFormat(A);
							this.timeFormat = this.timeSpinner.format
						}
					},
					getTimeFormat : function() {
						return this.timeFormat
					},
					doLayout : function() {
						if (!this.canLayout())
							return;
						this.timeWrapEl.style.display = this.showTime ? ""
								: "none";
						this.todayButtonEl.style.display = this.showTodayButton ? ""
								: "none";
						this.closeButtonEl.style.display = this.showClearButton ? ""
								: "none";
						this.okButtonEl.style.display = this.showOkButton ? ""
								: "none";
						this.footerSpaceEl.style.display = (this.showClearButton && this.showTodayButton) ? ""
								: "none";
						this._footerEl.style.display = this.showFooter ? ""
								: "none";
						var B = this._innerEl.firstChild, A = this
								.isAutoHeight();
						if (!A) {
							B.parentNode.style.height = "100px";
							h = jQuery(this.el).height();
							h -= jQuery(this._footerEl).outerHeight();
							B.parentNode.style.height = h + "px"
						} else
							B.parentNode.style.height = "";
						mini.layout(this._footerEl)
					},
					doUpdate : function() {
						if (!this._allowUpdate)
							return;
						var I = new Date(this.viewDate.getTime()), C = this.rows == 1
								&& this.columns == 1, E = 100 / this.rows, H = "<table class=\"mini-calendar-views\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
						for ( var A = 0, G = this.rows; A < G; A++) {
							H += "<tr >";
							for ( var F = 0, B = this.columns; F < B; F++) {
								H += "<td style=\"height:" + E + "%\">";
								H += this._CreateView(I, A, F);
								H += "</td>";
								I = new Date(I.getFullYear(), I.getMonth() + 1,
										1)
							}
							H += "</tr>"
						}
						H += "</table>";
						this._innerEl.innerHTML = H;
						var D = this.el;
						setTimeout(function() {
							mini.repaint(D)
						}, 100);
						this.doLayout()
					},
					_CreateView : function(T, L, E) {
						var B = T.getMonth(), H = this.getFirstDateOfMonth(T), M = new Date(
								H.getTime()), C = mini.clearTime(new Date())
								.getTime(), F = this.value ? mini.clearTime(
								this.value).getTime() : -1, P = this.rows > 1
								|| this.columns > 1, R = "";
						R += "<table class=\"mini-calendar-view\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
						if (this.showHeader) {
							R += "<tr ><td colSpan=\"10\" class=\"mini-calendar-header\"><div class=\"mini-calendar-headerInner\">";
							if (L == 0 && E == 0) {
								R += "<div class=\"mini-calendar-prev\">";
								if (this.showYearButtons)
									R += "<span class=\"mini-calendar-yearPrev\"></span>";
								if (this.showMonthButtons)
									R += "<span class=\"mini-calendar-monthPrev\"></span>";
								R += "</div>"
							}
							if (L == 0 && E == this.columns - 1) {
								R += "<div class=\"mini-calendar-next\">";
								if (this.showMonthButtons)
									R += "<span class=\"mini-calendar-monthNext\"></span>";
								if (this.showYearButtons)
									R += "<span class=\"mini-calendar-yearNext\"></span>";
								R += "</div>"
							}
							R += "<span class=\"mini-calendar-title\">"
									+ mini.formatDate(T, this.format);
							+"</span>";
							R += "</div></td></tr>"
						}
						if (this.showDaysHeader) {
							R += "<tr class=\"mini-calendar-daysheader\"><td class=\"mini-calendar-space\"></td>";
							if (this.showWeekNumber)
								R += "<td sclass=\"mini-calendar-weeknumber\"></td>";
							for ( var N = this.firstDayOfWeek, D = N + 7; N < D; N++) {
								var Q = this.getShortWeek(N);
								R += "<td yAlign=\"middle\">";
								R += Q;
								R += "</td>";
								H = new Date(H.getFullYear(), H.getMonth(), H
										.getDate() + 1)
							}
							R += "<td class=\"mini-calendar-space\"></td></tr>"
						}
						H = M;
						for ( var J = 0; J <= 5; J++) {
							R += "<tr class=\"mini-calendar-days\"><td class=\"mini-calendar-space\"></td>";
							if (this.showWeekNumber) {
								var I = mini.getWeek(H.getFullYear(), H
										.getMonth() + 1, H.getDate());
								if (String(I).length == 1)
									I = "0" + I;
								R += "<td class=\"mini-calendar-weeknumber\" yAlign=\"middle\">"
										+ I + "</td>"
							}
							for (N = this.firstDayOfWeek, D = N + 7; N < D; N++) {
								var O = this.isWeekend(H), K = mini
										.clearTime(H).getTime(), A = K == C, G = this
										.isSelectedDate(H);
								if (B != H.getMonth() && P)
									K = -1;
								var S = this._OnDrawDate(H);
								R += "<td yAlign=\"middle\" id=\"";
								R += this.uid + "$" + K;
								R += "\" class=\"mini-calendar-date ";
								if (O)
									R += " mini-calendar-weekend ";
								if (S.allowSelect == false)
									R += " mini-calendar-disabled ";
								if (B != H.getMonth() && P)
									;
								else {
									if (G)
										R += " " + this._selectedDateCls + " ";
									if (A)
										R += " mini-calendar-today "
								}
								if (B != H.getMonth())
									R += " mini-calendar-othermonth ";
								R += "\">";
								if (B != H.getMonth() && P)
									;
								else
									R += S.dateHtml;
								R += "</td>";
								H = new Date(H.getFullYear(), H.getMonth(), H
										.getDate() + 1)
							}
							R += "<td class=\"mini-calendar-space\"></td></tr>"
						}
						R += "<tr class=\"mini-calendar-bottom\" colSpan=\"10\"><td ></td></tr>";
						R += "</table>";
						return R
					},
					_OnDrawDate : function(A) {
						var B = {
							date : A,
							dateCls : "",
							dateStyle : "",
							dateHtml : A.getDate(),
							allowSelect : true
						};
						this.fire("drawdate", B);
						return B
					},
					_OnDateClick : function(B, A) {
						var C = {
							date : B,
							action : A
						};
						this.fire("dateclick", C);
						this._OnValueChanged()
					},
					menuEl : null,
					menuYear : null,
					menuSelectMonth : null,
					menuSelectYear : null,
					showMenu : function(B) {
						if (!B)
							return;
						this.hideMenu();
						this.menuYear = parseInt(this.viewDate.getFullYear() / 10) * 10;
						this._menuselectMonth = this.viewDate.getMonth();
						this._menuselectYear = this.viewDate.getFullYear();
						var C = "<div class=\"mini-calendar-menu\"></div>";
						this.menuEl = mini.append(document.body, C);
						this.updateMenu(this.viewDate);
						var A = this.getBox();
						if (this.el.style.borderWidth == "0px")
							this.menuEl.style.border = "0";
						mini.setBox(this.menuEl, A);
						mini.on(this.menuEl, "click", this.__OnMenuClick, this);
						mini.on(document, "mousedown",
								this.__OnBodyMenuMouseDown, this)
					},
					hideMenu : function() {
						if (this.menuEl) {
							mini.un(this.menuEl, "click", this.__OnMenuClick,
									this);
							mini.un(document, "mousedown",
									this.__OnBodyMenuMouseDown, this);
							jQuery(this.menuEl).remove();
							this.menuEl = null
						}
					},
					updateMenu : function() {
						var E = "<div class=\"mini-calendar-menu-months\">";
						for ( var A = 0, D = 12; A < D; A++) {
							var B = mini.getShortMonth(A), C = "";
							if (this._menuselectMonth == A)
								C = "mini-calendar-menu-selected";
							E += "<a id=\""
									+ A
									+ "\" class=\"mini-calendar-menu-month "
									+ C
									+ "\" href=\"javascript:void(0);\" hideFocus onclick=\"return false\">"
									+ B + "</a>"
						}
						E += "<div style=\"clear:both;\"></div></div>";
						E += "<div class=\"mini-calendar-menu-years\">";
						for (A = this.menuYear, D = this.menuYear + 10; A < D; A++) {
							B = A, C = "";
							if (this._menuselectYear == A)
								C = "mini-calendar-menu-selected";
							E += "<a id=\""
									+ A
									+ "\" class=\"mini-calendar-menu-year "
									+ C
									+ "\" href=\"javascript:void(0);\" hideFocus onclick=\"return false\">"
									+ B + "</a>"
						}
						E += "<div class=\"mini-calendar-menu-prevYear\"></div><div class=\"mini-calendar-menu-nextYear\"></div><div style=\"clear:both;\"></div></div>";
						E += "<div class=\"mini-calendar-footer\">"
								+ "<span class=\"mini-calendar-okButton\">"
								+ this.okText
								+ "</span>"
								+ "<span class=\"mini-calendar-footerSpace\"></span>"
								+ "<span class=\"mini-calendar-cancelButton\">"
								+ this.cancelText + "</span>"
								+ "</div><div style=\"clear:both;\"></div>";
						this.menuEl.innerHTML = E
					},
					__OnMenuClick : function(E) {
						var B = E.target, D = mini.findParent(B,
								"mini-calendar-menu-month"), A = mini
								.findParent(B, "mini-calendar-menu-year");
						if (D) {
							this._menuselectMonth = parseInt(D.id);
							this.updateMenu()
						} else if (A) {
							this._menuselectYear = parseInt(A.id);
							this.updateMenu()
						} else if (mini.findParent(B,
								"mini-calendar-menu-prevYear")) {
							this.menuYear = this.menuYear - 1;
							this.menuYear = parseInt(this.menuYear / 10) * 10;
							this.updateMenu()
						} else if (mini.findParent(B,
								"mini-calendar-menu-nextYear")) {
							this.menuYear = this.menuYear + 11;
							this.menuYear = parseInt(this.menuYear / 10) * 10;
							this.updateMenu()
						} else if (mini.findParent(B, "mini-calendar-okButton")) {
							var C = new Date(this._menuselectYear,
									this._menuselectMonth, 1);
							this.setViewDate(C);
							this.hideMenu()
						} else if (mini.findParent(B,
								"mini-calendar-cancelButton"))
							this.hideMenu()
					},
					__OnBodyMenuMouseDown : function(A) {
						if (!mini.findParent(A.target, "mini-calendar-menu"))
							this.hideMenu()
					},
					__OnClick : function(J) {
						var I = this.viewDate;
						if (this.enabled == false)
							return;
						var E = J.target, H = mini.findParent(J.target,
								"mini-calendar-title");
						if (mini.findParent(E, "mini-calendar-monthNext")) {
							I.setMonth(I.getMonth() + 1);
							this.setViewDate(I)
						} else if (mini.findParent(E, "mini-calendar-yearNext")) {
							I.setFullYear(I.getFullYear() + 1);
							this.setViewDate(I)
						} else if (mini
								.findParent(E, "mini-calendar-monthPrev")) {
							I.setMonth(I.getMonth() - 1);
							this.setViewDate(I)
						} else if (mini.findParent(E, "mini-calendar-yearPrev")) {
							I.setFullYear(I.getFullYear() - 1);
							this.setViewDate(I)
						} else if (mini.findParent(E,
								"mini-calendar-tadayButton")) {
							var B = new Date();
							this.setViewDate(B);
							this.setSelectedDate(B);
							if (this.currentTime) {
								var A = new Date();
								this.setTime(A)
							}
							this._OnDateClick(B, "today")
						} else if (mini.findParent(E,
								"mini-calendar-clearButton")) {
							this.setSelectedDate(null);
							this.setTime(null);
							this._OnDateClick(null, "clear")
						} else if (mini.findParent(E, "mini-calendar-okButton"))
							this._OnDateClick(null, "ok");
						else if (H)
							this.showMenu(H);
						var G = mini.findParent(J.target, "mini-calendar-date");
						if (G && !mini.hasClass(G, "mini-calendar-disabled")) {
							var C = G.id.split("$"), D = parseInt(C[C.length - 1]);
							if (D == -1)
								return;
							var F = new Date(D);
							this._OnDateClick(F)
						}
					},
					__OnMouseDown : function(E) {
						if (this.enabled == false)
							return;
						var D = mini.findParent(E.target, "mini-calendar-date");
						if (D && !mini.hasClass(D, "mini-calendar-disabled")) {
							var A = D.id.split("$"), B = parseInt(A[A.length - 1]);
							if (B == -1)
								return;
							var C = new Date(B);
							this.setSelectedDate(C)
						}
					},
					__OnTimeChanged : function(A) {
						this.fire("timechanged");
						this._OnValueChanged()
					},
					__OnKeyDown : function(D) {
						if (this.enabled == false)
							return;
						var B = this.getSelectedDate();
						if (!B)
							B = new Date(this.viewDate.getTime());
						switch (D.keyCode) {
						case 27:
							break;
						case 13:
							break;
						case 37:
							B = mini.addDate(B, -1, "D");
							break;
						case 38:
							B = mini.addDate(B, -7, "D");
							break;
						case 39:
							B = mini.addDate(B, 1, "D");
							break;
						case 40:
							B = mini.addDate(B, 7, "D");
							break;
						default:
							break
						}
						var A = this;
						if (B.getMonth() != A.viewDate.getMonth()) {
							A.setViewDate(mini.cloneDate(B));
							A.focus()
						}
						var C = this.getDateEl(B);
						if (C && mini.hasClass(C, "mini-calendar-disabled"))
							return;
						A.setSelectedDate(B);
						if (D.keyCode == 37 || D.keyCode == 38
								|| D.keyCode == 39 || D.keyCode == 40)
							D.preventDefault()
					},
					_OnValueChanged : function() {
						this.fire("valuechanged")
					},
					getAttrs : function(A) {
						var B = mini.Calendar.superclass.getAttrs.call(this, A);
						mini._ParseString(A, B, [ "viewDate", "rows",
								"columns", "ondateclick", "ondrawdate",
								"ondatechanged", "timeFormat", "ontimechanged",
								"onvaluechanged" ]);
						mini
								._ParseBool(A, B, [ "multiSelect",
										"showHeader", "showFooter",
										"showWeekNumber", "showDaysHeader",
										"showMonthButtons", "showYearButtons",
										"showTodayButton", "showClearButton",
										"showTime", "showOkButton" ]);
						return B
					}
				});
mini.regClass(mini.Calendar, "calendar");
mini.ListBox = function() {
	mini.ListBox.superclass.constructor.call(this)
};
mini
		.extend(
				mini.ListBox,
				mini.ListControl,
				{
					formField : true,
					width : 200,
					columns : null,
					columnWidth : 80,
					showNullItem : false,
					nullItemText : "",
					showEmpty : false,
					emptyText : "",
					showCheckBox : false,
					showAllCheckBox : true,
					multiSelect : false,
					_itemCls : "mini-listbox-item",
					_itemHoverCls : "mini-listbox-item-hover",
					_itemSelectedCls : "mini-listbox-item-selected",
					uiCls : "mini-listbox",
					_create : function() {
						var A = this.el = document.createElement("div");
						this.el.className = "mini-listbox";
						this.el.innerHTML = "<div class=\"mini-listbox-border\"><div class=\"mini-listbox-header\"></div><div class=\"mini-listbox-view\"></div><input type=\"hidden\"/></div><div class=\"mini-errorIcon\"></div>";
						this._borderEl = this.el.firstChild;
						this._headerEl = this._borderEl.firstChild;
						this._viewEl = this._borderEl.childNodes[1];
						this._valueEl = this._borderEl.childNodes[2];
						this._errorIconEl = this.el.lastChild;
						this._scrollViewEl = this._viewEl
					},
					destroy : function(A) {
						if (this._viewEl) {
							mini.clearEvent(this._viewEl);
							this._viewEl = null
						}
						this._borderEl = null;
						this._headerEl = null;
						this._viewEl = null;
						this._valueEl = null;
						mini.ListBox.superclass.destroy.call(this, A)
					},
					_initEvents : function() {
						mini.ListBox.superclass._initEvents.call(this);
						mini._BindEvents(function() {
							mini_onOne(this._viewEl, "scroll", this.__OnScroll,
									this)
						}, this)
					},
					destroy : function(A) {
						if (this._viewEl)
							this._viewEl.onscroll = null;
						mini.ListBox.superclass.destroy.call(this, A)
					},
					setColumns : function(B) {
						if (!mini.isArray(B))
							B = [];
						this.columns = B;
						for ( var A = 0, F = this.columns.length; A < F; A++) {
							var D = this.columns[A];
							if (D.type) {
								if (!mini.isNull(D.header)
										&& typeof D.header !== "function")
									if (D.header.trim() == "")
										delete D.header;
								var E = mini._getColumn(D.type);
								if (E) {
									var G = mini.copyTo( {}, D);
									mini.copyTo(D, E);
									mini.copyTo(D, G)
								}
							}
							var C = parseInt(D.width);
							if (mini.isNumber(C) && String(C) == D.width)
								D.width = C + "px";
							if (mini.isNull(D.width))
								D.width = this.columnWidth + "px"
						}
						this.doUpdate()
					},
					getColumns : function() {
						return this.columns
					},
					doUpdate : function() {
						if (this._allowUpdate === false)
							return;
						var U = this.columns && this.columns.length > 0;
						if (U)
							mini.addClass(this.el, "mini-listbox-showColumns");
						else
							mini.removeClass(this.el,
									"mini-listbox-showColumns");
						this._headerEl.style.display = U ? "" : "none";
						var K = [];
						if (U) {
							K[K.length] = "<table class=\"mini-listbox-headerInner\" cellspacing=\"0\" cellpadding=\"0\"><tr>";
							var F = this.uid + "$ck$all";
							K[K.length] = "<td class=\"mini-listbox-checkbox\"><input type=\"checkbox\" id=\""
									+ F + "\"></td>";
							for ( var T = 0, B = this.columns.length; T < B; T++) {
								var D = this.columns[T], G = D.header;
								if (mini.isNull(G))
									G = "&nbsp;";
								var C = D.width;
								if (mini.isNumber(C))
									C = C + "px";
								K[K.length] = "<td class=\"";
								if (D.headerCls)
									K[K.length] = D.headerCls;
								K[K.length] = "\" style=\"";
								if (D.headerStyle)
									K[K.length] = D.headerStyle + ";";
								if (C)
									K[K.length] = "width:" + C + ";";
								if (D.headerAlign)
									K[K.length] = "text-align:" + D.headerAlign
											+ ";";
								K[K.length] = "\">";
								K[K.length] = G;
								K[K.length] = "</td>"
							}
							K[K.length] = "</tr></table>"
						}
						this._headerEl.innerHTML = K.join("");
						var K = [], R = this.data;
						K[K.length] = "<table class=\"mini-listbox-items\" cellspacing=\"0\" cellpadding=\"0\">";
						if (this.showEmpty && R.length == 0)
							K[K.length] = "<tr><td colspan=\"20\">"
									+ this.emptyText + "</td></tr>";
						else {
							this._doNullItem();
							for ( var M = 0, I = R.length; M < I; M++) {
								var A = R[M], O = -1, Q = " ", L = -1, P = " ";
								K[K.length] = "<tr id=\"";
								K[K.length] = this._createItemId(M);
								K[K.length] = "\" index=\"";
								K[K.length] = M;
								K[K.length] = "\" class=\"mini-listbox-item ";
								if (A.enabled === false)
									K[K.length] = " mini-disabled ";
								O = K.length;
								K[K.length] = Q;
								K[K.length] = "\" style=\"";
								L = K.length;
								K[K.length] = P;
								K[K.length] = "\">";
								var J = this._createCheckId(M), N = this.name, H = this
										.getItemValue(A), E = "";
								if (A.enabled === false)
									E = "disabled";
								K[K.length] = "<td class=\"mini-listbox-checkbox\"><input "
										+ E
										+ " id=\""
										+ J
										+ "\" type=\"checkbox\" ></td>";
								if (U) {
									for (T = 0, B = this.columns.length; T < B; T++) {
										var D = this.columns[T], V = this
												._OnDrawCell(A, M, D), C = D.width;
										if (typeof C == "number")
											C = C + "px";
										K[K.length] = "<td class=\"";
										if (V.cellCls)
											K[K.length] = V.cellCls;
										K[K.length] = "\" style=\"";
										if (V.cellStyle)
											K[K.length] = V.cellStyle + ";";
										if (C)
											K[K.length] = "width:" + C + ";";
										if (D.align)
											K[K.length] = "text-align:"
													+ D.align + ";";
										K[K.length] = "\">";
										K[K.length] = V.cellHtml;
										K[K.length] = "</td>";
										if (V.rowCls)
											Q = V.rowCls;
										if (V.rowStyle)
											P = V.rowStyle
									}
								} else {
									V = this._OnDrawCell(A, M, null);
									K[K.length] = "<td class=\"";
									if (V.cellCls)
										K[K.length] = V.cellCls;
									K[K.length] = "\" style=\"";
									if (V.cellStyle)
										K[K.length] = V.cellStyle;
									K[K.length] = "\">";
									K[K.length] = V.cellHtml;
									K[K.length] = "</td>";
									if (V.rowCls)
										Q = V.rowCls;
									if (V.rowStyle)
										P = V.rowStyle
								}
								K[O] = Q;
								K[L] = P;
								K[K.length] = "</tr>"
							}
						}
						K[K.length] = "</table>";
						var S = K.join("");
						this._viewEl.innerHTML = S;
						this._doSelects();
						this.doLayout()
					},
					doLayout : function() {
						if (!this.canLayout())
							return;
						if (this.columns && this.columns.length > 0)
							mini.addClass(this.el, "mini-listbox-showcolumns");
						else
							mini.removeClass(this.el,
									"mini-listbox-showcolumns");
						if (this.showCheckBox)
							mini.removeClass(this.el,
									"mini-listbox-hideCheckBox");
						else
							mini.addClass(this.el, "mini-listbox-hideCheckBox");
						var F = this.uid + "$ck$all", D = document
								.getElementById(F);
						if (D)
							D.style.display = this.showAllCheckBox ? ""
									: "none";
						var G = this.isAutoHeight();
						h = this.getHeight(true);
						B = this.getWidth(true);
						var E = B, H = this._viewEl;
						H.style.width = B + "px";
						if (!G) {
							var A = mini.getHeight(this._headerEl);
							h = h - A;
							H.style.height = h + "px"
						} else
							H.style.height = "auto";
						if (isIE) {
							var C = this._headerEl.firstChild, I = this._viewEl.firstChild;
							if (this._viewEl.offsetHeight >= this._viewEl.scrollHeight) {
								I.style.width = "100%";
								if (C)
									C.style.width = "100%"
							} else {
								var B = parseInt(I.parentNode.offsetWidth - 17)
										+ "px";
								I.style.width = B;
								if (C)
									C.style.width = B
							}
						}
						if (this._viewEl.offsetHeight < this._viewEl.scrollHeight)
							this._headerEl.style.width = (E - 17) + "px";
						else
							this._headerEl.style.width = "100%"
					},
					setShowCheckBox : function(A) {
						this.showCheckBox = A;
						this.doLayout()
					},
					getShowCheckBox : function() {
						return this.showCheckBox
					},
					setShowAllCheckBox : function(A) {
						this.showAllCheckBox = A;
						this.doLayout()
					},
					getShowAllCheckBox : function() {
						return this.showAllCheckBox
					},
					setShowNullItem : function(A) {
						if (this.showNullItem != A) {
							this.showNullItem = A;
							this._doNullItem();
							this.doUpdate()
						}
					},
					getShowNullItem : function() {
						return this.showNullItem
					},
					setNullItemText : function(A) {
						if (this.nullItemText != A) {
							this.nullItemText = A;
							this._doNullItem();
							this.doUpdate()
						}
					},
					getNullItemText : function() {
						return this.nullItemText
					},
					_doNullItem : function() {
						for ( var B = 0, C = this.data.length; B < C; B++) {
							var A = this.data[B];
							if (A.__NullItem) {
								this.data.removeAt(B);
								break
							}
						}
						if (this.showNullItem) {
							A = {
								__NullItem : true
							};
							A[this.textField] = "";
							A[this.valueField] = "";
							this.data.insert(0, A)
						}
					},
					_OnDrawCell : function(B, A, E) {
						var C = E ? B[E.field] : this.getItemText(B), G = {
							sender : this,
							index : A,
							rowIndex : A,
							record : B,
							item : B,
							column : E,
							field : E ? E.field : null,
							value : C,
							cellHtml : C,
							rowCls : null,
							cellCls : E ? (E.cellCls || "") : "",
							rowStyle : null,
							cellStyle : E ? (E.cellStyle || "") : ""
						}, F = this.columns && this.columns.length > 0;
						if (!F)
							if (A == 0 && this.showNullItem)
								G.cellHtml = this.nullItemText;
						G.cellHtml = mini.htmlEncode(G.cellHtml);
						if (E) {
							if (E.dateFormat)
								if (mini.isDate(G.value))
									G.cellHtml = mini.formatDate(C,
											E.dateFormat);
								else
									G.cellHtml = C;
							var D = E.renderer;
							if (D) {
								fn = typeof D == "function" ? D : window[D];
								if (fn)
									G.cellHtml = fn.call(E, G)
							}
						}
						this.fire("drawcell", G);
						if (G.cellHtml === null || G.cellHtml === undefined
								|| G.cellHtml === "")
							G.cellHtml = "&nbsp;";
						return G
					},
					__OnScroll : function(A) {
						this._headerEl.scrollLeft = this._viewEl.scrollLeft
					},
					__OnClick : function(E) {
						var C = this.uid + "$ck$all";
						if (E.target.id == C) {
							var B = document.getElementById(C);
							if (B) {
								var D = B.checked, A = this.getValue();
								if (D)
									this.selectAll();
								else
									this.deselectAll();
								this._OnSelectionChanged();
								if (A != this.getValue()) {
									this._OnValueChanged();
									this.fire("itemclick", {
										htmlEvent : E
									})
								}
							}
							return
						}
						this._fireEvent(E, "Click")
					},
					getAttrs : function(B) {
						var G = mini.ListBox.superclass.getAttrs.call(this, B);
						mini._ParseString(B, G,
								[ "nullItemText", "ondrawcell" ]);
						mini._ParseBool(B, G, [ "showCheckBox",
								"showAllCheckBox", "showNullItem" ]);
						if (B.nodeName.toLowerCase() != "select") {
							var E = mini.getChildNodes(B);
							for ( var A = 0, F = E.length; A < F; A++) {
								var D = E[A], C = jQuery(D).attr("property");
								if (!C)
									continue;
								C = C.toLowerCase();
								if (C == "columns")
									G.columns = mini._ParseColumns(D);
								else if (C == "data")
									G.data = D.innerHTML
							}
						}
						return G
					}
				});
mini.regClass(mini.ListBox, "listbox");
mini.CheckBoxList = function() {
	mini.CheckBoxList.superclass.constructor.call(this)
};
mini
		.extend(
				mini.CheckBoxList,
				mini.ListControl,
				{
					formField : true,
					multiSelect : true,
					repeatItems : 0,
					repeatLayout : "none",
					repeatDirection : "horizontal",
					_itemCls : "mini-checkboxlist-item",
					_itemHoverCls : "mini-checkboxlist-item-hover",
					_itemSelectedCls : "mini-checkboxlist-item-selected",
					_tableCls : "mini-checkboxlist-table",
					_tdCls : "mini-checkboxlist-td",
					_checkType : "checkbox",
					uiCls : "mini-checkboxlist",
					_create : function() {
						var A = this.el = document.createElement("div");
						this.el.className = this.uiCls;
						this.el.innerHTML = "<div class=\"mini-list-inner\"></div><div class=\"mini-errorIcon\"></div><input type=\"hidden\" />";
						this._innerEl = this.el.firstChild;
						this._valueEl = this.el.lastChild;
						this._errorIconEl = this.el.childNodes[1]
					},
					_getRepeatTable : function() {
						var D = [];
						if (this.repeatItems > 0) {
							if (this.repeatDirection == "horizontal") {
								var F = [];
								for ( var E = 0, G = this.data.length; E < G; E++) {
									var C = this.data[E];
									if (F.length == this.repeatItems) {
										D.push(F);
										F = []
									}
									F.push(C)
								}
								D.push(F)
							} else {
								var B = this.repeatItems > this.data.length ? this.data.length
										: this.repeatItems;
								for (E = 0, G = B; E < G; E++)
									D.push( []);
								for (E = 0, G = this.data.length; E < G; E++) {
									var C = this.data[E], A = E
											% this.repeatItems;
									D[A].push(C)
								}
							}
						} else
							D = [ this.data.clone() ];
						return D
					},
					doUpdate : function() {
						var F = this.data, I = "";
						for ( var C = 0, H = F.length; C < H; C++) {
							var B = F[C];
							B._i = C
						}
						if (this.repeatLayout == "flow") {
							var A = this._getRepeatTable();
							for (C = 0, H = A.length; C < H; C++) {
								var E = A[C];
								for ( var G = 0, D = E.length; G < D; G++) {
									B = E[G];
									I += this._createItemHtml(B, B._i)
								}
								if (C != H - 1)
									I += "<br/>"
							}
						} else if (this.repeatLayout == "table") {
							A = this._getRepeatTable();
							I += "<table class=\"" + this._tableCls
									+ "\" cellpadding=\"0\" cellspacing=\"1\">";
							for (C = 0, H = A.length; C < H; C++) {
								E = A[C];
								I += "<tr>";
								for (G = 0, D = E.length; G < D; G++) {
									B = E[G];
									I += "<td class=\"" + this._tdCls + "\">";
									I += this._createItemHtml(B, B._i);
									I += "</td>"
								}
								I += "</tr>"
							}
							I += "</table>"
						} else
							for (C = 0, H = F.length; C < H; C++) {
								B = F[C];
								I += this._createItemHtml(B, C)
							}
						this._innerEl.innerHTML = I;
						for (C = 0, H = F.length; C < H; C++) {
							B = F[C];
							delete B._i
						}
					},
					_createItemHtml : function(B, A) {
						var I = this._OnDrawItem(B, A), H = this
								._createItemId(A), C = this._createCheckId(A), F = this
								.getItemValue(B), D = "", G = "<div id=\"" + H
								+ "\" index=\"" + A + "\" class=\""
								+ this._itemCls + " ";
						if (B.enabled === false) {
							G += " mini-disabled ";
							D = "disabled"
						}
						var E = "onclick=\"return false\"";
						if (isChrome)
							E = "onmousedown=\"this._checked = this.checked;\" onclick=\"this.checked = this._checked\"";
						G += I.itemCls + "\" style=\"" + I.itemStyle
								+ "\"><input " + E + " " + D + " value=\"" + F
								+ "\" id=\"" + C + "\" type=\""
								+ this._checkType + "\" /><label for=\"" + C
								+ "\" onclick=\"return false;\">";
						G += I.itemHtml + "</label></div>";
						return G
					},
					_OnDrawItem : function(B, A) {
						var C = this.getItemText(B), D = {
							index : A,
							item : B,
							itemHtml : C,
							itemCls : "",
							itemStyle : ""
						};
						this.fire("drawitem", D);
						if (D.itemHtml === null || D.itemHtml === undefined)
							D.itemHtml = "";
						return D
					},
					setRepeatItems : function(A) {
						A = parseInt(A);
						if (isNaN(A))
							A = 0;
						if (this.repeatItems != A) {
							this.repeatItems = A;
							this.doUpdate()
						}
					},
					getRepeatItems : function() {
						return this.repeatItems
					},
					setRepeatLayout : function(A) {
						if (A != "flow" && A != "table")
							A = "none";
						if (this.repeatLayout != A) {
							this.repeatLayout = A;
							this.doUpdate()
						}
					},
					getRepeatLayout : function() {
						return this.repeatLayout
					},
					setRepeatDirection : function(A) {
						if (A != "vertical")
							A = "horizontal";
						if (this.repeatDirection != A) {
							this.repeatDirection = A;
							this.doUpdate()
						}
					},
					getRepeatDirection : function() {
						return this.repeatDirection
					},
					getAttrs : function(B) {
						var F = mini.CheckBoxList.superclass.getAttrs.call(
								this, B), E = jQuery(B);
						mini._ParseString(B, F, [ "ondrawitem" ]);
						var A = parseInt(E.attr("repeatItems"));
						if (!isNaN(A))
							F.repeatItems = A;
						var D = E.attr("repeatLayout");
						if (D)
							F.repeatLayout = D;
						var C = E.attr("repeatDirection");
						if (C)
							F.repeatDirection = C;
						return F
					}
				});
mini.regClass(mini.CheckBoxList, "checkboxlist");
mini.RadioButtonList = function() {
	mini.RadioButtonList.superclass.constructor.call(this)
};
mini.extend(mini.RadioButtonList, mini.CheckBoxList, {
	multiSelect : false,
	_itemCls : "mini-radiobuttonlist-item",
	_itemHoverCls : "mini-radiobuttonlist-item-hover",
	_itemSelectedCls : "mini-radiobuttonlist-item-selected",
	_tableCls : "mini-radiobuttonlist-table",
	_tdCls : "mini-radiobuttonlist-td",
	_checkType : "radio",
	uiCls : "mini-radiobuttonlist"
});
mini.regClass(mini.RadioButtonList, "radiobuttonlist");
mini.TreeSelect = function() {
	this.data = [];
	mini.TreeSelect.superclass.constructor.call(this)
};
mini
		.extend(
				mini.TreeSelect,
				mini.PopupEdit,
				{
					valueFromSelect : false,
					text : "",
					value : "",
					autoCheckParent : false,
					expandOnLoad : false,
					valueField : "id",
					textField : "text",
					nodesField : "children",
					delimiter : ",",
					multiSelect : false,
					data : [],
					url : "",
					allowInput : false,
					showTreeIcon : false,
					showTreeLines : true,
					resultAsTree : false,
					parentField : "pid",
					checkRecursive : false,
					showFolderCheckBox : false,
					popupHeight : 200,
					popupWidth : "100%",
					popupMaxHeight : 250,
					popupMinWidth : 100,
					set : function(D) {
						if (typeof D == "string")
							return this;
						var A = D.value;
						delete D.value;
						var B = D.text;
						delete D.text;
						var E = D.url;
						delete D.url;
						var C = D.data;
						delete D.data;
						mini.TreeSelect.superclass.set.call(this, D);
						if (!mini.isNull(C))
							this.setData(C);
						if (!mini.isNull(E))
							this.setUrl(E);
						if (!mini.isNull(A))
							this.setValue(A);
						if (!mini.isNull(B))
							this.setText(B);
						return this
					},
					uiCls : "mini-treeselect",
					_createPopup : function() {
						mini.TreeSelect.superclass._createPopup.call(this);
						this.tree = new mini.Tree();
						this.tree.setShowTreeIcon(true);
						this.tree
								.setStyle("border:0;width:100%;height:100%;overflow:hidden;");
						this.tree.setResultAsTree(this.resultAsTree);
						this.tree.render(this.popup._contentEl);
						this.tree.setCheckRecursive(this.checkRecursive);
						this.tree
								.setShowFolderCheckBox(this.showFolderCheckBox);
						this.tree.on("nodeclick", this.__OnNodeClick, this);
						this.tree
								.on("nodecheck", this.__OnCheckedChanged, this);
						this.tree.on("expand", this.__OnTreeExpand, this);
						this.tree.on("collapse", this.__OnTreeCollapse, this);
						this.tree.on("beforenodecheck",
								this.__OnTreeBeforeNodeCheck, this);
						this.tree.on("beforenodeselect",
								this.__OnTreeBeforeNodeSelect, this);
						this.tree.allowAnim = false;
						var A = this;
						this.tree.on("beforeload", function(B) {
							A.fire("beforeload", B)
						}, this);
						this.tree.on("load", function(B) {
							A.fire("load", B)
						}, this);
						this.tree.on("loaderror", function(B) {
							A.fire("loaderror", B)
						}, this)
					},
					__OnTreeBeforeNodeCheck : function(A) {
						A.tree = A.sender;
						this.fire("beforenodecheck", A)
					},
					__OnTreeBeforeNodeSelect : function(A) {
						A.tree = A.sender;
						this.fire("beforenodeselect", A)
					},
					__OnTreeExpand : function(A) {
					},
					__OnTreeCollapse : function(A) {
					},
					getSelectedNode : function() {
						return this.tree.getSelectedNode()
					},
					getSelectedNodes : function() {
						return this.tree.getSelectedNodes()
					},
					getParentNode : function(A) {
						return this.tree.getParentNode(A)
					},
					getChildNodes : function(A) {
						return this.tree.getChildNodes(A)
					},
					showPopup : function() {
						var B = {
							cancel : false
						};
						this.fire("beforeshowpopup", B);
						if (B.cancel == true)
							return;
						var A = this.popup.el.style.height;
						mini.TreeSelect.superclass.showPopup.call(this);
						this.tree.setValue(this.value)
					},
					__OnPopupHide : function(A) {
						this.tree.clearFilter();
						this.fire("hidepopup")
					},
					getItem : function(A) {
						return typeof A == "object" ? A : this.data[A]
					},
					indexOf : function(A) {
						return this.data.indexOf(A)
					},
					getAt : function(A) {
						return this.data[A]
					},
					load : function(A) {
						this.tree.load(A)
					},
					setData : function(A) {
						this.tree.setData(A);
						this.data = this.tree.data
					},
					getData : function() {
						return this.data
					},
					setUrl : function(A) {
						this.getPopup();
						this.tree.setUrl(A);
						this.url = this.tree.url
					},
					getUrl : function() {
						return this.url
					},
					setTextField : function(A) {
						if (this.tree)
							this.tree.setTextField(A);
						this.textField = A
					},
					getTextField : function() {
						return this.textField
					},
					setNodesField : function(A) {
						if (this.tree)
							this.tree.setNodesField(A);
						this.nodesField = A
					},
					getNodesField : function() {
						return this.nodesField
					},
					setValue : function(A) {
						var B = this.tree.getValueAndText(A);
						if (B[1] == "" && !this.valueFromSelect) {
							B[0] = A;
							B[1] = A
						}
						this.value = A;
						this._valueEl.value = A;
						this.text = this._textEl.value = B[1];
						this._doEmpty()
					},
					setMultiSelect : function(A) {
						if (this.multiSelect != A) {
							this.multiSelect = A;
							this.tree.setShowCheckBox(A);
							this.tree.setAllowSelect(!A);
							this.tree.setEnableHotTrack(!A)
						}
					},
					getMultiSelect : function() {
						return this.multiSelect
					},
					__OnNodeClick : function(E) {
						if (this.multiSelect)
							return;
						var C = this.tree.getSelectedNode(), B = this.tree
								.getValueAndText(C), D = B[0], A = this
								.getValue();
						this.setValue(D);
						if (A != this.getValue())
							this._OnValueChanged();
						this.hidePopup();
						this.focus();
						this.fire("nodeclick", {
							node : E.node
						})
					},
					__OnCheckedChanged : function(C) {
						if (!this.multiSelect)
							return;
						var B = this.tree.getValue(), A = this.getValue();
						this.setValue(B);
						if (A != this.getValue())
							this._OnValueChanged()
					},
					__OnInputKeyDown : function(B) {
						this.fire("keydown", {
							htmlEvent : B
						});
						if (B.keyCode == 8
								&& (this.isReadOnly() || this.allowInput == false))
							return false;
						if (B.keyCode == 9) {
							this.hidePopup();
							return
						}
						if (this.isReadOnly())
							return;
						switch (B.keyCode) {
						case 27:
							if (this.isShowPopup())
								B.stopPropagation();
							this.hidePopup();
							this.focus();
							break;
						case 13:
							break;
						case 37:
							break;
						case 38:
							B.preventDefault();
							break;
						case 39:
							break;
						case 40:
							B.preventDefault();
							this.showPopup();
							break;
						default:
							var A = this;
							setTimeout(function() {
								A._doQuery()
							}, 10);
							break
						}
					},
					_doQuery : function() {
						var B = this.textField, A = this._textEl.value
								.toLowerCase();
						this.tree.filter(function(D) {
							var C = String(D[B] ? D[B] : "").toLowerCase();
							if (C.indexOf(A) != -1)
								return true;
							else
								return false
						});
						this.tree.expandAll();
						this.showPopup()
					},
					setCheckRecursive : function(A) {
						this.checkRecursive = A;
						if (this.tree)
							this.tree.setCheckRecursive(A)
					},
					getCheckRecursive : function() {
						return this.checkRecursive
					},
					setResultAsTree : function(A) {
						this.resultAsTree = A;
						if (this.tree)
							this.tree.setResultAsTree(A)
					},
					getResultAsTree : function() {
						return this.resultAsTree
					},
					setParentField : function(A) {
						this.parentField = A;
						if (this.tree)
							this.tree.setParentField(A)
					},
					getParentField : function() {
						return this.parentField
					},
					setValueField : function(A) {
						if (this.tree)
							this.tree.setIdField(A);
						this.valueField = A
					},
					getValueField : function() {
						return this.valueField
					},
					setShowTreeIcon : function(A) {
						this.showTreeIcon = A;
						if (this.tree)
							this.tree.setShowTreeIcon(A)
					},
					getShowTreeIcon : function() {
						return this.showTreeIcon
					},
					setShowTreeLines : function(A) {
						this.showTreeLines = A;
						if (this.tree)
							this.tree.setShowTreeLines(A)
					},
					getShowTreeLines : function() {
						return this.showTreeLines
					},
					setShowFolderCheckBox : function(A) {
						this.showFolderCheckBox = A;
						if (this.tree)
							this.tree.setShowFolderCheckBox(A)
					},
					getShowFolderCheckBox : function() {
						return this.showFolderCheckBox
					},
					setAutoCheckParent : function(A) {
						this.autoCheckParent = A;
						if (this.tree)
							this.tree.setAutoCheckParent(A)
					},
					getAutoCheckParent : function() {
						return this.autoCheckParent
					},
					setExpandOnLoad : function(A) {
						this.expandOnLoad = A;
						if (this.tree)
							this.tree.setExpandOnLoad(A)
					},
					getExpandOnLoad : function() {
						return this.expandOnLoad
					},
					setValueFromSelect : function(A) {
						this.valueFromSelect = A
					},
					getValueFromSelect : function() {
						return this.valueFromSelect
					},
					setAjaxData : function(A) {
						this.ajaxData = A;
						this.tree.setAjaxData(A)
					},
					getAttrs : function(B) {
						var C = mini.ComboBox.superclass.getAttrs.call(this, B);
						mini._ParseString(B, C, [ "url", "data", "textField",
								"valueField", "nodesField", "parentField",
								"onbeforenodecheck", "onbeforenodeselect",
								"expandOnLoad", "onnodeclick", "onbeforeload",
								"onload", "onloaderror" ]);
						mini._ParseBool(B, C, [ "multiSelect", "resultAsTree",
								"checkRecursive", "showTreeIcon",
								"showTreeLines", "showFolderCheckBox",
								"autoCheckParent", "valueFromSelect" ]);
						if (C.expandOnLoad) {
							var A = parseInt(C.expandOnLoad);
							if (mini.isNumber(A))
								C.expandOnLoad = A;
							else
								C.expandOnLoad = C.expandOnLoad == "true" ? true
										: false
						}
						return C
					}
				});
mini.regClass(mini.TreeSelect, "TreeSelect");
mini.Spinner = function() {
	mini.Spinner.superclass.constructor.call(this);
	this.setValue(this.minValue)
};
mini
		.extend(
				mini.Spinner,
				mini.ButtonEdit,
				{
					value : 0,
					minValue : 0,
					maxValue : 100,
					increment : 1,
					decimalPlaces : 0,
					changeOnMousewheel : false,
					set : function(B) {
						if (typeof B == "string")
							return this;
						var A = B.value;
						delete B.value;
						mini.Spinner.superclass.set.call(this, B);
						if (!mini.isNull(A))
							this.setValue(A);
						return this
					},
					uiCls : "mini-spinner",
					_getButtonHtml : function() {
						var A = "onmouseover=\"mini.addClass(this, '"
								+ this._buttonHoverCls + "');\" "
								+ "onmouseout=\"mini.removeClass(this, '"
								+ this._buttonHoverCls + "');\"";
						return "<span class=\"mini-buttonedit-button\" "
								+ A
								+ "><span class=\"mini-buttonedit-up\"><span></span></span><span class=\"mini-buttonedit-down\"><span></span></span></span>"
					},
					_initEvents : function() {
						mini.Spinner.superclass._initEvents.call(this);
						mini._BindEvents(function() {
							this.on("buttonmousedown",
									this.__OnButtonMouseDown, this);
							mini.on(this.el, "mousewheel", this.__OnMousewheel,
									this)
						}, this)
					},
					_ValueLimit : function() {
						if (this.minValue > this.maxValue)
							this.maxValue = this.minValue + 100;
						if (this.value < this.minValue)
							this.setValue(this.minValue);
						if (this.value > this.maxValue)
							this.setValue(this.maxValue)
					},
					setValue : function(A) {
						A = parseFloat(A);
						if (isNaN(A))
							A = this.minValue;
						A = parseFloat(A.toFixed(this.decimalPlaces));
						if (this.value != A) {
							this.value = A;
							this._ValueLimit();
							this.text = this._textEl.value = this._valueEl.value = this
									.getFormValue()
						} else
							this.text = this._textEl.value = this
									.getFormValue()
					},
					setMaxValue : function(A) {
						A = parseFloat(A);
						if (isNaN(A))
							return;
						A = parseFloat(A.toFixed(this.decimalPlaces));
						if (this.maxValue != A) {
							this.maxValue = A;
							this._ValueLimit()
						}
					},
					getMaxValue : function(A) {
						return this.maxValue
					},
					setMinValue : function(A) {
						A = parseFloat(A);
						if (isNaN(A))
							return;
						A = parseFloat(A.toFixed(this.decimalPlaces));
						if (this.minValue != A) {
							this.minValue = A;
							this._ValueLimit()
						}
					},
					getMinValue : function(A) {
						return this.minValue
					},
					setIncrement : function(A) {
						A = parseFloat(A);
						if (isNaN(A))
							return;
						if (this.increment != A)
							this.increment = A
					},
					getIncrement : function(A) {
						return this.increment
					},
					setDecimalPlaces : function(A) {
						A = parseInt(A);
						if (isNaN(A) || A < 0)
							return;
						this.decimalPlaces = A
					},
					getDecimalPlaces : function(A) {
						return this.decimalPlaces
					},
					setChangeOnMousewheel : function(A) {
						this.changeOnMousewheel = A
					},
					getChangeOnMousewheel : function(A) {
						return this.changeOnMousewheel
					},
					_SpinTimer : null,
					_StartSpin : function(F, D, E) {
						this._StopSpin();
						this.setValue(this.value + F);
						var C = this, B = E, A = new Date();
						this._SpinTimer = setInterval(function() {
							C.setValue(C.value + F);
							C._OnValueChanged();
							E--;
							if (E == 0 && D > 50)
								C._StartSpin(F, D - 100, B + 3);
							var G = new Date();
							if (G - A > 500)
								C._StopSpin();
							A = G
						}, D);
						mini.on(document, "mouseup", this._OnDocumentMouseUp,
								this)
					},
					_StopSpin : function() {
						clearInterval(this._SpinTimer);
						this._SpinTimer = null
					},
					__OnButtonMouseDown : function(A) {
						this._DownValue = this.getFormValue();
						this.__OnInputTextChanged();
						if (A.spinType == "up")
							this._StartSpin(this.increment, 230, 2);
						else
							this._StartSpin(-this.increment, 230, 2)
					},
					__OnInputKeyDown : function(B) {
						mini.Spinner.superclass.__OnInputKeyDown.call(this, B);
						var A = mini.Keyboard;
						switch (B.keyCode) {
						case A.Top:
							this.setValue(this.value + this.increment);
							this._OnValueChanged();
							break;
						case A.Bottom:
							this.setValue(this.value - this.increment);
							this._OnValueChanged();
							break
						}
					},
					__OnMousewheel : function(C) {
						if (this.isReadOnly())
							return;
						if (this.changeOnMousewheel == false)
							return;
						var A = C.wheelDelta;
						if (mini.isNull(A))
							A = -C.detail * 24;
						var B = this.increment;
						if (A < 0)
							B = -B;
						this.setValue(this.value + B);
						this._OnValueChanged();
						return false
					},
					_OnDocumentMouseUp : function(A) {
						this._StopSpin();
						mini.un(document, "mouseup", this._OnDocumentMouseUp,
								this);
						if (this._DownValue != this.getFormValue())
							this._OnValueChanged()
					},
					__OnInputTextChanged : function(C) {
						var B = this.getValue(), A = parseFloat(this._textEl.value);
						this.setValue(A);
						if (B != this.getValue())
							this._OnValueChanged()
					},
					getAttrs : function(A) {
						var B = mini.Spinner.superclass.getAttrs.call(this, A);
						mini._ParseString(A, B, [ "minValue", "maxValue",
								"increment", "decimalPlaces",
								"changeOnMousewheel" ]);
						return B
					}
				});
mini.regClass(mini.Spinner, "spinner");
mini.TimeSpinner = function() {
	mini.TimeSpinner.superclass.constructor.call(this);
	this.setValue("00:00:00")
};
mini
		.extend(
				mini.TimeSpinner,
				mini.ButtonEdit,
				{
					value : null,
					format : "H:mm:ss",
					uiCls : "mini-timespinner",
					_getButtonHtml : function() {
						var A = "onmouseover=\"mini.addClass(this, '"
								+ this._buttonHoverCls + "');\" "
								+ "onmouseout=\"mini.removeClass(this, '"
								+ this._buttonHoverCls + "');\"";
						return "<span class=\"mini-buttonedit-button\" "
								+ A
								+ "><span class=\"mini-buttonedit-up\"><span></span></span><span class=\"mini-buttonedit-down\"><span></span></span></span>"
					},
					_initEvents : function() {
						mini.TimeSpinner.superclass._initEvents.call(this);
						mini._BindEvents(function() {
							this.on("buttonmousedown",
									this.__OnButtonMouseDown, this);
							mini.on(this.el, "mousewheel", this.__OnMousewheel,
									this);
							mini.on(this._textEl, "keydown", this.__OnKeyDown,
									this)
						}, this)
					},
					setFormat : function(A) {
						if (typeof A != "string")
							return;
						var B = [ "H:mm:ss", "HH:mm:ss", "H:mm", "HH:mm", "H",
								"HH", "mm:ss" ];
						if (this.format != A) {
							this.format = A;
							this.text = this._textEl.value = this
									.getFormattedValue()
						}
					},
					getFormat : function() {
						return this.format
					},
					setValue : function(A) {
						A = mini.parseTime(A, this.format);
						if (!A)
							A = mini.parseTime("00:00:00", this.format);
						if (mini.isDate(A))
							A = new Date(A.getTime());
						if (mini.formatDate(this.value, "H:mm:ss") != mini
								.formatDate(A, "H:mm:ss")) {
							this.value = A;
							this.text = this._textEl.value = this
									.getFormattedValue();
							this._valueEl.value = this.getFormValue()
						}
					},
					getValue : function() {
						return this.value == null ? null : new Date(this.value
								.getTime())
					},
					getFormValue : function() {
						if (!this.value)
							return "";
						return mini.formatDate(this.value, "H:mm:ss")
					},
					getFormattedValue : function() {
						if (!this.value)
							return "";
						return mini.formatDate(this.value, this.format)
					},
					_ChangeValue : function(F, E) {
						var A = this.getValue();
						if (A)
							switch (E) {
							case "hours":
								var C = A.getHours() + F;
								if (C > 23)
									C = 23;
								if (C < 0)
									C = 0;
								A.setHours(C);
								break;
							case "minutes":
								var D = A.getMinutes() + F;
								if (D > 59)
									D = 59;
								if (D < 0)
									D = 0;
								A.setMinutes(D);
								break;
							case "seconds":
								var B = A.getSeconds() + F;
								if (B > 59)
									B = 59;
								if (B < 0)
									B = 0;
								A.setSeconds(B);
								break
							}
						else
							A = "00:00:00";
						this.setValue(A)
					},
					_SpinTimer : null,
					_StartSpin : function(F, D, E) {
						this._StopSpin();
						this._ChangeValue(F, this._timeType);
						var C = this, B = E, A = new Date();
						this._SpinTimer = setInterval(function() {
							C._ChangeValue(F, C._timeType);
							E--;
							if (E == 0 && D > 50)
								C._StartSpin(F, D - 100, B + 3);
							var G = new Date();
							if (G - A > 500)
								C._StopSpin();
							A = G
						}, D);
						mini.on(document, "mouseup", this._OnDocumentMouseUp,
								this)
					},
					_StopSpin : function() {
						clearInterval(this._SpinTimer);
						this._SpinTimer = null
					},
					__OnButtonMouseDown : function(A) {
						this._DownValue = this.getFormValue();
						this._timeType = "hours";
						if (A.spinType == "up")
							this._StartSpin(1, 230, 2);
						else
							this._StartSpin(-1, 230, 2)
					},
					_OnDocumentMouseUp : function(A) {
						this._StopSpin();
						mini.un(document, "mouseup", this._OnDocumentMouseUp,
								this);
						if (this._DownValue != this.getFormValue())
							this._OnValueChanged()
					},
					__OnInputTextChanged : function(B) {
						var A = this.getFormValue();
						this.setValue(this._textEl.value);
						if (A != this.getFormValue())
							this._OnValueChanged()
					},
					getAttrs : function(A) {
						var B = mini.TimeSpinner.superclass.getAttrs.call(this,
								A);
						mini._ParseString(A, B, [ "format" ]);
						return B
					}
				});
mini.regClass(mini.TimeSpinner, "timespinner");
mini.HtmlFile = function() {
	mini.HtmlFile.superclass.constructor.call(this);
	this.on("validation", this.__OnValidation, this)
};
mini
		.extend(
				mini.HtmlFile,
				mini.ButtonEdit,
				{
					width : 180,
					buttonText : "\u6d4f\u89c8...",
					_buttonWidth : 56,
					limitType : "",
					limitTypeErrorText : "\u4e0a\u4f20\u6587\u4ef6\u683c\u5f0f\u4e3a\uff1a",
					allowInput : false,
					readOnly : true,
					_cellSpacing : 0,
					uiCls : "mini-htmlfile",
					_create : function() {
						mini.HtmlFile.superclass._create.call(this);
						this._fileEl = mini.append(this.el,
								"<input type=\"file\" hideFocus class=\"mini-htmlfile-file\" name=\""
										+ this.name
										+ "\" ContentEditable=false/>");
						mini.on(this._borderEl, "mousemove",
								this.__OnMouseMove, this);
						mini.on(this._fileEl, "change", this.__OnFileChange,
								this)
					},
					_getButtonHtml : function() {
						var A = "onmouseover=\"mini.addClass(this, '"
								+ this._buttonHoverCls + "');\" "
								+ "onmouseout=\"mini.removeClass(this, '"
								+ this._buttonHoverCls + "');\"";
						return "<span class=\"mini-buttonedit-button\" " + A
								+ ">" + this.buttonText + "</span>"
					},
					__OnFileChange : function(A) {
						this.value = this._textEl.value = this._fileEl.value;
						this._OnValueChanged();
						A = {
							htmlEvent : A
						};
						this.fire("fileselect", A)
					},
					__OnMouseMove : function(D) {
						var C = D.pageX, B = D.pageY, A = mini.getBox(this.el);
						C = (C - A.x - 5);
						B = (B - A.y - 5);
						if (this.enabled == false) {
							C = -20;
							B = -20
						}
						this._fileEl.style.display = "";
						this._fileEl.style.left = C + "px";
						this._fileEl.style.top = B + "px"
					},
					__OnValidation : function(D) {
						if (!this.limitType)
							return;
						var C = D.value.split("."), A = "*." + C[C.length - 1], B = this.limitType
								.split(";");
						if (B.length > 0 && B.indexOf(A) == -1) {
							D.errorText = this.limitTypeErrorText
									+ this.limitType;
							D.isValid = false
						}
					},
					setName : function(A) {
						this.name = A;
						mini.setAttr(this._fileEl, "name", this.name)
					},
					getValue : function() {
						return this._textEl.value
					},
					setButtonText : function(A) {
						this.buttonText = A
					},
					getButtonText : function() {
						return this.buttonText
					},
					setLimitType : function(A) {
						this.limitType = A
					},
					getLimitType : function() {
						return this.limitType
					},
					getAttrs : function(A) {
						var B = mini.HtmlFile.superclass.getAttrs.call(this, A);
						mini._ParseString(A, B, [ "limitType", "buttonText",
								"limitTypeErrorText" ]);
						return B
					}
				});
mini.regClass(mini.HtmlFile, "htmlfile");
mini.FileUpload = function(A) {
	mini.FileUpload.superclass.constructor.call(this, A);
	this.on("validation", this.__OnValidation, this)
};
mini.extend(mini.FileUpload, mini.ButtonEdit, {
	width : 180,
	buttonText : "\u6d4f\u89c8...",
	_buttonWidth : 56,
	limitTypeErrorText : "\u4e0a\u4f20\u6587\u4ef6\u683c\u5f0f\u4e3a\uff1a",
	readOnly : true,
	_cellSpacing : 0,
	limitSize : "",
	limitType : "",
	typesDescription : "\u4e0a\u4f20\u6587\u4ef6\u683c\u5f0f",
	uploadLimit : 0,
	queueLimit : "",
	flashUrl : "",
	uploadUrl : "",
	uploadOnSelect : false,
	uiCls : "mini-fileupload",
	_create : function() {
		mini.FileUpload.superclass._create.call(this);
		mini.addClass(this.el, "mini-htmlfile");
		this._uploadId = this.uid + "$button_placeholder";
		this._fileEl = mini.append(this.el, "<span id=\"" + this._uploadId
				+ "\"></span>");
		this.uploadEl = this._fileEl;
		mini.on(this._borderEl, "mousemove", this.__OnMouseMove, this)
	},
	_getButtonHtml : function() {
		var A = "onmouseover=\"mini.addClass(this, '" + this._buttonHoverCls
				+ "');\" " + "onmouseout=\"mini.removeClass(this, '"
				+ this._buttonHoverCls + "');\"";
		return "<span class=\"mini-buttonedit-button\" " + A + ">"
				+ this.buttonText + "</span>"
	},
	destroy : function(A) {
		if (this._innerEl) {
			mini.clearEvent(this._innerEl);
			this._innerEl = null
		}
		mini.FileUpload.superclass.destroy.call(this, A)
	},
	__OnMouseMove : function(C) {
		if (this.enabled == false)
			return;
		var A = this;
		if (!this.swfUpload) {
			var D = new SWFUpload( {
				file_post_name : this.name,
				upload_url : A.uploadUrl,
				flash_url : A.flashUrl,
				file_size_limit : A.limitSize,
				file_types : A.limitType,
				file_types_description : A.typesDescription,
				file_upload_limit : parseInt(A.uploadLimit),
				file_queue_limit : A.queueLimit,
				file_queued_handler : mini.createDelegate(
						this.__on_file_queued, this),
				upload_error_handler : mini.createDelegate(
						this.__on_upload_error, this),
				upload_success_handler : mini.createDelegate(
						this.__on_upload_success, this),
				upload_complete_handler : mini.createDelegate(
						this.__on_upload_complete, this),
				button_placeholder_id : this._uploadId,
				button_width : 1000,
				button_height : 50,
				button_window_mode : "transparent",
				debug : false
			});
			D.flashReady();
			this.swfUpload = D;
			var B = this.swfUpload.movieElement;
			B.style.zIndex = 1000;
			B.style.position = "absolute";
			B.style.left = "0px";
			B.style.top = "0px";
			B.style.width = "100%";
			B.style.height = "50px"
		}
	},
	setLimitSize : function(A) {
		this.limitSize = A
	},
	setLimitType : function(A) {
		this.limitType = A
	},
	setTypesDescription : function(A) {
		this.typesDescription = A
	},
	setUploadLimit : function(A) {
		this.uploadLimit = A
	},
	setQueueLimit : function(A) {
		this.queueLimit = A
	},
	setFlashUrl : function(A) {
		this.flashUrl = A
	},
	setUploadUrl : function(A) {
		if (this.swfUpload)
			this.swfUpload.setUploadURL(A);
		this.uploadUrl = A
	},
	setName : function(A) {
		this.name = A
	},
	startUpload : function(A) {
		if (this.swfUpload)
			this.swfUpload.startUpload()
	},
	__on_file_queued : function(A) {
		var B = {
			file : A
		};
		if (this.uploadOnSelect)
			this.swfUpload.startUpload();
		this.setText(A.name);
		this.fire("fileselect", B)
	},
	__on_upload_success : function(B, A) {
		var C = {
			file : B,
			serverData : A
		};
		this.fire("uploadsuccess", C)
	},
	__on_upload_error : function(A) {
		var B = {
			file : A
		};
		this.fire("uploaderror", B)
	},
	__on_upload_complete : function(A) {
		this.fire("uploadcomplete", A)
	},
	__fileError : function() {
	},
	getAttrs : function(A) {
		var B = mini.FileUpload.superclass.getAttrs.call(this, A);
		mini._ParseString(A, B, [ "limitType", "limitSize", "flashUrl",
				"uploadUrl", "uploadLimit", "onuploadsuccess", "onuploaderror",
				"onuploadcomplete", "onfileselect" ]);
		mini._ParseBool(A, B, [ "uploadOnSelect" ]);
		return B
	}
});
mini.regClass(mini.FileUpload, "fileupload");
mini.Lookup = function() {
	this.data = [];
	mini.Lookup.superclass.constructor.call(this);
	mini.on(this._textEl, "mouseup", this.__OnMouseUp, this);
	this.on("showpopup", this.__OnShowPopup, this)
};
mini.extend(mini.Lookup, mini.PopupEdit, {
	allowInput : true,
	valueField : "id",
	textField : "text",
	delimiter : ",",
	multiSelect : false,
	data : [],
	grid : null,
	uiCls : "mini-lookup",
	destroy : function(A) {
		if (this.grid) {
			this.grid.un("rowclick", this.__OnGridRowClickChanged, this);
			this.grid.un("load", this.__OnGridLoad, this);
			this.grid = null
		}
		mini.Lookup.superclass.destroy.call(this, A)
	},
	setMultiSelect : function(A) {
		this.multiSelect = A;
		if (this.grid)
			this.grid.setMultiSelect(A)
	},
	setGrid : function(A) {
		if (typeof A == "string") {
			mini.parse(A);
			A = mini.get(A)
		}
		this.grid = mini.getAndCreate(A);
		if (this.grid) {
			this.grid.setMultiSelect(this.multiSelect);
			this.grid.setCheckSelectOnLoad(false);
			this.grid.on("rowclick", this.__OnGridRowClickChanged, this);
			this.grid.on("load", this.__OnGridLoad, this);
			this.grid.on("checkall", this.__OnGridRowClickChanged, this)
		}
	},
	getGrid : function() {
		return this.grid
	},
	setValueField : function(A) {
		this.valueField = A
	},
	getValueField : function() {
		return this.valueField
	},
	setTextField : function(A) {
		this.textField = A
	},
	getTextField : function() {
		return this.textField
	},
	deselectAll : function() {
		this.data = [];
		this.setValue("");
		this.setText("");
		if (this.grid)
			this.grid.deselectAll()
	},
	getItemValue : function(A) {
		return String(A[this.valueField])
	},
	getItemText : function(A) {
		var B = A[this.textField];
		return mini.isNull(B) ? "" : String(B)
	},
	getValueAndText : function(C) {
		if (mini.isNull(C))
			C = [];
		var D = [], E = [];
		for ( var B = 0, F = C.length; B < F; B++) {
			var A = C[B];
			if (A) {
				D.push(this.getItemValue(A));
				E.push(this.getItemText(A))
			}
		}
		return [ D.join(this.delimiter), E.join(this.delimiter) ]
	},
	_createData : function() {
		if (typeof this.value != "string")
			this.value = "";
		if (typeof this.text != "string")
			this.text = "";
		var F = [], E = this.value.split(this.delimiter), G = this.text
				.split(this.delimiter), A = E.length;
		if (this.value)
			for ( var B = 0, H = A; B < H; B++) {
				var D = {}, I = E[B], C = G[B];
				D[this.valueField] = I ? I : "";
				D[this.textField] = C ? C : "";
				F.push(D)
			}
		this.data = F
	},
	_getValueMaps : function(C) {
		var F = {};
		for ( var A = 0, D = C.length; A < D; A++) {
			var B = C[A], E = B[this.valueField];
			F[E] = B
		}
		return F
	},
	setValue : function(A) {
		mini.Lookup.superclass.setValue.call(this, A);
		this._createData()
	},
	setText : function(A) {
		mini.Lookup.superclass.setText.call(this, A);
		this._createData()
	},
	__OnGridRowClickChanged : function(I) {
		var D = this._getValueMaps(this.grid.getData()), E = this
				._getValueMaps(this.grid.getSelecteds()), H = this
				._getValueMaps(this.data);
		if (this.multiSelect == false) {
			H = {};
			this.data = []
		}
		var C = {};
		for ( var G in H) {
			var A = H[G];
			if (D[G])
				if (E[G])
					;
				else
					C[G] = A
		}
		for ( var B = this.data.length - 1; B >= 0; B--) {
			A = this.data[B], G = A[this.valueField];
			if (C[G])
				this.data.removeAt(B)
		}
		for (G in E) {
			A = E[G];
			if (!H[G])
				this.data.push(A)
		}
		var F = this.getValueAndText(this.data);
		this.setValue(F[0]);
		this.setText(F[1]);
		this._OnValueChanged()
	},
	__OnGridLoad : function(A) {
		this.__OnShowPopup(A)
	},
	__OnShowPopup : function(J) {
		var E = String(this.value).split(this.delimiter), H = {};
		for ( var A = 0, F = E.length; A < F; A++) {
			var I = E[A];
			H[I] = 1
		}
		var C = this.grid.getData(), D = [];
		for (A = 0, F = C.length; A < F; A++) {
			var B = C[A], G = B[this.valueField];
			if (H[G])
				D.push(B)
		}
		this.grid.selects(D)
	},
	doUpdate : function() {
		mini.Lookup.superclass.doUpdate.call(this);
		this._textEl.readOnly = true;
		this.el.style.cursor = "default"
	},
	__OnInputKeyDown : function(A) {
		mini.Lookup.superclass.__OnInputKeyDown.call(this, A);
		switch (A.keyCode) {
		case 46:
		case 8:
			break;
		case 37:
			break;
		case 39:
			break
		}
	},
	__OnMouseUp : function(E) {
		if (this.isReadOnly())
			return;
		var B = mini.getSelectRange(this._textEl), C = B[0], D = B[1], A = this
				._findTextIndex(C)
	},
	_findTextIndex : function(G) {
		var B = -1;
		if (this.text == "")
			return B;
		var E = String(this.text).split(this.delimiter), A = 0;
		for ( var C = 0, F = E.length; C < F; C++) {
			var D = E[C];
			if (A < G && G <= A + D.length) {
				B = C;
				break
			}
			A = A + D.length + 1
		}
		return B
	},
	getAttrs : function(A) {
		var B = mini.Lookup.superclass.getAttrs.call(this, A);
		mini._ParseString(A, B, [ "grid", "valueField", "textField" ]);
		mini._ParseBool(A, B, [ "multiSelect" ]);
		return B
	}
});
mini.regClass(mini.Lookup, "lookup");
mini.TextBoxList = function() {
	mini.TextBoxList.superclass.constructor.call(this);
	this.data = [];
	this.doUpdate()
};
mini
		.extend(
				mini.TextBoxList,
				mini.ValidatorBase,
				{
					formField : true,
					value : "",
					text : "",
					valueField : "id",
					textField : "text",
					url : "",
					delay : 150,
					allowInput : true,
					editIndex : 0,
					_focusCls : "mini-textboxlist-focus",
					_itemHoverClass : "mini-textboxlist-item-hover",
					_itemSelectedClass : "mini-textboxlist-item-selected",
					_closeHoverClass : "mini-textboxlist-close-hover",
					textName : "",
					setTextName : function(A) {
						this.textName = A
					},
					getTextName : function() {
						return this.textName
					},
					uiCls : "mini-textboxlist",
					_create : function() {
						var C = "<table class=\"mini-textboxlist\" cellpadding=\"0\" cellspacing=\"0\"><tr ><td class=\"mini-textboxlist-border\"><ul></ul><a href=\"#\"></a><input type=\"hidden\"/></td></tr></table>", B = document
								.createElement("div");
						B.innerHTML = C;
						this.el = B.firstChild;
						var A = this.el.getElementsByTagName("td")[0];
						this.ulEl = A.firstChild;
						this._valueEl = A.lastChild;
						this.focusEl = A.childNodes[1]
					},
					destroy : function(A) {
						if (this.isShowPopup)
							this.hidePopup();
						mini.un(document, "mousedown", this.__OnDocMouseDown,
								this);
						mini.TextBoxList.superclass.destroy.call(this, A)
					},
					_initEvents : function() {
						mini.TextBoxList.superclass._initEvents.call(this);
						mini.on(this.el, "mousemove", this.__OnMouseMove, this);
						mini.on(this.el, "mouseout", this.__OnMouseOut, this);
						mini.on(this.el, "mousedown", this.__OnMouseDown, this);
						mini.on(this.el, "click", this.__OnClick, this);
						mini.on(this.el, "keydown", this.__OnKeyDown, this);
						mini.on(document, "mousedown", this.__OnDocMouseDown,
								this)
					},
					__OnDocMouseDown : function(A) {
						if (this.isReadOnly())
							return;
						if (this.isShowPopup)
							if (!mini.isAncestor(this.popup.el, A.target))
								this.hidePopup();
						if (this._focused)
							if (this.within(A) == false) {
								this.select(null, false);
								this.showInput(false);
								this.removeCls(this._focusCls);
								this._focused = false
							}
					},
					errorIconEl : null,
					getErrorIconEl : function() {
						if (!this._errorIconEl) {
							var B = this.el.rows[0], A = B.insertCell(1);
							A.style.cssText = "width:18px;vertical-align:top;";
							A.innerHTML = "<div class=\"mini-errorIcon\"></div>";
							this._errorIconEl = A.firstChild
						}
						return this._errorIconEl
					},
					_RemoveErrorIcon : function() {
						if (this._errorIconEl)
							jQuery(this._errorIconEl.parentNode).remove();
						this._errorIconEl = null
					},
					doLayout : function() {
						if (this.canLayout() == false)
							return;
						mini.TextBoxList.superclass.doLayout.call(this);
						if (this.isReadOnly() || this.allowInput == false)
							this._inputEl.readOnly = true;
						else
							this._inputEl.readOnly = false
					},
					doUpdate : function() {
						if (this._ValueChangeTimer)
							clearInterval(this._ValueChangeTimer);
						if (this._inputEl)
							mini.un(this._inputEl, "keydown",
									this.__OnInputKeyDown, this);
						var I = [], H = this.uid;
						for ( var C = 0, G = this.data.length; C < G; C++) {
							var B = this.data[C], E = H + "$text$" + C, D = B[this.textField];
							if (mini.isNull(D))
								D = "";
							I[I.length] = "<li id=\"" + E
									+ "\" class=\"mini-textboxlist-item\">";
							I[I.length] = D;
							I[I.length] = "<span class=\"mini-textboxlist-close\"></span></li>"
						}
						var A = H + "$input";
						I[I.length] = "<li id=\""
								+ A
								+ "\" class=\"mini-textboxlist-inputLi\"><input class=\"mini-textboxlist-input\" type=\"text\" autocomplete=\"off\"></li>";
						this.ulEl.innerHTML = I.join("");
						this.editIndex = this.data.length;
						if (this.editIndex < 0)
							this.editIndex = 0;
						this.inputLi = this.ulEl.lastChild;
						this._inputEl = this.inputLi.firstChild;
						mini.on(this._inputEl, "keydown",
								this.__OnInputKeyDown, this);
						var F = this;
						this._inputEl.onkeyup = function() {
							F._syncInputSize()
						};
						F._ValueChangeTimer = null;
						F._LastInputText = F._inputEl.value;
						this._inputEl.onfocus = function() {
							F._ValueChangeTimer = setInterval(function() {
								if (F._LastInputText != F._inputEl.value) {
									F._startQuery();
									F._LastInputText = F._inputEl.value
								}
							}, 10);
							F.addCls(F._focusCls);
							F._focused = true;
							F.fire("focus")
						};
						this._inputEl.onblur = function() {
							clearInterval(F._ValueChangeTimer);
							F.fire("blur")
						}
					},
					getItemByEvent : function(B) {
						var C = mini.findParent(B.target,
								"mini-textboxlist-item");
						if (C) {
							var A = C.id.split("$"), D = A[A.length - 1];
							return this.data[D]
						}
					},
					getItem : function(A) {
						if (typeof A == "number")
							return this.data[A];
						if (typeof A == "object")
							return A
					},
					getItemEl : function(B) {
						var A = this.data.indexOf(B), C = this.uid + "$text$"
								+ A;
						return document.getElementById(C)
					},
					hoverItem : function(A, C) {
						if (this.isReadOnly() || this.enabled == false)
							return;
						this.blurItem();
						var B = this.getItemEl(A);
						mini.addClass(B, this._itemHoverClass);
						if (C
								&& mini.hasClass(C.target,
										"mini-textboxlist-close"))
							mini.addClass(C.target, this._closeHoverClass)
					},
					blurItem : function() {
						var B = this.data.length;
						for ( var C = 0, E = B; C < E; C++) {
							var A = this.data[C], D = this.getItemEl(A);
							if (D) {
								mini.removeClass(D, this._itemHoverClass);
								mini.removeClass(D.lastChild,
										this._closeHoverClass)
							}
						}
					},
					showInput : function(C) {
						this.select(null);
						if (mini.isNumber(C))
							this.editIndex = C;
						else
							this.editIndex = this.data.length;
						if (this.editIndex < 0)
							this.editIndex = 0;
						if (this.editIndex > this.data.length)
							this.editIndex = this.data.length;
						var D = this.inputLi;
						D.style.display = "block";
						if (mini.isNumber(C) && C < this.data.length) {
							var B = this.data[C], A = this.getItemEl(B);
							jQuery(A).before(D)
						} else
							this.ulEl.appendChild(D);
						if (C !== false)
							setTimeout(function() {
								try {
									D.firstChild.focus();
									mini.selectRange(D.firstChild, 100)
								} catch (A) {
								}
							}, 10);
						else {
							this.lastInputText = "";
							this._inputEl.value = ""
						}
						return D
					},
					select : function(B) {
						B = this.getItem(B);
						if (this._selected) {
							var A = this.getItemEl(this._selected);
							mini.removeClass(A, this._itemSelectedClass)
						}
						this._selected = B;
						if (this._selected) {
							A = this.getItemEl(this._selected);
							mini.addClass(A, this._itemSelectedClass)
						}
						var C = this;
						if (this._selected) {
							this.focusEl.focus();
							var D = this;
							setTimeout(function() {
								try {
									D.focusEl.focus()
								} catch (A) {
								}
							}, 50)
						}
						if (this._selected) {
							C.addCls(C._focusCls);
							C._focused = true
						}
					},
					_doInsertSelectValue : function() {
						var B = this._listbox.getSelected(), A = this.editIndex;
						if (B) {
							B = mini.clone(B);
							this.insertItem(A, B)
						}
					},
					insertItem : function(B, A) {
						this.data.insert(B, A);
						var D = this.getText(), C = this.getValue();
						this.setValue(C, false);
						this.setText(D, false);
						this._createData();
						this.doUpdate();
						this.showInput(B + 1);
						this._OnValueChanged()
					},
					removeItem : function(B) {
						if (!B)
							return;
						var A = this.getItemEl(B);
						mini.removeNode(A);
						this.data.remove(B);
						var D = this.getText(), C = this.getValue();
						this.setValue(C, false);
						this.setText(D, false);
						this._OnValueChanged()
					},
					_createData : function() {
						var E = (this.text ? this.text : "").split(","), D = (this.value ? this.value
								: "").split(",");
						if (D[0] == "")
							D = [];
						var B = D.length;
						this.data.length = B;
						for ( var C = 0, F = B; C < F; C++) {
							var A = this.data[C];
							if (!A) {
								A = {};
								this.data[C] = A
							}
							A[this.textField] = !mini.isNull(E[C]) ? E[C] : "";
							A[this.valueField] = !mini.isNull(D[C]) ? D[C] : ""
						}
						this.value = this.getValue();
						this.text = this.getText()
					},
					getInputText : function() {
						return this._inputEl ? this._inputEl.value : ""
					},
					getText : function() {
						var E = [];
						for ( var B = 0, C = this.data.length; B < C; B++) {
							var A = this.data[B], D = A[this.textField];
							if (mini.isNull(D))
								D = "";
							D = D.replace(",", "\uff0c");
							E.push(D)
						}
						return E.join(",")
					},
					getValue : function() {
						var D = [];
						for ( var B = 0, C = this.data.length; B < C; B++) {
							var A = this.data[B];
							D.push(A[this.valueField])
						}
						return D.join(",")
					},
					setName : function(A) {
						if (this.name != A) {
							this.name = A;
							this._valueEl.name = A
						}
					},
					setValue : function(A) {
						if (mini.isNull(A))
							A = "";
						if (this.value != A) {
							this.value = A;
							this._valueEl.value = A;
							this._createData();
							this.doUpdate()
						}
					},
					setText : function(A) {
						if (mini.isNull(A))
							A = "";
						if (this.text !== A) {
							this.text = A;
							this._createData();
							this.doUpdate()
						}
					},
					setValueField : function(A) {
						this.valueField = A
					},
					getValueField : function() {
						return this.valueField
					},
					setTextField : function(A) {
						this.textField = A
					},
					getTextField : function() {
						return this.textField
					},
					setAllowInput : function(A) {
						this.allowInput = A;
						this.doLayout()
					},
					getAllowInput : function() {
						return this.allowInput
					},
					setUrl : function(A) {
						this.url = A
					},
					getUrl : function() {
						return this.url
					},
					setPopupHeight : function(A) {
						this.popupHeight = A
					},
					getPopupHeight : function() {
						return this.popupHeight
					},
					setPopupMinHeight : function(A) {
						this.popupMinHeight = A
					},
					getPopupMinHeight : function() {
						return this.popupMinHeight
					},
					setPopupMaxHeight : function(A) {
						this.popupMaxHeight = A
					},
					getPopupMaxHeight : function() {
						return this.popupMaxHeight
					},
					doQuery : function() {
						this._startQuery(true)
					},
					_syncInputSize : function() {
						if (this.isDisplay() == false)
							return;
						var B = this.getInputText(), D = mini.measureText(
								this._inputEl, B), A = D.width > 20 ? D.width + 4
								: 20, C = mini.getWidth(this.el, true);
						if (A > C - 15)
							A = C - 15;
						this._inputEl.style.width = A + "px"
					},
					_startQuery : function(B) {
						var A = this;
						setTimeout(function() {
							A._syncInputSize()
						}, 1);
						this.showPopup("loading");
						this._stopQuery();
						this._loading = true;
						this.delayTimer = setTimeout(function() {
							var B = A._inputEl.value;
							A._doQuery()
						}, this.delay)
					},
					ajaxDataType : "text",
					ajaxContentType : "application/x-www-form-urlencoded; charset=UTF-8",
					_doQuery : function() {
						if (this.isDisplay() == false)
							return;
						var B = this.getInputText(), C = this, A = this._listbox
								.getData(), D = {
							value : this.getValue(),
							text : this.getText()
						};
						D[this.searchField] = B;
						var E = this.url, H = typeof E == "function" ? E
								: window[E];
						if (typeof H == "function")
							E = H(this);
						if (!E)
							return;
						var G = "post";
						if (E)
							if (E.indexOf(".txt") != -1
									|| E.indexOf(".json") != -1)
								G = "get";
						var F = {
							url : E,
							async : true,
							params : D,
							data : D,
							type : this.ajaxType ? this.ajaxType : G,
							cache : false,
							cancel : false
						};
						this.fire("beforeload", F);
						if (F.cancel)
							return;
						mini.copyTo(F, {
							success : function(A) {
								var B = mini.decode(A);
								C._listbox.setData(B);
								C.showPopup();
								C._listbox._focusItem(0, true);
								C.fire("load");
								C._loading = false;
								if (C._selectOnLoad) {
									C.__doSelectValue();
									C._selectOnLoad = null
								}
							},
							error : function(A, D, B) {
								C.showPopup("error")
							}
						});
						C._ajaxer = mini.ajax(F)
					},
					_stopQuery : function() {
						if (this.delayTimer) {
							clearTimeout(this.delayTimer);
							this.delayTimer = null
						}
						if (this._ajaxer)
							this._ajaxer.abort();
						this._loading = false
					},
					within : function(A) {
						if (mini.isAncestor(this.el, A.target))
							return true;
						if (this.showPopup && this.popup
								&& this.popup.within(A))
							return true;
						return false
					},
					popupLoadingText : "<span class='mini-textboxlist-popup-loading'>Loading...</span>",
					popupErrorText : "<span class='mini-textboxlist-popup-error'>Error</span>",
					popupEmptyText : "<span class='mini-textboxlist-popup-noresult'>No Result</span>",
					isShowPopup : false,
					popupHeight : "",
					popupMinHeight : 30,
					popupMaxHeight : 150,
					_createPopup : function() {
						if (!this.popup) {
							this.popup = new mini.ListBox();
							this.popup.addCls("mini-textboxlist-popup");
							this.popup
									.setStyle("position:absolute;left:0;top:0;");
							this.popup.showEmpty = true;
							this.popup.setValueField(this.valueField);
							this.popup.setTextField(this.textField);
							this.popup.render(document.body);
							this.popup.on("itemclick", function(A) {
								this.hidePopup();
								this._doInsertSelectValue()
							}, this)
						}
						this._listbox = this.popup;
						return this.popup
					},
					showPopup : function(A) {
						if (this.isDisplay() == false)
							return;
						this.isShowPopup = true;
						var B = this._createPopup();
						B.el.style.zIndex = mini.getMaxZIndex();
						var D = this._listbox;
						D.emptyText = this.popupEmptyText;
						if (A == "loading") {
							D.emptyText = this.popupLoadingText;
							this._listbox.setData( [])
						} else if (A == "error") {
							D.emptyText = this.popupLoadingText;
							this._listbox.setData( [])
						}
						this._listbox.doUpdate();
						var C = this.getBox(), F = C.x, E = C.y + C.height;
						this.popup.el.style.display = "block";
						mini.setXY(B.el, -1000, -1000);
						this.popup.setWidth(C.width);
						this.popup.setHeight(this.popupHeight);
						if (this.popup.getHeight() < this.popupMinHeight)
							this.popup.setHeight(this.popupMinHeight);
						if (this.popup.getHeight() > this.popupMaxHeight)
							this.popup.setHeight(this.popupMaxHeight);
						mini.setXY(B.el, F, E)
					},
					hidePopup : function() {
						this.isShowPopup = false;
						if (this.popup)
							this.popup.el.style.display = "none"
					},
					__OnMouseMove : function(B) {
						if (this.enabled == false)
							return;
						var A = this.getItemByEvent(B);
						if (!A) {
							this.blurItem();
							return
						}
						this.hoverItem(A, B)
					},
					__OnMouseOut : function(A) {
						this.blurItem()
					},
					__OnClick : function(B) {
						if (this.isReadOnly() || this.enabled == false)
							return;
						if (this.enabled == false)
							return;
						var A = this.getItemByEvent(B);
						if (!A) {
							if (mini.findParent(B.target,
									"mini-textboxlist-input"))
								;
							else
								this.showInput();
							return
						}
						this.focusEl.focus();
						this.select(A);
						if (B
								&& mini.hasClass(B.target,
										"mini-textboxlist-close"))
							this.removeItem(A)
					},
					__OnKeyDown : function(D) {
						if (this.isReadOnly() || this.allowInput == false)
							return false;
						var A = this.data.indexOf(this._selected), B = this;
						function C() {
							var C = B.data[A];
							B.removeItem(C);
							C = B.data[A];
							if (!C)
								C = B.data[A - 1];
							B.select(C);
							if (!C)
								B.showInput()
						}
						switch (D.keyCode) {
						case 8:
							D.preventDefault();
							C();
							break;
						case 37:
						case 38:
							this.select(null);
							this.showInput(A);
							break;
						case 39:
						case 40:
							A += 1;
							this.select(null);
							this.showInput(A);
							break;
						case 46:
							C();
							break
						}
					},
					__doSelectValue : function() {
						var A = this._listbox.getFocusedItem();
						if (A)
							this._listbox.setSelected(A);
						this.lastInputText = this.text;
						this.hidePopup();
						this._doInsertSelectValue()
					},
					__OnInputKeyDown : function(I) {
						this._selectOnLoad = null;
						if (this.isReadOnly() || this.allowInput == false)
							return false;
						I.stopPropagation();
						if (this.isReadOnly() || this.allowInput == false)
							return;
						var G = mini.getSelectRange(this._inputEl), D = G[0], F = G[1], H = this._inputEl.value.length, E = D == F
								&& D == 0, C = D == F && F == H;
						if (this.isReadOnly() || this.allowInput == false)
							I.preventDefault();
						if (I.keyCode == 9) {
							this.hidePopup();
							return
						}
						if (I.keyCode == 16 || I.keyCode == 17
								|| I.keyCode == 18)
							return;
						switch (I.keyCode) {
						case 13:
							if (this.isShowPopup) {
								I.preventDefault();
								if (this._loading) {
									this._selectOnLoad = true;
									return
								}
								this.__doSelectValue()
							}
							break;
						case 27:
							I.preventDefault();
							this.hidePopup();
							break;
						case 8:
							if (E)
								I.preventDefault();
						case 37:
							if (E)
								if (this.isShowPopup)
									this.hidePopup();
								else if (this.editIndex > 0) {
									var B = this.editIndex - 1;
									if (B < 0)
										B = 0;
									if (B >= this.data.length)
										B = this.data.length - 1;
									this.showInput(false);
									this.select(B)
								}
							break;
						case 39:
							if (C)
								if (this.isShowPopup)
									this.hidePopup();
								else if (this.editIndex <= this.data.length - 1) {
									B = this.editIndex;
									this.showInput(false);
									this.select(B)
								}
							break;
						case 38:
							I.preventDefault();
							if (this.isShowPopup) {
								var B = -1, A = this._listbox.getFocusedItem();
								if (A)
									B = this._listbox.indexOf(A);
								B--;
								if (B < 0)
									B = 0;
								this._listbox._focusItem(B, true)
							}
							break;
						case 40:
							I.preventDefault();
							if (this.isShowPopup) {
								B = -1, A = this._listbox.getFocusedItem();
								if (A)
									B = this._listbox.indexOf(A);
								B++;
								if (B < 0)
									B = 0;
								if (B >= this._listbox.getCount())
									B = this._listbox.getCount() - 1;
								this._listbox._focusItem(B, true)
							} else
								this._startQuery(true);
							break;
						default:
							break
						}
					},
					focus : function() {
						try {
							this._inputEl.focus()
						} catch (A) {
						}
					},
					blur : function() {
						try {
							this._inputEl.blur()
						} catch (A) {
						}
					},
					searchField : "key",
					setSearchField : function(A) {
						this.searchField = A
					},
					getSearchField : function() {
						return this.searchField
					},
					getAttrs : function(A) {
						var C = mini.TextBox.superclass.getAttrs.call(this, A), B = jQuery(A);
						mini._ParseString(A, C, [ "value", "text",
								"valueField", "textField", "url",
								"popupHeight", "textName", "onfocus",
								"onbeforeload", "onload", "searchField" ]);
						mini._ParseBool(A, C, [ "allowInput" ]);
						mini._ParseInt(A, C, [ "popupMinHeight",
								"popupMaxHeight" ]);
						return C
					}
				});
mini.regClass(mini.TextBoxList, "textboxlist");
mini.AutoComplete = function() {
	mini.AutoComplete.superclass.constructor.call(this);
	var A = this;
	A._ValueChangeTimer = null;
	this._textEl.onfocus = function() {
		A._LastInputText = A._textEl.value;
		A._ValueChangeTimer = setInterval(function() {
			if (A._LastInputText != A._textEl.value) {
				A._tryQuery();
				A._LastInputText = A._textEl.value;
				if (A._textEl.value == "" && A.value != "") {
					A.setValue("");
					A._OnValueChanged()
				}
			}
		}, 10)
	};
	this._textEl.onblur = function() {
		clearInterval(A._ValueChangeTimer);
		if (!A.isShowPopup())
			if (A._LastInputText != A._textEl.value)
				if (A._textEl.value == "" && A.value != "") {
					A.setValue("");
					A._OnValueChanged()
				}
	};
	this._buttonEl.style.display = "none"
};
mini
		.extend(
				mini.AutoComplete,
				mini.ComboBox,
				{
					url : "",
					allowInput : true,
					delay : 150,
					searchField : "key",
					minChars : 0,
					_buttonWidth : 0,
					uiCls : "mini-autocomplete",
					setUrl : function(A) {
						this.url = A
					},
					setValue : function(A) {
						if (mini.isNull(A))
							A = "";
						if (this.value != A) {
							this.value = A;
							this._valueEl.value = this.value
						}
					},
					setText : function(A) {
						if (mini.isNull(A))
							A = "";
						if (this.text != A) {
							this.text = A;
							this._LastInputText = A
						}
						this._textEl.value = this.text
					},
					setMinChars : function(A) {
						this.minChars = A
					},
					getMinChars : function() {
						return this.minChars
					},
					setSearchField : function(A) {
						this.searchField = A
					},
					getSearchField : function() {
						return this.searchField
					},
					popupLoadingText : "<span class='mini-textboxlist-popup-loading'>Loading...</span>",
					popupErrorText : "<span class='mini-textboxlist-popup-error'>Error</span>",
					popupEmptyText : "<span class='mini-textboxlist-popup-noresult'>No Result</span>",
					showPopup : function(A) {
						var B = this.getPopup(), C = this._listbox;
						C.showEmpty = true;
						C.emptyText = this.popupEmptyText;
						if (A == "loading") {
							C.emptyText = this.popupLoadingText;
							this._listbox.setData( [])
						} else if (A == "error") {
							C.emptyText = this.popupLoadingText;
							this._listbox.setData( [])
						}
						this._listbox.doUpdate();
						mini.AutoComplete.superclass.showPopup.call(this)
					},
					__OnInputKeyDown : function(E) {
						this.fire("keydown", {
							htmlEvent : E
						});
						if (E.keyCode == 8
								&& (this.isReadOnly() || this.allowInput == false))
							return false;
						if (E.keyCode == 9) {
							this.hidePopup();
							return
						}
						if (this.isReadOnly())
							return;
						switch (E.keyCode) {
						case 27:
							if (this.isShowPopup())
								E.stopPropagation();
							this.hidePopup();
							break;
						case 13:
							if (this.isShowPopup()) {
								E.preventDefault();
								E.stopPropagation();
								var B = this._listbox.getFocusedIndex();
								if (B != -1) {
									var A = this._listbox.getAt(B), D = this._listbox
											.getValueAndText( [ A ]), C = D[0];
									this.setText(D[1]);
									if (mini.isFirefox) {
										this.blur();
										this.focus()
									}
									this.setValue(C);
									this._OnValueChanged();
									this.hidePopup()
								}
							} else
								this.fire("enter");
							break;
						case 37:
							break;
						case 38:
							B = this._listbox.getFocusedIndex();
							if (B == -1) {
								B = 0;
								if (!this.multiSelect) {
									A = this._listbox.findItems(this.value)[0];
									if (A)
										B = this._listbox.indexOf(A)
								}
							}
							if (this.isShowPopup())
								if (!this.multiSelect) {
									B -= 1;
									if (B < 0)
										B = 0;
									this._listbox._focusItem(B, true)
								}
							break;
						case 39:
							break;
						case 40:
							B = this._listbox.getFocusedIndex();
							if (this.isShowPopup()) {
								if (!this.multiSelect) {
									B += 1;
									if (B > this._listbox.getCount() - 1)
										B = this._listbox.getCount() - 1;
									this._listbox._focusItem(B, true)
								}
							} else
								this._tryQuery(this._textEl.value);
							break;
						default:
							this._tryQuery(this._textEl.value);
							break
						}
					},
					doQuery : function() {
						this._tryQuery()
					},
					_tryQuery : function(B) {
						var A = this;
						if (this._queryTimer) {
							clearTimeout(this._queryTimer);
							this._queryTimer = null
						}
						this._queryTimer = setTimeout(function() {
							var B = A._textEl.value;
							A._doQuery(B)
						}, this.delay);
						this.showPopup("loading")
					},
					_doQuery : function(A) {
						if (!this.url)
							return;
						if (this._ajaxer)
							this._ajaxer.abort();
						var C = this.url, F = "post";
						if (C)
							if (C.indexOf(".txt") != -1
									|| C.indexOf(".json") != -1)
								F = "get";
						var B = {};
						B[this.searchField] = A;
						var E = {
							url : C,
							async : true,
							params : B,
							data : B,
							type : this.ajaxType ? this.ajaxType : F,
							cache : false,
							cancel : false
						};
						this.fire("beforeload", E);
						if (E.cancel)
							return;
						var D = this;
						mini.copyTo(E, {
							success : function(A) {
								try {
									var B = mini.decode(A)
								} catch (C) {
									throw new Error(
											"autocomplete json is error")
								}
								D._listbox.setData(B);
								D.showPopup();
								D._listbox._focusItem(0, true);
								D.data = B;
								D.fire("load", {
									data : B
								})
							},
							error : function(A, C, B) {
								D.showPopup("error")
							}
						});
						this._ajaxer = mini.ajax(E)
					},
					getAttrs : function(A) {
						var B = mini.AutoComplete.superclass.getAttrs.call(
								this, A);
						mini._ParseString(A, B, [ "searchField" ]);
						return B
					}
				});
mini.regClass(mini.AutoComplete, "autocomplete");
mini.Form = function(A) {
	this.el = mini.byId(A);
	if (!this.el)
		throw new Error("form element not null");
	mini.Form.superclass.constructor.call(this)
};
mini.extend(mini.Form, mini.Component, {
	el : null,
	getFields : function() {
		if (!this.el)
			return [];
		var A = mini.findControls(function(A) {
			if (!A.el || A.formField != true)
				return false;
			if (mini.isAncestor(this.el, A.el))
				return true;
			return false
		}, this);
		return A
	},
	getFieldsMap : function() {
		var D = this.getFields(), C = {};
		for ( var A = 0, E = D.length; A < E; A++) {
			var B = D[A];
			if (B.name)
				C[B.name] = B
		}
		return C
	},
	getField : function(A) {
		if (!this.el)
			return null;
		return mini.getbyName(A, this.el)
	},
	getData : function(D, H) {
		if (mini.isNull(H))
			H = true;
		var C = D ? "getFormValue" : "getValue", A = this.getFields(), F = {};
		for ( var B = 0, G = A.length; B < G; B++) {
			var E = A[B], I = E[C];
			if (!I)
				continue;
			if (E.name)
				if (H == true)
					mini._setMap(E.name, I.call(E), F);
				else
					F[E.name] = I.call(E);
			if (E.textName && E.getText)
				if (H == true)
					F[E.textName] = E.getText();
				else
					mini._setMap(E.textName, E.getText(), F)
		}
		return F
	},
	setData : function(H, C, E) {
		if (mini.isNull(E))
			E = true;
		if (typeof H != "object")
			H = {};
		var D = this.getFieldsMap();
		for ( var F in D) {
			var B = D[F];
			if (!B)
				continue;
			if (B.setValue) {
				var G = H[F];
				if (E == true)
					G = mini._getMap(F, H);
				if (G === undefined && C === false)
					continue;
				if (G === null)
					G = "";
				B.setValue(G)
			}
			if (B.setText && B.textName) {
				var A = H[B.textName];
				if (E == true)
					A = mini._getMap(B.textName, H);
				if (mini.isNull(A))
					A = "";
				B.setText(A)
			}
		}
	},
	reset : function() {
		var A = this.getFields();
		for ( var B = 0, D = A.length; B < D; B++) {
			var C = A[B];
			if (!C.setValue)
				continue;
			if (C.setText && C._clearText !== false)
				C.setText("");
			C.setValue(C.defaultValue)
		}
		this.setIsValid(true)
	},
	clear : function() {
		var A = this.getFields();
		for ( var B = 0, D = A.length; B < D; B++) {
			var C = A[B];
			if (!C.setValue)
				continue;
			if (C.setText && C._clearText !== false)
				C.setText("");
			C.setValue("")
		}
		this.setIsValid(true)
	},
	validate : function(E) {
		var A = this.getFields();
		for ( var B = 0, F = A.length; B < F; B++) {
			var C = A[B];
			if (!C.validate)
				continue;
			if (C.isDisplay && C.isDisplay()) {
				var D = C.validate();
				if (D == false && E === false)
					break
			}
		}
		return this.isValid()
	},
	setIsValid : function(D) {
		var A = this.getFields();
		for ( var B = 0, E = A.length; B < E; B++) {
			var C = A[B];
			if (!C.setIsValid)
				continue;
			C.setIsValid(D)
		}
	},
	isValid : function() {
		var A = this.getFields();
		for ( var B = 0, D = A.length; B < D; B++) {
			var C = A[B];
			if (!C.isValid)
				continue;
			if (C.isValid() == false)
				return false
		}
		return true
	},
	getErrorTexts : function() {
		var C = [], B = this.getErrors();
		for ( var A = 0, E = B.length; A < E; A++) {
			var D = B[A];
			C.push(D.errorText)
		}
		return C
	},
	getErrors : function() {
		var C = [], A = this.getFields();
		for ( var B = 0, E = A.length; B < E; B++) {
			var D = A[B];
			if (!D.isValid)
				continue;
			if (D.isValid() == false)
				C.push(D)
		}
		return C
	},
	mask : function(A) {
		if (typeof A == "string")
			A = {
				html : A
			};
		A = A || {};
		A.el = this.el;
		if (!A.cls)
			A.cls = this._maskCls;
		mini.mask(A)
	},
	unmask : function() {
		mini.unmask(this.el)
	},
	_maskCls : "mini-mask-loading",
	loadingMsg : "\u6570\u636e\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u540e...",
	loading : function(A) {
		this.mask(A || this.loadingMsg)
	},
	__OnValueChanged : function(A) {
		this._changed = true
	},
	_changed : false,
	setChanged : function(C) {
		this._changed = C;
		var A = this.getFields();
		for ( var B = 0, E = A.length; B < E; B++) {
			var D = A[B];
			D.on("valuechanged", this.__OnValueChanged, this)
		}
	},
	isChanged : function() {
		return this._changed
	},
	setEnabled : function(C) {
		var A = this.getFields();
		for ( var B = 0, E = A.length; B < E; B++) {
			var D = A[B];
			D.setEnabled(C)
		}
	}
});
mini.Fit = function() {
	mini.Fit.superclass.constructor.call(this)
};
mini
		.extend(
				mini.Fit,
				mini.Container,
				{
					style : "",
					_clearBorder : false,
					uiCls : "mini-fit",
					_create : function() {
						this.el = document.createElement("div");
						this.el.className = "mini-fit";
						this._bodyEl = this.el
					},
					_initEvents : function() {
					},
					isFixedSize : function() {
						return false
					},
					doLayout : function() {
						if (!this.canLayout())
							return;
						var A = this.el.parentNode, B = mini.getChildNodes(A);
						if (A == document.body)
							this.el.style.height = "0px";
						var H = mini.getHeight(A, true);
						for ( var G = 0, F = B.length; G < F; G++) {
							var E = B[G], L = E.tagName ? E.tagName
									.toLowerCase() : "";
							if (E == this.el || (L == "style" || L == "script"))
								continue;
							var I = mini.getStyle(E, "position");
							if (I == "absolute" || I == "fixed")
								continue;
							var C = mini.getHeight(E), K = mini.getMargins(E);
							H = H - C - K.top - K.bottom
						}
						var J = mini.getBorders(this.el), D = mini
								.getPaddings(this.el), K = mini
								.getMargins(this.el);
						H = H - K.top - K.bottom;
						if (jQuery.boxModel)
							H = H - D.top - D.bottom - J.top - J.bottom;
						if (H < 0)
							H = 0;
						this.el.style.height = H + "px";
						try {
							B = mini.getChildNodes(this.el);
							for (G = 0, F = B.length; G < F; G++) {
								E = B[G];
								mini.layout(E)
							}
						} catch (M) {
						}
					},
					set_bodyParent : function(A) {
						if (!A)
							return;
						var B = this._bodyEl, C = A;
						while (C.firstChild) {
							try {
								B.appendChild(C.firstChild)
							} catch (D) {
							}
						}
						this.doLayout()
					},
					getAttrs : function(A) {
						var B = mini.Fit.superclass.getAttrs.call(this, A);
						B._bodyParent = A;
						return B
					}
				});
mini.regClass(mini.Fit, "fit");
mini.Panel = function() {
	this._initButtons();
	mini.Panel.superclass.constructor.call(this);
	if (this.url)
		this.setUrl(this.url);
	this._contentEl = this._bodyEl;
	this._doVisibleEls();
	this._Resizer = new mini._Resizer(this);
	this._doTools()
};
mini
		.extend(
				mini.Panel,
				mini.Container,
				{
					width : 250,
					title : "",
					iconCls : "",
					iconStyle : "",
					allowResize : false,
					url : "",
					refreshOnExpand : false,
					maskOnLoad : true,
					showCollapseButton : false,
					showCloseButton : false,
					closeAction : "display",
					showHeader : true,
					showToolbar : false,
					showFooter : false,
					headerCls : "",
					headerStyle : "",
					bodyCls : "",
					bodyStyle : "",
					footerCls : "",
					footerStyle : "",
					toolbarCls : "",
					toolbarStyle : "",
					minWidth : 180,
					minHeight : 100,
					maxWidth : 5000,
					maxHeight : 3000,
					set : function(C) {
						if (typeof C == "string")
							return this;
						var B = this._allowLayout;
						this._allowLayout = false;
						var E = C.toolbar;
						delete C.toolbar;
						var A = C.footer;
						delete C.footer;
						var D = C.url;
						delete C.url;
						mini.Panel.superclass.set.call(this, C);
						if (E)
							this.setToolbar(E);
						if (A)
							this.setFooter(A);
						if (D)
							this.setUrl(D);
						this._allowLayout = B;
						this.doLayout();
						return this
					},
					uiCls : "mini-panel",
					_create : function() {
						this.el = document.createElement("div");
						this.el.className = "mini-panel";
						var B = "<div class=\"mini-panel-border\">"
								+ "<div class=\"mini-panel-header\" ><div class=\"mini-panel-header-inner\" ><span class=\"mini-panel-icon\"></span><div class=\"mini-panel-title\" ></div><div class=\"mini-tools\" ></div></div></div>"
								+ "<div class=\"mini-panel-viewport\">"
								+ "<div class=\"mini-panel-toolbar\"></div>"
								+ "<div class=\"mini-panel-body\" ></div>"
								+ "<div class=\"mini-panel-footer\"></div>"
								+ "<div class=\"mini-resizer-trigger\"></div>"
								+ "</div>" + "</div>";
						this.el.innerHTML = B;
						this._borderEl = this.el.firstChild;
						this._headerEl = this._borderEl.firstChild;
						this._viewportEl = this._borderEl.lastChild;
						this._toolbarEl = mini.byClass("mini-panel-toolbar",
								this.el);
						this._bodyEl = mini.byClass("mini-panel-body", this.el);
						this._footerEl = mini.byClass("mini-panel-footer",
								this.el);
						this._resizeGridEl = mini.byClass(
								"mini-resizer-trigger", this.el);
						var A = mini
								.byClass("mini-panel-header-inner", this.el);
						this._iconEl = mini.byClass("mini-panel-icon", this.el);
						this._titleEl = mini.byClass("mini-panel-title",
								this.el);
						this._toolsEl = mini.byClass("mini-tools", this.el);
						mini.setStyle(this._bodyEl, this.bodyStyle);
						this._doTitle()
					},
					destroy : function(A) {
						this._doRemoveIFrame();
						this._iframeEl = null;
						this._viewportEl = this._borderEl = this._bodyEl = this._footerEl = this._toolbarEl = null;
						this._toolsEl = this._titleEl = this._iconEl = this._resizeGridEl = null;
						mini.Panel.superclass.destroy.call(this, A)
					},
					_initEvents : function() {
						mini._BindEvents(function() {
							mini.on(this.el, "click", this.__OnClick, this)
						}, this)
					},
					_doVisibleEls : function() {
						this._headerEl.style.display = this.showHeader ? ""
								: "none";
						this._toolbarEl.style.display = this.showToolbar ? ""
								: "none";
						this._footerEl.style.display = this.showFooter ? ""
								: "none"
					},
					_setBodyWidth : true,
					doLayout : function() {
						if (!this.canLayout())
							return;
						this._resizeGridEl.style.display = this.allowResize ? ""
								: "none";
						this._bodyEl.style.width = "auto";
						var D = this.isAutoHeight(), G = this.isAutoWidth(), A = mini
								.getWidth(this._viewportEl, true), B = A;
						if (this._setBodyWidth)
							mini.setWidth(this._bodyEl, A);
						var C = this.getWidth(true);
						this._headerEl.style.width = C + "px";
						if (!D) {
							var F = this.getViewportHeight();
							mini.setHeight(this._viewportEl, F);
							var E = this.getBodyHeight();
							mini.setHeight(this._bodyEl, E)
						} else {
							this._viewportEl.style.height = "auto";
							this._bodyEl.style.height = "auto"
						}
						mini.layout(this._borderEl);
						this.fire("layout")
					},
					deferLayout : function(A) {
						if (!A)
							A = 10;
						if (this._layoutTimer)
							return;
						var B = this;
						this._layoutTimer = setTimeout(function() {
							B._layoutTimer = null;
							B.doLayout()
						}, A)
					},
					_stopLayout : function() {
						clearTimeout(this._layoutTimer);
						this._layoutTimer = null
					},
					getViewportWidth : function(A) {
						return mini.getWidth(this._viewportEl, A)
					},
					getViewportHeight : function(B) {
						var A = this.getHeight(true) - this.getHeaderHeight();
						if (B) {
							var E = mini.getPaddings(this._viewportEl), D = mini
									.getBorders(this._viewportEl), C = mini
									.getMargins(this._viewportEl);
							if (jQuery.boxModel)
								A = A - E.top - E.bottom - D.top - D.bottom;
							A = A - C.top - C.bottom
						}
						return A
					},
					getBodyHeight : function(C) {
						var B = this.getViewportHeight(), B = B
								- this.getToolbarHeight()
								- this.getFooterHeight();
						if (C) {
							var A = mini.getPaddings(this._bodyEl), D = mini
									.getBorders(this._bodyEl), E = mini
									.getMargins(this._bodyEl);
							if (jQuery.boxModel)
								B = B - A.top - A.bottom - D.top - D.bottom;
							B = B - E.top - E.bottom
						}
						if (B < 0)
							B = 0;
						return B
					},
					getHeaderHeight : function() {
						var A = this.showHeader ? jQuery(this._headerEl)
								.outerHeight() : 0;
						return A
					},
					getToolbarHeight : function() {
						var A = this.showToolbar ? jQuery(this._toolbarEl)
								.outerHeight() : 0;
						return A
					},
					getFooterHeight : function() {
						var A = this.showFooter ? jQuery(this._footerEl)
								.outerHeight() : 0;
						return A
					},
					setHeaderStyle : function(A) {
						this.headerStyle = A;
						mini.setStyle(this._headerEl, A);
						this.doLayout()
					},
					getHeaderStyle : function() {
						return this.headerStyle
					},
					setBodyStyle : function(A) {
						this.bodyStyle = A;
						mini.setStyle(this._bodyEl, A);
						this.doLayout()
					},
					getBodyStyle : function() {
						return this.bodyStyle
					},
					setToolbarStyle : function(A) {
						this.toolbarStyle = A;
						mini.setStyle(this._toolbarEl, A);
						this.doLayout()
					},
					getToolbarStyle : function() {
						return this.toolbarStyle
					},
					setFooterStyle : function(A) {
						this.footerStyle = A;
						mini.setStyle(this._footerEl, A);
						this.doLayout()
					},
					getFooterStyle : function() {
						return this.footerStyle
					},
					setHeaderCls : function(A) {
						jQuery(this._headerEl).removeClass(this.headerCls);
						jQuery(this._headerEl).addClass(A);
						this.headerCls = A;
						this.doLayout()
					},
					getHeaderCls : function() {
						return this.headerCls
					},
					setBodyCls : function(A) {
						jQuery(this._bodyEl).removeClass(this.bodyCls);
						jQuery(this._bodyEl).addClass(A);
						this.bodyCls = A;
						this.doLayout()
					},
					getBodyCls : function() {
						return this.bodyCls
					},
					setToolbarCls : function(A) {
						jQuery(this._toolbarEl).removeClass(this.toolbarCls);
						jQuery(this._toolbarEl).addClass(A);
						this.toolbarCls = A;
						this.doLayout()
					},
					getToolbarCls : function() {
						return this.toolbarCls
					},
					setFooterCls : function(A) {
						jQuery(this._footerEl).removeClass(this.footerCls);
						jQuery(this._footerEl).addClass(A);
						this.footerCls = A;
						this.doLayout()
					},
					getFooterCls : function() {
						return this.footerCls
					},
					_doTitle : function() {
						this._titleEl.innerHTML = this.title;
						this._iconEl.style.display = (this.iconCls || this.iconStyle) ? "inline"
								: "none";
						this._iconEl.className = "mini-panel-icon "
								+ this.iconCls;
						mini.setStyle(this._iconEl, this.iconStyle)
					},
					setTitle : function(A) {
						this.title = A;
						this._doTitle()
					},
					getTitle : function() {
						return this.title
					},
					setIconCls : function(A) {
						this.iconCls = A;
						this._doTitle()
					},
					getIconCls : function() {
						return this.iconCls
					},
					_doTools : function() {
						var C = "";
						for ( var A = this.buttons.length - 1; A >= 0; A--) {
							var B = this.buttons[A];
							C += "<span id=\"" + A + "\" class=\"" + B.cls
									+ " " + (B.enabled ? "" : "mini-disabled")
									+ "\" style=\"" + B.style + ";"
									+ (B.visible ? "" : "display:none;")
									+ "\"></span>"
						}
						this._toolsEl.innerHTML = C
					},
					setShowCloseButton : function(A) {
						this.showCloseButton = A;
						var B = this.getButton("close");
						B.visible = A;
						this._doTools()
					},
					getShowCloseButton : function() {
						return this.showCloseButton
					},
					setCloseAction : function(A) {
						this.closeAction = A
					},
					getCloseAction : function() {
						return this.closeAction
					},
					setShowCollapseButton : function(A) {
						this.showCollapseButton = A;
						var B = this.getButton("collapse");
						B.visible = A;
						this._doTools()
					},
					getShowCollapseButton : function() {
						return this.showCollapseButton
					},
					setShowHeader : function(A) {
						this.showHeader = A;
						this._doVisibleEls();
						this.deferLayout()
					},
					getShowHeader : function() {
						return this.showHeader
					},
					setShowToolbar : function(A) {
						this.showToolbar = A;
						this._doVisibleEls();
						this.deferLayout()
					},
					getShowToolbar : function() {
						return this.showToolbar
					},
					setShowFooter : function(A) {
						this.showFooter = A;
						this._doVisibleEls();
						this.deferLayout()
					},
					getShowFooter : function() {
						return this.showFooter
					},
					__OnClick : function(C) {
						if (mini.isAncestor(this._headerEl, C.target)) {
							var A = mini.findParent(C.target, "mini-tools");
							if (A) {
								var B = this.getButton(parseInt(C.target.id));
								if (B)
									this._OnButtonClick(B, C)
							}
						}
					},
					_OnButtonClick : function(D, A) {
						var E = {
							button : D,
							index : this.buttons.indexOf(D),
							name : D.name.toLowerCase(),
							htmlEvent : A,
							cancel : false
						};
						this.fire("beforebuttonclick", E);
						try {
							if (E.name == "close"
									&& this.closeAction == "destroy"
									&& this._iframeEl
									&& this._iframeEl.contentWindow) {
								var B = true;
								if (this._iframeEl.contentWindow.CloseWindow)
									B = this._iframeEl.contentWindow
											.CloseWindow("close");
								else if (this._iframeEl.contentWindow.CloseOwnerWindow)
									B = this._iframeEl.contentWindow
											.CloseOwnerWindow("close");
								if (B === false)
									E.cancel = true
							}
						} catch (C) {
						}
						if (E.cancel == true)
							return E;
						this.fire("buttonclick", E);
						if (E.name == "close")
							if (this.closeAction == "destroy") {
								this.__HideAction = "close";
								this.destroy()
							} else
								this.hide();
						if (E.name == "collapse") {
							this.toggle();
							if (this.refreshOnExpand && this.expanded
									&& this.url)
								this.reload()
						}
						return E
					},
					onButtonClick : function(B, A) {
						this.on("buttonclick", B, A)
					},
					_initButtons : function() {
						this.buttons = [];
						var B = this.createButton( {
							name : "close",
							cls : "mini-tools-close",
							visible : this.showCloseButton
						});
						this.buttons.push(B);
						var A = this.createButton( {
							name : "collapse",
							cls : "mini-tools-collapse",
							visible : this.showCollapseButton
						});
						this.buttons.push(A)
					},
					createButton : function(B) {
						var A = mini.copyTo( {
							name : "",
							cls : "",
							style : "",
							visible : true,
							enabled : true,
							html : ""
						}, B);
						return A
					},
					addButton : function(B, A) {
						if (typeof B == "string")
							B = {
								iconCls : B
							};
						B = this.createButton(B);
						if (typeof A != "number")
							A = this.buttons.length;
						this.buttons.insert(A, B);
						this._doTools()
					},
					updateButton : function(A, C) {
						var B = this.getButton(A);
						if (!B)
							return;
						mini.copyTo(B, C);
						this._doTools()
					},
					removeButton : function(A) {
						var B = this.getButton(A);
						if (!B)
							return;
						this.buttons.remove(B);
						this._doTools()
					},
					getButton : function(A) {
						if (typeof A == "number")
							return this.buttons[A];
						else
							for ( var B = 0, C = this.buttons.length; B < C; B++) {
								var D = this.buttons[B];
								if (D.name == A)
									return D
							}
					},
					setBody : function(A) {
						__mini_setControls(A, this._bodyEl, this)
					},
					set_bodyParent : function(A) {
					},
					setToolbar : function(A) {
						__mini_setControls(A, this._toolbarEl, this)
					},
					setFooter : function(A) {
						__mini_setControls(A, this._footerEl, this)
					},
					getHeaderEl : function() {
						return this._headerEl
					},
					getToolbarEl : function() {
						return this._toolbarEl
					},
					getBodyEl : function() {
						return this._bodyEl
					},
					getFooterEl : function() {
						return this._footerEl
					},
					getIFrameEl : function(A) {
						return this._iframeEl
					},
					_getMaskWrapEl : function() {
						return this._bodyEl
					},
					_doRemoveIFrame : function(A) {
						if (this._iframeEl) {
							var B = this._iframeEl;
							B.src = "";
							try {
								B.contentWindow.document.write("");
								B.contentWindow.document.close()
							} catch (C) {
							}
							if (B._ondestroy)
								B._ondestroy();
							try {
								this._iframeEl.parentNode
										.removeChild(this._iframeEl);
								this._iframeEl.removeNode(true)
							} catch (C) {
							}
						}
						this._iframeEl = null;
						if (A === true)
							mini.removeChilds(this._bodyEl)
					},
					_deferLoadingTime : 80,
					_doLoad : function() {
						this._doRemoveIFrame(true);
						var C = new Date(), A = this;
						this.loadedUrl = this.url;
						if (this.maskOnLoad)
							this.loading();
						var B = mini
								.createIFrame(
										this.url,
										function(B, E) {
											var D = (C - new Date())
													+ A._deferLoadingTime;
											if (D < 0)
												D = 0;
											setTimeout(function() {
												A.unmask()
											}, D);
											try {
												A._iframeEl.contentWindow.Owner = A.Owner;
												A._iframeEl.contentWindow.CloseOwnerWindow = function(
														B) {
													A.__HideAction = B;
													var C = true;
													if (A.__onDestroy)
														C = A.__onDestroy(B);
													if (C === false)
														return false;
													var D = {
														iframe : A._iframeEl,
														action : B
													};
													A.fire("unload", D);
													setTimeout(function() {
														A.destroy()
													}, 10)
												}
											} catch (F) {
											}
											if (E) {
												if (A.__onLoad)
													A.__onLoad();
												var F = {
													iframe : A._iframeEl
												};
												A.fire("load", F)
											}
										});
						this._bodyEl.appendChild(B);
						this._iframeEl = B
					},
					load : function(B, A, C) {
						this.setUrl(B, A, C)
					},
					reload : function() {
						this.setUrl(this.url)
					},
					setUrl : function(A, B, C) {
						this.url = A;
						this.__onLoad = B;
						this.__onDestroy = C;
						if (this.expanded)
							this._doLoad()
					},
					getUrl : function() {
						return this.url
					},
					setRefreshOnExpand : function(A) {
						this.refreshOnExpand = A
					},
					getRefreshOnExpand : function() {
						return this.refreshOnExpand
					},
					setMaskOnLoad : function(A) {
						this.maskOnLoad = A
					},
					getMaskOnLoad : function(A) {
						return this.maskOnLoad
					},
					setAllowResize : function(A) {
						if (this.allowResize != A) {
							this.allowResize = A;
							this.doLayout()
						}
					},
					getAllowResize : function() {
						return this.allowResize
					},
					expanded : true,
					setExpanded : function(A) {
						if (this.expanded != A) {
							this.expanded = A;
							if (this.expanded)
								this.expand();
							else
								this.collapse()
						}
					},
					toggle : function() {
						if (this.expanded)
							this.collapse();
						else
							this.expand()
					},
					collapse : function() {
						this.expanded = false;
						this._height = this.el.style.height;
						this.el.style.height = "auto";
						this._viewportEl.style.display = "none";
						mini.addClass(this.el, "mini-panel-collapse");
						this.doLayout()
					},
					expand : function() {
						this.expanded = true;
						this.el.style.height = this._height;
						this._viewportEl.style.display = "block";
						delete this._height;
						mini.removeClass(this.el, "mini-panel-collapse");
						if (this.url && this.url != this.loadedUrl)
							this._doLoad();
						this.doLayout()
					},
					getAttrs : function(B) {
						var F = mini.Panel.superclass.getAttrs.call(this, B);
						mini._ParseString(B, F, [ "title", "iconCls",
								"iconStyle", "headerCls", "headerStyle",
								"bodyCls", "bodyStyle", "footerCls",
								"footerStyle", "toolbarCls", "toolbarStyle",
								"footer", "toolbar", "url", "closeAction",
								"loadingMsg", "onbeforebuttonclick",
								"onbuttonclick", "onload" ]);
						mini._ParseBool(B, F, [ "allowResize",
								"showCloseButton", "showHeader", "showToolbar",
								"showFooter", "showCollapseButton",
								"refreshOnExpand", "maskOnLoad", "expanded" ]);
						var E = mini.getChildNodes(B, true);
						for ( var A = E.length - 1; A >= 0; A--) {
							var D = E[A], C = jQuery(D).attr("property");
							if (!C)
								continue;
							C = C.toLowerCase();
							if (C == "toolbar")
								F.toolbar = D;
							else if (C == "footer")
								F.footer = D
						}
						F.body = E;
						return F
					}
				});
mini.regClass(mini.Panel, "panel");
mini.Window = function() {
	mini.Window.superclass.constructor.call(this);
	this.addCls("mini-window");
	this.setVisible(false);
	this.setAllowDrag(this.allowDrag);
	this.setAllowResize(this.allowResize)
};
mini
		.extend(
				mini.Window,
				mini.Panel,
				{
					x : 0,
					y : 0,
					state : "restore",
					_dragCls : "mini-window-drag",
					_resizeCls : "mini-window-resize",
					allowDrag : true,
					showCloseButton : true,
					showMaxButton : false,
					showMinButton : false,
					showCollapseButton : false,
					showModal : true,
					minWidth : 150,
					minHeight : 80,
					maxWidth : 2000,
					maxHeight : 2000,
					uiCls : "mini-window",
					_create : function() {
						mini.Window.superclass._create.call(this)
					},
					_initButtons : function() {
						this.buttons = [];
						var C = this.createButton( {
							name : "close",
							cls : "mini-tools-close",
							visible : this.showCloseButton
						});
						this.buttons.push(C);
						var D = this.createButton( {
							name : "max",
							cls : "mini-tools-max",
							visible : this.showMaxButton
						});
						this.buttons.push(D);
						var B = this.createButton( {
							name : "min",
							cls : "mini-tools-min",
							visible : this.showMinButton
						});
						this.buttons.push(B);
						var A = this.createButton( {
							name : "collapse",
							cls : "mini-tools-collapse",
							visible : this.showCollapseButton
						});
						this.buttons.push(A)
					},
					_initEvents : function() {
						mini.Window.superclass._initEvents.call(this);
						mini._BindEvents(function() {
							mini.on(this.el, "mouseover", this.__OnMouseOver,
									this);
							mini.on(window, "resize", this.__OnWindowResize,
									this);
							mini.on(this.el, "mousedown",
									this.__OnWindowMouseDown, this)
						}, this)
					},
					doLayout : function() {
						if (!this.canLayout())
							return;
						if (this.state == "max") {
							var A = this.getParentBox();
							this.el.style.left = "0px";
							this.el.style.top = "0px";
							mini.setSize(this.el, A.width, A.height)
						}
						mini.Window.superclass.doLayout.call(this);
						if (this.allowDrag)
							mini.addClass(this.el, this._dragCls);
						if (this.state == "max") {
							this._resizeGridEl.style.display = "none";
							mini.removeClass(this.el, this._dragCls)
						}
						this._doModal()
					},
					_doModal : function() {
						var C = this.showModal && this.isDisplay()
								&& this.visible;
						if (!this._modalEl && this.showModal == false)
							return;
						if (!this._modalEl)
							this._modalEl = mini
									.append(document.body,
											"<div class=\"mini-modal\" style=\"display:none\"></div>");
						function A() {
							mini.repaint(document.body);
							var A = document.documentElement, D = parseInt(Math
									.max(document.body.scrollWidth,
											A ? A.scrollWidth : 0)), G = parseInt(Math
									.max(document.body.scrollHeight,
											A ? A.scrollHeight : 0)), F = mini
									.getViewportBox(), E = F.height;
							if (E < G)
								E = G;
							var B = F.width;
							if (B < D)
								B = D;
							this._modalEl.style.display = C ? "block" : "none";
							this._modalEl.style.height = E + "px";
							this._modalEl.style.width = B + "px";
							this._modalEl.style.zIndex = mini.getStyle(this.el,
									"zIndex") - 1
						}
						if (C) {
							var B = this;
							setTimeout(function() {
								if (B._modalEl) {
									B._modalEl.style.display = "none";
									A.call(B)
								}
							}, 1)
						} else
							this._modalEl.style.display = "none"
					},
					getParentBox : function() {
						var A = mini.getViewportBox(), B = this._containerEl
								|| document.body;
						if (B != document.body)
							A = mini.getBox(B);
						return A
					},
					setShowModal : function(A) {
						this.showModal = A
					},
					getShowModal : function() {
						return this.showModal
					},
					setMinWidth : function(A) {
						if (isNaN(A))
							return;
						this.minWidth = A
					},
					getMinWidth : function() {
						return this.minWidth
					},
					setMinHeight : function(A) {
						if (isNaN(A))
							return;
						this.minHeight = A
					},
					getMinHeight : function() {
						return this.minHeight
					},
					setMaxWidth : function(A) {
						if (isNaN(A))
							return;
						this.maxWidth = A
					},
					getMaxWidth : function() {
						return this.maxWidth
					},
					setMaxHeight : function(A) {
						if (isNaN(A))
							return;
						this.maxHeight = A
					},
					getMaxHeight : function() {
						return this.maxHeight
					},
					setAllowDrag : function(A) {
						this.allowDrag = A;
						mini.removeClass(this.el, this._dragCls);
						if (A)
							mini.addClass(this.el, this._dragCls)
					},
					getAllowDrag : function() {
						return this.allowDrag
					},
					setShowMaxButton : function(A) {
						this.showMaxButton = A;
						var B = this.getButton("max");
						B.visible = A;
						this._doTools()
					},
					getShowMaxButton : function() {
						return this.showMaxButton
					},
					setShowMinButton : function(A) {
						this.showMinButton = A;
						var B = this.getButton("min");
						B.visible = A;
						this._doTools()
					},
					getShowMinButton : function() {
						return this.showMinButton
					},
					max : function() {
						this.state = "max";
						this.show();
						var A = this.getButton("max");
						if (A) {
							A.cls = "mini-tools-restore";
							this._doTools()
						}
					},
					restore : function() {
						this.state = "restore";
						this.show(this.x, this.y);
						var A = this.getButton("max");
						if (A) {
							A.cls = "mini-tools-max";
							this._doTools()
						}
					},
					containerEl : null,
					showAtPos : function(B, A, C) {
						this.show(B, A, C)
					},
					show : function(D, B, F) {
						this._allowLayout = false;
						var C = this._containerEl || document.body;
						if (!this.isRender() || this.el.parentNode != C)
							this.render(C);
						this.el.style.zIndex = mini.getMaxZIndex();
						this._doShow(D, B);
						this._allowLayout = true;
						this.setVisible(true);
						if (this.state != "max") {
							var A = mini.getBox(this.el);
							this.x = A.x;
							this.y = A.y
						}
						try {
							this.el.focus()
						} catch (E) {
						}
					},
					hide : function() {
						this.setVisible(false);
						this._doModal()
					},
					_measureSize : function() {
						this.el.style.display = "";
						var A = mini.getBox(this.el);
						if (A.width > this.maxWidth) {
							mini.setWidth(this.el, this.maxWidth);
							A = mini.getBox(this.el)
						}
						if (A.height > this.maxHeight) {
							mini.setHeight(this.el, this.maxHeight);
							A = mini.getBox(this.el)
						}
						if (A.width < this.minWidth) {
							mini.setWidth(this.el, this.minWidth);
							A = mini.getBox(this.el)
						}
						if (A.height < this.minHeight) {
							mini.setHeight(this.el, this.minHeight);
							A = mini.getBox(this.el)
						}
					},
					_doShow : function(D, C) {
						var B = this.getParentBox();
						if (this.state == "max") {
							if (!this._width) {
								var A = mini.getBox(this.el);
								this._width = A.width;
								this._height = A.height;
								this.x = A.x;
								this.y = A.y
							}
						} else {
							if (mini.isNull(D))
								D = "center";
							if (mini.isNull(C))
								C = "middle";
							this.el.style.position = "absolute";
							this.el.style.left = "-2000px";
							this.el.style.top = "-2000px";
							this.el.style.display = "";
							if (this._width) {
								this.setWidth(this._width);
								this.setHeight(this._height)
							}
							this._measureSize();
							A = mini.getBox(this.el);
							if (D == "left")
								D = 0;
							if (D == "center")
								D = B.width / 2 - A.width / 2;
							if (D == "right")
								D = B.width - A.width;
							if (C == "top")
								C = 0;
							if (C == "middle")
								C = B.y + B.height / 2 - A.height / 2;
							if (C == "bottom")
								C = B.height - A.height;
							if (D + A.width > B.right)
								D = B.right - A.width;
							if (C + A.height > B.bottom)
								C = B.bottom - A.height;
							if (D < 0)
								D = 0;
							if (C < 0)
								C = 0;
							this.el.style.display = "";
							mini.setX(this.el, D);
							mini.setY(this.el, C);
							this.el.style.left = D + "px";
							this.el.style.top = C + "px"
						}
						this.doLayout()
					},
					_OnButtonClick : function(B, A) {
						var C = mini.Window.superclass._OnButtonClick.call(
								this, B, A);
						if (C.cancel == true)
							return C;
						if (C.name == "max")
							if (this.state == "max")
								this.restore();
							else
								this.max();
						return C
					},
					__OnWindowResize : function(A) {
						if (this.state == "max")
							this.doLayout();
						if (!mini.isIE6)
							this._doModal()
					},
					__OnWindowMouseDown : function(D) {
						var B = this;
						if (this.state != "max" && this.allowDrag
								&& mini.isAncestor(this._headerEl, D.target)
								&& !mini.findParent(D.target, "mini-tools")) {
							var B = this, C = this.getBox(), A = new mini.Drag(
									{
										capture : false,
										onStart : function() {
											B._maskProxy = mini
													.append(document.body,
															"<div class=\"mini-resizer-mask\"></div>");
											B._dragProxy = mini
													.append(document.body,
															"<div class=\"mini-drag-proxy\"></div>");
											B.el.style.display = "none"
										},
										onMove : function(D) {
											var H = D.now[0] - D.init[0], G = D.now[1]
													- D.init[1];
											H = C.x + H;
											G = C.y + G;
											var F = B.getParentBox(), A = H
													+ C.width, E = G + C.height;
											if (A > F.width)
												H = F.width - C.width;
											if (H < 0)
												H = 0;
											if (G < 0)
												G = 0;
											B.x = H;
											B.y = G;
											var I = {
												x : H,
												y : G,
												width : C.width,
												height : C.height
											};
											mini.setBox(B._dragProxy, I);
											this.moved = true
										},
										onStop : function() {
											B.el.style.display = "block";
											if (this.moved) {
												var A = mini
														.getBox(B._dragProxy);
												mini.setBox(B.el, A)
											}
											jQuery(B._maskProxy).remove();
											B._maskProxy = null;
											jQuery(B._dragProxy).remove();
											B._dragProxy = null
										}
									});
							A.start(D)
						}
					},
					destroy : function(A) {
						mini.un(window, "resize", this.__OnWindowResize, this);
						if (this._modalEl) {
							jQuery(this._modalEl).remove();
							this._modalEl = null
						}
						if (this.shadowEl) {
							jQuery(this.shadowEl).remove();
							this.shadowEl = null
						}
						mini.Window.superclass.destroy.call(this, A)
					},
					getAttrs : function(A) {
						var B = mini.Window.superclass.getAttrs.call(this, A);
						mini._ParseString(A, B, [ "modalStyle" ]);
						mini._ParseBool(A, B, [ "showModal", "showShadow",
								"allowDrag", "allowResize", "showMaxButton",
								"showMinButton" ]);
						mini._ParseInt(A, B, [ "minWidth", "minHeight",
								"maxWidth", "maxHeight" ]);
						return B
					},
					showAtEl : function(J, F) {
						J = mini.byId(J);
						if (!J)
							return;
						if (!this.isRender()
								|| this.el.parentNode != document.body)
							this.render(document.body);
						var C = {
							xAlign : this.xAlign,
							yAlign : this.yAlign,
							xOffset : 0,
							yOffset : 0,
							popupCls : this.popupCls
						};
						mini.copyTo(C, F);
						this._popupEl = J;
						this.el.style.position = "absolute";
						this.el.style.left = "-2000px";
						this.el.style.top = "-2000px";
						this.el.style.display = "";
						this.doLayout();
						this._measureSize();
						var L = mini.getViewportBox(), D = mini.getBox(this.el), N = mini
								.getBox(J), H = C.xy, E = C.xAlign, G = C.yAlign, O = L.width
								/ 2 - D.width / 2, M = 0;
						if (H) {
							O = H[0];
							M = H[1]
						}
						switch (C.xAlign) {
						case "outleft":
							O = N.x - D.width;
							break;
						case "left":
							O = N.x;
							break;
						case "center":
							O = N.x + N.width / 2 - D.width / 2;
							break;
						case "right":
							O = N.right - D.width;
							break;
						case "outright":
							O = N.right;
							break;
						default:
							break
						}
						switch (C.yAlign) {
						case "above":
							M = N.y - D.height;
							break;
						case "top":
							M = N.y;
							break;
						case "middle":
							M = N.y + N.height / 2 - D.height / 2;
							break;
						case "bottom":
							M = N.bottom - D.height;
							break;
						case "below":
							M = N.bottom;
							break;
						default:
							break
						}
						O = parseInt(O);
						M = parseInt(M);
						if (C.outYAlign || C.outXAlign) {
							if (C.outYAlign == "above")
								if (M + D.height > L.bottom) {
									var B = N.y - L.y, K = L.bottom - N.bottom;
									if (B > K)
										M = N.y - D.height
								}
							if (C.outXAlign == "outleft")
								if (O + D.width > L.right) {
									var I = N.x - L.x, A = L.right - N.right;
									if (I > A)
										O = N.x - D.width
								}
							if (C.outXAlign == "right")
								if (O + D.width > L.right)
									O = N.right - D.width;
							this._Show(O, M)
						} else
							this.showAtPos(O + C.xOffset, M + C.yOffset)
					}
				});
mini.regClass(mini.Window, "window");
mini.MessageBox = {
	alertTitle : "\u63d0\u9192",
	confirmTitle : "\u786e\u8ba4",
	prompTitle : "\u8f93\u5165",
	prompMessage : "\u8bf7\u8f93\u5165\u5185\u5bb9\uff1a",
	buttonText : {
		ok : "\u786e\u5b9a",
		cancel : "\u53d6\u6d88",
		yes : "\u662f",
		no : "\u5426"
	},
	show : function(H) {
		H = mini.copyTo( {
			width : "auto",
			height : "auto",
			showModal : true,
			minWidth : 150,
			maxWidth : 800,
			minHeight : 100,
			maxHeight : 350,
			showHeader : true,
			title : "",
			titleIcon : "",
			iconCls : "",
			iconStyle : "",
			message : "",
			html : "",
			spaceStyle : "margin-right:15px",
			showCloseButton : true,
			buttons : null,
			buttonWidth : 58,
			callback : null
		}, H);
		var K = H.callback, E = new mini.Window();
		E.setBodyStyle("overflow:hidden");
		E.setShowModal(H.showModal);
		E.setTitle(H.title || "");
		E.setIconCls(H.titleIcon);
		E.setShowHeader(H.showHeader);
		E.setShowCloseButton(H.showCloseButton);
		var L = E.uid + "$table", P = E.uid + "$content", N = "<div class=\""
				+ H.iconCls + "\" style=\"" + H.iconStyle + "\"></div>", S = "<table class=\"mini-messagebox-table\" id=\""
				+ L
				+ "\" style=\"\" cellspacing=\"0\" cellpadding=\"0\"><tr><td>"
				+ N
				+ "</td><td id=\""
				+ P
				+ "\" class=\"mini-messagebox-content-text\">"
				+ (H.message || "") + "</td></tr></table>", B = "<div class=\"mini-messagebox-content\"></div>"
				+ "<div class=\"mini-messagebox-buttons\"></div>";
		E._bodyEl.innerHTML = B;
		var O = E._bodyEl.firstChild;
		if (H.html) {
			if (typeof H.html == "string")
				O.innerHTML = H.html;
			else if (mini.isElement(H.html))
				O.appendChild(H.html)
		} else
			O.innerHTML = S;
		E._Buttons = [];
		var R = E._bodyEl.lastChild;
		if (H.buttons && H.buttons.length > 0) {
			for ( var J = 0, F = H.buttons.length; J < F; J++) {
				var G = H.buttons[J], M = mini.MessageBox.buttonText[G];
				if (!M)
					M = G;
				var A = new mini.Button();
				A.setText(M);
				A.setWidth(H.buttonWidth);
				A.render(R);
				A.action = G;
				A.on("click", function(B) {
					var A = B.sender;
					if (K)
						K(A.action);
					mini.MessageBox.hide(E)
				});
				if (J != F - 1)
					A.setStyle(H.spaceStyle);
				E._Buttons.push(A)
			}
		} else
			R.style.display = "none";
		E.setMinWidth(H.minWidth);
		E.setMinHeight(H.minHeight);
		E.setMaxWidth(H.maxWidth);
		E.setMaxHeight(H.maxHeight);
		E.setWidth(H.width);
		E.setHeight(H.height);
		E.show();
		var C = E.getWidth();
		E.setWidth(C);
		var D = document.getElementById(L);
		if (D)
			D.style.width = "100%";
		var I = document.getElementById(P);
		if (I)
			I.style.width = "100%";
		var Q = E._Buttons[0];
		if (Q)
			Q.focus();
		else
			E.focus();
		E.on("beforebuttonclick", function(A) {
			if (K)
				K("close");
			A.cancel = true;
			mini.MessageBox.hide(E)
		});
		mini.on(E.el, "keydown", function(A) {
			if (A.keyCode == 27) {
				if (K)
					K("close");
				A.cancel = true;
				mini.MessageBox.hide(E)
			}
		});
		return E.uid
	},
	hide : function(E) {
		if (!E)
			return;
		var B = typeof E == "object" ? E : mini.getbyUID(E);
		if (!B)
			return;
		for ( var A = 0, C = B._Buttons.length; A < C; A++) {
			var D = B._Buttons[A];
			D.destroy()
		}
		B._Buttons = null;
		B.destroy()
	},
	alert : function(C, B, A) {
		return mini.MessageBox.show( {
			minWidth : 250,
			title : B || mini.MessageBox.alertTitle,
			buttons : [ "ok" ],
			message : C,
			iconCls : "mini-messagebox-warning",
			callback : A
		})
	},
	confirm : function(C, B, A) {
		return mini.MessageBox.show( {
			minWidth : 250,
			title : B || mini.MessageBox.confirmTitle,
			buttons : [ "ok", "cancel" ],
			message : C,
			iconCls : "mini-messagebox-question",
			callback : A
		})
	},
	prompt : function(E, D, C, B) {
		var H = "prompt$" + new Date().getTime(), G = E
				|| mini.MessageBox.promptMessage;
		if (B)
			G = G
					+ "<br/><textarea id=\""
					+ H
					+ "\" style=\"width:200px;height:60px;margin-top:3px;\"></textarea>";
		else
			G = G
					+ "<br/><input id=\""
					+ H
					+ "\" type=\"text\" style=\"width:200px;margin-top:3px;\"/>";
		var F = mini.MessageBox.show( {
			title : D || mini.MessageBox.promptTitle,
			buttons : [ "ok", "cancel" ],
			width : 250,
			html : "<div style=\"padding:5px;padding-left:10px;\">" + G
					+ "</div>",
			callback : function(B) {
				var A = document.getElementById(H);
				if (C)
					C(B, A.value)
			}
		}), A = document.getElementById(H);
		A.focus();
		return F
	},
	loading : function(B, A) {
		return mini.MessageBox.show( {
			minHeight : 50,
			title : A,
			showCloseButton : false,
			message : B,
			iconCls : "mini-messagebox-waiting"
		})
	}
};
mini.alert = mini.MessageBox.alert;
mini.confirm = mini.MessageBox.confirm;
mini.prompt = mini.MessageBox.prompt;
mini.loading = mini.MessageBox.loading;
mini.showMessageBox = mini.MessageBox.show;
mini.hideMessageBox = mini.MessageBox.hide;
mini.Splitter = function() {
	this._initPanes();
	mini.Splitter.superclass.constructor.call(this)
};
mini
		.extend(
				mini.Splitter,
				mini.Control,
				{
					width : 300,
					height : 180,
					vertical : false,
					allowResize : true,
					pane1 : null,
					pane2 : null,
					showHandleButton : true,
					handlerStyle : "",
					handlerCls : "",
					handlerSize : 5,
					uiCls : "mini-splitter",
					_create : function() {
						this.el = document.createElement("div");
						this.el.className = "mini-splitter";
						this.el.innerHTML = "<div class=\"mini-splitter-border\"><div id=\"1\" class=\"mini-splitter-pane mini-splitter-pane1\"></div><div id=\"2\" class=\"mini-splitter-pane mini-splitter-pane2\"></div><div class=\"mini-splitter-handler\"></div></div>";
						this._borderEl = this.el.firstChild;
						this._pane1El = this._borderEl.firstChild;
						this._pane2El = this._borderEl.childNodes[1];
						this._handlerEl = this._borderEl.lastChild
					},
					_initEvents : function() {
						mini._BindEvents(function() {
							mini.on(this.el, "click", this.__OnClick, this);
							mini.on(this.el, "mousedown", this.__OnMouseDown,
									this)
						}, this)
					},
					_initPanes : function() {
						this.pane1 = {
							id : "",
							index : 1,
							minSize : 30,
							maxSize : 3000,
							size : "",
							showCollapseButton : false,
							cls : "",
							style : "",
							visible : true,
							expanded : true
						};
						this.pane2 = mini.copyTo( {}, this.pane1);
						this.pane2.index = 2
					},
					doUpdate : function() {
						this.doLayout()
					},
					doLayout : function() {
						if (!this.canLayout())
							return;
						this._handlerEl.style.cursor = this.allowResize ? ""
								: "default";
						mini.removeClass(this.el, "mini-splitter-vertical");
						if (this.vertical)
							mini.addClass(this.el, "mini-splitter-vertical");
						mini.removeClass(this._pane1El,
								"mini-splitter-pane1-vertical");
						mini.removeClass(this._pane2El,
								"mini-splitter-pane2-vertical");
						if (this.vertical) {
							mini.addClass(this._pane1El,
									"mini-splitter-pane1-vertical");
							mini.addClass(this._pane2El,
									"mini-splitter-pane2-vertical")
						}
						mini.removeClass(this._handlerEl,
								"mini-splitter-handler-vertical");
						if (this.vertical)
							mini.addClass(this._handlerEl,
									"mini-splitter-handler-vertical");
						var D = this.getHeight(true), B = this.getWidth(true);
						if (!jQuery.boxModel) {
							var S = mini.getBorders(this._borderEl);
							D = D + S.top + S.bottom;
							B = B + S.left + S.right
						}
						this._borderEl.style.width = B + "px";
						this._borderEl.style.height = D + "px";
						var A = this._pane1El, E = this._pane2El, I = jQuery(A), K = jQuery(E);
						A.style.display = E.style.display = this._handlerEl.style.display = "";
						var F = this.handlerSize;
						this.pane1.size = String(this.pane1.size);
						this.pane2.size = String(this.pane2.size);
						var H = parseFloat(this.pane1.size), J = parseFloat(this.pane2.size), Q = isNaN(H), V = isNaN(J), P = !isNaN(H)
								&& this.pane1.size.indexOf("%") != -1, T = !isNaN(J)
								&& this.pane2.size.indexOf("%") != -1, L = !Q
								&& !P, O = !V && !T, R = this.vertical ? D
								- this.handlerSize : B - this.handlerSize, M = p2Size = 0;
						if (Q || V) {
							if (Q && V) {
								M = parseInt(R / 2);
								p2Size = R - M
							} else if (L) {
								M = H;
								p2Size = R - M
							} else if (P) {
								M = parseInt(R * H / 100);
								p2Size = R - M
							} else if (O) {
								p2Size = J;
								M = R - p2Size
							} else if (T) {
								p2Size = parseInt(R * J / 100);
								M = R - p2Size
							}
						} else if (P && O) {
							p2Size = J;
							M = R - p2Size
						} else if (L && T) {
							M = H;
							p2Size = R - M
						} else {
							var N = H + J;
							M = parseInt(R * H / N);
							p2Size = R - M
						}
						if (M > this.pane1.maxSize) {
							M = this.pane1.maxSize;
							p2Size = R - M
						}
						if (p2Size > this.pane2.maxSize) {
							p2Size = this.pane2.maxSize;
							M = R - p2Size
						}
						if (M < this.pane1.minSize) {
							M = this.pane1.minSize;
							p2Size = R - M
						}
						if (p2Size < this.pane2.minSize) {
							p2Size = this.pane2.minSize;
							M = R - p2Size
						}
						if (this.pane1.expanded == false) {
							p2Size = R;
							M = 0;
							A.style.display = "none"
						} else if (this.pane2.expanded == false) {
							M = R;
							p2Size = 0;
							E.style.display = "none"
						}
						if (this.pane1.visible == false) {
							p2Size = R + F;
							M = F = 0;
							A.style.display = "none";
							this._handlerEl.style.display = "none"
						} else if (this.pane2.visible == false) {
							M = R + F;
							p2Size = F = 0;
							E.style.display = "none";
							this._handlerEl.style.display = "none"
						}
						if (this.vertical) {
							mini.setWidth(A, B);
							mini.setWidth(E, B);
							mini.setHeight(A, M);
							mini.setHeight(E, p2Size);
							E.style.top = (M + F) + "px";
							this._handlerEl.style.left = "0px";
							this._handlerEl.style.top = M + "px";
							mini.setWidth(this._handlerEl, B);
							mini.setHeight(this._handlerEl, this.handlerSize);
							A.style.left = "0px";
							E.style.left = "0px"
						} else {
							mini.setWidth(A, M);
							mini.setWidth(E, p2Size);
							mini.setHeight(A, D);
							mini.setHeight(E, D);
							E.style.left = (M + F) + "px";
							this._handlerEl.style.top = "0px";
							this._handlerEl.style.left = M + "px";
							mini.setWidth(this._handlerEl, this.handlerSize);
							mini.setHeight(this._handlerEl, D);
							A.style.top = "0px";
							E.style.top = "0px"
						}
						var U = "<div class=\"mini-splitter-handler-buttons\">";
						if (!this.pane1.expanded || !this.pane2.expanded) {
							if (!this.pane1.expanded) {
								if (this.pane1.showCollapseButton)
									U += "<a id=\"1\" class=\"mini-splitter-pane2-button\"></a>"
							} else if (this.pane2.showCollapseButton)
								U += "<a id=\"2\" class=\"mini-splitter-pane1-button\"></a>"
						} else {
							if (this.pane1.showCollapseButton)
								U += "<a id=\"1\" class=\"mini-splitter-pane1-button\"></a>";
							if (this.allowResize)
								if ((!this.pane1.showCollapseButton && !this.pane2.showCollapseButton))
									U += "<span class=\"mini-splitter-resize-button\"></span>";
							if (this.pane2.showCollapseButton)
								U += "<a id=\"2\" class=\"mini-splitter-pane2-button\"></a>"
						}
						U += "</div>";
						this._handlerEl.innerHTML = U;
						var G = this._handlerEl.firstChild;
						G.style.display = this.showHandleButton ? "" : "none";
						var C = mini.getBox(G);
						if (this.vertical)
							G.style.marginLeft = -C.width / 2 + "px";
						else
							G.style.marginTop = -C.height / 2 + "px";
						if (!this.pane1.visible || !this.pane2.visible
								|| !this.pane1.expanded || !this.pane2.expanded)
							mini.addClass(this._handlerEl,
									"mini-splitter-nodrag");
						else
							mini.removeClass(this._handlerEl,
									"mini-splitter-nodrag");
						mini.layout(this._borderEl);
						this.fire("layout")
					},
					getPaneBox : function(A) {
						var B = this.getPaneEl(A);
						if (!B)
							return null;
						return mini.getBox(B)
					},
					getPane : function(A) {
						if (A == 1)
							return this.pane1;
						else if (A == 2)
							return this.pane2;
						return A
					},
					setPanes : function(B) {
						if (!mini.isArray(B))
							return;
						for ( var A = 0; A < 2; A++) {
							var C = B[A];
							this.updatePane(A + 1, C)
						}
					},
					setPaneControls : function(B, C) {
						var A = this.getPane(B);
						if (!A)
							return;
						var D = this.getPaneEl(B);
						__mini_setControls(C, D, this)
					},
					getPaneEl : function(A) {
						if (A == 1)
							return this._pane1El;
						return this._pane2El
					},
					updatePane : function(B, H) {
						var A = this.getPane(B);
						if (!A)
							return;
						mini.copyTo(A, H);
						var D = this.getPaneEl(B), E = A.body;
						delete A.body;
						if (E) {
							if (!mini.isArray(E))
								E = [ E ];
							for ( var C = 0, G = E.length; C < G; C++)
								mini.append(D, E[C])
						}
						if (A.bodyParent) {
							var F = A.bodyParent;
							while (F.firstChild)
								D.appendChild(F.firstChild)
						}
						delete A.bodyParent;
						D.id = A.id;
						mini.setStyle(D, A.style);
						mini.addClass(D, A["class"]);
						if (A.controls) {
							var B = A == this.pane1 ? 1 : 2;
							this.setPaneControls(B, A.controls);
							delete A.controls
						}
						this.doUpdate()
					},
					setShowHandleButton : function(A) {
						this.showHandleButton = A;
						this.doUpdate()
					},
					getShowHandleButton : function(A) {
						return this.showHandleButton
					},
					setVertical : function(A) {
						this.vertical = A;
						this.doUpdate()
					},
					getVertical : function() {
						return this.vertical
					},
					expandPane : function(B) {
						var A = this.getPane(B);
						if (!A)
							return;
						A.expanded = true;
						this.doUpdate();
						var C = {
							pane : A,
							paneIndex : this.pane1 == A ? 1 : 2
						};
						this.fire("expand", C)
					},
					collapsePane : function(B) {
						var A = this.getPane(B);
						if (!A)
							return;
						A.expanded = false;
						var C = A == this.pane1 ? this.pane2 : this.pane1;
						if (C.expanded == false) {
							C.expanded = true;
							C.visible = true
						}
						this.doUpdate();
						var D = {
							pane : A,
							paneIndex : this.pane1 == A ? 1 : 2
						};
						this.fire("collapse", D)
					},
					togglePane : function(B) {
						var A = this.getPane(B);
						if (!A)
							return;
						if (A.expanded)
							this.collapsePane(A);
						else
							this.expandPane(A)
					},
					showPane : function(B) {
						var A = this.getPane(B);
						if (!A)
							return;
						A.visible = true;
						this.doUpdate()
					},
					hidePane : function(B) {
						var A = this.getPane(B);
						if (!A)
							return;
						A.visible = false;
						var C = A == this.pane1 ? this.pane2 : this.pane1;
						if (C.visible == false) {
							C.expanded = true;
							C.visible = true
						}
						this.doUpdate()
					},
					setAllowResize : function(A) {
						if (this.allowResize != A) {
							this.allowResize = A;
							this.doLayout()
						}
					},
					getAllowResize : function() {
						return this.allowResize
					},
					setHandlerSize : function(A) {
						if (this.handlerSize != A) {
							this.handlerSize = A;
							this.doLayout()
						}
					},
					getHandlerSize : function() {
						return this.handlerSize
					},
					__OnClick : function(D) {
						var C = D.target;
						if (!mini.isAncestor(this._handlerEl, C))
							return;
						var B = parseInt(C.id), A = this.getPane(B), D = {
							pane : A,
							paneIndex : B,
							cancel : false
						};
						if (A.expanded)
							this.fire("beforecollapse", D);
						else
							this.fire("beforeexpand", D);
						if (D.cancel == true)
							return;
						if (C.className == "mini-splitter-pane1-button")
							this.togglePane(B);
						else if (C.className == "mini-splitter-pane2-button")
							this.togglePane(B)
					},
					_OnButtonClick : function(A, B) {
						this.fire("buttonclick", {
							pane : A,
							index : this.pane1 == A ? 1 : 2,
							htmlEvent : B
						})
					},
					onButtonClick : function(B, A) {
						this.on("buttonclick", B, A)
					},
					__OnMouseDown : function(C) {
						var B = C.target;
						if (!this.allowResize)
							return;
						if (!this.pane1.visible || !this.pane2.visible
								|| !this.pane1.expanded || !this.pane2.expanded)
							return;
						if (mini.isAncestor(this._handlerEl, B))
							if (B.className == "mini-splitter-pane1-button"
									|| B.className == "mini-splitter-pane2-button")
								;
							else {
								var A = this._getDrag();
								A.start(C)
							}
					},
					_getDrag : function() {
						if (!this.drag)
							this.drag = new mini.Drag( {
								capture : true,
								onStart : mini.createDelegate(
										this._OnDragStart, this),
								onMove : mini.createDelegate(this._OnDragMove,
										this),
								onStop : mini.createDelegate(this._OnDragStop,
										this)
							});
						return this.drag
					},
					_OnDragStart : function(A) {
						this._maskProxy = mini.append(document.body,
								"<div class=\"mini-resizer-mask\"></div>");
						this._dragProxy = mini.append(document.body,
								"<div class=\"mini-proxy\"></div>");
						this._dragProxy.style.cursor = this.vertical ? "n-resize"
								: "w-resize";
						this.handlerBox = mini.getBox(this._handlerEl);
						this.elBox = mini.getBox(this._borderEl, true);
						mini.setBox(this._dragProxy, this.handlerBox)
					},
					_OnDragMove : function(E) {
						if (!this.handlerBox)
							return;
						if (!this.elBox)
							this.elBox = mini.getBox(this._borderEl, true);
						var D = this.elBox.width, F = this.elBox.height, G = this.handlerSize, K = this.vertical ? F
								- this.handlerSize
								: D - this.handlerSize, C = this.pane1.minSize, H = this.pane1.maxSize, A = this.pane2.minSize, I = this.pane2.maxSize;
						if (this.vertical == true) {
							var B = E.now[1] - E.init[1], J = this.handlerBox.y
									+ B;
							if (J - this.elBox.y > H)
								J = this.elBox.y + H;
							if (J + this.handlerBox.height < this.elBox.bottom
									- I)
								J = this.elBox.bottom - I
										- this.handlerBox.height;
							if (J - this.elBox.y < C)
								J = this.elBox.y + C;
							if (J + this.handlerBox.height > this.elBox.bottom
									- A)
								J = this.elBox.bottom - A
										- this.handlerBox.height;
							mini.setY(this._dragProxy, J)
						} else {
							var L = E.now[0] - E.init[0], M = this.handlerBox.x
									+ L;
							if (M - this.elBox.x > H)
								M = this.elBox.x + H;
							if (M + this.handlerBox.width < this.elBox.right
									- I)
								M = this.elBox.right - I
										- this.handlerBox.width;
							if (M - this.elBox.x < C)
								M = this.elBox.x + C;
							if (M + this.handlerBox.width > this.elBox.right
									- A)
								M = this.elBox.right - A
										- this.handlerBox.width;
							mini.setX(this._dragProxy, M)
						}
					},
					_OnDragStop : function(B) {
						var A = this.elBox.width, D = this.elBox.height, E = this.handlerSize, F = parseFloat(this.pane1.size), G = parseFloat(this.pane2.size), K = isNaN(F), P = isNaN(G), L = !isNaN(F)
								&& this.pane1.size.indexOf("%") != -1, O = !isNaN(G)
								&& this.pane2.size.indexOf("%") != -1, I = !K
								&& !L, M = !P && !O, N = this.vertical ? D
								- this.handlerSize : A - this.handlerSize, C = mini
								.getBox(this._dragProxy), J = C.x
								- this.elBox.x, H = N - J;
						if (this.vertical) {
							J = C.y - this.elBox.y;
							H = N - J
						}
						if (K || P) {
							if (K && P) {
								F = parseFloat(J / N * 100).toFixed(1);
								this.pane1.size = F + "%"
							} else if (I) {
								F = J;
								this.pane1.size = F
							} else if (L) {
								F = parseFloat(J / N * 100).toFixed(1);
								this.pane1.size = F + "%"
							} else if (M) {
								G = H;
								this.pane2.size = G
							} else if (O) {
								G = parseFloat(H / N * 100).toFixed(1);
								this.pane2.size = G + "%"
							}
						} else if (L && M)
							this.pane2.size = H;
						else if (I && O)
							this.pane1.size = J;
						else {
							this.pane1.size = parseFloat(J / N * 100)
									.toFixed(1);
							this.pane2.size = 100 - this.pane1.size
						}
						jQuery(this._dragProxy).remove();
						jQuery(this._maskProxy).remove();
						this._maskProxy = null;
						this._dragProxy = null;
						this.elBox = this.handlerBox = null;
						this.doLayout();
						this.fire("resize")
					},
					getAttrs : function(D) {
						var I = mini.Splitter.superclass.getAttrs.call(this, D);
						mini._ParseBool(D, I, [ "allowResize", "vertical",
								"showHandleButton", "onresize" ]);
						mini._ParseInt(D, I, [ "handlerSize" ]);
						var C = [], H = mini.getChildNodes(D);
						for ( var B = 0, G = 2; B < G; B++) {
							var E = H[B], F = jQuery(E), A = {};
							C.push(A);
							if (!E)
								continue;
							A.style = E.style.cssText;
							mini._ParseString(E, A, [ "cls", "size", "id",
									"class" ]);
							mini._ParseBool(E, A, [ "visible", "expanded",
									"showCollapseButton" ]);
							mini._ParseInt(E, A, [ "minSize", "maxSize",
									"handlerSize" ]);
							A.bodyParent = E
						}
						I.panes = C;
						return I
					}
				});
mini.regClass(mini.Splitter, "splitter");
mini.Layout = function() {
	this.regions = [];
	this.regionMap = {};
	mini.Layout.superclass.constructor.call(this)
};
mini
		.extend(
				mini.Layout,
				mini.Control,
				{
					regions : [],
					splitSize : 5,
					collapseWidth : 28,
					collapseHeight : 25,
					regionWidth : 150,
					regionHeight : 80,
					regionMinWidth : 50,
					regionMinHeight : 25,
					regionMaxWidth : 2000,
					regionMaxHeight : 2000,
					uiCls : "mini-layout",
					_create : function() {
						this.el = document.createElement("div");
						this.el.className = "mini-layout";
						this.el.innerHTML = "<div class=\"mini-layout-border\"></div>";
						this._borderEl = this.el.firstChild;
						this.doUpdate()
					},
					_initEvents : function() {
						mini._BindEvents(function() {
							mini.on(this.el, "click", this.__OnClick, this);
							mini.on(this.el, "mousedown", this.__OnMouseDown,
									this);
							mini.on(this.el, "mouseover", this.__OnMouseOver,
									this);
							mini.on(this.el, "mouseout", this.__OnMouseOut,
									this);
							mini.on(document, "mousedown",
									this.__OnDocMouseDown, this)
						}, this)
					},
					getRegionEl : function(A) {
						var A = this.getRegion(A);
						if (!A)
							return null;
						return A._el
					},
					getRegionHeaderEl : function(A) {
						var A = this.getRegion(A);
						if (!A)
							return null;
						return A._header
					},
					getRegionBodyEl : function(A) {
						var A = this.getRegion(A);
						if (!A)
							return null;
						return A._body
					},
					getRegionSplitEl : function(A) {
						var A = this.getRegion(A);
						if (!A)
							return null;
						return A._split
					},
					getRegionProxyEl : function(A) {
						var A = this.getRegion(A);
						if (!A)
							return null;
						return A._proxy
					},
					getRegionBox : function(B) {
						var A = this.getRegionEl(B);
						if (A)
							return mini.getBox(A);
						return null
					},
					getRegion : function(A) {
						if (typeof A == "string")
							return this.regionMap[A];
						return A
					},
					_getButton : function(B, D) {
						var F = B.buttons;
						for ( var A = 0, C = F.length; A < C; A++) {
							var E = F[A];
							if (E.name == D)
								return E
						}
					},
					_createRegion : function(B) {
						var A = mini.copyTo( {
							region : "",
							title : "",
							iconCls : "",
							iconStyle : "",
							showCloseButton : false,
							showCollapseButton : true,
							buttons : [ {
								name : "close",
								cls : "mini-tools-close",
								html : "",
								visible : false
							}, {
								name : "collapse",
								cls : "mini-tools-collapse",
								html : "",
								visible : true
							} ],
							showSplitIcon : false,
							showSplit : true,
							showHeader : true,
							splitSize : this.splitSize,
							collapseSize : this.collapseWidth,
							width : this.regionWidth,
							height : this.regionHeight,
							minWidth : this.regionMinWidth,
							minHeight : this.regionMinHeight,
							maxWidth : this.regionMaxWidth,
							maxHeight : this.regionMaxHeight,
							allowResize : true,
							cls : "",
							style : "",
							headerCls : "",
							headerStyle : "",
							bodyCls : "",
							bodyStyle : "",
							visible : true,
							expanded : true
						}, B);
						return A
					},
					_CreateRegionEl : function(A) {
						var A = this.getRegion(A);
						if (!A)
							return;
						mini
								.append(
										this._borderEl,
										"<div id=\""
												+ A.region
												+ "\" class=\"mini-layout-region\"><div class=\"mini-layout-region-header\" style=\""
												+ A.headerStyle
												+ "\"></div><div class=\"mini-layout-region-body\" style=\""
												+ A.bodyStyle
												+ "\"></div></div>");
						A._el = this._borderEl.lastChild;
						A._header = A._el.firstChild;
						A._body = A._el.lastChild;
						if (A.cls)
							mini.addClass(A._el, A.cls);
						if (A.style)
							mini.setStyle(A._el, A.style);
						mini.addClass(A._el, "mini-layout-region-" + A.region);
						if (A.region != "center") {
							mini
									.append(
											this._borderEl,
											"<div uid=\""
													+ this.uid
													+ "\" id=\""
													+ A.region
													+ "\" class=\"mini-layout-split\"><div class=\"mini-layout-spliticon\"></div></div>");
							A._split = this._borderEl.lastChild;
							mini.addClass(A._split, "mini-layout-split-"
									+ A.region)
						}
						if (A.region != "center") {
							mini.append(this._borderEl, "<div id=\"" + A.region
									+ "\" class=\"mini-layout-proxy\"></div>");
							A._proxy = this._borderEl.lastChild;
							mini.addClass(A._proxy, "mini-layout-proxy-"
									+ A.region)
						}
					},
					setRegionControls : function(C, A) {
						var C = this.getRegion(C);
						if (!C)
							return;
						var B = this.getRegionBodyEl(C);
						__mini_setControls(A, B, this)
					},
					setRegions : function(C) {
						if (!mini.isArray(C))
							return;
						for ( var A = 0, B = C.length; A < B; A++)
							this.addRegion(C[A])
					},
					addRegion : function(F, A) {
						var I = F;
						F = this._createRegion(F);
						if (!F.region)
							F.region = "center";
						F.region = F.region.toLowerCase();
						if (F.region == "center" && I && !I.showHeader)
							F.showHeader = false;
						if (F.region == "north" || F.region == "south")
							if (!I.collapseSize)
								F.collapseSize = this.collapseHeight;
						this._measureRegion(F);
						if (typeof A != "number")
							A = this.regions.length;
						var C = this.regionMap[F.region];
						if (C)
							return;
						this.regions.insert(A, F);
						this.regionMap[F.region] = F;
						this._CreateRegionEl(F);
						var D = this.getRegionBodyEl(F), E = F.body;
						delete F.body;
						if (E) {
							if (!mini.isArray(E))
								E = [ E ];
							for ( var B = 0, H = E.length; B < H; B++)
								mini.append(D, E[B])
						}
						if (F.bodyParent) {
							var G = F.bodyParent;
							while (G.firstChild)
								D.appendChild(G.firstChild)
						}
						delete F.bodyParent;
						if (F.controls) {
							this.setRegionControls(F, F.controls);
							delete F.controls
						}
						this.doUpdate()
					},
					removeRegion : function(A) {
						var A = this.getRegion(A);
						if (!A)
							return;
						this.regions.remove(A);
						delete this.regionMap[A.region];
						jQuery(A._el).remove();
						jQuery(A._split).remove();
						jQuery(A._proxy).remove();
						this.doUpdate()
					},
					moveRegion : function(C, A) {
						var C = this.getRegion(C);
						if (!C)
							return;
						var B = this.regions[A];
						if (!B || B == C)
							return;
						this.regions.remove(C);
						var A = this.region.indexOf(B);
						this.regions.insert(A, C);
						this.doUpdate()
					},
					_measureRegion : function(A) {
						var B = this._getButton(A, "close");
						B.visible = A.showCloseButton;
						B = this._getButton(A, "collapse");
						B.visible = A.showCollapseButton;
						if (A.width < A.minWidth)
							A.width = mini.minWidth;
						if (A.width > A.maxWidth)
							A.width = mini.maxWidth;
						if (A.height < A.minHeight)
							A.height = mini.minHeight;
						if (A.height > A.maxHeight)
							A.height = mini.maxHeight
					},
					updateRegion : function(A, B) {
						A = this.getRegion(A);
						if (!A)
							return;
						if (B)
							delete B.region;
						mini.copyTo(A, B);
						this._measureRegion(A);
						this.doUpdate()
					},
					expandRegion : function(A) {
						A = this.getRegion(A);
						if (!A)
							return;
						A.expanded = true;
						this.doUpdate()
					},
					collapseRegion : function(A) {
						A = this.getRegion(A);
						if (!A)
							return;
						A.expanded = false;
						this.doUpdate()
					},
					toggleRegion : function(A) {
						A = this.getRegion(A);
						if (!A)
							return;
						if (A.expanded)
							this.collapseRegion(A);
						else
							this.expandRegion(A)
					},
					showRegion : function(A) {
						A = this.getRegion(A);
						if (!A)
							return;
						A.visible = true;
						this.doUpdate()
					},
					hideRegion : function(A) {
						A = this.getRegion(A);
						if (!A)
							return;
						A.visible = false;
						this.doUpdate()
					},
					isExpandRegion : function(A) {
						A = this.getRegion(A);
						if (!A)
							return null;
						return this.region.expanded
					},
					isVisibleRegion : function(A) {
						A = this.getRegion(A);
						if (!A)
							return null;
						return this.region.visible
					},
					_tryToggleRegion : function(A) {
						A = this.getRegion(A);
						var B = {
							region : A,
							cancel : false
						};
						if (A.expanded) {
							this.fire("BeforeCollapse", B);
							if (B.cancel == false)
								this.collapseRegion(A)
						} else {
							this.fire("BeforeExpand", B);
							if (B.cancel == false)
								this.expandRegion(A)
						}
					},
					_getProxyElByEvent : function(B) {
						var A = mini.findParent(B.target, "mini-layout-proxy");
						return A
					},
					_getRegionElByEvent : function(B) {
						var A = mini.findParent(B.target, "mini-layout-region");
						return A
					},
					__OnClick : function(F) {
						if (this._inAniming)
							return;
						var C = this._getProxyElByEvent(F);
						if (C) {
							var B = C.id, E = mini.findParent(F.target,
									"mini-tools-collapse");
							if (E)
								this._tryToggleRegion(B);
							else
								this._VirtualToggle(B)
						}
						var D = this._getRegionElByEvent(F);
						if (D
								&& mini.findParent(F.target,
										"mini-layout-region-header")) {
							B = D.id, E = mini.findParent(F.target,
									"mini-tools-collapse");
							if (E)
								this._tryToggleRegion(B);
							var A = mini.findParent(F.target,
									"mini-tools-close");
							if (A)
								this.updateRegion(B, {
									visible : false
								})
						}
						if (mini.hasClass(F.target, "mini-layout-spliticon")) {
							B = F.target.parentNode.id;
							this._tryToggleRegion(B)
						}
					},
					_OnButtonClick : function(B, C, A) {
						this.fire("buttonclick", {
							htmlEvent : A,
							region : B,
							button : C,
							index : this.buttons.indexOf(C),
							name : C.name
						})
					},
					_OnButtonMouseDown : function(B, C, A) {
						this.fire("buttonmousedown", {
							htmlEvent : A,
							region : B,
							button : C,
							index : this.buttons.indexOf(C),
							name : C.name
						})
					},
					hoverProxyEl : null,
					__OnMouseOver : function(B) {
						var A = this._getProxyElByEvent(B);
						if (A) {
							mini.addClass(A, "mini-layout-proxy-hover");
							this.hoverProxyEl = A
						}
					},
					__OnMouseOut : function(A) {
						if (this.hoverProxyEl)
							mini.removeClass(this.hoverProxyEl,
									"mini-layout-proxy-hover");
						this.hoverProxyEl = null
					},
					onButtonClick : function(B, A) {
						this.on("buttonclick", B, A)
					},
					onButtonMouseDown : function(B, A) {
						this.on("buttonmousedown", B, A)
					}
				});
mini
		.copyTo(
				mini.Layout.prototype,
				{
					_createHeader : function(B, C) {
						var E = "<div class=\"mini-tools\">";
						if (C)
							E += "<span class=\"mini-tools-collapse\"></span>";
						else
							for ( var A = B.buttons.length - 1; A >= 0; A--) {
								var D = B.buttons[A];
								E += "<span class=\"" + D.cls + "\" style=\"";
								E += D.style + ";"
										+ (D.visible ? "" : "display:none;")
										+ "\">" + D.html + "</span>"
							}
						E += "</div>";
						E += "<div class=\"mini-layout-region-icon "
								+ B.iconCls
								+ "\" style=\""
								+ B.iconStyle
								+ ";"
								+ ((B.iconStyle || B.iconCls) ? ""
										: "display:none;") + "\"></div>";
						E += "<div class=\"mini-layout-region-title\">"
								+ B.title + "</div>";
						return E
					},
					doUpdate : function() {
						for ( var A = 0, G = this.regions.length; A < G; A++) {
							var D = this.regions[A], B = D.region, C = D._el, F = D._split, E = D._proxy;
							if (D.cls)
								mini.addClass(C, D.cls);
							D._header.style.display = D.showHeader ? ""
									: "none";
							D._header.innerHTML = this._createHeader(D);
							if (D._proxy)
								D._proxy.innerHTML = this
										._createHeader(D, true);
							if (F) {
								mini.removeClass(F, "mini-layout-split-nodrag");
								if (D.expanded == false || !D.allowResize)
									mini
											.addClass(F,
													"mini-layout-split-nodrag")
							}
						}
						this.doLayout()
					},
					doLayout : function() {
						if (!this.canLayout())
							return;
						if (this._inAniming)
							return;
						var E = mini.getHeight(this.el, true), B = mini
								.getWidth(this.el, true), F = {
							x : 0,
							y : 0,
							width : B,
							height : E
						}, K = this.regions.clone(), R = this
								.getRegion("center");
						K.remove(R);
						if (R)
							K.push(R);
						for ( var M = 0, J = K.length; M < J; M++) {
							var G = K[M];
							G._Expanded = false;
							mini.removeClass(G._el, "mini-layout-popup");
							var C = G.region, N = G._el, H = G._split, I = G._proxy;
							if (G.visible == false) {
								N.style.display = "none";
								if (C != "center")
									H.style.display = I.style.display = "none";
								continue
							}
							N.style.display = "";
							if (C != "center")
								H.style.display = I.style.display = "";
							var T = F.x, Q = F.y, B = F.width, E = F.height, D = G.width, L = G.height;
							if (!G.expanded)
								if (C == "west" || C == "east") {
									D = G.collapseSize;
									mini.setWidth(N, G.width)
								} else if (C == "north" || C == "south") {
									L = G.collapseSize;
									mini.setHeight(N, G.height)
								}
							switch (C) {
							case "north":
								E = L;
								F.y += L;
								F.height -= L;
								break;
							case "south":
								E = L;
								Q = F.y + F.height - L;
								F.height -= L;
								break;
							case "west":
								B = D;
								F.x += D;
								F.width -= D;
								break;
							case "east":
								B = D;
								T = F.x + F.width - D;
								F.width -= D;
								break;
							case "center":
								break;
							default:
								continue
							}
							if (B < 0)
								B = 0;
							if (E < 0)
								E = 0;
							if (C == "west" || C == "east")
								mini.setHeight(N, E);
							if (C == "north" || C == "south")
								mini.setWidth(N, B);
							var P = "left:" + T + "px;top:" + Q + "px;", A = N;
							if (!G.expanded) {
								A = I;
								N.style.top = "-100px";
								N.style.left = "-1500px"
							} else if (I) {
								I.style.left = "-1500px";
								I.style.top = "-100px"
							}
							A.style.left = T + "px";
							A.style.top = Q + "px";
							mini.setWidth(A, B);
							mini.setHeight(A, E);
							var O = jQuery(G._el).height(), S = G.showHeader ? jQuery(
									G._header).outerHeight()
									: 0;
							mini.setHeight(G._body, O - S);
							if (C == "center")
								continue;
							D = L = G.splitSize;
							T = F.x, Q = F.y, B = F.width, E = F.height;
							switch (C) {
							case "north":
								E = L;
								F.y += L;
								F.height -= L;
								break;
							case "south":
								E = L;
								Q = F.y + F.height - L;
								F.height -= L;
								break;
							case "west":
								B = D;
								F.x += D;
								F.width -= D;
								break;
							case "east":
								B = D;
								T = F.x + F.width - D;
								F.width -= D;
								break;
							case "center":
								break
							}
							if (B < 0)
								B = 0;
							if (E < 0)
								E = 0;
							H.style.left = T + "px";
							H.style.top = Q + "px";
							mini.setWidth(H, B);
							mini.setHeight(H, E);
							if (G.showSplit && G.expanded
									&& G.allowResize == true)
								mini.removeClass(H, "mini-layout-split-nodrag");
							else
								mini.addClass(H, "mini-layout-split-nodrag");
							H.firstChild.style.display = G.showSplitIcon ? "block"
									: "none";
							if (G.expanded)
								mini.removeClass(H.firstChild,
										"mini-layout-spliticon-collapse");
							else
								mini.addClass(H.firstChild,
										"mini-layout-spliticon-collapse")
						}
						mini.layout(this._borderEl);
						this.fire("layout")
					},
					__OnMouseDown : function(D) {
						if (this._inAniming)
							return;
						if (mini.findParent(D.target, "mini-layout-split")) {
							var C = jQuery(D.target).attr("uid");
							if (C != this.uid)
								return;
							var B = this.getRegion(D.target.id);
							if (B.expanded == false || !B.allowResize
									|| !B.showSplit)
								return;
							this.dragRegion = B;
							var A = this._getDrag();
							A.start(D)
						}
					},
					_getDrag : function() {
						if (!this.drag)
							this.drag = new mini.Drag( {
								capture : true,
								onStart : mini.createDelegate(
										this._OnDragStart, this),
								onMove : mini.createDelegate(this._OnDragMove,
										this),
								onStop : mini.createDelegate(this._OnDragStop,
										this)
							});
						return this.drag
					},
					_OnDragStart : function(A) {
						this._maskProxy = mini.append(document.body,
								"<div class=\"mini-resizer-mask\"></div>");
						this._dragProxy = mini.append(document.body,
								"<div class=\"mini-proxy\"></div>");
						this._dragProxy.style.cursor = "n-resize";
						if (this.dragRegion.region == "west"
								|| this.dragRegion.region == "east")
							this._dragProxy.style.cursor = "w-resize";
						this.splitBox = mini.getBox(this.dragRegion._split);
						mini.setBox(this._dragProxy, this.splitBox);
						this.elBox = mini.getBox(this.el, true)
					},
					_OnDragMove : function(E) {
						var K = E.now[0] - E.init[0], X = this.splitBox.x + K, C = E.now[1]
								- E.init[1], W = this.splitBox.y + C, M = X
								+ this.splitBox.width, V = W
								+ this.splitBox.height, I = this
								.getRegion("west"), N = this.getRegion("east"), H = this
								.getRegion("north"), F = this
								.getRegion("south"), J = this
								.getRegion("center"), Q = I && I.visible ? I.width
								: 0, S = N && N.visible ? N.width : 0, T = H
								&& H.visible ? H.height : 0, L = F && F.visible ? F.height
								: 0, R = I && I.showSplit ? mini
								.getWidth(I._split) : 0, A = N && N.showSplit ? mini
								.getWidth(N._split)
								: 0, D = H && H.showSplit ? mini
								.getHeight(H._split) : 0, U = F && F.showSplit ? mini
								.getHeight(F._split)
								: 0, G = this.dragRegion, P = G.region;
						if (P == "west") {
							var O = this.elBox.width - S - A - R - J.minWidth;
							if (X - this.elBox.x > O)
								X = O + this.elBox.x;
							if (X - this.elBox.x < G.minWidth)
								X = G.minWidth + this.elBox.x;
							if (X - this.elBox.x > G.maxWidth)
								X = G.maxWidth + this.elBox.x;
							mini.setX(this._dragProxy, X)
						} else if (P == "east") {
							O = this.elBox.width - Q - R - A - J.minWidth;
							if (this.elBox.right - (X + this.splitBox.width) > O)
								X = this.elBox.right - O - this.splitBox.width;
							if (this.elBox.right - (X + this.splitBox.width) < G.minWidth)
								X = this.elBox.right - G.minWidth
										- this.splitBox.width;
							if (this.elBox.right - (X + this.splitBox.width) > G.maxWidth)
								X = this.elBox.right - G.maxWidth
										- this.splitBox.width;
							mini.setX(this._dragProxy, X)
						} else if (P == "north") {
							var B = this.elBox.height - L - U - D - J.minHeight;
							if (W - this.elBox.y > B)
								W = B + this.elBox.y;
							if (W - this.elBox.y < G.minHeight)
								W = G.minHeight + this.elBox.y;
							if (W - this.elBox.y > G.maxHeight)
								W = G.maxHeight + this.elBox.y;
							mini.setY(this._dragProxy, W)
						} else if (P == "south") {
							B = this.elBox.height - T - D - U - J.minHeight;
							if (this.elBox.bottom - (W + this.splitBox.height) > B)
								W = this.elBox.bottom - B
										- this.splitBox.height;
							if (this.elBox.bottom - (W + this.splitBox.height) < G.minHeight)
								W = this.elBox.bottom - G.minHeight
										- this.splitBox.height;
							if (this.elBox.bottom - (W + this.splitBox.height) > G.maxHeight)
								W = this.elBox.bottom - G.maxHeight
										- this.splitBox.height;
							mini.setY(this._dragProxy, W)
						}
					},
					_OnDragStop : function(D) {
						var E = mini.getBox(this._dragProxy), F = this.dragRegion, C = F.region;
						if (C == "west") {
							var A = E.x - this.elBox.x;
							this.updateRegion(F, {
								width : A
							})
						} else if (C == "east") {
							A = this.elBox.right - E.right;
							this.updateRegion(F, {
								width : A
							})
						} else if (C == "north") {
							var B = E.y - this.elBox.y;
							this.updateRegion(F, {
								height : B
							})
						} else if (C == "south") {
							B = this.elBox.bottom - E.bottom;
							this.updateRegion(F, {
								height : B
							})
						}
						jQuery(this._dragProxy).remove();
						this._dragProxy = null;
						this.elBox = this.handlerBox = null;
						jQuery(this._maskProxy).remove();
						this._maskProxy = null
					},
					_VirtualToggle : function(A) {
						A = this.getRegion(A);
						if (A._Expanded === true)
							this._VirtualCollapse(A);
						else
							this._VirtualExpand(A)
					},
					_VirtualExpand : function(F) {
						if (this._inAniming)
							return;
						this.doLayout();
						var C = F.region, J = F._el;
						F._Expanded = true;
						mini.addClass(J, "mini-layout-popup");
						var G = mini.getBox(F._proxy), D = mini.getBox(F._el), H = {};
						if (C == "east") {
							var M = G.x, L = G.y, E = G.height;
							mini.setHeight(J, E);
							mini.setX(J, M);
							J.style.top = F._proxy.style.top;
							var K = parseInt(J.style.left);
							H = {
								left : K - D.width
							}
						} else if (C == "west") {
							M = G.right - D.width, L = G.y, E = G.height;
							mini.setHeight(J, E);
							mini.setX(J, M);
							J.style.top = F._proxy.style.top;
							K = parseInt(J.style.left);
							H = {
								left : K + D.width
							}
						} else if (C == "north") {
							var M = G.x, L = G.bottom - D.height, B = G.width;
							mini.setWidth(J, B);
							mini.setXY(J, M, L);
							var A = parseInt(J.style.top);
							H = {
								top : A + D.height
							}
						} else if (C == "south") {
							M = G.x, L = G.y, B = G.width;
							mini.setWidth(J, B);
							mini.setXY(J, M, L);
							A = parseInt(J.style.top);
							H = {
								top : A - D.height
							}
						}
						mini.addClass(F._proxy, "mini-layout-maxZIndex");
						this._inAniming = true;
						var I = this, N = jQuery(J);
						N.animate(H, 250,
								function() {
									mini.removeClass(F._proxy,
											"mini-layout-maxZIndex");
									I._inAniming = false
								})
					},
					_VirtualCollapse : function(H) {
						if (this._inAniming)
							return;
						H._Expanded = false;
						var D = H.region, G = H._el, F = mini.getBox(G), B = {};
						if (D == "east") {
							var E = parseInt(G.style.left);
							B = {
								left : E + F.width
							}
						} else if (D == "west") {
							E = parseInt(G.style.left);
							B = {
								left : E - F.width
							}
						} else if (D == "north") {
							var A = parseInt(G.style.top);
							B = {
								top : A - F.height
							}
						} else if (D == "south") {
							A = parseInt(G.style.top);
							B = {
								top : A + F.height
							}
						}
						mini.addClass(H._proxy, "mini-layout-maxZIndex");
						this._inAniming = true;
						var C = this, I = jQuery(G);
						I.animate(B, 250,
								function() {
									mini.removeClass(H._proxy,
											"mini-layout-maxZIndex");
									C._inAniming = false;
									C.doLayout()
								})
					},
					__OnDocMouseDown : function(D) {
						if (this._inAniming)
							return;
						for ( var A = 0, C = this.regions.length; A < C; A++) {
							var B = this.regions[A];
							if (!B._Expanded)
								continue;
							if (mini.isAncestor(B._el, D.target)
									|| mini.isAncestor(B._proxy, D.target))
								;
							else
								this._VirtualCollapse(B)
						}
					},
					getAttrs : function(C) {
						var J = mini.Layout.superclass.getAttrs.call(this, C), I = jQuery(C), G = parseInt(I
								.attr("splitSize"));
						if (!isNaN(G))
							J.splitSize = G;
						var H = [], F = mini.getChildNodes(C);
						for ( var B = 0, E = F.length; B < E; B++) {
							var D = F[B], A = {};
							H.push(A);
							A.cls = D.className;
							A.style = D.style.cssText;
							mini._ParseString(D, A, [ "region", "title",
									"iconCls", "iconStyle", "cls", "headerCls",
									"headerStyle", "bodyCls", "bodyStyle" ]);
							mini._ParseBool(D, A, [ "allowResize", "visible",
									"showCloseButton", "showCollapseButton",
									"showSplit", "showHeader", "expanded",
									"showSplitIcon" ]);
							mini._ParseInt(D, A, [ "splitSize", "collapseSize",
									"width", "height", "minWidth", "minHeight",
									"maxWidth", "maxHeight" ]);
							A.bodyParent = D
						}
						J.regions = H;
						return J
					}
				});
mini.regClass(mini.Layout, "layout");
mini.Box = function() {
	mini.Box.superclass.constructor.call(this)
};
mini.extend(mini.Box, mini.Container, {
	style : "",
	borderStyle : "",
	bodyStyle : "",
	uiCls : "mini-box",
	_create : function() {
		this.el = document.createElement("div");
		this.el.className = "mini-box";
		this.el.innerHTML = "<div class=\"mini-box-border\"></div>";
		this._bodyEl = this._borderEl = this.el.firstChild;
		this._contentEl = this._bodyEl
	},
	_initEvents : function() {
	},
	doLayout : function() {
		if (!this.canLayout())
			return;
		var E = this.isAutoHeight(), G = this.isAutoWidth(), D = mini
				.getPaddings(this._bodyEl), F = mini.getMargins(this._bodyEl);
		if (!E) {
			var C = this.getHeight(true);
			if (jQuery.boxModel)
				C = C - D.top - D.bottom;
			C = C - F.top - F.bottom;
			if (C < 0)
				C = 0;
			this._bodyEl.style.height = C + "px"
		} else
			this._bodyEl.style.height = "";
		var A = this.getWidth(true), B = A;
		A = A - F.left - F.right;
		if (jQuery.boxModel)
			A = A - D.left - D.right;
		if (A < 0)
			A = 0;
		this._bodyEl.style.width = A + "px";
		mini.layout(this._borderEl);
		this.fire("layout")
	},
	setBody : function(B) {
		if (!B)
			return;
		if (!mini.isArray(B))
			B = [ B ];
		for ( var A = 0, C = B.length; A < C; A++)
			mini.append(this._bodyEl, B[A]);
		mini.parse(this._bodyEl);
		this.doLayout()
	},
	set_bodyParent : function(A) {
		if (!A)
			return;
		var B = this._bodyEl, C = A;
		while (C.firstChild)
			B.appendChild(C.firstChild);
		this.doLayout()
	},
	setBodyStyle : function(A) {
		mini.setStyle(this._bodyEl, A);
		this.doLayout()
	},
	getAttrs : function(A) {
		var B = mini.Box.superclass.getAttrs.call(this, A);
		B._bodyParent = A;
		mini._ParseString(A, B, [ "bodyStyle" ]);
		return B
	}
});
mini.regClass(mini.Box, "box");
mini.Include = function() {
	mini.Include.superclass.constructor.call(this)
};
mini.extend(mini.Include, mini.Control, {
	url : "",
	uiCls : "mini-include",
	_create : function() {
		this.el = document.createElement("div");
		this.el.className = "mini-include"
	},
	_initEvents : function() {
	},
	doLayout : function() {
		if (!this.canLayout())
			return;
		var C = this.el.childNodes;
		if (C)
			for ( var A = 0, D = C.length; A < D; A++) {
				var B = C[A];
				mini.layout(B)
			}
	},
	setUrl : function(A) {
		this.url = A;
		mini.update( {
			url : this.url,
			el : this.el,
			async : this.async
		});
		this.doLayout()
	},
	getUrl : function(A) {
		return this.url
	},
	getAttrs : function(A) {
		var B = mini.Include.superclass.getAttrs.call(this, A);
		mini._ParseString(A, B, [ "url" ]);
		return B
	}
});
mini.regClass(mini.Include, "include");
mini.Tabs = function() {
	this._initTabs();
	mini.Tabs.superclass.constructor.call(this)
};
mini
		.extend(
				mini.Tabs,
				mini.Control,
				{
					activeIndex : -1,
					tabAlign : "left",
					tabPosition : "top",
					showBody : true,
					nameField : "id",
					titleField : "title",
					urlField : "url",
					url : "",
					maskOnLoad : true,
					plain : true,
					bodyStyle : "",
					_tabHoverCls : "mini-tab-hover",
					_tabActiveCls : "mini-tab-active",
					set : function(A) {
						if (typeof A == "string")
							return this;
						var B = this._allowLayout;
						this._allowLayout = false;
						var C = A.activeIndex;
						delete A.activeIndex;
						var D = A.url;
						delete A.url;
						mini.Tabs.superclass.set.call(this, A);
						if (D)
							this.setUrl(D);
						if (mini.isNumber(C))
							this.setActiveIndex(C);
						this._allowLayout = B;
						this.doLayout();
						return this
					},
					uiCls : "mini-tabs",
					_create : function() {
						this.el = document.createElement("div");
						this.el.className = "mini-tabs";
						var B = "<table class=\"mini-tabs-table\" cellspacing=\"0\" cellpadding=\"0\"><tr style=\"width:100%;\">"
								+ "<td></td>"
								+ "<td style=\"text-align:left;vertical-align:top;width:100%;\"><div class=\"mini-tabs-bodys\"></div></td>"
								+ "<td></td>" + "</tr></table>";
						this.el.innerHTML = B;
						this._tableEl = this.el.firstChild;
						var A = this.el.getElementsByTagName("td");
						this._td1El = A[0];
						this._td2El = A[1];
						this._td3El = A[2];
						this._bodyEl = this._td2El.firstChild;
						this._borderEl = this._bodyEl;
						this.doUpdate()
					},
					_doClearElement : function() {
						mini.removeClass(this._td1El, "mini-tabs-header");
						mini.removeClass(this._td3El, "mini-tabs-header");
						this._td1El.innerHTML = "";
						this._td3El.innerHTML = "";
						mini.removeChilds(this._td2El, this._bodyEl)
					},
					_initEvents : function() {
						mini._BindEvents(function() {
							mini.on(this.el, "mousedown", this.__OnMouseDown,
									this);
							mini.on(this.el, "click", this.__OnClick, this);
							mini.on(this.el, "mouseover", this.__OnMouseOver,
									this);
							mini.on(this.el, "mouseout", this.__OnMouseOut,
									this)
						}, this)
					},
					_initTabs : function() {
						this.tabs = []
					},
					_TabID : 1,
					createTab : function(B) {
						var A = mini.copyTo( {
							_id : this._TabID++,
							name : "",
							title : "",
							newLine : false,
							iconCls : "",
							iconStyle : "",
							headerCls : "",
							headerStyle : "",
							bodyCls : "",
							bodyStyle : "",
							visible : true,
							enabled : true,
							showCloseButton : false,
							active : false,
							url : "",
							loaded : false,
							refreshOnClick : false
						}, B);
						if (B) {
							B = mini.copyTo(B, A);
							A = B
						}
						return A
					},
					_doLoad : function() {
						var B = mini.getData(this.url);
						if (!B)
							B = [];
						for ( var A = 0, D = B.length; A < D; A++) {
							var C = B[A];
							C.title = C[this.titleField];
							C.url = C[this.urlField];
							C.name = C[this.nameField]
						}
						this.setTabs(B);
						this.fire("load")
					},
					load : function(A) {
						if (typeof A == "string")
							this.setUrl(A);
						else
							this.setTabs(A)
					},
					setUrl : function(A) {
						this.url = A;
						this._doLoad()
					},
					getUrl : function() {
						return this.url
					},
					setNameField : function(A) {
						this.nameField = A
					},
					getNameField : function() {
						return this.nameField
					},
					setTitleField : function(A) {
						this.titleField = A
					},
					getTitleField : function() {
						return this.titleField
					},
					setUrlField : function(A) {
						this.urlField = A
					},
					getUrlField : function() {
						return this.urlField
					},
					setTabControls : function(C, A) {
						var C = this.getTab(C);
						if (!C)
							return;
						var B = this.getTabBodyEl(C);
						__mini_setControls(A, B, this)
					},
					setTabs : function(B) {
						if (!mini.isArray(B))
							return;
						this.beginUpdate();
						this.removeAll();
						for ( var A = 0, C = B.length; A < C; A++)
							this.addTab(B[A]);
						this.setActiveIndex(0);
						this.endUpdate()
					},
					getTabs : function() {
						return this.tabs
					},
					removeAll : function(C) {
						var G = this.getActiveTab();
						if (mini.isNull(C))
							C = [];
						if (!mini.isArray(C))
							C = [ C ];
						for ( var A = C.length - 1; A >= 0; A--) {
							var D = this.getTab(C[A]);
							if (!D)
								C.removeAt(A);
							else
								C[A] = D
						}
						var B = this.tabs;
						for (A = B.length - 1; A >= 0; A--) {
							var F = B[A];
							if (C.indexOf(F) == -1)
								this.removeTab(F)
						}
						var E = C[0];
						if (G != this.getActiveTab())
							if (E)
								this.activeTab(E)
					},
					addTab : function(E, A) {
						if (typeof E == "string")
							E = {
								title : E
							};
						E = this.createTab(E);
						if (!E.name)
							E.name = "";
						if (typeof A != "number")
							A = this.tabs.length;
						this.tabs.insert(A, E);
						var H = this._createTabBodyId(E), I = "<div id=\"" + H
								+ "\" class=\"mini-tabs-body " + E.bodyCls
								+ "\" style=\"" + E.bodyStyle
								+ ";display:none;\"></div>";
						mini.append(this._bodyEl, I);
						var C = this.getTabBodyEl(E), D = E.body;
						delete E.body;
						if (D) {
							if (!mini.isArray(D))
								D = [ D ];
							for ( var B = 0, G = D.length; B < G; B++)
								mini.append(C, D[B])
						}
						if (E.bodyParent) {
							var F = E.bodyParent;
							while (F.firstChild)
								C.appendChild(F.firstChild)
						}
						delete E.bodyParent;
						if (E.controls) {
							this.setTabControls(E, E.controls);
							delete E.controls
						}
						this.doUpdate();
						return E
					},
					removeTab : function(E) {
						E = this.getTab(E);
						if (!E || this.tabs.indexOf(E) == -1)
							return;
						var F = this.getActiveTab(), D = E == F, C = this
								._OnTabDestroy(E);
						this.tabs.remove(E);
						this._doRemoveIFrame(E);
						var B = this.getTabBodyEl(E);
						if (B)
							this._bodyEl.removeChild(B);
						if (C && D) {
							for ( var A = this.activeIndex; A >= 0; A--) {
								var E = this.getTab(A);
								if (E && E.enabled && E.visible) {
									this.activeIndex = A;
									break
								}
							}
							this.doUpdate();
							this.setActiveIndex(this.activeIndex);
							this.fire("activechanged")
						} else {
							this.activeIndex = this.tabs.indexOf(F);
							this.doUpdate()
						}
						return E
					},
					moveTab : function(C, A) {
						C = this.getTab(C);
						if (!C)
							return;
						var B = this.tabs[A];
						if (!B || B == C)
							return;
						this.tabs.remove(C);
						var A = this.tabs.indexOf(B);
						this.tabs.insert(A, C);
						this.doUpdate()
					},
					updateTab : function(A, B) {
						A = this.getTab(A);
						if (!A)
							return;
						mini.copyTo(A, B);
						this.doUpdate()
					},
					_getMaskWrapEl : function() {
						return this._bodyEl
					},
					_doRemoveIFrame : function(E, C) {
						if (E._iframeEl && E._iframeEl.parentNode) {
							E._iframeEl.src = "";
							try {
								iframe.contentWindow.document.write("");
								iframe.contentWindow.document.close()
							} catch (H) {
							}
							if (E._iframeEl._ondestroy)
								E._iframeEl._ondestroy();
							try {
								E._iframeEl.parentNode.removeChild(E._iframeEl);
								E._iframeEl.removeNode(true)
							} catch (H) {
							}
						}
						E._iframeEl = null;
						E.loadedUrl = null;
						if (C === true) {
							var F = this.getTabBodyEl(E);
							if (F) {
								var D = mini.getChildNodes(F, true);
								for ( var B = 0, G = D.length; B < G; B++) {
									var A = D[B];
									if (A && A.parentNode)
										A.parentNode.removeChild(A)
								}
							}
						}
					},
					_deferLoadingTime : 180,
					_cancelLoadTabs : function(D) {
						var B = this.tabs;
						for ( var A = 0, E = B.length; A < E; A++) {
							var C = B[A];
							if (C != D)
								if (C._loading && C._iframeEl) {
									C._loading = false;
									this._doRemoveIFrame(C, true)
								}
						}
						this._loading = false;
						this.unmask()
					},
					_doLoadTab : function(C) {
						if (!C)
							return;
						var D = this.getTabBodyEl(C);
						if (!D)
							return;
						this._cancelLoadTabs();
						this._doRemoveIFrame(C, true);
						this._loading = true;
						C._loading = true;
						this.unmask();
						if (this.maskOnLoad)
							this.loading();
						var E = new Date(), A = this;
						A.isLoading = true;
						var B = mini
								.createIFrame(
										C.url,
										function(B, F) {
											try {
												C._iframeEl.contentWindow.Owner = window;
												C._iframeEl.contentWindow.CloseOwnerWindow = function(
														B) {
													C.removeAction = B;
													var D = true;
													if (C.ondestroy) {
														if (typeof C.ondestroy == "string")
															C.ondestroy = window[C.ondestroy];
														if (C.ondestroy)
															D = C.ondestroy
																	.call(this,
																			G)
													}
													if (D === false)
														return false;
													setTimeout(function() {
														A.removeTab(C)
													}, 10)
												}
											} catch (G) {
											}
											if (C._loading != true)
												return;
											var D = (E - new Date())
													+ A._deferLoadingTime;
											C._loading = false;
											C.loadedUrl = C.url;
											if (D < 0)
												D = 0;
											setTimeout(function() {
												A.unmask();
												A.doLayout();
												A.isLoading = false
											}, D);
											if (F) {
												var G = {
													sender : A,
													tab : C,
													index : A.tabs.indexOf(C),
													name : C.name,
													iframe : C._iframeEl
												};
												if (C.onload) {
													if (typeof C.onload == "string")
														C.onload = window[C.onload];
													if (C.onload)
														C.onload.call(A, G)
												}
											}
											A.fire("tabload", G)
										});
						setTimeout(function() {
							if (C._iframeEl == B)
								D.appendChild(B)
						}, 1);
						C._iframeEl = B
					},
					_OnTabDestroy : function(A) {
						var B = {
							sender : this,
							tab : A,
							index : this.tabs.indexOf(A),
							name : A.name,
							iframe : A._iframeEl,
							autoActive : true
						};
						this.fire("tabdestroy", B);
						return B.autoActive
					},
					loadTab : function(D, C, B, F) {
						if (!D)
							return;
						C = this.getTab(C);
						if (!C)
							C = this.getActiveTab();
						if (!C)
							return;
						var A = this.getTabBodyEl(C);
						if (A)
							mini.addClass(A, "mini-tabs-hideOverflow");
						C.url = D;
						delete C.loadedUrl;
						var E = this;
						clearTimeout(this._loadTabTimer);
						this._loadTabTimer = null;
						this._loadTabTimer = setTimeout(function() {
							E._doLoadTab(C)
						}, 1)
					},
					reloadTab : function(A) {
						A = this.getTab(A);
						if (!A)
							A = this.getActiveTab();
						if (!A)
							return;
						this.loadTab(A.url, A)
					},
					getTabRows : function() {
						var C = [], B = [];
						for ( var A = 0, E = this.tabs.length; A < E; A++) {
							var D = this.tabs[A];
							if (A != 0 && D.newLine) {
								C.push(B);
								B = []
							}
							B.push(D)
						}
						C.push(B);
						return C
					},
					doUpdate : function() {
						if (this._allowUpdate === false)
							return;
						mini.removeClass(this.el, "mini-tabs-position-left");
						mini.removeClass(this.el, "mini-tabs-position-top");
						mini.removeClass(this.el, "mini-tabs-position-right");
						mini.removeClass(this.el, "mini-tabs-position-bottom");
						if (this.tabPosition == "bottom") {
							mini.addClass(this.el, "mini-tabs-position-bottom");
							this._doUpdateBottom()
						} else if (this.tabPosition == "right") {
							mini.addClass(this.el, "mini-tabs-position-right");
							this._doUpdateRight()
						} else if (this.tabPosition == "left") {
							mini.addClass(this.el, "mini-tabs-position-left");
							this._doUpdateLeft()
						} else {
							mini.addClass(this.el, "mini-tabs-position-top");
							this._doUpdateTop()
						}
						this.doLayout();
						this.setActiveIndex(this.activeIndex, false)
					},
					_handleIFrameOverflow : function() {
						var B = this.getTabBodyEl(this.activeIndex);
						if (B) {
							mini.removeClass(B, "mini-tabs-hideOverflow");
							var A = mini.getChildNodes(B)[0];
							if (A && A.tagName
									&& A.tagName.toUpperCase() == "IFRAME")
								mini.addClass(B, "mini-tabs-hideOverflow")
						}
					},
					doLayout : function() {
						if (!this.canLayout())
							return;
						this._handleIFrameOverflow();
						var T = this.isAutoHeight();
						E = this.getHeight(true);
						w = this.getWidth(true);
						var I = E, Q = w;
						if (this.showBody)
							this._bodyEl.style.display = "";
						else
							this._bodyEl.style.display = "none";
						if (this.plain)
							mini.addClass(this.el, "mini-tabs-plain");
						else
							mini.removeClass(this.el, "mini-tabs-plain");
						if (!T && this.showBody) {
							var S = jQuery(this._headerEl).outerHeight(), A = jQuery(
									this._headerEl).outerWidth();
							if (this.tabPosition == "top")
								S = jQuery(this._headerEl.parentNode)
										.outerHeight();
							if (this.tabPosition == "left"
									|| this.tabPosition == "right")
								w = w - A;
							else
								E = E - S;
							if (jQuery.boxModel) {
								var F = mini.getPaddings(this._bodyEl), U = mini
										.getBorders(this._bodyEl);
								E = E - F.top - F.bottom - U.top - U.bottom;
								w = w - F.left - F.right - U.left - U.right
							}
							margin = mini.getMargins(this._bodyEl);
							E = E - margin.top - margin.bottom;
							w = w - margin.left - margin.right;
							if (E < 0)
								E = 0;
							if (w < 0)
								w = 0;
							this._bodyEl.style.width = w + "px";
							this._bodyEl.style.height = E + "px";
							if (this.tabPosition == "left"
									|| this.tabPosition == "right") {
								var K = this._headerEl
										.getElementsByTagName("tr")[0], G = K.childNodes, B = G[0]
										.getElementsByTagName("tr"), H = last = all = 0;
								for ( var M = 0, J = B.length; M < J; M++) {
									var K = B[M], P = jQuery(K).outerHeight();
									all += P;
									if (M == 0)
										H = P;
									if (M == J - 1)
										last = P
								}
								switch (this.tabAlign) {
								case "center":
									var R = parseInt((I - (all - H - last)) / 2);
									for (M = 0, J = G.length; M < J; M++) {
										G[M].firstChild.style.height = I + "px";
										var D = G[M].firstChild, B = D
												.getElementsByTagName("tr"), N = B[0], W = B[B.length - 1];
										N.style.height = R + "px";
										W.style.height = R + "px"
									}
									break;
								case "right":
									for (M = 0, J = G.length; M < J; M++) {
										var D = G[M].firstChild, B = D
												.getElementsByTagName("tr"), K = B[0], V = I
												- (all - H);
										if (V >= 0)
											K.style.height = V + "px"
									}
									break;
								case "fit":
									for (M = 0, J = G.length; M < J; M++)
										G[M].firstChild.style.height = I + "px";
									break;
								default:
									for (M = 0, J = G.length; M < J; M++) {
										D = G[M].firstChild, B = D
												.getElementsByTagName("tr"),
												K = B[B.length - 1], V = I
														- (all - last);
										if (V >= 0)
											K.style.height = V + "px"
									}
									break
								}
							}
						} else {
							this._bodyEl.style.width = "auto";
							this._bodyEl.style.height = "auto"
						}
						var C = this.getTabBodyEl(this.activeIndex);
						if (C)
							if (!T && this.showBody) {
								var E = mini.getHeight(this._bodyEl, true);
								if (jQuery.boxModel) {
									F = mini.getPaddings(C), U = mini
											.getBorders(C);
									E = E - F.top - F.bottom - U.top - U.bottom
								}
								C.style.height = E + "px"
							} else
								C.style.height = "auto";
						switch (this.tabPosition) {
						case "bottom":
							var O = this._headerEl.childNodes;
							for (M = 0, J = O.length; M < J; M++) {
								D = O[M];
								mini.removeClass(D, "mini-tabs-header2");
								if (J > 1 && M != 0)
									mini.addClass(D, "mini-tabs-header2")
							}
							break;
						case "left":
							G = this._headerEl.firstChild.rows[0].cells;
							for (M = 0, J = G.length; M < J; M++) {
								var L = G[M];
								mini.removeClass(L, "mini-tabs-header2");
								if (J > 1 && M == 0)
									mini.addClass(L, "mini-tabs-header2")
							}
							break;
						case "right":
							G = this._headerEl.firstChild.rows[0].cells;
							for (M = 0, J = G.length; M < J; M++) {
								L = G[M];
								mini.removeClass(L, "mini-tabs-header2");
								if (J > 1 && M != 0)
									mini.addClass(L, "mini-tabs-header2")
							}
							break;
						default:
							O = this._headerEl.childNodes;
							for (M = 0, J = O.length; M < J; M++) {
								D = O[M];
								mini.removeClass(D, "mini-tabs-header2");
								if (J > 1 && M == 0)
									mini.addClass(D, "mini-tabs-header2")
							}
							break
						}
						mini.removeClass(this.el, "mini-tabs-scroll");
						if (this.tabPosition == "top") {
							mini.setWidth(this._headerEl, Q);
							if (this._headerEl.offsetWidth < this._headerEl.scrollWidth) {
								mini.setWidth(this._headerEl, Q - 60);
								mini.addClass(this.el, "mini-tabs-scroll")
							}
							if (isIE && !jQuery.boxModel)
								this._leftButtonEl.style.left = "-26px"
						}
						this._doScrollButton();
						mini.layout(this._bodyEl);
						this.fire("layout")
					},
					setTabAlign : function(A) {
						this.tabAlign = A;
						this.doUpdate()
					},
					setTabPosition : function(A) {
						this.tabPosition = A;
						this.doUpdate()
					},
					getTab : function(A) {
						if (typeof A == "object")
							return A;
						if (typeof A == "number")
							return this.tabs[A];
						else
							for ( var B = 0, D = this.tabs.length; B < D; B++) {
								var C = this.tabs[B];
								if (C.name == A)
									return C
							}
					},
					getHeaderEl : function() {
						return this._headerEl
					},
					getBodyEl : function() {
						return this._bodyEl
					},
					getTabEl : function(A) {
						var E = this.getTab(A);
						if (!E)
							return null;
						var G = this._createTabId(E), D = this.el
								.getElementsByTagName("*");
						for ( var B = 0, F = D.length; B < F; B++) {
							var C = D[B];
							if (C.id == G)
								return C
						}
						return null
					},
					getTabBodyEl : function(A) {
						var E = this.getTab(A);
						if (!E)
							return null;
						var G = this._createTabBodyId(E), D = this._bodyEl.childNodes;
						for ( var B = 0, F = D.length; B < F; B++) {
							var C = D[B];
							if (C.id == G)
								return C
						}
						return null
					},
					getTabIFrameEl : function(A) {
						var B = this.getTab(A);
						if (!B)
							return null;
						return B._iframeEl
					},
					_createTabId : function(A) {
						return this.uid + "$" + A._id
					},
					_createTabBodyId : function(A) {
						return this.uid + "$body$" + A._id
					},
					_doScrollButton : function() {
						if (this.tabPosition == "top") {
							mini.removeClass(this._leftButtonEl,
									"mini-disabled");
							mini.removeClass(this._rightButtonEl,
									"mini-disabled");
							if (this._headerEl.scrollLeft == 0)
								mini.addClass(this._leftButtonEl,
										"mini-disabled");
							var B = this.getTabEl(this.tabs.length - 1);
							if (B) {
								var A = mini.getBox(B), C = mini
										.getBox(this._headerEl);
								if (A.right <= C.right)
									mini.addClass(this._rightButtonEl,
											"mini-disabled")
							}
						}
					},
					setActiveIndex : function(A, K) {
						var O = this.getTab(A), E = this
								.getTab(this.activeIndex), P = O != E, M = this
								.getTabBodyEl(this.activeIndex);
						if (M)
							M.style.display = "none";
						if (O)
							this.activeIndex = this.tabs.indexOf(O);
						else
							this.activeIndex = -1;
						M = this.getTabBodyEl(this.activeIndex);
						if (M)
							M.style.display = "";
						M = this.getTabEl(E);
						if (M)
							mini.removeClass(M, this._tabActiveCls);
						M = this.getTabEl(O);
						if (M)
							mini.addClass(M, this._tabActiveCls);
						if (M && P) {
							if (this.tabPosition == "bottom") {
								var C = mini.findParent(M, "mini-tabs-header");
								if (C)
									jQuery(this._headerEl).prepend(C)
							} else if (this.tabPosition == "left") {
								var I = mini.findParent(M, "mini-tabs-header").parentNode;
								if (I)
									I.parentNode.appendChild(I)
							} else if (this.tabPosition == "right") {
								I = mini.findParent(M, "mini-tabs-header").parentNode;
								if (I)
									jQuery(I.parentNode).prepend(I)
							} else {
								C = mini.findParent(M, "mini-tabs-header");
								if (C)
									this._headerEl.appendChild(C)
							}
							var D = this._headerEl.scrollLeft;
							this.doLayout();
							var B = this.getTabRows();
							if (B.length > 1)
								;
							else {
								if (this.tabPosition == "top") {
									this._headerEl.scrollLeft = D;
									var Q = this.getTabEl(this.activeIndex);
									if (Q) {
										var L = this, N = mini.getBox(Q), H = mini
												.getBox(L._headerEl);
										if (N.x < H.x)
											L._headerEl.scrollLeft -= (H.x - N.x);
										else if (N.right > H.right)
											L._headerEl.scrollLeft += (N.right - H.right)
									}
								}
								this._doScrollButton()
							}
							for ( var J = 0, G = this.tabs.length; J < G; J++) {
								Q = this.getTabEl(this.tabs[J]);
								if (Q)
									mini.removeClass(Q, this._tabHoverCls)
							}
						}
						var F = this;
						if (P) {
							var R = {
								tab : O,
								index : this.tabs.indexOf(O),
								name : O ? O.name : ""
							};
							setTimeout(function() {
								F.fire("ActiveChanged", R)
							}, 1)
						}
						this._cancelLoadTabs(O);
						if (K !== false)
							if (O && O.url && !O.loadedUrl) {
								F = this;
								F.loadTab(O.url, O)
							}
						if (F.canLayout()) {
							try {
								mini.layoutIFrames(F.el)
							} catch (R) {
							}
						}
					},
					getActiveIndex : function() {
						return this.activeIndex
					},
					activeTab : function(A) {
						this.setActiveIndex(A)
					},
					getActiveTab : function() {
						return this.getTab(this.activeIndex)
					},
					getActiveIndex : function() {
						return this.activeIndex
					},
					_tryActiveTab : function(B) {
						B = this.getTab(B);
						if (!B)
							return;
						var A = this.tabs.indexOf(B);
						if (this.activeIndex == A)
							return;
						var C = {
							tab : B,
							index : A,
							name : B.name,
							cancel : false
						};
						this.fire("BeforeActiveChanged", C);
						if (C.cancel == false)
							this.activeTab(B)
					},
					setShowBody : function(A) {
						if (this.showBody != A) {
							this.showBody = A;
							this.doLayout()
						}
					},
					getShowBody : function() {
						return this.showBody
					},
					setBodyStyle : function(A) {
						this.bodyStyle = A;
						mini.setStyle(this._bodyEl, A);
						this.doLayout()
					},
					getBodyStyle : function() {
						return this.bodyStyle
					},
					setMaskOnLoad : function(A) {
						this.maskOnLoad = A
					},
					getMaskOnLoad : function() {
						return this.maskOnLoad
					},
					setPlain : function(A) {
						this.plain = A;
						this.doLayout()
					},
					getPlain : function() {
						return this.plain
					},
					getTabByEvent : function(A) {
						return this._getTabByEvent(A)
					},
					_getTabByEvent : function(D) {
						var C = mini.findParent(D.target, "mini-tab");
						if (!C)
							return null;
						var B = C.id.split("$");
						if (B[0] != this.uid)
							return null;
						var A = parseInt(jQuery(C).attr("index"));
						return this.getTab(A)
					},
					__OnClick : function(C) {
						var A = this._getTabByEvent(C);
						if (!A)
							return;
						if (A.enabled) {
							var B = this;
							setTimeout(
									function() {
										if (mini.findParent(C.target,
												"mini-tab-close"))
											B._OnCloseButtonClick(A, C);
										else {
											var D = A.loadedUrl;
											B._tryActiveTab(A);
											if (A.refreshOnClick && A.url == D)
												B.reloadTab(A)
										}
									}, 10)
						}
					},
					hoverTab : null,
					__OnMouseOver : function(C) {
						var A = this._getTabByEvent(C);
						if (A && A.enabled) {
							var B = this.getTabEl(A);
							mini.addClass(B, this._tabHoverCls);
							this.hoverTab = A
						}
					},
					__OnMouseOut : function(B) {
						if (this.hoverTab) {
							var A = this.getTabEl(this.hoverTab);
							mini.removeClass(A, this._tabHoverCls)
						}
						this.hoverTab = null
					},
					__OnMouseDown : function(D) {
						clearInterval(this._scrollTimer);
						if (this.tabPosition == "top") {
							var B = this, C = 0, A = 10;
							if (D.target == this._leftButtonEl)
								this._scrollTimer = setInterval(function() {
									B._headerEl.scrollLeft -= A;
									C++;
									if (C > 5)
										A = 18;
									if (C > 10)
										A = 25;
									B._doScrollButton()
								}, 25);
							else if (D.target == this._rightButtonEl)
								this._scrollTimer = setInterval(function() {
									B._headerEl.scrollLeft += A;
									C++;
									if (C > 5)
										A = 18;
									if (C > 10)
										A = 25;
									B._doScrollButton()
								}, 25);
							mini.on(document, "mouseup", this.__OnDocMouseUp,
									this)
						}
					},
					__OnDocMouseUp : function(A) {
						clearInterval(this._scrollTimer);
						this._scrollTimer = null;
						mini.un(document, "mouseup", this.__OnDocMouseUp, this)
					},
					_doUpdateTop : function() {
						var N = this.tabPosition == "top", Q = "";
						if (N) {
							Q += "<div class=\"mini-tabs-scrollCt\">";
							Q += "<a class=\"mini-tabs-leftButton\" href=\"javascript:void(0)\" hideFocus onclick=\"return false\"></a><a class=\"mini-tabs-rightButton\" href=\"javascript:void(0)\" hideFocus onclick=\"return false\"></a>"
						}
						Q += "<div class=\"mini-tabs-headers\">";
						var D = this.getTabRows();
						for ( var O = 0, C = D.length; O < C; O++) {
							var K = D[O], G = "";
							Q += "<table class=\"mini-tabs-header\" cellspacing=\"0\" cellpadding=\"0\"><tr><td class=\"mini-tabs-space mini-tabs-firstSpace\"><div></div></td>";
							for ( var L = 0, H = K.length; L < H; L++) {
								var P = K[L], I = this._createTabId(P);
								if (!P.visible)
									continue;
								var A = this.tabs.indexOf(P), G = P.headerCls
										|| "";
								if (P.enabled == false)
									G += " mini-disabled";
								Q += "<td id=\"" + I + "\" index=\"" + A
										+ "\"  class=\"mini-tab " + G
										+ "\" style=\"" + P.headerStyle + "\">";
								if (P.iconCls || P.iconStyle)
									Q += "<span class=\"mini-tab-icon "
											+ P.iconCls + "\" style=\""
											+ P.iconStyle + "\"></span>";
								Q += "<span class=\"mini-tab-text\">" + P.title
										+ "</span>";
								if (P.showCloseButton) {
									var B = "";
									if (P.enabled)
										B = "onmouseover=\"mini.addClass(this, 'mini-tab-close-hover')\" onmouseout=\"mini.removeClass(this, 'mini-tab-close-hover')\"";
									Q += "<span class=\"mini-tab-close\" " + B
											+ "></span>"
								}
								Q += "</td>";
								if (L != H - 1)
									Q += "<td class=\"mini-tabs-space2\"><div></div></td>"
							}
							Q += "<td class=\"mini-tabs-space mini-tabs-lastSpace\" ><div></div></td></tr></table>"
						}
						if (N)
							Q += "</div>";
						Q += "</div>";
						this._doClearElement();
						mini.prepend(this._td2El, Q);
						var J = this._td2El;
						this._headerEl = J.firstChild.lastChild;
						if (N) {
							this._leftButtonEl = this._headerEl.parentNode.firstChild;
							this._rightButtonEl = this._headerEl.parentNode.childNodes[1]
						}
						switch (this.tabAlign) {
						case "center":
							var M = this._headerEl.childNodes;
							for (L = 0, H = M.length; L < H; L++) {
								var E = M[L], F = E.getElementsByTagName("td");
								F[0].style.width = "50%";
								F[F.length - 1].style.width = "50%"
							}
							break;
						case "right":
							M = this._headerEl.childNodes;
							for (L = 0, H = M.length; L < H; L++) {
								E = M[L], F = E.getElementsByTagName("td");
								F[0].style.width = "100%"
							}
							break;
						case "fit":
							break;
						default:
							M = this._headerEl.childNodes;
							for (L = 0, H = M.length; L < H; L++) {
								E = M[L], F = E.getElementsByTagName("td");
								F[F.length - 1].style.width = "100%"
							}
							break
						}
					},
					_doUpdateBottom : function() {
						this._doUpdateTop();
						var A = this._td2El;
						mini.append(A, A.firstChild);
						this._headerEl = A.lastChild
					},
					_doUpdateLeft : function() {
						var L = "<table cellspacing=\"0\" cellpadding=\"0\"><tr>", D = this
								.getTabRows();
						for ( var J = 0, C = D.length; J < C; J++) {
							var H = D[J], E = "";
							if (C > 1 && J != C - 1)
								E = "mini-tabs-header2";
							L += "<td class=\""
									+ E
									+ "\"><table class=\"mini-tabs-header\" cellspacing=\"0\" cellpadding=\"0\">";
							L += "<tr ><td class=\"mini-tabs-space mini-tabs-firstSpace\" ><div></div></td></tr>";
							for ( var I = 0, F = H.length; I < F; I++) {
								var K = H[I], G = this._createTabId(K);
								if (!K.visible)
									continue;
								var A = this.tabs.indexOf(K), E = K.headerCls
										|| "";
								if (K.enabled == false)
									E += " mini-disabled";
								L += "<tr><td id=\"" + G + "\" index=\"" + A
										+ "\"  class=\"mini-tab " + E
										+ "\" style=\"" + K.headerStyle + "\">";
								if (K.iconCls || K.iconStyle)
									L += "<span class=\"mini-tab-icon "
											+ K.iconCls + "\" style=\""
											+ K.iconStyle + "\"></span>";
								L += "<span class=\"mini-tab-text\">" + K.title
										+ "</span>";
								if (K.showCloseButton) {
									var B = "";
									if (K.enabled)
										B = "onmouseover=\"mini.addClass(this, 'mini-tab-close-hover')\" onmouseout=\"mini.removeClass(this, 'mini-tab-close-hover')\"";
									L += "<span class=\"mini-tab-close\" " + B
											+ "></span>"
								}
								L += "</td></tr>";
								if (I != F - 1)
									L += "<tr><td class=\"mini-tabs-space2\"><div></div></td></tr>"
							}
							L += "<tr ><td class=\"mini-tabs-space mini-tabs-lastSpace\" ><div></div></td></tr>";
							L += "</table></td>"
						}
						L += "</tr ></table>";
						this._doClearElement();
						mini.addClass(this._td1El, "mini-tabs-header");
						mini.append(this._td1El, L);
						this._headerEl = this._td1El
					},
					_doUpdateRight : function() {
						this._doUpdateLeft();
						mini.removeClass(this._td1El, "mini-tabs-header");
						mini.removeClass(this._td3El, "mini-tabs-header");
						mini.append(this._td3El, this._td1El.firstChild);
						this._headerEl = this._td3El
					},
					_OnCloseButtonClick : function(B, A) {
						var E = {
							tab : B,
							index : this.tabs.indexOf(B),
							name : B.name.toLowerCase(),
							htmlEvent : A,
							cancel : false
						};
						this.fire("beforecloseclick", E);
						if (E.cancel == true)
							return;
						try {
							if (B._iframeEl && B._iframeEl.contentWindow) {
								var C = true;
								if (B._iframeEl.contentWindow.CloseWindow)
									C = B._iframeEl.contentWindow
											.CloseWindow("close");
								else if (B._iframeEl.contentWindow.CloseOwnerWindow)
									C = B._iframeEl.contentWindow
											.CloseOwnerWindow("close");
								if (C === false)
									E.cancel = true
							}
						} catch (D) {
						}
						if (E.cancel == true)
							return;
						B.removeAction = "close";
						this.removeTab(B);
						this.fire("closeclick", E)
					},
					onBeforeCloseClick : function(B, A) {
						this.on("beforecloseclick", B, A)
					},
					onCloseClick : function(B, A) {
						this.on("closeclick", B, A)
					},
					onActiveChanged : function(B, A) {
						this.on("activechanged", B, A)
					},
					getAttrs : function(D) {
						var H = mini.Tabs.superclass.getAttrs.call(this, D);
						mini._ParseString(D, H, [ "tabAlign", "tabPosition",
								"bodyStyle", "onactivechanged",
								"onbeforeactivechanged", "url", "ontabload",
								"ontabdestroy", "onbeforecloseclick",
								"oncloseclick", "titleField", "urlField",
								"nameField", "loadingMsg" ]);
						mini._ParseBool(D, H, [ "allowAnim", "showBody",
								"maskOnLoad", "plain" ]);
						mini._ParseInt(D, H, [ "activeIndex" ]);
						var C = [], G = mini.getChildNodes(D);
						for ( var B = 0, F = G.length; B < F; B++) {
							var E = G[B], A = {};
							C.push(A);
							A.style = E.style.cssText;
							mini._ParseString(E, A, [ "name", "title", "url",
									"cls", "iconCls", "iconStyle", "headerCls",
									"headerStyle", "bodyCls", "bodyStyle",
									"onload", "ondestroy" ]);
							mini._ParseBool(E, A, [ "newLine", "visible",
									"enabled", "showCloseButton",
									"refreshOnClick" ]);
							A.bodyParent = E
						}
						H.tabs = C;
						return H
					}
				});
mini.regClass(mini.Tabs, "tabs");
mini.Menu = function() {
	this.items = [];
	mini.Menu.superclass.constructor.call(this)
};
mini.extend(mini.Menu, mini.Control);
mini.copyTo(mini.Menu.prototype, mini.Popup_prototype);
var mini_Popup_prototype_hide = mini.Popup_prototype.hide;
mini
		.copyTo(
				mini.Menu.prototype,
				{
					height : "auto",
					width : "auto",
					minWidth : 140,
					vertical : true,
					allowSelectItem : false,
					_selectedItem : null,
					_itemSelectedCls : "mini-menuitem-selected",
					textField : "text",
					resultAsTree : false,
					idField : "id",
					parentField : "pid",
					itemsField : "children",
					showNavArrow : true,
					_clearBorder : false,
					showAction : "none",
					hideAction : "outerclick",
					getbyName : function(E) {
						for ( var B = 0, D = this.items.length; B < D; B++) {
							var A = this.items[B];
							if (A.name == E)
								return A;
							if (A.menu) {
								var C = A.menu.getbyName(E);
								if (C)
									return C
							}
						}
						return null
					},
					set : function(A) {
						if (typeof A == "string")
							return this;
						var B = A.url;
						delete A.url;
						mini.Menu.superclass.set.call(this, A);
						if (B)
							this.setUrl(B);
						return this
					},
					uiCls : "mini-menu",
					_create : function() {
						this.el = document.createElement("div");
						this.el.className = "mini-menu";
						this.el.innerHTML = "<div class=\"mini-menu-border\"><a class=\"mini-menu-topArrow\" href=\"#\" onclick=\"return false\"></a><div class=\"mini-menu-inner\"></div><a class=\"mini-menu-bottomArrow\" href=\"#\" onclick=\"return false\"></a></div>";
						this._borderEl = this.el.firstChild;
						this._topArrowEl = this._borderEl.childNodes[0];
						this._bottomArrowEl = this._borderEl.childNodes[2];
						this._innerEl = this._borderEl.childNodes[1];
						this._innerEl.innerHTML = "<div class=\"mini-menu-float\"></div><div style=\"clear:both;\"></div>";
						this._contentEl = this._innerEl.firstChild;
						if (this.isVertical() == false)
							mini.addClass(this.el, "mini-menu-horizontal")
					},
					destroy : function(A) {
						if (this._topArrowEl)
							this._topArrowEl.onmousedown = this._bottomArrowEl.onmousedown = null;
						this._popupEl = this.popupEl = this._borderEl = this._innerEl = this._contentEl = null;
						this._topArrowEl = this._bottomArrowEl = null;
						this.owner = null;
						mini.un(document, "mousedown", this.__OnBodyMouseDown,
								this);
						mini.un(window, "resize", this.__OnWindowResize, this);
						mini.Menu.superclass.destroy.call(this, A)
					},
					_disableContextMenu : false,
					_initEvents : function() {
						mini._BindEvents(function() {
							mini.on(document, "mousedown",
									this.__OnBodyMouseDown, this);
							mini_onOne(this.el, "mouseover",
									this.__OnMouseOver, this);
							mini.on(window, "resize", this.__OnWindowResize,
									this);
							if (this._disableContextMenu)
								mini_onOne(this.el, "contextmenu", function(A) {
									A.preventDefault()
								}, this);
							mini_onOne(this._topArrowEl, "mousedown",
									this.__OnTopMouseDown, this);
							mini_onOne(this._bottomArrowEl, "mousedown",
									this.__OnBottomMouseDown, this)
						}, this)
					},
					within : function(D) {
						if (mini.isAncestor(this.el, D.target))
							return true;
						for ( var B = 0, C = this.items.length; B < C; B++) {
							var A = this.items[B];
							if (A.within(D))
								return true
						}
						return false
					},
					setVertical : function(A) {
						this.vertical = A;
						if (!A)
							mini.addClass(this.el, "mini-menu-horizontal");
						else
							mini.removeClass(this.el, "mini-menu-horizontal")
					},
					getVertical : function() {
						return this.vertical
					},
					isVertical : function() {
						return this.vertical
					},
					show : function() {
						this.setVisible(true)
					},
					hide : function() {
						this.hideItems();
						mini_Popup_prototype_hide.call(this)
					},
					hideItems : function() {
						for ( var A = 0, C = this.items.length; A < C; A++) {
							var B = this.items[A];
							B.hideMenu()
						}
					},
					showItemMenu : function(A) {
						for ( var B = 0, D = this.items.length; B < D; B++) {
							var C = this.items[B];
							if (C == A)
								C.showMenu();
							else
								C.hideMenu()
						}
					},
					hasShowItemMenu : function() {
						for ( var A = 0, C = this.items.length; A < C; A++) {
							var B = this.items[A];
							if (B && B.menu && B.menu.isPopup)
								return true
						}
						return false
					},
					setData : function(A) {
						if (!mini.isArray(A))
							A = [];
						this.setItems(A)
					},
					getData : function() {
						return this.getItems()
					},
					setItems : function(B) {
						if (!mini.isArray(B))
							B = [];
						this.removeAll();
						var C = new Date();
						for ( var A = 0, D = B.length; A < D; A++)
							this.addItem(B[A])
					},
					getItems : function() {
						return this.items
					},
					addItem : function(A) {
						if (A == "-" || A == "|") {
							mini.append(this._contentEl,
									"<span class=\"mini-separator\"></span>");
							return
						}
						if (!mini.isControl(A) && !mini.getClass(A.type))
							A.type = "menuitem";
						A = mini.getAndCreate(A);
						this.items.push(A);
						this._contentEl.appendChild(A.el);
						A.ownerMenu = this;
						this.fire("itemschanged")
					},
					removeItem : function(A) {
						A = mini.get(A);
						if (!A)
							return;
						this.items.remove(A);
						this._contentEl.removeChild(A.el);
						this.fire("itemschanged")
					},
					removeItemAt : function(B) {
						var A = this.items[B];
						this.removeItem(A)
					},
					removeAll : function() {
						var B = this.items.clone();
						for ( var A = B.length - 1; A >= 0; A--)
							this.removeItem(B[A]);
						this._contentEl.innerHTML = ""
					},
					getGroupItems : function(E) {
						if (!E)
							return [];
						var C = [];
						for ( var B = 0, D = this.items.length; B < D; B++) {
							var A = this.items[B];
							if (A.groupName == E)
								C.push(A)
						}
						return C
					},
					getItem : function(A) {
						if (typeof A == "number")
							return this.items[A];
						if (typeof A == "string") {
							for ( var B = 0, D = this.items.length; B < D; B++) {
								var C = this.items[B];
								if (C.id == A)
									return C
							}
							return null
						}
						if (A && this.items.indexOf(A) != -1)
							return A;
						return null
					},
					setAllowSelectItem : function(A) {
						this.allowSelectItem = A
					},
					getAllowSelectItem : function() {
						return this.allowSelectItem
					},
					setSelectedItem : function(A) {
						A = this.getItem(A);
						this._OnItemSelect(A)
					},
					getSelectedItem : function(A) {
						return this._selectedItem
					},
					setShowNavArrow : function(A) {
						this.showNavArrow = A
					},
					getShowNavArrow : function() {
						return this.showNavArrow
					},
					setTextField : function(A) {
						this.textField = A
					},
					getTextField : function() {
						return this.textField
					},
					setResultAsTree : function(A) {
						this.resultAsTree = A
					},
					getResultAsTree : function() {
						return this.resultAsTree
					},
					setIdField : function(A) {
						this.idField = A
					},
					getIdField : function() {
						return this.idField
					},
					setParentField : function(A) {
						this.parentField = A
					},
					getParentField : function() {
						return this.parentField
					},
					doLayout : function() {
						if (!this.canLayout())
							return;
						if (!this.isAutoHeight()) {
							var A = mini.getHeight(this.el, true);
							mini.setHeight(this._borderEl, A);
							this._topArrowEl.style.display = this._bottomArrowEl.style.display = "none";
							this._contentEl.style.height = "auto";
							if (this.showNavArrow
									&& this._borderEl.scrollHeight > this._borderEl.clientHeight) {
								this._topArrowEl.style.display = this._bottomArrowEl.style.display = "block";
								A = mini.getHeight(this._borderEl, true);
								var D = mini.getHeight(this._topArrowEl), C = mini
										.getHeight(this._bottomArrowEl), B = A
										- D - C;
								if (B < 0)
									B = 0;
								mini.setHeight(this._contentEl, B)
							} else
								this._contentEl.style.height = "auto"
						} else {
							this._borderEl.style.height = "auto";
							this._contentEl.style.height = "auto"
						}
					},
					_measureSize : function() {
						if (this.height == "auto") {
							this.el.style.height = "auto";
							this._borderEl.style.height = "auto";
							this._contentEl.style.height = "auto";
							this._topArrowEl.style.display = this._bottomArrowEl.style.display = "none";
							var D = mini.getViewportBox(), C = mini
									.getBox(this.el);
							this.maxHeight = D.height - 25;
							if (this.ownerItem) {
								var C = mini.getBox(this.ownerItem.el), E = C.top, B = D.height
										- C.bottom, A = E > B ? E : B;
								A -= 10;
								this.maxHeight = A
							}
						}
						this.el.style.display = "";
						C = mini.getBox(this.el);
						if (C.width > this.maxWidth) {
							mini.setWidth(this.el, this.maxWidth);
							C = mini.getBox(this.el)
						}
						if (C.height > this.maxHeight) {
							mini.setHeight(this.el, this.maxHeight);
							C = mini.getBox(this.el)
						}
						if (C.width < this.minWidth) {
							mini.setWidth(this.el, this.minWidth);
							C = mini.getBox(this.el)
						}
						if (C.height < this.minHeight) {
							mini.setHeight(this.el, this.minHeight);
							C = mini.getBox(this.el)
						}
					},
					url : "",
					_doLoad : function() {
						var D = mini.getData(this.url);
						if (!D)
							D = [];
						if (this.resultAsTree == false)
							D = mini.arrayToTree(D, this.itemsField,
									this.idField, this.parentField);
						var B = mini.treeToArray(D, this.itemsField,
								this.idField, this.parentField);
						for ( var C = 0, F = B.length; C < F; C++) {
							var A = B[C];
							A.text = A[this.textField]
						}
						var E = new Date();
						this.setItems(D);
						this.fire("load")
					},
					loadList : function(B, G, D) {
						if (!B)
							return;
						G = G || this.idField;
						D = D || this.parentField;
						for ( var C = 0, F = B.length; C < F; C++) {
							var A = B[C];
							A.text = A[this.textField]
						}
						var E = mini.arrayToTree(B, this.itemsField, G, D);
						this.load(E)
					},
					load : function(A) {
						if (typeof A == "string")
							this.setUrl(A);
						else
							this.setItems(A)
					},
					setUrl : function(A) {
						this.url = A;
						this._doLoad()
					},
					getUrl : function() {
						return this.url
					},
					hideOnClick : true,
					setHideOnClick : function(A) {
						this.hideOnClick = A
					},
					getHideOnClick : function() {
						return this.hideOnClick
					},
					_OnItemClick : function(A, B) {
						var C = {
							item : A,
							isLeaf : !A.menu,
							htmlEvent : B
						};
						if (this.hideOnClick)
							if (this.isPopup)
								this.hide();
							else
								this.hideItems();
						if (this.allowSelectItem && this._selectedItem != A)
							this.setSelectedItem(A);
						this.fire("itemclick", C);
						if (this.ownerItem)
							;
					},
					_OnItemSelect : function(A) {
						if (this._selectedItem)
							this._selectedItem.removeCls(this._itemSelectedCls);
						this._selectedItem = A;
						if (this._selectedItem)
							this._selectedItem.addCls(this._itemSelectedCls);
						var B = {
							item : this._selectedItem
						};
						this.fire("itemselect", B)
					},
					onItemClick : function(B, A) {
						this.on("itemclick", B, A)
					},
					onItemSelect : function(B, A) {
						this.on("itemselect", B, A)
					},
					__OnTopMouseDown : function(A) {
						this._startScrollMove(-20)
					},
					__OnBottomMouseDown : function(A) {
						this._startScrollMove(20)
					},
					_startScrollMove : function(A) {
						clearInterval(this._scrollTimer);
						var C = function() {
							clearInterval(B._scrollTimer);
							mini.un(document, "mouseup", C)
						};
						mini.on(document, "mouseup", C);
						var B = this;
						this._scrollTimer = setInterval(function() {
							B._contentEl.scrollTop += A
						}, 50)
					},
					parseItems : function(I) {
						var E = [];
						for ( var B = 0, H = I.length; B < H; B++) {
							var D = I[B];
							if (D.className == "separator") {
								E.add("-");
								continue
							}
							var G = mini.getChildNodes(D), C = G[0], F = G[1], A = new mini.MenuItem();
							if (!F) {
								mini.applyTo.call(A, D);
								E.add(A);
								continue
							}
							mini.applyTo.call(A, C);
							A.render(document.body);
							var J = new mini.Menu();
							mini.applyTo.call(J, F);
							A.setMenu(J);
							J.render(document.body);
							E.add(A)
						}
						return E.clone()
					},
					getAttrs : function(B) {
						var G = mini.Menu.superclass.getAttrs.call(this, B), F = jQuery(B);
						mini._ParseString(B, G, [ "popupEl", "popupCls",
								"showAction", "hideAction", "xAlign", "yAlign",
								"modalStyle", "onbeforeopen", "open",
								"onbeforeclose", "onclose", "url",
								"onitemclick", "onitemselect", "textField",
								"idField", "parentField" ]);
						mini._ParseBool(B, G, [ "resultAsTree", "hideOnClick",
								"showNavArrow" ]);
						var C = mini.getChildNodes(B), A = this.parseItems(C);
						if (A.length > 0)
							G.items = A;
						var D = F.attr("vertical");
						if (D)
							G.vertical = D == "true" ? true : false;
						var E = F.attr("allowSelectItem");
						if (E)
							G.allowSelectItem = E == "true" ? true : false;
						return G
					}
				});
mini.regClass(mini.Menu, "menu");
mini.MenuBar = function() {
	mini.MenuBar.superclass.constructor.call(this)
};
mini.extend(mini.MenuBar, mini.Menu, {
	uiCls : "mini-menubar",
	vertical : false,
	setVertical : function(A) {
		this.vertical = false
	}
});
mini.regClass(mini.MenuBar, "menubar");
mini.ContextMenu = function() {
	mini.ContextMenu.superclass.constructor.call(this)
};
mini.extend(mini.ContextMenu, mini.Menu, {
	uiCls : "mini-contextmenu",
	vertical : true,
	visible : false,
	_disableContextMenu : true,
	setVertical : function(A) {
		this.vertical = true
	}
});
mini.regClass(mini.ContextMenu, "contextmenu");
mini.MenuItem = function() {
	mini.MenuItem.superclass.constructor.call(this)
};
mini
		.extend(
				mini.MenuItem,
				mini.Control,
				{
					text : "",
					iconCls : "",
					iconStyle : "",
					iconPosition : "left",
					showIcon : true,
					showAllow : true,
					checked : false,
					checkOnClick : false,
					groupName : "",
					_hoverCls : "mini-menuitem-hover",
					_pressedCls : "mini-menuitem-pressed",
					_checkedCls : "mini-menuitem-checked",
					_clearBorder : false,
					menu : null,
					uiCls : "mini-menuitem",
					_create : function() {
						var A = this.el = document.createElement("div");
						this.el.className = "mini-menuitem";
						this.el.innerHTML = "<div class=\"mini-menuitem-inner\"><div class=\"mini-menuitem-icon\"></div><div class=\"mini-menuitem-text\"></div><div class=\"mini-menuitem-allow\"></div></div>";
						this._innerEl = this.el.firstChild;
						this._iconEl = this._innerEl.firstChild;
						this._textEl = this._innerEl.childNodes[1];
						this.allowEl = this._innerEl.lastChild
					},
					_initEvents : function() {
						mini._BindEvents(function() {
							mini_onOne(this.el, "mouseover",
									this.__OnMouseOver, this)
						}, this)
					},
					_inputEventsInited : false,
					_initInputEvents : function() {
						if (this._inputEventsInited)
							return;
						this._inputEventsInited = true;
						mini_onOne(this.el, "click", this.__OnClick, this);
						mini_onOne(this.el, "mouseup", this.__OnMouseUp, this);
						mini_onOne(this.el, "mouseout", this.__OnMouseOut, this)
					},
					destroy : function(A) {
						if (this.el)
							this.el.onmouseover = null;
						this.menu = this._innerEl = this._iconEl = this._textEl = this.allowEl = null;
						mini.MenuItem.superclass.destroy.call(this, A)
					},
					within : function(A) {
						if (mini.isAncestor(this.el, A.target))
							return true;
						if (this.menu && this.menu.within(A))
							return true;
						return false
					},
					_doUpdateIcon : function() {
						var A = this.iconStyle || this.iconCls
								|| this.checkOnClick;
						if (this._iconEl) {
							mini.setStyle(this._iconEl, this.iconStyle);
							mini.addClass(this._iconEl, this.iconCls);
							this._iconEl.style.display = A ? "block" : "none"
						}
						if (this.iconPosition == "top")
							mini.addClass(this.el, "mini-menuitem-icontop");
						else
							mini.removeClass(this.el, "mini-menuitem-icontop")
					},
					doUpdate : function() {
						if (this._textEl)
							this._textEl.innerHTML = this.text;
						this._doUpdateIcon();
						if (this.checked)
							mini.addClass(this.el, this._checkedCls);
						else
							mini.removeClass(this.el, this._checkedCls);
						if (this.allowEl)
							if (this.menu && this.menu.items.length > 0)
								this.allowEl.style.display = "block";
							else
								this.allowEl.style.display = "none"
					},
					setText : function(A) {
						this.text = A;
						if (this._textEl)
							this._textEl.innerHTML = this.text
					},
					getText : function() {
						return this.text
					},
					setIconCls : function(A) {
						mini.removeClass(this._iconEl, this.iconCls);
						this.iconCls = A;
						this._doUpdateIcon()
					},
					getIconCls : function() {
						return this.iconCls
					},
					setIconStyle : function(A) {
						this.iconStyle = A;
						this._doUpdateIcon()
					},
					getIconStyle : function() {
						return this.iconStyle
					},
					setIconPosition : function(A) {
						this.iconPosition = A;
						this._doUpdateIcon()
					},
					getIconPosition : function() {
						return this.iconPosition
					},
					setCheckOnClick : function(A) {
						this.checkOnClick = A;
						if (A)
							mini.addClass(this.el, "mini-menuitem-showcheck");
						else
							mini
									.removeClass(this.el,
											"mini-menuitem-showcheck");
						this.doUpdate()
					},
					getCheckOnClick : function() {
						return this.checkOnClick
					},
					setChecked : function(A) {
						if (this.checked != A) {
							this.checked = A;
							this.doUpdate();
							this.fire("checkedchanged")
						}
					},
					getChecked : function() {
						return this.checked
					},
					setGroupName : function(A) {
						if (this.groupName != A)
							this.groupName = A
					},
					getGroupName : function() {
						return this.groupName
					},
					setChildren : function(A) {
						this.setMenu(A)
					},
					setMenu : function(A) {
						if (mini.isArray(A))
							A = {
								type : "menu",
								items : A
							};
						if (this.menu !== A) {
							this.menu = mini.getAndCreate(A);
							this.menu.hide();
							this.menu.ownerItem = this;
							this.doUpdate();
							this.menu.on("itemschanged", this.__OnItemsChanged,
									this)
						}
					},
					getMenu : function() {
						return this.menu
					},
					showMenu : function() {
						if (this.menu && this.menu.isDisplay() == false) {
							this.menu.setHideAction("outerclick");
							var A = {
								xAlign : "outright",
								yAlign : "top",
								outXAlign : "outleft",
								popupCls : "mini-menu-popup"
							};
							if (this.ownerMenu
									&& this.ownerMenu.vertical == false) {
								A.xAlign = "left";
								A.yAlign = "below";
								A.outXAlign = null
							}
							this.menu.showAtEl(this.el, A)
						}
					},
					hideMenu : function() {
						if (this.menu)
							this.menu.hide()
					},
					hide : function() {
						this.hideMenu();
						this.setVisible(false)
					},
					__OnItemsChanged : function(A) {
						this.doUpdate()
					},
					getTopMenu : function() {
						if (this.ownerMenu)
							if (this.ownerMenu.ownerItem)
								return this.ownerMenu.ownerItem.getTopMenu();
							else
								return this.ownerMenu;
						return null
					},
					__OnClick : function(F) {
						if (this.isReadOnly())
							return;
						if (this.checkOnClick)
							if (this.ownerMenu && this.groupName) {
								var D = this.ownerMenu
										.getGroupItems(this.groupName);
								if (D.length > 0) {
									if (this.checked == false) {
										for ( var B = 0, E = D.length; B < E; B++) {
											var A = D[B];
											if (A != this)
												A.setChecked(false)
										}
										this.setChecked(true)
									}
								} else
									this.setChecked(!this.checked)
							} else
								this.setChecked(!this.checked);
						this.fire("click");
						var C = this.getTopMenu();
						if (C)
							C._OnItemClick(this, F)
					},
					__OnMouseUp : function(B) {
						if (this.isReadOnly())
							return;
						if (this.ownerMenu) {
							var A = this;
							setTimeout(function() {
								if (A.isDisplay())
									A.ownerMenu.showItemMenu(A)
							}, 1)
						}
					},
					__OnMouseOver : function(A) {
						if (this.isReadOnly())
							return;
						this._initInputEvents();
						mini.addClass(this.el, this._hoverCls);
						this.el.title = this.text;
						if (this._textEl.scrollWidth > this._textEl.clientWidth)
							this.el.title = this.text;
						else
							this.el.title = "";
						if (this.ownerMenu)
							if (this.ownerMenu.isVertical() == true)
								this.ownerMenu.showItemMenu(this);
							else if (this.ownerMenu.hasShowItemMenu())
								this.ownerMenu.showItemMenu(this)
					},
					__OnMouseOut : function(A) {
						mini.removeClass(this.el, this._hoverCls)
					},
					onClick : function(B, A) {
						this.on("click", B, A)
					},
					onCheckedChanged : function(B, A) {
						this.on("checkedchanged", B, A)
					},
					getAttrs : function(A) {
						var C = mini.MenuItem.superclass.getAttrs.call(this, A), B = jQuery(A);
						C.text = A.innerHTML;
						mini._ParseString(A, C, [ "text", "iconCls",
								"iconStyle", "iconPosition", "groupName",
								"onclick", "oncheckedchanged" ]);
						mini._ParseBool(A, C, [ "checkOnClick", "checked" ]);
						return C
					}
				});
mini.regClass(mini.MenuItem, "menuitem");
mini.OutlookBar = function() {
	this._initGroups();
	mini.OutlookBar.superclass.constructor.call(this)
};
mini
		.extend(
				mini.OutlookBar,
				mini.Control,
				{
					width : 180,
					expandOnLoad : true,
					activeIndex : -1,
					autoCollapse : false,
					groupCls : "",
					groupStyle : "",
					groupHeaderCls : "",
					groupHeaderStyle : "",
					groupBodyCls : "",
					groupBodyStyle : "",
					groupHoverCls : "",
					groupActiveCls : "",
					allowAnim : true,
					set : function(C) {
						if (typeof C == "string")
							return this;
						var A = this._allowLayout;
						this._allowLayout = false;
						var B = C.activeIndex;
						delete C.activeIndex;
						mini.OutlookBar.superclass.set.call(this, C);
						if (mini.isNumber(B))
							this.setActiveIndex(B);
						this._allowLayout = A;
						this.doLayout();
						return this
					},
					uiCls : "mini-outlookbar",
					_create : function() {
						this.el = document.createElement("div");
						this.el.className = "mini-outlookbar";
						this.el.innerHTML = "<div class=\"mini-outlookbar-border\"></div>";
						this._borderEl = this.el.firstChild
					},
					_initEvents : function() {
						mini._BindEvents(function() {
							mini.on(this.el, "click", this.__OnClick, this)
						}, this)
					},
					_createGroupId : function(A) {
						return this.uid + "$" + A._id
					},
					_GroupId : 1,
					_initGroups : function() {
						this.groups = []
					},
					_createGroupEl : function(B) {
						var J = this._createGroupId(B), I = "<div id=\"" + J
								+ "\" class=\"mini-outlookbar-group " + B.cls
								+ "\" style=\"" + B.style + "\">"
								+ "<div class=\"mini-outlookbar-groupHeader "
								+ B.headerCls + "\" style=\"" + B.headerStyle
								+ ";\"></div>"
								+ "<div class=\"mini-outlookbar-groupBody "
								+ B.bodyCls + "\" style=\"" + B.bodyStyle
								+ ";\"></div>" + "</div>", C = mini.append(
								this._borderEl, I), G = C.lastChild, E = B.body;
						delete B.body;
						if (E) {
							if (!mini.isArray(E))
								E = [ E ];
							for ( var A = 0, H = E.length; A < H; A++) {
								var D = E[A];
								mini.append(G, D)
							}
							E.length = 0
						}
						if (B.bodyParent) {
							var F = B.bodyParent;
							while (F.firstChild)
								G.appendChild(F.firstChild)
						}
						delete B.bodyParent;
						return C
					},
					createGroup : function(B) {
						var A = mini.copyTo( {
							_id : this._GroupId++,
							name : "",
							title : "",
							cls : "",
							style : "",
							iconCls : "",
							iconStyle : "",
							headerCls : "",
							headerStyle : "",
							bodyCls : "",
							bodyStyle : "",
							visible : true,
							enabled : true,
							showCollapseButton : true,
							expanded : this.expandOnLoad
						}, B);
						return A
					},
					setGroups : function(B) {
						if (!mini.isArray(B))
							return;
						this.removeAll();
						for ( var A = 0, C = B.length; A < C; A++)
							this.addGroup(B[A])
					},
					getGroups : function() {
						return this.groups
					},
					addGroup : function(B, A) {
						if (typeof B == "string")
							B = {
								title : B
							};
						B = this.createGroup(B);
						if (typeof A != "number")
							A = this.groups.length;
						this.groups.insert(A, B);
						var D = this._createGroupEl(B);
						B._el = D;
						var A = this.groups.indexOf(B), C = this.groups[A + 1];
						if (C) {
							var E = this.getGroupEl(C);
							jQuery(E).before(D)
						}
						this.doUpdate();
						return B
					},
					updateGroup : function(A, B) {
						var A = this.getGroup(A);
						if (!A)
							return;
						mini.copyTo(A, B);
						this.doUpdate()
					},
					removeGroup : function(A) {
						A = this.getGroup(A);
						if (!A)
							return;
						var B = this.getGroupEl(A);
						if (B)
							B.parentNode.removeChild(B);
						this.groups.remove(A);
						this.doUpdate()
					},
					removeAll : function() {
						for ( var A = this.groups.length - 1; A >= 0; A--)
							this.removeGroup(A)
					},
					moveGroup : function(B, A) {
						B = this.getGroup(B);
						if (!B)
							return;
						target = this.getGroup(A);
						var C = this.getGroupEl(B);
						this.groups.remove(B);
						if (target) {
							A = this.groups.indexOf(target);
							this.groups.insert(A, B);
							var D = this.getGroupEl(target);
							jQuery(D).before(C)
						} else {
							this.groups.add(B);
							this._borderEl.appendChild(C)
						}
						this.doUpdate()
					},
					doUpdate : function() {
						for ( var B = 0, G = this.groups.length; B < G; B++) {
							var C = this.groups[B], D = C._el, F = D.firstChild, E = D.lastChild, A = "<div class=\"mini-outlookbar-icon "
									+ C.iconCls
									+ "\" style=\""
									+ C.iconStyle
									+ ";\"></div>", H = "<div class=\"mini-tools\"><span class=\"mini-tools-collapse\"></span></div>"
									+ ((C.iconStyle || C.iconCls) ? A : "")
									+ "<div class=\"mini-outlookbar-groupTitle\">"
									+ C.title
									+ "</div><div style=\"clear:both;\"></div>";
							F.innerHTML = H;
							if (C.enabled)
								mini.removeClass(D, "mini-disabled");
							else
								mini.addClass(D, "mini-disabled");
							mini.addClass(D, C.cls);
							mini.setStyle(D, C.style);
							mini.addClass(E, C.bodyCls);
							mini.setStyle(E, C.bodyStyle);
							mini.addClass(F, C.headerCls);
							mini.setStyle(F, C.headerStyle);
							mini.removeClass(D, "mini-outlookbar-firstGroup");
							mini.removeClass(D, "mini-outlookbar-lastGroup");
							if (B == 0)
								mini.addClass(D, "mini-outlookbar-firstGroup");
							if (B == G - 1)
								mini.addClass(D, "mini-outlookbar-lastGroup")
						}
						this.doLayout()
					},
					doLayout : function() {
						if (!this.canLayout())
							return;
						if (this._inAniming)
							return;
						this._doLayoutInner();
						for ( var A = 0, J = this.groups.length; A < J; A++) {
							var B = this.groups[A], D = B._el, F = D.lastChild;
							if (B.expanded) {
								mini.addClass(D, "mini-outlookbar-expand");
								mini.removeClass(D, "mini-outlookbar-collapse")
							} else {
								mini.removeClass(D, "mini-outlookbar-expand");
								mini.addClass(D, "mini-outlookbar-collapse")
							}
							F.style.height = "auto";
							F.style.display = B.expanded ? "block" : "none";
							D.style.display = B.visible ? "" : "none";
							var C = mini.getWidth(D, true), G = mini
									.getPaddings(F), I = mini.getBorders(F);
							if (jQuery.boxModel)
								C = C - G.left - G.right - I.left - I.right;
							F.style.width = C + "px"
						}
						var H = this.isAutoHeight(), E = this.getActiveGroup();
						if (!H && this.autoCollapse && E) {
							D = this.getGroupEl(this.activeIndex);
							D.lastChild.style.height = this
									._getFillGroupBodyHeight()
									+ "px"
						}
						mini.layout(this._borderEl)
					},
					_doLayoutInner : function() {
						if (this.isAutoHeight())
							this._borderEl.style.height = "auto";
						else {
							var A = this.getHeight(true);
							if (!jQuery.boxModel) {
								var B = mini.getBorders(this._borderEl);
								A = A + B.top + B.bottom
							}
							if (A < 0)
								A = 0;
							this._borderEl.style.height = A + "px"
						}
					},
					_getFillGroupBodyHeight : function() {
						var E = jQuery(this.el).height(), M = mini
								.getBorders(this._borderEl);
						E = E - M.top - M.bottom;
						var C = this.getActiveGroup(), G = 0;
						for ( var H = 0, F = this.groups.length; H < F; H++) {
							var B = this.groups[H], I = this.getGroupEl(B);
							if (B.visible == false || B == C)
								continue;
							var A = I.lastChild.style.display;
							I.lastChild.style.display = "none";
							var L = jQuery(I).outerHeight();
							I.lastChild.style.display = A;
							var N = mini.getMargins(I);
							L = L + N.top + N.bottom;
							G += L
						}
						E = E - G;
						var J = this.getGroupEl(this.activeIndex);
						if (!J)
							return 0;
						E = E - jQuery(J.firstChild).outerHeight();
						if (jQuery.boxModel) {
							var D = mini.getPaddings(J.lastChild), K = mini
									.getBorders(J.lastChild);
							E = E - D.top - D.bottom - K.top - K.bottom
						}
						D = mini.getPaddings(J), K = mini.getBorders(J),
								N = mini.getMargins(J);
						E = E - N.top - N.bottom;
						E = E - D.top - D.bottom - K.top - K.bottom;
						if (E < 0)
							E = 0;
						return E
					},
					getGroup : function(A) {
						if (typeof A == "object")
							return A;
						if (typeof A == "number")
							return this.groups[A];
						else
							for ( var B = 0, D = this.groups.length; B < D; B++) {
								var C = this.groups[B];
								if (C.name == A)
									return C
							}
					},
					_getGroupById : function(D) {
						for ( var A = 0, C = this.groups.length; A < C; A++) {
							var B = this.groups[A];
							if (B._id == D)
								return B
						}
					},
					getGroupEl : function(A) {
						var B = this.getGroup(A);
						if (!B)
							return null;
						return B._el
					},
					getGroupBodyEl : function(A) {
						var B = this.getGroupEl(A);
						if (B)
							return B.lastChild;
						return null
					},
					setAutoCollapse : function(A) {
						this.autoCollapse = A
					},
					getAutoCollapse : function() {
						return this.autoCollapse
					},
					setExpandOnLoad : function(A) {
						this.expandOnLoad = A
					},
					getExpandOnLoad : function() {
						return this.expandOnLoad
					},
					setActiveIndex : function(B) {
						var A = this.getGroup(B), C = this
								.getGroup(this.activeIndex), D = A != C;
						if (A)
							this.activeIndex = this.groups.indexOf(A);
						else
							this.activeIndex = -1;
						A = this.getGroup(this.activeIndex);
						if (A) {
							var E = this.allowAnim;
							this.allowAnim = false;
							this.expandGroup(A);
							this.allowAnim = E
						}
					},
					getActiveIndex : function() {
						return this.activeIndex
					},
					getActiveGroup : function() {
						return this.getGroup(this.activeIndex)
					},
					showGroup : function(A) {
						A = this.getGroup(A);
						if (!A || A.visible == true)
							return;
						A.visible = true;
						this.doUpdate()
					},
					hideGroup : function(A) {
						A = this.getGroup(A);
						if (!A || A.visible == false)
							return;
						A.visible = false;
						this.doUpdate()
					},
					toggleGroup : function(A) {
						A = this.getGroup(A);
						if (!A)
							return;
						if (A.expanded)
							this.collapseGroup(A);
						else
							this.expandGroup(A)
					},
					collapseGroup : function(B) {
						B = this.getGroup(B);
						if (!B)
							return;
						var F = B.expanded, G = 0;
						if (this.autoCollapse && !this.isAutoHeight())
							G = this._getFillGroupBodyHeight();
						var H = false;
						B.expanded = false;
						var A = this.groups.indexOf(B);
						if (A == this.activeIndex) {
							this.activeIndex = -1;
							H = true
						}
						var E = this.getGroupBodyEl(B);
						if (this.allowAnim && F) {
							this._inAniming = true;
							E.style.display = "block";
							E.style.height = "auto";
							if (this.autoCollapse && !this.isAutoHeight())
								E.style.height = G + "px";
							var C = {
								height : "1px"
							};
							mini.addClass(E, "mini-outlookbar-overflow");
							var D = this, J = jQuery(E);
							J.animate(C, 180,
									function() {
										D._inAniming = false;
										mini.removeClass(E,
												"mini-outlookbar-overflow");
										D.doLayout()
									})
						} else
							this.doLayout();
						var I = {
							group : B,
							index : this.groups.indexOf(B),
							name : B.name
						};
						this.fire("Collapse", I);
						if (H)
							this.fire("activechanged")
					},
					expandGroup : function(A) {
						A = this.getGroup(A);
						if (!A)
							return;
						var J = A.expanded;
						A.expanded = true;
						this.activeIndex = this.groups.indexOf(A);
						fire = true;
						if (this.autoCollapse)
							for ( var F = 0, D = this.groups.length; F < D; F++) {
								var E = this.groups[F];
								if (E.expanded && E != A)
									this.collapseGroup(E)
							}
						var I = this.getGroupBodyEl(A);
						if (this.allowAnim && J == false) {
							this._inAniming = true;
							I.style.display = "block";
							if (this.autoCollapse && !this.isAutoHeight()) {
								var C = this._getFillGroupBodyHeight();
								I.style.height = (C) + "px"
							} else
								I.style.height = "auto";
							var B = mini.getHeight(I);
							I.style.height = "1px";
							var G = {
								height : B + "px"
							}, K = I.style.overflow;
							I.style.overflow = "hidden";
							mini.addClass(I, "mini-outlookbar-overflow");
							var H = this, M = jQuery(I);
							M.animate(G, 180,
									function() {
										I.style.overflow = K;
										mini.removeClass(I,
												"mini-outlookbar-overflow");
										H._inAniming = false;
										H.doLayout()
									})
						} else
							this.doLayout();
						var L = {
							group : A,
							index : this.groups.indexOf(A),
							name : A.name
						};
						this.fire("Expand", L);
						if (fire)
							this.fire("activechanged")
					},
					_tryToggleGroup : function(A) {
						A = this.getGroup(A);
						var B = {
							group : A,
							groupIndex : this.groups.indexOf(A),
							groupName : A.name,
							cancel : false
						};
						if (A.expanded) {
							this.fire("BeforeCollapse", B);
							if (B.cancel == false)
								this.collapseGroup(A)
						} else {
							this.fire("BeforeExpand", B);
							if (B.cancel == false)
								this.expandGroup(A)
						}
					},
					_getGroupByEvent : function(D) {
						var B = mini.findParent(D.target,
								"mini-outlookbar-group");
						if (!B)
							return null;
						var A = B.id.split("$"), C = A[A.length - 1];
						return this._getGroupById(C)
					},
					__OnClick : function(C) {
						if (this._inAniming)
							return;
						var B = mini.findParent(C.target,
								"mini-outlookbar-groupHeader");
						if (!B)
							return;
						var A = this._getGroupByEvent(C);
						if (!A)
							return;
						this._tryToggleGroup(A)
					},
					parseGroups : function(F) {
						var C = [];
						for ( var A = 0, E = F.length; A < E; A++) {
							var D = F[A], B = {};
							C.push(B);
							B.style = D.style.cssText;
							mini._ParseString(D, B, [ "name", "title", "cls",
									"iconCls", "iconStyle", "headerCls",
									"headerStyle", "bodyCls", "bodyStyle" ]);
							mini._ParseBool(D, B, [ "visible", "enabled",
									"showCollapseButton", "expanded" ]);
							B.bodyParent = D
						}
						return C
					},
					getAttrs : function(A) {
						var C = mini.OutlookBar.superclass.getAttrs.call(this,
								A);
						mini._ParseString(A, C, [ "onactivechanged",
								"oncollapse", "onexpand" ]);
						mini._ParseBool(A, C, [ "autoCollapse", "allowAnim",
								"expandOnLoad" ]);
						mini._ParseInt(A, C, [ "activeIndex" ]);
						var B = mini.getChildNodes(A);
						C.groups = this.parseGroups(B);
						return C
					}
				});
mini.regClass(mini.OutlookBar, "outlookbar");
mini.OutlookMenu = function() {
	mini.OutlookMenu.superclass.constructor.call(this);
	this.data = []
};
mini
		.extend(
				mini.OutlookMenu,
				mini.OutlookBar,
				{
					url : "",
					textField : "text",
					iconField : "iconCls",
					urlField : "url",
					resultAsTree : false,
					itemsField : "children",
					idField : "id",
					parentField : "pid",
					style : "width:100%;height:100%;",
					set : function(B) {
						if (typeof B == "string")
							return this;
						var C = B.url;
						delete B.url;
						var A = B.activeIndex;
						delete B.activeIndex;
						mini.OutlookMenu.superclass.set.call(this, B);
						if (C)
							this.setUrl(C);
						if (mini.isNumber(A))
							this.setActiveIndex(A);
						return this
					},
					uiCls : "mini-outlookmenu",
					destroy : function(D) {
						if (this._menus) {
							var B = this._menus.clone();
							for ( var A = 0, E = B.length; A < E; A++) {
								var C = B[A];
								C.destroy()
							}
							this._menus.length = 0
						}
						mini.OutlookMenu.superclass.destroy.call(this, D)
					},
					_doParseFields : function(B) {
						for ( var C = 0, D = B.length; C < D; C++) {
							var A = B[C];
							A.text = A[this.textField];
							A.url = A[this.urlField];
							A.iconCls = A[this.iconField]
						}
					},
					_doLoad : function() {
						var B = [];
						try {
							B = mini.getData(this.url)
						} catch (C) {
							if (mini_debugger == true)
								alert("outlooktree json is error.")
						}
						if (!B)
							B = [];
						if (this.resultAsTree == false)
							B = mini.arrayToTree(B, this.itemsField,
									this.idField, this.parentField);
						var A = mini.treeToArray(B, this.itemsField,
								this.idField, this.parentField);
						this._doParseFields(A);
						this.createNavBarMenu(B);
						this.fire("load")
					},
					loadList : function(A, D, B) {
						D = D || this.idField;
						B = B || this.parentField;
						this._doParseFields(A);
						var C = mini.arrayToTree(A, this.nodesField, D, B);
						this.load(C)
					},
					load : function(A) {
						if (typeof A == "string")
							this.setUrl(A);
						else
							this.createNavBarMenu(A)
					},
					setData : function(A) {
						this.load(A)
					},
					setUrl : function(A) {
						this.url = A;
						this._doLoad()
					},
					getUrl : function() {
						return this.url
					},
					setTextField : function(A) {
						this.textField = A
					},
					getTextField : function() {
						return this.textField
					},
					setIconField : function(A) {
						this.iconField = A
					},
					getIconField : function() {
						return this.iconField
					},
					setUrlField : function(A) {
						this.urlField = A
					},
					getUrlField : function() {
						return this.urlField
					},
					setResultAsTree : function(A) {
						this.resultAsTree = A
					},
					getResultAsTree : function() {
						return this.resultAsTree
					},
					setNodesField : function(A) {
						this.nodesField = A
					},
					getNodesField : function() {
						return this.nodesField
					},
					setIdField : function(A) {
						this.idField = A
					},
					getIdField : function() {
						return this.idField
					},
					setParentField : function(A) {
						this.parentField = A
					},
					getParentField : function() {
						return this.parentField
					},
					_selected : null,
					getSelected : function() {
						return this._selected
					},
					selectNode : function(A) {
						A = this.getNode(A);
						if (!A)
							return;
						var B = this._getOwnerMenu(A);
						if (!B)
							return;
						this.expandGroup(B._ownerGroup);
						setTimeout(function() {
							try {
								B.setSelectedItem(A)
							} catch (C) {
							}
						}, 100)
					},
					getNode : function(B) {
						for ( var A = 0, D = this._menus.length; A < D; A++) {
							var E = this._menus[A], C = E.getItem(B);
							if (C)
								return C
						}
						return null
					},
					_getOwnerMenu : function(B) {
						if (!B)
							return;
						for ( var A = 0, D = this._menus.length; A < D; A++) {
							var E = this._menus[A], C = E.getItem(B);
							if (C)
								return E
						}
					},
					getAttrs : function(A) {
						var B = mini.OutlookMenu.superclass.getAttrs.call(this,
								A);
						B.text = A.innerHTML;
						mini._ParseString(A, B, [ "url", "textField",
								"urlField", "idField", "parentField",
								"itemsField", "iconField", "onitemclick",
								"onitemselect" ]);
						mini._ParseBool(A, B, [ "resultAsTree" ]);
						return B
					},
					autoCollapse : true,
					activeIndex : 0,
					createNavBarMenu : function(F) {
						if (!mini.isArray(F))
							F = [];
						this.data = F;
						var D = [];
						for ( var B = 0, G = this.data.length; B < G; B++) {
							var A = this.data[B], C = {};
							C.title = A.text;
							C.iconCls = A.iconCls;
							D.push(C);
							C._children = A[this.itemsField]
						}
						this.setGroups(D);
						this.setActiveIndex(this.activeIndex);
						this._menus = [];
						for (B = 0, G = this.groups.length; B < G; B++) {
							var C = this.groups[B], E = this.getGroupBodyEl(C), H = new mini.Menu();
							H._ownerGroup = C;
							H
									.set( {
										showNavArrow : false,
										style : "width:100%;height:100%;border:0;background:none",
										borderStyle : "border:0",
										allowSelectItem : true,
										items : C._children
									});
							H.render(E);
							H.on("itemclick", this.__OnItemClick, this);
							H.on("itemselect", this.__OnItemSelect, this);
							this._menus.push(H);
							delete C._children
						}
					},
					__OnItemClick : function(B) {
						var A = {
							item : B.item,
							htmlEvent : B.htmlEvent
						};
						this.fire("itemclick", A)
					},
					__OnItemSelect : function(E) {
						if (!E.item)
							return;
						for ( var A = 0, C = this._menus.length; A < C; A++) {
							var D = this._menus[A];
							if (D != E.sender)
								D.setSelectedItem(null)
						}
						var B = {
							item : E.item,
							htmlEvent : E.htmlEvent
						};
						this._selected = E.item;
						this.fire("itemselect", B)
					}
				});
mini.regClass(mini.OutlookMenu, "outlookmenu");
mini.OutlookTree = function() {
	mini.OutlookTree.superclass.constructor.call(this);
	this.data = []
};
mini
		.extend(
				mini.OutlookTree,
				mini.OutlookBar,
				{
					url : "",
					textField : "text",
					iconField : "iconCls",
					urlField : "url",
					resultAsTree : false,
					nodesField : "children",
					idField : "id",
					parentField : "pid",
					style : "width:100%;height:100%;",
					set : function(B) {
						if (typeof B == "string")
							return this;
						var C = B.url;
						delete B.url;
						var A = B.activeIndex;
						delete B.activeIndex;
						mini.OutlookTree.superclass.set.call(this, B);
						if (C)
							this.setUrl(C);
						if (mini.isNumber(A))
							this.setActiveIndex(A);
						return this
					},
					uiCls : "mini-outlooktree",
					destroy : function(D) {
						if (this._trees) {
							var B = this._trees.clone();
							for ( var A = 0, E = B.length; A < E; A++) {
								var C = B[A];
								C.destroy()
							}
							this._trees.length = 0
						}
						mini.OutlookTree.superclass.destroy.call(this, D)
					},
					_doParseFields : function(B) {
						for ( var C = 0, D = B.length; C < D; C++) {
							var A = B[C];
							A.text = A[this.textField];
							A.url = A[this.urlField];
							A.iconCls = A[this.iconField]
						}
					},
					_doLoad : function() {
						var B = [];
						try {
							B = mini.getData(this.url)
						} catch (C) {
							if (mini_debugger == true)
								alert("outlooktree json is error.")
						}
						if (!B)
							B = [];
						if (this.resultAsTree == false)
							B = mini.arrayToTree(B, this.nodesField,
									this.idField, this.parentField);
						var A = mini.treeToArray(B, this.nodesField,
								this.idField, this.parentField);
						this._doParseFields(A);
						this.createNavBarTree(B);
						this.fire("load")
					},
					loadList : function(A, D, B) {
						D = D || this.idField;
						B = B || this.parentField;
						this._doParseFields(A);
						var C = mini.arrayToTree(A, this.nodesField, D, B);
						this.load(C)
					},
					load : function(A) {
						if (typeof A == "string")
							this.setUrl(A);
						else
							this.createNavBarTree(A)
					},
					setData : function(A) {
						this.load(A)
					},
					setUrl : function(A) {
						this.url = A;
						this._doLoad()
					},
					getUrl : function() {
						return this.url
					},
					setTextField : function(A) {
						this.textField = A
					},
					getTextField : function() {
						return this.textField
					},
					setIconField : function(A) {
						this.iconField = A
					},
					getIconField : function() {
						return this.iconField
					},
					setUrlField : function(A) {
						this.urlField = A
					},
					getUrlField : function() {
						return this.urlField
					},
					setResultAsTree : function(A) {
						this.resultAsTree = A
					},
					getResultAsTree : function() {
						return this.resultAsTree
					},
					setNodesField : function(A) {
						this.nodesField = A
					},
					getNodesField : function() {
						return this.nodesField
					},
					setIdField : function(A) {
						this.idField = A
					},
					getIdField : function() {
						return this.idField
					},
					setParentField : function(A) {
						this.parentField = A
					},
					getParentField : function() {
						return this.parentField
					},
					_selected : null,
					getSelected : function() {
						return this._selected
					},
					selectNode : function(B) {
						B = this.getNode(B);
						if (!B)
							return;
						var A = this._getOwnerTree(B);
						A.selectNode(B)
					},
					expandPath : function(B) {
						B = this.getNode(B);
						if (!B)
							return;
						var A = this._getOwnerTree(B);
						A.expandPath(B);
						this.expandGroup(A._ownerGroup)
					},
					getNode : function(C) {
						for ( var A = 0, E = this._trees.length; A < E; A++) {
							var B = this._trees[A], D = B.getNode(C);
							if (D)
								return D
						}
						return null
					},
					_getOwnerTree : function(C) {
						if (!C)
							return;
						for ( var A = 0, D = this._trees.length; A < D; A++) {
							var B = this._trees[A];
							if (B.getby_id(C._id))
								return B
						}
					},
					expandOnLoad : false,
					setExpandOnLoad : function(A) {
						this.expandOnLoad = A
					},
					getExpandOnLoad : function() {
						return this.expandOnLoad
					},
					getAttrs : function(B) {
						var C = mini.OutlookTree.superclass.getAttrs.call(this,
								B);
						C.text = B.innerHTML;
						mini._ParseString(B, C, [ "url", "textField",
								"urlField", "idField", "parentField",
								"nodesField", "iconField", "onnodeclick",
								"onnodeselect", "onnodemousedown",
								"expandOnLoad" ]);
						mini._ParseBool(B, C, [ "resultAsTree" ]);
						if (C.expandOnLoad) {
							var A = parseInt(C.expandOnLoad);
							if (mini.isNumber(A))
								C.expandOnLoad = A;
							else
								C.expandOnLoad = C.expandOnLoad == "true" ? true
										: false
						}
						return C
					},
					autoCollapse : true,
					activeIndex : 0,
					createNavBarTree : function(F) {
						if (!mini.isArray(F))
							F = [];
						this.data = F;
						var D = [];
						for ( var B = 0, G = this.data.length; B < G; B++) {
							var A = this.data[B], C = {};
							C.title = A.text;
							C.iconCls = A.iconCls;
							D.push(C);
							C._children = A[this.nodesField]
						}
						this.setGroups(D);
						this.setActiveIndex(this.activeIndex);
						this._trees = [];
						for (B = 0, G = this.groups.length; B < G; B++) {
							var C = this.groups[B], E = this.getGroupBodyEl(C), F = new mini.Tree();
							F
									.set( {
										expandOnLoad : this.expandOnLoad,
										showTreeIcon : true,
										style : "width:100%;height:100%;border:0;background:none",
										data : C._children
									});
							F.render(E);
							F.on("nodeclick", this.__OnNodeClick, this);
							F.on("nodeselect", this.__OnNodeSelect, this);
							F.on("nodemousedown", this.__OnNodeMouseDown, this);
							this._trees.push(F);
							delete C._children;
							F._ownerGroup = C
						}
					},
					__OnNodeMouseDown : function(B) {
						var A = {
							node : B.node,
							isLeaf : B.sender.isLeaf(B.node),
							htmlEvent : B.htmlEvent
						};
						this.fire("nodemousedown", A)
					},
					__OnNodeClick : function(B) {
						var A = {
							node : B.node,
							isLeaf : B.sender.isLeaf(B.node),
							htmlEvent : B.htmlEvent
						};
						this.fire("nodeclick", A)
					},
					__OnNodeSelect : function(E) {
						if (!E.node)
							return;
						for ( var A = 0, D = this._trees.length; A < D; A++) {
							var C = this._trees[A];
							if (C != E.sender)
								C.selectNode(null)
						}
						var B = {
							node : E.node,
							isLeaf : E.sender.isLeaf(E.node),
							htmlEvent : E.htmlEvent
						};
						this._selected = E.node;
						this.fire("nodeselect", B)
					}
				});
mini.regClass(mini.OutlookTree, "outlooktree");
mini.NavBar = function() {
	mini.NavBar.superclass.constructor.call(this)
};
mini.extend(mini.NavBar, mini.OutlookBar, {
	uiCls : "mini-navbar"
});
mini.regClass(mini.NavBar, "navbar");
mini.NavBarMenu = function() {
	mini.NavBarMenu.superclass.constructor.call(this)
};
mini.extend(mini.NavBarMenu, mini.OutlookMenu, {
	uiCls : "mini-navbarmenu"
});
mini.regClass(mini.NavBarMenu, "navbarmenu");
mini.NavBarTree = function() {
	mini.NavBarTree.superclass.constructor.call(this)
};
mini.extend(mini.NavBarTree, mini.OutlookTree, {
	uiCls : "mini-navbartree"
});
mini.regClass(mini.NavBarTree, "navbartree");
mini.ToolBar = function() {
	mini.ToolBar.superclass.constructor.call(this)
};
mini.extend(mini.ToolBar, mini.Container, {
	_clearBorder : false,
	style : "",
	uiCls : "mini-toolbar",
	_create : function() {
		this.el = document.createElement("div");
		this.el.className = "mini-toolbar"
	},
	_initEvents : function() {
	},
	doLayout : function() {
		if (!this.canLayout())
			return;
		var C = mini.getChildNodes(this.el, true);
		for ( var A = 0, B = C.length; A < B; A++)
			mini.layout(C[A])
	},
	set_bodyParent : function(A) {
		if (!A)
			return;
		this.el = A;
		this.doLayout()
	},
	getAttrs : function(A) {
		var B = {};
		mini._ParseString(A, B, [ "id", "borderStyle" ]);
		this.el = A;
		this.el.uid = this.uid;
		this.addCls(this.uiCls);
		return B
	}
});
mini.regClass(mini.ToolBar, "toolbar");
mini.Pager = function() {
	mini.Pager.superclass.constructor.call(this)
};
mini
		.extend(
				mini.Pager,
				mini.Control,
				{
					pageIndex : 0,
					pageSize : 10,
					totalCount : 0,
					totalPage : 0,
					showPageIndex : true,
					showPageSize : true,
					showTotalCount : true,
					showPageInfo : true,
					showReloadButton : true,
					_clearBorder : false,
					showButtonText : false,
					showButtonIcon : true,
					firstText : "\u9996\u9875",
					prevText : "\u4e0a\u4e00\u9875",
					nextText : "\u4e0b\u4e00\u9875",
					lastText : "\u5c3e\u9875",
					pageInfoText : "\u6bcf\u9875 {0} \u6761, \u5171 {1} \u6761",
					sizeList : [ 10, 20, 50, 100 ],
					uiCls : "mini-pager",
					_create : function() {
						this.el = document.createElement("div");
						this.el.className = "mini-pager";
						var A = "<div class=\"mini-pager-left\"></div><div class=\"mini-pager-right\"></div>";
						this.el.innerHTML = A;
						this.buttonsEl = this._leftEl = this.el.childNodes[0];
						this._rightEl = this.el.childNodes[1];
						this.sizeEl = mini.append(this.buttonsEl,
								"<span class=\"mini-pager-size\"></span>");
						this.sizeCombo = new mini.ComboBox();
						this.sizeCombo.setName("pagesize");
						this.sizeCombo.setWidth(48);
						this.sizeCombo.render(this.sizeEl);
						mini.append(this.sizeEl,
								"<span class=\"separator\"></span>");
						this.firstButton = new mini.Button();
						this.firstButton.render(this.buttonsEl);
						this.prevButton = new mini.Button();
						this.prevButton.render(this.buttonsEl);
						this.indexEl = document.createElement("span");
						this.indexEl.className = "mini-pager-index";
						this.indexEl.innerHTML = "<input id=\"\" type=\"text\" class=\"mini-pager-num\"/><span class=\"mini-pager-pages\">/ 0</span>";
						this.buttonsEl.appendChild(this.indexEl);
						this.numInput = this.indexEl.firstChild;
						this.pagesLabel = this.indexEl.lastChild;
						this.nextButton = new mini.Button();
						this.nextButton.render(this.buttonsEl);
						this.lastButton = new mini.Button();
						this.lastButton.render(this.buttonsEl);
						mini.append(this.buttonsEl,
								"<span class=\"separator\"></span>");
						this.reloadButton = new mini.Button();
						this.reloadButton.render(this.buttonsEl);
						this.firstButton.setPlain(true);
						this.prevButton.setPlain(true);
						this.nextButton.setPlain(true);
						this.lastButton.setPlain(true);
						this.reloadButton.setPlain(true);
						this.update()
					},
					destroy : function(A) {
						if (this.pageSelect) {
							mini.clearEvent(this.pageSelect);
							this.pageSelect = null
						}
						if (this.numInput) {
							mini.clearEvent(this.numInput);
							this.numInput = null
						}
						this.sizeEl = null;
						this.buttonsEl = null;
						mini.Pager.superclass.destroy.call(this, A)
					},
					_initEvents : function() {
						mini.Pager.superclass._initEvents.call(this);
						this.firstButton.on("click", function(A) {
							this._OnPageChanged(0)
						}, this);
						this.prevButton.on("click", function(A) {
							this._OnPageChanged(this.pageIndex - 1)
						}, this);
						this.nextButton.on("click", function(A) {
							this._OnPageChanged(this.pageIndex + 1)
						}, this);
						this.lastButton.on("click", function(A) {
							this._OnPageChanged(this.totalPage)
						}, this);
						this.reloadButton.on("click", function(A) {
							this._OnPageChanged()
						}, this);
						function A() {
							if (B)
								return;
							B = true;
							var A = parseInt(this.numInput.value);
							if (isNaN(A))
								this.update();
							else
								this._OnPageChanged(A - 1);
							setTimeout(function() {
								B = false
							}, 100)
						}
						var B = false;
						mini.on(this.numInput, "change", function(B) {
							A.call(this)
						}, this);
						mini.on(this.numInput, "keydown", function(B) {
							if (B.keyCode == 13) {
								A.call(this);
								B.stopPropagation()
							}
						}, this);
						this.sizeCombo.on("valuechanged",
								this.__OnPageSelectChanged, this)
					},
					doLayout : function() {
						if (!this.canLayout())
							return;
						mini.layout(this._leftEl);
						mini.layout(this._rightEl)
					},
					setPageIndex : function(A) {
						if (isNaN(A))
							return;
						this.pageIndex = A;
						this.update()
					},
					getPageIndex : function() {
						return this.pageIndex
					},
					setPageSize : function(A) {
						if (isNaN(A))
							return;
						this.pageSize = A;
						this.update()
					},
					getPageSize : function() {
						return this.pageSize
					},
					setTotalCount : function(A) {
						A = parseInt(A);
						if (isNaN(A))
							return;
						this.totalCount = A;
						this.update()
					},
					getTotalCount : function() {
						return this.totalCount
					},
					setSizeList : function(A) {
						if (!mini.isArray(A))
							return;
						this.sizeList = A;
						this.update()
					},
					getSizeList : function() {
						return this.sizeList
					},
					setShowPageSize : function(A) {
						this.showPageSize = A;
						this.update()
					},
					getShowPageSize : function() {
						return this.showPageSize
					},
					setShowPageIndex : function(A) {
						this.showPageIndex = A;
						this.update()
					},
					getShowPageIndex : function() {
						return this.showPageIndex
					},
					setShowTotalCount : function(A) {
						this.showTotalCount = A;
						this.update()
					},
					getShowTotalCount : function() {
						return this.showTotalCount
					},
					setShowPageInfo : function(A) {
						this.showPageInfo = A;
						this.update()
					},
					getShowPageInfo : function() {
						return this.showPageInfo
					},
					setShowReloadButton : function(A) {
						this.showReloadButton = A;
						this.update()
					},
					getShowReloadButton : function() {
						return this.showReloadButton
					},
					getTotalPage : function() {
						return this.totalPage
					},
					update : function(A, J, H) {
						if (mini.isNumber(A))
							this.pageIndex = parseInt(A);
						if (mini.isNumber(J))
							this.pageSize = parseInt(J);
						if (mini.isNumber(H))
							this.totalCount = parseInt(H);
						this.totalPage = parseInt(this.totalCount / this.pageSize) + 1;
						if ((this.totalPage - 1) * this.pageSize == this.totalCount)
							this.totalPage -= 1;
						if (this.totalCount == 0)
							this.totalPage = 0;
						if (this.pageIndex > this.totalPage - 1)
							this.pageIndex = this.totalPage - 1;
						if (this.pageIndex <= 0)
							this.pageIndex = 0;
						if (this.totalPage <= 0)
							this.totalPage = 0;
						this.firstButton.enable();
						this.prevButton.enable();
						this.nextButton.enable();
						this.lastButton.enable();
						if (this.pageIndex == 0) {
							this.firstButton.disable();
							this.prevButton.disable()
						}
						if (this.pageIndex >= this.totalPage - 1) {
							this.nextButton.disable();
							this.lastButton.disable()
						}
						this.numInput.value = this.pageIndex > -1 ? this.pageIndex + 1
								: 0;
						this.pagesLabel.innerHTML = "/ " + this.totalPage;
						var N = this.sizeList.clone();
						if (N.indexOf(this.pageSize) == -1) {
							N.push(this.pageSize);
							N = N.sort(function(A, B) {
								return A > B
							})
						}
						var B = [];
						for ( var G = 0, D = N.length; G < D; G++) {
							var F = N[G], I = {};
							I.text = F;
							I.id = F;
							B.push(I)
						}
						this.sizeCombo.setData(B);
						this.sizeCombo.setValue(this.pageSize);
						var C = this.firstText, M = this.prevText, E = this.nextText, K = this.lastText;
						if (this.showButtonText == false)
							C = M = E = K = "";
						this.firstButton.setText(C);
						this.prevButton.setText(M);
						this.nextButton.setText(E);
						this.lastButton.setText(K);
						C = this.firstText, M = this.prevText,
								E = this.nextText, K = this.lastText;
						if (this.showButtonText == true)
							C = M = E = K = "";
						this.firstButton.setTooltip(C);
						this.prevButton.setTooltip(M);
						this.nextButton.setTooltip(E);
						this.lastButton.setTooltip(K);
						this.firstButton
								.setIconCls(this.showButtonIcon ? "mini-pager-first"
										: "");
						this.prevButton
								.setIconCls(this.showButtonIcon ? "mini-pager-prev"
										: "");
						this.nextButton
								.setIconCls(this.showButtonIcon ? "mini-pager-next"
										: "");
						this.lastButton
								.setIconCls(this.showButtonIcon ? "mini-pager-last"
										: "");
						this.reloadButton
								.setIconCls(this.showButtonIcon ? "mini-pager-reload"
										: "");
						this.reloadButton.setVisible(this.showReloadButton);
						var L = this.reloadButton.el.previousSibling;
						if (L)
							L.style.display = this.showReloadButton ? ""
									: "none";
						this._rightEl.innerHTML = String.format(
								this.pageInfoText, this.pageSize,
								this.totalCount);
						this.indexEl.style.display = this.showPageIndex ? ""
								: "none";
						this.sizeEl.style.display = this.showPageSize ? ""
								: "none";
						this._rightEl.style.display = this.showPageInfo ? ""
								: "none"
					},
					__OnPageSelectChanged : function(B) {
						var A = parseInt(this.sizeCombo.getValue());
						this._OnPageChanged(0, A)
					},
					_OnPageChanged : function(A, B) {
						var C = {
							pageIndex : mini.isNumber(A) ? A : this.pageIndex,
							pageSize : mini.isNumber(B) ? B : this.pageSize,
							cancel : false
						};
						if (C.pageIndex > this.totalPage - 1)
							C.pageIndex = this.totalPage - 1;
						if (C.pageIndex < 0)
							C.pageIndex = 0;
						this.fire("beforepagechanged", C);
						if (C.cancel == true)
							return;
						this.fire("pagechanged", C);
						this.update(C.pageIndex, C.pageSize)
					},
					onPageChanged : function(B, A) {
						this.on("pagechanged", B, A)
					},
					getAttrs : function(el) {
						var attrs = mini.Pager.superclass.getAttrs.call(this,
								el);
						mini._ParseString(el, attrs, [ "onpagechanged",
								"sizeList", "onbeforepagechanged" ]);
						mini._ParseBool(el, attrs, [ "showPageIndex",
								"showPageSize", "showTotalCount",
								"showPageInfo", "showReloadButton" ]);
						mini._ParseInt(el, attrs, [ "pageIndex", "pageSize",
								"totalCount" ]);
						if (typeof attrs.sizeList == "string")
							attrs.sizeList = eval(attrs.sizeList);
						return attrs
					}
				});
mini.regClass(mini.Pager, "pager");
mini.DataBinding = function() {
	this._bindFields = [];
	this._bindForms = [];
	mini.DataBinding.superclass.constructor.call(this)
};
mini.extend(mini.DataBinding, mini.Component, {
	bindField : function(C, F, E, D, A) {
		C = mini.get(C);
		F = mini.get(F);
		if (!C || !F || !E)
			return;
		var B = {
			control : C,
			source : F,
			field : E,
			convert : A,
			mode : D
		};
		this._bindFields.push(B);
		F.on("currentchanged", this.__OnCurrentChanged, this);
		C.on("valuechanged", this.__OnValueChanged, this)
	},
	bindForm : function(D, H, F, C) {
		D = mini.byId(D);
		H = mini.get(H);
		if (!D || !H)
			return;
		var D = new mini.Form(D), A = D.getFields();
		for ( var B = 0, G = A.length; B < G; B++) {
			var E = A[B];
			this.bindField(E, H, E.getName(), F, C)
		}
	},
	__OnCurrentChanged : function(J) {
		if (this._doSetting)
			return;
		this._doSetting = true;
		var I = J.sender, B = J.record;
		for ( var A = 0, H = this._bindFields.length; A < H; A++) {
			var D = this._bindFields[A];
			if (D.source != I)
				continue;
			var E = D.control, F = D.field;
			if (E.setValue)
				if (B) {
					var C = B[F];
					E.setValue(C)
				} else
					E.setValue("");
			if (E.setText && E.textName)
				if (B)
					E.setText(B[E.textName]);
				else
					E.setText("")
		}
		var G = this;
		setTimeout(function() {
			G._doSetting = false
		}, 10)
	},
	__OnValueChanged : function(J) {
		if (this._doSetting)
			return;
		this._doSetting = true;
		var F = J.sender, B = F.getValue();
		for ( var A = 0, I = this._bindFields.length; A < I; A++) {
			var E = this._bindFields[A];
			if (E.control != F || E.mode === false)
				continue;
			var H = E.source, D = H.getCurrent();
			if (!D)
				continue;
			var C = {};
			C[E.field] = B;
			if (F.getText && F.textName)
				C[F.textName] = F.getText();
			H.updateRow(D, C)
		}
		var G = this;
		setTimeout(function() {
			G._doSetting = false
		}, 10)
	}
});
mini.regClass(mini.DataBinding, "databinding");
mini.DataSet = function() {
	this._sources = {};
	this._data = {};
	this._links = [];
	this._originals = {};
	mini.DataSet.superclass.constructor.call(this)
};
mini
		.extend(
				mini.DataSet,
				mini.Component,
				{
					add : function(B, A) {
						if (!B || !A)
							return;
						this._sources[B] = A;
						this._data[B] = [];
						A._set_autoCreateNewID(true);
						A._set_originalIdField(A.getIdField());
						A._set_clearOriginals(false);
						A.on("addrow", this.__OnRowChanged, this);
						A.on("updaterow", this.__OnRowChanged, this);
						A.on("deleterow", this.__OnRowChanged, this);
						A.on("removerow", this.__OnRowChanged, this);
						A.on("preload", this.__OnDataPreLoad, this);
						A.on("selectionchanged", this.__OnDataSelectionChanged,
								this)
					},
					addLink : function(D, B, A) {
						if (!D || !B || !A)
							return;
						if (!this._sources[D] || !this._sources[B])
							return;
						var C = {
							parentName : D,
							childName : B,
							parentField : A
						};
						this._links.push(C)
					},
					clearData : function() {
						this._data = {};
						this._originals = {};
						for ( var A in this._sources)
							this._data = []
					},
					getData : function() {
						return this._data
					},
					_getNameByListControl : function(A) {
						for ( var C in this._sources) {
							var B = this._sources[C];
							if (B == A)
								return C
						}
					},
					_getRecord : function(G, B, F) {
						var D = this._data[G];
						if (!D)
							return false;
						for ( var A = 0, E = D.length; A < E; A++) {
							var C = D[A];
							if (C[F] == B[F])
								return C
						}
						return null
					},
					__OnRowChanged : function(H) {
						var E = H.type, B = H.record, F = this
								._getNameByListControl(H.sender), G = this
								._getRecord(F, B, H.sender.getIdField()), C = this._data[F];
						if (G) {
							C = this._data[F];
							C.remove(G)
						}
						if (E == "removerow" && B._state == "added")
							;
						else
							C.push(B);
						this._originals[F] = H.sender._get_originals();
						if (B._state == "added") {
							var A = this._getParentSource(H.sender);
							if (A) {
								var D = A.getSelected();
								if (D)
									B._parentId = D[A.getIdField()];
								else
									C.remove(B)
							}
						}
					},
					__OnDataPreLoad : function(O) {
						var L = O.sender, N = this._getNameByListControl(L), M = O.sender
								.getIdField(), C = this._data[N], A = {};
						for ( var H = 0, E = C.length; H < E; H++) {
							var I = C[H];
							A[I[M]] = I
						}
						var P = this._originals[N];
						if (P)
							L._set_originals(P);
						var K = O.data || [];
						for (H = 0, E = K.length; H < E; H++) {
							var I = K[H], J = A[I[M]];
							if (J) {
								delete J._uid;
								mini.copyTo(I, J)
							}
						}
						var F = this._getParentSource(L);
						if (L.getPageIndex && L.getPageIndex() == 0) {
							var G = [];
							for (H = 0, E = C.length; H < E; H++) {
								I = C[H];
								if (I._state == "added")
									if (F) {
										var D = F.getSelected();
										if (D
												&& D[F.getIdField()] == I._parentId)
											G.push(I)
									} else
										G.push(I)
							}
							G.reverse();
							K.insertRange(0, G)
						}
						var B = [];
						for (H = K.length - 1; H >= 0; H--) {
							I = K[H], J = A[I[M]];
							if (J && J._state == "removed") {
								K.removeAt(H);
								B.push(J)
							}
						}
					},
					_getParentSource : function(E) {
						var B = this._getNameByListControl(E);
						for ( var A = 0, D = this._links.length; A < D; A++) {
							var C = this._links[A];
							if (C.childName == B)
								return this._sources[C.parentName]
						}
					},
					_getLinks : function(D) {
						var E = this._getNameByListControl(D), F = [];
						for ( var A = 0, C = this._links.length; A < C; A++) {
							var B = this._links[A];
							if (B.parentName == E)
								F.push(B)
						}
						return F
					},
					__OnDataSelectionChanged : function(I) {
						var C = I.sender, B = C.getSelected(), H = this
								._getLinks(C);
						for ( var A = 0, G = H.length; A < G; A++) {
							var F = H[A], E = this._sources[F.childName];
							if (B) {
								var D = {};
								D[F.parentField] = B[C.getIdField()];
								E.load(D)
							} else
								E.loadData( [])
						}
					}
				});
mini.regClass(mini.DataSet, "dataset");
mini.DataSource = function() {
	mini.DataSource.superclass.constructor.call(this);
	this._init()
};
mini
		.extend(
				mini.DataSource,
				mini.Component,
				{
					idField : "id",
					textField : "text",
					_originalIdField : "_id",
					_clearOriginals : true,
					_autoCreateNewID : false,
					_init : function() {
						this.source = [];
						this.dataview = [];
						this.visibleRows = null;
						this._ids = {};
						this._removeds = [];
						if (this._clearOriginals)
							this._originals = {};
						this._errors = {};
						this._selected = null;
						this._selecteds = [];
						this._idSelecteds = {};
						this.__changeCount = 0
					},
					getSource : function() {
						return this.source.clone()
					},
					getList : function() {
						return this.source.clone()
					},
					getDataView : function() {
						return this.dataview
					},
					getVisibleRows : function() {
						if (!this.visibleRows)
							this.visibleRows = this.getDataView().clone();
						return this.visibleRows
					},
					setData : function(A) {
						this.loadData(A)
					},
					loadData : function(A) {
						if (!mini.isArray(A))
							A = [];
						this._init();
						this._doLoadData(A);
						this._dataChanged();
						this.fire("loaddata");
						return true
					},
					_doLoadData : function(E) {
						this.source = E;
						this.dataview = E;
						var C = this.source, D = this._ids;
						for ( var B = 0, F = C.length; B < F; B++) {
							var A = C[B];
							A._id = mini.DataSource.RecordId++;
							D[A._id] = A;
							A._uid = A._id
						}
					},
					clearData : function() {
						this._init();
						this._dataChanged();
						this.fire("cleardata")
					},
					clear : function() {
						this.clearData()
					},
					updateRecord : function(A, D, B) {
						if (mini.isNull(A))
							return;
						this.fire("beforeupdate", {
							record : A
						});
						if (typeof D == "string") {
							var E = A[D];
							if (mini.isEquals(E, B))
								return false;
							this.beginChange();
							A[D] = B;
							this._setModified(A, D, E);
							this.endChange()
						} else {
							this.beginChange();
							for ( var C in D) {
								var E = A[C], B = D[C];
								if (mini.isEquals(E, B))
									continue;
								A[C] = B;
								this._setModified(A, C, E)
							}
							this.endChange()
						}
						this.fire("update", {
							record : A
						})
					},
					deleteRecord : function(A) {
						this._setDeleted(A);
						this._dataChanged();
						this.fire("delete", {
							record : A
						})
					},
					getby_id : function(A) {
						A = typeof A == "object" ? A._id : A;
						return this._ids[A]
					},
					getbyId : function(F) {
						var D = typeof F;
						if (D == "number")
							return this.getAt(F);
						if (typeof F == "object")
							return F;
						var C = this.getList();
						for ( var B = 0, E = C.length; B < E; B++) {
							var A = C[B];
							if (A[this.idField] == F)
								return A
						}
						return null
					},
					getsByIds : function(B) {
						if (mini.isNull(B))
							B = "";
						B = String(B);
						var F = [], C = String(B).split(",");
						for ( var A = 0, E = C.length; A < E; A++) {
							var D = this.getbyId(C[A]);
							if (D)
								F.push(D)
						}
						return F
					},
					getRecord : function(A) {
						return this.getRow(A)
					},
					getRow : function(A) {
						var B = typeof A;
						if (B == "string")
							return this.getbyId(A);
						else if (B == "number")
							return this.getAt(A);
						else if (B == "object")
							return A
					},
					delimiter : ",",
					getValueAndText : function(D, A) {
						if (mini.isNull(D))
							D = [];
						A = A || this.delimiter;
						if (typeof D == "string")
							D = this.getsByIds(D);
						else if (!mini.isArray(D))
							D = [ D ];
						var E = [], F = [];
						for ( var C = 0, G = D.length; C < G; C++) {
							var B = D[C];
							if (B) {
								E.push(this.getItemValue(B));
								F.push(this.getItemText(B))
							}
						}
						return [ E.join(A), F.join(A) ]
					},
					getItemValue : function(A) {
						if (!A)
							return "";
						var B = A[this.idField];
						return mini.isNull(B) ? "" : String(B)
					},
					getItemText : function(A) {
						if (!A)
							return "";
						var B = A[this.textField];
						return mini.isNull(B) ? "" : String(B)
					},
					isModified : function(C, B) {
						var A = this._originals[C[this._originalIdField]];
						if (!A)
							return false;
						if (mini.isNull(B))
							return false;
						return A.hasOwnProperty(B)
					},
					hasRecord : function(A) {
						return !!this.getby_id(A)
					},
					findRecords : function(F, C) {
						var H = typeof F == "function", K = F, G = C || this, E = this.source, D = [];
						for ( var B = 0, J = E.length; B < J; B++) {
							var A = E[B];
							if (H) {
								var I = K.call(G, A);
								if (I == true)
									D[D.length] = A;
								if (I === 1)
									break
							} else if (A[F] == C)
								D[D.length] = A
						}
						return D
					},
					findRecord : function(C, A) {
						var B = this.findRecords(C, A);
						return B[0]
					},
					each : function(C, B) {
						var A = this.getDataView().clone();
						B = B || this;
						mini.forEach(A, C, B)
					},
					getCount : function() {
						return this.getDataView().length
					},
					setIdField : function(A) {
						this.idField = A
					},
					setTextField : function(A) {
						this.textField = A
					},
					__changeCount : 0,
					beginChange : function() {
						this.__changeCount++
					},
					endChange : function(A) {
						this.__changeCount--;
						if (this.__changeCount < 0)
							this.__changeCount = 0;
						if ((A !== false && this.__changeCount == 0)
								|| A == true) {
							this.__changeCount = 0;
							this._dataChanged()
						}
					},
					_dataChanged : function() {
						this.visibleRows = null;
						if (this.__changeCount == 0)
							this.fire("datachanged")
					},
					_setAdded : function(A) {
						A._id = mini.DataSource.RecordId++;
						if (this._autoCreateNewID && !A[this.idField])
							A[this.idField] = UUID();
						A._uid = A._id;
						A._state = "added";
						this._ids[A._id] = A;
						delete this._originals[A[this._originalIdField]]
					},
					_setModified : function(A, C, D) {
						if (A._state != "added" && A._state != "deleted"
								&& A._state != "removed") {
							A._state = "modified";
							var B = this._getOriginal(A);
							if (!B.hasOwnProperty(C))
								B[C] = D
						}
					},
					_setDeleted : function(A) {
						if (A._state != "added" && A._state != "deleted"
								&& A._state != "removed")
							A._state = "deleted"
					},
					_setRemoved : function(A) {
						delete this._ids[A._id];
						if (A._state != "added" && A._state != "removed") {
							A._state = "removed";
							delete this._originals[A[this._originalIdField]];
							this._removeds.push(A)
						}
					},
					_getOriginal : function(A) {
						var C = A[this._originalIdField], B = this._originals[C];
						if (!B)
							B = this._originals[C] = {};
						return B
					},
					_selected : null,
					_selecteds : [],
					_idSelecteds : null,
					multiSelect : false,
					isSelected : function(A) {
						if (!A)
							return false;
						if (typeof A != "string")
							A = A._id;
						return !!this._idSelecteds[A]
					},
					setSelected : function(A) {
						A = this.getby_id(A);
						var B = this.getSelected();
						if (B != A) {
							this._selected = A;
							if (A)
								this.select(A);
							else
								this.deselect(this.getSelected());
							this._OnCurrentChanged(A)
						}
					},
					getSelected : function() {
						if (this.isSelected(this._selected))
							return this._selected;
						return this._selecteds[0]
					},
					setCurrent : function(A) {
						this.setSelected(A)
					},
					getCurrent : function() {
						return this.getSelected()
					},
					getSelecteds : function() {
						return this._selecteds.clone()
					},
					select : function(A) {
						if (mini.isNull(A))
							return;
						this.selects( [ A ])
					},
					deselect : function(A) {
						if (mini.isNull(A))
							return;
						this.deselects( [ A ])
					},
					selectAll : function() {
						this.selects(this.getList())
					},
					deselectAll : function() {
						this.deselects(this.getList())
					},
					selects : function(C) {
						if (!mini.isArray(C))
							return;
						C = C.clone();
						if (this.multiSelect == false) {
							this.deselects(this.getSelecteds());
							if (C.length > 0)
								C.length = 1;
							this._selecteds = [];
							this._idSelecteds = {}
						}
						var D = [];
						for ( var B = 0, E = C.length; B < E; B++) {
							var A = this.getbyId(C[B]);
							if (!A)
								continue;
							if (!this.isSelected(A)) {
								this._selecteds.push(A);
								this._idSelecteds[A._id] = A;
								D.push(A)
							}
						}
						this._OnSelectionChanged(C, true, D)
					},
					deselects : function(C) {
						if (!mini.isArray(C))
							return;
						C = C.clone();
						var D = [];
						for ( var B = C.length - 1; B >= 0; B--) {
							var A = this.getbyId(C[B]);
							if (!A)
								continue;
							if (this.isSelected(A)) {
								this._selecteds.remove(A);
								delete this._idSelecteds[A._id];
								D.push(A)
							}
						}
						this._OnSelectionChanged(C, false, D)
					},
					_OnSelectionChanged : function(C, F, D) {
						var E = {
							records : C,
							select : F,
							selected : this.getSelected(),
							selecteds : this.getSelecteds(),
							_records : D
						};
						this.fire("SelectionChanged", E);
						var B = this._current, A = this.getCurrent();
						if (B != A) {
							this._current = A;
							this._OnCurrentChanged(A)
						}
					},
					_OnCurrentChanged : function(A) {
						if (this._currentTimer)
							clearTimeout(this._currentTimer);
						var B = this;
						this._currentTimer = setTimeout(function() {
							B._currentTimer = null;
							var C = {
								record : A
							};
							B.fire("CurrentChanged", C)
						}, 1)
					},
					_checkSelecteds : function() {
						for ( var B = this._selecteds.length - 1; B >= 0; B--) {
							var A = this._selecteds[B], C = this
									.getby_id(A._id);
							if (!C) {
								this._selecteds.removeAt(B);
								delete this._idSelecteds[A._id]
							}
						}
						if (this._selected
								&& this.getby_id(this._selected._id) == null)
							this._selected = null
					},
					setMultiSelect : function(A) {
						if (this.multiSelect != A) {
							this.multiSelect = A;
							if (A == false)
								;
						}
					},
					getMultiSelect : function() {
						return this.multiSelect
					},
					selectPrev : function() {
						var B = this.getSelected();
						if (!B)
							B = this.getAt(0);
						else {
							var A = this.indexOf(B);
							B = this.getAt(A - 1)
						}
						if (B) {
							this.deselectAll();
							this.select(B);
							this.setCurrent(B)
						}
					},
					selectNext : function() {
						var B = this.getSelected();
						if (!B)
							B = this.getAt(0);
						else {
							var A = this.indexOf(B);
							B = this.getAt(A + 1)
						}
						if (B) {
							this.deselectAll();
							this.select(B);
							this.setCurrent(B)
						}
					},
					selectFirst : function() {
						var A = this.getAt(0);
						if (A) {
							this.deselectAll();
							this.select(A);
							this.setCurrent(A)
						}
					},
					selectLast : function() {
						var B = this.getVisibleRows(), A = this
								.getAt(B.length - 1);
						if (A) {
							this.deselectAll();
							this.select(A);
							this.setCurrent(A)
						}
					},
					getSelectedsId : function(A) {
						var C = this.getSelecteds(), B = this.getValueAndText(
								C, A);
						return B[0]
					},
					getSelectedsText : function(A) {
						var C = this.getSelecteds(), B = this.getValueAndText(
								C, A);
						return B[1]
					},
					_filterInfo : null,
					_sortInfo : null,
					filter : function(B, A) {
						if (typeof B != "function")
							return;
						A = A || this;
						this._filterInfo = [ B, A ];
						this._doFilter();
						this._doSort();
						this._dataChanged();
						this.fire("filter")
					},
					clearFilter : function() {
						if (!this._filterInfo)
							return;
						this._filterInfo = null;
						this._doFilter();
						this._doSort();
						this._dataChanged();
						this.fire("filter")
					},
					sort : function(C, B, A) {
						if (typeof C != "function")
							return;
						B = B || this;
						this._sortInfo = [ C, B, A ];
						this._doSort();
						this._dataChanged();
						this.fire("sort")
					},
					clearSort : function() {
						this._sortInfo = null;
						this.sortField = this.sortOrder = null;
						this._doFilter();
						this._dataChanged();
						this.fire("filter")
					},
					_doClientSortField : function(E, D, B) {
						var C = this._getSortFnByField(E, B);
						if (!C)
							return;
						this.sortField = E;
						this.sortOrder = D;
						var A = D == "desc";
						this.sort(C, this, A)
					},
					_getSortFnByField : function(D, E) {
						if (!D)
							return null;
						var C = null, B = mini.sortTypes[E];
						if (!B)
							B = mini.sortTypes["string"];
						function A(F, J) {
							var G = mini._getMap(D, F), E = mini._getMap(D, J), I = mini
									.isNull(G)
									|| G === "", C = mini.isNull(E) || E === "";
							if (I)
								return -1;
							if (C)
								return 1;
							var A = B(G), H = B(E);
							if (A > H)
								return 1;
							else if (A == H)
								return 0;
							else
								return -1
						}
						C = A;
						return C
					},
					ajaxOptions : null,
					autoLoad : false,
					url : "",
					pageSize : 20,
					pageIndex : 0,
					totalCount : 0,
					totalPage : 0,
					sortField : "",
					sortOrder : "",
					loadParams : null,
					getLoadParams : function() {
						return this.loadParams || {}
					},
					sortMode : "server",
					pageIndexField : "pageIndex",
					pageSizeField : "pageSize",
					sortFieldField : "sortField",
					sortOrderField : "sortOrder",
					totalField : "total",
					dataField : "data",
					load : function(A, E, D, C) {
						if (typeof A == "string") {
							this.setUrl(A);
							return
						}
						if (this._loadTimer)
							clearTimeout(this._loadTimer);
						this.loadParams = A || {};
						if (this.ajaxAsync) {
							var B = this;
							this._loadTimer = setTimeout(function() {
								B._doLoadAjax(B.loadParams, E, D, C);
								B._loadTimer = null
							}, 1)
						} else
							this._doLoadAjax(this.loadParams, E, D, C)
					},
					reload : function(C, B, A) {
						this.load(this.loadParams, C, B, A)
					},
					gotoPage : function(A, C) {
						var B = this.loadParams || {};
						if (mini.isNumber(A))
							B.pageIndex = A;
						if (mini.isNumber(C))
							B.pageSize = C;
						this.load(B)
					},
					sortBy : function(C, B) {
						this.sortField = C;
						this.sortOrder = B == "asc" ? "asc" : "desc";
						if (this.sortMode == "server") {
							var A = this.getLoadParams();
							A.sortField = C;
							A.sortOrder = B;
							A.pageIndex = this.pageIndex;
							this.load(A)
						}
					},
					checkSelectOnLoad : true,
					selectOnLoad : false,
					ajaxData : null,
					ajaxAsync : true,
					ajaxType : "",
					_doLoadAjax : function(I, K, D, E, F) {
						I = I || {};
						if (mini.isNull(I.pageIndex))
							I.pageIndex = 0;
						if (mini.isNull(I.pageSize))
							I.pageSize = this.pageSize;
						I.sortField = this.sortField;
						I.sortOrder = this.sortOrder;
						this.loadParams = I;
						var J = this._evalUrl(), B = this._evalType(J), L = {
							url : J,
							async : this.ajaxAsync,
							type : B,
							data : I,
							params : I,
							cache : false,
							cancel : false
						};
						if (L.data != L.params && L.params != I)
							L.data = L.params;
						var G = mini._evalAjaxData(this.ajaxData, this);
						mini.copyTo(L.data, G);
						mini.copyTo(L, this.ajaxOptions);
						this._OnBeforeLoad(L);
						if (L.cancel == true)
							return;
						var A = {};
						A[this.pageIndexField] = I.pageIndex;
						A[this.pageSizeField] = I.pageSize;
						if (I.sortField)
							A[this.sortFieldField] = I.sortField;
						if (I.sortOrder)
							A[this.sortOrderField] = I.sortOrder;
						mini.copyTo(I, A);
						var H = this.getSelected();
						this._selectedValue = H ? H[this.idField] : null;
						var C = this;
						C._resultObject = null;
						mini
								.copyTo(
										L,
										{
											success : function(E, M, B) {
												var H = null;
												try {
													H = mini.decode(E)
												} catch (L) {
													if (mini_debugger == true)
														alert(J
																+ "\n json is error.")
												}
												if (H && !mini.isArray(H)) {
													H.total = mini._getMap(
															C.totalField, H);
													H.data = mini._getMap(
															C.dataField, H)
												} else if (H == null) {
													H = {};
													H.data = [];
													H.total = 0
												} else if (mini.isArray(H)) {
													var G = {};
													G.data = H;
													G.total = H.length;
													H = G
												}
												if (!H.data)
													H.data = [];
												if (!H.total)
													H.total = 0;
												C._resultObject = H;
												var L = {
													xhr : B,
													text : E,
													textStatus : M,
													result : H,
													total : H.total,
													data : H.data.clone(),
													pageIndex : I[C.pageIndexField],
													pageSize : I[C.pageSizeField]
												};
												if (mini.isNumber(H.error)
														&& H.error != 0) {
													L.textStatus = "servererror";
													L.errorCode = H.error;
													L.stackTrace = H.stackTrace;
													L.errorMsg = H.errorMsg;
													if (mini_debugger == true)
														alert(J + "\n"
																+ L.textStatus
																+ "\n"
																+ L.stackTrace);
													C.fire("loaderror", L);
													if (D)
														D.call(C, L)
												} else if (F)
													F(L);
												else {
													C.pageIndex = L.pageIndex;
													C.pageSize = L.pageSize;
													C.setTotalCount(L.total);
													C._OnPreLoad(L);
													C.setData(L.data);
													if (C._selectedValue
															&& C.checkSelectOnLoad) {
														var A = C
																.getbyId(C._selectedValue);
														if (A)
															C.select(A)
													}
													if (C.getSelected() == null
															&& C.selectOnLoad
															&& C.getDataView().length > 0)
														C.select(0);
													C.fire("load", L);
													if (K)
														K.call(C, L)
												}
											},
											error : function(A, F, B) {
												var E = {
													xhr : A,
													text : A.responseText,
													textStatus : F
												};
												E.errorMsg = A.responseText;
												E.errorCode = A.status;
												if (mini_debugger == true)
													alert(J + "\n"
															+ E.errorCode
															+ "\n" + E.errorMsg);
												C.fire("loaderror", E);
												if (D)
													D.call(C, E)
											},
											complete : function(A, D) {
												var B = {
													xhr : A,
													text : A.responseText,
													textStatus : D
												};
												C.fire("loadcomplete", B);
												if (E)
													E.call(C, B);
												C._xhr = null
											}
										});
						if (this._xhr)
							this._xhr.abort();
						this._xhr = mini.ajax(L)
					},
					_OnBeforeLoad : function(A) {
						this.fire("beforeload", A)
					},
					_OnPreLoad : function(A) {
						this.fire("preload", A)
					},
					_evalUrl : function() {
						var url = this.url;
						if (typeof url == "function")
							url = url();
						else {
							try {
								url = eval(url)
							} catch (ex) {
								url = this.url
							}
							if (!url)
								url = this.url
						}
						return url
					},
					_evalType : function(B) {
						var A = this.ajaxType;
						if (!A) {
							A = "post";
							if (B) {
								if (B.indexOf(".txt") != -1
										|| B.indexOf(".json") != -1)
									A = "get"
							} else
								A = "get"
						}
						return A
					},
					setSortMode : function(A) {
						this.sortMode = A
					},
					getSortMode : function() {
						return this.sortMode
					},
					setAjaxOptions : function(A) {
						this.ajaxOptions = A
					},
					getAjaxOptions : function() {
						return this.ajaxOptions
					},
					setAutoLoad : function(A) {
						this.autoLoad = A
					},
					getAutoLoad : function() {
						return this.autoLoad
					},
					setUrl : function(A) {
						this.url = A;
						if (this.autoLoad)
							this.load()
					},
					getUrl : function() {
						return this.url
					},
					setPageIndex : function(A) {
						this.pageIndex = A;
						this.fire("pageinfochanged")
					},
					getPageIndex : function() {
						return this.pageIndex
					},
					setPageSize : function(A) {
						this.pageSize = A;
						this.fire("pageinfochanged")
					},
					getPageSize : function() {
						return this.pageSize
					},
					setTotalCount : function(A) {
						this.totalCount = A;
						this.fire("pageinfochanged")
					},
					getTotalCount : function() {
						return this.totalCount
					},
					getTotalPage : function() {
						return this.totalPage
					},
					setCheckSelectOnLoad : function(A) {
						this.checkSelectOnLoad = A
					},
					getCheckSelectOnLoad : function() {
						return this.checkSelectOnLoad
					},
					setSelectOnLoad : function(A) {
						this.selectOnLoad = A
					},
					getSelectOnLoad : function() {
						return this.selectOnLoad
					}
				});
mini.DataSource.RecordId = 1;
mini.DataTable = function() {
	mini.DataTable.superclass.constructor.call(this)
};
mini
		.extend(
				mini.DataTable,
				mini.DataSource,
				{
					_init : function() {
						mini.DataTable.superclass._init.call(this);
						this._filterInfo = null;
						this._sortInfo = null
					},
					add : function(A) {
						return this.insert(this.source.length, A)
					},
					addRange : function(A) {
						this.insertRange(this.source.length, A)
					},
					insert : function(A, B) {
						if (!B)
							return null;
						var F = {
							index : A,
							record : B
						};
						this.fire("beforeadd", F);
						if (!mini.isNumber(A)) {
							var D = this.getRecord(A);
							if (D)
								A = this.indexOf(D);
							else
								A = this.getDataView().length
						}
						var E = this.dataview[A];
						if (E)
							this.dataview.insert(A, B);
						else
							this.dataview.add(B);
						if (this.dataview != this.source)
							if (E) {
								var C = this.source.indexOf(E);
								this.source.insert(C, B)
							} else
								this.source.add(B);
						this._setAdded(B);
						this._dataChanged();
						this.fire("add", F)
					},
					insertRange : function(A, D) {
						if (!mini.isArray(D))
							return;
						this.beginChange();
						for ( var C = 0, E = D.length; C < E; C++) {
							var B = D[C];
							this.insert(A + C, B)
						}
						this.endChange()
					},
					remove : function(B, C) {
						var A = this.indexOf(B);
						return this.removeAt(A, C)
					},
					removeAt : function(A, F) {
						var B = this.getAt(A);
						if (!B)
							return null;
						var E = {
							record : B
						};
						this.fire("beforeremove", E);
						var D = this.isSelected(B);
						this.source.removeAt(A);
						if (this.dataview !== this.source)
							this.dataview.removeAt(A);
						this._setRemoved(B);
						this._checkSelecteds();
						this._dataChanged();
						this.fire("remove", E);
						if (D && F) {
							var C = this.getAt(A);
							if (!C)
								C = this.getAt(A - 1);
							this.deselectAll();
							this.select(C)
						}
					},
					removeRange : function(C, E) {
						if (!mini.isArray(C))
							return;
						this.beginChange();
						C = C.clone();
						for ( var B = 0, D = C.length; B < D; B++) {
							var A = C[B];
							this.remove(A, E)
						}
						this.endChange()
					},
					move : function(B, J) {
						if (!B || !mini.isNumber(J))
							return;
						if (J < 0)
							return;
						if (mini.isArray(B)) {
							this.beginChange();
							var K = B, E = this.getAt(J), H = this;
							mini.sort(K, function(A, B) {
								return H.indexOf(A) > H.indexOf(B)
							}, this);
							for ( var G = 0, F = K.length; G < F; G++) {
								var C = K[G], A = this.indexOf(E);
								this.move(C, A)
							}
							this.endChange();
							return
						}
						var L = {
							index : J,
							record : B
						};
						this.fire("beforemove", L);
						var D = this.dataview[J];
						this.dataview.remove(B);
						var I = this.dataview.indexOf(D);
						if (I != -1)
							J = I;
						if (D)
							this.dataview.insert(J, B);
						else
							this.dataview.add(B);
						if (this.dataview != this.source) {
							this.source.remove(B);
							I = this.source.indexOf(D);
							if (I != -1)
								J = I;
							if (D)
								this.source.insert(J, B);
							else
								this.source.add(B)
						}
						this._dataChanged();
						this.fire("move", L)
					},
					indexOf : function(A) {
						return this.dataview.indexOf(A)
					},
					getAt : function(A) {
						return this.dataview[A]
					},
					getRange : function(C, D) {
						if (C > D) {
							var E = C;
							C = D;
							D = E
						}
						var F = [];
						for ( var B = C, G = D; B <= G; B++) {
							var A = this.dataview[B];
							F.push(A)
						}
						return F
					},
					selectRange : function(A, B) {
						if (!mini.isNumber(A))
							A = this.indexOf(A);
						if (!mini.isNumber(B))
							B = this.indexOf(B);
						if (mini.isNull(A) || mini.isNull(B))
							return;
						var C = this.getRange(A, B);
						this.selects(C)
					},
					toArray : function() {
						return this.source.clone()
					},
					getChanges : function(D) {
						var C = [];
						if (D == "removed" || D == null)
							C.addRange(this._removeds.clone());
						for ( var B = 0, E = this.source.length; B < E; B++) {
							var A = this.source[B];
							if (!A._state)
								continue;
							if (A._state == D || D == null)
								C[C.length] = A
						}
						return C
					},
					accept : function() {
						this.beginChange();
						for ( var B = 0, C = this.source.length; B < C; B++) {
							var A = this.source[B];
							this.acceptRecord(A)
						}
						this._removeds = [];
						this._originals = {};
						this.endChange()
					},
					reject : function() {
						this.beginChange();
						for ( var B = 0, C = this.source.length; B < C; B++) {
							var A = this.source[B];
							this.rejectRecord(A)
						}
						this._removeds = [];
						this._originals = {};
						this.endChange()
					},
					acceptRecord : function(A) {
						delete this._originals[A[this._originalIdField]];
						if (A._state == "deleted")
							this.removeNode(A);
						else {
							delete A._state;
							delete this._originals[A[this._originalIdField]];
							this._dataChanged()
						}
					},
					rejectRecord : function(B) {
						if (B._state == "added")
							this.removeNode(B);
						else if (B._state == "modified"
								|| B._state == "deleted") {
							var A = this._getOriginal(B);
							mini.copyTo(B, A);
							delete B._state;
							delete this._originals[B[this._originalIdField]];
							this._dataChanged()
						}
					},
					_doFilter : function() {
						if (!this._filterInfo) {
							this.dataview = this.source;
							return
						}
						var H = this._filterInfo[0], F = this._filterInfo[1], A = [], E = this.source;
						for ( var B = 0, G = E.length; B < G; B++) {
							var D = E[B], C = H.call(F, D, B, this);
							if (C !== false)
								A.push(D)
						}
						this.dataview = A
					},
					_doSort : function() {
						if (!this._sortInfo)
							return;
						var D = this._sortInfo[0], C = this._sortInfo[1], A = this._sortInfo[2], B = this
								.getDataView().clone();
						mini.sort(B, D, C);
						if (A)
							B.reverse();
						this.dataview = B
					}
				});
mini.regClass(mini.DataTable, "datatable");
mini.DataTree = function() {
	mini.DataTree.superclass.constructor.call(this)
};
mini
		.extend(
				mini.DataTree,
				mini.DataSource,
				{
					isTree : true,
					expandOnLoad : false,
					idField : "id",
					parentField : "pid",
					nodesField : "children",
					resultAsTree : true,
					checkModel : "cascade",
					autoCheckParent : false,
					onlyLeafCheckable : false,
					setExpandOnLoad : function(A) {
						this.expandOnLoad = A
					},
					getExpandOnLoad : function() {
						return this.expandOnLoad
					},
					setParentField : function(A) {
						this.parentField = A
					},
					setNodesField : function(A) {
						if (this.nodesField != A) {
							var B = this.root[this.nodesField];
							this.nodesField = A;
							this._doLoadData(B)
						}
					},
					setResultAsTree : function(A) {
						this.resultAsTree = A
					},
					setCheckRecursive : function(A) {
						this.checkModel = A ? "cascade" : "multiple"
					},
					getCheckRecursive : function() {
						return this.checkModel == "cascade"
					},
					setShowFolderCheckBox : function(A) {
						this.onlyLeafCheckable = !A
					},
					getShowFolderCheckBox : function() {
						return !this.onlyLeafCheckable
					},
					_doExpandOnLoad : function(D) {
						var B = this.nodesField, A = this.expandOnLoad;
						function C(I, E) {
							for ( var F = 0, H = I.length; F < H; F++) {
								var G = I[F];
								if (mini.isNull(G.expanded)) {
									if (A === true
											|| (mini.isNumber(A) && E <= A))
										G.expanded = true;
									else
										G.expanded = false
								}
								var D = G[B];
								if (D)
									C(D, E + 1)
							}
						}
						C(D, 0)
					},
					_OnBeforeLoad : function(B) {
						var A = this._loadingNode || this.root;
						B.node = A;
						if (this.isNodeLoading()) {
							B.async = true;
							B.isRoot = B.node == this.root;
							if (!B.isRoot)
								B.data[this.idField] = this
										.getItemValue(B.node)
						}
						this.fire("beforeload", B)
					},
					_OnPreLoad : function(A) {
						if (this.resultAsTree == false)
							A.data = mini.arrayToTree(A.data, this.nodesField,
									this.idField, this.parentField);
						this.fire("preload", A)
					},
					_init : function() {
						mini.DataTree.superclass._init.call(this);
						this.root = {
							_id : -1,
							_level : -1
						};
						this.source = this.root[this.nodesField] = [];
						this.viewNodes = null;
						this.dataview = null;
						this.visibleRows = null;
						this._ids[this.root._id] = this.root
					},
					_doLoadData : function(F) {
						F = F || [];
						this._doExpandOnLoad(F);
						this.source = this.root[this.nodesField] = F;
						this.viewNodes = null;
						this.dataview = null;
						this.visibleRows = null;
						var C = mini.treeToArray(F, this.nodesField), D = this._ids;
						D[this.root._id] = this.root;
						for ( var B = 0, G = C.length; B < G; B++) {
							var E = C[B];
							E._id = mini.DataSource.RecordId++;
							D[E._id] = E;
							E._uid = E._id
						}
						C = mini.treeToArray(F, this.nodesField, "_id", "_pid",
								this.root._id);
						for (B = 0, G = C.length; B < G; B++) {
							var E = C[B], A = this.getParentNode(E);
							E._pid = A._id;
							E._level = A._level + 1;
							delete E._state
						}
						this._doUpdateLoadedCheckedNodes()
					},
					_setAdded : function(B) {
						var A = this.getParentNode(B);
						B._id = mini.DataSource.RecordId++;
						if (this._autoCreateNewID && !B[this.idField])
							B[this.idField] = UUID();
						B._uid = B._id;
						B._pid = A._id;
						B[this.parentField] = A[this.idField];
						B._level = A._level + 1;
						B._state = "added";
						this._ids[B._id] = B;
						delete this._originals[B[this._originalIdField]]
					},
					_createNodes : function(A) {
						var B = A[this.nodesField];
						if (!B)
							B = A[this.nodesField] = [];
						if (this.viewNodes && !this.viewNodes[A._id])
							this.viewNodes[A._id] = [];
						return B
					},
					addNode : function(B, A) {
						if (!B)
							return;
						return this.insertNode(B, -1, A)
					},
					addNodes : function(F, B, C) {
						if (!mini.isArray(F))
							return;
						if (mini.isNull(C))
							C = "add";
						for ( var A = 0, E = F.length; A < E; A++) {
							var D = F[A];
							this.insertNode(D, C, B)
						}
					},
					insertNodes : function(F, A, C) {
						if (!mini.isNumber(A))
							return;
						if (!mini.isArray(F))
							return;
						if (!C)
							C = this.root;
						this.beginChange();
						var D = this._createNodes(C);
						if (A < 0 || A > D.length)
							A = D.length;
						F = F.clone();
						for ( var B = 0, E = F.length; B < E; B++)
							this.insertNode(F[B], A + B, C);
						this.endChange();
						return F
					},
					removeNode : function(C) {
						var B = this.getParentNode(C);
						if (!B)
							return;
						var A = this.indexOfNode(C);
						return this.removeNodeAt(A, B)
					},
					removeNodes : function(C) {
						if (!mini.isArray(C))
							return;
						this.beginChange();
						C = C.clone();
						for ( var A = 0, B = C.length; A < B; A++)
							this.removeNode(C[A]);
						this.endChange()
					},
					moveNodes : function(G, D, B) {
						if (!G || G.length == 0 || !D || !B)
							return;
						this.beginChange();
						var C = this;
						mini.sort(G, function(A, B) {
							return C.indexOf(A) > C.indexOf(B)
						}, this);
						for ( var A = 0, F = G.length; A < F; A++) {
							var E = G[A];
							this.moveNode(E, D, B);
							if (A != 0) {
								D = E;
								B = "after"
							}
						}
						this.endChange()
					},
					moveNode : function(G, F, D) {
						if (!G || !F || mini.isNull(D))
							return;
						if (this.viewNodes) {
							var B = F, A = D;
							if (A == "before") {
								B = this.getParentNode(F);
								A = this.indexOfNode(F)
							} else if (A == "after") {
								B = this.getParentNode(F);
								A = this.indexOfNode(F) + 1
							} else if (A == "add" || A == "append") {
								if (!B[this.nodesField])
									B[this.nodesField] = [];
								A = B[this.nodesField].length
							} else if (!mini.isNumber(A))
								return;
							if (this.isAncestor(G, B))
								return false;
							var C = this.getChildNodes(B);
							if (A < 0 || A > C.length)
								A = C.length;
							var H = {};
							C.insert(A, H);
							var E = this.getParentNode(G), I = this
									.getChildNodes(E);
							I.remove(G);
							A = C.indexOf(H);
							C[A] = G
						}
						B = F, A = D, C = this._createNodes(B);
						if (A == "before") {
							B = this.getParentNode(F);
							C = this._createNodes(B);
							A = C.indexOf(F)
						} else if (A == "after") {
							B = this.getParentNode(F);
							C = this._createNodes(B);
							A = C.indexOf(F) + 1
						} else if (A == "add" || A == "append")
							A = C.length;
						else if (!mini.isNumber(A))
							return;
						if (this.isAncestor(G, B))
							return false;
						if (A < 0 || A > C.length)
							A = C.length;
						H = {};
						C.insert(A, H);
						E = this.getParentNode(G);
						E[this.nodesField].remove(G);
						A = C.indexOf(H);
						C[A] = G;
						this._updateParentAndLevel(G, B);
						this._dataChanged();
						var J = {
							parentNode : B,
							index : A,
							node : G
						};
						this.fire("movenode", J)
					},
					insertNode : function(C, A, B) {
						if (!C)
							return;
						if (!B) {
							B = this.root;
							A = "add"
						}
						if (!mini.isNumber(A)) {
							switch (A) {
							case "before":
								A = this.indexOfNode(B);
								B = this.getParentNode(B);
								this.insertNode(C, A, B);
								break;
							case "after":
								A = this.indexOfNode(B);
								B = this.getParentNode(B);
								this.insertNode(C, A + 1, B);
								break;
							case "append":
							case "add":
								this.addNode(C, B);
								break;
							default:
								break
							}
							return
						}
						var E = this._createNodes(B), F = this.getChildNodes(B);
						if (A < 0)
							A = F.length;
						F.insert(A, C);
						A = F.indexOf(C);
						if (this.viewNodes) {
							var D = F[A - 1];
							if (D) {
								var G = E.indexOf(D);
								E.insert(G + 1, C)
							} else
								E.insert(0, C)
						}
						C._pid = B._id;
						this._setAdded(C);
						this.cascadeChild(C, function(C, A, B) {
							C._pid = B._id;
							this._setAdded(C)
						}, this);
						this._dataChanged();
						var H = {
							parentNode : B,
							index : A,
							node : C
						};
						this.fire("addnode", H);
						return C
					},
					removeNodeAt : function(A, B) {
						if (!B)
							B = this.root;
						var E = this.getChildNodes(B), C = E[A];
						if (!C)
							return null;
						E.removeAt(A);
						if (this.viewNodes) {
							var D = B[this.nodesField];
							D.remove(C)
						}
						this._setRemoved(C);
						this.cascadeChild(C, function(C, A, B) {
							this._setRemoved(C)
						}, this);
						this._checkSelecteds();
						this._dataChanged();
						var F = {
							parentNode : B,
							index : A,
							node : C
						};
						this.fire("removenode", F);
						return C
					},
					bubbleParent : function(B, D, C) {
						C = C || this;
						if (B)
							D.call(this, B);
						var A = this.getParentNode(B);
						if (A && A != this.root)
							this.bubbleParent(A, D, C)
					},
					cascadeChild : function(C, G, D) {
						if (!G)
							return;
						if (!C)
							C = this.root;
						var F = C[this.nodesField];
						if (F) {
							F = F.clone();
							for ( var A = 0, E = F.length; A < E; A++) {
								var B = F[A];
								if (G.call(D || this, B, A, C) === false)
									return;
								this.cascadeChild(B, G, D)
							}
						}
					},
					eachChild : function(D, H, E) {
						if (!H || !D)
							return;
						var G = D[this.nodesField];
						if (G) {
							var B = G.clone();
							for ( var C = 0, F = B.length; C < F; C++) {
								var A = B[C];
								if (H.call(E || this, A, C, D) === false)
									break
							}
						}
					},
					collapse : function(A, B) {
						if (!A)
							return;
						this.beginChange();
						A.expanded = false;
						if (B)
							this.eachChild(A, function(A) {
								if (A[this.nodesField] != null)
									this.collapse(A, B)
							}, this);
						this.endChange();
						var C = {
							node : A
						};
						this.fire("collapse", C)
					},
					expand : function(A, B) {
						if (!A)
							return;
						this.beginChange();
						A.expanded = true;
						if (B)
							this.eachChild(A, function(A) {
								if (A[this.nodesField] != null)
									this.expand(A, B)
							}, this);
						this.endChange();
						var C = {
							node : A
						};
						this.fire("expand", C)
					},
					toggle : function(A) {
						if (this.isExpandedNode(A))
							this.collapse(A);
						else
							this.expand(A)
					},
					expandNode : function(A) {
						this.expand(A)
					},
					collapseNode : function(A) {
						this.collapse(A)
					},
					collapseAll : function() {
						this.collapse(this.root, true)
					},
					expandAll : function() {
						this.expand(this.root, true)
					},
					collapseLevel : function(A, B) {
						this.beginChange();
						this.each(function(C) {
							var D = this.getLevel(C);
							if (A == D)
								this.collapse(C, B)
						}, this);
						this.endChange()
					},
					expandLevel : function(A, B) {
						this.beginChange();
						this.each(function(C) {
							var D = this.getLevel(C);
							if (A == D)
								this.expand(C, B)
						}, this);
						this.endChange()
					},
					expandPath : function(C) {
						C = this.getNode(C);
						if (!C)
							return;
						var B = this.getAncestors(C);
						for ( var A = 0, D = B.length; A < D; A++)
							this.expandNode(B[A])
					},
					collapsePath : function(C) {
						C = this.getNode(C);
						if (!C)
							return;
						var B = this.getAncestors(C);
						for ( var A = 0, D = B.length; A < D; A++)
							this.collapseNode(B[A])
					},
					isAncestor : function(B, D) {
						if (B == D)
							return true;
						if (!B || !D)
							return false;
						var C = this.getAncestors(D);
						for ( var A = 0, E = C.length; A < E; A++)
							if (C[A] == B)
								return true;
						return false
					},
					getAncestors : function(C) {
						var B = [];
						while (1) {
							var A = this.getParentNode(C);
							if (!A || A == this.root)
								break;
							B[B.length] = A;
							C = A
						}
						B.reverse();
						return B
					},
					getNode : function(A) {
						return this.getRecord(A)
					},
					getRootNode : function() {
						return this.root
					},
					getParentNode : function(A) {
						if (!A)
							return null;
						return this.getby_id(A._pid)
					},
					getAllChildNodes : function(A) {
						return this.getChildNodes(A, true)
					},
					getChildNodes : function(C, E, D) {
						var I = C[this.nodesField];
						if (this.viewNodes && D !== false)
							I = this.viewNodes[C._id];
						if (E === true && I) {
							var A = [];
							for ( var B = 0, H = I.length; B < H; B++) {
								var F = I[B];
								A[A.length] = F;
								var G = this.getChildNodes(F, E, D);
								if (G && G.length > 0)
									A.addRange(G)
							}
							I = A
						}
						return I || []
					},
					getChildNodeAt : function(A, B) {
						var C = this.getChildNodes(B);
						if (C)
							return C[A];
						return null
					},
					hasChildNodes : function(A) {
						var B = this.getChildNodes(A);
						return B.length > 0
					},
					getLevel : function(A) {
						return A._level
					},
					isLeafNode : function(A) {
						return this.isLeaf(A)
					},
					isLeaf : function(A) {
						if (!A || A.isLeaf === false)
							return false;
						var B = this.getChildNodes(A);
						if (B.length > 0)
							return false;
						return true
					},
					hasChildren : function(A) {
						var B = this.getChildNodes(A);
						return !!(B && B.length > 0)
					},
					isFirstNode : function(B) {
						if (B == this.root)
							return true;
						var A = this.getParentNode(B);
						if (!A)
							return false;
						return this.getFirstNode(A) == B
					},
					isLastNode : function(B) {
						if (B == this.root)
							return true;
						var A = this.getParentNode(B);
						if (!A)
							return false;
						return this.getLastNode(A) == B
					},
					isCheckedNode : function(A) {
						return A.checked === true
					},
					isExpandedNode : function(A) {
						return A.expanded == true || A.expanded == 1
								|| mini.isNull(A.expanded)
					},
					isVisible : function(B) {
						var A = this._ids[B._pid];
						if (!A || A == this.root)
							return true;
						if (A.expanded === false)
							return false;
						return this.isVisible(A)
					},
					getNextNode : function(C) {
						var B = this.getby_id(C._pid);
						if (!B)
							return null;
						var A = this.indexOfNode(C);
						return this.getChildNodes(B)[A + 1]
					},
					getPrevNode : function(C) {
						var B = this.getby_id(C._pid);
						if (!B)
							return null;
						var A = this.indexOfNode(C);
						return this.getChildNodes(B)[A - 1]
					},
					getFirstNode : function(A) {
						return this.getChildNodes(A)[0]
					},
					getLastNode : function(A) {
						var B = this.getChildNodes(A);
						return B[B.length - 1]
					},
					indexOfNode : function(B) {
						var A = this.getby_id(B._pid);
						if (A)
							return this.getChildNodes(A).indexOf(B);
						return -1
					},
					getAt : function(A) {
						return this.getDataView()[A]
					},
					indexOf : function(A) {
						return this.getDataView().indexOf(A)
					},
					getRange : function(C, E) {
						if (C > E) {
							var F = C;
							C = E;
							E = F
						}
						var D = this.getChildNodes(this.root, true), G = [];
						for ( var B = C, H = E; B <= H; B++) {
							var A = D[B];
							if (A)
								G.push(A)
						}
						return G
					},
					selectRange : function(A, C) {
						var B = this.getChildNodes(this.root, true);
						if (!mini.isNumber(A))
							A = B.indexOf(A);
						if (!mini.isNumber(C))
							C = B.indexOf(C);
						if (mini.isNull(A) || mini.isNull(C))
							return;
						var D = this.getRange(A, C);
						this.selects(D)
					},
					findRecords : function(F, C) {
						var E = this.toArray(), H = typeof F == "function", K = F, G = C
								|| this, D = [];
						for ( var B = 0, J = E.length; B < J; B++) {
							var A = E[B];
							if (H) {
								var I = K.call(G, A);
								if (I == true)
									D[D.length] = A;
								if (I === 1)
									break
							} else if (A[F] == C)
								D[D.length] = A
						}
						return D
					},
					_dataChangedCount : 0,
					_dataChanged : function() {
						this._dataChangedCount++;
						this.dataview = null;
						this.visibleRows = null;
						if (this.__changeCount == 0)
							this.fire("datachanged")
					},
					_createDataView : function() {
						var A = this.getChildNodes(this.root, true);
						return A
					},
					_createVisibleRows : function() {
						var D = this.getChildNodes(this.root, true), A = [];
						for ( var B = 0, E = D.length; B < E; B++) {
							var C = D[B];
							if (this.isVisible(C))
								A[A.length] = C
						}
						return A
					},
					getList : function() {
						return mini.treeToList(this.source, this.nodesField)
					},
					getDataView : function() {
						if (!this.dataview)
							this.dataview = this._createDataView();
						return this.dataview
					},
					getVisibleRows : function() {
						if (!this.visibleRows)
							this.visibleRows = this._createVisibleRows();
						return this.visibleRows
					},
					_doFilter : function() {
						if (!this._filterInfo) {
							this.viewNodes = null;
							return
						}
						var E = this._filterInfo[0], D = this._filterInfo[1], C = this.viewNodes = {}, B = this.nodesField;
						function A(I) {
							var L = I[B];
							if (!L)
								return false;
							var M = I._id, J = C[M] = [];
							for ( var F = 0, K = L.length; F < K; F++) {
								var H = L[F], N = A(H), G = E.call(D, H, F,
										this);
								if (G === true || N)
									J.push(H)
							}
							return J.length > 0
						}
						A(this.root)
					},
					_doSort : function() {
						if (!this._filterInfo && !this._sortInfo) {
							this.viewNodes = null;
							return
						}
						if (!this._sortInfo)
							return;
						var G = this._sortInfo[0], F = this._sortInfo[1], A = this._sortInfo[2], B = this.nodesField;
						if (!this.viewNodes) {
							var E = this.viewNodes = {};
							E[this.root._id] = this.root[B].clone();
							this.cascadeChild(this.root, function(C, A, D) {
								var F = C[B];
								if (F)
									E[C._id] = F.clone()
							})
						}
						var D = this;
						function C(H) {
							var J = D.getChildNodes(H);
							mini.sort(J, G, F);
							if (A)
								J.reverse();
							for ( var B = 0, I = J.length; B < I; B++) {
								var E = J[B];
								C(E)
							}
						}
						C(this.root)
					},
					toArray : function() {
						if (!this._array
								|| this._dataChangedCount != this._dataChangedCount2) {
							this._dataChangedCount2 = this._dataChangedCount;
							this._array = this.getChildNodes(this.root, true,
									false)
						}
						return this._array
					},
					toTree : function() {
						return this.root[this.nodesField]
					},
					getChanges : function(B) {
						var A = [];
						if (B == "removed" || B == null)
							A.addRange(this._removeds.clone());
						this.cascadeChild(this.root, function(D, C, E) {
							if (D._state == null || D._state == "")
								return;
							if (D._state == B || B == null)
								A[A.length] = D
						}, this);
						return A
					},
					accept : function(A) {
						A = A || this.root;
						this.beginChange();
						this.cascadeChild(this.root, function(A) {
							this.acceptRecord(A)
						}, this);
						this._removeds = [];
						this._originals = {};
						this.endChange()
					},
					reject : function(A) {
						this.beginChange();
						this.cascadeChild(this.root, function(A) {
							this.rejectRecord(A)
						}, this);
						this._removeds = [];
						this._originals = {};
						this.endChange()
					},
					acceptRecord : function(A) {
						delete this._originals[A[this._originalIdField]];
						if (A._state == "deleted")
							this.removeNode(A);
						else {
							delete A._state;
							delete this._originals[A[this._originalIdField]];
							this._dataChanged()
						}
					},
					rejectRecord : function(B) {
						if (B._state == "added")
							this.removeNode(B);
						else if (B._state == "modified"
								|| B._state == "deleted") {
							var A = this._getOriginal(B);
							mini.copyTo(B, A);
							delete B._state;
							delete this._originals[B[this._originalIdField]];
							this._dataChanged()
						}
					},
					upGrade : function(H) {
						var E = this.getParentNode(H);
						if (E == this.root || H == this.root)
							return false;
						var G = E[this.nodesField], B = G.indexOf(H), I = H[this.nodesField] ? H[this.nodesField].length
								: 0;
						for ( var D = G.length - 1; D >= B; D--) {
							var A = G[D];
							G.removeAt(D);
							if (A != H) {
								if (!H[this.nodesField])
									H[this.nodesField] = [];
								H[this.nodesField].insert(I, A)
							}
						}
						var F = this.getParentNode(E), C = F[this.nodesField], B = C
								.indexOf(E);
						C.insert(B + 1, H);
						this._updateParentAndLevel(H, F);
						this._doFilter();
						this._dataChanged()
					},
					downGrade : function(D) {
						if (this.isFirstNode(D))
							return false;
						var C = this.getParentNode(D), E = C[this.nodesField], A = E
								.indexOf(D), B = E[A - 1];
						E.removeAt(A);
						if (!B[this.nodesField])
							B[this.nodesField] = [];
						B[this.nodesField].add(D);
						this._updateParentAndLevel(D, B);
						this._doFilter();
						this._dataChanged()
					},
					_updateParentAndLevel : function(B, A) {
						B._pid = A._id;
						B._level = A._level + 1;
						this.cascadeChild(B, function(C, A, B) {
							C._pid = B._id;
							C._level = B._level + 1;
							C[this.parentField] = B[this.idField]
						}, this);
						this._setModified(B)
					},
					setCheckModel : function(A) {
						this.checkModel = A
					},
					getCheckModel : function() {
						return this.checkModel
					},
					setOnlyLeafCheckable : function(A) {
						this.onlyLeafCheckable = A
					},
					getOnlyLeafCheckable : function() {
						return this.onlyLeafCheckable
					},
					setAutoCheckParent : function(A) {
						this.autoCheckParent = A
					},
					getAutoCheckParent : function() {
						return this.autoCheckParent
					},
					_doUpdateLoadedCheckedNodes : function() {
						var D = this.getAllChildNodes(this.root);
						for ( var A = 0, C = D.length; A < C; A++) {
							var B = D[A];
							if (B.checked == true)
								this._doUpdateNodeCheckState(B)
						}
					},
					_doUpdateNodeCheckState : function(D) {
						if (!D)
							return;
						var L = this.isChecked(D);
						if (this.checkModel == "cascade") {
							this.cascadeChild(D, function(B) {
								var A = this.getCheckable(B);
								if (A)
									this.doCheckNodes(B, L)
							}, this);
							if (!this.autoCheckParent) {
								var A = this.getAncestors(D);
								A.reverse();
								for ( var I = 0, G = A.length; I < G; I++) {
									var E = A[I], K = this.getCheckable(E);
									if (K == false)
										return;
									var C = this.getChildNodes(E), J = true;
									for ( var B = 0, H = C.length; B < H; B++) {
										var F = C[B];
										if (!this.isCheckedNode(F))
											J = false
									}
									if (J)
										this.doCheckNodes(E, true);
									else
										this.doCheckNodes(E, false);
									this.fire("checkchanged", {
										nodes : [ E ],
										_nodes : [ E ]
									})
								}
							}
						}
						if (this.autoCheckParent && L) {
							A = this.getAncestors(D);
							A.reverse();
							for (I = 0, G = A.length; I < G; I++) {
								E = A[I], K = this.getCheckable(E);
								if (K == false)
									return;
								E.checked = true;
								this.fire("checkchanged", {
									nodes : [ E ],
									_nodes : [ E ]
								})
							}
						}
					},
					doCheckNodes : function(G, D, F) {
						if (!G)
							return;
						if (typeof G == "string")
							G = G.split(",");
						if (!mini.isArray(G))
							G = [ G ];
						G = G.clone();
						var B = [];
						D = D !== false;
						if (F === true)
							if (this.checkModel == "single")
								this.uncheckAllNodes();
						for ( var A = G.length - 1; A >= 0; A--) {
							var C = this.getRecord(G[A]);
							if (!C || (D && C.checked === true)
									|| (!D && C.checked !== true)) {
								if (C)
									if (F === true)
										this._doUpdateNodeCheckState(C);
								continue
							}
							C.checked = D;
							B.push(C);
							if (F === true)
								this._doUpdateNodeCheckState(C)
						}
						var E = this;
						setTimeout(function() {
							E.fire("checkchanged", {
								nodes : G,
								_nodes : B,
								checked : D
							})
						}, 1)
					},
					checkNode : function(A) {
						this.doCheckNodes( [ A ], true, true)
					},
					uncheckNode : function(A) {
						this.doCheckNodes( [ A ], false, true)
					},
					checkNodes : function(A) {
						if (!mini.isArray(A))
							A = [];
						this.doCheckNodes(A, true, true)
					},
					uncheckNodes : function(A) {
						if (!mini.isArray(A))
							A = [];
						this.doCheckNodes(A, false, true)
					},
					checkAllNodes : function() {
						var A = this.getList();
						this.doCheckNodes(A, true)
					},
					uncheckAllNodes : function() {
						var A = this.getList();
						this.doCheckNodes(A, false)
					},
					getCheckedNodes : function(B) {
						var C = [], A = {};
						this.cascadeChild(this.root, function(F) {
							if (F.checked == true) {
								var H = this.isLeafNode(F);
								if (B === true) {
									C.push(F);
									var E = this.getAncestors(F);
									for ( var D = 0, I = E.length; D < I; D++) {
										var G = E[D];
										if (!A[G._id]) {
											A[G._id] = G;
											C.push(G)
										}
									}
								} else if (B === "parent") {
									if (!H)
										C.push(F)
								} else if (B === "leaf") {
									if (H)
										C.push(F)
								} else
									C.push(F)
							}
						}, this);
						return C
					},
					getCheckedNodesId : function(C, A) {
						var D = this.getCheckedNodes(C), B = this
								.getValueAndText(D, A);
						return B[0]
					},
					getCheckedNodesText : function(C, A) {
						var D = this.getCheckedNodes(C), B = this
								.getValueAndText(D, A);
						return B[1]
					},
					isChecked : function(A) {
						A = this.getRecord(A);
						if (!A)
							return null;
						return A.checked === true
					},
					getCheckState : function(B) {
						B = this.getRecord(B);
						if (!B)
							return null;
						if (B.checked === true)
							return "checked";
						if (!B[this.nodesField])
							return "unchecked";
						var D = this.getChildNodes(B);
						for ( var A = 0, C = D.length; A < C; A++) {
							var B = D[A];
							if (B.checked === true)
								return "indeterminate"
						}
						return "unchecked"
					},
					getUnCheckableNodes : function() {
						var A = [];
						this.cascadeChild(this.root, function(C) {
							var B = this.getCheckable(C);
							if (B == false)
								A.push(C)
						}, this);
						return A
					},
					setCheckable : function(D, B) {
						if (!D)
							return;
						if (!mini.isArray(D))
							D = [ D ];
						D = D.clone();
						B = !!B;
						for ( var A = D.length - 1; A >= 0; A--) {
							var C = this.getRecord(D[A]);
							if (!C)
								continue;
							C.checkable = checked
						}
					},
					getCheckable : function(A) {
						A = this.getRecord(A);
						if (!A)
							return false;
						if (A.checkable === true)
							return true;
						if (A.checkable === false)
							return false;
						return this.isLeafNode(A) ? true
								: !this.onlyLeafCheckable
					},
					showNodeCheckbox : function(A, B) {
					},
					isNodeLoading : function() {
						return !!this._loadingNode
					},
					loadNode : function(C, A) {
						this._loadingNode = C;
						var E = {
							node : C
						};
						this.fire("beforeloadnode", E);
						var B = new Date(), D = this;
						D._doLoadAjax(D.loadParams, null, null, null, function(
								F) {
							var E = new Date() - B;
							if (E < 60)
								E = 60 - E;
							setTimeout(function() {
								F.node = D._loadingNode;
								D._loadingNode = null;
								var B = C[D.nodesField];
								D.removeNodes(B);
								var E = F.data;
								if (E && E.length > 0) {
									D.addNodes(E, C);
									if (A !== false)
										D.expand(C, true);
									else
										D.collapse(C, true)
								} else
									delete C.isLeaf;
								D.fire("loadnode", {
									node : C
								})
							}, E)
						}, true)
					}
				});
mini.regClass(mini.DataTree, "datatree");
mini._DataTableApplys = {
	setAjaxData : function(A) {
		this._dataSource.ajaxData = A
	},
	getby_id : function(A) {
		return this._dataSource.getby_id(A)
	},
	getValueAndText : function(B, A) {
		return this._dataSource.getValueAndText(B, A)
	},
	setIdField : function(A) {
		this._dataSource.setIdField(A)
	},
	getIdField : function() {
		return this._dataSource.idField
	},
	setTextField : function(A) {
		this._dataSource.setTextField(A)
	},
	getTextField : function() {
		return this._dataSource.textField
	},
	clearData : function() {
		this._dataSource.clearData()
	},
	loadData : function(A) {
		this._dataSource.loadData(A)
	},
	setData : function(A) {
		this._dataSource.loadData(A)
	},
	getData : function() {
		return this._dataSource.getSource()
	},
	getList : function() {
		return this._dataSource.getList()
	},
	getDataView : function() {
		return this._dataSource.getDataView().clone()
	},
	getVisibleRows : function() {
		if (this._useEmptyView)
			return [];
		return this._dataSource.getVisibleRows()
	},
	toArray : function() {
		return this._dataSource.toArray()
	},
	getRecord : function(A) {
		return this._dataSource.getRecord(A)
	},
	getRow : function(A) {
		return this._dataSource.getRow(A)
	},
	getRange : function(A, B) {
		if (mini.isNull(A) || mini.isNull(B))
			return;
		return this._dataSource.getRange(A, B)
	},
	getAt : function(A) {
		return this._dataSource.getAt(A)
	},
	indexOf : function(A) {
		return this._dataSource.indexOf(A)
	},
	getRowByUID : function(A) {
		return this._dataSource.getby_id(A)
	},
	getRowById : function(A) {
		return this._dataSource.getbyId(A)
	},
	updateRow : function(A, C, B) {
		this._dataSource.updateRecord(A, C, B)
	},
	addRow : function(B, A) {
		return this._dataSource.insert(A, B)
	},
	removeRow : function(A, B) {
		return this._dataSource.remove(A, B)
	},
	removeRows : function(A, B) {
		return this._dataSource.removeRange(A, B)
	},
	removeRowAt : function(A, B) {
		return this._dataSource.removeAt(A, B)
	},
	moveRow : function(B, A) {
		this._dataSource.move(B, A)
	},
	addRows : function(B, A) {
		return this._dataSource.insertRange(A, B)
	},
	findRows : function(B, A) {
		return this._dataSource.findRecords(B, A)
	},
	findRow : function(B, A) {
		return this._dataSource.findRecord(B, A)
	},
	setMultiSelect : function(A) {
		this._dataSource.setMultiSelect(A)
	},
	getMultiSelect : function() {
		return this._dataSource.getMultiSelect()
	},
	setCurrent : function(A) {
		this._dataSource.setCurrent(A)
	},
	getCurrent : function() {
		return this._dataSource.getCurrent()
	},
	isSelected : function(A) {
		return this._dataSource.isSelected(A)
	},
	getSelected : function() {
		return this._dataSource.getSelected()
	},
	getSelecteds : function() {
		return this._dataSource.getSelecteds()
	},
	select : function(A) {
		this._dataSource.select(A)
	},
	selects : function(A) {
		this._dataSource.selects(A)
	},
	deselect : function(A) {
		this._dataSource.deselect(A)
	},
	deselects : function(A) {
		this._dataSource.deselects(A)
	},
	selectAll : function() {
		this._dataSource.selectAll()
	},
	deselectAll : function() {
		this._dataSource.deselectAll()
	},
	selectPrev : function() {
		this._dataSource.selectPrev()
	},
	selectNext : function() {
		this._dataSource.selectNext()
	},
	selectFirst : function() {
		this._dataSource.selectFirst()
	},
	selectLast : function() {
		this._dataSource.selectLast()
	},
	selectRange : function(A, B) {
		this._dataSource.selectRange(A, B)
	},
	filter : function(B, A) {
		this._dataSource.filter(B, A)
	},
	clearFilter : function() {
		this._dataSource.clearFilter()
	},
	sort : function(B, A) {
		this._dataSource.sort(B, A)
	},
	clearSort : function() {
		this._dataSource.clearSort()
	},
	getResultObject : function() {
		return this._dataSource._resultObject || {}
	},
	getChanges : function(A) {
		return this._dataSource.getChanges(A)
	},
	accept : function() {
		this._dataSource.accept()
	},
	reject : function() {
		this._dataSource.reject()
	},
	acceptRecord : function(A) {
		this._dataSource.acceptRecord(A)
	},
	rejectRecord : function(A) {
		this._dataSource.rejectRecord(A)
	}
};
mini._DataTreeApplys = {
	addRow : null,
	removeRow : null,
	removeRows : null,
	removeRowAt : null,
	moveRow : null,
	setExpandOnLoad : function(A) {
		this._dataSource.setExpandOnLoad(A)
	},
	getExpandOnLoad : function() {
		return this._dataSource.getExpandOnLoad()
	},
	selectNode : function(A) {
		if (A)
			this._dataSource.select(A);
		else
			this._dataSource.deselect(this.getSelectedNode())
	},
	getSelectedNode : function() {
		return this.getSelected()
	},
	getSelectedNodes : function() {
		return this.getSelecteds()
	},
	updateNode : function(B, C, A) {
		this._dataSource.updateRecord(B, C, A)
	},
	addNode : function(C, B, A) {
		return this._dataSource.insertNode(C, B, A)
	},
	removeNodeAt : function(A, B) {
		return this._dataSource.removeNodeAt(A, B)
	},
	removeNode : function(A) {
		return this._dataSource.removeNode(A)
	},
	moveNode : function(C, A, B) {
		this._dataSource.moveNode(C, A, B)
	},
	addNodes : function(C, A, B) {
		return this._dataSource.addNodes(C, A, B)
	},
	insertNodes : function(C, A, B) {
		return this._dataSource.insertNodes(A, C, B)
	},
	moveNodes : function(C, B, A) {
		this._dataSource.moveNodes(C, B, A)
	},
	removeNodes : function(A) {
		return this._dataSource.removeNodes(A)
	},
	setShowFolderCheckBox : function(A) {
		this._dataSource.setShowFolderCheckBox(A);
		if (this.doUpdate)
			this.doUpdate()
	},
	getShowFolderCheckBox : function() {
		return this._dataSource.getShowFolderCheckBox()
	},
	setCheckRecursive : function(A) {
		this._dataSource.setCheckRecursive(A)
	},
	getCheckRecursive : function() {
		return this._dataSource.getCheckRecursive()
	},
	setResultAsTree : function(A) {
		this._dataSource.setResultAsTree(A)
	},
	getResultAsTree : function(A) {
		return this._dataSource.resultAsTree
	},
	setParentField : function(A) {
		this._dataSource.setParentField(A)
	},
	getParentField : function() {
		return this._dataSource.parentField
	},
	setNodesField : function(A) {
		this._dataSource.setNodesField(A)
	},
	getNodesField : function() {
		return this._dataSource.nodesField
	},
	findNodes : function(B, A) {
		return this._dataSource.findRecords(B, A)
	},
	getLevel : function(A) {
		return this._dataSource.getLevel(A)
	},
	isVisibleNode : function(A) {
		return this._dataSource.isVisibleNode(A)
	},
	isExpandedNode : function(A) {
		return this._dataSource.isExpandedNode(A)
	},
	isCheckedNode : function(A) {
		return this._dataSource.isCheckedNode(A)
	},
	isLeaf : function(A) {
		return this._dataSource.isLeafNode(A)
	},
	hasChildren : function(A) {
		return this._dataSource.hasChildren(A)
	},
	isAncestor : function(B, A) {
		return this._dataSource.isAncestor(B, A)
	},
	getNode : function(A) {
		return this._dataSource.getRecord(A)
	},
	getRootNode : function() {
		return this._dataSource.getRootNode()
	},
	getParentNode : function(A) {
		return this._dataSource.getParentNode
				.apply(this._dataSource, arguments)
	},
	getAncestors : function(A) {
		return this._dataSource.getAncestors(A)
	},
	getAllChildNodes : function(A) {
		return this._dataSource.getAllChildNodes.apply(this._dataSource,
				arguments)
	},
	getChildNodes : function(A, B) {
		return this._dataSource.getChildNodes
				.apply(this._dataSource, arguments)
	},
	getChildNodeAt : function(A, B) {
		return this._dataSource.getChildNodeAt.apply(this._dataSource,
				arguments)
	},
	indexOfNode : function(A) {
		return this._dataSource.indexOfNode.apply(this._dataSource, arguments)
	},
	hasChildNodes : function(A) {
		return this._dataSource.hasChildNodes
				.apply(this._dataSource, arguments)
	},
	isFirstNode : function(A) {
		return this._dataSource.isFirstNode.apply(this._dataSource, arguments)
	},
	isLastNode : function(A) {
		return this._dataSource.isLastNode.apply(this._dataSource, arguments)
	},
	getNextNode : function(A) {
		return this._dataSource.getNextNode.apply(this._dataSource, arguments)
	},
	getPrevNode : function(A) {
		return this._dataSource.getPrevNode.apply(this._dataSource, arguments)
	},
	getFirstNode : function(A) {
		return this._dataSource.getFirstNode.apply(this._dataSource, arguments)
	},
	getLastNode : function(A) {
		return this._dataSource.getLastNode.apply(this._dataSource, arguments)
	},
	toggleNode : function(A) {
		this._dataSource.toggle(A)
	},
	collapseNode : function(A, B) {
		this._dataSource.collapse(A, B)
	},
	expandNode : function(A, B) {
		this._dataSource.expand(A, B)
	},
	collapseAll : function() {
		this._dataSource.collapseAll()
	},
	expandAll : function() {
		this._dataSource.expandAll()
	},
	expandLevel : function(A) {
		this._dataSource.expandLevel(A)
	},
	collapseLevel : function(A) {
		this._dataSource.collapseLevel(A)
	},
	expandPath : function(A) {
		this._dataSource.expandPath(A)
	},
	collapsePath : function(A) {
		this._dataSource.collapsePath(A)
	},
	loadNode : function(A, B) {
		this._dataSource.loadNode(A, B)
	},
	setCheckModel : function(A) {
		this._dataSource.setCheckModel(A)
	},
	getCheckModel : function() {
		return this._dataSource.getCheckModel()
	},
	setOnlyLeafCheckable : function(A) {
		this._dataSource.setOnlyLeafCheckable(A)
	},
	getOnlyLeafCheckable : function() {
		return this._dataSource.getOnlyLeafCheckable()
	},
	setAutoCheckParent : function(A) {
		this._dataSource.setAutoCheckParent(A)
	},
	getAutoCheckParent : function() {
		this._dataSource.getAutoCheckParent(value)
	},
	checkNode : function(A) {
		this._dataSource.checkNode(A)
	},
	uncheckNode : function(A) {
		this._dataSource.uncheckNode(A)
	},
	checkNodes : function(A) {
		this._dataSource.checkNodes(A)
	},
	uncheckNodes : function(A) {
		this._dataSource.uncheckNodes(A)
	},
	checkAllNodes : function() {
		this._dataSource.checkAllNodes()
	},
	uncheckAllNodes : function() {
		this._dataSource.uncheckAllNodes()
	},
	getCheckedNodes : function() {
		return this._dataSource.getCheckedNodes.apply(this._dataSource,
				arguments)
	},
	getCheckedNodesId : function() {
		return this._dataSource.getCheckedNodesId.apply(this._dataSource,
				arguments)
	},
	getCheckedNodesText : function() {
		return this._dataSource.getCheckedNodesText.apply(this._dataSource,
				arguments)
	},
	isChecked : function(A) {
		return this._dataSource.isChecked.apply(this._dataSource, arguments)
	},
	getCheckState : function(A) {
		return this._dataSource.getCheckState
				.apply(this._dataSource, arguments)
	},
	setCheckable : function(B, A) {
		this._dataSource.setCheckable.apply(this._dataSource, arguments)
	},
	getCheckable : function(A) {
		return this._dataSource.getCheckable.apply(this._dataSource, arguments)
	},
	bubbleParent : function(A, C, B) {
		this._dataSource.bubbleParent.apply(this._dataSource, arguments)
	},
	cascadeChild : function(A, C, B) {
		this._dataSource.cascadeChild.apply(this._dataSource, arguments)
	},
	eachChild : function(A, C, B) {
		this._dataSource.eachChild.apply(this._dataSource, arguments)
	}
};
mini.ColumnModel = function(A) {
	this.owner = A;
	mini.ColumnModel.superclass.constructor.call(this);
	this._init()
};
mini.ColumnModel_ColumnID = 1;
mini
		.extend(
				mini.ColumnModel,
				mini.Component,
				{
					_defaultColumnWidth : 100,
					_init : function() {
						this.columns = [];
						this._columnsRow = [];
						this._visibleColumnsRow = [];
						this._bottomColumns = [];
						this._visibleColumns = [];
						this._idColumns = {};
						this._nameColumns = {};
						this._fieldColumns = {}
					},
					getColumns : function() {
						return this.columns
					},
					getAllColumns : function() {
						var B = [];
						for ( var C in this._idColumns) {
							var A = this._idColumns[C];
							B.push(A)
						}
						return B
					},
					getColumnsRow : function() {
						return this._columnsRow
					},
					getVisibleColumnsRow : function() {
						return this._visibleColumnsRow
					},
					getBottomColumns : function() {
						return this._bottomColumns
					},
					getVisibleColumns : function() {
						return this._visibleColumns
					},
					_getBottomColumnsByColumn : function(C) {
						C = this.getColumn(C);
						var E = this._bottomColumns, D = [];
						for ( var A = 0, F = E.length; A < F; A++) {
							var B = E[A];
							if (this.isAncestorColumn(C, B))
								D.push(B)
						}
						return D
					},
					_getVisibleColumnsByColumn : function(C) {
						C = this.getColumn(C);
						var E = this._visibleColumns, D = [];
						for ( var A = 0, F = E.length; A < F; A++) {
							var B = E[A];
							if (this.isAncestorColumn(C, B))
								D.push(B)
						}
						return D
					},
					setColumns : function(A) {
						if (!mini.isArray(A))
							A = [];
						this._init();
						this.columns = A;
						this._columnsChanged()
					},
					_columnsChanged : function() {
						this._updateColumnsView();
						this.fire("columnschanged")
					},
					_updateColumnsView : function() {
						this._maxColumnLevel = 0;
						var level = 0;
						function init(column, index, parentColumn) {
							if (column.type) {
								if (!mini.isNull(column.header)
										&& typeof column.header !== "function")
									if (column.header.trim() == "")
										delete column.header;
								var col = mini._getColumn(column.type);
								if (col) {
									var _column = mini.copyTo( {}, column);
									mini.copyTo(column, col);
									mini.copyTo(column, _column)
								}
							}
							column._id = mini.ColumnModel_ColumnID++;
							column._pid = parentColumn == this ? -1
									: parentColumn._id;
							this._idColumns[column._id] = column;
							if (column.name)
								this._nameColumns[column.name] = column;
							column._level = level;
							level += 1;
							this.eachColumns(column, init, this);
							level -= 1;
							if (column._level > this._maxColumnLevel)
								this._maxColumnLevel = column._level;
							var width = parseInt(column.width);
							if (mini.isNumber(width)
									&& String(width) == column.width)
								column.width = width + "px";
							if (mini.isNull(column.width))
								column.width = this._defaultColumnWidth + "px";
							column.visible = column.visible !== false;
							column.allowResize = column.allowResize !== false;
							column.allowMove = column.allowMove !== false;
							column.allowSort = column.allowSort === true;
							column.allowDrag = !!column.allowDrag;
							column.readOnly = !!column.readOnly;
							column.vtype = column.vtype || "";
							if (typeof column.filter == "string")
								column.filter = eval("(" + column.filter + ")");
							if (column.filter && !column.filter.el)
								column.filter = mini.create(column.filter);
							if (typeof column.init == "function"
									&& column.inited != true)
								column.init(this.owner);
							column.inited = true;
							column._gridUID = this.owner.uid;
							column._rowIdField = this.owner._rowIdField
						}
						this.eachColumns(this, init, this);
						this._createColumnsRow();
						var index = 0, view = this._visibleColumns = [], bottoms = this._bottomColumns = [];
						this.cascadeColumns(this, function(A) {
							if (!A.columns || A.columns.length == 0) {
								bottoms.push(A);
								if (this.isVisibleColumn(A)) {
									view.push(A);
									A._index = index++
								}
							}
						}, this);
						this._fieldColumns = {};
						var columns = this.getAllColumns();
						for ( var i = 0, l = columns.length; i < l; i++) {
							var column = columns[i];
							if (column.field
									&& !this._fieldColumns[column.field])
								this._fieldColumns[column.field] = column
						}
						this._createFrozenColSpan()
					},
					_frozenStartColumn : -1,
					_frozenEndColumn : -1,
					isFrozen : function() {
						return this._frozenStartColumn >= 0
								&& this._frozenEndColumn >= this._frozenStartColumn
					},
					frozen : function(A, B) {
						A = this.getColumn(A);
						B = this.getColumn(B);
						var C = this.getVisibleColumns();
						this._frozenStartColumn = C.indexOf(A);
						this._frozenEndColumn = C.indexOf(B);
						if (A && B)
							this._columnsChanged()
					},
					unFrozen : function() {
						this._frozenStartColumn = -1;
						this._frozenEndColumn = -1;
						this._columnsChanged()
					},
					setFrozenStartColumn : function(A) {
						this.frozen(A, this._frozenEndColumn)
					},
					setFrozenEndColumn : function(A) {
						this.frozen(this._frozenStartColumn, A)
					},
					getFrozenColumns : function() {
						var C = [], B = this.isFrozen();
						for ( var A = 0, D = this._visibleColumns.length; A < D; A++)
							if (B && this._frozenStartColumn <= A
									&& A <= this._frozenEndColumn)
								C.push(this._visibleColumns[A]);
						return C
					},
					getUnFrozenColumns : function() {
						var C = [], B = this.isFrozen();
						for ( var A = 0, D = this._visibleColumns.length; A < D; A++)
							if ((B && A > this._frozenEndColumn) || !B)
								C.push(this._visibleColumns[A]);
						return C
					},
					getFrozenColumnsRow : function() {
						return this.isFrozen() ? this._columnsRow1 : []
					},
					getUnFrozenColumnsRow : function() {
						return this.isFrozen() ? this._columnsRow2 : this
								.getVisibleColumnsRow()
					},
					_createFrozenColSpan : function() {
						var I = this, P = this.getVisibleColumns(), D = this._frozenStartColumn, F = this._frozenEndColumn;
						function H(G, E) {
							var H = I.isBottomColumn(G) ? [ G ] : I
									._getVisibleColumnsByColumn(G);
							for ( var B = 0, J = H.length; B < J; B++) {
								var C = H[B], A = P.indexOf(C);
								if (E == 0 && A < D)
									return true;
								if (E == 1 && D <= A && A <= F)
									return true;
								if (E == 2 && A > F)
									return true
							}
							return false
						}
						function B(F, C) {
							var G = mini.treeToList(F.columns, "columns"), D = 0;
							for ( var A = 0, E = G.length; A < E; A++) {
								var B = G[A];
								if (I.isVisibleColumn(B) == false
										|| H(B, C) == false)
									continue;
								if (!B.columns || B.columns.length == 0)
									D += 1
							}
							return D
						}
						var A = mini.treeToList(this.columns, "columns");
						for ( var M = 0, K = A.length; M < K; M++) {
							var G = A[M];
							delete G.colspan0;
							delete G.colspan1;
							delete G.colspan2;
							delete G.viewIndex0;
							delete G.viewIndex1;
							delete G.viewIndex2;
							if (this.isFrozen()) {
								if (G.columns && G.columns.length > 0) {
									G.colspan1 = B(G, 1);
									G.colspan2 = B(G, 2);
									G.colspan0 = B(G, 0)
								} else {
									G.colspan1 = 1;
									G.colspan2 = 1;
									G.colspan0 = 1
								}
								if (H(G, 0))
									G["viewIndex" + 0] = true;
								if (H(G, 1))
									G["viewIndex" + 1] = true;
								if (H(G, 2))
									G["viewIndex" + 2] = true
							}
						}
						var L = this._getMaxColumnLevel();
						this._columnsRow1 = [];
						this._columnsRow2 = [];
						for (M = 0, K = this._visibleColumnsRow.length; M < K; M++) {
							var J = this._visibleColumnsRow[M], N = [], Q = [];
							this._columnsRow1.push(N);
							this._columnsRow2.push(Q);
							for ( var O = 0, C = J.length; O < C; O++) {
								var E = J[O];
								if (E.viewIndex1)
									N.push(E);
								if (E.viewIndex2)
									Q.push(E)
							}
						}
					},
					_createColumnsRow : function() {
						var B = this._getMaxColumnLevel(), H = [], F = [];
						for ( var E = 0, J = B; E <= J; E++) {
							H.push( []);
							F.push( [])
						}
						var I = this;
						function C(E) {
							var F = mini.treeToList(E.columns, "columns"), C = 0;
							for ( var A = 0, D = F.length; A < D; A++) {
								var B = F[A];
								if (I.isVisibleColumn(B) == false)
									continue;
								if (!B.columns || B.columns.length == 0)
									C += 1
							}
							return C
						}
						var A = mini.treeToList(this.columns, "columns");
						for (E = 0, J = A.length; E < J; E++) {
							var G = A[E], D = H[G._level], K = F[G._level];
							delete G.rowspan;
							delete G.colspan;
							if (G.columns && G.columns.length > 0)
								G.colspan = C(G);
							if ((!G.columns || G.columns.length == 0)
									&& G._level < B)
								G.rowspan = B - G._level + 1;
							D.push(G);
							if (this.isVisibleColumn(G))
								K.push(G)
						}
						this._columnsRow = H;
						this._visibleColumnsRow = F
					},
					_getMaxColumnLevel : function() {
						return this._maxColumnLevel
					},
					cascadeColumns : function(C, G, D) {
						if (!G)
							return;
						var F = C.columns;
						if (F) {
							F = F.clone();
							for ( var A = 0, E = F.length; A < E; A++) {
								var B = F[A];
								if (G.call(D || this, B, A, C) === false)
									return;
								this.cascadeColumns(B, G, D)
							}
						}
					},
					eachColumns : function(D, H, E) {
						var F = D.columns;
						if (F) {
							var B = F.clone();
							for ( var C = 0, G = B.length; C < G; C++) {
								var A = B[C];
								if (H.call(E, A, C, D) === false)
									break
							}
						}
					},
					getColumn : function(A) {
						var B = typeof A;
						if (B == "number")
							return this._visibleColumns[A];
						else if (B == "object")
							return A;
						else
							return this._nameColumns[A]
					},
					getColumnByField : function(A) {
						if (!A)
							return null;
						return this._fieldColumns[A]
					},
					_getColumnById : function(A) {
						return this._idColumns[A]
					},
					_getDataTypeByField : function(C) {
						var E = "string", D = this.getBottomColumns();
						for ( var A = 0, F = D.length; A < F; A++) {
							var B = D[A];
							if (B.field == C) {
								if (B.dataType)
									E = B.dataType.toLowerCase();
								break
							}
						}
						return E
					},
					getParentColumn : function(A) {
						A = this.getColumn(A);
						var B = A._pid;
						if (B == -1)
							return this;
						return this._idColumns[B]
					},
					getAncestorColumns : function(C) {
						var B = [ C ];
						while (1) {
							var A = this.getParentColumn(C);
							if (!A || A == this)
								break;
							B[B.length] = A;
							C = A
						}
						B.reverse();
						return B
					},
					isAncestorColumn : function(B, D) {
						if (B == D)
							return true;
						if (!B || !D)
							return false;
						var C = this.getAncestorColumns(D);
						for ( var A = 0, E = C.length; A < E; A++)
							if (C[A] == B)
								return true;
						return false
					},
					isVisibleColumn : function(B) {
						B = this.getColumn(B);
						var C = this.getAncestorColumns(B);
						for ( var A = 0, D = C.length; A < D; A++)
							if (C[A].visible == false)
								return false;
						return true
					},
					isBottomColumn : function(A) {
						A = this.getColumn(A);
						return !(A.columns && A.columns.length > 0)
					},
					updateColumn : function(A, B) {
						A = this.getColumn(A);
						if (!A)
							return;
						mini.copyTo(A, B);
						this._columnsChanged()
					},
					moveColumn : function(E, B, C) {
						E = this.getColumn(E);
						B = this.getColumn(B);
						if (!E || !B || !C || E == B)
							return;
						if (this.isAncestorColumn(E, B))
							return;
						var F = this.getParentColumn(E);
						if (F)
							F.columns.remove(E);
						var D = B, A = C;
						if (A == "before") {
							D = this.getParentColumn(B);
							A = D.columns.indexOf(B)
						} else if (A == "after") {
							D = this.getParentColumn(B);
							A = D.columns.indexOf(B) + 1
						} else if (A == "add" || A == "append") {
							if (!D.columns)
								D.columns = [];
							A = D.columns.length
						} else if (!mini.isNumber(A))
							return;
						D.columns.insert(A, E);
						this._columnsChanged()
					},
					addColumn : function() {
						this._columnsChanged()
					},
					removeColumn : function() {
						this._columnsChanged()
					}
				});
mini.GridView = function() {
	this._createTime = new Date();
	this._createColumnModel();
	this._bindColumnModel();
	this._createSource();
	this._bindSource();
	this._initData();
	mini.GridView.superclass.constructor.call(this);
	this._doUpdateFilterRow();
	this._doUpdateSummaryRow();
	this.doUpdate()
};
mini
		.extend(
				mini.GridView,
				mini.Panel,
				{
					_displayStyle : "block",
					_rowIdField : "_id",
					width : "100%",
					showColumns : true,
					showFilterRow : false,
					showSummaryRow : false,
					showPager : false,
					allowCellWrap : false,
					allowHeaderWrap : false,
					allowHeaderCellWrap : false,
					showModified : true,
					showNewRow : true,
					showEmptyText : false,
					emptyText : "No data returned.",
					showHGridLines : true,
					showVGridLines : true,
					allowAlternating : false,
					_alternatingCls : "mini-grid-row-alt",
					_rowCls : "mini-grid-row",
					_cellCls : "mini-grid-cell",
					_headerCellCls : "mini-grid-headerCell",
					_rowSelectedCls : "mini-grid-row-selected",
					_rowHoverCls : "mini-grid-row-hover",
					_cellSelectedCls : "mini-grid-cell-selected",
					defaultRowHeight : 21,
					fixedRowHeight : false,
					isFixedRowHeight : function() {
						return this.fixedRowHeight
					},
					fitColumns : true,
					isFitColumns : function() {
						return this.fitColumns
					},
					uiCls : "mini-gridview",
					_create : function() {
						mini.GridView.superclass._create.call(this);
						var C = this.el;
						mini.addClass(C, "mini-grid");
						mini.addClass(this._viewportEl, "mini-grid-viewport");
						var E = "<div class=\"mini-grid-pager\"></div>", A = "<div class=\"mini-grid-filterRow\"><div class=\"mini-grid-filterRow-view\"></div><div class=\"mini-grid-scrollHeaderCell\"></div></div>", B = "<div class=\"mini-grid-summaryRow\"><div class=\"mini-grid-summaryRow-view\"></div><div class=\"mini-grid-scrollHeaderCell\"></div></div>", D = "<div class=\"mini-grid-columns\"><div class=\"mini-grid-columns-view\"></div><div class=\"mini-grid-scrollHeaderCell\"></div></div>";
						this._columnsEl = mini.after(this._toolbarEl, D);
						this._filterEl = mini.after(this._columnsEl, A);
						this._rowsEl = this._bodyEl;
						mini.addClass(this._rowsEl, "mini-grid-rows");
						this._summaryEl = mini.after(this._rowsEl, B);
						this._bottomPagerEl = mini.after(this._summaryEl, E);
						this._columnsViewEl = this._columnsEl.childNodes[0];
						this._topRightCellEl = this._columnsEl.childNodes[1];
						this._rowsViewEl = mini
								.append(
										this._rowsEl,
										"<div class=\"mini-grid-rows-view\"><div class=\"mini-grid-rows-content\"></div></div>");
						this._rowsViewContentEl = this._rowsViewEl.firstChild;
						this._filterViewEl = this._filterEl.childNodes[0];
						this._summaryViewEl = this._summaryEl.childNodes[0]
					},
					_initEvents : function() {
						mini.GridView.superclass._initEvents.call(this);
						mini.on(this._rowsViewEl, "scroll",
								this.__OnRowViewScroll, this)
					},
					_setBodyWidth : false,
					doLayout : function() {
						if (!this.canLayout())
							return;
						mini.GridView.superclass.doLayout.call(this);
						this._stopLayout();
						var E = this.isAutoHeight(), D = this._columnsViewEl.firstChild, C = this._rowsViewContentEl.firstChild, B = this._filterViewEl.firstChild, A = this._summaryViewEl.firstChild;
						function G(A) {
							if (this.isFitColumns()) {
								C.style.width = "100%";
								if (mini.isChrome || mini.isIE6)
									A.style.width = C.offsetWidth + "px";
								else if (this._rowsViewEl.scrollHeight > this._rowsViewEl.clientHeight) {
									A.style.width = "100%";
									A.parentNode.style.width = "auto";
									A.parentNode.style["paddingRight"] = "17px"
								} else {
									A.style.width = "100%";
									A.parentNode.style.width = "100%";
									A.parentNode.style["paddingRight"] = "0px"
								}
							} else {
								C.style.width = "0px";
								A.style.width = "0px";
								if (mini.isChrome || mini.isIE6)
									;
								else {
									A.parentNode.style.width = "100%";
									A.parentNode.style["paddingRight"] = "0px"
								}
							}
						}
						G.call(this, D);
						G.call(this, B);
						G.call(this, A);
						this._syncScroll();
						var F = this;
						setTimeout(function() {
							mini.layout(F._filterEl);
							mini.layout(F._summaryEl)
						}, 10)
					},
					setBody : function() {
					},
					_createTopRowHTML : function(D) {
						var G = "";
						if (mini.isIE) {
							if (mini.isIE6 || mini.isIE7 || !mini.boxModel)
								G += "<tr style=\"display:none;\">";
							else
								G += "<tr >"
						} else
							G += "<tr>";
						for ( var A = 0, E = D.length; A < E; A++) {
							var C = D[A], B = C.width, F = C._id;
							G += "<td id=\""
									+ F
									+ "\" style=\"padding:0;border:0;margin:0;height:0px;";
							if (C.width)
								G += "width:" + C.width;
							G += "\" ></td>"
						}
						G += "<td style=\"width:0px;\"></td>";
						G += "</tr>";
						return G
					},
					_createColumnsHTML : function(C, L, P) {
						var P = P ? P : this.getVisibleColumns(), I = [ "<table class=\"mini-grid-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">" ];
						I.push(this._createTopRowHTML(P));
						var N = this.getSortField(), F = this.getSortOrder();
						for ( var M = 0, B = C.length; M < B; M++) {
							var G = C[M];
							I[I.length] = "<tr>";
							for ( var J = 0, H = G.length; J < H; J++) {
								var E = G[J], O = this._createHeaderText(E, L), K = this
										._createHeaderCellId(E, L), A = "";
								if (N && N == E.field)
									A = F == "asc" ? "mini-grid-asc"
											: "mini-grid-desc";
								var W = "";
				                if (this.allowHeaderWrap == false)
				                    W = " mini-grid-headerCell-nowrap ";
								I[I.length] = "<td id=\"";
								I[I.length] = K;
								I[I.length] = "\" class=\"mini-grid-headerCell "
										+ A + " " + (E.headerCls || "") + " ";
								var D = !(E.columns && E.columns.length > 0);
								if (D)
									I[I.length] = " mini-grid-bottomCell ";
								if (J == H - 1)
									I[I.length] = " mini-grid-rightCell ";
								I[I.length] = "\" style=\"";
								if (E.headerStyle)
									I[I.length] = E.headerStyle + ";";
								if (E.headerAlign)
									I[I.length] = "text-align:" + E.headerAlign
											+ ";";
								I[I.length] = "\" ";
								if (E.rowspan)
									I[I.length] = "rowspan=\"" + E.rowspan
											+ "\" ";
								this._createColumnColSpan(E, I, L);
								I[I.length] = "><div class=\"mini-grid-headerCell-inner " + W + "\">";
								I[I.length] = O;
								if (A)
									I[I.length] = "<span class=\"mini-grid-sortIcon\"></span>";
								I[I.length] = "<div id=\""
										+ E._id
										+ "\" class=\"mini-grid-column-splitter\"></div>";
								I[I.length] = "</div></td>"
							}
							if (this.isFrozen() && L == 1) {
								I[I.length] = "<td class=\"mini-grid-headerCell\" style=\"width:0;\"><div class=\"mini-grid-headerCell-inner\" style=\"";
								I[I.length] = "\">0</div></td>"
							}
							I[I.length] = "</tr>"
						}
						I.push("</table>");
						return I.join("")
					},
					_createHeaderText : function(B, A) {
						var C = B.header;
						if (typeof C == "function")
							C = C.call(this, B);
						if (mini.isNull(C) || C === "")
							C = "&nbsp;";
						return C
					},
					_createColumnColSpan : function(B, C, A) {
						if (B.colspan)
							C[C.length] = "colspan=\"" + B.colspan + "\" "
					},
					doUpdateColumns : function() {
						var C = this._columnsViewEl.scrollLeft, B = this
								.getVisibleColumnsRow(), A = this
								._createColumnsHTML(B, 2), D = "<div class=\"mini-grid-topRightCell\"></div>";
						A += D;
						this._columnsViewEl.innerHTML = A;
						this._columnsViewEl.scrollLeft = C
					},
					doUpdate : function() {
						if (this.canUpdate() == false)
							return;
						var D = this._isCreating(), B = new Date();
						this._doUpdateSummaryRow();
						var C = this;
						function A() {
							C.doUpdateRows();
							C.doLayout();
							C._doUpdateTimer = null
						}
						C.doUpdateColumns();
						if (D)
							this._useEmptyView = true;
						if (this._rowsViewContentEl
								&& this._rowsViewContentEl.firstChild)
							this._rowsViewContentEl
									.removeChild(this._rowsViewContentEl.firstChild);
						if (this._rowsLockContentEl
								&& this._rowsLockContentEl.firstChild)
							this._rowsLockContentEl
									.removeChild(this._rowsLockContentEl.firstChild);
						C.doUpdateRows();
						if (D)
							this._useEmptyView = false;
						C.doLayout();
						if (D && !this._doUpdateTimer)
							this._doUpdateTimer = setTimeout(A, 15);
						this.unmask()
					},
					_isCreating : function() {
						return (new Date() - this._createTime) < 1000
					},
					deferUpdate : function(A) {
						if (!A)
							A = 5;
						if (this._updateTimer || this._doUpdateTimer)
							return;
						var B = this;
						this._updateTimer = setTimeout(function() {
							B._updateTimer = null;
							B.doUpdate()
						}, A)
					},
					_updateCount : 0,
					beginUpdate : function() {
						this._updateCount++
					},
					endUpdate : function(A) {
						this._updateCount--;
						if (this._updateCount == 0 || A === true) {
							this._updateCount = 0;
							this.doUpdate()
						}
					},
					canUpdate : function() {
						return this._updateCount == 0
					},
					_getRowHeight : function(A) {
						var B = this.defaultRowHeight;
						if (A._height) {
							B = parseInt(A._height);
							if (isNaN(parseInt(A._height)))
								B = rowHeight
						}
						B -= 4;
						B -= 1;
						return B
					},
					_createGroupingHTML : function(D, I) {
						var H = this.getGroupingView(), C = this._showGroupSummary, M = this
								.isFrozen(), N = 0, E = this;
						function O(H, B) {
							F
									.push("<table class=\"mini-grid-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">");
							if (D.length > 0) {
								F.push(E._createTopRowHTML(D));
								for ( var J = 0, A = H.length; J < A; J++) {
									var G = H[J];
									E._createRowHTML(G, N++, D, I, F)
								}
							}
							if (C)
								;
							F.push("</table>")
						}
						var F = [ "<table class=\"mini-grid-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">" ];
						F.push(this._createTopRowHTML(D));
						for ( var L = 0, A = H.length; L < A; L++) {
							var B = H[L], G = this._createRowGroupId(B, I), J = this
									._createRowGroupRowsId(B, I), P = this
									._OnDrawGroup(B);
							F[F.length] = "<tr id=\"";
							F[F.length] = G;
							F[F.length] = "\" class=\"mini-grid-groupRow\"><td class=\"mini-grid-groupCell\" colspan=\"";
							F[F.length] = D.length;
							F[F.length] = "\"><div class=\"mini-grid-groupHeader\">";
							if (!M || (M && I == 1)) {
								F[F.length] = "<div class=\"mini-grid-group-ecicon\"></div>";
								F[F.length] = "<div class=\"mini-grid-groupTitle\">"
										+ P.cellHtml + "</div>"
							} else
								F[F.length] = "&nbsp;";
							F[F.length] = "</div></td></tr>";
							var K = B.expanded ? "" : "display:none";
							F[F.length] = "<tr class=\"mini-grid-groupRows-tr\" style=\"";
							if (mini.isIE)
								F[F.length] = K;
							F[F.length] = "\"><td class=\"mini-grid-groupRows-td\" colspan=\"";
							F[F.length] = D.length;
							F[F.length] = "\"><div id=\"";
							F[F.length] = J;
							F[F.length] = "\" class=\"mini-grid-groupRows\" style=\"";
							F[F.length] = K;
							F[F.length] = "\">";
							O(B.rows, B);
							F[F.length] = "</div></td></tr>"
						}
						F.push("</table>");
						return F.join("")
					},
					_isFastCreating : function() {
						var A = this.getVisibleRows();
						if (A.length > 50)
							return this._isCreating()
									|| this.getScrollTop() < 50 * this._defaultRowHeight;
						return false
					},
					_createRowHTML : function(A, R, G, P, J) {
						var S = !J;
						if (!J)
							J = [];
						var D = "", B = this.isFixedRowHeight();
						if (B)
							D = this._getRowHeight(A);
						var M = -1, N = " ", K = -1, O = " ";
						J[J.length] = "<tr class=\"mini-grid-row ";
						if (A._state == "added" && this.showNewRow)
							J[J.length] = "mini-grid-newRow ";
						if (this.allowAlternating && R % 2 == 1) {
							J[J.length] = this._alternatingCls;
							J[J.length] = " "
						}
						var F = this._dataSource.isSelected(A);
						if (F) {
							J[J.length] = this._rowSelectedCls;
							J[J.length] = " "
						}
						M = J.length;
						J[J.length] = N;
						J[J.length] = "\" style=\"";
						K = J.length;
						J[J.length] = O;
						J[J.length] = "\" id=\"";
						J[J.length] = this._createRowId(A, P);
						J[J.length] = "\">";
						var T = this._currentCell;
						for ( var L = 0, H = G.length; L < H; L++) {
							var C = G[L], I = this._createCellId(A, C), E = "", U = this
									._OnDrawCell(A, C, R, C._index);
							if (U.cellHtml === null || U.cellHtml === undefined
									|| U.cellHtml === "")
								U.cellHtml = "&nbsp;";
							J[J.length] = "<td ";
							if (U.rowSpan)
								J[J.length] = "rowspan=\"" + U.rowSpan + "\"";
							if (U.colSpan)
								J[J.length] = "colspan=\"" + U.colSpan + "\"";
							J[J.length] = " id=\"";
							J[J.length] = I;
							J[J.length] = "\" class=\"mini-grid-cell ";
							if (L == H - 1)
								J[J.length] = " mini-grid-rightCell ";
							if (U.cellCls)
								J[J.length] = " " + U.cellCls + " ";
							if (E)
								J[J.length] = E;
							if (T && T[0] == A && T[1] == C) {
								J[J.length] = " ";
								J[J.length] = this._cellSelectedCls
							}
							J[J.length] = "\" style=\"";
							if (U.showHGridLines == false)
								J[J.length] = "border-bottom:0;";
							if (U.showVGridLines == false)
								J[J.length] = "border-right:0;";
							if (!U.visible)
								J[J.length] = "display:none;";
							if (C.align) {
								J[J.length] = "text-align:";
								J[J.length] = C.align;
								J[J.length] = ";"
							}
							if (U.cellStyle)
								J[J.length] = U.cellStyle;
							J[J.length] = "\">";
							J[J.length] = "<div class=\"mini-grid-cell-inner ";
							if (!U.allowCellWrap)
								J[J.length] = " mini-grid-cell-nowrap ";
							if (U.cellInnerCls)
								J[J.length] = U.cellInnerCls;
							var Q = C.field ? this._dataSource.isModified(A,
									C.field) : false;
							if (Q && this.showModified)
								J[J.length] = " mini-grid-cell-dirty";
							J[J.length] = "\" style=\"";
							if (B) {
								J[J.length] = "height:";
								J[J.length] = D;
								J[J.length] = "px;"
							}
							if (U.cellInnerStyle)
								J[J.length] = U.cellInnerStyle;
							J[J.length] = "\">";
							J[J.length] = U.cellHtml;
							J[J.length] = "</div>";
							J[J.length] = "</td>";
							if (U.rowCls)
								N = U.rowCls;
							if (U.rowStyle)
								O = U.rowStyle
						}
						if (this.isFrozen() && P == 1) {
							J[J.length] = "<td class=\"mini-grid-cell\" style=\"width:0;";
							if (this.showHGridLines == false)
								J[J.length] = "border-bottom:0;";
							J[J.length] = "\"><div class=\"mini-grid-cell-inner\" style=\"";
							if (B) {
								J[J.length] = "height:";
								J[J.length] = D;
								J[J.length] = "px;"
							}
							J[J.length] = "\">0</div></td>"
						}
						J[M] = N;
						J[K] = O;
						J[J.length] = "</tr>";
						if (S)
							return J.join("")
					},
					_createRowsHTML : function(D, H, I, G) {
						I = I || this.getVisibleRows();
						var E = [ "<table class=\"mini-grid-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">" ];
						E.push(this._createTopRowHTML(D));
						var K = this.uid + "$emptytext" + H;
						E
								.push("<tr id=\""
										+ K
										+ "\" style=\"display:none;\"><td class=\"mini-grid-emptyText\" colspan=\""
										+ D.length + "\">" + this.emptyText
										+ "</td></tr>");
						var F = 0;
						if (I.length > 0) {
							var C = I[0];
							F = this.getVisibleRows().indexOf(C)
						}
						for ( var J = 0, B = I.length; J < B; J++) {
							var L = F + J, A = I[J];
							this._createRowHTML(A, L, D, H, E)
						}
						if (G)
							E.push(G);
						E.push("</table>");
						return E.join("")
					},
					doUpdateRows : function() {
						var B = this.getVisibleRows(), C = this
								.getVisibleColumns();
						if (this.isGrouping()) {
							var A = this._createGroupingHTML(C, 2);
							this._rowsViewContentEl.innerHTML = A
						} else {
							A = this._createRowsHTML(C, 2, B);
							this._rowsViewContentEl.innerHTML = A
						}
					},
					_createFilterRowHTML : function(D, B) {
						var H = [ "<table class=\"mini-grid-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">" ];
						H.push(this._createTopRowHTML(D));
						H[H.length] = "<tr>";
						for ( var A = 0, E = D.length; A < E; A++) {
							var C = D[A], G = this._createFilterCellId(C);
							H[H.length] = "<td id=\"";
							H[H.length] = G;
							H[H.length] = "\" class=\"mini-grid-filterCell\" style=\"";
							H[H.length] = "\">&nbsp;</td>"
						}
						H[H.length] = "</tr></table><div class=\"mini-grid-scrollHeaderCell\"></div>";
						var F = H.join("");
						return F
					},
					_doRenderFilters : function() {
						var D = this.getVisibleColumns();
						for ( var A = 0, E = D.length; A < E; A++) {
							var C = D[A];
							if (C.filter) {
								var B = this.getFilterCellEl(A);
								B.innerHTML = "";
								C.filter.render(B)
							}
						}
					},
					_doUpdateFilterRow : function() {
						if (this._filterViewEl.firstChild)
							this._filterViewEl
									.removeChild(this._filterViewEl.firstChild);
						var B = this.isFrozen(), C = this.getVisibleColumns(), A = this
								._createFilterRowHTML(C, 2);
						this._filterViewEl.innerHTML = A;
						this._doRenderFilters()
					},
					_createSummaryRowHTML : function(E, C) {
						var B = this.getDataView(), I = [ "<table class=\"mini-grid-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">" ];
						I.push(this._createTopRowHTML(E));
						I[I.length] = "<tr>";
						for ( var A = 0, F = E.length; A < F; A++) {
							var D = E[A], H = this._createSummaryCellId(D), J = this
									._OnDrawSummaryCell(B, D);
							I[I.length] = "<td id=\"";
							I[I.length] = H;
							I[I.length] = "\" class=\"mini-grid-summaryCell "
									+ J.cellCls + "\" style=\"" + J.cellStyle
									+ ";";
							I[I.length] = "\">";
							I[I.length] = J.cellHtml;
							I[I.length] = "</td>"
						}
						I[I.length] = "</tr></table><div class=\"mini-grid-scrollHeaderCell\"></div>";
						var G = I.join("");
						return G
					},
					_doUpdateSummaryRow : function() {
						var B = this.getVisibleColumns(), A = this
								._createSummaryRowHTML(B, 2);
						this._summaryViewEl.innerHTML = A
					},
					_doSortByField : function(C, B) {
						if (!C)
							return null;
						var A = this._columnModel._getDataTypeByField(C);
						this._dataSource._doClientSortField(C, B, A)
					},
					_expandGroupOnLoad : true,
					_GroupID : 1,
					_groupField : "",
					_groupDir : "",
					groupBy : function(A, B) {
						if (!A)
							return;
						this._groupField = A;
						if (typeof B == "string")
							B = B.toLowerCase();
						this._groupDir = B;
						this._createGroupingView();
						this.deferUpdate()
					},
					clearGroup : function() {
						this._groupField = "";
						this._groupDir = "";
						this._groupDataView = null;
						this.deferUpdate()
					},
					setGroupField : function(A) {
						this.groupBy(A)
					},
					setGroupDir : function(A) {
						this._groupDir = field;
						this.groupBy(this._groupField, A)
					},
					isGrouping : function() {
						return this._groupField != ""
					},
					getGroupingView : function() {
						return this._groupDataView
					},
					_createGroupingView : function() {
						if (this.isGrouping() == false)
							return;
						this._groupDataView = null;
						var H = this._groupField, J = this._groupDir;
						this._doSortByField(H, "asc");
						var F = this.getVisibleRows(), D = [], E = {};
						for ( var B = 0, I = F.length; B < I; B++) {
							var A = F[B], K = A[H], G = mini.isDate(K) ? K
									.getTime() : K, C = E[G];
							if (!C) {
								C = E[G] = {};
								C.field = H, C.dir = J;
								C.value = K;
								C.rows = [];
								D.push(C);
								C.id = "g" + this._GroupID++;
								C.expanded = this._expandGroupOnLoad
							}
							C.rows.push(A)
						}
						this._groupDataView = D
					},
					_OnDrawGroup : function(A) {
						var B = {
							group : A,
							rows : A.rows,
							field : A.field,
							dir : A.dir,
							value : A.value,
							cellHtml : A.field + " (" + A.rows.length
									+ " Items)"
						};
						this.fire("drawgroup", B);
						return B
					},
					getRowGroup : function(B) {
						var A = typeof B;
						if (A == "number")
							return this.getGroupingView()[B];
						if (A == "string")
							return this._getRowGroupById(B);
						return B
					},
					_getRowGroupByEvent : function(D) {
						var B = mini.findParent(D.target, "mini-grid-groupRow");
						if (B) {
							var A = B.id.split("$");
							if (A[0] != this._id)
								return null;
							var C = A[A.length - 1];
							return this._getRowGroupById(C)
						}
						return null
					},
					_getRowGroupById : function(E) {
						var B = this.getGroupingView();
						for ( var A = 0, D = B.length; A < D; A++) {
							var C = B[A];
							if (C.id == E)
								return C
						}
						return null
					},
					_createRowGroupId : function(A, B) {
						return this._id + "$group" + B + "$" + A.id
					},
					_createRowGroupRowsId : function(A, B) {
						return this._id + "$grouprows" + B + "$" + A.id
					},
					_createRowId : function(B, A) {
						var C = this._id + "$row" + A + "$" + B._id;
						return C
					},
					_createHeaderCellId : function(B, A) {
						var C = this._id + "$headerCell" + A + "$" + B._id;
						return C
					},
					_createCellId : function(A, B) {
						var C = A._id + "$cell$" + B._id;
						return C
					},
					_createFilterCellId : function(A) {
						return this._id + "$filter$" + A._id
					},
					_createSummaryCellId : function(A) {
						return this._id + "$summary$" + A._id
					},
					getFilterCellEl : function(A) {
						A = this.getColumn(A);
						if (!A)
							return null;
						return document.getElementById(this
								._createFilterCellId(A))
					},
					getSummaryCellEl : function(A) {
						A = this.getColumn(A);
						if (!A)
							return null;
						return document.getElementById(this
								._createSummaryCellId(A))
					},
					_doVisibleEls : function() {
						mini.GridView.superclass._doVisibleEls.call(this);
						this._columnsEl.style.display = this.showColumns ? "block"
								: "none";
						this._filterEl.style.display = this.showFilterRow ? "block"
								: "none";
						this._summaryEl.style.display = this.showSummaryRow ? "block"
								: "none";
						this._bottomPagerEl.style.display = this.showPager ? "block"
								: "none"
					},
					setShowColumns : function(A) {
						this.showColumns = A;
						this._doVisibleEls();
						this.deferLayout()
					},
					setShowFilterRow : function(A) {
						this.showFilterRow = A;
						this._doVisibleEls();
						this.deferLayout()
					},
					setShowSummaryRow : function(A) {
						this.showSummaryRow = A;
						this._doVisibleEls();
						this.deferLayout()
					},
					setShowPager : function(A) {
						this.showPager = A;
						this._doVisibleEls();
						this.deferLayout()
					},
					setFitColumns : function(A) {
						this.fitColumns = A;
						this.deferLayout()
					},
					getBodyHeight : function() {
						var A = mini.GridView.superclass.getBodyHeight
								.call(this);
						A = A - this.getColumnsHeight()
								- this.getFilterHeight()
								- this.getSummaryHeight()
								- this.getPagerHeight();
						return A
					},
					getColumnsHeight : function() {
						return this.showColumns ? mini
								.getHeight(this._columnsEl) : 0
					},
					getFilterHeight : function() {
						return this.showFilterRow ? mini
								.getHeight(this._filterEl) : 0
					},
					getSummaryHeight : function() {
						return this.showSummaryRow ? mini
								.getHeight(this._summaryEl) : 0
					},
					getPagerHeight : function() {
						return this.showPager ? mini
								.getHeight(this._bottomPagerEl) : 0
					},
					getGridViewBox : function(B) {
						var A = mini.getBox(this._columnsEl), C = mini
								.getBox(this._bodyEl);
						A.height = C.bottom - A.top;
						A.bottom = A.top + A.height;
						return A
					},
					getSortField : function(A) {
						return this._dataSource.sortField
					},
					getSortOrder : function(A) {
						return this._dataSource.sortOrder
					},
					_createSource : function() {
						this._dataSource = new mini.DataTable()
					},
					_bindSource : function() {
						var A = this._dataSource;
						A.on("loaddata", this.__OnSourceLoadData, this);
						A.on("cleardata", this.__OnSourceClearData, this)
					},
					__OnSourceLoadData : function(A) {
						this._initData();
						this.doUpdate()
					},
					__OnSourceClearData : function(A) {
						this._initData();
						this.doUpdate()
					},
					_initData : function() {
					},
					isFrozen : function() {
						var B = this._columnModel._frozenStartColumn, A = this._columnModel._frozenEndColumn;
						return this._columnModel.isFrozen()
					},
					_createColumnModel : function() {
						this._columnModel = new mini.ColumnModel(this)
					},
					_bindColumnModel : function() {
						this._columnModel.on("columnschanged",
								this.__OnColumnsChanged, this)
					},
					__OnColumnsChanged : function(A) {
						this._doUpdateFilterRow();
						this._doUpdateSummaryRow();
						this.doUpdate();
						this.fire("columnschanged")
					},
					setColumns : function(A) {
						this._columnModel.setColumns(A)
					},
					getColumns : function() {
						return this._columnModel.getColumns()
					},
					getBottomColumns : function() {
						return this._columnModel.getBottomColumns()
					},
					getVisibleColumnsRow : function() {
						var A = this._columnModel.getVisibleColumnsRow()
								.clone();
						return A
					},
					getVisibleColumns : function() {
						var A = this._columnModel.getVisibleColumns().clone();
						return A
					},
					getFrozenColumns : function() {
						var A = this._columnModel.getFrozenColumns().clone();
						return A
					},
					getUnFrozenColumns : function() {
						var A = this._columnModel.getUnFrozenColumns().clone();
						return A
					},
					getColumn : function(A) {
						return this._columnModel.getColumn(A)
					},
					updateColumn : function(A, B) {
						this._columnModel.updateColumn(A, B)
					},
					showColumn : function(A) {
						this.updateColumn(A, {
							visible : true
						})
					},
					hideColumn : function(A) {
						this.updateColumn(A, {
							visible : false
						})
					},
					moveColumn : function(C, A, B) {
						this._columnModel.moveColumn(C, A, B)
					},
					removeColumn : function(A) {
					},
					insertColumn : function(A) {
					},
					setColumnWidth : function(B, A) {
						this.updateColumn(B, {
							width : A
						})
					},
					getColumnWidth : function(B) {
						var A = this.getColumnBox(B);
						return A.width
					},
					getParentColumn : function(A) {
						return this._columnModel.getParentColumn(A)
					},
					_isCellVisible : function(A, B) {
						return true
					},
					_createDrawCellEvent : function(A, D, E, F) {
						var B = mini._getMap(D.field, A), G = {
							sender : this,
							rowIndex : E,
							columnIndex : F,
							record : A,
							row : A,
							column : D,
							field : D.field,
							value : B,
							cellHtml : B,
							rowCls : "",
							rowStyle : null,
							cellCls : D.cellCls || "",
							cellStyle : D.cellStyle || "",
							allowCellWrap : this.allowCellWrap,
							showHGridLines : this.showHGridLines,
							showVGridLines : this.showVGridLines,
							cellInnerCls : "",
							cellInnnerStyle : ""
						};
						G.visible = this._isCellVisible(E, F);
						if (G.visible == true && this._mergedCellMaps) {
							var C = this._mergedCellMaps[E + ":" + F];
							if (C) {
								G.rowSpan = C.rowSpan;
								G.colSpan = C.colSpan
							}
						}
						return G
					},
					_OnDrawCell : function(A, D, E, F) {
						var G = this._createDrawCellEvent(A, D, E, F), B = G.value;
						if (D.dateFormat)
							if (mini.isDate(G.value))
								G.cellHtml = mini.formatDate(B, D.dateFormat);
							else
								G.cellHtml = B;
						if (D.displayField)
							G.cellHtml = A[D.displayField];
						var C = D.renderer;
						if (C) {
							fn = typeof C == "function" ? C : mini._getMap(C,
									window);
							if (fn)
								G.cellHtml = fn.call(D, G)
						}
						this.fire("drawcell", G);
						if (G.cellHtml && !!G.cellHtml.unshift
								&& G.cellHtml.length == 0)
							G.cellHtml = "&nbsp;";
						if (G.cellHtml === null || G.cellHtml === undefined
								|| G.cellHtml === "")
							G.cellHtml = "&nbsp;";
						return G
					},
					_OnDrawSummaryCell : function(C, D) {
						var F = {
							result : this.getResultObject(),
							sender : this,
							data : C,
							column : D,
							field : D.field,
							value : "",
							cellHtml : "",
							cellCls : D.cellCls || "",
							cellStyle : D.cellStyle || "",
							allowCellWrap : this.allowCellWrap
						};
						if (D.summaryType) {
							var E = mini.summaryTypes[D.summaryType];
							if (E)
								F.value = E(C, D.field)
						}
						var A = F.value;
						F.cellHtml = F.value;
						if (F.value && parseInt(F.value) != F.value
								&& F.value.toFixed) {
							decimalPlaces = parseInt(D.decimalPlaces);
							if (isNaN(decimalPlaces))
								decimalPlaces = 2;
							F.cellHtml = parseFloat(F.value
									.toFixed(decimalPlaces))
						}
						if (D.dateFormat)
							if (mini.isDate(F.value))
								F.cellHtml = mini.formatDate(A, D.dateFormat);
							else
								F.cellHtml = A;
						if (D.dataType == "currency")
							F.cellHtml = mini.formatCurrency(F.cellHtml,
									D.currencyUnit);
						var B = D.summaryRenderer;
						if (B) {
							E = typeof B == "function" ? B : window[B];
							if (E)
								F.cellHtml = E.call(D, F)
						}
						D.summaryValue = F.value;
						this.fire("drawsummarycell", F);
						if (F.cellHtml === null || F.cellHtml === undefined
								|| F.cellHtml === "")
							F.cellHtml = "&nbsp;";
						return F
					},
					getScrollTop : function() {
						return this._rowsViewEl.scrollTop
					},
					setScrollTop : function(A) {
						this._rowsViewEl.scrollTop = A
					},
					getScrollLeft : function() {
						return this._rowsViewEl.scrollLeft
					},
					setScrollLeft : function(A) {
						this._rowsViewEl.scrollLeft = A
					},
					_syncScroll : function() {
						var A = this._rowsViewEl.scrollLeft;
						this._filterViewEl.scrollLeft = A;
						this._summaryViewEl.scrollLeft = A;
						this._columnsViewEl.scrollLeft = A
					},
					__OnRowViewScroll : function(A) {
						this._syncScroll()
					},
					_pagers : [],
					_createPagers : function() {
						this._pagers = [];
						var A = new mini.Pager();
						this._setBottomPager(A)
					},
					_setBottomPager : function(A) {
						A = mini.create(A);
						if (!A)
							return;
						if (this._bottomPager) {
							this.unbindPager(this._bottomPager);
							this._bottomPagerEl
									.removeChild(this._bottomPager.el)
						}
						this._bottomPager = A;
						A.render(this._bottomPagerEl);
						this.bindPager(A)
					},
					bindPager : function(A) {
						this._pagers.add(A)
					},
					unbindPager : function(A) {
						this._pagers.remove(A)
					},
					setShowEmptyText : function(A) {
						this.showEmptyText = A
					},
					getShowEmptyText : function() {
						return this.showEmptyText
					},
					setEmptyText : function(A) {
						this.emptyText = A
					},
					getEmptyText : function() {
						return this.emptyText
					},
					setShowModified : function(A) {
						this.showModified = A
					},
					getShowModified : function() {
						return this.showModified
					},
					setShowNewRow : function(A) {
						this.showNewRow = A
					},
					getShowNewRow : function() {
						return this.showNewRow
					},
					setAllowHeaderWrap : function(A) {
						this.allowHeaderWrap = A
					},
					getAllowHeaderWrap : function() {
						return this.allowHeaderWrap
					},
					setShowHGridLines : function(A) {
						if (this.showHGridLines != A) {
							this.showHGridLines = A;
							this.deferUpdate()
						}
					},
					getShowHGridLines : function() {
						return this.showHGridLines
					},
					setShowVGridLines : function(A) {
						if (this.showVGridLines != A) {
							this.showVGridLines = A;
							this.deferUpdate()
						}
					},
					getShowVGridLines : function() {
						return this.showVGridLines
					}
				});
mini.copyTo(mini.GridView.prototype, mini._DataTableApplys);
mini.regClass(mini.GridView, "gridview");
mini.FrozenGridView = function() {
	mini.FrozenGridView.superclass.constructor.call(this)
};
mini
		.extend(
				mini.FrozenGridView,
				mini.GridView,
				{
					isFixedRowHeight : function() {
						return this.fixedRowHeight || this.isFrozen()
					},
					_create : function() {
						mini.FrozenGridView.superclass._create.call(this);
						var B = this.el, E = "<div class=\"mini-grid-columns-lock\"></div>", A = "<div class=\"mini-grid-rows-lock\"><div class=\"mini-grid-rows-content\"></div></div>";
						this._columnsLockEl = mini.before(this._columnsViewEl,
								E);
						this._rowsLockEl = mini.before(this._rowsViewEl, A);
						this._rowsLockContentEl = this._rowsLockEl.firstChild;
						var C = "<div class=\"mini-grid-filterRow-lock\"></div>";
						this._filterLockEl = mini.before(this._filterViewEl, C);
						var D = "<div class=\"mini-grid-summaryRow-lock\"></div>";
						this._summaryLockEl = mini.before(this._summaryViewEl,
								D)
					},
					_initEvents : function() {
						mini.FrozenGridView.superclass._initEvents.call(this);
						mini.on(this._rowsEl, "mousewheel",
								this.__OnMouseWheel, this)
					},
					_createHeaderText : function(B, A) {
						var C = B.header;
						if (typeof C == "function")
							C = C.call(this, B);
						if (mini.isNull(C) || C === "")
							C = "&nbsp;";
						if (this.isFrozen() && A == 2)
							if (B.viewIndex1)
								C = "&nbsp;";
						return C
					},
					_createColumnColSpan : function(B, D, A) {
						if (this.isFrozen()) {
							var C = B["colspan" + A];
							if (C)
								D[D.length] = "colspan=\"" + C + "\" "
						} else if (B.colspan)
							D[D.length] = "colspan=\"" + B.colspan + "\" "
					},
					doUpdateColumns : function() {
						var B = this.isFrozen() ? this.getFrozenColumnsRow()
								: [], G = this.isFrozen() ? this
								.getUnFrozenColumnsRow() : this
								.getVisibleColumnsRow(), E = this.isFrozen() ? this
								.getFrozenColumns()
								: [], C = this.isFrozen() ? this
								.getUnFrozenColumns() : this
								.getVisibleColumns(), A = this
								._createColumnsHTML(B, 1, E), D = this
								._createColumnsHTML(G, 2, C), H = "<div class=\"mini-grid-topRightCell\"></div>";
						A += H;
						D += H;
						this._columnsLockEl.innerHTML = A;
						this._columnsViewEl.innerHTML = D;
						var F = this._columnsLockEl.firstChild;
						F.style.width = "0px"
					},
					doUpdateRows : function() {
						var D = this.getVisibleRows(), B = this
								.getFrozenColumns(), F = this
								.getUnFrozenColumns();
						if (this.isGrouping()) {
							var A = this._createGroupingHTML(B, 1), C = this
									._createGroupingHTML(F, 2);
							this._rowsLockContentEl.innerHTML = A;
							this._rowsViewContentEl.innerHTML = C
						} else {
							A = this._createRowsHTML(B, 1, this.isFrozen() ? D
									: []), C = this._createRowsHTML(F, 2, D);
							this._rowsLockContentEl.innerHTML = A;
							this._rowsViewContentEl.innerHTML = C
						}
						var E = this._rowsLockContentEl.firstChild;
						E.style.width = "0px"
					},
					_doUpdateFilterRow : function() {
						if (this._filterLockEl.firstChild)
							this._filterLockEl
									.removeChild(this._filterLockEl.firstChild);
						if (this._filterViewEl.firstChild)
							this._filterViewEl
									.removeChild(this._filterViewEl.firstChild);
						var A = this.getFrozenColumns(), D = this
								.getUnFrozenColumns(), C = this
								._createFilterRowHTML(A, 1), B = this
								._createFilterRowHTML(D, 2);
						this._filterLockEl.innerHTML = C;
						this._filterViewEl.innerHTML = B;
						this._doRenderFilters()
					},
					_doUpdateSummaryRow : function() {
						var A = this.getFrozenColumns(), D = this
								.getUnFrozenColumns(), C = this
								._createSummaryRowHTML(A, 1), B = this
								._createSummaryRowHTML(D, 2);
						this._summaryLockEl.innerHTML = C;
						this._summaryViewEl.innerHTML = B
					},
					doLayout : function() {
						if (this.canLayout() == false)
							return;
						this._doLayoutScroll = false;
						this._doEmptyText();
						mini.FrozenGridView.superclass.doLayout.call(this);
						var B = this.isAutoHeight(), C = this.isFrozen(), A = this
								.getViewportWidth(true), E = this
								.getLockedWidth(), D = A - E;
						if (C) {
							this._filterViewEl.style["marginLeft"] = E + "px";
							this._summaryViewEl.style["marginLeft"] = E + "px";
							this._columnsViewEl.style["marginLeft"] = E + "px";
							this._rowsViewEl.style["marginLeft"] = E + "px";
							if (mini.isChrome || mini.isIE6) {
								this._filterViewEl.style["width"] = D + "px";
								this._summaryViewEl.style["width"] = D + "px";
								this._columnsViewEl.style["width"] = D + "px"
							} else {
								this._filterViewEl.style["width"] = "auto";
								this._summaryViewEl.style["width"] = "auto";
								this._columnsViewEl.style["width"] = "auto"
							}
							if (mini.isChrome || mini.isIE6)
								this._rowsViewEl.style["width"] = D + "px";
							mini.setWidth(this._filterLockEl, E);
							mini.setWidth(this._summaryLockEl, E);
							mini.setWidth(this._columnsLockEl, E);
							mini.setWidth(this._rowsLockEl, E);
							this._filterLockEl.style["left"] = "0px";
							this._summaryLockEl.style["left"] = "0px";
							this._columnsLockEl.style["left"] = "0px";
							this._rowsLockEl.style["left"] = "0px"
						} else
							this._doClearFrozen();
						if (B)
							this._rowsLockEl.style.height = "auto";
						else
							this._rowsLockEl.style.height = "100%"
					},
					_doEmptyText : function() {
					},
					_getRowEl : function(B, A) {
						B = this.getRecord(B);
						var D = this._createRowId(B, A), C = document
								.getElementById(D);
						return C
					},
					_doClearFrozen : function() {
						this._filterLockEl.style.left = "-10px";
						this._summaryLockEl.style.left = "-10px";
						this._columnsLockEl.style.left = "-10px";
						this._rowsLockEl.style.left = "-10px";
						this._filterLockEl.style["width"] = "0px";
						this._summaryLockEl.style["width"] = "0px";
						this._columnsLockEl.style["width"] = "0px";
						this._rowsLockEl.style["width"] = "0px";
						this._filterLockEl.style["marginLeft"] = "0px";
						this._summaryLockEl.style["marginLeft"] = "0px";
						this._columnsViewEl.style["marginLeft"] = "0px";
						this._rowsViewEl.style["marginLeft"] = "0px";
						this._filterViewEl.style["width"] = "auto";
						this._summaryViewEl.style["width"] = "auto";
						this._columnsViewEl.style["width"] = "auto";
						this._rowsViewEl.style["width"] = "auto";
						if (mini.isChrome || mini.isIE6) {
							this._filterViewEl.style["width"] = "100%";
							this._summaryViewEl.style["width"] = "100%";
							this._columnsViewEl.style["width"] = "100%";
							this._rowsViewEl.style["width"] = "100%"
						}
					},
					frozenColumns : function(A, B) {
						this.frozen(A, B)
					},
					unFrozenColumns : function() {
						this.unFrozen()
					},
					frozen : function(A, B) {
						this._doClearFrozen();
						this._columnModel.frozen(A, B)
					},
					unFrozen : function() {
						this._doClearFrozen();
						this._columnModel.unFrozen()
					},
					setFrozenStartColumn : function(A) {
						this._columnModel.setFrozenStartColumn(A)
					},
					setFrozenEndColumn : function(A) {
						return this._columnModel.setFrozenEndColumn(A)
					},
					getFrozenStartColumn : function(A) {
						return this._columnModel._frozenStartColumn
					},
					getFrozenEndColumn : function(A) {
						return this._columnModel._frozenEndColumn
					},
					getFrozenColumnsRow : function() {
						return this._columnModel.getFrozenColumnsRow()
					},
					getUnFrozenColumnsRow : function() {
						return this._columnModel.getUnFrozenColumnsRow()
					},
					getLockedWidth : function() {
						if (!this.isFrozen())
							return 0;
						var A = this._rowsLockContentEl.firstChild, B = A ? A.offsetWidth
								: 0;
						return B
					},
					_canDeferSyncScroll : function() {
						return this.isFrozen()
					},
					_syncScroll : function() {
						var A = this._rowsViewEl.scrollLeft;
						this._filterViewEl.scrollLeft = A;
						this._summaryViewEl.scrollLeft = A;
						this._columnsViewEl.scrollLeft = A;
						var B = this, C = B._rowsViewEl.scrollTop;
						B._rowsLockEl.scrollTop = C;
						if (this._canDeferSyncScroll())
							setTimeout(
									function() {
										B._rowsViewEl.scrollTop = B._rowsLockEl.scrollTop
									}, 50)
					},
					__OnMouseWheel : function(C) {
						var B = this.getScrollTop() - C.wheelDelta, A = this
								.getScrollTop();
						this.setScrollTop(B);
						if (A != this.getScrollTop())
							C.preventDefault()
					}
				});
mini.regClass(mini.FrozenGridView, "FrozenGridView");
mini.ScrollGridView = function() {
	mini.ScrollGridView.superclass.constructor.call(this)
};
mini
		.extend(
				mini.ScrollGridView,
				mini.FrozenGridView,
				{
					virtualScroll : true,
					virtualRows : 50,
					defaultRowHeight : 21,
					_canDeferSyncScroll : function() {
						return this.isFrozen() && !this.isVirtualScroll()
					},
					setVirtualScroll : function(A) {
						this.virtualScroll = A;
						this.doUpdate()
					},
					getVirtualScroll : function(A) {
						return this.virtualScroll
					},
					isFixedRowHeight : function() {
						return this.fixedRowHeight || this.isVirtualScroll()
								|| this.isFrozen()
					},
					isVirtualScroll : function() {
						if (this.virtualScroll)
							return this.isAutoHeight() == false
									&& this.isGrouping() == false;
						return false
					},
					_getScrollView : function() {
						var A = this.getVisibleRows();
						return A
					},
					_getScrollViewCount : function() {
						return this._getScrollView().length
					},
					_getScrollRowHeight : function(A) {
						return this.defaultRowHeight
					},
					_getRangeHeight : function(C, E) {
						var B = 0;
						for ( var A = C; A < E; A++) {
							var D = this._getScrollRowHeight(A);
							B += D
						}
						return B
					},
					_getIndexByScrollTop : function(F) {
						var B = 0, E = this._getScrollViewCount();
						for ( var A = 0, D = E; A < D; A++) {
							var C = this._getScrollRowHeight(A);
							B += C;
							if (B >= F)
								return A
						}
						return E
					},
					__getScrollViewRange : function(A, C) {
						var B = this._getScrollView();
						return B.getRange(A, C)
					},
					_getViewRegion : function() {
						var K = this._getScrollView();
						if (this.isVirtualScroll() == false) {
							var E = {
								top : 0,
								bottom : 0,
								rows : K,
								start : 0,
								end : 0
							};
							return E
						}
						var F = this.defaultRowHeight, M = this
								._getViewNowRegion(), I = this.getScrollTop(), A = this._vscrollEl.offsetHeight, N = this
								._getScrollViewCount(), C = M.start, D = M.end;
						for ( var J = 0, H = N; J < H; J += this.virtualRows) {
							var G = J + this.virtualRows;
							if (J <= C && C < G)
								C = J;
							if (J < D && D <= G)
								D = G
						}
						if (D > N)
							D = N;
						if (D == 0)
							D = this.virtualRows;
						var B = this._getRangeHeight(0, C), L = this
								._getRangeHeight(D, this._getScrollViewCount()), K = this
								.__getScrollViewRange(C, D), E = {
							top : B,
							bottom : L,
							rows : K,
							start : C,
							end : D,
							viewStart : C,
							viewEnd : D
						};
						E.viewTop = this._getRangeHeight(0, E.viewStart);
						E.viewBottom = this._getRangeHeight(E.viewEnd, this
								._getScrollViewCount());
						return E
					},
					_getViewNowRegion : function() {
						var D = this.defaultRowHeight, G = this.getScrollTop(), A = this._vscrollEl.offsetHeight, E = this
								._getIndexByScrollTop(G), B = this
								._getIndexByScrollTop(G + A + 30), F = this
								._getScrollViewCount();
						if (B > F)
							B = F;
						var C = {
							start : E,
							end : B
						};
						return C
					},
					_canVirtualUpdate : function() {
						if (!this._viewRegion)
							return true;
						var A = this._getViewNowRegion();
						if (this._viewRegion.start <= A.start
								&& A.end <= this._viewRegion.end)
							return false;
						return true
					},
					__OnColumnsChanged : function(A) {
						this._doUpdateFilterRow();
						this._doUpdateSummaryRow();
						this.doUpdateColumns();
						this.deferUpdate();
						if (this.isVirtualScroll())
							this.__OnVScroll();
						this.fire("columnschanged")
					},
					doLayout : function() {
						if (this.canLayout() == false)
							return;
						mini.ScrollGridView.superclass.doLayout.call(this);
						this._layoutScroll()
					},
					_createRowsHTML : function(E, G, H, C, I, L) {
						var M = this.isVirtualScroll();
						if (!M)
							return mini.ScrollGridView.superclass._createRowsHTML
									.apply(this, arguments);
						var D = M ? this._getViewRegion() : null, F = [ "<table class=\"mini-grid-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">" ];
						F.push(this._createTopRowHTML(E));
						if (this.isVirtualScroll()) {
							var J = C == 0 ? "display:none;" : "";
							F
									.push("<tr class=\"mini-grid-virtualscroll-top\" style=\"padding:0;border:0;"
											+ J
											+ "\"><td colspan=\""
											+ E.length
											+ "\" style=\"height:"
											+ C
											+ "px;padding:0;border:0;"
											+ J
											+ "\"></td></tr>")
						}
						if (G == 1 && this.isFrozen() == false)
							;
						else
							for ( var K = 0, B = H.length; K < B; K++) {
								var A = H[K];
								this._createRowHTML(A, L, E, G, F);
								L++
							}
						if (this.isVirtualScroll())
							F
									.push("<tr class=\"mini-grid-virtualscroll-bottom\" style=\"padding:0;border:0;\"><td colspan=\""
											+ E.length
											+ "\" style=\"height:"
											+ I
											+ "px;padding:0;border:0;\"></td></tr>");
						F.push("</table>");
						return F.join("")
					},
					doUpdateRows : function() {
						if (this.isVirtualScroll() == false) {
							mini.ScrollGridView.superclass.doUpdateRows
									.call(this);
							return
						}
						var G = this._getViewRegion();
						this._viewRegion = G;
						var E = this.getFrozenColumns(), J = this
								.getUnFrozenColumns(), I = G.viewStart, D = G.start, C = G.viewEnd;
						if (this._scrollPaging) {
							var B = this.getPageIndex() * this.getPageSize();
							I -= B;
							D -= B;
							C -= B
						}
						var H = new Date(), A = this._createRowsHTML(E, 1,
								G.rows, G.viewTop, G.viewBottom, I), F = this
								._createRowsHTML(J, 2, G.rows, G.viewTop,
										G.viewBottom, I);
						this._rowsLockContentEl.innerHTML = A;
						this._rowsViewContentEl.innerHTML = F
					},
					_create : function() {
						mini.ScrollGridView.superclass._create.call(this);
						this._vscrollEl = mini
								.append(
										this._rowsEl,
										"<div class=\"mini-grid-vscroll\"><div class=\"mini-grid-vscroll-content\"></div></div>");
						this._vscrollContentEl = this._vscrollEl.firstChild
					},
					_initEvents : function() {
						mini.ScrollGridView.superclass._initEvents.call(this);
						var A = this;
						mini.on(this._vscrollEl, "scroll", this.__OnVScroll,
								this);
						mini._onScrollDownUp(this._vscrollEl, function(B) {
							A._VScrollMouseDown = true
						}, function(B) {
							A._VScrollMouseDown = false
						})
					},
					_layoutScroll : function() {
						var C = this.isVirtualScroll();
						if (C) {
							var D = this.getScrollHeight(), A = D > this._rowsViewEl.offsetHeight;
							if (C && A) {
								this._vscrollEl.style.display = "block";
								this._vscrollContentEl.style.height = D + "px"
							} else
								this._vscrollEl.style.display = "none";
							if (this._rowsViewEl.scrollWidth > this._rowsViewEl.clientWidth + 1) {
								var B = this.getBodyHeight(true) - 18;
								this._vscrollEl.style.height = B + "px"
							} else
								this._vscrollEl.style.height = "100%"
						} else
							this._vscrollEl.style.display = "none"
					},
					getScrollHeight : function() {
						var A = this.getVisibleRows();
						return this._getRangeHeight(0, A.length)
					},
					setScrollTop : function(A) {
						if (this.isVirtualScroll())
							this._vscrollEl.scrollTop = A;
						else
							this._rowsViewEl.scrollTop = A
					},
					getScrollTop : function() {
						if (this.isVirtualScroll())
							return this._vscrollEl.scrollTop;
						else
							return this._rowsViewEl.scrollTop
					},
					__OnVScroll : function(C) {
						var B = this.isVirtualScroll();
						if (B) {
							this._scrollTop = this._vscrollEl.scrollTop;
							var A = this;
							setTimeout(function() {
								A._rowsViewEl.scrollTop = A._scrollTop;
								A.__scrollTimer = null
							}, 8);
							if (this._scrollTopTimer)
								clearTimeout(this._scrollTopTimer);
							this._scrollTopTimer = setTimeout(function() {
								A._scrollTopTimer = null;
								A._tryUpdateScroll();
								A._rowsViewEl.scrollTop = A._scrollTop
							}, 80)
						}
					},
					__OnMouseWheel : function(D) {
						var B = D.wheelDelta;
						if (!B)
							B = -D.detail * 24;
						var C = this.getScrollTop() - B, A = this
								.getScrollTop();
						this.setScrollTop(C);
						if (A != this.getScrollTop() || this.isVirtualScroll())
							D.preventDefault()
					},
					_tryUpdateScroll : function() {
						var A = this._canVirtualUpdate();
						if (A) {
							if (this._scrollPaging) {
								var C = this;
								this.reload(null, null, function(A) {
								})
							} else {
								var B = new Date();
								this.doUpdateRows()
							}
						}
					}
				});
mini.regClass(mini.ScrollGridView, "ScrollGridView");
mini._onScrollDownUp = function(A, D, C) {
	function F(A) {
		if (mini.isFirefox)
			mini.on(document, "mouseup", B);
		else
			mini.on(document, "mousemove", E);
		D(A)
	}
	function E(A) {
		mini.un(document, "mousemove", E);
		C(A)
	}
	function B(A) {
		mini.un(document, "mouseup", B);
		C(A)
	}
	mini.on(A, "mousedown", F)
};
mini._Grid_Select = function(A) {
	this.owner = A, el = A.el;
	A.on("rowmousemove", this.__OnRowMouseMove, this);
	mini.on(A._viewportEl, "mouseout", this.__OnMouseOut, this);
	mini.on(A._viewportEl, "mousewheel", this.__OnMouseWheel, this);
	A.on("cellmousedown", this.__OnCellMouseDown, this);
	A.on("cellclick", this.__OnGridCellClick, this);
	A.on("celldblclick", this.__OnGridCellClick, this);
	mini.on(A.el, "keydown", this.__OnGridKeyDown, this)
};
mini._Grid_Select.prototype = {
	__OnGridKeyDown : function(I) {
		var A = this.owner;
		if (mini.isAncestor(A._filterEl, I.target)
				|| mini.isAncestor(A._summaryEl, I.target)
				|| mini.isAncestor(A._toolbarEl, I.target)
				|| mini.isAncestor(A._footerEl, I.target)
				|| mini.findParent(I.target, "mini-grid-detailRow")
				|| mini.findParent(I.target, "mini-grid-rowEdit"))
			return;
		var C = A.getCurrentCell();
		if (I.shiftKey || I.ctrlKey)
			return;
		if (I.keyCode == 37 || I.keyCode == 38 || I.keyCode == 39
				|| I.keyCode == 40)
			I.preventDefault();
		var E = A.getVisibleColumns(), D = C ? C[1] : null, B = C ? C[0] : null;
		if (!C)
			B = A.getCurrent();
		var H = E.indexOf(D), F = A.indexOf(B), G = A.getData().length;
		switch (I.keyCode) {
		case 9:
			if (A.allowCellEdit && A.editOnTabKey) {
				I.preventDefault();
				A._beginEditNextCell(I.shiftKey == false);
				return
			}
			break;
		case 27:
			break;
		case 13:
			if (A.allowCellEdit && A.editNextOnEnterKey) {
				A._beginEditNextCell(I.shiftKey == false);
				return
			}
			if (A.allowCellEdit && C && !D.readOnly)
				A.beginEditCell();
			break;
		case 37:
			if (D) {
				if (H > 0)
					H -= 1
			} else
				H = 0;
			break;
		case 38:
			if (B) {
				if (F > 0)
					F -= 1
			} else
				F = 0;
			if (F != 0 && A.isVirtualScroll())
				if (A._viewRegion.start > F) {
					A._bodyEl.scrollTop -= A._rowHeight;
					A._tryUpdateScroll()
				}
			break;
		case 39:
			if (D) {
				if (H < E.length - 1)
					H += 1
			} else
				H = 0;
			break;
		case 40:
			if (B) {
				if (F < G - 1)
					F += 1
			} else
				F = 0;
			if (A.isVirtualScroll())
				if (A._viewRegion.end < F) {
					A._bodyEl.scrollTop += A._rowHeight;
					A._tryUpdateScroll()
				}
			break;
		default:
			break
		}
		D = E[H];
		B = A.getAt(F);
		if (D && B && A.allowCellSelect) {
			C = [ B, D ];
			A.setCurrentCell(C);
			A.scrollIntoView(B, D)
		}
		if (B && A.allowRowSelect) {
			A.deselectAll();
			A.setCurrent(B);
			if (B)
				A.scrollIntoView(B)
		}
	},
	__OnMouseWheel : function(B) {
		var A = this.owner;
		if (A.allowCellEdit)
			A.commitEdit()
	},
	__OnGridCellClick : function(D) {
		var A = this.owner;
		if (A.allowCellEdit == false)
			return;
		if (A.cellEditAction != D.type)
			return;
		var B = D.record, C = D.column;
		if (!C.readOnly && !A.isReadOnly())
			if (D.htmlEvent.shiftKey || D.htmlEvent.ctrlKey)
				;
			else
				A.beginEditCell()
	},
	__OnCellMouseDown : function(B) {
		var A = this;
		setTimeout(function() {
			A.__doSelect(B)
		}, 1)
	},
	__OnRowMouseMove : function(C) {
		var A = this.owner, B = C.record;
		if (!A.enabled || A.enableHotTrack == false)
			return;
		A.focusRow(B)
	},
	__OnMouseOut : function(A) {
		this.owner.focusRow(null)
	},
	__doSelect : function(G) {
		var B = G.record, E = G.column, A = this.owner;
		if (A.allowCellSelect) {
			var D = [ B, E ];
			A.setCurrentCell(D)
		}
		if (A.allowRowSelect) {
			var F = {
				record : B,
				selected : B,
				cancel : false
			};
			if (B)
				A.fire("beforerowselect", F);
			if (F.cancel)
				return;
			if (A.getMultiSelect()) {
				A.el.onselectstart = function() {
				};
				if (G.htmlEvent.shiftKey) {
					A.el.onselectstart = function() {
						return false
					};
					G.htmlEvent.preventDefault();
					var C = A.getCurrent();
					if (C) {
						A.deselectAll();
						A.selectRange(C, B);
						A.setCurrent(C)
					} else {
						A.select(B);
						A.setCurrent(B)
					}
				} else {
					A.el.onselectstart = function() {
					};
					if (G.htmlEvent.ctrlKey) {
						A.el.onselectstart = function() {
							return false
						};
						G.htmlEvent.preventDefault()
					}
					if (G.column._multiRowSelect === true
							|| G.htmlEvent.ctrlKey || A.allowUnselect) {
						if (A.isSelected(B))
							A.deselect(B);
						else {
							A.select(B);
							A.setCurrent(B)
						}
					} else if (A.isSelected(B))
						;
					else {
						A.deselectAll();
						A.select(B);
						A.setCurrent(B)
					}
				}
			} else if (!A.isSelected(B)) {
				A.deselectAll();
				A.select(B)
			} else if (G.htmlEvent.ctrlKey || A.allowUnselect)
				A.deselectAll()
		}
	}
};
mini._Grid_RowGroup = function(A) {
	this.owner = A, el = A.el;
	mini.on(A._bodyEl, "click", this.__OnClick, this)
};
mini._Grid_RowGroup.prototype = {
	__OnClick : function(C) {
		var A = this.owner, B = A._getRowGroupByEvent(C);
		if (B)
			A.toggleRowGroup(B)
	}
};
mini._Grid_ColumnsMenu = function(A) {
	this.owner = A;
	this.menu = this.createMenu();
	mini.on(A.el, "contextmenu", this.__OnContextMenu, this)
};
mini._Grid_ColumnsMenu.prototype = {
	createMenu : function() {
		var A = mini.create( {
			type : "menu",
			hideOnClick : false
		});
		A.on("itemclick", this.__OnItemClick, this);
		return A
	},
	updateMenu : function() {
		var B = this.owner, H = this.menu, F = B.getBottomColumns(), D = [];
		for ( var C = 0, G = F.length; C < G; C++) {
			var E = F[C], A = {};
			A.checked = E.visible;
			A.checkOnClick = true;
			A.text = B._createHeaderText(E);
			if (A.text == "&nbsp;") {
				if (E.type == "indexcolumn")
					A.text = "\u5e8f\u53f7";
				if (E.type == "checkcolumn")
					A.text = "\u9009\u62e9"
			}
			D.push(A);
			A._column = E
		}
		H.setItems(D)
	},
	__OnContextMenu : function(B) {
		var A = this.owner;
		if (A.showColumnsMenu == false)
			return;
		if (mini.isAncestor(A._columnsEl, B.target) == false)
			return;
		this.updateMenu();
		this.menu.showAtPos(B.pageX, B.pageY);
		return false
	},
	__OnItemClick : function(L) {
		var E = this.owner, K = this.menu, C = E.getBottomColumns(), G = K
				.getItems(), A = L.item, B = A._column, J = 0;
		for ( var F = 0, D = G.length; F < D; F++) {
			var H = G[F];
			if (H.getChecked())
				J++
		}
		if (J < 1)
			A.setChecked(true);
		var I = A.getChecked();
		if (I)
			E.showColumn(B);
		else
			E.hideColumn(B)
	}
};
mini._Grid_CellToolTip = function(A) {
	this.owner = A;
	mini.on(this.owner._bodyEl, "mousemove", this.__OnGridMouseMove, this)
};
mini._Grid_CellToolTip.prototype = {
	__OnGridMouseMove : function(F) {
		var A = this.owner, C = A._getCellByEvent(F), B = A._getCellEl(C[0],
				C[1]), D = A.getCellError(C[0], C[1]);
		if (B) {
			if (D) {
				B.title = D.errorText;
				return
			}
			if (B.firstChild)
				if (mini.hasClass(B.firstChild, "mini-grid-cell-inner"))
					B = B.firstChild;
			if (B.scrollWidth > B.clientWidth) {
				var E = B.innerText || B.textContent || "";
				B.title = E.trim()
			} else
				B.title = ""
		}
	}
};
mini._Grid_Sorter = function(A) {
	this.owner = A;
	this.owner.on("headercellclick", this.__OnGridHeaderCellClick, this);
	mini.on(A._headerEl, "mousemove", this.__OnGridHeaderMouseMove, this);
	mini.on(A._headerEl, "mouseout", this.__OnGridHeaderMouseOut, this)
};
mini._Grid_Sorter.prototype = {
	__OnGridHeaderMouseOut : function(A) {
		if (this._focusedColumnEl)
			mini.removeClass(this._focusedColumnEl,
					"mini-grid-headerCell-hover")
	},
	__OnGridHeaderMouseMove : function(B) {
		var A = mini.findParent(B.target, "mini-grid-headerCell");
		if (A) {
			mini.addClass(A, "mini-grid-headerCell-hover");
			this._focusedColumnEl = A
		}
	},
	__OnGridHeaderCellClick : function(D) {
		var A = this.owner;
		if (!mini.hasClass(D.htmlEvent.target, "mini-grid-column-splitter"))
			if (A.allowSortColumn && A.isEditing() == false) {
				var B = D.column;
				if (!B.columns || B.columns.length == 0)
					if (B.field && B.allowSort !== false) {
						var C = "asc";
						if (A.getSortField() == B.field)
							C = A.getSortOrder() == "asc" ? "desc" : "asc";
						A.sortBy(B.field, C)
					}
			}
	}
};
mini._Grid_ColumnMove = function(A) {
	this.owner = A;
	mini.on(this.owner.el, "mousedown", this.__onGridMouseDown, this)
};
mini._Grid_ColumnMove.prototype = {
	__onGridMouseDown : function(D) {
		var A = this.owner;
		if (A.isEditing())
			return;
		if (mini.hasClass(D.target, "mini-grid-column-splitter"))
			return;
		if (D.button == mini.MouseButton.Right)
			return;
		var C = mini.findParent(D.target, A._headerCellCls);
		if (C) {
			this._remove();
			var B = A._getColumnByEvent(D);
			if (A.allowMoveColumn && B && B.allowMove) {
				this.dragColumn = B;
				this._columnEl = C;
				this.getDrag().start(D)
			}
		}
	},
	getDrag : function() {
		if (!this.drag)
			this.drag = new mini.Drag( {
				capture : false,
				onStart : mini.createDelegate(this._OnDragStart, this),
				onMove : mini.createDelegate(this._OnDragMove, this),
				onStop : mini.createDelegate(this._OnDragStop, this)
			});
		return this.drag
	},
	_OnDragStart : function(B) {
		function C(B) {
			var C = B.header;
			if (typeof C == "function")
				C = C.call(A, B);
			if (mini.isNull(C) || C === "")
				C = "&nbsp;";
			return C
		}
		var A = this.owner;
		this._dragProxy = mini.append(document.body,
				"<div class=\"mini-grid-columnproxy\"></div>");
		this._dragProxy.innerHTML = "<div class=\"mini-grid-columnproxy-inner\" style=\"height:26px;\">"
				+ C(this.dragColumn) + "</div>";
		mini.setXY(this._dragProxy, B.now[0] + 15, B.now[1] + 18);
		mini.addClass(this._dragProxy, "mini-grid-no");
		this.moveTop = mini.append(document.body,
				"<div class=\"mini-grid-movetop\"></div>");
		this.moveBottom = mini.append(document.body,
				"<div class=\"mini-grid-movebottom\"></div>")
	},
	_OnDragMove : function(C) {
		var A = this.owner, I = C.now[0];
		mini.setXY(this._dragProxy, I + 15, C.now[1] + 18);
		this.targetColumn = this.insertAction = null;
		var F = mini.findParent(C.event.target, A._headerCellCls);
		if (F) {
			var E = A._getColumnByEvent(C.event);
			if (E && E != this.dragColumn) {
				var B = A.getParentColumn(this.dragColumn), G = A
						.getParentColumn(E);
				if (B == G) {
					this.targetColumn = E;
					this.insertAction = "before";
					var H = A.getColumnBox(this.targetColumn);
					if (I > H.x + H.width / 2)
						this.insertAction = "after"
				}
			}
		}
		if (this.targetColumn) {
			mini.addClass(this._dragProxy, "mini-grid-ok");
			mini.removeClass(this._dragProxy, "mini-grid-no");
			var D = A.getColumnBox(this.targetColumn);
			this.moveTop.style.display = "block";
			this.moveBottom.style.display = "block";
			if (this.insertAction == "before") {
				mini.setXY(this.moveTop, D.x - 4, D.y - 9);
				mini.setXY(this.moveBottom, D.x - 4, D.bottom)
			} else {
				mini.setXY(this.moveTop, D.right - 4, D.y - 9);
				mini.setXY(this.moveBottom, D.right - 4, D.bottom)
			}
		} else {
			mini.removeClass(this._dragProxy, "mini-grid-ok");
			mini.addClass(this._dragProxy, "mini-grid-no");
			this.moveTop.style.display = "none";
			this.moveBottom.style.display = "none"
		}
	},
	_remove : function() {
		var A = this.owner;
		mini.removeNode(this._dragProxy);
		mini.removeNode(this.moveTop);
		mini.removeNode(this.moveBottom);
		this._dragProxy = this.moveTop = this.moveBottom = this.dragColumn = this.targetColumn = null
	},
	_OnDragStop : function(B) {
		var A = this.owner;
		A.moveColumn(this.dragColumn, this.targetColumn, this.insertAction);
		this._remove()
	}
};
mini._Grid_ColumnSplitter = function(A) {
	this.owner = A;
	mini.on(A.el, "mousedown", this.__OnMouseDown, this)
};
mini._Grid_ColumnSplitter.prototype = {
	__OnMouseDown : function(D) {
		var A = this.owner, C = D.target;
		if (mini.hasClass(C, "mini-grid-column-splitter")) {
			var B = A._getColumnById(C.id);
			if (A.allowResizeColumn && B && B.allowResize) {
				this.splitterColumn = B;
				this.getDrag().start(D)
			}
		}
	},
	getDrag : function() {
		if (!this.drag)
			this.drag = new mini.Drag( {
				capture : true,
				onStart : mini.createDelegate(this._OnDragStart, this),
				onMove : mini.createDelegate(this._OnDragMove, this),
				onStop : mini.createDelegate(this._OnDragStop, this)
			});
		return this.drag
	},
	_OnDragStart : function(B) {
		var A = this.owner, D = A.getColumnBox(this.splitterColumn);
		this.columnBox = D;
		this._dragProxy = mini.append(document.body,
				"<div class=\"mini-grid-proxy\"></div>");
		var C = A.getGridViewBox();
		C.x = D.x;
		C.width = D.width;
		C.right = D.right;
		mini.setBox(this._dragProxy, C)
	},
	_OnDragMove : function(C) {
		var A = this.owner, D = mini.copyTo( {}, this.columnBox), B = D.width
				+ (C.now[0] - C.init[0]);
		if (B < A.columnMinWidth)
			B = A.columnMinWidth;
		if (B > A.columnMaxWidth)
			B = A.columnMaxWidth;
		mini.setWidth(this._dragProxy, B)
	},
	_OnDragStop : function(G) {
		var A = this.owner, H = mini.getBox(this._dragProxy), F = this, E = A.allowSortColumn;
		A.allowSortColumn = false;
		setTimeout(function() {
			jQuery(F._dragProxy).remove();
			F._dragProxy = null;
			A.allowSortColumn = E
		}, 10);
		var I = this.splitterColumn, B = parseInt(I.width);
		if (B + "%" != I.width) {
			var C = A.getColumnWidth(I), D = parseInt(B / C * H.width);
			A.setColumnWidth(I, D)
		}
	}
};
mini._Grid_DragDrop = function(A) {
	this.owner = A;
	this.owner.on("CellMouseDown", this.__OnGridCellMouseDown, this)
};
mini._Grid_DragDrop.prototype = {
	__OnGridCellMouseDown : function(D) {
		if (D.htmlEvent.button == mini.MouseButton.Right)
			return;
		var A = this.owner;
		this.dropObj = A;
		if (A.isReadOnly() || A.isAllowDrag(D.record, D.column) == false)
			return;
		var B = D.record;
		this.isTree = !!A.isTree;
		this.beginRecord = B;
		var C = this._getDrag();
		C.start(D.htmlEvent)
	},
	_OnDragStart : function(C) {
		var A = this.owner;
		A._dragging = true;
		var B = this.beginRecord;
		this.dragData = A._getDragData();
		if (this.dragData.indexOf(B) == -1)
			this.dragData.push(B);
		this.feedbackEl = mini.append(document.body,
				"<div class=\"mini-feedback\"></div>");
		this.feedbackEl.innerHTML = A._getDragText(this.dragData);
		this.lastFeedbackClass = "";
		this._enableHotTrack = A.getEnableHotTrack();
		A.setEnableHotTrack(false)
	},
	_getDropTargetObj : function(B) {
		var A = mini.findParent(B.target, "mini-grid", 500);
		if (A)
			return mini.get(A)
	},
	_OnDragMove : function(B) {
		var A = this.owner, F = this._getDropTargetObj(B.event);
		this.dropObj = F;
		var E = B.now[0], D = B.now[1];
		mini.setXY(this.feedbackEl, E + 15, D + 18);
		if (F) {
			this.isTree = F.isTree;
			var C = F._getRecordByEvent(B.event);
			this.dropRecord = C;
			if (C) {
				if (this.isTree)
					this.dragAction = this.getFeedback(C, D, 3);
				else
					this.dragAction = this.getFeedback(C, D, 2)
			} else
				this.dragAction = "no"
		} else
			this.dragAction = "no";
		this.lastFeedbackClass = "mini-feedback-" + this.dragAction;
		this.feedbackEl.className = "mini-feedback " + this.lastFeedbackClass;
		if (this.dragAction == "no")
			C = null;
		this.setRowFeedback(C, this.dragAction)
	},
	_OnDragStop : function(D) {
		var J = this.owner, I = this.dropObj;
		J._dragging = false;
		mini.removeNode(this.feedbackEl);
		J.setEnableHotTrack(this._enableHotTrack);
		this.feedbackEl = null;
		this.setRowFeedback(null);
		if (this.isTree) {
			var L = [];
			for ( var K = 0, H = this.dragData.length; K < H; K++) {
				var N = this.dragData[K], E = false;
				for ( var M = 0, C = this.dragData.length; M < C; M++) {
					var G = this.dragData[M];
					if (G != N) {
						E = J.isAncestor(G, N);
						if (E)
							break
					}
				}
				if (!E)
					L.push(N)
			}
			this.dragData = L
		}
		if (this.dropRecord && I && this.dragAction != "no") {
			var O = J._OnDragDrop(this.dragData, this.dropRecord,
					this.dragAction);
			if (!O.cancel) {
				var L = O.dragNodes, F = O.targetNode, B = O.action;
				if (I.isTree) {
					if (J == I)
						I.moveNodes(L, F, B);
					else {
						J.removeNodes(L);
						I.addNodes(L, F, B)
					}
				} else {
					var A = I.indexOf(F);
					if (B == "after")
						A += 1;
					I.moveRow(L, A)
				}
				O = {
					dragNode : O.dragNodes[0],
					dropNode : O.targetNode,
					dragAction : O.action,
					dragNodes : O.dragNodes,
					targetNode : O.targetNode
				};
				I.fire("drop", O)
			}
		}
		this.dropRecord = null;
		this.dragData = null
	},
	setRowFeedback : function(B, H) {
		var A = this.owner, G = this.dropObj;
		if (this.lastAddDomRow && G)
			G.removeRowCls(this.lastAddDomRow, "mini-tree-feedback-add");
		if (B == null || this.dragAction == "add") {
			mini.removeNode(this.feedbackLine);
			this.feedbackLine = null
		}
		this.lastRowFeedback = B;
		if (B != null)
			if (H == "before" || H == "after") {
				if (!this.feedbackLine)
					this.feedbackLine = mini.append(document.body,
							"<div class='mini-feedback-line'></div>");
				this.feedbackLine.style.display = "block";
				var E = G.getRowBox(B), F = E.x, D = E.y - 1;
				if (H == "after")
					D += E.height;
				mini.setXY(this.feedbackLine, F, D);
				var C = G.getBox(true);
				mini.setWidth(this.feedbackLine, C.width)
			} else {
				G.addRowCls(B, "mini-tree-feedback-add");
				this.lastAddDomRow = B
			}
	},
	getFeedback : function(M, K, H) {
		var F = this.owner, E = this.dropObj, L = E.getRowBox(M), A = L.height, J = K
				- L.y, I = null;
		if (this.dragData.indexOf(M) != -1)
			return "no";
		var C = false;
		if (H == 3) {
			C = E.isLeaf(M);
			for ( var G = 0, D = this.dragData.length; G < D; G++) {
				var N = this.dragData[G], B = E.isAncestor(N, M);
				if (B) {
					I = "no";
					break
				}
			}
		}
		if (I == null)
			if (H == 2) {
				if (J > A / 2)
					I = "after";
				else
					I = "before"
			} else if (C && E.allowLeafDropIn === false) {
				if (J > A / 2)
					I = "after";
				else
					I = "before"
			} else if (J > (A / 3) * 2)
				I = "after";
			else if (A / 3 <= J && J <= (A / 3 * 2))
				I = "add";
			else
				I = "before";
		var O = E._OnGiveFeedback(I, this.dragData, M);
		return O.effect
	},
	_getDrag : function() {
		if (!this.drag)
			this.drag = new mini.Drag( {
				onStart : mini.createDelegate(this._OnDragStart, this),
				onMove : mini.createDelegate(this._OnDragMove, this),
				onStop : mini.createDelegate(this._OnDragStop, this)
			});
		return this.drag
	}
};
mini._Grid_Events = function(A) {
	this.owner = A, el = A.el;
	mini.on(el, "click", this.__OnClick, this);
	mini.on(el, "dblclick", this.__OnDblClick, this);
	mini.on(el, "mousedown", this.__OnMouseDown, this);
	mini.on(el, "mouseup", this.__OnMouseUp, this);
	mini.on(el, "mousemove", this.__OnMouseMove, this);
	mini.on(el, "mouseover", this.__OnMouseOver, this);
	mini.on(el, "mouseout", this.__OnMouseOut, this);
	mini.on(el, "keydown", this.__OnKeyDown, this);
	mini.on(el, "keyup", this.__OnKeyUp, this);
	mini.on(el, "contextmenu", this.__OnContextMenu, this)
};
mini._Grid_Events.prototype = {
	__OnClick : function(A) {
		this._fireEvent(A, "Click")
	},
	__OnDblClick : function(A) {
		this._fireEvent(A, "Dblclick")
	},
	__OnMouseDown : function(A) {
		this._fireEvent(A, "MouseDown")
	},
	__OnMouseUp : function(A) {
		this._fireEvent(A, "MouseUp")
	},
	__OnMouseMove : function(A) {
		this._fireEvent(A, "MouseMove")
	},
	__OnMouseOver : function(A) {
		this._fireEvent(A, "MouseOver")
	},
	__OnMouseOut : function(A) {
		this._fireEvent(A, "MouseOut")
	},
	__OnKeyDown : function(A) {
		this._fireEvent(A, "KeyDown")
	},
	__OnKeyUp : function(A) {
		this._fireEvent(A, "KeyUp")
	},
	__OnContextMenu : function(A) {
		this._fireEvent(A, "ContextMenu")
	},
	_fireEvent : function(I, G) {
		var A = this.owner, F = A._getCellByEvent(I), C = F[0], E = F[1];
		if (C) {
			var D = {
				record : C,
				row : C,
				htmlEvent : I
			}, H = A["_OnRow" + G];
			if (H)
				H.call(A, D);
			else
				A.fire("row" + G, D)
		}
		if (E) {
			D = {
				column : E,
				field : E.field,
				htmlEvent : I
			}, H = A["_OnColumn" + G];
			if (H)
				H.call(A, D);
			else
				A.fire("column" + G, D)
		}
		if (C && E) {
			D = {
				sender : A,
				record : C,
				row : C,
				column : E,
				field : E.field,
				htmlEvent : I
			}, H = A["_OnCell" + G];
			if (H)
				H.call(A, D);
			else
				A.fire("cell" + G, D);
			if (E["onCell" + G])
				E["onCell" + G].call(E, D)
		}
		if (!C && E) {
			D = {
				column : E,
				htmlEvent : I
			}, H = A["_OnHeaderCell" + G];
			if (H)
				H.call(A, D);
			else {
				var B = "onheadercell" + G.toLowerCase();
				if (E[B]) {
					D.sender = A;
					E[B](D)
				}
				A.fire("headercell" + G, D)
			}
		}
	}
};
mini.DataGrid = function(A) {
	mini.DataGrid.superclass.constructor.call(this, A);
	this._DragDrop = new mini._Grid_DragDrop(this);
	this._Events = new mini._Grid_Events(this);
	this._Select = new mini._Grid_Select(this);
	this._RowGroup = new mini._Grid_RowGroup(this);
	this._Splitter = new mini._Grid_ColumnSplitter(this);
	this._ColumnMove = new mini._Grid_ColumnMove(this);
	this._Sorter = new mini._Grid_Sorter(this);
	this._CellToolTip = new mini._Grid_CellToolTip(this);
	this._ColumnsMenu = new mini._Grid_ColumnsMenu(this);
	this._createPagers()
};
mini
		.extend(
				mini.DataGrid,
				mini.ScrollGridView,
				{
					uiCls : "mini-datagrid",
					selectOnLoad : false,
					showHeader : false,
					showPager : true,
					allowUnselect : false,
					allowRowSelect : true,
					allowCellSelect : false,
					allowCellEdit : false,
					cellEditAction : "cellclick",
					allowCellValid : false,
					allowResizeColumn : true,
					allowSortColumn : true,
					allowMoveColumn : true,
					showColumnsMenu : false,
					virtualScroll : false,
					enableHotTrack : true,
					showLoading : true,
					set : function(C) {
						if (typeof C == "string")
							return this;
						var A = C.value;
						delete C.value;
						var D = C.url;
						delete C.url;
						var B = C.data;
						delete C.data;
						var E = C.columns;
						delete C.columns;
						if (!mini.isNull(E))
							this.setColumns(E);
						mini.DataGrid.superclass.set.call(this, C);
						if (!mini.isNull(B))
							this.setData(B);
						if (!mini.isNull(D))
							this.setUrl(D);
						if (!mini.isNull(A))
							this.setValue(A);
						return this
					},
					_OnDrawCell : function() {
						var B = mini.DataGrid.superclass._OnDrawCell.apply(
								this, arguments), A = this.getCellError(
								B.record, B.column);
						if (A) {
							if (!B.cellCls)
								B.cellCls = "";
							B.cellCls += " mini-grid-cell-error "
						}
						return B
					},
					_bindSource : function() {
						var A = this._dataSource;
						A.on("beforeload", this.__OnSourceBeforeLoad, this);
						A.on("preload", this.__OnSourcePreLoad, this);
						A.on("load", this.__OnSourceLoadSuccess, this);
						A.on("loaderror", this.__OnSourceLoadError, this);
						A.on("loaddata", this.__OnSourceLoadData, this);
						A.on("cleardata", this.__OnSourceClearData, this);
						A.on("sort", this.__OnSourceSort, this);
						A.on("filter", this.__OnSourceFilter, this);
						A.on("pageinfochanged", this.__OnPageInfoChanged, this);
						A.on("selectionchanged", this.__OnSelectionChanged,
								this);
						A.on("currentchanged", function(A) {
							this.fire("currentchanged", A)
						}, this);
						A.on("add", this.__OnSourceAdd, this);
						A.on("update", this.__OnSourceUpdate, this);
						A.on("remove", this.__OnSourceRemove, this);
						A.on("move", this.__OnSourceMove, this);
						A.on("beforeadd", function(A) {
							this.fire("beforeaddrow", A)
						}, this);
						A.on("beforeupdate", function(A) {
							this.fire("beforeupdaterow", A)
						}, this);
						A.on("beforeremove", function(A) {
							this.fire("beforeremoverow", A)
						}, this);
						A.on("beforemove", function(A) {
							this.fire("beforemoverow", A)
						}, this)
					},
					_initData : function() {
						this._mergedCellMaps = {};
						this._mergedCells = {};
						this._cellErrors = [];
						this._cellMapErrors = {}
					},
					__OnSourceBeforeLoad : function(A) {
						if (this.showLoading)
							this.loading();
						this.fire("beforeload", A)
					},
					__OnSourcePreLoad : function(A) {
						this.fire("preload", A)
					},
					__OnSourceLoadSuccess : function(A) {
						if (this.isGrouping())
							this.groupBy(this._groupField, this._groupDir);
						this.fire("load", A);
						this.unmask()
					},
					__OnSourceLoadError : function(A) {
						this.fire("loaderror", A);
						this.unmask()
					},
					__OnSourceSort : function(A) {
						this.deferUpdate();
						this.fire("sort", A)
					},
					__OnSourceFilter : function(A) {
						this.deferUpdate();
						this.fire("filter", A)
					},
					__OnSourceAdd : function(A) {
						this._doAddRowEl(A.record);
						this._doUpdateSummaryRow();
						this.fire("addrow", A)
					},
					__OnSourceUpdate : function(A) {
						this._doUpdateRowEl(A.record);
						this._doUpdateSummaryRow();
						this.fire("updaterow", A)
					},
					__OnSourceRemove : function(A) {
						this._doRemoveRowEl(A.record);
						this._doUpdateSummaryRow();
						this.fire("removerow", A);
						if (this.isVirtualScroll())
							this.deferUpdate()
					},
					__OnSourceMove : function(A) {
						this._doMoveRowEl(A.record, A.index);
						this._doUpdateSummaryRow();
						this.fire("moverow", A)
					},
					__OnSelectionChanged : function(C) {
						if (C.select)
							this.fire("rowselect", C);
						else
							this.fire("rowdeselect", C);
						var B = this;
						if (this._selectionTimer) {
							clearTimeout(this._selectionTimer);
							this._selectionTimer = null
						}
						this._selectionTimer = setTimeout(function() {
							B._selectionTimer = null;
							B.fire("SelectionChanged", C)
						}, 1);
						var A = new Date();
						this._doRowSelect(C._records, C.select)
					},
					__OnPageInfoChanged : function(A) {
						this._updatePagesInfo()
					},
					_updatePagesInfo : function() {
						var D = this.getPageIndex(), F = this.getPageSize(), E = this
								.getTotalCount(), H = this.getTotalPage(), B = this._pagers;
						for ( var C = 0, G = B.length; C < G; C++) {
							var A = B[C];
							A.update(D, F, E)
						}
					},
					setPager : function(A) {
						if (typeof A == "string") {
							var B = mini.byId(A);
							if (!B)
								return;
							mini.parse(A);
							A = mini.get(A)
						}
						if (A)
							this.bindPager(A)
					},
					bindPager : function(A) {
						if (!A)
							return;
						this.unbindPager(A);
						this._pagers.add(A);
						A.on("pagechanged", this.__OnPageChanged, this)
					},
					unbindPager : function(A) {
						if (!A)
							return;
						this._pagers.remove(A);
						A.un("pagechanged", this.__OnPageChanged, this)
					},
					__OnPageChanged : function(A) {
						this.gotoPage(A.pageIndex, A.pageSize)
					},
					_canUpdateRowEl : true,
					_doUpdateRowEl : function(C) {
						var B = this.getFrozenColumns(), F = this
								.getUnFrozenColumns(), D = this.indexOf(C), E = this
								._createRowHTML(C, D, F, 2), A = this
								._getRowEl(C, 2);
						jQuery(A).before(E);
						A.parentNode.removeChild(A);
						if (this.isFrozen()) {
							E = this._createRowHTML(C, D, B, 1), A = this
									._getRowEl(C, 1);
							jQuery(A).before(E);
							A.parentNode.removeChild(A)
						}
						this.deferLayout()
					},
					_doAddRowEl : function(C) {
						var B = this.getFrozenColumns(), H = this
								.getUnFrozenColumns(), G = this._rowsLockContentEl.firstChild, D = this._rowsViewContentEl.firstChild, F = this
								.indexOf(C), E = this.getAt(F + 1);
						function A(B, D, G, A) {
							var H = this._createRowHTML(B, F, G, D);
							if (E) {
								var C = this._getRowEl(E, D);
								jQuery(C).before(H)
							} else
								mini.append(A, H)
						}
						A.call(this, C, 2, H, D);
						if (this.isFrozen())
							A.call(this, C, 1, B, G);
						this.deferLayout()
					},
					_doRemoveRowEl : function(B) {
						var A = this._getRowEl(B, 1), C = this._getRowEl(B, 2);
						if (A)
							A.parentNode.removeChild(A);
						if (C)
							C.parentNode.removeChild(C);
						this.deferLayout()
					},
					_doMoveRowEl : function(B, A) {
						this._doRemoveRowEl(B);
						this._doAddRowEl(B)
					},
					_getRowGroupEl : function(B, A) {
						var D = this._createRowGroupId(B, A), C = mini.byId(D,
								this.el);
						return C
					},
					_getRowGroupRowsEl : function(B, A) {
						var D = this._createRowGroupRowsId(B, A), C = mini
								.byId(D, this.el);
						return C
					},
					_getRowEl : function(B, A) {
						B = this.getRecord(B);
						var D = this._createRowId(B, A), C = mini.byId(D,
								this.el);
						return C
					},
					_getHeaderCellEl : function(C, A) {
						C = this.getColumn(C);
						var D = this._createHeaderCellId(C, A), B = mini.byId(
								D, this.el);
						return B
					},
					_getCellEl : function(A, C) {
						A = this.getRecord(A);
						C = this.getColumn(C);
						if (!A || !C)
							return null;
						var D = this._createCellId(A, C), B = mini.byId(D,
								this.el);
						return B
					},
					_getRecordByEvent : function(D) {
						var C = mini.findParent(D.target, this._rowCls);
						if (!C)
							return null;
						var A = C.id.split("$"), B = A[A.length - 1];
						return this._getRowByID(B)
					},
					_getColumnByEvent : function(D) {
						var B = mini.findParent(D.target, this._cellCls);
						if (!B)
							B = mini.findParent(D.target, this._headerCellCls);
						if (B) {
							var A = B.id.split("$"), C = A[A.length - 1];
							return this._getColumnById(C)
						}
						return null
					},
					_getCellByEvent : function(C) {
						var A = this._getRecordByEvent(C), B = this
								._getColumnByEvent(C);
						return [ A, B ]
					},
					_getRowByID : function(A) {
						return this._dataSource.getby_id(A)
					},
					_getColumnById : function(A) {
						return this._columnModel._getColumnById(A)
					},
					addRowCls : function(A, C) {
						var B = this._getRowEl(A, 1), D = this._getRowEl(A, 2);
						if (B)
							mini.addClass(B, C);
						if (D)
							mini.addClass(D, C)
					},
					removeRowCls : function(A, C) {
						var B = this._getRowEl(A, 1), D = this._getRowEl(A, 2);
						if (B)
							mini.removeClass(B, C);
						if (D)
							mini.removeClass(D, C)
					},
					getCellBox : function(B, C) {
						B = this.getRow(B);
						C = this.getColumn(C);
						if (!B || !C)
							return null;
						var A = this._getCellEl(B, C);
						if (!A)
							return null;
						return mini.getBox(A)
					},
					getColumnBox : function(C) {
						var D = this._createHeaderCellId(C, 2), B = document
								.getElementById(D);
						if (!B) {
							D = this._createHeaderCellId(C, 1);
							B = document.getElementById(D)
						}
						if (B) {
							var A = mini.getBox(B);
							A.x -= 1;
							A.left = A.x;
							A.right = A.x + A.width;
							return A
						}
					},
					getRowBox : function(B) {
						var A = this._getRowEl(B, 1), C = this._getRowEl(B, 2);
						if (!C)
							return null;
						var D = mini.getBox(C);
						if (A) {
							var E = mini.getBox(A);
							D.x = D.left = E.left;
							D.width = D.right - D.x
						}
						return D
					},
					_doRowSelect : function(C, F) {
						var D = new Date();
						for ( var B = 0, E = C.length; B < E; B++) {
							var A = C[B];
							if (F)
								this.addRowCls(A, this._rowSelectedCls);
							else
								this.removeRowCls(A, this._rowSelectedCls)
						}
					},
					focusRow : function(A) {
						if (this._focusRow == A)
							return;
						if (this._focusRow)
							this
									.removeRowCls(this._focusRow,
											this._rowHoverCls);
						this._focusRow = A;
						if (A)
							this.addRowCls(A, this._rowHoverCls)
					},
					scrollIntoView : function(C, D) {
						try {
							if (D) {
								var B = this._getCellEl(C, D);
								mini.scrollIntoView(B, this._rowsViewEl, true)
							} else {
								var A = this._getRowEl(C, 2);
								mini.scrollIntoView(A, this._rowsViewEl, false)
							}
						} catch (E) {
						}
					},
					setShowLoading : function(A) {
						this.showLoading = A
					},
					getShowLoading : function() {
						return this.showLoading
					},
					setEnableHotTrack : function(A) {
						this.enableHotTrack = A
					},
					getEnableHotTrack : function() {
						return this.enableHotTrack
					},
					setAllowUnselect : function(A) {
						this.allowUnselect = A
					},
					getAllowUnselect : function() {
						return this.allowUnselect
					},
					setAllowRowSelect : function(A) {
						this.allowRowSelect = A
					},
					getAllowRowSelect : function() {
						return this.allowRowSelect
					},
					setAllowCellSelect : function(A) {
						this.allowCellSelect = A
					},
					getAllowCellSelect : function() {
						return this.allowCellSelect
					},
					setAllowCellEdit : function(A) {
						this.allowCellEdit = A
					},
					getAllowCellEdit : function() {
						return this.allowCellEdit
					},
					setCellEditAction : function(A) {
						this.cellEditAction = A
					},
					getCellEditAction : function() {
						return this.cellEditAction
					},
					setAllowCellValid : function(A) {
						this.allowCellValid = A
					},
					getAllowCellValid : function() {
						return this.allowCellValid
					},
					setAllowResizeColumn : function(A) {
						this.allowResizeColumn = A;
						mini.removeClass(this.el, "mini-grid-resizeColumns-no");
						if (!A)
							mini
									.addClass(this.el,
											"mini-grid-resizeColumns-no")
					},
					getAllowResizeColumn : function() {
						return this.allowResizeColumn
					},
					setAllowSortColumn : function(A) {
						this.allowSortColumn = A
					},
					getAllowSortColumn : function() {
						return this.allowSortColumn
					},
					setAllowMoveColumn : function(A) {
						this.allowMoveColumn = A
					},
					getAllowMoveColumn : function() {
						return this.allowMoveColumn
					},
					setShowColumnsMenu : function(A) {
						this.showColumnsMenu = A
					},
					getShowColumnsMenu : function() {
						return this.showColumnsMenu
					},
					setEditNextOnEnterKey : function(A) {
						this.editNextOnEnterKey = A
					},
					getEditNextOnEnterKey : function() {
						return this.editNextOnEnterKey
					},
					setEditOnTabKey : function(A) {
						this.editOnTabKey = A
					},
					getEditOnTabKey : function() {
						return this.editOnTabKey
					},
					setCreateOnEnter : function(A) {
						this.createOnEnter = A
					},
					getCreateOnEnter : function() {
						return this.createOnEnter
					},
					_currentCell : null,
					_doCurrentCell : function(D) {
						if (this._currentCell) {
							var A = this._currentCell[0], C = this._currentCell[1], B = this
									._getCellEl(A, C);
							if (B)
								if (D)
									mini.addClass(B, this._cellSelectedCls);
								else
									mini.removeClass(B, this._cellSelectedCls)
						}
					},
					setCurrentCell : function(A) {
						if (this._currentCell != A) {
							this._doCurrentCell(false);
							this._currentCell = A;
							this._doCurrentCell(true);
							if (A)
								if (this.isFrozen())
									this.scrollIntoView(A[0]);
								else
									this.scrollIntoView(A[0], A[1]);
							this.fire("currentcellchanged")
						}
					},
					getCurrentCell : function() {
						var A = this._currentCell;
						if (A)
							if (this.indexOf(A[0]) == -1) {
								this._currentCell = null;
								A = null
							}
						return A
					},
					_editingCell : null,
					isEditingCell : function(A) {
						return this._editingCell
								&& this._editingCell[0] == A[0]
								&& this._editingCell[1] == A[1]
					},
					beginEditCell : function(A, C) {
						A = this.getRow(A);
						C = this.getColumn(C);
						var B = [ A, C ];
						if (A && C)
							this.setCurrentCell(B);
						B = this.getCurrentCell();
						if (this._editingCell && B)
							if (this._editingCell[0] == B[0]
									&& this._editingCell[1] == B[1])
								return;
						if (this._editingCell)
							this.commitEdit();
						if (B) {
							var A = B[0], C = B[1], D = this._OnCellBeginEdit(
									A, C, this.getCellEditor(C));
							if (D !== false) {
								this.scrollIntoView(A, C);
								this._editingCell = B;
								this._OnCellShowingEdit(A, C)
							}
						}
					},
					cancelEdit : function() {
						if (this.allowCellEdit) {
							if (this._editingCell)
								this._OnCellEndEdit()
						} else if (this.isEditing()) {
							this._allowLayout = false;
							var C = this.getDataView();
							for ( var A = 0, D = C.length; A < D; A++) {
								var B = C[A];
								if (B._editing == true)
									this.cancelEditRow(A)
							}
							this._allowLayout = true;
							this.doLayout()
						}
					},
					commitEdit : function() {
						if (this.allowCellEdit) {
							if (this._editingCell) {
								this._OnCellCommitEdit(this._editingCell[0],
										this._editingCell[1]);
								this._OnCellEndEdit()
							}
						} else if (this.isEditing()) {
							this._allowLayout = false;
							var C = this.getDataView();
							for ( var A = 0, D = C.length; A < D; A++) {
								var B = C[A];
								if (B._editing == true)
									this.commitEditRow(A)
							}
							this._allowLayout = true;
							this.doLayout()
						}
					},
					getCellEditor : function(B, A) {
						B = this.getColumn(B);
						if (!B)
							return;
						if (this.allowCellEdit) {
							var D = B.__editor;
							if (!D)
								D = mini.getAndCreate(B.editor);
							if (D && D != B.editor)
								B.editor = D;
							return D
						} else {
							A = this.getRow(A);
							B = this.getColumn(B);
							if (!A)
								A = this.getEditingRow();
							if (!A || !B)
								return null;
							var C = this.uid + "$" + A._uid + "$" + B._id
									+ "$editor";
							return mini.get(C)
						}
					},
					_OnCellBeginEdit : function(A, F, H) {
						var B = mini._getMap(F.field, A), G = {
							sender : this,
							rowIndex : this.indexOf(A),
							row : A,
							record : A,
							column : F,
							field : F.field,
							editor : H,
							value : B,
							cancel : false
						};
						this.fire("cellbeginedit", G);
						if (!mini.isNull(F.defaultValue)
								&& (mini.isNull(G.value) || G.value === "")) {
							var E = F.defaultValue, D = mini.clone( {
								d : E
							});
							G.value = D.d
						}
						var H = G.editor;
						B = G.value;
						if (G.cancel)
							return false;
						if (!H)
							return false;
						if (mini.isNull(B))
							B = "";
						if (H.setValue)
							H.setValue(B);
						H.ownerRowID = A._uid;
						if (F.displayField && H.setText) {
							var C = mini._getMap(F.displayField, A);
							if (!mini.isNull(F.defaultText)
									&& (mini.isNull(C) || C === "")) {
								D = mini.clone( {
									d : F.defaultText
								});
								C = D.d
							}
							H.setText(C)
						}
						if (this.allowCellEdit)
							this._editingControl = G.editor;
						return true
					},
					_OnCellCommitEdit : function(C, E, D, H) {
						var G = {
							sender : this,
							record : C,
							row : C,
							column : E,
							field : E.field,
							editor : H ? H : this.getCellEditor(E),
							value : mini.isNull(D) ? "" : D,
							text : "",
							cancel : false
						};
						if (G.editor && G.editor.getValue)
							G.value = G.editor.getValue();
						if (G.editor && G.editor.getText)
							G.text = G.editor.getText();
						var F = C[E.field], B = G.value;
						if (mini.isEquals(F, B))
							return G;
						this.fire("cellcommitedit", G);
						if (G.cancel == false)
							if (this.allowCellEdit) {
								var A = {};
								A[E.field] = G.value;
								if (E.displayField)
									A[E.displayField] = G.text;
								this.updateRow(C, A)
							}
						return G
					},
					_OnCellEndEdit : function() {
						if (!this._editingCell)
							return;
						var B = this._editingCell[0], E = this._editingCell[1], G = {
							sender : this,
							record : B,
							row : B,
							column : E,
							field : E.field,
							editor : this._editingControl,
							value : B[E.field]
						};
						this.fire("cellendedit", G);
						if (this.allowCellEdit) {
							var F = G.editor;
							if (F && F.setIsValid)
								F.setIsValid(true);
							if (this._editWrap)
								this._editWrap.style.display = "none";
							var C = this._editWrap.childNodes;
							for ( var A = C.length - 1; A >= 0; A--) {
								var D = C[A];
								this._editWrap.removeChild(D)
							}
							if (F && F.hidePopup)
								F.hidePopup();
							if (F && F.setValue)
								F.setValue("");
							this._editingControl = null;
							this._editingCell = null;
							if (this.allowCellValid)
								this.validateRow(B)
						}
					},
					_OnCellShowingEdit : function(B, F) {
						if (!this._editingControl)
							return false;
						var A = this.getCellBox(B, F), G = mini
								.getViewportBox().width;
						if (A.right > G) {
							A.width = G - A.left;
							if (A.width < 10)
								A.width = 10;
							A.right = A.left + A.width
						}
						var I = {
							sender : this,
							record : B,
							row : B,
							column : F,
							field : F.field,
							cellBox : A,
							editor : this._editingControl
						};
						this.fire("cellshowingedit", I);
						var H = I.editor;
						if (H && H.setIsValid)
							H.setIsValid(true);
						var D = this._getEditWrap(A);
						this._editWrap.style.zIndex = mini.getMaxZIndex();
						if (H.render) {
							H.render(this._editWrap);
							setTimeout(function() {
								H.focus();
								if (H.selectText)
									H.selectText()
							}, 50);
							if (H.setVisible)
								H.setVisible(true)
						} else if (H.el) {
							this._editWrap.appendChild(H.el);
							setTimeout(function() {
								try {
									H.el.focus()
								} catch (A) {
								}
							}, 50)
						}
						if (H.setWidth) {
							var C = A.width;
							if (C < 20)
								C = 20;
							H.setWidth(C)
						}
						if (H.setHeight && H.type == "textarea") {
							var E = A.height - 1;
							if (H.minHeight && E < H.minHeight)
								E = H.minHeight;
							H.setHeight(E)
						}
						mini.on(document, "mousedown", this.__OnBodyMouseDown,
								this);
						if (F.autoShowPopup && H.showPopup)
							H.showPopup()
					},
					__OnBodyMouseDown : function(E) {
						if (this._editingControl) {
							var C = this._getCellByEvent(E);
							if (this._editingCell && C)
								if (this._editingCell[0] == C.record
										&& this._editingCell[1] == C.column)
									return false;
							var B = false;
							if (this._editingControl.within)
								B = this._editingControl.within(E);
							else
								B = mini.isAncestor(this._editWrap, E.target);
							if (B == false) {
								var D = this;
								if (mini.isAncestor(this._bodyEl, E.target) == false)
									setTimeout(function() {
										D.commitEdit()
									}, 1);
								else {
									var A = D._editingCell;
									setTimeout(function() {
										var B = D._editingCell;
										if (A == B)
											D.commitEdit()
									}, 70)
								}
								mini.un(document, "mousedown",
										this.__OnBodyMouseDown, this)
							}
						}
					},
					_getEditWrap : function(A) {
						if (!this._editWrap) {
							this._editWrap = mini
									.append(document.body,
											"<div class=\"mini-grid-editwrap\" style=\"position:absolute;\"></div>");
							mini.on(this._editWrap, "keydown",
									this.___OnEditControlKeyDown, this)
						}
						this._editWrap.style.zIndex = 1000000000;
						this._editWrap.style.display = "block";
						mini.setXY(this._editWrap, A.x, A.y);
						mini.setWidth(this._editWrap, A.width);
						var B = mini.getViewportBox().width;
						if (A.x > B)
							mini.setX(this._editWrap, -1000);
						return this._editWrap
					},
					___OnEditControlKeyDown : function(C) {
						var B = this._editingControl;
						if (C.keyCode == 13 && B && B.type == "textarea")
							return;
						if (C.keyCode == 13) {
							var A = this._editingCell;
							if (A && A[1] && A[1].enterCommit === false)
								return;
							this.commitEdit();
							this.focus();
							if (this.editNextOnEnterKey)
								this._beginEditNextCell(C.shiftKey == false)
						} else if (C.keyCode == 27) {
							this.cancelEdit();
							this.focus()
						} else if (C.keyCode == 9) {
							this.commitEdit();
							if (this.editOnTabKey) {
								C.preventDefault();
								this.commitEdit();
								this._beginEditNextCell(C.shiftKey == false)
							}
						}
					},
					editNextOnEnterKey : false,
					editOnTabKey : true,
					createOnEnter : false,
					_beginEditNextCell : function(E) {
						var A = this, C = this.getCurrentCell();
						if (!C)
							return;
						this.focus();
						var F = A.getVisibleColumns(), D = C ? C[1] : null, B = C ? C[0]
								: null, I = F.indexOf(D), G = A.indexOf(B), H = A
								.getData().length;
						if (E === false) {
							I -= 1;
							D = F[I];
							if (!D) {
								D = F[F.length - 1];
								B = A.getAt(G - 1);
								if (!B)
									return
							}
						} else {
							I += 1;
							D = F[I];
							if (!D) {
								D = F[0];
								B = A.getAt(G + 1);
								if (!B)
									if (this.createOnEnter) {
										B = {};
										this.addRow(B)
									} else
										return
							}
						}
						C = [ B, D ];
						A.setCurrentCell(C);
						A.deselectAll();
						A.setCurrent(B);
						A.scrollIntoView(B, D);
						A.beginEditCell()
					},
					getEditorOwnerRow : function(B) {
						var A = B.ownerRowID;
						return this.getRowByUID(A)
					},
					beginEditRow : function(row) {
						if (this.allowCellEdit)
							return;
						var sss = new Date();
						row = this.getRow(row);
						if (!row)
							return;
						var rowEl = this._getRowEl(row, 2);
						if (!rowEl)
							return;
						row._editing = true;
						this._doUpdateRowEl(row);
						rowEl = this._getRowEl(row, 2);
						mini.addClass(rowEl, "mini-grid-rowEdit");
						var columns = this.getVisibleColumns();
						for ( var i = 0, l = columns.length; i < l; i++) {
							var column = columns[i], value = row[column.field], cellEl = this
									._getCellEl(row, column);
							if (!cellEl)
								continue;
							if (typeof column.editor == "string")
								column.editor = eval("(" + column.editor + ")");
							var editorConfig = mini.copyTo( {}, column.editor);
							editorConfig.id = this.uid + "$" + row._uid + "$"
									+ column._id + "$editor";
							var editor = mini.create(editorConfig);
							if (this._OnCellBeginEdit(row, column, editor))
								if (editor) {
									mini.addClass(cellEl, "mini-grid-cellEdit");
									cellEl.innerHTML = "";
									cellEl.appendChild(editor.el);
									mini
											.addClass(editor.el,
													"mini-grid-editor")
								}
						}
						this.doLayout()
					},
					cancelEditRow : function(D) {
						if (this.allowCellEdit)
							return;
						D = this.getRow(D);
						if (!D || !D._editing)
							return;
						delete D._editing;
						var B = this._getRowEl(D), F = this.getVisibleColumns();
						for ( var A = 0, H = F.length; A < H; A++) {
							var E = F[A], I = this._createCellId(D, F[A]), C = document
									.getElementById(I), G = C.firstChild, J = mini
									.get(G);
							if (!J)
								continue;
							J.destroy()
						}
						this._doUpdateRowEl(D);
						this.doLayout()
					},
					commitEditRow : function(A) {
						if (this.allowCellEdit)
							return;
						A = this.getRow(A);
						if (!A || !A._editing)
							return;
						var B = this.getEditRowData(A);
						this._canUpdateRowEl = false;
						this.updateRow(A, B);
						this._canUpdateRowEl = true;
						this.cancelEditRow(A)
					},
					isEditing : function() {
						var C = this.getDataView();
						for ( var A = 0, D = C.length; A < D; A++) {
							var B = C[A];
							if (B._editing == true)
								return true
						}
						return false
					},
					isEditingRow : function(A) {
						A = this.getRow(A);
						if (!A)
							return false;
						return !!A._editing
					},
					isNewRow : function(A) {
						return A._state == "added"
					},
					getEditingRows : function() {
						var C = [], D = this.getDataView();
						for ( var A = 0, E = D.length; A < E; A++) {
							var B = D[A];
							if (B._editing == true)
								C.push(B)
						}
						return C
					},
					getEditingRow : function() {
						var A = this.getEditingRows();
						return A[0]
					},
					getEditData : function(E) {
						var D = [], D = this.getDataView();
						for ( var A = 0, F = D.length; A < F; A++) {
							var B = D[A];
							if (B._editing == true) {
								var C = this.getEditRowData(A, E);
								C._index = A;
								D.push(C)
							}
						}
						return D
					},
					getEditRowData : function(J, M) {
						J = this.getRow(J);
						if (!J || !J._editing)
							return null;
						var O = this.getIdField(), L = {}, E = this
								.getVisibleColumns();
						for ( var I = 0, F = E.length; I < F; I++) {
							var D = E[I], G = this._createCellId(J, E[I]), C = document
									.getElementById(G), P = null;
							if (D.type == "checkboxcolumn") {
								var K = D.getCheckBoxEl(J), B = K.checked ? D.trueValue
										: D.falseValue;
								P = this._OnCellCommitEdit(J, D, B)
							} else {
								var N = C.firstChild, H = mini.get(N);
								if (!H)
									continue;
								P = this._OnCellCommitEdit(J, D, null, H)
							}
							mini._setMap(D.field, P.value, L);
							if (D.displayField)
								mini._setMap(D.displayField, P.text, L)
						}
						L[O] = J[O];
						if (M) {
							var A = mini.copyTo( {}, J);
							L = mini.copyTo(A, L)
						}
						return L
					},
					collapseGroups : function() {
						if (!this.isGrouping())
							return;
						this._allowLayout = false;
						var B = this.getGroupingView();
						for ( var A = 0, D = B.length; A < D; A++) {
							var C = B[A];
							this.collapseRowGroup(C)
						}
						this._allowLayout = true;
						this.doLayout()
					},
					expandGroups : function() {
						if (!this.isGrouping())
							return;
						this._allowLayout = false;
						var B = this.getGroupingView();
						for ( var A = 0, D = B.length; A < D; A++) {
							var C = B[A];
							this.expandRowGroup(C)
						}
						this._allowLayout = true;
						this.doLayout()
					},
					toggleRowGroup : function(A) {
						if (A.expanded)
							this.collapseRowGroup(A);
						else
							this.expandRowGroup(A)
					},
					collapseRowGroup : function(A) {
						A = this.getRowGroup(A);
						if (!A)
							return;
						A.expanded = false;
						var E = this._getRowGroupEl(A, 1), B = this
								._getRowGroupRowsEl(A, 1), D = this
								._getRowGroupEl(A, 2), C = this
								._getRowGroupRowsEl(A, 2);
						if (B)
							B.style.display = "none";
						if (C)
							C.style.display = "none";
						if (E)
							mini.addClass(E, "mini-grid-group-collapse");
						if (D)
							mini.addClass(D, "mini-grid-group-collapse");
						this.doLayout()
					},
					expandRowGroup : function(A) {
						A = this.getRowGroup(A);
						if (!A)
							return;
						A.expanded = true;
						var E = this._getRowGroupEl(A, 1), B = this
								._getRowGroupRowsEl(A, 1), D = this
								._getRowGroupEl(A, 2), C = this
								._getRowGroupRowsEl(A, 2);
						if (B)
							B.style.display = "";
						if (C)
							C.style.display = "";
						if (E)
							mini.removeClass(E, "mini-grid-group-collapse");
						if (D)
							mini.removeClass(D, "mini-grid-group-collapse");
						this.doLayout()
					},
					showAllRowDetail : function() {
						this._allowLayout = false;
						var C = this.getDataView();
						for ( var A = 0, D = C.length; A < D; A++) {
							var B = C[A];
							this.showRowDetail(B)
						}
						this._allowLayout = true;
						this.doLayout()
					},
					hideAllRowDetail : function() {
						this._allowLayout = false;
						var C = this.getDataView();
						for ( var A = 0, D = C.length; A < D; A++) {
							var B = C[A];
							this.hideRowDetail(B)
						}
						this._allowLayout = true;
						this.doLayout()
					},
					isShowRowDetail : function(A) {
						A = this.getRow(A);
						if (!A)
							return false;
						return !!A._showDetail
					},
					toggleRowDetail : function(A) {
						A = this.getRow(A);
						if (!A)
							return;
						if (grid.isShowRowDetail(A))
							grid.hideRowDetail(A);
						else
							grid.showRowDetail(A)
					},
					showRowDetail : function(B) {
						B = this.getRow(B);
						if (!B || B._showDetail == true)
							return;
						B._showDetail = true;
						var E = this._getRowDetailEl(B, 1, true), D = this
								._getRowDetailEl(B, 2, true);
						if (E)
							E.style.display = "";
						if (D)
							D.style.display = "";
						var A = this._getRowEl(B, 1), C = this._getRowEl(B, 2);
						if (A)
							mini.addClass(A, "mini-grid-expandRow");
						if (C)
							mini.addClass(C, "mini-grid-expandRow");
						this.fire("showrowdetail", {
							record : B
						});
						this.doLayout()
					},
					hideRowDetail : function(B) {
						B = this.getRow(B);
						if (!B || B._showDetail !== true)
							return;
						B._showDetail = false;
						var E = this._getRowDetailEl(B, 1), D = this
								._getRowDetailEl(B, 2);
						if (E)
							E.style.display = "none";
						if (D)
							D.style.display = "none";
						var A = this._getRowEl(B, 1), C = this._getRowEl(B, 2);
						if (A)
							mini.removeClass(A, "mini-grid-expandRow");
						if (C)
							mini.removeClass(C, "mini-grid-expandRow");
						this.fire("hiderowdetail", {
							record : B
						});
						this.doLayout()
					},
					_getRowDetailEl : function(B, D, A) {
						B = this.getRow(B);
						if (!B)
							return null;
						var E = this._createRowDetailId(B, D), C = document
								.getElementById(E);
						if (!C && A === true)
							C = this._createRowDetail(B, D);
						return C
					},
					_createRowDetail : function(B, D) {
						var A = this.getFrozenColumns(), H = this
								.getUnFrozenColumns(), E = A.length;
						if (D == 2)
							E = H.length;
						var C = this._getRowEl(B, D);
						if (!C)
							return null;
						var G = this._createRowDetailId(B, D), F = "<tr id=\""
								+ G
								+ "\" class=\"mini-grid-detailRow\"><td class=\"mini-grid-detailCell\" colspan=\""
								+ E + "\"></td></tr>";
						jQuery(C).after(F);
						return document.getElementById(G)
					},
					_createRowDetailId : function(A, B) {
						return this._id + "$detail" + B + "$" + A._id
					},
					getRowDetailCellEl : function(A, C) {
						if (!C)
							C = 2;
						var B = this._getRowDetailEl(A, C);
						if (B)
							return B.cells[0]
					},
					autoHideRowDetail : true,
					setAutoHideRowDetail : function(A) {
						this.autoHideRowDetail = A
					},
					getAutoHideRowDetail : function() {
						return this.autoHideRowDetail
					},
					mergeColumns : function(H) {
						if (H && mini.isArray(H) == false)
							H = [ H ];
						var A = this, C = A.getVisibleColumns();
						if (!H)
							H = C;
						var F = A.getDataView();
						F.push( {});
						var D = [];
						for ( var B = 0, I = H.length; B < I; B++) {
							var E = H[B];
							E = A.getColumn(E);
							if (!E)
								continue;
							var J = G(E);
							D.addRange(J)
						}
						function G(H) {
							if (!H.field)
								return;
							var M = [], K = -1, I = 1, L = C.indexOf(H), E = null;
							for ( var A = 0, J = F.length; A < J; A++) {
								var D = F[A], B = mini._getMap(H.field, D);
								if (K == -1 || B != E) {
									if (I > 1) {
										var G = {
											rowIndex : K,
											columnIndex : L,
											rowSpan : I,
											colSpan : 1
										};
										M.push(G)
									}
									K = A;
									I = 1;
									E = B
								} else
									I++
							}
							return M
						}
						A.mergeCells(D)
					},
					mergeCells : function(F) {
						if (!mini.isArray(F))
							return;
						this._mergedCells = F;
						var E = this._mergedCellMaps = {};
						function B(I, J, G, F, C) {
							for ( var A = I, H = I + G; A < H; A++)
								for ( var D = J, B = J + F; D < B; D++)
									if (A == I && D == J)
										E[A + ":" + D] = C;
									else
										E[A + ":" + D] = true
						}
						var F = this._mergedCells;
						if (F)
							for ( var A = 0, D = F.length; A < D; A++) {
								var C = F[A];
								if (!C.rowSpan)
									C.rowSpan = 1;
								if (!C.colSpan)
									C.colSpan = 1;
								B(C.rowIndex, C.columnIndex, C.rowSpan,
										C.colSpan, C)
							}
						this.deferUpdate()
					},
					margeCells : function(A) {
						this.mergeCells(A)
					},
					_isCellVisible : function(B, C) {
						if (!this._mergedCellMaps)
							return true;
						var A = this._mergedCellMaps[B + ":" + C];
						return !(A === true)
					},
					_getCellEls : function(K, G, C, D) {
						var L = [];
						if (!mini.isNumber(K))
							return [];
						if (!mini.isNumber(G))
							return [];
						var E = this.getVisibleColumns(), I = this
								.getDataView();
						for ( var H = K, F = K + C; H < F; H++)
							for ( var J = G, A = G + D; J < A; J++) {
								var B = this._getCellEl(H, J);
								if (B)
									L.push(B)
							}
						return L
					},
					_getDragData : function() {
						return this.getSelecteds().clone()
					},
					_getDragText : function(A) {
						return "Records " + A.length
					},
					allowDrag : false,
					allowDrop : false,
					allowLeafDropIn : false,
					setAllowLeafDropIn : function(A) {
						this.allowLeafDropIn = A
					},
					getAllowLeafDropIn : function() {
						return this.allowLeafDropIn
					},
					setAllowDrag : function(A) {
						this.allowDrag = A
					},
					getAllowDrag : function() {
						return this.allowDrag
					},
					setAllowDrop : function(A) {
						this.allowDrop = A
					},
					getAllowDrop : function() {
						return this.allowDrop
					},
					isAllowDrag : function(B, A) {
						if (this.isReadOnly() || this.enabled == false)
							return false;
						if (!this.allowDrag || !A.allowDrag)
							return false;
						if (B.allowDrag === false)
							return false;
						var C = this._OnDragStart(B, A);
						return !C.cancel
					},
					_OnDragStart : function(B, A) {
						var C = {
							node : B,
							column : A,
							cancel : false
						};
						this.fire("dragstart", C);
						return C
					},
					_OnGiveFeedback : function(C, B, A) {
						var D = {};
						D.effect = C;
						D.nodes = B;
						D.node = D.nodes[0];
						D.targetNode = A;
						this.fire("givefeedback", D);
						return D
					},
					_OnDragDrop : function(B, A, C) {
						B = B.clone();
						var D = {
							dragNodes : B,
							targetNode : A,
							action : C,
							cancel : false
						};
						this.fire("dragdrop", D);
						return D
					},
					moveUp : function(D) {
						if (!mini.isArray(D))
							return;
						var E = this;
						D = D.sort(function(A, C) {
							var D = E.indexOf(A), B = E.indexOf(C);
							if (D > B)
								return 1;
							return -1
						});
						for ( var C = 0, F = D.length; C < F; C++) {
							var B = D[C], A = this.indexOf(B);
							this.moveRow(B, A - 1)
						}
					},
					moveDown : function(D) {
						if (!mini.isArray(D))
							return;
						var E = this;
						D = D.sort(function(A, C) {
							var D = E.indexOf(A), B = E.indexOf(C);
							if (D > B)
								return 1;
							return -1
						});
						D.reverse();
						for ( var C = 0, F = D.length; C < F; C++) {
							var B = D[C], A = this.indexOf(B);
							this.moveRow(B, A + 2)
						}
					},
					setAjaxAsync : function(A) {
						this._dataSource.ajaxAsync = A
					},
					getAjaxAsync : function() {
						return this._dataSource.ajaxAsync
					},
					setAjaxMethod : function(A) {
						this._dataSource.ajaxMethod = A
					},
					getAjaxMethod : function() {
						return this._dataSource.ajaxMethod
					},
					setAjaxOptions : function(A) {
						this._dataSource.setAjaxOptions(A)
					},
					getAjaxOptions : function() {
						return this._dataSource.getAjaxOptions()
					},
					setAutoLoad : function(A) {
						this._dataSource.setAutoLoad(A)
					},
					getAutoLoad : function() {
						return this._dataSource.getAutoLoad()
					},
					setUrl : function(A) {
						this._dataSource.setUrl(A)
					},
					getUrl : function() {
						return this._dataSource.getUrl()
					},
					load : function(A, D, C, B) {
						this._dataSource.load(A, D, C, B)
					},
					reload : function(C, B, A) {
						this._dataSource.reload(C, B, A)
					},
					gotoPage : function(A, B) {
						this._dataSource.gotoPage(A, B)
					},
					sortBy : function(C, B) {
						if (!C)
							return null;
						if (this._dataSource.sortMode == "server")
							this._dataSource.sortBy(C, B);
						else {
							var A = this._columnModel._getDataTypeByField(C);
							this._dataSource._doClientSortField(C, B, A)
						}
					},
					setCheckSelectOnLoad : function(A) {
						this._dataSource.setCheckSelectOnLoad(A)
					},
					getCheckSelectOnLoad : function() {
						return this._dataSource.getCheckSelectOnLoad()
					},
					setSelectOnLoad : function(A) {
						this._dataSource.setSelectOnLoad(A)
					},
					getSelectOnLoad : function() {
						return this._dataSource.getSelectOnLoad()
					},
					setSortMode : function(A) {
						this._dataSource.setSortMode(A)
					},
					getSortMode : function() {
						return this._dataSource.getSortMode()
					},
					setPageIndex : function(A) {
						this._dataSource.setPageIndex(A)
					},
					getPageIndex : function() {
						return this._dataSource.getPageIndex()
					},
					setPageSize : function(A) {
						this._dataSource.setPageSize(A);
						this._virtualRows = A
					},
					getPageSize : function() {
						return this._dataSource.getPageSize()
					},
					setTotalCount : function(A) {
						this._dataSource.setTotalCount(A)
					},
					getTotalCount : function() {
						return this._dataSource.getTotalCount()
					},
					getTotalPage : function() {
						return this._dataSource.getTotalPage()
					},
					setPageIndexField : function(A) {
						this._dataSource.pageIndexField = A
					},
					getPageIndexField : function() {
						return this._dataSource.pageIndexField
					},
					setPageSizeField : function(A) {
						this._dataSource.pageSizeField = A
					},
					getPageSizeField : function() {
						return this._dataSource.pageSizeField
					},
					setSortFieldField : function(A) {
						this._dataSource.sortFieldField = A
					},
					getSortFieldField : function() {
						return this._dataSource.sortFieldField
					},
					setSortOrderField : function(A) {
						this._dataSource.sortOrderField = A
					},
					getSortOrderField : function() {
						return this._dataSource.sortOrderField
					},
					setTotalField : function(A) {
						this._dataSource.totalField = A
					},
					getTotalField : function() {
						return this._dataSource.totalField
					},
					setDataField : function(A) {
						this._dataSource.dataField = A
					},
					getDataField : function() {
						return this._dataSource.dataField
					},
					setShowReloadButton : function(A) {
						this._bottomPager.setShowReloadButton(A)
					},
					getShowReloadButton : function() {
						return this._bottomPager.getShowReloadButton()
					},
					setShowPageInfo : function(A) {
						this._bottomPager.setShowPageInfo(A)
					},
					getShowPageInfo : function() {
						return this._bottomPager.getShowPageInfo()
					},
					setSizeList : function(A) {
						if (!mini.isArray(A))
							return;
						this._bottomPager.setSizeList(A)
					},
					getSizeList : function() {
						return this._bottomPager.getSizeList()
					},
					setShowPageSize : function(A) {
						this._bottomPager.setShowPageSize(A)
					},
					getShowPageSize : function() {
						return this._bottomPager.getShowPageSize()
					},
					setShowPageIndex : function(A) {
						this.showPageIndex = A;
						this._bottomPager.setShowPageIndex(A)
					},
					getShowPageIndex : function() {
						return this._bottomPager.getShowPageIndex()
					},
					setShowTotalCount : function(A) {
						this._bottomPager.setShowTotalCount(A)
					},
					getShowTotalCount : function() {
						return this._bottomPager.getShowTotalCount()
					},
					setPagerStyle : function(A) {
						this.pagerStyle = A;
						mini.setStyle(this._bottomPager.el, A)
					},
					setPagerCls : function(A) {
						this.pagerCls = A;
						mini.addClass(this._bottomPager.el, A)
					},
					__OnHtmlContextMenu : function(C) {
						var B = {
							popupEl : this.el,
							htmlEvent : C,
							cancel : false
						};
						if (mini.isAncestor(this._columnsEl, C.target)) {
							if (this.headerContextMenu) {
								this.headerContextMenu.fire("BeforeOpen", B);
								if (B.cancel == true)
									return;
								this.headerContextMenu.fire("opening", B);
								if (B.cancel == true)
									return;
								this.headerContextMenu.showAtPos(C.pageX,
										C.pageY);
								this.headerContextMenu.fire("Open", B)
							}
						} else {
							var A = mini.findParent(C.target,
									"mini-grid-detailRow");
							if (A && mini.isAncestor(this.el, A))
								return;
							if (this.contextMenu) {
								this.contextMenu.fire("BeforeOpen", B);
								if (B.cancel == true)
									return;
								this.contextMenu.fire("opening", B);
								if (B.cancel == true)
									return;
								this.contextMenu.showAtPos(C.pageX, C.pageY);
								this.contextMenu.fire("Open", B)
							}
						}
						return false
					},
					headerContextMenu : null,
					setHeaderContextMenu : function(A) {
						var B = this._getContextMenu(A);
						if (!B)
							return;
						if (this.headerContextMenu !== B) {
							this.headerContextMenu = B;
							this.headerContextMenu.owner = this;
							mini.on(this.el, "contextmenu",
									this.__OnHtmlContextMenu, this)
						}
					},
					getHeaderContextMenu : function() {
						return this.headerContextMenu
					},
					_get_originals : function() {
						return this._dataSource._originals
					},
					_set_originals : function(A) {
						this._dataSource._originals = A
					},
					_set_clearOriginals : function(A) {
						this._dataSource._clearOriginals = A
					},
					_set_originalIdField : function(A) {
						this._dataSource._originalIdField = A
					},
					_set_autoCreateNewID : function(A) {
						this._dataSource._autoCreateNewID = A
					},
					getAttrs : function(el) {
						var attrs = mini.DataGrid.superclass.getAttrs.call(
								this, el), cs = mini.getChildNodes(el);
						for ( var i = 0, l = cs.length; i < l; i++) {
							var node = cs[i], property = jQuery(node).attr(
									"property");
							if (!property)
								continue;
							property = property.toLowerCase();
							if (property == "columns") {
								attrs.columns = mini._ParseColumns(node);
								mini.removeNode(node)
							} else if (property == "data") {
								attrs.data = node.innerHTML;
								mini.removeNode(node)
							}
						}
						mini._ParseString(el, attrs, [ "url", "sizeList",
								"bodyCls", "bodyStyle", "footerCls",
								"footerStyle", "pagerCls", "pagerStyle",
								"onheadercellclick", "onheadercellmousedown",
								"onheadercellcontextmenu", "onrowdblclick",
								"onrowclick", "onrowmousedown",
								"onrowcontextmenu", "oncellclick",
								"oncellmousedown", "oncellcontextmenu",
								"onbeforeload", "onpreload", "onloaderror",
								"onload", "ondrawcell", "oncellbeginedit",
								"onselectionchanged", "ondrawgroup",
								"onshowrowdetail", "onhiderowdetail",
								"idField", "valueField", "pager",
								"oncellcommitedit", "oncellendedit",
								"headerContextMenu", "loadingMsg", "emptyText",
								"cellEditAction", "sortMode",
								"oncellvalidation", "onsort",
								"ondrawsummarycell", "ondrawgroupsummarycell",
								"onresize", "oncolumnschanged", "ajaxMethod",
								"ajaxOptions", "onaddrow", "onupdaterow",
								"onremoverow", "onmoverow", "onbeforeaddrow",
								"onbeforeupdaterow", "onbeforeremoverow",
								"onbeforemoverow", "pageIndexField",
								"pageSizeField", "sortFieldField",
								"sortOrderField", "totalField", "dataField" ]);
						mini._ParseBool(el, attrs, [ "showColumns",
								"showFilterRow", "showSummaryRow", "showPager",
								"showFooter", "showHGridLines",
								"showVGridLines", "allowSortColumn",
								"allowMoveColumn", "allowResizeColumn",
								"fitColumns", "showLoading", "multiSelect",
								"allowAlternating", "resultAsData",
								"allowRowSelect", "allowUnselect",
								"enableHotTrack", "showPageIndex",
								"showPageSize", "showTotalCount",
								"checkSelectOnLoad", "allowResize", "autoLoad",
								"autoHideRowDetail", "allowCellSelect",
								"allowCellEdit", "allowCellWrap",
								"allowHeaderWrap", "selectOnLoad",
								"virtualScroll", "collapseGroupOnLoad",
								"showGroupSummary", "showEmptyText",
								"allowCellValid", "showModified",
								"showColumnsMenu", "showPageInfo",
								"showReloadButton", "showNewRow",
								"editNextOnEnterKey", "createOnEnter",
								"ajaxAsync", "allowDrag", "allowDrop",
								"allowLeafDropIn" ]);
						mini._ParseInt(el, attrs, [ "frozenStartColumn",
								"frozenEndColumn", "pageIndex", "pageSize" ]);
						if (typeof attrs.ajaxOptions == "string")
							attrs.ajaxOptions = eval("(" + attrs.ajaxOptions
									+ ")");
						if (typeof attrs.sizeList == "string")
							attrs.sizeList = eval("(" + attrs.sizeList + ")");
						if (!attrs.idField && attrs.valueField)
							attrs.idField = attrs.valueField;
						return attrs
					}
				});
mini.regClass(mini.DataGrid, "datagrid");
mini_DataGrid_CellValidator_Prototype = {
	getCellErrors : function() {
		var C = this._cellErrors.clone(), E = this.getDataView();
		for ( var A = 0, F = C.length; A < F; A++) {
			var G = C[A], B = G.record, D = G.column;
			if (E.indexOf(B) == -1) {
				var H = B[this._rowIdField] + "$" + D._id;
				delete this._cellMapErrors[H];
				this._cellErrors.remove(G)
			}
		}
		return this._cellErrors
	},
	getCellError : function(A, B) {
		A = this.getNode ? this.getNode(A) : this.getRow(A);
		B = this.getColumn(B);
		if (!A || !B)
			return;
		var C = A[this._rowIdField] + "$" + B._id;
		return this._cellMapErrors[C]
	},
	isValid : function() {
		return this.getCellErrors().length == 0
	},
	validate : function() {
		var C = this.getDataView();
		for ( var A = 0, D = C.length; A < D; A++) {
			var B = C[A];
			this.validateRow(B)
		}
	},
	validateRow : function(B) {
		var D = this.getBottomColumns();
		for ( var A = 0, E = D.length; A < E; A++) {
			var C = D[A];
			this.validateCell(B, C)
		}
	},
	validateCell : function(E, G) {
		E = this.getNode ? this.getNode(E) : this.getRow(E);
		G = this.getColumn(G);
		if (!E || !G)
			return;
		var K = {
			record : E,
			row : E,
			node : E,
			column : G,
			field : G.field,
			value : E[G.field],
			isValid : true,
			errorText : ""
		};
		if (G.vtype)
			mini._ValidateVType(G.vtype, K.value, K, G);
		if (K.isValid == true && G.unique && G.field) {
			var C = {}, F = this.data, H = G.field;
			for ( var B = 0, I = F.length; B < I; B++) {
				var A = F[B], J = A[H];
				if (mini.isNull(J) || J === "")
					;
				else {
					var D = C[J];
					if (D && A == E) {
						K.isValid = false;
						K.errorText = mini._getErrorText(G, "uniqueErrorText");
						this.setCellIsValid(D, G, K.isValid, K.errorText);
						break
					}
					C[J] = A
				}
			}
		}
		this.fire("cellvalidation", K);
		this.setCellIsValid(E, G, K.isValid, K.errorText)
	},
	setIsValid : function(B) {
		if (B) {
			var C = this._cellErrors.clone();
			for ( var A = 0, D = C.length; A < D; A++) {
				var E = C[A];
				this.setCellIsValid(E.record, E.column, true)
			}
		}
	},
	_removeRowError : function(B) {
		var D = this.getColumns();
		for ( var A = 0, E = D.length; A < E; A++) {
			var C = D[A], G = B[this._rowIdField] + "$" + C._id, F = this._cellMapErrors[G];
			if (F) {
				delete this._cellMapErrors[G];
				this._cellErrors.remove(F)
			}
		}
	},
	setCellIsValid : function(B, C, D, F) {
		B = this.getRow(B);
		C = this.getColumn(C);
		if (!B || !C)
			return;
		var G = B[this._rowIdField] + "$" + C._id, A = this._getCellEl(B, C), E = this._cellMapErrors[G];
		delete this._cellMapErrors[G];
		this._cellErrors.remove(E);
		if (D === true) {
			if (A && E)
				mini.removeClass(A, "mini-grid-cell-error")
		} else {
			E = {
				record : B,
				column : C,
				isValid : D,
				errorText : F
			};
			this._cellMapErrors[G] = E;
			this._cellErrors.add(E);
			if (A)
				mini.addClass(A, "mini-grid-cell-error")
		}
	}
};
mini.copyTo(mini.DataGrid.prototype, mini_DataGrid_CellValidator_Prototype);
mini.TreeGrid = function(A) {
	mini.TreeGrid.superclass.constructor.call(this, A);
	mini.addClass(this.el, "mini-tree");
	this.setAjaxAsync(false);
	this.setAutoLoad(true);
	this._AsyncLoader = new mini._Tree_AsyncLoader(this)
};
mini.copyTo(mini.TreeGrid.prototype, mini._DataTreeApplys);
mini
		.extend(
				mini.TreeGrid,
				mini.DataGrid,
				{
					isTree : true,
					uiCls : "mini-treegrid",
					showPager : false,
					showNewRow : false,
					showCheckBox : false,
					showTreeIcon : true,
					showTreeLine : false,
					showExpandButtons : true,
					showTreeLines : true,
					showArrow : false,
					expandOnDblClick : true,
					expandOnNodeClick : false,
					loadOnExpand : true,
					_checkBoxType : "checkbox",
					iconField : "iconCls",
					_treeColumn : null,
					leafIconCls : "mini-tree-leaf",
					folderIconCls : "mini-tree-folder",
					fixedRowHeight : true,
					_initEvents : function() {
						mini.TreeGrid.superclass._initEvents.call(this);
						this.on("nodedblclick", this.__OnNodeDblClick, this);
						this.on("nodeclick", this.__OnNodeClick, this);
						this.on("cellclick", function(A) {
							A.node = A.record;
							A.isLeaf = this.isLeaf(A.node);
							this.fire("nodeclick", A)
						}, this);
						this.on("cellmousedown", function(A) {
							A.node = A.record;
							A.isLeaf = this.isLeaf(A.node);
							this.fire("nodemousedown", A)
						}, this);
						this.on("celldblclick", function(A) {
							A.node = A.record;
							A.isLeaf = this.isLeaf(A.node);
							this.fire("nodedblclick", A)
						}, this);
						this.on("beforerowselect", function(A) {
							A.node = A.selected;
							A.isLeaf = this.isLeaf(A.node);
							this.fire("beforenodeselect", A)
						}, this);
						this.on("rowselect", function(A) {
							A.node = A.selected;
							A.isLeaf = this.isLeaf(A.node);
							this.fire("nodeselect", A)
						}, this)
					},
					setValue : function(A) {
						if (mini.isNull(A))
							A = "";
						A = String(A);
						if (this.getValue() != A) {
							var C = this.getCheckedNodes();
							this.uncheckNodes(C);
							this.value = A;
							if (this.showCheckBox) {
								var B = String(A).split(",");
								this._dataSource.doCheckNodes(B, true, true)
							} else
								this.selectNode(A)
						}
					},
					getValue : function(A) {
						if (this.showCheckBox)
							return this._dataSource.getCheckedNodesId(A);
						else
							return this._dataSource.getSelectedsId()
					},
					isGrouping : function() {
						return false
					},
					_createSource : function() {
						this._dataSource = new mini.DataTree()
					},
					_bindSource : function() {
						mini.TreeGrid.superclass._bindSource.call(this);
						var A = this._dataSource;
						A.on("expand", this.__OnTreeExpand, this);
						A.on("collapse", this.__OnTreeCollapse, this);
						A.on("checkchanged", this.__OnCheckChanged, this);
						A.on("addnode", this.__OnSourceAddNode, this);
						A.on("removenode", this.__OnSourceRemoveNode, this);
						A.on("movenode", this.__OnSourceMoveNode, this);
						A.on("beforeloadnode", this.__OnBeforeLoadNode, this);
						A.on("loadnode", this.__OnLoadNode, this)
					},
					__OnBeforeLoadNode : function(A) {
						this.__showLoading = this.showLoading;
						this.showLoading = false;
						this.addNodeCls(A.node, "mini-tree-loading");
						this.fire("beforeloadnode", A)
					},
					__OnLoadNode : function(A) {
						this.showLoading = this.__showLoading;
						this.removeNodeCls(A.node, "mini-tree-loading");
						this.fire("loadnode", A)
					},
					__OnSourceAddNode : function(A) {
						this._doAddNodeEl(A.node)
					},
					__OnSourceRemoveNode : function(C) {
						this._doRemoveNodeEl(C.node);
						var A = this.getParentNode(C.node), B = this
								.getChildNodes(A);
						if (B.length == 0)
							this._doUpdateTreeNodeEl(A)
					},
					__OnSourceMoveNode : function(A) {
						this._doMoveNodeEl(A.node)
					},
					_doAddNodeEl : function(D) {
						var C = this.getFrozenColumns(), G = this
								.getUnFrozenColumns(), A = this
								.getParentNode(D), E = this.indexOf(D), F = false;
						function B(G, I, D) {
							var K = this._createRowHTML(G, E, I, D), B = this
									.indexOfNode(G) + 1, C = this
									.getChildNodeAt(B, A);
							if (C) {
								var J = this._getNodeEl(C, D);
								jQuery(J).before(K)
							} else {
								var H = this._getNodesEl(A, D);
								if (H)
									mini.append(H.firstChild, K);
								else
									F = true
							}
						}
						B.call(this, D, G, 2);
						B.call(this, D, C, 1);
						if (F)
							this._doUpdateTreeNodeEl(A)
					},
					_doRemoveNodeEl : function(B) {
						this._doRemoveRowEl(B);
						var C = this._getNodesEl(B, 1), A = this._getNodesEl(B,
								2);
						if (C)
							C.parentNode.removeChild(C);
						if (A)
							A.parentNode.removeChild(A)
					},
					_doMoveNodeEl : function(B) {
						this._doRemoveNodeEl(B);
						var A = this.getParentNode(B);
						this._doUpdateTreeNodeEl(A)
					},
					_doUpdateTreeNodeEl : function(F) {
						var G = this.getRootNode();
						if (G == F) {
							this.doUpdate();
							return
						}
						var B = F, D = this.getFrozenColumns(), C = this
								.getUnFrozenColumns(), A = this
								._createNodeHTML(F, D, 1, null), E = this
								._createNodeHTML(F, C, 2, null), J = this
								._getNodeEl(F, 1), L = this._getNodeEl(F, 2), H = this
								._getNodesTr(F, 1), K = this._getNodesTr(F, 2), M = mini
								.createElements(A), F = M[0], I = M[1];
						if (J) {
							mini.before(J, F);
							mini.before(J, I);
							mini.removeNode(J);
							mini.removeNode(H)
						}
						M = mini.createElements(E), F = M[0], I = M[1];
						if (L) {
							mini.before(L, F);
							mini.before(L, I);
							mini.removeNode(L);
							mini.removeNode(K)
						}
						if (F.checked != true && !this.isLeaf(F))
							this._doCheckNodeEl(B)
					},
					addNodeCls : function(A, B) {
						this.addRowCls(A, B)
					},
					removeNodeCls : function(A, B) {
						this.removeRowCls(A, B)
					},
					doUpdate : function() {
						mini.TreeGrid.superclass.doUpdate
								.apply(this, arguments)
					},
					setData : function(A) {
						if (!A)
							A = [];
						this._dataSource.setData(A)
					},
					loadList : function(A, D, B) {
						D = D || this.getIdField();
						B = B || this.getParentField();
						var C = mini.listToTree(A, this.getNodesField(), D, B);
						this.setData(C)
					},
					_OnDrawNode : function(C) {
						C.no;
						var B = this.showCheckBox;
						if (B && this.hasChildren(node))
							B = this.showFolderCheckBox;
						var A = this.getItemText(node), C = {
							isLeaf : this.isLeaf(node),
							node : node,
							nodeHtml : A,
							nodeCls : "",
							nodeStyle : "",
							showCheckBox : B,
							iconCls : this.getNodeIcon(node),
							showTreeIcon : this.showTreeIcon
						};
						this.fire("drawnode", C);
						if (C.nodeHtml === null || C.nodeHtml === undefined
								|| C.nodeHtml === "")
							C.nodeHtml = "&nbsp;";
						return C
					},
					_createDrawCellEvent : function(A, B, C, D) {
						var E = mini.TreeGrid.superclass._createDrawCellEvent
								.call(this, A, B, C, D);
						if (this._treeColumn && this._treeColumn == B.name) {
							E.isTreeCell = true;
							E.node = E.record;
							E.isLeaf = this.isLeaf(E.node);
							E.iconCls = this._getNodeIcon(A);
							E.nodeCls = "";
							E.nodeStyle = "";
							E.nodeHtml = "";
							E.showTreeIcon = this.showTreeIcon;
							E.checkBoxType = this._checkBoxType;
							E.showCheckBox = this.showCheckBox;
							if (this.getOnlyLeafCheckable() && !this.isLeaf(A))
								E.showCheckBox = false
						}
						return E
					},
					_OnDrawCell : function(A, B, C, D) {
						var E = mini.TreeGrid.superclass._OnDrawCell.call(this,
								A, B, C, D);
						if (this._treeColumn && this._treeColumn == B.name) {
							this.fire("drawnode", E);
							if (E.nodeStyle)
								E.cellStyle = E.nodeStyle;
							if (E.nodeCls)
								E.cellCls = E.nodeCls;
							if (E.nodeHtml)
								E.cellHtml = E.nodeHtml;
							this._createTreeColumn(E)
						}
						return E
					},
					_createTreeColumn : function(P) {
						var C = P.record, D = P.column;
						P.headerCls += " mini-tree-treecolumn";
						P.cellCls += " mini-tree-treecell";
						P.cellStyle += ";padding:0;vertical-align:top;";
						var N = this.isLeaf(C), A = this.getLevel(C);
						if (!N)
							P.rowCls += " mini-tree-parentNode";
						var H = [];
						H[H.length] = "<div class=\"mini-tree-nodetitle\" style=\"padding-left:";
						H[H.length] = (A + 1) * 18;
						H[H.length] = "px;\">";
						var L = 0;
						for ( var I = 0; I <= A; I++) {
							if (I == A && !N)
								break;
							if (this.showTreeLine)
								H[H.length] = "<span class=\"mini-tree-indent \" style=\"left:"
										+ L + "px;\"></span>";
							L += 18
						}
						var E = "";
						if (!N) {
							E = this.isExpandedNode(C) ? "mini-tree-expand"
									: "mini-tree-collapse";
							var B = mini.isIE6 ? L - 18 * (A + 1) : L;
							H[H.length] = "<span class=\"mini-tree-ec-icon\" style=\"left:"
									+ (B) + "px;\"></span>";
							L += 18
						}
						H[H.length] = "<div class=\"mini-tree-nodeshow\">";
						if (P.showTreeIcon) {
							var M = P.iconCls, B = mini.isIE6 ? L - 18
									* (A + 1) : L;
							H[H.length] = "<div class=\"" + M
									+ " mini-tree-nodeicon\" style=\"left:" + B
									+ "px;\"></div>"
						}
						var F = P.showTreeIcon ? 18 : 0;
						if (P.showCheckBox) {
							L += 18;
							F += 18;
							var G = this._id + "$checkbox$" + C._id, O = C.checked ? "checked"
									: "", K = this.getCheckable(C) ? ""
									: "disabled";
							H[H.length] = "<input type=\""
									+ P.checkBoxType
									+ "\" id=\""
									+ G
									+ "\" "
									+ O
									+ " "
									+ K
									+ " class=\"mini-tree-checkbox\" style=\"left:"
									+ L
									+ "px;\" hideFocus onclick=\"return false\"/>"
						}
						H[H.length] = "<div class=\"mini-tree-nodetext\" style=\"margin-left:"
								+ F + "px;\">";
						H[H.length] = P.cellHtml;
						H[H.length] = "</div></div></div>";
						P.cellHtml = H.join("");
						P.rowCls += " " + E;
						if (C.checked != true && !N) {
							var J = this.getCheckState(C);
							if (J == "indeterminate")
								this._renderCheckState(C)
						}
					},
					_renderCheckState : function(A) {
						if (!this._renderCheckStateNodes)
							this._renderCheckStateNodes = [];
						this._renderCheckStateNodes.push(A);
						if (this._renderCheckStateTimer)
							return;
						var B = this;
						this._renderCheckStateTimer = setTimeout(function() {
							B._renderCheckStateTimer = null;
							var D = B._renderCheckStateNodes;
							B._renderCheckStateNodes = null;
							for ( var A = 0, C = D.length; A < C; A++)
								B._doCheckNodeEl(D[A])
						}, 1)
					},
					_createNodeHTML : function(C, G, B, K) {
						var J = !K;
						if (!K)
							K = [];
						var I = this._dataSource, H = I.getDataView()
								.indexOf(C);
						this._createRowHTML(C, H, G, B, K);
						var F = I.getChildNodes(C);
						if (F && F.length > 0) {
							var A = this.isExpandedNode(C);
							if (A == true) {
								var E = A ? "" : "display:none", D = this
										._createNodesId(C, B);
								K[K.length] = "<tr class=\"mini-tree-nodes-tr\" style=\"";
								if (mini.isIE)
									K[K.length] = E;
								K[K.length] = "\" ><td class=\"mini-tree-nodes-td\" colspan=\"";
								K[K.length] = G.length;
								K[K.length] = "\" >";
								K[K.length] = "<div class=\"mini-tree-nodes\" id=\"";
								K[K.length] = D;
								K[K.length] = "\" style=\"";
								K[K.length] = E;
								K[K.length] = "\">";
								this._createNodesHTML(F, G, B, K);
								K[K.length] = "</div>";
								K[K.length] = "</td></tr>"
							}
						}
						if (J)
							return K.join("")
					},
					_createNodesHTML : function(G, E, B, H) {
						if (!G)
							return "";
						var F = !H;
						if (!H)
							H = [];
						H
								.push("<table class=\"mini-grid-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">");
						H.push(this._createTopRowHTML(E));
						if (E.length > 0)
							for ( var D = 0, A = G.length; D < A; D++) {
								var C = G[D];
								this._createNodeHTML(C, E, B, H)
							}
						H.push("</table>");
						if (F)
							return H.join("")
					},
					_createRowsHTML : function(E, A) {
						if (this.isVirtualScroll())
							return mini.TreeGrid.superclass._createRowsHTML
									.apply(this, arguments);
						var G = this._dataSource, D = this, H = [], F = [], B = G
								.getRootNode();
						if (this._useEmptyView !== true)
							F = G.getChildNodes(B);
						var C = A == 2 ? this._rowsViewEl.firstChild
								: this._rowsLockEl.firstChild;
						C.id = this._createNodesId(B, A);
						this._createNodesHTML(F, E, A, H);
						return H.join("")
					},
					_createNodesId : function(B, A) {
						var C = this._id + "$nodes" + A + "$" + B._id;
						return C
					},
					_getNodeEl : function(B, A) {
						return this._getRowEl(B, A)
					},
					_getNodesEl : function(B, A) {
						B = this.getNode(B);
						var C = this._createNodesId(B, A);
						return document.getElementById(C)
					},
					_getNodesTr : function(C, B) {
						var A = this._getNodesEl(C, B);
						if (A)
							return A.parentNode.parentNode
					},
					setTreeColumn : function(A) {
						this._treeColumn = A;
						this.deferUpdate()
					},
					getTreeColumn : function() {
						return this._treeColumn
					},
					setShowTreeIcon : function(A) {
						this.showTreeIcon = A;
						this.deferUpdate()
					},
					getShowTreeIcon : function() {
						return this.showTreeIcon
					},
					setShowCheckBox : function(A) {
						this.showCheckBox = A;
						this.deferUpdate()
					},
					getShowCheckBox : function() {
						return this.showCheckBox
					},
					setCheckBoxType : function(A) {
						this._checkBoxType = A;
						this._doUpdateCheckState()
					},
					getCheckBoxType : function() {
						return this._checkBoxType
					},
					setIconsField : function(A) {
						this._iconsField = A
					},
					getIconsField : function() {
						return this._iconsField
					},
					_getNodeIcon : function(B) {
						var A = B[this.iconField];
						if (!A)
							if (this.isLeaf(B))
								A = this.leafIconCls;
							else
								A = this.folderIconCls;
						return A
					},
					_getCheckBoxEl : function(A) {
						var B = this._id + "$checkbox$" + A._id;
						return document.getElementById(B)
					},
					_doExpandCollapseNode : function(B) {
						var E = new Date();
						if (this.isVirtualScroll() == true) {
							this.doUpdateRows();
							this.deferLayout(50);
							return
						}
						function C() {
							this._doUpdateTreeNodeEl(B);
							this.deferLayout(20)
						}
						if (false || mini.isIE6)
							C.call(this);
						else {
							var D = this.isExpandedNode(B);
							function A(E, D, F) {
								var G = this._getNodesEl(E, D);
								if (G) {
									var C = mini.getHeight(G);
									G.style.overflow = "hidden";
									G.style.height = "0px";
									var A = {
										height : C + "px"
									}, B = this;
									B._inAniming = true;
									var H = jQuery(G);
									H.animate(A, 180, function() {
										G.style.height = "auto";
										B._inAniming = false;
										mini.repaint(G)
									})
								}
							}
							function F(E, D, F) {
								var G = this._getNodesEl(E, D);
								if (G) {
									var C = mini.getHeight(G), A = {
										height : 0 + "px"
									}, B = this;
									B._inAniming = true;
									var H = jQuery(G);
									H.animate(A, 180, function() {
										G.style.height = "auto";
										B._inAniming = false;
										if (F)
											F.call(B);
										mini.repaint(G)
									})
								} else if (F)
									F.call(this)
							}
							if (D) {
								C.call(this);
								A.call(this, B, 2);
								A.call(this, B, 1)
							} else {
								F.call(this, B, 2, C);
								F.call(this, B, 1)
							}
						}
					},
					__OnTreeCollapse : function(A) {
						this._doExpandCollapseNode(A.node)
					},
					__OnTreeExpand : function(A) {
						this._doExpandCollapseNode(A.node)
					},
					_doCheckNodeEl : function(D) {
						var C = this.getCheckModel(), B = this
								._getCheckBoxEl(D);
						if (B) {
							B.checked = D.checked;
							if (C == "cascade") {
								var A = this.getCheckState(D);
								if (A == "indeterminate")
									B.indeterminate = true;
								else
									B.indeterminate = false
							}
						}
					},
					__OnCheckChanged : function(E) {
						for ( var A = 0, D = E._nodes.length; A < D; A++) {
							var B = E._nodes[A];
							this._doCheckNodeEl(B)
						}
						if (this._checkChangedTimer) {
							clearTimeout(this._checkChangedTimer);
							this._checkChangedTimer = null
						}
						var C = this;
						this._checkChangedTimer = setTimeout(function() {
							C._checkChangedTimer = null;
							C.fire("checkchanged")
						}, 1)
					},
					_tryToggleCheckNode : function(B) {
						var A = this.getCheckable(B);
						if (A == false)
							return;
						var C = this.isCheckedNode(B), D = {
							node : B,
							cancel : false,
							checked : C
						};
						this.fire("beforenodecheck", D);
						if (D.cancel)
							return;
						this._dataSource.doCheckNodes(B, !C, true);
						this.fire("nodecheck", D)
					},
					_tryToggleNode : function(B) {
						var A = this.isExpandedNode(B), C = {
							node : B,
							cancel : false
						};
						if (A) {
							this.fire("beforecollapse", C);
							if (C.cancel == true)
								return;
							this.collapseNode(B);
							this.fire("collapse", C)
						} else {
							this.fire("beforeexpand", C);
							if (C.cancel == true)
								return;
							this.expandNode(B);
							this.fire("expand", C)
						}
					},
					_OnCellMouseDown : function(A) {
						if (mini.findParent(A.htmlEvent.target,
								"mini-tree-ec-icon"))
							;
						else if (mini.findParent(A.htmlEvent.target,
								"mini-tree-checkbox"))
							;
						else
							this.fire("cellmousedown", A)
					},
					_OnCellClick : function(A) {
						if (mini.findParent(A.htmlEvent.target,
								"mini-tree-ec-icon"))
							this._tryToggleNode(A.record);
						else if (mini.findParent(A.htmlEvent.target,
								"mini-tree-checkbox"))
							this._tryToggleCheckNode(A.record);
						else
							this.fire("cellclick", A)
					},
					__OnNodeDblClick : function(A) {
						if (this.expandOnDblClick && !A.isLeaf
								&& !this._inAniming)
							this._tryToggleNode(A.node)
					},
					__OnNodeClick : function(A) {
						if (this.expandOnNodeClick && !A.isLeaf
								&& !this._inAniming)
							this._tryToggleNode(A.node)
					},
					setIconField : function(A) {
						this.iconField = A
					},
					getIconField : function() {
						return this.iconField
					},
					setAllowSelect : function(A) {
						this.setAllowRowSelect(A)
					},
					getAllowSelect : function() {
						return this.getAllowRowSelect()
					},
					setShowExpandButtons : function(A) {
						if (this.showExpandButtons != A) {
							this.showExpandButtons = A;
							this.doUpdate()
						}
					},
					getShowExpandButtons : function() {
						return this.showExpandButtons
					},
					setShowTreeLines : function(A) {
						this.showTreeLines = A;
						if (A == true)
							mini.addClass(this.el, "mini-tree-treeLine");
						else
							mini.removeClass(this.el, "mini-tree-treeLine")
					},
					getShowTreeLines : function() {
						return this.showTreeLines
					},
					setShowArrow : function(A) {
						this.showArrow = A;
						if (A == true)
							mini.addClass(this.el, "mini-tree-showArrow");
						else
							mini.removeClass(this.el, "mini-tree-showArrow")
					},
					getShowArrow : function() {
						return this.showArrow
					},
					setLeafIcon : function(A) {
						this.leafIcon = A
					},
					getLeafIcon : function() {
						return this.leafIcon
					},
					setFolderIcon : function(A) {
						this.folderIcon = A
					},
					getFolderIcon : function() {
						return this.folderIcon
					},
					getExpandOnDblClick : function() {
						return this.expandOnDblClick
					},
					setExpandOnNodeClick : function(A) {
						this.expandOnNodeClick = A;
						if (A)
							mini.addClass(this.el, "mini-tree-nodeclick");
						else
							mini.removeClass(this.el, "mini-tree-nodeclick")
					},
					getExpandOnNodeClick : function() {
						return this.expandOnNodeClick
					},
					setLoadOnExpand : function(A) {
						this.loadOnExpand = A
					},
					getLoadOnExpand : function() {
						return this.loadOnExpand
					},
					getAttrs : function(E) {
						var I = mini.TreeGrid.superclass.getAttrs.call(this, E);
						mini._ParseString(E, I, [ "value", "url", "idField",
								"textField", "iconField", "nodesField",
								"parentField", "valueField", "leafIcon",
								"folderIcon", "ondrawnode",
								"onbeforenodeselect", "onnodeselect",
								"onnodemousedown", "onnodeclick",
								"onnodedblclick", "onbeforenodecheck",
								"onnodecheck", "onbeforeexpand", "onexpand",
								"onbeforecollapse", "oncollapse",
								"dragGroupName", "dropGroupName", "onendedit",
								"expandOnLoad", "ondrop", "ongivefeedback",
								"treeColumn" ]);
						mini._ParseBool(E, I, [ "allowSelect", "showCheckBox",
								"showExpandButtons", "showTreeIcon",
								"showTreeLines", "checkRecursive",
								"enableHotTrack", "showFolderCheckBox",
								"resultAsTree", "allowDrag", "allowDrop",
								"showArrow", "expandOnDblClick",
								"removeOnCollapse", "autoCheckParent",
								"loadOnExpand", "expandOnNodeClick" ]);
						if (I.expandOnLoad) {
							var B = parseInt(I.expandOnLoad);
							if (mini.isNumber(B))
								I.expandOnLoad = B;
							else
								I.expandOnLoad = I.expandOnLoad == "true" ? true
										: false
						}
						var G = I.idField || this.getIdField(), D = I.textField
								|| this.getTextField(), H = I.iconField
								|| this.getIconField(), C = I.nodesField
								|| this.getNodesField();
						function A(K) {
							var P = [];
							for ( var N = 0, L = K.length; N < L; N++) {
								var F = K[N], J = mini.getChildNodes(F), T = J[0], I = J[1];
								if (!T || !I)
									T = F;
								var E = jQuery(T), B = {}, M = B[G] = T
										.getAttribute("value");
								B[H] = E.attr("iconCls");
								B[D] = T.innerHTML;
								P.add(B);
								var R = E.attr("expanded");
								if (R)
									B.expanded = R == "false" ? false : true;
								var S = E.attr("allowSelect");
								if (S)
									B.allowSelect = S == "false" ? false : true;
								if (!I)
									continue;
								var Q = mini.getChildNodes(I), O = A(Q);
								if (O.length > 0)
									B[C] = O
							}
							return P
						}
						var F = A(mini.getChildNodes(E));
						if (F.length > 0)
							I.data = F;
						if (!I.idField && I.valueField)
							I.idField = I.valueField;
						return I
					}
				});
mini.regClass(mini.TreeGrid, "TreeGrid");
mini.Tree = function() {
	mini.Tree.superclass.constructor.call(this);
	var A = [ {
		name : "node",
		header : "",
		field : this.getTextField(),
		width : "auto",
		allowDrag : true,
		editor : {
			type : "textbox"
		}
	} ];
	this._columnModel.setColumns(A);
	this._column = this._columnModel.getColumn("node");
	mini.removeClass(this.el, "mini-treegrid");
	mini.addClass(this.el, "mini-tree-nowrap");
	this.setBorderStyle("border:0")
};
mini.extend(mini.Tree, mini.TreeGrid, {
	setTextField : function(A) {
		this._dataSource.setTextField(A);
		this._columnModel.updateColumn("node", {
			field : A
		})
	},
	uiCls : "mini-tree",
	_treeColumn : "node",
	defaultRowHeight : 21,
	showHeader : false,
	showTopbar : false,
	showFooter : false,
	showColumns : false,
	showHGridLines : false,
	showVGridLines : false,
	setTreeColumn : null,
	setColumns : null,
	getColumns : null,
	frozen : null,
	unFrozen : null,
	allowCellEdit : true,
	isEditingNode : function(A) {
		return !!this._editingControl
	},
	beginEdit : function(A) {
		this.beginEditCell(A, 0)
	}
});
mini.regClass(mini.Tree, "Tree");
mini._Tree_AsyncLoader = function(A) {
	this.owner = A;
	A.on("beforeexpand", this.__OnBeforeNodeExpand, this)
};
mini._Tree_AsyncLoader.prototype = {
	__OnBeforeNodeExpand : function(E) {
		var B = this.owner, A = E.node, D = B.isLeaf(A), C = A[B
				.getNodesField()];
		if (!D && (!C || C.length == 0))
			if (B.loadOnExpand && A.asyncLoad !== false) {
				E.cancel = true;
				B.loadNode(A)
			}
	}
};
nui = mini;
mini.getClassByUICls = function(A) {
	A = A.toLowerCase();
	var B = this.uiClasses[A];
	if (!B) {
		A = A.replace("nui-", "mini-");
		B = this.uiClasses[A]
	}
	return B
};
mini.DatePicker.prototype.valueFormat = "yyyy-MM-dd HH:mm:ss"