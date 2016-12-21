package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.tky.mqtt.paho.ReceiverParams;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.receiver
 * 日期：2016/11/17 19:16
 * 描述：
 */
public class MqttConnectReceiver extends BroadcastReceiver {
    private OnMqttStatusChangeListener onMqttStatusChangeListener;
    public void setOnMqttStatusChangeListener(OnMqttStatusChangeListener onMqttStatusChangeListener) {
        this.onMqttStatusChangeListener = onMqttStatusChangeListener;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if(ReceiverParams.RECEIVER_MQTT_STARTED.equals(intent.getAction())){
            if(onMqttStatusChangeListener != null){
                try {
                    onMqttStatusChangeListener.onMqttStarted();
                } catch (Exception e) {}
            }
        }else if(ReceiverParams.RECEIVER_MQTT_CLOSED.equals(intent.getAction())){
            if(onMqttStatusChangeListener != null){
                try {
                    onMqttStatusChangeListener.onMqttClosed();
                } catch (Exception e){}
            }
        }
    }

    public interface OnMqttStatusChangeListener{
        public void onMqttStarted();
        public void onMqttClosed();
    }
}
