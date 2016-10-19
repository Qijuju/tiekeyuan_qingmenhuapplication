package com.tky.mqtt.dao;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT. Enable "keep" sections if you want to edit. 
/**
 * Entity mapped to table SELECTED_ID.
 */
public class SelectedId {

    private String id;
    private String grade;
    private Boolean isselected;
    private String type;
    private String parentid;

    public SelectedId() {
    }

    public SelectedId(String id) {
        this.id = id;
    }

    public SelectedId(String id, String grade, Boolean isselected, String type, String parentid) {
        this.id = id;
        this.grade = grade;
        this.isselected = isselected;
        this.type = type;
        this.parentid = parentid;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Boolean getIsselected() {
        return isselected;
    }

    public void setIsselected(Boolean isselected) {
        this.isselected = isselected;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getParentid() {
        return parentid;
    }

    public void setParentid(String parentid) {
        this.parentid = parentid;
    }

}