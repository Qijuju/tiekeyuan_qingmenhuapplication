package com.tky.mqtt.paho.httpbean;

/**
 * Created by r on 2017/6/19.
 */

public class GetUser extends BaseBean {
  private User Event;

  public User getEvent() {
    return Event;
  }

  public void setEvent(User event) {
    Event = event;
  }
}
