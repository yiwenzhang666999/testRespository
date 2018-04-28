package com.forestar.cache.redis;
/**
 * 获得redis中
 * @author pt-sy
 *
 */
public class GridIndexKeyGenerator implements KeyGenerator{
	//带数据集名
	private String datasetName;
	//图层名
	private String layerName;
	//网格列号
	private String col;
	//网格行号
	private String row;
	
	public GridIndexKeyGenerator(String datasetName, String layerName, String col,
			String row) {
		super();
		this.datasetName = datasetName;
		this.layerName = layerName;
		this.col = col;
		this.row = row;
	}

	@Override
	public String getKey() {
		// TODO Auto-generated method stub
		return this.datasetName + ":" + this.layerName + ":" + this.col + "_" + this.row;
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

	public String getCol() {
		return col;
	}

	public void setCol(String col) {
		this.col = col;
	}

	public String getRow() {
		return row;
	}

	public void setRow(String row) {
		this.row = row;
	}

	@Override
	public String toString() {
		return this.getKey();
	}

	
}
