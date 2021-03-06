package com.tky.mqtt.chat;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.MediaPlayer;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.text.format.Formatter;
import android.util.Log;
import android.widget.Toast;

import com.google.gson.Gson;
import com.maiml.wechatrecodervideolibrary.recoder.WechatRecoderActivity;
import com.tky.im.connection.IMConnection;
import com.tky.im.enums.IMEnums;
import com.tky.im.params.ConstantsParams;
import com.tky.im.receiver.IMReceiver;
import com.tky.im.service.IMService;
import com.tky.im.utils.IMBroadOper;
import com.tky.im.utils.IMStatusManager;
import com.tky.im.utils.IMSwitchLocal;
import com.tky.mqtt.dao.Messages;
import com.tky.mqtt.paho.MType;
import com.tky.mqtt.paho.MqttNotification;
import com.tky.mqtt.paho.MqttReceiver;
import com.tky.mqtt.paho.MqttTopicRW;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.callback.OKHttpCallBack2;
import com.tky.mqtt.paho.http.OKAsyncClient;
import com.tky.mqtt.paho.http.Request;
import com.tky.mqtt.paho.httpbean.ParamsMap;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.receiver.DocFileReceiver;
import com.tky.mqtt.paho.receiver.MqttSendMsgReceiver;
import com.tky.mqtt.paho.receiver.PhotoFileReceiver;
import com.tky.mqtt.paho.receiver.ProxySensorReceiver;
import com.tky.mqtt.paho.receiver.VideoFileReceiver;
import com.tky.mqtt.paho.utils.FileUtils;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.paho.utils.MqttOper;
import com.tky.mqtt.paho.utils.NetUtils;
import com.tky.mqtt.paho.utils.PhotoUtils;
import com.tky.mqtt.paho.utils.RecorderManager;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 通讯插件
 * This class echoes a string called from JavaScript.
 */
public class MqttChat extends CordovaPlugin {
  /**
   * 是否已经登录
   */
  private static boolean hasLogin = false;
  /**
   * 打开文件管理器请求码
   */
  private int FILE_SELECT_CODE = 0x0111;
  private DocFileReceiver docFileReceiver;
  private PhotoFileReceiver photoFileReceiver;
  private VideoFileReceiver videoFileReceiver;
//  private NetStatusChangeReceiver netStatusChangeReceiver;
//  private MqttConnectReceiver mqttConnectReceiver;
  private MqttSendMsgReceiver topicReceiver;
//  private MqttReceiver mqttReceiver;
  private IMReceiver imReceiver;
  /**
   * 距离传感器改变时收到的Receiver
   */
  private ProxySensorReceiver mSensorReceiver;
  private OnPlayStopReceiver onPlayStopReceiver;

  @Override
  public void initialize(final CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    setHasLogin(false);
//    mqttReceiver = MqttReceiver.getInstance();
    docFileReceiver = new DocFileReceiver();
    IntentFilter filter = new IntentFilter();
    filter.addAction(ReceiverParams.DOC_FILE_GET);
    UIUtils.getContext().registerReceiver(docFileReceiver, filter);
    //拍照后的图片广播
    photoFileReceiver = new PhotoFileReceiver();
    IntentFilter photoFilter = new IntentFilter();
    photoFilter.addAction(ReceiverParams.PHOTO_FILE_GET);
    UIUtils.getContext().registerReceiver(photoFileReceiver, photoFilter);

    //录制小视频广播
    videoFileReceiver = new VideoFileReceiver();
    IntentFilter videoFilter = new IntentFilter();
    videoFilter.addAction(ReceiverParams.VIDEO_FILE_GET);
    UIUtils.getContext().registerReceiver(videoFileReceiver, videoFilter);

//    netStatusChangeReceiver = new NetStatusChangeReceiver();
//    IntentFilter netStatusChangeFilter = new IntentFilter();
//    netStatusChangeFilter.addAction(ReceiverParams.NET_CONNECTED);
//    netStatusChangeFilter.addAction(ReceiverParams.NET_DISCONNECTED);
//    UIUtils.getContext().registerReceiver(netStatusChangeReceiver, netStatusChangeFilter);

//    mqttConnectReceiver = new MqttConnectReceiver();
//    IntentFilter mqttConnectFilter = new IntentFilter();
//    mqttConnectFilter.addAction(ReceiverParams.RECEIVER_MQTT_STARTED);
//    mqttConnectFilter.addAction(ReceiverParams.RECEIVER_MQTT_CLOSED);
//    UIUtils.getContext().registerReceiver(mqttConnectReceiver, mqttConnectFilter);

    //发布消息的广播
    topicReceiver = new MqttSendMsgReceiver();
    IntentFilter topicFilter = new IntentFilter();
    topicFilter.addAction(ReceiverParams.SENDMESSAGE_ERROR);
    topicFilter.addAction(ReceiverParams.SENDMESSAGE_SUCCESS);
    UIUtils.getContext().registerReceiver(topicReceiver, topicFilter);

    //距离传感器改变时收到的Receiver
    mSensorReceiver = ProxySensorReceiver.getInstance();

    //特殊因素导致语音播放暂停的广播
    onPlayStopReceiver = new OnPlayStopReceiver();
    IntentFilter playStopFilter = new IntentFilter();
    playStopFilter.addAction(ReceiverParams.RECEIVER_PLAY_STOP);
    UIUtils.getContext().registerReceiver(onPlayStopReceiver, playStopFilter);

    //新版本IM的广播接收者
    imReceiver = new IMReceiver();
    IntentFilter imFilter = new IntentFilter();
    imFilter.addAction(ConstantsParams.PARAM_RECEIVE_MESSAGE);
    imFilter.addAction(ConstantsParams.PARAM_CONNECT_SUCCESS);
    imFilter.addAction(ConstantsParams.PARAM_CONNECT_FAILURE);
    imFilter.addAction(ConstantsParams.PARAM_IM_DOWN);
    imFilter.addAction(ConstantsParams.PARAM_NET_DOWN);
    imFilter.addAction(ConstantsParams.PARAM_NET_UP);
    UIUtils.getContext().registerReceiver(imReceiver, imFilter);
  }

  @Override
  public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {

    cordova.getThreadPool().execute(new Runnable() {
      @Override
      public void run() {
        try {
          Method method = MqttChat.class.getDeclaredMethod(action, JSONArray.class, CallbackContext.class);
          method.invoke(MqttChat.this, args, callbackContext);
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
   * 保存数据
   *
   * @param args
   * @param callbackContext
   */
  public void save(final JSONArray args, final CallbackContext callbackContext) {
    if (args != null) {
      try {
        String key = args.getString(0);
        String value = args.getString(1);
        SPUtils.save(key, value);
        setResult(key + "#" + value, PluginResult.Status.OK, callbackContext);
      } catch (JSONException e) {
        setResult("JSONError", PluginResult.Status.ERROR, callbackContext);
        e.printStackTrace();
      }
    } else {
      setResult("NULLPointerException", PluginResult.Status.ERROR, callbackContext);
    }
  }

  /**
   * 保存数据
   *
   * @param args
   * @param callbackContext
   */
  public void saveInt(final JSONArray args, final CallbackContext callbackContext) {
    if (args != null) {
      try {
        String key = args.getString(0);
        int value = args.getInt(1);
        SPUtils.save(key,value);
        setResult(key + "#" + value, PluginResult.Status.OK, callbackContext);
      } catch (JSONException e) {
        setResult("JSONError", PluginResult.Status.ERROR, callbackContext);
        e.printStackTrace();
      }
    } else {
      setResult("NULLPointerException", PluginResult.Status.ERROR, callbackContext);
    }
  }

  /**
   * 保存登录的用户名
   *
   * @param args
   * @param callbackContext
   */
  public void saveLogin(final JSONArray args, final CallbackContext callbackContext) {
    if (args != null) {
      try {
        String key = args.getString(0);
        String value = args.getString(1);
        SPUtils.save(key, value);
        if (value != null && !TextUtils.isEmpty(value.trim())) {
          SPUtils.save("historyusername", value);
        }
        setResult(key + "#" + value, PluginResult.Status.OK, callbackContext);
      } catch (JSONException e) {
        setResult("JSONError", PluginResult.Status.ERROR, callbackContext);
        e.printStackTrace();
      }
    } else {
      setResult("NULLPointerException", PluginResult.Status.ERROR, callbackContext);
    }
  }

  /**
   * 获取保存的数据
   *
   * @param args
   * @param callbackContext
   */
  public void getString(final JSONArray args, final CallbackContext callbackContext) {
    if (args != null) {
      try {
        String key = args.getString(0);
        if (key != null) {
          setResult(SPUtils.getString(key, ""), PluginResult.Status.OK, callbackContext);
        } else {
          setResult("key is null", PluginResult.Status.ERROR, callbackContext);
        }
      } catch (JSONException e) {
        setResult("JSONError", PluginResult.Status.ERROR, callbackContext);
        e.printStackTrace();
      }
    } else {
      setResult("args is null", PluginResult.Status.ERROR, callbackContext);
    }
  }


  public void getInt(final JSONArray args, final CallbackContext callbackContext) {
    if (args != null) {
      try {
        String key = args.getString(0);
        if (key != null) {
          setResult(SPUtils.getInt(key, 0), PluginResult.Status.OK, callbackContext);
        } else {
          setResult("key is null", PluginResult.Status.ERROR, callbackContext);
        }
      } catch (JSONException e) {
        setResult("JSONError", PluginResult.Status.ERROR, callbackContext);
        e.printStackTrace();
      }
    } else {
      setResult("args is null", PluginResult.Status.ERROR, callbackContext);
    }
  }

  /**
   * 传入用户ID（topicID），启动服务  创建mqtt连接
   */
  public void startMqttChat(final JSONArray args, final CallbackContext callbackContext) throws JSONException {
    //只允许登录一次
    if (hasLogin) {
      MqttPluginResult pluginResult = new MqttPluginResult(PluginResult.Status.ERROR, "hasLogin");
      pluginResult.setKeepCallback(true);
      callbackContext.sendPluginResult(pluginResult);
      return;
    }
    final String topicId = args.getString(0);
    if (topicId != null && !"".equals(topicId.trim())) {
      MqttTopicRW.writeTopicsAndQos(null, null);
      if (UIUtils.isServiceWorked(IMService.class.getName())) {
        IMBroadOper.broad(ConstantsParams.PARAM_STOP_IMSERVICE);
        try {
          Thread.sleep(50);
        } catch (InterruptedException e) {
          e.printStackTrace();
        }
      }
      String[] topics = topicId.split(",");
            /*cordova.getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(cordova.getActivity(), topicId, Toast.LENGTH_SHORT).show();
                }
            });*/
      int[] qoss = new int[topics.length];
      for (int i = 0; i < topics.length; i++) {
        qoss[i] = 2;
                /*if (!"zhuanjiazu".equals(topics[i].trim())){
                    qoss[i] = 2;
                } else {
                    qoss[i] = 2;
                }*/
      }
//      MqttRobot.setConnectionType(ConnectionType.MODE_NONE);
//      IMStatusManager
      MqttTopicRW.writeTopicsAndQos(topics, qoss);
      cordova.getActivity().runOnUiThread(new Runnable() {
        @Override
        public void run() {
          //链接mqtt
//          cordova.getActivity().startService(new Intent(cordova.getActivity(), MqttService.class));
          IMStatusManager.setImStatus(IMEnums.INIT);//设置MQTT初始状态
          cordova.getActivity().startService(new Intent(cordova.getActivity(), IMService.class));//启动mqtt服务
          hasLogin = true;
          MqttPluginResult pluginResult = new MqttPluginResult(PluginResult.Status.OK, "success");
          pluginResult.setKeepCallback(true);
          callbackContext.sendPluginResult(pluginResult);
        }
      });
    } else {
      MqttPluginResult pluginResult = new MqttPluginResult(PluginResult.Status.ERROR, "error");
      pluginResult.setKeepCallback(true);
      callbackContext.sendPluginResult(pluginResult);
    }
  }

  /**
   * 重启MQTT
   *
   * @param args
   * @param callbackContext
   * @throws JSONException
   */
  public void restartMqtt(final JSONArray args, final CallbackContext callbackContext) throws JSONException {
    MqttOper.resetMqtt();
  }

  /**
   * 停止MqttChat的服务
   */
  /*public void stopMqttChat() {
  }*/

  //    int count = 0;
  public void sendMsg(final JSONArray args, final CallbackContext callbackContext) throws JSONException {
    String tosb = args.getString(0);
    final String message = args.getString(1);
    if (tosb == null || "".equals(tosb)) {
      ToastUtil.showSafeToast("接收者未知！");
      return;
    }
    if (message == null || "".equals(message.trim())) {
      ToastUtil.showSafeToast("消息内容不能为空！");
      return;
    }
    JSONObject obj = new JSONObject(message);
    String msg = obj.getString("message");
    if (msg == null || "".equals(msg.trim())) {
      return;
    }
    //消息发送过程中，网络信号减弱，数据回调
    topicReceiver.setOnMqttSendErrorListener(new MqttSendMsgReceiver.OnMqttSendErrorListener() {
      @Override
      public void onMqttSendSuccess(String msg) {
        try {
          setResult(new JSONObject(msg), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }

      @Override
      public void onMqttSendError(String msg) {
//                count++;
        try {
          setResult(new JSONObject(msg), PluginResult.Status.ERROR, callbackContext);
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }
    });
    /**若是群聊的消息则判断是否是自建群，若不是则通知栏提醒*/
    if ("Group".equals(obj.getString("type"))) {
      boolean fromMe = MqttTopicRW.isFromMe("Group", obj.getString("sessionid"));
      if (!fromMe) {
        String errMSG = switchMsg(message, false);
        MqttOper.sendErrNotify(errMSG);
        //setResult(jsonObject, PluginResult.Status.ERROR, callbackContext);
        return;
      }
    }
    IMBroadOper.broadSendMsg(tosb, message);
//    try {
//      MessageOper.sendMsg(tosb, message);
//    } catch (IMPException e) {
//      setResult("failure", PluginResult.Status.ERROR, callbackContext);
//      e.printStackTrace();
//      return;
//    }
  }


  private String switchMsg(String msg, boolean sendStatus) {
    Messages messages = GsonUtils.fromJson(msg, Messages.class);
    messages.setIsFailure(sendStatus ? "false" : "true");
    messages.setIsSuccess(sendStatus ? "true" : "false");
    return GsonUtils.toJson(messages, Messages.class);

  }

  /**
   * 将收到的消息写到文件中
   *
   * @param text
   * @throws IOException
   */
  private void saveToFile(String text) throws IOException {
    File file = new File(FileUtils.getDownloadDir() + File.separator + "senderror.txt");
    if (!file.exists()) {
      file.createNewFile();
    }
    FileOutputStream fos = new FileOutputStream(file, true);
    fos.write(((text == null || "".equals(text.trim())) ? "\r\nnotext" : "\r\n" + text).getBytes());
    fos.flush();
  }

  public void getChats(final JSONArray args, final CallbackContext callbackContext) {
//    mqttReceiver.setOnMessageArrivedListener(new MqttReceiver.OnMessageArrivedListener() {
//      @Override
//      public void messageArrived(String topic, final String content, int qos) {
//
//        cordova.getThreadPool().execute(new Runnable() {
//          @Override
//          public void run() {
//            try {
//              setResult(new JSONObject(content), PluginResult.Status.OK, callbackContext);
//            } catch (JSONException e) {
//              e.printStackTrace();
//            }
//          }
//        });
//
//      }
//    });

    imReceiver.setOnMessageReceivedListener(new IMReceiver.OnMessageReceivedListener() {
      @Override
      public void onReceive(String topic, String content, int qos) {
        try {
          setResult(new JSONObject(content), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }
    });

    if (isConnect(cordova.getActivity().getBaseContext())) {

      return;
    } else {
      callbackContext.error("Expected one non-empty string argument.");
    }
  }

  /**
   * 断开MQTT连接并解除用户的绑定
   *
   * @param args
   * @param callbackContext
   */
  public void disconnect(final JSONArray args, final CallbackContext callbackContext) {

    if (!NetUtils.isConnect(cordova.getActivity())) {
      setResult("网络未连接！", PluginResult.Status.ERROR, callbackContext);
      return;
    }
    hasLogin = false;
    final long start = System.currentTimeMillis();
    try {
      Request request = new Request(cordova.getActivity());
      //退出登录，成功：停止mqtt服务，取消通知栏通知，并设置登录状态为false，清空登录信息；失败：返回一个结果
      Map<String, Object> paramsMap = ParamsMap.getInstance("LoginOff").getParamsMap();
      request.addParamsMap(paramsMap);
      OKAsyncClient.post(request, new OKHttpCallBack2<String>() {
        @Override
        public void onSuccess(Request request, String result) {
          try {
            JSONObject obj = new JSONObject(result);
            if (obj.getBoolean("Succeed")) {
              IMBroadOper.broad(ConstantsParams.PARAM_STOP_IMSERVICE);
              MqttNotification.cancelAll();
              MqttRobot.setIsStarted(false);
              //清空登录信息
//                IMSwitchLocal.clearUserInfo();
              setResult("success", PluginResult.Status.OK, callbackContext);
            } else {
              setResult("退出登录失败！", PluginResult.Status.ERROR, callbackContext);
            }
          } catch (JSONException e) {
            setResult("退出登录失败！", PluginResult.Status.ERROR, callbackContext);
            e.printStackTrace();
          }
        }

        @Override
        public void onFailure(Request request, Exception e) {
          setResult("网络异常，退出登录失败！", PluginResult.Status.ERROR, callbackContext);
        }
      });
    } catch (JSONException e) {
      setResult("退出登录失败！", PluginResult.Status.ERROR, callbackContext);
      e.printStackTrace();
    } catch (Exception e) {
      setResult("退出登录失败！", PluginResult.Status.ERROR, callbackContext);
      e.printStackTrace();
    }
  }

  /**
   * 退出应用
   *
   * @param args
   * @param callbackContext
   */
  public void setExitStartedStatus(final JSONArray args, final CallbackContext callbackContext) {
//    MqttOper.closeMqttConnection();
//    UIUtils.getContext().stopService(new Intent(cordova.getActivity(), MqttService.class));
//    MqttRobot.setConnectionType(ConnectionType.MODE_NONE);
    MqttRobot.setIsStarted(MqttRobot.isStarted());
  }

  /**
   * 获取用户信息
   *
   * @param args
   * @param callbackContext
   */
  public void getUserInfo(final JSONArray args, final CallbackContext callbackContext) {
    try {
      setResult(getLoginInfo(), PluginResult.Status.OK, callbackContext);
    } catch (JSONException e) {
      setResult("未登录或获取用户信息失败！", PluginResult.Status.OK, callbackContext);
      e.printStackTrace();
    }
  }

  /**
   * 获取当前登录用户的topic
   *
   * @param args
   * @param callbackContext
   */
  public void getMyTopic(final JSONArray args, final CallbackContext callbackContext) {
    try {
      String topic = IMSwitchLocal.getATopic(MType.U, getUserID()) + "," + IMSwitchLocal.getATopic(MType.D, getDeptID());
      setResult(topic, PluginResult.Status.OK, callbackContext);
    } catch (JSONException e) {
      setResult("获取失败！", PluginResult.Status.OK, callbackContext);
      e.printStackTrace();
    }
  }

  /**
   * 获取当前登录用户的topic
   *
   * @param args
   * @param callbackContext
   */
  public void getTopic(final JSONArray args, final CallbackContext callbackContext) {
    try {
      Object obj = args.get(0);
      List<String> topics=new ArrayList();
      if (obj != null && obj instanceof JSONArray) {
        String type = args.getString(1);
        for(int i=0;i<((JSONArray) obj).length();i++){
          topics.add(IMSwitchLocal.getATopic(getType(type), (String) ((JSONArray) obj).get(i)));
        }
        JSONArray jsonArray=new JSONArray(topics);
        setResult(jsonArray,PluginResult.Status.OK, callbackContext);
      } else {
        String userID = args.getString(0);
        String type = args.getString(1);
        String topic = IMSwitchLocal.getATopic(getType(type), userID);
        setResult(topic, PluginResult.Status.OK, callbackContext);
      }
    } catch (JSONException e) {
      setResult("获取失败！", PluginResult.Status.OK, callbackContext);
      e.printStackTrace();
    }
  }

  /**
   * 获取当前登录的用户ID
   *
   * @param args
   * @param callbackContext
   */
  public void getUserId(final JSONArray args, final CallbackContext callbackContext) {
    try {
      setResult(getUserID(), PluginResult.Status.OK, callbackContext);
    } catch (JSONException e) {
      setResult("获取用户ID失败！", PluginResult.Status.ERROR, callbackContext);
      e.printStackTrace();
    }
  }

  /**
   * 打开文件管理器
   *
   * @param args
   * @param callbackContext
   */
  public void openDocWindow(final JSONArray args, final CallbackContext callbackContext) {
    UIUtils.runInMainThread(new Runnable() {
      @Override
      public void run() {
//                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//                UIUtils.getContext().startActivity(intent);
                /*Intent intent = new Intent(cordova.getActivity(), DocsManagerActivity.class);
                cordova.getActivity().startActivityForResult(intent, FILE_SELECT_CODE);
                if (docFileReceiver != null) {
                    docFileReceiver.setOnScrachFilePathListener(new DocFileReceiver.OnScrachFilePathListener() {
                        @Override
                        public void onScrachFilePath(String path) {
                            setResult(path, PluginResult.Status.OK, callbackContext);
                        }
                    });
                }*/
        //查看的文件类型，有 *（或者all）、video（视频）
        String type = null;
        try {
          type = args.getString(0);
        } catch (JSONException e) {
          type = "*";
          e.printStackTrace();
        }
        Intent intent = new Intent("image".equals(type) ? Intent.ACTION_PICK : Intent.ACTION_GET_CONTENT, null);
        if ("image".equals(type)) {
          intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
        } else {
          intent.setType((type == null || "".equals(type.trim()) || "all".equals(type) ? "*" : type) + "/*");
          intent.addCategory(Intent.CATEGORY_OPENABLE);
        }

        //显示文件管理器列表
        try {
          cordova.getActivity().startActivityForResult(Intent.createChooser(intent, "请选择一个要上传的文件"), FILE_SELECT_CODE);
        } catch (android.content.ActivityNotFoundException ex) {
          Toast.makeText(UIUtils.getContext(), "请安装文件管理器", Toast.LENGTH_SHORT).show();
        }
        if (docFileReceiver != null) {
          docFileReceiver.setOnScrachFilePathListener(new DocFileReceiver.OnScrachFilePathListener() {
            @Override
            public void onScrachFilePath(String filePath, String length, String formatSize, String fileName) {
              try {
                setResult(new JSONArray("['" + filePath + "','" + length + "','" + formatSize + "','" + fileName + "']"), PluginResult.Status.OK, callbackContext);
              } catch (JSONException e) {
                e.printStackTrace();
              }
            }
          });
        }
      }
    });
  }

  /**
   * 拍照后发送图片需要的数据
   *
   * @param args
   * @param callbackContext
   */
  public void getFileContent(final JSONArray args, final CallbackContext callbackContext) {
    try {
      String filePath = args.getString(0);
      if (filePath.contains("file:///")) {
        filePath = filePath.substring(7);
      }
      File file = new File(filePath);
      if (!file.exists()) {
        //图片不存在
        setResult("-1", PluginResult.Status.ERROR, callbackContext);
        return;
      }
      String cacheDir = FileUtils.getIconDir() + File.separator + "cache";
      File cacheFile = new File(cacheDir);
      if (!cacheFile.exists()) {
        cacheFile.mkdirs();
      }
      FileInputStream fst = null;
      FileOutputStream fost = null;
      File cacheFileDoc = new File(cacheFile, file.getName());
      try {
        fst = new FileInputStream(file);
        fost = new FileOutputStream(cacheFileDoc);
        byte[] buf = new byte[1024 * 10];
        int len = 0;
        while ((len = fst.read(buf)) != -1) {
          fost.write(buf, 0, len);
          fost.flush();
        }
      } catch (FileNotFoundException e) {
        e.printStackTrace();
      } catch (IOException e) {
        e.printStackTrace();
      } finally {
        if (fst != null) {
          try {
            fst.close();
          } catch (IOException e) {
            e.printStackTrace();
          }
        }
        if (fost != null) {
          try {
            fost.close();
          } catch (IOException e) {
            e.printStackTrace();
          }
        }
      }
      //文件的大小
      long length = file.length();
      //格式化文件大小
      String formatSize = Formatter.formatFileSize(cordova.getActivity(), length);
      setResult(new JSONArray("['" + cacheFileDoc.getAbsolutePath().toString() + "','" + length + "','" + formatSize + "','" + (filePath != null && !"".equals(filePath.trim()) ? filePath.substring(filePath.lastIndexOf("/") + 1) : "noname") + "'] "), PluginResult.Status.OK, callbackContext);
    } catch (JSONException e) {
      //JSON解析异常
      setResult("-1", PluginResult.Status.ERROR, callbackContext);
      e.printStackTrace();
    }
  }

  /**
   * 拍照
   *
   * @param args
   * @param callbackContext
   */
  public void takePhoto(final JSONArray args, final CallbackContext callbackContext) {
    PhotoUtils.takePhoto(cordova.getActivity());
    photoFileReceiver.setOnPhotoGetListener(new PhotoFileReceiver.OnPhotoGetListener() {
      @Override
      public void getPhoto(String filePath, String length, String formatSize, String fileName) {
        try {
          setResult(new JSONArray("['" + filePath + "','" + length + "','" + formatSize + "','" + fileName + "']"), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }
    });
  }

  /**
   * 录制小视频
   *
   * @param args
   * @param callbackContext
   */
  public void takeVideo(final JSONArray args, final CallbackContext callbackContext) {
    WechatRecoderActivity.launchActivity(cordova.getActivity(), 0x02001);
    videoFileReceiver.setOnVideoGetListener(new VideoFileReceiver.OnVideoGetListener() {
      @Override
      public void getVideo(String filePath, String length, String formatSize, String fileName) {
        try {
          setResult(new JSONArray("['" + filePath + "','" + length + "','" + formatSize + "','" + fileName + "']"), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }
    });
  }


  public void getIconDir(final JSONArray args, final CallbackContext callbackContext) {
    String dir = FileUtils.getIconDir() + "/screenshot";
    File file = new File(dir);
    if (!file.exists()) {
      file.mkdirs();
    }
    setResult(dir, PluginResult.Status.OK, callbackContext);
  }

  /**
   * 设置MQTT监听（返回true：连接上网；返回false：网络断开了）
   *
   * @param args
   * @param callbackContext
   */
  public void setOnNetStatusChangeListener(final JSONArray args, final CallbackContext callbackContext) {
    if (imReceiver != null) {
      imReceiver.setOnConnectedListener(new IMReceiver.OnConnectedListener() {
        @Override
        public void onConnected() {
          try {
            SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
            Log.e("getstarttime", format.format(new Date()));
            setResult("true", PluginResult.Status.OK, callbackContext);
          } catch (Exception e) {
          }
        }

        @Override
        public void onConnectFailure() {//连接失败
          SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
          Log.e("getendtime", format.format(new Date()));
          setResult("false", PluginResult.Status.ERROR, callbackContext);
        }
      });
      imReceiver.setOnConnectDownListener(new IMReceiver.OnConnectDownListener() {//连接中断
        @Override
        public void onConnectDown() {
          SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
          Log.e("getendtime", format.format(new Date()));
          setResult("false", PluginResult.Status.ERROR, callbackContext);
        }
      });
//      mqttConnectReceiver.setOnMqttStatusChangeListener(new MqttConnectReceiver.OnMqttStatusChangeListener() {
//        @Override
//        public void onMqttStarted() {
//          try {
//            if (MqttRobot.getMqttStatus() == MqttStatus.OPEN) {
//              SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
//              Log.e("getstarttime", format.format(new Date()));
//              setResult("true", PluginResult.Status.OK, callbackContext);
//            }
//          } catch (Exception e) {
//          }
//        }
//
//        @Override
//        public void onMqttClosed() {
//          try {
//            if (MqttRobot.getMqttStatus() == MqttStatus.CLOSE) {
//              SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
//              Log.e("getendtime", format.format(new Date()));
//              setResult("false", PluginResult.Status.ERROR, callbackContext);
//            }
//          } catch (Exception e) {
//          }
//        }
//
//      });
    }
  }

  /**
   * 设置网络监听（返回true：连接上网；返回false：网络断开了）
   *
   * @param args
   * @param callbackContext
   */
  public void setOnNetChangeListener(final JSONArray args, final CallbackContext callbackContext) {
    if (imReceiver != null) {
      imReceiver.setOnNetStatusChangeListener(new IMReceiver.OnNetStatusChangeListener() {
        @Override
        public void onNetUp() {
          try {
            setResult("true", PluginResult.Status.OK, callbackContext);
          } catch (Exception e) {
          }
        }

        @Override
        public void onNetDown() {
          try {
            setResult("false", PluginResult.Status.ERROR, callbackContext);
          } catch (Exception e) {
          }
        }
      });
    }
//    if (netStatusChangeReceiver != null) {
//      netStatusChangeReceiver.setOnNetListener(new NetStatusChangeReceiver.OnNetListener() {
//        @Override
//        public void doNetDisconnect() {
//          try {
//            setResult("false", PluginResult.Status.ERROR, callbackContext);
//          } catch (Exception e) {
//          }
//        }
//
//        @Override
//        public void doNetConnect() {
//          try {
//            setResult("true", PluginResult.Status.OK, callbackContext);
//          } catch (Exception e) {
//          }
//        }
//      });
//    }
  }

  /**
   * 获取MQTT连接状态
   *
   * @param args
   * @param callbackContext
   */
  public void getMqttStatus(final JSONArray args, final CallbackContext callbackContext) {
    if (IMStatusManager.getImStatus() != IMEnums.CONNECTED) {
      setResult("false", PluginResult.Status.OK, callbackContext);
    } else if (IMStatusManager.getImStatus() == IMEnums.CONNECTED) {
      setResult("true", PluginResult.Status.OK, callbackContext);
    }
  }

  /**
   * 开始录音
   *
   * @param args
   * @param callbackContext
   */
  public void startRecording(final JSONArray args, final CallbackContext callbackContext) {
    final RecorderManager manager = RecorderManager.getInstance(cordova.getActivity());
    cordova.getActivity().runOnUiThread(new Runnable() {
      @Override
      public void run() {
        manager.startRecord(manager.createVoicePath(), 0);
      }
    });
    manager.setOnRecorderChangeListener(new RecorderManager.OnRecorderChangeListener() {
      @Override
      public void onTimeChange(final String filePath, long interval, final long recordTime) {
        new Thread(new Runnable() {
          @Override
          public void run() {
            try {
              JSONObject obj = new JSONObject();
              obj.put("type", "timeChange");
              obj.put("filePath", filePath);
              obj.put("recordTime", recordTime);
              setResult(obj, PluginResult.Status.OK, callbackContext);
            } catch (JSONException e) {
              e.printStackTrace();
            }
          }
        }).start();
      }

      @Override
      public void onTimeout(final String filePath, final long interval) {
        new Thread(new Runnable() {
          @Override
          public void run() {
            try {
              JSONObject obj = new JSONObject();
              obj.put("type", "timeout");
              obj.put("filePath", filePath);
              obj.put("time", interval);
              setResult(obj, PluginResult.Status.OK, callbackContext);
            } catch (JSONException e) {
              e.printStackTrace();
            }
          }
        }).start();
      }

      @Override
      public void onRateChange(final String filePath, long interval, final int rate) {
        new Thread(new Runnable() {
          @Override
          public void run() {
            try {
              JSONObject obj = new JSONObject();
              obj.put("type", "rateChange");
              obj.put("filePath", filePath);
              obj.put("rate", rate);
              setResult(obj, PluginResult.Status.OK, callbackContext);
            } catch (JSONException e) {
              e.printStackTrace();
            }
          }
        }).start();
      }

      @Override
      public void onError(final String filePath, long interval, final String error) {
        new Thread(new Runnable() {
          @Override
          public void run() {
            try {
              JSONObject obj = new JSONObject();
              obj.put("type", "error");
              obj.put("filePath", filePath);
              obj.put("error", error);
              setResult(obj, PluginResult.Status.OK, callbackContext);
            } catch (JSONException e) {
              e.printStackTrace();
            }
          }
        }).start();
      }
    });
  }

  /**
   * 结束录音
   *
   * @param args
   * @param callbackContext
   */
  public void stopRecording(final JSONArray args, final CallbackContext callbackContext) {
    cordova.getActivity().runOnUiThread(new Runnable() {
      @Override
      public void run() {
        final RecorderManager manager = RecorderManager.getInstance(cordova.getActivity());
        try {
          manager.stopRecord();
        } catch (Exception e) {
        }
        new Thread(new Runnable() {
          @Override
          public void run() {
            long duration = manager.getDuration();
            try {
              JSONObject obj = new JSONObject();
              obj.put("filePath", manager.getRecordPath());
              obj.put("duration", duration <= 59 * 1000 ? duration : 59 * 1000);
              setResult(obj, PluginResult.Status.OK, callbackContext);
            } catch (JSONException e) {
              e.printStackTrace();
            }
          }
        }).start();
      }
    });
  }

  /**
   * 播放录音
   *
   * @param args
   * @param callbackContext
   */
  public void playRecord(final JSONArray args, final CallbackContext callbackContext) {
    try {
      final String playVoiceName = args.getString(0);
      File file = new File(FileUtils.getVoiceDir() + File.separator + playVoiceName);
      //获取当前距离感应器设置信息（true为正常模式，false为听筒模式）
      if (file.exists()) {
        cordova.getActivity().runOnUiThread(new Runnable() {
          @Override
          public void run() {
            final MediaPlayer player = RecorderManager.getInstance(cordova.getActivity()).playRecord(playVoiceName);
            player.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
              @Override
              public void onCompletion(MediaPlayer mp) {
                UIUtils.switchEarphone(cordova.getActivity(), false);
                RecorderManager.getInstance(cordova.getActivity()).stopPlayRecord();
                setResult("true", PluginResult.Status.OK, callbackContext);
              }
            });
            mSensorReceiver.setOnProxyChangeListener(new ProxySensorReceiver.OnProxyChangeListener() {
              @Override
              public void onEarphoneMode() {//由正常模式切换为听筒模式
                boolean proxyMode = SPUtils.getBoolean("set_proxy_mode", false);
                Log.d("mode", "firing the hole:onEarphoneMode");
                if (proxyMode && RecorderManager.getInstance(cordova.getActivity()).isPlaying()) {
                  RecorderManager.getInstance(cordova.getActivity()).pause();
                  UIUtils.switchEarphone(cordova.getActivity(), true);
                  RecorderManager.getInstance(cordova.getActivity()).resume();
                }
              }

              @Override
              public void onNormalMode() {//由听筒模式切换为正常模式
                boolean proxyMode = SPUtils.getBoolean("set_proxy_mode", false);
                Log.d("mode", "firing the hole:onNormalMode");
                if (proxyMode && RecorderManager.getInstance(cordova.getActivity()).isPlaying()) {
                  RecorderManager.getInstance(cordova.getActivity()).pause();
                  UIUtils.switchEarphone(cordova.getActivity(), false);
                  RecorderManager.getInstance(cordova.getActivity()).resume();
                }
              }
            });
            onPlayStopReceiver.setOnPlayStopListener(new OnPlayStopListener() {
              @Override
              public void onPlayStop() {
                UIUtils.switchEarphone(cordova.getActivity(), false);
                setResult("true", PluginResult.Status.OK, callbackContext);
              }
            });
          }
        });
      } else {
        setResult("该文件不存在！", PluginResult.Status.ERROR, callbackContext);
      }
    } catch (JSONException e) {
      UIUtils.switchEarphone(cordova.getActivity(), false);
      e.printStackTrace();
    }
  }

  /**
   * 停止播放录音
   *
   * @param args
   * @param callbackContext
   */
  public void stopPlayRecord(final JSONArray args, final CallbackContext callbackContext) {
    cordova.getActivity().runOnUiThread(new Runnable() {
      @Override
      public void run() {
        try {
          setResult("true", PluginResult.Status.OK, callbackContext);
          RecorderManager.getInstance(cordova.getActivity()).stopPlayRecord();
        } catch (Exception e) {
        }
      }
    });
  }

  /**
   * 设置距离感应器模式（0为正常模式，1为听筒模式）
   *
   * @param args
   * @param callbackContext
   */
  public void setProxyMode(final JSONArray args, final CallbackContext callbackContext) {
    try {
      int proxyMode = args.getInt(0);
      SPUtils.save("set_proxy_mode", proxyMode == 1 ? false : true);
      if (RecorderManager.getInstance(cordova.getActivity()).isPlaying()) {
        UIUtils.switchEarphone(cordova.getActivity(), proxyMode == 1 ? true : false);
      }
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  /**
   * 获取距离感应器模式（0为正常模式，1为听筒模式）
   *
   * @param args
   * @param callbackContext
   */
  public void getProxyMode(final JSONArray args, final CallbackContext callbackContext) {
    setResult(SPUtils.getBoolean("set_proxy_mode", true) ? 0 : 1, PluginResult.Status.OK, callbackContext);
  }

  /**
   * 获取当前网络状态
   *
   * @param args
   * @param callbackContext
   */
  public void getNetStatus(final JSONArray args, final CallbackContext callbackContext) {
    setResult(NetUtils.isConnect(cordova.getActivity()), PluginResult.Status.OK, callbackContext);
  }

  /**
   * 判断是否有兼职账号
   *
   * @param args
   * @param callbackContext
   */
  public void hasParttimeAccount(final JSONArray args, final CallbackContext callbackContext) {
    try {
      JSONObject userInfo = getUserInfo();
      if (userInfo != null && userInfo.has("viceUser")) {
        JSONArray subUserInfo = userInfo.getJSONArray("viceUser");
        boolean flag = subUserInfo.length() > 0;
        setResult(flag, flag ? PluginResult.Status.OK : PluginResult.Status.ERROR, callbackContext);
      } else {
        setResult(false, PluginResult.Status.ERROR, callbackContext);
      }
    } catch (JSONException e) {
      setResult(false, PluginResult.Status.ERROR, callbackContext);
      e.printStackTrace();
    }
  }

  public static MType getType(String type) {
    if ("ChildJSBean".equals(type)) {
      return MType.U;
    } else if ("Group".equals(type)) {
      return MType.G;
    } else if ("Dept".equals(type)) {
      return MType.D;
    } else {
      return MType.U;
    }
  }

  /**
   * 获取当前登录的用户ID
   *
   * @return
   */
  public String getUserID() throws JSONException {
    JSONObject userInfo = getUserInfo();
    return userInfo.getString("userID");
  }

  /**
   * 获取imcode
   * @return
     */
  public void getImcode(final JSONArray args, final CallbackContext callbackContext){
    setResult(UIUtils.getDeviceId(), PluginResult.Status.OK, callbackContext);
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

  public JSONObject getUserInfo() throws JSONException {
    String login_info = SPUtils.getString("login_info", "");
    return new JSONObject(login_info);
  }

  /**
   * 获取登录信息（JSONObject）
   *
   * @return
   * @throws JSONException
   */
  public JSONObject getLoginInfo() throws JSONException {
    String login_info = SPUtils.getString("login_info", "");
    return new JSONObject(login_info);
  }

  public boolean isConnect(Context context) {
    // 获取手机所有连接管理对象（包括对wi-fi,net等连接的管理）
    try {
      ConnectivityManager connectivity = (ConnectivityManager) context
        .getSystemService(Context.CONNECTIVITY_SERVICE);
      if (connectivity != null) {
        // 获取网络连接管理的对象
        NetworkInfo info = connectivity.getActiveNetworkInfo();
        if (info != null && info.isConnected()) {
          // 判断当前网络是否已经连接
          if (info.getState() == NetworkInfo.State.CONNECTED) {
            return true;
          }
        }
      }
    } catch (Exception e) {
      // TODO: handle exception
      Log.v("error", e.toString());
    }
    return false;
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
  public void setResult(JSONArray result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
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
  public void setResult(int result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
    MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
    pluginResult.setKeepCallback(true);
    callbackContext.sendPluginResult(pluginResult);
  }

  /**
   * 设置返回信息
   *
   * @param result          返回结果数据 boolean
   * @param resultStatus    返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
   * @param callbackContext
   */
  public void setResult(boolean result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
    MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
    pluginResult.setKeepCallback(true);
    callbackContext.sendPluginResult(pluginResult);
  }

  @Override
  public void onDestroy() {
    try {
      if (docFileReceiver != null) {
        cordova.getActivity().unregisterReceiver(docFileReceiver);
        docFileReceiver = null;
      }
    } catch (Exception e) {
    }
    try {
      if (photoFileReceiver != null) {
        cordova.getActivity().unregisterReceiver(photoFileReceiver);
        photoFileReceiver = null;
      }
    } catch (Exception e) {
    }
//    try {
//      if (mqttConnectReceiver != null) {
//        cordova.getActivity().unregisterReceiver(mqttConnectReceiver);
//        mqttConnectReceiver = null;
//      }
//    } catch (Exception e) {
//    }
    try {
      if (imReceiver != null) {
        UIUtils.getContext().unregisterReceiver(imReceiver);
        imReceiver = null;
      }
    } catch (Exception e) {}
    try {
      if (topicReceiver != null) {
        cordova.getActivity().unregisterReceiver(topicReceiver);
        topicReceiver = null;
      }
    } catch (Exception e) {
    }
    try {
      if (onPlayStopReceiver != null) {
        cordova.getActivity().unregisterReceiver(onPlayStopReceiver);
        onPlayStopReceiver = null;
      }
    } catch (Exception e) {
    }
    super.onDestroy();
  }

  public static void setHasLogin(boolean hasLogin) {
    MqttChat.hasLogin = hasLogin;
  }

  private class OnPlayStopReceiver extends BroadcastReceiver {
    private OnPlayStopListener onPlayStopListener;

    @Override
    public void onReceive(Context context, Intent intent) {
      if (ReceiverParams.RECEIVER_PLAY_STOP.equals(intent.getAction())) {
        if (onPlayStopListener != null) {
          onPlayStopListener.onPlayStop();
        }
      }
    }

    public void setOnPlayStopListener(OnPlayStopListener onPlayStopListener) {
      this.onPlayStopListener = onPlayStopListener;
    }

  }

  public interface OnPlayStopListener {
    public void onPlayStop();
  }
}
