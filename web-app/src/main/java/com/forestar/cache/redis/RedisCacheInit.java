package com.forestar.cache.redis;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import oracle.sql.BLOB;
import oracle.sql.CLOB;
import oracle.sql.STRUCT;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Transaction;

import com.alibaba.fastjson.JSONObject;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.io.InStream;
import com.vividsolutions.jts.io.InputStreamInStream;
import com.vividsolutions.jts.io.WKBReader;
import com.vividsolutions.jts.io.WKTReader;


public class RedisCacheInit {

	public static Connection getConnection() throws Exception{
		Connection conn = null;
		Class.forName("oracle.jdbc.driver.OracleDriver");//找到oracle驱动器所在的类
		String url = "jdbc:oracle:thin:@192.168.1.171:1521:lydb"; //URL地址
		String username = "ldgx_36_jiangxi";
		String password = "ldgx_36_jiangxi";
		conn = DriverManager.getConnection(url, username, password);
		return conn;
	}
	

	  public static String Clob2String(Clob clob)
	  {
	    String content = null;
	    StringBuffer stringBuf = new StringBuffer();
	    try {
	      int length = 0;
	      Reader inStream = clob.getCharacterStream();                          
	      char[] buffer = new char[10];
	      while ((length = inStream.read(buffer)) != -1)
	      {
	        for (int i = 0; i < length; i++) {
	          stringBuf.append(buffer[i]);
	        }
	      }

	      inStream.close();
	      content = stringBuf.toString();
	    } catch (Exception ex) {
	      ex.printStackTrace();
	    }
	    return content;
	  }
	
	public static void buildFeaturesCache(String dataSetName,String layerName,String idField){
		GeomOptionHelper helper = new GeomOptionHelper();
		Jedis jedis = RedisClient.getJedis();
		jedis.flushAll();
		System.out.println("这里清空了数据库，生产的时候这行代码要去掉！");
		jedis.select(GeomOptionHelper.getRedisDbIndex(dataSetName));
		List<Map<String,Object>> fs = new ArrayList<Map<String,Object>>();
		Connection conn = null;
		Statement state = null;
		ResultSet rs = null;
		try {
			conn =  getConnection();
			state = conn.createStatement();
			rs = state.executeQuery("select "+idField+",sde.st_envelope(shape) as STRUCT,sde.st_asbinary(shape) as BINARY from ZYJG_BHTB where C_XIAN = '360323'");
			ResultSetMetaData metaData =  rs.getMetaData();
			int num = metaData.getColumnCount();
			while(rs.next()){
				Map<String,Object> map = new HashMap<String,Object>();
				for(int i = 0 ; i < num ; i++){
					String colName = metaData.getColumnName(i+1);
					Object v = rs.getObject(i+1);
					if(colName.equals("STRUCT")){
						if(v != null){
							Object[] vs = ((STRUCT)v).getAttributes();
							map.put("xmin", vs[2]);
							map.put("ymin", vs[3]);
							map.put("xmax", vs[4]);
							map.put("ymax", vs[5]);
						}
					}else if(colName.equals("BINARY")){
						BLOB b = (BLOB)v;
						b.getBytes(0L,1);
						GeometryFactory geometryFactory  = new GeometryFactory();
						WKBReader wkb = new WKBReader(geometryFactory);
						InputStream is = b.getBinaryStream();
						InStream ist = new InputStreamInStream(is);
						try{
							Geometry geo = wkb.read(ist);
							System.out.println(geo.toString());
						}catch(Exception e){
							e.printStackTrace();
						}finally{
							if(is != null){
								is.close();
							}
						}
					}else{
						map.put(colName, v);
					}
				}
				if(map.containsKey("xmin")){
					fs.add(map);
				}
			}
			Transaction transaction = null;
			try{
				transaction = jedis.multi();
				for(int i = 0; i < fs.size(); i++){
					Map<String,Object> m = fs.get(i);
					List<KeyGenerator> gridIndexKeyGenerators = helper.calcGridIndexsByCoords(dataSetName, layerName,
							m.get("xmin").toString(), m.get("ymin").toString(), m.get("xmax").toString(), m.get("ymax").toString());
					JSONObject onlyExtents = new JSONObject();
					Map<String,String> extents = new HashMap<String,String>();
					extents.put("xmin", m.get("xmin").toString());
					extents.put("ymin", m.get("ymin").toString());
					extents.put("xmax", m.get("xmax").toString());
					extents.put("ymax", m.get("ymax").toString());
					onlyExtents.put("EXTENT", extents);
					for(KeyGenerator gen : gridIndexKeyGenerators){
						//transaction.hset(gen.getKey(), m.get(idField).toString(),JSONObject.toJSONString(onlyExtents));
						transaction.sadd(gen.getKey(), m.get(idField).toString());
					}
				}
				transaction.exec();
			}catch(Exception e){
				e.printStackTrace();
			}finally{
				try {
					transaction.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			if(rs != null){
				try {
					rs.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if(state != null){
				try {
					state.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if(conn != null){
				try {
					conn.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}
	
	public static void main(String[] args) {
		long start = System.currentTimeMillis();
		String dataSetName = "360323";
		String layerName = "ZYJG_BHTB";
		String idField = "ID";
		buildFeaturesCache(dataSetName,layerName,idField);
		long end = System.currentTimeMillis();
		System.out.println((end - start)+"ms");
	}
}
