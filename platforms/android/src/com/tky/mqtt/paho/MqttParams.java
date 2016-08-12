package com.tky.mqtt.paho;

import com.tky.mqtt.paho.utils.SwitchLocal;

import org.eclipse.paho.client.mqttv3.MqttClientPersistence;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttPingSender;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

public class MqttParams {
	private String serverURI = SwitchLocal.getLocalIp();
	private String clientId = "zheshisunlins";//UUID.randomUUID().toString().toUpperCase();
	private String userName = "lb";
	private String password = "lb";
	private MqttClientPersistence persistence = new MemoryPersistence();
	private MqttPingSender pingSender = new MqttChatPingSender();
	private int connectionTimeout = 10;
	private int keepAliveInterval = 300;//Integer.MAX_VALUE;
	private MqttConnectOptions options;
	private boolean cleanSession = false;

	public MqttParams(){
		options = new MqttConnectOptions();
		options.setCleanSession(isCleanSession());
		options.setUserName(getUserName());
		options.setPassword(getPassword().toCharArray());
		options.setConnectionTimeout(getConnectionTimeout());
		options.setKeepAliveInterval(getKeepAliveInterval());
	}

	/**
	 * 获取到MqttConnectOptions
	 * @return
	 */
	public MqttConnectOptions getOptions() {
		return options;
	}




	public String getServerURI() {
		return serverURI;
	}

	public void setServerURI(String serverURI) {
		this.serverURI = serverURI;
	}

	public String getClientId() {
		return clientId;
	}

	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public MqttClientPersistence getPersistence() {
		return persistence;
	}

	public void setPersistence(MqttClientPersistence persistence) {
		this.persistence = persistence;
	}

	public MqttPingSender getPingSender() {
		return pingSender;
	}

	public void setPingSender(MqttPingSender pingSender) {
		this.pingSender = pingSender;
	}

	public int getConnectionTimeout() {
		return connectionTimeout;
	}

	public void setConnectionTimeout(int connectionTimeout) {
		this.connectionTimeout = connectionTimeout;
	}

	public int getKeepAliveInterval() {
		return keepAliveInterval;
	}

	public void setKeepAliveInterval(int keepAliveInterval) {
		this.keepAliveInterval = keepAliveInterval;
	}

	public boolean isCleanSession() {
		return cleanSession;
	}

	public void setCleanSession(boolean cleanSession) {
		this.cleanSession = cleanSession;
	}
}
