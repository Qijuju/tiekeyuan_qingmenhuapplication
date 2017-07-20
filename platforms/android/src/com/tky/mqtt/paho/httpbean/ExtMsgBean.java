package com.tky.mqtt.paho.httpbean;

import java.util.List;

/**
 * Created by r on 2017/7/3.
 */

public class ExtMsgBean extends BaseBean {
  private int msgLeave;
  private int msgTotal;
  private List<Msg> msgList;

  public static class Msg {
    private String from;
    private String fromName;
    private boolean isAttention;
    private boolean isRead;
    private boolean isToped;
    private String levelName;
    private String link;
    private String linkType;
    private String message;
    private String msgId;
    private String msgLevel;
    private String title;
    private long when;

    public String getFrom() {
      return from;
    }

    public void setFrom(String from) {
      this.from = from;
    }

    public String getFromName() {
      return fromName;
    }

    public void setFromName(String fromName) {
      this.fromName = fromName;
    }

    public boolean isAttention() {
      return isAttention;
    }

    public void setAttention(boolean attention) {
      isAttention = attention;
    }

    public boolean isRead() {
      return isRead;
    }

    public void setRead(boolean read) {
      isRead = read;
    }

    public boolean isToped() {
      return isToped;
    }

    public void setToped(boolean toped) {
      isToped = toped;
    }

    public String getLevelName() {
      return levelName;
    }

    public void setLevelName(String levelName) {
      this.levelName = levelName;
    }

    public String getLink() {
      return link;
    }

    public void setLink(String link) {
      this.link = link;
    }

    public String getLinkType() {
      return linkType;
    }

    public void setLinkType(String linkType) {
      this.linkType = linkType;
    }

    public String getMessage() {
      return message;
    }

    public void setMessage(String message) {
      this.message = message;
    }

    public String getMsgId() {
      return msgId;
    }

    public void setMsgId(String msgId) {
      this.msgId = msgId;
    }

    public String getMsgLevel() {
      return msgLevel;
    }

    public void setMsgLevel(String msgLevel) {
      this.msgLevel = msgLevel;
    }

    public String getTitle() {
      return title;
    }

    public void setTitle(String title) {
      this.title = title;
    }

    public long getWhen() {
      return when;
    }

    public void setWhen(long when) {
      this.when = when;
    }
  }

  public int getMsgLeave() {
    return msgLeave;
  }

  public void setMsgLeave(int msgLeave) {
    this.msgLeave = msgLeave;
  }

  public int getMsgTotal() {
    return msgTotal;
  }

  public void setMsgTotal(int msgTotal) {
    this.msgTotal = msgTotal;
  }

  public List<Msg> getMsgList() {
    return msgList;
  }

  public void setMsgList(List<Msg> msgList) {
    this.msgList = msgList;
  }
}
