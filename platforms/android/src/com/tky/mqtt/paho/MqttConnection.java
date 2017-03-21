package com.tky.mqtt.paho;

import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;

import com.tky.mqtt.dao.Messages;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.paho.utils.MqttOper;
import com.tky.mqtt.paho.utils.NetUtils;
import com.tky.protocol.model.IMPException;

import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.JSONException;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;


/**
 * 建立mqtt链接
 */
public class MqttConnection {

  private MqttParams params;
  /**
   * MqttAsyncClient写成静态（static）的，所有对象共享该对象，
   * 则不会造成重复创建对象
   */
  private static MqttAsyncClient mqttAsyncClient;
  private Context context;
  private MqttReceiver receiver;
  private ConnectionType connectionType = ConnectionType.MODE_NONE;

  public void connect(Context context) throws MqttException {
    if (!MqttRobot.isStarted()) {
      return;
    }
    this.context = context;
    //MQTT启动中...
    MqttRobot.setMqttStatus(MqttStatus.LOADING);
    //重置状态
    MqttRobot.setConnectionType(ConnectionType.MODE_NONE);
    params = new MqttParams();
    mqttAsyncClient = new MqttAsyncClient(params.getServerURI(),
      params.getClientId(), params.getPersistence(),
      params.getPingSender());
//        params.getPingSender().start();
    IMqttActionListener callback = new MqttActionListener();
    //创建连接
    mqttAsyncClient.connect(params.getOptions(), null, callback);


    MqttCallback mqttCallback = new MqttMessageCallback(context, this);

    mqttAsyncClient.setCallback(mqttCallback);
  }

  private boolean testFlag = true;

  /**
   * 重新连接
   *
   * @throws MqttException
   */
  public void reconnect() throws MqttException {
    SPUtils.save("reconnect1", true);
    if (MqttRobot.getMqttStatus() == MqttStatus.CLOSE) {
      if (!MqttRobot.isStarted()) {
        MqttRobot.setMqttStatus(MqttStatus.CLOSE);
        closeConnection(ConnectionType.MODE_CONNECTION_DOWN_AUTO);
        return;
      }
      closeConnection(ConnectionType.MODE_CONNECTION_DOWN_AUTO);
      if (!isConnected()) {
        SPUtils.save("reconnect2", true);
        MqttRobot.setMqttStatus(MqttStatus.CLOSE);
        MqttRobot.setConnectionType(ConnectionType.MODE_CONNECTION_DOWN_AUTO);
//                mqttAsyncClient.close();
        connect(context);
      }
    }
  }

  public class MqttActionListener implements IMqttActionListener {

    @Override
    public void onFailure(IMqttToken arg0, Throwable arg1) {
      UIUtils.runInMainThread(new Runnable() {
        @Override
        public void run() {
          //MQTT启动失败，重新通过启动MqttService的方法启动MQTT
          MqttOper.restartService();
        }
      });
      SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      SPUtils.save("mqttFailure", format.format(new Date()));
      //启动失败，告诉启动者
      MqttRobot.setMqttStatus(MqttStatus.CLOSE);
      MqttOper.publishStartStatus(false);
      MqttOper.tellMqttStatus(false);
            /*try {
                reconnect();
            } catch (MqttException e) {
                e.printStackTrace();
            }*/
    }

    @Override
    public void onSuccess(IMqttToken arg0) {
      UIUtils.runInMainThread(new Runnable() {
        @Override
        public void run() {
          //启动成功，告诉启动者
          MqttRobot.setMqttStatus(MqttStatus.OPEN);
          MqttOper.publishStartStatus(true);
          MqttOper.tellMqttStatus(true);
          try {
//						if (!isReconnect) {
            if (!MqttReceiver.hasRegister) {
//                            ToastUtil.showToast("jinbujin");
              MqttReceiver.hasRegister = true;
              Map<String, Integer> topicsAndQoss = MqttTopicRW.getTopicsAndQoss();
              Iterator<String> it = topicsAndQoss.keySet().iterator();
              while (it.hasNext()) {
                String key = it.next();
                //获取topics
                Integer value = topicsAndQoss.get(key);
                //订阅主题
                subscribe(key, value);
//                                ToastUtil.showSafeToast("while:subscribe-->" + key);
              }
            }
//						}
            receiver = MqttReceiver.getInstance();

            //发消息的回调
            receiver.setOnMessageSendListener(new MqttReceiver.OnMessageSendListener() {
              @Override
              public void onSend(final String topic, final String content) {
                if (isConnected()) {
                  MqttRobot.setMqttStatus(MqttStatus.OPEN);
                  MqttOper.publishStartStatus(true);
                  MqttRobot.setConnectionType(ConnectionType.MODE_NONE);
                }
                boolean errState = true;
                if (content == null) {
                  errState = false;
                }
                final MqttMessage message = new MqttMessage();
                try {
                  String msg = new String(MessageOper.packData(content));
                  message.setPayload(MessageOper.packData(content));
                } catch (JSONException e) {
                  errState = false;
                  e.printStackTrace();
                } catch (IMPException e) {
                  errState = false;
                  e.printStackTrace();
                }
                if (!errState) {
                  //发送空消息
                  Intent intent = new Intent();
                  intent.setAction(ReceiverParams.SENDMESSAGE_ERROR);
                  context.sendBroadcast(intent);
                  return;
                }
//								message.setQos(topic.equals("zhuanjiazu") ? 0 : 2);
                message.setQos(1);
                                /*try {
                                    saveToFile(content);
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }*/
                try {
                  //多余的判断，其实这里不需要判断
                                    /*if (MqttRobot.getMqttStatus() == MqttStatus.CLOSE) {
                                        Intent intent = new Intent();
                                        intent.setAction(ReceiverParams.SENDMESSAGE_ERROR);
                                        context.sendBroadcast(intent);
                                        return;
                                    }*/
                  //修正状态
                  if (isConnected() && MqttRobot.getMqttStatus() != MqttStatus.OPEN) {
                    MqttRobot.setMqttStatus(MqttStatus.OPEN);
                  }
                  //如果有网MQTT却挂掉了，就重新启动MQTT并发送消息
                  if (!isConnected()) {
                                        /*MqttRobot.startMqtt(UIUtils.getContext(), MqttTopicRW.getStartTopicsAndQoss(), new MqttStartReceiver.OnMqttStartListener() {
                                            @Override
                                            public void onSuccess() {
                                                try {
                                                    MqttConnection.this.publish(topic, message);
                                                } catch (MqttException e) {
                                                    e.printStackTrace();
                                                }
                                            }

                                            @Override
                                            public void onFalure() {
                                                Intent intent = new Intent();
                                                intent.setAction(ReceiverParams.SENDMESSAGE_ERROR);
                                                context.sendBroadcast(intent);
                                            }
                                        });*/

                    new Thread(new Runnable() {
                      long start = 0;
                      boolean hasExecute = false;

                      @Override
                      public void run() {
                        start = System.currentTimeMillis();
                        while (System.currentTimeMillis() - start < 20 * 1000) {
                          if (!NetUtils.isConnect(UIUtils.getContext())) {
                            SystemClock.sleep(100);
                            continue;
                          }
                          if (isConnected()) {
                            hasExecute = true;
                            try {
                              publish(content, topic, message);
                            } catch (MqttException e) {
                              String swithedMsg = switchMsg(content, false);
                              MqttOper.sendErrNotify(swithedMsg);
                              e.printStackTrace();
                            }
                            break;
                          }
                          try {
                            reconnect();
                          } catch (MqttException e) {
                            hasExecute = true;
                            String swithedMsg = switchMsg(content, false);
                            MqttOper.sendErrNotify(swithedMsg);
                            e.printStackTrace();
                            break;
                          }
                          SystemClock.sleep(100);
                        }
                        if (!hasExecute) {
                          if (NetUtils.isConnect(UIUtils.getContext()) && isConnected()) {
                            try {
                              publish(content, topic, message);
                            } catch (MqttException e) {
                              String swithedMsg = switchMsg(content, false);
                              MqttOper.sendErrNotify(swithedMsg);
                              e.printStackTrace();
                            }
                          } else {
                            String swithedMsg = switchMsg(content, false);
                            MqttOper.sendErrNotify(swithedMsg);
                          }
                        }
                      }
                    }).start();
                    return;
                  }
                  //没网并且没连接MQTT
                  if (!isConnected() && !NetUtils.isConnect(context)) {
                    String swithedMsg = switchMsg(content, false);
                    MqttOper.sendErrNotify(swithedMsg);
                    return;
                  }
                  //正常直接发送消息
                  MqttConnection.this.publish(content, topic, message);
                } catch (MqttException e) {
                  String swithedMsg = switchMsg(content, false);
                  MqttOper.sendErrNotify(swithedMsg);
                  e.printStackTrace();
                }
              }
            });


            /**
             * 断开重连的监听
             */
            receiver.setOnNetUpListener(new MqttReceiver.OnNetUpListener() {
              @Override
              public void onNetUp() {
                try {
                  reconnect();
                } catch (MqttException e) {
                  e.printStackTrace();
                }
              }
            });

            /**
             * 断掉MQTT的连接
             */
            receiver.setOnConnectionDownListener(new MqttReceiver.OnConnectionDownListener() {
              @Override
              public void onConnectionDown() {
                try {
                  closeConnection(ConnectionType.MODE_CONNECTION_DOWN_MANUAL);
                } catch (MqttException e) {
                  e.printStackTrace();
                }
              }
            });

            receiver.setOnNetDownListener(new MqttReceiver.OnNetDownListener() {
              @Override
              public void onNetDown() {
                try {
                  closeConnection(ConnectionType.MODE_CONNECTION_DOWN_AUTO);
                } catch (MqttException e) {
                  e.printStackTrace();
                }
              }
            });


            //发布主题的广播
//						MqttReceiver topicReceiver = MqttReceiver.getInstance();
//						IntentFilter topicFilter = new IntentFilter();

            //发布主题的回调
            receiver.setOnTopicSubscribeListener(new MqttReceiver.OnTopicSubscribeListener() {
              @Override
              public void onTopicSubscribe(String topic, int qos) throws MqttException {
                subscribe(topic, qos);
              }
            });
          } catch (MqttException e) {
            e.printStackTrace();
          }
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
  //订阅主题
  public void subscribe(String topic, int qos) throws MqttException {
    if (mqttAsyncClient != null) {
      mqttAsyncClient.subscribe(topic, qos);
    }
  }
  //订阅多个主题
  public void subscribe(String[] topics, int[] qoss) throws MqttException {
    if (mqttAsyncClient != null) {
      mqttAsyncClient.subscribe(topics, qoss);
    }
  }

  /**
   * 注销topic
   *
   * @param topic
   * @throws MqttException
   */
  public void unsubscribe(String topic) throws MqttException {
    if (mqttAsyncClient != null) {
      try {
        mqttAsyncClient.unsubscribe(topic);
      } catch (Exception e) {
        ToastUtil.showSafeToast("注销TOPIC失败！");
      }
    }
  }

  /**
   * 注销topics
   *
   * @param topics
   * @throws MqttException
   */
  public void unsubscribe(String[] topics) throws MqttException {
    if (mqttAsyncClient != null) {
      try {
        mqttAsyncClient.unsubscribe(topics);
      } catch (Exception e) {
        ToastUtil.showSafeToast("注销TOPIC失败！");
      }
    }
  }

  /**
   * 发布消息
   *
   * @param topic
   * @param message
   * @throws MqttException
   */
  public void publish(final String content, String topic, final MqttMessage message) throws MqttException {
    if (mqttAsyncClient != null) {
      try {
        mqttAsyncClient.publish(topic, message, null, new IMqttActionListener() {
          @Override
          public void onSuccess(IMqttToken iMqttToken) {
            if (iMqttToken.isComplete()) {
              //发送中，消息发送成功，回调
              String swithedMsg = switchMsg(content, true);
              MqttOper.sendSuccNotify(swithedMsg);
            } else {
              //发送中，消息发送失败，回调
              String swithedMsg = switchMsg(content, false);
              MqttOper.sendErrNotify(swithedMsg);
            }
          }

          @Override
          public void onFailure(IMqttToken iMqttToken, Throwable throwable) {
            //发送中，消息发送失败，回调
            String swithedMsg = switchMsg(content, false);
            MqttOper.sendErrNotify(swithedMsg);
          }
        });
      } catch (Exception e) {
        //发送中，消息发送失败，回调
        String swithedMsg = switchMsg(content, false);
        MqttOper.sendErrNotify(swithedMsg);
      }
    }
  }

  /**
   * 将收到的消息写到文件中
   * @param text
   * @throws IOException
   */
    /*private void saveToFile(String text) throws IOException {
        File file = new File(FileUtils.getDownloadDir() + File.separator + "publisherror.txt");
        if (!file.exists()) {
            file.createNewFile();
        }
        FileOutputStream fos = new FileOutputStream(file, true);
        fos.write(((text == null || "".equals(text.trim())) ? "\r\nnotext" : "\r\n" + text).getBytes());
        fos.flush();
    }*/

  /**
   * 获取MQTT连接所需参数（Get the params of the mqtt connection that we'll need）
   *
   * @return
   */
  public MqttParams getParams() {
    return params;
  }

  public MqttAsyncClient getMqttAsyncClient() {
    return mqttAsyncClient;
  }

  /**
   * 手动断开连接
   *
   * @param modeConnectionDownManual
   * @throws MqttException
   */
  public void closeConnection(ConnectionType modeConnectionDownManual) throws MqttException {
    this.connectionType = modeConnectionDownManual;
    MqttRobot.setConnectionType(this.connectionType);
    if (mqttAsyncClient != null && mqttAsyncClient.isConnected()) {
      mqttAsyncClient.disconnectForcibly();
      mqttAsyncClient.close();
      if (mqttAsyncClient != null) {
        mqttAsyncClient = null;
      }
    } else if (mqttAsyncClient != null) {
      mqttAsyncClient = null;
    }
  }

  /**
   * 是否建立连接成功（Is connection build success?）
   * @return
   */
/*	public boolean isComplete() {
        if (token == null) {
			return false;
		}
		return token.isComplete();
	}*/

  /**
   * MQTT是否为连接状态
   *
   * @return
   */
  public boolean isConnected() {
    return mqttAsyncClient == null ? false : mqttAsyncClient.isConnected();
  }

  /*public ConnectionType getConnectionType() {
    return connectionType;
  }

  public void setConnectionType(ConnectionType connectionType) {
    this.connectionType = connectionType;
  }*/

  /**
   * 清理MQTT功能
   */
  private void freezeMqtt() {
    //反注册广播接收者
    if (receiver != null) {
      context.unregisterReceiver(receiver);
    }
    if (mqttAsyncClient != null) {
      try {
        closeConnection(ConnectionType.MODE_CONNECTION_DOWN_MANUAL);
      } catch (MqttException e) {
        e.printStackTrace();
      }
    }
  }

}
