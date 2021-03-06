package com.tky.mqtt.dao;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT. Enable "keep" sections if you want to edit.

import com.tky.mqtt.base.BaseDao;

/**
 * Entity mapped to table GROUP_CHATS.
 */
public class GroupChats extends BaseDao {

    private String id;
    private String groupName;
    private String groupType;
    private Boolean ismygroup;

    public GroupChats() {
    }

    public GroupChats(String id) {
        this.id = id;
    }

    public GroupChats(String id, String groupName, String groupType, Boolean ismygroup) {
        this.id = id;
        this.groupName = groupName;
        this.groupType = groupType;
        this.ismygroup = ismygroup;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupType() {
        return groupType;
    }

    public void setGroupType(String groupType) {
        this.groupType = groupType;
    }

    public Boolean getIsmygroup() {
        return ismygroup;
    }

    public void setIsmygroup(Boolean ismygroup) {
        this.ismygroup = ismygroup;
    }

}
