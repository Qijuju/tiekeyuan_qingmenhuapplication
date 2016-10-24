package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.tky.mqtt.paho.MqttStatus;
import com.tky.mqtt.paho.MqttTopicRW;
import com.tky.mqtt.paho.main.MqttRobot;

/**
 * 作者：
 * 包名：com.sls.mynewframe.mqtt.receiver
 * 日期：2016/10/24 0:52
 * 描述：
 */
public class UserPresentReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if ("android.intent.action.USER_PRESENT".equals(intent.getAction())) {
            if (MqttRobot.getMqttStatus() != MqttStatus.OPEN) {
                if (MqttStatus.OPEN != MqttRobot.getMqttStatus()) {
                    MqttRobot.startMqtt(context, MqttTopicRW.getStartTopicsAndQoss(), new MqttStartReceiver.OnMqttStartListener() {
                        @Override
                        public void onSuccess() {
                            MqttRobot.setMqttStatus(MqttStatus.OPEN);
                        }

                        @Override
                        public void onFalure() {
                            MqttRobot.setMqttStatus(MqttStatus.CLOSE);
                        }
                    });
                }
            }
        }
    }
}
