package com.tky.im.service;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.support.v4.app.NotificationCompat;

import com.ionicframework.im366077.MainActivity;
import com.ionicframework.im366077.R;
import com.tky.im.callback.IMConnectCallback;
import com.tky.im.callback.IMMessageCallback;
import com.tky.im.connection.IMConnection;
import com.tky.im.enums.IMEnums;
import com.tky.im.params.ConstantsParams;
import com.tky.im.receiver.IMReceiver;
import com.tky.im.receiver.IMScreenReceiver;
import com.tky.im.utils.HeartbeatUtils;
import com.tky.im.utils.IMBroadOper;
import com.tky.im.utils.IMStatusManager;
import com.tky.im.utils.IMSwitchLocal;
import com.tky.im.utils.IMUtils;
import com.tky.mqtt.dao.Messages;
import com.tky.mqtt.paho.MessageOper;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.paho.utils.MqttOper;
import com.tky.mqtt.paho.utils.NetUtils;

import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

/**
 * Created by tkysls on 2017/4/11.
 */

public class IMService extends Service {

  private IMConnection imConnection;
  private IMConnectCallback imConnectCallback;
  private IMMessageCallback imMessageCallback;
  private IMReceiver receiver;
  private IMScreenReceiver screenReceiver;
  private HeartbeatUtils beats;
  private final Handler handler = new Handler();
  private static int requestCode = 0x1001;
  /**
   * 对启动时间进行限制，保持前5次每1s启动一次，然后是隔5s，10s，20s，20s内如果持续连接异常，则退出登录
   */
  private long posStart = 0;
  /**
   * 对启动次数进行限制
   */
  public static int posStartCount = 0;

  @Nullable
  @Override
  public IBinder onBind(Intent intent) {
    return null;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    //注册广播（发送消息和重连）
    IntentFilter filter = new IntentFilter();
    filter.addAction(ConstantsParams.PARAM_RE_CONNECT);
    filter.addAction(ConstantsParams.PARAM_SEND_MESSAGE);

    filter.addAction(ConstantsParams.PARAM_KILL_IM);
    filter.addAction(ConstantsParams.PARAM_STOP_IMSERVICE);
    filter.addAction(ConstantsParams.PARAM_TOPIC_SUBSCRIBE);
    filter.addAction(ConstantsParams.PARAM_TOPIC_UNSUBSCRIBE);
    receiver = new IMReceiver();
    registerReceiver(receiver, filter);

    //消息发送回调
    receiver.setOnMessageSendListener(new IMReceiver.OnMessageSendListener() {
      @Override
      public void onSend(final String topic, final String content) {
        //发送消息
        sendMsg(topic, content);
      }
    });

    //重连回调
    receiver.setOnIMReconnect(new IMReceiver.OnIMReconnect() {
      private int count = 0;
      private final ReconnectRunnable reconnectRunnable = new ReconnectRunnable();

      @Override
      public void onReconnect() {

        if (imConnection != null && imConnection.isConnected()) {
          return;
        }
        if (NetUtils.getNetWorkState(getBaseContext()) == -1) {
          return;
        }
        if (IMStatusManager.getImStatus() != IMEnums.CONNECT_DOWN_BY_HAND) {
          IMSwitchLocal.reloginCheckStatus(new IMSwitchLocal.IReloginCheckStatus() {
            @Override
            public void onCheck(IMSwitchLocal.EReloginCheckStatus status) {
              if (status == IMSwitchLocal.EReloginCheckStatus.CAN_RECONNECT) {
                count = 0;
                connectIM();
              } else if (status == IMSwitchLocal.EReloginCheckStatus.NEED_LOGOUT) {
                count = 0;
                //账号被挤掉，退出登录
                IMSwitchLocal.exitLogin(getBaseContext());
              } else {
                handler.postDelayed(reconnectRunnable, 2000 * (count++));
              }
            }
          });
        }
      }
    });

    //杀死IM，如果不需要重启IM，可以手动设置状态为手动断开了IM
    receiver.setOnKillIM(new IMReceiver.OnKillIM() {
      @Override
      public void onKillIM() {
        if (imConnection != null && imConnection.isConnected()) {
          imConnection.closeIM();
        }
      }
    });

    //干死IM并且干死IMService、IMProtectService
    receiver.setOnStopIMService(new IMReceiver.OnStopIMService() {
      @Override
      public void onStopIMService() {
        //向服务起发送离线消息
        IMUtils.sendOnOffState("UOF", imConnection);
        IMStatusManager.setImStatus(IMEnums.CONNECT_DOWN_BY_HAND);
        if (imConnection != null) {
          imConnection.closeIM();
        }
        stopService(new Intent(getBaseContext(), IMProtectService.class));
        stopSelf();
      }
    });

    //订阅topic
    receiver.setOnTopicSubscribeListener(new IMReceiver.OnTopicSubscribeListener() {
      @Override
      public void onTopicSubscribe(String topic) {
        try {
          if (imConnection != null) {
            imConnection.subscribe(topic, 1);
          }
        } catch (MqttException e) {
          e.printStackTrace();
        }
      }
    });

    //反订阅topic
    receiver.setOnTopicUnSubscribeListener(new IMReceiver.OnTopicUnSubscribeListener() {
      @Override
      public void onTopicUnSubscribe(String topic) {
        if (imConnection != null) {
          try {
            imConnection.unsubscribe(topic);
          } catch (MqttException e) {
            e.printStackTrace();
          }
        }
      }
    });

    //注册亮屏广播
    screenReceiver = new IMScreenReceiver();
    IntentFilter screenFilter = new IntentFilter();
    screenFilter.addAction(Intent.ACTION_SCREEN_ON);
    registerReceiver(screenReceiver, screenFilter);
  }

  private static int count = 0;

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    if (imConnection == null || !imConnection.isConnected() && IMStatusManager.getImStatus() != IMEnums.CONNECT_DOWN_BY_HAND) {
      new Thread(new Runnable() {
        @Override
        public void run() {
          connectIM();
        }
      }).start();
      //使用兼容版本
      NotificationCompat.Builder builder = new NotificationCompat.Builder(this);
      //设置状态栏的通知图标
      builder.setSmallIcon(R.drawable.icon);
      //设置通知栏横条的图标
      builder.setLargeIcon(BitmapFactory.decodeResource(getResources(), R.drawable.icon));
      //禁止用户点击删除按钮删除
      builder.setAutoCancel(false);
      Intent intent1 = new Intent(getApplicationContext(), MainActivity.class);
      PendingIntent pendingIntent = PendingIntent.getActivity(UIUtils.getContext(), requestCode, intent1, 0);
      builder.setContentIntent(pendingIntent);
      //禁止滑动删除
      builder.setOngoing(true);
      //右上角的时间显示
      builder.setShowWhen(true);
      //设置通知栏的标题内容
      builder.setContentTitle("即时通正在运行");
      //创建通知
      Notification notification = builder.build();
      //设置为前台服务
      startForeground(0x0010, notification);
    }
    if (beats == null) {
      IMService.this.beats = new HeartbeatUtils(new HeartbeatUtils.OnTimeoutListener() {
        @Override
        public void onTimeout() {
          if (IMService.this.imConnection == null || !IMService.this.imConnection.isConnected() && IMStatusManager.getImStatus() != IMEnums.CONNECT_DOWN_BY_HAND) {
            IMBroadOper.broad(ConstantsParams.PARAM_RE_CONNECT);
          }
        }
      });
      IMService.this.beats.start();
    }
    return super.onStartCommand(intent, Service.START_FLAG_REDELIVERY, startId);
  }

  class ReconnectRunnable implements Runnable {
    @Override
    public void run() {
      handler.removeCallbacks(this);
      IMBroadOper.broad(ConstantsParams.PARAM_RE_CONNECT);
    }
  }

  /**
   * IM未连接时，消息发送处理类（Runnable）
   */
  class MessageRunnable implements Runnable {
    private String topic;
    private String content;
    private Handler handler;

    public MessageRunnable(String topic, String content, Handler handler) {
      this.topic = topic;
      this.content = content;
      this.handler = handler;
    }

    int timeCount = 0;

    @Override
    public void run() {
      final MqttMessage msg = new MqttMessage();
      try {
        msg.setPayload(MessageOper.packData(content));
      } catch (Exception e) {
        String swithedMsg = switchMsg(content, false);
        MqttOper.sendErrNotify(swithedMsg);
        handler.removeCallbacks(MessageRunnable.this);
        e.printStackTrace();
        return;
      }
      if (timeCount++ >= 20) {
        IMService.this.imConnection.publish(topic, msg, new IMqttActionListener() {
          @Override
          public void onSuccess(IMqttToken iMqttToken) {
            //发送中，消息发送成功，回调
            String swithedMsg = switchMsg(content, true);
            MqttOper.sendSuccNotify(swithedMsg);
            handler.removeCallbacks(MessageRunnable.this);
          }

          @Override
          public void onFailure(IMqttToken iMqttToken, Throwable throwable) {
            String swithedMsg = switchMsg(content, false);
            MqttOper.sendErrNotify(swithedMsg);
            handler.removeCallbacks(MessageRunnable.this);
          }
        });
        return;
      }
      if (IMService.this.imConnection == null || !IMService.this.imConnection.isConnected()) {
        //发送重连广播
        IMBroadOper.broad(ConstantsParams.PARAM_RE_CONNECT);
        handler.removeCallbacks(MessageRunnable.this);
        handler.postDelayed(this, 1000);
      } else {
        //IM连接成功，发送消息
        IMService.this.imConnection.publish(topic, msg, new IMqttActionListener() {
          @Override
          public void onSuccess(IMqttToken iMqttToken) {
            //发送中，消息发送成功，回调
            String swithedMsg = switchMsg(content, true);
            MqttOper.sendSuccNotify(swithedMsg);
            handler.removeCallbacks(MessageRunnable.this);
          }

          @Override
          public void onFailure(IMqttToken iMqttToken, Throwable throwable) {
            String swithedMsg = switchMsg(content, false);
            MqttOper.sendErrNotify(swithedMsg);
            handler.removeCallbacks(MessageRunnable.this);
          }
        });

      }
    }
  }

  /**
   * 发送消息
   *
   * @param topic
   * @param content
   */
  private void sendMsg(final String topic, final String content) {
    if (imConnection == null || !imConnection.isConnected()) {
      //每隔1s检测一次IM是否已经连接，如果连接了，直接发送消息，如果没连接，重连IM，再隔1s再次检测，以此类推
      Handler handler = new Handler();
      MessageRunnable messageRunnable = new MessageRunnable(topic, content, handler);
      handler.postDelayed(messageRunnable, 1000);
    } else {
      //MQTT连接，直接发送消息
      MqttMessage msg = new MqttMessage();
      try {
        msg.setPayload(MessageOper.packData(content));
      } catch (Exception e) {
        String swithedMsg = switchMsg(content, false);
        MqttOper.sendErrNotify(swithedMsg);
        e.printStackTrace();
        return;
      }
      //IM连接成功，发送消息
      imConnection.publish(topic, msg, new IMqttActionListener() {
        @Override
        public void onSuccess(IMqttToken iMqttToken) {
          //发送中，消息发送成功，回调
          String swithedMsg = switchMsg(content, true);
          MqttOper.sendSuccNotify(swithedMsg);
        }

        @Override
        public void onFailure(IMqttToken iMqttToken, Throwable throwable) {
          String swithedMsg = switchMsg(content, false);
          MqttOper.sendErrNotify(swithedMsg);
        }
      });
    }
  }

  /**
   * 转换消息
   *
   * @param msg
   * @param sendStatus
   * @return
   */
  private String switchMsg(String msg, boolean sendStatus) {
    Messages messages = GsonUtils.fromJson(msg, Messages.class);
    messages.setIsFailure(sendStatus ? "false" : "true");
    messages.setIsSuccess(sendStatus ? "true" : "false");
    return GsonUtils.toJson(messages, Messages.class);

  }

  /**
   * 连接MQTT
   */
  private void connectIM() {
    if (NetUtils.isConnect(getBaseContext())) {
      imConnection = new IMConnection();
      if (imConnectCallback == null) {
        imConnectCallback = new IMConnectCallback(getBaseContext(), imConnection);
      }
      if (imMessageCallback == null) {
        imMessageCallback = new IMMessageCallback(getBaseContext(), imConnection);
      }
      try {
        imConnection.connect(getBaseContext(), imConnectCallback, imMessageCallback);
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }

  @Override
  public void onDestroy() {
    if (receiver != null) {
      try {
        getBaseContext().unregisterReceiver(receiver);
        receiver = null;
      } catch (Exception e) {
      }
    }
    if (screenReceiver != null) {
      try {
        getBaseContext().unregisterReceiver(screenReceiver);
        screenReceiver = null;
      } catch (Exception e) {
      }
    }
    if (imConnection != null) {
      imConnection.closeIM();
    }
    Intent alarmReleaseLockIntent = new Intent();
    alarmReleaseLockIntent.setAction("release_alarm_lock.action");
    sendBroadcast(alarmReleaseLockIntent);
    //停止前台Service
    stopForeground(true);
    //如果IMProtectService死了，可以救回IMProtectService，如果没有，则，起到救回当前service的作用
    if (IMStatusManager.getImStatus() != IMEnums.CONNECT_DOWN_BY_HAND) {
      startService(new Intent(getBaseContext(), IMProtectService.class));
    }
    if (beats != null) {
      beats.stopLoop();
    }
    super.onDestroy();
  }
}
