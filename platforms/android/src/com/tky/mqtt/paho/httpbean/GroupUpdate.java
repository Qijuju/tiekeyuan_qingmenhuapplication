package com.tky.mqtt.paho.httpbean;

import java.util.List;

/**
 * Created by r on 2017/6/27.
 */

public class GroupUpdate extends BaseBean {
  private int memsCount;
  private String groupName;
  private String groupText;
  private String creator;
  private List<String> members;
  private List<String> admins;
  private List<User> users;
  private String server;

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

  public String getServer() {
    return server;
  }

  public void setServer(String server) {
    this.server = server;
  }
}
