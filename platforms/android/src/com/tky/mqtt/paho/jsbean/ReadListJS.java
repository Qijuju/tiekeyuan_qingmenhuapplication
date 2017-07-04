package com.tky.mqtt.paho.jsbean;

import java.util.List;

/**
 * Created by r on 2017/7/3.
 */

public class ReadListJS {
  private String msgId;
  private boolean result;
  private List<ReadUserJS> userList;

  public static class ReadUserJS {
    private String UserID;
    private String UserName;

    public String getUserID() {
      return UserID;
    }

    public void setUserID(String userID) {
      UserID = userID;
    }

    public String getUserName() {
      return UserName;
    }

    public void setUserName(String userName) {
      UserName = userName;
    }
  }

  public String getMsgId() {
    return msgId;
  }

  public void setMsgId(String msgId) {
    this.msgId = msgId;
  }

  public boolean isResult() {
    return result;
  }

  public void setResult(boolean result) {
    this.result = result;
  }

  public List<ReadUserJS> getUserList() {
    return userList;
  }

  public void setUserList(List<ReadUserJS> userList) {
    this.userList = userList;
  }
}
