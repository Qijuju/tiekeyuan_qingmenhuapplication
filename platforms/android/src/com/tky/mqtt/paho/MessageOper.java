package com.tky.mqtt.paho;

import android.content.Intent;

import com.tky.mqtt.paho.bean.EventMessageBean;
import com.tky.mqtt.paho.bean.MessageBean;
import com.tky.mqtt.paho.bean.MessageTypeBean;
import com.tky.protocol.factory.IMMsgFactory;
import com.tky.protocol.model.IMPException;
import com.tky.protocol.model.IMPFields;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class MessageOper {
	/**
	 * 发消息
	 * @param topic
	 * @param content
	 */
	public static void sendMsg(String topic, String content) throws JSONException, IMPException {
		Intent intent = new Intent();
		intent.setAction(ReceiverParams.SENDMESSAGE);
		intent.putExtra("topic", topic);
		intent.putExtra("content", content);
		UIUtils.getContext().sendBroadcast(intent);
	}

	/**
	 * 封包（将要发送的数据封装到byte数组中）
	 * @param content
	 * @return
	 * @throws JSONException
	 * @throws IMPException
	 */
	public static byte[] packData(String content) throws JSONException, IMPException {
		JSONObject obj = new JSONObject(content);
		if (obj == null) {
			return null;
		}
		String type = obj.getString("type");
		return IMMsgFactory.createMsg(getMsgType(obj.getString("type")), getMediaType(obj.getString("messagetype")), IMMsgFactory.PlatType.Android, IMMsgFactory.Receipt.False, obj.getLong("when"), obj.getString("sessionid"), getUserID(), obj.getString("message"), obj.getString("username"));
	}

	/**
	 * 将别人发过来的消息转成本地需要的数据
	 * @param msg
	 * @return
	 * @throws IMPException
	 * @throws JSONException
	 */
	public static MessageTypeBean unpack(byte[] msg) throws IMPException, JSONException {
		Map<String, Object> msgMap = IMMsgFactory.createNotify(msg);
		Object notifyType = msgMap.get(IMPFields.NotifyType);
		MessageTypeBean msgBean = null;
		if(notifyType != null && notifyType.equals(IMPFields.N_Type_Msg)){
			MessageBean bean = new MessageBean();
			bean.set_id((String) msgMap.get("from"));
			bean.setSessionid("User".equals(getMsgTypeStr((IMMsgFactory.MsgType) msgMap.get("type"))) ? (String) msgMap.get("from") : (String) msgMap.get("to"));
			;
			bean.setType(getMsgTypeStr((IMMsgFactory.MsgType) msgMap.get("type")));
			bean.setFrom("false");
			bean.setMessage((String) msgMap.get("message"));
			bean.setMessagetype(getMediaTypeStr((IMMsgFactory.MediaType) msgMap.get("mediaType")));
			bean.setPlatform(getPlatTypeStr((IMMsgFactory.PlatType) msgMap.get("platform")));
			bean.setWhen((Long) msgMap.get("when"));
			bean.setIsFailure("false");
			bean.setIsDelete("");
			bean.setImgSrc("");
			bean.setUsername((String) msgMap.get("fromName"));
			msgBean = bean;
		} else if (notifyType != null && notifyType.equals(IMPFields.N_Type_Event)) {
			EventMessageBean bean = new EventMessageBean();
			bean.setNotifyType(IMPFields.N_Type_Event);
			bean.setEventCode((String) msgMap.get(IMPFields.EventCode));
			bean.setWhen((Long) msgMap.get(IMPFields.Eventwhen));
			bean.setGroupID((String) msgMap.get(IMPFields.E_GroupID));
			bean.setUserName((String) msgMap.get(IMPFields.E_UserName));
			bean.setGroupName((String) msgMap.get(IMPFields.E_GroupName));
			msgBean = bean;
		}
		return msgBean;
	}

	/**
	 * 消息类型转换
	 * @param type
	 * @return
	 */
	private static IMMsgFactory.MsgType getMsgType(String type) {
		IMMsgFactory.MsgType msgType = IMMsgFactory.MsgType.User;
		if ("User".equals(type)) {
			msgType = IMMsgFactory.MsgType.User;
		} else if ("Group".equals(type)) {
			msgType = IMMsgFactory.MsgType.Group;
		} else if ("Dept".equals(type)) {
			msgType = IMMsgFactory.MsgType.Dept;
		} else if ("Radio".equals(type)) {
			msgType = IMMsgFactory.MsgType.Radio;
		} else if ("Receipt".equals(type)) {
			msgType = IMMsgFactory.MsgType.Receipt;
		} else if ("System".equals(type)) {
			msgType = IMMsgFactory.MsgType.System;
		} else {
			msgType = IMMsgFactory.MsgType.User;
		}
		return msgType;
	}

	/**
	 * 消息类型转换
	 * @param type
	 * @return
	 */
	private static String getMsgTypeStr(IMMsgFactory.MsgType type) {
		String msgType = "User";
		if (IMMsgFactory.MsgType.User.equals(type)) {
			msgType = "User";
		} else if (IMMsgFactory.MsgType.Group.equals(type)) {
			msgType = "Group";
		} else if (IMMsgFactory.MsgType.Dept.equals(type)) {
			msgType = "Dept";
		} else if (IMMsgFactory.MsgType.Radio.equals(type)) {
			msgType = "Radio";
		} else if (IMMsgFactory.MsgType.Receipt.equals(type)) {
			msgType = "Receipt";
		} else if (IMMsgFactory.MsgType.System.equals(type)) {
			msgType = "System";
		}
		return msgType;
	}

	/**
	 * 获取消息媒体类型
	 * @param type
	 * @return
	 */
	private static IMMsgFactory.MediaType getMediaType(String type) {
		IMMsgFactory.MediaType mediaType = IMMsgFactory.MediaType.Audio;
		if ("Audio".equals(type)) {
			mediaType = IMMsgFactory.MediaType.Audio;
		} else if ("Emote".equals(type)) {
			mediaType = IMMsgFactory.MediaType.Emote;
		} else if ("File".equals(type)) {
			mediaType = IMMsgFactory.MediaType.File;
		} else if ("Image".equals(type)) {
			mediaType = IMMsgFactory.MediaType.Image;
		} else if ("Shake".equals(type)) {
			mediaType = IMMsgFactory.MediaType.Shake;
		} else if ("Text".equals(type) || "normal".equals(type)) {
			mediaType = IMMsgFactory.MediaType.Text;
		} else if ("Vedio".equals(type)) {
			mediaType = IMMsgFactory.MediaType.Vedio;
		} else {
			mediaType = IMMsgFactory.MediaType.Text;
		}
		return mediaType;
	}

	/**
	 * 获取消息媒体类型
	 * @param type
	 * @return
	 */
	private static String getMediaTypeStr(IMMsgFactory.MediaType type) {
		String mediaType = "Audio";
		if (IMMsgFactory.MediaType.Audio.equals(type)) {
			mediaType = "Audio";
		} else if (IMMsgFactory.MediaType.Emote.equals(type)) {
			mediaType = "Emote";
		} else if (IMMsgFactory.MediaType.File.equals(type)) {
			mediaType = "File";
		} else if (IMMsgFactory.MediaType.Image.equals(type)) {
			mediaType = "Image";
		} else if (IMMsgFactory.MediaType.Shake.equals(type)) {
			mediaType = "Shake";
		} else if (IMMsgFactory.MediaType.Text.equals(type)) {
			mediaType = "Text";
		} else if (IMMsgFactory.MediaType.Vedio.equals(type)) {
			mediaType = "Vedio";
		}
		return mediaType;
	}

	/**
	 * 获取消息发送平台
	 * @param type
	 * @return
	 */
	public static String getPlatTypeStr(IMMsgFactory.PlatType type) {
		String platType = "Android";
		if (IMMsgFactory.PlatType.Android.equals(type)) {
			platType = "Android";
		} else if (IMMsgFactory.PlatType.Window.equals(type)) {
			platType = "Windows";
		}
		return platType;
	}

	/**
	 * 获取当前登录的用户ID
	 * @return
	 */
	private static String getUserID() throws JSONException {
		JSONObject userInfo = getUserInfo();
		return userInfo.getString("userID");
	}

	private static JSONObject getUserInfo() throws JSONException {
		String login_info = SPUtils.getString("login_info", "");
		return new JSONObject(login_info);
	}
}
