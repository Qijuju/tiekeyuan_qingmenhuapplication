package com.tky.mqtt.paho;

public class ReceiverParams {
	/**
	 * 接收到消息
	 */
	public static final String MESSAGEARRIVED = "com.tky.mqtt.mqttserverdemo.messagearrived";
	/**
	 * 发消息
	 */
	public static final String SENDMESSAGE = "com.tky.mqtt.mqttserverdemo.sendmessage";
	/**
	 * 发布主题
	 */
	public static final String SUBSCRIBE = "com.tky.mqtt.mqttserverdemo.subscribe";
	/**
	 * 联网后重新连接
	 */
	public static final String RECONNECT_MQTT = "com.tky.mqtt.mqttserverdemo.reconnectmqtt";
	/**
	 * 停止MQTT
	 */
	public static final String STOP_MQTT = "com.tky.mqtt.mqttserverdemo.stopmqtt";
	/**
	 * MQTT连接断掉
	 */
	public static final String CONNECTION_DOWN_MQTT = "com.tky.mqtt.mqttserverdemo.connectiondownmqtt";

	/**
	 * 消息发送失败
	 */
	public static final String SENDMESSAGE_ERROR="com.tky.mqtt.mqttserverdemo.sendmessageerror";
}
