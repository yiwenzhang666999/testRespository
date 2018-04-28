 //-----------------------------------------------------------------------------------
            //边线拖动开始
            var theobject = null; 

			function resizeObject() {
				this.el        = null; 
				this.dir    = "";      
				this.grabx = null;     
				this.graby = null;
				this.width = null;
				this.height = null;
				this.left = null;
				this.top = null;
			}
				
			
			//计算点的位置
			function getDirection(el) {
				var xPos, yPos, offset, dir;
				dir = "";
			
				xPos = window.event.offsetX;
				yPos = window.event.offsetY;
			
				offset = 8; //The distance from the edge in pixels
			
				if (yPos<offset) dir += "n";
				else if (yPos > el.offsetHeight-offset) dir += "s";
				if (xPos<offset) dir += "w";
				else if (xPos > el.offsetWidth-offset) dir += "e";
			
				return dir;
			}
			//鼠标按下事件
			function doDown(e) {
				
				
				var el = getReal(event.srcElement, "className", "resizeMe");
			
				if (el == null) {
					theobject = null;
					return;
				}		
			
				dir = getDirection(el);
				if (dir == "") return;
			
				theobject = new resizeObject();
					
				theobject.el = el;
				theobject.dir = dir;
			
				theobject.grabx = window.event.clientX;
				theobject.graby = window.event.clientY;
				theobject.width = el.offsetWidth;
				theobject.height = el.offsetHeight;
				theobject.left = el.offsetLeft;
				theobject.top = el.offsetTop;
			
				window.event.returnValue = false;
				window.event.cancelBubble = true;
			}
			//鼠标抬起
			function doUp(e) {
				
				if (theobject != null) {
					theobject = null;
				}
			}
			//鼠标移动
			function doMove(e) {
				
				var el, xPos, yPos, str, xMin, yMin;
				xMin = 8; 
				yMin = 8; 
			
				el = getReal(event.srcElement, "className", "resizeMe");
			
				if (el.className == "resizeMe") {
					str = getDirection(el);
					
					if (str == "" && el.className == "resizeMe") 
						str = "move";
					else 
						str += "-resize";
					el.style.cursor = str;
				}
				
				if(theobject != null) {
					if (dir.indexOf("e") != -1)
						theobject.el.style.width = Math.max(xMin, theobject.width + 
								window.event.clientX - theobject.grabx) + "px";
							if (dir.indexOf("s") != -1)
								theobject.el.style.height = Math.max(yMin, theobject.height + 
									window.event.clientY - theobject.graby) + "px";
					
							if (dir.indexOf("w") != -1) {
								theobject.el.style.left = Math.min(theobject.left + 
									window.event.clientX - theobject.grabx, theobject.left + theobject.width - xMin) + "px";
									theobject.el.style.width = Math.max(xMin, theobject.width - 
										window.event.clientX + theobject.grabx) + "px";
							}
							if (dir.indexOf("n") != -1) {
								theobject.el.style.top = Math.min(theobject.top + 
									window.event.clientY - theobject.graby, theobject.top + theobject.height - yMin) +"px";
									theobject.el.style.height = Math.max(yMin, theobject.height - 
										window.event.clientY + theobject.graby) + "px";
							}
							window.event.returnValue = false;
							window.event.cancelBubble = true;
						} 
					}
					function getReal(el, type, value) {
						temp = el;
						while ((temp != null) && (temp.tagName != "BODY")) {
							if (eval("temp." + type) == value) {
								el = temp;
								return el;
							}
							temp = temp.parentElement;
						}
						return el;
					}
					document.onmousedown = doDown;
					document.onmouseup   = doUp;
					document.onmousemove = doMove; 
//边线移动结束--------------------------------------------------------------------------------------	