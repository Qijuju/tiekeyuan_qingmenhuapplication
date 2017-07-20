package com.tky.mqtt.paho.http;

import android.support.annotation.NonNull;
import android.text.TextUtils;

import com.google.gson.Gson;
import com.tky.mqtt.paho.callback.OKHttpCallBack2;

import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.Type;
import java.net.URLDecoder;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * HTTP请求工具类
 * Created by r on 2017/6/8.
 */

public class OKAsyncClient {

  /**
   * @description@EN Pull data by get request
   * @description@CN 用get方式请求拉取数据
   * @param request 请求参数类，里面包含了所有输入的请求参数，网络请求对象，取消网络请求方法，请求失败原因等
   * @param callBack 回调
   * @param <T> 返回数据
   */
  public static <T> void get(@NonNull final com.tky.mqtt.paho.http.Request request, final OKHttpCallBack2<T> callBack) {
    //request不可以为空，否则无法获取到OKHttpClient
    if (request == null) {
      //抛出异常
      throw new NullPointerException("Request could be not null");
    }
    callBack.onStart();
    //组装get请求的url
    String url = packGetUrl(request);

    //建立builder
    Request.Builder builder = new Request.Builder().url(url);
    Request okRequest = builder.build();
    OkHttpClient client = request.getClient();
    Call call = client.newCall(okRequest);
    //给Request对象设置call，让使用者可以用call调用call.cancel()方法取消请求
    request.setCall(call);
    //异步获取数据
    call.enqueue(new Callback() {
      @Override
      public void onFailure(Call call, IOException e) {//请求失败
        //处理失败后事宜
        doFailure(e, request, callBack);
      }

      @Override
      public void onResponse(Call call, Response response) throws IOException {//请求成功
        //处理请求后的数据
        doSuccess(response, request, callBack);
      }
    });
  }

  /**
   * @description@EN Pull data by post request
   * @description@CN 用post方式请求拉取数据
   * @param request 请求参数类，里面包含了所有输入的请求参数，网络请求对象，取消网络请求方法，请求失败原因等
   * @param callBack 回调根据用户传入的泛型T对象解析成对应的对象，如果不传泛型或者为String，直接将请求到的数据的JSON字符串传回去
   */
  public static <T> void post(@NonNull final com.tky.mqtt.paho.http.Request request, final OKHttpCallBack2<T> callBack) {
    //request不可以为空，否则无法获取到OKHttpClient
    if (request == null) {
      throw new NullPointerException("Request could be not null");
    }
    callBack.onStart();
    //组装post请求的参数并传入到Request.Builder中
    Request.Builder requestBuilder = packPostParams(request);

    final Request requestOk = requestBuilder.build();
    OkHttpClient client = request.getClient();
    Call call = client.newCall(requestOk);
    //给Request设定call，以供调用者调用其call.cancel()方法取消网络请求
    request.setCall(call);
    //请求数据
    call.enqueue(new Callback() {
      @Override
      public void onFailure(Call call, IOException e) {//请求失败
        //处理失败后事宜
        doFailure(e, request, callBack);
      }

      @Override
      public void onResponse(Call call, Response response) throws IOException {//请求成功
        //处理请求后的数据
        doSuccess(response, request, callBack);
      }
    });
  }

  /**
   * 组装post请求的参数并传入到Request.Builder中
   * @param request 请求参数类，里面包含了所有输入的请求参数，网络请求对象，取消网络请求方法，请求失败原因等
   * @return
   */
  private static Request.Builder packPostParams(@NonNull com.tky.mqtt.paho.http.Request request) {
    //获取到设定的参数
    Map<String, Object> paramsMap = request.getParamsMap();

    Request.Builder requestBuilder = new Request.Builder()
      .url(request.getUrl());
    //设定默认为普通的数据请求
    if (request.getMediaType() == com.tky.mqtt.paho.http.Request.DEFAULT) {//普通的表单上传
      if (paramsMap != null && paramsMap.size() > 0) {
        FormBody.Builder builder = new FormBody.Builder();
        //参数组装
        for (Map.Entry<String, Object> entry : paramsMap.entrySet()) {
          String key = entry.getKey();
          Object value = entry.getValue();
          String valueOf = String.valueOf(value);
          builder.add(key, valueOf);
        }
        FormBody body = builder.build();
        requestBuilder.post(body);
      }
    //JSON格式的数据请求
    } else if (request.getMediaType() == com.tky.mqtt.paho.http.Request.JSON) {//JSON格式的表单上传
      //参数组装为JSONObject以转换成JSON格式
      JSONObject jsonObj = new JSONObject(paramsMap);
      String json = jsonObj.toString();
      RequestBody requestBody = RequestBody.create(com.tky.mqtt.paho.http.Request.JSON, TextUtils.isEmpty(json.trim()) ? "{}" : json);
      requestBuilder.post(requestBody).addHeader("content-length",String.valueOf(json.length()));
    }
    return requestBuilder;
  }

  /**
   * 请求成功处理数据的方法
   * @param response 请求相应对象
   * @param request 请求参数类，里面包含了所有输入的请求参数，网络请求对象，取消网络请求方法，请求失败原因等
   * @param callBack 回调
   * @param <T> 返回值
   * @throws IOException
   */
  private static <T> void doSuccess(Response response, com.tky.mqtt.paho.http.Request request, OKHttpCallBack2<T> callBack) throws IOException {
    if (response.isSuccessful()) {
      //用UTF-8的格式解析数据
      String decode = URLDecoder.decode(response.body().string(), "UTF-8");
      try {
        //获取返回数据的设定类型（例如调用者给定了User类型，则获取到的就是User的类型）
        Type type = callBack.getType();
        //若给定的是String，则返回String
        if (type == null || String.class.equals(type)) {
          callBack.onSuccess(request, (T) decode);
        }if (!String.class.equals(type)) {//根据给定的类型转换数据
          Gson gson = new Gson();
          T obj = gson.fromJson(decode, type);
          callBack.onSuccess(request, obj);
        }
      } catch (Exception e) {
        //设置数据解析失败状态
        request.setErrorState(com.tky.mqtt.paho.http.Request.ErrorState.PARSE_ERROR);
        callBack.onFailure(request, new IllegalStateException("Data parse has error,please check your entity class!"));
        e.printStackTrace();
      }
    } else {
      //设置网络请求失败状态
      request.setErrorState(com.tky.mqtt.paho.http.Request.ErrorState.REQUEST_ERROR);
      callBack.onFailure(request, new IllegalStateException("Request is not successful!"));
    }
  }

  /**
   * 处理失败后事宜
   * @param e 失败异常类型
   * @param request 请求参数类，里面包含了所有输入的请求参数，网络请求对象，取消网络请求方法，请求失败原因等
   * @param callBack 回调
   * @param <T> 调用者设定的返回类型
   */
  private static <T> void doFailure(IOException e, @NonNull com.tky.mqtt.paho.http.Request request, OKHttpCallBack2<T> callBack) {
    request.setErrorState(com.tky.mqtt.paho.http.Request.ErrorState.NET_ERROR);
    callBack.onFailure(request, e);
  }

  /**
   * 组装get请求的URL
   * @param request 请求参数类，里面包含了所有输入的请求参数，网络请求对象，取消网络请求方法，请求失败原因等
   * @return 返回get请求的URL
   */
  private static String packGetUrl(@NonNull com.tky.mqtt.paho.http.Request request) {
    //获取URL
    String url = request.getUrl();
    //准备组装get请求参数，用StringBuilder存放
    StringBuilder urlBuilder = new StringBuilder();
    urlBuilder.append(url);
    Map<String, Object> paramsMap = request.getParamsMap();
    //如果有参数则，
    if (paramsMap != null && paramsMap.size() > 0) {
      urlBuilder.append("/" + paramsMap.get("Action").toString() + "?");
      //组装参数
      for (Map.Entry<String, Object> entry : paramsMap.entrySet()) {
        String key = entry.getKey();
        Object value = entry.getValue();
        if (!"Action".equals(key)) {
          urlBuilder.append(key + "=" + value.toString() + "&");
        }
      }
      //重新给url赋值
      url = urlBuilder.toString().substring(0, urlBuilder.toString().length() - 1);
    }
    return url;
  }

}
