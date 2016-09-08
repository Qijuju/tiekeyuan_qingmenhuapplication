package com.tky.mqtt.paho.bean;

import java.io.Serializable;

/**
 * @description 请求与响应头对象
 * @author SLS
 *
 */
@SuppressWarnings("serial")
public class Header implements Serializable {
	private String name;
	private String value;

	public Header() {}

	public Header(String name, String value) {
		super();
		this.name = name;
		this.value = value;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
