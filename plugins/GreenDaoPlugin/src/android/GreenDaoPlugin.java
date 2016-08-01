package com.tky.mqtt.base;

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
 * 包名：com.tky.mqtt.base
 * 日期：2016-07-27 10:31:17
 * 描述：
 */
public class GreenDaoPlugin extends CordovaPlugin {
  
  
  	@Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Method method = GreenDaoPlugin.class.getDeclaredMethod(action, JSONArray.class, CallbackContext.class);
                    method.invoke(GreenDaoPlugin.this, args, callbackContext);
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
     * 带参加载数据
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void loadDataByArg(final JSONArray args, final CallbackContext callbackContext) {
    	
    }
    
    /**
     * 加载所有数据
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void loadAllData(final JSONArray args, final CallbackContext callbackContext) {
    	
    }
    
    /**
     * 带参查询
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void queryData(final JSONArray args, final CallbackContext callbackContext) {
    	
    }
    
    /**
     * 保存对象
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void saveObj(final JSONArray args, final CallbackContext callbackContext) {
    	
    }
    
    /**
     * 保存对象数组
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void saveDataLists(final JSONArray args, final CallbackContext callbackContext) {
    	
    }
    
    /**
     * 删除所有数据
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void deleteAllData(final JSONArray args, final CallbackContext callbackContext) {
    	
    }
    
    /**
     * 带参删除数据
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void deleteDataByArg(final JSONArray args, final CallbackContext callbackContext) {
    	
    }
    
    /**
     * 删除对象
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void deleteObj(final JSONArray args, final CallbackContext callbackContext) {
    	
    }
    
    /**
     * 根据聊天类型查询数据
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void queryMessagelistByIsSingle(final JSONArray args, final CallbackContext callbackContext) {
    	
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

 

