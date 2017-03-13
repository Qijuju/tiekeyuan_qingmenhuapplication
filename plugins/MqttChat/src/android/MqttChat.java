package com.tky.mqtt.chat;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;
import android.widget.Toast;

import com.tky.mqtt.paho.utils.SPUtils;
import com.tky.mqtt.tools.constant.ParamsConstants;
import com.tky.mqtt.tools.receiver.MqttReceivedReceiver;
import com.tky.mqtt.tools.service.BackgroundService;
import com.tky.mqtt.tools.util.MQTTClientUtil;
import com.tky.mqtt.tools.util.Notify;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.eclipse.paho.android.service.SharePreferenceUtil;
import org.json.JSONArray;
import org.json.JSONException;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * This class echoes a string called from JavaScript.
 */
public class MqttChat extends CordovaPlugin {

    //    private AlertDialog.Builder builder;
    private SharePreferenceUtil preferens;
    private Intent intents;
    private MqttReceivedReceiver received;
    private ExecutorService mThreadPool = Executors.newFixedThreadPool(1);
    private MQTTClientUtil mcu;
    /**
     * 是否已经登录
     */
    private boolean hasLogin = false;

    @Override
    public void initialize(final CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        preferens = new SharePreferenceUtil(cordova.getActivity());
//        startMqttChat("sunlinsong");
        /*Intent intent = new Intent(cordova.getActivity(), BackgroundService.class);
        cordova.getActivity().startService(intent);*/
        /*cordova.getActivity();
        builder = new AlertDialog.Builder(cordova.getActivity());
        builder.setMessage("zheshidiyigemessage");
        builder.setTitle("titlea");
        builder.show();*/
        /*received = new MqttReceivedReceiver();
        IntentFilter intentFilter = new IntentFilter(ParamsConstants.MQTT_RECEIVED);
        cordova.getActivity().registerReceiver(received, intentFilter);*/
        mcu = MQTTClientUtil.getInstance(cordova.getActivity().getBaseContext());
        String deviceId = preferens.getDeviceId();
        if (deviceId != null && !"".equals(deviceId.trim())) {
            intents = new Intent(cordova.getActivity(), BackgroundService.class);
            cordova.getActivity().startService(intents);
        }
    }

    @Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {

        mThreadPool.execute(new Runnable() {
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


        /*if (action.equals("getChats")) {
            String message = args.getString(0);
            this.getChats(message, callbackContext);
            return true;
        }
        if (action.equals("getChats2")) {
                    String message = args.getString(0);
                    this.getChats(message, callbackContext);
                    return true;
                }
        if (action.equals("getChats3")) {
                    String message = args.getString(0);
                    this.getChats(message, callbackContext);
                    return true;
                }*/
        return true;
    }

    /**
     * 传入用户ID（topicID），启动服务
     */
    public void startMqttChat(final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        //只允许登录一次
        if (hasLogin) {
            MqttPluginResult pluginResult = new MqttPluginResult(PluginResult.Status.ERROR, "hasLogin");
            pluginResult.setKeepCallback(true);
            callbackContext.sendPluginResult(pluginResult);
            return;
        }
        String topicId = args.getString(0);
        if (topicId != null && !"".equals(topicId.trim())) {
//            Constants.addTopic(topicId);
            String deviceId = preferens.getDeviceId();
            preferens.setDeviceId(UUID.randomUUID().toString());//GONGXIAOFENG   "tokudu"  //topicId
//            Constants.addTopic(topicId);
            SPUtils.save("topic", topicId);
            if (deviceId == null || "".equals(deviceId.trim())) {
                intents = new Intent(cordova.getActivity(), BackgroundService.class);
                cordova.getActivity().startService(intents);
            }

            received = new MqttReceivedReceiver();
            IntentFilter intentFilter = new IntentFilter(ParamsConstants.MQTT_RECEIVED);
            cordova.getActivity().registerReceiver(received, intentFilter);
            hasLogin = true;
            MqttPluginResult pluginResult = new MqttPluginResult(PluginResult.Status.OK, "success");
            pluginResult.setKeepCallback(true);
            callbackContext.sendPluginResult(pluginResult);
        } else {
            MqttPluginResult pluginResult = new MqttPluginResult(PluginResult.Status.ERROR, "error");
            pluginResult.setKeepCallback(true);
            callbackContext.sendPluginResult(pluginResult);
        }
    }

    public void restartMqtt(final JSONArray args, final CallbackContext callbackContext) throws JSONException {

    }

    /**
     * 停止MqttChat的服务
     */
    public void stopMqttChat(){
        if (intents != null) {
            preferens.setDeviceId("");//GONGXIAOFENG   "tokudu"
            cordova.getActivity().stopService(intents);
        }
    }

    public void sendMsg(final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        /*if (isConnect(cordova.getActivity().getBaseContext())) {
        }*/
        String tosb = args.getString(0);
        String message = args.getString(1);
        mcu.publish(tosb, message, 2);
        MqttPluginResult pluginResult = new MqttPluginResult(PluginResult.Status.OK, "success");
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    public void getChats(final JSONArray args, final CallbackContext callbackContext) {

        if (isConnect(cordova.getActivity().getBaseContext())) {
            received.setOnReceivedMsgListener(new MqttReceivedReceiver.OnReceivedMsgListener() {
                @Override
                public void onReceived(String id, final String message, String topic) {
//                    Toast.makeText(cordova.getActivity(), id + ":::" + message + ":::" + topic, Toast.LENGTH_SHORT).show();
                    MqttPluginResult pluginResult = new MqttPluginResult(PluginResult.Status.OK, topic + "对你（" + id + "）说：" + message);
                    pluginResult.setKeepCallback(true);
                    callbackContext.sendPluginResult(pluginResult);
                }
            });
            /*Intent intent = new Intent();
            intent.setAction(MqttServiceConstants.SEND_ACTION);
            intent.putExtra(MqttServiceConstants.CALLBACK_ACTION, "send");
            intent.putExtra(MqttServiceConstants.CALLBACK_STATUS, Status.OK);
            intent.putExtra(MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN, "1");
            cordova.getActivity().sendBroadcast(intent);*/
            return;
        } else {
            callbackContext.error("Expected one non-empty string argument.");
            cordova.getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Notify.toast(cordova.getActivity().getBaseContext(), "请检查您的网络，无连接 或者 连接不正确！",
                            Toast.LENGTH_LONG);
                }
            });
        }

        /*MQTTClientUtil mcu = MQTTClientUtil.getInstance(cordova.getActivity().getBaseContext());
        mcu.publish("tokudu", "hello world!", 2);*/


        /*cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    if (args.getString(0) != null && args.getString(0).length() > 0) {
                        callbackContext.success(args.getString(0));
                *//*mcu.setMessageWaitListener(new MqttCallbackHandler.MessageWaitListener() {
                    @Override
                    public void messageArrived(String msg, String from, String to) {
                        Toast.makeText(cordova.getActivity(), "ssssss", Toast.LENGTH_SHORT).show();
                    }
                });*//*
                    } else {
                        callbackContext.error("Expected one non-empty string argument.");
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });*/
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

    @Override
    public void onDestroy() {
        if (received != null) {
            cordova.getActivity().unregisterReceiver(received);
        }
        super.onDestroy();
    }


}
