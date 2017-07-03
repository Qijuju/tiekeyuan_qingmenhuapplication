package com.tky.mqtt.paho.jsbean;

/**
 * Created by r on 2017/6/29.
 */

public class MsgJS {
  public String FromID;
  public String FromName;
  public long MsgDate;
  public String MsgType;
  public String Msg;

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
