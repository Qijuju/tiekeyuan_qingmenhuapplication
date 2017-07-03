package com.tky.mqtt.paho.callback;

import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.util.Log;

import com.ionicframework.im366077.MainActivity;
import com.ionicframework.im366077.R;
import com.tky.mqtt.dao.GroupChats;
import com.tky.mqtt.paho.ConnectionType;
import com.tky.mqtt.paho.MType;
import com.tky.mqtt.paho.MessageOper;
import com.tky.mqtt.paho.MqttNotification;
import com.tky.mqtt.paho.MqttTopicRW;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.bean.EventMessageBean;
import com.tky.mqtt.paho.bean.MessageBean;
import com.tky.mqtt.paho.bean.MessageTypeBean;
import com.tky.mqtt.paho.sync.MqttConnection;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.paho.utils.NetUtils;
import com.tky.mqtt.paho.utils.SwitchLocal;
import com.tky.mqtt.services.GroupChatsService;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import java.util.List;

public class MqttMessageCallback implements MqttCallback {

    private Context context;
    private final MqttConnection mqttAsyncClient;
    /**
     * 重连次数
     */
    private static int count = 0;

    public MqttMessageCallback(Context context, MqttConnection mqttAsyncClient) {
        this.context = context;
        this.mqttAsyncClient = mqttAsyncClient;
    }

    @Override
    public void connectionLost(Throwable arg0) {
//        count++;
//        SPUtils.save("connectionLost", "第" + count + "次失联");
        Log.d("reconnect", "MQTT断掉了~~~" + (mqttAsyncClient == null ? "nullllll" : "notnulll"));
        if (NetUtils.isConnect(context) && mqttAsyncClient.getConnectionType() != ConnectionType.MODE_CONNECTION_DOWN_MANUAL) {
            try {
//                SPUtils.save("count", "第" + count + "次重联");
                boolean reconnect = mqttAsyncClient.reconnect();
            } catch (MqttException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken arg0) {
    }

    @Override
    public void messageArrived(final String topic, final MqttMessage msg) throws Exception {
        Log.d("messageArrived", new String(msg.getPayload()));
        if (msg == null) {
            return;
        }
        if (msg.getPayload() == null || "".equals(new String(msg.getPayload()).trim())) {
            return;
        }
            /*// 初始化MediaPlay对象 ，准备播放音乐
            MediaPlayer mPlayer = MediaPlayer.create(context,
                    R.raw.jijiaojinxingqu);
            // 设置循环播放
            mPlayer.setLooping(false);
            // 开始播放
            mPlayer.start();*/
        final MessageTypeBean bean = MessageOper.unpack(msg.getPayload());
        if (bean != null && bean instanceof MessageBean) {
            final MessageBean map = (MessageBean) bean;
            String fromUserId = map.get_id();
            if (fromUserId != null && MqttTopicRW.isFromMe("ChildJSBean", fromUserId)) {
                return;
            }
            //接收到消息时的铃声
            ring();
            final String username = (String) map.getUsername();
            final String msgContent = (String) map.getMessage();
            UIUtils.runInMainThread(new Runnable() {

                @Override
                public void run() {
                    GroupChatsService groupChatsService=GroupChatsService.getInstance(UIUtils.getContext());
                    if ("Dept".equals(map.getType()) || "Group".equals(map.getType())) {
                        List<GroupChats> groupChatsList = groupChatsService.queryData("where id =?", map.getSessionid());
                        if(groupChatsList.size() !=0){
                            String chatname = groupChatsList.get(0).getGroupName();
                            MqttNotification.showNotify(map.getSessionid(), R.drawable.icon_group_conversation, chatname, msgContent, new Intent(context, MainActivity.class));
                        }
                    } else {
                        MqttNotification.showNotify(map.getSessionid(), R.drawable.icon_friends, username, msgContent, new Intent(context, MainActivity.class));
                    }
                    Intent intent = new Intent();
                    intent.setAction(ReceiverParams.MESSAGEARRIVED);
                    intent.putExtra("topic", topic);
                    String json = GsonUtils.toJson(map, MessageBean.class);
                    intent.putExtra("content", json);
                    intent.putExtra("qos", msg.getQos());
                    msg.clearPayload();
                    context.sendBroadcast(intent);
                }
            });
        } else if (bean != null && bean instanceof EventMessageBean) {
            //接收到消息时的铃声
            ring();
            EventMessageBean eventMsgBean = (EventMessageBean) bean;
            String groupID = eventMsgBean.getGroupID();
            String gTopic = SwitchLocal.getATopic(MType.G, groupID);
            MqttTopicRW.append(gTopic, 1);
            MqttNotification.showNotify("qunzuxiaoxi", R.drawable.ic_launcher, "群组消息", "您加入了新的群组！", new Intent(context, MainActivity.class));
        }
    }

    private void ring() {
        MediaPlayer mp = new MediaPlayer();
        try {
            mp.setDataSource(context, RingtoneManager
                    .getDefaultUri(RingtoneManager.TYPE_NOTIFICATION));
            mp.prepare();
            mp.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
