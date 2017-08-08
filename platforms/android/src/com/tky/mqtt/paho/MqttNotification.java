package com.tky.mqtt.paho;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.support.v4.app.NotificationCompat.Builder;

import com.r93535.im.BadgeIntentService;
import com.r93535.im.MainActivity;
import com.tky.mqtt.dao.ChatList;
import com.tky.mqtt.dao.SystemMsg;
import com.tky.mqtt.paho.utils.BadgeUtil;
import com.tky.mqtt.services.ChatListService;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import me.leolin.shortcutbadger.ShortcutBadger;

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

	public static void showNotify(String userID, int imgRes, String title, String content, Intent intent) {
		/*if (manager == null) {
			manager = (NotificationManager) UIUtils.getContext().getSystemService(Context.NOTIFICATION_SERVICE);
		}*/
		manager.cancel(calcMsgID(userID));
		if (!UIUtils.isApplicationBroughtToBackground(UIUtils.getContext())) {
			return;
		}
		try{
			int badgeCount = SPUtils.getInt("badgeCount",0);
			System.out.println("后端取出存的count值11111"+badgeCount);
			//从数据库获取未读数量
			ChatListService chatListService=ChatListService.getInstance(UIUtils.getContext());
			List<ChatList> chatLists=chatListService.loadAllData();
			int count=0;
			for (int i=0;i<chatLists.size();i++){
				count += Integer.parseInt(chatLists.get(i).getCount()) ;
			}
			if(badgeCount != count){
				badgeCount=count;
			}
			boolean success= ShortcutBadger.applyCount(UIUtils.getContext(), badgeCount);
			System.out.println("未读数量222222"+badgeCount);
			UIUtils.getContext().startService(
					new Intent(UIUtils.getContext(), BadgeIntentService.class).putExtra("badgeCount", badgeCount));
		}catch (Exception e){
			e.printStackTrace();
		}
//		Builder notificationCompat = new Builder(UIUtils.getContext());
//		PendingIntent pendingIntent = PendingIntent.getActivity(UIUtils.getContext(), requestCode, intent,  0);
//		long when = System.currentTimeMillis();
//		//设置点击一次后消失（如果没有点击事件，则该方法无效。）
//		notificationCompat.setAutoCancel(true)
//			.setContentTitle(title)
//			.setContentIntent(pendingIntent)
//			.setContentText(content)
//			.setTicker(content).setWhen(when)
//			.setSmallIcon(imgRes)
//			.setLargeIcon(BitmapFactory.decodeResource(UIUtils.getResources(), imgRes));
//		Notification notification = notificationCompat.build();
//		manager.notify(addAndGetNotification(userID), notification);
////		BadgeUtil.resetBadgeCount(notification, UIUtils.getContext());
//		BadgeUtil.setBadgeCount(notification, UIUtils.getContext(), badgeCount);
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
