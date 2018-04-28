package com.forestar.report.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.forestar.data.general.RowBase;
import com.forestar.data.service.BaseService;

@Controller
public class customExportExcelController {
	@Autowired
	BaseService baseService;
	@Autowired
	ExportController ExportController;
	@Autowired
	customReportController ReportController;
	  /**
	   * 
	   * @param req
	   * @param res
	   * @param crosswise	横向数据
	   * @param lengthways	纵向数据
	   * @param queryJson	条件
	   * @param country
	 * @throws Exception 
	   */
	@RequestMapping(value="/customExportExcel.web",method = RequestMethod.POST)
	@ResponseBody
	public void customExportExcel(HttpServletRequest req, HttpServletResponse res, HttpSession session)
	    throws Exception{
		List<RowBase> ListDatas = ReportController.getListData();
		Map<String, Map<String, String>> codeMap = ReportController.getCodeMap();
		Map<String, String> rowSpan = ReportController.getRowSpan();
		Map<String, String> colSpan = ReportController.getColSpan();
		Map<String, String> fieldSort = ReportController.getFieldSort();
		Map<String,Map<String,String>> ptCodeMaps=new HashMap<String,Map<String,String>>();
		Map<String,String> zqCodeMap=new HashMap<String,String>();
		String hzfiled="MIAN_JI";
		zqCodeMap=null;
		ptCodeMaps=null;
		ExportController.exportSheets(req, res, session,ListDatas, codeMap,ptCodeMaps,zqCodeMap, rowSpan, colSpan, fieldSort,hzfiled); 
	  }
	
	/**
	 * 
	 * @param req
	 * @param res
	 * @param session
	 * @throws Exception
	 */
	
	/*
	 * @RequestMapping(value="/exporttable.web",method = RequestMethod.POST)
	 * 
	 * @ResponseBody public void exporttable(HttpServletRequest req,
	 * HttpServletResponse res, HttpSession session) throws Exception {
	 * List<RowBase> ListDatas = ReportController.getListData(); Map<String,
	 * Map<String, String>> codeMap = ReportController.getCodeMap(); Map<String,
	 * String> rowSpan = ReportController.getRowSpan(); Map<String, String>
	 * colSpan = ReportController.getColSpan(); Map<String, String> fieldSort =
	 * ReportController.getFieldSort(); ExportController.exportSheets(req, res,
	 * session,ListDatas, codeMap, rowSpan, colSpan, fieldSort); }
	 */
	
	
}
