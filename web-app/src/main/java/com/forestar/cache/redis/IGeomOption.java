package com.forestar.cache.redis;

import java.util.List;
import java.util.Set;

import com.alibaba.fastjson.JSONObject;
import com.vividsolutions.jts.io.ParseException;
/**
 * 空间数据操作接口
 * @author pt-sy
 *
 */
public interface IGeomOption {
	
	public Set<Feature> getFeature(String dataSetName,String layerName,GeomOptParams params) throws ParseException;
	
	public boolean updateFeature(String dataSetName,String layerName,List<GeomOptParams> params) throws ParseException;
	
	public boolean deleteFeature(String dataSetName,String layerName,List<GeomOptParams> params) throws ParseException;
	
	public List<String> addFeature(String dataSetName,String layerName,List<GeomOptParams> params);
	/**
	 * 复杂的图形操作，包括  增<>删<>改 组合操作
	 * @param dataSetName 数据集
	 * @param layerName 图层名称
	 * @param params
	 * 格式： 
	 * 	params<?> 删除  : opt="del",WKT=,oid=,
	 * 
	 * 	params<?> 新增  : opt="add",WKT=,ATTR=,
	 * 
	 *  params<?> 修改  : opt="update",WKT_OLD=,oid=,WKT=,ATTR=,
	 * 
	 * @return
	 */
	public List<JSONObject>  multiOptFeature(String dataSetName,String layerName,List<GeomOptParams> params) throws ParseException;
}
