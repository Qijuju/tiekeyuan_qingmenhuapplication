package com.tky.mqtt.paho.httpbean;

import java.util.List;

/**
 * Created by r on 2017/6/29.
 */

public class LatestMsgBean extends BaseBean {

  private Event Event;

  public static class Event {
    private String sessionId;
    private String type;
    private int total;
    private List<Msg> msgList;

    public String getSessionId() {
      return sessionId;
    }

    public void setSessionId(String sessionId) {
      this.sessionId = sessionId;
    }

    public String getType() {
      return type;
    }

    public void setType(String type) {
      this.type = type;
    }

    public List<Msg> getMsgList() {
      return msgList;
    }

    public void setMsgList(List<Msg> msgList) {
      this.msgList = msgList;
    }

    public int getTotal() {
      return total;
    }

    public void setTotal(int total) {
      this.total = total;
    }
  }

  public static class Msg {
    private String account;
    private int fileSize;
    private String from;
    private String fromName;
    private String id;
    private String mediaType;
    private String message;
    private String platform;
    private int playLength;
    private String receipt;
    private String sessionid;
    private String type;
    private long when;

    public String getAccount() {
      return account;
    }

    public void setAccount(String account) {
      this.account = account;
    }

    public int getFileSize() {
      return fileSize;
    }

    public void setFileSize(int fileSize) {
      this.fileSize = fileSize;
    }

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

    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public String getMediaType() {
      return mediaType;
    }

    public void setMediaType(String mediaType) {
      this.mediaType = mediaType;
    }

    public String getMessage() {
      return message;
    }

    public void setMessage(String message) {
      this.message = message;
    }

    public String getPlatform() {
      return platform;
    }

    public void setPlatform(String platform) {
      this.platform = platform;
    }

    public int getPlayLength() {
      return playLength;
    }

    public void setPlayLength(int playLength) {
      this.playLength = playLength;
    }

    public String getReceipt() {
      return receipt;
    }

    public void setReceipt(String receipt) {
      this.receipt = receipt;
    }

    public String getSessionid() {
      return sessionid;
    }

    public void setSessionid(String sessionid) {
      this.sessionid = sessionid;
    }

    public String getType() {
      return type;
    }

    public void setType(String type) {
      this.type = type;
    }

    public long getWhen() {
      return when;
    }

    public void setWhen(long when) {
      this.when = when;
    }
  }

  public LatestMsgBean.Event getEvent() {
    return Event;
  }

  public void setEvent(LatestMsgBean.Event event) {
    Event = event;
  }
}
