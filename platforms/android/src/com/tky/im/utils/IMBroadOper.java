package com.tky.im.utils;

import android.content.Intent;
import android.os.Handler;

import com.tky.im.params.ConstantsParams;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.bean.MessageBean;
import com.tky.mqtt.paho.utils.GsonUtils;

/**
 * Created by tkysls on 2017/4/17.
 */

public class IMBroadOper {

    private static long startTime = 0;

    /**
     * 按照状态进行发广播（例如：IM连接成功、连接失败等）
     * @param status
     */
    public static void broad(final String status) {
        if (status != ConstantsParams.PARAM_RE_CONNECT) {
            Intent intent = new Intent();
            intent.setAction(status);
            UIUtils.getContext().sendBroadcast(intent);
        } else {
            if (startTime == 0) {
                startTime = System.currentTimeMillis();
            }
            long during = System.currentTimeMillis() - startTime;
            //保证两次重连IM超过1s
            if (during >= 1000) {
                UIUtils.runInMainThread(new Runnable() {
                    @Override
                    public void run() {
                        Intent intent = new Intent();
                        intent.setAction(status);
                        UIUtils.getContext().sendBroadcast(intent);
                    }
                });
            } else {
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        Intent intent = new Intent();
                        intent.setAction(status);
                        UIUtils.getContext().sendBroadcast(intent);
                    }
                }, 1000 - during);
            }
        }
    }

    /**
     * 广播接收成功的消息
     */
    public static void broadArrivedMsg(String topic, int qos, String content) {
        Intent intent=new Intent();
        intent.setAction(ConstantsParams.PARAM_RECEIVE_MESSAGE);
        intent.putExtra("topic", topic);
        intent.putExtra("content", content);
        intent.putExtra("qos", qos);
        UIUtils.getContext().sendBroadcast(intent);
    }

    public static void broadSendMsg(String topic, String content) {
        Intent intent = new Intent();
        intent.setAction(ConstantsParams.PARAM_SEND_MESSAGE);
        intent.putExtra("topic", topic);
        intent.putExtra("content", content);
        UIUtils.getContext().sendBroadcast(intent);
    }
}
