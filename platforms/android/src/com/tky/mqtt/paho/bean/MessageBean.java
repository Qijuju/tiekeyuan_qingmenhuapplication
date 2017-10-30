package com.tky.mqtt.paho.bean;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.bean
 * 日期：2016/8/12 9:13
 * 描述：
 */
public class MessageBean extends MessageTypeBean {
    private String _id;// UUID.randomUUID().toString().toUpperCase());
    private String sessionid;//", msgMap.get("to"));
    private String type;//", getMsgTypeStr((IMMsgFactory.MsgType) msgMap.get("type")));
    private String from;//", "false");
    private String message;//", msgMap.get("message"));
    private String messagetype;//", getMediaTypeStr((IMMsgFactory.MediaType) msgMap.get("mediaType")));
    private String platform;//", getPlatTypeStr((IMMsgFactory.PlatType) msgMap.get("platform")));
    private Long when;//", msgMap.get("when"));
    private String isFailure;//", "false");
    private String isDelete;//", "");
    private String imgSrc;//", "");
    private String username;
    /**
     * 是否是我自己发送的，不管是客户端还是手机端
     */
    private boolean isFromMe;
    /**
     * 消息的紧急程度
     */
    private String msgLevel;

    private String title;

    private String link;

    private String linkType;

    private String msgId;

    private String fromName;

  public String getLevelName() {
    return levelName;
  }

  public void setLevelName(String levelName) {
    this.levelName = levelName;
  }

  private String levelName;

  public void setFromMe(boolean fromMe) {
    isFromMe = fromMe;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
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

  public String getMsgId() {
    return msgId;
  }

  public void setMsgId(String msgId) {
    this.msgId = msgId;
  }

  public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
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

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessagetype() {
        return messagetype;
    }

    public void setMessagetype(String messagetype) {
        this.messagetype = messagetype;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public Long getWhen() {
        return when;
    }

    public void setWhen(Long when) {
        this.when = when;
    }

    public String getIsFailure() {
        return isFailure;
    }

    public void setIsFailure(String isFailure) {
        this.isFailure = isFailure;
    }

    public String getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(String isDelete) {
        this.isDelete = isDelete;
    }

    public String getImgSrc() {
        return imgSrc;
    }

    public void setImgSrc(String imgSrc) {
        this.imgSrc = imgSrc;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isFromMe() {
        return isFromMe;
    }

    public void setIsFromMe(boolean isFromMe) {
        this.isFromMe = isFromMe;
    }

    public String getMsgLevel() {
        return msgLevel;
    }

    public void setMsgLevel(String msgLevel) {
        this.msgLevel = msgLevel;
    }

    public String getFromName() {
        return fromName;
    }

    public void setFromName(String fromName) {
        this.fromName = fromName;
    }
}
