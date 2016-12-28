package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;

public class ProxySensorReceiver extends BroadcastReceiver {

    private static boolean isNormalMode;
    private OnProxyChangeListener onProxyChangeListener;
    private ProxySensorReceiver() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(ReceiverParams.RECEIVER_PROXY);
        UIUtils.getContext().registerReceiver(this, filter);
    }

    /**
     * 通过该方法获取实例
     * @return
     */
    public static synchronized ProxySensorReceiver getInstance() {
        return new ProxySensorReceiver();
    }

    /**
     * 发送距离感应器信息
     * @param isNormalMode 是否是正常模式（true：正常模式；false：听筒模式）
     */
    public static void sendProxyMode(boolean isNormalMode) {
        if (ProxySensorReceiver.isNormalMode != isNormalMode) {
            ProxySensorReceiver.isNormalMode = isNormalMode;
            Log.d("firing the send", "sendProxyMode");
            Intent intent = new Intent();
            intent.putExtra("proxy_mode", isNormalMode);
            intent.setAction(ReceiverParams.RECEIVER_PROXY);
            UIUtils.getContext().sendBroadcast(intent);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        //距离感应器模式（true：正常模式；false：听筒模式）
        boolean proxy_mode = intent.getBooleanExtra("proxy_mode", true);
        if (ReceiverParams.RECEIVER_PROXY.equals(intent.getAction())) {
            if (onProxyChangeListener == null) {
                return;
            }
            if (proxy_mode) {//切换为正常模式
                onProxyChangeListener.onNormalMode();
            } else {//切换为听筒模式
                onProxyChangeListener.onEarphoneMode();
            }
        }
    }

    public interface OnProxyChangeListener {
        /**
         * 切换为听筒模式时
         */
        public void onEarphoneMode();

        /**
         * 当切换为正常模式时
         */
        public void onNormalMode();
    }

    public void setOnProxyChangeListener(OnProxyChangeListener onProxyChangeListener) {
        this.onProxyChangeListener = onProxyChangeListener;
    }
}
