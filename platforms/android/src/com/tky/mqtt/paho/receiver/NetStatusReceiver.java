package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;

import com.tky.mqtt.paho.ReceiverParams;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.receiver
 * 日期：2016/7/1 16:40
 * 描述：
 */
public class NetStatusReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (ConnectivityManager.CONNECTIVITY_ACTION.equals(intent.getAction())) {
            NetworkInfo info = intent.getParcelableExtra(WifiManager.EXTRA_NETWORK_INFO);
            if (info.getState().equals(NetworkInfo.State.CONNECTED)) {
                Intent netIntent = new Intent();
                netIntent.setAction(ReceiverParams.RECONNECT_MQTT);
                context.sendBroadcast(netIntent);
            }
        }
        /*if (WifiManager.WIFI_STATE_CHANGED_ACTION.equals(intent.getAction())) {

        } else if (WifiManager.NETWORK_STATE_CHANGED_ACTION.equals(intent.getAction())) {
            NetworkInfo info = intent.getParcelableExtra(WifiManager.EXTRA_NETWORK_INFO);
            if (info.getState().equals(NetworkInfo.State.CONNECTED)) {

            }
        }*/
    }
}
