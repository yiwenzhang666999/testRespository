package com.forestar.cache.redis;

import java.util.HashMap;
import java.util.Map;

import redis.clients.jedis.Jedis;

public class Test {
	public static void main(String[] args) throws InterruptedException {
		Jedis redis = RedisClient.getJedis();
	//	redis.flushAll();
		/*Transaction t = redis.multi();
		for(int i = 0 ; i < 2; i++){
			t.set("name"+i, "aaa"+i);
		}
		t.exec();*/
		/*	t.set("test", "123");
		t.set("test", "234");
		System.out.println(t.exec().get(0));*/
		Map<String,String> m = new HashMap<String,String>();
		m.put("q", "1");
		m.put("w", "2");
		m.put("e", "3");
		m.put("r", "4");
	//	redis.hmset("map", m);
	//	redis.hdel("map", "q");
		//redis.zadd("record2", m);
	//	redis.zrem("record2", "q");
	//	redis.zadd("record", 2,"2.0=360323:ZYJG_BHTB:1898_460|7025");
		//System.out.println(redis.zrangeByScore("record2", 1, 3));
		//System.out.println(redis.clientList());
		/*int num = 100;
		while(num-- > 0){
			Jedis redis = RedisClient.getJedis();
			System.out.println(num+"-----"+redis);
		}*/
		/*ScanParams params = new ScanParams();
		params.match("*forestar*");
		//redis.set("forestar1", "123");
		//redis.set("2forestar", "dddd");
		ScanResult result = redis.scan(0,params);
		int cursor = result.getCursor();
		System.out.println(cursor);
		List list = result.getResult();
		for(Object o : list){
			System.out.println(o);
		}
		Transaction t = redis.multi();
		t.select(0);
		t.set("name", "songy2");
		t.select(1);
		int a = 3/0;
		t.set("name", "yaofangfang2");
		t.exec();*/
		//redis.set("name", "songyi");
		/*for(float i = 1.0f; i < 10000.0 ; i++){
			System.out.println(i - 1);
		}*/
		/*Jedis jedis = new Jedis("localhost",6379);
		jedis.connect();*/
		redis.select(14);
		System.out.println(redis.smembers("360323:ZYJG_BHTB:3798_919"));
		String[] strs = "360323:ZYJG_BHTB:3798".split(":");
		for(String str : strs){
			System.out.println(str);
		}
	}
}
