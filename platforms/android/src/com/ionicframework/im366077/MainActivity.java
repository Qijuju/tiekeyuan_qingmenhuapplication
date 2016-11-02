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
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.text.format.Formatter;

import com.igexin.sdk.PushManager;
import com.tky.mqtt.dao.Messages;
import com.tky.mqtt.paho.ProtectService;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.receiver.UserPresentReceiver;
import com.tky.mqtt.paho.utils.FileUtils;
import com.tky.mqtt.paho.utils.ImageTools;
import com.tky.mqtt.paho.utils.PhotoUtils;
import com.tky.mqtt.services.MessagesService;

import org.apache.cordova.CordovaActivity;

import java.io.File;
import java.util.List;

public class MainActivity extends CordovaActivity
{
    /**
     * 打开文件管理器请求码
     */
    private int FILE_SELECT_CODE = 0x0111;
    private int TAKE_PHOTO_CODE = 0x0104;
    private UserPresentReceiver receiver;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        startService(new Intent(this, ProtectService.class));
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);

        MessagesService messagesService=MessagesService.getInstance(UIUtils.getContext());
        List<Messages> messagesList=messagesService.queryData("where IS_SUCCESS =?", "false");
        for(int i=0;i<messagesList.size();i++){
            Messages messages=new Messages();
            messages=messagesList.get(i);
            messages.setIsFailure("true");
            messagesService.saveObj(messages);
        }

        //个推初始化
        PushManager.getInstance().initialize(this.getApplicationContext());

        MqttRobot.setIsStarted(false);

        //注册屏幕开关广播
        receiver = new UserPresentReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_SCREEN_ON);
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        registerReceiver(receiver, filter);
//        ToastUtil.showSafeToast(SPUtils.getString("connectionLost", "m") + "===" + SPUtils.getString("count", "m"));
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        if (requestCode == FILE_SELECT_CODE && intent != null) {
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
        }else if (requestCode == TAKE_PHOTO_CODE) {
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
    public void onDestroy() {
        if (receiver != null) {
            unregisterReceiver(receiver);
            receiver = null;
        }
        super.onDestroy();
    }
}
