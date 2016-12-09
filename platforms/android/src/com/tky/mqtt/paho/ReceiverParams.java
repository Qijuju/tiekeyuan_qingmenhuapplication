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

	/**
	 * 消息发送成功
	 */
	public static final String SENDMESSAGE_SUCCESS="com.tky.mqtt.mqttserverdemo.sendmessagesuccess";

	/**
	 * 由于网络断开而断开MQTT
	 */
	public static final String NET_DOWN_MQTT = "com.tky.mqtt.mqttserverdemo.net_down_mqtt";
	/**
	 * 彻底断掉MQTT的后续工作
	 */
	public static final String FREEZE_MQTT = "com.tky.mqtt.mqttserverdemo.free_mqtt";
	/**
	 * 打开文件管理器获取文件之后
	 */
	public static final String DOC_FILE_GET = "com.tky.mqtt.mqttserverdemo.doc_file_get";
	/**
	 * 拍照后获取到图片
	 */
	public static final String PHOTO_FILE_GET = "com.tky.mqtt.mqttserverdemo.photo_file_get";
	/**
	 * MQTT启动
	 */
	public static final String MQTT_START = "com.tky.mqtt.mqttserverdemo.mqtt_start";
	/**
	 * 网络断开
	 */
	public static final String NET_DISCONNECTED = "com.sls.mqtt.netdisconnected";

	/**
	 * 网络连接上
	 */
	public static final String NET_CONNECTED = "com.sls.mqtt.netconnected";
	/**
	 * mqtt连接
	 */
	public static final String RECEIVER_MQTT_STARTED ="com.sls.mqtt.receivermqttstarted" ;

	/**
	 * mqtt断开连接
	 */
	public static final String RECEIVER_MQTT_CLOSED ="com.sls.mqtt.receivermqttclosed" ;

	/**
	 * 重启service
	 */
	public static final String RESTARTSERVICE = "com.sls.mqtt.restartservice";

	/**
	 * 距离感应器的广播接收者ACTION
	 */
	public static final String RECEIVER_PROXY = "com.sls.mqtt.receiver_proxy";

	/**
	 * 声音变化的广播接收者
	 */
	public static final String VOLUME_CHANGED_ACTION = "android.media.VOLUME_CHANGED_ACTION";
}
