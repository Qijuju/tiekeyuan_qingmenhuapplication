package com.tky.mqtt.plugin.thrift.callback;

import com.tky.mqtt.paho.utils.FileUtils;

import org.apache.cordova.CallbackContext;
import org.apache.thrift.TException;
import org.apache.thrift.async.AsyncMethodCallback;

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
public class GetHeadPicCallback implements AsyncMethodCallback<IMFile.AsyncClient.GetHeadPic_call> {
    private CallbackContext callbackContext;

    public GetHeadPicCallback(CallbackContext callbackContext) {
        this.callbackContext = callbackContext;
    }
    @Override
    public void onComplete(IMFile.AsyncClient.GetHeadPic_call getHeadPic_call) {
        if (getHeadPic_call != null) {
            try {
                RSTgetPic result = getHeadPic_call.getResult();
                if (result != null && result.result) {
                    String iconDir = FileUtils.getIconDir() + File.separator + "/head";
                    File directory = new File(iconDir);
                    if (!directory.exists()) {
                        directory.mkdirs();
                    }
                    String fileName = iconDir + File.separator + result.getUserID() + result.getPicSize() + ".jpg";
                    File file = new File(fileName);
                    if (!file.exists()) {
                        file.createNewFile();
                    }
                    byte[] fileByte = result.getFileByte();
                    FileOutputStream fos = new FileOutputStream(file);
                }
            } catch (TException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onError(Exception e) {

    }
}
