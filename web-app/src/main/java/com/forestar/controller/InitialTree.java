package com.forestar.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.forestar.core.exception.ServiceException;
import com.forestar.data.general.IWorkspace;
import com.forestar.data.general.QueryFilter;
import com.forestar.data.general.RowBase;
import com.forestar.data.service.BaseService;
import com.forestar.entity.CustomTreeModel;
import com.forestar.entity.DataOnTree;
/**
 * 初始化树加载
 * @author Administrator
 *
 */
@Controller
public class InitialTree {
	
	Logger logger=Logger.getLogger(getClass());
	
	
	@Autowired
	BaseService baseService;
	
	private static final String CustomTable = "FS_BUSINESS_USERBUSLAYERS"; // 变化地块表
	
	private static final String BusinessTable = "FS_BUSINESS_USERCUSLAYERS"; // 业务数据表
	
	@RequestMapping(value={"/tree/initialTree.do"}, produces={"text/html;charset=UTF-8"})
	@ResponseBody
	public String initializationTree(HttpServletRequest request, HttpServletResponse response, String data, Model model)throws ServiceException {
		List<Object> treeDataList = new ArrayList<Object>();

		long startTime = System.currentTimeMillis();
		
		
		
		 try {
			
			
			JSONObject jsonData = JSONObject.parseObject(data);
			// TODO
			String whereData = jsonData.getString("where");
			// TODO 
			JSONObject whereJson = JSONObject.parseObject(whereData);
			// TODO 
			String userid = whereJson.getString("userid");
			
			String appid = whereJson.getString("appid");
			// TODO 
			String where = "I_USERID = '" + userid + "' And C_APPID = '" + appid + "'";
			// 获取变化地块数据
			getCustomData(where,treeDataList);
			// 获取业务数据
			getBusinessData( "I_USERID = '" + userid + "'",treeDataList);
			
			logger.info("初始化树成功！");
			
		} catch (ServiceException e) {
			logger.info("初始化树失败！");
			
				
			e.printStackTrace();
		}
		long endTime = System.currentTimeMillis();
		return JSON.toJSONString(treeDataList);
	}
	
	
	/**
	 * 获取变化地块数据
	 * @param where 查询条件
	 * @throws ServiceException 
	 */
	public void getCustomData(String where,List<Object> treeDataList) throws ServiceException {
		
		QueryFilter query = new QueryFilter();
		
		query.setOrderByString("C_SHENG,C_XIAN,I_LYRORDERID");
		
		query.setWhereString(where);
		
		query.setSelectFields(" I_ID, I_PARID, C_SHENG, C_SHENGNAME, C_XIAN, C_XIANNAME, C_DATANAME, C_WORKYEAR, C_DATASOURCE");
		
		List<RowBase> list = baseService.getEntityList(CustomTable, query);
		// TODO 
		ArrayList rootNodeChildrens = new ArrayList();
		
		ArrayList xianNodes = new ArrayList();
		// 树模型
		CustomTreeModel customTreeModel = new CustomTreeModel();
		// 一级节点的子节点
		List<CustomTreeModel> oneLevelNodeChildren = new  ArrayList<CustomTreeModel>();
		// TODO 
		customTreeModel.setId("bhdk");
		
		customTreeModel.setPid("-1");
		
		customTreeModel.setText("变化地块");
		
		customTreeModel.setShowMore(true);
		
		customTreeModel.setType("bhdk");
		
		customTreeModel.setJb(1);
		
		customTreeModel.setChildren(oneLevelNodeChildren);
		
		if (list.size() > 0) {
			// TODO 
			for (int i = 0; i < list.size(); i++) {
				 
				HashMap obj1 = list.get(i).getOriginalObjects();
				
				 if (obj1.get("C_XIAN") == null) { // 省
					 // 二级节点的子节点
					 List<CustomTreeModel> secondLevelNodeChildren = new  ArrayList<CustomTreeModel>();
					 // 二级节点
					 CustomTreeModel customTreeModelSecondaryNode = new CustomTreeModel();
					 // TODO 
					 customTreeModelSecondaryNode.setId("bhdk" + obj1.get("I_ID").toString());
					 
					 customTreeModelSecondaryNode.setText(obj1.get("C_SHENGNAME").toString());
					
					 customTreeModelSecondaryNode.setSort(obj1.get("C_SHENG").toString());
					 
					 customTreeModelSecondaryNode.setChildren(secondLevelNodeChildren);
					// 将二级节点放入一级节点的子节点中
					 oneLevelNodeChildren.add(customTreeModelSecondaryNode);
					 
                     for (int j = 0; j < list.size(); j++) {
                    	 HashMap obj2 = list.get(j).getOriginalObjects();
                         // TODO 
                    	 if (obj1.get("I_ID").equals(obj2.get("I_PARID")) &&  obj2.get("C_DATANAME") == null) { // 县节点
                         	 // 三级节点的子节点
                         	List<CustomTreeModel> threeLevelNodeChildren = new  ArrayList<CustomTreeModel>();
                         	// 三级节点
                         	CustomTreeModel customTreeModelLevelThreeNode = new CustomTreeModel(); 
                         	
                         	DataOnTree dataOntree = new DataOnTree(); // 三级节点的_data属性
                         	// TODO 
                         	customTreeModelLevelThreeNode.setId("bhdk" + obj2.get("I_ID").toString());
                         	
                         	customTreeModelLevelThreeNode.setI_id(obj2.get("I_ID").toString());
                         	
                         	customTreeModelLevelThreeNode.setI_pid(obj2.get("I_PARID").toString());
                         	
                         	customTreeModelLevelThreeNode.setText(obj2.get("C_XIANNAME").toString());
                         	
                         	customTreeModelLevelThreeNode.setSort(obj2.get("C_XIAN").toString());
                         	
                         	dataOntree.setXian(obj2.get("C_XIAN").toString());
                         	
                         	dataOntree.setType("bhdk");
                         	
                         	if (obj2.get("C_WORKYEAR") == null) { // 判断年度是否为空
                         		
                         		dataOntree.setNd(null);
                         	} else {
                         		dataOntree.setNd(obj2.get("C_WORKYEAR").toString());
                         	}
                         	customTreeModelLevelThreeNode.set_data(dataOntree);
                         	
                         	customTreeModelLevelThreeNode.setXian(obj2.get("C_XIAN").toString());
                         	// 将三级节点放入二级节点的子节点中
                         	secondLevelNodeChildren.add(customTreeModelLevelThreeNode);
                         	// 遍历获取四级节点
                         	for (int fourLevel = 0; fourLevel < list.size(); fourLevel++) {
                         		HashMap fourLevelObject = list.get(fourLevel).getOriginalObjects();
                         		
                         		String dataSource = null, tableName = null;
                         		
                         		if (fourLevelObject.get("C_DATANAME") != null && obj2.get("I_ID").equals(fourLevelObject.get("I_PARID"))) {
                         			// 四级节点
                                 	CustomTreeModel customTreeModelFourLevelNode = new CustomTreeModel(); 
                                 	// 根据表名区分变化图斑与地类和起源
                                 	dataSource = (String) fourLevelObject.get("C_DATASOURCE");
                                 	
                                 	tableName = (String) JSON.parseObject(dataSource, new HashMap().getClass()).get("tablename");
                                 		
	                         		customTreeModelFourLevelNode.setSort(fourLevelObject.get("C_WORKYEAR").toString());
	                         		
	                         		customTreeModelFourLevelNode.setText(fourLevelObject.get("C_DATANAME").toString());
	                         		
	                         		customTreeModelFourLevelNode.setIconType(null);
	                         		
	                         		customTreeModelFourLevelNode.setSelectId(fourLevelObject.get("C_XIAN").toString() + fourLevelObject.get("C_WORKYEAR").toString());
	                         		
	                         		DataOnTree fourlevelData = new DataOnTree(); // 四级节点的_data属性
	                         		
	                         	    fourlevelData.setXian(fourLevelObject.get("C_XIAN").toString());
	                         	    
	                         	    fourlevelData.setLayerName(fourLevelObject.get("C_XIANNAME").toString() + fourLevelObject.get("C_DATANAME").toString());
	                         	   
	                         	    fourlevelData.setNd(fourLevelObject.get("C_WORKYEAR").toString());
	                         	   
	                         		if (tableName.equalsIgnoreCase("ZYJG_BHTB")) { // 变化图斑
	                         			
	                             		fourlevelData.setType("bhdk");
	                             		
	                             		fourlevelData.setIsQuery(true);
	                             		
	                             		fourlevelData.setEdit(true);
	                             		
	                             		customTreeModelFourLevelNode.setId( "bhdk" + fourLevelObject.get("I_ID").toString() + "_tb0");
	                         		
	                         		} else { // 地类分组和起源分组 
	                         			fourlevelData.setId(fourLevelObject.get("I_ID").toString());
	                         			
	                         			fourlevelData.setType(tableName);
	                         			
	                         			fourlevelData.setIsQuery(false);
	                         			
	                         			fourlevelData.setDataSource(dataSource);
	                         			
	                         			customTreeModelFourLevelNode.setId( tableName + fourLevelObject.get("I_ID").toString() + "_tb0");
	                         		}
	                         		customTreeModelFourLevelNode.set_data(fourlevelData);
	                         		// 将四级节点添加到三级节点的childrenList中
	                         		threeLevelNodeChildren.add(customTreeModelFourLevelNode);
                         		}
                         	}
                         // 将四级节点放入三级节点的子节点中
                     	 customTreeModelLevelThreeNode.setChildren(threeLevelNodeChildren);
                         }
                     } 
				 }
			} 
		}
		treeDataList.add(customTreeModel);
	}
	/**
	 * 获取业务数据
	 * @param where 查询条件
	 * @throws ServiceException 
	 */
	public void getBusinessData(String where,List<Object> treeDataList) throws ServiceException {
		
		ArrayList businessRootNodeChildrens = new ArrayList();
		
		QueryFilter query = new QueryFilter();
		
		query.setWhereString(where);
		
		query.setSelectFields(" I_ID, C_DATANAME, C_SHENG, C_FULLEXTENT");
		
		query.setOrderByString("I_ID, I_LYRORDERID");
		
		List<RowBase> list = baseService.getEntityList(BusinessTable, query);
		// 树模型
		CustomTreeModel businessTreeModel = new CustomTreeModel();
		// 一级节点的子节点
		List<CustomTreeModel> oneLevelNodeChildren = new  ArrayList<CustomTreeModel>();
		
		businessTreeModel.setId("ywsj");
		
		businessTreeModel.setPid("-1");
		
		businessTreeModel.setText("业务数据");
		
		businessTreeModel.setShowAdd(true);
		
		businessTreeModel.setChildren(oneLevelNodeChildren);
		if (list.size() > 0) {
			for (int i = 0; i < list.size(); i++) {
				 HashMap obj1 = list.get(i).getOriginalObjects();
				 // 二级节点子节点的集合
				 List<CustomTreeModel> secondLevelNodeChildren = new  ArrayList<CustomTreeModel>();
				 // 二级节点
				 CustomTreeModel businessTreeModelSecondaryNode = new CustomTreeModel();
				 
				 businessTreeModelSecondaryNode.setId(obj1.get("I_ID").toString());
				 
				 businessTreeModelSecondaryNode.setLayerId(obj1.get("I_ID").toString());
				 
				 businessTreeModelSecondaryNode.setText(obj1.get("C_DATANAME").toString());
				 
				 businessTreeModelSecondaryNode.setShowDel(true);
				 
				 businessTreeModelSecondaryNode.setType("z");
				 
				 businessTreeModelSecondaryNode.setLayerName("业务数据");
				 
				 businessTreeModelSecondaryNode.setText(obj1.get("C_DATANAME").toString());
				 
				 // 二级节点上的_data属性
				 DataOnTree businessDataOnTree = new DataOnTree();
				 
				 businessDataOnTree.setEdit(false);
				 
				 businessDataOnTree.setIsQuery(true);
				 
				 businessDataOnTree.setLayerId(obj1.get("I_ID").toString());
				 
				 businessDataOnTree.setZqCode(obj1.get("C_SHENG").toString());
				 
				 businessDataOnTree.setType("ywsj");
				 
				 businessDataOnTree.setLayerExtent(obj1.get("C_FULLEXTENT").toString());
				 
				 businessTreeModelSecondaryNode.set_data(businessDataOnTree);
				// 将二级节点放入一级节点的子节点中
				 oneLevelNodeChildren.add(businessTreeModelSecondaryNode);
			}
		}
		treeDataList.add(businessTreeModel);
	}
}
