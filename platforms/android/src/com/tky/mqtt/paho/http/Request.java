package com.tky.mqtt.paho.http;

import android.app.Activity;
import android.text.TextUtils;

import java.util.Map;

import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;

/**
 * Created by r on 2017/6/8.
 */

public class Request {
  private Activity context;
  private String url;
  /**
   * 默认的URL
   */
  private static String DEFAULTURL;
  private OkHttpClient client;
  private Map<String, Object> paramsMap;
  private Call call;
  private MediaType mediaType;
  private ErrorState errorState;
  public static final MediaType DEFAULT = MediaType.parse("application/x-www-form-urlencoded; charset=utf-8");
  public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");

  public Request(){
    this(null);
  }

  /**
   * 使用默认的URL
   * @param context
   */
  public Request(final Activity context) {
    this.context = context;
    if (DEFAULTURL == null || TextUtils.isEmpty(DEFAULTURL.trim())) {
                                          //错误的参数（默认的URL不能为空），请设置默认的URL或者使用带url参数的构造方法
      throw new IllegalArgumentException("Wrong argument (that the default url could be not null), please set the default url or use the constructer that contains param url!");
    }
    this.url = DEFAULTURL;
    client = new OkHttpClient();
  }

  /**
   * 需要手动设置构造函数中的url属性
   * @param context
   * @param url
   */
  public Request(final Activity context, final String url) {
    this.context = context;
    this.url = url;
    client = new OkHttpClient();
  }

  /**
   * 设置默认的URL
   * @param defaultUrl
   */
  public static void initBaseUrl(String defaultUrl) {
    DEFAULTURL = defaultUrl;
  }

  /**
   * 设置上下文对象
   * Set the context
   * @param context
   */
  public void setContext(Activity context) {
    this.context = context;
  }

  /**
   * 获取上下文
   * Get the context
   * @return
   */
  public Activity getContext() {
    return context;
  }

  /**
   * 设置URL
   * Set url
   * @param url
   */
  public void setUrl(String url) {
    this.url = url;
  }

  /**
   * Get the url
   * 获取url
   * @return
   */
  public String getUrl() {
    return url;
  }

  /**
   * Set OkHttpClient
   * 设置OkHttpClient
   * @param client
   */
  public void setClient(OkHttpClient client) {
    this.client = client;
  }

  /**
   * Get OkHttpClient
   * 获取OkHttpClient
   * @return
   */
  public OkHttpClient getClient() {
    return client;
  }

  /**
   * Add params map
   * 添加参数
   * @param paramsMap
   */
  public void addParamsMap(Map<String, Object> paramsMap) {
    this.paramsMap = paramsMap;
  }

  /**
   * Get the params of the post request
   * 获取post请求参数
   * @return
   */
  public Map<String, Object> getParamsMap() {
    return paramsMap;
  }

  /**
   * 设置网络请求回调类
   * @param call
   */
  public void setCall(Call call) {
    this.call = call;
  }

  /**
   * 获取网络请求回调类
   * @return
   */
  public Call getCall() {
    return call;
  }

  /**
   * Cancel the net request
   * 取消网络请求
   */
  public void cancel() {
    if (call != null && !call.isCanceled()) {
      call.cancel();
    }
  }


  public void setErrorState(ErrorState errorState) {
    this.errorState = errorState;
  }

  public ErrorState getErrorState() {
    return errorState;
  }

  /**
   * 请求失败类型
   */
  public enum ErrorState {
    NET_ERROR/*网络错误*/,REQUEST_ERROR/*请求失败*/, PARAM_ERROR/*参数错误，未开始执行请求*/,PARSE_ERROR/*请求到的数据解析出错*/
  }

  public MediaType getMediaType() {
    return mediaType == null ? JSON : mediaType;
//    return mediaType == null ? DEFAULT : mediaType;
  }

  public void setMediaType(MediaType mediaType) {
    this.mediaType = mediaType;
  }
}
