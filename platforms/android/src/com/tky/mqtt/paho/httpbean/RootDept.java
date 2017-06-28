package com.tky.mqtt.paho.httpbean;

import java.util.List;

/**
 * Created by r on 2017/6/19.
 */

public class RootDept extends BaseBean {
  private List<DepartmentBean.Event> Event;

  public List<DepartmentBean.Event> getEvent() {
    return Event;
  }

  public void setEvent(List<DepartmentBean.Event> event) {
    Event = event;
  }
}
