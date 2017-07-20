package com.tky.mqtt.paho.jsbean;

import java.util.List;

/**
 * Created by r on 2017/6/28.
 */

public class HistoryMsgJS {
  private boolean result = true;
  private String sessionType;
  private String sessionID;
  private int msgCount;
  private List<Msg> msglist;
  public static class Msg {
    private String FromID;
    private String FromName;
    private long MsgDate;
    private String MsgType;
    private String Msg;

    public String getFromID() {
      return FromID;
    }

    public void setFromID(String fromID) {
      FromID = fromID;
    }

    public String getFromName() {
      return FromName;
    }

    public void setFromName(String fromName) {
      FromName = fromName;
    }

    public long getMsgDate() {
      return MsgDate;
    }

    public void setMsgDate(long msgDate) {
      MsgDate = msgDate;
    }

    public String getMsgType() {
      return MsgType;
    }

    public void setMsgType(String msgType) {
      MsgType = msgType;
    }

    public String getMsg() {
      return Msg;
    }

    public void setMsg(String msg) {
      Msg = msg;
    }
  }

  public boolean isResult() {
    return result;
  }

  public void setResult(boolean result) {
    this.result = result;
  }

  public String getSessionType() {
    return sessionType;
  }

  public void setSessionType(String sessionType) {
    this.sessionType = sessionType;
  }

  public String getSessionID() {
    return sessionID;
  }

  public void setSessionID(String sessionID) {
    this.sessionID = sessionID;
  }

  public int getMsgCount() {
    return msgCount;
  }

  public void setMsgCount(int msgCount) {
    this.msgCount = msgCount;
  }

  public List<Msg> getMsglist() {
    return msglist;
  }

  public void setMsglist(List<Msg> msglist) {
    this.msglist = msglist;
  }
}
