package com.tky.mqtt.paho;

import android.content.Intent;

public class MessageOper {
	/**
	 * 发消息
	 * @param topic
	 * @param content
	 */
	public static void sendMsg(String topic, String content){
		Intent intent = new Intent();
		intent.setAction(ReceiverParams.SENDMESSAGE);
		intent.putExtra("topic", topic);
		intent.putExtra("content", content);
		UIUtils.getContext().sendBroadcast(intent);
	}
}
