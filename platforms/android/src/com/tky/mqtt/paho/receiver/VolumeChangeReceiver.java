package com.tky.mqtt.paho.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;

import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;

/**
 * 作者：SLS
 * 包名：com.tky.mqtt.paho.receiver
 * 日期：2016/12/9 16:57
 * 描述：系统声音大小改变时获取当前音量
 */
public class VolumeChangeReceiver extends BroadcastReceiver {

    private OnVolumeChangeListener onVolumeChangeListener;

    private VolumeChangeReceiver() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(ReceiverParams.VOLUME_CHANGED_ACTION);
        UIUtils.getContext().registerReceiver(this, filter);
    }

    /**
     * 通过该方法获取实例
     * @return
     */
    public static synchronized VolumeChangeReceiver getInstance() {
        return new VolumeChangeReceiver();
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (ReceiverParams.VOLUME_CHANGED_ACTION.equals(intent.getAction())) {
            AudioManager audioManager = (AudioManager) UIUtils.getContext().getSystemService(Context.AUDIO_SERVICE);
            boolean proxyMode = SPUtils.getBoolean("set_proxy_mode", false);
            int currVolume = audioManager.getStreamVolume(proxyMode ? AudioManager.STREAM_MUSIC : AudioManager.STREAM_VOICE_CALL) ;// 当前的媒体音量
            if (onVolumeChangeListener != null) {
                onVolumeChangeListener.onVolumeChange((proxyMode ? AudioManager.STREAM_MUSIC : AudioManager.STREAM_VOICE_CALL), currVolume);
            }
        }
    }

    public void setOnVolumeChangeListener(OnVolumeChangeListener onVolumeChangeListener) {
        this.onVolumeChangeListener = onVolumeChangeListener;
    }

    public interface OnVolumeChangeListener {
        public void onVolumeChange(int mode, int volume);
    }
}
