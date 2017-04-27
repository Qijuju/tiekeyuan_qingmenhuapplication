package com.tky.im.utils;

import android.os.Handler;
import android.os.Message;
import android.text.format.DateUtils;

import com.tky.im.test.LogPrint;

/**
 * IM的心跳管理
 */

public class HeartbeatUtils {

    private OnTimeoutListener onTimeoutListener;

    public HeartbeatUtils(OnTimeoutListener onTimeoutListener) {
        this.onTimeoutListener = onTimeoutListener;
    }

    /**
     * 心跳超时标识位
     */
    private static final int TIME_OUT = 0x0110;
    /**
     * 心跳时间，单位为秒（s），默认为300s一次，即5分钟
     */
    private long keepAliveTime = 300;

    public void start() {
        stopLoop();
        loop();
    }

    /**
     * 检测将要跨天时，调整心跳周期；跨天之后，调回默认值
     */
    /*private void checkDateChanging() {

    }*/

    /**
     * 停止心跳
     */
    public void stopLoop() {
        if (localHandler.get().hasMessages(TIME_OUT)) {
            localHandler.get().removeMessages(TIME_OUT);
        }
    }

    private void loop(){
        if (keepAliveTime <= 0) {
            throw new IllegalArgumentException("Wrong keepAliveTime...");
        }
        Message msg = localHandler.get().obtainMessage(TIME_OUT, this);
        localHandler.get().sendMessageDelayed(msg, keepAliveTime * DateUtils.SECOND_IN_MILLIS);
    }

    private final static ThreadLocal<Handler> localHandler = new ThreadLocal<Handler>(){
        @Override
        protected Handler initialValue() {
            return new Handler(){
                @Override
                public void handleMessage(Message msg) {
                    switch (msg.what) {
                        case TIME_OUT:
                            HeartbeatUtils beats = (HeartbeatUtils) msg.obj;
                            if (beats.onTimeoutListener != null) {
                                LogPrint.print("心跳", "心跳了一次💗");
                                beats.onTimeoutListener.onTimeout();
                            }
                            beats.loop();
                            break;
                        default:
                            break;
                    }
                }
            };
        }
    };

    public interface OnTimeoutListener {
        public void onTimeout();
    }

    public void setKeepAliveTime(long keepAliveTime) {
        this.keepAliveTime = keepAliveTime;
    }

    public OnTimeoutListener getOnTimeoutListener() {
        return onTimeoutListener;
    }
}
