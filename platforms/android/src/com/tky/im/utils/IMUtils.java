package com.tky.im.utils;

import com.tky.im.connection.IMConnection;
import com.tky.mqtt.paho.BaseApplication;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.utils.SwitchLocal;
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
   * @param onoff
   * @return
   */
  public static byte[] getOnOffState(String onoff) {
    byte[] data=null;
    Map<String,Object> map=new HashMap<String, Object>();
    map.put("MepID", JPushInterface.getRegistrationID(BaseApplication.getContext()));
    map.put("UserID",getUserID());
    try {
      data=  IMMsgFactory.createEvent(onoff,map);
    } catch (IMPException e) {
      e.printStackTrace();
    }
    return data;
  }


  /**
   * 发送上线消息
   */
  public static void sendOnOffState(String str, IMConnection imConnection) {
    MqttMessage event = new MqttMessage();
    event.setPayload(IMUtils.getOnOffState(str));
    imConnection.publish(SwitchLocal.getOnOffTopic(), event, new IMqttActionListener() {
      @Override
      public void onSuccess(IMqttToken iMqttToken) {

      }

      @Override
      public void onFailure(IMqttToken iMqttToken, Throwable throwable) {

      }
    });
  }




}
