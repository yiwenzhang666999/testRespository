window.PL=window.PL||{};
(function(){
    var PL = window.PL;
    window.OpenLayers = ol;
    /**
     * 根据3度带计算：起始25度分带，坐标参考：EPSG:2349
     *
     */
    PL.getProjectByLongitude=function(lon){
        var epsg = 2349;
        for(var start_=73.5;start_<135;){
            if(lon>start_ && lon<(start_+3)){
                return "EPSG:"+epsg;
            }
            epsg++; start_+=3;
        }
    }
    /**
     * 根据带号计算坐标参考
     * @param x
     * @returns {string}
     */
    PL.getProjectByXY=function(x){
        var xStr = x+'';
        xStr = xStr.substr(0,2);
        xStr = parseInt(xStr)+24;
        return "EPSG:23"+xStr;
    }
    /**
     * 计算Polygon 中心点(内点)
     * @param polygon 坐标集合
     * @param precision 精度
     * @param isXY true: 经纬度坐标系，false: 平面坐标系
     * @param srcProj 经纬度坐标参考
     * @constructor
     */
    PL.Polylabel = function(polygon, projCode, isXY) {
        if(isXY){
            return PL.PolylabelByXY(polygon, 1, false);
        }else{
            var proj = projCode+"";
            if(proj.indexOf("EPSG")<0){
                proj = "EPSG:"+projCode;
            }
            return PL.PolylabelByLonLat(polygon, 1, proj, false);
        }
    }

    PL.PolylabelByLonLat = function(pointArr, precision, projCode, debug){
        var geoPoints=[],tarProj;
        geoPoints[0]=[];
        if(pointArr!=null && pointArr.length>0){
            var points_=pointArr[0];
            // 投影转换
            var currentProj = new OpenLayers.proj.Projection({code:projCode});
            for(var idx=0;idx<points_.length;idx++){
                var tmpPoint= points_[idx];
                var lon = tmpPoint[0];
                var lat = tmpPoint[1]
                tarProj = PL.getProjectByLongitude(lon);
                // 投影
                var XY = new OpenLayers.geom.Point(tmpPoint);
                XY.transform(currentProj, new OpenLayers.proj.Projection({code:tarProj}));
                geoPoints[0].push(XY.getFirstCoordinate());
            }
            var result = PL.PolylabelByXY(geoPoints,1,false);
            var XY = new OpenLayers.geom.Point(result);
            XY.transform(new OpenLayers.proj.Projection({code:PL.getProjectByXY(result[0])}),currentProj);
            return XY.getFirstCoordinate();
        }else{
            return [];
        }
    }


    PL.PolylabelByXY = function(polygon, precision, debug) {
        precision = precision || 1.0;

        // find the bounding box of the outer ring
        var minX, minY, maxX, maxY;
        for (var i = 0; i < polygon[0].length; i++) {
            var p = polygon[0][i];
            if (!i || p[0] < minX) minX = p[0];
            if (!i || p[1] < minY) minY = p[1];
            if (!i || p[0] > maxX) maxX = p[0];
            if (!i || p[1] > maxY) maxY = p[1];
        }

        var width = maxX - minX;
        var height = maxY - minY;
        var cellSize = Math.min(width, height);
        var h = cellSize / 2;

        // a priority queue of cells in order of their "potential" (max distance to polygon)
        var cellQueue = new PL.TinyQueue(null, PL.compareMax);

        if (cellSize === 0) return [minX, minY];

        // cover polygon with initial cells
        for (var x = minX; x < maxX; x += cellSize) {
            for (var y = minY; y < maxY; y += cellSize) {
                cellQueue.push(new PL.Cell(x + h, y + h, h, polygon));
            }
        }

        // take centroid as the first best guess
        var bestCell = PL.getCentroidCell(polygon);

        // special case for rectangular polygons
        var bboxCell = new PL.Cell(minX + width / 2, minY + height / 2, 0, polygon);
        if (bboxCell.d > bestCell.d) bestCell = bboxCell;

        var numProbes = cellQueue.length;

        while (cellQueue.length) {
            // pick the most promising cell from the queue
            var cell = cellQueue.pop();

            // update the best cell if we found a better one
            if (cell.d > bestCell.d) {
                bestCell = cell;
                if (debug) console.log('found best %d after %d probes', Math.round(1e4 * cell.d) / 1e4, numProbes);
            }

            // do not drill down further if there's no chance of a better solution
            if (cell.max - bestCell.d <= precision) continue;

            // split the cell into four cells
            h = cell.h / 2;
            cellQueue.push(new PL.Cell(cell.x - h, cell.y - h, h, polygon));
            cellQueue.push(new PL.Cell(cell.x + h, cell.y - h, h, polygon));
            cellQueue.push(new PL.Cell(cell.x - h, cell.y + h, h, polygon));
            cellQueue.push(new PL.Cell(cell.x + h, cell.y + h, h, polygon));
            numProbes += 4;
        }

        if (debug) {
            console.log('num probes: ' + numProbes);
            console.log('best distance: ' + bestCell.d);
        }

        return [bestCell.x, bestCell.y];
    }

    PL.compareMax=function(a, b) {
        return b.max - a.max;
    }

    PL.Cell=function(x, y, h, polygon) {
        this.x = x; // cell center x
        this.y = y; // cell center y
        this.h = h; // half the cell size
        this.d = PL.pointToPolygonDist(x, y, polygon); // distance from cell center to polygon
        this.max = this.d + this.h * Math.SQRT2; // max distance to polygon within a cell
    }

    // signed distance from point to polygon outline (negative if point is outside)
    PL.pointToPolygonDist=function(x, y, polygon) {
        var inside = false;
        var minDistSq = Infinity;

        for (var k = 0; k < polygon.length; k++) {
            var ring = polygon[k];

            for (var i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
                var a = ring[i];
                var b = ring[j];

                if ((a[1] > y !== b[1] > y) &&
                    (x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])) inside = !inside;

                minDistSq = Math.min(minDistSq, PL.getSegDistSq(x, y, a, b));
            }
        }

        return (inside ? 1 : -1) * Math.sqrt(minDistSq);
    }

    // get polygon centroid
    PL.getCentroidCell=function(polygon) {
        var area = 0;
        var x = 0;
        var y = 0;
        var points = polygon[0];

        for (var i = 0, len = points.length, j = len - 1; i < len; j = i++) {
            var a = points[i];
            var b = points[j];
            var f = a[0] * b[1] - b[0] * a[1];
            x += (a[0] + b[0]) * f;
            y += (a[1] + b[1]) * f;
            area += f * 3;
        }
        if (area === 0) return new Polylabel.Cell(points[0][0], points[0][1], 0, polygon);
        return new PL.Cell(x / area, y / area, 0, polygon);
    }

    // get squared distance from a point to a segment
    PL.getSegDistSq=function(px, py, a, b) {

        var x = a[0];
        var y = a[1];
        var dx = b[0] - x;
        var dy = b[1] - y;
        if (dx !== 0 || dy !== 0) {
            var t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
            if (t > 1) {
                x = b[0];
                y = b[1];
            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }
        dx = px - x;
        dy = py - y;
        return dx * dx + dy * dy;
    }
    PL.TinyQueue=function(data, compare) {
        if (!(this instanceof PL.TinyQueue)) return new PL.TinyQueue(data, compare);

        this.data = data || [];
        this.length = this.data.length;
        this.compare = compare || Polylabel.defaultCompare;

        if (data) for (var i = Math.floor(this.length / 2); i >= 0; i--) this._down(i);
    }

    PL.defaultCompare=function(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    PL.TinyQueue.prototype = {

        push: function (item) {
            this.data.push(item);
            this.length++;
            this._up(this.length - 1);
        },

        pop: function () {
            var top = this.data[0];
            this.data[0] = this.data[this.length - 1];
            this.length--;
            this.data.pop();
            this._down(0);
            return top;
        },

        peek: function () {
            return this.data[0];
        },

        _up: function (pos) {
            var data = this.data,
                compare = this.compare;

            while (pos > 0) {
                var parent = Math.floor((pos - 1) / 2);
                if (compare(data[pos], data[parent]) < 0) {
                    this._swap(data, parent, pos);
                    pos = parent;

                } else break;
            }
        },

        _down: function (pos) {
            var data = this.data,
                compare = this.compare,
                len = this.length;

            while (true) {
                var left = 2 * pos + 1,
                    right = left + 1,
                    min = pos;

                if (left < len && compare(data[left], data[min]) < 0) min = left;
                if (right < len && compare(data[right], data[min]) < 0) min = right;

                if (min === pos) return;

                this._swap(data, min, pos);
                pos = min;
            }
        },
        _swap: function(data, i, j) {
            var tmp = data[i];
            data[i] = data[j];
            data[j] = tmp;
        }
    }
})();