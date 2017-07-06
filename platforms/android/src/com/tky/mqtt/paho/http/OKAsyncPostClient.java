package com.tky.mqtt.paho.http;

import android.support.annotation.NonNull;
import android.text.TextUtils;

import com.google.gson.Gson;
import com.tky.mqtt.paho.callback.OKHttpCallBack;
import com.tky.mqtt.paho.callback.OKHttpCallBack2;
import com.tky.mqtt.paho.utils.GsonUtils;

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
 * Created by r on 2017/6/8.
 */

public class OKAsyncPostClient {

  public static <T> void get(@NonNull final com.tky.mqtt.paho.http.Request request, final OKHttpCallBack2<T> callBack) {
    if (request == null) {
      throw new NullPointerException("Request could be not null");
    }
    String url = request.getUrl();
    StringBuilder urlBuilder = new StringBuilder();
    urlBuilder.append(url);
    Map<String, Object> paramsMap = request.getParamsMap();
    if (paramsMap != null && paramsMap.size() > 0) {
      urlBuilder.append("/" + paramsMap.get("Action").toString() + "?");
      for (Map.Entry<String, Object> entry : paramsMap.entrySet()) {
        String key = entry.getKey();
        Object value = entry.getValue();
        if (!"Action".equals(key)) {
          urlBuilder.append(key + "=" + value.toString() + "&");
        }
      }
      url = urlBuilder.toString().substring(0, urlBuilder.toString().length() - 1);
    }
    Request.Builder builder = new Request.Builder().url(url);
    Request okRequest = builder.build();
    OkHttpClient client = request.getClient();
    Call call = client.newCall(okRequest);
    request.setCall(call);
    call.enqueue(new Callback() {
      @Override
      public void onFailure(Call call, IOException e) {
        request.setErrorState(com.tky.mqtt.paho.http.Request.ErrorState.NET_ERROR);
        callBack.onFailure(request, e);
      }

      @Override
      public void onResponse(Call call, Response response) throws IOException {
        if (response.isSuccessful()) {
          String decode = URLDecoder.decode(response.body().string(), "UTF-8");
          try {
            Type type = callBack.getType();
            //默认返回String
            if (type == null || String.class.equals(type)) {
              callBack.onSuccess(request, (T) decode);
            }if (!String.class.equals(type)) {
              Gson gson = new Gson();
              T obj = gson.fromJson(decode, type);
              callBack.onSuccess(request, obj);
            }
          } catch (ClassCastException e) {
            callBack.onSuccess(request, (T) decode);
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
    });
  }

  /**
   * OKHttpClient请求数据
   * @param request 里面包含了所有输入的请求参数，网络请求对象，取消网络请求方法，请求失败原因等
   * @param callBack 回调根据用户传入的泛型T对象解析成对应的对象，如果不传泛型或者为String，直接将请求到的数据的JSON字符串传回去
   */
  public static <T> void post(@NonNull final com.tky.mqtt.paho.http.Request request, final OKHttpCallBack2<T> callBack) {
    if (request == null) {
      throw new NullPointerException("Request could be not null");
    }
    callBack.onStart();
    Map<String, Object> paramsMap = request.getParamsMap();

    Request.Builder requestBuilder = new Request.Builder()
      .url(request.getUrl());
    if (request.getMediaType() == com.tky.mqtt.paho.http.Request.DEFAULT) {//普通的表单上传
      if (paramsMap != null && paramsMap.size() > 0) {
        FormBody.Builder builder = new FormBody.Builder();
        for (Map.Entry<String, Object> entry : paramsMap.entrySet()) {
          String key = entry.getKey();
          Object value = entry.getValue();
          String valueOf = String.valueOf(value);
          builder.add(key, valueOf);
        }
        FormBody body = builder.build();
        requestBuilder.post(body);
      }
    } else if (request.getMediaType() == com.tky.mqtt.paho.http.Request.JSON) {//JSON格式的表单上传
      JSONObject jsonObj = new JSONObject(paramsMap);
      String json = jsonObj.toString();
      RequestBody requestBody = RequestBody.create(com.tky.mqtt.paho.http.Request.JSON, TextUtils.isEmpty(json.trim()) ? "{}" : json);
      requestBuilder.post(requestBody).addHeader("content-length",String.valueOf(json.length()));
    }
    final Request requestOk = requestBuilder.build();
    OkHttpClient client = request.getClient();
    Call call = client.newCall(requestOk);
    request.setCall(call);
    call.enqueue(new Callback() {
      @Override
      public void onFailure(Call call, IOException e) {
        request.setErrorState(com.tky.mqtt.paho.http.Request.ErrorState.NET_ERROR);
        callBack.onFailure(request, e);
      }

      @Override
      public void onResponse(Call call, Response response) throws IOException {
        if (response.isSuccessful()) {
          String decode = URLDecoder.decode(response.body().string(), "UTF-8");
          try {
            Type type = callBack.getType();
            //默认返回String
            if (type == null || String.class.equals(type)) {
              callBack.onSuccess(request, (T) decode);
            }if (!String.class.equals(type)) {
              Gson gson = new Gson();
              T obj = gson.fromJson(decode, type);
              callBack.onSuccess(request, obj);
            }
          } catch (ClassCastException e) {
            callBack.onSuccess(request, (T) decode);
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
    });
  }

}
