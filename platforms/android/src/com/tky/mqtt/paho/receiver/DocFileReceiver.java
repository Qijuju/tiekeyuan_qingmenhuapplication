package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.tky.mqtt.paho.ReceiverParams;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.receiver
 * 日期：2016/9/8 16:16
 * 描述：
 */
public class DocFileReceiver extends BroadcastReceiver {
    private OnScrachFilePathListener onScrachFilePathListener;
    @Override
    public void onReceive(Context context, Intent intent) {
        if (ReceiverParams.DOC_FILE_GET.equals(intent.getAction())) {
            if (onScrachFilePathListener != null) {
                onScrachFilePathListener.onScrachFilePath(intent.getStringExtra("filePath"));
            }
        }
    }

    public void setOnScrachFilePathListener(OnScrachFilePathListener onScrachFilePathListener) {
        this.onScrachFilePathListener = onScrachFilePathListener;
    }

    public interface OnScrachFilePathListener {
        public void onScrachFilePath(String path);
    }
}
