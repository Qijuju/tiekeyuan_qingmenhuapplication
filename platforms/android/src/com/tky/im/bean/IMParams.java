package com.tky.im.bean;

import com.tky.im.utils.IMSwitchLocal;
import com.tky.im.utils.IMUtils;
import com.tky.mqtt.paho.MType;
import com.tky.mqtt.paho.MqttChatPingSender;
import com.tky.mqtt.paho.utils.SwitchLocal;

import org.eclipse.paho.client.mqttv3.MqttClientPersistence;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

/**
 * Created by tkysls on 2017/4/11.
 */

public class IMParams {
    private String serverURI = IMSwitchLocal.getATopic(MType.U, IMSwitchLocal.getLocalIp());
    private String clientId = IMUtils.getUserID();//设备唯一标识码
    private String userName = "lb";
    private String password = "lb";
    private MqttClientPersistence persistence = new MemoryPersistence();
    private MqttChatPingSender pingSender = new MqttChatPingSender();
    private int connectionTimeout = 10;
    private int keepAliveInterval = 300;//20;//Integer.MAX_VALUE;
    private MqttConnectOptions options;
    private boolean cleanSession = false;

    public IMParams(){
        options = new MqttConnectOptions();
        options.setAutomaticReconnect(false);
        options.setCleanSession(isCleanSession());
        options.setUserName(getUserName());
        options.setPassword(getPassword().toCharArray());
        options.setConnectionTimeout(getConnectionTimeout());
        options.setKeepAliveInterval(getKeepAliveInterval());
        options.setWill(IMSwitchLocal.getOnOffTopic(), IMUtils.getOnOffState("UOF"), 1, false);
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

}
