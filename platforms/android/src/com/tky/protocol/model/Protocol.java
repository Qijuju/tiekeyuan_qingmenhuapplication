package com.tky.protocol.model;

import java.util.ArrayList;
import java.util.List;

public class Protocol {
	private String _name;
	private List<ProtocolNode> _nodeList = new ArrayList<ProtocolNode>();
		
	public Protocol(){
		this._name = "";
	}
	
	public Protocol(String name){
		this._name = name;
	}
	
	public void addNode(ProtocolNode node){
		this._nodeList.add(node);
	}
	
	public void addNode(List<ProtocolNode> nodes){
		this._nodeList.addAll(nodes);
	}
	
	public List<ProtocolNode> getProtocolNodes(){
		return this._nodeList;
	}

	public String getName() {
		return _name;
	}

	public void setName(String _name) {
		this._name = _name;
	}
}
