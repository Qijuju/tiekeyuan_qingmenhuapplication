package com.tky.mqtt.paho.httpbean;

/**
 * Created by r on 2017/7/19.
 */

public class DeptInfo {
  private String DeptID;
  private String DeptName;
  private String ParentID;
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

  public String getParentID() {
    return ParentID;
  }

  public void setParentID(String parentID) {
    ParentID = parentID;
  }

  public int getChildCount() {
    return ChildCount;
  }

  public void setChildCount(int childCount) {
    ChildCount = childCount;
  }
}
