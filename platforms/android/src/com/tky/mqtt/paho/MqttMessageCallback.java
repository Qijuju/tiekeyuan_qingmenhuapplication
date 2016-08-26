package com.tky.mqtt.paho;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.ionicframework.im366077.MainActivity;
import com.ionicframework.im366077.R;
import com.tky.mqtt.paho.bean.MessageBean;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.paho.utils.NetUtils;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

public class MqttMessageCallback implements MqttCallback {

	private Context context;
	private final MqttConnection mqttAsyncClient;
	/**
	 * 重连次数
	 */
	private static int count = 0;

	public MqttMessageCallback(Context context, MqttConnection mqttAsyncClient) {
		this.context = context;
		this.mqttAsyncClient = mqttAsyncClient;
	}

	@Override
	public void connectionLost(Throwable arg0) {
		Log.d("reconnect", "断掉了，哥们~~~" + (mqttAsyncClient == null ? "nullllll" : "notnulll"));
		if (NetUtils.isConnect(context)) {
//		if (NetUtils.isConnect(context) && !SPUtils.getBoolean("shoudong", false)) {
			try {
				count++;
				if (count <= 5) {
					mqttAsyncClient.reconnect();
				} else {
					ToastUtil.showSafeToast("异常连接MQTT，请重新进行登录！");
				}
			} catch (MqttException e) {
				e.printStackTrace();
			}
		}
	}

	@Override
	public void deliveryComplete(IMqttDeliveryToken arg0) {
	}

	@Override
	public void messageArrived(final String topic, final MqttMessage msg) throws Exception {
		Log.d("messageArrived", new String(msg.getPayload()));
		final MessageBean map = (MessageBean) MessageOper.unpack(msg.getPayload());
		final String msgTopic = (String) map.getSessionid();
		final String msgContent = (String) map.getMessage();
		UIUtils.runInMainThread(new Runnable() {

			@Override
			public void run() {
				MqttNotification.showNotify(msgTopic, R.drawable.ic_launcher, msgTopic, msgContent, new Intent(context, MainActivity.class));
				Intent intent = new Intent();
				intent.setAction(ReceiverParams.MESSAGEARRIVED);
				intent.putExtra("topic", topic);
				String json = GsonUtils.toJson(map, MessageBean.class);
				intent.putExtra("content", json);
				intent.putExtra("qos", msg.getQos());
				msg.clearPayload();
				context.sendBroadcast(intent);
			}
		});
	}
}
