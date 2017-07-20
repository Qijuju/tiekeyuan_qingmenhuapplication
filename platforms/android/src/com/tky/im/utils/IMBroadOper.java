package com.tky.im.utils;

import android.content.Intent;
import android.os.Handler;

import com.tky.im.params.ConstantsParams;
import com.tky.im.service.IMService;
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
      UIUtils.runInMainThread(new Runnable() {
        @Override
        public void run() {
          if (status != ConstantsParams.PARAM_RE_CONNECT) {
            if (UIUtils.isServiceWorked(IMService.class.getName())) {
              Intent intent = new Intent();
              intent.setAction(status);
              UIUtils.getContext().sendBroadcast(intent);
            } else {
              UIUtils.getContext().startService(new Intent(UIUtils.getContext(), IMService.class));
            }
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
      });
    }

    /**
     * 广播接收成功的消息
     */
    public static void broadArrivedMsg(final String topic, final int qos, final String content) {
        UIUtils.runInMainThread(new Runnable() {
          @Override
          public void run() {
            Intent intent=new Intent();
            intent.setAction(ConstantsParams.PARAM_RECEIVE_MESSAGE);
            intent.putExtra("topic", topic);
            intent.putExtra("content", content);
            intent.putExtra("qos", qos);
            UIUtils.getContext().sendBroadcast(intent);
          }
        });
    }

  /**
   * 发送消息
   * @param topic
   * @param content
   */
    public static void broadSendMsg(final String topic, final String content) {
        UIUtils.runInMainThread(new Runnable() {
          @Override
          public void run() {
            if (!UIUtils.isServiceWorked(IMService.class.getName())) {
              UIUtils.getContext().startService(new Intent(UIUtils.getContext(), IMService.class));
            }
            Intent intent = new Intent();
            intent.setAction(ConstantsParams.PARAM_SEND_MESSAGE);
            intent.putExtra("topic", topic);
            intent.putExtra("content", content);
            UIUtils.getContext().sendBroadcast(intent);
          }
        });
    }
}
