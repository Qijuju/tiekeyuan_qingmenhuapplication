package com.ionicframework.im366077;

/**
 * Created by Administrator on 2017/4/20.
 */

public class Constants {

  //测试
  public static final String TESTBASEURL= "http://61.237.239.152:8080";
  public static final String testbasemobile= "61.237.239.152";

  //生产
  public static final String FORMALBASEURL= "http://61.237.239.60:8081";
  public static final String formalbasemobile= "immobile.r93535.com";

  //境外
  public static final String JINGWAIURL = "201.137.140.133";





  //首页欢迎界面
  public static final String testwelcome=TESTBASEURL+"/Im_Interface/loginpic/download?Id=0";

  public static final String formalwelcome=FORMALBASEURL+"/Im_Interfacer/loginpic/download?Id=0";

  //补丁包下载


//  //请求补丁版本信息
//  String patchUrl = "http://61.237.239.152:8080/patch/patch/json";
//  //下载补丁的地址http://61.237.239.60:8081/Im_Interfacer/loginpic/download?id=0
//  final String downurl = "http://61.237.239.152:8080/patch/patch/get";



  public static final String testpatch=TESTBASEURL+"/patch/patch/json";
  public static final String testpatchdownload=TESTBASEURL+"/patch/patch/get";

  public static final String formalpatch=FORMALBASEURL+"/patch/patch/json";
  public static final String formalpatchdownload=FORMALBASEURL+"/patch/patch/get";









}
