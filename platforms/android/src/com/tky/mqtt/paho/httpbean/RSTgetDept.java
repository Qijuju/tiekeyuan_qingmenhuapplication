package com.tky.mqtt.paho.httpbean;


/**
 * Created by r on 2017/7/19.
 */

public class RSTgetDept {
  private boolean result;
  private String resultCode;
  private String resultMsg;
  private DeptInfo deptInfo;

  public boolean isResult() {
    return result;
  }

  public void setResult(boolean result) {
    this.result = result;
  }

  public String getResultCode() {
    return resultCode;
  }

  public void setResultCode(String resultCode) {
    this.resultCode = resultCode;
  }

  public String getResultMsg() {
    return resultMsg;
  }

  public void setResultMsg(String resultMsg) {
    this.resultMsg = resultMsg;
  }

  public DeptInfo getDeptInfo() {
    return deptInfo;
  }

  public void setDeptInfo(DeptInfo deptInfo) {
    this.deptInfo = deptInfo;
  }
}
