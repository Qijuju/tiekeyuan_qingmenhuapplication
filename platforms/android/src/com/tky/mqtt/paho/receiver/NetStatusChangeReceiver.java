package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.main.MqttRobot;

public class NetStatusChangeReceiver extends BroadcastReceiver {
    private OnNetListener onNetListener;
    @Override
    public void onReceive(Context context, Intent intent) {
        if (ReceiverParams.NET_DISCONNECTED.equals(intent.getAction())) {//网络断开
            if (onNetListener != null) {
                onNetListener.doNetDisconnect();
            }
        } else if (ReceiverParams.NET_CONNECTED.equals(intent.getAction())) {//网络连上
            if (onNetListener != null) {
                onNetListener.doNetConnect();
            }
        }
    }

    public void setOnNetListener(OnNetListener onNetListener) {
        this.onNetListener = onNetListener;
    }

    public interface OnNetListener {
        public void doNetDisconnect();
        public void doNetConnect();
    }
}
