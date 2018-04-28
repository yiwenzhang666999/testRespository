package com.forestar.cache.redis;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;

public class FeatureChangeRecordInFile implements FeatureChangeRecord{

	@Override
	public void doRecord(List<String> records) throws Exception {
		// TODO Auto-generated method stub
		File file = new File("E://featureChangeRecord.txt");
		FileOutputStream fos = null;
		try{
			fos = new FileOutputStream(file,true);
			StringBuilder sb = new StringBuilder();
			for(int i = 0 ; i < records.size(); i++){
				String record = records.get(i);
				sb.append(record);
				if(i < records.size() - 1){
					sb.append("<@>");
				}
			}
			sb.append("\n");
			fos.write(sb.toString().getBytes());
		}finally{
			if(fos != null){
				fos.close();
			}
		}
	}
	
	public static void main(String[] args) throws Exception {
		FeatureChangeRecordInFile f = new FeatureChangeRecordInFile();
		List<String> records = new ArrayList<String>();
		records.add("abc");
		records.add("def");
		records.add("ghi");
		JSONObject obj = new JSONObject();
		String conent = "sss\n12";
		System.out.println(conent);
		obj.put("content", conent);
		records.add(JSONObject.toJSONString(obj));
		f.doRecord(records);
	}
	
}
