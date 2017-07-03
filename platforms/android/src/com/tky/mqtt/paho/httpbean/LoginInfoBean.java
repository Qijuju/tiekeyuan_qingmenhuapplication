package com.tky.mqtt.paho.httpbean;

import java.util.List;

/**
 * Created by r on 2017/6/13.
 */

public class LoginInfoBean extends BaseBean {
  private String mepId;
  private String mqtt;
  private User user;
  private List<ViceUser> viceUser;

  public String getMepId() {
    return mepId;
  }

  public void setMepId(String mepId) {
    this.mepId = mepId;
  }

  public String getMqtt() {
    return mqtt;
  }

  public void setMqtt(String mqtt) {
    this.mqtt = mqtt;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public List<ViceUser> getViceUser() {
    return viceUser;
  }

  public void setViceUser(List<ViceUser> viceUser) {
    this.viceUser = viceUser;
  }
}
