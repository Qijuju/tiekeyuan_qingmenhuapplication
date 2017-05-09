package com.tky.protocol.model;

import java.util.HashMap;
import java.util.Map;

public class Dependency {
	private String _name;
	private Map<String, String> _relation = new HashMap<String, String>();
	private String _other;
	
	public Dependency(String dependName){
		this._name = dependName;
		this._other = "";
	}
	
	public String getName() {
		return _name;
	}

	public Map<String, String> get_relation() {
		return _relation;
	}

	public void set_relation(Map<String, String> _relation) {
		this._relation = _relation;
	}
	
	public void add_relation(String value, String object){
		this._relation.put(value, object);
	}
	
	public String getObject(String value){
		return this._relation.containsKey(value)?this._relation.get(value):_other;
	}
	
	public void setCommonObject(String com){
		if(com!=null)
		this._other = com;
	}
}
