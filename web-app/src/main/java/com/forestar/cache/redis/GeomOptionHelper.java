package com.forestar.cache.redis;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.alibaba.fastjson.JSONObject;
import com.forestar.data.exception.ArgumentException;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

public class GeomOptionHelper {

	private static GeomIndexConfig config = new GeomIndexConfig();
	
	
	public static GeometryFactory gf = new GeometryFactory();
	
	static{
		int center_x = 108;
	    int center_y = 26;
	   // 根据地球半径换算米单位分区，对应到经纬度的分区
	    double LonPerimeter = 6371000 * 2 * Math.PI;
		double LatPerimeter = 6371000 * 2 * Math.PI * Math.cos(Math.toRadians(center_y));
	    double DEG2METER = LatPerimeter / 360.0;
	    config.setGRID_INDEX_SIZE_IN_DEGREE((float)(config.getGRID_INDEX_SIZE_IN_METER() / DEG2METER)) ;
	  
	   // reader = new WKTReader(gf);
	}
	
	public List<KeyGenerator> calcGridIndexsByCoords(String datasetName,String layerName,String xmin,String ymin,String xmax,String ymax){
		List<KeyGenerator> result = new ArrayList<KeyGenerator>();
		int index_col_min = (int)(Math.floor((Float.parseFloat(xmin) - config.getGRID_ORI_X()) / config.getGRID_INDEX_SIZE_IN_DEGREE()));
		int index_row_min = (int)(Math.floor((Float.parseFloat(ymin) - config.getGRID_ORI_Y()) / config.getGRID_INDEX_SIZE_IN_DEGREE()));
		
		int index_col_max = (int)(Math.floor((Float.parseFloat(xmax) - config.getGRID_ORI_X()) / config.getGRID_INDEX_SIZE_IN_DEGREE()));
		int index_row_max = (int)(Math.floor((Float.parseFloat(ymax) - config.getGRID_ORI_Y()) / config.getGRID_INDEX_SIZE_IN_DEGREE()));
		
		for(int i = index_col_min ; i <= index_col_max ; i++ ){
			for(int j = index_row_min ; j <= index_row_max ; j++){
				KeyGenerator gridIndexKeyGenerator = new GridIndexKeyGenerator(datasetName, layerName, String.valueOf(i), String.valueOf(j));
				result.add(gridIndexKeyGenerator);
			}
		}
		return result;
	}
	
	
	public static GeometryFactory getGeometryFactory(){
		return gf;
	}
	
	public static String calExtends(String wkt,WKTReader reader) throws ParseException{
		String  pointStr = reader.read(wkt).getEnvelope().toText();
		String t = pointStr.substring(pointStr.indexOf("((")+2,pointStr.indexOf("))"));
		String[] arr = t.split(",");
		return arr[0]+","+arr[2];	
	}
	
	
	public static String getRectanglePolygonWkt(String xmin,String ymin,String xmax,String ymax){
		if(xmin == null || ymin == null || xmax == null || ymax == null){
			String a = "";
		}
		return "POLYGON (("+xmin+" "+ymin+", "+xmax+" "+" "+ymin+", "+xmax+" "+ymax+", "+xmin+" "+ymax+","+xmin+" "+ymin+"))";
	}
	
	public static  String getInStr(Set<String> keys,String idField){
		String inStr = "(";
		int count = 0;
		for(String key : keys){
			AttributeIndexKeyGenerator gen = new AttributeIndexKeyGenerator(key);
			count ++ ;
			if(count > 50){
				inStr = inStr.substring(0,inStr.length() - 1);
				inStr += ") or "+idField+" in (";
				count = 0;
			}
			inStr += "'"+gen.getOid() + "',";
		}
		inStr = inStr.substring(0,inStr.length() - 1)+")";
		return inStr;
	}
	/**
	 * 如果redis中数据的STATE为del，则返回false
	 * @param state
	 * @return
	 */
	public static boolean legalFeature(Object state){
		if(state == null || state.toString().indexOf("{") < 0){
			return true;
		}else{
			JSONObject stateMap = JSONObject.parseObject(state.toString());
			Collection<Object> values = stateMap.values();
			for(Object o : values){
				if(o.toString().equals(State.DEL)){
					return false;
				}
			}
			return true;
		}
	}
	
	public static String getIndexSetId(){
		return UUID.randomUUID().toString()+":";
	}
	
	public static void assertWkt(String wkt){
		if(wkt == null || wkt == ""){
			throw new ArgumentException("WKT为空或者格式不正确");
		}
	}
	
	
	public static int getRedisDbIndex(String zqCode){
		int index = -1;
		if(zqCode.length() < 2) return index;
		zqCode = zqCode.substring(0,2);
		switch(zqCode){
			case "11" : index = 1; break; //北京
			case "12" : index = 2; break; //天津
			case "13" : index = 3; break; //河北
			case "14" : index = 4; break; //山西
			case "15" : index = 5; break; //内蒙古
			case "21" : index = 6; break; //辽宁
			case "22" : index = 7; break; //吉林
			case "23" : index = 8; break; //黑龙江
			case "31" : index = 9; break; //上海
			case "32" : index = 10; break; //江苏
			case "33" : index = 11; break; //浙江
			case "34" : index = 12; break; //安徽
			case "35" : index = 13; break; //福建
			case "36" : index = 14; break; //江西
			case "37" : index = 15; break; //山东
			case "41" : index = 16; break; //河南
			case "42" : index = 17; break; //湖北
			case "43" : index = 18; break; //湖南
			case "44" : index = 19; break; //广东
			case "45" : index = 20; break; //广西
			case "46" : index = 21; break; //海南
			case "50" : index = 22; break; //重庆
			case "51" : index = 23; break; //四川
			case "52" : index = 24; break; //贵州
			case "53" : index = 25; break; //云南
			case "54" : index = 26; break; //西藏
			case "61" : index = 27; break; //陕西
			case "62" : index = 28; break; //甘肃
			case "63" : index = 29; break; //青海
			case "64" : index = 30; break; //宁夏
			case "65" : index = 31; break; //新疆
			case "81" : index = 32; break; //香港
			case "82" : index = 33; break; //澳门
			case "71" : index = 34; break; //台湾
			
		}
		return index;
	}
	
	public static void main(String[] args) {
		GeomOptionHelper helper = new GeomOptionHelper();
		System.out.println(helper.getRedisDbIndex("8200"));
	}
}
