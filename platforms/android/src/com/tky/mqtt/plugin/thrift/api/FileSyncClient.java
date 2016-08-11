package com.tky.mqtt.plugin.thrift.api;

import org.apache.thrift.transport.TTransport;

import im.server.File.IMFile;

/**
 * 作者：
 * 包名：com.tky.mqtt.plugin.thrift.api
 * 日期：2016/8/8 10:55
 * 描述：
 */
public class FileSyncClient {
    private TTransport transport;
    private IMFile.Client fileClient;

    public FileSyncClient(TTransport transport, IMFile.Client fileClient) {
        this.transport = transport;
        this.fileClient = fileClient;
    }

    public void close() {
        if (transport != null && transport.isOpen()) {
            transport.close();
            transport = null;
            fileClient = null;
        }
    }

    public TTransport getTransport() {
        return transport;
    }

    public void setTransport(TTransport transport) {
        this.transport = transport;
    }

    public IMFile.Client getFileClient() {
        return fileClient;
    }

    public void setFileClient(IMFile.Client fileClient) {
        this.fileClient = fileClient;
    }
}
