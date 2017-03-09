package com.tky.mqtt.dao;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT. Enable "keep" sections if you want to edit. 
/**
 * Entity mapped to table TOP_CONTACTS.
 */
public class TopContacts {

    private String _id;
    private String name;
    private String phone;
    private String type;
    private Integer count;
    private Long when;

    public TopContacts() {
    }

    public TopContacts(String _id) {
        this._id = _id;
    }

    public TopContacts(String _id, String name, String phone, String type, Integer count, Long when) {
        this._id = _id;
        this.name = name;
        this.phone = phone;
        this.type = type;
        this.count = count;
        this.when = when;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Long getWhen() {
        return when;
    }

    public void setWhen(Long when) {
        this.when = when;
    }

}
