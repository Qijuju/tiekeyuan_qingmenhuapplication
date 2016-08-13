package com.tky.mqtt.plugin.thrift.api;

import org.apache.thrift.TException;
import org.apache.thrift.async.AsyncMethodCallback;
import org.apache.thrift.async.TAsyncClientManager;
import org.apache.thrift.protocol.TCompactProtocol;
import org.apache.thrift.protocol.TProtocol;
import org.apache.thrift.transport.TFramedTransport;
import org.apache.thrift.transport.TNonblockingSocket;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TTransport;
import org.apache.thrift.transport.TTransportException;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.Map;

import im.server.Department.IMDepartment;
import im.server.File.IMFile;
import im.server.File.RSTversion;
import im.server.Message.IMMessage;
import im.server.System.IMSystem;
import im.server.User.IMUser;
import im.server.attention.IMAttention;

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
    private static IMSystem.AsyncClient getSystemClient() throws IOException {
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
    private static IMDepartment.AsyncClient getDeptClient() throws IOException {
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
    private static IMUser.AsyncClient getUserClient() throws IOException {
        TAsyncClientManager clientManager = new TAsyncClientManager();//172.25.26.165
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6003, 30000);
        TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
        IMUser.AsyncClient asyncClient = new IMUser.AsyncClient(protocol, clientManager, transport);
        return asyncClient;
    }

    /**
     * 获取一个AsyncClient对象
     * @return
     * @throws IOException
     */
    private static IMFile.AsyncClient getFileAsyncClient() throws IOException {
        TAsyncClientManager clientManager = new TAsyncClientManager();//172.25.26.165
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6006, 30000);
        TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
        IMFile.AsyncClient asyncClient = new IMFile.AsyncClient(protocol, clientManager, transport);
        return asyncClient;
    }

    private static FileSyncClient getFileSyncClient() throws IOException{
        TTransport transport2 = new TFramedTransport(new TSocket("61.237.239.152", 6006, 300000));
        TProtocol protocol2 = new TCompactProtocol(transport2);
        IMFile.Client fileClient = new IMFile.Client(protocol2);
        try {
            transport2.open();
        } catch (TTransportException e) {
            e.printStackTrace();
        }
        return new FileSyncClient(transport2, fileClient);
    }

    /**
     * 获取一个AsyncClient对象
     * @return
     * @throws IOException
     */
    private static IMAttention.AsyncClient getAttentionClient() throws IOException {
        TAsyncClientManager clientManager = new TAsyncClientManager();//172.25.26.165
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6007, 30000);
        TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
        IMAttention.AsyncClient asyncClient = new IMAttention.AsyncClient(protocol, clientManager, transport);
        return asyncClient;
    }

    /**
     * 获取一个AsyncClient对象
     * @return
     * @throws IOException
     */
    private static IMMessage.AsyncClient getMsgClient() throws IOException {
        TAsyncClientManager clientManager = new TAsyncClientManager();//172.25.26.165
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6005, 30000);
        TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
        IMMessage.AsyncClient asyncClient = new IMMessage.AsyncClient(protocol, clientManager, transport);
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

    /**
     * 修改密码
     * @param ID
     * @param orgPWD
     * @param newPWD
     * @param confirmPWD
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void updatePwd(String ID, String orgPWD, String newPWD, String confirmPWD, AsyncMethodCallback<IMUser.AsyncClient.UserPwdUpdate_call> callback) throws IOException, TException {
        IMUser.AsyncClient userClient = getUserClient();
        userClient.UserPwdUpdate(ID, orgPWD, newPWD, confirmPWD, callback);
    }

    /**
     * 修改用户信息
     * @param ID
     * @param updateInfo
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void updateUserInfo(String ID, Map<String, String> updateInfo, AsyncMethodCallback<IMUser.AsyncClient.UserUpdate_call> callback) throws IOException, TException {
        IMUser.AsyncClient userClient = getUserClient();
        userClient.UserUpdate(ID, updateInfo, callback);
    }

    /**
     * 获取头像图片
     * @param ID 用户ID
     * @param userID 要查询用户的ID
     * @param picSize 头像大小
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void getHeadPic(String ID, String userID, String picSize, AsyncMethodCallback<IMFile.AsyncClient.GetHeadPic_call> callback) throws IOException, TException {
        IMFile.AsyncClient fileClient = getFileAsyncClient();
        fileClient.GetHeadPic(ID, userID, picSize, callback);
    }

    /**
     * 上传头像
     * @param userID
     * @param filePath
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void setHeadPic(String userID, String filePath, AsyncMethodCallback<IMFile.AsyncClient.SetHeadPic_call> callback) throws IOException, TException {
        FileInputStream in;
        in = new FileInputStream(filePath);
        ByteBuffer fileByte = ByteBuffer.allocate(in.available());
        in.getChannel().read(fileByte);
        in.close();
        fileByte.flip();
        IMFile.AsyncClient fileClient = getFileAsyncClient();
        fileClient.SetHeadPic(userID, fileByte, 0, true, callback);
        fileByte.clear();
    }

    /**
     * 获取版本信息
     * @param ID
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void getVersionInfo(String ID, AsyncMethodCallback<IMFile.AsyncClient.GetVersionInfo_call> callback) throws IOException, TException {
        IMFile.AsyncClient fileClient = getFileAsyncClient();
        fileClient.GetVersionInfo(ID, callback);
    }

    /**
     * 下载APK
     * @param ID
     * @throws IOException
     * @throws TException
     */
    public static boolean getVersion(String savePath, String ID, String apkVersion) throws IOException, TException {
        return downloadApk(savePath, apkVersion, ID, apkVersion);
    }

    /**
     * 下载APK 第一步
     * @param savePath
     * @param apkVersion
     * @param ID
     * @param versionCode
     * @throws IOException
     * @throws TException
     */
    private static boolean downloadApk(String savePath, String apkVersion, String ID, String versionCode) throws IOException, TException {
        File saveDir = new File(savePath);
        if (saveDir != null && !saveDir.exists()) {
            saveDir.mkdirs();
        }

        String apkPath = saveDir + File.separator + "1000"/*apkVersion*/ + ".apk";
        File apkFile = new File(apkPath);
        if (apkFile != null && !apkFile.exists()) {
            apkFile.createNewFile();
        } else {
            apkFile.delete();
            apkFile.createNewFile();
        }
        return download(apkFile, ID, versionCode);//多线程下载，第二个参数为线程数
    }

    /**
     * 下载APK 第二步
     * @param apkFile
     * @param ID
     * @param versionCode
     * @return
     * @throws IOException
     * @throws TException
     */
    private static boolean download(File apkFile, String ID, String versionCode) throws IOException, TException {
        RandomAccessFile raf = new RandomAccessFile(apkFile, "rw");
        raf.seek(0);
        RSTversion result = null;
        boolean flag = true;
        while (result == null || !result.isFinish) {
            FileSyncClient fileSyncClient = getFileSyncClient();
            result = fileSyncClient.getFileClient().GetVersion(ID, versionCode, (result == null ? 0 : (result.offset + result.getFileByte().length)), 1024 * 200);
            if(result != null && result.result) {
                raf.write(result.getFileByte());
                fileSyncClient.close();
            } else {
                flag = false;
                break;
            }
        }
        raf.close();
        return flag;
    }

    /**
     * 添加关注(列表)
     * @param ID
     * @param members
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void addAttention(String ID, List<String> members, AsyncMethodCallback<IMAttention.AsyncClient.AddAttention_call> callback) throws IOException, TException {
        IMAttention.AsyncClient client = getAttentionClient();
        client.AddAttention(ID, members, callback);
    }

    /**
     * 取消关注（列表）
     * @param ID
     * @param members
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void removeAttention(String ID, List<String> members, AsyncMethodCallback<IMAttention.AsyncClient.RemoveAttention_call> callback) throws IOException, TException {
        IMAttention.AsyncClient client = getAttentionClient();
        client.RemoveAttention(ID, members, callback);
    }

    /**
     * 获取关注列表
     * @param ID
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void getAttention(String ID, AsyncMethodCallback<IMAttention.AsyncClient.GetAttention_call> callback) throws IOException, TException {
        IMAttention.AsyncClient client = getAttentionClient();
        client.GetAttention(ID, callback);
    }

    /**
     * 获取历史消息
     * @param ID 被激活用户的ID
     * @param sessionType 会话类型(U:个人，D：部门，G：群组)
     * @param sessionID 会话ID(U:对方ID，D&G:部门&群组ID)
     * @param pageNum 搜索的页数(0时为末页)
     * @param pageCount 每页的数目(0时为10)
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void getHistoryMsg(String ID, String sessionType, String sessionID, int pageNum, int pageCount, AsyncMethodCallback<IMMessage.AsyncClient.GetHistoryMsg_call> callback) throws IOException, TException {
        IMMessage.AsyncClient client = getMsgClient();
        client.GetHistoryMsg(ID, sessionType, sessionID, pageNum, pageCount, callback);
    }

    /**
     * 获取历史消息数
     * @param ID 被激活用户的ID
     * @param sessionType 会话类型(U:个人，D：部门，G：群组)
     * @param sessionID 会话ID(U:对方ID，D&G:部门&群组ID)
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void getMsgCount(String ID, String sessionType, String sessionID, AsyncMethodCallback<IMMessage.AsyncClient.GetMsgCount_call> callback) throws IOException, TException {
        IMMessage.AsyncClient client = getMsgClient();
        client.GetMsgCount(ID, sessionType, sessionID, callback);
    }

}
