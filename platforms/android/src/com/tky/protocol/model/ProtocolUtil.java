package com.tky.protocol.model;

import com.tky.mqtt.paho.UIUtils;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProtocolUtil {

	private static ProtocolUtil config = null;

	private static Map<String, Protocol> protocolList = new HashMap<String, Protocol>();

	private final String configFile = "Protocol.xml";

	//	private final String XmlNode_Protocol = "Protocol";
//	private final String XmlNode_Node = "Node";
	private final String XmlNode_Node_Length = "nLength";
	private final String XmlNode_Node_Fixed = "nFixed";
	private final String XmlNode_Node_Type = "nType";
	private final String XmlNode_Node_Value = "nValue";

	public static ProtocolUtil getInstance(){
		if(config == null){
			config = new ProtocolUtil();
		}
		return config;
	}

	@SuppressWarnings("unchecked")
	private ProtocolUtil(){
		try {
			SAXReader  reader = new SAXReader();
			InputStream is = UIUtils.getContext().getAssets().open("Protocol.xml");
			Document doc = reader.read(is);
			Element root = doc.getRootElement();
			List<Element> protocols = root.elements();
			for (Element protl : protocols) {
				Protocol ptl = new Protocol(protl.attributeValue("id"));
				List<Element> nodes = protl.elements();
				for(Element nd : nodes){
					Element ndChild = null;
					ProtocolNode ptlNode = null;

					if((ndChild = nd.element(XmlNode_Node_Length))!=null){
						ptlNode = new ProtocolNode(nd.attributeValue("id"), Integer.parseInt(ndChild.getText().trim()));
					} else {
						ptlNode = new ProtocolNode(nd.attributeValue("id"), 0);
					}

					if((ndChild = nd.element(XmlNode_Node_Fixed))!=null){
						ptlNode.setFixed(ndChild.getTextTrim().equals("true"));
					}

					if((ndChild = nd.element(XmlNode_Node_Type))!=null){
						ptlNode.set_type(ndChild.getTextTrim());
					}

					if((ndChild = nd.element(XmlNode_Node_Value))!=null){
						ptlNode.set_values(ndChild.getTextTrim());
					}

					ptl.addNode(ptlNode);
				}
				protocolList.put(ptl.getName(), ptl);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static Map<String,Object> unPackage(byte[] notify) throws IMPException {
		if(config == null){
			config = new ProtocolUtil();
		}
		if(notify == null || notify.length == 0){
			return null;
		}
		Map<String, Object> result = new HashMap<String,Object>();
		String notifyStr = new String(notify);
		if(notifyStr.startsWith(IMPFields.N_Type_Event)){
			//解包事件
			Protocol ptl = protocolList.get(IMPFields.EventProtocol);
			Map<String,Object> eventTmp = unProtocol(notifyStr, ptl);
			String eventCode = (String)eventTmp.get(IMPFields.EventCode);
			String eventStr = (String)eventTmp.get(IMPFields.Event);

			Protocol childPtl = protocolList.get(eventCode);
			if(childPtl == null){
				throw new IMPException(IMPException.Err_Unknown, IMPFields.EventCode);
			}
			result.putAll(unProtocol(eventStr, childPtl));
			eventTmp.remove(IMPFields.Event);
			result.putAll(eventTmp);
		} else if(notifyStr.startsWith(IMPFields.N_Type_Msg)){
			//解包消息
			Protocol ptl = protocolList.get(IMPFields.MsgProtocol);

			result.putAll(unProtocol(notifyStr, ptl));

			try {
				result.put(IMPFields.Msg_message, URLDecoder.decode((String)result.get(IMPFields.Msg_message), "UTF-8"));
				result.put(IMPFields.Msg_fromName, URLDecoder.decode((String)result.get(IMPFields.Msg_fromName), "UTF-8"));
			} catch (UnsupportedEncodingException e) {
				throw new IMPException(IMPException.Err_Format, IMPFields.Msg_message);
			}

		} else {
			throw new IMPException(IMPException.Err_Unknown, IMPFields.NotifyType);
		}

		return result;
	}

	public static byte[] doPackage(Map<String,Object> sendNotify) throws IMPException{
		if(config == null){
			config = new ProtocolUtil();
		}

		try {
			sendNotify.put(IMPFields.Msg_message, URLEncoder.encode((String)sendNotify.get(IMPFields.Msg_message), "UTF-8"));
			sendNotify.put(IMPFields.Msg_fromName, URLEncoder.encode((String)sendNotify.get(IMPFields.Msg_fromName), "UTF-8"));
		} catch (UnsupportedEncodingException e) {
			throw new IMPException(IMPException.Err_Format, IMPFields.Msg_message);
		}

		String sendStr = "";
		String notifyType = "";
		if(sendNotify.get(IMPFields.NotifyType) == null)
			throw new IMPException(IMPException.Err_MissObj, IMPFields.NotifyType);
		else
			notifyType = sendNotify.get(IMPFields.NotifyType).toString();
		if(notifyType.isEmpty()){
			throw new IMPException(IMPException.Err_IsNull, IMPFields.NotifyType);
		}
		if(notifyType.equals(IMPFields.N_Type_Msg)){			//打包为消息
			Protocol ptl = protocolList.get(IMPFields.MsgProtocol);
			sendStr = doProtocol(sendNotify, ptl);
		} else if(notifyType.equals(IMPFields.N_Type_Event)){			//打包为事件
			sendNotify.put(IMPFields.Event, "");
			Protocol ptl = protocolList.get(IMPFields.EventProtocol);
			sendStr = doProtocol(sendNotify, ptl);

			String childPtlName = sendNotify.get(IMPFields.EventCode).toString();
			Protocol childPtl = protocolList.get(childPtlName);
			if(childPtl == null){
				throw new IMPException(IMPException.Err_Unknown, IMPFields.EventCode);
			}
			sendStr += doProtocol(sendNotify, childPtl);
		} else {
			throw new IMPException(IMPException.Err_Unknown, IMPFields.NotifyType);
		}
		return sendStr.getBytes();
	}

	public static String doProtocol(Map<String,Object> sendNotify, Protocol ptl) throws IMPException{
		if(config == null){
			config = new ProtocolUtil();
		}
		String sendStr = "";
		for(ProtocolNode node : ptl.getProtocolNodes()){
			String nodeValue = sendNotify.get(node.getNodeName())==null ? "" : sendNotify.get(node.getNodeName()).toString();
			int nodeLength = node.getNodeLength();
			if(nodeValue != null){
				if(nodeLength <=0){
					sendStr += nodeValue;
				} else if(node.isFixed()){
					if(nodeValue.length() != nodeLength){
						throw new IMPException(IMPException.Err_Length, node.getNodeName());
					} else if(node.get_values() != null && !node.get_values().isEmpty() &&
							!node.get_values().contains(nodeValue)){
						throw new IMPException(IMPException.Err_Unknown, IMPFields.NotifyType);
					}
					sendStr += nodeValue;
				} else {
					String valueLength = Integer.toHexString(nodeValue.length());
					if(nodeLength <=0){
						sendStr += nodeValue;
					} else if(valueLength.length() > nodeLength){
						throw new IMPException(IMPException.Err_Length, node.getNodeName());
					}else{
						valueLength = String.format("%-"+nodeLength+"s",valueLength);
						sendStr += valueLength;
						sendStr += nodeValue;
					}
				}
			} else {
				throw new IMPException(IMPException.Err_IsNull, node.getNodeName());
			}
		}
		return sendStr;
	}

	public static Map<String,Object> unProtocol(String notifyStr, Protocol ptl) throws IMPException{
		if(config == null){
			config = new ProtocolUtil();
		}
		Map<String, Object> result = new HashMap<String,Object>();
		int position = 0;
		for(ProtocolNode node : ptl.getProtocolNodes()){
			int nodeLength = node.getNodeLength();
			if(nodeLength <=0){
				result.put(node.getNodeName(), notifyStr.substring(position));
			} else if(notifyStr.length() >= position + nodeLength){
				String value = null;
				if(node.isFixed()){
					value = notifyStr.substring(position, position+nodeLength);
					if(node.get_values() != null && !node.get_values().isEmpty() &&
							!node.get_values().contains(value)){
						throw new IMPException(IMPException.Err_Unknown, IMPFields.NotifyType);
					}
					position += nodeLength;
				} else {
					int valueLength = Integer.parseInt(notifyStr.substring(position, position+nodeLength).trim(), 16);
					position += nodeLength;
					if(notifyStr.length() < position + valueLength){
						throw new IMPException(IMPException.Err_Length, node.getNodeName());
					}
					value = notifyStr.substring(position, position+valueLength);
					position += valueLength;
				}
				result.put(node.getNodeName(), convertData(value, node.get_type()));
			} else {
				throw new IMPException(IMPException.Err_Length, node.getNodeName());
			}
		}
		return result;
	}

	private static Object convertData(String data, String dataTP){
		if(dataTP.equals(IMPFields.DT_Boolean)){
			return Boolean.parseBoolean(data);
		} else if(dataTP.equals(IMPFields.DT_Int)){
			return Integer.parseInt(data.trim());
		} else if(dataTP.equals(IMPFields.DT_Long)){
			return Long.parseLong(data.trim());
		} else if(dataTP.equals(IMPFields.DT_List)){
			List<String> list = new ArrayList<String>();
			data.replace("[", "");
			data.replace("]", "");
			data.replace(" ", "");
			String[] values = data.split(",");
			for(String str : values){
				list.add(str);
			}
			return list;
		} else if(dataTP.equals(IMPFields.DT_Map)){
		}
		return data;
	}
}
