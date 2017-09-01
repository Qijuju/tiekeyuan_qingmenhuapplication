package com.tky.mqtt.paho.httpbean;

import java.io.Serializable;

/**
 * Created by r on 2017/6/19.
 */

public class BaseBean implements Serializable {
  private String ActionID;
  private String Response;
  private boolean Succeed;
  private String ErrCode;
  private String Message;
  private String sessionid;

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

  public String getSessionid() {
    return sessionid;
  }

  public void setSessionid(String sessionid) {
    this.sessionid = sessionid;
  }
}
