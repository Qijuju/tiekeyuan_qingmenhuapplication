package com.tky.mqtt.chat;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.text.TextUtils;
import android.util.Log;

import com.tky.mqtt.paho.MessageOper;
import com.tky.mqtt.paho.MqttReceiver;
import com.tky.mqtt.paho.MqttService;
import com.tky.mqtt.paho.MqttTopicRW;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.utils.MqttOper;
import com.tky.mqtt.paho.utils.NetUtils;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * This class echoes a string called from JavaScript.
 */
public class MqttChat extends CordovaPlugin {
    /**
     * 是否已经登录
     */
    private boolean hasLogin = false;

    @Override
    public void initialize(final CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
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
     * @param args
     * @param callbackContext
     */
    public void save(final JSONArray args, final CallbackContext callbackContext) {
        if (args != null) {
            try {
                String key = args.getString(0);
                String value = args.getString(1);
                SPUtils.save(key, value);
                if(value != null && !TextUtils.isEmpty(value.trim())) {
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
        final String topicId = args.getString(0);
        if (topicId != null && !"".equals(topicId.trim())) {
            String[] topics = topicId.split(",");
            /*cordova.getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(cordova.getActivity(), topicId, Toast.LENGTH_SHORT).show();
                }
            });*/
            int[] qoss = new int[topics.length];
            for (int i = 0; i < topics.length; i++) {
                qoss[i] = 1;
                /*if (!"zhuanjiazu".equals(topics[i].trim())){
                    qoss[i] = 2;
                } else {
                    qoss[i] = 2;
                }*/
            }
            MqttTopicRW.writeTopicsAndQos(topics, qoss);
            cordova.getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    cordova.getActivity().startService(new Intent(cordova.getActivity(), MqttService.class));
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
    public void stopMqttChat(){
    }

    public void sendMsg(final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        //消息发送失败，数据回调，然后结束(断网，失去连接)
        if(!NetUtils.isConnect(cordova.getActivity())){
            setResult("failure",PluginResult.Status.ERROR,callbackContext);
            return ;
        }
        String tosb = args.getString(0);
        String message = args.getString(1);
        MessageOper.sendMsg(tosb, message);
        //发布消息的广播
        MqttReceiver topicReceiver = MqttReceiver.getInstance();
        IntentFilter topicFilter = new IntentFilter();
        topicFilter.addAction(ReceiverParams.SENDMESSAGE_ERROR);
        cordova.getActivity().registerReceiver(topicReceiver, topicFilter);
        //消息发送过程中，网络信号减弱，数据回调
        topicReceiver.setOnMqttSendErrorListener(new MqttReceiver.OnMqttSendErrorListener() {
            @Override
            public void onMqttSendError() {
                setResult("failure", PluginResult.Status.ERROR, callbackContext);
            }
        });
        MqttPluginResult pluginResult = new MqttPluginResult(PluginResult.Status.OK, "success");
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    public void getChats(final JSONArray args, final CallbackContext callbackContext) {
        MqttReceiver receiver = MqttReceiver.getInstance();
        IntentFilter filter = new IntentFilter();
        filter.addAction(ReceiverParams.MESSAGEARRIVED);
        cordova.getActivity().registerReceiver(receiver, filter);
        receiver.setOnMessageArrivedListener(new MqttReceiver.OnMessageArrivedListener() {
            @Override
            public void messageArrived(String topic, String content, int qos) {
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

    public void disconnect(final JSONArray args, final CallbackContext callbackContext) {
        hasLogin = false;
        MqttOper.closeMqttConnection();
        setResult("success", PluginResult.Status.OK, callbackContext);
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

    @Override
    public void onDestroy() {
        cordova.getActivity().stopService(new Intent(cordova.getActivity(), MqttService.class));
        cordova.getActivity().startService(new Intent(cordova.getActivity(), MqttService.class));
        super.onDestroy();
    }


}
