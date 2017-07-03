package com.tky.mqtt.paho.httpbean;

import java.util.List;

/**
 * Created by r on 2017/6/19.
 */

public class SearchUser extends BaseBean {
  private List<Event> Event;

  public class Event {
    private String id;
    private String deptid;
    private String deptName;
    private String userName;
    private String rootDeptId;
    private String rootDeptName;

    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public String getDeptid() {
      return deptid;
    }

    public void setDeptid(String deptid) {
      this.deptid = deptid;
    }

    public String getDeptName() {
      return deptName;
    }

    public void setDeptName(String deptName) {
      this.deptName = deptName;
    }

    public String getUserName() {
      return userName;
    }

    public void setUserName(String userName) {
      this.userName = userName;
    }

    public String getRootDeptId() {
      return rootDeptId;
    }

    public void setRootDeptId(String rootDeptId) {
      this.rootDeptId = rootDeptId;
    }

    public String getRootDeptName() {
      return rootDeptName;
    }

    public void setRootDeptName(String rootDeptName) {
      this.rootDeptName = rootDeptName;
    }
  }

  public List<SearchUser.Event> getEvent() {
    return Event;
  }

  public void setEvent(List<SearchUser.Event> event) {
    Event = event;
  }
}
