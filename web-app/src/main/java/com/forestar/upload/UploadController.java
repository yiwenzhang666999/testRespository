package com.forestar.upload;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.UUID;
import java.util.concurrent.TimeoutException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.forestar.core.Config;
import com.forestar.core.exception.ServiceException;
import com.forestar.core.session.SessionFactory;
import com.forestar.data.general.QueryFilter;
import com.forestar.data.general.RowBase;
import com.forestar.data.service.BaseService;
import com.forestar.joint.resouces.model.UserDataModel;
import com.forestar.safe.controller.BaseController;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

@Controller
public class UploadController  extends BaseController {
	
	public final static String QUEUE_NAME="LDGX.TransformTasks";
	static boolean   flag = false;  
	private static Timer timer = null;
	@Autowired
	BaseService baseDataService;
	public List<RowBase> list = null;
	public int count=0;
	public HttpServletResponse resp=null;
	@RequestMapping(value = "/getfile.do")
	public void  getFile(@RequestParam(value = "file", required = false) MultipartFile file,
			@RequestParam(value = "checkPoints", required = false) String checkPoints,
			@RequestParam(value = "layerName", required = false) String layerName,
			@RequestParam(value = "md", required = false) String md5,
			@RequestParam(value = "layerExtent", required = false) String layerExtent,
			@RequestParam(value = "shengCode", required = false) String shengCode,
			HttpServletRequest request,HttpServletResponse res,HttpSession session){
		resp=res;
		 JSONObject objec = new JSONObject();
		 JSONArray classObject=new JSONArray();
		 String name="";
		 String str="";
		//用户id
	        UserDataModel userEntity = (UserDataModel)SessionFactory.getSession().getObject("UserEntity");
		  if (!file.isEmpty()) { 
		      try { 
		        // 文件保存路径 
		        String filePath =Config.getValue("filePath")+"/"+ file.getOriginalFilename();
		        String filePathTemp =Config.getValue("filePath")+"/"+System.currentTimeMillis()+ file.getOriginalFilename();
		        /**
		         * 公司使用
		         */
//		        String temp_="G:/HLW+LDGX/user_gisdata_process/"+ file.getOriginalFilename();
//		        String filePath1= filePath.replaceAll("\\\\", "/");
//		      //判断服务器上是否有这个文件
//		        File serviceFile=new File(filePath);
//		        if(serviceFile.exists()){
//		        	String v=fileToMD5(filePath); 	
//		        	if(v.equals(md5)){
//			        	
//			        }else{
//			        	filePath1=filePathTemp.replaceAll("\\\\", "/");
//			        	// 转存文件 
//				        file.transferTo(new File(filePath1));
//			        }
//		        }else{
//		        	filePath1=filePathTemp.replaceAll("\\\\", "/");
//		        	// 转存文件 
//			        file.transferTo(new File(filePath1));
//		        }
//		        name=file.getOriginalFilename(); 
//		        objec.put("filePath", temp_);
		        /**
		         * 现场使用
		         */
		        String filePath1= filePath.replaceAll("\\\\", "/");
		      //判断服务器上是否有这个文件
		        File serviceFile=new File(filePath1);
		        if(serviceFile.exists()){
		        	String v=fileToMD5(filePath1); 	
		        	if(v.equals(md5)){
			        	
			        }else{
			        	filePath1=filePathTemp.replaceAll("\\\\", "/");
			        	// 转存文件 
				        file.transferTo(new File(filePath1));
			        }
		        }else{
		        	filePath1=filePathTemp.replaceAll("\\\\", "/");
		        	// 转存文件 
			        file.transferTo(new File(filePath1));
		        }
		        name=file.getOriginalFilename(); 
		        objec.put("filePath", filePath1);
		        objec.put("layerExtent", layerExtent);
		        objec.put("shengCode", shengCode);
		        UUID uuid = UUID.randomUUID();
		        objec.put("uuid", uuid);
		        if(layerName!=null&&""!=layerName){
		        	objec.put("layerName", layerName);
		        }else{
		        	objec.put("layerName", name);
		        }
		        if(null!=userEntity){
		        	String userId=userEntity.getUserid();
			        objec.put("userId", userId);
		        }else{
		        	objec.put("userId", 4);
		        }
		        if(checkPoints.length()>0&&checkPoints!=null ){
		        	 classObject.add(checkPoints);
//		        	String temp=checkPoints
					  objec.put("controlPoints", classObject);
				  }else{
					  objec.put("controlPoints", classObject);
				  }
		        String str_=objec.toString().replaceAll("\\\\", "");
		        String str1=str_.replace("[\"{", "[{");
		        str=str1.replaceAll("\"]", "]");
		        System.out.println(str);
		        Producer(str,uuid,res);
//		        OutputData(list, res);
		      } catch (Exception e) { 
		        e.printStackTrace(); 
		      } 
		      
		  }
//		  return "/index";
	}
	public  void Producer(String string, UUID uuid, HttpServletResponse res) throws IOException, TimeoutException, InterruptedException {
	        //创建连接工厂
	        ConnectionFactory factory = new ConnectionFactory();
	        //设置RabbitMQ相关信息
	        
	        factory.setHost(Config.getValue("rabbitIp"));
	        factory.setUsername(Config.getValue("rabbitUser"));
	        factory.setPassword(Config.getValue("rabbitPassWord"));	
	        int port= Integer.parseInt(Config.getValue("rabbitPort"));
	        factory.setPort(port);
	        //创建一个新的连接
	        Connection connection = factory.newConnection();
	        //创建一个通道
	        Channel channel = connection.createChannel();
	        //  声明一个队列        
	        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
	        String message = string;
	        //发送消息到队列中
	        channel.basicPublish("", QUEUE_NAME, null, message.getBytes("UTF-8"));
	        //关闭通道和连接
	        channel.close();
	        connection.close();
	        //查询处理状态
	        Map queryData = new HashMap();
	        queryData.put("uuid", uuid);
	        OutputData(queryData,res);
	    }
	@RequestMapping(value = "/queryState.do")
	public void queryState(HttpServletRequest request,HttpServletResponse res){
		// 1、获取参数
		String jsonStr = request.getParameter("data");
		JSONObject jsonObj = JSON.parseObject(jsonStr);
		String uuid=jsonObj.getString("uuid");
		QueryFilter filter = new QueryFilter();
		filter.setWhereString("C_UUID='"+uuid+"'");
		String tableName="FS_BUSINESS_USERCUSLAYERS";
		try {
			List<RowBase> result=baseDataService.getEntityList(tableName, filter);
			OutputData(result, res);
		} catch (ServiceException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//TODO do something 
//		OutputData(list, resp);
	}
	 public static String fileToMD5(String path){
		    try {
		        FileInputStream fis = new FileInputStream(path);
		        MessageDigest digest = MessageDigest.getInstance("MD5");
		        byte[] buffer = new byte[1024];
		        int len;
		        while ((len = fis.read(buffer)) != -1) {
		            digest.update(buffer, 0, len);
		        }
		        fis.close();
		        BigInteger bigInt = new BigInteger(1, digest.digest());
		        return  bigInt.toString(16);
		    } catch (IOException e){
		        e.printStackTrace();
		    } catch (NoSuchAlgorithmException e) {
				e.printStackTrace();
			}
		    return "";
		}

}
