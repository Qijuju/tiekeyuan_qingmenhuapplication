package com.tky.mqtt.paho;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import org.eclipse.paho.client.mqttv3.MqttException;

/**
 * 单例的
 */
public class MqttReceiver extends BroadcastReceiver {

	public static boolean hasRegister = false;
	private static boolean flag = false;
	private OnMessageArrivedListener onMessageArrivedListener;
	private OnMessageSendListener onMessageSendListener;
	private OnTopicSubscribeListener onTopicSubscribeListener;
	private OnNetUpListener onNetUpListener;
	private OnMqttStopListener onMqttStopListener;
	private OnConnectionDownListener onConnectionDownListener;
//	private OnMqttSendErrorListener onMqttSendErrorListener;
	private OnNetDownListener onNetDownListener;
	private OnFreezeMqttListener onFreezeMqttListener;

	private static MqttReceiver INSTANCE = new MqttReceiver();

	private MqttReceiver(){
	}

	public static void unregister() {
		if (INSTANCE != null) {
			UIUtils.getContext().unregisterReceiver(INSTANCE);
			INSTANCE = null;
		}
	}

	public synchronized static MqttReceiver getInstance() {
		if (!flag) {
			flag = true;
			IntentFilter filter = new IntentFilter();
			filter.addAction(ReceiverParams.SENDMESSAGE);
			filter.addAction(ReceiverParams.RECONNECT_MQTT);
			filter.addAction(ReceiverParams.NET_DOWN_MQTT);
			filter.addAction(ReceiverParams.CONNECTION_DOWN_MQTT);
			filter.addAction(ReceiverParams.SUBSCRIBE);
			UIUtils.getContext().registerReceiver(INSTANCE, filter);
		}
//		return INSTANCE == null ? INSTANCE = new MqttReceiver() : INSTANCE;
		return INSTANCE;
	}

	@Override
	public void onReceive(Context context, Intent intent) {
		if (intent.getAction().equals(ReceiverParams.MESSAGEARRIVED)) {//接收到消息的广播
			if (onMessageArrivedListener != null) {
				onMessageArrivedListener.messageArrived(
				intent.getStringExtra("topic"),
				intent.getStringExtra("content"),
				intent.getIntExtra("qos", -1));
			}
		} else if (intent.getAction().equals(ReceiverParams.SENDMESSAGE)) {//发消息的广播
			if (onMessageSendListener != null) {
				onMessageSendListener.onSend(intent.getStringExtra("topic"), intent.getStringExtra("content"));
			}
		} else if (intent.getAction().equals(ReceiverParams.SUBSCRIBE)) {//发布主题的广播
			if (onTopicSubscribeListener != null) {
				String topic = intent.getStringExtra("topic");
				int qos = intent.getIntExtra("qos", -1);
				//获取旧的topic
				String topicsAndQoss = SPUtils.getString(MqttTopicRW.getKey(), "");
				//新的topic和旧的topic组织在一起
				topicsAndQoss = topicsAndQoss + ";" + topic + "#" + qos;
				//将新的topic存储到本地
				SPUtils.save(MqttTopicRW.getKey(), topicsAndQoss);
				//回调并发布新的主题
				try {
					onTopicSubscribeListener.onTopicSubscribe(topic, qos);
				} catch (MqttException e) {
					e.printStackTrace();
				}
			}
		} else if (ReceiverParams.RECONNECT_MQTT.equals(intent.getAction())) {
			if (onNetUpListener != null) {
				onNetUpListener.onNetUp();
			}
		} else if (ReceiverParams.STOP_MQTT.equals(intent.getAction())) {
			if (onMqttStopListener != null) {
				onMqttStopListener.onMqttStop();
			}
		} else if (ReceiverParams.CONNECTION_DOWN_MQTT.equals(intent.getAction())) {//手动终止MQTT连接
			if (onConnectionDownListener != null) {
				onConnectionDownListener.onConnectionDown();
			}
		} else if (ReceiverParams.NET_DOWN_MQTT.equals(intent.getAction())) {//由于网络断开而断开MQTT的监听回调
			if (onNetDownListener != null) {
				onNetDownListener.onNetDown();
			}
		} else if (ReceiverParams.FREEZE_MQTT.equals(intent.getAction())) {//彻底断掉MQTT并处理善后工作
			if (onFreezeMqttListener != null) {
				onFreezeMqttListener.OnFreezeMqtt();
			}
		}
	}

	public interface OnMessageArrivedListener {
		public void messageArrived(String topic, String content, int qos);
	}

	public interface OnMessageSendListener {
		public void onSend(String topic, String content);
	}

	public interface OnTopicSubscribeListener {
		public void onTopicSubscribe(String topic, int qos) throws MqttException;
	}

	public interface OnMqttStopListener {
		public void onMqttStop();
	}


/*	public interface OnMqttSendErrorListener{
		public void onMqttSendSuccess();
		public void onMqttSendError();
	}*/

	/**
	 * 网络连接后的回调监听
	 */
	public interface OnNetUpListener {
		public void onNetUp();
	}

	/**
	 * Mqtt断开连接的监听
	 */
	public interface OnConnectionDownListener {
		public void onConnectionDown();
	}

	/**
	 * Mqtt由于网络断开而断开连接的监听
	 */
	public interface OnNetDownListener {
		public void onNetDown();
	}

	/**
	 * 彻底断掉MQTT并处理善后工作
	 */
	public interface OnFreezeMqttListener {
		public void OnFreezeMqtt();
	}

	public void setOnMessageArrivedListener(
			OnMessageArrivedListener onMessageArrivedListener) {
		this.onMessageArrivedListener = onMessageArrivedListener;
	}

	public void setOnMessageSendListener(OnMessageSendListener onMessageSendListener) {
		this.onMessageSendListener = onMessageSendListener;
	}

	public void setOnTopicSubscribeListener(
			OnTopicSubscribeListener onTopicSubscribeListener) {
		this.onTopicSubscribeListener = onTopicSubscribeListener;
	}

	public void setOnNetUpListener(OnNetUpListener onNetUpListener) {
		this.onNetUpListener = onNetUpListener;
	}

	public void setOnMqttStopListener(OnMqttStopListener onMqttStopListener) {
		this.onMqttStopListener = onMqttStopListener;
	}

	public void setOnConnectionDownListener(OnConnectionDownListener onConnectionDownListener) {
		this.onConnectionDownListener = onConnectionDownListener;
	}

/*	public void setOnMqttSendErrorListener(OnMqttSendErrorListener onMqttSendErrorListener) {
		if (this.onMqttSendErrorListener == null) {
			this.onMqttSendErrorListener = onMqttSendErrorListener;
		}
	}*/

	public void setOnNetDownListener(OnNetDownListener onNetDownListener) {
		this.onNetDownListener = onNetDownListener;
	}

	public void setOnFreezeMqttListener(OnFreezeMqttListener onFreezeMqttListener) {
		this.onFreezeMqttListener = onFreezeMqttListener;
	}
}
