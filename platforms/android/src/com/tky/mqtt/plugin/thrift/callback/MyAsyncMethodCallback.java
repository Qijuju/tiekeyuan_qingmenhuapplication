package com.tky.mqtt.plugin.thrift.callback;

import com.tky.mqtt.plugin.thrift.bean.MyAsyncClient;

import org.apache.thrift.async.TAsyncClient;
import org.apache.thrift.async.TAsyncClientManager;
import org.apache.thrift.transport.TNonblockingSocket;

/**
 * Created by tkysls on 2017/5/4.
 */

public abstract class MyAsyncMethodCallback<T> implements org.apache.thrift.async.AsyncMethodCallback<T> {
    private MyAsyncClient client;

    public void setClient(MyAsyncClient client) {
        this.client = client;
    }

    /**
     * 关闭Thrift接口对象
     */
    public void close() {
        if (client != null) {
            TAsyncClientManager manager = client.getManager();
            TNonblockingSocket socket = client.getSocket();
            TAsyncClient tAsyncClient = client.getClient();
            if (manager != null) {
                try {
                    manager.stop();
                } catch (Exception e) {
                } finally {
                    manager  = null;
                }
            }
            if (socket != null) {
                try {
                    socket.close();
                } catch (Exception e) {
                } finally {
                    socket = null;
                }
            }
            if (tAsyncClient != null) {
                tAsyncClient = null;
            }
        }
    }
}
