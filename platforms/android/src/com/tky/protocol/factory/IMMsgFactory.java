package com.tky.protocol.factory;

import com.tky.protocol.model.IMPException;
import com.tky.protocol.model.IMPFields;
import com.tky.protocol.model.ProtocolUtil;

import java.util.HashMap;
import java.util.Map;



public class IMMsgFactory {
	public enum MsgType{
		User,		//�û� U
		Group,		//Ⱥ�� G
		System,		//ϵͳ���� S
		Radio,		//�㲥��Ϣ R
		Receipt,	//��ִ��Ϣ C
		Dept,		//������Ϣ D
		Alarm,		//������Ϣ A
		Platform	//��ƽ̨��Ϣ P
	};
	public enum MediaType{
		Text,		//�ı� T
		Image,		//ͼƬ I
		File,		//�ļ� F
		Shake,		//���� S
		Emote,		//���� E
		Audio,		//���� A
		Vedio,		//���� V
		Position	//��λ P
	};
	public enum PlatType{
		Window,		//PC  W
		Android,	//�ƶ� A
		Ios			//�ƶ� I
	};
	public enum Receipt{
		True,		//��Ҫ��ִ
		False		//����Ҫ��ִ
	};
	public enum MsgLevel{
		Common,		//��ͨ 0
		Level_1,	//���� 1
		Level_2,	//���� 1
		Level_3,	//���� 1
	};
	public enum LinkType{
		NoLink,		//��Link
		Url,		//��ͨ����
		File		//��������
	};

	//��Ҫ��ӷ�������
	public static byte[] createMsg(MsgType msType, MediaType mdType, PlatType pfType,
			Receipt rp, long when, String to, String from, String msg, String fromName) throws IMPException {
		Map<String,Object> msgMap = new HashMap<String,Object>();
		msgMap.put(IMPFields.NotifyType,IMPFields.N_Type_Msg);
		msgMap.put(IMPFields.Msg_type, getMsgType(msType));
		msgMap.put(IMPFields.Msg_mediaType, getMediaType(mdType));
		msgMap.put(IMPFields.Msg_platform, getPlatformType(pfType));
		msgMap.put(IMPFields.Msg_receipt, getReceipt(rp));
		msgMap.put(IMPFields.Msg_when, System.currentTimeMillis());
		msgMap.put(IMPFields.Msg_to, to);
		msgMap.put(IMPFields.Msg_from, from);
		msgMap.put(IMPFields.Msg_message, msg);
		msgMap.put(IMPFields.Msg_fromName, fromName);

		return ProtocolUtil.doPackage(msgMap);
	}

	public static byte[] createMsg(MsgType msType, MediaType mdType, PlatType pfType,
			Receipt rp, long when, String to, String from, String msg) throws IMPException{

		Map<String,Object> msgMap = new HashMap<String,Object>();
		msgMap.put(IMPFields.NotifyType,IMPFields.N_Type_Msg);
		msgMap.put(IMPFields.Msg_type, getMsgType(msType));
		msgMap.put(IMPFields.Msg_mediaType, getMediaType(mdType));
		msgMap.put(IMPFields.Msg_platform, getPlatformType(pfType));
		msgMap.put(IMPFields.Msg_receipt, getReceipt(rp));
		msgMap.put(IMPFields.Msg_when, System.currentTimeMillis());
		msgMap.put(IMPFields.Msg_to, to);
		msgMap.put(IMPFields.Msg_from, from);
		msgMap.put(IMPFields.Msg_message, msg);

		return ProtocolUtil.doPackage(msgMap);
	}

	public static Map<String, Object> createMsg(byte[] msgData) throws IMPException{
//		ProtocolUtil.unPackage(msgData);
		Map<String,Object> msgMap = ProtocolUtil.unPackage(msgData);

		msgMap.put(IMPFields.NotifyType,IMPFields.N_Type_Msg);
		msgMap.put(IMPFields.Msg_type, getMsgType(msgMap.get(IMPFields.Msg_type).toString()));
		msgMap.put(IMPFields.Msg_mediaType, getMediaType(msgMap.get(IMPFields.Msg_mediaType).toString()));
		msgMap.put(IMPFields.Msg_platform, getPlatformType(msgMap.get(IMPFields.Msg_platform).toString()));
		msgMap.put(IMPFields.Msg_receipt, getReceipt(msgMap.get(IMPFields.Msg_receipt).toString()));
		msgMap.put(IMPFields.Msg_when, msgMap.get(IMPFields.Msg_when));
		msgMap.put(IMPFields.Msg_to, msgMap.get(IMPFields.Msg_to));
		msgMap.put(IMPFields.Msg_from, msgMap.get(IMPFields.Msg_from));
		msgMap.put(IMPFields.Msg_message, msgMap.get(IMPFields.Msg_message));
		msgMap.put(IMPFields.Msg_fromName, msgMap.get(IMPFields.Msg_fromName));
		if(msgMap.containsKey(IMPFields.Msg_msgLevel))
			msgMap.put(IMPFields.Msg_msgLevel, getMsgLevel(msgMap.get(IMPFields.Msg_msgLevel).toString()));
		if(msgMap.containsKey(IMPFields.Msg_title))
			msgMap.put(IMPFields.Msg_title, msgMap.get(IMPFields.Msg_title));
		if(msgMap.containsKey(IMPFields.Msg_linkType))
			msgMap.put(IMPFields.Msg_linkType, getLinkType(msgMap.get(IMPFields.Msg_linkType).toString()));
		if(msgMap.containsKey(IMPFields.Msg_link))
			msgMap.put(IMPFields.Msg_msgLevel, msgMap.get(IMPFields.Msg_msgLevel));
		if(msgMap.containsKey(IMPFields.Msg_levelName))
			msgMap.put(IMPFields.Msg_levelName, msgMap.get(IMPFields.Msg_levelName));
		return msgMap;
	}

	public static Map<String, Object> createEvent(byte[] msgData) throws IMPException{
		return ProtocolUtil.unPackage(msgData);
	}

	public static byte[] createEvent(String eventID, Map<String, Object> eventMap) throws IMPException{
		eventMap.put("NotifyType", IMPFields.N_Type_Event);
		eventMap.put("when", System.currentTimeMillis());
		eventMap.put("EventCode", eventID);
		eventMap.put("Event","");
		return ProtocolUtil.doPackage(eventMap);
	}

	public static Map<String, Object> createNotify(byte[] msgData) throws IMPException{
		Map<String,Object> msgMap = ProtocolUtil.unPackage(msgData);

		Object notifyType = msgMap.get(IMPFields.NotifyType);
		if(notifyType != null && notifyType.equals(IMPFields.N_Type_Msg)){
			msgMap.put(IMPFields.NotifyType,IMPFields.N_Type_Msg);
			msgMap.put(IMPFields.Msg_type, getMsgType(msgMap.get(IMPFields.Msg_type).toString()));
			msgMap.put(IMPFields.Msg_mediaType, getMediaType(msgMap.get(IMPFields.Msg_mediaType).toString()));
			msgMap.put(IMPFields.Msg_platform, getPlatformType(msgMap.get(IMPFields.Msg_platform).toString()));
			msgMap.put(IMPFields.Msg_receipt, getReceipt(msgMap.get(IMPFields.Msg_receipt).toString()));
			msgMap.put(IMPFields.Msg_when, msgMap.get(IMPFields.Msg_when));
			msgMap.put(IMPFields.Msg_to, msgMap.get(IMPFields.Msg_to));
			msgMap.put(IMPFields.Msg_from, msgMap.get(IMPFields.Msg_from));
			msgMap.put(IMPFields.Msg_message, msgMap.get(IMPFields.Msg_message));
			msgMap.put(IMPFields.Msg_fromName, msgMap.get(IMPFields.Msg_fromName));
			if(msgMap.containsKey(IMPFields.Msg_msgLevel))
				msgMap.put(IMPFields.Msg_msgLevel, getMsgLevel(msgMap.get(IMPFields.Msg_msgLevel).toString()));
			if(msgMap.containsKey(IMPFields.Msg_title))
				msgMap.put(IMPFields.Msg_title, msgMap.get(IMPFields.Msg_title));
			if(msgMap.containsKey(IMPFields.Msg_linkType))
				msgMap.put(IMPFields.Msg_linkType, getLinkType(msgMap.get(IMPFields.Msg_linkType).toString()));
			if(msgMap.containsKey(IMPFields.Msg_link))
				msgMap.put(IMPFields.Msg_msgLevel, msgMap.get(IMPFields.Msg_msgLevel));
			if(msgMap.containsKey(IMPFields.Msg_levelName))
				msgMap.put(IMPFields.Msg_levelName, msgMap.get(IMPFields.Msg_levelName));
		}
		return msgMap;
	}

	private static String getMsgType(MsgType msgType){
		String msgTypeStr = "";
		switch(msgType){
		case User:
			msgTypeStr = IMPFields.M_Type_User;
			break;
		case Dept:
			msgTypeStr = IMPFields.M_Type_Dept;
			break;
		case Group:
			msgTypeStr = IMPFields.M_Type_Group;
			break;
		case System:
			msgTypeStr = IMPFields.M_Type_Sys;
			break;
		case Radio:
			msgTypeStr = IMPFields.M_Type_Radio;
			break;
		case Receipt:
			msgTypeStr = IMPFields.M_Type_Recipt;
			break;
		case Alarm:
			msgTypeStr = IMPFields.M_Type_Alarm;
			break;
		case Platform:
			msgTypeStr = IMPFields.M_Type_Platform;
			break;
		}
		return msgTypeStr;
	}

	private static String getMediaType(MediaType mdType){
		String mediaType = "";
		switch(mdType){
		case Text:
			mediaType = IMPFields.M_MsgType_Text;
			break;
		case Image:
			mediaType = IMPFields.M_MsgType_Image;
			break;
		case Shake:
			mediaType = IMPFields.M_MsgType_Shake;
			break;
		case Emote:
			mediaType = IMPFields.M_MsgType_Emote;
			break;
		case File:
			mediaType = IMPFields.M_MsgType_File;
			break;
		case Audio:
			mediaType = IMPFields.M_MsgType_Audio;
			break;
		case Vedio:
			mediaType = IMPFields.M_MsgType_Vedio;
			break;
		case Position:
			mediaType = IMPFields.M_MsgType_Position;
			break;
		}
		return mediaType;
	}

	private static String getPlatformType(PlatType pfType){
		String platType = "";
		switch(pfType){
		case Android:
			platType = IMPFields.M_Platform_And;
			break;
		case Window:
			platType = IMPFields.M_Platform_Win;
			break;
		}
		return platType;
	}


  public static byte[] createEvent(String eventID, Map<String, Object> eventMap) throws IMPException{
    eventMap.put("NotifyType", IMPFields.N_Type_Event);
    eventMap.put("when", System.currentTimeMillis());
    eventMap.put("EventCode", eventID);
    eventMap.put("Event","");
    return ProtocolUtil.doPackage(eventMap);
  }


  private static String getReceipt(Receipt rp){
		String receipt = "";
		switch(rp){
		case False:
			receipt = IMPFields.M_Recipt_False;
			break;
		case True:
			receipt = IMPFields.M_Recipt_True;
			break;
		}
		return receipt;
	}

	private static MsgType getMsgType(String msgType){
		MsgType msgTypeStr = null;
		if(msgType.equals(IMPFields.M_Type_User)){
			msgTypeStr = MsgType.User;
		} else if(msgType.equals(IMPFields.M_Type_Dept)){
			msgTypeStr = MsgType.Dept;
		} else if(msgType.equals(IMPFields.M_Type_Group)){
			msgTypeStr = MsgType.Group;
		} else if(msgType.equals(IMPFields.M_Type_Sys)){
			msgTypeStr = MsgType.System;
		} else if(msgType.equals(IMPFields.M_Type_Radio)){
			msgTypeStr = MsgType.Radio;
		} else if(msgType.equals(IMPFields.M_Type_Recipt)){
			msgTypeStr = MsgType.Receipt;
		} else if(msgType.equals(IMPFields.M_Type_Alarm)){
			msgTypeStr = MsgType.Alarm;
		} else if(msgType.equals(IMPFields.M_Type_Platform)){
			msgTypeStr = MsgType.Platform;
		}
		return msgTypeStr;
	}

	private static MediaType getMediaType(String mdType){
		MediaType mediaType = null;
		if(mdType.equals(IMPFields.M_MsgType_Text)){
			mediaType = MediaType.Text;
		} else if(mdType.equals(IMPFields.M_MsgType_Image)){
			mediaType = MediaType.Image;
		} else if(mdType.equals(IMPFields.M_MsgType_Shake)){
			mediaType = MediaType.Shake;
		} else if(mdType.equals(IMPFields.M_MsgType_Emote)){
			mediaType = MediaType.Emote;
		} else if(mdType.equals(IMPFields.M_MsgType_File)){
			mediaType = MediaType.File;
		} else if(mdType.equals(IMPFields.M_MsgType_Audio)){
			mediaType = MediaType.Audio;
		} else if(mdType.equals(IMPFields.M_MsgType_Vedio)){
			mediaType = MediaType.Vedio;
		} else if(mdType.equals(IMPFields.M_MsgType_Position)){
			mediaType = MediaType.Position;
		}
		return mediaType;
	}

	private static PlatType getPlatformType(String pfType){
		PlatType platType = null;
		if(pfType.equals(IMPFields.M_Platform_And)){
			platType = PlatType.Android;
		} else if(pfType.equals(IMPFields.M_Platform_Win)){
			platType = PlatType.Window;
		}
		return platType;
	}

	private static Receipt getReceipt(String rp){
		Receipt receipt = null;
		if(rp.equals(IMPFields.M_Recipt_False)){
			receipt = Receipt.False;
		} else if(rp.equals(IMPFields.M_Recipt_True)){
			receipt = Receipt.True;
		}
		return receipt;
	}

	private static MsgLevel getMsgLevel(String rp){
		MsgLevel level = null;
		if(rp.equals(IMPFields.M_MsgLevel_Common)){
			level = MsgLevel.Common;
		} else if(rp.equals(IMPFields.M_MsgLevel_Level1)){
			level = MsgLevel.Level_1;
		} else if(rp.equals(IMPFields.M_MsgLevel_Level2)){
			level = MsgLevel.Level_2;
		} else if(rp.equals(IMPFields.M_MsgLevel_Level3)){
			level = MsgLevel.Level_3;
		}
		return level;
	}
	private static LinkType getLinkType(String lt){
		LinkType type = null;
		if(lt.equals(IMPFields.M_LinkType_Null)){
			type = LinkType.NoLink;
		} else if(lt.equals(IMPFields.M_LinkType_Url)){
			type = LinkType.Url;
		} else if(lt.equals(IMPFields.M_LinkType_File)){
			type = LinkType.File;
		}
		return type;
	}
}
