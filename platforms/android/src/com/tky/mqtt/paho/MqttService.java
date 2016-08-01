package com.tky.mqtt.paho;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

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
				mqttConnection = new MqttConnection();
				try {
					mqttConnection.connect(getBaseContext());
				} catch (MqttException e) {
					e.printStackTrace();
				}				
			}
		}).start();
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
		return super.onStartCommand(intent, flags, startId);
	}
	
	@Override
	public void onDestroy() {
		startService(new Intent(getBaseContext(), MqttService.class));
		super.onDestroy();
	}
}
