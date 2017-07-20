package com.tky.mqtt.paho.httpbean;

/**
 * Created by r on 2017/6/13.
 */

public class ViceUser extends BaseBean {
  private String id;
  private String deptid;
  private String deptName;
  private String namelength;
  private String rootDeptId;
  private String rootDeptName;
  private String userName;

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

  public String getNamelength() {
    return namelength;
  }

  public void setNamelength(String namelength) {
    this.namelength = namelength;
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

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }
}
