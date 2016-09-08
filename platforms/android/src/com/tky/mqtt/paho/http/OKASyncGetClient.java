package com.tky.mqtt.paho.http;

import android.app.Activity;
import android.text.TextUtils;

import com.squareup.okhttp.Call;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Request.Builder;
import com.squareup.okhttp.Response;
import com.tky.mqtt.paho.bean.Header;
import com.tky.mqtt.paho.callback.OKHttpCallBack;

import java.io.IOException;

public class OKASyncGetClient {
	private Builder builder;
	private Call call;
	private Response mResponse;

	/**
	 * 对外提供的方法
	 *
	 * @param url
	 *            请求URL
	 * @return
	 */
	public synchronized void okASyncGet(final Activity context,
			final String url, final OKHttpCallBack<Response> callBack) {
		new Thread(new Runnable() {
			@Override
			public void run() {
				OkHttpClient client = new OkHttpClient();
				request(context, client, url, callBack);
			}
		}).start();
	}

	/**
	 * 异步请求
	 * @param context
	 * @param client
	 * @param url
	 * @param callBack
	 */
	private void request(final Activity context, OkHttpClient client,
			String url, final OKHttpCallBack<Response> callBack) {
		builder = new Request.Builder().url(url);
		Request request = builder.build();
		call = client.newCall(request);
		Callback responseCallback = new Callback() {

			@Override
			public void onResponse(final Response response) throws IOException {
				OKASyncGetClient.this.mResponse = response;
				if (!response.isSuccessful()){
					throw new IOException("Unexpected code " + response);
				}
				context.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						callBack.onSuccess(response);
					}
				});
			}

			@Override
			public void onFailure(final Request request, final IOException e) {
				context.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						callBack.onFailure(request, e);
					}
				});
			}
		};
		call.enqueue(responseCallback);
	}

	/**
	 * 取消异步网络请求
	 */
	public void cancel() {
		if (call != null && !call.isCanceled()) {
			call.cancel();
		}
	}

	/**
	 * 添加请求头
	 * @param value
	 * @param name
	 */
	public synchronized void addHeader(String value, String name) throws RuntimeException {
		addHeaderFail(new Header(name, value));
		builder.addHeader(name, value);
	}

	/**
	 * 添加请求头
	 */
	public synchronized void addHeader(Header header) throws RuntimeException {
		addHeaderFail(header);
		builder.addHeader(header.getName(), header.getValue());
	}

	/**
	 * 判断是否添加了空数据
	 * @param header
	 */
	private void addHeaderFail(Header header) throws RuntimeException {
		if (header == null) {
			throw new RuntimeException("添加Header失败");
		}
		if (header.getName() == null) {
			throw new RuntimeException("添加Header失败");
		}
		if (header.getValue() == null) {
			throw new RuntimeException("添加Header失败");
		}
		if (TextUtils.isEmpty(header.getName()) || TextUtils.isEmpty(header.getValue())) {
			throw new RuntimeException("添加Header失败");
		}
	}

	/**
	 * 根据Header的Key值获取value值
	 * @param name
	 * @return
	 */
	public Header getHeader(String name){
		if (mResponse != null) {
			String value = mResponse.header(name, "");
			if (TextUtils.isEmpty(value)) {
				return null;
			}
			return new Header(name, value);
		}
		return null;
	}
}
