package com.tky.mqtt.paho.jsbean;

import java.util.List;

/**
 * Created by r on 2017/6/19.
 */

public class SearchJSUser {
  private boolean result;
  private int searchCount;
  private List<SearchResult> searchResult;

  public static class SearchResult {
    private String DeptID;
    private String DeptName;
    private boolean IsActive;
    private String RootName;
    private String UserID;
    private String UserName;
    private String DeptPath;

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

    public boolean isActive() {
      return IsActive;
    }

    public void setActive(boolean active) {
      IsActive = active;
    }

    public String getRootName() {
      return RootName;
    }

    public void setRootName(String rootName) {
      RootName = rootName;
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

  public int getSearchCount() {
    return searchCount;
  }

  public void setSearchCount(int searchCount) {
    this.searchCount = searchCount;
  }

  public List<SearchResult> getSearchResult() {
    return searchResult;
  }

  public void setSearchResult(List<SearchResult> searchResult) {
    this.searchResult = searchResult;
  }
}
