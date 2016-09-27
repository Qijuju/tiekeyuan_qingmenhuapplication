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
import android.net.Uri;
import android.os.Bundle;
import android.text.format.Formatter;

import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.utils.FileUtils;

import org.apache.cordova.CordovaActivity;

import java.io.File;

public class MainActivity extends CordovaActivity
{
    /**
     * 打开文件管理器请求码
     */
    private int FILE_SELECT_CODE = 0x0111;
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
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
        }
    }
}
