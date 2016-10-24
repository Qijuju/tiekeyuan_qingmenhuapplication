package com.tky.mqtt.paho;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.IBinder;
import android.support.v4.app.NotificationCompat;

import com.ionicframework.im366077.R;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.utils.MqttOper;

import org.eclipse.paho.client.mqttv3.MqttException;

public class MqttService extends Service {

	protected MqttConnection mqttConnection;

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
				if (MqttRobot.getMqttStatus() != MqttStatus.OPEN) {
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
		NotificationCompat.Builder builder=new NotificationCompat.Builder(this);
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
		startForeground(0x0010,notification);
		return super.onStartCommand(intent, START_STICKY, startId);
	}

	@Override
	public void onDestroy() {
		stopForeground(true);
		if (mqttConnection.getConnectionType() != ConnectionType.MODE_CONNECTION_DOWN_MANUAL) {
			startService(new Intent(getBaseContext(), MqttService.class));
		} else {
			MqttOper.freeMqtt();
		}
		super.onDestroy();
	}
}
