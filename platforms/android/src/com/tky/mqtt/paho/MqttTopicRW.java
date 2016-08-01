package com.tky.mqtt.paho;

import android.content.Intent;

import java.util.HashMap;
import java.util.Map;

public class MqttTopicRW {
	private static final String key = "topics_and_qoss";
	/**
	 * 启动Mqtt之前调用
	 * 格式：topic#qos
	 * @param topics
	 */
	public static void writeTopicsAndQos(String[] topics, int[] qoss) {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < topics.length; i++) {
			sb.append(topics[i] + "#" + qoss[i] + ";");
		}
		String topicsAndQoss = sb.toString();
		topicsAndQoss = topicsAndQoss.substring(0, topicsAndQoss.length() - 1);
		SPUtils.save(key, topicsAndQoss);
	}
	
	public static Map<String, Integer> getTopicsAndQoss() {
		Map<String, Integer> map = new HashMap<String, Integer>();
		String topicsAndQoss = SPUtils.getString(key, "");
		String[] tpaqs = topicsAndQoss.split(";");
		for (int i = 0; i < tpaqs.length; i++) {
			String[] tpaqArr = tpaqs[i].split("#");
			map.put(tpaqArr[0], Integer.parseInt(tpaqArr[1]));
		}
		return map;
	}
	
	/**
	 * 发布主题，必须是启动Mqtt之后
	 * @param topic
	 * @param qos
	 */
	public static void append(String topic, int qos) {
		Intent intent = new Intent();
		intent.setAction(ReceiverParams.SUBSCRIBE);
		intent.putExtra("topic", topic);
		intent.putExtra("qos", qos);
		UIUtils.getContext().sendBroadcast(intent);
	}

	public static String getKey() {
		return key;
	}
}
