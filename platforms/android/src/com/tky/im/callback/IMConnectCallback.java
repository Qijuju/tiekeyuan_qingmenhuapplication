package com.tky.im.callback;

import android.content.Context;

import com.tky.im.bean.TopicsCoupleQoss;
import com.tky.im.connection.IMConnection;
import com.tky.im.enums.IMEnums;
import com.tky.im.params.ConstantsParams;
import com.tky.im.receiver.IMReceiver;
import com.tky.im.test.LogPrint;
import com.tky.im.utils.IMBroadOper;
import com.tky.im.utils.IMStatusManager;
import com.tky.im.utils.IMUtils;
import com.tky.mqtt.paho.MqttTopicRW;
import com.tky.mqtt.paho.UIUtils;

import org.eclipse.paho.client.mqttv3.DisconnectedBufferOptions;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttException;

/**
 * Created by tkysls on 2017/4/17.
 */

public class IMConnectCallback implements IMqttActionListener {
    private Context context;
    private IMConnection imConnection;
    private IMReceiver receiver;
    private boolean isSubscribe = false;

    public IMConnectCallback(Context context, IMConnection imConnection) {
        this.context = context;
        this.imConnection = imConnection;
    }

    @Override
    public void onSuccess(IMqttToken iMqttToken) {
        LogPrint.print("MQTT", "启动成功~~~");
        LogPrint.print2("MQTT", "启动成功~~~");
        //设置连接成功状态
        IMStatusManager.setImStatus(IMEnums.CONNECTED);

        //链接成功后 发送上线状态
        IMUtils.sendOnOffState("UOL",imConnection);

        //广播当前连接状态
        IMBroadOper.broad(ConstantsParams.PARAM_CONNECT_SUCCESS);

        //订阅topic
        subscribeTopics();
    }

    @Override
    public void onFailure(IMqttToken iMqttToken, Throwable throwable) {
        LogPrint.print("MQTT", "启动失败~~~");
        LogPrint.print2("MQTT", "启动失败~~~");
        DisconnectedBufferOptions disconnectedBufferOptions = new DisconnectedBufferOptions();
        disconnectedBufferOptions.setBufferEnabled(true);
        disconnectedBufferOptions.setBufferSize(100);
        disconnectedBufferOptions.setPersistBuffer(false);
        disconnectedBufferOptions.setDeleteOldestMessages(false);
        imConnection.getClient().setBufferOpts(disconnectedBufferOptions);
        //广播当前连接状态
        IMBroadOper.broad(ConstantsParams.PARAM_CONNECT_FAILURE);

        //发送重连广播
        IMBroadOper.broad(ConstantsParams.PARAM_RE_CONNECT);
        /*UIUtils.getHandler().postDelayed(new Runnable() {
            @Override
            public void run() {
                IMBroadOper.broad(imConnection.isConnected() ? ConstantsParams.PARAM_CONNECT_SUCCESS : ConstantsParams.PARAM_CONNECT_FAILURE);
            }
        }, 2000);*/
    }

    /**
     * 订阅所有topic
     */
    private void subscribeTopics() {
        if (isSubscribe) {
            return;
        }
        isSubscribe = !isSubscribe;
        TopicsCoupleQoss topicsAndQoss = MqttTopicRW.getTopicsAndQoss2();
        if (topicsAndQoss != null) {
            try {
                imConnection.subscribe(topicsAndQoss.getTopics(), topicsAndQoss.getQoss());
            } catch (MqttException e) {
                e.printStackTrace();
            }
        }

    }

}
