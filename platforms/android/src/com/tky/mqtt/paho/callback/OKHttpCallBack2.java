package com.tky.mqtt.paho.callback;

import com.tky.mqtt.paho.http.Request;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public abstract class OKHttpCallBack2<T> {

  public Type getType() {
    Type mySuperClass = this.getClazz().getGenericSuperclass();
    Type type = ((ParameterizedType)mySuperClass).getActualTypeArguments()[0];
    return type;
  }

  public Class getClazz() {
    return this.getClass();
  }

	/**
	 * 程序执行开始
	 */
	public void onStart(){}
	/**
	 * @param total 总大小
	 * @param current 当前大小
	 * @param isUploading 是否正在上传
	 */
	public void onLoading(long total, long current, boolean isUploading){}
	/**
	 * 成功调用事件
	 */
	public abstract void onSuccess(Request request, T result);
	/**
	 * 失败时调用
	 */
	public abstract void onFailure(Request request, Exception e);
	/**
	 * 停止时调用
	 */
	public void onStopped(String result){}
}
