package com.forestar.entity;
/**
 * 树节点上的_data属性
 * @author Administrator
 *
 */
public class DataOnTree {
	private String id;
	private String xian;
	private String type;
	private String nd;
	private String layerName;
	private Boolean isQuery;
	private Boolean edit;
	private String dataSource;
	private String zqCode;
	private String layerExtent;
	private String layerId;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getDataSource() {
		return dataSource;
	}
	public void setDataSource(String dataSource) {
		this.dataSource = dataSource;
	}
	public String getXian() {
		return xian;
	}
	public void setXian(String xian) {
		this.xian = xian;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getNd() {
		return nd;
	}
	public void setNd(String nd) {
		this.nd = nd;
	}
	public String getLayerName() {
		return layerName;
	}
	public void setLayerName(String layerName) {
		this.layerName = layerName;
	}
	public Boolean getIsQuery() {
		return isQuery;
	}
	public void setIsQuery(Boolean isQuery) {
		this.isQuery = isQuery;
	}
	public Boolean getEdit() {
		return edit;
	}
	public void setEdit(Boolean edit) {
		this.edit = edit;
	}
	public String getZqCode() {
		return zqCode;
	}
	public void setZqCode(String zqCode) {
		this.zqCode = zqCode;
	}
	public String getLayerExtent() {
		return layerExtent;
	}
	public void setLayerExtent(String layerExtent) {
		this.layerExtent = layerExtent;
	}
	public String getLayerId() {
		return layerId;
	}
	public void setLayerId(String layerId) {
		this.layerId = layerId;
	}
}
