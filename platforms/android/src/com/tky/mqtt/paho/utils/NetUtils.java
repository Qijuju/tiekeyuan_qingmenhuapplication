package com.tky.mqtt.paho.utils;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;

/**
 * 作者：SLS
 * 包名：com.tky.mqtt.paho.utils
 * 日期：2016/7/1 15:23
 * 描述：联网工具类
 */
public class NetUtils {

    /**
     * 是否已经联网
     *
     * @param context
     * @return
     */
    public static boolean isConnect(Context context) {
        // 获取手机所有连接管理对象（包括对wi-fi,net等连接的管理）
        try {
            ConnectivityManager connectivity = (ConnectivityManager) context
                    .getSystemService(Context.CONNECTIVITY_SERVICE);
            if (connectivity != null) {
                // 获取网络连接管理的对象
                NetworkInfo info = connectivity.getActiveNetworkInfo();
                if (info != null && info.isConnected()) {
                    // 判断当前网络是否已经连接
                    if (info.getState() == NetworkInfo.State.CONNECTED) {
                        return info.isAvailable() && info.isConnected();
                    }
                }
            }
        } catch (Exception e) {
            // TODO: handle exception
            Log.v("error", e.toString());
        }
        return false;
    }
}
