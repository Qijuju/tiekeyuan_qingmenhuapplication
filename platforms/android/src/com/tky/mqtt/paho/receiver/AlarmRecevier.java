package com.tky.mqtt.paho.receiver;

import android.app.ActivityManager;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.os.PowerManager;
import android.os.Vibrator;
import android.util.Log;

import com.ionicframework.im366077.MainActivity;
import com.tky.mqtt.paho.MqttService;
import com.tky.mqtt.paho.MqttStatus;
import com.tky.mqtt.paho.MqttTopicRW;
import com.tky.mqtt.paho.ProtectService;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.utils.MqttOper;

import java.util.List;

public class AlarmRecevier extends BroadcastReceiver{
	private static String TAG="AlarmRecevier";
	private PowerManager pm;
	private PowerManager.WakeLock wakelock;
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
				/*Intent i=new Intent();
				i.setClass(context, MqttService.class);
				i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				context.startService(i);
				context.startService(new Intent(context, ProtectService.class));*/


				Intent mainIntent=new Intent();
				mainIntent.setClass(context, MainActivity.class);
				mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				if (context.getPackageManager().resolveActivity(mainIntent, 0) == null) {
					// 说明系统中不存在这个activity
					context.startActivity(mainIntent);
				}

				//重新启动MQTT
				MqttOper.resetMqtt();

				Log.i(TAG, "屏幕点亮了！!");
				/*wifiManager=(WifiManager)context.getSystemService(context.WIFI_SERVICE);
				wifiLock = wifiManager.createWifiLock(1,"mywifilock");
				wifiLock.acquire();
				wifiLock.release();*/
				Log.i(TAG, "wifi已经加锁");
//				mVibrator01 = ( Vibrator )context.getSystemService(Service.VIBRATOR_SERVICE);
//				mVibrator01.vibrate( new long[]{100,10,100,1000},-1);
//				Log.i(TAG, "手机震动了！!");
				//初始化键盘锁
//	    		  kl=km.newKeyguardLock("My KEYLOCK.");
				//禁止显示键盘锁
				//kl.disableKeyguard();
//				  WIFI_MODE_FULL == 1 <br/>
//				     *            扫描，自动的尝试去连接一个曾经配置过的点<br />
//				       *            WIFI_MODE_SCAN_ONLY == 2 <br/>
//				     *            只剩下扫描<br />
//				       *            WIFI_MODE_FULL_HIGH_PERF = 3 <br/>
//				     *            在第一种模式的基础上，保持最佳性能<br />

			}
//			   if(wakelock!=null){
//				   wakelock.acquire(10*1000);
//				   Log.v(TAG, "屏幕点亮了！!");
//			   }
		} else if(intent.getAction().equals("release_alarm_lock.action")){
			if (wakelock != null) {
				wakelock.release();
				wakelock = null;
			}
		}
	}

}
