package com.tky.mqtt.paho.jsbean;

import java.util.List;

/**
 * Created by r on 2017/6/21.
 */

public class AttentionJS {

  private List<UserJS> users;

  public static class UserJS {
    private String DeptID;
    private boolean IsActive;
    private String UserID;
    private String UserName;

    public String getDeptID() {
      return DeptID;
    }

    public void setDeptID(String deptID) {
      DeptID = deptID;
    }

    public boolean isActive() {
      return IsActive;
    }

    public void setActive(boolean active) {
      IsActive = active;
    }

    public String getUserID() {
      return UserID;
    }

    public void setUserID(String userID) {
      UserID = userID;
    }

    public String getUserName() {
      return UserName;
    }

    public void setUserName(String userName) {
      UserName = userName;
    }
  }

  public List<UserJS> getUsers() {
    return users;
  }

  public void setUsers(List<UserJS> users) {
    this.users = users;
  }
}
