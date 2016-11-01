package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.ToastUtil;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.receiver
 * 日期：2016/10/24 23:30
 * 描述：
 */
public class MqttSendMsgReceiver extends BroadcastReceiver {
    private OnMqttSendErrorListener onMqttSendErrorListener;
    @Override
    public void onReceive(Context context, Intent intent) {
        if(ReceiverParams.SENDMESSAGE_ERROR.equals(intent.getAction())){//发送消息中断网，回调
            if(onMqttSendErrorListener !=null){
                onMqttSendErrorListener.onMqttSendError();
            }
        }else if(ReceiverParams.SENDMESSAGE_SUCCESS.equals(intent.getAction())){//发送消息成功，回调
            if(onMqttSendErrorListener !=null){
                onMqttSendErrorListener.onMqttSendSuccess();
            }
        }
    }

    public void setOnMqttSendErrorListener(OnMqttSendErrorListener onMqttSendErrorListener) {
        this.onMqttSendErrorListener = onMqttSendErrorListener;
    }

    public interface OnMqttSendErrorListener{
        public void onMqttSendSuccess();
        public void onMqttSendError();
    }
}
