package com.tky.mqtt.paho.utils;

import android.content.Intent;

import com.tky.mqtt.paho.MqttService;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.UIUtils;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.utils
 * 日期：2016/7/5 10:05
 * 描述：
 */
public class MqttOper {
    /**
     * 重启MQTT
     */
    public static void resetMqtt() {
        Intent netIntent = new Intent();
        netIntent.setAction(ReceiverParams.RECONNECT_MQTT);
        UIUtils.getContext().sendBroadcast(netIntent);
    }

    /**
     * 手动断掉MQTT的连接
     */
    public static void closeMqttConnection() {
        Intent netIntent = new Intent();
        netIntent.setAction(ReceiverParams.CONNECTION_DOWN_MQTT);
        UIUtils.getContext().sendBroadcast(netIntent);
        UIUtils.getContext().stopService(new Intent(UIUtils.getContext(), MqttService.class));
    }
}
