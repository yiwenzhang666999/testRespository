package com.forestar.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.forestar.core.exception.ServiceException;
import com.forestar.data.general.QueryFilter;
import com.forestar.data.general.RowBase;
import com.forestar.data.general.UpdateFilter;
import com.forestar.data.metadata.PartitionSchema;
import com.forestar.data.service.BaseService;
import com.forestar.util.OracleJDBC;

@Controller
@RequestMapping("/shdk")
public class ShdkController{
	Logger logger=Logger.getLogger(getClass());
	@Autowired
	BaseService baseService;
	@Autowired
	PartitionSchema partitionSchemaImpl;
	
	private static final String TABLENAME = "ZYJG_BHTB";
	private static final String GRIDTABLENAME = "FS_BUSINESS_KVDATA";
	
	
	/**
	 * 变化图斑--获取当前政区下未审核的总条数
	 * @param request
	 * @param response
	 * @param data
	 * @param model
	 * @return
	 * @throws ServiceException
	 */
	@RequestMapping(value={"/getTotal.do"}, produces={"text/html;charset=UTF-8"})
	@ResponseBody
	public String getTotal(HttpServletRequest request, HttpServletResponse response, String data, Model model) throws ServiceException
	{
	  Map<String,String> map=new HashMap<String,String>();
	  if (data != null) {
	    JSONObject jsonData = JSONObject.parseObject(data);
	    try {
	    	partitionSchemaImpl.setSchemaByZQCode(jsonData.getString("xian"));
	    	QueryFilter qf= new QueryFilter();
	    	qf.setWhereString("C_XIAN='"+jsonData.getString("xian")+"' and (C_STATUS in (0,3) or C_STATUS is null)");
	    	qf.setOrderByString("C_CUN");
//	    	qf.setWhereString("C_XIAN='"+jsonData.getString("xian")+"' and (C_STATUS='1')");
	    	List<RowBase> list=this.baseService.getDataTable(TABLENAME, qf);
	  		String ids="";
	  		Map<String,String> xys=new HashMap<String,String>();
	  		for(int i=0;i<list.size();i++){
	  			Map temp=list.get(i).getOriginalObjects();
	  			ids+=temp.get("ID")+",";
	  			xys.put(temp.get("ID")+"", temp.get("I_LON_DEG")+","+temp.get("I_LAT_DEG"));
	  		}
	  		map.put("total", list.size()+"");
	  		map.put("ids", ids);
	  		map.put("xys", JSONObject.toJSON(xys).toString());
	    }catch (Exception e) {
	      e.printStackTrace();
	    } 
	  }
	  return JSONObject.toJSON(map).toString();
	}
	/**
	 * 变化图斑--审核&保存
	 * @param request
	 * @param response
	 * @param data
	 * @param model
	 * @return
	 * @throws ServiceException
	 */
	@RequestMapping(value={"/shdkData.do"}, produces={"text/html;charset=UTF-8"})
	@ResponseBody
	public String shdkData(HttpServletRequest request, HttpServletResponse response, String data, Model model)throws ServiceException{
		String flag="0";
		if (data != null) {
		    JSONObject jsonData = JSONObject.parseObject(data);
		    partitionSchemaImpl.setSchemaByZQCode(jsonData.getString("xian"));
		    try {
		    	QueryFilter qf= new QueryFilter();
		    	qf.setWhereString("C_XIAN='"+jsonData.getString("xian")+"' and ID='"+jsonData.getString("id")+"' and C_STATUS in ('2','1')");
		    	List<RowBase> list=this.baseService.getEntityList(TABLENAME, qf);
		    	if(list.size()>0){
		    		flag="0";
		    	}else{
		    		flag="1";
		    	}
		    }catch (Exception e) {
		      e.printStackTrace();
		    } 
		}
		return flag;
	}
	/**
	 * 变化图斑--审核&保存
	 * @param request
	 * @param response
	 * @param data
	 * @param model
	 * @return
	 * @throws ServiceException
	 */
	@RequestMapping(value={"/getDataById.do"}, produces={"text/html;charset=UTF-8"})
	@ResponseBody
	public String getDataById(HttpServletRequest request, HttpServletResponse response, String data, Model model)throws ServiceException{
		List<RowBase> list=null;
		if (data != null) {
		    JSONObject jsonData = JSONObject.parseObject(data);
		    try {
				partitionSchemaImpl.setSchemaByZQCode(jsonData.getString("xian"));
		    	QueryFilter qf= new QueryFilter();
		    	qf.setWhereString("ID="+jsonData.getString("id"));
//		    	qf.setSelectFields("ID");
		    	list=this.baseService.getEntityList(TABLENAME, qf);
		    }catch (Exception e) {
		      e.printStackTrace();
		    } 
		}
		return JSONObject.toJSONString(list.get(0).getOriginalObjects());
	}
	/**
	 * 变化图斑--获取用户的网格信息
	 * @param request
	 * @param response
	 * @param data
	 * @param model
	 * @return
	 * @throws ServiceException
	 */
	@RequestMapping(value={"/getZqGridData.do"}, produces={"text/html;charset=UTF-8"})
	@ResponseBody
	public String getZqGridData(HttpServletRequest request, HttpServletResponse response, String data, Model model) throws ServiceException
	{
	  List<RowBase> list=null;
	  if (data != null) {
	    JSONObject jsonData = JSONObject.parseObject(data);
	    try {
	    	QueryFilter qf= new QueryFilter();
	    	qf.setWhereString("C_XIAN='"+jsonData.getString("xian")+"' and I_USERID="+jsonData.getString("userid")+" and C_APPID='"+jsonData.getString("appid")+"' and C_DATAKEY='"+jsonData.getString("datakey")+"'");
//	    	qf.setSelectFields("C_XIAN");
	    	list=this.baseService.getDataTable(GRIDTABLENAME, qf);
	    }catch (Exception e) {
	      e.printStackTrace();
	    } 
	  }
	  if(list==null||list.size()==0){
		  return "0";
	  }
	  String jsondata=(list.get(0).getOriginalObjects().get("C_DATABODY")+"").replaceAll("\\(", "[").replaceAll("\\)", "]");
	  return jsondata;
	}
	/**
	 * 变化图斑--获取用户的网格信息
	 * @param request
	 * @param response
	 * @param data
	 * @param model
	 * @return
	 * @throws ServiceException
	 */
	@RequestMapping(value={"/updZqGridData.do"}, produces={"text/html;charset=UTF-8"})
	@ResponseBody
	public String updZqGridData(HttpServletRequest request, HttpServletResponse response, String data, Model model) throws ServiceException
	{
	  boolean up=true;
	  if (data != null) {
	    JSONObject jsonData = JSONObject.parseObject(data);
	    try {
//	    	QueryFilter qf= new QueryFilter();
//	    	qf.setWhereString("C_XIAN='"+jsonData.getString("xian")+"' and I_USERID='"+jsonData.getString("userid")+"' and C_APPID='"+jsonData.getString("appid")+"'");
//	    	List<RowBase> list=this.baseService.getDataTable(GRIDTABLENAME, qf);
//	    	if(list!=null||list.size()!=0){
//		    	RowBase row_sheng = new RowBase();
//		    	HashMap map=new HashMap();
//		    	map.put("OBJECTID", "28");
//				row_sheng.setOriginalObjects(map);
//
//		    	HashMap newmap = new HashMap();
//		    	newmap.put("OBJECTID", "28");
//		    	newmap.put("C_XIAN", "111");
//		    	newmap.put("I_USERID", Integer.parseInt(jsonData.getString("userid")));
//		    	newmap.put("C_APPID", jsonData.getString("appid"));
//		    	newmap.put("C_DATABODY", jsonData.getString("jsondata").toString());
//				row_sheng.setCurrentObjects(newmap);
//		    	this.baseService.save(GRIDTABLENAME,row_sheng);
//	    	}
	    	String whereString="C_XIAN='"+jsonData.getString("xian")+"' and I_USERID='"+jsonData.getString("userid")+"' and C_APPID='"+jsonData.getString("appid")+"' and C_DATAKEY='"+jsonData.getString("datakey")+"'";
	    	
	    	UpdateFilter uf= new UpdateFilter();
			uf.setWhereString(whereString);
			String jsondata=jsonData.getString("jsondata");
			jsondata=jsondata.replaceAll("\\[", "(").replaceAll("\\]", ")");
			uf.setSetFields("C_DATABODY='"+jsondata+"'");
			up = baseService.update(GRIDTABLENAME, uf);
	    	
	    	
//	    	String sql = "update "+GRIDTABLENAME+" set C_DATABODY='"+jsonData.getString("jsondata")+"' where "+whereString;
//			System.out.println(sql);
//			i = baseService.executeSql(GRIDTABLENAME,sql);
	    }catch (Exception e) {
	      e.printStackTrace();
	    } 
	  }
	  return up+"";
	}
	/**
	 * 变化图斑--获取用户的网格信息
	 * @param request
	 * @param response
	 * @param data
	 * @param model
	 * @return
	 * @throws ServiceException
	 */
	@RequestMapping(value={"/saveZqGridData.do"}, produces={"text/html;charset=UTF-8"})
	@ResponseBody
	public void saveZqGridData(HttpServletRequest request, HttpServletResponse response, String data, Model model) throws ServiceException
	{
	  if (data != null) {
	    JSONObject jsonData = JSONObject.parseObject(data);
	    try {
	    	String i_userid=jsonData.getString("userid");
	    	String c_xian=jsonData.getString("xian");
	    	String c_appid=jsonData.getString("appid");
	    	String c_datakey=jsonData.getString("datakey");
			String jsondata=jsonData.getString("jsondata");
//	    	String whereString="C_XIAN='"+c_xian+"' and I_USERID='"+i_userid+"' and C_APPID='"+c_appid+"' and C_DATAKEY='"+c_datakey+"'";
//	    	QueryFilter qf= new QueryFilter();
//	    	qf.setWhereString(whereString);
//	    	qf.setSelectFields("C_XIAN");
//	    	List<RowBase> list=this.baseService.getDataTable(GRIDTABLENAME, qf);

	    	QueryFilter qf= new QueryFilter();
	    	qf.setWhereString("C_XIAN='"+jsonData.getString("xian")+"' and I_USERID='"+jsonData.getString("userid")+"' and C_APPID='"+jsonData.getString("appid")+"'");
//	    	qf.setSelectFields("C_XIAN");
	    	List<RowBase> list=this.baseService.getDataTable(GRIDTABLENAME, qf);
	    	if(list!=null&&list.size()>0){
	    		OracleJDBC.testOracle(GRIDTABLENAME, new String[]{i_userid,c_xian,c_appid,c_datakey}, new String[]{jsondata}, "upd");
//		    	UpdateFilter uf= new UpdateFilter();
//				uf.setWhereString(whereString);
//				String jsondata=jsonData.getString("jsondata");
//				jsondata=jsondata.replaceAll("\\[", "(").replaceAll("\\]", ")");
//				uf.setSetFields("C_DATABODY='"+jsondata+"'");
//				this.baseService.update(GRIDTABLENAME, uf);
	    	}else{
	    		OracleJDBC.testOracle(GRIDTABLENAME, new String[]{}, new String[]{i_userid,c_xian,c_appid,c_datakey,jsondata}, "add");
//		    	HashMap map = new HashMap();
//				map.put("C_XIAN", jsonData.getString("xian"));
//				map.put("I_USERID", Integer.parseInt(jsonData.getString("userid")));
//			    map.put("C_APPID", jsonData.getString("appid"));
//			    String jsondata=jsonData.getString("jsondata").replaceAll("\\[", "(").replaceAll("\\]", ")");
////			    map.put("C_DATABODY", jsondata.getBytes());
//		    	RowBase row = new RowBase();
//		    	row.setValue("C_DATABODY", jsondata.getBytes());
////		    	row.setValue("C_XIAN", jsonData.getString("xian"));
////		    	row.setValue("I_USERID", Integer.parseInt(jsonData.getString("userid")));
////		    	row.setValue("C_APPID", jsonData.getString("appid"));
////		    	row.setValue("C_DATAKEY", jsonData.getString("datakey"));
//				row.setCurrentObjects(map);
//		    	this.baseService.save(GRIDTABLENAME,row);
	    	}
	    }catch (Exception e) {
	      e.printStackTrace();
	    } 
	  }
	}
}