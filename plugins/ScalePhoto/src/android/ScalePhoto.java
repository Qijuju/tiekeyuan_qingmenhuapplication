package com.tky.mqtt.plugin.photo;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * 作者：
 * 包名：com.tky.mqtt.plugin.photo
 * 日期：2016-09-28 15:07:57
 * 描述：
 */
public class ScalePhoto extends CordovaPlugin {
  
  
  	@Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Method method = ScalePhoto.class.getDeclaredMethod(action, JSONArray.class, CallbackContext.class);
                    method.invoke(ScalePhoto.this, args, callbackContext);
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
     * 缩放图片
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void scale(final JSONArray args, final CallbackContext callbackContext) {
    	//需要传入的图片路径
    	String filepath = args.getString(0);
    }
    
    /**
     * 请求大图并且缩放
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void netScale(final JSONArray args, final CallbackContext callbackContext) {
    	//图片的id
    	String imageid = args.getString(0);
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

 

