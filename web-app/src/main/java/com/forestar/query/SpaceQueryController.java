package com.forestar.query;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.forestar.core.Config;
import com.forestar.core.session.SessionFactory;
import com.forestar.data.general.QueryFilter;
import com.forestar.data.general.RowBase;
import com.forestar.data.service.BaseService;
import com.forestar.util.Util;

@Controller
public class SpaceQueryController {
	
	@Autowired
	BaseService baseService;
	private static final Logger logger = Logger.getLogger(SpaceQueryController.class
			.getName());
	
	@RequestMapping(value = "spaceQuery.do")
	@ResponseBody
	public HashMap querySwitch(String jsonStr){
		HashMap result = new HashMap();
		result.put("success",false);
		if(null!=jsonStr){
			HashMap dataMap = JSON.parseObject(jsonStr, new HashMap().getClass());
			String x = dataMap.get("X").toString();
			String y = dataMap.get("Y").toString();
			String nd = dataMap.get("nd").toString();
			String type = dataMap.get("queryType").toString();
			logger.debug("查询接收参数：X:"+x+",Y:"+y+",nd:"+nd+",queryType:"+type);
			String url = "";
			String zqStr = queryZqByPoint(x,y);
			logger.debug("获取到政区信息:"+zqStr);
			String zqCode = "";
			if(!"".equals(zqStr)){
				HashMap zqMap = JSON.parseObject(zqStr,new HashMap().getClass());
				zqCode = zqMap.get("code").toString();
				result.put("zqCode",zqCode);
			}
			if("BHDK".equals(type)){
				result.put("type","bhdk");
					url = Config.getValue("spaceQuery")+"/rest/DS/query/zyjg/"+x+"/"+y+"/"+nd+"/"+zqCode;
				if("BHDK".equals(type)){
					result.put("type","bhdk");
						url = Config.getValue("spaceQuery")+"/rest/DS/query/zyjg/"+x+"/"+y+"/"+nd+"/"+zqCode;
				}else{
					result.put("type","ywsj");
					String layerId = dataMap.get("layerId").toString();
					url = Config.getValue("spaceQuery")+"/rest/DS/commonQuery/zyjg/"+x+"/"+y+"/"+layerId+"/"+zqCode;
				}
				logger.debug("查询地址："+url);
				String jsonResult = httpGet(url);
				logger.debug("查询结果："+jsonResult);
				JSONObject jObj = JSON.parseObject(jsonResult);
				if(null!=jsonResult&&!jsonResult.isEmpty()&&"sucess".equals(jObj.getString("message"))){
					result.put("success",true);
					result.put("data",jObj.getString("data"));
				}
			}else{
				logger.error("点["+x+" "+y+"]获取不到到政区信息;");
			}
			
		}
		return result;
	}
	
	@RequestMapping(value = "pdsfcj.do")
	@ResponseBody
	public HashMap pdsfcj(String jsonStr){
		HashMap result = new HashMap();
		if(null!=jsonStr){
			HashMap dataMap = JSON.parseObject(jsonStr, new HashMap().getClass());
			String x = dataMap.get("X").toString();
			String y = dataMap.get("Y").toString();
			String userId = dataMap.get("userId").toString();
			String userZqCode = (String) SessionFactory.getSession().getObject("zqCode");
			String zqStr = queryZqByPoint(x,y);
			HashMap zqMap = JSON.parseObject(zqStr,new HashMap().getClass());
			result.putAll(zqMap);
			try{
				String zqCode = zqMap.get("code").toString();
				QueryFilter queryFilter = new QueryFilter();
				queryFilter.setSelectFields("I_ID,C_DATANAME");
				queryFilter.setWhereString("C_XIAN = '"+zqCode+"' and I_USERID = "+userId+" and C_WORKYEAR = '"+Util.getDefineND()+"' and C_DATANAME is not null");
				List<RowBase> rowlist = baseService.getEntityList("FS_BUSINESS_USERBUSLAYERS",queryFilter);
				if(rowlist.size()>0&&null!=rowlist.get(0).getOriginalObjects()){
					String layerName = rowlist.get(0).getOriginalObjects().get("C_DATANAME").toString();
					result.put("success",true);
					result.put("layerName",layerName);
				}else{
					result.put("success",false);
				}
			}catch(Exception e){
				result.put("success",false);
				logger.error(e.getMessage());
			}
		}
		return result;
	}
	
	@RequestMapping(value = "updateSession.do")
	@ResponseBody
	public String updateSession(HttpServletRequest request, HttpServletResponse response){
		return "ok";
	}
	private String queryZqByPoint(String x,String y){
        String url = Config.getValue("spaceQuery")+"/rest/LS/address/5/"+x+"/"+y;
        logger.info("请求ws服务地址:"+url);
        String jsonResult = httpGet(url);
        logger.info("返回结果:"+jsonResult);
        return jsonResult;
	};
	
	private String httpGet(String url){
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
				logger.error(e1.getMessage());
			}
            logger.error(e.getMessage());
        }
		return jsonResult;
	};
	
}
