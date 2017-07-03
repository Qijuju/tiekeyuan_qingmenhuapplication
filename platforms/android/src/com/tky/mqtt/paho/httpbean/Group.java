package com.tky.mqtt.paho.httpbean;

import java.util.List;

/**
 * Created by r on 2017/6/16.
 */

public class Group extends BaseBean {
  private List<String> admin;
  private long create_date;
  private String creator;
  private boolean flag;
  private String id;
  private int lastupdate;
  private List<String> member;
  private String notice;
  private int size;
  private String title;

  public List<String> getAdmin() {
    return admin;
  }

  public void setAdmin(List<String> admin) {
    this.admin = admin;
  }

  public long getCreate_date() {
    return create_date;
  }

  public void setCreate_date(long create_date) {
    this.create_date = create_date;
  }

  public String getCreator() {
    return creator;
  }

  public void setCreator(String creator) {
    this.creator = creator;
  }

  public boolean isFlag() {
    return flag;
  }

  public void setFlag(boolean flag) {
    this.flag = flag;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public int getLastupdate() {
    return lastupdate;
  }

  public void setLastupdate(int lastupdate) {
    this.lastupdate = lastupdate;
  }

  public List<String> getMember() {
    return member;
  }

  public void setMember(List<String> member) {
    this.member = member;
  }

  public String getNotice() {
    return notice;
  }

  public void setNotice(String notice) {
    this.notice = notice;
  }

  public int getSize() {
    return size;
  }

  public void setSize(int size) {
    this.size = size;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }
}
