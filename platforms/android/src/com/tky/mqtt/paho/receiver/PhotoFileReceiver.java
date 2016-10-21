package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.receiver
 * 日期：2016/10/18 16:35
 * 描述：
 */
public class PhotoFileReceiver extends BroadcastReceiver {

    private OnPhotoGetListener onPhotoGetListener;

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent != null) {
            if (onPhotoGetListener != null) {
                onPhotoGetListener.getPhoto(intent.getStringExtra("filePath"), intent.getStringExtra("length"), intent.getStringExtra("formatSize"), intent.getStringExtra("fileName"));
            }
        }
    }

    public void setOnPhotoGetListener(OnPhotoGetListener onPhotoGetListener) {
        this.onPhotoGetListener = onPhotoGetListener;
    }

    /**
     * 获取到拍照后保存的地址
     */
    public interface OnPhotoGetListener {
        public void getPhoto(String filePath, String length, String formatSize, String path);
    }
}
