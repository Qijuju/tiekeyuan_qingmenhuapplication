package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;
import android.util.Log;

import com.ionicframework.im366077.MainActivity;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.utils.MqttOper;
import com.tky.mqtt.paho.utils.NetUtils;

public class AlarmRecevier extends BroadcastReceiver{
	private static String TAG="AlarmRecevier";
	private PowerManager pm;
	private PowerManager.WakeLock wakelock;
	private static int count = 0;
//	private WifiManager  wifiManager;
//	private WifiManager.WifiLock wifiLock;
//	private Vibrator mVibrator01;  //声明一个振动器对象
	@Override
	public void onReceive(Context context, Intent intent) {
		// TODO Auto-generated method stub
		//接受循环广播，启动界面
		//点亮亮屏
		if(intent.getAction().equals("sendbroadcast.action")){
			if(wakelock==null){
				//获取电源服务
				pm=(PowerManager)context.getSystemService(Context.POWER_SERVICE);
				wakelock=pm.newWakeLock(PowerManager.ACQUIRE_CAUSES_WAKEUP|PowerManager.SCREEN_DIM_WAKE_LOCK, "Me tag");
				wakelock.acquire(10 * 1000);
				Intent mainIntent=new Intent();
				mainIntent.setClass(context, MainActivity.class);
				mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				if (context.getPackageManager().resolveActivity(mainIntent, 0) == null) {
					// 说明系统中不存在这个activity
					context.startActivity(mainIntent);
				}
				//重新启动MQTT
				ToastUtil.showSafeToast("Alarm定时检查重启...");
			}
			Log.d("AlarmRecevier", "Alarm定时检查MQTT第" + (++count) + "次");
			if (NetUtils.isConnect(UIUtils.getContext()) && MqttRobot.isStarted()) {
				MqttOper.resetMqtt();
			}
		} else if(intent.getAction().equals("release_alarm_lock.action")){
			if (wakelock != null) {
				wakelock.release();
				wakelock = null;
			}
		}
	}

}
