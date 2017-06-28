package com.tky.mqtt.paho.httpbean;

import java.util.List;

/**
 * Created by r on 2017/6/16.
 */

public class AllGroup extends BaseBean {
  private List<Group> Event;

  public List<Group> getEvent() {
    return Event;
  }

  public void setEvent(List<Group> event) {
    Event = event;
  }
}
