package com.tky.mqtt.paho.httpbean;

import java.util.List;

/**
 * Created by r on 2017/6/16.
 */

public class DepartmentBean {
  private String ActionID;
  private String Response;
  private boolean Succeed;
  private Event Event;
  private String ErrCode;
  private String Message;

  public class Event {
    private String account;
    private String authority;
    private int childCount;
    private String grade;
    private String id;
    private int lastupdate;
    private String name;
    private String parentid;
    private int priority;
    private String prjid;
    private boolean root;
    private List<String> members;
    private List<String> subdepartments;

    public String getAccount() {
      return account;
    }

    public void setAccount(String account) {
      this.account = account;
    }

    public String getGrade() {
      return grade;
    }

    public String getAuthority() {
      return authority;
    }

    public void setAuthority(String authority) {
      this.authority = authority;
    }

    public int getChildCount() {
      return childCount;
    }

    public void setChildCount(int childCount) {
      this.childCount = childCount;
    }

    public void setGrade(String grade) {
      this.grade = grade;
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

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public String getParentid() {
      return parentid;
    }

    public void setParentid(String parentid) {
      this.parentid = parentid;
    }

    public int getPriority() {
      return priority;
    }

    public void setPriority(int priority) {
      this.priority = priority;
    }

    public String getPrjid() {
      return prjid;
    }

    public void setPrjid(String prjid) {
      this.prjid = prjid;
    }

    public boolean isRoot() {
      return root;
    }

    public void setRoot(boolean root) {
      this.root = root;
    }

    public List<String> getMembers() {
      return members;
    }

    public void setMembers(List<String> members) {
      this.members = members;
    }

    public List<String> getSubdepartments() {
      return subdepartments;
    }

    public void setSubdepartments(List<String> subdepartments) {
      this.subdepartments = subdepartments;
    }
  }

  public String getActionID() {
    return ActionID;
  }

  public void setActionID(String actionID) {
    ActionID = actionID;
  }

  public String getResponse() {
    return Response;
  }

  public void setResponse(String response) {
    Response = response;
  }

  public boolean isSucceed() {
    return Succeed;
  }

  public void setSucceed(boolean succeed) {
    Succeed = succeed;
  }

  public DepartmentBean.Event getEvent() {
    return Event;
  }

  public void setEvent(DepartmentBean.Event event) {
    Event = event;
  }

  public String getErrCode() {
    return ErrCode;
  }

  public void setErrCode(String errCode) {
    ErrCode = errCode;
  }

  public String getMessage() {
    return Message;
  }

  public void setMessage(String message) {
    Message = message;
  }
}
