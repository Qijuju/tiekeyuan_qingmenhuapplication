package com.tky.mqtt.paho.callback;

import com.squareup.okhttp.Request;

import java.io.IOException;

public abstract class OKHttpCallBack<T> {
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
	public abstract void onSuccess(T result);
	/**
	 * 失败时调用
	 */
	public abstract void onFailure(Request request, IOException e);
	/**
	 * 停止时调用
	 */
	public void onStopped(String result){}
}
