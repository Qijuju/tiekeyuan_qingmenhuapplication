package com.tky.im.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.ionicframework.im366077.Constants;
import com.tky.im.params.ConstantsParams;

/**
 * Created by tkysls on 2017/4/11.
 */

public class IMReceiver extends BroadcastReceiver {

    private OnMessageSendListener onMessageSendListener;
    private OnMessageReceivedListener onMessageReceivedListener;
    private OnConnectedListener onConnectedListener;
    private OnConnectDownListener onConnectDownListener;
    private OnIMReconnect onIMReconnect;
    private OnKillIM onKillIM;
    private OnNetStatusChangeListener onNetStatusChangeListener;
    private OnStopIMService onStopIMService;
    private OnTopicSubscribeListener onTopicSubscribeListener;
    private OnTopicUnSubscribeListener onTopicUnSubscribeListener;
    private OnBashIMListener onBashIMListener;

    @Override
    public void onReceive(Context context, Intent intent) {
        if (ConstantsParams.PARAM_SEND_MESSAGE.equals(intent.getAction())) {//发消息接收
            if (onMessageSendListener != null) {
                onMessageSendListener.onSend(intent.getStringExtra("topic"), intent.getStringExtra("content"));
            }
        } else if (ConstantsParams.PARAM_RECEIVE_MESSAGE.equals(intent.getAction())) {//收消息接收
            if (onMessageReceivedListener != null) {
                onMessageReceivedListener.onReceive(
                        intent.getStringExtra("topic"),
                        intent.getStringExtra("content"),
                        intent.getIntExtra("qos", -1)
                );
            }
        } else if (ConstantsParams.PARAM_CONNECT_SUCCESS.equals(intent.getAction())) {//连接成功接收
            if (onConnectedListener != null) {
                onConnectedListener.onConnected();
            }
        } else if (ConstantsParams.PARAM_CONNECT_FAILURE.equals(intent.getAction())) {//连接失败接收
            if (onConnectedListener != null) {
                onConnectedListener.onConnectFailure();
            }
        } else if (ConstantsParams.PARAM_IM_DOWN.equals(intent.getAction())) {//MQTT断开接收
            if (onConnectDownListener != null) {
                onConnectDownListener.onConnectDown();
            }
        } else if (ConstantsParams.PARAM_RE_CONNECT.equals(intent.getAction())) {//断开重连
            if (onIMReconnect != null) {
                onIMReconnect.onReconnect();
            }
        } else if (ConstantsParams.PARAM_KILL_IM.equals(intent.getAction())) {//接收到杀死IM的广播，调用杀死IM的方法，但是没有杀死对应的IMService
            if (onKillIM != null) {
                onKillIM.onKillIM();
            }
        } else if (ConstantsParams.PARAM_NET_UP.equals(intent.getAction())) {//网络启动
            if (onNetStatusChangeListener != null) {
                onNetStatusChangeListener.onNetUp();
            }
        } else if (ConstantsParams.PARAM_NET_DOWN.equals(intent.getAction())) {//网络关闭
            if (onNetStatusChangeListener != null) {
                onNetStatusChangeListener.onNetDown();
            }
        } else if (ConstantsParams.PARAM_STOP_IMSERVICE.equals(intent.getAction())) {//干死IM，并且干死IMService
            if (onStopIMService != null) {
                onStopIMService.onStopIMService();
            }
        } else if (ConstantsParams.PARAM_TOPIC_SUBSCRIBE.equals(intent.getAction())) {//topic被订阅的时候
            if (onTopicSubscribeListener != null) {
                onTopicSubscribeListener.onTopicSubscribe(intent.getStringExtra("topic"));
            }
        } else if (ConstantsParams.PARAM_TOPIC_UNSUBSCRIBE.equals(intent.getAction())) {//topic被反订阅的时候
            if (onTopicUnSubscribeListener != null) {
                onTopicUnSubscribeListener.onTopicUnSubscribe(intent.getStringExtra("topic"));
            }
        } else if (ConstantsParams.PARAM_BASH_IM.equals(intent.getAction())) {//重置IM（断开MQTT让其重新连接）
            if (onBashIMListener != null) {
                onBashIMListener.onBashIM();
            }
        }
    }

    public interface OnMessageSendListener {
        public void onSend(String topic, String content);
    }

    public interface OnMessageReceivedListener {
        public void onReceive(String topic, String content, int qos);
    }

    public interface OnConnectedListener {
        public void onConnected();
        public void onConnectFailure();
    }

    public interface OnConnectDownListener {
        public void onConnectDown();
    }

    public interface OnIMReconnect {
        public void onReconnect();
    }

    public interface OnKillIM {
        public void onKillIM();
    }

    public interface OnNetStatusChangeListener {
        public void onNetUp();
        public void onNetDown();
    }

    public interface OnStopIMService {
        public void onStopIMService();
    }

    public interface OnTopicSubscribeListener {
        public void onTopicSubscribe(String topic);
    }

    public interface OnTopicUnSubscribeListener {
        public void onTopicUnSubscribe(String topic);
    }

    public interface OnBashIMListener {
        public void onBashIM();
    }

    public void setOnMessageSendListener(OnMessageSendListener onMessageSendListener) {
        this.onMessageSendListener = onMessageSendListener;
    }

    public void setOnMessageReceivedListener(OnMessageReceivedListener onMessageReceivedListener) {
        this.onMessageReceivedListener = onMessageReceivedListener;
    }

    public void setOnConnectedListener(OnConnectedListener onConnectedListener) {
        this.onConnectedListener = onConnectedListener;
    }

    public void setOnConnectDownListener(OnConnectDownListener onConnectDownListener) {
        this.onConnectDownListener = onConnectDownListener;
    }

    public void setOnIMReconnect(OnIMReconnect onIMReconnect) {
        this.onIMReconnect = onIMReconnect;
    }

    public void setOnKillIM(OnKillIM onKillIM) {
        this.onKillIM = onKillIM;
    }

    public void setOnNetStatusChangeListener(OnNetStatusChangeListener onNetStatusChangeListener) {
        this.onNetStatusChangeListener = onNetStatusChangeListener;
    }

    public void setOnStopIMService(OnStopIMService onStopIMService) {
        this.onStopIMService = onStopIMService;
    }

    public void setOnTopicSubscribeListener(OnTopicSubscribeListener onTopicSubscribeListener) {
        this.onTopicSubscribeListener = onTopicSubscribeListener;
    }

    public void setOnTopicUnSubscribeListener(OnTopicUnSubscribeListener onTopicUnSubscribeListener) {
        this.onTopicUnSubscribeListener = onTopicUnSubscribeListener;
    }

    public void setOnBashIMListener(OnBashIMListener onBashIMListener) {
        this.onBashIMListener = onBashIMListener;
    }
}
