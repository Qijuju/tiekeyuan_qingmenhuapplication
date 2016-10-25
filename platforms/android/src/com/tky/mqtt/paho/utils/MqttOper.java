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
     * 自动直接断掉MQTT（非手动断开）
     */
    public static void cutMqttWithNoting() {
        Intent intent = new Intent();
        intent.setAction(ReceiverParams.NET_DOWN_MQTT);
        UIUtils.getContext().sendBroadcast(intent);
    }

    /**
     * 彻底断掉MQTT并处理善后工作
     */
    public static void freeMqtt() {
        Intent intent = new Intent();
        intent.setAction(ReceiverParams.FREEZE_MQTT);
        UIUtils.getContext().sendBroadcast(intent);
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

    /**
     * 消息发送失败后反馈给用户
     */
    public static void sendErrNotify() {
        //发送中，消息发送失败，回调
        Intent intent=new Intent();
        intent.setAction(ReceiverParams.SENDMESSAGE_ERROR);
        UIUtils.getContext().sendBroadcast(intent);
    }

    /**
     * 发布MQTT启动成功或失败的消息
     */
    public static void publishStartStatus(boolean startSuccess) {
        Intent intent=new Intent();
        intent.putExtra(ReceiverParams.MQTT_START, startSuccess);
        intent.setAction(ReceiverParams.MQTT_START);
        UIUtils.getContext().sendBroadcast(intent);
    }
}
