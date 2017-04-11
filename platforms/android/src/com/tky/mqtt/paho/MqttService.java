package com.tky.mqtt.paho;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.IBinder;
import android.os.SystemClock;
import android.support.v4.app.NotificationCompat;

import com.ionicframework.im366077.R;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.receiver.AlarmRecevier;

import org.eclipse.paho.client.mqttv3.MqttException;

public class MqttService extends Service {

    protected MqttConnection mqttConnection;
    private AlarmManager am;
    private static int count = 0;
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        new Thread(new Runnable() {
            @Override
            public void run() {
                //如果当前已经登录了，才会启动MQTT，否则不启动
                if (MqttRobot.isStarted()) {
                    mqttConnection = new MqttConnection();
                    try {
                        mqttConnection.connect(getBaseContext(), MqttService.this);
                    } catch (MqttException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();

        /*mqttConnection = new MqttConnection();
		try {
			mqttConnection.connect(getBaseContext());
		} catch (MqttException e) {
			e.printStackTrace();
		}*/

		/*MqttReceiver receiver = new MqttReceiver();
		IntentFilter filter = new IntentFilter();
		filter.addAction(ReceiverParams.MESSAGEARRIVED);
		registerReceiver(receiver, filter);
		receiver.setOnMessageArrivedListener(new OnMessageArrivedListener() {
			@Override
			public void messageArrived(String topic, String content, int qos) {
				Toast.makeText(getApplicationContext(), content, Toast.LENGTH_SHORT).show();
			}
		});*/
    }

    /**
     * Service的自我销毁
     */
    public void destorySelfByHand() {
        stopSelf();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        //使用兼容版本
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this);
        //设置状态栏的通知图标
        builder.setSmallIcon(R.drawable.icon_friends);
        //设置通知栏横条的图标
        builder.setLargeIcon(BitmapFactory.decodeResource(getResources(), R.drawable.icon));
        //禁止用户点击删除按钮删除
        builder.setAutoCancel(false);
        //禁止滑动删除
        builder.setOngoing(true);
        //右上角的时间显示
        builder.setShowWhen(true);
        //设置通知栏的标题内容
        builder.setContentTitle("即时通正在运行");
        //创建通知
        Notification notification = builder.build();
        //设置为前台服务
        startForeground(0x0010, notification);

        //************** 启动AlarmReceiver，定时启动当前服务 **************
        Intent alarmIntent=new Intent(this,AlarmRecevier.class);
        alarmIntent.setAction("sendbroadcast.action");
        sendBroadcast(alarmIntent);
        PendingIntent sender= PendingIntent.getBroadcast(this, 0, alarmIntent, 0);
        //从开机完成时开始计时
        long fristtume= SystemClock.elapsedRealtime();
        //得到全局定时器
        if (am == null) {
            am = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                am.setExact(AlarmManager.RTC_WAKEUP, 5 * 1000, sender);//ELAPSED_REALTIME_WAKEUP
            } else {
            }
            //毎30秒发个广播
            am.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, fristtume, 5000, sender);
        }
//        am.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, fristtume, 20*60*1000, sender);
        return super.onStartCommand(intent, Service.START_FLAG_REDELIVERY, startId);

    }

    @Override
    public void onDestroy() {
//      ToastUtil.showSafeToast("destroyService");
        //释放CPU锁
        Intent alarmReleaseLockIntent = new Intent();
        alarmReleaseLockIntent.setAction("release_alarm_lock.action");
        sendBroadcast(alarmReleaseLockIntent);

        //设置当前MQTT的状态
        MqttRobot.setMqttStatus(MqttStatus.CLOSE);
        //停止前台Service
        stopForeground(true);
        //要死时把自己救回来
        if (mqttConnection != null && MqttRobot.getConnectionType() != ConnectionType.MODE_CONNECTION_DOWN_MANUAL) {
//          ToastUtil.showSafeToast("destroyService");
//            startService(new Intent(getBaseContext(), MqttService.class));
        } else {
            //MqttOper.freeMqtt();
        }
        //要死时把保护该Service的服务起来
        startService(new Intent(getBaseContext(), ProtectService.class));
//        am.cancel();
        super.onDestroy();
    }
}
