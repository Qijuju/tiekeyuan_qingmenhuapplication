package com.tky.mqtt.paho;

import com.tky.mqtt.paho.utils.SwitchLocal;
import com.tky.protocol.factory.IMMsgFactory;
import com.tky.protocol.model.IMPException;

import org.eclipse.paho.client.mqttv3.MqttClientPersistence;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import cn.jpush.android.api.JPushInterface;

public class MqttParams {
	private String serverURI = SwitchLocal.getLocalIp();
	private String clientId = "tpa" + getUserID();//设备唯一标识码
	private String userName = "lb";
	private String password = "lb";
	private MqttClientPersistence persistence = new MemoryPersistence();
	private MqttChatPingSender pingSender = new MqttChatPingSender();
	private int connectionTimeout = 10;
	private int keepAliveInterval = 300;//20;//Integer.MAX_VALUE;
	private MqttConnectOptions options;
	private boolean cleanSession = false;

	public MqttParams(){
		options = new MqttConnectOptions();
		options.setCleanSession(isCleanSession());
		options.setUserName(getUserName());
		options.setPassword(getPassword().toCharArray());
		options.setConnectionTimeout(getConnectionTimeout());
		options.setKeepAliveInterval(getKeepAliveInterval());
    options.setWill(SwitchLocal.getOnOffTopic(),getOnOffState("UOF"),1,true);
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

	public MqttChatPingSender getPingSender() {
		return pingSender;
	}

	public void setPingSender(MqttChatPingSender pingSender) {
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

  /**
   * 获取上下线状态
   * @param onoff
   * @return
     */
  public byte[] getOnOffState(String onoff) {
    byte[] data=null;
    Map<String,Object> map=new HashMap<String, Object>();
    map.put("MepID", JPushInterface.getRegistrationID(BaseApplication.getContext()));
    map.put("UserID",getUserID());
    try {
      data=  IMMsgFactory.createEvent(onoff,map);
    } catch (IMPException e) {
      e.printStackTrace();
    }
    return data;
  }





	/**
	 * 获取当前登录的用户ID
	 * @return
	 */
	private String getUserID() {
		JSONObject userInfo = null;
		try {
			userInfo = getUserInfo();
			return userInfo.getString("userID");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return UUID.randomUUID().toString().toUpperCase().substring(0, 6);
	}

	private JSONObject getUserInfo() throws JSONException {
		String login_info = SPUtils.getString("login_info", "");
		return new JSONObject(login_info);
	}

}
