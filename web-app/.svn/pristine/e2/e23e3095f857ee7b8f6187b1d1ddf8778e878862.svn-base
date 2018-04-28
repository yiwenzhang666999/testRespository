package com.forestar.cache.redis;

public class AttributeIndexKeyGenerator implements KeyGenerator{
	//带数据集名
	private String datasetName;
	//图层名
	private String layerName;
	//要素ID
	private String oid;
	
	public AttributeIndexKeyGenerator(String datasetName, String layerName,
			String oid) {
		super();
		this.datasetName = datasetName;
		this.layerName = layerName;
		this.oid = oid;
	}
	
	public AttributeIndexKeyGenerator(String str){
		super();
		String [] arr = str.split(":");
		this.setDatasetName(arr[0].trim());
		this.setLayerName(arr[1].trim());
		this.setOid(arr[2].trim());
	}

	@Override
	public String getKey() {
		// TODO Auto-generated method stub
		return this.datasetName + ":" + this.layerName + ":" + this.oid;
	}

	
	public String getDatasetName() {
		return datasetName;
	}

	public void setDatasetName(String datasetName) {
		this.datasetName = datasetName;
	}

	public String getLayerName() {
		return layerName;
	}

	public void setLayerName(String layerName) {
		this.layerName = layerName;
	}

	public String getOid() {
		return oid;
	}

	public void setOid(String oid) {
		this.oid = oid;
	}

	
	
}
