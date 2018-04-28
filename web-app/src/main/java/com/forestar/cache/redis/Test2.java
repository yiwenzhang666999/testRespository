package com.forestar.cache.redis;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.Response;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKBReader;
import com.vividsolutions.jts.io.WKTReader;

public class Test2 {

	private static List<Jedis> conns = new ArrayList<Jedis>();
	
	private static GeometryFactory gf = new GeometryFactory();
	
	public static void test1() throws ParseException{
		// 点
		WKTReader reader = new WKTReader(gf);
		String  pointStr = reader.read("POLYGON  (( 114.11054878 27.55481849, 114.10656523 27.55406570, 114.11229113 27.55186866, 114.11207848 27.55435809, 114.11572011 27.55326207, 114.11134274 27.55875524, 114.10687955 27.55592282, 114.11054878 27.55481849))").getEnvelope().toText();
		String t = pointStr.substring(pointStr.indexOf("((")+2,pointStr.indexOf("))"));
		String[] arr = t.split(",");
		System.out.println(arr[0]+"----"+arr[2]);
			
	}
	
	public static void test2(){
		for(int i = 0 ; i < 1000; i++){
			//RedisClient.getJedis();
			Jedis jedis = new Jedis("localhost",6379);
			jedis.connect();
			System.out.println(i);
			//jedis.close();
		}
		try {
			Thread.sleep(500000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void test3(){
		HashSet<Feature> s = new HashSet<Feature>();
		Feature f1 = new Feature();
		f1.put("OID", "1");
		f1.put("name", "songyi");
		Feature f2 = new Feature();
		f2.put("OID", "1");
		s.add(f1);
		s.add(f2);
		System.out.println(s);
	}
	
	public static void test4(){
		final Test2  inst = new Test2();
		for(int i = 0 ; i < 100; i++){
			new Thread(new Runnable(){
				@Override
				public void run() {
					// TODO Auto-generated method stub
					inst.read("aaaa"+ new Random().nextInt(100));
				}
				
			}).start();
		}
	}
	
	public void read(String wellKnownText){
		 StringReader reader = new StringReader(wellKnownText);
	     try {
	    	 int a = 100;
	    	 System.out.println(Thread.currentThread()+"222");
	     } 
	     finally { 
	    	reader.close();
	     }
	}
	
	public static void test5(){
		Jedis redis = RedisClient.getJedis();
		SpendTimeUtil u = new SpendTimeUtil();
		redis.select(14);
		Set<String> keys = redis.keys("*");
		for(String key : keys){
			Map<String,String> gridIndexValueMap = redis.hgetAll(key);
		}
		u.printSpendTime();
	}
	
	public static void test6(){
		Map<String,Map<String,String>> result = new HashMap<String,Map<String,String>>();
		Jedis redis = RedisClient.getJedis();
		redis.select(14);
		Set<String> keys = redis.keys("*");
		Pipeline pipeline = redis.pipelined();
		Map<String,Response<Map<String,String>>> responses = new HashMap<String,Response<Map<String,String>>>(keys.size());
		for(String key : keys){
			responses.put(key, pipeline.hgetAll(key));
		}
		pipeline.sync();
		for(String k : responses.keySet()) {
             result.put(k, responses.get(k).get());
        }
	}
	
	public static void test7(){
		Jedis redis = RedisClient.getJedis();
		redis.select(14);
		String content =  redis.get("360323:ZYJG_BHTB:24150");
		System.out.println(content);
	}
	
	public static void test8(){
		GeometryFactory geometryFactory  = new GeometryFactory();
		WKBReader wkb = new WKBReader(geometryFactory);
		Geometry geo;
		try {
			geo = wkb.read("POLYGON  (( 114.06086060 27.56974823, 114.06056019 27.56781704, 114.06154724 27.56755954, 114.06086060 27.56974823))".getBytes());
			System.out.println(geo);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) throws ParseException {
		long start = System.currentTimeMillis();
		test8();
		long end = System.currentTimeMillis();
		System.out.println("用时:"+(end - start) + "ms");
	}
}
