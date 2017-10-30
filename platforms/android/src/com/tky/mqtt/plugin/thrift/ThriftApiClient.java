package com.tky.mqtt.plugin.thrift;

import android.app.ProgressDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.r93535.im.Constants;
import com.tky.im.connection.IMConnection;
import com.tky.im.utils.IMSwitchLocal;
import com.tky.mqtt.dao.ChatList;
import com.tky.mqtt.dao.GroupChats;
import com.tky.mqtt.dao.Messages;
import com.tky.mqtt.dao.SystemMsg;
import com.tky.mqtt.paho.ConnectionType;
import com.tky.mqtt.paho.MType;
import com.tky.mqtt.paho.MessageOper;
import com.tky.mqtt.paho.MqttReceiver;
import com.tky.mqtt.paho.MqttTopicRW;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.bean.MessageBean;
import com.tky.mqtt.paho.callback.OKHttpCallBack2;
import com.tky.mqtt.paho.http.OKAsyncClient;
import com.tky.mqtt.paho.http.OKSyncGetClient;
import com.tky.mqtt.paho.http.Request;
import com.tky.mqtt.paho.httpbean.AddGroup;
import com.tky.mqtt.paho.httpbean.AllGroup;
import com.tky.mqtt.paho.httpbean.AttentionBean;
import com.tky.mqtt.paho.httpbean.BaseBean;
import com.tky.mqtt.paho.httpbean.ChildsBean;
import com.tky.mqtt.paho.httpbean.DepartmentBean;
import com.tky.mqtt.paho.httpbean.DeptInfo;
import com.tky.mqtt.paho.httpbean.ExtMsgBean;
import com.tky.mqtt.paho.httpbean.GetUser;
import com.tky.mqtt.paho.httpbean.GroupUpdate;
import com.tky.mqtt.paho.httpbean.HistoryMsgBean;
import com.tky.mqtt.paho.httpbean.LatestMsgBean;
import com.tky.mqtt.paho.httpbean.LoginInfoBean;
import com.tky.mqtt.paho.httpbean.MsgEvent;
import com.tky.mqtt.paho.httpbean.ParamsMap;
import com.tky.mqtt.paho.httpbean.RSTgetDept;
import com.tky.mqtt.paho.httpbean.ReadList;
import com.tky.mqtt.paho.httpbean.RootDept;
import com.tky.mqtt.paho.httpbean.SearchUser;
import com.tky.mqtt.paho.httpbean.VersionInfo;
import com.tky.mqtt.paho.httpbean.ViceUser;
import com.tky.mqtt.paho.jsbean.AttentionJS;
import com.tky.mqtt.paho.jsbean.ChildJSBean;
import com.tky.mqtt.paho.jsbean.ExtMsgJS;
import com.tky.mqtt.paho.jsbean.GroupUpdateJS;
import com.tky.mqtt.paho.jsbean.GroupsJS;
import com.tky.mqtt.paho.jsbean.HistoryMsgJS;
import com.tky.mqtt.paho.jsbean.MsgJS;
import com.tky.mqtt.paho.jsbean.ReadListJS;
import com.tky.mqtt.paho.jsbean.RootJSDept;
import com.tky.mqtt.paho.jsbean.SearchJSUser;
import com.tky.mqtt.paho.jsbean.UserJSDetail;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.utils.FileUtils;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.paho.utils.MqttOper;
import com.tky.mqtt.paho.utils.NetUtils;
import com.tky.mqtt.paho.utils.luban.Luban;
import com.tky.mqtt.paho.utils.luban.OnCompressListener;
import com.tky.mqtt.plugin.thrift.api.ProgressDialogFactory;
import com.tky.mqtt.plugin.thrift.api.SystemApi;
import com.tky.mqtt.services.ChatListService;
import com.tky.mqtt.services.GroupChatsService;
import com.tky.mqtt.services.LocalPhoneService;
import com.tky.mqtt.services.MessagesService;
import com.tky.mqtt.services.SystemMsgService;
import com.tky.mqtt.services.TopContactsService;
import com.tky.oaintegration.CreateXml;
import com.tky.okhttpload.ImFileCallBack;
import com.zhy.http.okhttp.OkHttpUtils;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
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
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import okhttp3.Call;

import static java.lang.Long.parseLong;

/**
 * 作者：
 * 包名：com.tky.mqtt.plugin.thrift
 * 日期：2016-07-26 15:31:56
 * 描述：
 */
public class ThriftApiClient extends CordovaPlugin {

//  public static boolean isHttp = true;

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
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        return true;
    }

    /**
     * 登录接口
     *
     * @param args            参数
     * @param callbackContext 插件回调
     */
    public void login(final JSONArray args, final CallbackContext callbackContext) {
        if (!NetUtils.isConnect(cordova.getActivity())) {
            setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
            return;
        }
        //新的HTTP请求
        try {
            MessagesService messagesService = MessagesService.getInstance(UIUtils.getContext());
            List<Messages> list = messagesService.queryFailure();
            if (list.size() > 0) {
                for (int i = 0; i < list.size(); i++) {
                    list.get(i).setIsFailure("true");
                    messagesService.saveObj(list.get(i));
                }
            }
            MqttRobot.setConnectionType(ConnectionType.MODE_CONNECTION_DOWN_MANUAL);
            MqttOper.closeMqttConnection();
            MqttReceiver.hasRegister = false;
            final String username = args.getString(0);
            final String password = args.getString(1);
            String imCode = UIUtils.getDeviceId();
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = new HashMap<String, Object>();
            paramsMap.put("Action", "Login");
            paramsMap.put("loginName", username);
            paramsMap.put("passwd", password);
            paramsMap.put("platform", "A");
            paramsMap.put("sysVersion", UIUtils.getSystemVersion());//手机操作系统版本号
            paramsMap.put("deviceInfo", UIUtils.getSystemModel());//手机型号
            paramsMap.put("version", UIUtils.getVersion());//app应用版本号
//      paramsMap.put("sysVersion",UIUtils.getSystemVersion());//android/ios 系统的版本号(例如：android 4.4)
            paramsMap.put("imCode", imCode);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<LoginInfoBean>() {
                @Override
                public void onSuccess(Request request, LoginInfoBean result) {
                    if (result.isSucceed()) {
                        try {
                            String userID = getUserID();//旧用户名
                            //转换登录信息
                            String loginJson = switchLoginUser(result);
//              System.out.println("新登录用户信息"+loginJson);
                            //登录成功 标示
                            MqttRobot.setIsStarted(true);
                            JSONObject newUserObj = new JSONObject(loginJson);
                            String newuserID = newUserObj.getString("userID");//新登陆用户名
//              System.out.println("切换用户进来了吗?老用户"+userID+"====新用户"+newuserID);
                            //若前后两次用户名不一致,清楚本地数据库数据库缓存
                            if (userID != null && !(newuserID.equals(userID))) {
                                MessagesService messagesService = MessagesService.getInstance(UIUtils.getContext());
                                ChatListService chatListService = ChatListService.getInstance(UIUtils.getContext());
                                TopContactsService topContactsService = TopContactsService.getInstance(UIUtils.getContext());
                                GroupChatsService groupChatsService = GroupChatsService.getInstance(UIUtils.getContext());
                                SystemMsgService systemMsgService = SystemMsgService.getInstance(UIUtils.getContext());
                                topContactsService.deleteAllData();
                                messagesService.deleteAllData();
                                chatListService.deleteAllData();
                                groupChatsService.deleteAllData();
                                systemMsgService.deleteAllData();
                            }

                            LocalPhoneService localPhoneService = LocalPhoneService.getInstance(UIUtils.getContext());
                            localPhoneService.deleteAllData();
                            //保存登录信息
                            SPUtils.save("login_info", loginJson);
                            setResult(new JSONObject(loginJson), PluginResult.Status.OK, callbackContext);

                            //调用getSession方法,获取sessionid
                            getSession(result.getUser().getLoginAccount(), result.getUser().getLoginName());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    } else {
                        if ("104".equals(result.getErrCode())) {
                            setResult("用户或密码错误！", PluginResult.Status.ERROR, callbackContext);
                        }
                        else if("111".equals(result.getErrCode()) ||"112".equals(result.getErrCode()) || "113".equals(result.getErrCode()) || "114".equals(result.getErrCode())){
                            System.out.println("需要短信验证"+result.getMessage()+UIUtils.getDeviceId());
                            SPUtils.save("historyusername",username);
                            SPUtils.save("pwd",password);
                            setResult(result.getErrCode()+"#"+result.getUserId()+"#"+result.getMobile()+"#"+UIUtils.getDeviceId(), PluginResult.Status.ERROR, callbackContext);
                        } else {
                            setResult("登录失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("连接服务器超时！", PluginResult.Status.ERROR, callbackContext);
                }
            });

        } catch (JSONException e) {
            setResult("JSON数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
        }
    }


    /**
     * 短信确认验证(新增接口)
     */
    public void confirmSecretText(final JSONArray args,final CallbackContext callbackContext){
        try {
            String id=args.getString(0);
            String mepId=args.getString(1);
            String secretText=args.getString(2);
            String funcCode="Login";
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = new HashMap<String, Object>();
            paramsMap.put("Action", "ConfirmSecretText");
            paramsMap.put("id", id);
            paramsMap.put("mepId", mepId);
            paramsMap.put("secretText",secretText);
            paramsMap.put("funcCode",funcCode);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<LoginInfoBean>() {
                @Override
                public void onSuccess(Request request, LoginInfoBean result) {
                    if (result.isSucceed()) {
                        try {
                            String userID = getUserID();//旧用户名
                            //转换登录信息
                            String loginJson = switchLoginUser(result);
//              System.out.println("新登录用户信息"+loginJson);
                            //登录成功 标示
                            MqttRobot.setIsStarted(true);
                            JSONObject newUserObj = new JSONObject(loginJson);
                            String newuserID = newUserObj.getString("userID");//新登陆用户名
//              System.out.println("切换用户进来了吗?老用户"+userID+"====新用户"+newuserID);
                            //若前后两次用户名不一致,清楚本地数据库数据库缓存
                            if (userID != null && !(newuserID.equals(userID))) {
                                MessagesService messagesService = MessagesService.getInstance(UIUtils.getContext());
                                ChatListService chatListService = ChatListService.getInstance(UIUtils.getContext());
                                TopContactsService topContactsService = TopContactsService.getInstance(UIUtils.getContext());
                                GroupChatsService groupChatsService = GroupChatsService.getInstance(UIUtils.getContext());
                                SystemMsgService systemMsgService = SystemMsgService.getInstance(UIUtils.getContext());
                                topContactsService.deleteAllData();
                                messagesService.deleteAllData();
                                chatListService.deleteAllData();
                                groupChatsService.deleteAllData();
                                systemMsgService.deleteAllData();
                            }

                            LocalPhoneService localPhoneService = LocalPhoneService.getInstance(UIUtils.getContext());
                            localPhoneService.deleteAllData();
                            //保存登录信息
                            SPUtils.save("login_info", loginJson);
                            System.out.println("登陆成功++++"+loginJson);
                            setResult(new JSONObject(loginJson), PluginResult.Status.OK, callbackContext);

                            //调用getSession方法,获取sessionid
                            getSession(result.getUser().getLoginAccount(), result.getUser().getLoginName());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("连接服务器超时！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }


    /**
     * 将拿到的登录信息转换成原先Thrift获取到的登录信息一样的格式
     *
     * @param infoBean
     */
    private String switchLoginUser(LoginInfoBean infoBean) {
        IMConnection.setURL(infoBean.getMqtt());
        //主张号
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("result", infoBean.isSucceed());
        map.put("resultCode", infoBean.getErrCode());
        map.put("isActive", true);
        map.put("sDatetime", System.currentTimeMillis());
        map.put("userID", infoBean.getUser().getId());
        map.put("userName", infoBean.getUser().getDisplayName());
        map.put("deptID", infoBean.getUser().getDeptid());
        map.put("deptName", infoBean.getUser().getDeptName());
        map.put("rootName", infoBean.getUser().getRootDeptName());
        map.put("loginAccount", infoBean.getUser().getLoginAccount());
        //兼职帐号
        List<ViceUser> viceUser = infoBean.getViceUser();
        if (viceUser != null && viceUser.size() > 0) {
            List<Map<String, String>> viceUserList = new ArrayList<Map<String, String>>();
            for (ViceUser user : viceUser) {
                Map<String, String> selfSubMap = new HashMap<String, String>();
                selfSubMap.put("deptId", user.getDeptid());
                selfSubMap.put("deptName", user.getDeptName());
                selfSubMap.put("rootName", user.getRootDeptName());
                selfSubMap.put("userID", user.getId());
                selfSubMap.put("userName", user.getUserName());
                viceUserList.add(selfSubMap);
            }
            map.put("viceUser", viceUserList);
        }
        Gson gson = new Gson();
        String loginJson = gson.toJson(map);
        SPUtils.save("login_info", loginJson);
        return loginJson;
    }

    public void seachUsers(final JSONArray args, final CallbackContext callbackContext) {
        try {
//      String userId = args.getString(0);
            String searchText = args.getString(1);
            int pageNum = args.getInt(2);
            int pageCount = args.getInt(3);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("SearchUsers").getParamsMap();
            paramsMap.put("searchText", searchText);
            paramsMap.put("pageSize", pageCount);
            paramsMap.put("pageNo", pageNum);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<SearchUser>() {
                @Override
                public void onSuccess(Request request, SearchUser result) {
                    SearchJSUser jsUser = switchSearchUser(result);
                    String json = GsonUtils.toJson(jsUser, SearchJSUser.class);
                    try {
                        setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                    } catch (JSONException e) {
                        setResult("数据解析错误！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 转换查询到的用户数据
     *
     * @param result
     */
    private SearchJSUser switchSearchUser(SearchUser result) {
        //拿到列表
        List<SearchUser.Event> event = result.getEvent();
        //创建需要的查询数据对象
        SearchJSUser jsUser = new SearchJSUser();
        //填充数据
        jsUser.setResult(result.isSucceed());
        boolean searchUserIsNull = (event == null || event.size() <= 0);
        jsUser.setSearchCount(searchUserIsNull ? 0 : event.size());
        List<SearchJSUser.SearchResult> searchResults = new ArrayList<SearchJSUser.SearchResult>();
        if (!searchUserIsNull) {
            for (int i = 0; i < event.size(); i++) {
                SearchUser.Event eventi = event.get(i);
                SearchJSUser.SearchResult searchResult = new SearchJSUser.SearchResult();
                searchResult.setDeptPath(eventi.getDeptPath());
                searchResult.setUserID(eventi.getId());
                searchResult.setDeptID(eventi.getDeptid());
                searchResult.setDeptName(eventi.getDeptName());
                searchResult.setUserName(eventi.getUserName());
                searchResult.setRootName(eventi.getRootDeptName());
                searchResults.add(searchResult);
            }
        }
        jsUser.setSearchResult(searchResults);
        return jsUser;
    }

    /**
     * 获取部门和人员
     *
     * @param args
     * @param callbackContext
     */
    public void getChild(final JSONArray args, final CallbackContext callbackContext) {
        try {
            final String deptID = args.getString(0);
            int pageNum = args.getInt(1);
            int pageCount = args.getInt(2);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetChilds").getParamsMap();
            paramsMap.put("deptId", deptID);
            paramsMap.put("pageNo", String.valueOf(pageNum));
            paramsMap.put("pageSize", String.valueOf(pageCount));
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<ChildsBean>() {
                @Override
                public void onSuccess(Request request, ChildsBean result) {
                    if (result.isSucceed()) {
                        ChildsBean.Event event = result.getEvent();
                        ChildJSBean childJSBean = switchChild(event, deptID);
                        try {
                            String json = GsonUtils.toJson(childJSBean, ChildJSBean.class);
                            setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                        } catch (JSONException e) {
                            setResult("数据解析异常！", PluginResult.Status.ERROR, callbackContext);
                            e.printStackTrace();
                        }
                    } else {
                        setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (Exception e) {
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 将拿到的子部门（和子用户）数据转换为Thrift拿到数据一样的数据
     *
     * @param event
     * @param deptID
     */
    private ChildJSBean switchChild(ChildsBean.Event event, String deptID) {
        List<DepartmentBean.Event> depts = event.getDepts();
        List<com.tky.mqtt.paho.httpbean.User> users = event.getUsers();
        boolean deptsIsNull = (depts == null || depts.size() <= 0);
        boolean usersIsNull = (users == null || users.size() <= 0);
        ChildJSBean child = new ChildJSBean();
        child.setDeptCount(deptsIsNull ? 0 : depts.size());
        child.setUserCount(usersIsNull ? 0 : users.size());
        child.setDeptID(deptID);
        child.setResult(true);
        List<ChildJSBean.UserList> usersList = new ArrayList<ChildJSBean.UserList>();
        if (!usersIsNull) {
            for (int i = 0; i < users.size(); i++) {
                com.tky.mqtt.paho.httpbean.User user = users.get(i);
                ChildJSBean.UserList userList = new ChildJSBean.UserList();
                userList.setDeptID(user.getDeptid());
                userList.setActive(user.isActive());
                userList.setUserID(user.getId());
                userList.setUserName(user.getDisplayName());
                userList.setProName(user.getProname());
                usersList.add(userList);
            }
        }
        child.setUserList(usersList);
        List<ChildJSBean.DeptList> deptLists = new ArrayList<ChildJSBean.DeptList>();
        if (!deptsIsNull) {
            for (int i = 0; i < depts.size(); i++) {
                DepartmentBean.Event dept = depts.get(i);
                ChildJSBean.DeptList deptList = new ChildJSBean.DeptList();
                deptList.setDeptID(dept.getId());
                deptList.setChildCount(dept.getChildCount());
                deptList.setDeptName(dept.getName());
                deptLists.add(deptList);
            }
        }
        child.setDeptList(deptLists);
        return child;
    }

    /**
     * 获取部门
     *
     * @param args
     * @param callbackContext
     */
    public void getDeparment(final JSONArray args, final CallbackContext callbackContext) {
        //登录成功以后，将部门群消息入库，群组消息在登录成功以后就入库
        try {
            String deptID = args.getString(0);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetDepartment").getParamsMap();
            paramsMap.put("deptId", deptID);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<DepartmentBean>() {
                @Override
                public void onSuccess(Request request, DepartmentBean result) {
                    if (result.isSucceed()) {
                        RSTgetDept dept = switchDepartment(result);
                        String json = GsonUtils.toJson(dept, RSTgetDept.class);
                        try {
                            setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    } else {
                        setResult("获取部门信息失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("部门数据解析异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("获取部门信息失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 将用HTTP接口拿到的数据转换成原先Thrift接口拿到的数据的样子
     *
     * @param result
     * @return
     */
    private RSTgetDept switchDepartment(DepartmentBean result) {
        DepartmentBean.Event event = result.getEvent();
        RSTgetDept dept = new RSTgetDept();
        dept.setResult(true);
        DeptInfo deptInfo = new DeptInfo();
        deptInfo.setChildCount(event.getChildCount());
        deptInfo.setDeptID(event.getId());
        deptInfo.setDeptName(event.getName());
        deptInfo.setParentID(event.getParentid());
        dept.setDeptInfo(deptInfo);
        return dept;
    }

    /**
     * 获取用户一级部门
     *
     * @param args
     * @param callbackContext
     */

    public void getUserRoot(final JSONArray args, final CallbackContext callbackContext) {

        try {
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetRootDepartment").getParamsMap();
            paramsMap.put("idType", "U");
            paramsMap.put("objId", getUserID());
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<RootDept>() {
                @Override
                public void onSuccess(Request request, RootDept result) {
                    if (result.isSucceed()) {
                        RootJSDept dept = switchUserRoot(result);
                        String json = GsonUtils.toJson(dept, RootJSDept.class);
                        try {
                            setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                        } catch (JSONException e) {
                            setResult("数据解析错误！", PluginResult.Status.ERROR, callbackContext);
                            e.printStackTrace();
                        }
                    } else {
                        setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("未知异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 转换根部门数据
     *
     * @param result
     */
    private RootJSDept switchUserRoot(RootDept result) {
        RootJSDept dept = new RootJSDept();
        dept.setResult(result.isSucceed());
        List<RootJSDept.DeptList> deptList = new ArrayList<RootJSDept.DeptList>();
        List<DepartmentBean.Event> event = result.getEvent();
        if (event != null && event.size() >= 0) {
            for (DepartmentBean.Event departmentBean : event) {
                RootJSDept.DeptList deptJS = new RootJSDept.DeptList();
                deptJS.setDeptID(departmentBean.getId());
                deptJS.setDeptName(departmentBean.getName());
                deptJS.setChildCount(departmentBean.getChildCount());
                deptList.add(deptJS);
            }
        }
        dept.setDeptList(deptList);
        return dept;
    }

    //****************用户接口****************//

    /**
     * 获取用户详细信息接口
     *
     * @param args
     * @param callbackContext
     */
    public void getUser(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String userID = args.getString(0);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetUser").getParamsMap();
            paramsMap.put("userId", userID);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<GetUser>() {
                @Override
                public void onSuccess(Request request, GetUser result) {
                    if (result.isSucceed()) {
                        UserJSDetail detail = switchGetUser(result);
                        String json = GsonUtils.toJson(detail, UserJSDetail.class);
                        try {
                            setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                        } catch (JSONException e) {
                            setResult("数据解析错误！", PluginResult.Status.ERROR, callbackContext);
                            e.printStackTrace();
                        }
                    } else {
                        setResult("请求失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 转换用户信息
     *
     * @param result
     */
    private UserJSDetail switchGetUser(GetUser result) {
        com.tky.mqtt.paho.httpbean.User event = result.getEvent();
        UserJSDetail detail = new UserJSDetail();
        detail.setResult(result.isSucceed());
        UserJSDetail.User user = new UserJSDetail.User();
        user.setUserID(event.getId());
        user.setActive(true);//(event.isActive());
        user.setDeptPath(event.getDeptPath());
        user.setUserName(event.getDisplayName());
        user.setDeptName(event.getDeptName());
        user.setDeptID(event.getDeptid());
        user.setDuty(event.getProname());
        user.setEmail(event.getEmail());
        user.setFixPhone(event.getFixedphone());
        user.setMobile(event.getMobile());
        user.setSex(event.getSex());
        user.setAttention(event.isAttention());
        detail.setUser(user);
        return detail;
    }

    /**
     * 修改用户密码接口
     *
     * @param args
     * @param callbackContext
     */
    public void updatePwd(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String ID = getUserID();
            String orgPWD = args.getString(0);
            ;
            String newPWD = args.getString(1);
            String confirmPWD = args.getString(2);
            if (!newPWD.equals(confirmPWD)) {
                setResult("两次密码不一致！", PluginResult.Status.ERROR, callbackContext);
                return;
            }
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("ModifyPwd").getParamsMap();
            paramsMap.put("oldPwd", orgPWD);
            paramsMap.put("newPwd", newPWD);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<BaseBean>() {
                @Override
                public void onSuccess(Request request, BaseBean result) {
                    String json = GsonUtils.toJson(result, BaseBean.class);
                    if (result.isSucceed()) {
                        try {
                            setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                        } catch (JSONException e) {
                            setResult("数据解析错误！", PluginResult.Status.ERROR, callbackContext);
                            e.printStackTrace();
                        }
                    } else {
                        if ("521".equals(result.getErrCode())) {
                            setResult("密码修改失败", PluginResult.Status.ERROR, callbackContext);
                        } else if ("522".equals(result.getErrCode())) {
                            setResult("密码修改失败", PluginResult.Status.ERROR, callbackContext);
                        } else if ("523".equals(result.getErrCode())) {
                            setResult("原密码验证错误", PluginResult.Status.ERROR, callbackContext);
                        } else if ("524".equals(result.getErrCode())) {
                            setResult("原密码与新密码相同", PluginResult.Status.ERROR, callbackContext);
                        } else if ("525".equals(result.getErrCode())) {
                            setResult("密码不符合规范", PluginResult.Status.ERROR, callbackContext);
                        } else if ("526".equals(result.getErrCode())) {
                            setResult("确认密码和新密码不一致", PluginResult.Status.ERROR, callbackContext);
                        } else if ("997".equals(result.getErrCode())) {
                            setResult("操作过程发生异常", PluginResult.Status.ERROR, callbackContext);
                        } else if ("998".equals(result.getErrCode())) {
                            setResult("调用接口的参数格式错误", PluginResult.Status.ERROR, callbackContext);
                        } else if ("999".equals(result.getErrCode())) {
                            setResult("调用接口的用户不存在或未激活", PluginResult.Status.ERROR, callbackContext);
                        } else if ("1000".equals(result.getErrCode())) {
                            setResult("服务器异常", PluginResult.Status.ERROR, callbackContext);
                        } else {
                            setResult("未知原因失败！", PluginResult.Status.ERROR, callbackContext);
                        }
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 修改用户信息的接口
     *
     * @param args
     * @param callbackContext
     */
    public void updateUserInfo(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String ID = getUserID();
            JSONObject obj = args.getJSONObject(0);

            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("UpdateUser").getParamsMap();
            int count = 0;
            if (obj.has("MB")) {
                String mb = obj.getString("MB");
                if (mb != null && !"".equals(mb.trim())) {
                    count++;
                    paramsMap.put("mobile", mb);
                }
            }

            if (obj.has("FP")) {
                String fp = obj.getString("FP");
                if (fp != null && !"".equals(fp.trim())) {
                    count++;
                    paramsMap.put("fixPhone", fp);
                }
            }

            if (obj.has("EM")) {
                String em = obj.getString("EM");
                if (em != null && !"".equals(em.trim())) {
                    count++;
                    paramsMap.put("email", em);
                }
            }
            request.addParamsMap(paramsMap);
            if (count > 0) {
                OKAsyncClient.post(request, new OKHttpCallBack2<BaseBean>() {
                    @Override
                    public void onSuccess(Request request, BaseBean result) {
                        String json = GsonUtils.toJson(result, BaseBean.class);
                        if (result.isSucceed()) {
                            try {
                                setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                            } catch (JSONException e) {
                                setResult("数据解析错误！", PluginResult.Status.ERROR, callbackContext);
                                e.printStackTrace();
                            }
                        } else {
                            if ("501".equals(result.getErrCode())) {
                                setResult("传入参数格式不正确！", PluginResult.Status.ERROR, callbackContext);
                            } else if ("502".equals(result.getErrCode())) {
                                setResult("修改后的内容不能为空", PluginResult.Status.ERROR, callbackContext);
                            } else if ("997".equals(result.getErrCode())) {
                                setResult("操作过程发生异常", PluginResult.Status.ERROR, callbackContext);
                            } else if ("998".equals(result.getErrCode())) {
                                setResult("调用接口的参数格式错误", PluginResult.Status.ERROR, callbackContext);
                            } else if ("999".equals(result.getErrCode())) {
                                setResult("调用接口的用户不存在或未激活", PluginResult.Status.ERROR, callbackContext);
                            } else if ("1000".equals(result.getErrCode())) {
                                setResult("服务器异常", PluginResult.Status.ERROR, callbackContext);
                            } else {
                                setResult("未知原因失败！", PluginResult.Status.ERROR, callbackContext);
                            }
                        }
                    }

                    @Override
                    public void onFailure(Request request, Exception e) {
                        setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                    }
                });
            } else {
                setResult("应该至少有一个参数不为空！", PluginResult.Status.ERROR, callbackContext);
            }
        } catch (JSONException e) {
            setResult("参数数据解析错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取版本信息
     * @param args
     * @param callbackContext
     */
    public void getVersionInfo(final JSONArray args, final CallbackContext callbackContext) {
        try {
            Request request = new Request(cordova.getActivity(), SystemApi.FILE_URL);
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetVersionInfo").getParamsMap();
            paramsMap.put("platform", "A");//当前版本
            paramsMap.put("version", UIUtils.getVersion());//当前版本
            request.addParamsMap(paramsMap);
            OKAsyncClient.get(request, new OKHttpCallBack2<String>() {
                @Override
                public void onSuccess(Request request, String result) {
                    try {
                        setResult(new JSONObject(result), PluginResult.Status.OK, callbackContext);
                    } catch (Exception e) {
                        setResult("请求版本信息失败！", PluginResult.Status.OK, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.OK, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.OK, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("请求版本信息失败！", PluginResult.Status.OK, callbackContext);
            e.printStackTrace();
        }
    }


    /**
     * 下载应用(http)
     */
    public void downloadMHApk(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String fileid = args.getString(0);//应用版本名
            final long filesize = args.getLong(1);//应用大小
//            final long filesize = 8388608;
            Map<String, String> map = new HashMap<String, String>();
            map.put("id", IMSwitchLocal.getUserID());
            map.put("mepId", UIUtils.getDeviceId());
            map.put("fileId", fileid);
            map.put("type", "Version");
            map.put("platform", "A");
            String filePath = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "tkyjst" + File.separator + "download" + File.separator + "apk";
            OkHttpUtils.get()
                    .url(Constants.commonfileurl + "/DownloadFile")
                    .params(map)
                    .build()
                    .connTimeOut(10000)
                    .execute(new ImFileCallBack(filePath, "") {
                        ProgressDialog pdDialog;

                        @Override
                        public void onBefore(okhttp3.Request request, int id) {
                            super.onBefore(request, id);
                            UIUtils.runInMainThread(new Runnable() {
                                @Override
                                public void run() {
                                    pdDialog = new ProgressDialog(cordova.getActivity());
                                    pdDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
                                    pdDialog.setTitle("正在升级应用……");
                                    pdDialog.setIndeterminate(false);
                                    pdDialog.setCanceledOnTouchOutside(false);
                                    pdDialog.show();
                                }
                            });
                        }

                        @Override
                        public void onError(Call call, Exception e, int id) {
                            setResult("failure", PluginResult.Status.ERROR, callbackContext);
                        }

                        @Override
                        public void onResponse(File response, int id) {
                            pdDialog.dismiss();
                            UIUtils.installApk(response.getAbsolutePath());
                            setResult("success", PluginResult.Status.OK, callbackContext);
                        }

                        @Override
                        public void inProgress(float progress, long total, int id) {
                            super.inProgress(progress, total, id);
//                            progress = (progress * (-1.0f)) / filesize * 100;
                            progress = progress * 100;
                            final float finalProgress = progress;
//                            System.out.println("文件进度"+Math.round(finalProgress));
                            UIUtils.runInMainThread(new Runnable() {
                                @Override
                                public void run() {
                                    pdDialog.setProgress(Math.round(finalProgress));
                                }
                            });

                        }
                    });
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }


    /**
     * 下载轻应用icon接口
     */
    public void downloadQYYIcon(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String fileid = args.getString(0);//应用图标名称可以不带后缀，一般为应用名称缩写
            final JSONArray jsonArray=new JSONArray(fileid);
          final List<String> iconList=new ArrayList<String>();
          boolean needDown = false;
          for(int i=0;i<jsonArray.length();i++){
            String filePath = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "tkyjst" + File.separator + "download" + File.separator + "icon";
              final String iconFilePath = filePath+File.separator+jsonArray.get(i)+".png";
            final File iconFile = new File(iconFilePath);
            if(!iconFile.exists()){
                needDown = true;
              fileid = jsonArray.get(i).toString();
              Map<String, String> map = new HashMap<String, String>();
              map.put("id", IMSwitchLocal.getUserID());
              map.put("mepId", UIUtils.getDeviceId());
              map.put("fileId", fileid);
              map.put("type", "ExtAppIcon");
              map.put("platform", "A");
              iconList.add("-1");
              final int finalI = i;
              OkHttpUtils.get()
                .url(Constants.commonfileurl + "/DownloadFile")
                .params(map)
                .build()
                .connTimeOut(10000)
                .execute(new ImFileCallBack(filePath, "") {
                  int position = 0;
                  @Override
                  public void onBefore(okhttp3.Request request, int id) {
                    super.onBefore(request, id);
                    position = finalI;
                  }

                  @Override
                  public void onError(Call call, Exception e, int id) {
                    setResult("failure", PluginResult.Status.ERROR, callbackContext);
                  }

                  @Override
                  public void onResponse(File response, int id) {
                    iconList.set(position, iconFilePath);
                    if (jsonArray.length() == iconList.size()) {
                      setResult(new JSONArray(iconList), PluginResult.Status.OK, callbackContext);
                    }
                  }

                  @Override
                  public void inProgress(float progress, long total, int id) {
                    super.inProgress(progress, total, id);

                  }
                });
            }else{
              iconList.add(iconFilePath);
            }
          }
          /*for(int i=0;i<iconList.size();i++){
            System.out.println("iconPath："+iconList.get(i).toString());
          }*/
          if (jsonArray.length() == iconList.size() && !needDown) {
            setResult(new JSONArray(iconList), PluginResult.Status.OK, callbackContext);
          }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * 应用安装
     *
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
        } catch (Exception e) {
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * 是否需要更新
     *
     * @param args
     * @param callbackContext
     */
    public void needUpgrade(final JSONArray args, final CallbackContext callbackContext) {

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


            if (needsUpgrade) {
                //第一次肯定进不来这边
                setResult("true", PluginResult.Status.OK, callbackContext);
            } else {
                //保存服务器的版本号到sp中
                SPUtils.save("local_versionname", newVersion);

                setResult("已是最新版本，无需更新！", PluginResult.Status.OK, callbackContext);
            }


        } catch (JSONException e) {
            setResult("数据解析异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * 添加关注(列表)
     *
     * @param args
     * @param callbackContext
     */
    public void addAttention(final JSONArray args, final CallbackContext callbackContext) {
        try {
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("AddAttention").getParamsMap();
            JSONArray membersArr = args.getJSONArray(0);
            List<String> members = jsonArray2List(membersArr);
            paramsMap.put("members", members);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<BaseBean>() {
                @Override
                public void onSuccess(Request request, BaseBean result) {
                    if (result.isSucceed()) {
                        setResult("success", PluginResult.Status.OK, callbackContext);
                    } else {
                        setResult("添加失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误导致添加失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("添加失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 取消关注（列表）
     *
     * @param args
     * @param callbackContext
     */
    public void removeAttention(final JSONArray args, final CallbackContext callbackContext) {
        try {
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("RemoveAttention").getParamsMap();
            JSONArray membersArr = args.getJSONArray(0);
            List<String> members = jsonArray2List(membersArr);
            paramsMap.put("members", members);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<BaseBean>() {
                @Override
                public void onSuccess(Request request, BaseBean result) {
                    if (result.isSucceed()) {
                        setResult("success", PluginResult.Status.OK, callbackContext);
                    } else {
                        setResult("取消关注失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误导致添加失败！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("取消关注失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取关注列表
     *
     * @param args
     * @param callbackContext
     */
    public void getAttention(final JSONArray args, final CallbackContext callbackContext) {
        try {
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetAttention").getParamsMap();
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<AttentionBean>() {
                @Override
                public void onSuccess(Request request, AttentionBean result) {
                    try {
                        AttentionJS attentionJS = switchAttention(result);
                        List<AttentionJS.UserJS> attentions = attentionJS.getUsers();
                        String jsonStr = GsonUtils.toJson(attentions, new TypeToken<List<AttentionJS.UserJS>>() {
                        }.getType());
                        setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
                    } catch (Exception e) {
                        setResult("获取关注列表失败！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 转换关注信息
     *
     * @param result
     */
    private AttentionJS switchAttention(AttentionBean result) {
        List<com.tky.mqtt.paho.httpbean.User> user = result.getUser();
        AttentionJS attentionJS = new AttentionJS();
        List<AttentionJS.UserJS> users = new ArrayList<AttentionJS.UserJS>();
        if (user != null && user.size() > 0) {
            for (int i = 0; i < user.size(); i++) {
                com.tky.mqtt.paho.httpbean.User user1 = user.get(i);
                AttentionJS.UserJS userJS = new AttentionJS.UserJS();
                userJS.setUserID(user1.getId());
                userJS.setActive(user1.isActive());
                userJS.setDeptID(user1.getDeptid());
                userJS.setUserName(user1.getDisplayName());
                users.add(userJS);
            }
        }
        attentionJS.setUsers(users);
        return attentionJS;
    }

    /**
     * TODO 获取历史消息
     *
     * @param args
     * @param callbackContext
     */
    public void getHistoryMsg(final JSONArray args, final CallbackContext callbackContext) {
        try {
            final String sessionType = args.getString(0);//会话类型(U:个人，D：部门，G：群组)
            final String sessionID = args.getString(1);//会话ID(U:对方ID，D&G:部门&群组ID)
            int pageNum = args.getInt(2);//搜索的页数(0时为末页)
            int pageCount = args.getInt(3);//每页的数目(0时为10)
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetHistoryMsg").getParamsMap();
            paramsMap.put("sessionId", sessionID);
            paramsMap.put("type", sessionType);
            paramsMap.put("pageNo", pageNum);
            paramsMap.put("pageSize", pageCount);
            paramsMap.put("platform", "A");
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<HistoryMsgBean>() {
                @Override
                public void onSuccess(Request request, HistoryMsgBean result) {
                    try {
                        List<HistoryMsgBean.Value> value = result.getValue();
                        HistoryMsgJS msgJS = switchHistoryMsg(value, sessionID, sessionType);
                        List<HistoryMsgJS.Msg> attentions = msgJS.getMsglist();
                        String jsonStr = GsonUtils.toJson(attentions, new TypeToken<List<HistoryMsgJS.Msg>>() {
                        }.getType());
                        setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
                    } catch (Exception e) {
                        setResult("历史消息请求失败！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("历史消息请求失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 转换历史消息
     *
     * @param value
     * @param sessionID
     * @param sessionType
     */
    private HistoryMsgJS switchHistoryMsg(List<HistoryMsgBean.Value> value, String sessionID, String sessionType) {
        HistoryMsgJS msgJS = new HistoryMsgJS();
        msgJS.setResult(true);
        boolean flag = value != null && value.size() > 0;
        msgJS.setMsgCount(flag ? 0 : value.size());
        msgJS.setSessionID(sessionID);
        msgJS.setSessionType(sessionType);
        List<HistoryMsgJS.Msg> msgList = new ArrayList<HistoryMsgJS.Msg>();
        if (flag) {
            for (HistoryMsgBean.Value bean : value) {
                HistoryMsgJS.Msg msg = new HistoryMsgJS.Msg();
                msg.setFromID(bean.getFrom());
                msg.setFromName(bean.getFromName());
                msg.setMsg(bean.getMessage());
                msg.setMsgDate(bean.getWhen());
                msg.setMsgType(bean.getMediaType());
                msgList.add(msg);
            }
        }
        msgJS.setMsglist(msgList);
        return msgJS;
    }

    /**
     * 发消息
     *
     * @param topic
     * @param content
     * @param callback
     */
    public static void sendMsg(final String topic, final String content, final IMqttActionListener callback) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject obj = new JSONObject(content);
                    Request request = new Request();
                    Map<String, Object> paramsMap = ParamsMap.getInstance("SendMessage").getParamsMap();
                    if (!obj.has("EventCode") || (!"UOF".equals(obj.getString("EventCode")) && !"UOL".equals(obj.getString("EventCode")))) {
                        paramsMap.put("msgId", UIUtils.getUUID());
                        paramsMap.put("type", MessageOper.getMsgType2(obj.getString("type")));
                        paramsMap.put("to", obj.getString("sessionid"));
                        paramsMap.put("mediaType", MessageOper.getMediaType2(obj.getString("messagetype")));
                        paramsMap.put("platform", "A");
                        String[] messages = obj.getString("message").split("###");
                        //fileName
                        if ("F".equals(paramsMap.get("mediaType"))) {
                            paramsMap.put("message", messages[0]);
                            paramsMap.put("fileName", messages[4]);
                        } else if ("T".equals(paramsMap.get("mediaType"))) {
                            paramsMap.put("message", obj.getString("message"));
                        } else if ("P".equals(paramsMap.get("mediaType"))) {
                            paramsMap.put("message", obj.getString("message").split(",")[0] + "," + obj.getString("message").split(",")[1]);
                        } else {
                            paramsMap.put("message", messages[0]);
                        }
                        if ("F".equals(paramsMap.get("mediaType")) || "A".equals(paramsMap.get("mediaType")) || "V".equals(paramsMap.get("mediaType"))) {
                            File file = new File(messages[1]);
                            paramsMap.put("fileSize", file.length());
                        }
                        if ("A".equals(paramsMap.get("mediaType"))) {
                            paramsMap.put("playLength", messages[2]);
                        } else if ("V".equals(paramsMap.get("mediaType"))) {
                            paramsMap.put("playLength", "100");
                        }
                        if ("P".equals(paramsMap.get("mediaType"))) {
                            paramsMap.put("address", obj.getString("message").split(",")[2]);
                        }
                        paramsMap.put("receipt", "F");
                    } else {
                        Map<String, String> jsonObj = jsonobj2Map(obj);
                        paramsMap.putAll(jsonObj);
                    }
                    request.addParamsMap(paramsMap);
                    OKAsyncClient.post(request, new OKHttpCallBack2<MsgEvent>() {
                        @Override
                        public void onSuccess(Request request, MsgEvent result) {
                            if (result.isSucceed()) {
                                callback.onSuccess(null);
                            } else {
                                callback.onFailure(null, null);
                            }
                        }

                        @Override
                        public void onFailure(Request request, Exception e) {
                            callback.onFailure(null, e);
                        }
                    });
                } catch (Exception e) {
                    callback.onFailure(null, e);
                    e.printStackTrace();
                }
            }
        }).start();
    }

    /**
     * 将登录成功以后，订阅群组topic之前的历史消息入库并展示在界面上
     */
    public static void getLatestMsg(final String groupID, long when, final String groupName) {
        try {
            Request request = new Request();
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetLatestMsg").getParamsMap();
            paramsMap.put("sessionId", groupID);
            paramsMap.put("type", "G");
            paramsMap.put("sendWhen", when);
            paramsMap.put("msgCount", "50");
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<LatestMsgBean>() {
                @Override
                public void onSuccess(Request request, LatestMsgBean result) {
                    if (result.isSucceed()) {
                        MessagesService messagesService = MessagesService.getInstance(UIUtils.getContext());
                        List<MsgJS> messagesList = switchLatestMsg(result);
//                                    ToastUtil.showSafeToast("取出最新的消息条数"+messagesList.size());
                        for (int i = 0; i < messagesList.size(); i++) {
                            MsgJS msg = messagesList.get(i);
                            Messages messages = new Messages();
                            String id = UUID.randomUUID().toString();
                            messages.set_id(id);
                            messages.setSessionid(result.getEvent().getSessionId());
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
                            messageBean.setSessionid(result.getEvent().getSessionId());
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
                            sendArriveMsgToFront(result.getEvent().getSessionId(), messageBean);
                        }
                        //离线新建群，获取最新群名
                        GroupChatsService groupChatsService = GroupChatsService.getInstance(UIUtils.getContext());
                        List<GroupChats> groupChatsList = groupChatsService.queryData("where id =?", groupID);
                        String groupName = groupChatsList.get(0).getGroupName();
//                                    ToastUtil.showSafeToast("最新群名"+groupName);
                        //统计未读数量
                        int count = 0;
                        List<Messages> messagesList1 = messagesService.queryData("where sessionid =?", result.getEvent().getSessionId());
                        for (int i = 0; i < messagesList.size(); i++) {
                            Messages messages = messagesList1.get(i);
                            if ("0".equals(messages.getIsread())) {
                                count++;
                            }
                        }

                        //取出消息表的最后一条数据保存在chat表里面
                        List<Messages> messagesLists = messagesService.queryData("where sessionid =?", result.getEvent().getSessionId());
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
//                                        System.out.println("消息类型weizhi");
                        } else if (lastmessages.getMessagetype() == "File") {
                            chatList.setLastText("[文件]");//从数据库里取最后一条消息
                        } else if (lastmessages.getMessagetype() == "Audio") {
                            chatList.setLastText("[语音]");//从数据库里取最后一条消息
                        } else if (lastmessages.getMessagetype() == "Vedio") {
                            chatList.setLastText("[小视频]");//从数据库里取最后一条消息
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
                            chatList.setIsFailure(chatLists.get(0).getIsFailure());
                            chatList.setIsRead(chatLists.get(0).getIsRead());
                            chatList.setMessagetype(chatLists.get(0).getMessagetype());
                        } else {
                            chatList.setId(lastmessages.getSessionid());
                            if (lastmessages.getType() == "Group") {
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
                            chatList.setIsFailure(lastmessages.getIsFailure());
                            chatList.setIsRead(lastmessages.getIsread());
                            chatList.setMessagetype(lastmessages.getMessagetype());
                        }
                        chatListService.saveObj(chatList);//保存chatlist对象
                    } else {
                        //TODO 保存新群组信息失败
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    ToastUtil.showSafeToast("");
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 转换LatestMsg
     *
     * @param result
     * @return
     */
    private static List<MsgJS> switchLatestMsg(LatestMsgBean result) {
        List<MsgJS> msgList = new ArrayList<MsgJS>();
        LatestMsgBean.Event event = result.getEvent();
        if (event != null && event.getMsgList() != null && event.getMsgList().size() > 0) {
            for (LatestMsgBean.Msg msg : event.getMsgList()) {
                MsgJS reqMsg = new MsgJS();
                reqMsg.setFromID(msg.getFrom());
                reqMsg.setFromName(msg.getFromName());
                reqMsg.setMsg(msg.getMessage());
                reqMsg.setMsgDate(msg.getWhen());
                reqMsg.setMsgType(msg.getMediaType());
                msgList.add(reqMsg);
            }
        }
        return msgList;
    }

    /**
     * 获取消息媒体类型
     *
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
     *
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
     * 从服务器获取通知消息
     *
     * @param args
     * @param callbackContext
     */
    public void getNotifyMsg(final JSONArray args, final CallbackContext callbackContext) {

        try {
            String date = args.getString(0);
            boolean isAttention = args.getBoolean(1);
            String fromId = args.getString(2);
            int pageNum = args.getInt(3);
            int pageCount = args.getInt(4);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetExtMsg").getParamsMap();
            paramsMap.put("date", date);
            paramsMap.put("isAttention", isAttention);
            paramsMap.put("fromId", fromId);
            paramsMap.put("pageNo", pageNum);
            paramsMap.put("pageSize", pageCount);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<ExtMsgBean>() {
                @Override
                public void onSuccess(Request request, ExtMsgBean result) {
                    if (result.isSucceed()) {
                        try {
                            ExtMsgJS extMsgJS = switchExtJS(result);
                            String json = GsonUtils.toJson(extMsgJS, ExtMsgJS.class);
                            setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                        } catch (Exception e) {
                            setResult("获取失败！", PluginResult.Status.ERROR, callbackContext);
                            e.printStackTrace();
                        }
                    } else {
                        setResult("获取失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("获取失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }

    }

    /**
     * 转换通知消息
     *
     * @param result
     */
    private ExtMsgJS switchExtJS(ExtMsgBean result) {
        ExtMsgJS extMsgJS = new ExtMsgJS();
        extMsgJS.setResult(true);
        extMsgJS.setMsgLeave(result.getMsgLeave());
        extMsgJS.setMsgTotal(result.getMsgTotal());
        List<ExtMsgJS.MsgJS> msgList = new ArrayList<ExtMsgJS.MsgJS>();
        List<ExtMsgBean.Msg> msgList1 = result.getMsgList();
        if (msgList1 != null && msgList1.size() > 0) {
            for (ExtMsgBean.Msg msg : msgList1) {
                ExtMsgJS.MsgJS msgJS = new ExtMsgJS.MsgJS();
                msgJS.setToped(msg.isToped());
                msgJS.setTitle(msg.getTitle());
                msgJS.setAttention(msg.isAttention());
                msgJS.setFromID(msg.getFrom());
                msgJS.setFromName(msg.getFromName());
                msgJS.setLevel(msg.getMsgLevel());
                msgJS.setLevelName(msg.getLevelName());
                msgJS.setLink(msg.getLink());
                msgJS.setLinkType(msg.getLinkType());
                msgJS.setMsg(msg.getMessage());
                msgJS.setMsgDate(msg.getWhen());
                msgJS.setMsgId(msg.getMsgId());
                msgJS.setReaded(msg.isRead());
                msgList.add(msgJS);
            }
        }
        extMsgJS.setMsgList(msgList);
        return extMsgJS;
    }

    /**
     * 设置已读 未读消息
     *
     * @param args
     * @param callbackContext
     */
    public void setNotifyMsg(JSONArray args, final CallbackContext callbackContext) {

        try {
            String msgId = args.getString(0);
            boolean setReaded = args.getBoolean(1);
            String setToped = args.getString(2);
            String setAttention = args.getString(3);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("SetExtMsg").getParamsMap();
            paramsMap.put("msgId", msgId);
            paramsMap.put("setReaded", setReaded);
            if (setToped != null && setToped.equals("T")) {
                paramsMap.put("setToped", true);
            } else if (setToped != null && setToped.equals("F")) {
                paramsMap.put("setToped", false);
            }
            if (setAttention != null && setAttention.equals("T")) {
                paramsMap.put("setAttention", true);
            } else if (setAttention != null && setAttention.equals("F")) {
                paramsMap.put("setAttention", false);
            }
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<Map<String, Object>>() {
                @Override
                public void onSuccess(Request request, Map<String, Object> result) {
                    Object succeed = result.get("Succeed");
                    try {
                        JSONObject jsonObject = new JSONObject("{\"msgId\":\"" + String.valueOf(result.get("Event")) + "\",\"result\":\"" + ((Boolean) succeed).booleanValue() + "\"}");
                        setResult(jsonObject, PluginResult.Status.OK, callbackContext);
                    } catch (Exception e) {
                        setResult("获取失败！", PluginResult.Status.ERROR, callbackContext);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("获取失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }

    }


    /**
     * 获取人员确认 未确认列表
     *
     * @param args
     * @param callbackContext
     */
    public void getMsgReadList(JSONArray args, final CallbackContext callbackContext) {
        try {
            String msgId = args.getString(0);
            boolean isReaded = args.getBoolean(1);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetExtMsgReadList").getParamsMap();
            paramsMap.put("msgId", msgId);
            paramsMap.put("isReaded", isReaded);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<ReadList>() {
                @Override
                public void onSuccess(Request request, ReadList result) {
                    if (result.isSucceed()) {
                        try {
                            ReadListJS readListJS = switchReadList(result);
                            String json = GsonUtils.toJson(readListJS, ReadListJS.class);
                            setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                        } catch (Exception e) {
                            setResult("获取失败！", PluginResult.Status.ERROR, callbackContext);
                            e.printStackTrace();
                        }
                    } else {
                        setResult("获取失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("获取失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }

    }

    private ReadListJS switchReadList(ReadList result) {
        ReadListJS readListJS = new ReadListJS();
        readListJS.setResult(true);
        readListJS.setMsgId(result.getEvent().getMsgId());
        List<ReadListJS.ReadUserJS> userListJS = new ArrayList<ReadListJS.ReadUserJS>();
        List<ReadList.ReadUserJS> userList = result.getEvent().getUserList();
        if (userList != null && userList.size() > 0) {
            for (ReadList.ReadUserJS readUserJS : userList) {
                ReadListJS.ReadUserJS readUser = new ReadListJS.ReadUserJS();
                readUser.setUserID(readUserJS.getId());
                readUser.setUserName(readUserJS.getDisplayName());
                userListJS.add(readUser);
            }
        }
        readListJS.setUserList(userListJS);
        return readListJS;
    }

    /**
     * 创建群组
     *
     * @param args
     * @param callbackContext
     */
    public void addGroup(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String groupName = args.getString(0);
            JSONArray deptsArr = args.getJSONArray(1);
            JSONArray membersArr = args.getJSONArray(2);
            List<String> depts = jsonArray2List(deptsArr);
            List<String> members = jsonArray2List(membersArr);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("AddGroup").getParamsMap();
            paramsMap.put("groupName", groupName);
            paramsMap.put("depts", depts);
            paramsMap.put("members", members);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<AddGroup>() {
                @Override
                public void onSuccess(Request request, AddGroup result) {
                    if (result.isSucceed()) {
                        String groupID = result.getEvent();
                        if (groupID != null && !"".equals(groupID.trim())) {
                            MqttTopicRW.append(IMSwitchLocal.getATopic(MType.G, groupID), 2);
                        }
                        setResult(groupID, PluginResult.Status.OK, callbackContext);
                    } else if ("711".equals(result.getErrCode())) {
                        setResult("创建的群组必须大于2人（包括自己）！", PluginResult.Status.ERROR, callbackContext);
                    } else if ("712".equals(result.getErrCode())) {
                        setResult("创建的群组超过了20人！", PluginResult.Status.ERROR, callbackContext);
                    } else {
                        setResult("创建群组失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("创建群组失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取群组（列表）信息
     *
     * @param args
     * @param callbackContext
     */
    public void getGroup(final JSONArray args, final CallbackContext callbackContext) {
        try {
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetGroup").getParamsMap();
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<String>() {
                @Override
                public void onSuccess(Request request, String result) {
                    ToastUtil.showSafeToast("success");
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    ToastUtil.showSafeToast("err");
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 修改群信息
     *
     * @param args
     * @param callbackContext
     */
    public void modifyGroup(final JSONArray args, final CallbackContext callbackContext) {
        try {
            //参数解析
            String groupType = args.getString(0);
            String groupID = args.getString(1);
            String groupName = args.getString(2);
            groupName = ("null".equals(groupName) ? null : groupName);
            String groupText = args.getString(3);
            groupText = ("null".equals(groupText) ? null : groupText);
            //数据请求
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("ModifyGroup").getParamsMap();
            paramsMap.put("groupId", groupID);
            paramsMap.put("groupType", groupType.substring(0, 1).toUpperCase());
            paramsMap.put("groupName", groupName);
            paramsMap.put("groupText", groupText);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<AddGroup>() {
                @Override
                public void onSuccess(Request request, AddGroup result) {
                    if (result.isSucceed()) {
                        String groupIDN = result.getEvent();
                        setResult(groupIDN, PluginResult.Status.OK, callbackContext);
                    } else {
                        setResult("群信息修改失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("群信息修改失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 解散群组
     *
     * @param args
     * @param callbackContext
     */
    public void removeGroup(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String groupID = args.getString(0);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("RemoveGroup").getParamsMap();
            paramsMap.put("groupId", groupID);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<AddGroup>() {
                @Override
                public void onSuccess(Request request, AddGroup result) {
                    if (result.isSucceed()) {
                        String groupIDN = result.getEvent();
                        setResult(groupIDN, PluginResult.Status.OK, callbackContext);
                    } else if ("741".equals(result.getErrCode())) {
                        setResult("无解散群组权限！", PluginResult.Status.ERROR, callbackContext);
                    } else {
                        setResult("解散群组失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("解散群组失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取群组指定信息
     *
     * @param args
     * @param callbackContext
     */
    public void getGroupUpdate(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String groupType = args.getString(0);
            JSONArray objects = args.getJSONArray(2);
            String groupID = args.getString(1);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetGroupUpdate").getParamsMap();
            paramsMap.put("groupId", groupID);
            paramsMap.put("groupType", groupType.substring(0, 1).toUpperCase());
            paramsMap.put("getObjects", objects);
            paramsMap.put("platform", "A");
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<GroupUpdate>() {
                @Override
                public void onSuccess(Request request, GroupUpdate result) {
                    if (result.isSucceed()) {
                        try {
                            GroupUpdateJS groupUpdateJS = switchGroupUpdate(result);
                            String json = GsonUtils.toJson(groupUpdateJS, new TypeToken<GroupUpdateJS>() {
                            }.getType());
                            setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                        } catch (JSONException e) {
                            setResult("数据错误！", PluginResult.Status.ERROR, callbackContext);
                            e.printStackTrace();
                        }
                    } else {
                        setResult("群已经被解散或请求失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 转换群组更新信息
     *
     * @param result
     */
    private GroupUpdateJS switchGroupUpdate(GroupUpdate result) {
        GroupUpdateJS groupUpdateJS = new GroupUpdateJS();
        groupUpdateJS.setMemsCount(result.getMemsCount());
        groupUpdateJS.setGroupName(result.getGroupName());
        groupUpdateJS.setAdmins(result.getAdmins());
        groupUpdateJS.setCreator(result.getCreator());
        groupUpdateJS.setGroupText(result.getGroupText());
        groupUpdateJS.setMembers(result.getMembers());
        groupUpdateJS.setResult(true);

        List<GroupUpdateJS.User> users = new ArrayList<GroupUpdateJS.User>();
        List<com.tky.mqtt.paho.httpbean.User> users1 = result.getUsers();
        if (users1 != null && users1.size() > 0) {
            for (com.tky.mqtt.paho.httpbean.User user : users1) {
                GroupUpdateJS.User userJS = new GroupUpdateJS.User();
                userJS.setActive(user.isActive());
                userJS.setDeptID(user.getDeptid());
                userJS.setUserID(user.getId());
                userJS.setUserName(user.getDisplayName());
                users.add(userJS);
            }
        }
        groupUpdateJS.setUsers(users);
        return groupUpdateJS;
    }

    /**
     * 群组添加人员（列表）
     *
     * @param args
     * @param callbackContext
     */
    public void groupAddMember(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String groupID = args.getString(0);
            JSONArray deptsArr = args.getJSONArray(1);
            JSONArray membersArr = args.getJSONArray(2);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GroupAddMember").getParamsMap();
            paramsMap.put("groupId", groupID);
            paramsMap.put("depts", deptsArr);
            paramsMap.put("members", membersArr);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<AddGroup>() {
                @Override
                public void onSuccess(Request request, AddGroup result) {
                    if (result.isSucceed()) {
                        String groupIDN = result.getEvent();
                        setResult(groupIDN, PluginResult.Status.OK, callbackContext);
                    } else {
                        setResult("添加群成员失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("添加群成员失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 群组移除人员（列表）
     *
     * @param args
     * @param callbackContext
     */
    public void groupRemoveMember(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String groupID = args.getString(0);
            JSONArray membersArr = args.getJSONArray(1);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GroupRemoveMember").getParamsMap();
            paramsMap.put("groupId", groupID);
            paramsMap.put("members", membersArr);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<AddGroup>() {
                @Override
                public void onSuccess(Request request, AddGroup result) {
                    if (result.isSucceed()) {
                        String groupIDN = result.getEvent();
                        setResult(groupIDN, PluginResult.Status.OK, callbackContext);
                    } else {
                        setResult("移除人员失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("移除人员失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 群组添加管理员（列表）
     *
     * @param args
     * @param callbackContext
     */
    public void groupAddAdmin(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String groupID = args.getString(0);
            JSONArray adminsArr = args.getJSONArray(1);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GroupAddAdmin").getParamsMap();
            paramsMap.put("groupId", groupID);
            paramsMap.put("admins", adminsArr);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<AddGroup>() {
                @Override
                public void onSuccess(Request request, AddGroup result) {
                    if (result.isSucceed()) {
                        String groupIDN = result.getEvent();
                        setResult(groupIDN, PluginResult.Status.OK, callbackContext);
                    } else {
                        setResult("添加管理员失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("添加管理员失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 群组移除管理员（列表）
     *
     * @param args
     * @param callbackContext
     */
    public void groupRemoveAdmin(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String groupID = args.getString(0);
            JSONArray adminsArr = args.getJSONArray(1);
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GroupRemoveAdmin").getParamsMap();
            paramsMap.put("groupId", groupID);
            paramsMap.put("admins", adminsArr);
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<AddGroup>() {
                @Override
                public void onSuccess(Request request, AddGroup result) {
                    if (result.isSucceed()) {
                        String groupIDN = result.getEvent();
                        setResult(groupIDN, PluginResult.Status.OK, callbackContext);
                    } else {
                        setResult("移除管理员失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络错误！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("移除管理员失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取用户所有群组
     *
     * @param args
     * @param callbackContext
     */
    public void getAllGroup(final JSONArray args, final CallbackContext callbackContext) {
        try {
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetAllGroup").getParamsMap();
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<AllGroup>() {
                @Override
                public void onSuccess(Request request, AllGroup result) {
                    if (result.isSucceed()) {
                        List<com.tky.mqtt.paho.httpbean.Group> groupList = result.getEvent();
                        GroupsJS groupsJS = switchGroups(groupList);
                        String json = GsonUtils.toJson(groupsJS, new TypeToken<GroupsJS>() {
                        }.getType());
                        try {
                            setResult(new JSONObject(json), PluginResult.Status.OK, callbackContext);
                        } catch (JSONException e) {
                            setResult("获取群组失败！", PluginResult.Status.ERROR, callbackContext);
                            e.printStackTrace();
                        }
                    } else {
                        setResult("获取群组失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("请求群组失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 将拿到的数据转换为JS需要的群组数据
     *
     * @param groupList
     * @return
     */
    private GroupsJS switchGroups(List<com.tky.mqtt.paho.httpbean.Group> groupList) {
        GroupsJS groupsJS = new GroupsJS();
        List<GroupsJS.Group> list = new ArrayList<GroupsJS.Group>();
        if (groupList != null && groupList.size() > 0) {
            for (com.tky.mqtt.paho.httpbean.Group group : groupList) {
                GroupsJS.Group groupJS = new GroupsJS.Group();
                groupJS.setGroupID(group.getId());
                groupJS.setGroupName(group.getTitle());
                groupJS.setMemsCount(group.getSize());
                try {
                    groupJS.setMyGroup(group.getCreator().equals(getUserID()));
                } catch (JSONException e) {
                    groupJS.setMyGroup(false);
                }
                list.add(groupJS);
            }
        }
        groupsJS.setResult(true);
        groupsJS.setGroupCount(list.size());
        groupsJS.setGroupList(list);
        return groupsJS;
    }

    /**
     * 获取用户所有群组的ID（以  , 连接  例如：101,120,123）
     *
     * @param args
     * @param callbackContext
     */
    public void getAllGroupIds(final JSONArray args, final CallbackContext callbackContext) {
        try {
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetAllGroup").getParamsMap();
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<AllGroup>() {
                @Override
                public void onSuccess(Request request, AllGroup result) {
                    if (result.isSucceed()) {
                        List<com.tky.mqtt.paho.httpbean.Group> groupList = result.getEvent();
                        if (groupList != null && groupList.size() > 0) {
                            StringBuilder sb = new StringBuilder();
                            sb.append("");
                            GroupChatsService groupChatsService = GroupChatsService.getInstance(UIUtils.getContext());
                            for (int i = 0; i < (groupList == null ? 0 : groupList.size()); i++) {
                                com.tky.mqtt.paho.httpbean.Group group = groupList.get(i);
                                GroupChats groupChats = groupChatsService.loadDataByArg(group.getId());
                                if (groupChats == null) {
                                    GroupChats groupChats1 = new GroupChats();
                                    groupChats1.setId(group.getId());
                                    groupChats1.setGroupName(group.getTitle());
                                    groupChats1.setGroupType("Group");
                                    String creator = group.getCreator();
                                    boolean isMyGroup = false;
                                    try {
                                        isMyGroup = getUserID().equals(creator);
                                    } catch (JSONException e) {
                                        e.printStackTrace();
                                    }
                                    groupChats1.setIsmygroup(isMyGroup);
                                    groupChatsService.saveObj(groupChats1);
                                }
                                if (i != groupList.size() - 1) {
                                    sb.append(IMSwitchLocal.getATopic(MType.G, group.getId()) + ",");
                                } else {
                                    sb.append(IMSwitchLocal.getATopic(MType.G, group.getId()));
                                }
                            }
                            setResult(sb.toString(), PluginResult.Status.OK, callbackContext);
                        } else {
                            setResult("", PluginResult.Status.OK, callbackContext);
                        }
                    } else {
                        setResult("获取群组失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("请求群组失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 二维码扫描登录接口
     * TODO 暂时没啥用，删除？
     *
     * @param args
     * @param callbackContext
     */
    public void qrcodeLogin(final JSONArray args, final CallbackContext callbackContext) {
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
        } catch (Exception e) {
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * log异常输出
     */
    public static void sendLog(String errData, String level, String remarks, OKHttpCallBack2<BaseBean> callBack) {
        try {
            Request request = new Request();
            Map<String, Object> paramsMap = ParamsMap.getInstance("PrintLog").getParamsMap();
            paramsMap.put("logId", UIUtils.getUUID());//客户端生成的uuid
            paramsMap.put("platform", "A");//异常来源于哪个客户端
            paramsMap.put("errData", errData);//异常报错信息
            paramsMap.put("appVersion", UIUtils.getVersion());//app版本号
            paramsMap.put("sysVersion", UIUtils.getSystemVersion());//android/ios 系统的版本号(例如：android 4.4)
            paramsMap.put("deviceInfo", UIUtils.getSystemModel());//设备型号(例如：三星)
            paramsMap.put("dateTime", System.currentTimeMillis());//异常报错日期
            paramsMap.put("level", level);//异常等级
            paramsMap.put("remarks", remarks);//备注信息
            request.addParamsMap(paramsMap);
            if (callBack == null) {
                callBack = new OKHttpCallBack2<BaseBean>() {
                    @Override
                    public void onSuccess(Request request, BaseBean result) {//以后有需要再完善
                    }

                    @Override
                    public void onFailure(Request request, Exception e) {//以后有需要再完善
                    }
                };
            }
            OKAsyncClient.post(request, callBack);
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }


    /**
     * 登陆成功以后添加获取sessionid的接口
     */
    public void getSession(final String loginAccount, final String loginName) {
        try {
            /**
             * 1.登陆成功以后，调用getsession接口获取sessionid
             * 2.定义xml文件存放的路径，将ssid和userid写进qmhapp.xml
             */
            Request request1 = new Request();
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetSession").getParamsMap();
            request1.addParamsMap(paramsMap);
            OKAsyncClient.post(request1, new OKHttpCallBack2<BaseBean>() {
                @Override
                public void onSuccess(Request request, BaseBean result) {//以后有需要再完善
                    if (result.isSucceed()) {
                        //调用createxml方法将ssid存进xml文件
                        String path = "/LPREMPLAT";
                        Log.i("获取存入的xml路径", path + "");
                        // 判断emcTemp.xml文件的存在
                        try {
                            ArrayList<String> pathList = new CreateXml().getAllMountedPath();
                            for (String devicePath : pathList) {
                                new CreateXml().createXML(devicePath + path, "qmhapp.xml", getUserID(), loginAccount, loginName);
                            }
                        } catch (Exception e) {
                        }
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {//以后有需要再完善
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * 客户端操作记录接口
     *
     * @param callbackContext
     */
    public void sendOperateLog(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String type = args.getString(0);
            long when = args.getLong(1);
            String appId = args.getString(2);
            Request request = new Request();
            Map<String, Object> paramsMap = ParamsMap.getInstance("OperateLog").getParamsMap();
            paramsMap.put("type", type);//操作类型：AppVisit：应用访问;Other：其他
            paramsMap.put("platform", "A");//来源于哪个客户端
            paramsMap.put("when", when);//点击时间
            paramsMap.put("appId", appId);//来源应用的唯一标识id
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<BaseBean>() {
                @Override
                public void onSuccess(Request request, BaseBean result) {//以后有需要再完善
                    if (result.isSucceed()) {
                        setResult("success", PluginResult.Status.OK, callbackContext);
                    } else {
                        setResult("error", PluginResult.Status.ERROR, callbackContext);
                    }

                }

                @Override
                public void onFailure(Request request, Exception e) {//以后有需要再完善
                    setResult("error", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }


    //以下为工具方法

    /**
     * 是否需要升级，传入的新老版本都要以数字和小数点组合
     *
     * @param oldVersionName
     * @param newVersionName
     * @return
     */
    private boolean isNeedsUpgrade(String oldVersionName, String newVersionName) {
        String[] oldStr = oldVersionName.split("\\.");
        String[] newStr = newVersionName.split("\\.");
        boolean flag = false;
        for (int i = 0; i < (newStr.length <= oldStr.length ? newStr.length : oldStr.length); i++) {
            if (Integer.parseInt(newStr[i]) > Integer.parseInt(oldStr[i])) {
                flag = true;
                break;
            } else if (Integer.parseInt(newStr[i]) < Integer.parseInt(oldStr[i])) {
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
                    } else {
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
     *
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
     *
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
     *
     * @param obj
     * @return
     * @throws JSONException
     */
    public static Map<String, String> jsonobj2Map(JSONObject obj) throws JSONException {
        Map<String, String> map = new HashMap<String, String>();
        for (Iterator<String> keys = obj.keys(); keys.hasNext(); ) {
            String key = keys.next();
            String value = obj.getString(key);
            map.put(key, value);
        }
        return map;
    }

    /**
     * 获取当前登录用户的deptID
     *
     * @return
     * @throws JSONException
     */
    public String getDeptID() throws JSONException {
        JSONObject userInfo = getUserInfo();
        return userInfo.getString("deptID");
    }

    /**
     * 获取当前登录的用户ID
     *
     * @return
     */
    public static String getUserID() throws JSONException {
        JSONObject userInfo = getUserInfo();
        return (userInfo == null || !userInfo.has("userID")) ? null : userInfo.getString("userID");
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
     */
    public void openFile(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String fileName = args.getString(0);
            String path = Environment.getExternalStorageDirectory().getPath() + "/" + fileName;
            if (fileName != null && !"".equals(fileName)) {
                boolean flag = UIUtils.openFile(path);
                if (flag) {
                    setResult("true", PluginResult.Status.OK, callbackContext);
                } else {
                    setResult("文件不存在！", PluginResult.Status.ERROR, callbackContext);
                }
            } else {
                setResult("文件名称不能为空！", PluginResult.Status.ERROR, callbackContext);
            }
        } catch (JSONException e) {
            setResult("参数错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("数据异常！", PluginResult.Status.ERROR, callbackContext);
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
    public void SetDeptInfo(final JSONArray args, final CallbackContext callbackContext) {
        //登录成功以后，将部门群消息入库，群组消息在登录成功以后就入库
        try {
            Request request = new Request(cordova.getActivity());
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetDepartment").getParamsMap();
            paramsMap.put("deptId", getDeptID());
            request.addParamsMap(paramsMap);
            OKAsyncClient.post(request, new OKHttpCallBack2<DepartmentBean>() {
                @Override
                public void onSuccess(Request request, DepartmentBean result) {
                    if (result.isSucceed()) {
                        GroupChats groupChats = new GroupChats();
                        groupChats.setId(result.getEvent().getId());
                        groupChats.setGroupName(result.getEvent().getName());
                        groupChats.setIsmygroup(false);
                        groupChats.setGroupType("Dept");
                        GroupChatsService groupChatsService = GroupChatsService.getInstance(UIUtils.getContext());
                        groupChatsService.saveObj(groupChats);
                        setResult("success", PluginResult.Status.OK, callbackContext);
                    } else {
                        setResult("获取部门信息失败！", PluginResult.Status.ERROR, callbackContext);
                    }
                }

                @Override
                public void onFailure(Request request, Exception e) {
                    setResult("网络异常！", PluginResult.Status.ERROR, callbackContext);
                }
            });
        } catch (JSONException e) {
            setResult("部门数据解析异常！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            setResult("获取部门信息失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        }
    }

    /**
     * 获取欢迎页图片
     *
     * @param args
     * @param callbackContext
     */
    public void getWelcomePic(final JSONArray args, final CallbackContext callbackContext) {

        BufferedInputStream bis = null;
        FileOutputStream fos = null;
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            String picUserID = args.getString(0);//查询的是谁的图片
            String picSize = args.getString(1);//图片尺寸，40*40，60*60，120*120
            //String downloadpath="http://imtest.crbim.win:1666/DownloadFile?fileId="+picUserID+"&type=StartPic&offset=0";
            String downloadpath = Constants.commonfileurl + "/DownloadFile?fileId=" + picUserID + "&type=StartPic&offset=0";
            URL url = new URL(downloadpath);
            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();

            httpURLConnection.setDoInput(true);
            httpURLConnection.setRequestMethod("GET");
            httpURLConnection.connect();
            if (httpURLConnection.getResponseCode() == 200) {

                String filenamedd = httpURLConnection.getHeaderField("filename");
                String filesize = httpURLConnection.getHeaderField("filesize");
                if (filenamedd == null && filesize == null) {
                    //说明是最新图片


                } else {
                    bis = new BufferedInputStream(httpURLConnection.getInputStream());
                    byte[] buffer = new byte[1024 * 8];

                    int c = bis.read(buffer);
                    if (c == -1) {
                        SPUtils.save("welcomePic", "");
                        SPUtils.save("varyName", "");
                        return;
                    } else {
                        baos.write(buffer, 0, c);
                        baos.flush();
                    }
                    while ((c = bis.read(buffer)) != -1) {

                        baos.write(buffer, 0, c);

                        baos.flush();

                    }
                    String iconDir = FileUtils.getIconDir() + File.separator + "welcome";
                    File directory = new File(iconDir);
                    if (!directory.exists()) {
                        directory.mkdirs();
                    }

                    String[] listarr = directory.list();
                    if (listarr.length > 0 || listarr != null) {
                        for (int i = 0; i < listarr.length; i++) {
                            File temp = new File(iconDir + File.separator + listarr[i]);
                            temp.delete();
                        }
                    }
                    String fileName = iconDir + File.separator + filenamedd;
                    File file = new File(fileName);
                    if (!file.exists()) {
                        file.createNewFile();
                    }
                    byte[] fileByte = baos.toByteArray();
                    fos = new FileOutputStream(file);
                    fos.write(fileByte);
                    SPUtils.save("welcomePic", fileName);
                    SPUtils.save("varyName", filenamedd);

                    setResult("成功", PluginResult.Status.OK, callbackContext);
                }

            } else {
                SPUtils.save("varyName", "");
            }

        } catch (MalformedURLException e) {
            SPUtils.save("varyName", "");
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (IOException e) {
            SPUtils.save("varyName", "");
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (JSONException e) {
            SPUtils.save("varyName", "");
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
        } catch (Exception e) {
            SPUtils.save("varyName", "");
            setResult("未知错误！", PluginResult.Status.ERROR, callbackContext);
        } finally {
            if (fos != null) {
                try {
                    fos.close();
                    fos = null;
                } catch (IOException e) {
                    SPUtils.save("varyName", "");
                    setResult("网络异常", PluginResult.Status.ERROR, callbackContext);
                    e.printStackTrace();
                }
            }
        }
    }


    /**
     * 设置返回信息
     *
     * @param result          返回结果数据
     * @param resultStatus    返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    public void setResult(String result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     *
     * @param result          返回结果数据
     * @param resultStatus    返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    public void setResult(JSONObject result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     *
     * @param result          返回结果数据
     * @param resultStatus    返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    private void setResult(JSONArray result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     *
     * @param result          返回结果数据
     * @param resultStatus    返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    private void setResult(int result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     *
     * @param result          返回结果数据
     * @param resultStatus    返回结果状态  PluginResult.Sgetatus.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    private void setResult(long result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     *
     * @param result          返回结果数据
     * @param resultStatus    返回结果状态  PluginResult.Sgetatus.ERROR / PluginResult.Status.OK
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
        } else if ("Platform".equals(type)) {
            return "P";
        } else {
            return "U";
        }
    }

}
