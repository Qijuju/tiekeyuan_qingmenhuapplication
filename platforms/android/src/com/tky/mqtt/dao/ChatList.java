package com.tky.mqtt.dao;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT. Enable "keep" sections if you want to edit. 

import com.tky.mqtt.base.BaseDao;

/**
 * Entity mapped to table CHAT_LIST.
 */
public class ChatList extends BaseDao {

    private String id;
    private String chatName;
    private String isDelete;
    private String imgSrc;
    private String lastText;
    private String count;
    private Long lastDate;
    private String chatType;
    private String senderId;
    private String senderName;
    private String isSuccess;
    private String daytype;
    private String isFailure;
    private String messagetype;
    private String isRead;

    public ChatList() {
    }

    public ChatList(String id) {
        this.id = id;
    }

    public ChatList(String id, String chatName, String isDelete, String imgSrc, String lastText, String count, Long lastDate, String chatType, String senderId, String senderName, String isSuccess, String daytype, String isFailure, String messagetype, String isRead) {
        this.id = id;
        this.chatName = chatName;
        this.isDelete = isDelete;
        this.imgSrc = imgSrc;
        this.lastText = lastText;
        this.count = count;
        this.lastDate = lastDate;
        this.chatType = chatType;
        this.senderId = senderId;
        this.senderName = senderName;
        this.isSuccess = isSuccess;
        this.daytype = daytype;
        this.isFailure = isFailure;
        this.messagetype = messagetype;
        this.isRead = isRead;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getChatName() {
        return chatName;
    }

    public void setChatName(String chatName) {
        this.chatName = chatName;
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

    public String getLastText() {
        return lastText;
    }

    public void setLastText(String lastText) {
        this.lastText = lastText;
    }

    public String getCount() {
        return count;
    }

    public void setCount(String count) {
        this.count = count;
    }

    public Long getLastDate() {
        return lastDate;
    }

    public void setLastDate(Long lastDate) {
        this.lastDate = lastDate;
    }

    public String getChatType() {
        return chatType;
    }

    public void setChatType(String chatType) {
        this.chatType = chatType;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getIsSuccess() {
        return isSuccess;
    }

    public void setIsSuccess(String isSuccess) {
        this.isSuccess = isSuccess;
    }

    public String getDaytype() {
        return daytype;
    }

    public void setDaytype(String daytype) {
        this.daytype = daytype;
    }

    public String getIsFailure() {
        return isFailure;
    }

    public void setIsFailure(String isFailure) {
        this.isFailure = isFailure;
    }

    public String getMessagetype() {
        return messagetype;
    }

    public void setMessagetype(String messagetype) {
        this.messagetype = messagetype;
    }

    public String getIsRead() {
        return isRead;
    }

    public void setIsRead(String isRead) {
        this.isRead = isRead;
    }

}
