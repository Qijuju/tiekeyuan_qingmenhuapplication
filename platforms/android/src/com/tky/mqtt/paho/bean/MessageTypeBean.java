package com.tky.mqtt.paho.bean;

import java.io.Serializable;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.bean
 * 日期：2016/8/22 17:33
 * 描述：
 */
public class MessageTypeBean implements Serializable {
    /**
     * 消息的ID
     */
    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
