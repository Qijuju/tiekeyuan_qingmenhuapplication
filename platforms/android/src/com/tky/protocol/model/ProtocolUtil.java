package com.tky.protocol.model;

import com.tky.mqtt.paho.UIUtils;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import java.io.File;
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
	private static Map<String, Dependency> dependencyList = new HashMap<String, Dependency>();

	private final String configFile = "Protocol.xml";

	private final String XmlNode_Protocol = "Protocol";
	private final String XmlNode_Dependencies = "Dependencies";
	private final String XmlNode_Dependency = "Dependency";
	private final String XmlNode_Dependency_dProtocol = "dProtocol";
	//	private final String XmlNode_Node = "Node";
	private final String XmlNode_Node_Length = "nLength";
	private final String XmlNode_Node_Fixed = "nFixed";
	private final String XmlNode_Node_Type = "nType";
	private final String XmlNode_Node_Value = "nValue";
	private final String XmlNode_Node_Dependency = "nDependency";

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
				if(XmlNode_Protocol.equals(protl.getName())){
					initProtocol(protl);
				} else if(XmlNode_Dependencies.equals(protl.getName())){
					initDependencies(protl);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	private void initProtocol(Element protl){
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

			if((ndChild = nd.element(XmlNode_Node_Dependency))!=null){
				ptlNode.set_dependency(ndChild.getTextTrim());
			}

			ptl.addNode(ptlNode);
		}
		protocolList.put(ptl.getName(), ptl);
	}

	private void initDependencies(Element protl){
		List<Element> dependElems = protl.elements();
		for(Element dp : dependElems){
			Dependency depy = new Dependency(dp.attributeValue("id"));	//Dependency
			List<Element> childDP = dp.elements();
			for(Element child : childDP){
				if(XmlNode_Dependency_dProtocol.equals(child.getName())){
					String value = child.attributeValue("value");
					if(value == null){
						depy.setCommonObject(child.getTextTrim());
					} else if(!value.isEmpty()){
						depy.add_relation(value, child.getTextTrim());
					}
				}

			}
			dependencyList.put(depy.getName(), depy);
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
		} else {
			throw new IMPException(IMPException.Err_Unknown, IMPFields.NotifyType);
		}

		return result;
	}

	public static byte[] doPackage(Map<String,Object> sendNotify) throws IMPException{
		if(config == null){
			config = new ProtocolUtil();
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
			String nodeValue = null;
			//判断是否需要使用下一级解析
			if(node.get_dependency() != null){
				nodeValue = doDependency(sendNotify, node);
			} else {
				nodeValue = sendNotify.get(node.getNodeName())==null ? "" : sendNotify.get(node.getNodeName()).toString();
			}
			int nodeLength = node.getNodeLength();
			if(nodeValue != null){
				if(node.get_type().equals(IMPFields.DT_String_CN)){
					try {
						nodeValue = URLEncoder.encode(nodeValue, "UTF-8");
					} catch (UnsupportedEncodingException e) {
						throw new IMPException(IMPException.Err_Format, node.getNodeName());
					}
				}
				if(nodeLength <=0){
					sendStr += nodeValue;
				} else if(node.isFixed()){
					if(nodeValue.length() != nodeLength){
						throw new IMPException(IMPException.Err_Length, node.getNodeName());
					} else if(node.get_values() != null && !node.get_values().isEmpty() &&
							!node.get_values().contains(nodeValue)){
						throw new IMPException(IMPException.Err_Unknown, node.getNodeName());
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
			String value = "";
			if(nodeLength <=0){
				value = notifyStr.substring(position);
			} else if(notifyStr.length() >= position + nodeLength){
				if(node.isFixed()){
					value = notifyStr.substring(position, position+nodeLength);
					if(node.get_values() != null && !node.get_values().isEmpty() &&
							!node.get_values().contains(value)){
						throw new IMPException(IMPException.Err_Unknown, node.getNodeName());
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
			} else {
				throw new IMPException(IMPException.Err_Length, node.getNodeName());
			}

			try {
				//判断是否需要使用下一级解析
				if(node.get_dependency() != null){
					unDependency(value, node, result);
				}else{
					result.put(node.getNodeName(), convertData(value, node.get_type()));
				}
			} catch (UnsupportedEncodingException e) {
				throw new IMPException(IMPException.Err_Format, node.getNodeName());
			}
		}
		return result;
	}

	public static String doDependency(Map<String,Object> sendNotify, ProtocolNode node) throws IMPException{
		Dependency dp = dependencyList.get(node.get_dependency());	//获取依赖的协议
		if(dp == null){
			throw new IMPException(IMPException.Err_Unknown, node.getNodeName()+",Dependency not find:"+node.get_dependency());
		}
		Object dpNode = sendNotify.get(dp.getName());				//获取依赖的条件值
		if(dpNode == null){
			throw new IMPException(IMPException.Err_Unknown, node.getNodeName()+",Dependency's value not find:"+dp.getName());
		}
		String dpProtocolName = dp.getObject(dpNode.toString());	//获取该条件值对应的协议名称
		if(dpProtocolName == null || dpProtocolName.isEmpty()){
			throw new IMPException(IMPException.Err_Unknown, node.getNodeName()+",Dependency's ProtocolName not find:"+dpNode);
		}
		Protocol dpProtocol = protocolList.get(dpProtocolName);		//获取该条件值对应的协议实体
		if(dpProtocol == null){
			throw new IMPException(IMPException.Err_Unknown, node.getNodeName()+",Dependency's Protocol not find:"+dpProtocolName);
		}
		return doProtocol(sendNotify, dpProtocol);
	}

	public static void unDependency(String notifyStr, ProtocolNode node, Map<String,Object> result) throws IMPException{
		Dependency dp = dependencyList.get(node.get_dependency());	//获取依赖的协议
		if(dp == null){
			throw new IMPException(IMPException.Err_Unknown, node.getNodeName()+",Dependency not find:"+node.get_dependency());
		}
		Object dpNode = result.get(dp.getName());				//获取依赖的条件值
		if(dpNode == null){
			throw new IMPException(IMPException.Err_Unknown, node.getNodeName()+",Dependency's value not find:"+dp.getName());
		}
		String dpProtocolName = dp.getObject(dpNode.toString());	//获取该条件值对应的协议名称
		if(dpProtocolName == null || dpProtocolName.isEmpty()){
			throw new IMPException(IMPException.Err_Unknown, node.getNodeName()+",Dependency's ProtocolName not find:"+dpNode);
		}
		Protocol dpProtocol = protocolList.get(dpProtocolName);		//获取该条件值对应的协议实体
		if(dpProtocol == null){
			throw new IMPException(IMPException.Err_Unknown, node.getNodeName()+",Dependency's Protocol not find:"+dpProtocolName);
		}
		result.putAll(unProtocol(notifyStr, dpProtocol));
	}

	private static Object convertData(String data, String dataTP) throws UnsupportedEncodingException{
		if(dataTP.equals(IMPFields.DT_Boolean)){
			return Boolean.parseBoolean(data);
		} else if(dataTP.equals(IMPFields.DT_Int)){
			return Integer.parseInt(data.trim());
		} else if(dataTP.equals(IMPFields.DT_Long)){
			return Long.parseLong(data.trim());
		} else if(dataTP.equals(IMPFields.DT_List)){
			List<String> list = new ArrayList<String>();
			String[] values = data.replace("[", "").replace("]", "").replace(" ", "").split(",");
			for(String str : values){
				list.add(str);
			}
			return list;
		} else if(dataTP.equals(IMPFields.DT_Map)){

		} else if(dataTP.equals(IMPFields.DT_String_CN)){
			return URLDecoder.decode(data, "UTF-8");
		}
		return data;
	}

	public static void main(String[] args) {
		ProtocolUtil.getInstance();
	}
}
