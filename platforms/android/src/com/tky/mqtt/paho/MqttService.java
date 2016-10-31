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
import android.util.Log;

import com.ionicframework.im366077.R;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.receiver.AlarmRecevier;
import com.tky.mqtt.paho.utils.MqttOper;

import org.eclipse.paho.client.mqttv3.MqttException;

public class MqttService extends Service {

    protected MqttConnection mqttConnection;
    private static int count = 0;
    private static int count1 = 0;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d("MqttService", "MqttService第" + (++count1) + "次启动");
        new Thread(new Runnable() {
            @Override
            public void run() {
                ToastUtil.showSafeToast("服务启动了，服务正在启动MQTT...");
                //如果当前已经登录了，才会启动MQTT，否则不启动
                if (MqttRobot.isStarted()) {
                    mqttConnection = new MqttConnection();
                    try {
                        mqttConnection.connect(getBaseContext());
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
        AlarmManager am=(AlarmManager)getSystemService(Context.ALARM_SERVICE);
        if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.KITKAT){
            am.setExact(AlarmManager.ELAPSED_REALTIME_WAKEUP, 5*1000, sender);
        }else{
            //毎30秒发个广播
            am.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, fristtume, 5*1000, sender);
        }
        return super.onStartCommand(intent, START_STICKY, startId);
    }

    @Override
    public void onDestroy() {
        Log.d("MqttService", "MqttService第" + (++count) + "次死");
        ToastUtil.showSafeToast("服务已经挂掉了...");
        //释放CPU锁
        Intent alarmReleaseLockIntent = new Intent();
        alarmReleaseLockIntent.setAction("release_alarm_lock.action");
        sendBroadcast(alarmReleaseLockIntent);

        //设置当前MQTT的状态
        MqttRobot.setMqttStatus(MqttStatus.CLOSE);
        //停止前台Service
        stopForeground(true);
        //要死时把自己救回来
        if (mqttConnection != null && mqttConnection.getConnectionType() != ConnectionType.MODE_CONNECTION_DOWN_MANUAL) {
            startService(new Intent(getBaseContext(), MqttService.class));
        } else {
            MqttOper.freeMqtt();
        }
        //要死时把保护该Service的服务起来
        startService(new Intent(getBaseContext(), ProtectService.class));
        super.onDestroy();
    }
}
