package com.tky.mqtt.paho.httpbean;

/**
 * Created by r on 2017/6/28.
 */

public class MsgBean extends BaseMsgBean {
  private String msgId;
  private String from;
  private String fromName;
  private String mediaType;
  private String message;
  private String platform;
  private String receipt;
  private String to;
  private String type;
  private long when;

  private int playLength;
  private int fileSize;
  private String address;
  private String fileName;
  private String levelName;
  private String msgLevel;
  private String link;
  private String linkType;
  private String title;

  public String getMsgId() {
    return msgId;
  }

  public void setMsgId(String msgId) {
    this.msgId = msgId;
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

  public String getMediaType() {
    return getMediaType(mediaType);
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

  public String getReceipt() {
    return receipt;
  }

  public void setReceipt(String receipt) {
    this.receipt = receipt;
  }

  public String getTo() {
    return to;
  }

  public void setTo(String to) {
    this.to = to;
  }

  public String getType() {
    return getType(type);
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

  /**
   * 转换消息媒体类型
   * @param mediaType
   * @return
   */
  private String getMediaType(String mediaType) {
    String typeStr = "Text";
    if ("T".equals(mediaType)) {
      typeStr = "Text";
    } else if ("I".equals(mediaType)) {
      typeStr = "Image";
    } else if ("F".equals(mediaType)) {
      typeStr = "File";
    } else if ("S".equals(mediaType)) {
      typeStr = "Shake";
    } else if ("E".equals(mediaType)) {
      typeStr = "Emote";
    } else if ("A".equals(mediaType)) {
      typeStr = "Audio";
    } else if ("V".equals(mediaType)) {
      typeStr = "Vedio";
    } else if ("C".equals(mediaType)) {
      typeStr = "Receipt";
    } else if ("P".equals(mediaType)) {
      typeStr = "LOCATION";
    }
    return typeStr;
  }

  /**
   * 转换消息类型
   * @return
   */
  private String getType(String type) {
    String typeStr = "User";
    if ("U".equals(type)) {
      typeStr = "User";
    } else if ("G".equals(type)) {
      typeStr = "Group";
    } else if ("S".equals(type)) {
      typeStr = "System";
    } else if ("R".equals(type)) {
      typeStr = "Radio";
    } else if ("D".equals(type)) {
      typeStr = "Dept";
    } else if ("A".equals(type)) {
      typeStr = "Alarm";
    } else if ("P".equals(type)) {
      typeStr = "Platform";
    }
    return typeStr;
  }

  public int getPlayLength() {
    return playLength;
  }

  public void setPlayLength(int playLength) {
    this.playLength = playLength;
  }

  public int getFileSize() {
    return fileSize;
  }

  public void setFileSize(int fileSize) {
    this.fileSize = fileSize;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public String getLevelName() {
    return levelName;
  }

  public void setLevelName(String levelName) {
    this.levelName = levelName;
  }

  public String getMsgLevel() {
    return msgLevel;
  }

  public void setMsgLevel(String msgLevel) {
    this.msgLevel = msgLevel;
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

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }
}
