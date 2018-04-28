package com.forestar.report.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.forestar.data.general.RowBase;
public class IReport {
	private String fileds;
	private String filedNames;
	private String headFiledNames;
	
	public String getFileds() {
		return fileds;
	}
	public void setFileds(String fileds) {
		this.fileds = fileds;
	}
	public String getFiledNames() {
		return filedNames;
	}
	public void setFiledNames(String filedNames) {
		this.filedNames = filedNames;
	}
	public String getHeadFiledNames() {
		return headFiledNames;
	}
	public void setHeadFiledNames(String headFiledNames) {
		this.headFiledNames = headFiledNames;
	}
	public void getFiled(String [] fieldSorts,String [] NameSorts,String colNames,Map<String,Map<String,String>> codeMap){
		fileds="";
		//长度的计算
		for(int i=0;i<2;i++){
			for(int j=0;j<NameSorts.length;j++){
				if(colNames.indexOf(NameSorts[j])>-1){
					for(String key : codeMap.keySet()){
						if(i==0){//此处只判断两层表头
						}else{
							Map map=codeMap.get(fieldSorts[j]);
							for(Object mapkey :map.keySet()){
								fileds+=fieldSorts[j]+"-"+mapkey+",";
							}
							break;
						}
					}
				}else{
					if(i==0){//此处只判断两层表头
						fileds+=fieldSorts[j]+",";
					}
				}
			}
		}
	}
	public String dplitJointHead(String TableName,String unitName,List<RowBase> dataList,String [] fieldSorts,
			String [] NameSorts,String colNames,
			Map<String,Map<String,String>> codeMap){
		String thead="<thead id='ReportThead'>";
		filedNames="";
		headFiledNames="";
		//长度的计算
		int trLength = 0;
		for(int i=0;i<2;i++){
			String tr="<tr>";
			for(int j=0;j<NameSorts.length;j++){
				String td="";
				if(colNames.indexOf(NameSorts[j])>-1){
					for(String key : codeMap.keySet()){
						if(i==0){//此处只判断两层表头
							int len=fileds.split(fieldSorts[j]).length-1;
							if(len!=0){
								td="<td colspan='"+len+"'>"+NameSorts[j]+"</td>";
							}
							if(headFiledNames.indexOf(NameSorts[j])==-1){
								headFiledNames+=NameSorts[j]+",";
							}
						}else{
							Map map=codeMap.get(fieldSorts[j]);
							for(Object mapkey :map.keySet()){
								if(fileds.indexOf(fieldSorts[j]+"-"+mapkey)>-1){
									td+="<td><div class='tdStyle'>"+map.get(mapkey)+"</div></td>";
									filedNames+=map.get(mapkey)+",";
									trLength++;
								}
							}
							break;
						}
					}
				}else{
					if(i==0){//此处只判断两层表头
						td="<td rowspan='2'><div class='tdStyle'>"+NameSorts[j]+"</div></td>";
						filedNames+=NameSorts[j]+",";
						headFiledNames+=NameSorts[j]+",";
						trLength++;
					}
				}
				tr+=td;
			}
			tr+="</tr>";
			thead+=tr;
		}
		filedNames=filedNames.substring(0, filedNames.length()-1);
		/*thead+="<tr>";
		String []filed=fileds.split(",");
		//展示表格的表头下部字段的添加
		for(int i=0;i<filed.length;i++){
			thead+="<td>"+filed[i]+"</td>";
		}
		thead+="</tr>";*/
		thead+="</thead>";
		String headName ="<tr><td colspan='"+trLength+"'>"+TableName+"</td></tr>";
		headName +="<tr><td colspan='"+trLength+"'>"+unitName+"</td></tr>";
		int theadIndex = thead.indexOf("'ReportThead'>")+14;
		StringBuffer sb = new StringBuffer();
		thead = sb.append(thead).insert(theadIndex,headName).toString();
		return thead;
	}
	public List<Map<String, String>> TotalRow(List<RowBase> dataList,
			String []rowSpan,
			String colSpan,
			Map<String,String> zqCodeMap,
			String hzfiled,
			Map<String,Map<String,String>> ptCodeMap){
		List<Map<String, String>> TotalList=new ArrayList<Map<String, String>>();
		Map<String,Map<String,String>> rowMap=new LinkedHashMap<String,Map<String,String>>();
		Map<String,String> keyMap=new HashMap<String,String>();
		//第一条数据
		String key="";
		String rowSpans="";
		HashMap fristRow=dataList.get(0).getOriginalObjects();
		//唯一值key（省市县乡村图斑号）
		for(int i=0;i<rowSpan.length;i++){
			key+=fristRow.get(rowSpan[i]);
			rowSpans+=rowSpan[i]+",";
		}
		Map<String, String> map=new LinkedHashMap<String, String>();
		Map<String, String> sumMap=new LinkedHashMap<String, String>();
		String[] filed=fileds.split(",");
		//表单字段
		for(int i=0;i<filed.length;i++){
			//最终字段值
			Object value="";
			//取报表顺序字段中的有效字段名
			int index=filed[i].lastIndexOf("-");
			String f1=filed[i];
			if(index>-1){
				f1=filed[i].substring(0,index);
			}
			//判断是否存在字典项字段
			if(colSpan.indexOf(f1)>-1){
				Object code=fristRow.get(f1);
				if(code!=null&&filed[i].indexOf(code.toString())>-1){
					value=fristRow.get(hzfiled);
					//保留两位小数
					value=Double.parseDouble(value.toString());
					BigDecimal b = new BigDecimal(value.toString());
					value = b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue();
				}
				else{
					value=0;
				}
				sumMap.put(filed[i],value.toString());
				keyMap.put(key, "true");
				BigDecimal b = new BigDecimal(fristRow.get("D_AREA").toString());
				String mj = b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue()+"";
				sumMap.put(hzfiled,mj);
				map.put(hzfiled,mj);
			}else if(rowSpans.indexOf(f1)>-1){
				if(zqCodeMap!=null){
					value=zqCodeMap.get(fristRow.get(filed[i]));
				}else{
					value=fristRow.get(filed[i]);
				}
			}else if(!filed[i].equals(hzfiled)){
				if(ptCodeMap!=null&&ptCodeMap.get(filed[i])!=null)
					value=ptCodeMap.get(filed[i]).get(fristRow.get(filed[i]));
				else
					value=fristRow.get(filed[i]);
				if(value==null){
					value="";
				}
			}
			if(value==null){
				value="";
			}
			map.put(filed[i],value.toString());
		}
		rowMap.put("sumMap", sumMap);
		rowMap.put(key, map);
		//从第二条数据开始，依次对比key
		for(int j=1;j<dataList.size();j++){
			//第一条数据
			key="";
			//判断是否存在code值
			boolean flag=false;
			HashMap row=dataList.get(j).getOriginalObjects();
			//唯一值key
			for(int i=0;i<rowSpan.length;i++){
				key+=row.get(rowSpan[i]);
			}
			map=new LinkedHashMap();
			//表单字段
			for(int i=0;i<filed.length;i++){
				//最终字段值
				Object value=0;
				//取报表顺序字段中的有效字段名
				int index=filed[i].lastIndexOf("-");
				String f1=filed[i];
				if(index>-1){
					f1=filed[i].substring(0,index);
				}
				//判断是否存在字典项字段
				if(colSpan.indexOf(f1)>-1){
					if(rowMap.get(key)!=null){
						Object v=rowMap.get(key).get(filed[i]);
						if(v!=null){
							value=Double.parseDouble(v.toString());
							BigDecimal b = new BigDecimal(value.toString());
							value = b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue();
						}else{
							value=0;
						}
					}
					Object code=row.get(f1);
					if(code!=null&&filed[i].indexOf(code.toString())>-1){
						flag=true;
						Object mj=row.get(hzfiled);
						if(mj!=null){
							BigDecimal b1 = new BigDecimal(mj.toString());
							mj = b1.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue();  
							value=Double.parseDouble(value.toString())+Double.parseDouble(mj.toString());
							BigDecimal b = new BigDecimal(value.toString());
							value = b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue();  
						}else{
							value=Double.parseDouble(value.toString());
						}
						if(rowMap.get(key)!=null){
							rowMap.get(key).put(filed[i],value.toString());
						}
						Map sumMap1=rowMap.get("sumMap");
						if(sumMap1!=null){
							Object summj=sumMap1.get(filed[i]);
							if(summj!=null&&mj!=null){
								Double d=Double.parseDouble(summj.toString())+Double.parseDouble(mj.toString());
								BigDecimal b = new BigDecimal(d.toString());
								d = b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue(); 
								sumMap1.put(filed[i],d.toString());
							}
						}
					}
				}else if(rowSpans.indexOf(f1)>-1){
					if(zqCodeMap!=null){
						value=zqCodeMap.get(row.get(filed[i]));
					}else{
						value=row.get(filed[i]);
					}
				}else if(!filed[i].equals(hzfiled)){
					if(ptCodeMap!=null&&ptCodeMap.get(filed[i])!=null)
						value=ptCodeMap.get(filed[i]).get(row.get(filed[i]));
					else
						value=row.get(filed[i]);
					if(value==null){
						value="";
					}
				}
				if(value==null){
					value="";
				}
				map.put(filed[i],value.toString());
			}
			//如果存在相同key，则内部数据相加
			if(rowMap.get(key)==null){
				rowMap.put(key, map);
			}
			if(flag){
				if(row.get("D_AREA")!=null){
					Double o1=0.0;
					Object o=row.get("D_AREA");
					if(!(o==null||"".equals(o)||"0".equals(o))){
						o1=Double.parseDouble(o.toString());
					}
//					Double o2=Double.parseDouble(row.get(hzfiled).toString());
//					Double v2=o1+o2;
					BigDecimal b = new BigDecimal(o1.toString());
					o1 = b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue(); 
					rowMap.get(key).put(hzfiled,o1.toString());
				}
				if(row.get("D_AREA")!=null&&keyMap.get(key)==null){
					Double o1=0.0;
					Object o=row.get("D_AREA");
					if(!(o==null||"".equals(o)||"0".equals(o))){
						o1=Double.parseDouble(o.toString());
					}
					Double o2=Double.parseDouble(rowMap.get("sumMap").get(hzfiled).toString());
					Double v2=o1+o2;
					BigDecimal b = new BigDecimal(v2.toString());
					v2 = b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue(); 
					rowMap.get("sumMap").put(hzfiled,v2.toString());
					keyMap.put(key, "true");
				}
			}
		}
		for(String rowkey : rowMap.keySet()){
			Map<String,String> map1=rowMap.get(rowkey);
			Double summj=0.0;
			for(String key1:map1.keySet()){
				if(key1.indexOf("DI_LEI")>-1&&key1.indexOf("0200")==-1){
					Double mj1=Double.parseDouble(map1.get(key1).toString());
					summj+=mj1;
				}
			}
			summj=Double.parseDouble(map1.get("MIAN_JI").toString())-summj;
			BigDecimal b = new BigDecimal(summj.toString());
			summj = b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue(); 
			if(summj<0.05){
				map1.put("DI_LEI-0200","0");
			}else{
				map1.put("DI_LEI-0200",summj.toString());
			}
		}
		
		String [] f=fileds.split(",");
		for(int i=0;i<f.length;i++){
			Map<String,String> sMap=rowMap.get("sumMap");
			if(sMap.get(f[i])==null){
				continue;
			}
			String v3=sMap.get(f[i])+"";
			if("".equals(v3)||"0".equals(v3)){
				if(fileds.indexOf(f[i]+",")>-1){
					int sidx=fileds.indexOf(f[i]+",");
					String s=fileds.substring(sidx,sidx+f[i].length());
					fileds=fileds.replace(s+",", "");
				}else if(fileds.indexOf(f[i])>-1){
					int sidx=fileds.indexOf(f[i]);
					String s=fileds.substring(sidx,sidx+f[i].length());
					fileds=fileds.replace(s, "");
				}
			}
		}
		//存储合计数据
		for(String rowkey : rowMap.keySet()){
			TotalList.add(rowMap.get(rowkey));
		}
		return TotalList;
	}
	public int[][] mergeBody(List<Map<String,String>> TotalList,String[] rowSpan){
		int[][] merge=new int[TotalList.size()][rowSpan.length];
		for(int i=(TotalList.size()-2);i>=0;i--){
			Map<String,String> map1=TotalList.get(i);
			Map<String,String> map2=TotalList.get(i+1);
			for(int j=(rowSpan.length-1);j>=0;j--){
				Object t1=map1.get(rowSpan[j]);
				Object t2=map2.get(rowSpan[j]);
				if(t1!=null){
					if(t1.equals(t2)){
						int temp=merge[i+1][j];
						merge[i+1][j]=-1;
						merge[i][j]=temp+1;
					}else{
						merge[i][j]=0;
					}
				}
			}
		}
		return merge;
	}
	public String[][] mergeHead(List<Map<String, String>> TotalList,String colSpan,Map<String,Map<String,String>> codeMap){
		String[] fd=fileds.split(",");
		String[] fdNames=filedNames.split(",");
		String[][] merge=new String[2][fd.length];
		for(int i=0;i<merge.length;i++){
			for(int j=0;j<merge[i].length;){
				//获取字段名称
				String f=fd[j];
				int index=fd[j].lastIndexOf("-");
				if(index>-1){
					f=fd[j].substring(0,index);
				}
				//与合并列字段对比
				if(colSpan.indexOf(f)>-1){
					if(i!=0){
						merge[i][j]=fdNames[j];
						j++;
					}else{
						int len=fileds.split(f).length-1;
						if(len!=0){
							merge[i][j]=len+"c";
							j+=len;
						}
					}
				}else{
					if(i==0){
						merge[i][j]=2+"r";
					}
					j++;
				}
			}
		}
		return merge;
	}
	public String dplitJointBody(List<Map<String,String>> dataList,String [] columnNames,int[][] crcol,int sumColSpan){
		//获得当前报表的tbody对象
		String tbody="<tbody id='ReportTbody'>";
		//创建tr标签数组
		String[] trArr = new String[dataList.size()];
		//遍历结果,拼接body
		for(int i=0;i<dataList.size();i++){
			Object tdText="";
			//创建tr标签
			trArr[i] = "<tr>";
			//trArr[i].align = "center";//注释样式用CSS来定义
		    //创建单元格数组
		    Map<String,String> tdArr = dataList.get(i);
		    String[] filed=fileds.split(",");
		    //根据报表字段和字段顺序读取数据
			for(int j=0;j<filed.length;j++){
			    tdText=tdArr.get(filed[j].trim());
		    	//替换空值
		    	if(tdText==null){
		    		tdText="";
		    	}
		    	//创建每个单元格
		    	String td="";
		    	if(i==0&&j==0){
			    		td = "<td colspan='"+(sumColSpan)+"'>合计</td>";
		    	}else if(i==0&&j>0&&j<sumColSpan){
		    		td = "";
		    	}else{
			    	if(i<crcol.length&&j<crcol[i].length){
				    	int isSpan=crcol[i][j];
				    	if(isSpan==0){
					    	td = "<td>"+tdText+"</td>";
				    	}else if(isSpan>0){
					    	td = "<td rowspan='"+(isSpan+1)+"'>"+tdText+"</td>";
				    	}
			    	}else{
			    		if("0".equals(tdText)){
				    		td = "<td></td>";
			    		}else{
				    		td = "<td>"+tdText+"</td>";
			    		}
			    	}
		    	}
			    //添加到单元格数组
			    trArr[i]+=td;
		    }
			trArr[i] += "</tr>";
			//添加到页面表格tBoby
			tbody+=trArr[i];
		}
		tbody+="</tbody>";
		return tbody;
	}
	
}
