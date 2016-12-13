package com.tky.mqtt.plugin.thrift;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.tky.mqtt.dao.ChatList;
import com.tky.mqtt.dao.GroupChats;
import com.tky.mqtt.dao.Messages;
import com.tky.mqtt.paho.MqttReceiver;
import com.tky.mqtt.paho.MqttTopicRW;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.bean.MessageBean;
import com.tky.mqtt.paho.http.OKSyncGetClient;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.utils.FileUtils;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.paho.utils.NetUtils;
import com.tky.mqtt.paho.utils.SwitchLocal;
import com.tky.mqtt.plugin.thrift.api.ProgressDialogFactory;
import com.tky.mqtt.plugin.thrift.api.SystemApi;
import com.tky.mqtt.plugin.thrift.callback.GetHeadPicCallback;
import com.tky.mqtt.services.ChatListService;
import com.tky.mqtt.services.GroupChatsService;
import com.tky.mqtt.services.LocalPhoneService;
import com.tky.mqtt.services.MessagesService;
import com.tky.mqtt.services.SystemMsgService;
import com.tky.mqtt.services.TopContactsService;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.thrift.TException;
import org.apache.thrift.async.AsyncMethodCallback;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import im.model.Group;
import im.model.Msg;
import im.model.RST;
import im.model.User;
import im.model.UserCheck;
import im.server.Department.IMDepartment;
import im.server.Department.RSTgetChild;
import im.server.Department.RSTgetDept;
import im.server.Department.RSTgetRoot;
import im.server.File.IMFile;
import im.server.File.RSTSendFile;
import im.server.File.RSTgetFile;
import im.server.File.RSTversionInfo;
import im.server.Group.IMGroup;
import im.server.Group.RSTChangeGroup;
import im.server.Group.RSTaddGroup;
import im.server.Group.RSTgetGroup;
import im.server.Group.RSTgetGroupUpdate;
import im.server.Message.IMMessage;
import im.server.Message.RSTgetMsg;
import im.server.Message.RSTgetMsgCount;
import im.server.Message.RSTreadMsg;
import im.server.System.IMSystem;
import im.server.System.RSTlogin;
import im.server.System.RSTsearch;
import im.server.System.RSTsysTime;
import im.server.User.IMUser;
import im.server.User.RSTCheckUser;
import im.server.User.RSTgetUser;
import im.server.attention.IMAttention;
import im.server.attention.RSTgetAttention;
import okhttp3.OkHttpClient;

/**
 * 作者：
 * 包名：com.tky.mqtt.plugin.thrift
 * 日期：2016-07-26 15:31:56
 * 描述：
 */
public class ThriftApiClient extends CordovaPlugin {

    /**
     * 文件下载列表
     */
    private static final List<String> downList = new ArrayList<String>();

  	@Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Method method = ThriftApiClient.class.getDeclaredMethod(action, JSONArray.class, CallbackContext.class);
                    method.invoke(ThriftApiClient.this, args, callbackContext);
                } catch (NoSuchMethodException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        });
        return true;
    }

    /**
     * 登录接口
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void login(final JSONArray args, final CallbackContext callbackContext) {
        try {
            MqttReceiver.hasRegister=false;
            String username = args.getString(0);
            String password = args.getString(1);
            String imCode = UIUtils.getDeviceId();
            SystemApi.login(username.trim(), password.trim(), imCode, new AsyncMethodCallback<IMSystem.AsyncClient.Login_call>() {
                @Override
                public void onComplete(IMSystem.AsyncClient.Login_call login_call) {
                    if (login_call == null) {
                    } else {
                        try {
                            RSTlogin result = login_call.getResult();
                            if (result == null) {
                                setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                            } else {
                                if ("100".equals(result.getResultCode())) {
                                    MqttRobot.setIsStarted(true);
                                    Gson gson = new Gson();
                                    final String loginJson = gson.toJson(result, RSTlogin.class);
                                    JSONObject newUserObj = new JSONObject(loginJson);
                                    String newuserID = newUserObj.getString("userID");//新登陆用户名
//                                    System.out.println("新用户名"+newuserID);
                                    String userID = getUserID();//旧用户名
//                                    System.out.println("旧用户名"+userID);
                                    //若前后两次用户名不一致,清楚本地数据库数据库缓存
                                    if (userID != null && !(newuserID.equals(userID))) {
                                        MessagesService messagesService = MessagesService.getInstance(UIUtils.getContext());
                                        ChatListService chatListService = ChatListService.getInstance(UIUtils.getContext());
                                        TopContactsService topContactsService = TopContactsService.getInstance(UIUtils.getContext());
                                        SystemMsgService systemMsgService = SystemMsgService.getInstance(UIUtils.getContext());
                                        topContactsService.deleteAllData();
                                        messagesService.deleteAllData();
                                        chatListService.deleteAllData();
//                                        System.out.println("删除本地缓存成功");
                                    }

                                    LocalPhoneService localPhoneService=LocalPhoneService.getInstance(UIUtils.getContext());
                                    localPhoneService.deleteAllData();

                                    //保存登录信息
                                    SPUtils.save("login_info", loginJson);
                                    setResult(new JSONObject(loginJson), PluginResult.Status.OK, callbackContext);
                                } else if ("104".equals(result.getResultCode())) {
                                    setResult("账户名或密码错误！", PluginResult.Status.ERROR, callbackContext);
                                } else if ("105".equals(result.getResultCode())) {
                                    setResult("该用户已在其他手机终端登录！", PluginResult.Status.ERROR, callbackContext);
                                } else {
                                    setResult("登录失败！", PluginResult.Status.ERROR, callbackContext);
                                }
                            }
                        } catch (TException e) {
                            setResult("网络超时！", PluginResult.Status.ERROR, callbackContext);
                            e.printStackTrace();
                        } catch (JSONException e) {
                            setResult("JSON数据解析出错！", PluginResult.Status.ERROR, callbackContext);
                            e.printStackTrace();
                        }
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络超时！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络超时！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    public void activeUser(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String userId = args.getString(0);
            String imCode = UIUtils.getDeviceId();
            SystemApi.activeUser(userId, imCode, new AsyncMethodCallback<IMSystem.AsyncClient.ActivateUser_call>() {
                @Override
                public void onComplete(IMSystem.AsyncClient.ActivateUser_call activateUser_call) {
                    try {
                        RST result = activateUser_call.getResult();

                        if (result == null) {
                            setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            if (result.result) {
                                setResult("success", PluginResult.Status.OK, callbackContext);
                            } else {
                                setResult("激活失败！", PluginResult.Status.OK, callbackContext);
                            }
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    public void getDatetime(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String userId = args.getString(0);
            SystemApi.getDatetime(userId, new AsyncMethodCallback<IMSystem.AsyncClient.GetDatetime_call>() {
                @Override
                public void onComplete(IMSystem.AsyncClient.GetDatetime_call getDatetime_call) {
                    try {
                        RSTsysTime result = getDatetime_call.getResult();
                        if (result == null) {
                            setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            String json = GsonUtils.toJson(result, RSTsysTime.class);
                            if ("100".equals(result.getResultCode())) {
                                try {
                                    setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            } else {
                                setResult(result.getResultMsg(), PluginResult.Status.ERROR, callbackContext);
                            }
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    public void seachUsers(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String userId = args.getString(0);
            String searchText = args.getString(1);
            int pageNum = args.getInt(2);
            int pageCount = args.getInt(3);
            SystemApi.seachUsers(userId, searchText, pageNum, pageCount, new AsyncMethodCallback<IMSystem.AsyncClient.UserSearch_call>() {
                @Override
                public void onComplete(IMSystem.AsyncClient.UserSearch_call userSearch_call) {
                    try {
                        RSTsearch result = userSearch_call.getResult();
                        if (result == null) {
                            setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            String json = GsonUtils.toJson(result, RSTsearch.class);
                            if (result.result) {
                                try {
                                    setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            } else {
                                setResult(result.getResultMsg(), PluginResult.Status.ERROR, callbackContext);
                            }
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 解绑用户（让用户可以用其他设备登录账户）
     * @param args
     * @param callbackContext
     */
    public void cancelUser(final JSONArray args, final CallbackContext callbackContext) {
        try {
            SystemApi.cancelUser(getUserID(), UIUtils.getDeviceId(), new AsyncMethodCallback<IMSystem.AsyncClient.CancelUser_call>() {
                @Override
                public void onComplete(IMSystem.AsyncClient.CancelUser_call cancelUser_call) {
                    try {
                        RST result = cancelUser_call.getResult();
                        if (result == null) {
                            setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            String json = GsonUtils.toJson(result, RST.class);
                            if (result.result) {
                                try {
                                    setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            } else {
                                setResult(result.getResultMsg(), PluginResult.Status.ERROR, callbackContext);
                            }
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    ///////部门接口

    /**
     * 获取部门和人员
     * @param args
     * @param callbackContext
     */
    public void getChild(final JSONArray args, final CallbackContext callbackContext) {
        try {
            //String ID = args.getString(0);
            String deptID = args.getString(0);
            int pageNum = args.getInt(1);
            int pageCount = args.getInt(2);
            SystemApi.getChild(getUserID(), deptID, pageNum, pageCount, new AsyncMethodCallback<IMDepartment.AsyncClient.GetChild_call>() {
                @Override
                public void onComplete(IMDepartment.AsyncClient.GetChild_call getChild_call) {
                    try {
                        RSTgetChild result = getChild_call.getResult();
                        if (result == null) {
                            setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            String json = GsonUtils.toJson(result, RSTgetChild.class);
                            if (result.result) {
                                try {
                                    setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            } else {
                                setResult(result.getResultMsg(), PluginResult.Status.ERROR, callbackContext);
                            }
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取部门
     * @param args
     * @param callbackContext
     */
    public void getDeparment(final JSONArray args, final CallbackContext callbackContext){
        try {
            //String ID = args.getString(0);
            String deptID = args.getString(0);

            SystemApi.getDeparment(getUserID(), deptID, new AsyncMethodCallback<IMDepartment.AsyncClient.GetDeparment_call>() {
                @Override
                public void onComplete(IMDepartment.AsyncClient.GetDeparment_call getDeparment_call) {
                    try {
                        RSTgetDept result = getDeparment_call.getResult();
                        if (result == null) {
                            setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            String json = GsonUtils.toJson(result, RSTgetDept.class);
                            if (result.result) {
                                try {
                                    setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            } else {
                                setResult(result.getResultMsg(), PluginResult.Status.ERROR, callbackContext);
                            }
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取用户一级部门
     * @param args
     * @param callbackContext
     */
    public void getUserRoot(final JSONArray args, final CallbackContext callbackContext){
        try {
            //String ID = args.getString(0);
            SystemApi.getUserRoot(getUserID(), new AsyncMethodCallback<IMDepartment.AsyncClient.GetUserRoot_call>() {
                @Override
                public void onComplete(IMDepartment.AsyncClient.GetUserRoot_call getUserRoot_call) {
                    try {
                        RSTgetRoot result = getUserRoot_call.getResult();
                        if (result == null) {
                            setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            String json = GsonUtils.toJson(result, RSTgetRoot.class);
                            if (result.result) {
                                try {
                                    setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            } else {
                                setResult(result.getResultMsg(), PluginResult.Status.ERROR, callbackContext);
                            }
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    //****************用户接口****************//

    /**
     * 获取用户详细信息接口
     * @param args
     * @param callbackContext
     */
    public void getUser(final JSONArray args, final CallbackContext callbackContext){
        try {
            String userID = args.getString(0);
            SystemApi.getUser(getUserID(), userID, new AsyncMethodCallback<IMUser.AsyncClient.GetUser_call>() {
                @Override
                public void onComplete(IMUser.AsyncClient.GetUser_call getUser_call) {
                    try {
                        RSTgetUser result = getUser_call.getResult();
                        if (result == null) {
                            setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            String json = GsonUtils.toJson(result, RSTgetUser.class);
                            if (result.result) {
                                try {
                                    setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            } else {
                                setResult(result.getResultMsg(), PluginResult.Status.ERROR, callbackContext);
                            }
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     *
     * @param args
     * @param callbackContext
     */
    public void checkLocalUser(final JSONArray args, final CallbackContext callbackContext){
        try {
            JSONArray obj = args.getJSONArray(0);
            Map<String, String> userMB = jsonArray2Map(obj);
            SystemApi.checkLocalUser(getUserID(), userMB, new AsyncMethodCallback<IMUser.AsyncClient.CheckLocalUser_call>() {
                @Override
                public void onComplete(IMUser.AsyncClient.CheckLocalUser_call checkLocalUser_call) {
                    try {
                        RSTCheckUser result = checkLocalUser_call.getResult();
                        if (result != null) {
                            if (result.result) {
                                List<UserCheck> userList = result.getUser();
                                if (userList != null) {
                                    String json = GsonUtils.toJson(userList, new TypeToken<List<UserCheck>>() {
                                    }.getType());
                                    setResult(new JSONArray(json), PluginResult.Status.OK, callbackContext);
                                } else {
                                    setResult("获取数据为空！", PluginResult.Status.ERROR, callbackContext);
                                }
                            } else if ("531".equals(result.getResultCode())) {
                                setResult("所查人员不存在！", PluginResult.Status.ERROR, callbackContext);
                            }
                        } else {
                            setResult("获取数据失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    } catch (JSONException e) {
                        setResult("JSON数据解析异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (JSONException e) {
            setResult("JSON数据解析异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 修改用户密码接口
     * @param args
     * @param callbackContext
     */
    public void updatePwd(final JSONArray args, final CallbackContext callbackContext){
        try {
            String ID = getUserID();
            String orgPWD = args.getString(0);;
            String newPWD = args.getString(1);
            String confirmPWD = args.getString(2);
            SystemApi.updatePwd(ID, orgPWD, newPWD, confirmPWD, new AsyncMethodCallback<IMUser.AsyncClient.UserPwdUpdate_call>() {
                @Override
                public void onComplete(IMUser.AsyncClient.UserPwdUpdate_call userPwdUpdate_call) {
                    try {
                        RST result = userPwdUpdate_call.getResult();
                        if (result == null) {
                            setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            String json = GsonUtils.toJson(result, RST.class);
                            if (result.result) {
                                try {
                                    setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            } else {
                                if ("521".equals(result.getResultCode())) {
                                    setResult("密码修改失败", PluginResult.Status.ERROR, callbackContext);
                                } else if ("522".equals(result.getResultCode())) {
                                    setResult("密码修改失败", PluginResult.Status.ERROR, callbackContext);
                                } else if ("523".equals(result.getResultCode())) {
                                    setResult("原密码验证错误", PluginResult.Status.ERROR, callbackContext);
                                } else if ("524".equals(result.getResultCode())) {
                                    setResult("原密码与新密码相同", PluginResult.Status.ERROR, callbackContext);
                                } else if ("525".equals(result.getResultCode())) {
                                    setResult("密码不符合规范", PluginResult.Status.ERROR, callbackContext);
                                } else if ("526".equals(result.getResultCode())) {
                                    setResult("确认密码和新密码不一致", PluginResult.Status.ERROR, callbackContext);
                                } else if ("997".equals(result.getResultCode())) {
                                    setResult("操作过程发生异常", PluginResult.Status.ERROR, callbackContext);
                                } else if ("998".equals(result.getResultCode())) {
                                    setResult("调用接口的参数格式错误", PluginResult.Status.ERROR, callbackContext);
                                } else if ("999".equals(result.getResultCode())) {
                                    setResult("调用接口的用户不存在或未激活", PluginResult.Status.ERROR, callbackContext);
                                } else if ("1000".equals(result.getResultCode())) {
                                    setResult("服务器异常", PluginResult.Status.ERROR, callbackContext);
                                } else {
                                    setResult("未知原因失败！", PluginResult.Status.ERROR, callbackContext);
                                }
                            }
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 修改用户信息的接口
     * @param args
     * @param callbackContext
     */
    public void updateUserInfo(final JSONArray args, final CallbackContext callbackContext){
        try {
            String ID = getUserID();
            JSONObject obj = args.getJSONObject(0);
            Map<String, String> updateInfo = jsonobj2Map(obj);
            SystemApi.updateUserInfo(ID, updateInfo, new AsyncMethodCallback<IMUser.AsyncClient.UserUpdate_call>() {
                @Override
                public void onComplete(IMUser.AsyncClient.UserUpdate_call userUpdate_call) {
                    try {
                        RST result = userUpdate_call.getResult();
                        if (result == null) {
                            setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            String json = GsonUtils.toJson(result, RST.class);
                            if (result.result) {
                                try {
                                    setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            } else {
                                if ("501".equals(result.getResultCode())) {
                                    setResult("没有传入任何修改项参数或参数格式不对", PluginResult.Status.ERROR, callbackContext);
                                } else if ("502".equals(result.getResultCode())) {
                                    setResult("修改后的内容不能为空", PluginResult.Status.ERROR, callbackContext);
                                } else if ("997".equals(result.getResultCode())) {
                                    setResult("操作过程发生异常", PluginResult.Status.ERROR, callbackContext);
                                } else if ("998".equals(result.getResultCode())) {
                                    setResult("调用接口的参数格式错误", PluginResult.Status.ERROR, callbackContext);
                                } else if ("999".equals(result.getResultCode())) {
                                    setResult("调用接口的用户不存在或未激活", PluginResult.Status.ERROR, callbackContext);
                                } else if ("1000".equals(result.getResultCode())) {
                                    setResult("服务器异常", PluginResult.Status.ERROR, callbackContext);
                                } else {
                                    setResult("未知原因失败！", PluginResult.Status.ERROR, callbackContext);
                                }
                            }
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取头像
     * @param args
     * @param callbackContext
     */
    public void getHeadPic(final JSONArray args, final CallbackContext callbackContext){
        try {
            String picUserID = args.getString(0);//查询的是谁的图片
            String picSize = args.getString(1);//图片尺寸，40*40，60*60，120*120
            SystemApi.getHeadPic(getUserID(), picUserID, picSize, new GetHeadPicCallback(callbackContext));
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 上传头像
     * @param args
     * @param callbackContext
     */
    public void setHeadPic(final JSONArray args, final CallbackContext callbackContext){
        try {
            String filePath = args.getString(0);//FileUtils.getIconDir() + File.separator + "head" + File.separator + "149435120.jpg";
            if (filePath.contains("file:///")) {
                filePath = filePath.substring(7);
            }
            File file=new File(filePath);
            boolean exists = file.exists();
            if (!exists) {
                setResult("该文件不存在！", PluginResult.Status.ERROR, callbackContext);
                return;
            }
            FileInputStream fis = new FileInputStream(file);
            File fosDir = new File(FileUtils.getIconDir() + File.separator + "headpic");
            String path =FileUtils.getIconDir() + File.separator + "headpic";
            if (!fosDir.exists()) {
                fosDir.mkdirs();
            }
            String[] listarr = fosDir.list();
            if(listarr.length>0||listarr!=null){
                for (int i = 0; i < listarr.length; i++) {
                    File temp = new File(path + File.separator + listarr[i]);
                    temp.delete();
                }
            }

            final File fosFile = new File(fosDir + File.separator + UUID.randomUUID().toString() + ".jpg");
            if (fosFile.exists()) {
                fosFile.delete();
            }
            fosFile.createNewFile();
            FileOutputStream fos = new FileOutputStream(fosFile);
            byte[] bys = new byte[1024*10];
            int len = 0;
            while ((len = fis.read(bys)) != -1) {
                fos.write(bys, 0, len);
                fos.flush();
            }

            SystemApi.setHeadPic(getUserID(), filePath, new AsyncMethodCallback<IMFile.AsyncClient.SetHeadPic_call>() {
                @Override
                public void onComplete(IMFile.AsyncClient.SetHeadPic_call setHeadPic_call) {
                    try {
                        RST result = setHeadPic_call.getResult();
                        if (result != null && result.result) {
                            String absolutePath = fosFile.getAbsolutePath();
                            if (absolutePath.contains("file:///")) {
                                absolutePath = absolutePath.substring(7);
                            }
                            setResult(absolutePath, PluginResult.Status.OK, callbackContext);
                        } else {
                            setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取版本信息
     * @param args
     * @param callbackContext
     */
    public void getVersionInfo(final JSONArray args, final CallbackContext callbackContext){

        try {
            SystemApi.getVersionInfo(getUserID(), new AsyncMethodCallback<IMFile.AsyncClient.GetVersionInfo_call>() {
                @Override
                public void onComplete(IMFile.AsyncClient.GetVersionInfo_call getVersionInfo_call) {
                    try {
                        RSTversionInfo result = getVersionInfo_call.getResult();
                        if (result != null && result.result) {
                            String info = result.getInfo();
                            setResult(new JSONObject(info), PluginResult.Status.OK, callbackContext);
                        } else {
                            setResult("网络异常！", PluginResult.Status.OK, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    } catch (JSONException e) {
                        setResult("JSON数据解析异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 下载APK（新版本）
     * @param args
     * @param callbackContext
     */
    public void getVersion(final JSONArray args, final CallbackContext callbackContext){
        String savePath = null;
        try {
            savePath = args.getString(0);
            String versionCode = args.getString(1);
            String filesize=args.getString(2);
            savePath = FileUtils.getDownloadDir() + File.separator + "apk";
            String userID = getUserID();
            boolean success = SystemApi.getVersion(savePath, getUserID(), versionCode, cordova.getActivity(), filesize);
            String exePath = savePath + File.separator + "1000"/*apkVersion*/ + ".apk";
            setResult(success ? exePath : "更新失败！", success ? PluginResult.Status.OK : PluginResult.Status.ERROR, callbackContext);
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            ProgressDialogFactory.cancel();
            setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            ProgressDialogFactory.cancel();
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 应用安装
     * @param args
     * @param callbackContext
     */
    public void installApk(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String targetPath = args.getString(0);
            if (targetPath != null) {
                UIUtils.installApk(targetPath);
                setResult("true", PluginResult.Status.OK, callbackContext);
            } else {
                setResult("安装路径无效！", PluginResult.Status.ERROR, callbackContext);
            }
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 是否需要更新
     * @param args
     * @param callbackContext
     */
    public void needUpgrade(final JSONArray args, final CallbackContext callbackContext){

        try {
            String newVersion = args.getString(0);
            //第一次就是本地的versionname
            String install_cancel = SPUtils.getString("local_versionname", "");

            //第一次进来的时候肯定进不来这边
            if (install_cancel.equals(newVersion)) {
                setResult("false", PluginResult.Status.OK, callbackContext);
                return;
            }

            boolean needsUpgrade = isNeedsUpgrade(UIUtils.getVersion(), newVersion);


            if(needsUpgrade){
                //第一次肯定进不来这边
                setResult("true", PluginResult.Status.OK, callbackContext);
            }else {
                //保存服务器的版本号到sp中
                SPUtils.save("local_versionname",newVersion);

                setResult("已是最新版本，无需更新！", PluginResult.Status.OK, callbackContext);
            }


        } catch (JSONException e) {
            setResult("数据解析异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 添加关注(列表)
     * @param args
     * @param callbackContext
     */
    public void addAttention(final JSONArray args, final CallbackContext callbackContext){
        try {
            JSONArray membersArr = args.getJSONArray(0);
            List<String> members = jsonArray2List(membersArr);

            SystemApi.addAttention(getUserID(), members, new AsyncMethodCallback<IMAttention.AsyncClient.AddAttention_call>() {
                @Override
                public void onComplete(IMAttention.AsyncClient.AddAttention_call addAttention_call) {
                    try {
                        RST result = addAttention_call.getResult();
                        if (result == null) {
                            setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            if (result.result) {
                                setResult("success", PluginResult.Status.OK, callbackContext);
                            } else {
                                setResult("添加失败！", PluginResult.Status.ERROR, callbackContext);
                            }
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 取消关注（列表）
     * @param args
     * @param callbackContext
     */
    public void removeAttention(final JSONArray args, final CallbackContext callbackContext){
        JSONArray membersArr = null;
        try {
            membersArr = args.getJSONArray(0);
            List<String> members = jsonArray2List(membersArr);
            SystemApi.removeAttention(getUserID(), members, new AsyncMethodCallback<IMAttention.AsyncClient.RemoveAttention_call>() {
                @Override
                public void onComplete(IMAttention.AsyncClient.RemoveAttention_call removeAttention_call) {
                    try {
                        RST result = removeAttention_call.getResult();
                        if (result == null) {
                            setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            if (result.result) {
                                setResult("success", PluginResult.Status.OK, callbackContext);
                            } else {
                                setResult("删除失败！", PluginResult.Status.ERROR, callbackContext);
                            }
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取关注列表
     * @param args
     * @param callbackContext
     */
    public void getAttention(final JSONArray args, final CallbackContext callbackContext){
        try {
            SystemApi.getAttention(getUserID(), new AsyncMethodCallback<IMAttention.AsyncClient.GetAttention_call>() {
                @Override
                public void onComplete(IMAttention.AsyncClient.GetAttention_call getAttention_call) {
                    try {
                        RSTgetAttention result = getAttention_call.getResult();
                        if (result != null && result.result) {
                            List<User> attentions = result.getAttentions();
                            String jsonStr = GsonUtils.toJson(attentions, new TypeToken<List<User>>() {
                            }.getType());
                            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
                        } else {
                            setResult("获取失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    } catch (JSONException e) {
                        setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取历史消息
     * @param args
     * @param callbackContext
     */
    public void getHistoryMsg(final JSONArray args, final CallbackContext callbackContext){
        try {
            String sessionType = args.getString(0);//会话类型(U:个人，D：部门，G：群组)
            String sessionID = args.getString(1);//会话ID(U:对方ID，D&G:部门&群组ID)
            final int pageNum = args.getInt(2);//搜索的页数(0时为末页)
            int pageCount = args.getInt(3);//每页的数目(0时为10)
            SystemApi.getHistoryMsg(getUserID(), sessionType, sessionID, pageNum, pageCount, new AsyncMethodCallback<IMMessage.AsyncClient.GetHistoryMsg_call>() {
                @Override
                public void onComplete(IMMessage.AsyncClient.GetHistoryMsg_call getHistoryMsg_call) {
                    try {
                        RSTgetMsg result = getHistoryMsg_call.getResult();
                        if (result != null && result.result) {
                            List<Msg> attentions = result.getMsglist();
                            Date date = new Date(attentions.get(pageNum).getMsgDate());
                            String jsonStr = GsonUtils.toJson(attentions, new TypeToken<List<Msg>>() {
                            }.getType());
                            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
                        } else {
                            setResult("获取失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    } catch (JSONException e) {
                        setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }




    /**
     * 将登录成功以后，订阅群组topic之前的历史消息入库并展示在界面上
     */
    public static void getLatestMsg(final String groupID, long when,final String groupName){
        try {
            SystemApi.getLatestMsg(getUserID(), "G", groupID, when, 0, new AsyncMethodCallback<IMMessage.AsyncClient.GetLatestMsg_call>() {
                @Override
                public void onComplete(IMMessage.AsyncClient.GetLatestMsg_call getLatestMsg_call) {
                    if (getLatestMsg_call != null) {
                        try {
                            RSTgetMsg result = getLatestMsg_call.getResult();
                            if (result == null) {
//                                setResult("获取新建群历史消息失败！", PluginResult.Status.ERROR, callbackContext);
                            } else {
                                if (result.result) {
                                    MessagesService messagesService = MessagesService.getInstance(UIUtils.getContext());
                                    List<Msg> messagesList = result.getMsglist();
                                    ToastUtil.showSafeToast("取出最新的消息条数"+messagesList.size());
                                    for (int i = 0; i < messagesList.size(); i++) {
                                        Msg msg = messagesList.get(i);
                                        Messages messages = new Messages();
                                        String id = UUID.randomUUID().toString();
                                        messages.set_id(id);
                                        messages.setSessionid(result.getSessionID());
                                        messages.setIstime("false");
                                        messages.setDaytype("1");
                                        String message = msg.getMsg();
                                        if ("File".equals(getMediaTypeStr(msg.getMsgType()))) {
                                            message = message.substring(0, message.lastIndexOf("###")) + "###0";
                                        }
                                        messages.setMessage(message);
                                        messages.setFrom("false");
                                        messages.setImgSrc("");
                                        messages.setIsDelete("false");
                                        messages.setIsFailure("false");
                                        messages.setIsread("0");
                                        messages.setIsSuccess("true");
                                        messages.setMessagetype(getMediaTypeStr(msg.getMsgType()));
                                        messages.setPlatform("Windows");
                                        messages.setSenderid(msg.getFromID());
                                        messages.setType("Group");
                                        messages.setUsername(msg.getFromName());
                                        messages.setWhen(msg.getMsgDate());
                                        messagesService.saveObj(messages);

                                        MessageBean messageBean = new MessageBean();
                                        messageBean.set_id(id);
                                        messageBean.setSessionid(result.getSessionID());
                                        messageBean.setIstime("false");
                                        messageBean.setDaytype("1");
                                        messageBean.setMessage(message);
                                        messageBean.setFrom("false");
                                        messageBean.setImgSrc("");
                                        messageBean.setIsDelete("false");
                                        messageBean.setIsFailure("false");
                                        messageBean.setIsread("0");
                                        messageBean.setIsSuccess("true");
                                        messageBean.setMessagetype(getMediaTypeStr(msg.getMsgType()));

                                        messageBean.setPlatform("Windows");
                                        messageBean.setSenderid(msg.getFromID());
                                        messageBean.setType("Group");
                                        messageBean.setUsername(msg.getFromName());
                                        messageBean.setWhen(msg.getMsgDate());
                                        sendArriveMsgToFront(result.getSessionID(), messageBean);
                                    }
//                                    //离线新建群，获取最新群名
//                                    GroupChatsService groupChatsService=GroupChatsService.getInstance(UIUtils.getContext());
//                                    List<GroupChats> groupChatsList=groupChatsService.queryData("where id =?", groupID);
//                                    String groupName=groupChatsList.get(0).getGroupName();
//                                    ToastUtil.showSafeToast("最新群名"+groupName);
                                    //统计未读数量
                                    int count=0;
                                   List<Messages> messagesList1 = messagesService.queryData("where sessionid =?", result.getSessionID());
                                    for (int i = 0; i < messagesList.size(); i++) {
                                        Messages messages = messagesList1.get(i);
                                        if ("0".equals(messages.getIsread())) {
                                            count++;
                                        }
                                    }

                                    //取出消息表的最后一条数据保存在chat表里面
                                    List<Messages> messagesLists = messagesService.queryData("where sessionid =?", result.getSessionID());
                                    Messages lastmessages = messagesLists.get(messagesLists.size() - 1);
                                    //将对话最后一条入库到chat表
                                    /**s
                                     * 1.先从数据库查询是否存在当前会话列表
                                     * 2.如果没有该会话，创建会话
                                     * 3.如果有该会话，则保存最后一条消息到chat表
                                     */
                                    ChatListService chatListService = ChatListService.getInstance(UIUtils.getContext());
                                    List<ChatList> chatLists = chatListService.queryData("where id =?", lastmessages.getSessionid());
                                    ChatList chatList = new ChatList();
                                    chatList.setImgSrc(lastmessages.getImgSrc());//从数据库里取最后一条消息的头像
//                                    System.out.println("消息类型" + lastmessages.getMessagetype());
                                    if (lastmessages.getMessagetype() == "Image") {
                                        // alert("返回即时通");
                                        chatList.setLastText("[图片]");//从数据库里取最后一条消息
                                    } else if (lastmessages.getMessagetype() == "LOCATION") {
                                        chatList.setLastText("[位置]");//从数据库里取最后一条消息
                                        System.out.println("消息类型weizhi");
                                    } else if (lastmessages.getMessagetype() == "File") {
                                        chatList.setLastText("[文件]");//从数据库里取最后一条消息
                                    }else if(lastmessages.getMessagetype() == "Audio"){
                                        chatList.setLastText("[语音]");//从数据库里取最后一条消息
                                    } else {
                                        chatList.setLastText(lastmessages.getMessage());//从数据库里取最后一条消息
                                    }
                                    chatList.setCount(count + "");//将统计的count未读数量存进去
//                                    ToastUtil.showSafeToast("未读数"+count);
                                    chatList.setLastDate(lastmessages.getWhen());//从数据库里取最后一条消息对应的时间
                                    chatList.setSenderId(lastmessages.getSenderid());//从数据库里取最后一条消息对应发送者id
                                    chatList.setSenderName(lastmessages.getUsername());//从数据库里取最后一条消息发送者名字
                                    if (chatLists.size() > 0) {
                                        chatList.setId(chatLists.get(0).getId());
                                        if (lastmessages.getType() == "Group") {
                                            GroupChatsService groupChatsSer = GroupChatsService.getInstance(UIUtils.getContext());
                                            List<GroupChats> groupChatsLists = groupChatsSer.queryData("where id =?", lastmessages.getSessionid());
                                            chatList.setChatName(groupName);
                                        }
                                        chatList.setIsDelete(chatLists.get(0).getIsDelete());
                                        chatList.setChatType(chatLists.get(0).getChatType());
                                        chatList.setDaytype(chatLists.get(0).getDaytype());
                                        chatList.setIsSuccess(chatLists.get(0).getIsSuccess());
                                    } else {
                                        chatList.setId(lastmessages.getSessionid());
                                        if (lastmessages.getType() == "Group" ) {
                                            GroupChatsService groupChatsSer = GroupChatsService.getInstance(UIUtils.getContext());
                                            List<GroupChats> groupChatsLists = groupChatsSer.queryData("where id =?", lastmessages.getSessionid());
                                            try {
                                                JSONObject userInfo = getUserInfo();
                                            } catch (JSONException e) {
                                                e.printStackTrace();
                                            }
                                            chatList.setChatName(groupName);
                                        }
                                        chatList.setIsDelete(lastmessages.getIsDelete());
                                        chatList.setChatType(lastmessages.getType());
                                        chatList.setDaytype(lastmessages.getDaytype());
                                        chatList.setIsSuccess(lastmessages.getIsSuccess());
                                    }
                                    chatListService.saveObj(chatList);//保存chatlist对象
                                }
                            }
                        } catch (TException e) {
                            e.printStackTrace();
                        }
                    } else {
//                        setResult("获取新建群历史消息失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onError(Exception e) {
//                    setResult("获取新建群历史消息失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        }catch (TException e) {
//            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
//            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取消息媒体类型
     * @param type
     * @return
     */
    private static String getMediaTypeStr(String type) {
        String mediaType = "Audio";
        if ("A".equals(type)) {
            mediaType = "Audio";
        } else if ("E".equals(type)) {
            mediaType = "Emote";
        } else if ("F".equals(type)) {
            mediaType = "File";
        } else if ("I".equals(type)) {
            mediaType = "Image";
        } else if ("S".equals(type)) {
            mediaType = "Shake";
        } else if ("T".equals(type)) {
            mediaType = "Text";
        } else if ("V".equals(type)) {
            mediaType = "Vedio";
        } else if ("P".equals(type)) {
            mediaType = "LOCATION";
        } else {
            mediaType = "Text";
        }
        return mediaType;
    }

    /**
     * 将消息封装发给前端
     * @param topic
     * @param content
     */
    private static void sendArriveMsgToFront(final String topic, final MessageBean content) {
        UIUtils.runInMainThread(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent();
                intent.setAction(ReceiverParams.MESSAGEARRIVED);
                intent.putExtra("topic", topic);
                String json = GsonUtils.toJson(content, MessageBean.class);
                intent.putExtra("content", json);
                intent.putExtra("qos", 1);
                UIUtils.getContext().sendBroadcast(intent);
            }
        });
    }




    /**
   * 确认消息回复
   * @param args
   * @param callbackContext
     */
    public void readMessage(final JSONArray args, final CallbackContext callbackContext){
      try {
        String sessionType = args.getString(0);//会话类型(U:个人，D：部门，G：群组)
        String sessionID = args.getString(1);//会话ID(U:对方ID，D&G:部门&群组ID)
        final long sendWhen = args.getLong(2);//消息发送时间when
        SystemApi.readMessage(getUserID(), getType(sessionType), sessionID, sendWhen, new AsyncMethodCallback<IMMessage.AsyncClient.ReadMessage_call>() {
            @Override
            public void onComplete(IMMessage.AsyncClient.ReadMessage_call getHistoryMsg_call) {
                try {
                    RSTreadMsg result = getHistoryMsg_call.getResult();
                    if (result != null && result.result) {
                        String json = GsonUtils.toJson(result, RSTreadMsg.class);
                        setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                    } else {
                        setResult("获取失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                } catch (TException e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                    e.printStackTrace();
                } catch (JSONException e) {
                    setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
                    e.printStackTrace();
                }
            }

            @Override
            public void onError(Exception e) {
                setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
            }
        });
      } catch (JSONException e) {
        setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
        e.printStackTrace();
      } catch (TException e) {
        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
        e.printStackTrace();
      } catch (IOException e) {
        setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
        e.printStackTrace();
      }
    }

    /**
     * 获取历史消息数
     * @param args
     * @param callbackContext
     */
    public void getMsgCount(final JSONArray args, final CallbackContext callbackContext){
        try {
            String sessionType = args.getString(0);//会话类型(U:个人，D：部门，G：群组)
            String sessionID = args.getString(1);//会话ID(U:对方ID，D&G:部门&群组ID)
            SystemApi.getMsgCount(getUserID(), sessionType, sessionID, new AsyncMethodCallback<IMMessage.AsyncClient.GetMsgCount_call>() {
                @Override
                public void onComplete(IMMessage.AsyncClient.GetMsgCount_call getMsgCount_call) {
                    try {
                        RSTgetMsgCount result = getMsgCount_call.getResult();
                        if (result != null && result.result) {
                            long msgCount = result.getMsgCount();
                            setResult(msgCount, PluginResult.Status.OK, callbackContext);
                        } else {
                            setResult("获取失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 创建群组
     * @param args
     * @param callbackContext
     */
    public void addGroup(final JSONArray args, final CallbackContext callbackContext){
        try {
            String groupName = args.getString(0);
            JSONArray deptsArr = args.getJSONArray(1);
            JSONArray membersArr = args.getJSONArray(2);
            List<String> depts = jsonArray2List(deptsArr);
            List<String> members = jsonArray2List(membersArr);
            SystemApi.addGroup(getUserID(), groupName, depts, members, new AsyncMethodCallback<IMGroup.AsyncClient.AddGroup_call>() {
                @Override
                public void onComplete(IMGroup.AsyncClient.AddGroup_call addGroup_call) {
                    try {
                        RSTaddGroup result = addGroup_call.getResult();

                        if (result != null && result.result) {
                            String groupID = result.getGroupID();
                            if (groupID != null && !"".equals(groupID.trim())) {
                                MqttTopicRW.append("LN/G/" + groupID, 1);
                            }
                            setResult(groupID, PluginResult.Status.OK, callbackContext);
                        } else if (result != null && "711".equals(result.getResultCode())) {
                            setResult("创建的群组必须大于2人（包括自己）！", PluginResult.Status.ERROR, callbackContext);
                        } else if (result != null && "712".equals(result.getResultCode())) {
                            setResult("创建的群组超过了20人！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            setResult("创建群组失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取群组（列表）信息
     * @param args
     * @param callbackContext
     */
    public void getGroup(final JSONArray args, final CallbackContext callbackContext){
        try {
            JSONArray groupIdsArr = args.getJSONArray(0);
            SystemApi.getGroup(getUserID(), jsonArray2List(groupIdsArr), new AsyncMethodCallback<IMGroup.AsyncClient.GetGroup_call>() {
                @Override
                public void onComplete(IMGroup.AsyncClient.GetGroup_call getGroup_call) {
                    try {
                        RSTgetGroup result = getGroup_call.getResult();
                        if (result != null && result.result) {
                            List<Group> groups = result.getGroupList();
                            if (groups != null) {
                                String json = GsonUtils.toJson(groups, new TypeToken<List<Group>>() {
                                }.getType());
                                setResult(new JSONArray(json), PluginResult.Status.OK, callbackContext);
                            } else {
                                setResult("数据群组失败！", PluginResult.Status.ERROR, callbackContext);
                            }
                        } else if (result != null && "721".equals(result.getResultCode())) {
                            setResult("指定的群组不存在！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            setResult("创建群组失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 修改群信息
     * @param args
     * @param callbackContext
     */
    public void modifyGroup(final JSONArray args, final CallbackContext callbackContext){
        try {
            String groupType = args.getString(0);
            String groupID = args.getString(1);
            String groupName = args.getString(2);
            groupName = ("null".equals(groupName) ? null : groupName);
            String groupText = args.getString(3);
            groupText = ("null".equals(groupText) ? null : groupText);
            SystemApi.modifyGroup(getUserID(), getType(groupType), groupID, groupName, groupText, new AsyncMethodCallback<IMGroup.AsyncClient.ModifyGroup_call>() {
                @Override
                public void onComplete(IMGroup.AsyncClient.ModifyGroup_call modifyGroup_call) {
                    try {
                        RSTChangeGroup result = modifyGroup_call.getResult();
                        if (result != null && result.result) {
                            String groupIDN = result.getGroupID();
                            setResult(groupIDN, PluginResult.Status.OK, callbackContext);
                        } else if (result != null && "731".equals(result.getResultCode())) {
                            setResult("无修改群权限！", PluginResult.Status.ERROR, callbackContext);
                        } else if (result != null && "732".equals(result.getResultCode())) {
                            setResult("群名称不能为空！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            setResult("修改群组失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 解散群组
     * @param args
     * @param callbackContext
     */
    public void removeGroup(final JSONArray args, final CallbackContext callbackContext){
        String groupID = null;
        try {
            groupID = args.getString(0);
            SystemApi.removeGroup(getUserID(), groupID, new AsyncMethodCallback<IMGroup.AsyncClient.RemoveGroup_call>() {
                @Override
                public void onComplete(IMGroup.AsyncClient.RemoveGroup_call removeGroup_call) {
                    try {
                        RSTChangeGroup result = removeGroup_call.getResult();
                        if (result != null && result.result) {
                            String groupIDN = result.getGroupID();
                            setResult(groupIDN, PluginResult.Status.OK, callbackContext);
                        } else if (result != null && "741".equals(result.getResultCode())) {
                            setResult("无解散群组权限！", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            setResult("解散群组失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取群组指定信息
     * @param args
     * @param callbackContext
     */
    public void getGroupUpdate(final JSONArray args, final CallbackContext callbackContext){
        try {
            String groupType = args.getString(0);
            JSONArray objects = args.getJSONArray(2);
            String groupID = args.getString(1);
            //getObjects：查询的项目代码列表（参考下表）
            SystemApi.getGroupUpdate(getUserID(), getType(groupType), groupID, jsonArray2List(objects), new AsyncMethodCallback<IMGroup.AsyncClient.GetGroupUpdate_call>() {
                @Override
                public void onComplete(IMGroup.AsyncClient.GetGroupUpdate_call getGroupUpdate_call) {
                    try {
                        RSTgetGroupUpdate result = getGroupUpdate_call.getResult();
                        if (result != null && result.result) {
                            String json = GsonUtils.toJson(result, new TypeToken<RSTgetGroupUpdate>() {
                            }.getType());
                            setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                        } else {
                            setResult("群已经被解散", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 群组添加人员（列表）
     * @param args
     * @param callbackContext
     */
    public void groupAddMember(final JSONArray args, final CallbackContext callbackContext){
        try {
            String groupID = args.getString(0);
            JSONArray deptsArr = args.getJSONArray(1);
            JSONArray membersArr = args.getJSONArray(2);
            SystemApi.groupAddMember(getUserID(), groupID, jsonArray2List(deptsArr), jsonArray2List(membersArr), new AsyncMethodCallback<IMGroup.AsyncClient.GroupAddMember_call>() {
                @Override
                public void onComplete(IMGroup.AsyncClient.GroupAddMember_call groupAddMember_call) {
                    try {
                        RSTChangeGroup result = groupAddMember_call.getResult();
                        if (result != null && result.result) {
                            String groupIDN = result.getGroupID();
                            setResult(groupIDN, PluginResult.Status.OK, callbackContext);
                        } else {
                            setResult("添加失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 群组移除人员（列表）
     * @param args
     * @param callbackContext
     */
    public void groupRemoveMember(final JSONArray args, final CallbackContext callbackContext){
        String groupID = null;
        try {
            groupID = args.getString(0);
            JSONArray membersArr = args.getJSONArray(1);
            SystemApi.groupRemoveMember(getUserID(), groupID, jsonArray2List(membersArr), new AsyncMethodCallback<IMGroup.AsyncClient.GroupRemoveMember_call>() {
                @Override
                public void onComplete(IMGroup.AsyncClient.GroupRemoveMember_call groupRemoveMember_call) {
                    try {
                        RSTChangeGroup result = groupRemoveMember_call.getResult();
                        if (result != null && result.result) {
                            String groupIDN = result.getGroupID();
                            setResult(groupIDN, PluginResult.Status.OK, callbackContext);
                        } else {
                            setResult("移除人员失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 群组添加管理员（列表）
     * @param args
     * @param callbackContext
     */
    public void groupAddAdmin(final JSONArray args, final CallbackContext callbackContext){
        String groupID = null;
        try {
            groupID = args.getString(0);
            JSONArray adminsArr = args.getJSONArray(1);
            SystemApi.groupAddAdmin(getUserID(), groupID, jsonArray2List(adminsArr), new AsyncMethodCallback<IMGroup.AsyncClient.GroupAddAdmin_call>() {
                @Override
                public void onComplete(IMGroup.AsyncClient.GroupAddAdmin_call groupAddAdmin_call) {
                    try {
                        RSTChangeGroup result = groupAddAdmin_call.getResult();
                        if (result != null && result.result) {
                            String groupIDN = result.getGroupID();
                            setResult(groupIDN, PluginResult.Status.OK, callbackContext);
                        } else {
                            setResult("添加管理员失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 群组移除管理员（列表）
     * @param args
     * @param callbackContext
     */
    public void groupRemoveAdmin(final JSONArray args, final CallbackContext callbackContext){
        String groupID = null;
        try {
            groupID = args.getString(0);
            JSONArray adminsArr = args.getJSONArray(1);
            SystemApi.groupRemoveAdmin(getUserID(), groupID, jsonArray2List(adminsArr), new AsyncMethodCallback<IMGroup.AsyncClient.GroupRemoveAdmin_call>() {
                @Override
                public void onComplete(IMGroup.AsyncClient.GroupRemoveAdmin_call groupRemoveAdmin_call) {
                    try {
                        RSTChangeGroup result = groupRemoveAdmin_call.getResult();
                        if (result != null && result.result) {
                            String groupIDN = result.getGroupID();
                            setResult(groupIDN, PluginResult.Status.OK, callbackContext);
                        } else {
                            setResult("移除管理员失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取用户所有群组
     * @param args
     * @param callbackContext
     */
    public void getAllGroup(final JSONArray args, final CallbackContext callbackContext){
        try {
            SystemApi.getAllGroup(getUserID(), new AsyncMethodCallback<IMGroup.AsyncClient.GetAllGroup_call>() {
                @Override
                public void onComplete(IMGroup.AsyncClient.GetAllGroup_call getAllGroup_call) {
                    try {
                        RSTgetGroup result = getAllGroup_call.getResult();
                        if (result != null && result.result) {
                            String json = GsonUtils.toJson(result, new TypeToken<RSTgetGroup>() {
                            }.getType());
                            setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                        } else {
                            setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    } catch (JSONException e) {
                        setResult("JSON数据解析失败！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取用户所有群组的ID（以  , 连接  例如：101,120,123）
     * @param args
     * @param callbackContext
     */
    public void getAllGroupIds(final JSONArray args, final CallbackContext callbackContext){
        try {
            SystemApi.getAllGroup(getUserID(), new AsyncMethodCallback<IMGroup.AsyncClient.GetAllGroup_call>() {
                @Override
                public void onComplete(IMGroup.AsyncClient.GetAllGroup_call getAllGroup_call) {
                    try {
                        RSTgetGroup result = getAllGroup_call.getResult();
                        if (result != null && result.result) {
                            if (result.getGroupCount() == 0) {
                                setResult("", PluginResult.Status.OK, callbackContext);
                            } else {
                                List<Group> groupList = result.getGroupList();
                                StringBuilder sb = new StringBuilder();
                                sb.append("");
                                GroupChatsService groupChatsService=GroupChatsService.getInstance(UIUtils.getContext());
                                for (int i = 0; i < (groupList == null ? 0 : groupList.size()); i++) {
                                    Group group = groupList.get(i);
                                    GroupChats groupChats=groupChatsService.loadDataByArg(groupList.get(i).getGroupID());
                                    if(groupChats==null){
                                        GroupChats groupChats1=new GroupChats();
                                        groupChats1.setId(groupList.get(i).getGroupID());
                                        groupChats1.setGroupName(groupList.get(i).getGroupName());
                                        groupChats1.setGroupType("Group");
                                        groupChats1.setIsmygroup(groupList.get(i).isIsMyGroup());
                                        groupChatsService.saveObj(groupChats1);
                                    }
                                    if (i != groupList.size() - 1) {
                                        sb.append(SwitchLocal.getLocal() + "/G/" + group.getGroupID() + ",");
                                    } else {
                                        sb.append(SwitchLocal.getLocal() + "/G/" + group.getGroupID());
                                    }
                                }
                                setResult(sb.toString(), PluginResult.Status.OK, callbackContext);
                            }
                        } else {
                            setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    } catch (TException e) {
                        setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 只用来发送图片
     */
    public void sendFile(final JSONArray args, final CallbackContext callbackContext){
        try {
            String objectTP = args.getString(0);
            String objectID = args.getString(1);
            if (objectID != null && ("null".equals(objectID.trim()) || "".equals(objectID.trim()))) {
                objectID = null;
            }
            final String filePath=args.getString(2);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Bitmap bitmap = MediaStore.Images.Media.getBitmap(UIUtils.getContext().getContentResolver(), Uri.parse(filePath));
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);
            ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());

            final String dir = FileUtils.getIconDir() + File.separator + "chat_img";
            File dirFile = new File(dir);
            if (dirFile != null && !dirFile.exists()) {
                dirFile.mkdirs();
            }
            final String savePath = dir + File.separator + filePath.substring(filePath.lastIndexOf("/") + 1, filePath.length());;
//            File saveFile = new File(savePath);
            FileOutputStream fos = new FileOutputStream(savePath);

            byte[] bys = new byte[10 * 1024];
            int len = 0;
            while ((len = bais.read(bys)) != -1) {
                fos.write(bys, 0, len);
            }

            fos.close();

            File file = new File(savePath);
            if (file == null || !file.exists()) {
                return;
            }

            FileInputStream in = new FileInputStream(file);
            int available = in.available();
            ByteBuffer fileByte = ByteBuffer.allocate(20 * 1024);
            in.getChannel().read(fileByte);
            in.close();
            fileByte.flip();
            boolean isFinish = false;
            if (available > 20 * 1024) {
                isFinish = false;
            } else {
                isFinish = true;
            }

            SystemApi.sendFile(getUserID(), objectTP, objectID, fileByte, 0, isFinish, new AsyncMethodCallback<IMFile.AsyncClient.SendFile_call>() {
                @Override
                public void onComplete(IMFile.AsyncClient.SendFile_call sendFile_call) {
                    if (sendFile_call != null) {
                        try {
                            RSTSendFile result = sendFile_call.getResult();
                            if (result.result) {
                                sendFile(null, result, savePath, callbackContext);
                            } else {
                                System.out.println("用户头像设置失败");
                            }
                            System.out.println(result);
                        } catch (IOException e) {
                            e.printStackTrace();
                        } catch (TException e) {
                            e.printStackTrace();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }

                @Override
                public void onError(Exception e) {

                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (TException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void sendFile(JSONObject messageDetail, RSTSendFile result, String filePath, CallbackContext callbackContext) throws IOException, TException, JSONException {
        int length = result.getLength();
        long offset = result.getOffset();
        offset = offset + length;
        String fileId = result.getObjID();
        String type = result.getObjType();
        File file = new File(filePath);
        final long fileSize = file.length();
        FileInputStream in;
        in = new FileInputStream(filePath);
        try{
            in.skip(offset);
        } catch(IOException e){
            return;
        }
        byte[] sendByte = new byte[20*1024];
        boolean isFinish = false;
        int sendLength =0;
        ByteBuffer fileByte = null;
        sendLength = in.read(sendByte);
        if(sendLength <= 0){
            String objID = result.getObjID();
            JSONArray retObj = new JSONArray("['" + filePath + "','" + objID + "','1']");
            if (messageDetail != null) {
                retObj.put(messageDetail);
            }
            setResult(retObj, PluginResult.Status.OK, callbackContext);
            return;
        }
        int i = 1;
        while(!isFinish){
            fileByte = ByteBuffer.wrap(sendByte.clone(), 0, sendLength);
            sendLength = in.read(sendByte);
            if(sendLength > 0){
                isFinish = false;
            }else{
                isFinish = true;
            }
            long time = System.currentTimeMillis();
            RSTSendFile rlt = null;
            boolean flag = true;
            int count = 0;
            while(flag) {
                try {
                    rlt = SystemApi.getFileSyncClient().getFileClient().SendFile(getUserID(), type, fileId, fileByte, offset, isFinish);
                    flag = false;
                } catch (Exception e) {
                    count++;
                    if (count > 50) {
//                        flag = false;
                        JSONArray retnObj = new JSONArray("['" + filePath + "','" + rlt.getObjID() + "','" + String.valueOf(-1) + "']");
                        if (messageDetail != null) {
                            retnObj.put(messageDetail);
                        }
                        setResult(retnObj, PluginResult.Status.OK, callbackContext);
                        break;
                    } else {
                        flag = true;
                    }
                }
                if (count > 50) {
                    return;
                }
            }
            JSONArray retnObj = new JSONArray("['" + filePath + "','" + rlt.getObjID() + "','" + String.valueOf(rlt.getOffset() * 1.0f / fileSize) + "']");
            if (messageDetail != null) {
                retnObj.put(messageDetail);
            }
            setResult(retnObj, PluginResult.Status.OK, callbackContext);
//            System.out.println("第" + i +"次发送，用时：" + (System.currentTimeMillis() - time));
            i++;
            offset = rlt.getOffset() + rlt.getLength();
            fileByte.clear();
        }
        String objID = result.getObjID();
        JSONArray retObj = new JSONArray("['" + filePath + "','" + objID + "','1'" + "]");
        if (messageDetail != null) {
            retObj.put(messageDetail);
        }
        setResult(retObj, PluginResult.Status.OK, callbackContext);
        in.close();
    }

    /**
     * 发送所有文件
     * @param args
     * @param callbackContext
     */
    public void sendDocFile(final JSONArray args, final CallbackContext callbackContext){
        try {
            final JSONObject messageDetail = args.getJSONObject(0);
            String objectTP = args.getString(1);
            String objectID = args.getString(2);
            if (objectID != null && ("null".equals(objectID.trim()) || "".equals(objectID.trim()))) {
                objectID = null;
            }

            String messagetype = messageDetail.getString("messagetype");
            final String filePath=args.getString(3).split("###")[0];//{{$}}

            File file = null;
            String nowSavePath = null;
            if (!"Audio".equals(messagetype)) {
                FileInputStream fis = new FileInputStream(filePath);
                final String dir = FileUtils.getIconDir() + File.separator + "chat_img";
                File dirFile = new File(dir);
                if (dirFile != null && !dirFile.exists()) {
                    dirFile.mkdirs();
                }
//                nowSavePath = dir + File.separator + UUID.randomUUID().toString() + filePath.substring(filePath.lastIndexOf("."), filePath.length());
                nowSavePath = dir + File.separator + filePath.substring(filePath.lastIndexOf("/") + 1, filePath.length());
                ;
                file = new File(nowSavePath);
                if (!file.exists()) {
                    FileOutputStream fos = new FileOutputStream(nowSavePath);

                    byte[] bys = new byte[10 * 1024];
                    int len = 0;
                    while ((len = fis.read(bys)) != -1) {
                        fos.write(bys, 0, len);
                    }

                    fos.close();
                }
            } else {
                nowSavePath = filePath;
                file = new File(filePath);
            }

            final String savePath = nowSavePath;


            if (file == null || !file.exists()) {
                return;
            }
            final long fileSize = file.length();
            FileInputStream in = new FileInputStream(file);
            int available = in.available();
            ByteBuffer fileByte = ByteBuffer.allocate(20 * 1024);
            in.getChannel().read(fileByte);
            in.close();
            fileByte.flip();
            boolean isFinish = false;
            if (available > 20 * 1024) {
                isFinish = false;
            } else {
                isFinish = true;
            }

            if (!NetUtils.isConnect(UIUtils.getContext())) {
                JSONArray retnObj = new JSONArray("['" + savePath + "','" + objectID + "','" + String.valueOf(-1) + "']");
                if (messageDetail != null) {
                    retnObj.put(messageDetail);
                }
                setResult(retnObj, PluginResult.Status.OK, callbackContext);
                return;
            }

            final String finalObjectID = objectID;
            SystemApi.sendFile(getUserID(), objectTP, objectID, fileByte, 0, isFinish, new AsyncMethodCallback<IMFile.AsyncClient.SendFile_call>() {
                @Override
                public void onComplete(IMFile.AsyncClient.SendFile_call sendFile_call) {
                    if (sendFile_call != null) {
                        try {
                            RSTSendFile result = sendFile_call.getResult();
                            if (result.result) {
//                                JSONArray retObj = new JSONArray("['" + filePath + "','" + result.getObjID() + "','" + String.valueOf(20 * 1024 * 1.0f / fileSize) + "','" + messageDetail + "']");
//                                retObj.put(messageDetail);
//                                setResult(retObj, PluginResult.Status.OK, callbackContext);
                                sendFile(messageDetail, result, savePath, callbackContext);
                            } else {
                                JSONArray retnObj = new JSONArray("['" + savePath + "','" + finalObjectID + "','" + String.valueOf(-1) + "']");
                                if (messageDetail != null) {
                                    retnObj.put(messageDetail);
                                }
                                setResult(retnObj, PluginResult.Status.OK, callbackContext);
                            }
                        } catch (Exception e) {
                            JSONArray retnObj = null;
                            try {
                                retnObj = new JSONArray("['" + savePath + "','" + finalObjectID + "','" + String.valueOf(-1) + "']");
                            } catch (JSONException e1) {
                                e1.printStackTrace();
                            }
                            if (messageDetail != null) {
                                retnObj.put(messageDetail);
                            }
                            setResult(retnObj, PluginResult.Status.OK, callbackContext);
                            e.printStackTrace();
                        }
                    }
                }

                @Override
                public void onError(Exception e) {
                    JSONArray retnObj = null;
                    try {
                        retnObj = new JSONArray("['" + savePath + "','" + finalObjectID + "','" + String.valueOf(-1) + "']");
                    } catch (JSONException e1) {
                        e1.printStackTrace();
                    }
                    if (messageDetail != null) {
                        retnObj.put(messageDetail);
                    }
                    setResult(retnObj, PluginResult.Status.OK, callbackContext);
                }
            });
        } catch (IOException e) {
            /*JSONArray retnObj = null;
            try {
                retnObj = new JSONArray("['" + savePath + "','" + finalObjectID + "','" + String.valueOf(-1) + "']");
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            if (messageDetail != null) {
                retnObj.put(messageDetail);
            }
            setResult(retnObj, PluginResult.Status.OK, callbackContext);*/
            e.printStackTrace();
        } catch (TException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     *
     */
    public void getFile(final JSONArray args, final CallbackContext callbackContext){

        try {
            final String objectTP=args.getString(0);
            final String objectID=args.getString(1);
            String picSize=args.getString(2);
            SystemApi.getFile(getUserID(),"A".equals(objectTP) ? "F" : objectTP, objectID.split("###")[0],picSize, 0, 0, new AsyncMethodCallback<IMFile.AsyncClient.GetFile_call>() {
                @Override
                public void onComplete(IMFile.AsyncClient.GetFile_call arg0) {
                    if(arg0!=null){
                        try {
                            RSTgetFile result = arg0.getResult();
                            String tempPicName = null;
                            if (result.result) {
                                System.out.println("获取图片成功");
                                String tempUserPic = FileUtils.getIconDir() + File.separator + "chat_img";
                                RandomAccessFile baf = null;
//						String dir = "./tempHeadPic/";
                                File directory = new File(tempUserPic);
                                if (!directory.exists()) {
                                    directory.mkdirs();
                                }
                                long offset = result.getOffset();
                                String type = result.getObjectTP();
                                tempPicName = "";
                                /*if (type.equals("U") || type.equals("G") || type.equals("I")) {
                                    tempPicName = tempUserPic + File.separator + result.getObjectID() + "_" + type + "_" + result.picSize + ".jpg";
                                } else {*/
                                String saveFilePath = objectID.split("###")[1];
                                    tempPicName = tempUserPic + File.separator + saveFilePath.substring(saveFilePath.lastIndexOf("/") + 1, saveFilePath.length());//result.getObjectID() + "_" + type + "_" + result.picSize + objectID.split("###")[4].substring(objectID.split("###")[4].lastIndexOf("."));
                                if ("A".equals(objectTP)) {
                                    tempPicName = objectID.split("###")[1];
                                }
//                                }
                                File tempFile = new File(tempPicName);
                                if (!tempFile.exists())
                                    tempFile.createNewFile();
                                baf = new RandomAccessFile(tempFile, "rw");
                                baf.seek(offset);
                                while (true) {
                                    int length = result.fileByte.limit() - result.fileByte.position();
                                    baf.getChannel().write(result.fileByte);
                                    if (result.isFinish) {
                                        System.out.println("文件下载完成。");
                                        break;
                                    }
                                    try {
                                        result = SystemApi.getFileSyncClient().getFileClient().GetFile(getUserID(), result.objectTP, result.getObjectID(),
                                                result.getPicSize(), result.getOffset() + length, 0);
                                    } catch (JSONException e) {
                                        e.printStackTrace();
                                    }
                                    if (!result.result) {
                                        System.out.println("本次请求失败，原因：" + result.getResultMsg());
                                        break;
                                    }
                                }
                                try {
                                    baf.close();
                                } catch (IOException ex) {

                                }
                            } else {
                                System.out.println("获取我的头像失败");
                            }
                            setResult(tempPicName, PluginResult.Status.OK, callbackContext);
                            setResult("100", PluginResult.Status.OK, callbackContext);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }catch(TException e){
                            e.printStackTrace();
                        }
                    }
                }

                @Override
                public void onError(Exception e) {

                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        } catch (TException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * 二维码扫描登录接口
     * @param args
     * @param callbackContext
     */
    public void qrcodeLogin(final JSONArray args, final CallbackContext callbackContext){
        try {
            String qrcode = args.getString(0);
            String url = "http://61.237.239.105:9500/loginservicetest/qrcode/setUser/" + qrcode + "/" + getUserID();
//            String url = "http://ssl.r93535.com/loginservicetest/qrcode/setUser/" + qrcode + "/" + getUserID();
//            String url = "http://www.r93535.cn/servicesapitest/qrcode/setUser/" + qrcode + "/" + getUserID();
            OKSyncGetClient client = new OKSyncGetClient();
            String data = client.okSyncGet(url);
            if ("1".equals(data.trim())) {//登录成功
                setResult(true, PluginResult.Status.OK, callbackContext);
            } else {//登录失败
                setResult(false, PluginResult.Status.OK, callbackContext);
            }
        } catch (JSONException e) {
            setResult("登录失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    //以下为工具方法
    /**
     * 是否需要升级，传入的新老版本都要以数字和小数点组合
     * @param oldVersionName
     * @param newVersionName
     * @return
     */
    private boolean isNeedsUpgrade(String oldVersionName, String newVersionName){
        String[] oldStr = oldVersionName.split("\\.");
        String[] newStr = newVersionName.split("\\.");
        boolean flag = false;
        for (int i = 0; i < (newStr.length <= oldStr.length ? newStr.length : oldStr.length); i++) {
            if (Integer.parseInt(newStr[i]) > Integer.parseInt(oldStr[i])) {
                flag = true;
                break;
            } else if(Integer.parseInt(newStr[i]) < Integer.parseInt(oldStr[i])) {
                flag = false;
                break;
            }
        }
        //如果新的版本的长度大于旧的版本长度的时候，判断后面的数字是否大于0,如果等于0，则不需要管了，如果大于0则需要更新
        if (!flag && newStr.length > oldStr.length && newVersionName.substring(0, oldStr.length) != null
                && newVersionName.substring(0, oldStr.length).equals(oldVersionName)) {
            String leftVersion = newVersionName.substring(oldStr.length, newVersionName.length());
            String[] leftVersionStr = leftVersion.split("\\.");
            if (leftVersionStr.length > 0) {
                for (int i = 0; i < leftVersionStr.length; i++) {
                    if ("0".equals(leftVersionStr[i])) {
                        continue;
                    }else {
                        flag = true;
                        break;
                    }
                }
            }
        }
        return flag;
    }

    /**
     * 将JSONArray转成Map集合（前提：JSON数组中每一个元素都是一个JSONObject）
     * @param membersArr
     * @return
     * @throws JSONException
     */
    private Map<String, String> jsonArray2Map(JSONArray membersArr) throws JSONException {
        Map<String, String> list = new HashMap<String, String>();
        for (int i = 0; i < (membersArr == null ? 0 : membersArr.length()); i++) {
            JSONObject obj = membersArr.getJSONObject(i);
            String id = obj.getString("id");
            String phone = obj.getString("phone");
            list.put(id, phone);
        }
        return list;
    }

    /**
     * 将JSONArray转成List<String>
     * @param membersArr
     * @return
     * @throws JSONException
     */
    private List<String> jsonArray2List(JSONArray membersArr) throws JSONException {
        List<String> list = new ArrayList<String>();
        for (int i = 0; i < membersArr.length(); i++) {
            list.add(membersArr.getString(i));
        }
        return list;
    }

    /**
     * 将JSONObject转成Map<String, String>集合
     * @param obj
     * @return
     * @throws JSONException
     */
    public Map<String, String> jsonobj2Map(JSONObject obj) throws JSONException {
        Map<String, String> map = new HashMap<String, String>();
        for (Iterator<String> keys = obj.keys(); keys.hasNext();) {
            String key = keys.next();
            String value = obj.getString(key);
            map.put(key, value);
        }
        return map;
    }

    /**
     * 获取当前登录用户的deptID
     * @return
     * @throws JSONException
     */
    public String getDeptID() throws JSONException {
        JSONObject userInfo = getUserInfo();
        return userInfo.getString("deptID");
    }

    /**
     * 获取当前登录的用户ID
     * @return
     */
    public static String getUserID() throws JSONException {
        JSONObject userInfo = getUserInfo();
        return userInfo == null ? null : userInfo.getString("userID");
    }

    public static JSONObject getUserInfo() throws JSONException {
        String login_info = SPUtils.getString("login_info", "");
        JSONObject obj = null;
        if (login_info == null || "".equals(login_info.trim())) {
            obj = null;
        } else {
            obj = new JSONObject(login_info);
        }
        return obj;
    }
    /**
     * 打开文件（各种类型）
     *
     */
    public void openFile(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String fileName = args.getString(0);
            String path=Environment.getExternalStorageDirectory().getPath()+"/"+fileName;
            if (path != null && !"".equals(path)) {
                boolean flag = UIUtils.openFile(path);
                if (flag) {
                    setResult("true", PluginResult.Status.OK, callbackContext);
                } else {
                    setResult("文件不存在！", PluginResult.Status.ERROR, callbackContext);
                }
            } else {
                setResult("文件路径不能为空！", PluginResult.Status.ERROR, callbackContext);
            }
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 打开文件（各种类型）
     *
     */
    public void openFileByPath(final JSONArray args, final CallbackContext callbackContext) {
        try {
            final String path = args.getString(0);
            final JSONObject msg = args.getJSONObject(1);
            final String id = msg.getString("_id");
            if (id == null || "".equals(id.trim())) {
                ToastUtil.showSafeToast("参数错误！");
                return;
            }
            if (downList.contains(id)) {
                return;
            }
            downList.add(id);
            File file = new File(path);
            final String objectID=msg.getString("message");
            final String message = objectID.substring(0, objectID.lastIndexOf("###"));
            if (path != null && !"".equals(path.trim())) {
                if (file.exists() && file.length() == Integer.parseInt(objectID.split("###")[2])) {
                    downList.remove(id);
                    msg.put("message", message + "###" + 100);
                    setResult(msg, PluginResult.Status.OK, callbackContext);
                    openFile(path, callbackContext);
                    return;
                } else {
                    /*int progress = 0;
                    try {
                        progress = Integer.parseInt(objectID.split("###")[5]);
                    } catch (Exception e) {
                    }
                    if (progress > 0 && progress < 100 || progress == -1) {
                        file.delete();
                    }*/
                    if (file.exists()) {
                        file.delete();
                    }
//                }
//                if (!file.exists()) {
                    try {
                        SystemApi.getFile(getUserID(),"F", objectID.split("###")[0],"", 0, 0, new AsyncMethodCallback<IMFile.AsyncClient.GetFile_call>() {
                            @Override
                            public void onComplete(IMFile.AsyncClient.GetFile_call arg0) {
                                if(arg0!=null){
                                    try {
                                        RSTgetFile result = arg0.getResult();
                                        String tempPicName = null;
                                        if (result.result) {
                                            System.out.println("获取图片成功");
                                            String tempUserPic = FileUtils.getIconDir() + File.separator + "chat_img" + File.separator + UUID.randomUUID().toString();
                                            RandomAccessFile baf = null;
                                            File directory = new File(tempUserPic);
                                            if (!directory.exists()) {
                                                directory.mkdirs();
                                            }
                                            long offset = result.getOffset();
                                            long fileSize = Long.valueOf(objectID.split("###")[2]);
                                            tempPicName = tempUserPic + File.separator + path.substring(path.lastIndexOf("/") + 1);//result.getObjectID() + "_" + type + "_" + result.picSize + objectID.split("###")[4].substring(objectID.split("###")[4].lastIndexOf("."));
                                            File tempFile = new File(tempPicName);
                                            if (!tempFile.exists())
                                                tempFile.createNewFile();
                                            baf = new RandomAccessFile(tempFile, "rw");
                                            baf.seek(offset);
                                            String finalMessage = message;
                                            finalMessage = message.split("###")[0] + "###" + tempPicName + message.substring(message.indexOf("###", message.indexOf("###") + 1), message.length());
                                            while (true) {
                                                int length = result.fileByte.limit() - result.fileByte.position();
                                                baf.getChannel().write(result.fileByte);
                                                if (result.isFinish) {
                                                    msg.put("message", finalMessage + "###" + 100);
                                                    setResult(msg, PluginResult.Status.OK, callbackContext);
                                                    break;
                                                }
                                                try {
                                                    result = SystemApi.getFileSyncClient().getFileClient().GetFile(getUserID(), result.objectTP, result.getObjectID(),
                                                            result.getPicSize(), result.getOffset() + length, 0);
                                                } catch (JSONException e) {
                                                    e.printStackTrace();
                                                }
                                                if (!result.result) {
                                                    break;
                                                }
                                                float progressF = (result.getOffset()) * 1.0f / fileSize * 100;
                                                int progress = Math.round(progressF);
                                                msg.put("message", finalMessage + "###" + progress);
                                                setResult(msg, PluginResult.Status.OK, callbackContext);
                                            }
                                            try {
                                                baf.close();
                                            } catch (IOException ex) {

                                            }
                                            downList.remove(id);
                                            //打开文件
                                            openFile(tempPicName, callbackContext);
                                        } else {
                                            downList.remove(id);
                                            try {
                                                msg.put("message", message + "###" + (-1));
                                            } catch (JSONException e1) {
                                                e1.printStackTrace();
                                            }
                                            setResult(msg, PluginResult.Status.OK, callbackContext);
                                            System.out.println("获取我的头像失败");
                                        }
                                        //setResult(tempPicName, PluginResult.Status.OK, callbackContext);
//                                        setResult(msg, PluginResult.Status.OK, callbackContext);
                                    } catch (Exception e) {
                                        downList.remove(id);
                                        try {
                                            msg.put("message", message + "###" + (-1));
                                        } catch (JSONException e1) {
                                            e1.printStackTrace();
                                        }
                                        setResult(msg, PluginResult.Status.OK, callbackContext);
                                        e.printStackTrace();
                                    }
                                }
                            }

                            @Override
                            public void onError(Exception e) {
                                downList.remove(id);
                                try {
                                    msg.put("message", message + "###" + (-1));
                                } catch (JSONException e1) {
                                    e1.printStackTrace();
                                }
                                setResult(msg, PluginResult.Status.OK, callbackContext);
                            }
                        });
                    } catch (Exception e) {
                        downList.remove(id);
                        msg.put("message", message + "###" + (-1));
                        setResult(msg, PluginResult.Status.OK, callbackContext);
                        e.printStackTrace();
                    }
                }
            } else {
                downList.remove(id);
                msg.put("message", message + "###" + (-1));
                setResult(msg, PluginResult.Status.OK, callbackContext);
            }
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    private void openFile(String path, CallbackContext callbackContext) {
        boolean flag = UIUtils.openFile(path);
        if (flag) {
            setResult("true", PluginResult.Status.OK, callbackContext);
        } else {
            setResult("文件不存在！", PluginResult.Status.ERROR, callbackContext);
        }
    }




    /***
     * 登录成功以后根据部门id将部门信息入库
     */
    public void SetDeptInfo(final JSONArray args, final CallbackContext callbackContext){
        //登录成功以后，将部门群消息入库，群组消息在登录成功以后就入库
        try {
            SystemApi.getDeparment(getUserID(), getDeptID(), new AsyncMethodCallback<IMDepartment.AsyncClient.GetDeparment_call>() {
                @Override
                public void onComplete(IMDepartment.AsyncClient.GetDeparment_call getDeparment_call) {
                    if (getDeparment_call != null) {
                        try {
                            RSTgetDept result = getDeparment_call.getResult();
                            if (result == null) {
                                setResult("获取部门信息失败！", PluginResult.Status.ERROR, callbackContext);
                            } else {
    //                                                      String json = GsonUtils.toJson(result, RSTgetDept.class);
                                if (result.result) {
                                    GroupChats groupChats = new GroupChats();
                                    groupChats.setId(result.getDeptInfo().getDeptID());
                                    groupChats.setGroupName(result.getDeptInfo().getDeptName());
                                    groupChats.setIsmygroup(false);
                                    groupChats.setGroupType("Dept");
                                    GroupChatsService groupChatsService = GroupChatsService.getInstance(UIUtils.getContext());
                                    groupChatsService.saveObj(groupChats);
                                    setResult("success", PluginResult.Status.OK, callbackContext);
                                } else {
                                    setResult(result.getResultMsg(), PluginResult.Status.ERROR, callbackContext);
                                }
                            }
                        } catch (TException e) {
                            setResult("获取部门信息失败！", PluginResult.Status.ERROR, callbackContext);
                            e.printStackTrace();
                        }
                    } else {
                        setResult("获取部门信息失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onError(Exception e) {
                    setResult("网络未连接！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (TException e) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    public void getWelcomePic(final JSONArray args, final CallbackContext callbackContext){

        BufferedInputStream bis = null;
        FileOutputStream fos = null;
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            String picUserID = args.getString(0);//查询的是谁的图片
            String picSize = args.getString(1);//图片尺寸，40*40，60*60，120*120
            URL url=new URL("http://61.237.239.152:8080/Im_Interface/loginpic/download?Id=0");
            HttpURLConnection httpURLConnection= (HttpURLConnection) url.openConnection();
            httpURLConnection.setDoInput(true);
            httpURLConnection.setRequestMethod("GET");
            httpURLConnection.connect();
            if(httpURLConnection.getResponseCode()==200){
                bis=new BufferedInputStream(httpURLConnection.getInputStream());
                byte[] buffer = new byte[1024 * 8];

                int c = 0;
                while ((c = bis.read(buffer)) != -1) {

                    baos.write(buffer, 0, c);

                    baos.flush();

                }
                String iconDir = FileUtils.getIconDir() + File.separator + "/welcome";
                File directory = new File(iconDir);
                if (!directory.exists()) {
                    directory.mkdirs();
                }
                String fileName = iconDir + File.separator + picUserID + picSize + ".jpg";
                File file = new File(fileName);
                if (!file.exists()) {
                    file.createNewFile();
                }
                byte[] fileByte = baos.toByteArray();
                fos = new FileOutputStream(file);
                fos.write(fileByte);
                setResult(fileName, PluginResult.Status.OK, callbackContext);
            }

        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }finally {
            if (fos != null) {
                try {
                    fos.close();
                    fos = null;
                } catch (IOException e) {
                    setResult("网络异常", PluginResult.Status.ERROR, callbackContext);
                    e.printStackTrace();
                }
            }
        }


    }


    /**
     * 设置返回信息
     * @param result 返回结果数据
     * @param resultStatus 返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    public void setResult(String result, PluginResult.Status resultStatus, CallbackContext callbackContext){
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     * @param result 返回结果数据
     * @param resultStatus 返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    public void setResult(JSONObject result, PluginResult.Status resultStatus, CallbackContext callbackContext){
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     * @param result 返回结果数据
     * @param resultStatus 返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    private void setResult(JSONArray result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }
    /**
     * 设置返回信息
     * @param result 返回结果数据
     * @param resultStatus 返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    private void setResult(int result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }
    /**
     * 设置返回信息
     * @param result 返回结果数据
     * @param resultStatus 返回结果状态  PluginResult.Sgetatus.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    private void setResult(long result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     * @param result 返回结果数据
     * @param resultStatus 返回结果状态  PluginResult.Sgetatus.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    private void setResult(boolean result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    public static String getType(String type) {
      if ("User".equals(type)) {
        return "U";
      } else if ("Group".equals(type)) {
        return "G";
      } else if ("Dept".equals(type)) {
        return "D";
      } else if ("Platform".equals(type)){
        return "P";
      }else {
          return "U";
      }
    }

}
