package com.tky.mqtt.paho.httpbean;

/**
 * Created by r on 2017/6/28.
 */

public class EventBean extends BaseMsgBean {
  private String GroupID;
  private String Event;
  private String EventCode;
  private String GroupName;
  private long when;
  private String UserName;
  private String Senderid;
  private String MepID;

  public String getGroupID() {
    return GroupID;
  }

  public void setGroupID(String groupID) {
    GroupID = groupID;
  }

  public String getEvent() {
    return Event;
  }

  public void setEvent(String event) {
    Event = event;
  }

  public String getEventCode() {
    return EventCode;
  }

  public void setEventCode(String eventCode) {
    EventCode = eventCode;
  }

  public String getGroupName() {
    return GroupName;
  }

  public void setGroupName(String groupName) {
    GroupName = groupName;
  }

  public long getWhen() {
    return when;
  }

  public void setWhen(long when) {
    this.when = when;
  }

  public String getUserName() {
    return UserName;
  }

  public void setUserName(String userName) {
    UserName = userName;
  }

  public String getSenderid() {
    return Senderid;
  }

  public void setSenderid(String senderid) {
    Senderid = senderid;
  }

  public String getMepID() {
    return MepID;
  }

  public void setMepID(String mepID) {
    MepID = mepID;
  }
}
