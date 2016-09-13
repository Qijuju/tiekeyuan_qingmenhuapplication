package com.tky.mqtt.paho.http;

import com.squareup.okhttp.Call;
import com.squareup.okhttp.Headers;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import com.tky.mqtt.paho.bean.Header;

import java.io.IOException;

/**
 * 作者：SLS
 * 包名：com.tky.newframe.http
 * 日期：2016/1/19 17:41
 * 描述：该类主要用于上传与下载
 */
public class OKHttpTransport {

    private final OkHttpClient client = new OkHttpClient();
    private Request request;
    private Call call;
    private Response response;

    public void test(String url) throws IOException {
        Request.Builder builder = new Request.Builder();
        request = builder.url(url).build();
        call = client.newCall(request);
        response = call.execute();
        if (response.isSuccessful())
            throw new IOException("Unexpected code" + response);
    }

    public Header[] getHeaders(){
        Header[] headerArr = null;
        Headers headers = response.headers();
        for (int i = 0; i < (headers == null || headers.size() <= 0 ? 0 : headers.size()); i++){
            if (headerArr == null){
                headerArr = new Header[headers.size()];
            }
            String name = headers.name(i);
            String value = headers.value(i);
            headerArr[i] = new Header(name, value);
        }
        return headerArr;
    }

}
