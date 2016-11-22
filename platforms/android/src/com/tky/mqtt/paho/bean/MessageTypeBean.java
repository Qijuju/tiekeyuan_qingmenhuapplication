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
    private String daytype="1";
    private String istime = "false";
    private String senderid;

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

    public String getDaytype() {
        return daytype;
    }

    public void setDaytype(String daytype) {
        this.daytype = daytype;
    }

    public String getIstime() {
        return istime;
    }

    public void setIstime(String istime) {
        this.istime = istime;
    }

    public String getSenderid() {
        return senderid;
    }

    public void setSenderid(String senderid) {
        this.senderid = senderid;
    }
}
