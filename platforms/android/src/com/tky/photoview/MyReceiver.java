package com.tky.photoview;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Created by Administrator on 2016/9/28.
 */
public class MyReceiver extends BroadcastReceiver {

    private  UpdateListener updateListener;
    @Override
    public void onReceive(Context context, Intent intent) {
        if ("com.tky.updatefilepath".equals(intent.getAction())){
            if (updateListener != null) {
                updateListener.updatepath(intent.getStringExtra("filepath"));
            }
        }
    }


    public void setUpdateListener(UpdateListener updateListener) {
        this.updateListener = updateListener;
    }

    public interface UpdateListener{
        void updatepath(String filepath);
    }


}
