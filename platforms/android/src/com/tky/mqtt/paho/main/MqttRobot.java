package com.tky.mqtt.paho.main;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.tky.mqtt.paho.ConnectionType;
import com.tky.mqtt.paho.MqttService;
import com.tky.mqtt.paho.MqttStatus;
import com.tky.mqtt.paho.MqttTopicRW;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.receiver.MqttStartReceiver;

/**
 * 作者：
 * 包名：com.sls.mynewframe.mqtt.main
 * 日期：2016/10/22 12:13
 * 描述：
 */
public class MqttRobot {
    /**
     * 默认为关闭状态
     */
    private static MqttStatus mqttStatus = MqttStatus.CLOSE;
    private static MqttStartReceiver mReceiver;
    private static IntentFilter filter;
    /**
     * MQTT是否启动过（登录后才会启动）
     */
    private static boolean isStarted = false;
    private static ConnectionType connectionType = ConnectionType.MODE_NONE;

    /**
     * 开启MQTT
     * @param topics
     */
    public static void startMqtt(final Context context, String topics, final MqttStartReceiver.OnMqttStartListener onMqttStartListener) {
        if (mqttStatus == MqttStatus.CLOSE && MqttRobot.isStarted()) {
            String[] topicsSplt = topics.split(",");
            int[] qoss = new int[topicsSplt.length];
            for (int i = 0; i < topicsSplt.length; i++) {
                qoss[i] = 1;
            }
            MqttTopicRW.writeTopicsAndQos(topicsSplt, qoss);
            UIUtils.runInMainThread(new Runnable() {
                @Override
                public void run() {
                    context.startService(new Intent(context, MqttService.class));
                    //启动广播接手者，接收MQTT启动状态消息，并注册回调
                    if (mReceiver == null) {
                        mReceiver = new MqttStartReceiver();
                        filter = new IntentFilter();
                        filter.addAction(ReceiverParams.MQTT_START);
                        context.registerReceiver(mReceiver, filter);
                    }
                    mReceiver.setOnMqttStartListener(new MqttStartReceiver.OnMqttStartListener() {
                        @Override
                        public void onSuccess() {
                            if (onMqttStartListener != null) {
                                onMqttStartListener.onSuccess();
                            }
                        }

                        @Override
                        public void onFalure() {
                            if (onMqttStartListener != null) {
                                onMqttStartListener.onFalure();
                                context.unregisterReceiver(mReceiver);
                                mReceiver = null;
                            }
                        }
                    });
                }
            });
        }
    }

    /**
     * 设置MQTT当前在线状态
     * @param mqttStatus MQTT当前在线状态
     */
    public static void setMqttStatus(MqttStatus mqttStatus) {
        MqttRobot.mqttStatus = mqttStatus;
    }

    public static MqttStatus getMqttStatus() {
        return mqttStatus;
    }

    public static boolean isStarted() {
        return isStarted;
    }

    public static void setIsStarted(boolean isStarted) {
        MqttRobot.isStarted = isStarted;
    }

    /**
     * 设置MQTT断开方式
     * @param connectionType
     */
    public static void setConnectionType(ConnectionType connectionType) {
        MqttRobot.connectionType = connectionType;
    }

    /**
     * 获取MQTT断开的方式
     * @return
     */
    public static ConnectionType getConnectionType() {
        return connectionType;
    }
}
