package com.forestar.cas.client.ext;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


public class TGTMappingStorage {

	private Map<String,Boolean> mapping = new ConcurrentHashMap<String,Boolean>();
	
	public void addByTGT(String tgt){
		this.mapping.put(tgt,true);
	}
	
	public void removeByTGT(String tgt){
		this.mapping.remove(tgt);
	}
	
	public boolean containTGT(String tgt){
		return this.mapping.containsKey(tgt);
	}
}
