package com.tky.mqtt.plugin.thrift.api;

import org.apache.thrift.TException;
import org.apache.thrift.async.AsyncMethodCallback;
import org.apache.thrift.async.TAsyncClientManager;
import org.apache.thrift.protocol.TCompactProtocol;
import org.apache.thrift.transport.TNonblockingSocket;

import java.io.IOException;
import java.util.Map;

import im.server.Department.IMDepartment;
import im.server.System.IMSystem;
import im.server.User.IMUser;

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
    public static IMSystem.AsyncClient getSystemClient() throws IOException {
        TAsyncClientManager clientManager = new TAsyncClientManager();//172.25.26.165
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6001, 30000);
        TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
        IMSystem.AsyncClient asyncClient = new IMSystem.AsyncClient(protocol, clientManager, transport);
        return asyncClient;
    }

    /**
     * 获取一个AsyncClient对象
     * @return
     * @throws IOException
     */
    public static IMDepartment.AsyncClient getDeptClient() throws IOException {
        TAsyncClientManager clientManager = new TAsyncClientManager();//172.25.26.165
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6002, 30000);
        TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
        IMDepartment.AsyncClient asyncClient = new IMDepartment.AsyncClient(protocol, clientManager, transport);
        return asyncClient;
    }

    /**
     * 获取一个AsyncClient对象
     * @return
     * @throws IOException
     */
    public static IMUser.AsyncClient getUserClient() throws IOException {
        TAsyncClientManager clientManager = new TAsyncClientManager();//172.25.26.165
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6003, 30000);
        TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
        IMUser.AsyncClient asyncClient = new IMUser.AsyncClient(protocol, clientManager, transport);
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
        IMSystem.AsyncClient asyncClient = getSystemClient();
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
        IMSystem.AsyncClient asyncClient = getSystemClient();
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
        IMSystem.AsyncClient asyncClient = getSystemClient();
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
        IMSystem.AsyncClient asyncClient = getSystemClient();
        asyncClient.UserSearch(userId, searchText, pageNum, pageCount, callback);
    }

    /**
     * 获取子部门和人员列表
     * @param ID 被激活用户的ID
     * @param deptID 要获取的部门ID
     * @param pageNum
     * @param pageCount
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void getChild(String ID, String deptID, int pageNum, int pageCount, AsyncMethodCallback<IMDepartment.AsyncClient.GetChild_call> callback) throws IOException, TException {
        IMDepartment.AsyncClient asyncClient = getDeptClient();
        asyncClient.GetChild(ID, deptID, pageNum, pageCount, callback);
    }

    /**
     * 获取部门信息
     * @param ID 被激活用户的ID
     * @param deptID 要获取的部门ID
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void getDeparment(String ID, String deptID, AsyncMethodCallback<IMDepartment.AsyncClient.GetDeparment_call> callback) throws IOException, TException {
        IMDepartment.AsyncClient asyncClient = getDeptClient();
        asyncClient.GetDeparment(ID, deptID, callback);
    }

    /**
     * 获取用户一级部门
     * @param ID 被激活用户的ID
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void getUserRoot(String ID, AsyncMethodCallback<IMDepartment.AsyncClient.GetUserRoot_call> callback) throws IOException, TException {
        IMDepartment.AsyncClient asyncClient = getDeptClient();
        asyncClient.GetUserRoot(ID, callback);
    }

    /**
     * 获取用户信息
     * @param ID 用户ID
     * @param userID 要查询用户的ID
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void getUser(String ID, String userID, AsyncMethodCallback<IMUser.AsyncClient.GetUser_call> callback) throws IOException, TException {
        IMUser.AsyncClient userClient = getUserClient();
        userClient.GetUser(ID, userID, callback);
    }

    public static void updatePwd(String ID, String orgPWD, String newPWD, String confirmPWD, AsyncMethodCallback<IMUser.AsyncClient.UserPwdUpdate_call> callback) throws IOException, TException {
        IMUser.AsyncClient userClient = getUserClient();
        userClient.UserPwdUpdate(ID, orgPWD, newPWD, confirmPWD, callback);
    }

    public static void updateUserInfo(String ID, Map<String, String> updateInfo, AsyncMethodCallback<IMUser.AsyncClient.UserUpdate_call> callback) throws IOException, TException {
        IMUser.AsyncClient userClient = getUserClient();
        userClient.UserUpdate(ID, updateInfo, callback);
    }

}
