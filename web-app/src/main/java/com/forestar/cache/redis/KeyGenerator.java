package com.forestar.cache.redis;
/**
 * redis key 生成器
 * 
 * @see GridIndexKeyGenerator  dataset+':'+dataname+':'+col+'_'+row
 * @see AttributeIndexKeyGenerator dataset_name+':'+layer_name+':'+OID
 * 
 * @author pt-sy
 *
 */
public interface KeyGenerator {

	public String getKey();
}
