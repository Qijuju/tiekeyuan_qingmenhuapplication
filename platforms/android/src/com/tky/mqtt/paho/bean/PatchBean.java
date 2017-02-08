package com.tky.mqtt.paho.bean;

/**
 * Created by Administrator on 2017/1/19.
 */

public class PatchBean {

  private String versionName;  //app的版本号
  private String patchVersionName;  //补丁的版本名称
  private String desc; //补丁描述
  private long size;  //补丁大小
  private int patchVersion; //补丁版本号


  public String getVersionName() {
    return versionName;
  }

  public void setVersionName(String versionName) {
    this.versionName = versionName;
  }

  public String getPatchVersionName() {
    return patchVersionName;
  }

  public void setPatchVersionName(String patchVersionName) {
    this.patchVersionName = patchVersionName;
  }

  public long getSize() {
    return size;
  }

  public void setSize(long size) {
    this.size = size;
  }

  public String getDesc() {
    return desc;
  }

  public void setDesc(String desc) {
    this.desc = desc;
  }

  public int getPatchVersion() {
    return patchVersion;
  }

  public void setPatchVersion(int patchVersion) {
    this.patchVersion = patchVersion;
  }


  @Override
  public String toString() {
    return "PatchBean{" +
      "versionName='" + versionName + '\'' +
      ", patchVersionName='" + patchVersionName + '\'' +
      ", size=" + size +
      ", patchVersion=" + patchVersion +
      ", desc='" + desc + '\'' +
      '}';
  }
}

