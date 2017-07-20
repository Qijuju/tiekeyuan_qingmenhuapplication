package com.tky.mqtt.paho.jsbean;

import java.util.List;

/**
 * Created by r on 2017/6/19.
 */

public class RootJSDept {
  private boolean result;
  private List<DeptList> deptList;
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

  public boolean isResult() {
    return result;
  }

  public void setResult(boolean result) {
    this.result = result;
  }

  public List<DeptList> getDeptList() {
    return deptList;
  }

  public void setDeptList(List<DeptList> deptList) {
    this.deptList = deptList;
  }
}
