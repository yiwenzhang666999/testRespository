package com.forestar.cache.jobs;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Transaction;

import com.alibaba.fastjson.JSONObject;
import com.forestar.cache.redis.GeneralGeomOption;
import com.forestar.cache.redis.GeomIndexConfig;
import com.forestar.cache.redis.GeomOptionHelper;
import com.forestar.cache.redis.GridIndexKeyGenerator;
import com.forestar.cache.redis.RedisClient;
import com.forestar.cache.redis.State;
import com.forestar.core.exception.ServiceException;
import com.forestar.data.general.QueryFilter;
import com.forestar.data.general.RowBase;
import com.forestar.data.metadata.IMetadataTable;
import com.forestar.data.metadata.MetadataField;
import com.forestar.data.metadata.PartitionSchema;
import com.forestar.data.service.BaseService;
@Service("redisSynchronizeDBJob")
public class RedisSynchronizeDBJob implements Job{

	private Logger log = Logger.getLogger(GeneralGeomOption.class);
	@Autowired
	PartitionSchema partitionSchema;
	@Autowired
	BaseService baseService;
	
	@PostConstruct  
	public void startJob(){
		Timer timer = new Timer();
		// 相对时间法。比如，如果第一次任务是1分10秒执行的，周期为5秒，因系统繁忙（比如垃 圾回收、虚拟内存切换），1分15秒没有得到机会执行，直到1分16秒才有机会执行第二次任务，那么第3次的执行时间将是1分21秒，偏移了1秒。
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				// TODO Auto-generated method stub
				//RedisSynchronizeDBJob.this.hanldeJob();
			}
		}, 10000, 300000);
	}
	
	@SuppressWarnings({ "unchecked", "null", "rawtypes" })
	@Override
	public synchronized void hanldeJob() {
			// TODO Auto-generated method stub
			Jedis redis = RedisClient.getJedis();
			redis.select(GeomIndexConfig.REDIS_DB_FOR_RECORD);
			String current_record_idx_handled = redis.get(GeomIndexConfig.CURRENT_RECORD_IDX_HANDLED);
			if(current_record_idx_handled == null || "".equals(current_record_idx_handled)){
				current_record_idx_handled = "0";
				redis.set(GeomIndexConfig.CURRENT_RECORD_IDX_HANDLED,current_record_idx_handled);
			}
			String current_record_idx = redis.get(GeomIndexConfig.CURRENT_RECORD_IDX);
			if(current_record_idx == null || "".equals(current_record_idx)){
				return;
			}
			//开始执行任务
			double cur = Double.parseDouble(current_record_idx);
			double has = Double.parseDouble(current_record_idx_handled);
			Set<String> records = redis.zrangeByScore(GeomIndexConfig.RECORD, has+1, cur);
			JobRecordParse parse = new JobRecordParse();
			try{
				for(String recordString : records){
					JobRecords jobRecords = parse.parse(recordString);
					List<JobRecord> jobs = jobRecords.getInnerJobs();
					Map<String,List<String>> map = new HashMap<String,List<String>>();
					for(JobRecord job : jobs){
						GridIndexKeyGenerator gen = new GridIndexKeyGenerator(job.getDatasetName(), job.getLayerName(), job.getCol(), job.getRow());
						if(map.get(job.getIndexIdx()) == null){
							map.put(job.getIndexIdx(),new ArrayList<String>());
						}
						map.get(job.getIndexIdx()).add(gen.getKey());
					}
					Set<String> keys = map.keySet();
					//indexIdx可以落在多个格子里面，只处理一个格子的数据即可，更新state的时候，需要更新所有格子的数据
					Transaction transaction = null;
					String dataSetName = jobs.get(0).getDatasetName();
					redis.select(GeomOptionHelper.getRedisDbIndex(dataSetName));
					String layerName = jobs.get(0).getLayerName();
					partitionSchema.setSchemaByZQCode(dataSetName.substring(0,2));
					IMetadataTable iTable = null;
					Map<String,JSONObject> keyAttrs = new HashMap<String,JSONObject>();
					for(String key_ : keys){
						String gen = map.get(key_).get(0);
						String data  = redis.hget(gen,key_);
						JSONObject obj = JSONObject.parseObject(data);
						keyAttrs.put(key_, obj);
					}
					try {
						iTable = baseService.openTable(layerName);
						iTable.startEditing();
						transaction = redis.multi();
						log.info(Thread.currentThread()+"----执行任务队列序号:"+jobRecords.getRecordIdx());
						for(String key : keys){
							//key就是oid
							JSONObject obj = keyAttrs.get(key);
							Object state = obj.get("STATE");
							if(state != null && !State.PERSIST.equals(state)){
								JSONObject s = JSONObject.parseObject(state.toString());
								state = s.get(jobRecords.getRecordIdx());
								//数据库事务和redis事务同时开启
								if(State.ADD.equals(state)){
									MetadataField[] mf = iTable.getKeyFields();
									String idField = mf[0].getFieldName();
									RowBase row = new RowBase();
									String oid = obj.getString(GeomIndexConfig.ID_FIELD);
									log.info(Thread.currentThread()+"----执行操作:"+state+",开始处理处理数据库记录:"+key+",新的ID为："+oid);
									HashMap currentObject = new HashMap();
									currentObject.put("C_XIAN", "360323");
									currentObject.put("C_XIANNAME", "haha");
									currentObject.put(idField, oid.toString());
									currentObject.put("C_OBJINFO", obj.get("WKT").toString());
									row.setCurrentObjects(currentObject);
									iTable.save(row);
									obj.put(GeomIndexConfig.ID_FIELD, oid.toString());
									if(obj.get("STATE") != null && obj.get("STATE").toString().indexOf("{") >= 0){
										JSONObject stateMap = JSONObject.parseObject(obj.get("STATE").toString());
										if(stateMap.keySet().size() > 1){
											stateMap.put(jobRecords.getRecordIdx(), State.DONE);
											obj.put("STATE", stateMap);
										}else{
											obj.put("STATE", State.PERSIST);
										}
									}else{
										obj.put("STATE", State.PERSIST);
									}
									JSONObject o = obj.getJSONObject("ATTR");
									o.put(idField, oid.toString());
									obj.put("ATTR",o);
									obj.put("TIME", System.currentTimeMillis());
									List<String> geomIndexs = map.get(key);
									for(String geomIndex : geomIndexs){
										transaction.hdel(geomIndex, key);
									}
									for(String geomIndex : geomIndexs){
										transaction.hset(geomIndex, oid.toString(), JSONObject.toJSONString(obj));
									}
								}else if(State.DEL.equals(state)){
									log.info(Thread.currentThread()+"----执行操作:"+state+",开始删除数据库记录:"+key);
									MetadataField[] mf = iTable.getKeyFields();
									String idField = mf[0].getFieldName();
									QueryFilter df = new QueryFilter();
									df.setWhereString(idField + " = " + key);
									iTable.delete(df);
									List<String> geomIndexs = map.get(key);
									for(String geomIndex : geomIndexs){
										transaction.hset(geomIndex, key,"");
									}
								}else if(State.UPDATE.equals(state)){
									MetadataField[] mf = iTable.getKeyFields();
									String idField = mf[0].getFieldName();
									String oid = obj.getString(GeomIndexConfig.ID_FIELD);
									log.info(Thread.currentThread()+"----执行操作:"+state+",开始更新处理数据库记录:"+oid);
									RowBase row = new RowBase();
									HashMap currentObject = new HashMap();
									HashMap originalObject = new HashMap();
									originalObject.put(idField, oid);
									currentObject.putAll(obj.getJSONObject("ATTR"));
									currentObject.put("C_OBJINFO", obj.get("WKT").toString());
									row.setOriginalObjects(originalObject);
									row.setCurrentObjects(currentObject);
									iTable.save(row);
									if(obj.get("STATE") != null && obj.get("STATE").toString().indexOf("{") >= 0){
										JSONObject stateMap = JSONObject.parseObject(obj.get("STATE").toString());
										if(stateMap.keySet().size() > 1){
											stateMap.put(jobRecords.getRecordIdx(), State.DONE);
											obj.put("STATE", stateMap);
										}else{
											obj.put("STATE", State.PERSIST);
										}
									}else{
										obj.put("STATE", State.PERSIST);
									}
									obj.put("TIME", System.currentTimeMillis());
									List<String> geomIndexs = map.get(key);
									for(String geomIndex : geomIndexs){
										transaction.hset(geomIndex, oid.toString(), JSONObject.toJSONString(obj));
									}
								}
							}
						}
						transaction.select(GeomIndexConfig.REDIS_DB_FOR_RECORD);
						//处理过的记录增加1
						transaction.incrByFloat(GeomIndexConfig.CURRENT_RECORD_IDX_HANDLED,1d);
						//删除有序集合的键
						transaction.zrem(GeomIndexConfig.RECORD,recordString);
						iTable.stopEditing(true);
						transaction.exec();
						log.info(Thread.currentThread()+"----执行任务队列序号:"+jobRecords.getRecordIdx()+"(完成)");
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
						log.error(Thread.currentThread()+"----执行任务队列序号:"+jobRecords.getRecordIdx()+"(失败)");
						if(transaction != null){
							transaction.select(GeomIndexConfig.REDIS_DB_FOR_RECORD);
							//处理过的记录增加1
							transaction.incrByFloat(GeomIndexConfig.CURRENT_RECORD_IDX_HANDLED,1d);
							transaction.zadd(GeomIndexConfig.RECORD,-1,jobRecords.getRecordString());
							transaction.exec();
						}
						try {
							iTable.stopEditing(false);
						} catch (ServiceException e1) {
							// TODO Auto-generated catch block
							e1.printStackTrace();
						}
					}finally{
						try {
							transaction.close();
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						
					}
				}
			}finally{
				if(redis != null) redis.close();
			}
		
	}
	
	public static void main(String[] args) {
		RedisSynchronizeDBJob job = new RedisSynchronizeDBJob();
		job.hanldeJob();
	}


}
