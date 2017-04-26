package com.tky.mqtt.plugin.thrift.api;

import android.content.Context;

import com.ionicframework.im366077.Constants;
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


  public static final String url = Constants.formalbasemobile; //正式
  //public static final String url = Constants.testbasemobile;//测试
  //public static final String url = Constants.JINGWAIURL;


  private static IMSystem.AsyncClient IMSystemAsyncClient;
  private static IMDepartment.AsyncClient IMDepartmentAsyncClient;
  private static IMUser.AsyncClient IMUserAsyncClient;
  private static IMFile.AsyncClient IMFileAsyncClient;
  private static FileSyncClient fileSyncClient;
  private static IMAttention.AsyncClient IMAttentionAsyncClient;
  private static IMMessage.AsyncClient IMMessageAsyncClient;
  private static IMGroup.AsyncClient IMGroupAsyncClient;
  private static TAsyncClientManager clientManager;
  private static TAsyncClientManager clientManager1;
  private static TAsyncClientManager clientManager2;
  private static TAsyncClientManager clientManager3;
  private static TAsyncClientManager clientManager4;
  private static TAsyncClientManager clientManager5;
  private static TAsyncClientManager clientManager6;

  public static void dealNetDown() {
    if (clientManager != null) {
      try {
        clientManager.stop();
      } catch (Exception e) {}
    }
    if (clientManager1 != null) {
      try {
        clientManager1.stop();
      } catch (Exception e) {}
    }
    if (clientManager2 != null) {
      try {
        clientManager2.stop();
      } catch (Exception e) {}
    }
    if (clientManager3 != null) {
      try {

      } catch (Exception e) {}
      clientManager3.stop();
    }
    if (clientManager4 != null) {
      try {
        clientManager4.stop();
      } catch (Exception e) {}
    }
    if (clientManager5 != null) {
      try {
        clientManager5.stop();
      } catch (Exception e) {}
    }
    if (clientManager6 != null) {
      try {
        clientManager6.stop();
      } catch (Exception e) {}
    }

    IMSystemAsyncClient = null;
    IMDepartmentAsyncClient = null;
    IMUserAsyncClient = null;
    IMFileAsyncClient = null;
    fileSyncClient = null;
    IMAttentionAsyncClient = null;
    IMMessageAsyncClient = null;
    IMGroupAsyncClient = null;
  }

  /**
   * 获取一个AsyncClient对象
   *
   * @return
   * @throws IOException
   */
  private static IMSystem.AsyncClient getSystemClient() throws IOException {
      /*if (clientManager != null) {
        clientManager.stop();
      }*/
    if (IMSystemAsyncClient == null || IMSystemAsyncClient.hasError()) {
      IMSystemAsyncClient = null;

      //172.25.26.165
      clientManager = new TAsyncClientManager();
      TNonblockingSocket transport = new TNonblockingSocket(url, 6001, 5000);
//        TNonblockingSocket transport = new TNonblockingSocket("61.237.239.152", 6001, 5000);
      TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
      IMSystemAsyncClient = new IMSystem.AsyncClient(protocol, clientManager, transport);
      IMSystemAsyncClient.setTimeout(5000);
    }
    return IMSystemAsyncClient;
  }

  /**
   * 获取一个AsyncClient对象
   *
   * @return
   * @throws IOException
   */
  private static IMDepartment.AsyncClient getDeptClient() throws IOException {
      /*if (clientManager1 != null) {
        clientManager1.stop();
      }*/
    if (IMDepartmentAsyncClient == null || IMDepartmentAsyncClient.hasError()) {
      IMDepartmentAsyncClient = null;
      //172.25.26.165
      clientManager1 = new TAsyncClientManager();
      TNonblockingSocket transport = new TNonblockingSocket(url, 6002, 5000);
      TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
      IMDepartmentAsyncClient = new IMDepartment.AsyncClient(protocol, clientManager1, transport);
      IMDepartmentAsyncClient.setTimeout(5000);
    }
    return IMDepartmentAsyncClient;
  }

  /**
   * 获取一个AsyncClient对象
   *
   * @return
   * @throws IOException
   */
  private static IMUser.AsyncClient getUserClient() throws IOException {
/*      if (clientManager2 != null) {
        clientManager2.stop();
      }*/
    if (IMUserAsyncClient == null || IMUserAsyncClient.hasError()) {
      IMUserAsyncClient = null;
      //172.25.26.165
      clientManager2 = new TAsyncClientManager();
      TNonblockingSocket transport = new TNonblockingSocket(url, 6003, 5000);
      TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
      IMUserAsyncClient = new IMUser.AsyncClient(protocol, clientManager2, transport);
      IMUserAsyncClient.setTimeout(5000);
    }
    return IMUserAsyncClient;
  }

  /**
   * 获取一个AsyncClient对象
   *
   * @return
   * @throws IOException
   */
  private static IMFile.AsyncClient getFileAsyncClient() throws IOException {
      /*if (IMFileAsyncClient != null) {
        IMFileAsyncClient.stop
      }*/
/*      if (clientManager3 != null) {
        clientManager3.stop();
      }*/
    if (IMFileAsyncClient == null || IMFileAsyncClient.hasError()) {
      IMFileAsyncClient = null;
      //172.25.26.165
      clientManager3 = new TAsyncClientManager();
      TNonblockingSocket transport = new TNonblockingSocket(url, 6006, 5000);
      TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
      IMFileAsyncClient = new IMFile.AsyncClient(protocol, clientManager3, transport);
      IMFileAsyncClient.setTimeout(5000);
    }
    return IMFileAsyncClient;
  }

  public static FileSyncClient getFileSyncClient() throws IOException {

//        if (fileSyncClient == null) {
    TTransport transport2 = new TFramedTransport(new TSocket(url, 6006, 5000));
    TProtocol protocol2 = new TCompactProtocol(transport2);
    IMFile.Client fileClient = new IMFile.Client(protocol2);
    try {
      transport2.open();
    } catch (TTransportException e) {
      e.printStackTrace();
    }
    fileSyncClient = new FileSyncClient(transport2, fileClient);
//        }
    return fileSyncClient;
  }

  /**
   * 获取一个AsyncClient对象
   *
   * @return
   * @throws IOException
   */
  private static IMAttention.AsyncClient getAttentionClient() throws IOException {
/*      if (clientManager4 != null) {
        clientManager4.stop();
      }*/
    if (IMAttentionAsyncClient == null || IMAttentionAsyncClient.hasError()) {
      IMAttentionAsyncClient = null;
      //172.25.26.165
      clientManager4 = new TAsyncClientManager();
      TNonblockingSocket transport = new TNonblockingSocket(url, 6007, 5000);
      TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
      IMAttentionAsyncClient = new IMAttention.AsyncClient(protocol, clientManager4, transport);
      IMAttentionAsyncClient.setTimeout(5000);
    }
    return IMAttentionAsyncClient;
  }

  /**
   * 获取一个AsyncClient对象
   *
   * @return
   * @throws IOException
   */
  private static IMMessage.AsyncClient getMsgClient() throws IOException {
/*      if (clientManager5 != null) {
        clientManager5.stop();
      }*/
    if (IMMessageAsyncClient == null || IMMessageAsyncClient.hasError()) {
      //172.25.26.165
      clientManager5 = new TAsyncClientManager();
      TNonblockingSocket transport = new TNonblockingSocket(url, 6005, 5000);
      TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
      IMMessageAsyncClient = new IMMessage.AsyncClient(protocol, clientManager5, transport);
      IMMessageAsyncClient.setTimeout(5000);
    }
    return IMMessageAsyncClient;
  }

  /**
   * 获取一个AsyncClient对象
   *
   * @return
   * @throws IOException
   */
  private static IMGroup.AsyncClient getGroupClient() throws IOException {
   /*   if (clientManager6 != null) {
        clientManager6.stop();
      }*/
    if (IMGroupAsyncClient == null || IMGroupAsyncClient.hasError()) {
      //172.25.26.165
      clientManager6 = new TAsyncClientManager();
      TNonblockingSocket transport = new TNonblockingSocket(url, 6004, 5000);
      TCompactProtocol.Factory protocol = new TCompactProtocol.Factory();
      IMGroupAsyncClient = new IMGroup.AsyncClient(protocol, clientManager6, transport);
      IMGroupAsyncClient.setTimeout(5000);
    }
    return IMGroupAsyncClient;
  }

  /**
   * 登录接口
   *
   * @param loginAccount 用户名
   * @param password     密码
   * @param imCode
   * @param callback     回调
   * @throws IOException
   * @throws TException
   */
  public static void login(String loginAccount, String password, String imCode, AsyncMethodCallback<IMSystem.AsyncClient.Login_call> callback) throws IOException, TException {
    try {
      IMSystem.AsyncClient asyncClient = getSystemClient();
      asyncClient.Login(loginAccount, password, imCode, callback);
    } catch (IllegalStateException e) {
      IMSystem.AsyncClient asyncClient = getSystemClient();
      asyncClient.Login(loginAccount, password, imCode, callback);
    }
  }

  /**
   * 激活用户
   *
   * @param userId   用户ID
   * @param imCode
   * @param callback 回调
   * @throws IOException
   * @throws TException
   */
  public static void activeUser(String userId, String imCode, AsyncMethodCallback<IMSystem.AsyncClient.ActivateUser_call> callback) throws IOException, TException {
    try {
      IMSystem.AsyncClient asyncClient = getSystemClient();
      asyncClient.ActivateUser(userId, imCode, callback);
    } catch (IllegalStateException e) {
      IMSystem.AsyncClient asyncClient = getSystemClient();
      asyncClient.ActivateUser(userId, imCode, callback);
    }
  }

  /**
   * 获取服务器系统时间
   *
   * @param userId   用户ID
   * @param callback 回调
   * @throws IOException
   * @throws TException
   */
  public static void getDatetime(String userId, AsyncMethodCallback<IMSystem.AsyncClient.GetDatetime_call> callback) throws IOException, TException {
    try {
      IMSystem.AsyncClient asyncClient = getSystemClient();
      asyncClient.GetDatetime(userId, callback);
    } catch (IllegalStateException e) {
      IMSystem.AsyncClient asyncClient = getSystemClient();
      asyncClient.GetDatetime(userId, callback);
    }
  }

  /**
   * 查找用户
   *
   * @param userId     用户ID
   * @param searchText 查找的文本
   * @param pageNum    第pageNum页的数据
   * @param pageCount  每页显示多少条
   * @param callback   回调
   * @throws IOException
   * @throws TException
   */
  public static void seachUsers(String userId, String searchText, int pageNum, int pageCount, AsyncMethodCallback<IMSystem.AsyncClient.UserSearch_call> callback) throws IOException, TException {
    try {
      IMSystem.AsyncClient asyncClient = getSystemClient();
      asyncClient.UserSearch(userId, searchText, pageNum, pageCount, callback);
    } catch (IllegalStateException e) {
      IMSystem.AsyncClient asyncClient = getSystemClient();
      asyncClient.UserSearch(userId, searchText, pageNum, pageCount, callback);
    }
  }

  /**
   * 解绑用户（让用户可以在其他设备上登录）
   *
   * @param ID
   * @param imCode
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void cancelUser(String ID, String imCode, AsyncMethodCallback<IMSystem.AsyncClient.CancelUser_call> callback) throws IOException, TException {
    try {
      IMSystem.AsyncClient asyncClient = getSystemClient();
      asyncClient.CancelUser(ID, imCode, callback);
    } catch (IllegalStateException e) {
      IMSystem.AsyncClient asyncClient = getSystemClient();
      asyncClient.CancelUser(ID, imCode, callback);
    }
  }

  /**
   * 重联验证
   *
   * @param ID       当前登录的用户的USERID
   * @param imCode   设备码
   * @param callback 回调
   * @throws IOException
   * @throws TException
   */
  public static void reloginCheck(String ID, String imCode, AsyncMethodCallback<IMSystem.AsyncClient.ReloginCheck_call> callback) throws IOException, TException {
    try {
      IMSystem.AsyncClient asyncClient = getSystemClient();
      asyncClient.ReloginCheck(ID, imCode, callback);
    } catch (IllegalStateException e) {
      IMSystem.AsyncClient asyncClient = getSystemClient();
      asyncClient.ReloginCheck(ID, imCode, callback);
    }
  }

  /**
   * 获取子部门和人员列表
   *
   * @param ID        被激活用户的ID
   * @param deptID    要获取的部门ID
   * @param pageNum
   * @param pageCount
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void getChild(String ID, String deptID, int pageNum, int pageCount, AsyncMethodCallback<IMDepartment.AsyncClient.GetChild_call> callback) throws IOException, TException {
    try {
      IMDepartment.AsyncClient asyncClient = getDeptClient();
      asyncClient.GetChild(ID, deptID, pageNum, pageCount, callback);
    } catch (IllegalStateException e) {
      IMDepartment.AsyncClient asyncClient = getDeptClient();
      asyncClient.GetChild(ID, deptID, pageNum, pageCount, callback);
    }
  }

  /**
   * 获取部门信息
   *
   * @param ID       被激活用户的ID
   * @param deptID   要获取的部门ID
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void getDeparment(String ID, String deptID, AsyncMethodCallback<IMDepartment.AsyncClient.GetDeparment_call> callback) throws IOException, TException {
    try {
      IMDepartment.AsyncClient asyncClient = getDeptClient();
      asyncClient.GetDeparment(ID, deptID, callback);
    } catch (IllegalStateException e) {
      IMDepartment.AsyncClient asyncClient = getDeptClient();
      asyncClient.GetDeparment(ID, deptID, callback);
    }
  }

  /**
   * 获取用户一级部门
   *
   * @param ID       被激活用户的ID
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void getUserRoot(String ID, AsyncMethodCallback<IMDepartment.AsyncClient.GetUserRoot_call> callback) throws IOException, TException {
    try {
      IMDepartment.AsyncClient asyncClient = getDeptClient();
      asyncClient.GetUserRoot(ID, callback);
    } catch (IllegalStateException e) {
      IMDepartment.AsyncClient asyncClient = getDeptClient();
      asyncClient.GetUserRoot(ID, callback);
    }
  }

  /**
   * 获取用户信息
   *
   * @param ID       用户ID
   * @param userID   要查询用户的ID
   * @param callback 回调
   * @throws IOException
   * @throws TException
   */
  public static void getUser(String ID, String userID, AsyncMethodCallback<IMUser.AsyncClient.GetUser_call> callback) throws IOException, TException {
    try {
      IMUser.AsyncClient userClient = getUserClient();
      userClient.GetUser(ID, userID, callback);
    } catch (IllegalStateException e) {
      IMUser.AsyncClient userClient = getUserClient();
      userClient.GetUser(ID, userID, callback);
    }
  }

  /**
   * 修改密码
   *
   * @param ID
   * @param orgPWD
   * @param newPWD
   * @param confirmPWD
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void updatePwd(String ID, String orgPWD, String newPWD, String confirmPWD, AsyncMethodCallback<IMUser.AsyncClient.UserPwdUpdate_call> callback) throws IOException, TException {
    try {
      IMUser.AsyncClient userClient = getUserClient();
      userClient.UserPwdUpdate(ID, orgPWD, newPWD, confirmPWD, callback);
    } catch (IllegalStateException e) {
      IMUser.AsyncClient userClient = getUserClient();
      userClient.UserPwdUpdate(ID, orgPWD, newPWD, confirmPWD, callback);
    }
  }

  /**
   * 修改用户信息
   *
   * @param ID
   * @param updateInfo
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void updateUserInfo(String ID, Map<String, String> updateInfo, AsyncMethodCallback<IMUser.AsyncClient.UserUpdate_call> callback) throws IOException, TException {
    try {
      IMUser.AsyncClient userClient = getUserClient();
      userClient.UserUpdate(ID, updateInfo, callback);
    } catch (IllegalStateException e) {
      IMUser.AsyncClient userClient = getUserClient();
      userClient.UserUpdate(ID, updateInfo, callback);
    }
  }

  /**
   * 获取用户信息
   *
   * @param ID     用户ID
   * @param userMB 要查询用户的本地ID和手机号
   */
  public static void checkLocalUser(String ID, Map<String, String> userMB, AsyncMethodCallback<IMUser.AsyncClient.CheckLocalUser_call> callback) throws IOException, TException {
    try {
      IMUser.AsyncClient userClient = getUserClient();
      userClient.CheckLocalUser(ID, userMB, callback);
    } catch (IllegalStateException e) {
      IMUser.AsyncClient userClient = getUserClient();
      userClient.CheckLocalUser(ID, userMB, callback);
    }
  }

  /**
   * 获取头像图片
   *
   * @param ID       用户ID
   * @param userID   要查询用户的ID
   * @param picSize  头像大小
   * @param callback 回调
   * @throws IOException
   * @throws TException
   */
  public static void getHeadPic(String ID, String userID, String picSize, AsyncMethodCallback<IMFile.AsyncClient.GetHeadPic_call> callback) throws IOException, TException {
    try {
      IMFile.AsyncClient fileClient = getFileAsyncClient();
      fileClient.GetHeadPic(ID, userID, picSize, callback);
    } catch (IllegalStateException e) {
      IMFile.AsyncClient fileClient = getFileAsyncClient();
      fileClient.GetHeadPic(ID, userID, picSize, callback);
    }
  }

  /**
   * 上传头像
   *
   * @param userID
   * @param filePath
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void setHeadPic(String userID, String filePath, AsyncMethodCallback<IMFile.AsyncClient.SetHeadPic_call> callback) throws IOException, TException {
    try {
      FileInputStream in;
      in = new FileInputStream(filePath);
      ByteBuffer fileByte = ByteBuffer.allocate(in.available());
      in.getChannel().read(fileByte);
      in.close();
      fileByte.flip();
      IMFile.AsyncClient fileClient = getFileAsyncClient();
      fileClient.SetHeadPic(userID, fileByte, 0, true, callback);
      fileByte.clear();
    } catch (IllegalStateException e) {
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
  }

  /**
   * 获取版本信息
   *
   * @param ID
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void getVersionInfo(String ID, AsyncMethodCallback<IMFile.AsyncClient.GetVersionInfo_call> callback) throws IOException, TException {
    try {
      IMFile.AsyncClient fileClient = getFileAsyncClient();
      fileClient.GetVersionInfo(ID, callback);
    } catch (IllegalStateException e) {
      IMFile.AsyncClient fileClient = getFileAsyncClient();
      fileClient.GetVersionInfo(ID, callback);
    }
  }

  /**
   * 下载APK
   *
   * @param ID
   * @throws IOException
   * @throws TException
   */
  public static boolean getVersion(String savePath, String ID, String apkVersion, Context context, String filesize) throws IOException, TException {
    return downloadApk(savePath, apkVersion, ID, apkVersion, context, filesize);
  }

  /**
   * 上传头像&发送文件(图片or音频)
   *
   * @param ID       用户ID
   * @param objectTP 设置对象的类型：U:用户；G:群组；I:发送图片；A:声音；F:文件(未指定时，默认F)
   * @param objectID 设置对象的ID:与objectTP对应，I,A,F时当offset=0时为null，offset>0时为起始发送时产生的fileID。
   * @param fileByte 文件二进制流
   * @param offset   上传的文件偏移位置，0表示从头开始；
   * @param isFinish 文件是否传完。True表示传输完成
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void sendFile(String ID, String objectTP, String objectID, ByteBuffer fileByte, long offset, boolean isFinish, AsyncMethodCallback<IMFile.AsyncClient.SendFile_call> callback) throws IOException, TException {
    try {
      IMFile.AsyncClient fileClient = getFileAsyncClient();
      fileClient.SendFile(ID, objectTP, objectID, fileByte, offset, isFinish, callback);
    } catch (IllegalStateException e) {
      IMFile.AsyncClient fileClient = getFileAsyncClient();
      fileClient.SendFile(ID, objectTP, objectID, fileByte, offset, isFinish, callback);
    }
  }

  /**
   * 获取头像&获取文件(图片or音频)
   *
   * @param ID       用户ID
   * @param objectTP 与SendFile对应
   * @param objectID 与SendFile对应
   * @param picSize  只对U、G和I有效,PicSize选项见下表
   * @param offset   文件开始下载的位置
   * @param getSize  请求的长度，为0时，采用默认
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void getFile(String ID, String objectTP, String objectID, String picSize, long offset, int getSize, AsyncMethodCallback<IMFile.AsyncClient.GetFile_call> callback) throws IOException, TException {
    try {
      IMFile.AsyncClient fileClient = getFileAsyncClient();
      fileClient.GetFile(ID, objectTP, objectID, picSize, offset, getSize, callback);
    } catch (IllegalStateException e) {
      IMFile.AsyncClient fileClient = getFileAsyncClient();
      fileClient.GetFile(ID, objectTP, objectID, picSize, offset, getSize, callback);
    }
  }

  /**
   * 下载APK 第一步
   *
   * @param savePath
   * @param apkVersion
   * @param ID
   * @param versionCode
   * @throws IOException
   * @throws TException
   */
  private static boolean downloadApk(String savePath, String apkVersion, String ID, String versionCode, Context context, String filesize) throws IOException, TException {
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
    return download(apkFile, ID, versionCode, context, filesize);//多线程下载，第二个参数为线程数
  }

  /**
   * 下载APK 第二步
   *
   * @param apkFile
   * @param ID
   * @param versionCode
   * @return
   * @throws IOException
   * @throws TException
   */
  private static boolean download(File apkFile, String ID, String versionCode, final Context context, String filesize) throws IOException, TException {

    final long size = Long.parseLong(filesize);

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

    FileSyncClient fileSyncClient = getFileSyncClient();
    IMFile.Client fileClient = fileSyncClient.getFileClient();
    while (result == null || !result.isFinish) {

      result = fileClient.GetVersion(ID, versionCode, (result == null ? 0 : (result.offset + result.getFileByte().length)), 1024 * 200);
      if (result != null && result.result) {
        raf.write(result.getFileByte());
//          fileSyncClient.close();
      } else {
        flag = false;
        break;
      }

      //final long finalOffset = result.getOffset();
      int progress = (int) (result.getOffset() * 1.0f / size * 100);
      ProgressDialogFactory.setProgress(progress);


    }

        /*try {
          FileSyncClient fileSyncClient = getFileSyncClient();
          IMFile.Client fileClient = fileSyncClient.getFileClient();
          while (result == null || !result.isFinish) {

            result = fileClient.GetVersion(ID, versionCode, (result == null ? 0 : (result.offset + result.getFileByte().length)), 1024 * 200);
            if (result != null && result.result) {
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
        } catch (IllegalStateException e) {
          FileSyncClient fileSyncClient = getFileSyncClient();
          IMFile.Client fileClient = fileSyncClient.getFileClient();
          while (result == null || !result.isFinish) {

            result = fileClient.GetVersion(ID, versionCode, (result == null ? 0 : (result.offset + result.getFileByte().length)), 1024 * 200);
            if (result != null && result.result) {
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
        }*/

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
   *
   * @param ID
   * @param members
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void addAttention(String ID, List<String> members, AsyncMethodCallback<IMAttention.AsyncClient.AddAttention_call> callback) throws IOException, TException {
    try {
      IMAttention.AsyncClient client = getAttentionClient();
      client.AddAttention(ID, members, callback);
    } catch (IllegalStateException e) {
      IMAttention.AsyncClient client = getAttentionClient();
      client.AddAttention(ID, members, callback);
    }
  }

  /**
   * 取消关注（列表）
   *
   * @param ID
   * @param members
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void removeAttention(String ID, List<String> members, AsyncMethodCallback<IMAttention.AsyncClient.RemoveAttention_call> callback) throws IOException, TException {
    try {
      IMAttention.AsyncClient client = getAttentionClient();
      client.RemoveAttention(ID, members, callback);
    } catch (IllegalStateException e) {
      IMAttention.AsyncClient client = getAttentionClient();
      client.RemoveAttention(ID, members, callback);
    }
  }

  /**
   * 获取关注列表
   *
   * @param ID
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void getAttention(String ID, AsyncMethodCallback<IMAttention.AsyncClient.GetAttention_call> callback) throws IOException, TException {
    try {
      IMAttention.AsyncClient client = getAttentionClient();
      client.GetAttention(ID, callback);
    } catch (IllegalStateException e) {
      IMAttention.AsyncClient client = getAttentionClient();
      client.GetAttention(ID, callback);
    }
  }

  /**
   * 获取历史消息
   *
   * @param ID          被激活用户的ID
   * @param sessionType 会话类型(U:个人，D：部门，G：群组)
   * @param sessionID   会话ID(U:对方ID，D&G:部门&群组ID)
   * @param pageNum     搜索的页数(0时为末页)
   * @param pageCount   每页的数目(0时为10)
   * @param callback    回调
   * @throws IOException
   * @throws TException
   */
  public static void getHistoryMsg(String ID, String sessionType, String sessionID, int pageNum, int pageCount, AsyncMethodCallback<IMMessage.AsyncClient.GetHistoryMsg_call> callback) throws IOException, TException {
    try {
      IMMessage.AsyncClient client = getMsgClient();
      client.GetHistoryMsg(ID, sessionType, sessionID, pageNum, pageCount, callback);
    } catch (IllegalStateException e) {
      IMMessage.AsyncClient client = getMsgClient();
      client.GetHistoryMsg(ID, sessionType, sessionID, pageNum, pageCount, callback);
    }
  }

  /**
   * 获取历史消息数
   *
   * @param ID          被激活用户的ID
   * @param sessionType 会话类型(U:个人，D：部门，G：群组)
   * @param sessionID   会话ID(U:对方ID，D&G:部门&群组ID)
   * @param callback    回调
   * @throws IOException
   * @throws TException
   */
  public static void getMsgCount(String ID, String sessionType, String sessionID, AsyncMethodCallback<IMMessage.AsyncClient.GetMsgCount_call> callback) throws IOException, TException {
    try {
      IMMessage.AsyncClient client = getMsgClient();
      client.GetMsgCount(ID, sessionType, sessionID, callback);
    } catch (IllegalStateException e) {
      IMMessage.AsyncClient client = getMsgClient();
      client.GetMsgCount(ID, sessionType, sessionID, callback);
    }
  }

  /**
   * 创建群组
   *
   * @param ID        用户ID
   * @param groupName 群名称
   * @param depts     直接选择的部们【deptID】列表
   * @param members   加入群的人员ID列表
   * @param callback  回调
   * @throws IOException
   * @throws TException
   */
  public static void addGroup(String ID, String groupName, List<String> depts, List<String> members, AsyncMethodCallback<IMGroup.AsyncClient.AddGroup_call> callback) throws IOException, TException {
    try {
      IMGroup.AsyncClient client = getGroupClient();
      client.AddGroup(ID, groupName, depts, members, callback);
    } catch (IllegalStateException e) {
      IMGroup.AsyncClient client = getGroupClient();
      client.AddGroup(ID, groupName, depts, members, callback);
    }
  }

  /**
   * 获取群组（列表）信息
   *
   * @param ID       用户ID
   * @param groupIds 群组ID列表
   * @param callback 回调
   * @throws IOException
   * @throws TException
   */
  public static void getGroup(String ID, List<String> groupIds, AsyncMethodCallback<IMGroup.AsyncClient.GetGroup_call> callback) throws IOException, TException {
    try {
      IMGroup.AsyncClient client = getGroupClient();
      client.GetGroup(ID, groupIds, callback);
    } catch (IllegalStateException e) {
      IMGroup.AsyncClient client = getGroupClient();
      client.GetGroup(ID, groupIds, callback);
    }
  }

  /**
   * 修改群信息
   *
   * @param ID        用户ID
   * @param groupID   群组ID
   * @param groupName 群名称
   * @param groupText 群公告
   * @param callback  回调
   * @throws IOException
   * @throws TException
   */
  public static void modifyGroup(String ID, String groupType, String groupID, String groupName, String groupText, AsyncMethodCallback<IMGroup.AsyncClient.ModifyGroup_call> callback) throws IOException, TException {
    try {
      IMGroup.AsyncClient client = getGroupClient();
      client.ModifyGroup(ID, groupType, groupID, groupName, groupText, callback);
    } catch (IllegalStateException e) {
      IMGroup.AsyncClient client = getGroupClient();
      client.ModifyGroup(ID, groupType, groupID, groupName, groupText, callback);
    }
  }

  /**
   * 解散群组
   *
   * @param ID       用户ID
   * @param groupID  群组ID
   * @param callback 回调
   * @throws IOException
   * @throws TException
   */
  public static void removeGroup(String ID, String groupID, AsyncMethodCallback<IMGroup.AsyncClient.RemoveGroup_call> callback) throws IOException, TException {
    try {
      IMGroup.AsyncClient client = getGroupClient();
      client.RemoveGroup(ID, groupID, callback);
    } catch (IllegalStateException e) {
      IMGroup.AsyncClient client = getGroupClient();
      client.RemoveGroup(ID, groupID, callback);
    }
  }

  /**
   * 获取群组指定信息
   *
   * @param ID         用户ID
   * @param groupID    群组ID
   * @param getObjects 查询的项目代码列表（参考下表）
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void getGroupUpdate(String ID, String groupType, String groupID, List<String> getObjects, AsyncMethodCallback<IMGroup.AsyncClient.GetGroupUpdate_call> callback) throws IOException, TException {
    try {
      IMGroup.AsyncClient client = getGroupClient();
      client.GetGroupUpdate(ID, groupType, groupID, getObjects, callback);
    } catch (IllegalStateException e) {
      IMGroup.AsyncClient client = getGroupClient();
      client.GetGroupUpdate(ID, groupType, groupID, getObjects, callback);
    }
  }

  /**
   * 群组添加人员（列表）
   *
   * @param ID       用户ID
   * @param groupID  群组ID
   * @param depts    加入群的部门ID列表
   * @param members  需要添加的人员列表信息
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void groupAddMember(String ID, String groupID, List<String> depts, List<String> members, AsyncMethodCallback<IMGroup.AsyncClient.GroupAddMember_call> callback) throws IOException, TException {
    try {
      IMGroup.AsyncClient client = getGroupClient();
      client.GroupAddMember(ID, groupID, depts, members, callback);
    } catch (IllegalStateException e) {
      IMGroup.AsyncClient client = getGroupClient();
      client.GroupAddMember(ID, groupID, depts, members, callback);
    }
  }

  /**
   * 群组移除人员（列表）
   *
   * @param ID       用户ID
   * @param groupID  群组ID
   * @param members  需要移除的人员ID列表
   * @param callback 回调
   * @throws IOException
   * @throws TException
   */
  public static void groupRemoveMember(String ID, String groupID, List<String> members, AsyncMethodCallback<IMGroup.AsyncClient.GroupRemoveMember_call> callback) throws IOException, TException {
    try {
      IMGroup.AsyncClient client = getGroupClient();
      client.GroupRemoveMember(ID, groupID, members, callback);
    } catch (IllegalStateException e) {
      IMGroup.AsyncClient client = getGroupClient();
      client.GroupRemoveMember(ID, groupID, members, callback);
    }
  }

  /**
   * 群组添加管理员（列表）
   *
   * @param ID       用户ID
   * @param groupID  群组ID
   * @param admins   需要添加为管理员的人员ID列表
   * @param callback 回调
   * @throws IOException
   * @throws TException
   */
  public static void groupAddAdmin(String ID, String groupID, List<String> admins, AsyncMethodCallback<IMGroup.AsyncClient.GroupAddAdmin_call> callback) throws IOException, TException {
    try {
      IMGroup.AsyncClient client = getGroupClient();
      client.GroupAddAdmin(ID, groupID, admins, callback);
    } catch (IllegalStateException e) {
      IMGroup.AsyncClient client = getGroupClient();
      client.GroupAddAdmin(ID, groupID, admins, callback);
    }
  }

  /**
   * 群组移除管理员（列表）
   *
   * @param ID       用户ID
   * @param groupID  群组ID
   * @param admins   需要移除管理员的人员ID列表
   * @param callback 回调
   * @throws IOException
   * @throws TException
   */
  public static void groupRemoveAdmin(String ID, String groupID, List<String> admins, AsyncMethodCallback<IMGroup.AsyncClient.GroupRemoveAdmin_call> callback) throws IOException, TException {
    try {
      IMGroup.AsyncClient client = getGroupClient();
      client.GroupRemoveAdmin(ID, groupID, admins, callback);
    } catch (IllegalStateException e) {
      IMGroup.AsyncClient client = getGroupClient();
      client.GroupRemoveAdmin(ID, groupID, admins, callback);
    }
  }

  /**
   * 获取用户所有群组
   *
   * @param ID       用户ID
   * @param callback 回调
   * @throws IOException
   * @throws TException
   */
  public static void getAllGroup(String ID, AsyncMethodCallback<IMGroup.AsyncClient.GetAllGroup_call> callback) throws IOException, TException {
    try {
      IMGroup.AsyncClient client = getGroupClient();
      client.GetAllGroup(ID, callback);
    } catch (IllegalStateException e) {
      IMGroup.AsyncClient client = getGroupClient();
      client.GetAllGroup(ID, callback);
    }
  }

  /**
   * 确认消息回复
   *
   * @param ID          被激活用户的ID
   * @param sessionType 会话类型(U:个人，D：部门，G：群组)
   * @param sessionID   会话ID(U:对方ID，D&G:部门&群组ID)
   * @param sendWhen    消息发送时间when
   * @param callback    回调
   * @throws IOException
   * @throws TException
   */
  public static void readMessage(String ID, String sessionType, String sessionID, long sendWhen, AsyncMethodCallback<IMMessage.AsyncClient.ReadMessage_call> callback) throws IOException, TException {
    try {
      IMMessage.AsyncClient client = getMsgClient();
      client.ReadMessage(ID, sessionType, sessionID, sendWhen, callback);
    } catch (IllegalStateException e) {
      IMMessage.AsyncClient client = getMsgClient();
      client.ReadMessage(ID, sessionType, sessionID, sendWhen, callback);
    }
  }


  /**
   * 拉取离线建群，登录订阅群组topic以前的群消息
   *
   * @param ID
   * @param sessionType
   * @param sessionID
   * @param when
   * @param msgCount
   * @param callback
   * @throws IOException
   * @throws TException
   */
  public static void getLatestMsg(String ID, String sessionType, String sessionID, long when, int msgCount, AsyncMethodCallback<IMMessage.AsyncClient.GetLatestMsg_call> callback) throws IOException, TException {
    try {
      IMMessage.AsyncClient client = getMsgClient();
      client.GetLatestMsg(ID, sessionType, sessionID, when, msgCount, callback);
    } catch (IllegalStateException e) {
      IMMessage.AsyncClient client = getMsgClient();
      client.GetLatestMsg(ID, sessionType, sessionID, when, msgCount, callback);
    }
  }

}
