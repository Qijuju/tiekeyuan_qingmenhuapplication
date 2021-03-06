package com.tky.mqtt.paho.utils;

import android.content.Intent;
import android.os.SystemClock;

import com.tky.mqtt.paho.MqttService;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.main.MqttRobot;

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
        new Thread(new Runnable() {
            private int count = 0;
            @Override
            public void run() {
                while ((++count) < 5){
                    SystemClock.sleep(10);
                    UIUtils.runInMainThread(new Runnable() {
                        @Override
                        public void run() {
                            if (!NetUtils.isConnect(UIUtils.getContext()) || !MqttRobot.isStarted()) {
                                return;
                            }
                            Intent netIntent = new Intent();
                            netIntent.setAction(ReceiverParams.RECONNECT_MQTT);
                            UIUtils.getContext().sendBroadcast(netIntent);
                        }
                    });
                }
            }
        }).start();

        /*final long time = System.currentTimeMillis();
        new Thread(new Runnable() {
            boolean flag = true;
            @Override
            public void run() {
                if (!MqttRobot.isStarted()) {
                    return;
                }
                while (flag) {
                    SystemClock.sleep(10);
                    if (MqttRobot.getMqttStatus() == MqttStatus.OPEN) {
                        flag = false;
                    } else if (System.currentTimeMillis() - time > 15000) {
                        flag = false;
                        UIUtils.runInMainThread(new Runnable() {
                            @Override
                            public void run() {
                                //UIUtils.getContext().startService(new Intent(UIUtils.getContext(), MqttService.class));
                            }
                        });
                    }
                }
            }
        }).start();*/
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
        intent.setAction(ReceiverParams.CONNECTION_DOWN_MQTT);
        UIUtils.getContext().sendBroadcast(intent);
    }

    /**
     * 手动断掉MQTT的连接
     */
    public static void closeMqttConnection() {
        Intent netIntent = new Intent();
        netIntent.setAction(ReceiverParams.CONNECTION_DOWN_MQTT);
        UIUtils.getContext().sendBroadcast(netIntent);
    }

    /**
     * 手动断掉MQTT的连接
     */
    public static void disconnectMqtt() {
      Intent netIntent = new Intent();
      netIntent.setAction(ReceiverParams.CONNECTION_DISCONNECT_MQTT);
      UIUtils.getContext().sendBroadcast(netIntent);
    }

    /**
     * 消息发送成功后反馈给用户
     */
    public static void sendSuccNotify(final String msg) {
        UIUtils.runInMainThread(new Runnable() {
            @Override
            public void run() {
                //发送中，消息发送成功，回调
                Intent intent = new Intent();
                intent.putExtra("msg", msg);
                intent.setAction(ReceiverParams.SENDMESSAGE_SUCCESS);
                UIUtils.getContext().sendBroadcast(intent);
            }
        });
    }

    /**
     * 消息发送失败后反馈给用户
     */
    public static void sendErrNotify(final String msg) {
        UIUtils.runInMainThread(new Runnable() {
            @Override
            public void run() {
                //发送中，消息发送失败，回调
                Intent intent = new Intent();
                intent.putExtra("msg", msg);
                intent.setAction(ReceiverParams.SENDMESSAGE_ERROR);
                UIUtils.getContext().sendBroadcast(intent);
            }
        });
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


    /**
     * 发布MQTT启动成功或失败的消息
     */
    public static void tellMqttStatus(boolean startSuccess) {
        Intent intent=new Intent();
        intent.setAction(startSuccess ? ReceiverParams.RECEIVER_MQTT_STARTED:ReceiverParams.RECEIVER_MQTT_CLOSED);
        UIUtils.getContext().sendBroadcast(intent);
    }

    /**
     * MQTT自动连接失败，重启MqttService
     */
    public static void restartService() {
        Intent intent=new Intent();
        intent.setAction(ReceiverParams.RESTARTSERVICE);
        UIUtils.getContext().sendBroadcast(intent);
    }

}
