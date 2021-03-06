package com.tky.mqtt.dao;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT. Enable "keep" sections if you want to edit.

import com.tky.mqtt.base.BaseDao;

/**
 * Entity mapped to table SYSTEM_MSG.
 */
public class SystemMsg extends BaseDao {

    private String _id;
    private String sessionid;
    private String type;
    private String from;
    private String message;
    private String messagetype;
    private String platform;
    private String isFailure;
    private Long when;
    private String isDelete;
    private String imgSrc;
    private String username;
    private String senderid;
    private String msglevel;
    private String isread;
    private String isfocus;
    private Integer istop;
    private String isconfirm;

    public SystemMsg() {
    }

    public SystemMsg(String _id) {
        this._id = _id;
    }

    public SystemMsg(String _id, String sessionid, String type, String from, String message, String messagetype, String platform, String isFailure, Long when, String isDelete, String imgSrc, String username, String senderid, String msglevel, String isread, String isfocus, Integer istop, String isconfirm) {
        this._id = _id;
        this.sessionid = sessionid;
        this.type = type;
        this.from = from;
        this.message = message;
        this.messagetype = messagetype;
        this.platform = platform;
        this.isFailure = isFailure;
        this.when = when;
        this.isDelete = isDelete;
        this.imgSrc = imgSrc;
        this.username = username;
        this.senderid = senderid;
        this.msglevel = msglevel;
        this.isread = isread;
        this.isfocus = isfocus;
        this.istop = istop;
        this.isconfirm = isconfirm;
    }

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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSenderid() {
        return senderid;
    }

    public void setSenderid(String senderid) {
        this.senderid = senderid;
    }

    public String getMsglevel() {
        return msglevel;
    }

    public void setMsglevel(String msglevel) {
        this.msglevel = msglevel;
    }

    public String getIsread() {
        return isread;
    }

    public void setIsread(String isread) {
        this.isread = isread;
    }

    public String getIsfocus() {
        return isfocus;
    }

    public void setIsfocus(String isfocus) {
        this.isfocus = isfocus;
    }

    public Integer getIstop() {
        return istop;
    }

    public void setIstop(Integer istop) {
        this.istop = istop;
    }

    public String getIsconfirm() {
        return isconfirm;
    }

    public void setIsconfirm(String isconfirm) {
        this.isconfirm = isconfirm;
    }

}
