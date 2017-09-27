package com.tky.im.connection;

import android.content.Context;
import android.support.annotation.NonNull;

import com.tky.im.bean.IMParams;
import com.tky.im.test.LogPrint;
import com.tky.im.utils.IMUtils;
import com.tky.mqtt.dao.Messages;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.utils.GsonUtils;

import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

/**
 * Created by tkysls on 2017/4/11.
 */

public class IMConnection {

    /**
     * 上下文对象，必须为Activity的实例
     */
    private Context context;
    private IMParams params;
    private MqttAsyncClient mqttAsyncClient;

    /**
     * 连接MQTT
     * @param context
     * @throws MqttException
     */
    public void connect(@NonNull Context context, @NonNull IMqttActionListener connectCallback, @NonNull MqttCallback messageCallback) throws MqttException {
        this.context = context;
        if (this.context == null) {
            throw new NullPointerException("The context can not be null！");
        }

        if (connectCallback == null) {
            throw new IllegalArgumentException("IMqttActionListener is null...");
        }

        if (messageCallback == null) {
            throw new IllegalArgumentException("MqttCallback is null...");
        }

        //如果之前连接过，断开连接
        if (mqttAsyncClient != null) {
            closeIM();
        }
        LogPrint.print("MQTT", "开始连接~~~");
        params = new IMParams();
        mqttAsyncClient = new MqttAsyncClient(params.getServerURI(),
                params.getClientId(), params.getPersistence(),
                params.getPingSender());
        //创建连接
        mqttAsyncClient.connect(params.getOptions(), null, connectCallback);

        mqttAsyncClient.setCallback(messageCallback);
    }

    /**
     * 发消息
     * @param tosb
     * @param message
     * @param callback
     */
    public void publish(final String tosb, final MqttMessage message, final IMqttActionListener callback) {
        if (isConnected()) {
            try {
                mqttAsyncClient.publish(tosb, message, null, new IMqttActionListener() {
                    @Override
                    public void onSuccess(IMqttToken iMqttToken) {
//                      System.out.println("有没有发消息"+tosb+message);
                        callback.onSuccess(iMqttToken);
                    }

                    @Override
                    public void onFailure(IMqttToken iMqttToken, Throwable throwable) {
                        callback.onFailure(iMqttToken, throwable);
                    }
                });
            } catch (Exception e) {
                callback.onFailure(null, e);
                e.printStackTrace();
            }
        } else {
            callback.onFailure(null, null);
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
     * 获取MQTT连接的参数
     * @return
     */
    public IMParams getParams() {
        return params;
    }

    /**
     * 关闭连接
     */
    public void closeIM() {
        if (mqttAsyncClient != null) {
            //手动退出登录，往服务器传送下线状态
            IMUtils.sendOnOffState("UOF",this);
            LogPrint.print("MQTT", "断开连接~~~");
            try {
                mqttAsyncClient.close();
            } catch (MqttException e) {
                e.printStackTrace();
            } finally {
                if (mqttAsyncClient != null && mqttAsyncClient.isConnected()) {
                    try {
                        mqttAsyncClient.disconnectForcibly();
                    } catch (MqttException e) {
                        e.printStackTrace();
                    } finally {
                        mqttAsyncClient = null;
                    }
                }
            }
        }
    }

    //订阅主题
    public void subscribe(String topic, int qos) throws MqttException {
        if (mqttAsyncClient != null && mqttAsyncClient.isConnected()) {
            try {
                mqttAsyncClient.subscribe(topic, qos);
            } catch (Exception e) {
              //mqtt在线才显示订阅失败
                if(MqttRobot.isStarted())
                  ToastUtil.showSafeToast("订阅TOPIC失败！");
            }
        }
    }
    //订阅多个主题
    public void subscribe(String[] topics, int[] qoss) throws MqttException {
        if (mqttAsyncClient != null && mqttAsyncClient.isConnected()) {
            try {
                mqttAsyncClient.subscribe(topics, qoss);
            } catch (Exception e) {
              //mqtt在线才显示订阅失败
                if(MqttRobot.isStarted())
                  ToastUtil.showSafeToast("订阅TOPIC失败！");
            }
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

    public MqttAsyncClient getClient() {
        return mqttAsyncClient;
    }

    /**
     * 获取MQTT连接状态
     * @return
     */
    public boolean isConnected() {
        return mqttAsyncClient != null && mqttAsyncClient.isConnected();
    }

  /**
   * 设置mqtt地址
   * @param mqtt
   */
  public static void setURL(String mqtt) {
    SPUtils.save("mqtt_url", mqtt);
  }

  /**
   * 获取MQTT地址
   * @return
   */
  public static String getURL() {
    return SPUtils.getString("mqtt_url", "");
  }
}
