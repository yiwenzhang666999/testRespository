package com.forestar.upload;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.forestar.core.exception.ServiceException;
import com.forestar.data.general.QueryFilter;
import com.forestar.data.metadata.PartitionSchema;
import com.forestar.data.service.BaseService;

@Controller
public class YwsjController {
	@Autowired
	  BaseService baseService;
	@Autowired
	PartitionSchema partitionSchema;
//	private static final String cataLog = "FS_USERGISDATA_CATALOG";
	private static final String cuslayer = "FS_BUSINESS_USERCUSLAYERS";
	private static final String gisData_py = "USERGISDATA_PY";
	/**
	 * 业务数据删除
	 * @return 
	 */
	 @RequestMapping(value={"/ywsj/del.do"})
	 @ResponseBody
	 public boolean del(HttpServletRequest request, HttpServletResponse response, String data, Model model)
			 throws ServiceException{
		 JSONObject jsonData = JSONObject.parseObject(data);
		 String layerId=jsonData.getString("layerId");
		 String code=jsonData.getString("code");
		 String where="ID="+layerId;
		 QueryFilter query = new QueryFilter();
		 query.setWhereString(where);
		 try{
			 boolean flag=true;
			 query.setWhereString("I_ID="+layerId);
			 flag=baseService.del(cuslayer, query);
			 
			 query.setWhereString("I_LYRID="+layerId);
			 
			 partitionSchema.setSchemaByZQCode(code);
			 flag=baseService.del(gisData_py, query);
			 return flag; 
		 }catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return false;
			}
		 
	 }
}
