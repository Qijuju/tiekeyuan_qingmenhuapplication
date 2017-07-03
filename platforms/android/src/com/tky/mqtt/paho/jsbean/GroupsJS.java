package com.tky.mqtt.paho.jsbean;

import java.util.List;

/**
 * Created by r on 2017/6/27.
 */

public class GroupsJS {
  private int groupCount;
  private boolean result;
  private List<Group> groupList;

  public static class Group {
    private String GroupID;
    private String GroupName;
    private int MemsCount;
    private boolean isMyGroup;

    public String getGroupID() {
      return GroupID;
    }

    public void setGroupID(String groupID) {
      GroupID = groupID;
    }

    public String getGroupName() {
      return GroupName;
    }

    public void setGroupName(String groupName) {
      GroupName = groupName;
    }

    public int getMemsCount() {
      return MemsCount;
    }

    public void setMemsCount(int memsCount) {
      MemsCount = memsCount;
    }

    public boolean isMyGroup() {
      return isMyGroup;
    }

    public void setMyGroup(boolean myGroup) {
      isMyGroup = myGroup;
    }
  }

  public int getGroupCount() {
    return groupCount;
  }

  public void setGroupCount(int groupCount) {
    this.groupCount = groupCount;
  }

  public boolean isResult() {
    return result;
  }

  public void setResult(boolean result) {
    this.result = result;
  }

  public List<Group> getGroupList() {
    return groupList;
  }

  public void setGroupList(List<Group> groupList) {
    this.groupList = groupList;
  }
}
