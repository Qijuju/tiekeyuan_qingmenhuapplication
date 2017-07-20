package com.tky.mqtt.paho.httpbean;

import java.util.List;

/**
 * Created by r on 2017/7/3.
 */

public class ReadList extends BaseBean {
  private Event Event;
  public static class Event {
    private String msgId;
    private List<ReadUserJS> userList;

    public String getMsgId() {
      return msgId;
    }

    public void setMsgId(String msgId) {
      this.msgId = msgId;
    }

    public List<ReadUserJS> getUserList() {
      return userList;
    }

    public void setUserList(List<ReadUserJS> userList) {
      this.userList = userList;
    }
  }

  public static class ReadUserJS {
    private String id;
    private String displayName;
    private String deptName;

    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public String getDisplayName() {
      return displayName;
    }

    public void setDisplayName(String displayName) {
      this.displayName = displayName;
    }

    public String getDeptName() {
      return deptName;
    }

    public void setDeptName(String deptName) {
      this.deptName = deptName;
    }
  }

  public ReadList.Event getEvent() {
    return Event;
  }

  public void setEvent(ReadList.Event event) {
    Event = event;
  }
}
