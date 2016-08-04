package com.tky.mqtt.plugin.thrift;

import com.google.gson.Gson;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.plugin.thrift.api.SystemApi;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.thrift.TException;
import org.apache.thrift.async.AsyncMethodCallback;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import im.model.RST;
import im.server.Department.IMDepartment;
import im.server.Department.RSTgetChild;
import im.server.Department.RSTgetDept;
import im.server.Department.RSTgetRoot;
import im.server.System.IMSystem;
import im.server.System.RSTlogin;
import im.server.System.RSTsearch;
import im.server.System.RSTsysTime;

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
            String imCode = args.getString(2);
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
            String imCode = args.getString(1);
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


    ///////部门接口

    /**
     * 获取部门和人员
     * @param args
     * @param callbackContext
     */
    public void getChild(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String ID = args.getString(0);
            String deptID = args.getString(1);
            int pageNum = args.getInt(2);
            int pageCount = args.getInt(3);
            SystemApi.getChild(ID, deptID, pageNum, pageCount, new AsyncMethodCallback<IMDepartment.AsyncClient.GetChild_call>() {
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
            String ID = args.getString(0);
            String deptID = args.getString(1);

            SystemApi.getDeparment(ID, deptID, new AsyncMethodCallback<IMDepartment.AsyncClient.GetDeparment_call>() {
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
            String ID = args.getString(0);
            SystemApi.getUserRoot(ID, new AsyncMethodCallback<IMDepartment.AsyncClient.GetUserRoot_call>() {
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


}
