package com.tky.mqtt.paho.httpbean;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Created by r on 2017/6/27.
 */

public class HistoryMsgBean extends BaseBean {
  private Map<String, String> member;
  private int current;
  private long dateTime;
  private String sessionId;
  private int total;
  private List<Value> value;

  public class Value {
    private String account;
    private int fileSize;
    private String from;
    private String id;
    private String mediaType;
    private String message;
    private String platform;
    private int playLength;
    private String receipt;
    private String sessionid;
    private String type;
    private long when;
    private String fromName;

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

    public void setFromName(String fromName) {
      this.fromName = fromName;
    }

    public String getFromName() {
      return fromName;
    }
  }

  public Map<String, String> getMember() {
    return member;
  }

  public void setMember(Map<String, String> member) {
    this.member = member;
  }

  public int getCurrent() {
    return current;
  }

  public void setCurrent(int current) {
    this.current = current;
  }

  public long getDateTime() {
    return dateTime;
  }

  public void setDateTime(long dateTime) {
    this.dateTime = dateTime;
  }

  public String getSessionId() {
    return sessionId;
  }

  public void setSessionId(String sessionId) {
    this.sessionId = sessionId;
  }

  public int getTotal() {
    return total;
  }

  public void setTotal(int total) {
    this.total = total;
  }

  public List<Value> getValue() {
    if (value == null || value.size() <= 0) {
      return value;
    } else {
      Collections.reverse(value);
      return value;
    }
  }

  public void setValue(List<Value> value) {
    this.value = value;
  }
}
