package com.forestar.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import org.springframework.orm.hibernate3.SessionFactoryUtils;

import com.forestar.core.spring.SpringBeanFactory;
import com.forestar.data.dao.DbInfo;
import com.forestar.data.dao.TransactionsBlock;
import com.forestar.data.metadata.IMetadataTable;
import com.forestar.data.metadata.IMetadataWorkspace;

public class OracleJDBC {
	/**
	 * 连接Oracle数据库获取数据
	 */
	public static String testOracle(String tableName, String [] whereStrings,String [] setFields,String type)
	{
	    Connection con = null;
	    PreparedStatement pre = null;
	    ResultSet result = null;
	    String resultJson="";
	    try
	    {
//	        Class.forName("oracle.jdbc.driver.OracleDriver");
//	        System.out.println("开始尝试连接数据库！");
//	        String url = Config.getValue("JDBCurl");
//	        System.out.println(url);
//	        String user = "ldgx_gzwl";
//	        String password = "ldgx_gzwl";
//	        con = DriverManager.getConnection(url, user, password);
	    	IMetadataWorkspace MetadataWorkspace = (IMetadataWorkspace) SpringBeanFactory.getBean("MetadataWorkspace");
			IMetadataTable iTable = MetadataWorkspace.openTable("FS_BUSINESS_KVDATA"); 
			String connKey = iTable.getWorkspace().getConnectionString();
			DbInfo dbinfo=TransactionsBlock.getDbInfo(connKey);
			con=SessionFactoryUtils.getDataSource(dbinfo.session.getSessionFactory()).getConnection();
	    	
	        System.out.println("连接成功！");
	        if("upd".equals(type)){
	        	String sql="update "+tableName+" set C_DATABODY=? where I_USERID=? and C_XIAN=? and C_APPID=? and C_DATAKEY=?";
	        	System.out.println(sql);
	        	pre = con.prepareStatement(sql);
	        	pre.setObject(1, setFields[0]);
	        	pre.setString(2, whereStrings[0]);
	        	pre.setString(3, whereStrings[1]);
	        	pre.setString(4, whereStrings[2]);
	        	pre.setString(5, whereStrings[3]);
	        }else if("add".equals(type)){
	        	System.out.println();
	        	String sql="Insert into "+tableName+" (OBJECTID,I_USERID,C_XIAN,C_APPID,C_DATAKEY,C_DATABODY) values (FS_BUSINESS_KVDATA_SE.nextval,?,?,?,?,?)";
	        	pre = con.prepareStatement(sql);
	        	pre.setString(1, setFields[0]);
	        	pre.setString(2, setFields[1]);
	        	pre.setString(3, setFields[2]);
	        	pre.setString(4, setFields[3]);
	        	pre.setObject(5, setFields[4]);
	        }
	        result = pre.executeQuery();
//	        System.out.println(result);
//	        while (result.next()){
//	        	fieldName.add(result.getString("S_FIELDNAME"));
//	        }
	    }
	    catch (Exception e)
	    {
	        e.printStackTrace();
	        return "";
	    }
	    finally
	    {
	        try
	        {
	            if (result != null)
	                result.close();
	            if (pre != null)
	                pre.close();
	            if (con != null)
	                con.close();
	            System.out.println("数据库连接已关闭！");
	        }
	        catch (Exception e)
	        {
	            e.printStackTrace();
	        }
	    }
	    return resultJson;
	}
	public static void main(String[] args) {
		String tableNames="FS_BUSINESS_KVDATA";
		String[] whereStrings=new String[]{""};
		String[] fieldsStrings=new String[]{"239","110128","ZYJG","SHDKGDATA","1"};
		String type="add";
		testOracle(tableNames,whereStrings,fieldsStrings, type);
		

//		String tableNames="FS_BUSINESS_KVDATA";
//		String[] whereStrings=new String[]{""};
//		String[] fieldsStrings=new String[]{""};
//		String type="upd";
//		testOracle(tableNames,whereStrings,fieldsStrings, type);
	}
}
