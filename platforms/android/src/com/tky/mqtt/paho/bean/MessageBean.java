package com.tky.mqtt.paho.bean;

import java.io.Serializable;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.bean
 * 日期：2016/8/12 9:13
 * 描述：
 */
public class MessageBean implements Serializable {
    private String _id;// UUID.randomUUID().toString().toUpperCase());
    private String sessionid;//", msgMap.get("to"));
    private String account;//", getUserID());
    private String type;//", getMsgTypeStr((IMMsgFactory.MsgType) msgMap.get("type")));
    private String from;//", "false");
    private String message;//", msgMap.get("message"));
    private String messagetype;//", getMediaTypeStr((IMMsgFactory.MediaType) msgMap.get("mediaType")));
    private String platform;//", getPlatTypeStr((IMMsgFactory.PlatType) msgMap.get("platform")));
    private Long when;//", msgMap.get("when"));
    private String isFailure;//", "false");
    private String singlecount;//", "");
    private String qunliaocount;//", "");
    private String isDelete;//", "");
    private String imgSrc;//", "");

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getSessionid() {
        return sessionid;
    }

    public void setSessionid(String sessionid) {
        this.sessionid = sessionid;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessagetype() {
        return messagetype;
    }

    public void setMessagetype(String messagetype) {
        this.messagetype = messagetype;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public Long getWhen() {
        return when;
    }

    public void setWhen(Long when) {
        this.when = when;
    }

    public String getIsFailure() {
        return isFailure;
    }

    public void setIsFailure(String isFailure) {
        this.isFailure = isFailure;
    }

    public String getSinglecount() {
        return singlecount;
    }

    public void setSinglecount(String singlecount) {
        this.singlecount = singlecount;
    }

    public String getQunliaocount() {
        return qunliaocount;
    }

    public void setQunliaocount(String qunliaocount) {
        this.qunliaocount = qunliaocount;
    }

    public String getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(String isDelete) {
        this.isDelete = isDelete;
    }

    public String getImgSrc() {
        return imgSrc;
    }

    public void setImgSrc(String imgSrc) {
        this.imgSrc = imgSrc;
    }
}
