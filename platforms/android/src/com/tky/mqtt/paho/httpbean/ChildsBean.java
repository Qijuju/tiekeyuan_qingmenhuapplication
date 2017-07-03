package com.tky.mqtt.paho.httpbean;

import java.util.List;

/**
 * Created by r on 2017/6/16.
 */

public class ChildsBean extends BaseBean {
  private Event Event;

  public class Event {
    private int leaves;
    private List<DepartmentBean.Event> depts;
    private List<User> users;

    public int getLeaves() {
      return leaves;
    }

    public void setLeaves(int leaves) {
      this.leaves = leaves;
    }

    public List<DepartmentBean.Event> getDepts() {
      return depts;
    }

    public void setDepts(List<DepartmentBean.Event> depts) {
      this.depts = depts;
    }

    public List<User> getUsers() {
      return users;
    }

    public void setUsers(List<User> users) {
      this.users = users;
    }
  }

  public ChildsBean.Event getEvent() {
    return Event;
  }

  public void setEvent(ChildsBean.Event event) {
    Event = event;
  }
}
