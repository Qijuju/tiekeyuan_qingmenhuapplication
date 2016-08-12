package com.tky.mqtt.paho;

import android.content.Intent;

import com.tky.mqtt.paho.bean.MessageBean;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;
import java.util.UUID;

import im.mqtt.notify.factory.IMMsgFactory;
import im.protocol.model.IMPException;

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

	public static byte[] packData(String content) throws JSONException, IMPException {
		JSONObject obj = new JSONObject(content);
		if (obj == null) {
			return null;
		}
		return IMMsgFactory.createMsg(getMsgType(obj.getString("type")), getMediaType("Text"), IMMsgFactory.PlatType.Android, IMMsgFactory.Receipt.False, Long.parseLong(obj.getString("when")), obj.getString("sessionid"), getUserID(), obj.getString("message"));
	}

	/**
	 * 将别人发过来的消息转成本地需要的数据
	 * @param msg
	 * @return
	 * @throws IMPException
	 * @throws JSONException
	 */
	public static MessageBean unpackData(byte[] msg) throws IMPException, JSONException {
		Map<String, Object> msgMap = IMMsgFactory.createMsg(msg);
		MessageBean bean = new MessageBean();
		bean.set_id(UUID.randomUUID().toString().toUpperCase());
		bean.setSessionid((String) msgMap.get("to"));
		bean.setAccount(getUserID());
		bean.setType(getMsgTypeStr((IMMsgFactory.MsgType) msgMap.get("type")));
		bean.setFrom("false");
		bean.setMessage((String) msgMap.get("message"));
		bean.setMessagetype(getMediaTypeStr((IMMsgFactory.MediaType) msgMap.get("mediaType")));
		bean.setPlatform(getPlatTypeStr((IMMsgFactory.PlatType) msgMap.get("platform")));
		bean.setWhen((Long) msgMap.get("when"));
		bean.setIsFailure("false");
		bean.setSinglecount("");
		bean.setQunliaocount("");
		bean.setIsDelete("");
		bean.setImgSrc("");
		return bean;
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
		} else if ("Group".equals(IMMsgFactory.MsgType.Group)) {
			msgType = IMMsgFactory.MsgType.Group;
		} else if ("Dept".equals(IMMsgFactory.MsgType.Dept)) {
			msgType = IMMsgFactory.MsgType.Dept;
		} else if ("Radio".equals(IMMsgFactory.MsgType.Radio)) {
			msgType = IMMsgFactory.MsgType.Radio;
		} else if ("Receipt".equals(IMMsgFactory.MsgType.Receipt)) {
			msgType = IMMsgFactory.MsgType.Receipt;
		} else if ("System".equals(IMMsgFactory.MsgType.System)) {
			msgType = IMMsgFactory.MsgType.System;
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
		} else if (IMMsgFactory.MsgType.Group.equals(IMMsgFactory.MsgType.Group)) {
			msgType = "Group";
		} else if (IMMsgFactory.MsgType.Dept.equals(IMMsgFactory.MsgType.Dept)) {
			msgType = "Dept";
		} else if (IMMsgFactory.MsgType.Radio.equals(IMMsgFactory.MsgType.Radio)) {
			msgType = "Radio";
		} else if (IMMsgFactory.MsgType.Receipt.equals(IMMsgFactory.MsgType.Receipt)) {
			msgType = "Receipt";
		} else if (IMMsgFactory.MsgType.System.equals(IMMsgFactory.MsgType.System)) {
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
		} else if ("Text".equals(type)) {
			mediaType = IMMsgFactory.MediaType.Text;
		} else if ("Vedio".equals(type)) {
			mediaType = IMMsgFactory.MediaType.Vedio;
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
