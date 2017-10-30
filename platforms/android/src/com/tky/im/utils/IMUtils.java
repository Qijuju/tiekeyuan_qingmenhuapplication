package com.tky.im.utils;

import com.google.gson.Gson;
import com.tky.im.connection.IMConnection;
import com.tky.mqtt.paho.BaseApplication;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.plugin.thrift.ThriftApiClient;
import com.tky.protocol.factory.IMMsgFactory;
import com.tky.protocol.model.IMPException;

import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import cn.jpush.android.api.JPushInterface;

/**
 * Created by tkysls on 2017/4/11.
 */

public class IMUtils {
    /**
     * 获取当前登录的用户ID
     * @return
     */
    public static String getUserID() {
        JSONObject userInfo = null;
        try {
            userInfo = getUserInfo();
            return userInfo.getString("userID");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return UUID.randomUUID().toString().toUpperCase().substring(0, 6);
    }

    /**
     * 获取用户登录信息
     * @return
     * @throws JSONException
     */
    public static JSONObject getUserInfo() throws JSONException {
        String login_info = SPUtils.getString("login_info", "");
        return new JSONObject(login_info);
    }

    /**
     * 获取上下线状态
     * @return
     */
    public static String getOnOffObject() {
        byte[] data=null;
        Map<String,Object> map=new HashMap<String, Object>();
        map.put("MepID", JPushInterface.getRegistrationID(BaseApplication.getContext()));
        map.put("UserID",getUserID());
        map.put("NotifyType","E");
        map.put("EventCode","UOF");
        map.put("when", System.currentTimeMillis());
        return new JSONObject(map).toString();
    }


  /**
   * 获取上下线状态
   * @param onoff
   * @return
   */
  public static byte[] getOnOffState(String onoff) {
    //之前的做法
//    byte[] data=null;
//    Map<String,Object> map=new HashMap<String, Object>();
//    map.put("MepID", JPushInterface.getRegistrationID(BaseApplication.getContext()));
//    map.put("UserID",getUserID());
//    try {
//      data=  IMMsgFactory.createEvent(onoff,map);
//    } catch (IMPException e) {
//      e.printStackTrace();
//    }
    byte[] data=null;
    try {
      String json=getOnOffJson(onoff);
      data = json.getBytes();
    } catch (JSONException e) {
      e.printStackTrace();
    }
    return data;
  }

  /**
   * 上下线json格式拼装抽取公共方法
   * @param state
   * @return
   */
  private static String getOnOffJson(String state) throws JSONException {
    JSONObject obj = new JSONObject();
    obj.put("NotifyType", "E");
    obj.put("UserID", IMSwitchLocal.getUserID());
    obj.put("when",System.currentTimeMillis());
    obj.put("EventCode",state);
    obj.put("MepID", UIUtils.getDeviceId());
    String json = obj.toString();
    return json;
  }

  /**
   * 发送上线/下线事件方法
   */
  public static void sendOnOffState(String state, IMConnection imConnection) {
    /**
     {"NotifyType":"E","UserID":"232277","when":1502935429550,"EventCode":"UOF","MepID":"1a1018970a931829587"}*/
    try {
      String json = getOnOffJson(state);
      MqttMessage mqttMessage = new MqttMessage();
      mqttMessage.setPayload(json.getBytes());
      imConnection.publish(IMSwitchLocal.getOnOffTopic(), mqttMessage, new IMqttActionListener() {
        @Override
        public void onSuccess(IMqttToken asyncActionToken) {
          //可以不用处理
        }

        @Override
        public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
          //失败也可以不用
        }
      });
    } catch (JSONException e) {
      e.printStackTrace();
    }

//    ThriftApiClient.sendMsg(IMSwitchLocal.getOnOffTopic(), IMUtils.getOnOffObject(), new IMqttActionListener() {
//      @Override
//      public void onSuccess(IMqttToken asyncActionToken) {
//      }
//
//      @Override
//      public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
//      }
//    });


    /*MqttMessage event = new MqttMessage();
    event.setPayload(IMUtils.getOnOffState(str));
    imConnection.publish(SwitchLocal.getOnOffTopic(), event, new IMqttActionListener() {
      @Override
      public void onSuccess(IMqttToken iMqttToken) {

      }

      @Override
      public void onFailure(IMqttToken iMqttToken, Throwable throwable) {

      }
    });*/
  }


}
