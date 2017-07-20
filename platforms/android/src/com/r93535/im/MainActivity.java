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

package com.r93535.im;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.support.v4.app.NotificationCompat;
import android.text.TextUtils;
import android.text.format.Formatter;
import android.util.Log;

import com.google.android.gms.appindexing.Action;
import com.google.android.gms.appindexing.AppIndex;
import com.google.android.gms.appindexing.Thing;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.maiml.wechatrecodervideolibrary.recoder.WechatRecoderActivity;
import com.tencent.tinker.lib.tinker.Tinker;
import com.tencent.tinker.lib.tinker.TinkerInstaller;
import com.tky.im.enums.IMEnums;
import com.tky.im.params.ConstantsParams;
import com.tky.im.utils.IMBroadOper;
import com.tky.im.utils.IMStatusManager;
import com.tky.im.utils.IMSwitchLocal;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.bean.PatchBean;
import com.tky.mqtt.paho.constant.ResumeParams;
import com.tky.mqtt.paho.receiver.ProxySensorReceiver;
import com.tky.mqtt.paho.receiver.UserPresentReceiver;
import com.tky.mqtt.paho.utils.AnimationUtils;
import com.tky.mqtt.paho.utils.BadgeUtil;
import com.tky.mqtt.paho.utils.FileUtils;
import com.tky.mqtt.paho.utils.MediaFile;
import com.tky.mqtt.paho.utils.RecorderManager;
import com.tky.mqtt.paho.utils.luban.Luban;
import com.tky.mqtt.paho.utils.luban.OnCompressListener;
import com.tky.mqtt.plugin.thrift.api.SystemApi;
import com.tky.mytinker.util.Utils;
import com.zhy.http.okhttp.OkHttpUtils;
import com.zhy.http.okhttp.callback.FileCallBack;
import com.zhy.http.okhttp.callback.StringCallback;

import org.apache.cordova.CordovaActivity;
import org.json.JSONException;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;

import cn.jpush.android.api.JPushInterface;
import okhttp3.Call;

public class MainActivity extends CordovaActivity implements SensorEventListener {
  /**
   * 打开文件管理器请求码
   */
  private int FILE_SELECT_CODE = 0x0111;
  private int TAKE_PHOTO_CODE = 0x0104;
  private UserPresentReceiver receiver;
  private SensorManager mSensorManager;
  private Sensor mSensor;
  /**
   * ATTENTION: This was auto-generated to implement the App Indexing API.
   * See https://g.co/AppIndexing/AndroidStudio for more information.
   */
  private GoogleApiClient client;
//    private VolumeChangeReceiver volumeChangeReceiver;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
/*    try {
      stopService(new Intent(MainActivity.this, MqttService.class));
    } catch (Exception e) {
    } finally {
      startService(new Intent(MainActivity.this, MqttService.class));
    }*/
//    startService(new Intent(this, ProtectService.class));
    // Set by <content src="index.html" /> in config.xml
    inithotfix();
    loadUrl(launchUrl);
    //自动登录测试（测完注释掉
    //SPUtils.save("login_info", "{\"__isset_bitfield\":7,\"deptID\":\"37253\",\"isActive\":false,\"result\":true,\"resultCode\":\"100\",\"sDatetime\":1487237555948,\"userID\":\"232099\",\"userName\":\"程丽丽\"}");

    //Toast.makeText(getApplicationContext(),"热修复成功第二次验证",Toast.LENGTH_LONG).show();
    //初始化录音机
    RecorderManager.getInstance(MainActivity.this).init();

    //传感器
    mSensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
    //拿到距离感应器
    mSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY);
    //注册距离感应器
    mSensorManager.registerListener(this, mSensor, SensorManager.SENSOR_DELAY_NORMAL);

    String id=JPushInterface.getRegistrationID(getApplicationContext());

//    MqttRobot.setIsStarted(false);
    //注册屏幕开关广播
//    receiver = new UserPresentReceiver();
//    IntentFilter filter = new IntentFilter();
//    filter.addAction(Intent.ACTION_SCREEN_ON);
//    filter.addAction(Intent.ACTION_SCREEN_OFF);
//    registerReceiver(receiver, filter);

    //声音大小监听
        /*volumeChangeReceiver = VolumeChangeReceiver.getInstance();
        volumeChangeReceiver.setOnVolumeChangeListener(new VolumeChangeReceiver.OnVolumeChangeListener() {
            @Override
            public void onVolumeChange(int mode, int volume) {
                RecorderManager.getInstance(MainActivity.this).setVolume(volume);
            }
        });*/
//        ToastUtil.showSafeToast(SPUtils.getString("connectionLost", "m") + "===" + SPUtils.getString("count", "m"));
    // ATTENTION: This was auto-generated to implement the App Indexing API.
    // See https://g.co/AppIndexing/AndroidStudio for more information.
    client = new GoogleApiClient.Builder(this).addApi(AppIndex.API).build();
    NotificationCompat.Builder notificationCompat = new NotificationCompat.Builder(UIUtils.getContext());
    //设置点击一次后消失（如果没有点击事件，则该方法无效。）
    Notification notification = notificationCompat.build();
    BadgeUtil.setBadgeCount(notification, UIUtils.getContext(), 100);
  }

  /**
   * 热修复初始化
   */
  private void inithotfix() {
    //生产
    //String patchUrl ="http://imtest.crbim.win:1666/GetPatchInfo";
    String patchUrl =Constants.commonfileurl+"/GetPatchInfo";
    final String downurl =Constants.commonfileurl+"/DownloadFile";





    Tinker tinker = Tinker.with(getApplicationContext());

    final boolean tinkerload = tinker.isTinkerLoaded();
     String loaclPatchVersion = "";

    if (tinkerload) {
      loaclPatchVersion = tinker.getTinkerLoadResultIfPresent().getPackageConfigByName("patchVersion");

    }
    final String finalPathchVersion=loaclPatchVersion;

    //当前版本的版本号
    final String localversion = UIUtils.getVersion();

    //通过http请求把需要的参数请求下来
    try {
      final String loginid=IMSwitchLocal.getUserID();
      final String imcode=UIUtils.getDeviceId();

        OkHttpUtils
        .post()
        .url(patchUrl)
        .addParams("platform","A")
        .addParams("id", loginid)
        .addParams("mepId",imcode)
        .build()
        .execute(new StringCallback() {
        @Override
        public void onError(Call call, Exception e, int id) {
          //Toast.makeText(getApplicationContext(), "获取热修复信息失败", Toast.LENGTH_LONG).show();
        }

        @Override
        public void onResponse(String response, int id) {


          try {
            Log.d("tinkerTag", "成功" + response);

            Type type = new TypeToken<PatchBean>() {
            }.getType();

            Gson gson = new Gson();

            PatchBean patchBean = gson.fromJson(response, type);

            //服务器的app的版本号
            String webVersion = patchBean.getVersionName();
            String webPatchVersionName = patchBean.getPatchVersionName();


            //热修复信息获取成功

            /**
             * 1 下载文件地址不为空
             * 2 服务器的版本号和本地的版本号一致
             * 3 服务器的补丁版本号和本地的补丁版本号不一致  方可进行热修复
             */
            if (!TextUtils.isEmpty(downurl) && webVersion.equals(localversion) && !finalPathchVersion.equals(webPatchVersionName)){


              //开始下载文件

              OkHttpUtils
                .get()
                .addParams("id",loginid)
                .addParams("mepId",imcode)
                .addParams("fileId",localversion)
                .addParams("type","Patch")
                .addParams("offset","0")
                .addParams("platform","A")
                .url(downurl)
                .build()
                .execute(new FileCallBack(Environment.getExternalStorageDirectory().getAbsolutePath(), "im.patch") {
                           @Override
                           public void onError(Call call, Exception e, int id) {
                             Log.d("tinkerTag", "下载失败");
                           }

                           @Override
                           public void onResponse(File response, int id) {
                             Log.d("tinkerTag", response.getAbsolutePath() + "文件下载成功");
                             //开启热修复
                             TinkerInstaller.onReceiveUpgradePatch(getApplicationContext(), response.getAbsolutePath());

                           }
                         }
                );
            }
          } catch (Exception e) {
          }
        }
      });
    } catch (JSONException e) {
      e.printStackTrace();
    }


  }

  /**
   * 把默认的图片拷贝到相关目录下
   */
  private void copyDefaultPng() {
    InputStream open = null;
    FileOutputStream fos = null;
    try {
      open = getAssets().open("default.png");
      File dir = new File(FileUtils.getIconDir() + File.separator + "default");
      if (!dir.exists()) {
        dir.mkdirs();
      }
      File file = new File(dir, "default.png");
      if (!file.exists()) {
        file.createNewFile();
      }
      fos = new FileOutputStream(file);
      byte[] bys = new byte[1024];
      int len = 0;
      while ((len = open.read(bys)) != -1) {
        fos.write(bys, 0, len);
        fos.flush();
      }
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (open != null) {
        try {
          open.close();
          open = null;
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
      if (fos != null) {
        try {
          fos.close();
          fos = null;
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }

  @Override
  protected void onResume() {
    super.onResume();
    if (ResumeParams.IMG_RESUME) {
      AnimationUtils.execShrinkAnim(this);
      ResumeParams.IMG_RESUME = false;
    }
    Utils.setBackground(false);
    if (IMStatusManager.getImStatus() != IMEnums.CONNECT_DOWN_BY_HAND) {
      IMBroadOper.broad(ConstantsParams.PARAM_RE_CONNECT);
    }
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
      final String path = FileUtils.getPathByUri4kitkat(UIUtils.getContext(), uri);
      final File file = new File(path);


      if (MediaFile.isImageFileType(file.getAbsolutePath())) {
        long length = file.length();
        if (length <= 0) {
          ToastUtil.showSafeToast("0B文件无法发送！");
          return;
        }
        new Thread(new Runnable() {
          @Override
          public void run() {
            Luban.get(MainActivity.this)
              .load(file)
              .putGear(Luban.THIRD_GEAR)
              .setFilename(file.getName().substring(0, file.getName().lastIndexOf(".")))
              .setCompressListener(new OnCompressListener() {
                @Override
                public void onStart() {
                }

                @Override
                public void onSuccess(final File file) {
                  long length = file.length();
                  String formatSize = Formatter.formatFileSize(MainActivity.this, length);
                  Intent receiverIntent = new Intent();
                  receiverIntent.setAction(ReceiverParams.DOC_FILE_GET);
                  receiverIntent.putExtra("filePath", file.getAbsolutePath());
                  receiverIntent.putExtra("length", String.valueOf(length));
                  receiverIntent.putExtra("formatSize", formatSize);
                  receiverIntent.putExtra("fileName", (file.getAbsolutePath() != null && !"".equals(file.getAbsolutePath().trim()) ? file.getAbsolutePath().substring(file.getAbsolutePath().lastIndexOf("/") + 1) : "noname"));
                  sendBroadcast(receiverIntent);
                }

                @Override
                public void onError(Throwable e) {
                }
              }).launch();
          }
        }).start();
      } else {
        long length = file.length();
        if (length <= 0) {
          ToastUtil.showSafeToast("0B文件无法发送！");
          return;
        }
        String formatSize = Formatter.formatFileSize(MainActivity.this, length);
        Intent receiverIntent = new Intent();
        receiverIntent.setAction(ReceiverParams.DOC_FILE_GET);
        receiverIntent.putExtra("filePath", path);
        receiverIntent.putExtra("length", String.valueOf(length));
        receiverIntent.putExtra("formatSize", formatSize);
        receiverIntent.putExtra("fileName", (path != null && !"".equals(path.trim()) ? path.substring(path.lastIndexOf("/") + 1) : "noname"));
        sendBroadcast(receiverIntent);
      }
    } else if (resultCode == -1 && requestCode == TAKE_PHOTO_CODE) {
//            photo.jpg
      //final Bitmap smallBitmap = PhotoUtils.getSmallBitmap(Environment.getExternalStorageDirectory() + "/photo.jpg");
      new Thread(new Runnable() {
        @Override
        public void run() {
                    /*String filePath = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "tkyjst" + File.separator + "cache";
                    String fileName = String.valueOf(System.currentTimeMillis());
                    ImageTools.savePhotoToSDCard(smallBitmap, filePath, fileName);
                    final String path = filePath + File.separator + fileName + ".jpg";
                    File file = new File(filePath, fileName + ".jpg");*/
          File file = new File(Environment.getExternalStorageDirectory() + "/photo.jpg");
          Luban.get(MainActivity.this)
            .load(file)
            .putGear(Luban.THIRD_GEAR)
            .setFilename(System.currentTimeMillis() + "")
            .setCompressListener(new OnCompressListener() {
              @Override
              public void onStart() {
              }

              @Override
              public void onSuccess(final File file) {
//                                    ToastUtil.showSafeToast("luban onSuccess");
                final long length = file.length();
                if (length <= 0) {
                  ToastUtil.showSafeToast("0B文件无法发送！");
                  return;
                }
                final String formatSize = Formatter.formatFileSize(MainActivity.this, length);
                UIUtils.runInMainThread(new Runnable() {
                  @Override
                  public void run() {
                    Intent receiverIntent = new Intent();
                    receiverIntent.setAction(ReceiverParams.PHOTO_FILE_GET);
                    receiverIntent.putExtra("filePath", file.getAbsolutePath());
                    receiverIntent.putExtra("length", String.valueOf(length));
                    receiverIntent.putExtra("formatSize", formatSize);
                    receiverIntent.putExtra("fileName", (file.getAbsolutePath() != null && !"".equals(file.getAbsolutePath().trim()) ? file.getAbsolutePath().substring(file.getAbsolutePath().lastIndexOf("/") + 1) : "noname"));
                    sendBroadcast(receiverIntent);
                  }
                });
              }

              @Override
              public void onError(Throwable e) {
              }
            }).launch();
        }
      }).start();
    } else if (intent != null && requestCode == 0x02001) {
      String videoPath = intent.getStringExtra(WechatRecoderActivity.VIDEO_PATH);
      File file = new File(videoPath);
      if (file.exists()) {
        final long length = file.length();
        if (length <= 0) {
          ToastUtil.showSafeToast("0B文件无法发送！");
          return;
        }
        String formatSize = Formatter.formatFileSize(MainActivity.this, length);
        Intent receiverIntent = new Intent();
        receiverIntent.setAction(ReceiverParams.VIDEO_FILE_GET);
        receiverIntent.putExtra("filePath", file.getAbsolutePath());
        receiverIntent.putExtra("length", String.valueOf(length));
        receiverIntent.putExtra("formatSize", formatSize);
        receiverIntent.putExtra("fileName", (file.getAbsolutePath() != null && !"".equals(file.getAbsolutePath().trim()) ? file.getAbsolutePath().substring(file.getAbsolutePath().lastIndexOf("/") + 1) : "noname"));
        sendBroadcast(receiverIntent);
      } else {
        ToastUtil.showSafeToast("文件不存在！");
      }
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
    super.onStop();// ATTENTION: This was auto-generated to implement the App Indexing API.
// See https://g.co/AppIndexing/AndroidStudio for more information.
    AppIndex.AppIndexApi.end(client, getIndexApiAction());
    // ATTENTION: This was auto-generated to implement the App Indexing API.
    // See https://g.co/AppIndexing/AndroidStudio for more information.
    client.disconnect();
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


  @Override
  protected void onPause() {
    super.onPause();
    Utils.setBackground(true);
  }

  /**
   * ATTENTION: This was auto-generated to implement the App Indexing API.
   * See https://g.co/AppIndexing/AndroidStudio for more information.
   */
  public Action getIndexApiAction() {
    Thing object = new Thing.Builder()
      .setName("Main Page") // TODO: Define a title for the content shown.
      // TODO: Make sure this auto-generated URL is correct.
      .setUrl(Uri.parse("http://[ENTER-YOUR-URL-HERE]"))
      .build();
    return new Action.Builder(Action.TYPE_VIEW)
      .setObject(object)
      .setActionStatus(Action.STATUS_TYPE_COMPLETED)
      .build();
  }

  @Override
  public void onStart() {
    super.onStart();

    // ATTENTION: This was auto-generated to implement the App Indexing API.
    // See https://g.co/AppIndexing/AndroidStudio for more information.
    client.connect();
    AppIndex.AppIndexApi.start(client, getIndexApiAction());
  }
}
