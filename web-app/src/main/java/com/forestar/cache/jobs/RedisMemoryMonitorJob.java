package com.forestar.cache.jobs;


import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import redis.clients.jedis.Jedis;

import com.alibaba.fastjson.JSONObject;
@Service("redisMemoryMonitorJob")
public class RedisMemoryMonitorJob implements Job{

	@Override
	public void hanldeJob() {
		// TODO Auto-generated method stub
		Jedis jedis = new Jedis("localhost",6379);
		Set<String> num = new HashSet();
		for(int i = 1 ; i <= 34 ; i++ ){
			jedis.select(i);
			Set<String> keys = jedis.keys("*");
			for(String gridIndexKeyGenerator : keys){
				Map<String,String> gridIndexValueMap = jedis.hgetAll(gridIndexKeyGenerator);
				Set<String> oids = gridIndexValueMap.keySet();
				for(String oid : oids){
					num.add(oid);
					String val = gridIndexValueMap.get(oid);
					if(val != null && !"".equals(val)){
						JSONObject obj = JSONObject.parseObject(val);
						String state = obj.get("STATE") == null ? "" :  obj.get("STATE").toString();
						if("".equals(state) || "persist".equals(state)){
							if(obj.get("TIME") != null){
								long creatTime = -1;
								try{
									creatTime = Long.parseLong(obj.get("TIME").toString());
								}catch(Exception e){
									e.printStackTrace();
								}
								if(creatTime > 0){
									long curTime = System.currentTimeMillis();
									long time = (curTime - creatTime) / 1000;
									System.out.println(gridIndexKeyGenerator+"---"+oid+"-----"+time + "----"+state);
								//	jedis.hset(gridIndexKeyGenerator, oid,"");
								}
							}
						}
					}
				}
			}
		}
		System.out.println(num.size());
	}
	
	public static void main(String[] args) {
		RedisMemoryMonitorJob job = new RedisMemoryMonitorJob();
		job.hanldeJob();
	}

}
