package com.tky.protocol.model;

import java.util.ArrayList;
import java.util.List;

public class ProtocolNode {
		
	private String _name;
	private int _length;
	private boolean isFixed;
	private String _type;
	private List<String> _values = null;
	
	public ProtocolNode(String node, int length){
		this(node, length, true);
	}
	
	public ProtocolNode(String node, int length, boolean isFixed){
		this._name = node;
		this._length = length;
		this.isFixed = isFixed;
		this._type = IMPFields.DT_String;
	}

	public String getNodeName() {
		return _name;
	}

	public int getNodeLength() {
		return _length;
	}

	public void setNodeLength(int _length) {
		this._length = _length;
	}

	public boolean isFixed() {
		return isFixed;
	}

	public void setFixed(boolean isFixed) {
		this.isFixed = isFixed;
	}

	public String get_type() {
		return _type;
	}

	public void set_type(String _type) {
		this._type = _type;
	}

	public List<String> get_values() {
		return _values;
	}

	public void set_values(String _values) {
		this._values = new ArrayList<String>();
		String[] valueArray = _values.split(",");
		for(String vlu : valueArray){
			this._values.add(vlu);
		}
	} 
}
