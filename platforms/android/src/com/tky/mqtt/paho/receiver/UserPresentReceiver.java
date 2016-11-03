package com.tky.mqtt.paho.receiver;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;

import com.tky.mqtt.paho.MqttService;
import com.tky.mqtt.paho.MqttStatus;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.utils.NetUtils;

import java.util.List;

/**
 * 作者：
 * 包名：com.sls.mynewframe.mqtt.receiver
 * 日期：2016/10/24 0:52
 * 描述：
 */
public class UserPresentReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        /*if (Intent.ACTION_SCREEN_ON.equals(intent.getAction())) {
        } else if (Intent.ACTION_SCREEN_OFF.equals(intent.getAction())) {
            isStarted = MqttRobot.isStarted();
            Intent onePxIntent = new Intent(context, OnePxActivity.class);
            onePxIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            onePxIntent.putExtra("backgroud", isApplicationBroughtToBackground(context));
            context.startActivity(onePxIntent);
        }*/
        if (Intent.ACTION_SCREEN_ON.equals(intent.getAction())) {
            if (!NetUtils.isConnect(context)) {
                return;
            }
//            MqttOper.resetMqtt();
            if (MqttRobot.isStarted()) {
//            if (MqttRobot.isStarted() && MqttRobot.getMqttStatus() == MqttStatus.CLOSE) {
                context.stopService(new Intent(context, MqttService.class));
                context.startService(new Intent(context, MqttService.class));
            }
        } else if (Intent.ACTION_SCREEN_OFF.equals(intent.getAction())) {
        }
        if (Intent.ACTION_USER_PRESENT.equals(intent.getAction())) {
            if (!NetUtils.isConnect(context)) {
                return;
            }
//            MqttOper.resetMqtt();
            /*Intent closeOnePxIntent = new Intent();
            closeOnePxIntent.setAction("com.tky.close_one_px_activity");
            context.sendBroadcast(closeOnePxIntent);*/
        }
    }


    /**
     *判断当前应用程序处于前台还是后台
     */
    public static boolean isApplicationBroughtToBackground(final Context context) {
        ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> tasks = am.getRunningTasks(1);
        if (!tasks.isEmpty()) {
            ComponentName topActivity = tasks.get(0).topActivity;
            if (!topActivity.getPackageName().equals(context.getPackageName())) {
                return true;
            }
        }
        return false;

    }

}
