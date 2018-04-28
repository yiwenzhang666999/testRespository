package com.forestar.save;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.forestar.core.exception.ServiceException;
import com.forestar.data.general.QueryFilter;
import com.forestar.data.general.RowBase;
import com.forestar.data.metadata.IMetadataTable;
import com.forestar.data.metadata.PartitionSchema;
import com.forestar.data.service.BaseService;
import com.forestar.util.Util;

@Controller
public class dataController {
	
	@Autowired
	PartitionSchema partitionSchema;
	@Autowired
	BaseService baseService;
	String tableName;
	private static final Logger logger = Logger.getLogger(dataController.class
			.getName());
	
	
	@RequestMapping(value = "dataService.do")
	@ResponseBody
	public HashMap switchTool(String jsonStr) throws ServiceException{
		logger.info("保存接口入参："+jsonStr);
		HashMap result = new HashMap();
		double start = System.currentTimeMillis();
		result.put("success",true);
		IMetadataTable iTable = null;
		HashMap dataMap = JSON.parseObject(jsonStr, result.getClass());
		if(null!=dataMap.get("tableName")){
			logger.info(dataMap.get("tableName"));
			this.tableName = dataMap.get("tableName").toString();
		}else{
			logger.info("参数tableName为空；已经默认赋值为ZYJG_BHTB！");
			this.tableName = "ZYJG_BHTB";
		}
		String xianCode = "";
		if(null!=dataMap.get("xianCode")){
			xianCode = dataMap.get("xianCode").toString();
		}
		if(xianCode.isEmpty()){
			String x = dataMap.get("x").toString();
			String y = dataMap.get("y").toString();
			double getZqStrat = System.currentTimeMillis();
			String zqStr = Util.queryZqByPoint(x,y);
			double getZqEnd = System.currentTimeMillis();
			logger.info("获取政区用时："+(getZqEnd-getZqStrat)/1000+"秒");
			if(!"".equals(zqStr)){
				HashMap zqMap = JSON.parseObject(zqStr,new HashMap().getClass());
				xianCode = zqMap.get("code").toString();
			}
		}
		double SchemaStart = System.currentTimeMillis();
		partitionSchema.setSchemaByZQCode(xianCode);
		logger.info(partitionSchema.getSchemaName());
		double SchemaEnd = System.currentTimeMillis();
		logger.info("设置Schema用时："+(SchemaEnd-SchemaStart)/1000+"秒");
		String type = dataMap.get("type").toString();
		try {
			double openStart = System.currentTimeMillis();
			iTable = baseService.openTable(tableName);
			double openEnd = System.currentTimeMillis();
			logger.info("openTable用时："+(openEnd-openStart)/1000+"秒");
		} catch (ServiceException e2) {
			// TODO Auto-generated catch block
			logger.error(e2.getMessage());
			e2.printStackTrace();
		}
		double getDataStart= System.currentTimeMillis();
		List<JSONObject> rowList = null;
		if(null!=dataMap.get("addRows")){
			rowList = JSON.parseObject(dataMap.get("addRows").toString(),new ArrayList().getClass());
		}
		List<JSONObject> updateList = null;
		if(null!=dataMap.get("updateRows")){
			updateList = JSON.parseObject(dataMap.get("updateRows").toString(),new ArrayList().getClass());
		}
		List<String> delList = null;
		if(null!=dataMap.get("delRows")){
			delList = JSON.parseObject(dataMap.get("delRows").toString(),new ArrayList().getClass());
		}
		boolean bool = false;
		boolean b =true;
		double getDataEnd = System.currentTimeMillis();
		logger.info("格式化数据用时："+(getDataEnd-getDataStart)/1000+"秒");
		double startEdingS = System.currentTimeMillis();
		iTable.startEditing();
		double startEdingE = System.currentTimeMillis();
		logger.info("开启事务用时："+(startEdingE-startEdingS)/1000+"秒");
		if(null!=rowList){
			double insert1 = System.currentTimeMillis();
			List objectId = insert(rowList,xianCode);
			double insert2 = System.currentTimeMillis();
			logger.info("insert方法用时："+(insert2-insert1)/1000+"秒");
			if(null==objectId){
				b=false;
			}else{
				result.put("rowId",objectId);
				result.put("xianCode",xianCode);
			}
		}
		if(b){
			if(null!=updateList){
				double update1 = System.currentTimeMillis();
				b = update(updateList);
				double update2 = System.currentTimeMillis();
				logger.info("update方法用时："+(update2-update1)/1000+"秒");
			}
			if(b){
				if(null!=delList&&delList.size()>0){
					double del1 = System.currentTimeMillis();
					b = delete(delList);
					double del2 = System.currentTimeMillis();
					logger.info("delete方法用时："+(del2-del1)/1000+"秒");

				}
				if(b){
					bool =true;
				}
			}
		}
		if(bool){
			//TODO 提交
			double stop1 = System.currentTimeMillis();
			iTable.stopEditing(true);
			double stop2 = System.currentTimeMillis();
			logger.info("提交事务用时："+(stop2-stop1)/1000+"秒");
			
		}else{
			//TODO 回滚
			double stop1 = System.currentTimeMillis();
			iTable.stopEditing(false);
			double stop2 = System.currentTimeMillis();
			logger.info("回滚事务用时："+(stop2-stop1)/1000+"秒");
		}
		result.put("success",bool);
		double end = System.currentTimeMillis();
		logger.info("保存数据时间："+(end-start)/1000+"秒");
		return result;
	}
	private List insert(List<JSONObject> list,String xianCode){
		boolean bool = true;
		List objectIds = null;
		if(null!=list){
		try {
			objectIds = new ArrayList();
			List<RowBase> rowList = new ArrayList();
			String idStr = "";
			JSONObject.toJSONString(list);
			logger.info("保存参数:"+JSONObject.toJSONString(list));
			for(JSONObject jsonObj:list){
				HashMap map = JSON.parseObject(jsonObj.toJSONString(), new HashMap().getClass());
				map.put("C_XIAN",xianCode);
				RowBase rowBase = new RowBase();
				map.put("ID",0);
				String dateStr = Util.getNetworkTime();
				map.put("DT_CREATETIME",dateStr);
				rowBase.setCurrentObjects(map);
				rowList.add(rowBase);
			}
			double start = System.currentTimeMillis();
			baseService.saveList(tableName,rowList);
			double end = System.currentTimeMillis();
			logger.info("新增属性数据时间："+(end-start)/1000+"秒");
		} catch (Exception e) {
				// TODO Auto-generated catch block
				bool=false;
				objectIds=null;
				logger.error(e.getMessage());
				e.printStackTrace();
			}
			
		}
		return objectIds;
	}
	private boolean update(List<JSONObject> list){
		// TODO Auto-generated method stub
		boolean bool = true;
		int numRes = 0;
		RowBase result = null;
		List<RowBase> rowList = new ArrayList();
		String idStr = "";
		logger.info("更新参数:"+JSONObject.toJSONString(list));
		if(list.size()>0){
			try {
				double start = System.currentTimeMillis();
				for(JSONObject jsonObj:list ){
					RowBase rowBase = new RowBase();
					HashMap map = JSON.parseObject(jsonObj.toJSONString(), new HashMap().getClass());
					String netTime = Util.getNetworkTime();
					if(null!=map.get("DT_EDITTIME")){
						map.put("DT_EDITTIME", netTime);
					}
					if(null!=map.get("DT_CHECKTIME")){
						map.put("DT_CHECKTIME", netTime);
					}
					HashMap oldMap = new HashMap();
					oldMap.put("ID",map.get("ID"));
					rowBase.setCurrentObjects(map);
					rowBase.setOriginalObjects(oldMap);
					rowList.add(rowBase);
					idStr+=map.get("ID")+",";
					baseService.save(tableName,rowBase);
				}
				double end = System.currentTimeMillis();
				logger.info("更新属性数据时间："+(end-start)/1000+"秒");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				bool=false;
				logger.error(e.getMessage());
				e.printStackTrace();
			}
		}
		return bool;
	}
	private boolean delete(List<String> list){
		boolean bool = true;
		if(null!=list&&list.size()>0){
			try {
				String idStr = "";
				for(String str:list){
					idStr+=str+",";
				}
				idStr = idStr.substring(0,idStr.lastIndexOf(","));
				QueryFilter queryFilter = new QueryFilter();
				queryFilter.setWhereString("ID in ("+idStr+")");
				bool = baseService.del(tableName,queryFilter);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				bool=false;
				logger.error(e.getMessage());
				e.printStackTrace();
			}
		}
		return bool;
	}
	private int getMaxOBJECTID(){
		List<RowBase> list = null;
		int objectId = 0;
		String schemaName = partitionSchema.getSchemaName();
		try {
			double start = System.currentTimeMillis();
			list = baseService.getDataTableSql(tableName,"select sde.GDB_UTIL.NEXT_ROWID('"+schemaName+"','ZYJG_BHTB') as OBJECTID  from dual",null);
			double end = System.currentTimeMillis();
			logger.info("获取ID时间："+(end-start)/1000+"秒");
		} catch (ServiceException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		if(null!=list){
			objectId = Integer.parseInt(list.get(0).getOriginalObjects().get("OBJECTID").toString());
		}
		return objectId;
	}
}
