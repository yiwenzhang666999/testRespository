package com.forestar.cache.redis;

import java.util.HashMap;

public class Feature extends HashMap{

	@Override
	public boolean equals(Object o) {
		// TODO Auto-generated method stub
		if(o instanceof Feature){
			Feature f = (Feature)o;
			return this == o || f.get(GeomIndexConfig.ID_FIELD).toString().equals(this.get(GeomIndexConfig.ID_FIELD).toString());
		}
		return false;
	}

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return this.get(GeomIndexConfig.ID_FIELD).toString().hashCode();
	}

	
	
}
