package com.tky.mqtt.plugin.thrift.callback;


import com.tky.mqtt.paho.utils.FileUtils;
import com.tky.mqtt.plugin.thrift.MqttPluginResult;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.apache.thrift.TException;
import org.apache.thrift.async.AsyncMethodCallback;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import im.server.File.IMFile;
import im.server.File.RSTgetPic;

/**
 * 作者：
 * 包名：com.tky.mqtt.plugin.thrift.callback
 * 日期：2016/8/5 14:27
 * 描述：
 */
public class GetOthersHeadPicCallback extends MyAsyncMethodCallback<IMFile.AsyncClient.GetHeadPic_call> {
    private CallbackContext callbackContext;

    public GetOthersHeadPicCallback(CallbackContext callbackContext) {
        this.callbackContext = callbackContext;
    }

    @Override
    public void onComplete(IMFile.AsyncClient.GetHeadPic_call getHeadPic_call) {
        if (getHeadPic_call != null) {
            FileOutputStream fos = null;
            try {
                RSTgetPic result = getHeadPic_call.getResult();

                if (result != null && result.result) {
                    String iconDir = FileUtils.getIconDir() + File.separator + "/otherheadpic";
                    File directory = new File(iconDir);
                    if (!directory.exists()) {
                        directory.mkdirs();
                    }
                    String[] lista = directory.list();
//                    if (lista.length > 0) {
//                        String fileName = iconDir + File.separator + lista[0];
//                        File file = new File(fileName);
//                        if (!file.exists()) {
//                            file.createNewFile();
//                        }
//                        byte[] fileByte = result.getFileByte();
//                        fos = new FileOutputStream(file);
//                        fos.write(fileByte);
//                        setResult(fileName, PluginResult.Status.OK, callbackContext);
//                    } else {
                        String fileName = iconDir + File.separator + result.getUserID()  + ".jpg";
                        File file = new File(fileName);
                        if (!file.exists()) {
                            file.createNewFile();
                        }
                        byte[] fileByte = result.getFileByte();
                        fos = new FileOutputStream(file);
                        fos.write(fileByte);
                        setResult(fileName, PluginResult.Status.OK, callbackContext);
//                    }

                } else {
                    setResult("网络异常", PluginResult.Status.ERROR, callbackContext);
                }
            } catch (TException e) {
                setResult("网络异常", PluginResult.Status.ERROR, callbackContext);
                e.printStackTrace();
            } catch (IOException e) {
                setResult("数据异常", PluginResult.Status.ERROR, callbackContext);
                e.printStackTrace();
            } catch (Exception e) {
                setResult("未知异常", PluginResult.Status.ERROR, callbackContext);
            } finally {
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
        close();
    }

    @Override
    public void onError(Exception e) {
        close();
        setResult("请求失败", PluginResult.Status.ERROR, callbackContext);
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
}
