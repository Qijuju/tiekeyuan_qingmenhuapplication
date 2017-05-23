package com.tky.mqtt.paho;

import android.content.Intent;
import android.text.TextUtils;

import com.tky.im.bean.TopicsCoupleQoss;
import com.tky.im.params.ConstantsParams;
import com.tky.mqtt.paho.utils.SwitchLocal;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class MqttTopicRW {
	private static final String key = "topics_and_qoss";
	/**
	 * 启动Mqtt之前调用
	 * 格式：topic#qos
	 * @param topics
	 */
	public static void writeTopicsAndQos(String[] topics, int[] qoss) {
		if (topics == null) {
			SPUtils.save(key, "");
			return;
		}
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < topics.length; i++) {
			sb.append(topics[i] + "#" + qoss[i] + ";");
		}
		String topicsAndQoss = sb.toString();
		topicsAndQoss = topicsAndQoss.substring(0, topicsAndQoss.length() - 1);
		SPUtils.save(key, topicsAndQoss);
	}

	/**
	 * 获取启动MQTT需要的TOPICs
	 * @return
	 */
	public static String getStartTopicsAndQoss() {
		String topicsAndQoss = SPUtils.getString(key, "");
		return topicsAndQoss.replace(";", ",");
	}

	public static Map<String, Integer> getTopicsAndQoss() {
		Map<String, Integer> map = new HashMap<String, Integer>();
		String topicsAndQoss = SPUtils.getString(key, "");
		if (TextUtils.isEmpty(topicsAndQoss)) {
			return map;
		}
		String[] tpaqs = topicsAndQoss.split(";");
		for (int i = 0; i < tpaqs.length; i++) {
			String[] tpaqArr = tpaqs[i].split("#");
			map.put(tpaqArr[0], Integer.parseInt(tpaqArr[1]));
		}
		return map;
	}

	/**
	 * 返回topics和qoss的匹配对（所有的topics和所有的qoss）
	 * @return
     */
	public static TopicsCoupleQoss getTopicsAndQoss2() {
		String topicsAndQoss = SPUtils.getString(key, "");
		if (TextUtils.isEmpty(topicsAndQoss)) {
			return null;
		}
		String[] tpaqs = topicsAndQoss.split(";");
		if (tpaqs.length <= 0) {
			return null;
		}
		String[] topics = new String[tpaqs.length];
		int[] qoss = new int[tpaqs.length];
		for (int i = 0; i < tpaqs.length; i++) {
			String[] tpaqArr = tpaqs[i].split("#");
//			map.put(tpaqArr[0], Integer.parseInt(tpaqArr[1]));
			topics[i] = tpaqArr[0];
			qoss[i] = Integer.parseInt(tpaqArr[1]);
		}
		return new TopicsCoupleQoss(topics, qoss);
	}

	/**
	 * 删除一个topic，根据groupID
	 * @param groupID
	 */
	public static void remove(String groupID) {
		Map<String, Integer> topicsAndQoss = getTopicsAndQoss();
		String aTopic = SwitchLocal.getATopic(MType.G, groupID);
		topicsAndQoss.remove(aTopic);
		StringBuilder sb = new StringBuilder();
		Iterator iterator = topicsAndQoss.keySet().iterator();
		while (iterator.hasNext()){
			String key=(String)iterator.next();
			int val=topicsAndQoss.get(key);
			sb.append(key+"#"+val+";");
		}
		String resavetopic = sb.toString();
		resavetopic = resavetopic.substring(0, resavetopic.length() - 1);
		SPUtils.save(key, resavetopic);
	}

	/**
	 * 检查发过来的消息是否是自己发送的
	 * @param type
	 * @param from
	 * @return
	 */
	public static boolean isFromMe(String type, String from) {
		String aTopic = SwitchLocal.getATopic(SwitchLocal.getType(type), from);
		return getTopicsAndQoss().containsKey(aTopic);
	}

	/**
	 * 发布主题，必须是启动Mqtt之后
	 * @param topic
	 * @param qos 为使消息不发生重复，此处直接改为2
	 */
	public static void append(String topic, int qos) {
		Intent intent = new Intent();
//		intent.setAction(ReceiverParams.SUBSCRIBE);
		intent.setAction(ConstantsParams.PARAM_TOPIC_SUBSCRIBE);
		intent.putExtra("topic", topic);
		intent.putExtra("qos", 2);
		UIUtils.getContext().sendBroadcast(intent);
		SPUtils.save(getKey(), SPUtils.getString(getKey(), "") + ";" + topic + "#" + 2);
	}

	public static String getKey() {
		return key;
	}
}
