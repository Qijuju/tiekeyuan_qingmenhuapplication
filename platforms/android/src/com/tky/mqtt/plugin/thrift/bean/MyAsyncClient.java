package com.tky.mqtt.plugin.thrift.bean;

import org.apache.thrift.async.TAsyncClient;
import org.apache.thrift.async.TAsyncClientManager;
import org.apache.thrift.transport.TNonblockingSocket;

/**
 * Created by tkysls on 2017/5/4.
 */

public class MyAsyncClient {
    private final TAsyncClientManager manager;
    private final TNonblockingSocket socket;
    private TAsyncClient client;

    public MyAsyncClient(TAsyncClientManager manager, TNonblockingSocket socket, TAsyncClient client) {
        this.manager = manager;
        this.socket = socket;
        this.client = client;
    }

    public TAsyncClientManager getManager() {
        return manager;
    }

    public TNonblockingSocket getSocket() {
        return socket;
    }

    public TAsyncClient getClient() {
        return client;
    }
}
