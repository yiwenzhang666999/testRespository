package com.forestar.cache.redis;

import java.util.HashMap;

import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

public class GeomOptParams extends HashMap{
	
	public String getParam(String paramName){
		return this.get(paramName) == null ? null : this.get(paramName).toString();
	}
	
	public void setParam(String paramName,Object paramValue){
		this.put(paramName, paramValue);
	}
	
	public void convert() throws ParseException{
		if(this.getParam("WKT") != null){
			String result = GeomOptionHelper.calExtends(this.getParam("WKT").toString(),new WKTReader(GeomOptionHelper.getGeometryFactory()));
			String[] arr = result.trim().split(",");
			String[] a1 = arr[0].trim().split(" ");
			String[] a2 = arr[1].trim().split(" ");
			this.setXmin(a1[0]);
			this.setYmin(a1[1]);
			this.setXmax(a2[0]);
			this.setYmax(a2[1]);
		}
		if(this.getParam("WKT_OLD") != null){
			String result = GeomOptionHelper.calExtends(this.getParam("WKT_OLD").toString(),new WKTReader(GeomOptionHelper.getGeometryFactory()));
			String[] arr = result.trim().split(",");
			String[] a1 = arr[0].trim().split(" ");
			String[] a2 = arr[1].trim().split(" ");
			this.setParam("xmin_old", a1[0]);
			this.setParam("ymin_old", a1[1]);
			this.setParam("xmax_old", a2[0]);
			this.setParam("ymax_old", a2[1]);
		}
	}

	public String getXmax() {
		return this.get("xmax").toString();
	}

	public void setXmax(String xmax) {
		this.put("xmax", xmax);
	}

	public String getYmax() {
		return this.get("ymax").toString();
	}

	public void setYmax(String ymax) {
		this.put("ymax", ymax);
	}

	public String getYmin() {
		return this.get("ymin").toString();
	}

	public void setYmin(String ymin) {
		this.put("ymin", ymin);
	}

	public String getXmin() {
		return this.get("xmin").toString();
	}

	public void setXmin(String xmin) {
		this.put("xmin", xmin);
	}
	
	
	
	
}
