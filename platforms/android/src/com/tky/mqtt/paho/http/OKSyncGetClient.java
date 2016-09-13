package com.tky.mqtt.paho.http;

import android.text.TextUtils;

import com.squareup.okhttp.Call;
import com.squareup.okhttp.Headers;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Request.Builder;
import com.squareup.okhttp.Response;
import com.tky.mqtt.paho.bean.Header;

import java.io.IOException;

public class OKSyncGetClient {
//	private String url = "http://wthrcdn.etouch.cn/weather_mini?citykey=101010100";

//	private MediaType TYPE_JSON = MediaType.parse("application/json; charset=utf-8");
//    private MediaType TYPE_FILE = MediaType.parse("application/octet-stream");

	private Call call;

	private Builder builder;

	private Response response;

    /**
     * 对外提供的方法
     * @param url 请求URL
     * @return
     */
    public synchronized String okSyncGet(String url){
    	OkHttpClient client = new OkHttpClient();
		return request(client, url);
    }

	/**
	 * 请求方法
	 * @param client
	 * @param url
	 * @return
	 */
	private synchronized String request(OkHttpClient client, String url) {
		try {
			builder = new Request.Builder().url(url);
			Request request = builder.build();
			call = client.newCall(request);
			response = call.execute();
			if (!response.isSuccessful()){
				return "err";
			}
			return response.body().string();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 取消请求
	 */
	public synchronized void cancel(){
		if (call != null && !call.isCanceled()) {
			call.cancel();
		}
	}

	/**
	 * 添加请求头
	 * @param value
	 * @param name
	 */
	public synchronized void addHeader(String value, String name){
		addHeaderFail(new Header(name, value));
		builder.addHeader(name, value);
	}

	/**
	 * 添加请求头
	 */
	public synchronized void addHeader(Header header){
		addHeaderFail(header);
		builder.addHeader(header.getName(), header.getValue());
	}

	/**
	 * 判断是否添加了空数据
	 * @param header
	 */
	private void addHeaderFail(Header header) {
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
		String value = response.header(name, "");
		if (TextUtils.isEmpty(value)) {
			return null;
		}
		return new Header(name, value);
	}

	/**
	 * 获取所有的Header
	 * @return
	 */
	public Header[] getAllHeader(){
		Headers headers = response.headers();
		Header[] headersArr = new Header[headers == null ? 0 : headers.size()];
		for (int i = 0; i > headers.size(); i++){
			headersArr[i] = new Header(headers.name(i), headers.value(i));
		}
		return headersArr;
	}



}
