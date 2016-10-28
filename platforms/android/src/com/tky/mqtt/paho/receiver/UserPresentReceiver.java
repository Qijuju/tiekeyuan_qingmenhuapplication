package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.utils.MqttOper;

/**
 * 作者：
 * 包名：com.sls.mynewframe.mqtt.receiver
 * 日期：2016/10/24 0:52
 * 描述：
 */
public class UserPresentReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_USER_PRESENT.equals(intent.getAction())
                || Intent.ACTION_SCREEN_ON.equals(intent.getAction())
                || Intent.ACTION_SCREEN_OFF.equals(intent.getAction())) {
            if (!MqttRobot.isStarted()) {
                return;
            }
//            if (MqttRobot.getMqttStatus() != MqttStatus.OPEN) {
//                ToastUtil.showSafeToast("屏幕梁咩");
            ToastUtil.showSafeToast("程序锁解锁成功...");
            if (MqttRobot.isStarted()) {
                MqttOper.resetMqtt();
            }
                /*MqttRobot.startMqtt(UIUtils.getContext(), MqttTopicRW.getStartTopicsAndQoss(), new MqttStartReceiver.OnMqttStartListener() {
                    @Override
                    public void onSuccess() {
                        ToastUtil.showSafeToast("测试成功");
                        MqttRobot.setMqttStatus(MqttStatus.OPEN);
                    }

                    @Override
                    public void onFalure() {
                        MqttRobot.setMqttStatus(MqttStatus.CLOSE);
                    }
                });*/
//            }
        }
    }
}
