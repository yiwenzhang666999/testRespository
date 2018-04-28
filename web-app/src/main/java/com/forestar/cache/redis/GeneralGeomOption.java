package com.forestar.cache.redis;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.Response;
import redis.clients.jedis.Transaction;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.forestar.core.exception.ServiceException;
import com.forestar.data.exception.ArgumentException;
import com.forestar.data.general.GlobalParameter;
import com.forestar.data.general.RowBase;
import com.forestar.data.metadata.IMetadataTable;
import com.forestar.data.metadata.MetadataField;
import com.forestar.data.metadata.PartitionSchema;
import com.forestar.data.service.BaseService;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;
@Service
public class GeneralGeomOption implements IGeomOption{

	private Logger log = Logger.getLogger(GeneralGeomOption.class);
	
	private GeomOptionHelper helper = new GeomOptionHelper();
	@Autowired
	PartitionSchema partitionSchema;
	@Autowired
	BaseService baseService;
	
	private FeatureChangeRecord record = new FeatureChangeRecordInFile();
	
	private WKTReader getWktReader(){
		return  new WKTReader(GeomOptionHelper.getGeometryFactory());
	}
	
	@Override
	public  Set<Feature> getFeature(String dataSetName,String layerName,GeomOptParams params) throws ParseException {
		// TODO Auto-generated method stub
		Jedis jedis = RedisClient.getJedis();
		jedis.select(GeomOptionHelper.getRedisDbIndex(dataSetName));
		Set<Feature> features = new HashSet<Feature>();
		try{
			List<KeyGenerator> gridIndexKeyGenerators = helper.calcGridIndexsByCoords(dataSetName, layerName,
					params.getXmin(), params.getYmin(), params.getXmax(), params.getYmax());
			Set<String> blank_oids = new HashSet<String>();
			Map<String,Response<Set<String>>> responses = new HashMap<String,Response<Set<String>>>(gridIndexKeyGenerators.size());
			Map<String,Set<String>> gridIndexValueMap = new HashMap<String,Set<String>>();
			Pipeline pipeline = jedis.pipelined();
			for(KeyGenerator gridIndexKeyGenerator : gridIndexKeyGenerators){
				responses.put(gridIndexKeyGenerator.getKey(), pipeline.smembers(gridIndexKeyGenerator.getKey()));
			}
			pipeline.sync();
			for(String k : responses.keySet()) {
				gridIndexValueMap.put(k, responses.get(k).get());
	        }
			Map<String,Response<String>> response2 = new HashMap<String,Response<String>>();
			for(KeyGenerator gridIndexKeyGenerator : gridIndexKeyGenerators){
				Set<String> oids = gridIndexValueMap.get(gridIndexKeyGenerator.getKey());
				for(String oid : oids){
					KeyGenerator attrIndexKeyGen = new AttributeIndexKeyGenerator(dataSetName, layerName, oid);
					String key = attrIndexKeyGen.getKey();
					response2.put(key, pipeline.get(key));
				}
			}
			pipeline.sync();
			for(String attrKey : response2.keySet()) {
				AttributeIndexKeyGenerator genKey = new AttributeIndexKeyGenerator(attrKey);
				String val =  response2.get(attrKey).get();
				if(val == null || "".equals(val)){
					blank_oids.add(attrKey);
				}else{
					Feature f = JSONObject.parseObject(val, Feature.class);
					f.put(GeomIndexConfig.ID_FIELD, genKey.getOid());
				//	if(helper.legalFeature(f.get("STATE"))){
						features.add(f);
				//	}
				}
	        }
			
			if(blank_oids.size() > 0){
				String xianCode = dataSetName;
				String tableName = layerName;
				partitionSchema.setSchemaByZQCode(xianCode.substring(0,2));
				try {
					IMetadataTable iTable = baseService.openTable(tableName);
					MetadataField[] idFields = iTable.getKeyFields();
					String idField = idFields[0].getFieldName();
					String inStr = helper.getInStr(blank_oids,idField);
					MetadataField[] fileds = iTable.getFields();
					String selectFields = "";
					for(MetadataField field : fileds){
						selectFields += field.getFieldName()+",";
					}
					String sql = "select "+selectFields+"sde.st_asbinary(shape) as BINARY from "+tableName + " t where "+idField +" in "+inStr;
					long time1 = System.currentTimeMillis();
					List<RowBase> rows = iTable.getWorkspace().getDataTable(sql, new GlobalParameter[]{});
					System.out.println("查数据库花费："+(System.currentTimeMillis() - time1));
					for(RowBase row : rows){
						if(row.getByFieldName("BINARY") == null ){
							continue;
						}
						Feature json = new Feature();
						String uKey = row.getByFieldName(idField) == null ? "" : row.getByFieldName(idField).toString();
						String binary = row.getByFieldName("BINARY").toString();
						String wkt = "";
						if("".equals(wkt)){
							throw new RuntimeException();
						}
						json.put("WKT", wkt);
						String result = GeomOptionHelper.calExtends(wkt,getWktReader());
						String[] arr = result.trim().split(",");
						String[] a1 = arr[0].trim().split(" ");
						String[] a2 = arr[1].trim().split(" ");
						Map<String,String> extents = new HashMap<String,String>();
						extents.put("xmin", a1[0]);
						extents.put("ymin", a1[1]);
						extents.put("xmax", a2[0]);
						extents.put("ymax", a2[1]);
						json.put("EXTENT", JSON.toJSONString(extents));
						row.getOriginalObjects().remove("WKT");
						json.put("ATTR",JSON.toJSONString(row.getOriginalObjects()));
						json.put(GeomIndexConfig.ID_FIELD, uKey);
						json.put("STATE", State.PERSIST);
						//这里不添加事务,也不会影响数据和业务
						jedis.set(new AttributeIndexKeyGenerator(dataSetName, layerName, uKey).getKey(),JSON.toJSONString(json));
						features.add(json);
					}
				} catch (ServiceException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}finally{
			if(jedis != null) jedis.close();
		}
		
		Set<Feature> filterFeatures = new HashSet<Feature>();
		WKTReader reader = getWktReader();
		String opwkt = GeomOptionHelper.getRectanglePolygonWkt(params.getXmin(),params.getYmin(),params.getXmax(),params.getYmax());
		Geometry originalGeometry = reader.read(opwkt);
		String pwkt = null;
		for(Feature f : features){
			try{
				JSONObject extent = JSONObject.parseObject(f.get("EXTENT").toString());
				pwkt = GeomOptionHelper.getRectanglePolygonWkt(extent.getString("xmin"),extent.getString("ymin"),extent.getString("xmax"),extent.getString("ymax"));
				Geometry geometry = reader.read(pwkt);
				Geometry g = geometry.intersection(originalGeometry);
				if(!g.isEmpty()){
					filterFeatures.add(f);
				}
			}catch(Exception e){
				//有问题的wkt不加入队列
				e.printStackTrace();
				System.out.println(f.get("OID") + "----"+pwkt);
			}
		}
	//	spendTimeUtil.printSpendTime();
		return filterFeatures;
	}

	@Override
	public boolean updateFeature(String dataSetName,String layerName,List<GeomOptParams> params) throws ParseException {
		Jedis jedis = RedisClient.getJedis();
		Map<String,String> id_row = new HashMap<String,String>();
		Map<String,List<String>> delOldData = new HashMap<String,List<String>>();
		jedis.select(GeomOptionHelper.getRedisDbIndex(dataSetName));
		for(int i = 0 ; i < params.size() ; i++){
			GeomOptParams param = params.get(i);
			param.convert();
			GeomOptionHelper.assertWkt(param.getParam("WKT"));
			jedis.select(GeomOptionHelper.getRedisDbIndex(dataSetName));
			List<KeyGenerator> gridIndexKeyGenerators = helper.calcGridIndexsByCoords(dataSetName, layerName,
					param.getParam("xmin_old"), param.getParam("ymin_old"), param.getParam("xmax_old"), param.getParam("ymax_old"));
			String id = param.getParam(GeomIndexConfig.ID_FIELD);
			if(id == null || "".equals(id)){
				throw new ArgumentException("参数"+GeomIndexConfig.ID_FIELD+"为空!");
			}
			String key = new AttributeIndexKeyGenerator(dataSetName,layerName,id).getKey();
			id_row.put(key, jedis.get(key));
			for(KeyGenerator kg : gridIndexKeyGenerators){
				 //清除旧的格子数据 
				 if(delOldData.get(id) == null){
					 delOldData.put(id, new ArrayList<String>());
				 }
				 delOldData.get(id).add(kg.getKey());
			}
		}
		
		for(int i = 0 ; i < params.size() ; i++){
			GeomOptParams param = params.get(i);
			GeomOptionHelper.assertWkt(param.getParam("WKT"));
			List<KeyGenerator> gridIndexKeyGenerators = helper.calcGridIndexsByCoords(dataSetName, layerName,
					param.getXmin(), param.getYmin(), param.getXmax(), param.getYmax());
			String id = param.getParam(GeomIndexConfig.ID_FIELD);
			String key = new AttributeIndexKeyGenerator(dataSetName,layerName,id).getKey();
			 //这里都是新增的
			//属性里面的ATTR
			 JSONObject json = JSONObject.parseObject(id_row.get(key));
			 //修改后的wkt
			 String wkt = param.getParam("WKT").toString();
			 json.put("WKT", wkt);
			 String result = GeomOptionHelper.calExtends(wkt,getWktReader());
			 String[] arr = result.trim().split(",");
			 String[] a1 = arr[0].trim().split(" ");
			 String[] a2 = arr[1].trim().split(" ");
			 Map<String,String> extents = new HashMap<String,String>();
			 extents.put("xmin", a1[0]);
			 extents.put("ymin", a1[1]);
			 extents.put("xmax", a2[0]);
			 extents.put("ymax", a2[1]);
			 json.put("EXTENT", JSON.toJSONString(extents));
			 JSONObject attrMap = json.getJSONObject("ATTR");
			 attrMap.putAll(JSONObject.parseObject(param.getParam("ATTR")));
			 json.put("ATTR",attrMap);
			 if(json.get("STATE").equals(State.PERSIST)){
				json.put("STATE", State.UPDATE);
			 }else{
				 String state = json.getString("STATE");
				 json.put("STATE", state + "," + State.UPDATE);
			 }
			 id_row.put(key, JSON.toJSONString(json));
		}
		List<String> records = new ArrayList<String>();
		Transaction transaction = null;
		try{
			transaction = jedis.multi();
			transaction.select(GeomOptionHelper.getRedisDbIndex(dataSetName));
			Set<String> keys = delOldData.keySet();
			for(String key : keys){
				List<String> gens = delOldData.get(key);
				for(String gen : gens){
					transaction.srem(gen, key);
				}
			}
			for(int j = 0 ; j < params.size() ; j++){
				String record = new String();
				GeomOptParams param = params.get(j);
				String id = param.getParam(GeomIndexConfig.ID_FIELD);
				String key = new AttributeIndexKeyGenerator(dataSetName,layerName,id).getKey();
				List<KeyGenerator> gridIndexKeyGenerators = helper.calcGridIndexsByCoords(dataSetName, layerName,
						param.getXmin(), param.getYmin(), param.getXmax(), param.getYmax());
				for(KeyGenerator kg : gridIndexKeyGenerators){
				   transaction.sadd(kg.getKey(), id);
			    }
			    transaction.set(key,id_row.get(key));
			    JSONObject json = JSONObject.parseObject(id_row.get(key));
			    json.remove("EXTENT");
			    json.put("STATE", State.UPDATE);
	            record = JSON.toJSONString(json) + "=" + key;
			    records.add(record);
			}
			record.doRecord(records);
			transaction.exec();
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}finally{
			try {
				transaction.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			if(jedis != null) jedis.close();
		}
		return true;
	}

	@Override
	public boolean deleteFeature(String dataSetName,String layerName,List<GeomOptParams> params) throws ParseException {
		Jedis jedis = RedisClient.getJedis();
		jedis.select(GeomOptionHelper.getRedisDbIndex(dataSetName));
		List<String> records = new ArrayList<String>();
		Map<String,String> id_row = new HashMap<String,String>();
		for(int i = 0 ; i < params.size() ; i++){
			GeomOptParams param = params.get(i);
			param.convert();
			List<KeyGenerator> gridIndexKeyGenerators = helper.calcGridIndexsByCoords(dataSetName, layerName,
					param.getXmin(), param.getYmin(), param.getXmax(), param.getYmax());
			String id = param.getParam(GeomIndexConfig.ID_FIELD);
			if(id == null || "".equals(id)){
				throw new ArgumentException("参数"+GeomIndexConfig.ID_FIELD+"为空!");
			}
			AttributeIndexKeyGenerator gen = new AttributeIndexKeyGenerator(dataSetName,layerName,id);
			JSONObject json = JSONObject.parseObject(jedis.get(gen.getKey()));
			if(json.get("STATE").equals(State.PERSIST)){
				json.put("STATE", State.DEL);
			}else{
				String state = json.getString("STATE");
				json.put("STATE", state + "," + State.DEL);
			}
			id_row.put(gen.getKey(),JSONObject.toJSONString(json) );
		}
		Transaction transaction = null;
		try{
			transaction = jedis.multi();
			transaction.select(GeomOptionHelper.getRedisDbIndex(dataSetName));
			for(int j = 0 ; j < params.size() ; j++){
				String record = new String();
				GeomOptParams param = params.get(j);
				List<KeyGenerator> gridIndexKeyGenerators = helper.calcGridIndexsByCoords(dataSetName, layerName,
						param.getXmin(), param.getYmin(), param.getXmax(), param.getYmax());
				String id = param.getParam(GeomIndexConfig.ID_FIELD);
				String key = new AttributeIndexKeyGenerator(dataSetName,layerName,id).getKey();
			    for(KeyGenerator kg : gridIndexKeyGenerators){
				   transaction.srem(kg.getKey(), id);
			    }
			    transaction.set(key,id_row.get(key));
			    JSONObject json = JSONObject.parseObject(id_row.get(key));
			    json.remove("EXTENT");
			    json.put("STATE", State.DEL);
	            record = JSON.toJSONString(json) + "=" + key;
			    records.add(record);
			}
			record.doRecord(records);
			transaction.exec();
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}finally{
			try {
				transaction.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			if(jedis != null) jedis.close();
		}
		return true;
	}

	@Override
	public List<String> addFeature(String dataSetName,String layerName,List<GeomOptParams> params) {
		List<String> results = new ArrayList<String>();
		Jedis jedis = RedisClient.getJedis();
		Transaction transaction = null;
		try{  
			partitionSchema.setSchemaByZQCode(dataSetName.substring(0,2));
			transaction = jedis.multi();
			transaction.select(GeomOptionHelper.getRedisDbIndex(dataSetName));
			List<String> records = new ArrayList<String>();
 			for(int j = 0 ; j < params.size() ; j++){
 				String record = new String();
				GeomOptParams param = params.get(j);
				param.convert();
				GeomOptionHelper.assertWkt(param.getParam("WKT"));
				List<KeyGenerator> gridIndexKeyGenerators = helper.calcGridIndexsByCoords(dataSetName, layerName,
						param.getXmin(), param.getYmin(), param.getXmax(), param.getYmax());
				IMetadataTable table = baseService.openTable(layerName);
				MetadataField[] mf = table.getKeyFields();
				String idField = mf[0].getFieldName();
				String idx = String.valueOf(table.getWorkspace().getExecuteScalar("select sde.GDB_UTIL.NEXT_ROWID('LDGX_36_JIANGXI','ZYJG_BHTB') OID from dual", new GlobalParameter[0]));
				Feature json = new Feature();
				String wkt = param.getParam("WKT").toString();
				json.put("WKT", wkt);
				String result = GeomOptionHelper.calExtends(wkt,getWktReader());
				String[] arr = result.trim().split(",");
				String[] a1 = arr[0].trim().split(" ");
				String[] a2 = arr[1].trim().split(" ");
				Map<String,String> extents = new HashMap<String,String>();
				extents.put("xmin", a1[0]);
				extents.put("ymin", a1[1]);
				extents.put("xmax", a2[0]);
				extents.put("ymax", a2[1]);
				json.put("EXTENT", JSON.toJSONString(extents));
				json.put("OID", idx);
				results.add(idx);
				JSONObject attr = JSONObject.parseObject(param.getParam("ATTR"));
				attr.put(idField, idx);
				json.put("ATTR",attr);
				json.put("STATE", State.ADD);
	            for(KeyGenerator kg : gridIndexKeyGenerators){
	            	transaction.sadd(kg.getKey(),idx);
	    		}
	            String key = new AttributeIndexKeyGenerator(dataSetName,layerName,idx).getKey();
	            transaction.set(key,JSONObject.toJSONString(json));
	            json.remove("EXTENT");
	            record = JSON.toJSONString(json) + "=" + key;
	            records.add(record);
			}
 			synchronized(this){
 				record.doRecord(records);
 			}
			transaction.exec();  
		}catch (Exception e) {  
        	e.printStackTrace();
        	return results;
        }finally{
        	try {
				transaction.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        	if(jedis != null) jedis.close();
        }
		
		return results;
	}

	@Override
	public List<JSONObject> multiOptFeature(String dataSetName, String layerName,
			List<GeomOptParams> params) throws ParseException {
		// TODO Auto-generated method stub
		List<JSONObject> results = new ArrayList<JSONObject>();
		Jedis jedis = RedisClient.getJedis();
		jedis.select(GeomIndexConfig.REDIS_DB_FOR_RECORD);
		double current_record_idx = jedis.incrByFloat(GeomIndexConfig.CURRENT_RECORD_IDX,1d);
		Transaction transaction = null;
		//用过删除逻辑
		Map<String,JSONObject> delObjectMap = new HashMap<String,JSONObject>();
		//用作更新逻辑
		Map<String,JSONObject> id_row = new HashMap<String,JSONObject>();
		Map<String,List<String>> delOldData = new HashMap<String,List<String>>();
		
		for(int i = 0 ; i < params.size() ; i++){
			jedis.select(GeomOptionHelper.getRedisDbIndex(dataSetName));
			GeomOptParams param = params.get(i);
			param.convert();
			String opt = param.getParam("opt");
			if(opt.equals(State.DEL)){
				String id = param.getParam(GeomIndexConfig.ID_FIELD);
				List<KeyGenerator> gridIndexKeyGenerators = helper.calcGridIndexsByCoords(dataSetName, layerName,
						param.getXmin(), param.getYmin(), param.getXmax(), param.getYmax());
				for(KeyGenerator kg : gridIndexKeyGenerators){
					String attr = jedis.hget(kg.getKey(), id);
					JSONObject json = JSONObject.parseObject(attr);
					if(json.get("STATE").toString().indexOf("{") >= 0){
						JSONObject m = JSONObject.parseObject(json.get("STATE").toString());
						m.put(String.valueOf(current_record_idx), State.DEL);
						json.put("STATE", m);
					}else{
						JSONObject stateMap = new JSONObject();
						stateMap.put(String.valueOf(current_record_idx), State.DEL);
						json.put("STATE", stateMap);
					}
					delObjectMap.put(kg.getKey()+":"+id,json);
				}
			}else if(opt.equals(State.UPDATE)){
				GeomOptionHelper.assertWkt(param.getParam("WKT"));
				jedis.select(GeomOptionHelper.getRedisDbIndex(dataSetName));
				List<KeyGenerator> gridIndexKeyGenerators = helper.calcGridIndexsByCoords(dataSetName, layerName,
						param.getParam("xmin_old"), param.getParam("ymin_old"), param.getParam("xmax_old"), param.getParam("ymax_old"));
				String id = param.getParam(GeomIndexConfig.ID_FIELD);
				if(id == null || "".equals(id)){
					throw new ArgumentException("参数"+GeomIndexConfig.ID_FIELD+"为空!");
				}
				for(KeyGenerator kg : gridIndexKeyGenerators){
					 String attr = jedis.hget(kg.getKey(), id);
					 if(attr == null){
						 throw new ArgumentException("OID = "+id+"---->在redis中找不到相关的记录!");
					 }
					 JSONObject json = JSONObject.parseObject(attr);
					 id_row.put(id, json);
					 //清除旧的格子数据 
					 if(delOldData.get(id) == null){
						 delOldData.put(id, new ArrayList<String>());
					 }
					 delOldData.get(id).add(kg.getKey());
				}
			}
		}
		try{  
			partitionSchema.setSchemaByZQCode(dataSetName.substring(0,2));
			transaction = jedis.multi();
			FeatureChangeRecord featureRecord = new FeatureChangeRecordedInRedis(transaction);
			List<String> record = new ArrayList<String>();
			for(int i = 0 ; i < params.size() ; i++){
				JSONObject result = new JSONObject();
				results.add(result);
				transaction.select(GeomOptionHelper.getRedisDbIndex(dataSetName));
				GeomOptParams param = params.get(i);
				String opt = param.getParam("opt");
				List<KeyGenerator> gridIndexKeyGenerators = helper.calcGridIndexsByCoords(dataSetName, layerName,
						param.getXmin(), param.getYmin(), param.getXmax(), param.getYmax());
				result.put("opt", opt);
				if(opt.equals(State.ADD)){
					IMetadataTable table = baseService.openTable(layerName);
					MetadataField[] mf = table.getKeyFields();
					String idField = mf[0].getFieldName();
					String idx = String.valueOf(table.getWorkspace().getExecuteScalar("select sde.GDB_UTIL.NEXT_ROWID('LDGX_36_JIANGXI','ZYJG_BHTB') OID from dual", new GlobalParameter[0]));
					GeomOptionHelper.assertWkt(param.getParam("WKT"));
					Feature json = new Feature();
					String wkt = param.getParam("WKT").toString();
					json.put("WKT", wkt);
					String ext = GeomOptionHelper.calExtends(wkt,getWktReader());
					String[] arr = ext.trim().split(",");
					String[] a1 = arr[0].trim().split(" ");
					String[] a2 = arr[1].trim().split(" ");
					Map<String,String> extents = new HashMap<String,String>();
					extents.put("xmin", a1[0]);
					extents.put("ymin", a1[1]);
					extents.put("xmax", a2[0]);
				  	extents.put("ymax", a2[1]);
				 	json.put("EXTENT", JSON.toJSONString(extents));
					json.put(GeomIndexConfig.ID_FIELD, idx);
					result.put(GeomIndexConfig.ID_FIELD, idx);
					JSONObject attr = JSONObject.parseObject(param.getParam("ATTR"));
					attr.put(idField, idx);
					json.put("ATTR",attr);
					JSONObject stateObj = new JSONObject();
					stateObj.put(String.valueOf(current_record_idx), State.ADD);
					json.put("STATE", stateObj);
					 for(KeyGenerator kg : gridIndexKeyGenerators){
						//记录新增
						record.add(kg.getKey() + "|" + idx);
		            	transaction.hset(kg.getKey(),idx,JSON.toJSONString(json));
		    		 }
				}else if(opt.equals(State.DEL)){
					String id = param.getParam(GeomIndexConfig.ID_FIELD);
					for(KeyGenerator kg : gridIndexKeyGenerators){
						//记录删除
						record.add(kg.getKey() + "|" + id);
		             	transaction.hset(kg.getKey(),id,JSONObject.toJSONString(delObjectMap.get(kg.getKey()+":"+id)));
		    		}
					result.put(GeomIndexConfig.ID_FIELD, id);
				}else if(opt.equals(State.UPDATE)){
					Map<String,String> tmp = new HashMap<String,String>();
					String oid = param.getParam(GeomIndexConfig.ID_FIELD);
					for(KeyGenerator kg : gridIndexKeyGenerators){
						 //这里都是新增的
						//属性里面的ATTR
						 JSONObject json = id_row.get(oid);
						 //修改后的wkt
						 String wkt = param.getParam("WKT").toString();
						 json.put("WKT", wkt);
						 JSONObject attrMap = json.getJSONObject("ATTR");
						 //修改后的属性
						 attrMap.putAll(JSONObject.parseObject(param.getParam("ATTR")));
						 json.put("ATTR",attrMap);
						 String ext = GeomOptionHelper.calExtends(wkt,getWktReader());
						 String[] arr = ext.trim().split(",");
						 String[] a1 = arr[0].trim().split(" ");
						 String[] a2 = arr[1].trim().split(" ");
						 Map<String,String> extents = new HashMap<String,String>();
						 extents.put("xmin", a1[0]);
						 extents.put("ymin", a1[1]);
						 extents.put("xmax", a2[0]);
					  	 extents.put("ymax", a2[1]);
					 	 json.put("EXTENT", JSON.toJSONString(extents));
						 if(json.get("STATE").toString().indexOf("{") >= 0){
							JSONObject m = JSONObject.parseObject(json.get("STATE").toString());
							m.put(String.valueOf(current_record_idx), State.UPDATE);
							json.put("STATE", m);
						 }else{
							 JSONObject stateMap = new JSONObject();
							 stateMap.put(String.valueOf(current_record_idx), State.UPDATE);
							 json.put("STATE", stateMap);
						 }
						 tmp.put(kg.getKey()+":"+oid, JSON.toJSONString(json));
					}
					
					Set<String> keys = delOldData.keySet();
					for(String key : keys){
						List<String> gens = delOldData.get(key);
						for(String gen : gens){
							transaction.hdel(gen, key);
						}
					}
				    for(KeyGenerator kg : gridIndexKeyGenerators){
					   record.add(kg.getKey() + "|" + oid);
					   transaction.hset(kg.getKey(), oid,tmp.get(kg.getKey()+":"+oid).toString());
				    }
				    result.put(GeomIndexConfig.ID_FIELD, oid);
				}
			}
			// featureRecord.doRecord(record,current_record_idx);
			 transaction.exec();
		}catch (Exception e) {  
        	e.printStackTrace();
        	return results;
        }finally{
        	try {
				transaction.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        	if(jedis != null) jedis.close();
        }
		return results;
	}

}
