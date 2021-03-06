package com.forestar.report.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

@Controller
public class getReportListController {
	@Autowired
	BaseService baseService;
	/**
	 * 
	 * @param req
	 * @param res
	 * @param data 
	 * @return
	 * @throws ServiceException 
	 */
	@RequestMapping(value="/getReportProList.web",method = RequestMethod.POST)
	@ResponseBody
	public List getReportProList(HttpServletRequest req, HttpServletResponse res,String data) throws ServiceException{
		String jsonStr = req.getParameter("data");
		JSONObject jsonObj = JSON.parseObject(jsonStr);
		String TableName = jsonObj.getString("tableName");
		String WhereStr = jsonObj.getString("whereStr");
		
		QueryFilter qf = new QueryFilter();
		qf.setSelectFields("*");
		qf.setWhereString(WhereStr);
		//TODO 固定的排序字段
		//qf.setOrderByString("OBJECTID");
		qf.setAddCaptionField(true);
		List<RowBase> list = baseService.getEntityList(TableName, qf);
		List listRes = new ArrayList();
		StringBuilder strObj = new StringBuilder();
		if (list.size() > 0 && list != null) {
			for(int i = 0;i < list.size();i++){
				//主键 
				String ObjectId = (String) list.get(i).getOriginalObjects().get("OBJECTID");
				//名称
				String Name = (String) list.get(i).getOriginalObjects().get("S_NAME"); 
				strObj.append("<li reportId='"+ObjectId+"'><i class='icon'></i><p class='txt'>"+Name+"</p></li>");
			}
			listRes.add(strObj);
		} else {
			System.out.println("没有从 FS_REPORT_ROW 表中查询到数据");
			return null;
		}
		return listRes;
	}
	
	@RequestMapping(value="/getReportZqList.web",method = RequestMethod.POST)
	@ResponseBody
	public List getReportZqList(HttpServletRequest req, HttpServletResponse res,String data) throws ServiceException{
		String jsonStr = req.getParameter("data");
		JSONObject jsonObj = JSON.parseObject(jsonStr);
		String TableName = jsonObj.getString("tableName");
		String WhereStr = jsonObj.getString("whereStr");
		String selCode = jsonObj.getString("selectVal");
		
		String SqlData = "select distinct C_SHENGNAME,C_XIAN,C_XIANNAME from "+TableName+" t where "+WhereStr+" order by C_XIAN";
		
		GlobalParameter[] para = new GlobalParameter[]{
				new GlobalParameter(null, null, "C_SHENGNAME","STRING"),
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
				String ShengZqName = (String) list.get(i).getOriginalObjects().get("C_SHENGNAME"); 
				if(ZqCode!=null&&ZqName!=null){
					if(!ZqCode.equals("")&&!ZqName.equals("")){
						if(ZqCode.equals(selCode)){
							strObj.append("<option value ='"+ZqCode+"' selected>"+ShengZqName+ZqName+"</option>");
						}else{
							strObj.append("<option value ='"+ZqCode+"'>"+ShengZqName+ZqName+"</option>");
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
}
