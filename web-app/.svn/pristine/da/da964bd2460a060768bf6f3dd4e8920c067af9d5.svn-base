package com.forestar.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.forestar.core.exception.ServiceException;
import com.forestar.data.general.GlobalParameter;
import com.forestar.data.general.QueryFilter;
import com.forestar.data.general.RowBase;
import com.forestar.data.service.BaseService;
import com.forestar.save.dataController;
import com.forestar.data.metadata.PartitionSchema;
@Controller
public class AttrQueryController {
	@Autowired
	BaseService baseService;
	@Autowired
	PartitionSchema partitionSchemaImpl;
	private static final Logger logger = Logger.getLogger(dataController.class
			.getName());
	//查询  需要调用服务接口查到结构，然后返回前台，前台高亮地图
	@RequestMapping(value="/getSpaceQueryData.web",method = RequestMethod.POST)
	@ResponseBody
	public List getSpaceQueryData(HttpServletRequest req, HttpServletResponse res) throws Exception{
		String jsonStr = req.getParameter("data");
		JSONObject jsonObj = JSON.parseObject(jsonStr);
		String tableName = jsonObj.getString("tableName");
		String WhereStr = jsonObj.getString("whereStr");
		String zqCode = jsonObj.getString("zqCode");
		QueryFilter queryFilter = new QueryFilter();
		queryFilter.setSelectFields("C_OBJINFO");
		queryFilter.setWhereString(WhereStr);
		partitionSchemaImpl.setSchemaByZQCode(zqCode);
		List<RowBase> rowlist = baseService.getEntityList(tableName,queryFilter);
		return rowlist;
	}
	
	
	@RequestMapping(value="/getAttrShiZqList.web",method = RequestMethod.POST)
	@ResponseBody
	public List getAttrShiZqList(HttpServletRequest req, HttpServletResponse res,String data) throws ServiceException{
		String jsonStr = req.getParameter("data");
		JSONObject jsonObj = JSON.parseObject(jsonStr);
		String TableName = jsonObj.getString("tableName");
		String WhereStr = jsonObj.getString("whereStr");		
		String SqlData = "select distinct C_SHENGNAME,C_XIAN,C_XIANNAME from "+TableName+" t where "+WhereStr+" order by C_XIAN";
		
		GlobalParameter[] para = new GlobalParameter[]{
				new GlobalParameter(null, null, "C_SHENGNAME","STRING"),
				new GlobalParameter(null, null, "C_XIAN","STRING"),
				new GlobalParameter(null, null, "C_XIANNAME","STRING")
		};
		List<RowBase> list = baseService.getDataTableSql(TableName, SqlData, para);
		List shiList = new ArrayList();
		for(int j =0;j<list.size();j++){
			String xianCode = (String) list.get(j).getOriginalObjects().get("C_XIAN");
			if(xianCode!=null&&!xianCode.equals("")){
				String shiCode = xianCode.substring(0, 4);
				shiList.add(shiCode);
			}
		}
		String WhereZq = shiList.toString();	
		String sqlShi = "select distinct C_ZQCODE,C_ZQNAME from FL_SYS_ZQSJZD t where C_ZQCODE in ("+WhereZq+") order by C_ZQCODE";
		GlobalParameter[] paraShi = new GlobalParameter[]{
				new GlobalParameter(null, null, "C_ZQCODE","STRING"),
				new GlobalParameter(null, null, "C_ZQNAME","STRING")
		};
		List<RowBase> listShi = baseService.getDataTableSql("FL_SYS_ZQSJZD", sqlShi, paraShi);
		StringBuilder strObj = new StringBuilder();
		List listRes = new ArrayList();
		if (listShi.size() > 0 && listShi != null) {
			for(int i = 0;i < listShi.size();i++){
				//主键 
				String ZqCode = (String) listShi.get(i).getOriginalObjects().get("C_ZQCODE");
				//县名称
				String ZqName = (String) listShi.get(i).getOriginalObjects().get("C_ZQNAME"); 
				if(ZqCode!=null&&ZqName!=null){
					if(!ZqCode.equals("")&&!ZqName.equals("")){
						strObj.append("<option value ='"+ZqCode+"'>"+ZqName+"</option>");						
					}
				}
			}
			listRes.add(strObj);
		} else {
			System.out.println("没有查询到数据");
			return null;
		}
		return listRes;
	}
	

	@RequestMapping(value="/getAttrXianZqList.web",method = RequestMethod.POST)
	@ResponseBody
	public List getAttrXianZqList(HttpServletRequest req, HttpServletResponse res,String data) throws ServiceException{
		String jsonStr = req.getParameter("data");
		JSONObject jsonObj = JSON.parseObject(jsonStr);
		String TableName = jsonObj.getString("tableName");
		String WhereStr = jsonObj.getString("whereStr");
		String selCode = jsonObj.getString("selectVal");
		
		String SqlData = "select distinct C_SHENGNAME,C_XIAN,C_XIANNAME from "+TableName+" t where "+WhereStr+" order by C_XIAN";
		
		GlobalParameter[] para = new GlobalParameter[]{
				//new GlobalParameter(null, null, "C_SHENGNAME","STRING"),
				new GlobalParameter(null, null, "C_XIAN","STRING"),
				new GlobalParameter(null, null, "C_XIANNAME","STRING")
		};
		List<RowBase> list = baseService.getDataTableSql(TableName, SqlData, para);
		StringBuilder strObj = new StringBuilder();
		/*strObj.append("<option value =''>请选择</option>");*/
		List listRes = new ArrayList();
		if (list.size() > 0 && list != null) {
			for(int i = 0;i < list.size();i++){
				//主键 
				String ZqCode = (String) list.get(i).getOriginalObjects().get("C_XIAN");
				//县名称
				String ZqName = (String) list.get(i).getOriginalObjects().get("C_XIANNAME"); 
				//省名称
				//String ShengZqName = (String) list.get(i).getOriginalObjects().get("C_SHENGNAME"); 
				if(ZqCode!=null&&ZqName!=null){
					if(!ZqCode.equals("")&&!ZqName.equals("")){
						if(ZqCode.equals(selCode)){
							strObj.append("<option value ='"+ZqCode+"' selected>"+ZqName+"</option>");
						}else{
							strObj.append("<option value ='"+ZqCode+"'>"+ZqName+"</option>");
						}
					}
				}
			}
			listRes.add(strObj);
		} else {
			System.out.println("没有查询到数据");
			return null;
		}
		return listRes;
	}
	
	
	@RequestMapping(value="/getAttrShengZqList.web",method = RequestMethod.POST)
	@ResponseBody
	public List getAttrShengZqList(HttpServletRequest req, HttpServletResponse res,String data) throws ServiceException{
		String jsonStr = req.getParameter("data");
		JSONObject jsonObj = JSON.parseObject(jsonStr);
		String TableName = jsonObj.getString("tableName");
		String WhereStr = jsonObj.getString("whereStr");
		String selCode = jsonObj.getString("selectVal");
		
		String SqlData = "select distinct C_SHENGNAME,C_SHENG from "+TableName+" t where "+WhereStr+" order by C_SHENG";
		
		GlobalParameter[] para = new GlobalParameter[]{
				//new GlobalParameter(null, null, "C_SHENGNAME","STRING"),
				new GlobalParameter(null, null, "C_SHENG","STRING"),
				new GlobalParameter(null, null, "C_SHENGNAME","STRING")
		};
		List<RowBase> list = baseService.getDataTableSql(TableName, SqlData, para);
		StringBuilder strObj = new StringBuilder();
		/*strObj.append("<option value =''>请选择</option>");*/
		List listRes = new ArrayList();
		if (list.size() > 0 && list != null) {
			for(int i = 0;i < list.size();i++){
				//主键 
				String ZqCode = (String) list.get(i).getOriginalObjects().get("C_SHENG");
				//名称
				String ZqName = (String) list.get(i).getOriginalObjects().get("C_SHENGNAME"); 
				if(ZqCode!=null&&ZqName!=null){
					if(!ZqCode.equals("")&&!ZqName.equals("")){
						strObj.append("<option value ='"+ZqCode+"'>"+ZqName+"</option>");
					}
				}
			}
			listRes.add(strObj);
		} else {
			System.out.println("没有查询到数据");
			return null;
		}
		return listRes;
	}
	
}
