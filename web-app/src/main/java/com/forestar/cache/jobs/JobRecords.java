package com.forestar.cache.jobs;

import java.util.ArrayList;
import java.util.List;

public class JobRecords {
	
	private String recordIdx;
	
	private List<JobRecord> innerJobs = new ArrayList<JobRecord>();

	private String recordString;
	
	public JobRecords(String recordString){
		this.recordString = recordString;
	}
	
	public String getFailedString(){
		String[] arr = this.recordString.split("=");
		return arr[0]+":"+"ERR"+"="+arr[1];
	}
	
	public String getRecordString() {
		return recordString;
	}

	public String getRecordIdx() {
		return recordIdx;
	}

	public void setRecordIdx(String recordIdx) {
		this.recordIdx = recordIdx;
	}

	public List<JobRecord> getInnerJobs() {
		return innerJobs;
	}

	public void setInnerJobs(List<JobRecord> innerJobs) {
		this.innerJobs = innerJobs;
	}

	@Override
	public String toString() {
		return "JobRecords [recordIdx=" + recordIdx + ", innerJobs="
				+ innerJobs + "]";
	}
	
}
