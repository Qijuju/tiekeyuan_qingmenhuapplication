package com.r93535.im;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.Gravity;
import android.view.Window;
import android.view.WindowManager;

/**
 * 一个像素activity
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
//        setContentView(R.layout.activity_one_px);
        Window window = getWindow();
        window.setGravity(Gravity.LEFT | Gravity.TOP);
        WindowManager.LayoutParams params = window.getAttributes();
        params.x = 0;
        params.y = 0;
        params.width = 1;
        params.height = 1;
        window.setAttributes(params);
        /*if (getIntent().getBooleanExtra("backgroud", false)) {
            //让应用进入后台运行
            Intent i= new Intent(Intent.ACTION_MAIN);
            i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            i.addCategory(Intent.CATEGORY_HOME);
            startActivity(i);
        }*/
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
                OnePxActivity.this.finish();
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
