package com.forestar.cache.redis;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import redis.clients.jedis.Transaction;

public class FeatureChangeRecordedInRedis implements FeatureChangeRecord{

	private Transaction transaction;
	
	public FeatureChangeRecordedInRedis(Transaction transaction){
		this.transaction = transaction;
	}
	
	@Override
	public void doRecord(List<String> record) {
		double idx = 0;
		// TODO Auto-generated method stub
		this.transaction.select(GeomIndexConfig.REDIS_DB_FOR_RECORD);
	//	this.transaction.incr(GeomIndexConfig.CURRENT_RECORD_IDX);
		Map<String,Double> m = new HashMap<String,Double>();
		String keys = String.valueOf(idx)+"=";
		for(String k : record){
			keys +=  k + ",";
		}
		keys = keys.substring(0,keys.length() - 1);
		m.put(keys, idx);
		this.transaction.zadd(GeomIndexConfig.RECORD, m);
	}

}
