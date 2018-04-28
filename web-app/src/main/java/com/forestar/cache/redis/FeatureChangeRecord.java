package com.forestar.cache.redis;

import java.util.List;


public interface FeatureChangeRecord {

	/**
	 * 如果是用redis来记录，该方法不负责关闭和提交事务
	 * 注意record必须是唯一的，因为后来该值会作为map的key来使用
	 * @param gens
	 */
	public void doRecord(List<String> records) throws Exception;
}
