package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.tky.mqtt.paho.ReceiverParams;

/**
 * 作者：
 * 包名：com.sls.mynewframe.mqtt.receiver
 * 日期：2016/10/22 12:43
 * 描述：
 */
public class MqttStartReceiver extends BroadcastReceiver {
    private OnMqttStartListener onMqttStartListener;
    @Override
    public void onReceive(Context context, Intent intent) {
        if (ReceiverParams.MQTT_START.equals(intent.getAction())) {
            if (onMqttStartListener != null) {
                boolean mqttStart = intent.getBooleanExtra(ReceiverParams.MQTT_START, false);
                //MQTT启动成功
                if (mqttStart) {
                    onMqttStartListener.onSuccess();
                } else {//MQTT启动失败
                    onMqttStartListener.onFalure();
                }
            }
        }
    }

    public void setOnMqttStartListener(OnMqttStartListener onMqttStartListener) {
        this.onMqttStartListener = onMqttStartListener;
    }

    public interface OnMqttStartListener {
        /**
         * 连接成功
         */
        public void onSuccess();

        /**
         * 连接失败
         */
        public void onFalure();
    }
}
