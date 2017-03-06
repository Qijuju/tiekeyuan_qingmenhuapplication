package com.tky.mqtt.paho.bean;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.bean
 * 日期：2016/8/22 17:34
 * 描述：
 */
public class EventMessageBean extends MessageTypeBean {
    /**
     * 通知类型
     */
    private String NotifyType;
    /**
     * 创建时间
     */
    private Long when;
    /**
     * 事件编码
     */
    private String EventCode;
    /**
     * 群组ID
     */
    private String GroupID;
    /**
     * 群组名称
     */
    private String GroupName;
    /**
     * 被添加或删除的人员的姓名
     */
    private String userName;

    public String getNotifyType() {
        return NotifyType;
    }

    public void setNotifyType(String notifyType) {
        NotifyType = notifyType;
    }

    public Long getWhen() {
        return when;
    }

    public void setWhen(Long when) {
        this.when = when;
    }

    public String getEventCode() {
        return EventCode;
    }

    public void setEventCode(String eventCode) {
        EventCode = eventCode;
    }

    public String getGroupID() {
        return GroupID;
    }

    public void setGroupID(String groupID) {
        GroupID = groupID;
    }

    public String getUserName() {
        return (userName == null ? "" : userName);
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getGroupName() {
        return (GroupName == null ? "无群组名称" : GroupName);
    }

    public void setGroupName(String groupName) {
        GroupName = groupName;
    }
}
