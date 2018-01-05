package com.tky.mqtt.paho.httpbean;

/**
 * Created by r on 2017/7/19.
 */

public class UserDetail {
  private String UserID;
  private String UserName;
  private String FixPhone;
  private String Mobile;
  private String Duty;
  private String Sex;
  private String Email;
  private boolean IsActive;
  private String DeptID;
  private boolean IsAttention;
  private String DeptName;

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

  public String getFixPhone() {
    return FixPhone;
  }

  public void setFixPhone(String fixPhone) {
    FixPhone = fixPhone;
  }

  public String getMobile() {
    return Mobile;
  }

  public void setMobile(String mobile) {
    Mobile = mobile;
  }

  public String getDuty() {
    return Duty;
  }

  public void setDuty(String duty) {
    Duty = duty;
  }

  public String getSex() {
    return Sex;
  }

  public void setSex(String sex) {
    Sex = sex;
  }

  public String getEmail() {
    return Email;
  }

  public void setEmail(String email) {
    Email = email;
  }

  public boolean isActive() {
    return IsActive;
  }

  public void setActive(boolean active) {
    IsActive = active;
  }

  public String getDeptID() {
    return DeptID;
  }

  public void setDeptID(String deptID) {
    DeptID = deptID;
  }

  public boolean isAttention() {
    return IsAttention;
  }

  public void setAttention(boolean attention) {
    IsAttention = attention;
  }

  public String getDeptName() {
    return DeptName;
  }

  public void setDeptName(String deptName) {
    DeptName = deptName;
  }
}
