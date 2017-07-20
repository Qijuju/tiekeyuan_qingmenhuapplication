package com.tky.mqtt.paho.jsbean;

import java.util.List;

import im.model.NMsg;

/**
 * Created by r on 2017/7/3.
 */

public class ExtMsgJS {
  private boolean result;
  private String resultCode;
  private String resultMsg;
  private long msgTotal;
  private long msgLeave;
  private List<MsgJS> msgList;

  public static class MsgJS {
    private String FromID;
    private String FromName;
    private long MsgDate;
    private String MsgId;
    private String Level;
    private boolean IsReaded;
    private boolean IsToped;
    private boolean IsAttention;
    private String Msg;
    private String Link;
    private String LinkType;
    private String Title;
    private String LevelName;

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

    public String getMsgId() {
      return MsgId;
    }

    public void setMsgId(String msgId) {
      MsgId = msgId;
    }

    public String getLevel() {
      return Level;
    }

    public void setLevel(String level) {
      Level = level;
    }

    public boolean isReaded() {
      return IsReaded;
    }

    public void setReaded(boolean readed) {
      IsReaded = readed;
    }

    public boolean isToped() {
      return IsToped;
    }

    public void setToped(boolean toped) {
      IsToped = toped;
    }

    public boolean isAttention() {
      return IsAttention;
    }

    public void setAttention(boolean attention) {
      IsAttention = attention;
    }

    public String getMsg() {
      return Msg;
    }

    public void setMsg(String msg) {
      Msg = msg;
    }

    public String getLink() {
      return Link;
    }

    public void setLink(String link) {
      Link = link;
    }

    public String getLinkType() {
      return LinkType;
    }

    public void setLinkType(String linkType) {
      LinkType = linkType;
    }

    public String getTitle() {
      return Title;
    }

    public void setTitle(String title) {
      Title = title;
    }

    public String getLevelName() {
      return LevelName;
    }

    public void setLevelName(String levelName) {
      LevelName = levelName;
    }
  }

  public boolean isResult() {
    return result;
  }

  public void setResult(boolean result) {
    this.result = result;
  }

  public String getResultCode() {
    return resultCode;
  }

  public void setResultCode(String resultCode) {
    this.resultCode = resultCode;
  }

  public String getResultMsg() {
    return resultMsg;
  }

  public void setResultMsg(String resultMsg) {
    this.resultMsg = resultMsg;
  }

  public long getMsgTotal() {
    return msgTotal;
  }

  public void setMsgTotal(long msgTotal) {
    this.msgTotal = msgTotal;
  }

  public long getMsgLeave() {
    return msgLeave;
  }

  public void setMsgLeave(long msgLeave) {
    this.msgLeave = msgLeave;
  }

  public List<MsgJS> getMsgList() {
    return msgList;
  }

  public void setMsgList(List<MsgJS> msgList) {
    this.msgList = msgList;
  }
}
