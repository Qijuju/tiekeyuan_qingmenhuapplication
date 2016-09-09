package com.tky.mqtt.paho;

import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.util.Log;

import com.ionicframework.im366077.MainActivity;
import com.ionicframework.im366077.R;
import com.tky.mqtt.dao.ChatList;
import com.tky.mqtt.dao.GroupChats;
import com.tky.mqtt.paho.bean.EventMessageBean;
import com.tky.mqtt.paho.bean.MessageBean;
import com.tky.mqtt.paho.bean.MessageTypeBean;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.paho.utils.NetUtils;
import com.tky.mqtt.paho.utils.SwitchLocal;
import com.tky.mqtt.services.ChatListService;
import com.tky.mqtt.services.GroupChatsService;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import java.util.List;

public class MqttMessageCallback implements MqttCallback {

	private Context context;
	private final MqttConnection mqttAsyncClient;

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
			mqttAsyncClient.setConnectionType(ConnectionType.MODE_NONE);
			try {
//                SPUtils.save("count", "第" + count + "次重联");
				mqttAsyncClient.reconnect();
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
			if (fromUserId != null && MqttTopicRW.isFromMe("User", fromUserId)) {
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
					System.out.println("完整的数据格式"+json);
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
			MqttNotification.showNotify("qunzuxiaoxi", R.drawable.ic_launcher, "群组消息", getMessage(eventMsgBean.getEventCode()), new Intent(context, MainActivity.class));
			MessageBean eventBean = new MessageBean();
			eventBean.set_id(groupID);
			eventBean.setSessionid(groupID);
			eventBean.setUsername(eventMsgBean.getUserName() == null ? "" : eventMsgBean.getUserName());
			eventBean.setWhen(eventMsgBean.getWhen());
			eventBean.setImgSrc("");
			eventBean.setFrom("false");
			eventBean.setIsFailure("false");
			eventBean.setMessage(getMessage(eventMsgBean.getEventCode()));
			eventBean.setMessagetype("Event_" + eventMsgBean.getEventCode());
			eventBean.setPlatform("Android");
			eventBean.setType("Group");
			eventBean.setIsDelete("false");

			//如果是被添加群成员，数据需要入库
			if ("YAM".equals(eventMsgBean.getEventCode())) {
				GroupChatsService groupChatsService = GroupChatsService.getInstance(UIUtils.getContext());
				GroupChats groupChats = new GroupChats();
				System.out.println("群组id"+eventMsgBean.getGroupID());
				groupChats.setId(eventMsgBean.getGroupID());
				groupChats.setGroupName(eventMsgBean.getGroupName() == null ? "无群组名称" : eventMsgBean.getGroupName());
				groupChats.setGroupType("Group");
				groupChats.setIsmygroup(false);
				groupChatsService.saveObj(groupChats);
			} else if ("GN0".equals(eventMsgBean.getEventCode())) {
				ChatListService chatListService=ChatListService.getInstance(UIUtils.getContext());
				List<ChatList> chatLists=chatListService.queryData("where id =?", eventMsgBean.getGroupID());
				ChatList chatListobj=chatLists.get(0);
				chatListobj.setChatName(eventMsgBean.getGroupName());
				chatListService.saveObj(chatListobj);

				GroupChatsService groupChatsService=GroupChatsService.getInstance(UIUtils.getContext());
				List<GroupChats> groupChatsList=groupChatsService.queryData("where id =?", eventMsgBean.getGroupID());
				GroupChats groupChatsObj=groupChatsList.get(0);
				groupChatsObj.setGroupName(eventMsgBean.getGroupName());
				groupChatsService.saveObj(groupChatsObj);
			}

			//处理特殊业务（例如：注销topic，注册topic等）
			doDelTopic(groupID, eventMsgBean.getEventCode());
			Intent intent = new Intent();
			intent.setAction(ReceiverParams.MESSAGEARRIVED);
			intent.putExtra("topic", topic);
			String json = GsonUtils.toJson(eventBean, MessageBean.class);
			intent.putExtra("content", json);
			intent.putExtra("qos", msg.getQos());
			msg.clearPayload();
			context.sendBroadcast(intent);

		}
	}

	/**
	 * 根据事件类型设置消息内容
	 * @param eventCode
	 * @return
	 */
	private String getMessage(String eventCode) {
		String message = "";
		if ("YAA".equals(eventCode)) {//你被添加为管理员
			message = "你被添加为管理员";
		} else if ("YAM".equals(eventCode)) {//你被群组添加为成员
			message = "你被群组添加为成员";
		} else if ("GN0".equals(eventCode)) {//群组名称增、改
			message = "群组名称增、改";
		} else if ("G00".equals(eventCode)) {//群组信息增、改
			message = "群组信息增、改";
		} else if ("YRA".equals(eventCode)) {//你被移除管理员
			message = "你被移除管理员";
		} else if ("YRM".equals(eventCode)) {//你被移除出群组
			message = "你被移除出群组";
		} else if ("RG0".equals(eventCode)) {//群组被移除
			message = "群组被移除";
		} else if ("GAM".equals(eventCode)) {//群组添加某人
			message = "群组添加某人";
		} else if ("GRM".equals(eventCode)) {//群组移除某人
			message = "群组移除某人";
		}
		return message;
	}

	/**
	 * 群组中不包含自己时将topic注销
	 * @param groupID
	 * @param eventCode
	 */
	private void doDelTopic(String groupID, String eventCode) {
		String gTopic = SwitchLocal.getATopic(MType.G, groupID);
		if ("YRM".equals(eventCode) || "RG0".equals(eventCode)) {
			try {
				MqttTopicRW.remove(groupID);
				mqttAsyncClient.unsubscribe(gTopic);
			} catch (MqttException e) {
				e.printStackTrace();
			}
		} else if ("YAM".equals(eventCode)) {//你被群组添加为成员
			MqttTopicRW.append(gTopic, 1);
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
