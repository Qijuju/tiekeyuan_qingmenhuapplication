package com.tky.mqtt.paho.httpbean;

/**
 * Created by r on 2017/6/13.
 */

public class User extends BaseBean {
  private String account;
  private boolean active;
  private boolean admin;
  private String deptName;
  private String deptid;
  private String displayName;//用户中文名字
  private String email;
  private String fixedphone;
  private String id;
  private String imCode;
  private long lastupdate;
  private String mobile;
  private Integer priority;
  private String proname;
  private String realId;
  private String rootDeptId;
  private String rootDeptName;
  private String sex;
  private String type;
  private Im im;
  private boolean isAttention;
  private String loginAccount;//用户登录账号
  private String loginName;
  private String deptPath;//用户所在部门路径

  public String getDeptPath() {
    return deptPath;
  }

  public void setDeptPath(String deptPath) {
    this.deptPath = deptPath;
  }

  public class Im {
    private String im;

    public void setIm(String im) {
      this.im = im;
    }

    public String getIm() {
      return im;
    }
  }

  public String getAccount() {
    return account;
  }

  public void setAccount(String account) {
    this.account = account;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public boolean isAdmin() {
    return admin;
  }

  public void setAdmin(boolean admin) {
    this.admin = admin;
  }

  public String getDeptName() {
    return deptName;
  }

  public void setDeptName(String deptName) {
    this.deptName = deptName;
  }

  public String getDeptid() {
    return deptid;
  }

  public void setDeptid(String deptid) {
    this.deptid = deptid;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getFixedphone() {
    return fixedphone;
  }

  public void setFixedphone(String fixedphone) {
    this.fixedphone = fixedphone;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getImCode() {
    return imCode;
  }

  public void setImCode(String imCode) {
    this.imCode = imCode;
  }

  public long getLastupdate() {
    return lastupdate;
  }

  public void setLastupdate(long lastupdate) {
    this.lastupdate = lastupdate;
  }

  public String getMobile() {
    return mobile;
  }

  public void setMobile(String mobile) {
    this.mobile = mobile;
  }

  public Integer getPriority() {
    return priority;
  }

  public void setPriority(Integer priority) {
    this.priority = priority;
  }

  public String getProname() {
    return proname;
  }

  public void setProname(String proname) {
    this.proname = proname;
  }

  public String getRealId() {
    return realId;
  }

  public void setRealId(String realId) {
    this.realId = realId;
  }

  public String getRootDeptId() {
    return rootDeptId;
  }

  public void setRootDeptId(String rootDeptId) {
    this.rootDeptId = rootDeptId;
  }

  public String getRootDeptName() {
    return rootDeptName;
  }

  public void setRootDeptName(String rootDeptName) {
    this.rootDeptName = rootDeptName;
  }

  public String getSex() {
    return sex;
  }

  public void setSex(String sex) {
    this.sex = sex;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public Im getIm() {
    return im;
  }

  public void setIm(Im im) {
    this.im = im;
  }

  public boolean isAttention() {
    return isAttention;
  }

  public void setAttention(boolean attention) {
    isAttention = attention;
  }


  public String getLoginAccount() {
    return loginAccount;
  }

  public void setLoginAccount(String loginAccount) {
    this.loginAccount = loginAccount;
  }


  public String getLoginName() {
    return loginName;
  }

  public void setLoginName(String loginName) {
    this.loginName = loginName;
  }
}
