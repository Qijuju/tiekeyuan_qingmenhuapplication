package com.tky.mqtt.paho;

import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.text.TextUtils;
import android.util.Log;

import com.r93535.im.MainActivity;
import com.r93535.im.R;
import com.tky.mqtt.dao.ChatList;
import com.tky.mqtt.dao.GroupChats;
import com.tky.mqtt.dao.Messages;
import com.tky.mqtt.dao.Otherpichead;
import com.tky.mqtt.dao.SystemMsg;
import com.tky.mqtt.paho.bean.EventMessageBean;
import com.tky.mqtt.paho.bean.MessageBean;
import com.tky.mqtt.paho.bean.MessageTypeBean;
import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.paho.utils.MqttOper;
import com.tky.mqtt.paho.utils.NetUtils;
import com.tky.mqtt.paho.utils.SwitchLocal;
import com.tky.mqtt.plugin.thrift.ThriftApiClient;
import com.tky.mqtt.services.ChatListService;
import com.tky.mqtt.services.GroupChatsService;
import com.tky.mqtt.services.MessagesService;
import com.tky.mqtt.services.OtherHeadPicService;
import com.tky.mqtt.services.SystemMsgService;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

public class MqttMessageCallback implements MqttCallback {

  private Context context;
  private final MqttConnection mqttAsyncClient;

  public MqttMessageCallback(Context context, MqttConnection mqttAsyncClient) {
    this.context = context;
    this.mqttAsyncClient = mqttAsyncClient;
  }

  /**
   * mqtt连接断开时调用该方法
   *
   * @param arg0
   */
  @Override
  public void connectionLost(Throwable arg0) {

    try {
      mqttAsyncClient.closeConnection(MqttRobot.getConnectionType());
    } catch (MqttException e) {
      e.printStackTrace();
    }
//    ToastUtil.showSafeToast("Mqtt断开链接了");
//    MqttOper.restartService();

    if (MqttRobot.getScreenStatus()) {
      MqttOper.tellMqttStatus(false);
    } else {
      MqttRobot.setScreenStatus(true);
    }
    MqttRobot.setMqttStatus(MqttStatus.CLOSE);

    if (NetUtils.isConnect(context)&& MqttRobot.isStarted() && MqttRobot.getConnectionType() != ConnectionType.MODE_CONNECTION_DOWN_MANUAL ) {
      SPUtils.save("reconnect", true);
      MqttRobot.setConnectionType(ConnectionType.MODE_NONE);
      /*try {
        mqttAsyncClient.reconnect();
      } catch (MqttException e) {

        e.printStackTrace();
      }*/
      MqttOper.restartService();
    } else {
      MqttRobot.setConnectionType(ConnectionType.MODE_CONNECTION_DOWN_AUTO);
    }

  }


  @Override
  public void deliveryComplete(IMqttDeliveryToken arg0) {
  }


  /**
   * 收到消息的方法
   *
   * @param topic
   * @param msg
   * @throws Exception
   */
  @Override
  public void messageArrived(final String topic, final MqttMessage msg) throws Exception {
    try {
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
      final MessageTypeBean bean = MessageOper.unpack(msg);
//			ToastUtil.showSafeToast("收到消息的对象类型"+(bean instanceof MessageBean)+"群事件对象"+(bean instanceof EventMessageBean));
      if (bean != null && bean instanceof MessageBean) {
        final MessageBean map = (MessageBean) bean;
//			ToastUtil.showToast("收到消息"+map.getMessage());
        if ("File".equals(map.getMessagetype()) || "Image".equals(map.getMessagetype())) {
          String message = map.getMessage().substring(0, map.getMessage().lastIndexOf("###"));
          map.setMessage(message + "###0");
        }
        final String fromUserId = map.get_id();
        if (fromUserId != null && MqttTopicRW.isFromMe("ChildJSBean", fromUserId) && "Android".equals(map.getPlatform())) {
          return;
        }
        if (fromUserId != null && !map.isFromMe()) {
          //接收到消息时的铃声
          ring();
        }
        final String username = (String) map.getUsername();
        final String msgContent = (String) map.getMessage();
        UIUtils.runInMainThread(new Runnable() {

          @Override
          public void run() {
            String messagetype = map.getMessagetype();
            String tip = msgContent;
            tip = "File".equals(messagetype) ? "【文件】" : tip;
            tip = "Image".equals(messagetype) ? "【图片】" : tip;
            tip = "LOCATION".equals(messagetype) ? "【定位】" : tip;
            tip = "Audio".equals(messagetype) ? "【语音】" : tip;
            tip = "Vedio".equals(messagetype) ? "【小视频】" : tip;
            GroupChatsService groupChatsService = GroupChatsService.getInstance(UIUtils.getContext());
            if (fromUserId != null && !map.isFromMe()) {
              if ("Dept".equals(map.getType()) || "Group".equals(map.getType())) {
                List<GroupChats> groupChatsList = groupChatsService.queryData("where id =?", map.getSessionid());
                if (groupChatsList.size() != 0) {
                  String chatname = groupChatsList.get(0).getGroupName();
                  MqttNotification.showNotify(map.getSessionid(), R.drawable.icon, chatname, tip,map.getType(), new Intent(context, MainActivity.class));
                }
              } else {
                MqttNotification.showNotify(map.getSessionid(), R.drawable.icon, username, tip,map.getType(), new Intent(context, MainActivity.class));
              }
            }
            //入库(MESSAGE和CHATLIST表)
            //消息转化完毕就入库
            int count = 0;
//                        ToastUtil.showSafeToast("消息类型" + map.getType());
            //平台推送消息
            if ("Platform".equals(map.getType())) {

              SystemMsg systemMsg = new SystemMsg();
              systemMsg.set_id(UUID.randomUUID().toString());
              systemMsg.setSessionid(map.getSessionid());
              systemMsg.setType(map.getType());
              systemMsg.setFrom(map.getFrom());
              systemMsg.setMessage(map.getMessage());
              //System.out.println("群事件"+map.getMessage());
              systemMsg.setMessagetype(map.getMessagetype());
              systemMsg.setPlatform(map.getPlatform());
              systemMsg.setWhen(map.getWhen());
              systemMsg.setIsFailure(map.getIsFailure());
              systemMsg.setIsDelete(map.getIsDelete());
              systemMsg.setImgSrc(map.getImgSrc());
              systemMsg.setUsername(map.getUsername());
              systemMsg.setSenderid(map.get_id());
              systemMsg.setMsglevel(map.getMsgLevel());
              systemMsg.setIsfocus("false");
              systemMsg.setIsread("false");
              systemMsg.setIstop(0);
              systemMsg.setIsconfirm("false");
              SystemMsgService systemMsgService = SystemMsgService.getInstance(UIUtils.getContext());
              systemMsgService.saveObj(systemMsg);

						/*ModuleCountService moduleCountService = ModuleCountService.getInstance(UIUtils.getContext());
                        List<ModuleCount> listModule = moduleCountService.loadAllData();
						Long long1 = 0L;
						Long long2 = 0L;
						Long long3 = 0L;
						Long long4 = 0L;

						if(listModule.size()>0){
							long1 = listModule.get(0).getCount1();
							long2 = listModule.get(0).getCount2();
							long3 = listModule.get(0).getCount3();
							long4 = listModule.get(0).getCount4();
						}else{
							long1 = 0L;
							long2 = 0L;
							long3 = 0L;
							long4 = 0L;
						}



						ModuleCount moduleCount = new ModuleCount();
						moduleCount.setId("1000");

						moduleCount.setName(map.getUsername());

						switch (Integer.parseInt(map.getSessionid())) {
							case 1:
								long1++;

								break;
							case 15:
								long2++;

								break;
							case 16:
								long3++;

								break;
							case 18:
								long4++;

								break;

						}
						moduleCount.setCount1(long1);
						moduleCount.setCount2(long2);
						moduleCount.setCount3(long3);
						moduleCount.setCount4(long4);
						moduleCount.setType("notify");
						moduleCountService.saveObj(moduleCount);*/


            } else if ("ChildJSBean".equals(map.getType()) || "Group".equals(map.getType()) || "Dept".equals(map.getType())) {
//						ToastUtil.showSafeToast("文本消息"+map.getMessage()+map.getSessionid());
              Calendar c = Calendar.getInstance();//可以对每个时间域单独修改
              String year = c.get(Calendar.YEAR) + "";
              String month = c.get(Calendar.MONTH) + 1 + "";
              String day = "";
              if (c.get(Calendar.DAY_OF_MONTH) < 10) {
                day = "0" + c.get(Calendar.DAY_OF_MONTH) + "";
              } else {
                day = c.get(Calendar.DAY_OF_MONTH) + "";
              }
              String hour = c.get(Calendar.HOUR_OF_DAY) + "";
              String minute = c.get(Calendar.MINUTE) + "";
              String second = c.get(Calendar.SECOND) + "";
              //System.out.println(year + "/" + month + "/" + getMonthOrDay(day) + " " + getMonthOrDay(hour) + ":" + getMonthOrDay(minute) + ":" + getMonthOrDay(second));
              String start = year + getMonthOrDay(month) + getMonthOrDay(day) + "000000";
              String end = year + getMonthOrDay(month) + getMonthOrDay(day) + "235959";
              DateFormat formatter = new SimpleDateFormat("yyyyMMddhhmmss");
              try {
                long stmill = formatter.parse(start).getTime();
                long etmill = formatter.parse(end).getTime();
                System.out.println("单聊时间：" + stmill + "/" + etmill);
                /**
                 * 根据sessionid取出该对话的聊天列表
                 */
                MessagesService messagesService = MessagesService.getInstance(UIUtils.getContext());
                List<Messages> messagesList = messagesService.queryData("where sessionid =?", map.getSessionid());
                System.out.println("查询聊天记录条数" + messagesList.size());
                Messages messages = new Messages();
                //取出数组最后一条数据跟今天的毫秒进行比对，若比今天的最低毫秒数低的话，则将istime为true的数据的daytype置为"0"
                if (messagesList.size() > 0) {
                  if (messagesList.get(messagesList.size() - 1).getWhen() < stmill) {
                    for (int i = 0; i < messagesList.size(); i++) {
                      messages = messagesList.get(i);
//										ToastUtil.showToast("确定有数据进来吗？"+messages.getIstime()+messages.getMessage());
                      if (messages.getIstime().equals("true")) {
//											ToastUtil.showToast("确定有数据进来吗？");
                        Messages updateMsg = new Messages();
                        updateMsg.set_id(messages.get_id());
                        updateMsg.setSessionid(messages.getSessionid());
                        updateMsg.setType(messages.getType());
                        updateMsg.setFrom(messages.getFrom());
                        updateMsg.setMessage(messages.getMessage());
//											System.out.println("群事件" + messages.getMessage());
                        updateMsg.setMessagetype(messages.getMessagetype());
                        updateMsg.setPlatform(messages.getPlatform());
                        updateMsg.setWhen(messages.getWhen());
                        updateMsg.setIsFailure(messages.getIsFailure());
                        updateMsg.setIsDelete(messages.getIsDelete());
                        OtherHeadPicService otherHeadPicService = OtherHeadPicService.getInstance(UIUtils.getContext());
                        List<Otherpichead> otherpicheadList = otherHeadPicService.queryData("where id =?", map.getSenderid());
                        if (otherpicheadList.size() == 0) {
                          updateMsg.setImgSrc("1");
//                  ToastUtil.showSafeToast(messages.getImgSrc()+"原始");
                        } else {
                          updateMsg.setImgSrc(otherpicheadList.get(0).getPicurl());
//                  ToastUtil.showSafeToast(messages.getImgSrc()+"更改后");
//                                    ToastUtil.showSafeToast("jiehsoupic" + otherpicheadList.get(0).getPicurl());
                        }
                        updateMsg.setUsername(messages.getUsername());
                        updateMsg.setSenderid(messages.getSenderid());
                        updateMsg.setIsread(messages.getIsread());
                        updateMsg.setIsSuccess(messages.getIsSuccess());
                        updateMsg.setDaytype("0");
                        map.setDaytype("0");
                        updateMsg.setIstime(messages.getIstime());
                        messagesService.saveObj(updateMsg);
                      }
                    }
                  }
                }


                /**
                 * 接收消息时做的间隔判断
                 */
//							if(map.getWhen()>stmill && map.getWhen() <etmill){}      //存消息
                messages = new Messages();
                String id = UUID.randomUUID().toString();
                messages.set_id(id);
                map.set_id(id);
                messages.setSessionid(map.getSessionid());
                messages.setType(map.getType());
                messages.setFrom(map.getFrom());
                messages.setMessage(map.getMessage());
//							ToastUtil.showSafeToast("单聊" + map.get_id());
                messages.setMessagetype(map.getMessagetype());
                messages.setIsFailure(map.getIsFailure());
                messages.setIsDelete(map.getIsDelete());
                messages.setUsername(map.getUsername());
                messages.setSenderid(map.getSenderid());
                OtherHeadPicService otherHeadPicService = OtherHeadPicService.getInstance(UIUtils.getContext());
                List<Otherpichead> otherpicheadList = otherHeadPicService.queryData("where id =?", map.getSenderid());
                if (otherpicheadList.size() == 0) {
                  messages.setImgSrc("1");
//                  ToastUtil.showSafeToast(messages.getImgSrc()+"原始");
                } else {
                  messages.setImgSrc(otherpicheadList.get(0).getPicurl());
//                  ToastUtil.showSafeToast(messages.getImgSrc()+"更改后");
//                                    ToastUtil.showSafeToast("jiehsoupic" + otherpicheadList.get(0).getPicurl());
                }
                map.setSenderid(map.getSenderid());
                messages.setPlatform(map.getPlatform());
                messages.setWhen(map.getWhen());
                messages.setIsread("0");
                map.setIsread("0");
                messages.setIsSuccess("true");
                map.setIsSuccess("true");
                messages.setDaytype((map.getWhen() > stmill && map.getWhen() < etmill) ? "1" : "0");
                map.setDaytype((map.getWhen() > stmill && map.getWhen() < etmill) ? "1" : "0");
                if (messagesList != null && messagesList.size() > 0 && (map.getFrom() == "false") && (map.getWhen() - messagesList.get(messagesList.size() - 1).getWhen() > 900000) && (map.getWhen() - messagesList.get(messagesList.size() - 1).getWhen() < etmill)) {
                  messages.setIstime("true");
                  map.setIstime("true");
//								ToastUtil.showSafeToast("时间戳");
                } else {
//								ToastUtil.showSafeToast("时间不戳");
                  messages.setIstime("false");
                  map.setIstime("false");
                }
                //MessagesService messagesService=MessagesService.getInstance(UIUtils.getContext());
                messagesService.saveObj(messages);
//							messages.set_id(UUID.randomUUID().toString());
//							messages.setSessionid(map.getSessionid());
//							messages.setType(map.getType());
//							messages.setFrom(map.getFrom());
//							messages.setMessage(map.getMessage());
//							System.out.println("群事件" + map.getMessage());
//							messages.setMessagetype(map.getMessagetype());
//							messages.setPlatform(map.getPlatform());
//							messages.setWhen(map.getWhen());
//							messages.setIsFailure(map.getIsFailure());
//							messages.setIsDelete(map.getIsDelete());
//							messages.setImgSrc(map.getImgSrc());
//							messages.setUsername(map.getUsername());
//							messages.setSenderid(map.get_id());
//							messages.setIsread("0");
//							messages.setIsSuccess("true");
////						MessagesService messagesService=MessagesService.getInstance(UIUtils.getContext());
//							messagesService.saveObj(messages);
                //统计未读数量
                messagesList = messagesService.queryData("where sessionid =?", map.getSessionid());
                for (int i = 0; i < messagesList.size(); i++) {
                  messages = messagesList.get(i);
                  if ("0".equals(messages.getIsread())) {
                    count++;
                    System.out.println("sfss" + count);
                  }
                }
                Messages lastmessages = messagesList.get(messagesList.size() - 1);
                Log.i("最后一条消息的对话名称", lastmessages.getUsername());
                //将对话最后一条入库到chat表
                /**
                 * 1.先从数据库查询是否存在当前会话列表
                 * 2.如果没有该会话，创建会话
                 * 3.如果有该会话，则保存最后一条消息到chat表
                 */
                ChatListService chatListService = ChatListService.getInstance(UIUtils.getContext());
                List<ChatList> chatLists = chatListService.queryData("where id =?", lastmessages.getSessionid());
                ChatList chatList = new ChatList();
                chatList.setImgSrc(lastmessages.getImgSrc());//从数据库里取最后一条消息的头像
                if ("Image".equals(lastmessages.getMessagetype())) {
                  // alert("返回即时通");
                  chatList.setLastText("[图片]");//从数据库里取最后一条消息
                  chatList.setMessagetype("Image");
                } else if ("LOCATION".equals(lastmessages.getMessagetype())) {
                  chatList.setLastText("[位置]");//从数据库里取最后一条消息
                  chatList.setMessagetype("LOCATION");
//                                    System.out.println("消息类型weizhi");
                } else if ("File".equals(lastmessages.getMessagetype())) {
                  chatList.setLastText("[文件]");//从数据库里取最后一条消息
                  chatList.setMessagetype("File");
                } else if ("Audio".equals(lastmessages.getMessagetype())) {
                  chatList.setLastText("[语音]");//从数据库里取最后一条消息
                  chatList.setMessagetype("Audio");
                } else if ("Vedio".equals(lastmessages.getMessagetype())) {
                  chatList.setLastText("[小视频]");//从数据库里取最后一条消息
                  chatList.setMessagetype("Vedio");
                } else {
                  chatList.setLastText(lastmessages.getMessage());//从数据库里取最后一条消息
                  chatList.setMessagetype("Text");
                }
                chatList.setCount(count + "");//将统计的count未读数量存进去
                chatList.setLastDate(lastmessages.getWhen());//从数据库里取最后一条消息对应的时间
                chatList.setSenderId(lastmessages.getSenderid());//从数据库里取最后一条消息对应发送者id
                chatList.setSenderName(lastmessages.getUsername());//从数据库里取最后一条消息发送者名字
                if (chatLists.size() > 0) {
                  chatList.setId(chatLists.get(0).getId());
                  if ("ChildJSBean".equals(lastmessages.getType())) {
                    chatList.setChatName(chatLists.get(0).getChatName());
                    Log.i("you对话创建对话后台====", chatLists.get(0).getChatName());
                  } else if ("Group".equals(lastmessages.getType()) || "Dept".equals(lastmessages.getType())) {
                    GroupChatsService groupChatsSer = GroupChatsService.getInstance(UIUtils.getContext());
                    List<GroupChats> groupChatsList = groupChatsSer.queryData("where id =?", lastmessages.getSessionid());
                    chatList.setChatName(groupChatsList.get(0).getGroupName());
                  }
                  chatList.setIsDelete(chatLists.get(0).getIsDelete());
                  chatList.setChatType(chatLists.get(0).getChatType());
                  chatList.setDaytype(chatLists.get(0).getDaytype());
                  chatList.setIsSuccess(chatLists.get(0).getIsSuccess());
                  chatList.setIsFailure(chatLists.get(0).getIsFailure());
                  chatList.setIsRead("0");
                } else {
                  chatList.setId(lastmessages.getSessionid());
                  if ("ChildJSBean".equals(lastmessages.getType())) {
                    Log.i("无对话创建对话后台====", lastmessages.getUsername());
                    chatList.setChatName(lastmessages.getUsername());
                  } else if ("Group".equals(lastmessages.getType()) || "Dept".equals(lastmessages.getType())) {
                    GroupChatsService groupChatsSer = GroupChatsService.getInstance(UIUtils.getContext());
                    List<GroupChats> groupChatsList = groupChatsSer.queryData("where id =?", lastmessages.getSessionid());
                    try {
                      JSONObject userInfo = getUserInfo();
                    } catch (JSONException e) {
                      e.printStackTrace();
                    }
                    chatList.setChatName(groupChatsList.get(0).getGroupName());
                  }
                  chatList.setIsDelete(lastmessages.getIsDelete());
                  chatList.setChatType(lastmessages.getType());
                  chatList.setDaytype(lastmessages.getDaytype());
                  chatList.setIsSuccess(lastmessages.getIsSuccess());
                  chatList.setIsFailure(lastmessages.getIsFailure());
                  chatList.setIsRead(lastmessages.getIsread());
                }
                chatListService.saveObj(chatList);//保存chatlist对象
              } catch (ParseException e) {
                e.printStackTrace();
              }

            }

            Intent intent = new Intent();
            intent.setAction(ReceiverParams.MESSAGEARRIVED);
            intent.putExtra("topic", topic);
            String json = GsonUtils.toJson(map, MessageBean.class);
            System.out.println("完整的数据格式" + json);
            intent.putExtra("content", json);
            intent.putExtra("qos", msg.getQos());
            msg.clearPayload();
            context.sendBroadcast(intent);
          }
        });
      } else if (bean != null && bean instanceof EventMessageBean) {
        EventMessageBean eventMsgBean = (EventMessageBean) bean;
        boolean isKUF = "KUF".equals(eventMsgBean.getEventCode());
        String groupID = eventMsgBean.getGroupID();
        if (!isKUF) {
          //接收到消息时的铃声
          ring();
          MqttNotification.showNotify("qunzuxiaoxi", R.drawable.ic_launcher, "群组消息", getMessage(eventMsgBean.getEventCode()),"", new Intent(context, MainActivity.class));
        } else if (eventMsgBean.getMepID().equals(UIUtils.getDeviceId())) {
          MqttRobot.setConnectionType(ConnectionType.MODE_CONNECTION_DOWN_MANUAL);
          MqttNotification.showNotify("qiangzhituichu", R.drawable.ic_launcher, "提示", "您已被强制下线！","", new Intent(context, MainActivity.class));
        } else {
          return;
        }
        MessageBean eventBean = new MessageBean();
        eventBean.set_id(groupID);
        eventBean.setSessionid(groupID);
        eventBean.setUsername(eventMsgBean.getUserName() == null ? "" : eventMsgBean.getUserName());
        eventBean.setWhen(eventMsgBean.getWhen());
        eventBean.setImgSrc("");
        eventBean.setFrom("");
        eventBean.setIsFailure("false");
        eventBean.setMessage(getMessage(eventMsgBean.getEventCode()));
        eventBean.setMessagetype("Event_" + eventMsgBean.getEventCode());
        eventBean.setPlatform("Android");
        eventBean.setType("Group");
        eventBean.setIsDelete("false");
        eventBean.setSenderid(eventMsgBean.getSenderid());

        if (isKUF) {
          MqttRobot.setConnectionType(ConnectionType.MODE_CONNECTION_DOWN_MANUAL);
          /*Intent intent = new Intent();
          intent.setAction(ReceiverParams.MESSAGEARRIVED);
          intent.putExtra("topic", topic);
          String json = GsonUtils.toJson(eventBean, MessageBean.class);
          intent.putExtra("content", json);
          intent.putExtra("qos", msg.getQos());
          msg.clearPayload();
          context.sendBroadcast(intent);*/
          //退出登录
          SwitchLocal.exitLogin(context);
          return;
        }

//			ToastUtil.showSafeToast("群事件" + eventMsgBean.getEventCode() + eventMsgBean.getGroupID() + eventMsgBean.getGroupName());
        //如果是被添加群成员，数据需要入库
        if ("YAM".equals(eventMsgBean.getEventCode())) {
          GroupChatsService groupChatsService2 = GroupChatsService.getInstance(UIUtils.getContext());
          List<GroupChats> groupChatsList = groupChatsService2.queryData("where id =?", groupID);
          String groupName = null;
          if (groupChatsList != null && groupChatsList.size() > 0) {
            groupName = groupChatsList.get(0).getGroupName();
          }

          GroupChatsService groupChatsService = GroupChatsService.getInstance(UIUtils.getContext());
          GroupChats groupChats = new GroupChats();
          groupChats.setId(eventMsgBean.getGroupID());
          groupChats.setGroupName(groupName == null ? (eventMsgBean.getGroupName() == null ? "无群组名称" : eventMsgBean.getGroupName()) : groupName);
          groupChats.setGroupType("Group");
          groupChats.setIsmygroup(false);
          groupChatsService.saveObj(groupChats);
        } else if ("GN0".equals(eventMsgBean.getEventCode())) {
          GroupChatsService groupChatsService = GroupChatsService.getInstance(UIUtils.getContext());
          List<GroupChats> groupChatsList = groupChatsService.queryData("where id =?", eventMsgBean.getGroupID());
          GroupChats lastGroupChat = groupChatsList.get(0);
          GroupChats groupChatsObj = new GroupChats();
          groupChatsObj.setId(lastGroupChat.getId());
          groupChatsObj.setIsmygroup(lastGroupChat.getIsmygroup());
          groupChatsObj.setGroupType(lastGroupChat.getGroupType());
          groupChatsObj.setGroupName(eventMsgBean.getGroupName());
          groupChatsService.saveObj(groupChatsObj);
        }

        //处理特殊业务（例如：注销topic，注册topic等）
        doDelTopic(groupID, eventMsgBean.getEventCode());
        //入库(MESSAGE和CHATLIST表)
        //消息转化完毕就入库
        int count = 0;
        Calendar c = Calendar.getInstance();//可以对每个时间域单独修改
        String year = c.get(Calendar.YEAR) + "";
        String month = c.get(Calendar.MONTH) + 1 + "";
        String day = c.get(Calendar.DAY_OF_MONTH) + "";
        String hour = c.get(Calendar.HOUR_OF_DAY) + "";
        String minute = c.get(Calendar.MINUTE) + "";
        String second = c.get(Calendar.SECOND) + "";
        //System.out.println(year + "/" + getMonthOrDay(month) + "/" + day + " " + hour + ":" + minute + ":" + second);
        String start = year + getMonthOrDay(month) + getMonthOrDay(day) + "000000";
        String end = year + getMonthOrDay(month) + getMonthOrDay(day) + "235959";
        DateFormat formatter = new SimpleDateFormat("yyyyMMddhhmmss");

        long stmill = formatter.parse(start).getTime();
        long etmill = formatter.parse(end).getTime();
        System.out.println("群聊时间：" + stmill + "/" + etmill);
        /**
         * 根据sessionid取出该对话的聊天列表
         */
        MessagesService messagesService = MessagesService.getInstance(UIUtils.getContext());
        List<Messages> messagesList = messagesService.queryData("where sessionid =?", eventBean.getSessionid());
        Messages messages = new Messages();
        if (messagesList.size() > 0) {
          //取出数组最后一条数据跟今天的毫秒进行比对，若比今天的最低毫秒数低的话，则将messagetype为TIME的数据的daytype置为"0"
          if (messagesList.get(messagesList.size() - 1).getWhen() < stmill) {
            for (int i = 0; i < messagesList.size(); i++) {
              messages = messagesList.get(i);
              if (messages.getIstime().equals("true")) {
                Messages updateMsg = new Messages();
                updateMsg.set_id(messages.get_id());
                updateMsg.setSessionid(messages.getSessionid());
                updateMsg.setType(messages.getType());
                updateMsg.setFrom("");
                updateMsg.setMessage(messages.getMessage());
//						System.out.println("群事件" + messages.getMessage());
                updateMsg.setMessagetype(messages.getMessagetype());
                updateMsg.setPlatform(messages.getPlatform());
                updateMsg.setWhen(messages.getWhen());
                updateMsg.setIsFailure(messages.getIsFailure());
                updateMsg.setIsDelete(messages.getIsDelete());
                OtherHeadPicService otherHeadPicService = OtherHeadPicService.getInstance(UIUtils.getContext());
                List<Otherpichead> otherpicheadList = otherHeadPicService.queryData("where id =?", eventBean.getSenderid());
                if (otherpicheadList.size() == 0) {
                  updateMsg.setImgSrc("1");
//                  ToastUtil.showSafeToast(messages.getImgSrc()+"原始");
                } else {
                  updateMsg.setImgSrc(otherpicheadList.get(0).getPicurl());
//                  ToastUtil.showSafeToast(messages.getImgSrc()+"更改后");
//                                    ToastUtil.showSafeToast("jiehsoupic" + otherpicheadList.get(0).getPicurl());
                }
                updateMsg.setUsername(messages.getUsername());
                updateMsg.setSenderid(messages.getSenderid());
                eventBean.setSenderid(messages.getSenderid());
                updateMsg.setIsread(messages.getIsread());
                eventBean.setIsread(messages.getIsread());
                updateMsg.setIsSuccess(messages.getIsSuccess());
                eventBean.setIsSuccess(messages.getIsSuccess());
                updateMsg.setDaytype("0");
                eventBean.setDaytype("0");
                updateMsg.setIstime(messages.getIstime());
                eventBean.setIstime(messages.getIstime());
                messagesService.saveObj(updateMsg);
//						System.out.println("修改昨天消息的状态保存成功");
              }
            }
          }
        }

        //若是当前日期收到的群消息，存消息
//			if(eventBean.getWhen()>stmill && eventBean.getWhen() <etmill){
        messages = new Messages();
        String id = UUID.randomUUID().toString();
        messages.set_id(id);
        eventBean.set_id(id);
        messages.setSessionid(eventBean.getSessionid());
        messages.setType(eventBean.getType());
        messages.setFrom("");
        messages.setMessage(eventBean.getMessage());
//				ToastUtil.showSafeToast("qun聊" + eventBean.getMessage());
        messages.setMessagetype(eventBean.getMessagetype());
        messages.setPlatform(eventBean.getPlatform());
        messages.setWhen(eventBean.getWhen());
        messages.setIsFailure(eventBean.getIsFailure());
        messages.setIsDelete(eventBean.getIsDelete());
        OtherHeadPicService otherHeadPicService = OtherHeadPicService.getInstance(UIUtils.getContext());
        List<Otherpichead> otherpicheadList = otherHeadPicService.queryData("where id =?", eventBean.getSenderid());
        if (otherpicheadList.size() == 0) {
          messages.setImgSrc("1");
//                  ToastUtil.showSafeToast(messages.getImgSrc()+"原始");
        } else {
          messages.setImgSrc(otherpicheadList.get(0).getPicurl());
//                  ToastUtil.showSafeToast(messages.getImgSrc()+"更改后");
//                                    ToastUtil.showSafeToast("jiehsoupic" + otherpicheadList.get(0).getPicurl());
        }
        messages.setUsername(eventBean.getUsername());
        messages.setSenderid(eventBean.getSenderid());
//				ToastUtil.showSafeToast("qun聊senderid" + eventBean.getSenderid());
        messages.setIsread("0");
        eventBean.setIsread("0");
        messages.setIsSuccess("true");
        eventBean.setIsSuccess("true");
        messages.setDaytype((eventBean.getWhen() > stmill && eventBean.getWhen() < etmill) ? "1" : "0");
        eventBean.setDaytype((eventBean.getWhen() > stmill && eventBean.getWhen() < etmill) ? "1" : "0");
        if (messagesList != null && messagesList.size() > 0 && (eventBean.getWhen() - messagesList.get(messagesList.size() - 1).getWhen() > 900000) && (eventBean.getWhen() - messagesList.get(messagesList.size() - 1).getWhen() < 3600000)) {
          messages.setIstime("true");//设置标志位
          eventBean.setIstime("true");
//					ToastUtil.showSafeToast("时间戳");
        } else {
//					ToastUtil.showSafeToast("时间不戳");
          messages.setIstime("false");//设置标志位
          eventBean.setIstime("false");
        }
        messagesService.saveObj(messages);
//			}
        //统计未读数量
        messagesList = messagesService.queryData("where sessionid =?", eventBean.getSessionid());
        for (int i = 0; i < messagesList.size(); i++) {
          messages = messagesList.get(i);
          if ("0".equals(messages.getIsread())) {
            count++;
          }
        }
        Messages lastmessages = messagesList.get(messagesList.size() - 1);
        //将对话最后一条入库到chat表
        /**
         * 1.先从数据库查询是否存在当前会话列表
         * 2.如果没有该会话，创建会话
         * 3.如果有该会话，则保存最后一条消息到chat表
         */
        ChatListService chatListService = ChatListService.getInstance(UIUtils.getContext());
        List<ChatList> chatLists = chatListService.queryData("where id =?", lastmessages.getSessionid());
        ChatList chatList = new ChatList();
        chatList.setImgSrc(lastmessages.getImgSrc());//从数据库里取最后一条消息的头像
        System.out.println("消息类型" + lastmessages.getType());
        if ("Image".equals(lastmessages.getMessagetype())) {
          // alert("返回即时通");
          chatList.setLastText("[图片]");//从数据库里取最后一条消息
          chatList.setMessagetype("Image");
//                    System.out.println("是不是图片");
        } else if ("LOCATION".equals(lastmessages.getMessagetype())) {
          chatList.setLastText("[位置]");//从数据库里取最后一条消息
          chatList.setMessagetype("LOCATION");
        } else if ("File".equals(lastmessages.getMessagetype())) {
          chatList.setLastText("[文件]");//从数据库里取最后一条消息
          chatList.setMessagetype("File");
        } else if ("Audio".equals(lastmessages.getMessagetype())) {
          chatList.setLastText("[语音]");//从数据库里取最后一条消息
          chatList.setMessagetype("Audio");
        } else if ("Vedio".equals(lastmessages.getMessagetype())) {
          chatList.setLastText("[小视频]");//从数据库里取最后一条消息
          chatList.setMessagetype("Vedio");
        } else {
          chatList.setLastText(lastmessages.getMessage());//从数据库里取最后一条消息
          chatList.setMessagetype("Text");
        }
        chatList.setCount(count + "");//将统计的count未读数量存进去
        chatList.setLastDate(lastmessages.getWhen());//从数据库里取最后一条消息对应的时间
        chatList.setSenderId(lastmessages.getSenderid());//从数据库里取最后一条消息对应发送者id
        chatList.setSenderName(lastmessages.getUsername());//从数据库里取最后一条消息发送者名字
        if (chatLists.size() > 0) {
          chatList.setId(chatLists.get(0).getId());
          if ("ChildJSBean".equals(lastmessages.getType())) {
            chatList.setChatName(chatLists.get(0).getChatName());
          } else if ("Group".equals(lastmessages.getType()) || "Dept".equals(lastmessages.getType())) {
            GroupChatsService groupChatsSer = GroupChatsService.getInstance(UIUtils.getContext());
            List<GroupChats> groupChatsList = groupChatsSer.queryData("where id =?", lastmessages.getSessionid());
            chatList.setChatName(groupChatsList.get(0).getGroupName());
          }
          chatList.setIsDelete(chatLists.get(0).getIsDelete());
          chatList.setChatType(chatLists.get(0).getChatType());
          chatList.setDaytype(chatLists.get(0).getDaytype());
          chatList.setIsSuccess(chatLists.get(0).getIsSuccess());
          chatList.setIsFailure(chatLists.get(0).getIsFailure());
          chatList.setIsRead("0");
        } else {
          chatList.setId(lastmessages.getSessionid());
          if ("ChildJSBean".equals(lastmessages.getType())) {
            chatList.setChatName(lastmessages.getUsername());
          } else if ("Group".equals(lastmessages.getType()) || "Dept".equals(lastmessages.getType())) {
            GroupChatsService groupChatsSer = GroupChatsService.getInstance(UIUtils.getContext());
            List<GroupChats> groupChatsList = groupChatsSer.queryData("where id =?", lastmessages.getSessionid());
            chatList.setChatName(groupChatsList.get(0).getGroupName());
          }
          chatList.setIsDelete(lastmessages.getIsDelete());
          chatList.setChatType(lastmessages.getType());
          chatList.setDaytype(lastmessages.getDaytype());
          chatList.setIsSuccess(lastmessages.getIsSuccess());
          chatList.setIsFailure(lastmessages.getIsFailure());
          chatList.setIsRead(lastmessages.getIsread());
        }
        chatListService.saveObj(chatList);//保存chatlist对象

        Intent intent = new Intent();
        intent.setAction(ReceiverParams.MESSAGEARRIVED);
        intent.putExtra("topic", topic);
        String json = GsonUtils.toJson(eventBean, MessageBean.class);
        intent.putExtra("content", json);
        intent.putExtra("qos", msg.getQos());
        msg.clearPayload();
        context.sendBroadcast(intent);
//                ToastUtil.showSafeToast("name"+eventMsgBean.getGroupName());
        //如果是被添加为群成员，应该去服务器获取群组消息
        if ("YAM".equals(eventMsgBean.getEventCode())) {

          ThriftApiClient.getLatestMsg(eventMsgBean.getGroupID(), eventMsgBean.getWhen(), eventMsgBean.getGroupName());
        }

      }
    } catch (Exception e) {
    }
    new Thread(new Runnable() {
      @Override
      public void run() {
        try {
          Thread.sleep(50);
        } catch (InterruptedException e) {
          e.printStackTrace();
        }
      }
    }).start();
  }

  /**
   * 根据日期修正数据（若大于9，则返回monthOrDay；否则，返回("0"+monthOrDay)）
   * @param monthOrDay
   * @return
     */
  private String getMonthOrDay(String monthOrDay) {
    if (monthOrDay == null || TextUtils.isEmpty(monthOrDay)) {
      return "01";
    }
    try {
      return Integer.parseInt(monthOrDay) > 9 ? monthOrDay : ("0" + monthOrDay);
    } catch (Exception e) {
      return "01";
    }
  }

  public JSONObject getUserInfo() throws JSONException {
    String login_info = SPUtils.getString("login_info", "");
    return new JSONObject(login_info);
  }

  /**
   * 根据事件类型设置消息内容
   *
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
      message = "群组名称修改";
    } else if ("G00".equals(eventCode)) {//群组信息增、改
      message = "群公告变更";
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
   *
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

  private long start = 0;

  private void ring() {
    //************* 判断是否需要响铃 START *************
    RingStatus ringStaus = RingStatus.NO_RING;
    if (start == 0) {
      start = System.currentTimeMillis();
      ringStaus = RingStatus.RING;
    }
    ringStaus = (ringStaus == RingStatus.RING ? ringStaus :
      ((System.currentTimeMillis() - start > 100) ? RingStatus.RING :
        RingStatus.NO_RING));
    //************* 判断是否需要响铃 END *************
    if (ringStaus != RingStatus.NO_RING) {
      MediaPlayer mp = new MediaPlayer();
      try {

        mp.setDataSource(context, RingtoneManager
          .getDefaultUri(RingtoneManager.TYPE_NOTIFICATION));
        mp.prepare();
        mp.start();
      } catch (Exception e) {
        e.printStackTrace();
      }
      start = System.currentTimeMillis();
    }
  }


  /**
   * 响铃状态
   */
  private enum RingStatus {
    RING/**需要响铃*/
    , NO_RING/**不需要响铃*/
  }
}
