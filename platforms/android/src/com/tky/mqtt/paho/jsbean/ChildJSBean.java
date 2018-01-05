package com.tky.mqtt.paho.jsbean;

import java.util.List;

/**
 * Created by r on 2017/6/19.
 */

public class ChildJSBean {
  private String deptID;
  private int deptCount;
  private int userCount;
  private boolean result;
  private List<UserList> userList;
  private List<DeptList> deptList;

  public static class UserList {
    private String DeptID;
    private boolean IsActive;
    private String UserID;
    private String UserName;
    private String ProName;

    public String getProName() {
      return ProName;
    }

    public void setProName(String proName) {
      ProName = proName;
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

  public static class DeptList {
    private String DeptID;
    private String DeptName;
    private int ChildCount;

    public String getDeptID() {
      return DeptID;
    }

    public void setDeptID(String deptID) {
      DeptID = deptID;
    }

    public String getDeptName() {
      return DeptName;
    }

    public void setDeptName(String deptName) {
      DeptName = deptName;
    }

    public int getChildCount() {
      return ChildCount;
    }

    public void setChildCount(int childCount) {
      ChildCount = childCount;
    }
  }

  public String getDeptID() {
    return deptID;
  }

  public void setDeptID(String deptID) {
    this.deptID = deptID;
  }

  public int getDeptCount() {
    return deptCount;
  }

  public void setDeptCount(int deptCount) {
    this.deptCount = deptCount;
  }

  public int getUserCount() {
    return userCount;
  }

  public void setUserCount(int userCount) {
    this.userCount = userCount;
  }

  public boolean isResult() {
    return result;
  }

  public void setResult(boolean result) {
    this.result = result;
  }

  public List<UserList> getUserList() {
    return userList;
  }

  public void setUserList(List<UserList> userList) {
    this.userList = userList;
  }

  public List<DeptList> getDeptList() {
    return deptList;
  }

  public void setDeptList(List<DeptList> deptList) {
    this.deptList = deptList;
  }
}
