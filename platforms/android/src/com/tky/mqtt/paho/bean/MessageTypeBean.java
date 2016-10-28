package com.tky.mqtt.paho.bean;

import java.io.Serializable;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.bean
 * 日期：2016/8/22 17:33
 * 描述：
 */
public class MessageTypeBean implements Serializable {
    private String isread = "0";
    private String isSuccess = "false";

    public String getIsSuccess() {
        return "false";
    }

    public void setIsSuccess(String isSuccess) {
        this.isSuccess = isSuccess;
    }

    public String getIsread() {
        return "0";
    }

    public void setIsread(String isread) {
        this.isread = isread;
    }
}
