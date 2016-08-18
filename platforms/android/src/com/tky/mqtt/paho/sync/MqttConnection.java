package com.tky.mqtt.paho.sync;

import android.content.Context;
import android.content.IntentFilter;

import com.tky.mqtt.paho.ConnectionType;
import com.tky.mqtt.paho.MessageOper;
import com.tky.mqtt.paho.MqttParams;
import com.tky.mqtt.paho.MqttReceiver;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.callback.MqttMessageCallback;
import com.tky.mqtt.paho.utils.MqttOper;
import com.tky.protocol.model.IMPException;

import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.JSONException;

/**
 * 作者：
 * 包名：com.test
 * 日期：2016/8/17 19:56
 * 描述：
 */
public class MqttConnection {

    /**
     * 建立MQTT连接成功与失败的标志
     */
    private IMqttToken token;
    /**
     * MQTT客户端对象（MQTT client object）
     */
    private MqttClient client;
    private MqttParams params;
    private Context context;
    private MqttReceiver receiver;
    /**
     * 断开连接的模式：手动&自动
     */
    private ConnectionType connectionType;

    public boolean connect(final Context context) throws MqttException {
        this.context = context;
        //重置状态
        setConnectionType(ConnectionType.MODE_NONE);
        params = new MqttParams();
        client = new MqttClient(params.getServerURI(), params.getClientId(), params.getPersistence());
        MqttMessageCallback callback = new MqttMessageCallback(context, this);
        client.setCallback(callback);
        token = client.connectWithResult(params.getOptions());
        UIUtils.runInMainThread(new Runnable() {
            @Override
            public void run() {
                receiver = MqttReceiver.getInstance();
                IntentFilter filter = new IntentFilter();
                filter.addAction(ReceiverParams.SENDMESSAGE);
                filter.addAction(ReceiverParams.RECONNECT_MQTT);
                filter.addAction(ReceiverParams.CONNECTION_DOWN_MQTT);
                filter.addAction(ReceiverParams.SUBSCRIBE);
                context.registerReceiver(receiver, filter);
                //发消息的回调
                receiver.setOnMessageSendListener(new MqttReceiver.OnMessageSendListener() {
                    @Override
                    public void onSend(String topic, String content) {
                        MqttMessage message = new MqttMessage();
                        try {
                            String msg = new String(MessageOper.packData(content));
                            message.setPayload(MessageOper.packData(content));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        } catch (IMPException e) {
                            e.printStackTrace();
                        }
                        message.setQos(1);
                        MqttConnection.this.publish(topic, message);
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
                        closeConnection(ConnectionType.MODE_CONNECTION_DOWN_MANUAL);
                    }
                });

                //发布主题的回调
                receiver.setOnTopicSubscribeListener(new MqttReceiver.OnTopicSubscribeListener() {
                    @Override
                    public void onTopicSubscribe(String topic, int qos) throws MqttException {
                        subscribe(topic, qos);
                    }
                });
            }
        });
        return token.isComplete();
    }

    /**
     * 断开重连
     * @return
     * @throws MqttException
     */
    public boolean reconnect() throws MqttException {
        closeConnection(ConnectionType.MODE_CONNECTION_DOWN_AUTO);
        return connect(context);
    }

    /**
     * 断掉MQTT连接
     * @param modeConnectionDownManual
     */
    public void closeConnection(ConnectionType modeConnectionDownManual) {
        this.connectionType = modeConnectionDownManual;
        if (client != null && client.isConnected()) {
            try {
                client.disconnectForcibly();
//                client.close();
                client = null;
            } catch (MqttException e) {
                e.printStackTrace();
            }
        }
        if (receiver != null) {
            context.unregisterReceiver(receiver);
            receiver = null;
        }
    }

    /**
     * 获取MQTT连接所需参数（Get the params of the mqtt connection that we'll need）
     * @return
     */
    public MqttParams getParams() {
        return params;
    }

    /**
     * 获取MQTT客户端对象（Get a mqtt client object）
     * @return
     */
    public MqttClient getClient() {
        return client;
    }

    /**
     * 是否建立连接成功（Is connection build success?）
     * @return
     */
    public boolean isComplete() {
        if (token == null) {
            return false;
        }
        return token.isComplete();
    }

    /**
     * MQTT是否为连接状态
     * @return
     */
    public boolean isConnected() {
        return client == null ? false : client.isConnected();
    }

    /**
     * 发布主题（Subscribe one topic with one qos）
     * @param topic
     * @param qos
     */
    public void subscribe(String topic, int qos) {
        if (client != null && client.isConnected()) {
            try {
                client.subscribe(topic, qos);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 发布主题（Subscribe many topics with many qos）
     * @param topics
     * @param qoses
     */
    public void subscribe(String[] topics, int[] qoses) {
        if (client != null && client.isConnected()) {
            try {
                client.subscribe(topics, qoses);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 解除发布主题
     * @param topic
     */
    public void unsubscribe(String topic) {
        if (client != null && client.isConnected()) {
            try {
                client.unsubscribe(topic);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 解除发布主题
     * @param topics
     */
    public void unsubscribe(String[] topics) {
        if (client != null && client.isConnected()) {
            try {
                client.unsubscribe(topics);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 发消息
     * @param topic
     * @param message
     */
    public void publish(String topic, MqttMessage message) {
        if (client != null && client.isConnected()) {
            try {
                client.publish(topic, message);
            } catch (Exception e) {
                MqttOper.sendErrNotify();
                e.printStackTrace();
            }
        }
    }

    public ConnectionType getConnectionType() {
        return connectionType;
    }

    public void setConnectionType(ConnectionType connectionType) {
        this.connectionType = connectionType;
    }
}
