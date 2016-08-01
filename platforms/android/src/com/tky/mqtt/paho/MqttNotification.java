package com.tky.mqtt.paho;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat.Builder;

import com.ionicframework.im366077.R;

import java.util.Random;

public class MqttNotification {
	private static NotificationManager manager;
	private static final int messageId = Integer.MAX_VALUE / (new Random().nextInt(100) + 1);
	private static int requestCode = 0x1001;

	public static void showNotify(String title, String content, Intent intent) {
		if (manager == null) {
			manager = (NotificationManager) UIUtils.getContext().getSystemService(Context.NOTIFICATION_SERVICE);
		}
		manager.cancel(messageId);
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
		manager.notify(messageId, notification);
	}

	public static int getMessageid() {
		return messageId;
	}

	public static int getRequestCode() {
		return requestCode;
	}
}
