package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.tky.mqtt.paho.ReceiverParams;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.receiver
 * 日期：2016/10/18 16:35
 * 描述：
 */
public class VideoFileReceiver extends BroadcastReceiver {

    private OnVideoGetListener onVideoGetListener;

    @Override
    public void onReceive(Context context, Intent intent) {
        if (ReceiverParams.VIDEO_FILE_GET.equals(intent.getAction())) {
            if (intent != null) {
                if (onVideoGetListener != null) {
                    onVideoGetListener.getVideo(intent.getStringExtra("filePath"), intent.getStringExtra("length"), intent.getStringExtra("formatSize"), intent.getStringExtra("fileName"));
                }
            }
        }
    }

    public void setOnVideoGetListener(OnVideoGetListener onVideoGetListener) {
        this.onVideoGetListener = onVideoGetListener;
    }

    /**
     * 获取到拍照后保存的地址
     */
    public interface OnVideoGetListener {
        public void getVideo(String filePath, String length, String formatSize, String path);
    }
}
