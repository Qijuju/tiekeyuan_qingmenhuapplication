package com.tky.mqtt.dao;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT. Enable "keep" sections if you want to edit. 

import com.tky.mqtt.base.BaseDao;

/**
 * Entity mapped to table OTHERPICHEAD.
 */
public class Otherpichead extends BaseDao {

    private String id;
    private String picurl;

    public Otherpichead() {
    }

    public Otherpichead(String id) {
        this.id = id;
    }

    public Otherpichead(String id, String picurl) {
        this.id = id;
        this.picurl = picurl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPicurl() {
        return picurl;
    }

    public void setPicurl(String picurl) {
        this.picurl = picurl;
    }

}
