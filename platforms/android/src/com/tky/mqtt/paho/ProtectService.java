package com.tky.mqtt.paho;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.support.annotation.Nullable;

import com.tky.mqtt.paho.main.MqttRobot;

/**
 * Created by Administrator on 2016/10/26.
 */
public class ProtectService extends Service {
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public void onDestroy() {
        //只要不是手动退出应用程序，就一直启动MqttService
        if(MqttRobot.getConnectionType() != ConnectionType.MODE_CONNECTION_DOWN_MANUAL){
            startService(new Intent(getBaseContext(), MqttService.class));
        }
        startService(new Intent(getBaseContext(), ProtectService.class));
        super.onDestroy();
    }
}
