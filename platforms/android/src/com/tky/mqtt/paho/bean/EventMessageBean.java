package com.tky.mqtt.paho.bean;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.bean
 * 日期：2016/8/22 17:34
 * 描述：
 */
public class EventMessageBean extends MessageTypeBean {
    /**
     * 通知类型
     */
    private String notifyType;

    public String getNotifyType() {
        return notifyType;
    }

    public void setNotifyType(String notifyType) {
        this.notifyType = notifyType;
    }
}
