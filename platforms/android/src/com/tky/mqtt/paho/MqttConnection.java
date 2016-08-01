package com.tky.mqtt.paho;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import java.util.Iterator;
import java.util.Map;
public class MqttConnection {

	private MqttParams params;
	private MqttAsyncClient mqttAsyncClient;
	private Context context;
	private boolean isReconnect = false;

	public void connect(Context context) throws MqttException {
		this.context = context;
		params = new MqttParams();
		mqttAsyncClient = new MqttAsyncClient(params.getServerURI(),
				params.getClientId(), params.getPersistence(),
				params.getPingSender());
		IMqttActionListener callback = new MqttActionListener();
		mqttAsyncClient.connect(params.getOptions(), null, callback);

		MqttCallback mqttCallback = new MqttMessageCallback(context, this);

		mqttAsyncClient.setCallback(mqttCallback);
	}

	/**
	 * 重新连接
	 * @throws MqttException
	 */
	public void reconnect() throws MqttException {
		if (mqttAsyncClient.isConnected()) {
			mqttAsyncClient.close();
			mqttAsyncClient.disconnect();
			mqttAsyncClient = null;
		}
		isReconnect = true;
		connect(context);
	}

	public class MqttActionListener implements IMqttActionListener {

		@Override
		public void onFailure(IMqttToken arg0, Throwable arg1) {

		}

		@Override
		public void onSuccess(IMqttToken arg0) {
			UIUtils.runInMainThread(new Runnable() {
				@Override
				public void run() {
					try {
//						if (!isReconnect) {
							Map<String, Integer> topicsAndQoss = MqttTopicRW.getTopicsAndQoss();
							Iterator<String> it = topicsAndQoss.keySet().iterator();
							while (it.hasNext()) {
								String key = it.next();
								Integer value = topicsAndQoss.get(key);
								subscribe(key, value);
							}
//						}
						MqttReceiver receiver = MqttReceiver.getInstance();
						IntentFilter filter = new IntentFilter();
						filter.addAction(ReceiverParams.SENDMESSAGE);
						filter.addAction(ReceiverParams.RECONNECT_MQTT);
						filter.addAction(ReceiverParams.CONNECTION_DOWN_MQTT);
						context.registerReceiver(receiver, filter);
						//发消息的回调
						receiver.setOnMessageSendListener(new MqttReceiver.OnMessageSendListener() {
							@Override
							public void onSend(String topic, String content) {
								MqttMessage message = new MqttMessage();
								message.setPayload(content.getBytes());
//								message.setQos(topic.equals("zhuanjiazu") ? 0 : 2);
								message.setQos(1);
								try {
									MqttConnection.this.publish(topic, message);
								} catch (MqttException e) {
									e.printStackTrace();
								}
//								Toast.makeText(context, content, Toast.LENGTH_SHORT).show();
							}
						});

						/**
						 * 断开重连的监听
						 */
						receiver.setOnNetUpListener(new MqttReceiver.OnNetUpListener() {
							@Override
							public void onNetUp() {
								try {
									reconnect();
								} catch (MqttException e) {
									e.printStackTrace();
								}
							}
						});

						/**
						 * 断掉MQTT的连接
						 */
						receiver.setOnConnectionDownListener(new MqttReceiver.OnConnectionDownListener() {
							@Override
							public void onConnectionDown() {
								try {
									closeConnection();
								} catch (MqttException e) {
									e.printStackTrace();
								}
							}
						});


						//发布主题的广播
						MqttReceiver topicReceiver = MqttReceiver.getInstance();
						IntentFilter topicFilter = new IntentFilter();
						topicFilter.addAction(ReceiverParams.SUBSCRIBE);
						context.registerReceiver(topicReceiver, topicFilter);
						//发布主题的回调
						topicReceiver.setOnTopicSubscribeListener(new MqttReceiver.OnTopicSubscribeListener() {
							@Override
							public void onTopicSubscribe(String topic, int qos) throws MqttException {
								subscribe(topic, qos);
							}
						});
					} catch (MqttException e) {
						e.printStackTrace();
					}
				}
			});
		}
	}

	public void subscribe(String topic, int qos) throws MqttException {
		if (mqttAsyncClient != null) {
			mqttAsyncClient.subscribe(topic, qos);
		}
	}

	public void subscribe(String[] topics, int[] qoss) throws MqttException {
		if (mqttAsyncClient != null) {
			mqttAsyncClient.subscribe(topics, qoss);
		}
	}

	/**
	 * 发布消息
	 * @param topic
	 * @param message
	 * @throws MqttException
	 */
	public void publish(String topic, MqttMessage message) throws MqttException{
		if (mqttAsyncClient != null) {
			mqttAsyncClient.publish(topic, message, null, new IMqttActionListener() {
				@Override
				public void onSuccess(IMqttToken iMqttToken) {

				}

				@Override
				public void onFailure(IMqttToken iMqttToken, Throwable throwable) {
					//发送中，消息发送失败，回调
					Intent intent=new Intent();
					intent.setAction(ReceiverParams.SENDMESSAGE_ERROR);
					context.sendBroadcast(intent);
				}
			});
		}
	}

	public MqttAsyncClient getMqttAsyncClient() {
		return mqttAsyncClient;
	}
	/**
	 * 手动断开连接
	 * @throws MqttException
	 */
	public void closeConnection() throws MqttException {
		if (mqttAsyncClient != null && mqttAsyncClient.isConnected()) {
			mqttAsyncClient.disconnect();
			if (mqttAsyncClient != null) {
				mqttAsyncClient.close();
				mqttAsyncClient = null;
			}
		}
	}

}
