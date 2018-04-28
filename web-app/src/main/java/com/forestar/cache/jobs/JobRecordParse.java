package com.forestar.cache.jobs;
/**
 *  demo : 2.0=360323:ZYJG_BHTB:1898_460|df4e28e2-5c2d-4c16-80b7-344feac7a3b2:,360323:ZYJG_BHTB:1899_460|22bc42ae-afae-47c0-9382-631dc77e63e0:
 * @author pt-sy
 *
 */
public class JobRecordParse {
	
	public JobRecords parse(String recordString){
		JobRecords result = new JobRecords(recordString);
		String recordIdx = "-1";
		String[] strs1 = recordString.split("=");
		recordIdx = strs1[0];
		String[] strs2 = strs1[1].split(",");
		for(String str2 : strs2){
			String[] strs3 =  str2.split("\\|");
			String layerName = "";
			String datasetName = "";
			String indexIdx = "";
			JobRecord jobRecord = new JobRecord();
			indexIdx = strs3[1];
			String[] strs4 = strs3[0].split(":");
			datasetName = strs4[0];
			layerName = strs4[1];
			jobRecord.setCol(strs4[2].split("_")[0]);
			jobRecord.setRow(strs4[2].split("_")[1]);
			jobRecord.setDatasetName(datasetName);
			jobRecord.setIndexIdx(indexIdx);
			jobRecord.setLayerName(layerName);
			result.getInnerJobs().add(jobRecord);
		}
		result.setRecordIdx(recordIdx);
		return result;
	}
}
