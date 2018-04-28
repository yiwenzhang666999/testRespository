package com.forestar.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

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
import com.forestar.core.session.SessionFactory;
import com.forestar.data.general.IWorkspace;
import com.forestar.data.general.QueryFilter;
import com.forestar.data.general.RowBase;
import com.forestar.data.service.BaseService;
import com.forestar.joint.resouces.model.UserDataModel;

@Controller
public class BhdkController
{
  Logger logger=Logger.getLogger(getClass());
  @Autowired
  BaseService baseService;
  private static final String TABLENAME = "FS_BUSINESS_DATAREG";
  private static final String TABLENAME_LOG = "FS_BUSINESS_TABLECATALOG";
  private static final String TABLENAME2 = "FS_BUSINESS_USERBUSLAYERS";

  
  /**
   * 变化图斑--添加
   * @param request
   * @param response
   * @param data
   * @param model
   * @return
   * @throws ServiceException
   */
  @RequestMapping(value={"/bhdk/add.do"}, produces={"text/html;charset=UTF-8"})
  @ResponseBody
  public String add(HttpServletRequest request, HttpServletResponse response, String data, Model model) throws ServiceException
  {
	  String res ="";
	  if (data != null) {
	    IWorkspace workspace = baseService.openTable(TABLENAME2).getWorkspace();
	    JSONObject jsonData = JSONObject.parseObject(data);
	    workspace.startEditing();
	    try {
		  res=createTree(jsonData,workspace,"add");
	      logger.info("变化地块添加成功！");
	      workspace.stopEditing(true);
	    }catch (Exception e) {
	      e.printStackTrace();
	      logger.info("变化地块添加失败！");
	      workspace.stopEditing(false);
	    } 
	  }
	  return res;
  }

  /**
   * 变化图斑--创建
   * @param request
   * @param response
   * @param data
   * @param model
   * @return
   * @throws ServiceException
   */
  @RequestMapping(value={"/bhdk/create.do"}, produces={"text/html;charset=UTF-8"})
  @ResponseBody
  public String create(HttpServletRequest request, HttpServletResponse response, String data, Model model)
    throws ServiceException
  {
	String res="";
    if (data != null) {
	  IWorkspace workspace = baseService.openTable(TABLENAME).getWorkspace();
      UserDataModel userEntity = (UserDataModel)SessionFactory.getSession().getObject("UserEntity");
      //String userId = userEntity.getUserid();
      JSONObject jsonData = JSONObject.parseObject(data);
      SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      String createDate = format.format(new Date());
      HashMap map = new HashMap();
      map.put("C_APPID", jsonData.getString("appid"));
      map.put("C_SHENG", jsonData.getString("sheng"));
      map.put("C_XIAN", jsonData.getString("xian"));
      map.put("C_XIANNAME", jsonData.getString("Xname"));
      map.put("C_FULLNAME", jsonData.getString("fullName"));
      map.put("C_WORKYEAR", jsonData.getString("nd"));
      map.put("C_CREATEUSER", jsonData.getString("userid"));
      map.put("C_CREATEDATE", createDate);
      RowBase row = new RowBase();
      row.setCurrentObjects(map);
      workspace.startEditing();
      try {
        this.baseService.save(TABLENAME, row);
        HashMap map_log = new HashMap();
        map_log.put("C_APPID", jsonData.getString("appid"));
        map_log.put("C_SHENG", jsonData.getString("sheng"));
        map_log.put("C_XIAN", jsonData.getString("xian"));
        map_log.put("C_NAME", jsonData.getString("Xname"));
        map_log.put("C_TABLENAME", "ZYJG_BHTB");
        map_log.put("C_TABLEMETA", "ZYJG_BHTB");
        map_log.put("I_TABLETYPE", Integer.valueOf(5));
        RowBase row_log = new RowBase();
        row_log.setCurrentObjects(map_log);
        this.baseService.save(TABLENAME_LOG, row_log);
        //创建后代码调用“添加”
        res=createTree(jsonData,workspace,"create");
        workspace.stopEditing(true);
        logger.info("变化地块创建成功！");
      }
      catch (Exception e) {
        e.printStackTrace();
        logger.info("变化地块创建失败！");
        workspace.stopEditing(false);
      }
    }
    return res;
  }
  
	 /*
	  * 应用图层表，保存树形结构数据
	  */
	private String createTree(JSONObject jsonData,IWorkspace workspace, String type) throws ServiceException {
		UserDataModel userEntity = (UserDataModel)SessionFactory.getSession().getObject("UserEntity");
	    //String userId = userEntity.getUserid();
		String res="";
		int flag=0;
		HashMap map = new HashMap();
		map.put("I_PARID", 0);
		map.put("I_USERID", jsonData.getString("userid"));
	    map.put("C_APPID", jsonData.getString("appid"));
	    map.put("C_SHENG", jsonData.getString("sheng"));
	    map.put("C_SHENGNAME", jsonData.getString("shengName"));
    	String sheng_id =null;
    	String xian_id =null;
    	String dataSource = "{\"type\":\"0\",\"tablename\":\"ZYJG_BHTB\",\"where\":\"C_XIAN='"+jsonData.getString("xian")+"'\"}";
		RowBase row_sheng = new RowBase();
		row_sheng.setCurrentObjects(map);
		//根据省code和用户id、C_APPID判断是否存在
		String where ="C_SHENG='"+jsonData.getString("sheng")+"' AND I_USERID='"+jsonData.getString("userid")+"' AND C_APPID='"+jsonData.getString("appid")+"' AND I_PARID=0";
		QueryFilter query = new QueryFilter();
		query.setWhereString(where);
		List<RowBase> list = baseService.getEntityList(TABLENAME2, query);
		//如果该用户已经有省节点，则获取省节点的I_ID
		if(list.size()>0){
			sheng_id=list.get(0).getOriginalObjects().get("I_ID").toString();
		}else{
			flag=2;
			RowBase rBase_s = this.baseService.save(TABLENAME2,row_sheng);
			//返回主键
			sheng_id = rBase_s.getCurrentObjects().get("I_ID").toString();
		}
		//根据县code和用户id、C_APPID判断是否存在
		String where1 ="C_XIAN='"+jsonData.getString("xian")+"' AND I_USERID='"+jsonData.getString("userid")+"' AND C_APPID='"+jsonData.getString("appid")+"' AND I_PARID="+sheng_id;
		QueryFilter query1 = new QueryFilter();
		query1.setWhereString(where1);
		List<RowBase> list1 = baseService.getEntityList(TABLENAME2, query1);
		if(list1.size()>0){
			//获取县I_ID
			xian_id=list1.get(0).getOriginalObjects().get("I_ID").toString();
		}else{
			if(flag==0){//当为“0”时，说明已经有省节点，如果为“2”,则说明没有省节点，相对应的，也没有县节点。
				flag=1;
			}
			//保存县
			map.put("I_PARID", sheng_id);
			map.put("C_XIAN", jsonData.getString("xian"));
		    map.put("C_XIANNAME", jsonData.getString("Xname"));
		    
			RowBase rBase_s = this.baseService.save(TABLENAME2,row_sheng);
			//返回县I_ID
			xian_id = rBase_s.getCurrentObjects().get("I_ID").toString();
		}
		//年度图斑
		map.put("I_PARID", xian_id);
		map.put("C_XIAN", jsonData.getString("xian"));
	    map.put("C_XIANNAME", jsonData.getString("Xname"));
	    map.put("I_LYRORDERID", "0");
	    map.put("C_DATANAME", "变化图斑"+jsonData.getString("nd"));
		map.put("C_DATASOURCE", dataSource);
	    map.put("C_WORKYEAR", jsonData.getString("nd"));
		//保存年度图斑数据
		RowBase row_xian = new RowBase();
		row_xian.setCurrentObjects(map);
		RowBase rBase_x = this.baseService.save(TABLENAME2,row_xian);
		//返回主键
		String ndtb_id = rBase_x.getCurrentObjects().get("I_ID").toString();
		String tbJSON="";
		String xianJSON="";
		String shengJSON="";
		if(flag>-1){//当为“0”时，传出变化图斑JSON
			tbJSON="{"+
				"\"id\": \"bhdk"+ndtb_id+"_tb0\","+
				"\"pid\":\"bhdk"+xian_id+"\"," +
				"\"jb\": 4,"+
				"\"sort\":\""+jsonData.getString("nd")+"\"," +
				"\"text\":\"变化图斑"+jsonData.getString("nd")+"\"," +
				"\"children\": [],"+
				"\"selectId\":\""+jsonData.getString("xian")+"_"+jsonData.getString("nd")+"\"," +
				"\"_data\": {"+
					"\"xian\":\""+jsonData.getString("xian")+"\"," +
					"\"type\": \"bhdk\","+
					"\"layerName\":\""+jsonData.getString("Xname")+"变化图斑"+jsonData.getString("nd")+"\"," +
					"\"isQuery\": true,"+
					"\"edit\": true,"+
					"\"nd\": \""+jsonData.getString("nd")+"\""+
				"}"+
			"}";
			res=tbJSON;
		}
		if(flag>0){//当为“1”时，传出"变化图斑JSON"+"县JSON"
			xianJSON="{\"id\":\"bhdk"+xian_id+"\","+
					"\"i_id\":"+xian_id+"," +
					"\"i_pid\":"+sheng_id+"," +
					"\"pid\":\"bhdk"+sheng_id+"\"," +
					"\"jb\": 3,"+
					"\"text\":\""+jsonData.getString("Xname")+"\"," +
					"\"sort\":\""+jsonData.getString("xian")+"\"," +
					"\"xian\":\""+jsonData.getString("xian")+"\"," +
					"\"_data\":{\"xian\":\""+jsonData.getString("xian")+"\",\"type\":\"bhdk\"},"+
					"\"children\":["+tbJSON+"]}";
			res=xianJSON;
		}
		if(flag>1){//当为“2”时，传出"变化图斑JSON"+"县JSON"+"省JSON"
			shengJSON="{\"id\" : \"bhdk"+sheng_id+"\"," +
					"\"text\" : \""+jsonData.getString("shengName")+"\"," +
					"\"sort\" : \""+jsonData.getString("sheng")+"\"," +
					"\"pid\" : \"bhdk\","
					+ "\"children\" : ["+xianJSON+"]}";

			res=shengJSON;
		}
		return res;
	}
	
	/**
	 * 根据条件查表是否有数据，控制按钮显示状态
	 * @param request
	 * @param response
	 * @param data
	 * @param model
	 * @return
	 * @throws ServiceException
	 */
	  @RequestMapping(value={"/bhdk/getData.do"}, produces={"text/html;charset=UTF-8"})
	  @ResponseBody
	  public String getData(HttpServletRequest request, HttpServletResponse response, String data, Model model)
	    throws ServiceException
	  {	
		 String flag="false";
		 if (data != null) {
			 JSONObject jsonData = JSONObject.parseObject(data);
			 String whereData = jsonData.getString("where");
			 JSONObject jsonWhere = JSONObject.parseObject(whereData);
			 String tableid=jsonWhere.getString("tableid");
			 String xian=jsonWhere.getString("xian");
			 String appid=jsonWhere.getString("appid");
			 String userid=jsonWhere.getString("userid");
			 String nd=jsonWhere.getString("nd");
			 String where="C_XIAN='"+xian+"' and C_APPID='"+appid+"' and C_WORKYEAR='"+nd+"' ";
			 String tableName="";
			 if("2".equals(tableid)){
				 where+="and C_DATANAME is not null and I_USERID='"+userid+"'";
				 tableName=TABLENAME2;
			 }else if("1".equals(tableid)){
				 tableName=TABLENAME;
			 }
			 QueryFilter query = new QueryFilter();
			 query.setWhereString(where);
			 List<RowBase> list = baseService.getEntityList(tableName, query);
			 if(list.size()>0){
				 flag ="true";
			 }else{
				 flag = "false";
			 }
		 }
		 return flag;
	  }
	  
	  /**
		 * 获取树的数据
		 * @param request
		 * @param response
		 * @param data
		 * @param model
		 * @return
		 * @throws ServiceException
		 */
		  @RequestMapping(value={"/bhdk/getTData.do"})
		  @ResponseBody
		  public List getTData(HttpServletRequest request, HttpServletResponse response, String data, Model model)
		    throws ServiceException
		  {	
			 List dataList = new ArrayList();
			 if (data != null) {
				 JSONObject jsonData = JSONObject.parseObject(data);
				 String tableName=jsonData.getString("tableName");
				 String where = jsonData.getString("where");
				 QueryFilter query = new QueryFilter();
				 query.setWhereString(where);
				 List<RowBase> list = baseService.getEntityList(tableName, query);
				 if(list.size()>0){
					 for (int i = 0; i < list.size(); i++) {
						    HashMap obj1 = list.get(i).getOriginalObjects();
	                        HashMap temp1 = new HashMap();
	                        if (obj1.get("C_XIAN") == null) { // 是一级节点
	                            temp1.put("id", obj1.get("I_ID").toString());
	                            temp1.put("text", obj1.get("C_SHENGNAME").toString());
	                            for (int j = 0; j < list.size(); j++) {
	                            	HashMap obj2 = list.get(j).getOriginalObjects();
	                                if (obj1.get("I_ID").equals(obj2.get("I_PARID"))) { // 有子节点
	                                	HashMap temp2 = new HashMap();
	                                    temp2.put("id", obj2.get("I_PARID").toString());
	                                    temp2.put("text", obj2.get("C_XIANNAME").toString());
	                                    if (obj2.get("C_DATANAME")!=null) {
	                                        String children = "[{\"text\" : \""+obj2.get("C_DATANAME").toString()+"\", \"xian\": \""+obj2.get("C_XIAN").toString()+"\",\"type\":\"bhdk\"}]";
	                                        temp2.put("children", children);
	                                    }
	                                    temp1.put("children", temp2);
	                                }
	                            } 
	                            dataList.add(temp1);
	                        } 
	                    }
				 }
			 }
			return dataList;
		  }
		  
		  
		  /**
		   * 变化地块--删除
		   * @param request
		   * @param response
		   * @param data
		   * @param model
		   * @return
		 * @throws ServiceException 
		   */
		  @RequestMapping(value={"/bhdk/delTdata.do"})
		  @ResponseBody
		  public boolean delTdata(HttpServletRequest request, HttpServletResponse response, String data, Model model) throws ServiceException{
			  if (data != null) {
					 JSONObject jsonData = JSONObject.parseObject(data);
					 String whereData = jsonData.getString("where");
					 JSONObject whereJson = JSONObject.parseObject(whereData);
					 String where ="C_XIAN='"+whereJson.getString("xian")+"' and C_WORKYEAR in('"+whereJson.getString("nd")+"') and I_USERID = '"+whereJson.getString("userid")+"' And C_APPID = '"+whereJson.getString("appid")+"'";
					 IWorkspace workspace = baseService.openTable(TABLENAME2).getWorkspace();
					 workspace.startEditing();
					 //根据县和用户id删除
					 try {
						 String sqlString3 = "delete from "+TABLENAME2+" where "+where;
						 baseService.executeSql(TABLENAME2, sqlString3);
						 //查询图斑节点上是否有县级节点，如果没有则删除直接删除图斑节点
						 QueryFilter query = new QueryFilter();
						 query.setWhereString("I_PARID='"+whereJson.getString("id")+"'");
						 List<RowBase> list = baseService.getEntityList(TABLENAME2, query);
						 //查询县级数据，获取县级PID
						 if(list.size()==1){
							 QueryFilter query1 = new QueryFilter();
							 query1.setWhereString("I_PARID='"+list.get(0).getOriginalObjects().get("I_PARID")+"'");
							 List<RowBase> list1 = baseService.getEntityList(TABLENAME2, query1);
							 if(list1.size()==1){
								 String where1 ="I_PARID='"+list1.get(0).getOriginalObjects().get("I_PARID")+"' and I_USERID = '"+whereJson.getString("userid")+"' And C_APPID = '"+whereJson.getString("appid")+"'";
								 String sqlString4 = "delete from "+TABLENAME2+" where "+where1;
								 baseService.executeSql(TABLENAME2, sqlString4);
							 }
							 String where1 ="I_ID='"+list.get(0).getOriginalObjects().get("I_PARID")+"' and I_USERID = '"+whereJson.getString("userid")+"' And C_APPID = '"+whereJson.getString("appid")+"'";
							 String sqlString4 = "delete from "+TABLENAME2+" where "+where1;
							 baseService.executeSql(TABLENAME2, sqlString4);
						 }else{
							 String where1="I_PARID='"+whereJson.getString("id")+"' and C_XIAN='"+whereJson.getString("xian")+"'";
							 String sqlString4 = "delete from "+TABLENAME2+" where "+where1;
							 baseService.executeSql(TABLENAME2, sqlString4);
						 }
						 workspace.stopEditing(true);
						 logger.info("数据删除成功！");
						 return true;
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
						workspace.stopEditing(false);
						logger.info("数据删除失败！");
						return false;
					}
			  }
			  return false;
		  }
		  
		  /**
		   * 变化地块--删除整个省的变化地块
		   * @param request
		   * @param response
		   * @param data
		   * @param model
		   * @return
		 * @throws ServiceException 
		   */
		  @RequestMapping(value={"/bhdk/delProvincedatas.do"})
		  @ResponseBody
		  public boolean delProvincedatas(HttpServletRequest request, HttpServletResponse response, String data, Model model) throws ServiceException{
			  if (data != null) {
					 JSONObject jsonData = JSONObject.parseObject(data);
					 String whereData = jsonData.getString("where");
					 JSONObject whereJson = JSONObject.parseObject(whereData);
					 String where ="C_SHENG='"+whereJson.getString("sheng")+"' and I_USERID = '"+whereJson.getString("userid")+"' And C_APPID = '"+whereJson.getString("appid")+"'";
					 IWorkspace workspace = baseService.openTable(TABLENAME2).getWorkspace();
					 workspace.startEditing();
					 //根据县和用户id删除
					 try {
						 String sqlString3 = "delete from "+TABLENAME2+" where "+where;
						 baseService.executeSql(TABLENAME2, sqlString3);
						 workspace.stopEditing(true);
						 logger.info("数据删除成功！");
						 return true;
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
						workspace.stopEditing(false);
						logger.info("数据删除失败！");
						return false;
					}
			  }
			  return false;
		  }
		  /**
		   * 变化地块--获取年度
		   * @param request
		   * @param response
		   * @param data
		   * @param model
		   * @return
		 * @throws ServiceException 
		   */
		  @RequestMapping(value={"/bhdk/getYear.do"})
		  @ResponseBody
		  public String getYear(HttpServletRequest request, HttpServletResponse response, String data, Model model) throws ServiceException{
			  if (data != null) {
				  JSONObject jsonData = JSONObject.parseObject(data);
				  String sDate = jsonData.getString("sDate");
				  String eDate = jsonData.getString("eDate");
				  return "";
			  }else{
				  Date date=new Date();
				  int year=date.getYear()+1900;
				  return year+"";
			  }
		  }
}