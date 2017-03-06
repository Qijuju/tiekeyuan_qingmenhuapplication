package com.tky.mqtt.plugin.toast;

import com.tky.mqtt.paho.ToastUtil;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * 弹吐司插件
 * 作者：
 * 包名：com.tky.mqtt.plugin.toast
 * 日期：2016-08-11 14:45:26
 * 描述：
 */
public class ToastUtils extends CordovaPlugin {


  	@Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Method method = ToastUtils.class.getDeclaredMethod(action, JSONArray.class, CallbackContext.class);
                    method.invoke(ToastUtils.this, args, callbackContext);
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
     * 要展示的文本年内容
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void showToast(final JSONArray args, final CallbackContext callbackContext) {
        try {
            //要展示的文本年内容
            String content = args.getString(0);
            ToastUtil.showSafeToast(content);
        } catch (JSONException e) {
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



