package com.r93535.im;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.UIUtils;

import me.leolin.shortcutbadger.ShortcutBadger;

public class BadgeIntentService extends IntentService {

    private int notificationId = 0;

    public BadgeIntentService() {
        super("BadgeIntentService");
//        System.out.println("lalala");
    }

    private NotificationManager mNotificationManager;

    @Override
    public void onStart(Intent intent, int startId) {
        super.onStart(intent, startId);
        mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        if (intent != null) {
            int badgeCount = intent.getIntExtra("badgeCount", 0);
            String type = intent.getStringExtra("type");
            String title = intent.getStringExtra("title");
            //设置完角标，将该count值存进sharedpreferences中
            SPUtils.save("badgeCount",badgeCount);
            System.out.println("拿到的title值"+title);
            mNotificationManager.cancel(notificationId);
            notificationId++;
            //new一个intent对象，用来启动应用
            Intent mainIntent = new Intent(UIUtils.getContext(), MainActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(UIUtils.getContext(), 0x1001 , mainIntent,  0);
            Notification.Builder builder;
            if("Platform".equals(type)){
                builder = new Notification.Builder(getApplicationContext())
                        .setContentTitle(title)
                        .setContentText("推送一条新通知")
                        .setContentIntent(pendingIntent)
                        .setSmallIcon(R.drawable.icon);
                Notification notification = builder.build();
                ShortcutBadger.applyNotification(getApplicationContext(), notification, badgeCount);
                mNotificationManager.notify(notificationId, notification);
            }//未读消息通知栏展示并改变桌面角标(因暂时不受重视，故先注释)
//            else{
//                builder = new Notification.Builder(getApplicationContext())
//                        .setContentTitle("轻门户")
//                        .setContentText("您收到一条新消息")
//                        .setContentIntent(pendingIntent)
//                        .setSmallIcon(R.drawable.icon);
//            Notification notification = builder.build();
//            ShortcutBadger.applyNotification(getApplicationContext(), notification, badgeCount);
//            mNotificationManager.notify(notificationId, notification);
//            }

        }
    }
}
