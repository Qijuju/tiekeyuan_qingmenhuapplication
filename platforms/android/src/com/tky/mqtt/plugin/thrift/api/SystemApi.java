package com.tky.mqtt.plugin.thrift.api;

import android.content.Context;

import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;

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
import im.server.Group.IMGroup;
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
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6001, 5000);
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
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6002, 5000);
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
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6003, 5000);
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
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6006, 5000);
        TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
        IMFile.AsyncClient asyncClient = new IMFile.AsyncClient(protocol, clientManager, transport);
        return asyncClient;
    }

    public static FileSyncClient getFileSyncClient() throws IOException{
        TTransport transport2 = new TFramedTransport(new TSocket("61.237.239.152", 6006, 5000));
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
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6007, 5000);
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
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6005, 5000);
        TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
        IMMessage.AsyncClient asyncClient = new IMMessage.AsyncClient(protocol, clientManager, transport);
        return asyncClient;
    }

    /**
     * 获取一个AsyncClient对象
     * @return
     * @throws IOException
     */
    private static IMGroup.AsyncClient getGroupClient() throws IOException {
        TAsyncClientManager clientManager = new TAsyncClientManager();//172.25.26.165
        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6004, 5000);
        TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
        IMGroup.AsyncClient asyncClient = new IMGroup.AsyncClient(protocol, clientManager, transport);
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
     * 解绑用户（让用户可以在其他设备上登录）
     * @param ID
     * @param imCode
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void cancelUser(String ID, String imCode, AsyncMethodCallback<IMSystem.AsyncClient.CancelUser_call> callback) throws IOException, TException {
        IMSystem.AsyncClient asyncClient = getSystemClient();
        asyncClient.CancelUser(ID, imCode, callback);
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
     * 获取用户信息
     * @param ID 用户ID
     * @param userMB 要查询用户的本地ID和手机号
     */
    public static void checkLocalUser(String ID, Map<String, String> userMB, AsyncMethodCallback<IMUser.AsyncClient.CheckLocalUser_call> callback) throws IOException, TException {
        IMUser.AsyncClient userClient = getUserClient();
        userClient.CheckLocalUser(ID, userMB, callback);
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
    public static boolean getVersion(String savePath, String ID, String apkVersion,Context context,String filesize) throws IOException, TException {
        return downloadApk(savePath, apkVersion, ID, apkVersion, context, filesize);
    }

    /**
     * 上传头像&发送文件(图片or音频)
     * @param ID 用户ID
     * @param objectTP 设置对象的类型：U:用户；G:群组；I:发送图片；A:声音；F:文件(未指定时，默认F)
     * @param objectID 设置对象的ID:与objectTP对应，I,A,F时当offset=0时为null，offset>0时为起始发送时产生的fileID。
     * @param fileByte 文件二进制流
     * @param offset 上传的文件偏移位置，0表示从头开始；
     * @param isFinish 文件是否传完。True表示传输完成
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void sendFile(String ID, String objectTP, String objectID, ByteBuffer fileByte, long offset, boolean isFinish, AsyncMethodCallback<IMFile.AsyncClient.SendFile_call> callback) throws IOException, TException {
        IMFile.AsyncClient fileClient = getFileAsyncClient();
        fileClient.SendFile(ID, objectTP, objectID, fileByte, offset, isFinish, callback);
    }

    /**
     * 获取头像&获取文件(图片or音频)
     * @param ID 用户ID
     * @param objectTP 与SendFile对应
     * @param objectID 与SendFile对应
     * @param picSize 只对U、G和I有效,PicSize选项见下表
     * @param offset 文件开始下载的位置
     * @param getSize 请求的长度，为0时，采用默认
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void getFile(String ID, String objectTP, String objectID, String picSize, long offset, int getSize, AsyncMethodCallback<IMFile.AsyncClient.GetFile_call> callback) throws IOException, TException {
        IMFile.AsyncClient fileClient = getFileAsyncClient();
        fileClient.GetFile(ID, objectTP, objectID, picSize, offset, getSize, callback);
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
    private static boolean downloadApk(String savePath, String apkVersion, String ID, String versionCode,Context context,String filesize) throws IOException, TException {
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
        return download(apkFile, ID, versionCode,context,filesize);//多线程下载，第二个参数为线程数
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
    private static boolean download(File apkFile, String ID, String versionCode, final Context context,String filesize) throws IOException, TException {

        final long size=Long.parseLong(filesize);

        UIUtils.runInMainThread(new Runnable() {
            @Override
            public void run() {
                ProgressDialogFactory.getProgressDialog(context);
            }
        });

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

            //final long finalOffset = result.getOffset();
            int progress = (int) (result.getOffset() * 1.0f / size * 100);
            ProgressDialogFactory.setProgress(progress);


        }

        UIUtils.runInMainThread(new Runnable() {
            @Override
            public void run() {
                ProgressDialogFactory.setProgress(1);
                ProgressDialogFactory.cancel();
            }
        });
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

    /**
     * 创建群组
     * @param ID 用户ID
     * @param groupName 群名称
     * @param depts 直接选择的部们【deptID】列表
     * @param members 加入群的人员ID列表
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void addGroup(String ID, String groupName, List<String> depts, List<String> members, AsyncMethodCallback<IMGroup.AsyncClient.AddGroup_call> callback) throws IOException, TException {
        IMGroup.AsyncClient client = getGroupClient();
        client.AddGroup(ID, groupName, depts, members, callback);
    }

    /**
     * 获取群组（列表）信息
     * @param ID 用户ID
     * @param groupIds 群组ID列表
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void getGroup(String ID, List<String> groupIds, AsyncMethodCallback<IMGroup.AsyncClient.GetGroup_call> callback) throws IOException, TException {
        IMGroup.AsyncClient client = getGroupClient();
        client.GetGroup(ID, groupIds, callback);
    }

    /**
     * 修改群信息
     * @param ID 用户ID
     * @param groupID 群组ID
     * @param groupName 群名称
     * @param groupText 群公告
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void modifyGroup(String ID, String groupType, String groupID, String groupName, String groupText, AsyncMethodCallback<IMGroup.AsyncClient.ModifyGroup_call> callback) throws IOException, TException {
        IMGroup.AsyncClient client = getGroupClient();
        client.ModifyGroup(ID, groupType, groupID, groupName, groupText, callback);
    }

    /**
     * 解散群组
     * @param ID 用户ID
     * @param groupID 群组ID
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void removeGroup(String ID, String groupID, AsyncMethodCallback<IMGroup.AsyncClient.RemoveGroup_call> callback) throws IOException, TException {
        IMGroup.AsyncClient client = getGroupClient();
        client.RemoveGroup(ID, groupID, callback);
    }

    /**
     * 获取群组指定信息
     * @param ID 用户ID
     * @param groupID 群组ID
     * @param getObjects 查询的项目代码列表（参考下表）
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void getGroupUpdate(String ID, String groupType, String groupID, List<String> getObjects, AsyncMethodCallback<IMGroup.AsyncClient.GetGroupUpdate_call> callback) throws IOException, TException {
        IMGroup.AsyncClient client = getGroupClient();
        client.GetGroupUpdate(ID, groupType, groupID, getObjects, callback);
    }

    /**
     * 群组添加人员（列表）
     * @param ID 用户ID
     * @param groupID 群组ID
     * @param depts 加入群的部门ID列表
     * @param members 需要添加的人员列表信息
     * @param callback
     * @throws IOException
     * @throws TException
     */
    public static void groupAddMember(String ID, String groupID, List<String> depts, List<String> members, AsyncMethodCallback<IMGroup.AsyncClient.GroupAddMember_call> callback) throws IOException, TException {
        IMGroup.AsyncClient client = getGroupClient();
        client.GroupAddMember(ID, groupID, depts, members, callback);
    }

    /**
     * 群组移除人员（列表）
     * @param ID 用户ID
     * @param groupID 群组ID
     * @param members 需要移除的人员ID列表
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void groupRemoveMember(String ID, String groupID, List<String> members, AsyncMethodCallback<IMGroup.AsyncClient.GroupRemoveMember_call> callback) throws IOException, TException {
        IMGroup.AsyncClient client = getGroupClient();
        client.GroupRemoveMember(ID, groupID, members, callback);
    }

    /**
     * 群组添加管理员（列表）
     * @param ID 用户ID
     * @param groupID 群组ID
     * @param admins 需要添加为管理员的人员ID列表
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void groupAddAdmin(String ID, String groupID, List<String> admins, AsyncMethodCallback<IMGroup.AsyncClient.GroupAddAdmin_call> callback) throws IOException, TException {
        IMGroup.AsyncClient client = getGroupClient();
        client.GroupAddAdmin(ID, groupID, admins, callback);
    }

    /**
     * 群组移除管理员（列表）
     * @param ID 用户ID
     * @param groupID 群组ID
     * @param admins 需要移除管理员的人员ID列表
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void groupRemoveAdmin(String ID, String groupID, List<String> admins, AsyncMethodCallback<IMGroup.AsyncClient.GroupRemoveAdmin_call> callback) throws IOException, TException {
        IMGroup.AsyncClient client = getGroupClient();
        client.GroupRemoveAdmin(ID, groupID, admins, callback);
    }

    /**
     * 获取用户所有群组
     * @param ID 用户ID
     * @param callback 回调
     * @throws IOException
     * @throws TException
     */
    public static void getAllGroup(String ID, AsyncMethodCallback<IMGroup.AsyncClient.GetAllGroup_call> callback) throws IOException, TException {
        IMGroup.AsyncClient client = getGroupClient();
        client.GetAllGroup(ID, callback);
    }

}
