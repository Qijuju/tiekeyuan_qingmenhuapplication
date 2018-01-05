package com.tky.mqtt.paho.jsbean;

/**
 * Created by r on 2017/6/20.
 */

public class UserJSDetail {
  private boolean result;
  private User user;

  public static class User {
    private String DeptID;
    private String DeptName;
    private String Duty;
    private String Email;
    private String FixPhone;
    private boolean IsActive;
    private boolean IsAttention;
    private String Mobile;
    private String Sex;
    private String UserID;
    private String UserName;
    private String DeptPath;//用户所在部门路径

    public String getDeptPath() {
      return DeptPath;
    }

    public void setDeptPath(String deptPath) {
      DeptPath = deptPath;
    }

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

    public String getDuty() {
      return Duty;
    }

    public void setDuty(String duty) {
      Duty = duty;
    }

    public String getEmail() {
      return Email;
    }

    public void setEmail(String email) {
      Email = email;
    }

    public String getFixPhone() {
      return FixPhone;
    }

    public void setFixPhone(String fixPhone) {
      FixPhone = fixPhone;
    }

    public boolean isActive() {
      return IsActive;
    }

    public void setActive(boolean active) {
      IsActive = active;
    }

    public boolean isAttention() {
      return IsAttention;
    }

    public void setAttention(boolean attention) {
      IsAttention = attention;
    }

    public String getMobile() {
      return Mobile;
    }

    public void setMobile(String mobile) {
      Mobile = mobile;
    }

    public String getSex() {
      return Sex;
    }

    public void setSex(String sex) {
      Sex = sex;
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

  public boolean isResult() {
    return result;
  }

  public void setResult(boolean result) {
    this.result = result;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }
}
