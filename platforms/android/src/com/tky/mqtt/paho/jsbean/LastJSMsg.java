package com.tky.mqtt.paho.jsbean;

import java.util.List;

/**
 * Created by r on 2017/6/22.
 */

public class LastJSMsg {
  private String sessionID;
  private List<Msglist> msglist;

  public class Msglist {
    private String FromID;
    private String FromName;
    private String Msg;
    private String MsgDate;
    private String MsgType;

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

    public String getMsg() {
      return Msg;
    }

    public void setMsg(String msg) {
      Msg = msg;
    }

    public String getMsgDate() {
      return MsgDate;
    }

    public void setMsgDate(String msgDate) {
      MsgDate = msgDate;
    }

    public String getMsgType() {
      return MsgType;
    }

    public void setMsgType(String msgType) {
      MsgType = msgType;
    }
  }

  public String getSessionID() {
    return sessionID;
  }

  public void setSessionID(String sessionID) {
    this.sessionID = sessionID;
  }

  public List<Msglist> getMsglist() {
    return msglist;
  }

  public void setMsglist(List<Msglist> msglist) {
    this.msglist = msglist;
  }
}
