package com.tky.mqtt.paho.main;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

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

    /**
     * 开启MQTT
     * @param topics
     */
    public static void startMqtt(final Context context, String topics, final MqttStartReceiver.OnMqttStartListener onMqttStartListener) {
        if (mqttStatus == MqttStatus.CLOSE) {
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
                        IntentFilter filter = new IntentFilter();
                        filter.addAction(ReceiverParams.MQTT_START);
                        context.registerReceiver(mReceiver, filter);
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
}
