package com.forestar.util;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import com.forestar.core.Config;

public class Util {
	private static final String DEFAULT_FORMAT = "yyyy-MM-dd HH:mm:ss";  
	public static String getDefineND(){
		String result = "";
		//获取当前日期
		Date date = new Date();
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		//获取当前年度
		int year = c.get(Calendar.YEAR);
		int month_start = Integer.parseInt(Config.getValue("defineNd_start"));
		int month_end = Integer.parseInt(Config.getValue("defineNd_end"));
		//获取当前也分
		int month = c.get(Calendar.MONTH)+1;
		if(month>month_start){
			result = String.valueOf(year);
		}
		if(month<=month_end){
			result = String.valueOf(year-1);
		}
		return result;
	}
	public static String queryZqByPoint(String x,String y){
        String url = Config.getValue("spaceQuery")+"/rest/LS/address/5/"+x+"/"+y;
        String jsonResult = httpGet(url);
        return jsonResult;
	};
	public static String httpGet(String url){
		//get请求返回结果
        String jsonResult = "";
		try {
            DefaultHttpClient client = new DefaultHttpClient();
            //发送get请求
            HttpGet request = new HttpGet(url);
            HttpResponse response = client.execute(request);
            /**请求发送成功，并得到响应**/
            if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                /**读取服务器返回过来的json字符串数据**/
            	url = URLDecoder.decode(url, "UTF-8");
            	jsonResult = EntityUtils.toString(response.getEntity());
            } else {
               System.out.println("请求失败："+url);
            }
        } catch (IOException e) {
        	 try {
				url = URLDecoder.decode(url, "UTF-8");
			} catch (UnsupportedEncodingException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
            System.out.println("创建请求失败:"+url);
        }
		return jsonResult;
	};
	public static String getNetworkTime(){
		String result = "";
		try {
			URL realUrl = new URL("http://www.taobao.com");
			URLConnection connection = realUrl.openConnection();
			connection.connect();
			long ld = connection.getDate();
			Date date = new Date(ld);
			SimpleDateFormat format = new SimpleDateFormat(DEFAULT_FORMAT,Locale.CHINA);
			result = format.format(date);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date date = new Date();
			result = f.format(date);
		}
		return result;
	}
}
