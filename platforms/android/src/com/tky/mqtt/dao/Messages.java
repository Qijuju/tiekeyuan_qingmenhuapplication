package com.tky.mqtt.dao;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT. Enable "keep" sections if you want to edit.

import com.tky.mqtt.base.BaseDao;

import java.util.Comparator;

/**
 * Entity mapped to table MESSAGES.
 */
public class Messages extends BaseDao{

    private String _id;
    private String account;
    private String sessionid;
    private String type;
    private String from;
    private String message;
    private String messagetype;
    private String platform;
    private String isSingle;
    private String isFailure;
    private Long when;



    public Messages() {
    }

    public Messages(String _id) {
        this._id = _id;
    }

    public Messages(String _id, String account, String sessionid, String type, String from, String message, String messagetype, String platform, String isSingle, String isFailure, Long when) {
        this._id = _id;
        this.account = account;
        this.sessionid = sessionid;
        this.type = type;
        this.from = from;
        this.message = message;
        this.messagetype = messagetype;
        this.platform = platform;
        this.isSingle = isSingle;
        this.isFailure = isFailure;
        this.when = when;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getSessionid() {
        return sessionid;
    }

    public void setSessionid(String sessionid) {
        this.sessionid = sessionid;
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

    public String getIsSingle() {
        return isSingle;
    }

    public void setIsSingle(String isSingle) {
        this.isSingle = isSingle;
    }

    public String getIsFailure() {
        return isFailure;
    }

    public void setIsFailure(String isFailure) {
        this.isFailure = isFailure;
    }

    public Long getWhen() {
        return when;
    }

    public void setWhen(Long when) {
        this.when = when;
    }


}
