package com.tky.mqtt.paho;

import android.app.Service;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.IBinder;
import android.support.annotation.Nullable;

import com.tky.mqtt.paho.receiver.UserPresentReceiver;

/**
 * Created by Administrator on 2016/10/26.
 */
public class ProtectService extends Service {

  private UserPresentReceiver userPresentReceiver;

  @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
      userPresentReceiver = new UserPresentReceiver();
      IntentFilter userPresentIntent = new IntentFilter();
      userPresentIntent.addAction(Intent.ACTION_SCREEN_ON);
      userPresentIntent.addAction(Intent.ACTION_SCREEN_OFF);
      userPresentIntent.addAction(Intent.ACTION_USER_PRESENT);
      userPresentIntent.addAction(ReceiverParams.RESTARTSERVICE);
      registerReceiver(userPresentReceiver, userPresentIntent);
    }

    @Override
    public void onDestroy() {
        //只要不是手动退出应用程序，就一直启动MqttService
//        if(MqttRobot.getConnectionType() != ConnectionType.MODE_CONNECTION_DOWN_MANUAL){
//            startService(new Intent(getBaseContext(), MqttService.class));
//        }
      if (userPresentReceiver != null) {
        try {
          unregisterReceiver(userPresentReceiver);
        } catch (Exception e) {}
      }
        super.onDestroy();
    }
}
