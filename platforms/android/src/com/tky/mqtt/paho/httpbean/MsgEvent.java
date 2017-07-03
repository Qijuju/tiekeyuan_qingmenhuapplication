package com.tky.mqtt.paho.httpbean;

/**
 * Created by r on 2017/6/26.
 */

public class MsgEvent extends BaseBean {
  private Event Event;
  public class Event {
    private String msgId;
    private String messageId;

    public String getMsgId() {
      return msgId;
    }

    public void setMsgId(String msgId) {
      this.msgId = msgId;
    }

    public String getMessageId() {
      return messageId;
    }

    public void setMessageId(String messageId) {
      this.messageId = messageId;
    }
  }

  public MsgEvent.Event getEvent() {
    return Event;
  }

  public void setEvent(MsgEvent.Event event) {
    Event = event;
  }
}
