package com.ionicframework.im366077;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.SystemClock;

import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;

/**
 * 作者：
 * 包名：com.ionicframework.im366077
 * 日期：2016/10/28 17:53
 * 描述：
 */
public class OnePxActivity extends Activity {

    private CloseOnePxReceiver receiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_one_px);
        if (getIntent().getBooleanExtra("backgroud", false)) {
            //让应用进入后台运行
            Intent i= new Intent(Intent.ACTION_MAIN);
            i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            i.addCategory(Intent.CATEGORY_HOME);
            startActivity(i);
        }
        receiver = new CloseOnePxReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction("com.tky.close_one_px_activity");
        registerReceiver(receiver, filter);
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    private class CloseOnePxReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            if ("com.tky.close_one_px_activity".equals(intent.getAction())) {
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        SystemClock.sleep(1000);
                        UIUtils.runInMainThread(new Runnable() {
                            @Override
                            public void run() {
                                ToastUtil.showSafeToast("cccc");
                                /*Intent i= new Intent(Intent.ACTION_MAIN);

                                i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); //android123提示如果是服务里调用，必须加入new task标识

                                i.addCategory(Intent.CATEGORY_HOME);

                                startActivity(i);*/
                                OnePxActivity.this.finish();
                            }
                        });
                    }
                }).start();
            }
        }
    }

    @Override
    protected void onDestroy() {
        if (receiver != null) {
            unregisterReceiver(receiver);
            receiver = null;
        }
        super.onDestroy();
    }
}
