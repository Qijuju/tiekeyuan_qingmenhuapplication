package com.tky.mqtt.plugin.thrift;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.utils.FileUtils;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.plugin.thrift.api.SystemApi;
import com.tky.mqtt.plugin.thrift.callback.GetHeadPicCallback;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.thrift.TException;
import org.apache.thrift.async.AsyncMethodCallback;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import im.model.Msg;
import im.model.RST;
import im.model.User;
import im.server.Department.IMDepartment;
import im.server.Department.RSTgetChild;
import im.server.Department.RSTgetDept;
import im.server.Department.RSTgetRoot;
import im.server.File.IMFile;
import im.server.File.RSTversionInfo;
import im.server.Message.IMMessage;
import im.server.Message.RSTgetMsg;
import im.server.Message.RSTgetMsgCount;
import im.server.System.IMSystem;
import im.server.System.RSTlogin;
import im.server.System.RSTsearch;
import im.server.System.RSTsysTime;
import im.server.User.IMUser;
import im.server.User.RSTgetUser;
import im.server.attention.IMAttention;
import im.server.attention.RSTgetAttention;

/**
 * 作者：
 * 包名：com.tky.mqtt.plugin.thrift
 * 日期：2016-07-26 15:31:56
 * 描述：
 */
public class ThriftApiClient extends CordovaPlugin {


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
            String username = args.getString(0);
            String password = args.getString(1);
            String imCode = UIUtils.getDeviceId();
            SystemApi.login(username, password, imCode, new AsyncMethodCallback<IMSystem.AsyncClient.Login_call>() {
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
                                    Gson gson = new Gson();
                                    String json = gson.toJson(result, RSTlogin.class);
                                    //保存登录信息
                                    SPUtils.save("login_info", json);
                                    try {
                                        setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                                    } catch (JSONException e) {
                                        e.printStackTrace();
                                    }
                                } else if ("104".equals(result.getResultCode())) {
                                    setResult("账户名或密码错误！", PluginResult.Status.ERROR, callbackContext);
                                } else if ("105".equals(result.getResultCode())) {
                                    setResult("用户在不常用的设备上登录！", PluginResult.Status.ERROR, callbackContext);
                                } else {
                                    setResult(result.getResultMsg(), PluginResult.Status.ERROR, callbackContext);
                                }
                            }
                        } catch (TException e) {
                            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                            e.printStackTrace();
                        }
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
            File file=new File(filePath);
            boolean exists = file.exists();

            SystemApi.setHeadPic(getUserID(), filePath, new AsyncMethodCallback<IMFile.AsyncClient.SetHeadPic_call>() {
                @Override
                public void onComplete(IMFile.AsyncClient.SetHeadPic_call setHeadPic_call) {
                    try {
                        RST result = setHeadPic_call.getResult();
                        if (result != null && result.result) {
                            setResult("success", PluginResult.Status.OK, callbackContext);
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
            savePath = FileUtils.getDownloadDir() + File.separator + "apk";
            String userID = getUserID();
            boolean success = SystemApi.getVersion(savePath, getUserID(), versionCode);
            String exePath = savePath + File.separator + "1000"/*apkVersion*/ + ".apk";
            setResult(success ? exePath : "更新失败！", success ? PluginResult.Status.OK : PluginResult.Status.ERROR, callbackContext);
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
     * 是否需要更新
     * @param args
     * @param callbackContext
     */
    public void needUpgrade(final JSONArray args, final CallbackContext callbackContext){
        try {
            String newVersion = args.getString(0);
            String install_cancel = SPUtils.getString("install_cancel", "false");
            String install_cancel_version = SPUtils.getString("install_cancel_version", "");
            if (install_cancel.equals("true") && install_cancel_version.equals(newVersion)) {
                setResult("false", PluginResult.Status.OK, callbackContext);
                return;
            }
            boolean needsUpgrade = isNeedsUpgrade(UIUtils.getVersion(), newVersion);
            setResult(needsUpgrade ? "true" : "已是最新版本，无需更新！", PluginResult.Status.OK, callbackContext);
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
                            Date date=new Date(attentions.get(pageNum).getMsgDate());
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
        for (Iterator<String> keys = obj.keys(); obj.keys().hasNext();) {
            String key = keys.next();
            String value = obj.getString(key);
            map.put(key, value);
        }
        return map;
    }

    /**
     * 获取当前登录的用户ID
     * @return
     */
    public String getUserID() throws JSONException {
        JSONObject userInfo = getUserInfo();
        return userInfo.getString("userID");
    }

    public JSONObject getUserInfo() throws JSONException {
        String login_info = SPUtils.getString("login_info", "");
        return new JSONObject(login_info);
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

}
