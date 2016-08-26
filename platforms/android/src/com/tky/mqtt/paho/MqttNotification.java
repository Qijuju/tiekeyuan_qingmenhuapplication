package com.tky.mqtt.paho;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.service.notification.StatusBarNotification;
import android.support.v4.app.NotificationCompat.Builder;

import com.ionicframework.im366077.R;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MqttNotification {
	private static NotificationManager manager;
	private static final int messageId = Integer.MAX_VALUE / (new Random().nextInt(100) + 1);
	private static int requestCode = 0x1001;

	private static List<String> notificationList=new ArrayList<String>();

	/**
	 * 类初始化时初始化NotificationManager并取消所有通知栏消息
	 */
	static {
		if (manager == null) {
			manager = (NotificationManager) UIUtils.getContext().getSystemService(Context.NOTIFICATION_SERVICE);
		}
		cancelAll();
	}

	public static void showNotify(String userID, String title, String content, Intent intent) {
		/*if (manager == null) {
			manager = (NotificationManager) UIUtils.getContext().getSystemService(Context.NOTIFICATION_SERVICE);
		}*/
		manager.cancel(calcMsgID(userID));
		Builder notificationCompat = new Builder(UIUtils.getContext());
		PendingIntent pendingIntent = PendingIntent.getActivity(UIUtils.getContext(), requestCode, intent,  0);
		long when = System.currentTimeMillis();
		//设置点击一次后消失（如果没有点击事件，则该方法无效。）
		notificationCompat.setAutoCancel(true)
			.setContentTitle(title)
			.setContentIntent(pendingIntent)
			.setContentText(content)
			.setTicker(content).setWhen(when)
			.setSmallIcon(R.drawable.screen);
		Notification notification = notificationCompat.build();
		manager.notify(addAndGetNotification(userID), notification);
	}

	/**
	 * 取消所有通知栏消息
	 */
	public static void cancelAll() {
		if (manager != null) {
			manager.cancelAll();
		}
	}

	/**
	 * 取消通知栏消息
	 */
	public static void cancel(int msgID) {
		if (manager != null) {
			manager.cancel(msgID);
		}
	}

	public static int getMessageid() {
		return messageId;
	}

	public static int getRequestCode() {
		return requestCode;
	}

	public static int calcMsgID(String userid) {
		int msgID = Integer.MAX_VALUE / (new Random().nextInt(100) + 1);
		if (userid != null) {
			msgID=0;
			char[] chars = userid.toCharArray();
			for (int i = 0; i < chars.length; i++) {
				msgID +=chars[i];
			}
		}
		return msgID;
	}

	public static int addAndGetNotification(String arg){
		if(notificationList.contains(arg)){
			int index=notificationList.indexOf(arg);
			String old=notificationList.get(index);
			notificationList.remove(index);
			notificationList.add(0,old);
		}else{
			if(notificationList.size() <5){
				notificationList.add(0,arg);
			}else{
				cancel(calcMsgID(notificationList.get(4)));
				notificationList.remove(4);
				notificationList.add(0,arg);
			}
		}
		return calcMsgID(notificationList.get(0));
	}
}
