package com.tky.mqtt.dao;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT. Enable "keep" sections if you want to edit. 

import com.tky.mqtt.base.BaseDao;

/**
 * Entity mapped to table CHAT_LIST.
 */
public class ChatList extends BaseDao{

    private String id;
    private String chatName;
    private String isDelete;
    private String imgSrc;
    private String lastText;
    private String count;
    private Long lastDate;

    public ChatList() {
    }

    public ChatList(String id) {
        this.id = id;
    }

    public ChatList(String id, String chatName, String isDelete, String imgSrc, String lastText, String count, Long lastDate) {
        this.id = id;
        this.chatName = chatName;
        this.isDelete = isDelete;
        this.imgSrc = imgSrc;
        this.lastText = lastText;
        this.count = count;
        this.lastDate = lastDate;
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

}
