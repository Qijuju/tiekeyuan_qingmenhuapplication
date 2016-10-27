package com.tky.mqtt.paho.receiver;

import com.example.test2.MainActivity;
import com.example.test2.WakeLockService;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.os.PowerManager;
import android.os.Vibrator;
import android.util.Log;

public class AlarmRecevier extends BroadcastReceiver{
      private static String TAG="AlarmRecevier";
      private PowerManager pm;
      private PowerManager.WakeLock wakelock;
      private WifiManager  wifiManager;
      private WifiManager.WifiLock wifiLock;
     private Vibrator mVibrator01;  //����һ����������
	@Override
	public void onReceive(Context context, Intent intent) {
		// TODO Auto-generated method stub
		//����ѭ���㲥����������		
			//��������
		   if(intent.getAction().equals("sendbroadcast.action")){		   
			   if(wakelock==null){
				 //��ȡ��Դ����
			    pm=(PowerManager)context.getSystemService(Context.POWER_SERVICE);
				wakelock=pm.newWakeLock(PowerManager.ACQUIRE_CAUSES_WAKEUP|PowerManager.SCREEN_DIM_WAKE_LOCK, "Me tag");
				wakelock.acquire(10*1000);
				Intent i=new Intent();
				i.setClass(context, MainActivity.class);
				i.setFlags(intent.FLAG_ACTIVITY_NEW_TASK);
				context.startActivity(i);
				Log.i(TAG, "��Ļ�����ˣ�!");
				wifiManager=(WifiManager)context.getSystemService(context.WIFI_SERVICE);
				wifiLock = wifiManager.createWifiLock(1,"mywifilock");  
				wifiLock.acquire();
				Log.i(TAG, "wifi�Ѿ�����");
				mVibrator01 = ( Vibrator )context.getSystemService(Service.VIBRATOR_SERVICE);  
				mVibrator01.vibrate( new long[]{100,10,100,1000},-1);  
				Log.i(TAG, "�ֻ����ˣ�!");
				   //��ʼ��������
//	    		  kl=km.newKeyguardLock("My KEYLOCK.");
				   //��ֹ��ʾ������
				   //kl.disableKeyguard();
//				  WIFI_MODE_FULL == 1 <br/> 
//				     *            ɨ�裬�Զ��ĳ���ȥ����һ�������ù�ĵ�<br /> 
//				       *            WIFI_MODE_SCAN_ONLY == 2 <br/> 
//				     *            ֻʣ��ɨ��<br /> 
//				       *            WIFI_MODE_FULL_HIGH_PERF = 3 <br/> 
//				     *            �ڵ�һ��ģʽ�Ļ��ϣ������������<br /> 

			   }
//			   if(wakelock!=null){
//				   wakelock.acquire(10*1000);
//				   Log.v(TAG, "��Ļ�����ˣ�!");
//			   }
		   }
		}
}
