package com.tky.mqtt.plugin.thrift.api;

import org.apache.thrift.TException;
import org.apache.thrift.async.AsyncMethodCallback;
import org.apache.thrift.async.TAsyncClientManager;
import org.apache.thrift.protocol.TCompactProtocol;
import org.apache.thrift.transport.TNonblockingSocket;

import java.io.IOException;

import im.server.System.IMSystem;

/**
 * 作者：
 * 包名：com.tky.mqtt.plugin.thrift.api
 * 日期：2016/7/26 15:35
 * 描述：
 */
public class SystemApi {

    /**
     * 获取一个AsyncClient对象
     * @return
     * @throws IOException
     */
    public static IMSystem.AsyncClient getClient() throws IOException {
        TAsyncClientManager clientManager = new TAsyncClientManager();//172.25.26.165
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6001, 30000);
        TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
        IMSystem.AsyncClient asyncClient = new IMSystem.AsyncClient(protocol, clientManager, transport);
        return asyncClient;
    }

    /**
     * 登录接口
     * @param loginAccount 用户名
     * @param password 密码
     * @param imCode
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void login(String loginAccount, String password, String imCode, AsyncMethodCallback<IMSystem.AsyncClient.Login_call> callback) throws IOException, TException {
        IMSystem.AsyncClient asyncClient = getClient();
        asyncClient.Login(loginAccount, password, imCode, callback);
    }

    /**
     * 激活用户
     * @param userId 用户ID
     * @param imCode
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void activeUser(String userId, String imCode, AsyncMethodCallback<IMSystem.AsyncClient.ActivateUser_call> callback) throws IOException, TException {
        IMSystem.AsyncClient asyncClient = getClient();
        asyncClient.ActivateUser(userId, imCode, callback);
    }

    /**
     * 获取服务器系统时间
     * @param userId 用户ID
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void getDatetime(String userId, AsyncMethodCallback<IMSystem.AsyncClient.GetDatetime_call> callback) throws IOException, TException {
        IMSystem.AsyncClient asyncClient = getClient();
        asyncClient.GetDatetime(userId, callback);
    }

    /**
     * 查找用户
     * @param userId 用户ID
     * @param searchText 查找的文本
     * @param pageNum 第pageNum页的数据
     * @param pageCount 每页显示多少条
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void seachUsers(String userId, String searchText, int pageNum, int pageCount, AsyncMethodCallback<IMSystem.AsyncClient.UserSearch_call> callback) throws IOException, TException {
        IMSystem.AsyncClient asyncClient = getClient();
        asyncClient.UserSearch(userId, searchText, pageNum, pageCount, callback);
    }
}
