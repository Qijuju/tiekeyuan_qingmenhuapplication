package com.tky.mqtt.paho.jsbean;

import java.util.List;

/**
 * Created by r on 2017/6/27.
 */

public class GroupUpdateJS {
  public boolean result;
  public String groupID;
  public int memsCount;
  public String groupName;
  public String groupText;
  public String creator;
  public List<String> members;
  public List<String> admins;
  public List<User> users;

  public static class User {
    public String UserID;
    public String UserName;
    public String DeptID;
    public boolean IsActive;

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
  }

  public boolean isResult() {
    return result;
  }

  public void setResult(boolean result) {
    this.result = result;
  }

  public String getGroupID() {
    return groupID;
  }

  public void setGroupID(String groupID) {
    this.groupID = groupID;
  }

  public int getMemsCount() {
    return memsCount;
  }

  public void setMemsCount(int memsCount) {
    this.memsCount = memsCount;
  }

  public String getGroupName() {
    return groupName;
  }

  public void setGroupName(String groupName) {
    this.groupName = groupName;
  }

  public String getGroupText() {
    return groupText;
  }

  public void setGroupText(String groupText) {
    this.groupText = groupText;
  }

  public String getCreator() {
    return creator;
  }

  public void setCreator(String creator) {
    this.creator = creator;
  }

  public List<String> getMembers() {
    return members;
  }

  public void setMembers(List<String> members) {
    this.members = members;
  }

  public List<String> getAdmins() {
    return admins;
  }

  public void setAdmins(List<String> admins) {
    this.admins = admins;
  }

  public List<User> getUsers() {
    return users;
  }

  public void setUsers(List<User> users) {
    this.users = users;
  }
}
