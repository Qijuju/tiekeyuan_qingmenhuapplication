/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.ionicframework.im366077;

import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.text.format.Formatter;

import com.tky.mqtt.paho.ProtectService;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.receiver.ProxySensorReceiver;
import com.tky.mqtt.paho.receiver.UserPresentReceiver;
import com.tky.mqtt.paho.utils.FileUtils;
import com.tky.mqtt.paho.utils.ImageTools;
import com.tky.mqtt.paho.utils.PhotoUtils;
import com.tky.mqtt.paho.utils.RecorderManager;

import org.apache.cordova.CordovaActivity;

import java.io.File;

public class MainActivity extends CordovaActivity implements SensorEventListener
{
    /**
     * 打开文件管理器请求码
     */
    private int FILE_SELECT_CODE = 0x0111;
    private int TAKE_PHOTO_CODE = 0x0104;
    private UserPresentReceiver receiver;
    private SensorManager mSensorManager;
    private Sensor mSensor;
//    private VolumeChangeReceiver volumeChangeReceiver;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        startService(new Intent(this, ProtectService.class));
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
        //初始化录音机
        RecorderManager.getInstance(MainActivity.this).init();

        //传感器
        mSensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        //拿到距离感应器
        mSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY);
        //注册距离感应器
        mSensorManager.registerListener(this, mSensor, SensorManager.SENSOR_DELAY_NORMAL);

        MqttRobot.setIsStarted(false);

        //注册屏幕开关广播
        receiver = new UserPresentReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_SCREEN_ON);
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        registerReceiver(receiver, filter);

        //声音大小监听
        /*volumeChangeReceiver = VolumeChangeReceiver.getInstance();
        volumeChangeReceiver.setOnVolumeChangeListener(new VolumeChangeReceiver.OnVolumeChangeListener() {
            @Override
            public void onVolumeChange(int mode, int volume) {
                RecorderManager.getInstance(MainActivity.this).setVolume(volume);
            }
        });*/
//        ToastUtil.showSafeToast(SPUtils.getString("connectionLost", "m") + "===" + SPUtils.getString("count", "m"));
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        if (resultCode == -1 && requestCode == FILE_SELECT_CODE && intent != null) {
            /*String filePath = intent.getStringExtra("filePath");
            Intent receiverIntent = new Intent();
            receiverIntent.setAction(ReceiverParams.DOC_FILE_GET);
            receiverIntent.putExtra("filePath", filePath);
            sendBroadcast(receiverIntent);*/
            Uri uri = intent.getData();
            String path = FileUtils.getPathByUri4kitkat(UIUtils.getContext(), uri);
            File file = new File(path);
            long length = file.length();
            String formatSize = Formatter.formatFileSize(MainActivity.this, length);
            Intent receiverIntent = new Intent();
            receiverIntent.setAction(ReceiverParams.DOC_FILE_GET);
            receiverIntent.putExtra("filePath", path);
            receiverIntent.putExtra("length", String.valueOf(length));
            receiverIntent.putExtra("formatSize", formatSize);
            receiverIntent.putExtra("fileName", (path != null && !"".equals(path.trim()) ? path.substring(path.lastIndexOf("/") + 1) : "noname"));
            sendBroadcast(receiverIntent);
        }else if (resultCode == -1 && requestCode == TAKE_PHOTO_CODE) {
//            photo.jpg
            final Bitmap smallBitmap = PhotoUtils.getSmallBitmap(Environment.getExternalStorageDirectory() + "/photo.jpg");
            new Thread(new Runnable() {
                @Override
                public void run() {
                    String filePath = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "tkyjst" + File.separator + "cache";
                    String fileName = String.valueOf(System.currentTimeMillis());
                    ImageTools.savePhotoToSDCard(smallBitmap, filePath, fileName);
                    final String path = filePath + File.separator + fileName + ".jpg";
                    File file = new File(filePath, fileName + ".jpg");
                    final long length = file.length();
                    final String formatSize = Formatter.formatFileSize(MainActivity.this, length);
                    UIUtils.runInMainThread(new Runnable() {
                        @Override
                        public void run() {
                            Intent receiverIntent = new Intent();
                            receiverIntent.setAction(ReceiverParams.PHOTO_FILE_GET);
                            receiverIntent.putExtra("filePath", path);
                            receiverIntent.putExtra("length", String.valueOf(length));
                            receiverIntent.putExtra("formatSize", formatSize);
                            receiverIntent.putExtra("fileName", (path != null && !"".equals(path.trim()) ? path.substring(path.lastIndexOf("/") + 1) : "noname"));
                            sendBroadcast(receiverIntent);
                        }
                    });
                }
            }).start();
        }

    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        float range = event.values[0];
        //进入正常模式
        if (range == mSensor.getMaximumRange()) {
            ProxySensorReceiver.sendProxyMode(true);
        } else {//进入听筒模式
            ProxySensorReceiver.sendProxyMode(false);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    @Override
    protected void onStop() {
        //如果正在播放，告诉播放器停止播放
        Intent intent = new Intent();
        intent.setAction(ReceiverParams.RECEIVER_PLAY_STOP);
        sendBroadcast(intent);
        //初始化录音机
        RecorderManager.getInstance(MainActivity.this).init();
        super.onStop();
    }

    @Override
    public void onDestroy() {
        try {
            if (receiver != null) {
                unregisterReceiver(receiver);
                receiver = null;
            }
            /*if (volumeChangeReceiver != null) {
                UIUtils.getContext().unregisterReceiver(volumeChangeReceiver);
            }*/
            //注销距离感应器
            if (mSensorManager != null) {
                mSensorManager.unregisterListener(this);
            }
        } catch (Exception e) {
        }
        super.onDestroy();
    }

}
